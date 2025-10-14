.PHONY: install dev ios clean stop health

# Install dependencies
install:
	npm install

# Start both API server and React Native app
dev:
	@echo "Starting Novellia Pets development environment..."
	@echo "Cleaning up any existing processes..."
	@make stop > /dev/null 2>&1 || true
	@echo "Waiting for ports to be free..."
	@sleep 3
	@echo "Starting API server and React Native app..."
	npm run dev

# Start React Native app on iOS simulator
ios:
	npm run ios

# Clean node_modules and reinstall
clean:
	rm -rf node_modules package-lock.json
	npm install

# Stop any running servers
stop:
	@echo "Stopping any running servers..."
	@pkill -f "node server.js" || echo "No server processes found"
	@pkill -f "expo start" || echo "No Expo processes found"
	@pkill -f "metro" || echo "No Metro processes found"
	@pkill -f "concurrently" || echo "No concurrently processes found"
	@echo "Forcefully killing processes on ports 3001, 8081, 8082..."
	@lsof -ti:3001 | xargs kill -9 2>/dev/null || echo "Port 3001 is free"
	@lsof -ti:8081 | xargs kill -9 2>/dev/null || echo "Port 8081 is free"
	@lsof -ti:8082 | xargs kill -9 2>/dev/null || echo "Port 8082 is free"
	@echo "Waiting for ports to be fully released..."
	@sleep 2
	@echo "Cleanup complete!"

# Health check for API server
health:
	curl http://localhost:3001/api/health