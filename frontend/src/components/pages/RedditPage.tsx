import { useState, useEffect } from 'react';
import { FaReddit, FaLink, FaUnlink } from 'react-icons/fa';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

interface RedditPageProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

interface RedditPost {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  created: string;
  content: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  awards: number;
  isStickied: boolean;
  flair?: string;
}

interface RedditComment {
  id: string;
  author: string;
  content: string;
  created: string;
  upvotes: number;
  isAuthor: boolean;
}

interface Subreddit {
  name: string;
  displayName: string;
  description: string;
  subscribers: number;
  created: string;
  isNSFW: boolean;
}

interface RedditSummary {
  subreddit: Subreddit;
  posts: RedditPost[];
  comments: RedditComment[];
  contentSummary: string;
  topicAnalysis: string;
  communityInsights: string;
}

type SummaryType = 'hot' | 'new' | 'top';

// Sample Reddit data for different subreddits
const SCIENCE_POSTS: RedditPost[] = [
  {
    id: '1',
    title: 'Researchers develop new AI model that can predict protein structures with 98% accuracy',
    author: 'science_enthusiast',
    subreddit: 'r/science',
    created: '2025-02-28T08:15:00Z',
    content: 'A team of researchers has developed a new AI model that can predict protein structures with unprecedented accuracy. This breakthrough could accelerate drug discovery and our understanding of diseases.',
    upvotes: 4582,
    downvotes: 120,
    comments: 342,
    awards: 5,
    isStickied: false,
    flair: 'Computer Science'
  },
  {
    id: '2',
    title: 'New study finds that regular exercise can improve cognitive function by up to 30%',
    author: 'health_researcher',
    subreddit: 'r/science',
    created: '2025-02-25T10:45:00Z',
    content: 'A new longitudinal study following 5,000 participants over 10 years has found that those who exercised regularly showed significant improvements in memory, problem-solving, and overall cognitive function compared to sedentary individuals.',
    upvotes: 7654,
    downvotes: 89,
    comments: 421,
    awards: 6,
    isStickied: false,
    flair: 'Medicine'
  },
  {
    id: '3',
    title: 'Scientists discover new species of deep-sea creatures near hydrothermal vents',
    author: 'marine_biologist',
    subreddit: 'r/science',
    created: '2025-02-24T14:30:00Z',
    content: 'An expedition to the Mariana Trench has discovered 15 previously unknown species living near hydrothermal vents, including a type of extremophile bacteria that can survive in temperatures exceeding 150°C.',
    upvotes: 6234,
    downvotes: 45,
    comments: 287,
    awards: 4,
    isStickied: false,
    flair: 'Biology'
  }
];

const TECHNOLOGY_POSTS: RedditPost[] = [
  {
    id: '1',
    title: 'Monthly Discussion Thread - February 2025',
    author: 'mod_user',
    subreddit: 'r/technology',
    created: '2025-02-01T00:00:00Z',
    content: 'Welcome to the monthly discussion thread. This is a place to talk about technology, share news, ask questions, and discuss anything related to technology that doesn\'t warrant its own thread.',
    upvotes: 892,
    downvotes: 15,
    comments: 456,
    awards: 2,
    isStickied: true
  },
  {
    id: '2',
    title: 'Apple announces new AR glasses with 8-hour battery life and full-day display',
    author: 'tech_reporter',
    subreddit: 'r/technology',
    created: '2025-02-27T09:00:00Z',
    content: 'Apple has finally unveiled its long-rumored AR glasses, featuring a revolutionary display technology and all-day battery life. The device will be available for pre-order next month starting at $999.',
    upvotes: 12453,
    downvotes: 345,
    comments: 1876,
    awards: 9,
    isStickied: false,
    flair: 'Hardware'
  },
  {
    id: '3',
    title: 'EU passes landmark AI regulation requiring transparency in algorithmic decision-making',
    author: 'policy_watcher',
    subreddit: 'r/technology',
    created: '2025-02-26T11:20:00Z',
    content: 'The European Union has passed comprehensive legislation that will require companies to disclose when decisions are made by AI systems and provide explanations for those decisions. The law will take effect in 2026.',
    upvotes: 8765,
    downvotes: 123,
    comments: 654,
    awards: 7,
    isStickied: false,
    flair: 'Policy'
  }
];

