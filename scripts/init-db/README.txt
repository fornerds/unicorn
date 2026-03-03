스키마 1개(01-schema.sql), 데이터만 dev/prod 구분.
- 02-data.sql → 02-data-dev.sql 링크 (기본, dev)
- prod 사용 시: ln -sf 02-data-prod.sql 02-data.sql 후 docker compose
