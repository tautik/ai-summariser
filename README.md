# AI Content Summarizer

A web application that aggregates and summarizes Twitter content for a given user handle. The application uses mock data for development and provides a clean, user-friendly interface to view the summarized content.

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
npm run install-deps
```

## Configuration

The backend uses environment variables for configuration. A `.env` file is already set up in the backend directory with the following variables:

```
PORT=5001
SOCIAL_DATA_API_KEY=2315|FcPglN4lMDKYHFVglhpS5nr6m8ynOtE02oDP5K18407e911d
```

Note: The current implementation uses mock data for Twitter API responses by default. To use the real SocialData API, set `useMockData = false` in the `fetchTwitterData` function in `backend/src/services/socialDataService.ts`.

## Running the Application

### Development Mode

To run both the frontend and backend in development mode:

```bash
# From the project root
npm run dev
```

This will start:
- Backend server on http://localhost:5001
- Frontend development server on http://localhost:5173

### Production Build

To build both the frontend and backend for production:

```bash
# From the project root
npm run build
```

### Starting Production Server

To start the application in production mode after building:

```bash
# From the project root
npm start
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

This project can integrate with the [SocialData API](https://docs.socialdata.tools/) to fetch real Twitter data. The integration is currently set to use mock data by default, but can be configured to use the real API.

### Testing the API

To test the SocialData API endpoints:

```bash
# From the project root
./run.sh test-api
```

This will run a series of tests against the SocialData API and save the results in the `backend/test-results` directory.

### Available Endpoints

The following SocialData API endpoints are used in this project:

- `/twitter/search?query=from%3A{handle}&type=Latest` - Search for tweets from a specific user
- `/twitter/tweets/{tweet_id}` - Get details for a specific tweet

For more information about the SocialData API, see the [documentation](https://docs.socialdata.tools/).

## Troubleshooting

If you encounter port conflicts:

1. Kill all Node.js processes related to the project:
   ```bash
   pkill -f "node.*ai-summariser"
   ```
2. Restart the application:
   ```bash
   npm run dev
   ```

## Future Improvements

- Implement real Twitter API integration
- Add user authentication
- Implement caching for improved performance
- Add more social media platforms

## License

This project is licensed under the MIT License. 