const ASKREDDIT_POSTS: RedditPost[] = [
  {
    id: '1',
    title: 'What books have genuinely changed your perspective on life?',
    author: 'book_lover',
    subreddit: 'r/AskReddit',
    created: '2025-02-27T22:30:00Z',
    content: 'I\'m looking for books that have profoundly impacted how you see the world. Not just good reads, but ones that actually shifted your perspective or changed how you think about something important.',
    upvotes: 15243,
    downvotes: 230,
    comments: 2891,
    awards: 12,
    isStickied: false
  },
  {
    id: '2',
    title: 'What\'s a skill that took you less than a month to learn but has been incredibly useful?',
    author: 'curious_mind',
    subreddit: 'r/AskReddit',
    created: '2025-02-26T18:45:00Z',
    content: 'Looking for practical skills that don\'t take too long to learn but provide a lot of value in daily life or professionally.',
    upvotes: 24567,
    downvotes: 187,
    comments: 5432,
    awards: 15,
    isStickied: false
  },
  {
    id: '3',
    title: 'What\'s the most ridiculous thing you believed as a child?',
    author: 'nostalgia_seeker',
    subreddit: 'r/AskReddit',
    created: '2025-02-25T14:15:00Z',
    content: 'We all had some weird misconceptions when we were kids. What\'s the funniest or most absurd thing you used to believe?',
    upvotes: 32198,
    downvotes: 210,
    comments: 8765,
    awards: 23,
    isStickied: false
  }
];

const WORLDNEWS_POSTS: RedditPost[] = [
  {
    id: '1',
    title: 'Global climate agreement reached: 195 countries commit to 50% emissions reduction by 2035',
    author: 'environmental_reporter',
    subreddit: 'r/worldnews',
    created: '2025-02-28T12:00:00Z',
    content: 'After two weeks of intense negotiations, world leaders have reached a landmark agreement to cut greenhouse gas emissions by 50% within the next decade, with binding targets and financial mechanisms to support developing nations.',
    upvotes: 45678,
    downvotes: 1234,
    comments: 3456,
    awards: 18,
    isStickied: true,
    flair: 'Environment'
  },
  {
    id: '2',
    title: 'Scientists confirm first successful quantum teleportation of complex data between continents',
    author: 'quantum_enthusiast',
    subreddit: 'r/worldnews',
    created: '2025-02-27T08:30:00Z',
    content: 'In a major breakthrough, researchers have successfully teleported complex quantum information between laboratories in Europe and Asia, paving the way for a future quantum internet.',
    upvotes: 34567,
    downvotes: 876,
    comments: 2345,
    awards: 14,
    isStickied: false,
    flair: 'Science'
  },
  {
    id: '3',
    title: 'Universal basic income pilot program shows promising results after first year',
    author: 'economic_analyst',
    subreddit: 'r/worldnews',
    created: '2025-02-26T15:45:00Z',
    content: 'A three-year UBI pilot program in Finland has released its first-year results, showing improvements in employment, health outcomes, and overall well-being among participants receiving monthly payments.',
    upvotes: 23456,
    downvotes: 4567,
    comments: 5678,
    awards: 9,
    isStickied: false,
    flair: 'Economy'
  }
];

// Sample comments for different subreddits
const SCIENCE_COMMENTS: RedditComment[] = [
  {
    id: 'c1',
    author: 'user123',
    content: 'This is fascinating research. I wonder how it compares to the AlphaFold model that was released last year?',
    created: '2025-02-28T08:30:00Z',
    upvotes: 342,
    isAuthor: false
  },
  {
    id: 'c2',
    author: 'science_enthusiast',
    content: 'Great question! This new model actually builds on AlphaFold\'s architecture but incorporates a novel attention mechanism that allows it to better predict complex protein interactions.',
    created: '2025-02-28T08:45:00Z',
    upvotes: 289,
    isAuthor: true
  },
  {
    id: 'c3',
    author: 'protein_expert',
    content: 'As someone who works in this field, I can confirm this is a significant advancement. We\'ve already started using it in our lab with promising results.',
    created: '2025-02-28T09:15:00Z',
    upvotes: 567,
    isAuthor: false
  }
];

