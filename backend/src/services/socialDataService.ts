import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SOCIAL_DATA_API_KEY = process.env.SOCIAL_DATA_API_KEY || '2315|FcPglN4lMDKYHFVglhpS5nr6m8ynOtE02oDP5K18407e911d';
const SOCIAL_DATA_BASE_URL = 'https://api.socialdata.tools/v1';

// Create axios instance with default config
const socialDataApi = axios.create({
  baseURL: SOCIAL_DATA_BASE_URL,
  headers: {
    'Authorization': `Bearer ${SOCIAL_DATA_API_KEY}`,
    'Content-Type': 'application/json',
  }
});

/**
 * Fetch Twitter data for a specific handle
 */
export const fetchTwitterData = async (handle: string) => {
  try {
    // Get user profile
    const profileResponse = await socialDataApi.get(`/twitter/users/by/username/${handle}`);
    const userId = profileResponse.data.data.id;
    
    // Get user tweets
    const tweetsResponse = await socialDataApi.get(`/twitter/users/${userId}/tweets`, {
      params: {
        max_results: 10,
      }
    });
    
    // Get user following
    const followingResponse = await socialDataApi.get(`/twitter/users/${userId}/following`, {
      params: {
        max_results: 10,
      }
    });
    
    return {
      profile: profileResponse.data,
      tweets: tweetsResponse.data,
      following: followingResponse.data
    };
  } catch (error) {
    console.error('Error fetching Twitter data:', error);
    throw new Error('Failed to fetch Twitter data');
  }
};

/**
 * Generate a summary of user content
 */
export const generateSummary = async (handle: string) => {
  try {
    const data = await fetchTwitterData(handle);
    
    // Extract tweets text
    const tweets = data.tweets.data || [];
    const tweetTexts = tweets.map((tweet: any) => tweet.text).join('\n\n');
    
    // Extract following users
    const following = data.following.data || [];
    const followingNames = following.map((user: any) => user.name).join(', ');
    
    // Create a simple summary
    const summary = {
      profile: data.profile.data,
      tweetSummary: `${handle} has posted ${tweets.length} recent tweets.`,
      tweetContent: tweetTexts,
      followingSummary: `${handle} follows ${following.length} accounts including: ${followingNames}`,
    };
    
    return summary;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate summary');
  }
}; 