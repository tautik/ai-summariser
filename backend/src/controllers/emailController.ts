import { Request, Response } from 'express';
import { emailService } from '../services/emailService';
import { createLogger } from '../utils/logger';

const logger = createLogger('EmailController');

/**
 * Send a summary email with the provided data
 */
export const sendSummaryEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, serviceName, summaryData } = req.body;
    
    // Validate required fields
    if (!email || !serviceName || !summaryData) {
      res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: email, serviceName, or summaryData' 
      });
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
      return;
    }
    
    logger.info(`Sending summary email for ${serviceName} to ${email}`);
    
    // Send the email
    const result = await emailService.sendSummaryReport(email, serviceName, summaryData);
    
    if (result) {
      res.status(200).json({ 
        success: true, 
        message: 'Email sent successfully' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send email' 
      });
    }
  } catch (error) {
    logger.error('Error sending summary email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}; 