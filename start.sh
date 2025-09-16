#!/bin/sh
# Render sets $PORT automatically
if [ -z "$PORT" ]; then
  export PORT=5678
fi

echo "Starting n8n on 0.0.0.0:$PORT ..."
exec n8n start --port $PORT --host 0.0.0.0
