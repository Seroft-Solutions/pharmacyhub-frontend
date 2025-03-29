#!/bin/bash

# Component Size Analyzer Runner Script
# This script installs dependencies and runs the component size analyzer

# Set error handling
set -e

echo "Installing dependencies for component size analyzer..."
npm install

echo "Running component size analysis on src directory..."
node analyze-component-sizes.js ../../src

echo "Analysis complete!"
