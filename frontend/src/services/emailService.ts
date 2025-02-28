import axios from 'axios';

const API_URL = 'http://localhost:5001/api/email';

interface EmailSummaryRequest {
  email: string;
  serviceName: string;
  summaryData: {
    summary: string;
    details?: any;
  };
}

export const sendSummaryEmail = async (data: EmailSummaryRequest): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.post(`${API_URL}/send-summary`, data);
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
    
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data.message || 'Failed to send email'
      };
    }
    
    return {
      success: false,
      message: 'Network error or server unavailable'
    };
  }
}; 