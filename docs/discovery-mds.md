# Discovery MDS Migration Runbook

This runbook backs up, publishes, and deletes discovery entries in dev or prod MDS using the upstream Gen3 SDK.

## Prerequisites

- Python 3.9+ available locally
- Python dependencies installed:

```bash
pip install gen3 requests
```

- Valid credentials files (refresh token JSON) in the repo root: `credentials.json` for dev and `prod_credentials.json` for prod
- Account permission to write through `mds` (without this, publish returns `403 Forbidden`)

## Source Data

Discovery records are stored in:

- `config/gen3/discovery.mds.dev.json` for dev
- `config/gen3/discovery.mds.prod.json` for prod

Each record is published under:

- `_guid_type = discovery_metadata`
- `gen3_discovery` metadata block
- GUID field `_hdp_uid`

## Environment Selection

The script now supports `--environment`:

- `dev` (default): `https://dev-virtuallab.themmrf.org/`
- `prod`: `https://virtuallab.themmrf.org/`

You can still override this with `--api`.

## 1) Backup Current Discovery MDS

Dev:

```bash
python3 scripts/discovery_mds_sync.py \
  --environment dev \
  --mode backup \
  --credentials "credentials.json"
```

Prod:

```bash
python3 scripts/discovery_mds_sync.py \
  --environment prod \
  --mode backup \
  --credentials "prod_credentials.json"
```

Backup files are written to:

- `backups/mds/discovery/`

## 2) Preview Publish (Dry Run)

Dev:

```bash
python3 scripts/discovery_mds_sync.py \
  --environment dev \
  --mode publish \
  --dry-run \
  --credentials "credentials.json" \
  --records-file "config/gen3/discovery.mds.dev.json"
```

Prod:

```bash
python3 scripts/discovery_mds_sync.py \
  --environment prod \
  --mode publish \
  --dry-run \
  --credentials "prod_credentials.json" \
  --records-file "config/gen3/discovery.mds.prod.json"
```

## 3) Publish Discovery Records

Dev:

```bash
python3 scripts/discovery_mds_sync.py \
  --environment dev \
  --mode both \
  --credentials "credentials.json" \
  --records-file "config/gen3/discovery.mds.dev.json"
```

Prod:

```bash
python3 scripts/discovery_mds_sync.py \
  --environment prod \
  --mode both \
  --credentials "prod_credentials.json" \
  --records-file "config/gen3/discovery.mds.prod.json"
```

`--mode both` performs backup first, then publishes.

## 4) Delete Discovery Records

Use delete mode to remove stale GUIDs that are no longer present in the seed file. Provide one or more `--delete-guid` values.

Preview a delete:

```bash
python3 scripts/discovery_mds_sync.py \
  --environment dev \
  --mode delete \
  --dry-run \
  --credentials "credentials.json" \
  --delete-guid "NCT01454297"
```

Delete from dev:

```bash
python3 scripts/discovery_mds_sync.py \
  --environment dev \
  --mode delete \
  --credentials "credentials.json" \
  --delete-guid "NCT01454297"
```

Delete from prod:

```bash
python3 scripts/discovery_mds_sync.py \
  --environment prod \
  --mode delete \
  --credentials "prod_credentials.json" \
  --delete-guid "NCT01454297"
```

Repeat `--delete-guid` to remove multiple records in one run.

## 5) Verify Records in MDS

Dev:

- `https://dev-virtuallab.themmrf.org/mds/metadata/s41588-024-01853-0`
- `https://dev-virtuallab.themmrf.org/mds/metadata/s43018-025-01072-4`

Prod:

- `https://virtuallab.themmrf.org/mds/metadata/s41588-024-01853-0`
- `https://virtuallab.themmrf.org/mds/metadata/s43018-025-01072-4`
