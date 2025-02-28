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
import { FaEnvelope, FaLink, FaUnlink } from 'react-icons/fa';

interface GmailPageProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const GmailPage = ({ isConnected, onConnect, onDisconnect }: GmailPageProps) => {
  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading display="flex" alignItems="center">
            <FaEnvelope color="#D44638" style={{ marginRight: '10px' }} />
            Gmail Analysis
          </Heading>
          <Text color="gray.500" mt={1}>
            Analyze your email communications
          </Text>
        </Box>
        <Button
          leftIcon={isConnected ? <FaUnlink /> : <FaLink />}
          colorScheme={isConnected ? "red" : "red"}
          onClick={isConnected ? onDisconnect : onConnect}
        >
          {isConnected ? "Disconnect" : "Connect to Gmail"}
        </Button>
      </Flex>

      {!isConnected ? (
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <AlertTitle>Not connected!</AlertTitle>
          <AlertDescription>
            Connect to Gmail to analyze your email communications.
          </AlertDescription>
        </Alert>
      ) : (
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
          <Heading size="md" mb={4}>Gmail Analysis</Heading>
          <Text>
            This feature is coming soon! Gmail integration is currently under development.
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default GmailPage; 