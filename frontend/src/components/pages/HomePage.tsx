import { FaTwitter, FaReddit, FaEnvelope, FaFacebook, FaChartLine, FaLightbulb, FaUsers, FaHashtag } from 'react-icons/fa';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HomePageProps {
  connectedServices: Record<string, boolean>;
  onConnect: (service: string) => void;
}

const HomePage = ({ connectedServices, onConnect }: HomePageProps) => {
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

  // AI insights data
  const aiInsights = {
    contentSummary: "Your digital presence shows strong engagement with technology and AI topics across platforms. On Twitter, you're following key AI innovators and engaging with content about developer tools and startup funding. Your Reddit activity focuses on technology and science communities, with particular interest in AI research and open source projects. Gmail communications indicate active job recruitment in the tech sector, particularly for AI and software engineering roles.",
    topTrends: [
      { name: 'AI and Machine Learning', count: 245, source: 'twitter' },
      { name: 'Startup Funding', count: 187, source: 'reddit' },
      { name: 'Developer Tools', count: 156, source: 'twitter' },
      { name: 'Remote Work', count: 132, source: 'gmail' },
      { name: 'Open Source Projects', count: 98, source: 'reddit' }
    ],
    keyPeople: [
      { name: '@therealprady', description: 'Founder @ AI lip sync startup', source: 'twitter' },
      { name: '@eshamanideep', description: 'Working on AGI @ gigaml', source: 'twitter' },
      { name: 'ekta@headout.com', description: 'Recruiter at Headout', source: 'gmail' },
      { name: 'u/science_enthusiast', description: 'Active in r/science community', source: 'reddit' }
    ]
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to your AI-powered content summarization platform
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Summary</CardTitle>
              <CardDescription>
                Comprehensive analysis across all your connected platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                    <FaLightbulb className="text-yellow-500" />
                    Content Analysis
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {aiInsights.contentSummary}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                    <FaChartLine className="text-blue-500" />
                    Top Trends
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiInsights.topTrends
                      .filter(trend => connectedServices[trend.source])
                      .map((trend, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FaHashtag className="text-gray-400" />
                            <span>{trend.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{trend.count} mentions</span>
                            {trend.source === 'twitter' && <FaTwitter className="h-3 w-3 text-blue-400" />}
                            {trend.source === 'reddit' && <FaReddit className="h-3 w-3 text-orange-500" />}
                            {trend.source === 'gmail' && <FaEnvelope className="h-3 w-3 text-red-500" />}
                            {trend.source === 'facebook' && <FaFacebook className="h-3 w-3 text-blue-600" />}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                    <FaUsers className="text-green-500" />
                    Key People in Your Network
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiInsights.keyPeople
                      .filter(person => connectedServices[person.source])
                      .map((person, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{person.name}</p>
                            <p className="text-sm text-muted-foreground">{person.description}</p>
                          </div>
                          <div>
                            {person.source === 'twitter' && <FaTwitter className="h-4 w-4 text-blue-400" />}
                            {person.source === 'reddit' && <FaReddit className="h-4 w-4 text-orange-500" />}
                            {person.source === 'gmail' && <FaEnvelope className="h-4 w-4 text-red-500" />}
                            {person.source === 'facebook' && <FaFacebook className="h-4 w-4 text-blue-600" />}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Card key={service.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {service.name}
                  </CardTitle>
                  <service.icon className={`h-4 w-4 ${service.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{service.stats.analyzed}</div>
                  <p className="text-xs text-muted-foreground">
                    {service.stats.summaries} summaries generated
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {services.map((service) => (
              <Card key={service.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {service.name}
                  </CardTitle>
                  <service.icon className={`h-4 w-4 ${service.color}`} />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {service.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium">{service.stats.analyzed} items analyzed</div>
                      <div className="text-xs text-muted-foreground">{service.stats.summaries} summaries</div>
                    </div>
                    <Button 
                      onClick={() => onConnect(service.id)}
                      disabled={connectedServices[service.id]}
                      className="flex items-center gap-2"
                    >
                      {connectedServices[service.id] ? 'Connected' : 'Connect'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest interactions across connected platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {recentActivity.map((activity, i) => (
                    <div key={i} className="flex items-start gap-4 pb-4 border-b last:border-0">
                      <div className="mt-1">
                        {activity.service === 'twitter' && <FaTwitter className="h-4 w-4 text-blue-400" />}
                        {activity.service === 'reddit' && <FaReddit className="h-4 w-4 text-orange-500" />}
                        {activity.service === 'gmail' && <FaEnvelope className="h-4 w-4 text-red-500" />}
                        {activity.service === 'facebook' && <FaFacebook className="h-4 w-4 text-blue-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-sm text-muted-foreground">{activity.user}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomePage; 