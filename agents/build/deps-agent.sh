#!/bin/bash

# Build Agent - Dependency Auditor
# Checks for outdated packages and security vulnerabilities

set -e

echo "📦 Running Dependency Agent..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

AUDIT_FAILED=0

# Run npm audit
echo "Running security audit..."
if npm audit --audit-level=high; then
    echo -e "${GREEN}✅ No high severity vulnerabilities${NC}"
else
    echo -e "${YELLOW}⚠️ Security vulnerabilities detected${NC}"
    AUDIT_FAILED=1
fi

# Check for outdated packages
echo ""
echo "Checking for outdated packages..."
if npm outdated --depth=0 2>/dev/null; then
    echo -e "${YELLOW}⚠️ Some packages are outdated${NC}"
else
    echo -e "${GREEN}✅ All packages are up to date${NC}"
fi

# Exit with appropriate code
if [ $AUDIT_FAILED -eq 1 ]; then
    echo ""
    echo "📋 Run 'npm audit fix' to attempt automatic fixes"
    exit 1
fi

exit 0
