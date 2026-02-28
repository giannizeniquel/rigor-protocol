#!/bin/bash

# Performance Agent - Lighthouse Runner
# Runs Lighthouse audits

set -e

echo "📊 Running Lighthouse Agent..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
LH_CONFIG="${LH_CONFIG:-./lighthouserc.json}"
BASE_URL="${BASE_URL:-http://localhost:4321}"
REPORT_PATH="${REPORT_PATH:-./lighthouse-report.html}"

# Ensure dev server is running
echo "Checking if dev server is running..."
if ! curl -s -o /dev/null -w "%{http_code}" "$BASE_URL" | grep -q "200"; then
    echo "Starting dev server..."
    npm run dev &
    DEV_PID=$!
    echo "Waiting for server to be ready..."
    sleep 10
fi

# Run Lighthouse
echo "Running Lighthouse audit on $BASE_URL..."
if lighthouse "$BASE_URL" \
    --config="$LH_CONFIG" \
    --output=html \
    --output-path="$REPORT_PATH" \
    --output=json \
    --output-path="$(dirname $REPORT_PATH)/lighthouse-report.json"; then
    
    echo -e "${GREEN}✅ Lighthouse audit completed${NC}"
    echo "📋 Report saved to: $REPORT_PATH"
    
    # Parse scores
    if command -v jq &> /dev/null; then
        echo ""
        echo "Performance Scores:"
        jq -r '.categories | to_entries[] | "\(.key): \(.value.score * 100 | floor)/100"' "$(dirname $REPORT_PATH)/lighthouse-report.json" 2>/dev/null || true
    fi
    
    exit 0
else
    echo -e "${RED}❌ Lighthouse audit failed${NC}"
    exit 1
fi
