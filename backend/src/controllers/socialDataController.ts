import { Request, Response } from 'express';
import { fetchTwitterData, generateSummary } from '../services/socialDataService';

/**
 * Get social data for a specific Twitter handle
 */
export const getSocialData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { handle } = req.params;
    
    if (!handle) {
      res.status(400).json({ error: 'Twitter handle is required' });
      return;
    }
    
    const data = await fetchTwitterData(handle);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching social data:', error);
    res.status(500).json({ error: 'Failed to fetch social data' });
  }
};

/**
 * Generate a summary of user content
 */
export const summarizeUserContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { handle } = req.body;
    
    if (!handle) {
      res.status(400).json({ error: 'Twitter handle is required' });
      return;
    }
    
    const summary = await generateSummary(handle);
    res.status(200).json(summary);
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
}; 