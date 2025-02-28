import { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Input,
  Button,
  VStack,
  HStack,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Code,
  Flex,
  Divider,
  Avatar,
  Link,
  Spinner
} from '@chakra-ui/react';
import { FaTwitter, FaLink, FaUnlink } from 'react-icons/fa';

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
  const toast = useToast();

  const handleSubmit = async () => {
    if (!handle.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a Twitter handle',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/social/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ handle }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      // Ensure the data structure matches what we expect
      if (!data.profile) {
        throw new Error('Invalid data structure received from API');
      }
      
      // If public_metrics is missing, add default values
      if (!data.profile.public_metrics) {
        data.profile.public_metrics = {
          followers_count: 0,
          following_count: 0,
          tweet_count: 0,
          listed_count: 0
        };
      }
      
      setSummary(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch data',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
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
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading display="flex" alignItems="center">
            <FaTwitter color="#1DA1F2" style={{ marginRight: '10px' }} />
            Twitter Analysis
          </Heading>
          <Text color="gray.500" mt={1}>
            Analyze Twitter profiles and get insights
          </Text>
        </Box>
        <Button
          leftIcon={isConnected ? <FaUnlink /> : <FaLink />}
          colorScheme={isConnected ? "red" : "twitter"}
          onClick={isConnected ? onDisconnect : onConnect}
        >
          {isConnected ? "Disconnect" : "Connect to Twitter"}
        </Button>
      </Flex>

      {!isConnected ? (
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <AlertTitle>Not connected!</AlertTitle>
          <AlertDescription>
            Connect to Twitter to analyze profiles and tweets.
          </AlertDescription>
        </Alert>
      ) : (
        <VStack spacing={6} align="stretch">
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Heading size="md" mb={4}>Enter Twitter Handle</Heading>
            <HStack>
              <Input
                placeholder="e.g. elonmusk"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                disabled={loading}
              />
              <Button
                colorScheme="twitter"
                onClick={handleSubmit}
                isLoading={loading}
                loadingText="Analyzing"
              >
                Analyze
              </Button>
            </HStack>
          </Box>

          {loading && (
            <Box textAlign="center" py={10}>
              <Spinner size="xl" color="twitter.500" />
              <Text mt={4}>Analyzing Twitter profile...</Text>
            </Box>
          )}

          {summary && !loading && (
            <Box mt={4}>
              <Tabs colorScheme="twitter" variant="enclosed">
                <TabList>
                  <Tab>Summary</Tab>
                  <Tab>Detailed View</Tab>
                  <Tab>Raw Data</Tab>
                </TabList>

                <TabPanels>
                  {/* Summary Tab */}
                  <TabPanel>
                    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
                      <Flex>
                        <Avatar 
                          size="xl" 
                          src={summary.profile.profile_image_url} 
                          name={summary.profile.name} 
                          mr={6}
                        />
                        <Box>
                          <Heading size="lg">
                            {summary.profile.name}
                            {summary.profile.verified && (
                              <Badge ml={2} colorScheme="twitter">Verified</Badge>
                            )}
                          </Heading>
                          <Text color="gray.500">@{summary.profile.username}</Text>
                          <Text mt={2}>{summary.profile.description}</Text>
                        </Box>
                      </Flex>

                      <Divider my={6} />

                      <Heading size="md" mb={4}>Tweet Summary</Heading>
                      <Text>{summary.tweetSummary}</Text>

                      <Divider my={6} />

                      <Heading size="md" mb={4}>Following Summary</Heading>
                      <Text>{summary.followingSummary}</Text>
                    </Box>
                  </TabPanel>

                  {/* Detailed View Tab */}
                  <TabPanel>
                    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" mb={6}>
                      <Heading size="md" mb={4}>Profile Details</Heading>
                      <Flex wrap="wrap">
                        <Avatar 
                          size="2xl" 
                          src={summary.profile.profile_image_url} 
                          name={summary.profile.name} 
                          mr={6}
                          mb={4}
                        />
                        <Box flex="1">
                          <Heading size="lg">
                            {summary.profile.name}
                            {summary.profile.verified && (
                              <Badge ml={2} colorScheme="twitter">Verified</Badge>
                            )}
                          </Heading>
                          <Text color="gray.500" fontSize="lg">@{summary.profile.username}</Text>
                          <Text mt={4} fontSize="md">{summary.profile.description}</Text>

                          <StatGroup mt={6}>
                            <Stat>
                              <StatLabel>Followers</StatLabel>
                              <StatNumber>
                                {safeGet(summary, 'profile.public_metrics.followers_count', 0).toLocaleString()}
                              </StatNumber>
                            </Stat>
                            <Stat>
                              <StatLabel>Following</StatLabel>
                              <StatNumber>
                                {safeGet(summary, 'profile.public_metrics.following_count', 0).toLocaleString()}
                              </StatNumber>
                            </Stat>
                            <Stat>
                              <StatLabel>Tweets</StatLabel>
                              <StatNumber>
                                {safeGet(summary, 'profile.public_metrics.tweet_count', 0).toLocaleString()}
                              </StatNumber>
                            </Stat>
                            <Stat>
                              <StatLabel>Listed</StatLabel>
                              <StatNumber>
                                {safeGet(summary, 'profile.public_metrics.listed_count', 0).toLocaleString()}
                              </StatNumber>
                            </Stat>
                          </StatGroup>
                        </Box>
                      </Flex>
                    </Box>

                    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" mb={6}>
                      <Heading size="md" mb={4}>Recent Tweets</Heading>
                      <Accordion allowMultiple>
                        {adaptTweetsForDisplay().map((tweet) => (
                          <AccordionItem key={tweet.id}>
                            <h2>
                              <AccordionButton>
                                <Box flex="1" textAlign="left">
                                  {tweet.text.length > 100 
                                    ? `${tweet.text.substring(0, 100)}...` 
                                    : tweet.text}
                                </Box>
                                <AccordionIcon />
                              </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                              <Text mb={2}>{tweet.text}</Text>
                              <Text color="gray.500" fontSize="sm">
                                Posted on: {formatDate(tweet.created_at)}
                              </Text>
                              <HStack mt={3} spacing={4}>
                                <Badge>Retweets: {safeGet(tweet, 'public_metrics.retweet_count', 0)}</Badge>
                                <Badge>Replies: {safeGet(tweet, 'public_metrics.reply_count', 0)}</Badge>
                                <Badge>Likes: {safeGet(tweet, 'public_metrics.like_count', 0)}</Badge>
                                <Badge>Quotes: {safeGet(tweet, 'public_metrics.quote_count', 0)}</Badge>
                              </HStack>
                              {tweet.source && (
                                <Text color="gray.500" fontSize="xs" mt={2}>
                                  Source: {tweet.source}
                                </Text>
                              )}
                              <Link 
                                href={`https://twitter.com/${summary.profile.username}/status/${tweet.id}`}
                                color="twitter.500"
                                isExternal
                                mt={2}
                                display="inline-block"
                              >
                                View on Twitter
                              </Link>
                            </AccordionPanel>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </Box>

                    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
                      <Heading size="md" mb={4}>Following</Heading>
                      <VStack align="stretch" spacing={3}>
                        {adaptFollowingForDisplay().map((user) => (
                          <Box 
                            key={user.id} 
                            p={3} 
                            borderWidth="1px" 
                            borderRadius="md"
                          >
                            <Flex align="center">
                              {user.profile_image_url && (
                                <Avatar 
                                  size="sm" 
                                  src={user.profile_image_url} 
                                  name={user.name} 
                                  mr={3}
                                />
                              )}
                              <Box>
                                <Text fontWeight="bold">
                                  {user.name}
                                  {user.verified && (
                                    <Badge ml={2} colorScheme="twitter" size="sm">Verified</Badge>
                                  )}
                                </Text>
                                <Text color="gray.500">@{user.username}</Text>
                                {user.description && (
                                  <Text fontSize="sm" mt={1}>{user.description}</Text>
                                )}
                              </Box>
                            </Flex>
                            <Link 
                              href={`https://twitter.com/${user.username}`}
                              color="twitter.500"
                              isExternal
                              fontSize="sm"
                              mt={2}
                              display="block"
                            >
                              View Profile
                            </Link>
                          </Box>
                        ))}
                      </VStack>
                    </Box>
                  </TabPanel>

                  {/* Raw Data Tab */}
                  <TabPanel>
                    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
                      <Heading size="md" mb={4}>Raw JSON Response</Heading>
                      <Box 
                        p={4} 
                        bg="gray.50" 
                        borderRadius="md" 
                        overflowX="auto"
                      >
                        <Code display="block" whiteSpace="pre" fontSize="sm">
                          {JSON.stringify(summary, null, 2)}
                        </Code>
                      </Box>
                    </Box>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          )}
        </VStack>
      )}
    </Box>
  );
};

export default TwitterPage; 