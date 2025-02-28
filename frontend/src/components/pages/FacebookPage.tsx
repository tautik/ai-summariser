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
import { FaFacebook, FaLink, FaUnlink } from 'react-icons/fa';

interface FacebookPageProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const FacebookPage = ({ isConnected, onConnect, onDisconnect }: FacebookPageProps) => {
  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading display="flex" alignItems="center">
            <FaFacebook color="#1877F2" style={{ marginRight: '10px' }} />
            Facebook Analysis
          </Heading>
          <Text color="gray.500" mt={1}>
            Analyze Facebook profiles and posts
          </Text>
        </Box>
        <Button
          leftIcon={isConnected ? <FaUnlink /> : <FaLink />}
          colorScheme={isConnected ? "red" : "facebook"}
          onClick={isConnected ? onDisconnect : onConnect}
        >
          {isConnected ? "Disconnect" : "Connect to Facebook"}
        </Button>
      </Flex>

      {!isConnected ? (
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <AlertTitle>Not connected!</AlertTitle>
          <AlertDescription>
            Connect to Facebook to analyze profiles and posts.
          </AlertDescription>
        </Alert>
      ) : (
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
          <Heading size="md" mb={4}>Facebook Analysis</Heading>
          <Text>
            This feature is coming soon! Facebook integration is currently under development.
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default FacebookPage; 