# PRD.md — studyond Fullstack Product Requirements

---

## 1. Product Goal

Deliver a production-ready thesis discovery experience backed by Supabase.

The product must support:
- persistent user profile and session state
- asynchronous match generation
- realtime status and result updates in the UI
- reliable reaction and follow-up workflow

---

## 2. Scope

### In Scope
- React app UX (dashboard + guided finder + result exploration)
- Supabase schema, storage, and server-side functions
- Async matching pipeline writing to database
- Realtime subscriptions for status transitions
- Error states and retry handling

### Out of Scope
- Multi-tenant enterprise role hierarchy
- Native mobile application
- External BI/reporting layer

---

## 3. Primary User Journey

1. User signs in and completes profile data
2. User starts a new finder session
3. User answers guided questions
4. Session completion starts backend ranking pipeline
5. User watches live status updates
6. Ranked matches appear with explanations
7. User saves/interests/dismisses matches

---

## 4. Functional Requirements

### 4.1 Identity and Profile
- User can create and maintain profile fields required for ranking.
- Profile data is persisted in Supabase and loaded on app start.
- Missing required profile fields block new session start with clear UI feedback.

### 4.2 Finder Session
- System creates a persistent session record when a new run starts.
- Every answer is stored server-side during the flow.
- User can resume interrupted active sessions.

### 4.3 Session Completion and Ranking Pipeline
- Completing a session triggers server workflow.
- Workflow writes a `match_jobs` record with queued status.
- Worker processes candidates and writes ranked rows to `session_matches`.
- Job status transitions: `queued -> running -> done|failed`.

### 4.4 Realtime UX
- Matches page subscribes to job status and match inserts/updates.
- While queued/running, UI shows progress state.
- On done, ranked cards render immediately without manual refresh.
- On failed, UI shows error details and retry action.

### 4.5 Match Interaction
- Every match card supports reaction actions:
  - Save
  - Interested
  - Not for me
- Reaction is persisted and reflected in UI state.
- Interested action can optionally create a follow-up project record.

### 4.6 Scenario View
- Scenario cards render from backend-backed match/session data.
- Expanded detail panel includes explanation, supporting context, and next actions.

---

## 5. Data Requirements

Minimum persisted entities:
- `users`
- `student_profiles`
- `finder_sessions`
- `session_answers`
- `topics`
- `session_candidates`
- `session_matches`
- `match_jobs`
- `match_events`

Rules:
- Session and profile relations must enforce ownership constraints.
- Match writes must be idempotent for job retries.
- Job retries must not duplicate rank positions within one session.

---

## 6. Non-Functional Requirements

- Responsive layout across laptop and mobile widths
- No severe horizontal overflow in primary views
- Match processing retries with deterministic writes
- Clear observability fields in jobs/events tables

Performance targets:
- Session completion to first visible status update: <= 2s
- Typical job completion to visible matches: <= 15s (pilot dataset)

---

## 7. API / Function Surface

Required server operations:
- `create_profile`
- `start_session`
- `save_session_answer`
- `complete_session`
- `enqueue_match_job`
- `retry_match_job`
- `update_match_reaction`

Implementation can use Edge Functions and/or RPC functions; behavior contract must remain stable.

---

## 8. Acceptance Criteria

1. Profile persists and reloads correctly.
2. Session progress is saved server-side across reloads.
3. Completing a session creates and runs a backend job.
4. Realtime status changes are visible in UI.
5. Matches are persisted and displayed in stable rank order.
6. Retry path from failed job to done state works without duplicates.
7. Reaction actions persist and refresh correctly.
8. `npm run test` and `npm run build` pass in `thesis-navigator-main`.

---

## 9. Delivery Sequence

1. Schema + baseline seed
2. Profile and session persistence wiring
3. Completion trigger + job queue
4. Worker result writes + realtime subscriptions
5. Retry/error hardening and final UX polish
