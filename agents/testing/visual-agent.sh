#!/bin/bash

# Testing Agent - Visual Regression Runner
# Runs visual regression tests with auto-update capability

set -e

echo "🎨 Running Visual Testing Agent..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if UPDATE flag is set
UPDATE_SNAPSHOTS="${UPDATE_VISUAL:-false}"

if [ "$UPDATE_SNAPSHOTS" = "true" ]; then
    echo "📸 Update mode enabled - updating visual baselines..."
    if npm run test:visual:update; then
        echo -e "${GREEN}✅ Visual baselines updated${NC}"
        exit 0
    else
        echo -e "${RED}❌ Failed to update visual baselines${NC}"
        exit 1
    fi
fi

# Run visual tests
echo "Running visual regression tests..."
if npm run test:visual; then
    echo -e "${GREEN}✅ Visual tests passed${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️ Visual tests failed${NC}"
    echo "📋 To update baselines, run: UPDATE_VISUAL=true ./agents/testing/visual-agent.sh"
    exit 1
fi
