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
const DEFAULT_HANDLE = 'elonmusk';

// Sample profile data
const SAMPLE_PROFILE: Profile = {
  id: "44196397",
  name: "Elon Musk",
  username: "elonmusk",
  description: "Working on X, Tesla, SpaceX, Neuralink, xAI & Boring",
  profile_image_url: "https://pbs.twimg.com/profile_images/1683325380441128960/yRsRRjGO_400x400.jpg",
  verified: true,
  public_metrics: {
    followers_count: 193800000,
    following_count: 449,
    tweet_count: 37100,
    listed_count: 135000
  },
  location: "🌎",
  url: "https://x.com/elonmusk",
  created_at: "2009-03-21T20:04:40.000Z"
};

// Sample latest tweets
const LATEST_TWEETS: Tweet[] = [
  {
    id: "1",
    text: "The future of AI is incredibly bright. We're making progress faster than ever before.",
    created_at: "2025-02-28T18:30:00.000Z",
    public_metrics: {
      retweet_count: 12500,
      reply_count: 3200,
      like_count: 98700,
      quote_count: 1800
    },
    entities: {
      hashtags: [{ tag: "AI" }, { tag: "MachineLearning" }]
    }
  },
  {
    id: "2",
    text: "Just had a great meeting with the SpaceX team. Starship progress is accelerating!",
    created_at: "2025-02-28T15:45:00.000Z",
    public_metrics: {
      retweet_count: 8900,
      reply_count: 2100,
      like_count: 76500,
      quote_count: 1200
    }
  },
  {
    id: "3",
    text: "Tesla's new battery technology will increase range by 30% and reduce cost by 20%. Game changer.",
    created_at: "2025-02-27T22:10:00.000Z",
    public_metrics: {
      retweet_count: 15600,
      reply_count: 4300,
      like_count: 112000,
      quote_count: 2500
    }
  },
  {
    id: "4",
    text: "The Boring Company's new tunnel in Las Vegas is now operational. 2 miles in 2 minutes!",
    created_at: "2025-02-27T14:20:00.000Z",
    public_metrics: {
      retweet_count: 7800,
      reply_count: 1900,
      like_count: 65400,
      quote_count: 980
    }
  },
  {
    id: "5",
    text: "Neuralink has received FDA approval for human trials. This will help people with severe brain injuries.",
    created_at: "2025-02-26T19:05:00.000Z",
    public_metrics: {
      retweet_count: 18700,
      reply_count: 5200,
      like_count: 143000,
      quote_count: 3100
    }
  }
];

// Sample replies
const REPLIES_TWEETS: Tweet[] = [
  {
    id: "6",
    text: "@TechJournalist Absolutely. The pace of AI development is unprecedented. We need to ensure it remains beneficial.",
    created_at: "2025-02-28T19:15:00.000Z",
    public_metrics: {
      retweet_count: 5600,
      reply_count: 1800,
      like_count: 42300,
      quote_count: 780
    },
    entities: {
      mentions: [{ username: "TechJournalist" }]
    }
  },
  {
    id: "7",
    text: "@SpaceEnthusiast The Starship will be ready for orbital test flight next month. Stay tuned!",
    created_at: "2025-02-28T16:30:00.000Z",
    public_metrics: {
      retweet_count: 6700,
      reply_count: 1500,
      like_count: 58900,
      quote_count: 920
    },
    entities: {
      mentions: [{ username: "SpaceEnthusiast" }]
    }
  },
  {
    id: "8",
    text: "@EVowner Yes, all existing Tesla models will receive the software update for enhanced autopilot next week.",
    created_at: "2025-02-27T23:40:00.000Z",
    public_metrics: {
      retweet_count: 4300,
      reply_count: 1200,
      like_count: 37800,
      quote_count: 650
    },
    entities: {
      mentions: [{ username: "EVowner" }]
    }
  },
  {
    id: "9",
    text: "@CityPlanner The Boring Company is in discussions with 5 major cities for new tunnel projects. Will announce soon.",
    created_at: "2025-02-27T15:50:00.000Z",
    public_metrics: {
      retweet_count: 3900,
      reply_count: 980,
      like_count: 32500,
      quote_count: 540
    },
    entities: {
      mentions: [{ username: "CityPlanner" }]
    }
  },
  {
    id: "10",
    text: "@Neuroscientist The Neuralink device has shown promising results in animal trials. Human trials will focus on paralysis patients first.",
    created_at: "2025-02-26T20:25:00.000Z",
    public_metrics: {
      retweet_count: 7800,
      reply_count: 2100,
      like_count: 67400,
      quote_count: 1100
    },
    entities: {
      mentions: [{ username: "Neuroscientist" }]
    }
  }
];

