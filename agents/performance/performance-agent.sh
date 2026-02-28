#!/bin/bash

# Performance Agent - Main Orchestrator
# Runs all performance sub-agents

set -e

echo "📊 RIGOR Performance Agent - Starting..."
echo "========================================="

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
AGENT_TYPE="${1:-all}"

case "$AGENT_TYPE" in
    lighthouse)
        run_agent "Lighthouse Agent" "lighthouse-agent.sh"
        ;;
    bundle)
        run_agent "Bundle Agent" "bundle-agent.sh"
        ;;
    all|"")
        run_agent "Bundle Agent" "bundle-agent.sh"
        run_agent "Lighthouse Agent" "lighthouse-agent.sh"
        ;;
    *)
        echo "Unknown agent type: $AGENT_TYPE"
        echo "Usage: ./performance-agent.sh [lighthouse|bundle|all]"
        exit 1
        ;;
esac

echo ""
echo "========================================="
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All performance checks passed${NC}"
    exit 0
else
    echo -e "${RED}❌ $FAILED check(s) failed${NC}"
    exit 1
fi
