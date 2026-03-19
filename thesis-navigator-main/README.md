# Thesis Navigator

This app uses a local Supabase stack plus the `thesinator-chat` Edge Function.

## Prerequisites

- Node.js 20+
- npm
- Docker Desktop (running)
- Supabase CLI

## Local environment setup

From the workspace root (`/Users/emirkan/StartHack/STARTHack`):

1. Configure environment files:
   - `supabase/.env`
   - `thesis-navigator-main/.env`
2. Install frontend dependencies:

```bash
cd thesis-navigator-main
npm install
```

## Run locally

1. Start local Supabase services (from workspace root):

```bash
supabase start
supabase status
supabase db reset
```

2. Serve the chat Edge Function (from workspace root):

```bash
supabase functions serve thesinator-chat --env-file supabase/.env --no-verify-jwt
```

3. In a second terminal, run the frontend:

```bash
cd thesis-navigator-main
npm run dev
```

4. Optional smoke test for the function:

```bash
curl -sS -X POST http://127.0.0.1:54321/functions/v1/thesinator-chat \
  -H 'Content-Type: application/json' \
  -d '{"action":"start"}'
```

## Build and test

```bash
cd thesis-navigator-main
npm run build
npm run test
```

## After schema changes

If you change Supabase migrations/functions/schema, regenerate local state and TypeScript types from workspace root:

```bash
supabase db reset
supabase migration list --local
supabase gen types typescript --local > supabase/types/database.types.ts
```
