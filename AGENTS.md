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

### Local Services
Run from repository root:
```bash
supabase start
supabase status
supabase db reset
supabase functions serve thesinator-chat --env-file supabase/.env --no-verify-jwt
```

Run frontend:
```bash
cd thesis-navigator-main
npm run dev
```

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
Use after seeding or topic updates:
```bash
deno run --allow-net --allow-env scripts/embed-seed.ts
```

### Thesinator Smoke Test (Local)
```bash
curl -sS -X POST http://127.0.0.1:54321/functions/v1/thesinator-chat \
  -H 'Content-Type: application/json' \
  -d '{"action":"start"}'
```

### Key Thesis Matching Files
- `supabase/functions/thesinator-chat/index.ts`
- `supabase/migrations/20260319112000_add_catalog_vectors_and_matching.sql`
- `supabase/migrations/20260319153000_harden_topic_matching_relaxation.sql`
- `thesis-navigator-main/src/components/ThesisFinder.tsx`
- `thesis-navigator-main/src/services/thesinator.ts`
