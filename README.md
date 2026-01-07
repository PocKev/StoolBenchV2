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
