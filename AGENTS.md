# STARTHack Workspace Guide

This repository is a multi-project workspace. Keep edits scoped to the requested project.

## Project Locations
- `MiroFish/`: Multi-agent prediction engine.
- `thesis-navigator-main/`: Thesis Navigator frontend (Vite + React).
- `supabase/`: Local Supabase config, migrations, edge functions, and seed.

## Working Rules
- Avoid cross-project dependency/config edits unless explicitly requested.
- Use project-local env files:
  - `supabase/.env`
  - `thesis-navigator-main/.env`
- Never commit secrets or API keys.

## MiroFish Notes
- If task is MiroFish-specific, run commands from `MiroFish/`.
- Legacy canonical local path used previously: `/Users/julius/Desktop/Repos/STARTHack/MiroFish`.

## Thesis Navigator + Supabase Runbook

### Current Product Shape
- `thesis-navigator-main/` is the only student-facing UI.
- The current Studyond flow is `Discover -> See your future -> Explore theses -> Detail`.
- The discover step is a 3-question click-through wizard, not a transcript-style chat log.
- The `See your future` step now shows the raw live MiroFish/Zep event feed plus the mini graph preview.
- MiroFish now acts as a hidden backend engine via `MiroFish/backend/app/api/studyond.py`; its Vue frontend is legacy/debug only for this workspace.
- Session-level graph polling now lives at `GET /functions/v1/future-sessions/:future_session_id/graph`.

### One-Command Startup
Run from repository root:
```bash
./start_all.sh
```

What it does now:
- starts/restarts local Supabase
- fully rebuilds and reseeds the local database with `supabase db reset --local --workdir . --yes`
- waits for LiteLLM and the hidden MiroFish backend health endpoints before exposing the frontend
- starts the hidden MiroFish backend with `FLASK_DEBUG=False` to avoid the Flask reloader restart race
- exports `MIROFISH_API_URL=http://host.docker.internal:5001` into the edge-function runtime
- reads `MIROFISH_API_KEY` from `MiroFish/.env` only if present; local dev does not require it
- starts edge functions, LiteLLM proxy, hidden MiroFish backend, and the thesis frontend

### Local Services
Run from repository root:
```bash
supabase start
supabase status
supabase db reset
MIROFISH_API_URL=http://host.docker.internal:5001 supabase functions serve --workdir . --env-file supabase/.env --no-verify-jwt
```

Run frontend:
```bash
cd thesis-navigator-main
npm run dev
```

### Local Futures Troubleshooting
- The Supabase edge runtime runs inside Docker. From the edge runtime, `127.0.0.1` points to the container itself, not the host Mac.
- Use `http://127.0.0.1:5001` from the host shell/browser, but use `http://host.docker.internal:5001` for `MIROFISH_API_URL` inside edge functions.
- If `See your future` fails with `tcp connect error: Connection refused`, first suspect a wrong `MIROFISH_API_URL` or the MiroFish backend not being healthy yet.
- `future_sessions.graph_status` persists failures. After fixing a local backend/network issue, restart from `Discover` to create a fresh future session instead of reusing the already-failed one.

### Build/Test
```bash
cd thesis-navigator-main
npm run build
npm run test
```

### Schema + Types Workflow
After changing migrations/functions/schema:
```bash
supabase db reset
supabase migration list --local
supabase gen types typescript --local > supabase/types/database.types.ts
```

### Embeddings Backfill
Use after seeding or topic updates. Keep local script vars in `supabase/.env` as `LOCAL_SUPABASE_URL` and `LOCAL_SUPABASE_SERVICE_ROLE_KEY` (not `SUPABASE_*`, which are reserved by the Edge runtime):
```bash
set -a; source supabase/.env; set +a
npx -y deno run --allow-net --allow-env scripts/embed-seed.ts
```

### Vector Health Check
```bash
docker exec supabase_db_starthack psql -U postgres -d postgres -c "select * from public.get_thesinator_vector_health();"
```

### Thesinator Smoke Test (Local)
```bash
curl -sS -X POST http://127.0.0.1:54321/functions/v1/thesinator-chat \
  -H 'Content-Type: application/json' \
  -d '{"action":"start"}'
```

### Key Thesis Matching Files
- `supabase/functions/thesinator-chat/index.ts`
- `supabase/functions/future-sessions/index.ts`
- `supabase/migrations/20260319112000_add_catalog_vectors_and_matching.sql`
- `supabase/migrations/20260319121235_create_future_sessions.sql`
- `supabase/migrations/20260319153000_harden_topic_matching_relaxation.sql`
- `thesis-navigator-main/src/components/ThesisFinder.tsx`
- `thesis-navigator-main/src/services/futureSessions.ts`
- `thesis-navigator-main/src/services/thesinator.ts`
