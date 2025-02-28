import { Router, RequestHandler } from 'express';
import { getSocialData, summarizeUserContent } from '../controllers/socialDataController';

const router = Router();

// Get social data for a specific Twitter handle
router.get('/twitter/:handle', getSocialData as RequestHandler);

// Generate a summary of user content
router.post('/summarize', summarizeUserContent as RequestHandler);

export const socialDataRoutes = router; 