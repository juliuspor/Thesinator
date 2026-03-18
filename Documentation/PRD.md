# PRD.md — Gini: Thesis Matching Platform
_Build guide for coding agents · Hackathon v1_

Read ARCHITECTURE.md first for the full schema, data flow, and tech stack.
This document tells you what to build, screen by screen, and what each piece must do.

---

## What This App Does

A student logs in, fills a profile, then has a voice conversation with an AI agent called **Gini**. Gini asks structured questions across 8 topics to understand the student's career goals, constraints, and interests. When the conversation ends, the app embeds the student's answers, runs a vector similarity search against a database of thesis topics, and passes the results to a Python agent swarm. The swarm produces a shortlist of 3–5 ranked thesis topics with personalised explanations. The student sees these on a dashboard and can react to them.

The database is pre-seeded with real mock data: 10 universities, 25 supervisors, 15 companies, 30 experts, 60 thesis topics, 40 students. You do not build any admin UI — data is managed directly in Supabase Studio.

---

## Pages to Build

### 1. `/login`
- Supabase magic link auth (email only, no password)
- Single input field + "Send login link" button
- On auth callback, redirect to `/profile` if profile incomplete, else `/dashboard`

---

### 2. `/profile`
Student fills this once before they can use Gini. All fields write to the `students` table.

**Form fields:**
- First name, Last name (text, required)
- University (dropdown, populated from `universities` table)
- Study program (dropdown, filtered by selected university, from `study_programs` table)
- Semester (number 1–12, required)
- Interested fields (multi-select tags, options from `fields` table)
- Skills (free-text tag input — type and press enter)
- LinkedIn URL (optional)
- GitHub URL (optional)
- Photo upload (optional, Supabase Storage → `avatars` bucket)

**On save:**
1. Upsert `students` row
2. POST `/api/embed/profile` → computes `interests_embedding` from `skills + interested_fields`, writes to `students.interests_embedding`
3. Redirect to `/dashboard`

---

### 3. `/dashboard`
The student's home screen.

**Shows:**
- Welcome message with student name
- "Start a new session with Gini" button → navigates to `/session`
- List of past sessions with status (active / completed) and date
- For completed sessions: "View matches" link → `/matches/[sessionId]`

**Gate:** if `students` row is incomplete (no `study_program_id` or no `skills`), show a banner prompting them to complete their profile before starting a session.

---

### 4. `/session`
The voice conversation with Gini. This is the core of the app.

**On page load:**
1. Create a `sessions` row (`status: active`, `student_id: current user`)
2. Request microphone permission
3. Open ElevenLabs WebSocket for TTS streaming
4. Gini greets the student by first name and starts Stage 1

**Voice flow:**
- Student speaks → browser captures audio via `MediaRecorder` → send audio chunks to `/api/voice/transcribe` (Whisper) → receive transcript
- Transcript sent to `/api/voice/extract` → GPT-4o-mini extracts structured fields → updates `sessions.context_snapshot` in Supabase
- Response text sent to ElevenLabs TTS → streamed back as audio → played in browser
- Message (both turns) written to `messages` table with `stage` field set

**UI during conversation:**
- Gini's avatar / waveform animation while speaking
- Transcript of current exchange (last 2 turns visible)
- Stage progress indicator (e.g. "3 of 8")
- "Switch to text" toggle — if active, show text input instead of mic; process identically
- "End session early" button → triggers session completion flow

**Stage completion:**
Each stage ends when all required fields for that stage are present in `context_snapshot`. Gini then transitions naturally to the next stage without a hard break.

**The 8 stages and what they extract into `context_snapshot`:**

```
Stage 1 — Career goal
  goal_type: 'job' | 'academic' | 'mentoring' | 'open'
  target_industry: string[]

Stage 2 — Location
  preferred_cities: string[]
  remote_ok: boolean

Stage 3 — Future vision
  future_vision: string

Stage 4 — Compensation
  paid_required: boolean

Stage 5 — Scope
  duration_months: number   (3 | 6 | null for no preference)

Stage 6 — Legal
  nda_ok: boolean
  publish_required: boolean

Stage 7 — Existing ideas
  existing_ideas: string[]

Stage 8 — Interest refinement
  refined_interests: string[]
  depth_preference: 'theory' | 'applied' | 'product'
```

**On session end (after Stage 8):**
1. Gini speaks a brief closing summary
2. POST `/api/session/complete` with `session_id`:
   a. Assembles `combined_input` object (see ARCHITECTURE.md §4)
   b. Generates `gini_summary` paragraph via GPT-4o-mini
   c. Saves `combined_input` to `sessions.combined_input`, sets `status: completed`
   d. POST `/api/embed/session` → embeds query text → saves to session
   e. Calls `match_topics()` Supabase RPC → gets top 10 topics
   f. Creates `swarm_jobs` row, POSTs to Python swarm at `SWARM_SERVICE_URL/run-swarm`
3. Navigate to `/matches/[sessionId]`

---

### 5. `/matches/[sessionId]`
Shows the swarm's output for a completed session.

**Loading state:**
- Poll `swarm_jobs` where `session_id = [sessionId]` via Supabase Realtime
- While `status = queued` or `running`: show "Gini is finding your matches..." with a spinner

**When `status = done`:**
- Query `matches` table joined with `topics`, `companies`, `universities`
- Render 3–5 match cards ordered by `rank`

**Each match card shows:**
- Topic title
- Owner: company name OR university + supervisor name
- Tags: field names (from `topic_fields` join)
- Badges: duration · paid/unpaid · remote/city · NDA yes/no
- Personalised explanation (from `matches.explanation`)
- Three buttons: **Save** · **Interested** · **Not for me**
  - Clicking any updates `matches.student_reaction`
  - "Interested" also creates a `thesis_projects` row with `status: proposed`, linking `student_id` and `topic_id`

