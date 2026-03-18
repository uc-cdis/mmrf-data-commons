#!/usr/bin/env python3
"""Generate an indexd manifest TSV directly from S3 URIs."""

from __future__ import annotations

import argparse
import csv
import hashlib
import subprocess
import sys
from concurrent.futures import FIRST_EXCEPTION, ThreadPoolExecutor, wait
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlparse

MANIFEST_COLUMNS = ("guid", "file_name", "md5", "size", "acl", "authz", "urls")
DEFAULT_ACL = "*"
DEFAULT_WORKERS = 4
READ_CHUNK_SIZE_BYTES = 8 * 1024 * 1024


class ManifestError(Exception):
    """Raised for invalid input or failed manifest generation."""


@dataclass(frozen=True)
class S3ObjectRef:
    line_number: int
    uri: str
    bucket: str
    key: str


@dataclass(frozen=True)
class ManifestRow:
    guid: str
    file_name: str
    md5: str
    size: int
    acl: str
    authz: str
    urls: str

    def to_tsv_row(self) -> tuple[str, str, str, str, str, str, str]:
        return (
            self.guid,
            self.file_name,
            self.md5,
            str(self.size),
            self.acl,
            self.authz,
            self.urls,
        )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Build an indexd manifest TSV from a file containing one S3 URI per line."
        )
    )
    parser.add_argument(
        "--input",
        required=True,
        help="Path to text file containing one S3 URI per line.",
    )
    parser.add_argument(
        "--output",
        required=True,
        help="Path where the manifest TSV will be written.",
    )
    parser.add_argument(
        "--authz",
        required=True,
        help="Authz value for every row, e.g. /programs/MMRF/projects/DISCOVERY.",
    )
    parser.add_argument(
        "--profile",
        default=None,
        help="Optional AWS profile name.",
    )
    parser.add_argument(
        "--region",
        default=None,
        help="Optional AWS region override.",
    )
    parser.add_argument(
        "--workers",
        type=int,
        default=DEFAULT_WORKERS,
        help=f"Parallel workers for S3 metadata/MD5 fetch (default: {DEFAULT_WORKERS}).",
    )
    parser.add_argument(
        "--skip-header",
        action="store_true",
        help="Skip the first non-empty input line if it is a header.",
    )
    return parser.parse_args()


def _aws_base_command(profile: str | None, region: str | None) -> list[str]:
    command: list[str] = ["aws"]
    if profile:
        command.extend(["--profile", profile])
    if region:
        command.extend(["--region", region])
    return command


def _parse_s3_uri(line: str, line_number: int) -> S3ObjectRef:
    parsed = urlparse(line)
    if parsed.scheme != "s3" or not parsed.netloc or not parsed.path:
        raise ManifestError(
            f"Malformed S3 URI at line {line_number}: {line!r}. "
            "Expected format: s3://bucket/key"
        )

    key = parsed.path.lstrip("/")
    if not key:
        raise ManifestError(
            f"Malformed S3 URI at line {line_number}: {line!r}. "
            "Missing object key."
        )

    uri = f"s3://{parsed.netloc}/{key}"
    return S3ObjectRef(line_number=line_number, uri=uri, bucket=parsed.netloc, key=key)


def load_s3_objects(input_path: Path, skip_header: bool) -> list[S3ObjectRef]:
    if not input_path.exists():
        raise ManifestError(f"Input file not found: {input_path}")

    objects: list[S3ObjectRef] = []
    skipped_header = False

    with input_path.open("r", encoding="utf-8") as handle:
        for line_number, raw_line in enumerate(handle, start=1):
            line = raw_line.strip()
            if not line:
                continue
            if skip_header and not skipped_header:
                skipped_header = True
                continue
            objects.append(_parse_s3_uri(line=line, line_number=line_number))

    if not objects:
        raise ManifestError(f"No S3 URIs found in input file: {input_path}")

    return objects


