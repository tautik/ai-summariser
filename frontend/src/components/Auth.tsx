import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Container,
  InputGroup,
  InputRightElement,
  FormErrorMessage
} from '@chakra-ui/react';

interface AuthProps {
  onLogin: () => void;
}

const Auth = ({ onLogin }: AuthProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ username: '', password: '' });
  const toast = useToast();

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const validateForm = () => {
    const newErrors = { username: '', password: '' };
    let isValid = true;

    if (!username) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // For demo purposes, accept "admin" as username and password
      if (username === 'admin' && password === 'admin') {
        localStorage.setItem('isAuthenticated', 'true');
        toast({
          title: 'Login successful',
          description: 'Welcome to the dashboard!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onLogin();
      } else {
        toast({
          title: 'Login failed',
          description: 'Invalid username or password. Try using "admin" for both.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Container maxW="md" py={12}>
      <Box bg="white" p={8} rounded="md" boxShadow="lg">
        <VStack spacing={6} align="stretch">
          <Box textAlign="center">
            <Heading as="h1" size="xl" mb={2}>Welcome</Heading>
            <Text color="gray.600">Sign in to access the dashboard</Text>
          </Box>
          
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.username}>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
                <FormErrorMessage>{errors.username}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={!!errors.password}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleTogglePassword}>
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>
              
              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                mt={4}
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </VStack>
          </form>
          
          <Text fontSize="sm" textAlign="center" color="gray.500">
            For demo purposes, use "admin" as both username and password
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default Auth; 