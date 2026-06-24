# Backend API (FastAPI + Postgres)

## Avvio
L'applicazione usa un database Postgres esterno (host `rrtgn-sis-pg01-s01.rtpc.sct.toscana.it`, IP `10.157.64.22`, porta `5432`).

```bash
DB_HOST=rrtgn-sis-pg01-s01.rtpc.sct.toscana.it \
DB_PORT=5432 \
DB_NAME=bando-fse-privati-db \
DB_USER=bando-fse-privati-db_rw \
DB_PASSWORD=5SQp1k5cX4T2 \
docker compose up -d --build
```

- Docs: http://localhost:8000/docs
- Health: `/healthz`
- Readiness (DB check): `/readyz`

## URL e routing
- Backend: l'API è consumata dal frontend tramite `backendUrl`/`apiPath` (configurabili) con default `https://bando-fse-privati-5146.k8s-san-s01.rtpc.sct.toscana.it`.
- Frontend: l'applicazione è esposta su `https://gestionefseprivati.sanita.toscana.it` e usa la rotta `/callback` per il rientro OAuth.
- Config FE: i parametri runtime (backendUrl, apiPath, redirectUri) vengono letti da `/config/config.json`.
  
## Autenticazione
Tutte le route di `/data` richiedono l'header `X-Access-Level` con valore `reader`, `editor` o `admin`.

## Endpoints principali
- `GET /data` (reader/editor/admin) - lista con `limit` e `offset`.
- `POST /data` (admin) - crea un item con i campi anagrafici obbligatori.
- `GET /data/{item_id}` (reader/editor/admin) - dettaglio per ID.
- `PUT /data/{partita_iva}` (editor/admin) - aggiornamento parziale della prima riga trovata con `Anagrafica_partitaIva`.
- `DELETE /data/by-id/{item_id}` (admin) - elimina una riga usando l'ID della riga.
- `DELETE /data/{partita_iva}` (admin) - elimina la prima riga trovata con `Anagrafica_partitaIva`.
- `GET /data/export-csv` (reader/editor/admin) - esporta tutte le righe in CSV.
- `POST /data/import-csv` (admin) - inserisce righe da CSV.
- `POST /data/update-from-csv` (admin) - aggiorna righe da CSV usando `Anagrafica_partitaIva`.
