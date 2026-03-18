# Indexd Manifest Generation Runbook

This runbook generates an indexd-ready TSV manifest directly from a list of S3 object URIs.

## Prerequisites

- Python 3.9+ available locally
- AWS CLI installed and authenticated for the source bucket
- Read access to objects listed in the input file

Optional:

- AWS profile configured locally if using `--profile`

## Script

Manifest generator:

- `scripts/indexd_manifest_from_s3.py`

## Input Format

Provide a text file with one S3 URI per line:

- `s3://bucket-name/path/to/file1.ext`
- `s3://bucket-name/path/to/file2.ext`

Example input file:

- `indexd/new_s3_files.txt`

Important behavior:

- The script fails fast on malformed input lines (for example `3://...`).
- If your file has a header row, use `--skip-header`.

## Output Format

The output TSV header is:

- `guid	file_name	md5	size	acl	authz	urls`

Field behavior:

- `guid`: always blank
- `file_name`: derived from S3 object key basename
- `md5`: true content MD5 computed by streaming object bytes
- `size`: S3 `ContentLength`
- `acl`: always `*`
- `authz`: required CLI argument (project-specific)
- `urls`: original S3 URI from input

## Generate a Manifest

```bash
python3 scripts/indexd_manifest_from_s3.py \
  --input indexd/new_s3_files.txt \
  --output indexd/discovery_index_manifest.tsv \
  --authz /programs/MMRF/projects/DISCOVERY
```

## Useful Options

- `--workers <int>`: parallel S3 fetch workers (default: `4`)
- `--profile <name>`: AWS profile override
- `--region <name>`: AWS region override
- `--skip-header`: skip first non-empty line in input

Example with options:

```bash
python3 scripts/indexd_manifest_from_s3.py \
  --input indexd/new_s3_files.txt \
  --output indexd/discovery_index_manifest.tsv \
  --authz /programs/MMRF/projects/DISCOVERY \
  --profile default \
  --region us-east-1 \
  --workers 8
```

## Failure Modes

The script exits non-zero and prints an error when:

- An input line is not a valid `s3://bucket/key` URI
- An object cannot be read with `head-object`
- Object streaming fails during MD5 calculation

No partial/invalid output should be trusted when a run fails.
