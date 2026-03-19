#!/bin/bash
# Start the LiteLLM proxy to translate OpenAI requests -> Anthropic
# Run this in a separate terminal BEFORE starting MiroFish

# Load .env file
set -a
source "$(dirname "$0")/.env"
set +a

echo "Starting LiteLLM proxy..."
echo "  Model: anthropic/claude-haiku-4-5-20251001"
echo "  Listening on: http://0.0.0.0:4000"
echo ""

cd "$(dirname "$0")/backend"
uv run litellm --config ../litellm_config.yaml --port 4000
