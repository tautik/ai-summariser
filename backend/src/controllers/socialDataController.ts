import { Request, Response } from 'express';
import { fetchTwitterData, generateSummary } from '../services/socialDataService';

/**
 * Get social data for a specific Twitter handle
 */
export const getSocialData = async (req: Request, res: Response) => {
  try {
    const { handle } = req.params;
    
    if (!handle) {
      return res.status(400).json({ error: 'Twitter handle is required' });
    }
    
    const data = await fetchTwitterData(handle);
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching social data:', error);
    return res.status(500).json({ error: 'Failed to fetch social data' });
  }
};

/**
 * Generate a summary of user content
 */
export const summarizeUserContent = async (req: Request, res: Response) => {
  try {
    const { handle } = req.body;
    
    if (!handle) {
      return res.status(400).json({ error: 'Twitter handle is required' });
    }
    
    const summary = await generateSummary(handle);
    return res.status(200).json(summary);
  } catch (error) {
    console.error('Error generating summary:', error);
    return res.status(500).json({ error: 'Failed to generate summary' });
  }
}; 