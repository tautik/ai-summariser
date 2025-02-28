import { Router, RequestHandler } from 'express';
import { sendSummaryEmail } from '../controllers/emailController';

const router = Router();

// Send summary email
router.post('/send-summary', sendSummaryEmail as unknown as RequestHandler);

export const emailRoutes = router; 