**If `status = failed`:** show error message + "Try again" button that re-triggers the swarm job

---

## API Routes

### `POST /api/embed/profile`
- Input: `{ student_id }`
- Reads student's `skills` and `interested_fields` from DB
- Calls OpenAI `text-embedding-3-small` on concatenated text
- Writes result to `students.interests_embedding`

### `POST /api/voice/transcribe`
- Input: audio blob (WebM)
- Calls OpenAI Whisper API
- Returns `{ transcript: string }`

### `POST /api/voice/extract`
- Input: `{ transcript, stage, context_snapshot }`
- Calls GPT-4o-mini with JSON schema output matching the stage's fields
- Merges extracted fields into `context_snapshot`
- Updates `sessions.context_snapshot` in Supabase
- Returns updated `context_snapshot`

### `POST /api/session/complete`
- Input: `{ session_id }`
- Assembles `combined_input` from `context_snapshot` + student profile
- Generates `gini_summary` via GPT-4o-mini
- Embeds query text via OpenAI
- Calls `match_topics()` RPC
- Creates `swarm_jobs` row
- POSTs `{ job_id, combined_input, top_n_topics }` to `SWARM_SERVICE_URL/run-swarm`
- Returns `{ swarm_job_id }`

---

## Python Swarm (`swarm/main.py`)

Single FastAPI endpoint: `POST /run-swarm`

Input:
```json
{
  "job_id": "uuid",
  "combined_input": { ...CombinedInput },
  "top_n_topics": [ { "id", "title", "description", "similarity", ... } ]
}
```

Flow:
```
1. Set swarm_jobs.status = 'running'

2. Orchestrator decides routing:
   - avg similarity >= 0.75 and count >= 3  →  Matcher only
   - avg similarity < 0.55 or count < 3     →  Generator only
   - otherwise                              →  Matcher + Generator

3. Matcher agent (if runs):
   - Re-ranks top_n_topics using combined_input context
   - Scores each topic against: goal_type, location, duration, paid, field overlap
   - Selects best 3–5

4. Generator agent (if runs):
   - Generates 1–3 new topic ideas using GPT-4o
   - Inserts them into topics table (company_id=null, university_id=null, status='open')
   - Embeds and saves their embeddings
   - Adds them to the candidate list

5. Explainer agent (always):
   - For each final topic (3–5 total):
     - Writes a 2–3 sentence explanation personalised to the student
     - Uses: gini_summary + topic description + student skills
   - Writes each to matches table: topic_id, session_id, score, rank, explanation

6. Set swarm_jobs.status = 'done', write output_payload
```

On any exception: set `swarm_jobs.status = 'failed'`, write `error_message`.

---

## Key Data Shapes

### `sessions.context_snapshot` (built up during conversation)
```json
{
  "goal_type": "job",
  "target_industry": ["fintech", "deeptech"],
  "preferred_cities": ["Zürich", "Basel"],
  "remote_ok": true,
  "future_vision": "ML engineer at a product company",
  "paid_required": true,
  "duration_months": 6,
  "nda_ok": true,
  "publish_required": false,
  "existing_ideas": ["LLM-based code review tool"],
  "refined_interests": ["applied NLP", "developer tooling"],
  "depth_preference": "applied"
}
```

### `sessions.combined_input` (assembled at session end)
```json
{
  "student_id": "uuid",
  "name": "Anna Müller",
  "university_name": "ETH Zürich",
  "study_program": "MSc Computer Science",
  "semester": 7,
  "skills": ["Python", "ML", "React"],
  "interested_fields": ["NLP", "HCI"],
  "goal_type": "job",
  "target_industry": ["fintech"],
  "future_vision": "ML engineer at a product company",
  "location": { "preferred_cities": ["Zürich"], "remote_ok": true },
  "scope": { "duration_months": 6, "paid_required": true },
  "legal": { "nda_ok": true, "publish_required": false },
  "existing_ideas": ["LLM-based code review tool"],
  "refined_interests": ["applied NLP", "developer tooling"],
  "depth_preference": "applied",
  "gini_summary": "Anna is a 7th-semester MSc CS student at ETH Zürich looking for a paid 6-month applied ML thesis in Zürich, ideally at a fintech or deeptech company. She's strong in Python and ML, interested in applied NLP and developer tooling, and has an existing idea around LLM-based code review."
}
```

---

## Build Order

Build in this sequence — each step is testable before the next:

1. Supabase schema + seed data loaded locally (`npx supabase db push && npx supabase db seed`)
2. Auth + `/login` → magic link works, user row created
3. `/profile` form → student row saved, `interests_embedding` computed
4. `/dashboard` → shows student name, session list (empty), start button
5. `/api/voice/transcribe` + `/api/voice/extract` → test with curl before touching the UI
6. `/session` text mode only → full 8 stages complete, `context_snapshot` correct in DB
7. `/session` voice mode → add ElevenLabs TTS + Whisper STT on top of working text flow
8. `/api/session/complete` → `combined_input` correct, `match_topics()` RPC returns results
9. Python swarm → Matcher + Explainer working end to end, rows in `matches` table
10. `/matches/[sessionId]` → cards render, reactions save, `thesis_projects` row created on "Interested"
11. Wire Supabase Realtime on `/matches` page → loading state updates automatically

---

## What Not to Build

- No admin UI — data is managed in Supabase Studio directly
- No multi-university logic — `universities` table is seeded, not user-managed
- No supervisor or company-facing views
- No email notifications
- No mobile-specific layout
- No pagination — pilot scale is small enough for full list renders
