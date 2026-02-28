#!/bin/bash

# Performance Agent - Bundle Analyzer
# Analyzes bundle sizes

set -e

echo "📦 Running Bundle Analysis Agent..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if build exists
if [ ! -d "apps/web/dist" ]; then
    echo "Build not found, running build first..."
    npm run build:web
fi

echo "Analyzing bundle sizes..."
echo ""

# Find large files in dist
echo "Largest files in dist/:"
find apps/web/dist -type f -name "*.js" -o -name "*.css" | head -20 | while read -r file; do
    size=$(du -h "$file" | cut -f1)
    echo "  $size - ${file#apps/web/dist/}"
done

# Count total size
echo ""
total_size=$(du -sh apps/web/dist | cut -f1)
echo "Total dist size: $total_size"

# Check for large bundles (> 500KB)
LARGE_THRESHOLD=500
echo ""
echo "Checking for large bundles (> ${LARGE_THRESHOLD}KB)..."
large_files=$(find apps/web/dist -type f \( -name "*.js" -o -name "*.css" \) -size +${LARGE_THRESHOLD}k -exec ls -lh {} \; 2>/dev/null || true)

if [ -n "$large_files" ]; then
    echo -e "${YELLOW}⚠️ Large bundles detected:${NC}"
    echo "$large_files" | awk '{print "  " $5 " - " $9}' | sed 's|apps/web/dist/||'
    echo ""
    echo "📋 Consider code splitting or lazy loading"
else
    echo -e "${GREEN}✅ No oversized bundles found${NC}"
fi

exit 0
