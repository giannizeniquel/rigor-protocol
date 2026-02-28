#!/bin/bash

# Testing Agent - E2E Test Runner
# Runs end-to-end tests with auto-fix capabilities

set -e

echo "🧪 Running E2E Testing Agent..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Run E2E tests
echo "Running E2E tests..."
if npm run test:e2e; then
    echo -e "${GREEN}✅ E2E tests passed${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️ E2E tests failed - attempting retry...${NC}"
    
    # Retry once
    if npm run test:e2e; then
        echo -e "${GREEN}✅ E2E tests passed on retry${NC}"
        exit 0
    fi
    
    echo -e "${RED}❌ E2E tests failed after retry${NC}"
    echo "📋 Check playwright-report for details"
    exit 1
fi
