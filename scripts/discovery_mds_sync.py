#!/usr/bin/env python3
"""Backup and publish discovery metadata for dev or prod MDS."""

from __future__ import annotations

import argparse
import asyncio
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import TYPE_CHECKING, Any
from urllib.parse import urlparse

import requests

if TYPE_CHECKING:
    from gen3.auth import Gen3Auth
    from gen3.metadata import Gen3Metadata

try:
    from gen3.auth import Gen3Auth
    from gen3.metadata import Gen3Metadata
    from gen3.tools.metadata.discovery import output_expanded_discovery_metadata
except ImportError as import_error:
    Gen3Auth = Any  # type: ignore[assignment]
    Gen3Metadata = Any  # type: ignore[assignment]
    output_expanded_discovery_metadata = None
    IMPORT_ERROR: Exception | None = import_error
else:
    IMPORT_ERROR = None


ENVIRONMENT_APIS = {
    "dev": "https://dev-virtuallab.themmrf.org/",
    "prod": "https://virtuallab.themmrf.org/",
}
DEFAULT_GUID_TYPE = "discovery_metadata"
DEFAULT_GUID_FIELD = "_hdp_uid"
MAX_GUIDS_PER_QUERY = 2000
REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_RECORDS_FILE = REPO_ROOT / "config" / "gen3" / "discovery.mds.seed.json"
DEFAULT_BACKUP_DIR = REPO_ROOT / "backups" / "mds" / "discovery"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Backup and publish Gen3 discovery metadata."
    )
    parser.add_argument(
        "--mode",
        choices=("backup", "publish", "both"),
        default="both",
        help="Choose backup only, publish only, or both (default).",
    )
    parser.add_argument(
        "--environment",
        choices=("dev", "prod"),
        default="dev",
        help="Target environment used to pick default --api (default: dev).",
    )
    parser.add_argument(
        "--api",
        default=None,
        help="Gen3 commons URL. Overrides --environment default when provided.",
    )
    parser.add_argument(
        "--credentials",
        required=True,
        help="Path to Gen3 credentials.json refresh token file.",
    )
    parser.add_argument(
        "--records-file",
        default=str(DEFAULT_RECORDS_FILE),
        help="JSON file containing discovery records to publish.",
    )
    parser.add_argument(
        "--guid-type",
        default=DEFAULT_GUID_TYPE,
        help="Value to write to metadata _guid_type.",
    )
    parser.add_argument(
        "--guid-field",
        default=DEFAULT_GUID_FIELD,
        help="Field in each discovery record used as MDS GUID.",
    )
    parser.add_argument(
        "--backup-dir",
        default=str(DEFAULT_BACKUP_DIR),
        help="Directory for timestamped backup files.",
    )
    parser.add_argument(
        "--backup-limit",
        type=int,
        default=10000,
        help="Max discovery records to read while backing up.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview publish payloads without writing to MDS.",
    )
    return parser.parse_args()


def load_records(records_path: Path, guid_field: str) -> list[dict[str, Any]]:
    if not records_path.exists():
        raise FileNotFoundError(f"Records file not found: {records_path}")

    with records_path.open("r", encoding="utf-8") as file_handle:
        payload = json.load(file_handle)

    if not isinstance(payload, list):
        raise ValueError("Records file must contain a JSON array of objects.")

    for index, record in enumerate(payload, start=1):
        if not isinstance(record, dict):
            raise ValueError(f"Record #{index} is not a JSON object.")
        if guid_field not in record or not str(record[guid_field]).strip():
            raise ValueError(
                f"Record #{index} missing required GUID field '{guid_field}'."
            )

    return payload


async def _create_backup_file(
    auth: Gen3Auth,
    endpoint: str,
    guid_type: str,
    output_format: str,
    suffix: str,
    limit: int,
) -> str:
    return await output_expanded_discovery_metadata(
        auth=auth,
        endpoint=endpoint,
        limit=limit,
        guid_type=guid_type,
        output_format=output_format,
        output_filename_suffix=suffix,
    )


