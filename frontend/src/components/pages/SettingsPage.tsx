import {
  Box,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Switch,
  VStack,
  Divider,
  Button,
  useToast,
  Select,
  HStack,
  useColorMode
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

const SettingsPage = () => {
  const [useMockData, setUseMockData] = useState(false);
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();

  useEffect(() => {
    // Load settings from localStorage
    const storedSettings = localStorage.getItem('appSettings');
    if (storedSettings) {
      const settings = JSON.parse(storedSettings);
      setUseMockData(settings.useMockData || false);
      setLanguage(settings.language || 'en');
    }
    
    // Set theme based on colorMode
    setTheme(colorMode);
  }, [colorMode]);

  const handleSaveSettings = () => {
    // Save settings to localStorage
    const settings = {
      useMockData,
      language,
      theme
    };
    localStorage.setItem('appSettings', JSON.stringify(settings));
    
    // Show success toast
    toast({
      title: 'Settings saved',
      description: 'Your preferences have been updated',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    if (newTheme !== colorMode) {
      toggleColorMode();
    }
  };

  return (
    <Box>
      <Heading mb={6}>Settings</Heading>
      
      <VStack spacing={6} align="stretch">
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
          <Heading size="md" mb={4}>Application Settings</Heading>
          
          <FormControl display="flex" alignItems="center" mb={4}>
            <FormLabel htmlFor="use-mock-data" mb="0">
              Use Mock Data
            </FormLabel>
            <Switch 
              id="use-mock-data" 
              isChecked={useMockData}
              onChange={(e) => setUseMockData(e.target.checked)}
            />
          </FormControl>
          
          <Text fontSize="sm" color="gray.500" mb={4}>
            When enabled, the application will use mock data instead of making real API calls.
            This is useful for testing and development purposes.
          </Text>
        </Box>

        <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
          <Heading size="md" mb={4}>Display Settings</Heading>
          
          <FormControl mb={4}>
            <FormLabel htmlFor="theme">Theme</FormLabel>
            <Select 
              id="theme" 
              value={theme}
              onChange={(e) => handleThemeChange(e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </Select>
          </FormControl>
          
          <FormControl mb={4}>
            <FormLabel htmlFor="language">Language</FormLabel>
            <Select 
              id="language" 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </Select>
          </FormControl>
        </Box>
        
        <Divider />
        
        <HStack justifyContent="flex-end">
          <Button colorScheme="blue" onClick={handleSaveSettings}>
            Save Settings
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default SettingsPage; 