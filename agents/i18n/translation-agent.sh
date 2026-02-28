#!/bin/bash

# i18n Agent - Translation Validator
# Checks for missing translations between locales

set -e

echo "🌐 Running Translation Validator Agent..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

I18N_FILE="apps/web/src/i18n/ui.ts"
MISSING=0

# Extract keys from a locale
extract_keys() {
    local locale="$1"
    grep -oP "'${locale}\.[^']+'" "$I18N_FILE" | sed "s/'${locale}\.//g" | sed "s/'//g" | sort -u
}

# Get all English keys
echo "Checking for missing translations..."
EN_KEYS=$(extract_keys "en")
ES_KEYS=$(extract_keys "es")

# Find missing keys in Spanish
echo ""
echo "Missing translations (EN → ES):"
while IFS= read -r key; do
    if ! echo "$ES_KEYS" | grep -q "^${key}$"; then
        echo -e "${RED}  ✗ ${key}${NC}"
        MISSING=$((MISSING + 1))
    fi
done <<< "$EN_KEYS"

if [ $MISSING -eq 0 ]; then
    echo -e "${GREEN}✅ All translations complete${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️ $MISSING missing translation(s)${NC}"
    exit 1
fi