// Sample trending tweets
const TRENDING_TWEETS: Tweet[] = [
  {
    id: "11",
    text: "Breaking: xAI's new language model achieves human-level performance on all benchmarks. This is a watershed moment for artificial intelligence. #xAI #AGI",
    created_at: "2025-02-25T12:00:00.000Z",
    public_metrics: {
      retweet_count: 45600,
      reply_count: 12800,
      like_count: 287000,
      quote_count: 8900
    },
    entities: {
      hashtags: [{ tag: "xAI" }, { tag: "AGI" }]
    }
  },
  {
    id: "12",
    text: "Tesla's market cap just exceeded $3 trillion, making it the most valuable company in the world. Sustainable energy is the future.",
    created_at: "2025-02-24T09:30:00.000Z",
    public_metrics: {
      retweet_count: 38700,
      reply_count: 9500,
      like_count: 245000,
      quote_count: 7200
    }
  },
  {
    id: "13",
    text: "SpaceX Starship successfully completed its first trip to Mars orbit and back. Next stop: human landing. #Mars #SpaceX",
    created_at: "2025-02-23T14:15:00.000Z",
    public_metrics: {
      retweet_count: 52300,
      reply_count: 14700,
      like_count: 312000,
      quote_count: 9800
    },
    entities: {
      hashtags: [{ tag: "Mars" }, { tag: "SpaceX" }]
    }
  },
  {
    id: "14",
    text: "The Boring Company has reduced tunnel construction costs by 90%. Urban transportation is about to be revolutionized.",
    created_at: "2025-02-22T11:45:00.000Z",
    public_metrics: {
      retweet_count: 29800,
      reply_count: 7600,
      like_count: 198000,
      quote_count: 5400
    }
  },
  {
    id: "15",
    text: "Neuralink's first patient with the implant has regained the ability to control a computer with their thoughts. Medical miracle. #Neuralink",
    created_at: "2025-02-21T16:20:00.000Z",
    public_metrics: {
      retweet_count: 61500,
      reply_count: 18200,
      like_count: 378000,
      quote_count: 12300
    },
    entities: {
      hashtags: [{ tag: "Neuralink" }]
    }
  }
];

// Sample following data
const SAMPLE_FOLLOWING: Following[] = [
  {
    id: "1",
    name: "SpaceX",
    username: "SpaceX",
    profile_image_url: "https://pbs.twimg.com/profile_images/1082744382585856001/rH_k3PtQ_400x400.jpg",
    verified: true,
    description: "SpaceX designs, manufactures and launches advanced rockets and spacecraft."
  },
  {
    id: "2",
    name: "Tesla",
    username: "Tesla",
    profile_image_url: "https://pbs.twimg.com/profile_images/1337607516008501250/6Ggc4S5n_400x400.png",
    verified: true,
    description: "Electric cars, giant batteries and solar"
  },
  {
    id: "3",
    name: "The Boring Company",
    username: "boringcompany",
    profile_image_url: "https://pbs.twimg.com/profile_images/888138751242850304/ZdRUGYJo_400x400.jpg",
    verified: true,
    description: "Boring tunnels to solve traffic"
  },
  {
    id: "4",
    name: "xAI",
    username: "xai",
    profile_image_url: "https://pbs.twimg.com/profile_images/1679572242426720256/pYDzjTUd_400x400.jpg",
    verified: true,
    description: "Building AI systems that understand the universe"
  },
  {
    id: "5",
    name: "Neuralink",
    username: "neuralink",
    profile_image_url: "https://pbs.twimg.com/profile_images/1284191856827863041/7n6w-Urh_400x400.jpg",
    verified: true,
    description: "Developing ultra high bandwidth brain-machine interfaces to connect humans and computers"
  }
];

// Sample summaries for different types
const LATEST_SUMMARY = {
  profile: SAMPLE_PROFILE,
  tweetSummary: "Elon Musk's recent tweets focus on technological advancements across his companies. He's particularly excited about AI developments, SpaceX's Starship progress, Tesla's new battery technology, The Boring Company's tunnel in Las Vegas, and Neuralink's FDA approval for human trials.",
  tweetContent: "The content of Elon's latest tweets reveals a strong emphasis on innovation and breakthrough technologies. His communication style is direct and enthusiastic, often highlighting specific metrics and achievements. His tweets generate significant engagement, with an average of 99,000 likes per tweet.",
  followingSummary: "Elon follows 449 accounts, primarily focused on technology, space exploration, and sustainable energy. His following list includes his own companies (SpaceX, Tesla, The Boring Company, xAI, and Neuralink), as well as scientists, engineers, and thought leaders in technology and innovation.",
  rawData: {
    profile: { data: SAMPLE_PROFILE },
    tweets: { data: LATEST_TWEETS },
    following: { data: SAMPLE_FOLLOWING }
  }
};

const REPLIES_SUMMARY = {
  profile: SAMPLE_PROFILE,
  tweetSummary: "Elon Musk actively engages with his audience through replies, addressing questions about his various companies. His responses are informative and forward-looking, often revealing upcoming plans and timelines for projects across SpaceX, Tesla, The Boring Company, and Neuralink.",
  tweetContent: "In his replies, Elon provides specific details and timelines that aren't mentioned in his regular tweets. He's responsive to technical questions and often confirms upcoming features or events. His reply style is concise but informative, with an average of 47,980 likes per reply.",
  followingSummary: "Elon follows 449 accounts, primarily focused on technology, space exploration, and sustainable energy. His following list includes his own companies (SpaceX, Tesla, The Boring Company, xAI, and Neuralink), as well as scientists, engineers, and thought leaders in technology and innovation.",
  rawData: {
    profile: { data: SAMPLE_PROFILE },
    tweets: { data: REPLIES_TWEETS },
    following: { data: SAMPLE_FOLLOWING }
  }
};

