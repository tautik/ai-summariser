import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import HomePage from './pages/HomePage';
import TwitterPage from './pages/TwitterPage';
import RedditPage from './pages/RedditPage';
import GmailPage from './pages/GmailPage';
import FacebookPage from './pages/FacebookPage';
import SettingsPage from './pages/SettingsPage';
import SyncToEmailButton from './SyncToEmailButton';
import EmailModal from './EmailModal';
import { getServiceInsights } from '@/services/insightsService';

// Define CSS animations
const fadeIn = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const spin = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

interface DashboardProps {
  onLogout: () => void;
}

// Define the interface for summary data
interface SummaryData {
  summary: string;
  details: {
    service: string;
    timestamp: string;
    metrics: Record<string, any>;
  };
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  // State for connected services
  const [connectedServices, setConnectedServices] = useState({
    twitter: true,
    reddit: true,
    gmail: true,
    facebook: true
  });
  
  // State for active page
  const [activePage, setActivePage] = useState('home');
  const [pageTransition, setPageTransition] = useState(false);
  const [summaryData, setSummaryData] = useState<SummaryData>({
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
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Inject CSS animations
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = fadeIn + spin;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // Load connected services from localStorage
  useEffect(() => {
    const savedServices = localStorage.getItem('connectedServices');
    if (savedServices) {
      setConnectedServices(JSON.parse(savedServices));
    }
  }, []);
  
  // Save connected services to localStorage
  useEffect(() => {
    localStorage.setItem('connectedServices', JSON.stringify(connectedServices));
  }, [connectedServices]);
  
  // Handle page change with transition
  const handlePageChange = (page: string) => {
    setPageTransition(true);
    setTimeout(() => {
      setActivePage(page);
      setPageTransition(false);
    }, 300);
  };
  
  // Connect a service
  const handleConnectService = (service: string) => {
    setConnectedServices(prev => ({
      ...prev,
      [service]: true
    }));
    
    // Update summary data when a service is connected
    updateSummaryData(service, true);
  };
  
  // Disconnect a service
  const handleDisconnectService = (service: string) => {
    setConnectedServices(prev => ({
      ...prev,
      [service]: false
    }));
    
    // Update summary data when a service is disconnected
    updateSummaryData(service, false);
  };
  
  // Handle opening the email modal
  const handleOpenEmailModal = () => {
    setIsEmailModalOpen(true);
  };
  
  // Handle closing the email modal
  const handleCloseEmailModal = () => {
    setIsEmailModalOpen(false);
  };
  
  // Update summary data based on active service
  const updateSummaryData = async (service: string, isConnected: boolean) => {
    if (isConnected) {
      try {
        // Fetch service insights from the backend API
        const insights = await getServiceInsights(service);
        setSummaryData(insights);
      } catch (error) {
        console.error(`Error fetching ${service} insights:`, error);
        
        // Fallback to default data if API call fails
        const fallbackData: SummaryData = {
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
        
        setSummaryData(fallbackData);
      }
    } else {
      // Set default summary data when service is disconnected
      setSummaryData({
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
    }
  };
  
  // Render content based on active page
  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return <HomePage connectedServices={connectedServices} onConnect={handleConnectService} />;
      case 'twitter':
        return <TwitterPage 
          isConnected={connectedServices.twitter} 
          onConnect={() => handleConnectService('twitter')} 
          onDisconnect={() => handleDisconnectService('twitter')} 
        />;
      case 'reddit':
        return <RedditPage 
          isConnected={connectedServices.reddit} 
          onConnect={() => handleConnectService('reddit')} 
          onDisconnect={() => handleDisconnectService('reddit')} 
        />;
      case 'gmail':
        return <GmailPage 
          isConnected={connectedServices.gmail} 
          onConnect={() => handleConnectService('gmail')} 
          onDisconnect={() => handleDisconnectService('gmail')} 
        />;
      case 'facebook':
        return <FacebookPage 
          isConnected={connectedServices.facebook} 
          onConnect={() => handleConnectService('facebook')} 
          onDisconnect={() => handleDisconnectService('facebook')} 
        />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage connectedServices={connectedServices} onConnect={handleConnectService} />;
    }
  };
  
  // Get the current service name based on active page
  const getCurrentServiceName = () => {
    switch (activePage) {
      case 'twitter': return 'Twitter';
      case 'reddit': return 'Reddit';
      case 'gmail': return 'Gmail';
      case 'facebook': return 'Facebook';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        activePage={activePage} 
        onNavigate={handlePageChange}
        onLogout={onLogout}
      />
      
      <div className="flex-1 overflow-auto">
        {/* Show SyncToEmailButton only on the home/overview page */}
        {activePage === 'home' && (
          <SyncToEmailButton 
            serviceName={getCurrentServiceName()} 
            summaryData={summaryData}
          />
        )}
        
        <div 
          className="min-h-screen"
          style={{ 
            opacity: pageTransition ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out'
          }}
        >
          {renderContent()}
        </div>

        {/* Email Modal */}
        <EmailModal 
          isOpen={isEmailModalOpen} 
          onClose={handleCloseEmailModal} 
          summaryData={summaryData}
          serviceName={getCurrentServiceName()}
        />
      </div>
    </div>
  );
};

export default Dashboard; 