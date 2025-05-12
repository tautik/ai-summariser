import { useState, useEffect } from 'react';
import { FaTwitter, FaLink, FaUnlink } from 'react-icons/fa';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TwitterPageProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

interface Profile {
  id: string;
  name: string;
  username: string;
  description: string;
  profile_image_url: string;
  verified: boolean;
  public_metrics?: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
  };
  location?: string;
  url?: string;
  created_at?: string;
  pinned_tweet_id?: string;
}

interface Tweet {
  id: string;
  text: string;
  created_at: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
  entities?: {
    hashtags?: Array<{ tag: string }>;
    mentions?: Array<any>;
  };
  source?: string;
}

interface Following {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
  verified?: boolean;
  description?: string;
}

interface RawData {
  profile: {
    data: Profile;
  };
  tweets?: {
    data: Tweet[];
  };
  following?: {
    data: Following[];
  };
}

interface Summary {
  profile: Profile;
  tweetSummary: string;
  tweetContent: string;
  followingSummary: string;
  rawData: RawData;
}

type SummaryType = 'latest' | 'replies' | 'trending';

// Default Twitter handle to analyze
const DEFAULT_HANDLE = 'TautikA';

// Sample profile data
const SAMPLE_PROFILE: Profile = {
  id: "1234567890",
  name: "Tautik Agrahari",
  username: "TautikA",
  description: "Tech enthusiast, developer, and founder. Exploring AI, startups, and developer tools.",
  profile_image_url: "https://pbs.twimg.com/profile_images/1234567890/tautik_400x400.jpg",
  verified: false,
  public_metrics: {
    followers_count: 1250,
    following_count: 520,
    tweet_count: 1876,
    listed_count: 42
  },
  location: "India",
  url: "https://x.com/TautikA",
  created_at: "2022-04-05T14:32:10.000Z"
};

// Sample latest tweets
const LATEST_TWEETS: Tweet[] = [
  {
    id: "1",
    text: "genuine",
    created_at: "2025-05-01T09:15:00.000Z",
    public_metrics: {
      retweet_count: 1,
      reply_count: 0,
      like_count: 8,
      quote_count: 0
    }
  },
  {
    id: "2",
    text: "never knew something like @baserunai existed",
    created_at: "2025-05-03T15:30:00.000Z",
    public_metrics: {
      retweet_count: 3,
      reply_count: 2,
      like_count: 15,
      quote_count: 0
    },
    entities: {
      mentions: [{ username: "baserunai" }]
    }
  },
  {
    id: "3",
    text: "any alternative for storing secrets? @infisical really sucks at this point",
    created_at: "2025-05-05T18:45:00.000Z",
    public_metrics: {
      retweet_count: 5,
      reply_count: 8,
      like_count: 12,
      quote_count: 1
    },
    entities: {
      mentions: [{ username: "infisical" }]
    }
  },
  {
    id: "4",
    text: "finally 🍻",
    created_at: "2025-05-07T14:20:00.000Z",
    public_metrics: {
      retweet_count: 2,
      reply_count: 1,
      like_count: 25,
      quote_count: 1
    }
  },
  {
    id: "5",
    text: "our new logo has a fun story behind it @Suhail",
    created_at: "2025-05-09T10:30:00.000Z",
    public_metrics: {
      retweet_count: 7,
      reply_count: 3,
      like_count: 32,
      quote_count: 2
    },
    entities: {
      mentions: [{ username: "Suhail" }]
    }
  }
];

