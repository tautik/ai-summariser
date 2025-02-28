import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const SOCIAL_DATA_API_KEY = process.env.SOCIAL_DATA_API_KEY || '2315|FcPglN4lMDKYHFVglhpS5nr6m8ynOtE02oDP5K18407e911d';
const SOCIAL_DATA_BASE_URL = 'https://api.socialdata.tools/v1';

console.log('API Key:', SOCIAL_DATA_API_KEY);
console.log('API Base URL:', SOCIAL_DATA_BASE_URL);

// Create axios instance with default config
const socialDataApi = axios.create({
  baseURL: SOCIAL_DATA_BASE_URL,
  headers: {
    'Authorization': `Bearer ${SOCIAL_DATA_API_KEY}`,
    'Content-Type': 'application/json',
  }
});

// Mock data for testing
const mockTwitterData = {
  profile: {
    data: {
      id: '44196397',
      name: 'Elon Musk',
      username: 'elonmusk',
      description: 'Technoking of Tesla, Imperator of Mars',
      profile_image_url: 'https://pbs.twimg.com/profile_images/1234567890/elon_musk_400x400.jpg',
      verified: true,
      public_metrics: {
        followers_count: 128500000,
        following_count: 177,
        tweet_count: 21500,
        listed_count: 120000
      }
    }
  },
  tweets: {
    data: [
      {
        id: '1234567890',
        text: 'AI is the future. We need to ensure it remains safe and beneficial for humanity.',
        created_at: '2025-02-27T12:00:00Z',
        public_metrics: {
          retweet_count: 5000,
          reply_count: 3000,
          like_count: 25000,
          quote_count: 1000
        }
      },
      {
        id: '1234567891',
        text: 'SpaceX Starship successfully completed its orbital test flight!',
        created_at: '2025-02-26T18:30:00Z',
        public_metrics: {
          retweet_count: 10000,
          reply_count: 5000,
          like_count: 50000,
          quote_count: 2000
        }
      },
      {
        id: '1234567892',
        text: 'Tesla\'s new battery technology increases range by 30% and reduces cost by 20%.',
        created_at: '2025-02-25T14:15:00Z',
        public_metrics: {
          retweet_count: 8000,
          reply_count: 4000,
          like_count: 35000,
          quote_count: 1500
        }
      }
    ]
  },
  following: {
    data: [
      {
        id: '123456',
        name: 'SpaceX',
        username: 'SpaceX'
      },
      {
        id: '123457',
        name: 'Tesla',
        username: 'Tesla'
      },
      {
        id: '123458',
        name: 'The Boring Company',
        username: 'boringcompany'
      }
    ]
  }
};

/**
 * Fetch Twitter data for a specific handle
 */
export const fetchTwitterData = async (handle: string) => {
  try {
    console.log(`Fetching Twitter data for handle: ${handle}`);
    
    // Check if we should use real API or mock data
    const useMockData = true; // Set to false to use real API when it's working
    
    if (useMockData) {
      console.log('Using mock data for Twitter API');
      return mockTwitterData;
    }
    
    // Real API implementation (currently not working)
    console.log(`Making request to: ${SOCIAL_DATA_BASE_URL}/twitter/users/by/username/${handle}`);
    const profileResponse = await socialDataApi.get(`/twitter/users/by/username/${handle}`);
    console.log('Profile response:', profileResponse.status);
    
    const userId = profileResponse.data.data.id;
    console.log(`User ID: ${userId}`);
    
    // Get user tweets
    console.log(`Making request to: ${SOCIAL_DATA_BASE_URL}/twitter/users/${userId}/tweets`);
    const tweetsResponse = await socialDataApi.get(`/twitter/users/${userId}/tweets`, {
      params: {
        max_results: 10,
      }
    });
    console.log('Tweets response:', tweetsResponse.status);
    
    // Get user following
    console.log(`Making request to: ${SOCIAL_DATA_BASE_URL}/twitter/users/${userId}/following`);
    const followingResponse = await socialDataApi.get(`/twitter/users/${userId}/following`, {
      params: {
        max_results: 10,
      }
    });
    console.log('Following response:', followingResponse.status);
    
    return {
      profile: profileResponse.data,
      tweets: tweetsResponse.data,
      following: followingResponse.data
    };
  } catch (error) {
    console.error('Error fetching Twitter data:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: error.config
      });
    }
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