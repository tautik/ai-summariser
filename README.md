# AI Content Summarizer

A web application that aggregates and summarizes Twitter content for a given user handle. The application uses the Social Data API to fetch Twitter data and provides a clean, user-friendly interface to view the summarized content.

## Features

- Fetch Twitter user profiles, tweets, and following data
- Summarize user content and activity
- Clean, responsive UI built with React and Chakra UI
- RESTful API backend built with Node.js and Express

## Project Structure

The project is divided into two main parts:

- **Frontend**: React application built with Vite and TypeScript
- **Backend**: Node.js API built with Express and TypeScript

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install dependencies for both frontend and backend:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Configuration

Create a `.env` file in the backend directory with the following variables:

```
PORT=5000
SOCIAL_DATA_API_KEY=your_api_key
```

### Running the Application

#### Development Mode

1. Start the backend server:

```bash
cd backend
npm run dev
```

2. Start the frontend development server:

```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

#### Production Mode

1. Build the frontend:

```bash
cd frontend
npm run build
```

2. Build the backend:

```bash
cd backend
npm run build
```

3. Start the backend server:

```bash
cd backend
npm start
```

## API Endpoints

- `GET /api/social/twitter/:handle` - Get Twitter data for a specific handle
- `POST /api/social/summarize` - Generate a summary of user content

## Technologies Used

- **Frontend**:
  - React
  - TypeScript
  - Chakra UI
  - Axios
  - Vite

- **Backend**:
  - Node.js
  - Express
  - TypeScript
  - Axios

## License

This project is licensed under the MIT License. 