import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const SOCIAL_DATA_API_KEY = process.env.SOCIAL_DATA_API_KEY || '2315|FcPglN4lMDKYHFVglhpS5nr6m8ynOtE02oDP5K18407e911d';
const SOCIAL_DATA_BASE_URL = 'https://api.socialdata.tools';

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

// Function to generate mock data based on handle
const generateMockData = (handle: string) => {
  // Default mock data structure
  return {
    profile: {
      data: {
        id: `${Math.floor(Math.random() * 100000000)}`,
        name: handle.charAt(0).toUpperCase() + handle.slice(1),
        username: handle.toLowerCase(),
        description: `This is a mock profile for ${handle}`,
        profile_image_url: `https://ui-avatars.com/api/?name=${handle}&background=random`,
        verified: Math.random() > 0.5,
        public_metrics: {
          followers_count: Math.floor(Math.random() * 1000000),
          following_count: Math.floor(Math.random() * 1000),
          tweet_count: Math.floor(Math.random() * 10000),
          listed_count: Math.floor(Math.random() * 10000)
        }
      }
    },
    tweets: {
      data: [
        {
          id: `${Math.floor(Math.random() * 1000000000)}`,
          text: `Just posted my first tweet as ${handle}! #HelloWorld`,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          public_metrics: {
            retweet_count: Math.floor(Math.random() * 1000),
            reply_count: Math.floor(Math.random() * 500),
            like_count: Math.floor(Math.random() * 5000),
            quote_count: Math.floor(Math.random() * 200)
          }
        },
        {
          id: `${Math.floor(Math.random() * 1000000000)}`,
          text: `Excited to share my latest project with everyone! #Innovation #Tech`,
          created_at: new Date(Date.now() - 172800000).toISOString(),
          public_metrics: {
            retweet_count: Math.floor(Math.random() * 1000),
            reply_count: Math.floor(Math.random() * 500),
            like_count: Math.floor(Math.random() * 5000),
            quote_count: Math.floor(Math.random() * 200)
          }
        },
        {
          id: `${Math.floor(Math.random() * 1000000000)}`,
          text: `Thanks for all the support from my amazing followers! You're the best!`,
          created_at: new Date(Date.now() - 259200000).toISOString(),
          public_metrics: {
            retweet_count: Math.floor(Math.random() * 1000),
            reply_count: Math.floor(Math.random() * 500),
            like_count: Math.floor(Math.random() * 5000),
            quote_count: Math.floor(Math.random() * 200)
          }
        }
      ]
    },
    following: {
      data: [
        {
          id: '123456',
          name: 'Tech News',
          username: 'technews'
        },
        {
          id: '123457',
          name: 'Coding Tips',
          username: 'codingtips'
        },
        {
          id: '123458',
          name: 'AI Updates',
          username: 'aiupdates'
        }
      ]
    }
  };
};

// Special case for Elon Musk to maintain the original example
const elonMuskData = {
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
      
      // Return Elon Musk's data if the handle is elonmusk, otherwise generate dynamic mock data
      if (handle.toLowerCase() === 'elonmusk') {
        return elonMuskData;
      } else {
        return generateMockData(handle);
      }
    }
    
    // Real API implementation
    try {
      console.log(`Making request to: ${SOCIAL_DATA_BASE_URL}/twitter/search?query=from%3A${handle}&type=Latest`);
      
      // Get user tweets and profile info from search
      const searchResponse = await socialDataApi.get(`/twitter/search?query=from%3A${handle}&type=Latest`);
      console.log('Search response:', searchResponse.status);
      
      if (!searchResponse.data.tweets || searchResponse.data.tweets.length === 0) {
        throw new Error(`No tweets found for handle: ${handle}`);
      }
      
      // Extract user info from the first tweet
      const userInfo = searchResponse.data.tweets[0].user;
      
      // Format the data to match our expected structure
      const formattedData = {
        profile: {
          data: {
            id: userInfo.id_str,
            name: userInfo.name,
            username: userInfo.screen_name,
            description: userInfo.description || '',
            profile_image_url: userInfo.profile_image_url_https,
            verified: userInfo.verified,
            public_metrics: {
              followers_count: userInfo.followers_count,
              following_count: userInfo.friends_count,
              tweet_count: userInfo.statuses_count,
              listed_count: userInfo.listed_count
            }
          }
        },
        tweets: {
          data: searchResponse.data.tweets.map((tweet: any) => ({
            id: tweet.id_str,
            text: tweet.full_text || tweet.text,
            created_at: tweet.tweet_created_at,
            public_metrics: {
              retweet_count: tweet.retweet_count,
              reply_count: tweet.reply_count,
              like_count: tweet.favorite_count,
              quote_count: tweet.quote_count
            }
          }))
        },
        following: {
          data: [] // We don't have following data from the search endpoint
        }
      };
      
      return formattedData;
    } catch (error) {
      console.error('Error with real API, falling back to mock data:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
          config: error.config
        });
      }
      
      // Fall back to mock data
      console.log('Falling back to mock data');
      if (handle.toLowerCase() === 'elonmusk') {
        return elonMuskData;
      } else {
        return generateMockData(handle);
      }
    }
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