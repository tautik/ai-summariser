#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}=== SocialData API Test Script ===${NC}"
echo -e "${BLUE}This script helps test the SocialData API endpoints${NC}"
echo ""

# Function to show help
show_help() {
  echo -e "${YELLOW}Usage:${NC}"
  echo -e "  ${GREEN}./test-socialdata-api.sh${NC} ${YELLOW}<command>${NC} ${YELLOW}[parameter]${NC}"
  echo ""
  echo -e "${YELLOW}Commands:${NC}"
  echo -e "  ${GREEN}search${NC} ${YELLOW}<query>${NC}       Test Twitter Search API"
  echo -e "  ${GREEN}user${NC} ${YELLOW}<username>${NC}      Test Twitter User by Username API"
  echo -e "  ${GREEN}tweets${NC} ${YELLOW}<userId>${NC}      Test Twitter User Tweets API"
  echo -e "  ${GREEN}following${NC} ${YELLOW}<userId>${NC}   Test Twitter User Following API"
  echo -e "  ${GREEN}all${NC}                Run all tests"
  echo -e "  ${GREEN}help${NC}               Show this help message"
  echo ""
  echo -e "${YELLOW}Examples:${NC}"
  echo -e "  ${GREEN}./test-socialdata-api.sh search${NC} ${YELLOW}\"from:elonmusk\"${NC}"
  echo -e "  ${GREEN}./test-socialdata-api.sh user${NC} ${YELLOW}elonmusk${NC}"
  echo -e "  ${GREEN}./test-socialdata-api.sh tweets${NC} ${YELLOW}44196397${NC}"
  echo -e "  ${GREEN}./test-socialdata-api.sh following${NC} ${YELLOW}44196397${NC}"
  echo -e "  ${GREEN}./test-socialdata-api.sh all${NC}"
}

# Check if ts-node is installed
if ! command -v ts-node &> /dev/null; then
  echo -e "${RED}Error: ts-node is not installed.${NC}"
  echo -e "Please install it using: ${GREEN}npm install -g ts-node${NC}"
  exit 1
fi

# Check if we have at least one argument
if [ $# -lt 1 ]; then
  show_help
  exit 1
fi

# Get the command
COMMAND=$1

# Execute the appropriate test based on the command
case $COMMAND in
  search)
    if [ $# -lt 2 ]; then
      echo -e "${RED}Error: Missing search query parameter.${NC}"
      echo -e "Usage: ${GREEN}./test-socialdata-api.sh search${NC} ${YELLOW}\"<query>\"${NC}"
      exit 1
    fi
    QUERY=$2
    echo -e "${BLUE}Running Twitter Search test with query:${NC} ${YELLOW}$QUERY${NC}"
    cd "$(dirname "$0")" && ts-node run-api-tests.ts search "$QUERY"
    ;;
    
  user)
    if [ $# -lt 2 ]; then
      echo -e "${RED}Error: Missing username parameter.${NC}"
      echo -e "Usage: ${GREEN}./test-socialdata-api.sh user${NC} ${YELLOW}<username>${NC}"
      exit 1
    fi
    USERNAME=$2
    echo -e "${BLUE}Running Twitter User by Username test for:${NC} ${YELLOW}$USERNAME${NC}"
    cd "$(dirname "$0")" && ts-node run-api-tests.ts user "$USERNAME"
    ;;
    
  tweets)
    if [ $# -lt 2 ]; then
      echo -e "${RED}Error: Missing userId parameter.${NC}"
      echo -e "Usage: ${GREEN}./test-socialdata-api.sh tweets${NC} ${YELLOW}<userId>${NC}"
      exit 1
    fi
    USER_ID=$2
    echo -e "${BLUE}Running Twitter User Tweets test for user ID:${NC} ${YELLOW}$USER_ID${NC}"
    cd "$(dirname "$0")" && ts-node run-api-tests.ts tweets "$USER_ID"
    ;;
    
  following)
    if [ $# -lt 2 ]; then
      echo -e "${RED}Error: Missing userId parameter.${NC}"
      echo -e "Usage: ${GREEN}./test-socialdata-api.sh following${NC} ${YELLOW}<userId>${NC}"
      exit 1
    fi
    USER_ID=$2
    echo -e "${BLUE}Running Twitter User Following test for user ID:${NC} ${YELLOW}$USER_ID${NC}"
    cd "$(dirname "$0")" && ts-node run-api-tests.ts following "$USER_ID"
    ;;
    
  all)
    echo -e "${BLUE}Running all SocialData API tests${NC}"
    cd "$(dirname "$0")" && ts-node run-api-tests.ts all
    ;;
    
  help)
    show_help
    ;;
    
  *)
    echo -e "${RED}Error: Unknown command '${COMMAND}'.${NC}"
    show_help
    exit 1
    ;;
esac 