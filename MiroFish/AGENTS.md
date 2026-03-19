# Developer Guide: MiroFish + Anthropic

MiroFish is a multi-agent prediction engine that extracts entities from documents via GraphRAG, generates agent personas via LLMs, and runs social simulations on a simulated social network using the OASIS framework.

## 🔗 Service URLs

When running, the services operate at the following internal URLs:
- **Frontend UI:** `http://localhost:3000`
- **Backend API:** `http://localhost:5001`
- **LiteLLM Proxy:** `http://0.0.0.0:4000`

## 🚀 Running the App

To run the full stack manually, you can still spin up three separate processes:

**1. Start the LiteLLM Proxy (Routes OpenAI calls to Anthropic)**
```bash
./start_proxy.sh
```

**2. Start the Backend API (Flask)**
```bash
cd backend
./venv/bin/python3 run.py
```

**3. Start the Frontend (Vue 3)**
```bash
cd frontend
npm run dev
```

**4. Restart All Services (Recommended)**
> **Note:** You must be in the `MiroFish` root directory to run this.
```bash
./restart_services.sh
```

This command will:
- Stop existing processes on ports `4000`, `5001`, and `3000`
- Start LiteLLM proxy, backend, and frontend again on the expected ports
- Prevent the frontend from silently moving to `3001`, `3002`, etc.

> **⚠️ API REQUIREMENT:** The repo natively hardcodes OpenAI. We use the local LiteLLM proxy to intercept these requests. The `MiroFish/.env` file MUST contain your `ANTHROPIC_API_KEY` (for the LLM) and `ZEP_API_KEY` (for GraphRAG).

## 🏗️ The 4-Stage Pipeline

MiroFish executes a heavy data pipeline before the social simulation engine actually boots:

1. **Ontology Generation** (`POST /api/graph/ontology/generate`) - Reads seed document (PDF/txt) and generates agent personas via LLM.
2. **Knowledge Graph** (`POST /api/graph/build`) - Chunks text and pushes to Zep Cloud.
3. **Simulation Config** (`POST /api/simulation/prepare`) - Generates agent behavior logic & initial posts.
4. **Execution** (`POST /api/simulation/run` or `/start`) - Spawns the background simulation loop.

## 📁 Key Architectural Files

- `backend/app/utils/llm_client.py`: The single bottleneck where all LLM calls pass through.
- `backend/app/api/`: Where the Flask endpoints (`graph.py`, `simulation.py`) are defined.
- `backend/uploads/simulations/`: Where the generated SQLite databases and agent trace logs are saved during runtime.

## 🧪 Testing and Zep Cloud Limits

**Important note about the free tier `ZEP_API_KEY`:**
The Zep free tier allows exactly **10,000 "episodes" per month** (1 episode ≈ 350 bytes).
- Do not feed massive 20-page full PDF documents during testing, or you will completely exhaust the monthly quota in just 5-8 runs.
- **For Hackathons:** The AI models only need 1-3 paragraphs of pure, dense text to generate complex graphs and simulations.
- We have created three files in the root folder specifically for the hackathon and testing safely:
  1. `st_gallen_ev_seed.txt` (Upload as the "reality seed")
  2. `st_gallen_simulation_prompt.txt` (Paste into the Prompt/Simulation Requirement box)
  3. `task.md` (The START Hack Thesis Copilot challenge description)

## 🔧 Token Optimization (Implemented)

We optimized LLM token consumption across the pipeline. **Expected savings: 50-60% overall.**

| Optimization | File | Change | Savings |
|--------------|------|--------|---------|
| **Batched Profile Generation** | `oasis_profile_generator.py` | 3 entities per LLM call instead of 1 | ~67% fewer calls |
| **Shorter Personas** | `oasis_profile_generator.py` | 2000 → 500-800 words | ~65% output |
| **Reduced ReACT Iterations** | `report_agent.py` | 5→3 tool calls, 3→2 reflections | ~35% on reports |
| **Trimmed Prompts** | `report_agent.py` | Condensed tool descriptions & system prompt | ~70% prompt size |

**Key parameters:**
- `BATCH_SIZE = 3` in `oasis_profile_generator.py`
- `MAX_TOOL_CALLS_PER_SECTION = 3` in `report_agent.py`
- `MAX_REFLECTION_ROUNDS = 2` in `report_agent.py`
- Batching can be disabled: `generate_profiles_from_entities(..., use_batching=False)`
