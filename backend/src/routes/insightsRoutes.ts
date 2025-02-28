import { Router, RequestHandler } from 'express';
import { getAIInsights, getServiceInsights } from '../controllers/insightsController';

const router = Router();

// Get AI insights based on connected services
router.post('/ai-insights', getAIInsights as RequestHandler);

// Get service-specific insights
router.get('/service/:service', getServiceInsights as RequestHandler);

export const insightsRoutes = router; 