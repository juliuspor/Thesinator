# Developer Guide: MiroFish + Anthropic

MiroFish is a multi-agent prediction engine that extracts entities from documents via GraphRAG, generates agent personas via LLMs, and runs social simulations on a simulated social network using the OASIS framework.

## Repo Location

- Canonical local path: `/Users/julius/Desktop/Repos/STARTHack/MiroFish`
- If you start from `STARTHack/`, run `cd MiroFish` first.

## Service URLs

When running locally, services are available at:
- **Frontend UI:** `http://localhost:3000` (legacy/debug for this workspace)
- **Backend API:** `http://localhost:5001`
- **LiteLLM Proxy:** `http://0.0.0.0:4000`

## Studyond Integration

- The current STARTHack thesis experience uses `thesis-navigator-main/` as the only user-facing UI.
- MiroFish is now used as a hidden engine through `backend/app/api/studyond.py`.
- The thesis app expects a real event stream from the graph task; `GET /api/studyond/graph/task/<task_id>` should return ordered raw `events[]`, not just the latest status.
- The Studyond adapter routes used by the thesis app are:
  - `POST /api/studyond/graph/start`
  - `GET /api/studyond/graph/task/<task_id>`
  - `GET /api/studyond/graph/data/<graph_id>`
  - `POST /api/studyond/futures/prepare`

## Running the App

To start the full STARTHack stack from the repo root:
```bash
./start_all.sh
```

Notes:
- `./start_all.sh` resets and reseeds the local Supabase database before boot.
- It waits for LiteLLM and `http://127.0.0.1:5001/health` before starting the thesis frontend.
- It starts the Flask backend with `FLASK_DEBUG=False` to avoid the dev reloader restart race.
- It exports `MIROFISH_API_URL=http://host.docker.internal:5001` into the Supabase edge runtime automatically.
- A local `MIROFISH_API_KEY` is optional; if present in `MiroFish/.env`, the launcher forwards it.
- The edge runtime runs inside Docker, so `127.0.0.1:5001` only works from the host shell/browser. Edge functions must use `host.docker.internal:5001`.

To run only MiroFish manually, use the processes below.

To run the full stack manually, use three separate processes:

**1. Start LiteLLM Proxy (OpenAI-format requests -> Anthropic)**
```bash
./start_proxy.sh
```

**2. Start Backend API (Flask)**
```bash
cd backend
FLASK_DEBUG=False uv run python run.py
```

**3. Start Frontend (Vue 3)**
```bash
cd frontend
npm run dev
```

**4. Restart All Services (Recommended)**
> Must be run from the `MiroFish` root directory.
```bash
./restart_services.sh
```

This command will:
- Stop processes on ports `4000`, `5001`, and `3000`
- Restart proxy, backend, and frontend on expected ports
- Prevent frontend fallback to `3001`, `3002`, etc.

## Env Requirements

The repo natively hardcodes OpenAI request format. We use local LiteLLM proxy interception.
- Required env file: `./.env` (in `MiroFish/` root)
- Required keys: `ANTHROPIC_API_KEY`, `ZEP_API_KEY`
- `MIROFISH_API_KEY` is optional for local STARTHack integration.
- If you manually run Supabase edge functions for the thesis stack, set `MIROFISH_API_URL=http://host.docker.internal:5001`, not `http://127.0.0.1:5001`.

## Studyond Local Failure Mode

- `See your future` failures are persisted in `future_sessions.graph_status`.
- After fixing local startup or networking issues, create a new future session from the `Discover` step rather than reusing the previously failed one.

## Troubleshooting After Folder Moves

If the repo is moved/renamed, virtualenv CLI shims can break (especially `litellm`) due to stale shebang paths.

Fix from `MiroFish` root:
```bash
cd backend
uv pip install --reinstall litellm
```

Then restart:
```bash
cd ..
./restart_services.sh
```

## 4-Stage Pipeline

1. **Ontology Generation** (`POST /api/graph/ontology/generate`) - Reads seed document and generates ontology.
2. **Knowledge Graph Build** (`POST /api/graph/build`) - Chunks text and pushes to Zep Cloud.
3. **Simulation Config** (`POST /api/simulation/prepare`) - Generates agent behavior logic and initial posts.
4. **Execution** (`POST /api/simulation/run` or `/start`) - Starts the background simulation loop.

## Key Architectural Files

- `backend/app/utils/llm_client.py`: Single bottleneck for all LLM calls.
- `backend/app/api/`: Flask endpoints (`graph.py`, `simulation.py`, `report.py`).
- `backend/uploads/simulations/`: Generated SQLite DBs and simulation traces.

## Testing + Zep Cloud Limits

Zep free tier allows **10,000 episodes/month** (1 episode ~350 bytes).
- Avoid large PDFs during iterative testing.
- For hackathon testing, 1-3 dense paragraphs are sufficient.

Safe seed files in repo root:
1. `st_gallen_ev_seed.txt`
2. `st_gallen_simulation_prompt.txt`
3. `task.md`

## Token Optimization Notes

Expected savings from current settings: **~50-60% overall**.

| Optimization | File | Change | Savings |
|--------------|------|--------|---------|
| Batched Profile Generation | `oasis_profile_generator.py` | 3 entities per call | ~67% fewer calls |
| Shorter Personas | `oasis_profile_generator.py` | 2000 -> 500-800 words | ~65% output |
| Reduced ReACT Iterations | `report_agent.py` | 5->3 tool calls, 3->2 reflections | ~35% on reports |
| Trimmed Prompts | `report_agent.py` | Condensed tool descriptions/system prompt | ~70% prompt size |

Key parameters:
- `BATCH_SIZE = 3` in `oasis_profile_generator.py`
- `MAX_TOOL_CALLS_PER_SECTION = 3` in `report_agent.py`
- `MAX_REFLECTION_ROUNDS = 2` in `report_agent.py`
- Batching toggle: `generate_profiles_from_entities(..., use_batching=False)`
