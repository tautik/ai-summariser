import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { socialDataRoutes } from './routes/socialDataRoutes';
import { emailRoutes } from './routes/emailRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/social', socialDataRoutes);
app.use('/api/email', emailRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Key: ${process.env.SOCIAL_DATA_API_KEY}`);
  console.log(`API Base URL: ${process.env.SOCIAL_DATA_API_BASE_URL}`);
}); 