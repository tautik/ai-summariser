import { 
  Box, 
  Heading, 
  Text, 
  SimpleGrid, 
  Button, 
  Icon, 
  VStack, 
  useColorModeValue,
  Badge
} from '@chakra-ui/react';
import { FaTwitter, FaReddit, FaEnvelope, FaFacebook } from 'react-icons/fa';

interface HomePageProps {
  connectedServices: Record<string, boolean>;
  onConnect: (service: string) => void;
}

const HomePage = ({ connectedServices, onConnect }: HomePageProps) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const cardHoverBg = useColorModeValue('gray.50', 'gray.600');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const services = [
    { 
      id: 'twitter', 
      name: 'Twitter', 
      icon: FaTwitter, 
      color: 'twitter.500',
      description: 'Connect to Twitter to analyze profiles and tweets'
    },
    { 
      id: 'reddit', 
      name: 'Reddit', 
      icon: FaReddit, 
      color: 'orange.500',
      description: 'Connect to Reddit to analyze posts and comments'
    },
    { 
      id: 'gmail', 
      name: 'Gmail', 
      icon: FaEnvelope, 
      color: 'red.500',
      description: 'Connect to Gmail to analyze your email communications'
    },
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: FaFacebook, 
      color: 'blue.600',
      description: 'Connect to Facebook to analyze profiles and posts'
    }
  ];

  return (
    <Box>
      <Heading mb={2}>Dashboard</Heading>
      <Text mb={8} color="gray.500">
        Connect to your social media accounts to get started
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        {services.map((service) => (
          <Box
            key={service.id}
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            borderColor={borderColor}
            bg={cardBg}
            _hover={{ bg: cardHoverBg }}
            transition="all 0.2s"
            boxShadow="sm"
          >
            <VStack spacing={4} align="center">
              <Icon 
                as={service.icon} 
                boxSize={12} 
                color={service.color} 
              />
              <Heading size="md">
                {service.name}
                {connectedServices[service.id] && (
                  <Badge ml={2} colorScheme="green">
                    Connected
                  </Badge>
                )}
              </Heading>
              <Text textAlign="center" color="gray.500">
                {service.description}
              </Text>
              <Button
                colorScheme={connectedServices[service.id] ? "gray" : "blue"}
                onClick={() => onConnect(service.id)}
                isDisabled={connectedServices[service.id]}
                width="full"
              >
                {connectedServices[service.id] ? "Connected" : "Connect"}
              </Button>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default HomePage; 