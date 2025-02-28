import { useState, useEffect } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import HomePage from './pages/HomePage';
import TwitterPage from './pages/TwitterPage';
import RedditPage from './pages/RedditPage';
import GmailPage from './pages/GmailPage';
import FacebookPage from './pages/FacebookPage';
import SettingsPage from './pages/SettingsPage';

// Define CSS animations
const keyframes = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slideIn {
    from { transform: translateX(-20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(66, 153, 225, 0); }
    100% { box-shadow: 0 0 0 0 rgba(66, 153, 225, 0); }
  }
  
  .dashboard-content {
    animation: fadeIn 0.5s ease-out forwards;
  }
  
  .dashboard-sidebar {
    animation: slideIn 0.4s ease-out forwards;
  }
  
  .dashboard-container {
    background: linear-gradient(135deg, rgba(247, 250, 252, 0.8) 0%, rgba(237, 242, 247, 0.8) 100%);
  }
  
  .content-container {
    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
  }
  
  .content-container:hover {
    box-shadow: 0 6px 24px rgba(66, 153, 225, 0.15);
  }
`;

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
  const [pageTransition, setPageTransition] = useState(false);

  // Inject CSS animations
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = keyframes;
    document.head.appendChild(styleElement);
    
    // Cleanup style element on unmount
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

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
    // Add page transition animation
    setPageTransition(true);
    setTimeout(() => {
      setActivePage(page);
      setPageTransition(false);
    }, 300);
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

  // Create animated background elements
  const BackgroundElements = () => (
    <Box position="absolute" top="0" left="0" right="0" bottom="0" overflow="hidden" zIndex="-1">
      <Box 
        position="absolute" 
        top="-100px" 
        left="-100px" 
        width="300px" 
        height="300px" 
        borderRadius="full" 
        bg="blue.50" 
        opacity="0.4"
        style={{ filter: 'blur(40px)' }}
      />
      <Box 
        position="absolute" 
        bottom="-80px" 
        right="-80px" 
        width="250px" 
        height="250px" 
        borderRadius="full" 
        bg="purple.50" 
        opacity="0.3"
        style={{ filter: 'blur(40px)' }}
      />
      <Box 
        position="absolute" 
        top="30%" 
        right="10%" 
        width="200px" 
        height="200px" 
        borderRadius="full" 
        bg="teal.50" 
        opacity="0.3"
        style={{ filter: 'blur(30px)' }}
      />
    </Box>
  );

  return (
    <Flex h="100vh" overflow="hidden" position="relative" className="dashboard-container">
      <BackgroundElements />
      
      <Box className="dashboard-sidebar">
        <Sidebar 
          onNavigate={handleNavigate} 
          activePage={activePage} 
          onLogout={onLogout} 
        />
      </Box>
      
      <Box 
        ml="64" 
        w="calc(100% - 16rem)" 
        h="100vh" 
        p="6" 
        overflow="auto"
        style={{
          opacity: pageTransition ? 0 : 1,
          transform: pageTransition ? 'translateY(10px)' : 'translateY(0)',
          transition: 'all 0.3s ease-out'
        }}
      >
        <Box 
          className="content-container dashboard-content" 
          p="6" 
          h="calc(100vh - 3rem)"
          overflow="auto"
        >
          {renderContent()}
        </Box>
      </Box>
    </Flex>
  );
};

export default Dashboard; 