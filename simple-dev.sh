#!/bin/bash

# Simple development script - just React Native with mock data
# No API server needed!

echo "🐕 Novellia Pets - Simple Development Mode"
echo "=========================================="
echo "Using mock data - no API server needed!"
echo ""

# Stop any existing processes
echo "🛑 Stopping any existing processes..."
pkill -f "expo start" 2>/dev/null || true
pkill -f "metro" 2>/dev/null || true
lsof -ti:8081 | xargs kill -9 2>/dev/null || true
lsof -ti:8082 | xargs kill -9 2>/dev/null || true

echo "Waiting for ports to be free..."
sleep 2

echo "🚀 Starting React Native app with mock data..."
echo "📱 The app will work with mock data - no network issues!"
echo ""

# Start Expo
npm start
