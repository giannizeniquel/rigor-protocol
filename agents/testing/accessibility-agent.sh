#!/bin/bash

# Testing Agent - Accessibility Runner
# Runs accessibility tests with axe-core

set -e

echo "♿ Running Accessibility Testing Agent..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Run accessibility tests
echo "Running accessibility tests..."
if npm run test:accessibility; then
    echo -e "${GREEN}✅ Accessibility tests passed${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️ Accessibility violations detected${NC}"
    echo "📋 Check accessibility report for details"
    exit 1
fi