def fetch_size_bytes(
    obj: S3ObjectRef, profile: str | None, region: str | None
) -> int:
    command = _aws_base_command(profile=profile, region=region)
    command.extend(
        [
            "s3api",
            "head-object",
            "--bucket",
            obj.bucket,
            "--key",
            obj.key,
            "--query",
            "ContentLength",
            "--output",
            "text",
        ]
    )
    result = subprocess.run(
        command,
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        stderr = result.stderr.strip() or "No stderr output."
        raise ManifestError(
            f"Failed to fetch size for line {obj.line_number} ({obj.uri}): {stderr}"
        )
    size_text = result.stdout.strip()
    try:
        return int(size_text)
    except ValueError as error:
        raise ManifestError(
            f"Unexpected ContentLength for line {obj.line_number} ({obj.uri}): "
            f"{size_text!r}"
        ) from error


def stream_md5_hex(
    obj: S3ObjectRef, profile: str | None, region: str | None
) -> str:
    command = _aws_base_command(profile=profile, region=region)
    command.extend(["s3", "cp", obj.uri, "-"])

    process = subprocess.Popen(
        command,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    if process.stdout is None or process.stderr is None:
        raise ManifestError(f"Failed to start MD5 stream for {obj.uri}")

    md5_hash = hashlib.md5()
    while True:
        chunk = process.stdout.read(READ_CHUNK_SIZE_BYTES)
        if not chunk:
            break
        md5_hash.update(chunk)

    _, stderr_bytes = process.communicate()
    if process.returncode != 0:
        stderr = stderr_bytes.decode("utf-8", errors="replace").strip()
        raise ManifestError(
            f"Failed to stream object for line {obj.line_number} ({obj.uri}): "
            f"{stderr or 'No stderr output.'}"
        )
    return md5_hash.hexdigest()


def build_row(
    obj: S3ObjectRef,
    authz: str,
    profile: str | None,
    region: str | None,
) -> ManifestRow:
    file_name = Path(obj.key).name
    if not file_name:
        raise ManifestError(
            f"Could not derive file_name from S3 key at line {obj.line_number}: {obj.key!r}"
        )

    size = fetch_size_bytes(obj=obj, profile=profile, region=region)
    md5 = stream_md5_hex(obj=obj, profile=profile, region=region)
    return ManifestRow(
        guid="",
        file_name=file_name,
        md5=md5,
        size=size,
        acl=DEFAULT_ACL,
        authz=authz,
        urls=obj.uri,
    )


def build_rows(
    objects: list[S3ObjectRef],
    authz: str,
    profile: str | None,
    region: str | None,
    workers: int,
) -> list[ManifestRow]:
    if workers < 1:
        raise ManifestError("--workers must be >= 1")

    if workers == 1:
        return [
            build_row(obj=obj, authz=authz, profile=profile, region=region)
            for obj in objects
        ]

    ordered_rows: list[ManifestRow | None] = [None] * len(objects)
    with ThreadPoolExecutor(max_workers=workers) as executor:
        future_to_index = {
            executor.submit(
                build_row, obj=obj, authz=authz, profile=profile, region=region
            ): index
            for index, obj in enumerate(objects)
        }
        done, not_done = wait(future_to_index, return_when=FIRST_EXCEPTION)
        first_exception: BaseException | None = None
        for future in done:
            if future.exception() is not None:
                first_exception = future.exception()
                break

        if first_exception is not None:
            for pending in not_done:
                pending.cancel()
            raise first_exception

        for future, index in future_to_index.items():
            ordered_rows[index] = future.result()

    return [row for row in ordered_rows if row is not None]


def write_manifest(output_path: Path, rows: list[ManifestRow]) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with output_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.writer(handle, delimiter="\t", lineterminator="\n")
        writer.writerow(MANIFEST_COLUMNS)
        for row in rows:
            writer.writerow(row.to_tsv_row())


def main() -> int:
    args = parse_args()
    input_path = Path(args.input).expanduser()
    output_path = Path(args.output).expanduser()

    try:
        objects = load_s3_objects(input_path=input_path, skip_header=args.skip_header)
        rows = build_rows(
            objects=objects,
            authz=args.authz,
            profile=args.profile,
            region=args.region,
            workers=args.workers,
        )
        write_manifest(output_path=output_path, rows=rows)
    except ManifestError as error:
        print(f"ERROR: {error}", file=sys.stderr)
        return 1
    except Exception as error:  # pragma: no cover - defensive catch
        print(f"ERROR: Unexpected failure: {error}", file=sys.stderr)
        return 1

    print(f"Wrote {len(rows)} manifest rows to {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
