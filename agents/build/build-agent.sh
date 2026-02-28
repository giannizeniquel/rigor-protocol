#!/bin/bash

# Build Agent - Turbo Build Runner
# Builds the project with turbo

set -e

echo "🔨 Running Build Agent..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Build target (default: all)
BUILD_TARGET="${1:-all}"

echo "Building target: $BUILD_TARGET"

case "$BUILD_TARGET" in
    web)
        echo "Building web app..."
        if npm run build:web; then
            echo -e "${GREEN}✅ Web build succeeded${NC}"
            exit 0
        else
            echo -e "${RED}❌ Web build failed${NC}"
            exit 1
        fi
        ;;
    docs)
        echo "Building docs..."
        if npm run build:docs; then
            echo -e "${GREEN}✅ Docs build succeeded${NC}"
            exit 0
        else
            echo -e "${RED}❌ Docs build failed${NC}"
            exit 1
        fi
        ;;
    all|"")
        echo "Building all packages..."
        if npm run build; then
            echo -e "${GREEN}✅ Full build succeeded${NC}"
            exit 0
        else
            echo -e "${RED}❌ Full build failed${NC}"
            exit 1
        fi
        ;;
    *)
        echo "Unknown build target: $BUILD_TARGET"
        echo "Usage: ./build-agent.sh [web|docs|all]"
        exit 1
        ;;
esac
