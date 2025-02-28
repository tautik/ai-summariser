import { Request, Response } from 'express';
import { generateAIInsights, generateServiceInsights } from '../services/insightsService';
import { createLogger } from '../utils/logger';

const logger = createLogger('InsightsController');

/**
 * Get AI insights based on connected services
 */
export const getAIInsights = async (req: Request, res: Response): Promise<void> => {
  try {
    const { connectedServices } = req.body;
    
    if (!connectedServices) {
      res.status(400).json({ 
        success: false, 
        message: 'Missing required field: connectedServices' 
      });
      return;
    }
    
    logger.info('Generating AI insights for connected services');
    
    const insights = await generateAIInsights(connectedServices);
    
    res.status(200).json({
      success: true,
      data: insights
    });
  } catch (error) {
    logger.error('Error generating AI insights:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate AI insights' 
    });
  }
};

/**
 * Get service-specific insights
 */
export const getServiceInsights = async (req: Request, res: Response): Promise<void> => {
  try {
    const { service } = req.params;
    
    if (!service) {
      res.status(400).json({ 
        success: false, 
        message: 'Missing required parameter: service' 
      });
      return;
    }
    
    logger.info(`Generating insights for service: ${service}`);
    
    const insights = await generateServiceInsights(service);
    
    res.status(200).json({
      success: true,
      data: insights
    });
  } catch (error) {
    logger.error('Error generating service insights:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate service insights' 
    });
  }
}; 