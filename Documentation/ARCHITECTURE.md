# ARCHITECTURE.md
## Gini — Thesis Matching Platform
_Hackathon build · 1 uni · localhost + Supabase_

---

## 1. Tech Stack

| Layer | Choice |
|---|---|
| Frontend + API routes | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Auth + Database + Storage | Supabase (Postgres + pgvector + Auth) |
| Voice TTS | ElevenLabs |
| Voice STT | OpenAI Whisper |
| Embeddings | OpenAI text-embedding-3-small |
| LLM | OpenAI GPT-4o (swarm) + GPT-4o-mini (extraction) |
| Agent Swarm | LangGraph (Python 3.11) |
| Swarm server | FastAPI + Uvicorn (localhost:8000) |

---

## 2. Repo Structure

```
/
├── app/
│   ├── (auth)/            # login page
│   ├── profile/           # profile setup form
│   ├── session/           # voice session UI
│   ├── dashboard/         # match results
│   └── api/
│       ├── session/       # create/update session
│       ├── voice/         # ElevenLabs + Whisper handler
│       ├── search/        # embed + pgvector RPC
│       └── swarm/         # triggers Python swarm job
├── lib/
│   ├── supabase.ts        # supabase client (browser + server)
│   ├── gini.ts            # conversation stage logic
│   ├── embedding.ts       # build query text + call OpenAI embed
│   └── combined-input.ts  # assemble CombinedInput from profile + session
├── swarm/
│   ├── main.py            # FastAPI entry point
│   ├── orchestrator.py
│   └── agents/
│       ├── matcher.py
│       ├── generator.py
│       └── explainer.py
└── supabase/
    ├── migrations/        # all schema SQL
    └── seed.sql           # 30+ thesis topics with embeddings
```

---

## 3. Database Schema (Supabase)

The platform knowledge tables (`universities` through `topics`) are seeded from the mock dataset.
The app tables (`students`, `sessions`, `matches`, `swarm_jobs`) are created at runtime.

