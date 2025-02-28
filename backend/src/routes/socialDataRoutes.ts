import express from 'express';
import { getSocialData, summarizeUserContent } from '../controllers/socialDataController';

const router = express.Router();

// Get social data for a specific Twitter handle
router.get('/twitter/:handle', getSocialData);

// Get summarized content for a user
router.post('/summarize', summarizeUserContent);

export const socialDataRoutes = router; 