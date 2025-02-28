# SocialData API Tests

This directory contains tests and documentation for the SocialData API, which provides access to Twitter data.

## Files

- `socialdata-api-tests.ts` - Contains test functions for each SocialData API endpoint
- `run-api-tests.ts` - Script to run specific API tests from the command line
- `test-socialdata-api.sh` - Shell script wrapper for running tests with a friendly interface
- `socialdata-api-docs.md` - Comprehensive documentation of the SocialData API endpoints

## Running Tests

You can run the tests using the provided shell script:

```bash
# Make sure the script is executable
chmod +x test-socialdata-api.sh

# Show help
./test-socialdata-api.sh help

# Test Twitter Search API
./test-socialdata-api.sh search "from:elonmusk"

# Test Twitter User by Username API
./test-socialdata-api.sh user elonmusk

# Test Twitter User Tweets API (requires user ID)
./test-socialdata-api.sh tweets 44196397

# Test Twitter User Following API (requires user ID)
./test-socialdata-api.sh following 44196397

# Run all tests
./test-socialdata-api.sh all
```

## API Endpoints

The SocialData API provides the following endpoints:

1. **Twitter Search** - `GET /twitter/search`
   - Search for tweets using Twitter search operators
   - Parameters: `query`, `cursor`, `type`

2. **Twitter User by Username** - `GET /v1/twitter/users/by/username/{username}`
   - Get detailed information about a Twitter user
   - Parameters: `username`

3. **Twitter User Tweets** - `GET /v1/twitter/users/{userId}/tweets`
   - Get tweets posted by a specific Twitter user
   - Parameters: `userId`, `max_results`

4. **Twitter User Following** - `GET /v1/twitter/users/{userId}/following`
   - Get users that a specific Twitter user is following
   - Parameters: `userId`, `max_results`

For more detailed documentation, see `socialdata-api-docs.md`.

## Authentication

All API requests require authentication using an API key. The API key should be included in the `Authorization` header as a Bearer token:

```
Authorization: Bearer YOUR_API_KEY
```

The API key is loaded from the `.env` file in the backend directory. Make sure to set the `SOCIAL_DATA_API_KEY` environment variable in the `.env` file before running the tests.

## Known Issues

- The SocialData API may return a 404 error for some endpoints if the API key is invalid or the endpoint has changed.
- Twitter removes tweets flagged as spam, or all tweets from shadow-banned users.
- When retrieving large datasets, Twitter eventually refuses to provide additional cursor values after scraping too many pages with "Latest" search filter. 