#!/bin/bash

echo "🔍 Checking Go service logs..."

# Get the latest log stream
LATEST_STREAM=$(aws logs describe-log-streams \
  --log-group-name "/ecs/skillmore-programs-skills" \
  --order-by LastEventTime \
  --descending \
  --max-items 1 \
  --query 'logStreams[0].logStreamName' \
  --output text)

echo "📋 Latest log stream: $LATEST_STREAM"

# Get the last 50 log events
echo "📄 Recent logs:"
aws logs get-log-events \
  --log-group-name "/ecs/skillmore-programs-skills" \
  --log-stream-name "$LATEST_STREAM" \
  --start-from-head \
  --limit 50 \
  --query 'events[*].message' \
  --output text

echo ""
echo "✅ Log check complete!" 