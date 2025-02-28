import { useState, useEffect } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import HomePage from './pages/HomePage';
import TwitterPage from './pages/TwitterPage';
import RedditPage from './pages/RedditPage';
import GmailPage from './pages/GmailPage';
import FacebookPage from './pages/FacebookPage';
import SettingsPage from './pages/SettingsPage';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [activePage, setActivePage] = useState('home');
  const [connectedServices, setConnectedServices] = useState<Record<string, boolean>>({
    twitter: false,
    reddit: false,
    gmail: false,
    facebook: false
  });

  // Load connected services from localStorage on mount
  useEffect(() => {
    const storedServices = localStorage.getItem('connectedServices');
    if (storedServices) {
      setConnectedServices(JSON.parse(storedServices));
    }
  }, []);

  // Save connected services to localStorage when they change
  useEffect(() => {
    localStorage.setItem('connectedServices', JSON.stringify(connectedServices));
  }, [connectedServices]);

  const handleNavigate = (page: string) => {
    setActivePage(page);
  };

  const handleConnectService = (service: string) => {
    setConnectedServices(prev => ({
      ...prev,
      [service]: true
    }));
  };

  const handleDisconnectService = (service: string) => {
    setConnectedServices(prev => ({
      ...prev,
      [service]: false
    }));
  };

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return (
          <HomePage 
            connectedServices={connectedServices} 
            onConnect={handleConnectService}
          />
        );
      case 'twitter':
        return (
          <TwitterPage 
            isConnected={connectedServices.twitter} 
            onConnect={() => handleConnectService('twitter')}
            onDisconnect={() => handleDisconnectService('twitter')}
          />
        );
      case 'reddit':
        return (
          <RedditPage 
            isConnected={connectedServices.reddit} 
            onConnect={() => handleConnectService('reddit')}
            onDisconnect={() => handleDisconnectService('reddit')}
          />
        );
      case 'gmail':
        return (
          <GmailPage 
            isConnected={connectedServices.gmail} 
            onConnect={() => handleConnectService('gmail')}
            onDisconnect={() => handleDisconnectService('gmail')}
          />
        );
      case 'facebook':
        return (
          <FacebookPage 
            isConnected={connectedServices.facebook} 
            onConnect={() => handleConnectService('facebook')}
            onDisconnect={() => handleDisconnectService('facebook')}
          />
        );
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage 
          connectedServices={connectedServices} 
          onConnect={handleConnectService}
        />;
    }
  };

  return (
    <Flex h="100vh" overflow="hidden">
      <Sidebar 
        onNavigate={handleNavigate} 
        activePage={activePage} 
        onLogout={onLogout} 
      />
      <Box 
        ml="64" 
        w="calc(100% - 16rem)" 
        h="100vh" 
        p="6" 
        overflow="auto"
      >
        {renderContent()}
      </Box>
    </Flex>
  );
};

export default Dashboard; 