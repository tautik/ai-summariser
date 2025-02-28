import { useState } from 'react'
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
  useToast
} from '@chakra-ui/react'
import axios from 'axios'
import './App.css'
import theme from './theme'

// Define types for our data
interface Profile {
  id: string;
  name: string;
  username: string;
  description: string;
  profile_image_url: string;
}

interface Summary {
  profile: Profile;
  tweetSummary: string;
  tweetContent: string;
  followingSummary: string;
}

function App() {
  const [handle, setHandle] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [summary, setSummary] = useState<Summary | null>(null)
  const toast = useToast()

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

  return (
    <ChakraProvider theme={theme}>
      <Container maxW="container.lg" py={8}>
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading as="h1" size="2xl" mb={2}>AI Content Summarizer</Heading>
            <Text fontSize="lg" color="gray.600">
              Enter a Twitter handle to get a summary of their content
            </Text>
          </Box>

          <Box bg="white" p={6} borderRadius="md" boxShadow="md">
            <VStack spacing={4}>
              <HStack width="100%">
                <Input 
                  placeholder="Enter Twitter handle (without @)" 
                  value={handle} 
                  onChange={(e) => setHandle(e.target.value)}
                  size="lg"
                />
                <Button 
                  colorScheme="blue" 
                  size="lg" 
                  onClick={handleSubmit}
                  isLoading={loading}
                  loadingText="Summarizing"
                >
                  Summarize
                </Button>
              </HStack>
            </VStack>
          </Box>

          {loading && (
            <Box textAlign="center" py={10}>
              <Spinner size="xl" />
              <Text mt={4}>Analyzing Twitter data...</Text>
            </Box>
          )}

          {summary && (
            <Box bg="white" p={6} borderRadius="md" boxShadow="md">
              <VStack spacing={6} align="stretch">
                <Box>
                  <Heading as="h2" size="lg" mb={2}>Profile</Heading>
                  <HStack>
                    {summary.profile.profile_image_url && (
                      <Box boxSize="100px">
                        <img 
                          src={summary.profile.profile_image_url} 
                          alt={summary.profile.name} 
                          style={{ borderRadius: '50%' }}
                        />
                      </Box>
                    )}
                    <Box>
                      <Heading as="h3" size="md">{summary.profile.name}</Heading>
                      <Text color="gray.500">@{summary.profile.username}</Text>
                      <Text mt={2}>{summary.profile.description}</Text>
                    </Box>
                  </HStack>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" mb={2}>Tweet Summary</Heading>
                  <Text>{summary.tweetSummary}</Text>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" mb={2}>Recent Tweets</Heading>
                  <Box 
                    p={4} 
                    bg="gray.50" 
                    borderRadius="md" 
                    maxHeight="300px" 
                    overflowY="auto"
                    whiteSpace="pre-line"
                  >
                    {summary.tweetContent}
                  </Box>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" mb={2}>Following</Heading>
                  <Text>{summary.followingSummary}</Text>
                </Box>
              </VStack>
            </Box>
          )}
        </VStack>
      </Container>
    </ChakraProvider>
  )
}

export default App
