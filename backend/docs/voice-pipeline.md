# Voice Pipeline Architecture

## Overview

The voice pipeline transforms data from multiple services (Twitter, Gmail, Reddit) into a personalized audio summary using AI. This document outlines the architecture, data flow, components, and integration points of the system.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                           DATA SOURCES                                  │
│                                                                         │
│  ┌───────────┐          ┌───────────┐          ┌───────────┐           │
│  │  Twitter  │          │   Gmail   │          │  Reddit   │           │
│  │   Data    │          │   Data    │          │   Data    │           │
│  └─────┬─────┘          └─────┬─────┘          └─────┬─────┘           │
│        │                      │                      │                  │
└────────┼──────────────────────┼──────────────────────┼──────────────────┘
         │                      │                      │
         ▼                      ▼                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│                      DATA AGGREGATION & FORMATTING                     │
│                                                                        │
│   ┌─────────────────────────────────────────────────────────────┐     │
│   │                  generateSampleData()                        │     │
│   │                  formatDataForLLM()                          │     │
│   └─────────────────────────────────────────────────────────────┘     │
│                                │                                       │
└────────────────────────────────┼───────────────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│                       TEXT GENERATION WITH LLM                         │
│                                                                        │
│   ┌─────────────────────────────────────────────────────────────┐     │
│   │                                                             │     │
│   │                  OpenAI GPT-4 API                           │     │
│   │                  generateTextWithLLM()                       │     │
│   │                                                             │     │
│   └─────────────────────────────────────────────────────────────┘     │
│                                │                                       │
└────────────────────────────────┼───────────────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│                          SPEECH SYNTHESIS                              │
│                                                                        │
│   ┌─────────────────────────────────────────────────────────────┐     │
│   │                                                             │     │
│   │                  ElevenLabs API                             │     │
│   │                  convertTextToSpeech()                       │     │
│   │                                                             │     │
│   └─────────────────────────────────────────────────────────────┘     │
│                                │                                       │
└────────────────────────────────┼───────────────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│                          FINAL OUTPUT                                  │
│                                                                        │
│   ┌─────────────────────────────────────────────────────────────┐     │
│   │                                                             │     │
│   │                  Audio File (MP3)                           │     │
│   │                  /public/services/elevenlabs.mp3            │     │
│   │                                                             │     │
│   └─────────────────────────────────────────────────────────────┘     │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

## Process Flow

1. **Data Collection** 
   - Source data from Twitter, Gmail, and Reddit services
   - Aggregate and structure data according to the `ServiceData` interface

2. **Data Formatting**
   - Transform structured data into a prompt suitable for LLM processing
   - Format follows a consistent template highlighting key metrics and insights

3. **Text Generation**
   - Send formatted prompt to OpenAI's GPT-4 API
   - Apply system prompt to ensure conversational, concise output
   - Receive natural language summary text

4. **Speech Synthesis**
   - Send generated text to ElevenLabs API
   - Configure voice parameters (stability, similarity boost)
   - Receive audio stream and save as MP3 file

5. **Output Handling**
   - Save audio file to public directory
   - Make available for frontend playback

## Data Structure

The pipeline processes data conforming to this structure:

```typescript
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
```

## Key Components

### 1. Data Generation (`generateSampleData`)
- Creates or retrieves structured data from services
- Currently uses sample data, can be modified to pull from actual services
- Returns consistent data structure for further processing

### 2. Prompt Formatting (`formatDataForLLM`)
- Converts structured data into natural language prompt
- Applies consistent formatting across different data sources
- Includes instructions for tone, length, and content focus

### 3. Text Generation (`generateTextWithLLM`)
- Communicates with OpenAI API
- Handles API authentication and error management
- Processes API response to extract generated text

### 4. Speech Synthesis (`convertTextToSpeech`)
- Communicates with ElevenLabs API
- Configures voice parameters and model selection
- Processes binary audio response
- Handles file system operations to save audio

### 5. Pipeline Orchestration (`generateAudioSummary`)
- Coordinates the entire process flow
- Handles error management and logging
- Provides a simple interface for triggering the pipeline

## API Requirements

### OpenAI API
- **API Key**: Required in environment variables as `OPENAI_API_KEY`
- **Endpoint**: https://api.openai.com/v1/chat/completions
- **Model**: gpt-4-turbo
- **Parameters**:
  - messages (system prompt + user content)
  - temperature: 0.7
  - max_tokens: 500

### ElevenLabs API
- **API Key**: Required in environment variables as `ELEVENLABS_API_KEY`
- **Endpoint**: https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}
- **Voice ID**: Configurable, defaults to "EXAVITQu4vr4xnSDxMaL" (Rachel)
- **Parameters**:
  - text: Generated summary content
  - model_id: eleven_turbo_v2
  - voice_settings: customizable stability and similarity_boost

## Implementation Guide

### 1. Environment Setup

Create a `.env` file with the required API keys:

```
OPENAI_API_KEY=your-openai-api-key
ELEVENLABS_API_KEY=your-elevenlabs-api-key
ELEVENLABS_VOICE_ID=optional-custom-voice-id
```

### 2. Dependencies

Install the required packages:

```bash
npm install axios dotenv
```

### 3. Integration with Services

To integrate with real service data instead of sample data:

1. Modify the `generateSampleData()` function to fetch from your service APIs or databases
2. Ensure data format matches the `ServiceData` interface
3. Add authentication and error handling appropriate for each service

### 4. Running the Pipeline

```typescript
import { generateAudioSummary } from './services/voicePipeline';

// Run with default output path
const audioPath = await generateAudioSummary();

// Or specify a custom output path
const customPath = await generateAudioSummary('./custom/path/audio.mp3');
```

### 5. Frontend Integration

To play the generated audio in the frontend:

```typescript
// React component example
import { useEffect, useState } from 'react';

function AudioPlayer() {
  const [audioUrl, setAudioUrl] = useState('');

  useEffect(() => {
    // Path to the audio file generated by the pipeline
    setAudioUrl('/services/elevenlabs.mp3');
  }, []);

  return (
    <div>
      <h2>Your Daily Summary</h2>
      <audio controls src={audioUrl} />
    </div>
  );
}
```

## Future Enhancements

1. **Caching**: Implement a caching system to prevent regenerating audio when data hasn't changed
2. **Scheduling**: Add CRON jobs to automatically generate summaries at set intervals
3. **Customization**: Allow users to select preferred voice, length, and content focus
4. **Streaming**: Support streaming audio directly to the client without saving to disk
5. **Analytics**: Track audio generation and playback for usage insights
6. **User Feedback**: Add mechanisms for users to rate and provide feedback on summaries

## Troubleshooting

### Common Issues

1. **Missing API Keys**: Ensure all required environment variables are set
2. **API Rate Limits**: Implement retry logic and rate limiting for API calls
3. **File Permissions**: Ensure the application has write access to the output directory
4. **Large Responses**: Handle potential timeouts with longer generation requests

### Debugging

To enable verbose logging for troubleshooting:

```typescript
// Add to the top of your implementation file
const DEBUG = process.env.DEBUG === 'true';

// Then use throughout the code
if (DEBUG) {
  console.log('Detailed information:', data);
}
``` 