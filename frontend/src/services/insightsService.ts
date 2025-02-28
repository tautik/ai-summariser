import axios from 'axios';

const API_URL = 'http://localhost:5001/api/insights';

interface AIInsights {
  contentSummary: string;
  topTrends: Array<{
    name: string;
    count: number;
    source: string;
  }>;
  keyPeople: Array<{
    name: string;
    description: string;
    source: string;
  }>;
}

interface ServiceInsights {
  summary: string;
  details: {
    service: string;
    timestamp: string;
    metrics: Record<string, any>;
  };
}

/**
 * Get AI insights based on connected services
 */
export const getAIInsights = async (connectedServices: Record<string, boolean>): Promise<AIInsights> => {
  try {
    const response = await axios.post(`${API_URL}/ai-insights`, { connectedServices });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching AI insights:', error);
    throw new Error('Failed to fetch AI insights');
  }
};

/**
 * Get service-specific insights
 */
export const getServiceInsights = async (service: string): Promise<ServiceInsights> => {
  try {
    const response = await axios.get(`${API_URL}/service/${service}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching ${service} insights:`, error);
    throw new Error(`Failed to fetch ${service} insights`);
  }
}; 