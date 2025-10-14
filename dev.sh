#!/bin/bash

# Novellia Pets Development Helper Script

echo "🐕 Novellia Pets Development Helper"
echo "=================================="

case "$1" in
  "start")
    echo "🚀 Starting development environment..."
    make stop
    sleep 2
    make dev-separate
    ;;
  "stop")
    echo "🛑 Stopping all processes..."
    make stop
    ;;
  "restart")
    echo "🔄 Restarting development environment..."
    make stop
    sleep 3
    make dev-separate
    ;;
  "server")
    echo "🖥️  Starting API server only..."
    make stop
    sleep 2
    make server
    ;;
  "client")
    echo "📱 Starting React Native app only..."
    make client
    ;;
  "health")
    echo "🏥 Checking API server health..."
    make health
    ;;
  "status")
    echo "📊 Checking running processes..."
    echo "API Server:"
    curl -s http://localhost:3001/api/health > /dev/null && echo "✅ Running" || echo "❌ Not running"
    echo "Expo:"
    pgrep -f "expo start" > /dev/null && echo "✅ Running" || echo "❌ Not running"
    echo "Ports:"
    lsof -i:3001,8081,8082 2>/dev/null || echo "All ports are free"
    ;;
  *)
    echo "Usage: ./dev.sh {start|stop|restart|server|client|health|status}"
    echo ""
    echo "Commands:"
    echo "  start    - Start both API server and React Native app"
    echo "  stop     - Stop all running processes"
    echo "  restart  - Stop and restart everything"
    echo "  server   - Start only the API server"
    echo "  client   - Start only the React Native app"
    echo "  health   - Check API server health"
    echo "  status   - Show status of all processes"
    ;;
esac
