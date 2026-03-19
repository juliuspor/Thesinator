# thesinator-chat Edge Function

## Required Supabase Secrets

Set these secrets before deploying:

```bash
supabase secrets set ANTHROPIC_API_KEY=...
supabase secrets set ELEVENLABS_API_KEY=...
supabase secrets set ELEVENLABS_VOICE_ID=...
# Optional
supabase secrets set ELEVENLABS_MODEL_ID=eleven_multilingual_v2
supabase secrets set ANTHROPIC_MODEL=claude-3-5-sonnet-latest
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
