#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Skills API Services...${NC}"

# Function to kill process on a port
kill_port() {
    local port=$1
    echo -e "${YELLOW}🔍 Checking port $port...${NC}"
    
    # Find and kill process using the port
    local pid=$(lsof -ti:$port)
    if [ ! -z "$pid" ]; then
        echo -e "${YELLOW}⚠️  Found process $pid using port $port, killing it...${NC}"
        kill -9 $pid
        sleep 2
        echo -e "${GREEN}✅ Port $port cleared${NC}"
    else
        echo -e "${GREEN}✅ Port $port is already free${NC}"
    fi
}

# Clear required ports
echo -e "${BLUE}🧹 Clearing required ports...${NC}"
kill_port 8009  # Go server port
kill_port 8002  # Python FastAPI port

# Compile Go server
echo -e "${BLUE}🔨 Compiling Go server...${NC}"
if go build -o server_binary server.go; then
    echo -e "${GREEN}✅ Go server compiled successfully${NC}"
else
    echo -e "${RED}❌ Failed to compile Go server${NC}"
    exit 1
fi

# Start Go server in background
echo -e "${BLUE}🚀 Starting Go server on port 8009...${NC}"
./server_binary &
GO_PID=$!
echo -e "${GREEN}✅ Go server started with PID: $GO_PID${NC}"

# Wait a moment for Go server to start
sleep 3

# Check if Go server is running
if curl -s http://localhost:8009/swagger/index.html > /dev/null; then
    echo -e "${GREEN}✅ Go server is responding${NC}"
else
    echo -e "${RED}❌ Go server is not responding${NC}"
fi

# Start Python FastAPI server in background (if requirements are met)
echo -e "${BLUE}🐍 Starting Python FastAPI server on port 8002...${NC}"
if command -v uvicorn &> /dev/null; then
    uvicorn server:app --host 0.0.0.0 --port 8002 &
    PYTHON_PID=$!
    echo -e "${GREEN}✅ Python FastAPI server started with PID: $PYTHON_PID${NC}"
    
    # Wait a moment for Python server to start
    sleep 3
    
    # Check if Python server is running
    if curl -s http://localhost:8002/docs > /dev/null; then
        echo -e "${GREEN}✅ Python FastAPI server is responding${NC}"
    else
        echo -e "${YELLOW}⚠️  Python FastAPI server may not be responding${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  uvicorn not found, skipping Python server${NC}"
    echo -e "${YELLOW}   Install with: pip install uvicorn fastapi${NC}"
fi

echo -e "${GREEN}🎉 All services started!${NC}"
echo -e "${BLUE}📋 Service URLs:${NC}"
echo -e "${GREEN}   Go Server (Swagger): http://localhost:8009/swagger/index.html${NC}"
echo -e "${GREEN}   Go Server API: http://localhost:8009${NC}"
if command -v uvicorn &> /dev/null; then
    echo -e "${GREEN}   Python FastAPI: http://localhost:8002/docs${NC}"
fi

echo -e "${YELLOW}💡 To stop all services, run: pkill -f server_binary && pkill -f uvicorn${NC}"

# Keep script running and show logs
echo -e "${BLUE}📊 Monitoring services... (Press Ctrl+C to stop)${NC}"
wait 