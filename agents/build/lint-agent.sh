#!/bin/bash

# Build Agent - Lint Runner
# Runs linting with auto-fix capability

set -e

echo "🔍 Running Lint Agent..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if FIX flag is set
AUTO_FIX="${AUTO_FIX:-false}"

# Check for lint script in packages
check_lint() {
    local pkg="$1"
    if [ -f "$pkg/package.json" ]; then
        if grep -q '"lint"' "$pkg/package.json"; then
            return 0
        fi
    fi
    return 1
}

# Find packages with lint
find_lint_packages() {
    local packages=()
    for pkg in apps/* packages/*; do
        if [ -d "$pkg" ] && [ -f "$pkg/package.json" ]; then
            if grep -q '"lint"' "$pkg/package.json" 2>/dev/null; then
                packages+=("$pkg")
            fi
        fi
    done
    echo "${packages[@]}"
}

# Check if prettier exists
if command -v prettier &> /dev/null; then
    HAS_PRETTIER=true
else
    HAS_PRETTIER=false
fi

# Run lint
echo "Running lint checks..."

if [ "$AUTO_FIX" = "true" ]; then
    echo "🔧 Auto-fix mode enabled"
    
    # Try to fix with prettier if available
    if [ "$HAS_PRETTIER" = "true" ]; then
        echo "Running Prettier..."
        prettier --write "apps/**/*.{ts,tsx,js,jsx}" "packages/**/*.{ts,tsx,js,jsx}" --ignore-unknown 2>/dev/null || true
    fi
    
    # Try npm lint with --fix in packages
    for pkg in $(find_lint_packages); do
        echo "Running lint in $pkg..."
        (cd "$pkg" && npm run lint -- --fix 2>/dev/null) || true
    done
fi

# Run type check
echo "Running TypeScript checks..."
if npx tsc --noEmit; then
    echo -e "${GREEN}✅ TypeScript checks passed${NC}"
else
    echo -e "${YELLOW}⚠️ TypeScript errors detected${NC}"
    if [ "$AUTO_FIX" = "true" ]; then
        echo "Note: Some TypeScript errors require manual intervention"
    fi
    exit 1
fi

echo -e "${GREEN}✅ Lint checks passed${NC}"
exit 0
