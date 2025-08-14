#!/bin/bash

# Hyperliquid Functionality Testing Script
# This script runs all tests for the Hyperliquid functionality

echo "🚀 Starting Hyperliquid Functionality Tests"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_warning "node_modules not found. Installing dependencies..."
    npm install
fi

# Check if required packages are installed
print_status "Checking dependencies..."
npm list jest > /dev/null 2>&1
if [ $? -ne 0 ]; then
    print_warning "Jest not found. Installing test dependencies..."
    npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest
fi

# Run typecheck first
print_status "Running TypeScript checks..."
npm run typecheck
if [ $? -ne 0 ]; then
    print_error "TypeScript errors found. Please fix them before running tests."
    exit 1
fi

print_success "TypeScript checks passed"

# Run linting
print_status "Running ESLint checks..."
npm run lint
if [ $? -ne 0 ]; then
    print_warning "Linting issues found. Consider running 'npm run lint:fix'"
fi

# Run unit tests
print_status "Running Hyperliquid Provider unit tests..."
npm run test:hyperliquid
if [ $? -ne 0 ]; then
    print_error "Unit tests failed"
    exit 1
fi
print_success "Unit tests passed"

# Run integration tests
print_status "Running integration tests..."
npm run test:integration
if [ $? -ne 0 ]; then
    print_error "Integration tests failed"
    exit 1
fi
print_success "Integration tests passed"

# Run error handling tests
print_status "Running error handling tests..."
npm run test:errors
if [ $? -ne 0 ]; then
    print_error "Error handling tests failed"
    exit 1
fi
print_success "Error handling tests passed"

# Run full test suite with coverage
print_status "Running full test suite with coverage..."
npm run test:coverage
if [ $? -ne 0 ]; then
    print_error "Coverage test failed"
    exit 1
fi
print_success "Full test suite passed with coverage"

# Manual testing reminder
echo ""
echo "🎉 All automated tests passed!"
echo ""
print_status "Next steps for manual testing:"
echo "1. Start the development server: npm run dev"
echo "2. Navigate to http://localhost:3000/pwa"
echo "3. Follow the manual testing guide in HYPERLIQUID_TESTING_GUIDE.md"
echo "4. Test the following scenarios:"
echo "   - Connection without private key (mock SDK)"
echo "   - Connection with testnet private key (if available)"
echo "   - Price data retrieval for different symbols"
echo "   - Limit and market order placement"
echo "   - Order cancellation"
echo "   - Error handling and recovery"
echo ""
print_success "Testing complete! 🎉"
