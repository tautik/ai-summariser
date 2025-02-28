import {
  Box,
  Heading,
  Text,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex
} from '@chakra-ui/react';
import { FaReddit, FaLink, FaUnlink } from 'react-icons/fa';

interface RedditPageProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const RedditPage = ({ isConnected, onConnect, onDisconnect }: RedditPageProps) => {
  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading display="flex" alignItems="center">
            <FaReddit color="#FF4500" style={{ marginRight: '10px' }} />
            Reddit Analysis
          </Heading>
          <Text color="gray.500" mt={1}>
            Analyze Reddit profiles and posts
          </Text>
        </Box>
        <Button
          leftIcon={isConnected ? <FaUnlink /> : <FaLink />}
          colorScheme={isConnected ? "red" : "orange"}
          onClick={isConnected ? onDisconnect : onConnect}
        >
          {isConnected ? "Disconnect" : "Connect to Reddit"}
        </Button>
      </Flex>

      {!isConnected ? (
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <AlertTitle>Not connected!</AlertTitle>
          <AlertDescription>
            Connect to Reddit to analyze profiles and posts.
          </AlertDescription>
        </Alert>
      ) : (
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
          <Heading size="md" mb={4}>Reddit Analysis</Heading>
          <Text>
            This feature is coming soon! Reddit integration is currently under development.
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default RedditPage; 