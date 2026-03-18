# Discovery MDS Migration Runbook

This runbook publishes discovery entries to either dev or prod MDS using the upstream Gen3 SDK.

## Prerequisites

- Python 3.9+ available locally
- Gen3 SDK installed:

```bash
pip install gen3
```

- A valid credentials file (refresh token JSON), for example `credentials.json`
- Account permission to write through `mds` (without this, publish returns `403 Forbidden`)

## Source Data

Discovery records are stored in:

- `config/gen3/discovery.mds.seed.json`

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
  --credentials "credentials.json"
```

Backup files are written to:

- `backups/mds/discovery/`

## 2) Preview Publish (Dry Run)

```bash
python3 scripts/discovery_mds_sync.py \
  --environment dev \
  --mode publish \
  --dry-run \
  --credentials "credentials.json" \
  --records-file "config/gen3/discovery.mds.seed.json"
```

## 3) Publish Discovery Records

Dev:

```bash
python3 scripts/discovery_mds_sync.py \
  --environment dev \
  --mode both \
  --credentials "credentials.json" \
  --records-file "config/gen3/discovery.mds.seed.json"
```

Prod:

```bash
python3 scripts/discovery_mds_sync.py \
  --environment prod \
  --mode both \
  --credentials "credentials.json" \
  --records-file "config/gen3/discovery.mds.seed.json"
```

`--mode both` performs backup first, then publishes.

## 4) Verify Records in MDS

Dev:

- `https://dev-virtuallab.themmrf.org/mds/metadata/NCT01454297`
- `https://dev-virtuallab.themmrf.org/mds/metadata/s43018-025-01072-4`

Prod:

- `https://virtuallab.themmrf.org/mds/metadata/NCT01454297`
- `https://virtuallab.themmrf.org/mds/metadata/s43018-025-01072-4`
