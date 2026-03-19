# ARCHITECTURE.md
## studyond — Fullstack Architecture (React + Supabase)

---

## 1. System Overview

studyond is a fullstack thesis-discovery platform.

Core responsibilities:
- React web app for guided discovery, ranking review, and scenario exploration
- Supabase backend for persistent data, file storage, realtime updates, and server-side workflows
- Background job execution for async match generation and enrichment

The frontend in `thesis-navigator-main` is the current UI baseline and must be wired to Supabase rather than staying local-state only.

---

## 2. Technology Stack

| Layer | Choice |
|---|---|
| Web app | Vite 5 + React 18 + TypeScript |
| UI system | Tailwind CSS + shadcn/ui + lucide-react |
| Data backend | Supabase Postgres |
| Realtime | Supabase Realtime |
| File storage | Supabase Storage |
| Server logic | Supabase Edge Functions (TypeScript) |
| Tests | Vitest + Testing Library |
| Build | `vite build` |

---

## 3. Repository Layout

```text
/
├── Documentation/
│   ├── ARCHITECTURE.md
│   └── PRD.md
├── thesis-navigator-main/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/           # supabase client + API wrappers
│   │   ├── hooks/              # query/mutation hooks
│   │   └── types/              # shared DB-facing types
│   └── package.json
└── supabase/
    ├── migrations/
    ├── functions/
    └── seed.sql
```

`services`, `hooks`, and `types` are required integration layers if not yet present.

---

## 4. Runtime Components

### 4.1 Frontend
- Renders app shell (`Index`), dashboard (`DashboardHome`), and 5-step finder (`ThesisFinder`)
- Uses query/mutation hooks for all persistent operations
- Subscribes to realtime channels for job status and match updates

### 4.2 Database
- Stores users, profiles, sessions, answers, candidate topics, generated matches, and reactions
- Stores derived ranking metadata and job states for asynchronous processing

### 4.3 Edge Functions
Primary responsibilities:
- profile save + normalization
- session lifecycle updates
- candidate ranking orchestration trigger
- match job enqueue + retry handling

### 4.4 Background Jobs
- Process queued matching jobs
- Write ranked matches and explanation payloads back to Supabase
- Publish status transitions consumed by realtime subscriptions

---

## 5. Core Data Model

Minimum required tables:
- `users`
- `student_profiles`
- `finder_sessions`
- `session_answers`
- `topics`
- `topic_tags`
- `session_candidates`
- `session_matches`
- `match_jobs`
- `match_events`

Recommended relationship highlights:
- One user -> one profile
- One user -> many sessions
- One session -> many answers
- One session -> many candidates -> many matches
- One session -> one active match job (plus historical retries)

---

## 6. Data Flow

1. User opens app -> profile loaded from Supabase
2. Finder session starts -> `finder_sessions` row created
3. Each answer persisted to `session_answers`
4. Session completion triggers edge function
5. Edge function prepares candidates and enqueues `match_jobs`
6. Background runner processes job and writes `session_matches`
7. Frontend receives realtime status + result updates
8. User saves or dismisses matches -> reaction persisted

---

## 7. Frontend Integration Contract

The UI layer must stop relying on ephemeral-only flow state for business data.

Required wiring:
- Replace mock completion steps with real mutation calls
- Replace hardcoded result sets with `session_matches` queries
- Use realtime listener for queued/running/done/failed states
- Keep local state only for transient UI controls (panels, active card, temporary inputs)

---

## 8. Environment Configuration

Frontend env:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Supabase function env (server side):

```bash
OPENAI_API_KEY=
MATCH_WORKER_SECRET=
```

---

## 9. Delivery Phases

1. Schema + seed baseline in Supabase
2. Profile/session persistence wiring
3. Match job enqueue and runner pipeline
4. Realtime status + result rendering
5. Hardening: retries, idempotency, and error UX

---

## 10. Local Development

```bash
cd thesis-navigator-main
npm install
npm run dev
```

```bash
npm run test
npm run build
```