const TECHNOLOGY_COMMENTS: RedditComment[] = [
  {
    id: 'c1',
    author: 'apple_fan',
    content: 'I\'ve been waiting for Apple\'s AR glasses for years! The price is steep but if the battery life is really 8 hours, that\'s a game-changer compared to competitors.',
    created: '2025-02-27T09:15:00Z',
    upvotes: 876,
    isAuthor: false
  },
  {
    id: 'c2',
    author: 'tech_skeptic',
    content: 'I\'ll believe the battery life claims when I see independent reviews. Remember how the first Apple Watch barely lasted half a day despite similar promises?',
    created: '2025-02-27T09:30:00Z',
    upvotes: 1234,
    isAuthor: false
  },
  {
    id: 'c3',
    author: 'tech_reporter',
    content: 'According to the press release, the glasses use a new type of micro-LED display that consumes significantly less power than traditional displays. That\'s how they achieved the longer battery life.',
    created: '2025-02-27T10:00:00Z',
    upvotes: 543,
    isAuthor: true
  }
];

const ASKREDDIT_COMMENTS: RedditComment[] = [
  {
    id: 'c1',
    author: 'philosophy_lover',
    content: '"Sapiens" by Yuval Noah Harari completely changed how I view human history and our place in the world. It made me question so many assumptions I had about society and progress.',
    created: '2025-02-27T22:45:00Z',
    upvotes: 4321,
    isAuthor: false
  },
  {
    id: 'c2',
    author: 'book_enthusiast',
    content: '"Man\'s Search for Meaning" by Viktor Frankl. Reading about his experiences in concentration camps and how he found purpose even in the worst circumstances gave me a completely new perspective on suffering and resilience.',
    created: '2025-02-27T23:00:00Z',
    upvotes: 3456,
    isAuthor: false
  },
  {
    id: 'c3',
    author: 'book_lover',
    content: 'These are great recommendations! I\'ve read Sapiens and completely agree. I\'ll definitely check out Man\'s Search for Meaning - it\'s been on my list for a while.',
    created: '2025-02-27T23:15:00Z',
    upvotes: 876,
    isAuthor: true
  }
];

const WORLDNEWS_COMMENTS: RedditComment[] = [
  {
    id: 'c1',
    author: 'climate_scientist',
    content: 'While this agreement is a step in the right direction, we need to acknowledge that a 50% reduction by 2035 is still not enough to meet the 1.5°C target. We need more ambitious goals and faster implementation.',
    created: '2025-02-28T12:30:00Z',
    upvotes: 2345,
    isAuthor: false
  },
  {
    id: 'c2',
    author: 'policy_expert',
    content: 'The key difference with this agreement compared to previous ones is the binding enforcement mechanisms. Countries that fail to meet their targets will face significant economic consequences.',
    created: '2025-02-28T13:00:00Z',
    upvotes: 1876,
    isAuthor: false
  },
  {
    id: 'c3',
    author: 'environmental_reporter',
    content: 'That\'s correct. The agreement includes a new international climate court that will have the authority to impose sanctions on non-compliant nations. This was one of the most contentious aspects during negotiations.',
    created: '2025-02-28T13:15:00Z',
    upvotes: 1543,
    isAuthor: true
  }
];

// Sample subreddit data
const SCIENCE_SUBREDDIT: Subreddit = {
  name: 'science',
  displayName: 'r/science',
  description: 'This community is dedicated to discussing scientific research and advancements across all disciplines.',
  subscribers: 26800000,
  created: '2006-10-17T00:00:00Z',
  isNSFW: false
};

const TECHNOLOGY_SUBREDDIT: Subreddit = {
  name: 'technology',
  displayName: 'r/technology',
  description: 'Subreddit dedicated to the news and discussions about the creation and use of technology and its surrounding issues.',
  subscribers: 12500000,
  created: '2008-01-25T00:00:00Z',
  isNSFW: false
};

const ASKREDDIT_SUBREDDIT: Subreddit = {
  name: 'AskReddit',
  displayName: 'r/AskReddit',
  description: 'r/AskReddit is the place to ask and answer thought-provoking questions.',
  subscribers: 42300000,
  created: '2008-01-25T00:00:00Z',
  isNSFW: false
};

const WORLDNEWS_SUBREDDIT: Subreddit = {
  name: 'worldnews',
  displayName: 'r/worldnews',
  description: 'A place for major news from around the world, excluding US-internal news.',
  subscribers: 31200000,
  created: '2008-01-25T00:00:00Z',
  isNSFW: false
};

// Sample summaries for different subreddits
const SCIENCE_SUMMARY: RedditSummary = {
  subreddit: SCIENCE_SUBREDDIT,
  posts: SCIENCE_POSTS,
  comments: SCIENCE_COMMENTS,
  contentSummary: 'The r/science subreddit is primarily focused on sharing and discussing recent scientific research across various disciplines. The most popular posts tend to be about breakthroughs in medicine, technology, and environmental science. There is a strong emphasis on peer-reviewed research and credible sources.',
  topicAnalysis: 'The most frequently discussed topics in this subreddit include AI and machine learning (22%), medical research (18%), climate science (15%), astronomy (12%), and neuroscience (10%). There has been a notable increase in discussions about AI ethics and climate change mitigation strategies over the past month.',
  communityInsights: 'The community is highly engaged, with an average of 342 comments per popular post. Users tend to be well-informed, often citing additional research or asking insightful questions. The moderation is strict, with approximately 35% of comments being removed for not meeting the subreddit\'s scientific discussion standards.'
};

const TECHNOLOGY_SUMMARY: RedditSummary = {
  subreddit: TECHNOLOGY_SUBREDDIT,
  posts: TECHNOLOGY_POSTS,
  comments: TECHNOLOGY_COMMENTS,
  contentSummary: 'The r/technology subreddit focuses on news and discussions about technological advancements, product releases, and tech policy. Recent popular topics include Apple\'s AR glasses announcement, EU regulations on AI, and advancements in quantum computing. The community shows particular interest in consumer electronics and privacy-related issues.',
  topicAnalysis: 'Current trending topics include AR/VR technology (28%), AI regulation (22%), quantum computing (15%), cybersecurity (12%), and renewable energy tech (8%). There has been a significant increase in discussions about privacy concerns and regulatory frameworks for emerging technologies.',
  communityInsights: 'The r/technology community is diverse, with both tech enthusiasts and industry professionals. Discussions tend to be more critical of big tech companies compared to other tech forums. There\'s a strong focus on the societal implications of technology rather than just technical specifications.'
};

const ASKREDDIT_SUMMARY: RedditSummary = {
  subreddit: ASKREDDIT_SUBREDDIT,
  posts: ASKREDDIT_POSTS,
  comments: ASKREDDIT_COMMENTS,
  contentSummary: 'r/AskReddit is one of the most active communities on the platform, featuring a wide range of questions from the philosophical to the mundane. Popular questions often relate to personal experiences, hypothetical scenarios, and advice-seeking. The subreddit serves as a platform for storytelling and sharing diverse perspectives.',
  topicAnalysis: 'Recent popular question categories include life advice (25%), personal anecdotes (20%), hypothetical scenarios (18%), relationship questions (15%), and career advice (12%). Questions that invite users to share unusual or memorable experiences tend to receive the most engagement.',
  communityInsights: 'The community is extremely active, with top posts regularly receiving thousands of comments. The tone is generally casual and conversational, with users often building on each other\'s responses. Humor is highly valued, with witty or unexpected answers frequently receiving the most upvotes.'
};

const WORLDNEWS_SUMMARY: RedditSummary = {
  subreddit: WORLDNEWS_SUBREDDIT,
  posts: WORLDNEWS_POSTS,
  comments: WORLDNEWS_COMMENTS,
  contentSummary: 'r/worldnews focuses on major international news stories, excluding US-internal news. The subreddit covers a wide range of topics including geopolitics, climate change, technological breakthroughs, and economic developments. Recent popular posts have centered around climate agreements, scientific advancements, and economic policy experiments.',
  topicAnalysis: 'The most discussed topics currently include climate policy (30%), international relations (25%), scientific breakthroughs (20%), economic policy (15%), and humanitarian issues (10%). There has been a notable increase in climate-related news following the recent global climate agreement.',
  communityInsights: 'Discussions in r/worldnews tend to be more serious and politically charged compared to other subreddits. Users often provide additional context or analysis to news stories. The community is international, with perspectives from various countries and regions represented in the comments.'
};

// Default subreddits to analyze
const DEFAULT_SUBREDDITS = ['science', 'technology', 'AskReddit', 'worldnews'];

// Map subreddit names to their respective data
const SUBREDDIT_DATA_MAP: {[key: string]: RedditSummary} = {
  'science': SCIENCE_SUMMARY,
  'technology': TECHNOLOGY_SUMMARY,
  'AskReddit': ASKREDDIT_SUMMARY,
  'worldnews': WORLDNEWS_SUMMARY
};

const RedditPage = ({ isConnected, onConnect, onDisconnect }: RedditPageProps) => {
  const [subredditName, setSubredditName] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<RedditSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [summaryType, setSummaryType] = useState<SummaryType>('hot');
  const [defaultSummaries, setDefaultSummaries] = useState<{[key: string]: RedditSummary | null}>({});
  const [selectedDefaultSubreddit, setSelectedDefaultSubreddit] = useState<string | null>(null);

  // Auto-load sample data when connected
  useEffect(() => {
    if (isConnected) {
      loadDefaultSummaries();
    } else {
      setSummary(null);
      setDefaultSummaries({});
      setSelectedDefaultSubreddit(null);
    }
  }, [isConnected]);

  const loadDefaultSummaries = () => {
    const summaries: {[key: string]: RedditSummary | null} = {};
    
    // Load the appropriate data for each subreddit
    DEFAULT_SUBREDDITS.forEach(subreddit => {
      summaries[subreddit] = SUBREDDIT_DATA_MAP[subreddit];
    });
    
    setDefaultSummaries(summaries);
    
    // Set the first available summary as selected
    if (DEFAULT_SUBREDDITS.length > 0) {
      setSelectedDefaultSubreddit(DEFAULT_SUBREDDITS[0]);
      setSummary(summaries[DEFAULT_SUBREDDITS[0]]);
    }
  };

  const handleSubmit = async () => {
    if (!subredditName) {
      setError('Please enter a subreddit name');
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      const cleanSubredditName = subredditName.replace(/^r\//, '').toLowerCase();
      
      // Check if we have data for this subreddit
      if (DEFAULT_SUBREDDITS.map(s => s.toLowerCase()).includes(cleanSubredditName)) {
        const matchedSubreddit = DEFAULT_SUBREDDITS.find(s => s.toLowerCase() === cleanSubredditName);
        if (matchedSubreddit) {
          setSummary(SUBREDDIT_DATA_MAP[matchedSubreddit]);
          setSelectedDefaultSubreddit(matchedSubreddit);
        }
      } else {
        // Create a custom summary based on science data as a fallback
        const customSummary = {...SCIENCE_SUMMARY};
        customSummary.subreddit = {
          ...SCIENCE_SUBREDDIT, 
          name: cleanSubredditName, 
          displayName: `r/${cleanSubredditName}`,
          subscribers: Math.floor(Math.random() * 1000000) + 100000,
          created: new Date(Date.now() - Math.floor(Math.random() * 315360000000)).toISOString() // Random date within last 10 years
        };
        
        setSummary(customSummary);
        setSelectedDefaultSubreddit(null);
      }
      
      setLoading(false);
    }, 1500);
  };

  const selectDefaultSubreddit = (selectedSubreddit: string) => {
    setSelectedDefaultSubreddit(selectedSubreddit);
    setSummary(defaultSummaries[selectedSubreddit]);
    setSubredditName('');
    setError(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    return num >= 1000000
      ? `${(num / 1000000).toFixed(1)}M`
      : num >= 1000
      ? `${(num / 1000).toFixed(1)}K`
      : num.toString();
  };

  return (
    <div className="p-6 md:p-8">
      {!isConnected ? (
        <div className="flex flex-col items-center justify-center space-y-6 p-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <FaReddit className="text-orange-500 text-6xl mb-2" />
          <h2 className="text-2xl font-bold text-center">Connect to Reddit</h2>
          <p className="text-gray-500 text-center max-w-md">
            Connect your Reddit account to analyze subreddits, posts, and get AI-powered insights
          </p>
          <button
            onClick={onConnect}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full transition-colors"
          >
            <FaLink className="text-sm" /> Connect Reddit
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">Reddit Analysis</h1>
              <p className="text-gray-500">Analyze subreddits and get insights</p>
            </div>
            <button
              onClick={onDisconnect}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              <FaUnlink className="text-sm" /> Disconnect
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Analyze Subreddit</h2>
            <p className="text-gray-500 mb-4">
              Select a popular subreddit or enter a subreddit name to analyze
            </p>
            <div className="mb-5">
              <p className="text-sm text-gray-500 mb-3">Popular subreddits:</p>
              <div className="flex gap-2 flex-wrap">
                {DEFAULT_SUBREDDITS.map(subreddit => (
                  <button 
                    key={subreddit}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedDefaultSubreddit === subreddit 
                        ? "bg-orange-500 text-white" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => selectDefaultSubreddit(subreddit)}
                  >
                    r/{subreddit}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex-grow">
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g. r/science"
                  value={subredditName}
                  onChange={(e) => setSubredditName(e.target.value)}
                  disabled={loading}
                />
              </div>
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={loading || (!subredditName && !selectedDefaultSubreddit)}
              >
                {loading ? 'Analyzing...' : 'Analyze Subreddit'}
              </button>
            </div>
          </div>

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
                <CardTitle>Analysis Results for {summary.subreddit.displayName}</CardTitle>
                <CardDescription>
                  {summaryType === 'hot' && 'Summary of trending posts and discussions'}
                  {summaryType === 'new' && 'Analysis of newest content and early discussions'}
                  {summaryType === 'top' && 'Overview of all-time popular content'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="subreddit" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="subreddit">Subreddit</TabsTrigger>
                    <TabsTrigger value="posts">Posts</TabsTrigger>
                    <TabsTrigger value="comments">Comments</TabsTrigger>
                    <TabsTrigger value="summary">AI Summary</TabsTrigger>
                  </TabsList>

                  <TabsContent value="subreddit">
                    <div className="space-y-4">
                      <div className="flex flex-col gap-4">
                        <div>
                          <h3 className="text-lg font-semibold">{summary.subreddit.displayName}</h3>
                          <p className="text-muted-foreground">{summary.subreddit.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div>
                            <p className="font-semibold">{formatNumber(summary.subreddit.subscribers)}</p>
                            <p className="text-sm text-muted-foreground">Subscribers</p>
                          </div>
                          <div>
                            <p className="font-semibold">{formatDate(summary.subreddit.created)}</p>
                            <p className="text-sm text-muted-foreground">Created</p>
                          </div>
                          <div>
                            <p className="font-semibold">{summary.subreddit.isNSFW ? 'Yes' : 'No'}</p>
                            <p className="text-sm text-muted-foreground">NSFW</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="posts">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">
                          {summaryType === 'hot' && 'Hot Posts'}
                          {summaryType === 'new' && 'New Posts'}
                          {summaryType === 'top' && 'Top Posts'}
                        </h3>
                      </div>
                      <ScrollArea className="h-[400px]">
                        {summary.posts.map((post) => (
                          <Card key={post.id} className="mb-4">
                            <CardContent className="pt-6">
                              <div>
                                {post.isStickied && (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300 mb-2 inline-block">
                                    Pinned
                                  </span>
                                )}
                                {post.flair && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300 mb-2 ml-2 inline-block">
                                    {post.flair}
                                  </span>
                                )}
                              </div>
                              <h3 className="font-medium text-lg">{post.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                Posted by u/{post.author} in {post.subreddit} • {formatDate(post.created)}
                              </p>
                              <p className="mb-4">{post.content}</p>
                              <div className="flex gap-4 text-sm text-muted-foreground">
                                <span>⬆️ {formatNumber(post.upvotes)}</span>
                                <span>⬇️ {formatNumber(post.downvotes)}</span>
                                <span>💬 {formatNumber(post.comments)}</span>
                                {post.awards > 0 && <span>🏆 {post.awards}</span>}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </ScrollArea>
                    </div>
                  </TabsContent>

                  <TabsContent value="comments">
                    <div className="space-y-4">
                      <ScrollArea className="h-[400px]">
                        {summary.comments.map((comment) => (
                          <Card key={comment.id} className="mb-4">
                            <CardContent className="pt-6">
                              <div className="flex justify-between items-start">
                                <p className="text-sm font-medium">
                                  u/{comment.author}
                                  {comment.isAuthor && (
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300 ml-2">
                                      OP
                                    </span>
                                  )}
                                </p>
                                <span className="text-xs text-muted-foreground">{formatDate(comment.created)}</span>
                              </div>
                              <p className="mt-2">{comment.content}</p>
                              <div className="mt-2 text-sm text-muted-foreground">
                                <span>⬆️ {formatNumber(comment.upvotes)}</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </ScrollArea>
                    </div>
                  </TabsContent>

                  <TabsContent value="summary">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-medium mb-2">Content Summary</h3>
                            <p>{summary.contentSummary}</p>
                          </div>
                          <Separator />
                          <div>
                            <h3 className="text-lg font-medium mb-2">Topic Analysis</h3>
                            <p>{summary.topicAnalysis}</p>
                          </div>
                          <Separator />
                          <div>
                            <h3 className="text-lg font-medium mb-2">Community Insights</h3>
                            <p>{summary.communityInsights}</p>
                          </div>
                        </div>
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

export default RedditPage; 