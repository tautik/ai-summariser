import { FaTwitter, FaReddit, FaEnvelope, FaFacebook, FaChartLine, FaLightbulb, FaUsers, FaHashtag } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { getAIInsights } from '@/services/insightsService';

interface HomePageProps {
  connectedServices: Record<string, boolean>;
  onConnect: (service: string) => void;
}

interface AIInsights {
  contentSummary: string;
  topTrends: Array<{
    name: string;
    count: number;
    source: string;
  }>;
  keyPeople: Array<{
    name: string;
    description: string;
    source: string;
  }>;
}

const HomePage = ({ connectedServices, onConnect }: HomePageProps) => {
  const [aiInsights, setAIInsights] = useState<AIInsights | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const insights = await getAIInsights(connectedServices);
        setAIInsights(insights);
        setError(null);
      } catch (err) {
        console.error('Error fetching AI insights:', err);
        setError('Failed to load AI insights. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [connectedServices]);

  const services = [
    { 
      id: 'twitter', 
      name: 'Twitter', 
      icon: FaTwitter, 
      color: 'text-blue-400',
      description: 'Connect to Twitter to analyze profiles and tweets',
      stats: {
        analyzed: 150,
        summaries: 45,
        trending: 12
      }
    },
    { 
      id: 'reddit', 
      name: 'Reddit', 
      icon: FaReddit, 
      color: 'text-orange-500',
      description: 'Connect to Reddit to analyze posts and comments',
      stats: {
        analyzed: 80,
        summaries: 25,
        trending: 8
      }
    },
    { 
      id: 'gmail', 
      name: 'Gmail', 
      icon: FaEnvelope, 
      color: 'text-red-500',
      description: 'Connect to Gmail to analyze your email communications',
      stats: {
        analyzed: 200,
        summaries: 60,
        trending: 15
      }
    },
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: FaFacebook, 
      color: 'text-blue-600',
      description: 'Connect to Facebook to analyze profiles and posts',
      stats: {
        analyzed: 100,
        summaries: 30,
        trending: 10
      }
    }
  ];

  const recentActivity = [
    { service: 'twitter', action: 'Profile analyzed', user: '@elonmusk', time: '2 minutes ago' },
    { service: 'reddit', action: 'Subreddit summarized', user: 'r/technology', time: '5 minutes ago' },
    { service: 'twitter', action: 'Tweet trends analyzed', user: '@BillGates', time: '10 minutes ago' },
    { service: 'gmail', action: 'Email digest created', user: 'Weekly Summary', time: '15 minutes ago' },
    { service: 'facebook', action: 'Page analyzed', user: 'Tech News', time: '20 minutes ago' },
  ];

  // Check if any services are connected
  const hasConnectedServices = Object.values(connectedServices).some(connected => connected);

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h1>
          <p className="text-gray-500">
            Welcome to your AI-powered content summarization platform
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'services' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('services')}
          >
            Services
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'activity' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('activity')}
          >
            Recent Activity
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">AI Summary</h2>
                  <p className="text-gray-500 text-sm">
                    Comprehensive analysis across all your connected platforms
                  </p>
                </div>
                <div>
                  {loading ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                  ) : error ? (
                    <div className="text-red-500 text-center p-4">
                      {error}
                    </div>
                  ) : aiInsights ? (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                          <FaLightbulb className="text-yellow-500" />
                          Content Analysis
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {aiInsights.contentSummary}
                        </p>
                      </div>
                      
                      <hr className="border-gray-200 my-6" />
                      
                      <div>
                        <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                          <FaChartLine className="text-blue-500" />
                          Top Trends
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {aiInsights.topTrends
                            .filter(trend => connectedServices[trend.source])
                            .map((trend, i) => (
                              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <FaHashtag className="text-gray-400" />
                                  <span className="font-medium">{trend.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500">{trend.count} mentions</span>
                                  {trend.source === 'twitter' && <FaTwitter className="h-4 w-4 text-blue-400" />}
                                  {trend.source === 'reddit' && <FaReddit className="h-4 w-4 text-orange-500" />}
                                  {trend.source === 'gmail' && <FaEnvelope className="h-4 w-4 text-red-500" />}
                                  {trend.source === 'facebook' && <FaFacebook className="h-4 w-4 text-blue-600" />}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                      
                      <hr className="border-gray-200 my-6" />
                      
                      <div>
                        <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                          <FaUsers className="text-green-500" />
                          Key People in Your Network
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {aiInsights.keyPeople
                            .filter(person => connectedServices[person.source])
                            .map((person, i) => (
                              <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  {person.source === 'twitter' && <FaTwitter className="h-5 w-5 text-blue-400" />}
                                  {person.source === 'reddit' && <FaReddit className="h-5 w-5 text-orange-500" />}
                                  {person.source === 'gmail' && <FaEnvelope className="h-5 w-5 text-red-500" />}
                                  {person.source === 'facebook' && <FaFacebook className="h-5 w-5 text-blue-600" />}
                                </div>
                                <div>
                                  <div className="font-medium">{person.name}</div>
                                  <div className="text-sm text-gray-500">{person.description}</div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <p>No insights available. Connect services to get AI-powered analysis.</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {services.map((service) => (
                  <div key={service.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium">
                        {service.name}
                      </h3>
                      <service.icon className={`h-4 w-4 ${service.color}`} />
                    </div>
                    <div className="text-2xl font-bold">{service.stats.analyzed}</div>
                    <p className="text-xs text-gray-500">
                      {service.stats.summaries} summaries generated
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'services' && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              {services.map((service) => (
                <div key={service.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <service.icon className={`h-5 w-5 ${service.color}`} />
                      <h3 className="font-medium">{service.name}</h3>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${connectedServices[service.id] ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {connectedServices[service.id] ? 'Connected' : 'Not Connected'}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <div>{service.stats.analyzed} items analyzed</div>
                    <div>{service.stats.trending} trending topics</div>
                  </div>
                  {!connectedServices[service.id] && (
                    <button
                      onClick={() => onConnect(service.id)}
                      className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Connect {service.name}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'activity' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium">Recent Activity</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="p-4 flex items-center">
                    <div className="mr-4">
                      {activity.service === 'twitter' && <FaTwitter className="h-5 w-5 text-blue-400" />}
                      {activity.service === 'reddit' && <FaReddit className="h-5 w-5 text-orange-500" />}
                      {activity.service === 'gmail' && <FaEnvelope className="h-5 w-5 text-red-500" />}
                      {activity.service === 'facebook' && <FaFacebook className="h-5 w-5 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.user}</p>
                    </div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage; 