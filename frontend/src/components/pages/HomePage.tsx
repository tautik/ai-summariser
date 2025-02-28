import { FaTwitter, FaReddit, FaEnvelope, FaFacebook } from 'react-icons/fa';
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
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
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800`}>
                        <service.icon className={`h-6 w-6 ${service.color}`} />
                      </div>
                      <div>
                        <CardTitle>{service.name}</CardTitle>
                        <CardDescription>{service.description}</CardDescription>
                      </div>
                    </div>
                    <Button
                      variant={connectedServices[service.id] ? "secondary" : "default"}
                      onClick={() => onConnect(service.id)}
                      disabled={connectedServices[service.id]}
                    >
                      {connectedServices[service.id] ? "Connected" : "Connect"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-muted-foreground">Content Analyzed</p>
                      <p className="text-xl font-bold">{service.stats.analyzed}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Summaries</p>
                      <p className="text-xl font-bold">{service.stats.summaries}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Trending</p>
                      <p className="text-xl font-bold">{service.stats.trending}</p>
                    </div>
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
                Your latest content analysis and summaries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {recentActivity.map((activity, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800`}>
                            {activity.service === 'twitter' && <FaTwitter className="text-blue-400" />}
                            {activity.service === 'reddit' && <FaReddit className="text-orange-500" />}
                            {activity.service === 'gmail' && <FaEnvelope className="text-red-500" />}
                            {activity.service === 'facebook' && <FaFacebook className="text-blue-600" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{activity.action}</p>
                            <p className="text-sm text-muted-foreground">{activity.user}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                      {i < recentActivity.length - 1 && <Separator className="my-4" />}
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