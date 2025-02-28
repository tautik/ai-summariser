# AI Content Summarizer

A web application that aggregates and summarizes Twitter content for a given user handle. The application integrates with the SocialData API to fetch real Twitter data and provides a clean, user-friendly interface to view the summarized content.

## Features

- View Twitter user profiles, tweets, and following data
- Get summarized content and activity for any Twitter handle
- Clean, responsive UI built with React and Chakra UI
- RESTful API backend built with Node.js and Express

## Project Structure

The project is divided into two main parts:

- **Frontend**: React application built with Vite and TypeScript
- **Backend**: Node.js API built with Express and TypeScript

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository
2. Install dependencies:

```bash
# Install all dependencies (frontend, backend, and root)
./run.sh setup
```

## Configuration

The backend uses environment variables for configuration. A `.env` file is already set up in the backend directory with the following variables:

```
PORT=5001
SOCIAL_DATA_API_KEY=2315|FcPglN4lMDKYHFVglhpS5nr6m8ynOtE02oDP5K18407e911d
```

Note: The application uses the real SocialData API by default. If you want to use mock data for testing, you can set `useMockData = true` in the `fetchTwitterData` function in `backend/src/services/socialDataService.ts` or use the `dev:mock` command (see below).

## Running the Application

### Development Mode

To run both the frontend and backend in development mode:

```bash
# From the project root
./run.sh dev
```

This will start:
- Backend server on http://localhost:5001
- Frontend development server on http://localhost:5173

### Running with Mock Data

To run the application with mock data:

```bash
# From the project root
./run.sh dev:mock
```

### Running with Real API Data (Default)

To run the application with real API data:

```bash
# From the project root
./run.sh dev:real
```

### Production Build

To build both the frontend and backend for production:

```bash
# From the project root
./run.sh build
```

### Starting Production Server

To start the application in production mode after building:

```bash
# From the project root
./run.sh start
```

## Usage

1. Open your browser and navigate to http://localhost:5173
2. Enter a Twitter handle (without the @ symbol) in the input field
3. Click the "Summarize" button
4. View the summarized content, including:
   - Profile information
   - Tweet summary
   - Recent tweets
   - Following information

## API Endpoints

- `GET /api/social/twitter/:handle` - Get Twitter data for a specific handle
- `POST /api/social/summarize` - Generate a summary of user content
- `GET /health` - Health check endpoint

## SocialData API Integration

This project integrates with the [SocialData API](https://docs.socialdata.tools/) to fetch real Twitter data. The integration uses the following endpoints:

### Testing the API

To test the SocialData API endpoints:

```bash
# From the project root
./run.sh test-api
```

This will run a series of tests against the SocialData API and save the results in the `backend/test-results` directory.

### Available Endpoints

The following SocialData API endpoints are used in this project:

- `/twitter/users/by/username/{username}` - Get user profile
- `/twitter/search?query=from%3A{handle}&type=Latest` - Search for tweets from a specific user
- `/twitter/users/{user_id}/following` - Get accounts the user follows

For more information about the SocialData API, see the [documentation](https://docs.socialdata.tools/).

## Troubleshooting

If you encounter port conflicts:

1. Kill all Node.js processes related to the project:
   ```bash
   ./run.sh clean
   ```
2. Restart the application:
   ```bash
   ./run.sh restart
   ```

## Future Improvements

- Add user authentication
- Implement caching for improved performance
- Add more social media platforms
- Add error handling for rate limiting

## License

This project is licensed under the MIT License. 