/**
 * Run Twitter Search API Test
 * 
 * This script runs a test for the Twitter Search API endpoint.
 * 
 * Usage:
 *   ts-node run-twitter-search.ts "from:elonmusk"
 */

import { testTwitterSearch } from './socialdata-api-tests';

async function main() {
  try {
    const args = process.argv.slice(2);
    const query = args[0] || 'from:elonmusk';
    const type = (args[1] as 'Latest' | 'Top') || 'Latest';
    
    console.log(`Running Twitter Search API test with query: "${query}" and type: "${type}"`);
    
    const result = await testTwitterSearch(query, type);
    
    // Print a summary of the results
    console.log('\nSearch Results Summary:');
    console.log(`- Total tweets found: ${result.tweets?.length || 0}`);
    console.log(`- Next cursor: ${result.next_cursor ? 'Available' : 'None'}`);
    
    if (result.tweets && result.tweets.length > 0) {
      console.log('\nTweet Details:');
      
      result.tweets.forEach((tweet: any, index: number) => {
        console.log(`\n[${index + 1}] Tweet ID: ${tweet.id_str}`);
        console.log(`    Author: ${tweet.user?.name} (@${tweet.user?.screen_name})`);
        console.log(`    Date: ${tweet.tweet_created_at}`);
        console.log(`    Text: ${tweet.full_text}`);
        console.log(`    Retweets: ${tweet.retweet_count}, Likes: ${tweet.favorite_count}, Replies: ${tweet.reply_count}`);
      });
    }
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Error running Twitter Search API test:', error);
    process.exit(1);
  }
}

// Run the main function
main(); 