```sql
create extension if not exists vector;

-- ─────────────────────────────────────────
-- PLATFORM KNOWLEDGE (seeded from mock data)
-- ─────────────────────────────────────────

create table universities (
  id       uuid primary key default gen_random_uuid(),
  name     text not null,
  city     text,
  country  text default 'Switzerland',
  website  text
);

create table fields (
  id   uuid primary key default gen_random_uuid(),
  name text not null unique   -- e.g. "Data Science", "Supply Chain Management"
);

create table study_programs (
  id            uuid primary key default gen_random_uuid(),
  university_id uuid references universities(id),
  name          text not null,
  degree        text,          -- BSc | MSc | PhD
  duration_years int
);

create table supervisors (
  id            uuid primary key default gen_random_uuid(),
  university_id uuid references universities(id),
  title         text,          -- academic honorific e.g. "Prof. Dr."
  first_name    text,
  last_name     text,
  email         text,
  embedding     vector(1536)   -- embed(title + name + fields via join)
);

create table supervisor_fields (
  supervisor_id uuid references supervisors(id),
  field_id      uuid references fields(id),
  primary key (supervisor_id, field_id)
);

create table companies (
  id       uuid primary key default gen_random_uuid(),
  name     text not null,
  city     text,
  country  text,
  website  text,
  industry text
);

create table experts (
  id         uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id),
  title      text,             -- job role e.g. "Head of Data Science"
  first_name text,
  last_name  text,
  email      text,
  embedding  vector(1536)
);

create table expert_fields (
  expert_id uuid references experts(id),
  field_id  uuid references fields(id),
  primary key (expert_id, field_id)
);

-- topics owned by EITHER a company OR a university supervisor, never both
create table topics (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  description     text,
  type            text,        -- 'thesis' | 'job'
  status          text default 'open',  -- open | taken | closed
  -- ownership (mutually exclusive)
  company_id      uuid references companies(id),
  university_id   uuid references universities(id),
  -- logistics
  location_city   text,
  remote_ok       boolean default false,
  duration_months int,
  paid            boolean default false,
  nda_required    boolean default false,
  publish_allowed boolean default true,
  -- vector
  embedding       vector(1536),
  created_at      timestamptz default now(),
  -- enforce: exactly one of company_id or university_id must be set
  constraint topic_owner_check check (
    (company_id is not null)::int + (university_id is not null)::int = 1
  )
);

create table topic_fields (
  topic_id uuid references topics(id),
  field_id uuid references fields(id),
  primary key (topic_id, field_id)
);

-- company topics link to experts; supervisor topics link to supervisors
create table topic_experts (
  topic_id  uuid references topics(id),
  expert_id uuid references experts(id),
  primary key (topic_id, expert_id)
);

create table topic_supervisors (
  topic_id      uuid references topics(id),
  supervisor_id uuid references supervisors(id),
  primary key (topic_id, supervisor_id)
);

-- ─────────────────────────────────────────
-- APP TABLES (runtime)
-- ─────────────────────────────────────────

-- students link to auth.users, study_program, and university
create table students (
  id               uuid primary key references auth.users on delete cascade,
  study_program_id uuid references study_programs(id),
  university_id    uuid references universities(id),
  first_name       text,
  last_name        text,
  semester         int,
  linkedin_url     text,
  github_url       text,
  photo_url        text,
  skills           text[],
  interested_field_ids uuid[],   -- FKs into fields table
  interests_embedding  vector(1536),
  created_at       timestamptz default now()
);

-- thesis project: the central lifecycle entity
-- can exist without a topic (student starts with just title + motivation)
create table thesis_projects (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid references students(id) on delete cascade,
  topic_id      uuid references topics(id),         -- nullable until attached
  title         text not null,
  motivation    text,
  status        text default 'proposed',
  -- proposed → applied → agreed → in_progress → completed
  -- also: withdrawn | rejected | canceled
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create table project_supervisors (
  project_id    uuid references thesis_projects(id),
  supervisor_id uuid references supervisors(id),
  primary key (project_id, supervisor_id)
);

create table project_experts (
  project_id uuid references thesis_projects(id),
  expert_id  uuid references experts(id),
  primary key (project_id, expert_id)
);

-- one row per Gini conversation
create table sessions (
  id               uuid primary key default gen_random_uuid(),
  student_id       uuid references students(id) on delete cascade,
  status           text default 'active',   -- active | completed | abandoned
  context_snapshot jsonb,
  combined_input   jsonb,
  created_at       timestamptz default now()
);

-- conversation transcript
create table messages (
  id         uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  role       text,             -- user | assistant
  content    text,
  stage      text,
  created_at timestamptz default now()
);

-- swarm match results
create table matches (
  id               uuid primary key default gen_random_uuid(),
  session_id       uuid references sessions(id) on delete cascade,
  topic_id         uuid references topics(id),
  score            float4,
  rank             int,
  explanation      text,
  student_reaction text default 'pending',  -- pending | saved | accepted | rejected
  created_at       timestamptz default now()
);

-- async swarm job tracking
create table swarm_jobs (
  id             uuid primary key default gen_random_uuid(),
  session_id     uuid references sessions(id),
  status         text default 'queued',     -- queued | running | done | failed
  input_payload  jsonb,
  output_payload jsonb,
  error_message  text,
  created_at     timestamptz default now()
);

-- ─────────────────────────────────────────
-- INDEXES + SEARCH
-- ─────────────────────────────────────────

create index on topics       using hnsw (embedding vector_cosine_ops);
create index on supervisors  using hnsw (embedding vector_cosine_ops);
create index on experts      using hnsw (embedding vector_cosine_ops);
create index on students     using hnsw (interests_embedding vector_cosine_ops);

-- vector search RPC: returns topics with their owner info joined
create or replace function match_topics(
  query_embedding vector(1536),
  match_threshold float default 0.55,
  match_count     int   default 10
)
returns table (
  id uuid, title text, description text, type text,
  company_name text, university_name text,
  location_city text, duration_months int, paid boolean,
  similarity float
)
language sql stable as $$
  select
    t.id, t.title, t.description, t.type,
    c.name  as company_name,
    u.name  as university_name,
    t.location_city, t.duration_months, t.paid,
    1 - (t.embedding <=> query_embedding) as similarity
  from topics t
  left join companies    c on c.id = t.company_id
  left join universities u on u.id = t.university_id
  where t.status = 'open'
    and t.embedding is not null
    and 1 - (t.embedding <=> query_embedding) > match_threshold
  order by t.embedding <=> query_embedding
  limit match_count;
$$;
```