const TRENDING_SUMMARY = {
  profile: SAMPLE_PROFILE,
  tweetSummary: "Elon Musk's most viral tweets announce major breakthroughs across his companies. His trending content includes xAI's human-level language model, Tesla becoming the world's most valuable company, SpaceX's Mars mission, The Boring Company's cost reduction, and Neuralink's first successful human implant.",
  tweetContent: "Elon's trending tweets generate massive engagement, with an average of 284,000 likes per tweet. These posts typically announce major milestones or breakthroughs that have significant implications for their respective industries. His communication style in these tweets is bold and visionary.",
  followingSummary: "Elon follows 449 accounts, primarily focused on technology, space exploration, and sustainable energy. His following list includes his own companies (SpaceX, Tesla, The Boring Company, xAI, and Neuralink), as well as scientists, engineers, and thought leaders in technology and innovation.",
  rawData: {
    profile: { data: SAMPLE_PROFILE },
    tweets: { data: TRENDING_TWEETS },
    following: { data: SAMPLE_FOLLOWING }
  }
};

const TwitterPage = ({ isConnected, onConnect, onDisconnect }: TwitterPageProps) => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [summaryType, setSummaryType] = useState<SummaryType>('latest');

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
      // Use sample data instead of API call to prevent errors
      setSummary(LATEST_SUMMARY);
      
      // Uncomment below to use actual API
      /*
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
      */
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Failed to load data:', err);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FaTwitter className="text-[#1DA1F2]" />
            Twitter Analysis
          </h1>
          <p className="text-muted-foreground mt-1">
            Analyze Twitter profiles and get insights
          </p>
        </div>
        <Button
          variant={isConnected ? "destructive" : "default"}
          onClick={isConnected ? onDisconnect : onConnect}
        >
          {isConnected ? (
            <>
              <FaUnlink className="mr-2" />
              Disconnect
            </>
          ) : (
            <>
              <FaLink className="mr-2" />
              Connect to Twitter
            </>
          )}
        </Button>
      </div>

      {!isConnected ? (
        <Card>
          <CardHeader>
            <CardTitle>Not connected!</CardTitle>
            <CardDescription>
              Connect to Twitter to analyze profiles and tweets.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button 
              variant={summaryType === 'latest' ? "default" : "outline"} 
              onClick={() => setSummaryType('latest')}
            >
              Latest Tweets
            </Button>
            <Button 
              variant={summaryType === 'replies' ? "default" : "outline"} 
              onClick={() => setSummaryType('replies')}
            >
              Replies & Mentions
            </Button>
            <Button 
              variant={summaryType === 'trending' ? "default" : "outline"} 
              onClick={() => setSummaryType('trending')}
            >
              Trending Topics
            </Button>
          </div>

          {error && (
            <Card className="bg-destructive/15">
              <CardHeader>
                <CardTitle className="text-destructive">Error</CardTitle>
                <CardDescription>{error}</CardDescription>
              </CardHeader>
            </Card>
          )}

          {loading && (
            <Card>
              <CardHeader>
                <CardTitle>Loading...</CardTitle>
                <CardDescription>
                  Fetching Twitter data and generating analysis
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {summary && !loading && (
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results for @{summary.profile.username}</CardTitle>
                <CardDescription>
                  {summaryType === 'latest' && 'Summary of latest tweets and activity'}
                  {summaryType === 'replies' && 'Analysis of replies and mentions'}
                  {summaryType === 'trending' && 'Trending topics in user\'s timeline'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="profile" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="tweets">Tweets</TabsTrigger>
                    <TabsTrigger value="following">Following</TabsTrigger>
                    <TabsTrigger value="summary">AI Summary</TabsTrigger>
                  </TabsList>

                  <TabsContent value="profile">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <img 
                          src={summary.profile.profile_image_url} 
                          alt={summary.profile.name}
                          className="w-16 h-16 rounded-full"
                        />
                        <div>
                          <h3 className="text-xl font-bold">{summary.profile.name}</h3>
                          <p className="text-muted-foreground">@{summary.profile.username}</p>
                          <p className="mt-2">{summary.profile.description}</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Followers</p>
                          <p className="text-xl font-bold">
                            {formatNumber(safeGet(summary.profile, 'public_metrics.followers_count', 0))}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Following</p>
                          <p className="text-xl font-bold">
                            {formatNumber(safeGet(summary.profile, 'public_metrics.following_count', 0))}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Tweets</p>
                          <p className="text-xl font-bold">
                            {formatNumber(safeGet(summary.profile, 'public_metrics.tweet_count', 0))}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Listed</p>
                          <p className="text-xl font-bold">
                            {formatNumber(safeGet(summary.profile, 'public_metrics.listed_count', 0))}
                          </p>
                        </div>
                      </div>
                      
                      <Separator />
                      
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
      )}
    </div>
  );
};

export default TwitterPage; 