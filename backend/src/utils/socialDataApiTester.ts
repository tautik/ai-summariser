import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

const API_KEY = process.env.SOCIAL_DATA_API_KEY || '2315|FcPglN4lMDKYHFVglhpS5nr6m8ynOtE02oDP5K18407e911d';
const BASE_URL = 'https://api.socialdata.tools';

// Create axios instance with default config
const socialDataApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  }
});

// Helper function to save response to a file
const saveResponseToFile = (endpoint: string, data: any) => {
  const sanitizedEndpoint = endpoint.replace(/\//g, '_').replace(/\?.*$/, '');
  const filePath = path.join(__dirname, '..', '..', 'test-results', `${sanitizedEndpoint}.json`);
  
  // Ensure directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Response saved to ${filePath}`);
};

// Test functions for different endpoints
const testEndpoints = async () => {
  try {
    // Create test-results directory if it doesn't exist
    const testResultsDir = path.join(__dirname, '..', '..', 'test-results');
    if (!fs.existsSync(testResultsDir)) {
      fs.mkdirSync(testResultsDir, { recursive: true });
    }
    
    // Test 1: Search for tweets from Elon Musk
    console.log('Testing search endpoint...');
    try {
      const searchResponse = await socialDataApi.get('/twitter/search?query=from%3Aelonmusk&type=Latest');
      console.log('Search endpoint successful');
      saveResponseToFile('twitter_search_elonmusk', searchResponse.data);
      
      // Extract user ID from the search results
      const userId = searchResponse.data.tweets[0].user.id_str;
      console.log(`Extracted user ID: ${userId}`);
      
      // Test 2: Get tweets from a user using the ID from search
      console.log('Testing user tweets endpoint...');
      try {
        const tweetsResponse = await socialDataApi.get(`/twitter/search?query=from%3Aelonmusk&type=Latest`);
        console.log('User tweets endpoint successful');
        saveResponseToFile('twitter_user_tweets_elonmusk', tweetsResponse.data);
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error('User tweets endpoint failed:', 
          axiosError.response?.status, 
          axiosError.response?.data || axiosError.message
        );
      }
      
      // Test 3: Get a specific tweet
      if (searchResponse.data.tweets && searchResponse.data.tweets.length > 0) {
        const tweetId = searchResponse.data.tweets[0].id_str;
        console.log(`Testing tweet details endpoint for tweet ID: ${tweetId}`);
        
        try {
          const tweetResponse = await socialDataApi.get(`/twitter/tweets/${tweetId}`);
          console.log('Tweet details endpoint successful');
          saveResponseToFile(`twitter_tweet_${tweetId}`, tweetResponse.data);
        } catch (error) {
          const axiosError = error as AxiosError;
          console.error('Tweet details endpoint failed:', 
            axiosError.response?.status, 
            axiosError.response?.data || axiosError.message
          );
        }
      }
      
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Search endpoint failed:', 
        axiosError.response?.status, 
        axiosError.response?.data || axiosError.message
      );
    }
    
    // Test 4: Test the search endpoint with different parameters
    console.log('Testing search with different parameters...');
    try {
      const searchResponse = await socialDataApi.get('/twitter/search?query=AI%20from%3Aelonmusk&type=Top');
      console.log('Search with parameters endpoint successful');
      saveResponseToFile('twitter_search_elonmusk_ai_top', searchResponse.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Search with parameters endpoint failed:', 
        axiosError.response?.status, 
        axiosError.response?.data || axiosError.message
      );
    }
    
    console.log('All tests completed');
  } catch (error) {
    const axiosError = error as Error;
    console.error('Error running tests:', axiosError.message);
  }
};

// Run the tests
testEndpoints(); 