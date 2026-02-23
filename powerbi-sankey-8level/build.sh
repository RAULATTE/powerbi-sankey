#!/bin/bash

# Power BI Sankey Visual - Build Script
# This script helps you build and package the custom visual

set -e  # Exit on error

echo "================================================"
echo "  Power BI Sankey Visual - Build Script"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Change to visual directory
cd "$(dirname "$0")"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} npm version: $(npm --version)"

# Check if pbiviz is installed
if ! command -v pbiviz &> /dev/null; then
    echo -e "${YELLOW}⚠${NC}  Power BI Visuals Tools not found"
    echo "Installing globally..."
    npm install -g powerbi-visuals-tools
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install powerbi-visuals-tools${NC}"
        echo "Try running: sudo npm install -g powerbi-visuals-tools"
        exit 1
    fi
fi

echo -e "${GREEN}✓${NC} Power BI Visuals Tools: $(pbiviz --version | head -1)"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install dependencies${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓${NC} Dependencies installed"
else
    echo -e "${GREEN}✓${NC} Dependencies already installed"
fi

echo ""
echo "🔨 Building and packaging visual..."
npm run package

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo ""
echo "================================================"
echo -e "${GREEN}✅ BUILD SUCCESSFUL!${NC}"
echo "================================================"
echo ""

# Find the .pbiviz file
PBIVIZ_FILE=$(find dist -name "*.pbiviz" 2>/dev/null | head -1)

if [ -n "$PBIVIZ_FILE" ]; then
    FILE_SIZE=$(du -h "$PBIVIZ_FILE" | cut -f1)
    echo "📦 Package created:"
    echo "   File: $PBIVIZ_FILE"
    echo "   Size: $FILE_SIZE"
    echo ""
    echo "Next steps:"
    echo "1. Open Power BI Desktop"
    echo "2. Go to Visualizations pane"
    echo "3. Click '...' → 'Import a visual from a file'"
    echo "4. Select: $PBIVIZ_FILE"
    echo "5. Click 'Import'"
    echo ""
else
    echo -e "${YELLOW}⚠${NC}  Package file not found in dist/"
    echo "Check for errors above."
fi

echo "================================================"
