import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import HomePage from './pages/HomePage';
import TwitterPage from './pages/TwitterPage';
import RedditPage from './pages/RedditPage';
import GmailPage from './pages/GmailPage';
import FacebookPage from './pages/FacebookPage';
import SettingsPage from './pages/SettingsPage';
import SyncToEmailButton from './SyncToEmailButton';

// Define CSS animations
const keyframes = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
  
  .fade-out {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }
  
  .slide-in {
    animation: slideIn 0.5s ease-out forwards;
  }
  
  .pulse {
    animation: pulse 2s infinite;
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
    twitter: true,
    reddit: true,
    gmail: true,
    facebook: true
  });
  const [pageTransition, setPageTransition] = useState(false);
  const [summaryData, setSummaryData] = useState({
    summary: 'Your connected services show interesting patterns in your social media engagement and communications.',
    details: {
      service: 'all',
      timestamp: new Date().toISOString(),
      metrics: {
        engagementRate: 8.7,
        topTopics: ['AI', 'Technology', 'Innovation'],
        sentimentScore: 0.75
      }
    }
  });

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
  
  // Load connected services from localStorage
  useEffect(() => {
    const savedServices = localStorage.getItem('connectedServices');
    if (savedServices) {
      try {
        setConnectedServices(JSON.parse(savedServices));
      } catch (error) {
        console.error('Error parsing saved services:', error);
      }
    }
  }, []);
  
  // Save connected services to localStorage
  useEffect(() => {
    localStorage.setItem('connectedServices', JSON.stringify(connectedServices));
  }, [connectedServices]);

  const handleNavigate = (page: string) => {
    setPageTransition(true);
    
    // Delay page change to allow for transition animation
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
    
    // Update summary data when a service is connected
    updateSummaryData(service, true);
  };

  const handleDisconnectService = (service: string) => {
    setConnectedServices(prev => ({
      ...prev,
      [service]: false
    }));
    
    // Update summary data when a service is disconnected
    updateSummaryData(service, false);
  };
  
  // Update summary data based on active service
  const updateSummaryData = (service: string, isConnected: boolean) => {
    if (isConnected) {
      // Try to get summary data from the window object (set by the page components)
      // This is a simplified approach - in a real app, you would use refs or context
      let pageData = { 
        summary: '', 
        details: {
          service: '',
          timestamp: new Date().toISOString(),
          metrics: {
            engagementRate: 0,
            topTopics: [''],
            sentimentScore: 0
          }
        } 
      };
      
      switch (service) {
        case 'twitter':
          // @ts-ignore
          if (window.getTwitterSummaryData) {
            // @ts-ignore
            pageData = window.getTwitterSummaryData();
          } else {
            pageData = {
              summary: `Analysis of your Twitter data shows interesting patterns in your social media engagement.`,
              details: {
                service,
                timestamp: new Date().toISOString(),
                metrics: {
                  engagementRate: Math.random() * 10,
                  topTopics: ['AI', 'Technology', 'Innovation'],
                  sentimentScore: (Math.random() * 2) - 1 // Between -1 and 1
                }
              }
            };
          }
          break;
        case 'reddit':
        case 'gmail':
        case 'facebook':
        default:
          pageData = {
            summary: `Analysis of your ${service} data shows interesting patterns in your social media engagement.`,
            details: {
              service,
              timestamp: new Date().toISOString(),
              metrics: {
                engagementRate: Math.random() * 10,
                topTopics: ['AI', 'Technology', 'Innovation'],
                sentimentScore: (Math.random() * 2) - 1 // Between -1 and 1
              }
            }
          };
      }
      
      setSummaryData(pageData);
    }
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
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: "hidden",
      zIndex: -1
    }}>
      <div 
        style={{
          position: "absolute",
          top: "-10%",
          left: "-5%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          backgroundColor: "rgba(235, 248, 255, 0.4)",
          opacity: 0.4,
          animation: "pulse 15s infinite ease-in-out"
        }}
      />
      <div 
        style={{
          position: "absolute",
          bottom: "-15%",
          right: "-10%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          backgroundColor: "rgba(237, 233, 254, 0.3)",
          opacity: 0.3,
          animation: "pulse 20s infinite ease-in-out"
        }}
      />
      <div 
        style={{
          position: "absolute",
          top: "30%",
          right: "20%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          backgroundColor: "rgba(230, 255, 250, 0.2)",
          opacity: 0.2,
          animation: "pulse 12s infinite ease-in-out"
        }}
      />
    </div>
  );

  return (
    <div style={{
      height: "100vh",
      overflow: "hidden",
      position: "relative",
      display: "flex"
    }}>
      <BackgroundElements />
      
      {/* Sync to Email Button - visible only on home page */}
      {activePage === 'home' && (
        <SyncToEmailButton 
          serviceName="Dashboard" 
          summaryData={summaryData}
        />
      )}
      
      <Sidebar 
        onNavigate={handleNavigate} 
        activePage={activePage} 
        onLogout={onLogout} 
      />
      
      <div 
        style={{
          flex: 1,
          padding: "2rem",
          opacity: pageTransition ? 0 : 1,
          transition: "opacity 0.3s ease-in-out",
          overflow: "auto"
        }}
        className={`content-container ${pageTransition ? 'fade-out' : 'fade-in'}`}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard; 