// Sample replies
const REPLIES_TWEETS: Tweet[] = [
  {
    id: "6",
    text: "@therealprady Congratulations on the funding! Looking forward to seeing what you build next.",
    created_at: "2025-05-02T16:45:00.000Z",
    public_metrics: {
      retweet_count: 0,
      reply_count: 1,
      like_count: 5,
      quote_count: 0
    },
    entities: {
      mentions: [{ username: "therealprady" }]
    }
  },
  {
    id: "7",
    text: "@eshamanideep @gigaml is an agi company from now on",
    created_at: "2025-05-04T14:30:00.000Z",
    public_metrics: {
      retweet_count: 0,
      reply_count: 2,
      like_count: 3,
      quote_count: 0
    },
    entities: {
      mentions: [{ username: "eshamanideep" }, { username: "gigaml" }]
    }
  },
  {
    id: "8",
    text: "@varunvummadi I'm if you are a founder applying to @ycombinator looking to get your application reviewed fee free to DM me. Happy to help",
    created_at: "2025-05-06T13:20:00.000Z",
    public_metrics: {
      retweet_count: 1,
      reply_count: 0,
      like_count: 7,
      quote_count: 0
    },
    entities: {
      mentions: [{ username: "varunvummadi" }, { username: "ycombinator" }]
    }
  },
  {
    id: "9",
    text: "@baserunai How does your product compare to other testing frameworks? Looking for something that integrates well with our CI/CD pipeline.",
    created_at: "2025-05-08T16:10:00.000Z",
    public_metrics: {
      retweet_count: 0,
      reply_count: 1,
      like_count: 2,
      quote_count: 0
    },
    entities: {
      mentions: [{ username: "baserunai" }]
    }
  },
  {
    id: "10",
    text: "@infisical Have you considered improving the UX for secret rotation? That's a major pain point for us.",
    created_at: "2025-05-10T19:25:00.000Z",
    public_metrics: {
      retweet_count: 2,
      reply_count: 1,
      like_count: 8,
      quote_count: 0
    },
    entities: {
      mentions: [{ username: "infisical" }]
    }
  }
];

// Sample trending tweets
const TRENDING_TWEETS: Tweet[] = [
  {
    id: "11",
    text: "it's official — we raised a $5.5M seed led by @GVteam 🚀 AI lip sync is only the beginning everyone has a story to tell, but not everyone is a storyteller — yet imagine a world where we can remix and reimagine ourselves in video in exactly the way we want to be seen",
    created_at: "2025-05-01T10:00:00.000Z",
    public_metrics: {
      retweet_count: 145,
      reply_count: 53,
      like_count: 587,
      quote_count: 32
    },
    entities: {
      mentions: [{ username: "GVteam" }],
      hashtags: [{ tag: "AI" }, { tag: "LipSync" }]
    }
  },
  {
    id: "12",
    text: "I'm if you are a founder applying to @ycombinator looking to get your application reviewed fee free to DM me. Happy to help",
    created_at: "2025-05-03T09:30:00.000Z",
    public_metrics: {
      retweet_count: 78,
      reply_count: 34,
      like_count: 256,
      quote_count: 15
    },
    entities: {
      mentions: [{ username: "ycombinator" }]
    }
  },
  {
    id: "13",
    text: "@gigaml is an agi company from now on",
    created_at: "2025-05-05T08:45:00.000Z",
    public_metrics: {
      retweet_count: 112,
      reply_count: 45,
      like_count: 342,
      quote_count: 28
    },
    entities: {
      mentions: [{ username: "gigaml" }]
    }
  },
  {
    id: "14",
    text: "our new logo has a fun story behind it @Suhail",
    created_at: "2025-05-07T10:30:00.000Z",
    public_metrics: {
      retweet_count: 89,
      reply_count: 37,
      like_count: 275,
      quote_count: 19
    },
    entities: {
      mentions: [{ username: "Suhail" }]
    }
  },
  {
    id: "15",
    text: "Just hit 1000 GitHub stars on our open source project! Thanks to all the contributors who made this possible. #OpenSource #Milestone",
    created_at: "2025-05-11T11:10:00.000Z",
    public_metrics: {
      retweet_count: 67,
      reply_count: 29,
      like_count: 215,
      quote_count: 8
    },
    entities: {
      hashtags: [{ tag: "OpenSource" }, { tag: "Milestone" }]
    }
  }
];

