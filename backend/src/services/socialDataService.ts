import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

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

// Function to save response to a file
const saveResponseToFile = (handle: string, type: string, data: any) => {
  try {
    // Create responses directory if it doesn't exist
    const responsesDir = path.join(__dirname, '..', '..', 'responses');
    if (!fs.existsSync(responsesDir)) {
      fs.mkdirSync(responsesDir, { recursive: true });
    }
    
    // Create user directory if it doesn't exist
    const userDir = path.join(responsesDir, handle.toLowerCase());
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    
    // Save response to file
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filePath = path.join(userDir, `${type}_${timestamp}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Response saved to ${filePath}`);
  } catch (error) {
    console.error('Error saving response to file:', error);
  }
};

// Function to generate mock data based on handle
const generateMockData = (handle: string) => {
  // Default mock data structure
  return {
    profile: {
      data: {
        id: `${Math.floor(Math.random() * 100000000)}`,
        name: handle.charAt(0).toUpperCase() + handle.slice(1),
        username: handle.toLowerCase(),
        description: `This is a mock profile for ${handle}. Tech enthusiast, entrepreneur, and AI advocate. Passionate about innovation and making the world a better place through technology.`,
        profile_image_url: `https://ui-avatars.com/api/?name=${handle}&background=random`,
        verified: Math.random() > 0.5,
        public_metrics: {
          followers_count: Math.floor(Math.random() * 1000000),
          following_count: Math.floor(Math.random() * 1000),
          tweet_count: Math.floor(Math.random() * 10000),
          listed_count: Math.floor(Math.random() * 10000)
        },
        location: ["San Francisco", "New York", "London", "Tokyo", "Berlin"][Math.floor(Math.random() * 5)],
        url: `https://example.com/${handle.toLowerCase()}`,
        created_at: new Date(Date.now() - Math.floor(Math.random() * 315360000000)).toISOString(), // Random date within last 10 years
        pinned_tweet_id: `${Math.floor(Math.random() * 1000000000)}`
      }
    },
    tweets: {
      data: [
        {
          id: `${Math.floor(Math.random() * 1000000000)}`,
          text: `Just posted my first tweet as ${handle}! Excited to join this amazing community. #HelloWorld #NewBeginnings`,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          public_metrics: {
            retweet_count: Math.floor(Math.random() * 1000),
            reply_count: Math.floor(Math.random() * 500),
            like_count: Math.floor(Math.random() * 5000),
            quote_count: Math.floor(Math.random() * 200)
          },
          entities: {
            hashtags: [
              { tag: "HelloWorld" },
              { tag: "NewBeginnings" }
            ],
            mentions: []
          },
          source: ["Twitter Web App", "Twitter for iPhone", "Twitter for Android"][Math.floor(Math.random() * 3)]
        },
        {
          id: `${Math.floor(Math.random() * 1000000000)}`,
          text: `Excited to share my latest project with everyone! We've been working on this for months and can't wait to hear your feedback. #Innovation #Tech #AI`,
          created_at: new Date(Date.now() - 172800000).toISOString(),
          public_metrics: {
            retweet_count: Math.floor(Math.random() * 1000),
            reply_count: Math.floor(Math.random() * 500),
            like_count: Math.floor(Math.random() * 5000),
            quote_count: Math.floor(Math.random() * 200)
          },
          entities: {
            hashtags: [
              { tag: "Innovation" },
              { tag: "Tech" },
              { tag: "AI" }
            ],
            mentions: []
          },
          source: ["Twitter Web App", "Twitter for iPhone", "Twitter for Android"][Math.floor(Math.random() * 3)]
        },
        {
          id: `${Math.floor(Math.random() * 1000000000)}`,
          text: `Thanks for all the support from my amazing followers! You're the best! Just hit ${Math.floor(Math.random() * 10000)} followers and I'm grateful for each one of you.`,
          created_at: new Date(Date.now() - 259200000).toISOString(),
          public_metrics: {
            retweet_count: Math.floor(Math.random() * 1000),
            reply_count: Math.floor(Math.random() * 500),
            like_count: Math.floor(Math.random() * 5000),
            quote_count: Math.floor(Math.random() * 200)
          },
          entities: {
            hashtags: [],
            mentions: []
          },
          source: ["Twitter Web App", "Twitter for iPhone", "Twitter for Android"][Math.floor(Math.random() * 3)]
        },
        {
          id: `${Math.floor(Math.random() * 1000000000)}`,
          text: `Just read an amazing article about the future of AI. The possibilities are endless! What do you think will be the biggest impact of AI in the next decade? #AI #FutureTech #Innovation`,
          created_at: new Date(Date.now() - 345600000).toISOString(),
          public_metrics: {
            retweet_count: Math.floor(Math.random() * 1000),
            reply_count: Math.floor(Math.random() * 500),
            like_count: Math.floor(Math.random() * 5000),
            quote_count: Math.floor(Math.random() * 200)
          },
          entities: {
            hashtags: [
              { tag: "AI" },
              { tag: "FutureTech" },
              { tag: "Innovation" }
            ],
            mentions: []
          },
          source: ["Twitter Web App", "Twitter for iPhone", "Twitter for Android"][Math.floor(Math.random() * 3)]
        },
        {
          id: `${Math.floor(Math.random() * 1000000000)}`,
          text: `Beautiful day for a hike! Nature always helps me clear my mind and come up with new ideas. #Nature #Inspiration #Creativity`,
          created_at: new Date(Date.now() - 432000000).toISOString(),
          public_metrics: {
            retweet_count: Math.floor(Math.random() * 1000),
            reply_count: Math.floor(Math.random() * 500),
            like_count: Math.floor(Math.random() * 5000),
            quote_count: Math.floor(Math.random() * 200)
          },
          entities: {
            hashtags: [
              { tag: "Nature" },
              { tag: "Inspiration" },
              { tag: "Creativity" }
            ],
            mentions: []
          },
          source: ["Twitter Web App", "Twitter for iPhone", "Twitter for Android"][Math.floor(Math.random() * 3)]
        }
      ]
    },
    following: {
      data: [
        {
          id: '123456',
          name: 'Tech News',
          username: 'technews',
          profile_image_url: 'https://ui-avatars.com/api/?name=Tech+News&background=random',
          verified: true,
          description: 'Latest news and updates from the tech world'
        },
        {
          id: '123457',
          name: 'Coding Tips',
          username: 'codingtips',
          profile_image_url: 'https://ui-avatars.com/api/?name=Coding+Tips&background=random',
          verified: false,
          description: 'Daily tips and tricks for programmers of all levels'
        },
        {
          id: '123458',
          name: 'AI Updates',
          username: 'aiupdates',
          profile_image_url: 'https://ui-avatars.com/api/?name=AI+Updates&background=random',
          verified: true,
          description: 'Keeping you informed about the latest in artificial intelligence'
        },
        {
          id: '123459',
          name: 'Startup Founders',
          username: 'startupfounders',
          profile_image_url: 'https://ui-avatars.com/api/?name=Startup+Founders&background=random',
          verified: false,
          description: 'A community of entrepreneurs sharing their journey'
        },
        {
          id: '123460',
          name: 'Design Inspiration',
          username: 'designinspo',
          profile_image_url: 'https://ui-avatars.com/api/?name=Design+Inspiration&background=random',
          verified: true,
          description: 'Beautiful design inspiration for creatives'
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
      },
      location: "Mars & Earth",
      url: "https://x.com/elonmusk",
      created_at: "2009-03-06T20:12:29.000Z",
      pinned_tweet_id: "1234567890"
    }
  },
  tweets: {
    data: [
      {
        id: '1234567890',
        text: 'AI is the future. We need to ensure it remains safe and beneficial for humanity.',
        created_at: '2023-02-27T12:00:00Z',
        public_metrics: {
          retweet_count: 5000,
          reply_count: 3000,
          like_count: 25000,
          quote_count: 1000
        },
        entities: {
          hashtags: [
            { tag: "AI" },
            { tag: "Safety" }
          ],
          mentions: []
        },
        source: "Twitter for iPhone"
      },
      {
        id: '1234567891',
        text: 'SpaceX Starship successfully completed its orbital test flight!',
        created_at: '2023-02-26T18:30:00Z',
        public_metrics: {
          retweet_count: 10000,
          reply_count: 5000,
          like_count: 50000,
          quote_count: 2000
        },
        entities: {
          hashtags: [
            { tag: "SpaceX" },
            { tag: "Starship" }
          ],
          mentions: [
            { username: "SpaceX" }
          ]
        },
        source: "Twitter for iPhone"
      },
      {
        id: '1234567892',
        text: 'Tesla\'s new battery technology increases range by 30% and reduces cost by 20%.',
        created_at: '2023-02-25T14:15:00Z',
        public_metrics: {
          retweet_count: 8000,
          reply_count: 4000,
          like_count: 35000,
          quote_count: 1500
        },
        entities: {
          hashtags: [
            { tag: "Tesla" },
            { tag: "Battery" },
            { tag: "Innovation" }
          ],
          mentions: [
            { username: "Tesla" }
          ]
        },
        source: "Twitter for iPhone"
      },
      {
        id: '1234567893',
        text: 'The Boring Company is revolutionizing urban transportation with underground tunnels.',
        created_at: '2023-02-24T10:45:00Z',
        public_metrics: {
          retweet_count: 6000,
          reply_count: 3500,
          like_count: 30000,
          quote_count: 1200
        },
        entities: {
          hashtags: [
            { tag: "BoringCompany" },
            { tag: "Transportation" }
          ],
          mentions: [
            { username: "boringcompany" }
          ]
        },
        source: "Twitter for iPhone"
      },
      {
        id: '1234567894',
        text: 'Neuralink has made significant progress in brain-machine interfaces. Human trials starting soon.',
        created_at: '2023-02-23T16:20:00Z',
        public_metrics: {
          retweet_count: 7000,
          reply_count: 4500,
          like_count: 40000,
          quote_count: 1800
        },
        entities: {
          hashtags: [
            { tag: "Neuralink" },
            { tag: "BrainInterface" },
            { tag: "Future" }
          ],
          mentions: []
        },
        source: "Twitter for iPhone"
      }
    ]
  },
  following: {
    data: [
      {
        id: '123456',
        name: 'SpaceX',
        username: 'SpaceX',
        profile_image_url: 'https://pbs.twimg.com/profile_images/1234567890/spacex_400x400.jpg',
        verified: true,
        description: 'SpaceX designs, manufactures and launches advanced rockets and spacecraft.'
      },
      {
        id: '123457',
        name: 'Tesla',
        username: 'Tesla',
        profile_image_url: 'https://pbs.twimg.com/profile_images/1234567890/tesla_400x400.jpg',
        verified: true,
        description: 'Electric cars, giant batteries and solar'
      },
      {
        id: '123458',
        name: 'The Boring Company',
        username: 'boringcompany',
        profile_image_url: 'https://pbs.twimg.com/profile_images/1234567890/boring_400x400.jpg',
        verified: true,
        description: 'Boring tunnels to solve traffic'
      },
      {
        id: '123459',
        name: 'Neuralink',
        username: 'neuralink',
        profile_image_url: 'https://pbs.twimg.com/profile_images/1234567890/neuralink_400x400.jpg',
        verified: true,
        description: 'Developing ultra high bandwidth brain-machine interfaces to connect humans and computers'
      },
      {
        id: '123460',
        name: 'X',
        username: 'x',
        profile_image_url: 'https://pbs.twimg.com/profile_images/1234567890/x_400x400.jpg',
        verified: true,
        description: 'X is the everything app'
      }
    ]
  }
};

// Special case for Bill Gates
const billGatesData = {
  profile: {
    data: {
      id: '50393960',
      name: 'Bill Gates',
      username: 'BillGates',
      description: 'Sharing things I\'m learning through my foundation work and other interests.',
      profile_image_url: 'https://pbs.twimg.com/profile_images/1564398871996174336/M-hffw5a_400x400.jpg',
      verified: true,
      public_metrics: {
        followers_count: 62800000,
        following_count: 283,
        tweet_count: 4200,
        listed_count: 90000
      },
      location: "Seattle, WA",
      url: "https://www.gatesnotes.com/",
      created_at: "2009-06-24T18:44:10.000Z",
      pinned_tweet_id: "9876543210"
    }
  },
  tweets: {
    data: [
      {
        id: '9876543210',
        text: 'Climate change and the global pandemic are reminders that we need to invest in science and innovation to solve our biggest challenges.',
        created_at: '2023-03-15T14:30:00Z',
        public_metrics: {
          retweet_count: 4500,
          reply_count: 2000,
          like_count: 20000,
          quote_count: 800
        },
        entities: {
          hashtags: [
            { tag: "ClimateChange" },
            { tag: "Innovation" }
          ],
          mentions: []
        },
        source: "Twitter Web App"
      },
      {
        id: '9876543211',
        text: 'I\'m optimistic about the progress we\'re making on malaria. New tools and approaches are helping us get closer to eradication.',
        created_at: '2023-03-14T16:45:00Z',
        public_metrics: {
          retweet_count: 3000,
          reply_count: 1500,
          like_count: 15000,
          quote_count: 600
        },
        entities: {
          hashtags: [
            { tag: "Malaria" },
            { tag: "GlobalHealth" }
          ],
          mentions: []
        },
        source: "Twitter Web App"
      },
      {
        id: '9876543212',
        text: 'Just finished reading "The Code Breaker" by Walter Isaacson. A fascinating look at CRISPR and the scientists who are revolutionizing medicine.',
        created_at: '2023-03-13T20:10:00Z',
        public_metrics: {
          retweet_count: 2500,
          reply_count: 1200,
          like_count: 18000,
          quote_count: 500
        },
        entities: {
          hashtags: [
            { tag: "Books" },
            { tag: "CRISPR" },
            { tag: "Science" }
          ],
          mentions: []
        },
        source: "Twitter Web App"
      },
      {
        id: '9876543213',
        text: 'Clean energy innovation is critical to addressing climate change. We need to make green products affordable for everyone.',
        created_at: '2023-03-12T12:20:00Z',
        public_metrics: {
          retweet_count: 3800,
          reply_count: 1800,
          like_count: 22000,
          quote_count: 700
        },
        entities: {
          hashtags: [
            { tag: "CleanEnergy" },
            { tag: "ClimateChange" }
          ],
          mentions: []
        },
        source: "Twitter Web App"
      },
      {
        id: '9876543214',
        text: 'Education is the key to opportunity. I\'m inspired by teachers who are finding innovative ways to help students learn, especially during challenging times.',
        created_at: '2023-03-11T15:35:00Z',
        public_metrics: {
          retweet_count: 4200,
          reply_count: 2200,
          like_count: 25000,
          quote_count: 900
        },
        entities: {
          hashtags: [
            { tag: "Education" },
            { tag: "Teachers" }
          ],
          mentions: []
        },
        source: "Twitter Web App"
      }
    ]
  },
  following: {
    data: [
      {
        id: '234567',
        name: 'Gates Foundation',
        username: 'gatesfoundation',
        profile_image_url: 'https://pbs.twimg.com/profile_images/1234567890/gates_foundation_400x400.jpg',
        verified: true,
        description: 'Guided by the belief that every life has equal value, the Bill & Melinda Gates Foundation works to help all people lead healthy, productive lives.'
      },
      {
        id: '234568',
        name: 'Melinda French Gates',
        username: 'melindagates',
        profile_image_url: 'https://pbs.twimg.com/profile_images/1234567890/melinda_gates_400x400.jpg',
        verified: true,
        description: 'Philanthropist, businesswoman, and global advocate for women and girls.'
      },
      {
        id: '234569',
        name: 'World Health Organization',
        username: 'WHO',
        profile_image_url: 'https://pbs.twimg.com/profile_images/1234567890/who_400x400.jpg',
        verified: true,
        description: 'We are the #UnitedNations\' health agency - #HealthForAll. Always check our latest tweets on #COVID19 for updated advice/information.'
      },
      {
        id: '234570',
        name: 'Microsoft',
        username: 'Microsoft',
        profile_image_url: 'https://pbs.twimg.com/profile_images/1234567890/microsoft_400x400.jpg',
        verified: true,
        description: 'Enabling every person and organization on the planet to achieve more.'
      },
      {
        id: '234571',
        name: 'Breakthrough Energy',
        username: 'Breakthrough',
        profile_image_url: 'https://pbs.twimg.com/profile_images/1234567890/breakthrough_400x400.jpg',
        verified: true,
        description: 'A network of entities and initiatives working together to accelerate the clean energy transition.'
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
    const useMockData = true; // Set to true to use mock data for testing
    
    if (useMockData) {
      console.log('Using mock data for Twitter API');
      
      // Return specific data for known handles or generate dynamic mock data
      let mockData;
      if (handle.toLowerCase() === 'elonmusk') {
        mockData = elonMuskData;
      } else if (handle.toLowerCase() === 'billgates') {
        mockData = billGatesData;
      } else {
        mockData = generateMockData(handle);
      }
      
      // Save mock data to file
      saveResponseToFile(handle, 'mock_data', mockData);
      
      return mockData;
    }
    
    // Real API implementation
    try {
      // Step 1: Get user profile by username
      console.log(`Making request to: ${SOCIAL_DATA_BASE_URL}/twitter/users/by/username/${handle}`);
      const profileResponse = await socialDataApi.get(`/twitter/users/by/username/${handle}`);
      console.log('Profile response:', profileResponse.status);
      
      // Save profile response to file
      saveResponseToFile(handle, 'profile', profileResponse.data);
      
      if (!profileResponse.data || !profileResponse.data.data) {
        throw new Error(`No profile found for handle: ${handle}`);
      }
      
      const userId = profileResponse.data.data.id;
      console.log(`User ID: ${userId}`);
      
      // Step 2: Get user tweets using the search endpoint
      console.log(`Making request to: ${SOCIAL_DATA_BASE_URL}/twitter/search?query=from%3A${handle}&type=Latest`);
      const tweetsResponse = await socialDataApi.get(`/twitter/search?query=from%3A${handle}&type=Latest`);
      console.log('Tweets response:', tweetsResponse.status);
      
      // Save tweets response to file
      saveResponseToFile(handle, 'tweets', tweetsResponse.data);
      
      // Step 3: Get user following
      console.log(`Making request to: ${SOCIAL_DATA_BASE_URL}/twitter/users/${userId}/following`);
      const followingResponse = await socialDataApi.get(`/twitter/users/${userId}/following`, {
        params: {
          max_results: 10,
        }
      });
      console.log('Following response:', followingResponse.status);
      
      // Save following response to file
      saveResponseToFile(handle, 'following', followingResponse.data);
      
      // Format the data to match our expected structure
      const formattedData = {
        profile: profileResponse.data,
        tweets: {
          data: tweetsResponse.data.tweets.map((tweet: any) => ({
            id: tweet.id_str,
            text: tweet.full_text || tweet.text,
            created_at: tweet.tweet_created_at,
            public_metrics: {
              retweet_count: tweet.retweet_count,
              reply_count: tweet.reply_count || 0,
              like_count: tweet.favorite_count,
              quote_count: tweet.quote_count || 0
            }
          }))
        },
        following: {
          data: followingResponse.data.data || []
        }
      };
      
      // Save formatted data to file
      saveResponseToFile(handle, 'formatted_data', formattedData);
      
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
        
        // Save error details to file
        saveResponseToFile(handle, 'api_error', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        });
      }
      
      // Fall back to mock data
      console.log('Falling back to mock data');
      let mockData;
      if (handle.toLowerCase() === 'elonmusk') {
        mockData = elonMuskData;
      } else if (handle.toLowerCase() === 'billgates') {
        mockData = billGatesData;
      } else {
        mockData = generateMockData(handle);
      }
      
      // Save fallback mock data to file
      saveResponseToFile(handle, 'fallback_mock_data', mockData);
      
      return mockData;
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
      rawData: data // Include the raw data for detailed view
    };
    
    // Save summary to file
    saveResponseToFile(handle, 'summary', summary);
    
    return summary;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate summary');
  }
}; 