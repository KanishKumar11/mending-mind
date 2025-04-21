#!/bin/bash

# Print Node.js version
echo "Using Node.js version:"
node -v

# Install dependencies with legacy peer deps
npm install --legacy-peer-deps

# Temporarily disable ESLint during build
echo "Temporarily disabling ESLint for build..."
export DISABLE_ESLINT_PLUGIN=true

# Run the build
npm run build

# Exit with the build status
exit $?
