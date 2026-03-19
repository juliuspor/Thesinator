# thesinator-chat Edge Function

## Required Supabase Secrets

Set these secrets before deploying:

```bash
supabase secrets set ANTHROPIC_API_KEY=...
supabase secrets set ELEVENLABS_API_KEY=...
supabase secrets set ELEVENLABS_VOICE_ID=...
supabase secrets set OPENAI_API_KEY=...
# Optional
supabase secrets set ELEVENLABS_MODEL_ID=eleven_multilingual_v2
supabase secrets set ANTHROPIC_MODEL=claude-3-5-sonnet-latest
supabase secrets set OPENAI_EMBEDDING_MODEL=text-embedding-3-small
# optional auto-heal tuning
supabase secrets set TOPIC_EMBED_AUTO_HEAL_MAX=200
supabase secrets set TOPIC_EMBED_BATCH_SIZE=20
```

## Deploy

```bash
supabase db push
supabase functions deploy thesinator-chat
```

## API Contract

### Start session

```json
{
  "action": "start"
}
```

### Turn

```json
{
  "action": "turn",
  "session_id": "...",
  "question_id": 1,
  "user_answer": "...",
  "input_mode": "mcq",
  "client_token": "..."
}
```

`client_token` is required for anonymous sessions.

On completion (`is_complete=true`) the response now includes:

- `context_snapshot`
- `top_topics` (ranked Top 5 from `refresh_session_top_topics`)
- `matching_meta` (`used_vector`, `relaxation_stage`, `total_candidates`)

### Fetch top topics (retry-safe for anonymous sessions)

```json
{
  "action": "top_topics",
  "session_id": "...",
  "client_token": "...",
  "limit": 5
}
```

This action recomputes and returns:

- `top_topics`
- `matching_meta`