// Sample following users
const SAMPLE_FOLLOWING: Following[] = [
  {
    id: "123456",
    name: "Prady",
    username: "therealprady",
    profile_image_url: "https://pbs.twimg.com/profile_images/1234567890/prady_400x400.jpg",
    verified: true,
    description: "Founder @ AI lip sync startup. Raised $5.5M seed led by GV."
  },
  {
    id: "123457",
    name: "Esha",
    username: "eshamanideep",
    profile_image_url: "https://pbs.twimg.com/profile_images/1234567890/esha_400x400.jpg",
    verified: false,
    description: "Working on AGI @ gigaml"
  },
  {
    id: "123458",
    name: "Varun Vummadi",
    username: "varunvummadi",
    profile_image_url: "https://pbs.twimg.com/profile_images/1234567890/varun_400x400.jpg",
    verified: false,
    description: "Helping founders apply to YC. DM for application reviews."
  },
  {
    id: "123459",
    name: "Baserun",
    username: "baserunai",
    profile_image_url: "https://pbs.twimg.com/profile_images/1234567890/baserun_400x400.jpg",
    verified: true,
    description: "Testing framework for AI applications. Simplify your testing workflow."
  },
  {
    id: "123460",
    name: "Infisical",
    username: "infisical",
    profile_image_url: "https://pbs.twimg.com/profile_images/1234567890/infisical_400x400.jpg",
    verified: true,
    description: "Secure secret management for developers and teams."
  }
];

// Sample summaries for different types
const LATEST_SUMMARY = {
  profile: SAMPLE_PROFILE,
  tweetSummary: "Tautik Agrahari's recent tweets focus on developer tools and technologies. He's been exploring services like Baserun AI, discussing alternatives to Infisical for secret management, and sharing brief reactions to tech news and announcements.",
  tweetContent: "Tautik's tweets are concise and direct, often mentioning specific tools or services he's exploring. His content reflects an active interest in developer productivity tools, particularly those related to AI and security. His engagement metrics show moderate interaction with his audience.",
  followingSummary: "Tautik follows 520 accounts, with a focus on tech founders, AI researchers, and developer tool companies. His following list includes startup founders who recently raised funding, AI companies, and developer tool providers that align with his professional interests.",
  rawData: {
    profile: { data: SAMPLE_PROFILE },
    tweets: { data: LATEST_TWEETS },
    following: { data: SAMPLE_FOLLOWING }
  }
};

const REPLIES_SUMMARY = {
  profile: SAMPLE_PROFILE,
  tweetSummary: "Tautik Agrahari actively engages with his network through replies, congratulating peers on their achievements, asking follow-up questions about products, and providing feedback on tools he uses. His interactions show a collaborative approach to the tech community.",
  tweetContent: "In his replies, Tautik is supportive and inquisitive, often asking specific questions about products or offering congratulations for achievements. He engages with founders, product teams, and fellow developers, showing interest in understanding the details behind announcements.",
  followingSummary: "Tautik follows 520 accounts, with a focus on tech founders, AI researchers, and developer tool companies. His following list includes startup founders who recently raised funding, AI companies, and developer tool providers that align with his professional interests.",
  rawData: {
    profile: { data: SAMPLE_PROFILE },
    tweets: { data: REPLIES_TWEETS },
    following: { data: SAMPLE_FOLLOWING }
  }
};

const TRENDING_SUMMARY = {
  profile: SAMPLE_PROFILE,
  tweetSummary: "Tautik Agrahari's most popular tweets focus on product launches, insights from his entrepreneurial journey, and open source contributions. His trending content includes announcements about his projects, thought leadership on AI and developer tools, and milestone celebrations.",
  tweetContent: "Tautik's trending tweets generate significantly higher engagement than his regular posts, with an average of 255 likes per tweet. These posts typically share major achievements, insights from his experience, or useful tools he's created. His communication style in these tweets is informative and authentic.",
  followingSummary: "Tautik follows 520 accounts, with a focus on tech founders, AI researchers, and developer tool companies. His following list includes startup founders who recently raised funding, AI companies, and developer tool providers that align with his professional interests.",
  rawData: {
    profile: { data: SAMPLE_PROFILE },
    tweets: { data: TRENDING_TWEETS },
    following: { data: SAMPLE_FOLLOWING }
  }
};

