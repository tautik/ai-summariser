#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to display help
show_help() {
  echo -e "${GREEN}AI Content Summarizer - Helper Script${NC}"
  echo ""
  echo "Usage: ./run.sh [command]"
  echo ""
  echo "Commands:"
  echo "  setup       - Install all dependencies"
  echo "  dev         - Run the application in development mode"
  echo "  dev:mock    - Run the application with mock data (default)"
  echo "  dev:real    - Run the application with real API data"
  echo "  build       - Build the application for production"
  echo "  start       - Start the application in production mode"
  echo "  clean       - Kill all Node.js processes related to the project"
  echo "  restart     - Restart the application (clean + dev)"
  echo "  test-api    - Test the SocialData API endpoints"
  echo "  help        - Show this help message"
  echo ""
}

# Function to install dependencies
setup() {
  echo -e "${YELLOW}Installing dependencies...${NC}"
  npm install
  cd backend && npm install
  cd ../frontend && npm install
  cd ..
  echo -e "${GREEN}Dependencies installed successfully!${NC}"
}

# Function to run in development mode
run_dev() {
  echo -e "${YELLOW}Starting application in development mode...${NC}"
  npm run dev
}

# Function to run with mock data
run_dev_mock() {
  echo -e "${YELLOW}Starting application with mock data...${NC}"
  cd backend && npm run dev:mock
}

# Function to run with real API data
run_dev_real() {
  echo -e "${YELLOW}Starting application with real API data...${NC}"
  cd backend && npm run dev:real
}

# Function to build for production
build() {
  echo -e "${YELLOW}Building application for production...${NC}"
  cd backend && npm run build
  cd ../frontend && npm run build
  cd ..
  echo -e "${GREEN}Build completed successfully!${NC}"
}

# Function to start in production mode
start() {
  echo -e "${YELLOW}Starting application in production mode...${NC}"
  cd backend && npm start
}

# Function to kill all related processes
clean() {
  echo -e "${YELLOW}Killing all Node.js processes related to the project...${NC}"
  pkill -f "node.*ai-summariser" || echo -e "${RED}No processes found to kill${NC}"
  echo -e "${GREEN}Processes terminated!${NC}"
}

# Function to restart the application
restart() {
  clean
  run_dev
}

# Function to test the API
test_api() {
  echo -e "${YELLOW}Testing the SocialData API endpoints...${NC}"
  cd backend && npm run test-api
  echo -e "${GREEN}API tests completed!${NC}"
}

# Main script logic
case "$1" in
  setup)
    setup
    ;;
  dev)
    run_dev
    ;;
  dev:mock)
    run_dev_mock
    ;;
  dev:real)
    run_dev_real
    ;;
  build)
    build
    ;;
  start)
    start
    ;;
  clean)
    clean
    ;;
  restart)
    restart
    ;;
  test-api)
    test_api
    ;;
  help|*)
    show_help
    ;;
esac 