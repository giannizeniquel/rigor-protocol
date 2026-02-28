#!/bin/bash

# i18n Agent - Consistency Checker
# Verifies translation consistency across locales

set -e

echo "🔄 Running i18n Consistency Agent..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

I18N_FILE="apps/web/src/i18n/ui.ts"

echo "Checking translation consistency..."

# Count keys per locale
EN_COUNT=$(grep -oP "^\s+'[a-z]" "$I18N_FILE" | grep -c "^  'en\." || echo 0)
ES_COUNT=$(grep -oP "^\s+'[a-z]" "$I18N_FILE" | grep -c "^  'es\." || echo 0)

echo "English keys: $EN_COUNT"
echo "Spanish keys: $ES_COUNT"

if [ "$EN_COUNT" -eq "$ES_COUNT" ]; then
    echo -e "${GREEN}✅ Key counts match${NC}"
else
    echo -e "${YELLOW}⚠️ Key count mismatch: EN($EN_COUNT) vs ES($ES_COUNT)${NC}"
    echo "Run translation-agent.sh to find missing keys"
fi

# Check for hardcoded strings in components
echo ""
echo "Checking for hardcoded strings in components..."
HARDCODE_COUNT=0

for component in apps/web/src/components/*.astro; do
    if [ -f "$component" ]; then
        # Look for common hardcoded English strings
        if grep -qE "(Welcome|Get Started|Learn More)" "$component" 2>/dev/null; then
            echo -e "${YELLOW}⚠️ Potential hardcoded string in $(basename $component)${NC}"
            HARDCODE_COUNT=$((HARDCODE_COUNT + 1))
        fi
    fi
done

if [ $HARDCODE_COUNT -eq 0 ]; then
    echo -e "${GREEN}✅ No obvious hardcoded strings found${NC}"
fi

exit 0