const TwitterPage = ({ isConnected, onConnect, onDisconnect }: TwitterPageProps) => {
  const [loading, setLoading] = useState(false);
  const [handle, setHandle] = useState(DEFAULT_HANDLE);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [summaryType, setSummaryType] = useState<SummaryType>('latest');
  const [error, setError] = useState<string | null>(null);
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState<boolean | null>(null);
  
  // Add this function to generate summary data for email
  const getEmailSummaryData = () => {
    if (!summary) {
      return {
        summary: 'No Twitter data available. Please connect your Twitter account and generate insights first.',
        details: {}
      };
    }
    
    // Create a summary for email
    const emailSummary = {
      summary: `Twitter Analysis for @${summary.profile.username}: ${summary.tweetSummary}`,
      details: {
        profile: {
          name: summary.profile.name,
          username: summary.profile.username,
          followers: summary.profile.public_metrics?.followers_count || 0,
          following: summary.profile.public_metrics?.following_count || 0,
          tweets: summary.profile.public_metrics?.tweet_count || 0
        },
        tweetInsights: {
          summaryType,
          tweetContent: summary.tweetContent,
          followingSummary: summary.followingSummary
        },
        topTweets: summary.rawData.tweets?.data.slice(0, 3).map(tweet => ({
          text: tweet.text,
          engagement: tweet.public_metrics.like_count + tweet.public_metrics.retweet_count
        })) || []
      }
    };
    
    return emailSummary;
  };
  
  // Function to send summary via email
  const sendSummaryEmail = async () => {
    if (!emailAddress || !summary) return;
    
    setSendingEmail(true);
    setEmailSuccess(null);
    
    try {
      const summaryData = getEmailSummaryData();
      
      const response = await fetch('http://localhost:5001/api/email/send-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailAddress,
          serviceName: 'twitter',
          summaryData
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setEmailSuccess(true);
        // Close modal after success
        setTimeout(() => {
          setIsEmailModalOpen(false);
          setEmailSuccess(null);
          setEmailAddress('');
        }, 2000);
      } else {
        setEmailSuccess(false);
        setError(data.message || 'Failed to send email');
      }
    } catch (err) {
      setEmailSuccess(false);
      setError(err instanceof Error ? err.message : 'An error occurred while sending email');
    } finally {
      setSendingEmail(false);
    }
  };
  
  // Make this function available to the parent component via a ref or context
  // For now, we'll attach it to the window object for demonstration purposes
  useEffect(() => {
    // @ts-ignore
    window.getTwitterSummaryData = getEmailSummaryData;
    // @ts-ignore
    window.sendTwitterSummaryEmail = sendSummaryEmail;
    
    return () => {
      // @ts-ignore
      delete window.getTwitterSummaryData;
      // @ts-ignore
      delete window.sendTwitterSummaryEmail;
    };
  }, [summary, summaryType, emailAddress]);

  // Load default summary on component mount or when connection status changes
  useEffect(() => {
    if (isConnected) {
      loadDefaultSummary();
    } else {
      setSummary(null);
    }
  }, [isConnected]);

  // Load different summary when summary type changes
  useEffect(() => {
    if (isConnected) {
      loadSummaryByType(summaryType);
    }
  }, [summaryType, isConnected]);

  const loadDefaultSummary = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch data from API
      const response = await fetch(`http://localhost:5001/api/social/twitter/${DEFAULT_HANDLE}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch Twitter data');
      }
      
      // Ensure the data has the expected structure
      const processedData = {
        ...data,
        rawData: {
          profile: data.rawData?.profile || { data: data.profile || {} },
          tweets: data.rawData?.tweets || { data: [] },
          following: data.rawData?.following || { data: [] }
        }
      };
      
      setSummary(processedData);
      
      // Fallback to sample data if API response doesn't have required data
      if (!processedData.profile || !processedData.tweetSummary) {
        console.warn('API response missing required data, using sample data');
        loadSummaryByType(summaryType);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      
      // Fallback to sample data on error
      console.log('Using sample data due to API error');
      loadSummaryByType(summaryType);
    } finally {
      setLoading(false);
    }
  };

  const loadSummaryByType = (type: SummaryType) => {
    setLoading(true);
    setError(null);
    
    try {
      // Load appropriate sample data based on type
      switch (type) {
        case 'latest':
          setSummary(LATEST_SUMMARY);
          break;
        case 'replies':
          setSummary(REPLIES_SUMMARY);
          break;
        case 'trending':
          setSummary(TRENDING_SUMMARY);
          break;
        default:
          setSummary(LATEST_SUMMARY);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to safely access nested properties
  const safeGet = (obj: any, path: string, defaultValue: any = undefined) => {
    const keys = path.split('.');
    return keys.reduce((o, key) => (o && o[key] !== undefined) ? o[key] : defaultValue, obj);
  };

  // Format numbers for better readability
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="p-6 md:p-8">
      {!isConnected ? (
        <div className="flex flex-col items-center justify-center space-y-6 p-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <FaTwitter className="text-blue-400 text-6xl mb-2" />
          <h2 className="text-2xl font-bold text-center">Connect to Twitter</h2>
          <p className="text-gray-500 text-center max-w-md">
            Connect your Twitter account to analyze profiles, tweets, and get AI-powered insights
          </p>
          <button
            onClick={onConnect}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full transition-colors"
          >
            <FaLink className="text-sm" /> Connect Twitter
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">Twitter Analysis</h1>
              <p className="text-gray-500">Analyze Twitter profiles and get insights</p>
            </div>
            <div className="flex items-center gap-3">
              {summary && (
                <button
                  onClick={() => setIsEmailModalOpen(true)}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Email Summary
                </button>
              )}
              <button
                onClick={onDisconnect}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                <FaUnlink className="text-sm" /> Disconnect
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <Button 
                variant={summaryType === 'latest' ? "default" : "outline"} 
                onClick={() => setSummaryType('latest')}
                className="px-4 py-2"
              >
                Latest Tweets
              </Button>
              <Button 
                variant={summaryType === 'replies' ? "default" : "outline"} 
                onClick={() => setSummaryType('replies')}
                className="px-4 py-2"
              >
                Replies & Mentions
              </Button>
              <Button 
                variant={summaryType === 'trending' ? "default" : "outline"} 
                onClick={() => setSummaryType('trending')}
                className="px-4 py-2"
              >
                Trending Topics
              </Button>
            </div>

            {error && (
              <Card className="bg-destructive/15 mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-destructive">Error</CardTitle>
                  <CardDescription>{error}</CardDescription>
                </CardHeader>
              </Card>
            )}

            {loading && (
              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <CardTitle>Loading...</CardTitle>
                  <CardDescription>
                    Fetching Twitter data and generating analysis
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            {summary && !loading && (
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle>Analysis Results for @{summary.profile.username}</CardTitle>
                  <CardDescription>
                    {summaryType === 'latest' && 'Summary of latest tweets and activity'}
                    {summaryType === 'replies' && 'Analysis of replies and mentions'}
                    {summaryType === 'trending' && 'Trending topics in user\'s timeline'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="profile" className="space-y-6">
                    <TabsList className="mb-2">
                      <TabsTrigger value="profile">Profile</TabsTrigger>
                      <TabsTrigger value="tweets">Tweets</TabsTrigger>
                      <TabsTrigger value="following">Following</TabsTrigger>
                      <TabsTrigger value="summary">AI Summary</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="mt-4">
                      <div className="space-y-6">
                        <div className="flex items-start gap-5">
                          <img 
                            src={summary.profile.profile_image_url} 
                            alt={summary.profile.name}
                            className="w-20 h-20 rounded-full"
                          />
                          <div>
                            <h3 className="text-2xl font-bold">{summary.profile.name}</h3>
                            <p className="text-muted-foreground">@{summary.profile.username}</p>
                            <p className="mt-3">{summary.profile.description}</p>
                          </div>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Followers</p>
                            <p className="text-2xl font-bold">
                              {formatNumber(safeGet(summary.profile, 'public_metrics.followers_count', 0))}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Following</p>
                            <p className="text-2xl font-bold">
                              {formatNumber(safeGet(summary.profile, 'public_metrics.following_count', 0))}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Tweets</p>
                            <p className="text-2xl font-bold">
                              {formatNumber(safeGet(summary.profile, 'public_metrics.tweet_count', 0))}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Listed</p>
                            <p className="text-2xl font-bold">
                              {formatNumber(safeGet(summary.profile, 'public_metrics.listed_count', 0))}
                            </p>
                          </div>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Location</p>
                          <p>{summary.profile.location || 'Not specified'}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Joined</p>
                          <p>{summary.profile.created_at ? formatDate(summary.profile.created_at) : 'Unknown'}</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="tweets">
                      <ScrollArea className="h-[400px]">
                        {summary.rawData.tweets && summary.rawData.tweets.data && summary.rawData.tweets.data.length > 0 ? (
                          <div className="space-y-4">
                            {summary.rawData.tweets.data.map((tweet) => (
                              <Card key={tweet.id}>
                                <CardContent className="pt-6">
                                  <p>{tweet.text}</p>
                                  <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                                    <span>{formatDate(tweet.created_at)}</span>
                                    <div className="flex gap-4">
                                      <span>{formatNumber(tweet.public_metrics.retweet_count)} retweets</span>
                                      <span>{formatNumber(tweet.public_metrics.reply_count)} replies</span>
                                      <span>{formatNumber(tweet.public_metrics.like_count)} likes</span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <p>No tweets available</p>
                        )}
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="following">
                      <ScrollArea className="h-[400px]">
                        {summary.rawData.following && summary.rawData.following.data && summary.rawData.following.data.length > 0 ? (
                          <div className="space-y-4">
                            {summary.rawData.following.data.map((user) => (
                              <Card key={user.id}>
                                <CardContent className="pt-6">
                                  <div className="flex items-start gap-4">
                                    {user.profile_image_url && (
                                      <img 
                                        src={user.profile_image_url} 
                                        alt={user.name}
                                        className="w-12 h-12 rounded-full"
                                      />
                                    )}
                                    <div>
                                      <h3 className="font-bold">{user.name}</h3>
                                      <p className="text-muted-foreground">@{user.username}</p>
                                      {user.description && <p className="mt-1">{user.description}</p>}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <p>No following data available</p>
                        )}
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="summary">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium mb-2">Tweet Analysis</h3>
                          <p>{summary.tweetSummary}</p>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Tweet Content</h3>
                          <p>{summary.tweetContent}</p>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Following Analysis</h3>
                          <p>{summary.followingSummary}</p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
      
      {/* Email Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Send Twitter Summary</h3>
            <p className="text-gray-600 mb-4">
              Enter your email address to receive a detailed summary of @{summary?.profile.username}'s Twitter activity.
            </p>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {emailSuccess === true && (
              <div className="mb-4 bg-green-100 text-green-800 p-3 rounded-md">
                Email sent successfully! Check your inbox.
              </div>
            )}
            
            {emailSuccess === false && (
              <div className="mb-4 bg-red-100 text-red-800 p-3 rounded-md">
                Failed to send email. Please try again.
              </div>
            )}
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsEmailModalOpen(false);
                  setEmailSuccess(null);
                  setEmailAddress('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={sendSummaryEmail}
                disabled={!emailAddress || sendingEmail}
                className={`px-4 py-2 rounded-md text-white ${
                  !emailAddress || sendingEmail
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {sendingEmail ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TwitterPage; 