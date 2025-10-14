.PHONY: install dev server client clean

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
	@echo "Starting development environment..."
	npm run dev

# Start only the API server
server:
	npm run server

# Start only the React Native app
client:
	npm start

# Start API server and React Native app separately (recommended)
dev-separate:
	@echo "Starting API server in background..."
	@npm run server &
	@echo "Waiting for API server to start..."
	@sleep 3
	@echo "Starting React Native app..."
	@npm start

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
	@lsof -ti:3001 | xargs kill -9 2>/dev/null || echo "Port 3001 is free"
	@lsof -ti:8081 | xargs kill -9 2>/dev/null || echo "Port 8081 is free"
	@lsof -ti:8082 | xargs kill -9 2>/dev/null || echo "Port 8082 is free"

# Health check for API server
health:
	curl http://localhost:3001/api/health

# Test API endpoints
test-api:
	@echo "Testing API endpoints..."
	@echo "Health check:"
	@curl -s http://localhost:3001/api/health | jq .
	@echo "\nPets for dev user:"
	@curl -s "http://localhost:3001/api/pets?userId=dev-user-1" | jq .