---

## 4. Combined Input Object

Assembled at end of Gini conversation. Stored in `sessions.combined_input`. Passed to swarm.

```typescript
type CombinedInput = {
  // from student profile
  student_id:        string
  name:              string
  university_name:   string
  study_program:     string
  semester:          number
  skills:            string[]
  interested_fields: string[]   // canonical field names from fields table

  // from gini conversation
  goal_type:         'job' | 'academic' | 'mentoring' | 'open'
  future_vision:     string
  location:          { preferred_cities: string[]; remote_ok: boolean }
  scope:             { duration_months: number; paid_required: boolean }
  legal:             { nda_ok: boolean; publish_required: boolean }
  existing_ideas:    string[]
  refined_interests: string[]
  gini_summary:      string  // natural language paragraph — primary embed input
}
```

**What gets embedded:**
`gini_summary + ", " + skills.join(", ") + ", " + refined_interests.join(", ") + ". " + existing_ideas.join(". ")`

---

## 5. Data Flow

```
1.  Student registers → students row created, study_program_id + university_id linked
2.  Student fills profile → interests_embedding computed and stored
3.  Student starts session → sessions row created
4.  Gini runs 8 stages → messages rows written, context_snapshot updated per stage
5.  Gini ends → combined_input assembled and stored in sessions
6.  Server embeds query text → float[1536]
7.  match_topics() RPC runs → top 10 topics returned with company/university joined
8.  swarm_jobs row created → POST /run-swarm to Python service
9.  Swarm: Matcher → Generator (if needed) → Explainer
10. Matches written to matches table (topic_id FK) → swarm_jobs.status = done
11. Supabase Realtime notifies browser → dashboard updates
12. Student sees shortlist, reacts, optionally creates a thesis_project
```

---

## 6. Gini Conversation Stages

8 stages in sequence. After each student turn, GPT-4o-mini extracts structured fields.
`context_snapshot` in Supabase is updated after each stage completes.

| # | Stage | Key fields extracted |
|---|---|---|
| 1 | Career goal | goal_type, target_industry |
| 2 | Location | preferred_cities, remote_ok |
| 3 | Future vision | future_vision |
| 4 | Compensation | paid_required |
| 5 | Scope | duration_months |
| 6 | Legal | nda_ok, publish_required |
| 7 | Existing ideas | existing_ideas[] |
| 8 | Interest refinement | refined_interests[], gini_summary |

---

## 7. Agent Swarm

Python FastAPI service on `localhost:8000`. Called by Next.js `POST /api/swarm`.

```
Orchestrator
├── score >= 0.75 and 3+ results  →  Matcher only
├── score < 0.55 or < 3 results   →  Generator only
└── in between                    →  Matcher + Generator

Explainer (always runs last)
└── writes 2–3 sentence personalised explanation per match
└── saves to matches table
```

---

## 8. Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=
SWARM_SERVICE_URL=http://localhost:8000
SWARM_SECRET=
```

---

## 9. Local Dev

```bash
# 1. install JS deps
npm install

# 2. start local supabase (needs Docker)
npx supabase start

# 3. push schema + seed data
npx supabase db push
npx supabase db seed

# 4. start python swarm
cd swarm
pip install -r requirements.txt
uvicorn main:app --port 8000 --reload

# 5. start next.js
npm run dev
# → http://localhost:3000
```
