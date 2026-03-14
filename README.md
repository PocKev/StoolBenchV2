# StoolBenchV2

## Overview

Scalable docker containerized app for StoolBench statistics. StoolBench is a service that tracks individual stool statistics

@pockev

## How to run

### Locally

```
docker compose up

docker compose down
```

Access the site http://localhost:5173/

Wipe the memory (clear volumes)

```
docker compose down -v
```

Connect to appdb

- Host: localhost
- Port: 5432
- Database: appdb
- User: appuser
- Password: apppass

Create a migration:
```
docker compose exec bench-processor python -m alembic -c alembic.ini revision --autogenerate -m "migration name"
```
Check alembic/versions newly created migration, then apply migration:
```
docker compose exec bench-processor python -m alembic -c alembic.ini upgrade head
```

## Tests

Run backend tests inside the Docker container:

```bash
docker compose run --rm --no-deps bench-processor python -m pytest -q tests
```

If you want to run tests against the latest image rebuild:

```bash
docker compose run --rm --no-deps --build bench-processor python -m pytest -q tests
```
