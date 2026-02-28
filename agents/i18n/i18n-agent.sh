#!/bin/bash

# i18n Agent - Main Orchestrator
# Runs all i18n sub-agents

set -e

echo "🌐 RIGOR i18n Agent - Starting..."
echo "=================================="

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
    translation)
        run_agent "Translation Validator" "translation-agent.sh"
        ;;
    consistency)
        run_agent "Consistency Checker" "consistency-agent.sh"
        ;;
    all|"")
        run_agent "Translation Validator" "translation-agent.sh"
        run_agent "Consistency Checker" "consistency-agent.sh"
        ;;
    *)
        echo "Unknown agent type: $AGENT_TYPE"
        echo "Usage: ./i18n-agent.sh [translation|consistency|all]"
        exit 1
        ;;
esac

echo ""
echo "=================================="
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All i18n checks passed${NC}"
    exit 0
else
    echo -e "${RED}❌ $FAILED check(s) failed${NC}"
    exit 1
fi
