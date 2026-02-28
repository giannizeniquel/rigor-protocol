#!/bin/bash

# Testing Agent - Main Orchestrator
# Runs all testing sub-agents

set -e

echo "🧪 RIGOR Testing Agent - Starting..."
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FAILED=0

# Function to run agent
run_agent() {
    local agent_name="$1"
    local agent_script="$2"
    
    echo ""
    echo "Running $agent_name..."
    if bash "$SCRIPT_DIR/$agent_script"; then
        echo -e "${GREEN}✅ $agent_name passed${NC}"
    else
        echo -e "${RED}❌ $agent_name failed${NC}"
        FAILED=$((FAILED + 1))
    fi
}

# Parse arguments
TEST_TYPE="${1:-all}"

case "$TEST_TYPE" in
    e2e)
        run_agent "E2E Tests" "e2e-agent.sh"
        ;;
    visual)
        run_agent "Visual Tests" "visual-agent.sh"
        ;;
    accessibility)
        run_agent "Accessibility Tests" "accessibility-agent.sh"
        ;;
    all|"")
        run_agent "E2E Tests" "e2e-agent.sh"
        run_agent "Visual Tests" "visual-agent.sh"
        run_agent "Accessibility Tests" "accessibility-agent.sh"
        ;;
    *)
        echo "Unknown test type: $TEST_TYPE"
        echo "Usage: ./testing-agent.sh [e2e|visual|accessibility|all]"
        exit 1
        ;;
esac

echo ""
echo "======================================"
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed${NC}"
    exit 0
else
    echo -e "${RED}❌ $FAILED test suite(s) failed${NC}"
    exit 1
fi
