import { useState } from 'react';
import { FaTwitter, FaLink, FaUnlink } from 'react-icons/fa';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

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
  tweets: {
    data: Tweet[];
  };
  following: {
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

const TwitterPage = ({ isConnected, onConnect, onDisconnect }: TwitterPageProps) => {
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!handle) {
      setError('Please enter a Twitter handle');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5001/api/social/twitter/${handle}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch Twitter data');
      }

      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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

  const adaptTweetsForDisplay = () => {
    if (!summary || !summary.rawData || !summary.rawData.tweets || !summary.rawData.tweets.data) {
      return [];
    }
    return summary.rawData.tweets.data;
  };

  const adaptFollowingForDisplay = () => {
    if (!summary || !summary.rawData || !summary.rawData.following || !summary.rawData.following.data) {
      return [];
    }
    return summary.rawData.following.data;
  };

  // Helper function to safely access nested properties
  const safeGet = (obj: any, path: string, defaultValue: any = undefined) => {
    const keys = path.split('.');
    return keys.reduce((o, key) => (o && o[key] !== undefined) ? o[key] : defaultValue, obj);
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
          <Card>
            <CardHeader>
              <CardTitle>Analyze Twitter Profile</CardTitle>
              <CardDescription>
                Enter a Twitter handle to analyze their profile and tweets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="e.g. elonmusk"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  disabled={loading}
                />
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Analyzing...' : 'Analyze'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {error && (
            <Card className="bg-destructive/15">
              <CardHeader>
                <CardTitle className="text-destructive">Error</CardTitle>
                <CardDescription>{error}</CardDescription>
              </CardHeader>
            </Card>
          )}

          {summary && (
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="profile" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="tweets">Tweets</TabsTrigger>
                    <TabsTrigger value="following">Following</TabsTrigger>
                    <TabsTrigger value="raw">Raw Data</TabsTrigger>
                  </TabsList>

                  <TabsContent value="profile">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        {summary.profile.profile_image_url && (
                          <img
                            src={summary.profile.profile_image_url}
                            alt={summary.profile.name}
                            className="w-16 h-16 rounded-full"
                          />
                        )}
                        <div>
                          <h3 className="text-lg font-semibold">{summary.profile.name}</h3>
                          <p className="text-muted-foreground">@{summary.profile.username}</p>
                        </div>
                      </div>
                      <p>{summary.profile.description}</p>
                      {summary.profile.public_metrics && (
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <p className="font-semibold">{summary.profile.public_metrics.followers_count}</p>
                            <p className="text-sm text-muted-foreground">Followers</p>
                          </div>
                          <div>
                            <p className="font-semibold">{summary.profile.public_metrics.following_count}</p>
                            <p className="text-sm text-muted-foreground">Following</p>
                          </div>
                          <div>
                            <p className="font-semibold">{summary.profile.public_metrics.tweet_count}</p>
                            <p className="text-sm text-muted-foreground">Tweets</p>
                          </div>
                          <div>
                            <p className="font-semibold">{summary.profile.public_metrics.listed_count}</p>
                            <p className="text-sm text-muted-foreground">Listed</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="tweets">
                    <div className="space-y-4">
                      <ScrollArea className="h-[400px]">
                        {summary.rawData.tweets.data.map((tweet) => (
                          <Card key={tweet.id} className="mb-4">
                            <CardContent className="pt-6">
                              <p>{tweet.text}</p>
                              <div className="flex justify-between mt-4 text-sm text-muted-foreground">
                                <span>{formatDate(tweet.created_at)}</span>
                                <div className="flex gap-4">
                                  <span>🔄 {tweet.public_metrics.retweet_count}</span>
                                  <span>💬 {tweet.public_metrics.reply_count}</span>
                                  <span>❤️ {tweet.public_metrics.like_count}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </ScrollArea>
                    </div>
                  </TabsContent>

                  <TabsContent value="following">
                    <div className="space-y-4">
                      <ScrollArea className="h-[400px]">
                        <div className="grid grid-cols-2 gap-4">
                          {summary.rawData.following.data.map((user) => (
                            <Card key={user.id}>
                              <CardHeader>
                                <div className="flex items-center gap-2">
                                  {user.profile_image_url && (
                                    <img
                                      src={user.profile_image_url}
                                      alt={user.name}
                                      className="w-10 h-10 rounded-full"
                                    />
                                  )}
                                  <div>
                                    <CardTitle className="text-base">{user.name}</CardTitle>
                                    <CardDescription>@{user.username}</CardDescription>
                                  </div>
                                </div>
                              </CardHeader>
                              {user.description && (
                                <CardContent>
                                  <p className="text-sm">{user.description}</p>
                                </CardContent>
                              )}
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </TabsContent>

                  <TabsContent value="raw">
                    <Card>
                      <CardContent>
                        <ScrollArea className="h-[400px]">
                          <pre className="p-4 bg-muted rounded-lg text-sm">
                            {JSON.stringify(summary.rawData, null, 2)}
                          </pre>
                        </ScrollArea>
                      </CardContent>
                    </Card>
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