def _create_json_backup_fallback(
    auth: Gen3Auth,
    endpoint: str,
    guid_type: str,
    suffix: str,
    limit: int,
) -> str:
    mds = Gen3Metadata(auth_provider=auth, endpoint=endpoint)
    output_filename = (
        "-".join(urlparse(auth.endpoint).netloc.split("."))
        + f"-{guid_type}"
        + (f"-{suffix}" if suffix else "")
        + ".json"
    )
    output_metadata: list[dict[str, Any]] = []

    for offset in range(0, limit, MAX_GUIDS_PER_QUERY):
        query_limit = min(limit - offset, MAX_GUIDS_PER_QUERY)
        partial_metadata = mds.query(
            f"_guid_type={guid_type}",
            return_full_metadata=True,
            limit=query_limit,
            offset=offset,
        )
        if not partial_metadata:
            break
        for guid, metadata in partial_metadata.items():
            output_metadata.append({"guid": guid, **metadata})

    with open(output_filename, "w", encoding="utf-8") as output_file:
        json.dump(output_metadata, output_file, indent=4)
    return output_filename


def backup_discovery_metadata(
    auth: Gen3Auth,
    endpoint: str,
    guid_type: str,
    backup_dir: Path,
    limit: int,
) -> list[Path]:
    backup_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    backup_suffix = f"backup-{timestamp}"
    backup_files: list[Path] = []

    for output_format in ("json", "tsv"):
        created_filename = asyncio.run(
            _create_backup_file(
                auth=auth,
                endpoint=endpoint,
                guid_type=guid_type,
                output_format=output_format,
                suffix=backup_suffix,
                limit=limit,
            )
        )
        if output_format == "json":
            created_path = Path(created_filename).resolve()
            try:
                with created_path.open("r", encoding="utf-8") as file_handle:
                    parsed = json.load(file_handle)
            except json.JSONDecodeError:
                parsed = None
            if parsed == []:
                print(
                    "WARNING: gen3 JSON backup export returned an empty list; "
                    "using fallback MDS query export."
                )
                created_filename = _create_json_backup_fallback(
                    auth=auth,
                    endpoint=endpoint,
                    guid_type=guid_type,
                    suffix=backup_suffix,
                    limit=limit,
                )
        created_path = Path(created_filename).resolve()
        destination = backup_dir / created_path.name
        created_path.replace(destination)
        backup_files.append(destination)

    return backup_files


def publish_discovery_metadata(
    auth: Gen3Auth,
    endpoint: str,
    records: list[dict[str, Any]],
    guid_type: str,
    guid_field: str,
    dry_run: bool,
) -> int:
    published_count = 0
    for record in records:
        guid = str(record[guid_field]).strip()
        payload = {"_guid_type": guid_type, "gen3_discovery": record}
        publish_url = f"{endpoint.rstrip('/')}/mds/metadata/{guid}?overwrite=True"
        if dry_run:
            print(f"[DRY-RUN] would publish GUID '{guid}' to {publish_url}")
            continue

        response = requests.post(
            publish_url,
            json=payload,
            auth=auth,
            timeout=60,
        )
        response.raise_for_status()
        published_count += 1
        print(f"Published GUID '{guid}'")

    return published_count


def main() -> int:
    args = parse_args()

    if IMPORT_ERROR is not None:
        raise RuntimeError(
            "Missing dependency 'gen3'. Install it first with: pip install gen3"
        ) from IMPORT_ERROR

    credentials_path = Path(args.credentials).expanduser().resolve()
    if not credentials_path.exists():
        raise FileNotFoundError(f"Credentials file not found: {credentials_path}")

    records_path = Path(args.records_file).expanduser().resolve()
    backup_dir = Path(args.backup_dir).expanduser().resolve()

    api_url = args.api or ENVIRONMENT_APIS[args.environment]
    auth = Gen3Auth(api_url, refresh_file=str(credentials_path))
    if args.mode in ("backup", "both"):
        backup_paths = backup_discovery_metadata(
            auth=auth,
            endpoint=api_url,
            guid_type=args.guid_type,
            backup_dir=backup_dir,
            limit=args.backup_limit,
        )
        print("Backup files created:")
        for backup_path in backup_paths:
            print(f"  - {backup_path}")

    if args.mode in ("publish", "both"):
        records = load_records(records_path, args.guid_field)
        print(
            f"{'Dry run:' if args.dry_run else 'Publishing'} "
            f"{len(records)} discovery record(s) from {records_path}"
        )
        published_count = publish_discovery_metadata(
            auth=auth,
            endpoint=api_url,
            records=records,
            guid_type=args.guid_type,
            guid_field=args.guid_field,
            dry_run=args.dry_run,
        )
        if args.dry_run:
            print("Dry-run complete: no records were written.")
        else:
            print(f"Publish complete: {published_count} record(s) written.")

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise
