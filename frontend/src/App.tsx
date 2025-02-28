import { useState, useEffect } from 'react'
import { 
  ChakraProvider, 
  Box, 
  Container, 
  Heading, 
  Text, 
  Input, 
  Button, 
  VStack, 
  HStack, 
  Spinner,
  useToast,
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
  Code
} from '@chakra-ui/react'
import axios from 'axios'
import './App.css'
import theme from './theme'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'

// Define types for our data
interface Profile {
  id: string;
  name: string;
  username: string;
  description: string;
  profile_image_url: string;
  verified?: boolean;
  public_metrics?: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
  };
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
}

interface Following {
  id: string;
  name: string;
  username: string;
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
  rawData?: RawData;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [handle, setHandle] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [summary, setSummary] = useState<Summary | null>(null)
  const toast = useToast()

  // Check if user is already authenticated on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleSubmit = async () => {
    if (!handle) {
      toast({
        title: 'Error',
        description: 'Please enter a Twitter handle',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setLoading(true)
    setSummary(null)

    try {
      const response = await axios.post('http://localhost:5001/api/social/summarize', { handle })
      setSummary(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch data. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = () => {
    setIsAuthenticated(true)
    localStorage.setItem('isAuthenticated', 'true')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('isAuthenticated')
    // Clear connected services on logout
    localStorage.removeItem('connectedServices')
  }

  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh">
        {isAuthenticated ? (
          <Dashboard onLogout={handleLogout} />
        ) : (
          <Auth onLogin={handleLogin} />
        )}
      </Box>
    </ChakraProvider>
  )
}

export default App
