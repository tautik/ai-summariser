import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// API Keys - in production, these should be stored in environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'your-openai-api-key';
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || 'your-elevenlabs-api-key';
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL'; // Default voice ID (Rachel)

// Sample data structure - combining Twitter, Gmail, and Reddit insights
interface ServiceData {
  twitter?: {
    profileName: string;
    followerCount: number;
    tweetCount: number;
    recentTweetSummary: string;
    engagementRate: number;
    topTweets: string[];
  };
  gmail?: {
    emailCount: number;
    unreadCount: number;
    importantEmails: string[];
    actionItems: string[];
    topSenders: { name: string; count: number }[];
  };
  reddit?: {
    subreddits: string[];
    topPosts: string[];
    commentSummary: string;
    karma: number;
  };
}

/**
 * Generate sample data for the pipeline
 */
function generateSampleData(): ServiceData {
  // This simulates data that would come from your actual services
  return {
    twitter: {
      profileName: "Tautik Agrahari",
      followerCount: 1250,
      tweetCount: 1876,
      recentTweetSummary: "Recent tweets focus on developer tools, AI technology discussions, and startup announcements.",
      engagementRate: 2.8,
      topTweets: [
        "Just hit 1000 GitHub stars on our open source project! Thanks to all the contributors who made this possible.",
        "Our new logo has a fun story behind it.",
        "It's official — we raised a $5.5M seed led by GV."
      ]
    },
    gmail: {
      emailCount: 125,
      unreadCount: 18,
      importantEmails: [
        "Invitation to speak at React India 2025",
        "Job opportunity from Delve",
        "Your flight to Bangalore is confirmed"
      ],
      actionItems: [
        "Respond to React India speaking invitation by May 10th",
        "Schedule meeting with Delve team",
        "Confirm flight details for Bangalore trip"
      ],
      topSenders: [
        { name: "GitHub", count: 23 },
        { name: "HDFC Bank", count: 15 },
        { name: "Medium", count: 12 }
      ]
    },
    reddit: {
      subreddits: ["r/technology", "r/science", "r/AskReddit"],
      topPosts: [
        "Global climate agreement reached: 195 countries commit to 50% emissions reduction by 2035",
        "Researchers develop new AI model that can predict protein structures with 98% accuracy",
        "What's a skill that took you less than a month to learn but has been incredibly useful?"
      ],
      commentSummary: "Most active in technology discussions, with thoughtful responses and technical insights.",
      karma: 3450
    }
  };
}

/**
 * Format the data into a prompt for the LLM
 */
function formatDataForLLM(data: ServiceData): string {
  let prompt = `Create a concise audio summary of the following data from May 4, 2025:

TWITTER SUMMARY:
${data.twitter ? `
- Account: ${data.twitter.profileName}
- Followers: ${data.twitter.followerCount}
- Total Tweets: ${data.twitter.tweetCount}
- Recent Activity: ${data.twitter.recentTweetSummary}
- Engagement Rate: ${data.twitter.engagementRate}%
- Top Tweets:
  ${data.twitter.topTweets.map(tweet => `* "${tweet}"`).join('\n  ')}
` : 'No Twitter data available.'}

GMAIL SUMMARY:
${data.gmail ? `
- Total Emails: ${data.gmail.emailCount}
- Unread: ${data.gmail.unreadCount}
- Important Messages:
  ${data.gmail.importantEmails.map(email => `* ${email}`).join('\n  ')}
- Action Items:
  ${data.gmail.actionItems.map(item => `* ${item}`).join('\n  ')}
- Top Senders:
  ${data.gmail.topSenders.map(sender => `* ${sender.name}: ${sender.count} emails`).join('\n  ')}
` : 'No Gmail data available.'}

REDDIT SUMMARY:
${data.reddit ? `
- Active Subreddits: ${data.reddit.subreddits.join(', ')}
- Trending Posts:
  ${data.reddit.topPosts.map(post => `* "${post}"`).join('\n  ')}
- Comment Activity: ${data.reddit.commentSummary}
- Karma: ${data.reddit.karma}
` : 'No Reddit data available.'}

Create a natural-sounding audio summary suitable for a 1-minute voice update. Make it conversational, as if speaking directly to the user. Focus on the most important insights and action items.`;

  return prompt;
}

/**
 * Send data to OpenAI and get a text response
 */
async function generateTextWithLLM(prompt: string): Promise<string> {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4-turbo',
        messages: [
          { role: 'system', content: 'You are an AI assistant that creates concise audio summaries. Keep responses under 1 minute when read aloud.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating text with OpenAI:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Response:', error.response.data);
    }
    throw new Error('Failed to generate text with LLM');
  }
}

/**
 * Convert text to speech using ElevenLabs
 */
async function convertTextToSpeech(text: string, outputPath: string): Promise<string> {
  try {
    const response = await axios({
      method: 'post',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
      data: {
        text,
        model_id: 'eleven_turbo_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      },
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      responseType: 'arraybuffer'
    });

    // Ensure the directory exists
    const directory = path.dirname(outputPath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    // Save the audio file
    fs.writeFileSync(outputPath, response.data);
    console.log(`Audio saved to ${outputPath}`);
    
    return outputPath;
  } catch (error) {
    console.error('Error converting text to speech with ElevenLabs:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Response:', error.response.data);
    }
    throw new Error('Failed to convert text to speech');
  }
}

/**
 * Main pipeline function
 */
async function generateAudioSummary(
  outputPath: string = path.join(__dirname, '../../public/services/elevenlabs.mp3')
): Promise<string> {
  try {
    // 1. Generate or retrieve data
    console.log('Generating sample data...');
    const data = generateSampleData();
    
    // 2. Format data for LLM
    console.log('Formatting data for LLM...');
    const prompt = formatDataForLLM(data);
    
    // 3. Generate text with LLM
    console.log('Generating text with LLM...');
    const summaryText = await generateTextWithLLM(prompt);
    console.log('Generated text:', summaryText);
    
    // 4. Convert text to speech
    console.log('Converting text to speech...');
    const audioPath = await convertTextToSpeech(summaryText, outputPath);
    
    return audioPath;
  } catch (error) {
    console.error('Error in voice pipeline:', error);
    throw error;
  }
}

// Example usage
async function runPipeline() {
  try {
    const outputPath = await generateAudioSummary();
    console.log(`Pipeline completed successfully. Audio saved to: ${outputPath}`);
  } catch (error) {
    console.error('Pipeline failed:', error);
  }
}

// Uncomment to run the pipeline
// runPipeline();

export {
  generateSampleData,
  formatDataForLLM,
  generateTextWithLLM,
  convertTextToSpeech,
  generateAudioSummary
}; 