import { useState, useEffect } from 'react';
import { FaEnvelope, FaLink, FaUnlink } from 'react-icons/fa';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

interface GmailPageProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

interface Email {
  id: string;
  subject: string;
  sender: string;
  date: string;
  snippet: string;
  isRead: boolean;
  hasAttachment: boolean;
  labels: string[];
}

interface EmailSummary {
  emailCount: number;
  unreadCount: number;
  importantCount: number;
  topSenders: { name: string; count: number }[];
  categorySummary: { category: string; count: number }[];
  recentEmails: Email[];
  summary: string;
  actionItems: string[];
  followUps: string[];
}

type SummaryType = 'inbox' | 'important' | 'unread';

// Sample email data
const SAMPLE_EMAILS: Email[] = [
  {
    id: '1',
    subject: 'Regarding your application to Headout | Software Engineer, Backend',
    sender: 'Ekta Chaturvedi <ekta@headout.com>',
    date: '2025-02-28T20:17:00Z',
    snippet: 'Hi Tautik, Thank you for informing us about your unavailability for the assignment. Since you won\'t be able to complete it this weekend, we will include you in the next batch.',
    isRead: false,
    hasAttachment: false,
    labels: ['recruitment', 'important']
  },
  {
    id: '2',
    subject: 'Alert : Update on your HDFC Bank Credit Card',
    sender: 'HDFC Bank InstaAlerts <alerts@hdfcbank.net>',
    date: '2025-02-28T20:49:00Z',
    snippet: 'Dear Customer, Thank you for using HDFC Bank Card XX9764 for Rs. 119.0 at SPOTIFYINDIA on 28-02-2025 20:49:14',
    isRead: true,
    hasAttachment: false,
    labels: ['finance', 'alerts']
  },
  {
    id: '3',
    subject: 'Delve - Tautik - Teemgenie',
    sender: 'Isaiah de la Fuente <isaiah@delve.com>',
    date: '2025-02-27T00:15:00Z',
    snippet: 'Hey all! We recently have given Tautik an opportunity to join Delve. Please find time to sync so we work out payment and HR details.',
    isRead: false,
    hasAttachment: false,
    labels: ['recruitment', 'important']
  },
  {
    id: '4',
    subject: 'Your Amazon Order #402-7892345-2938456 has shipped',
    sender: 'Amazon.in <shipment-tracking@amazon.in>',
    date: '2025-02-26T14:30:00Z',
    snippet: 'Your package with Logitech MX Master 3S Mouse is on the way and will be delivered tomorrow by 9 PM.',
    isRead: true,
    hasAttachment: true,
    labels: ['shopping', 'orders']
  },
  {
    id: '5',
    subject: 'Invitation to speak at React India 2025',
    sender: 'React India <organizers@reactindia.dev>',
    date: '2025-02-25T09:45:00Z',
    snippet: 'Dear Tautik, We would like to invite you to speak at React India 2025 conference in Goa. Please let us know if you are interested.',
    isRead: false,
    hasAttachment: true,
    labels: ['events', 'important']
  },
  {
    id: '6',
    subject: 'Your Netflix subscription will renew soon',
    sender: 'Netflix <info@netflix.com>',
    date: '2025-02-24T11:20:00Z',
    snippet: 'Your monthly subscription will be renewed on March 3rd. Your Premium plan costs Rs. 649 per month.',
    isRead: true,
    hasAttachment: false,
    labels: ['subscriptions', 'entertainment']
  },
  {
    id: '7',
    subject: 'Feedback on your recent pull request',
    sender: 'GitHub <notifications@github.com>',
    date: '2025-02-23T16:05:00Z',
    snippet: 'Your pull request #342 on repository ai-summariser has received comments from the code owner.',
    isRead: false,
    hasAttachment: false,
    labels: ['development', 'github']
  },
  {
    id: '8',
    subject: 'Your flight to Bangalore is confirmed',
    sender: 'MakeMyTrip <bookings@makemytrip.com>',
    date: '2025-02-22T13:15:00Z',
    snippet: 'Your flight AI-505 from Delhi to Bangalore on March 15th is confirmed. Check-in opens 24 hours before departure.',
    isRead: true,
    hasAttachment: true,
    labels: ['travel', 'important']
  }
];

// Sample email categories
const RECRUITMENT_EMAILS = SAMPLE_EMAILS.filter(email => email.labels.includes('recruitment'));
const FINANCE_EMAILS = SAMPLE_EMAILS.filter(email => email.labels.includes('finance'));
const SOCIAL_EMAILS = SAMPLE_EMAILS.filter(email => email.labels.includes('events') || email.labels.includes('entertainment'));

// Create more detailed category-specific email summaries
const RECRUITMENT_SUMMARY: EmailSummary = {
  emailCount: 30,
  unreadCount: 8,
  importantCount: 15,
  topSenders: [
    { name: 'ekta@headout.com', count: 5 },
    { name: 'isaiah@delve.com', count: 3 },
    { name: 'careers@google.com', count: 2 },
    { name: 'talent@microsoft.com', count: 2 },
    { name: 'jobs@amazon.com', count: 1 }
  ],
  categorySummary: [
    { category: 'Recruitment', count: 30 },
    { category: 'Job Applications', count: 12 },
    { category: 'Interviews', count: 8 },
    { category: 'Offers', count: 5 },
    { category: 'Rejections', count: 5 }
  ],
  recentEmails: RECRUITMENT_EMAILS,
  summary: 'You have received 2 new job opportunities this week from Headout and Delve. The Headout application requires follow-up for the next interview batch. The Delve opportunity involves scheduling a meeting to discuss payment and HR details. You have 3 pending interview invitations that require responses within the next 48 hours.',
  actionItems: [
    'Schedule meeting with Delve team about job opportunity',
    'Prepare for Headout interview in the next batch',
    'Update your resume with recent projects',
    'Complete coding assessment for Google by March 3rd',
    'Respond to Microsoft interview invitation by tomorrow'
  ],
  followUps: [
    'Check with Ekta about the exact dates for the next interview batch',
    'Research more about Delve company before the meeting',
    'Ask for feedback on rejected applications',
    'Update LinkedIn profile with new skills'
  ]
};

const FINANCE_SUMMARY: EmailSummary = {
  emailCount: 25,
  unreadCount: 3,
  importantCount: 10,
  topSenders: [
    { name: 'alerts@hdfcbank.net', count: 8 },
    { name: 'statements@icicibank.com', count: 5 },
    { name: 'billing@amazon.in', count: 4 },
    { name: 'payments@phonepe.com', count: 3 },
    { name: 'tax@incometax.gov.in', count: 2 }
  ],
  categorySummary: [
    { category: 'Finance', count: 25 },
    { category: 'Bank Alerts', count: 12 },
    { category: 'Bills', count: 8 },
    { category: 'Investments', count: 3 },
    { category: 'Tax', count: 2 }
  ],
  recentEmails: FINANCE_EMAILS,
  summary: 'Your financial emails show recent transactions from Spotify (Rs. 119) on your HDFC credit card. You have upcoming subscription renewals for Netflix (Rs. 649) on March 3rd. Your credit card statement is due on March 10th with a total outstanding amount of Rs. 15,432. There are no unusual transactions detected in your accounts. Your mutual fund SIP of Rs. 10,000 was successfully processed on February 25th.',
  actionItems: [
    'Review credit card statement for February',
    'Pay HDFC credit card bill by March 10th',
    'Check if Netflix subscription price has increased',
    'File quarterly tax statement by March 15th',
    'Review investment portfolio performance'
  ],
  followUps: [
    'Update payment method for Netflix if needed',
    'Consider switching to annual subscription plans to save money',
    'Check for any unauthorized transactions',
    'Update KYC details for mutual fund investments'
  ]
};

const SOCIAL_SUMMARY: EmailSummary = {
  emailCount: 9,
  unreadCount: 2,
  importantCount: 5,
  topSenders: [
    { name: 'organizers@reactindia.dev', count: 2 },
    { name: 'info@netflix.com', count: 2 },
    { name: 'events@meetup.com', count: 2 },
    { name: 'friends@facebook.com', count: 2 },
    { name: 'community@github.com', count: 1 }
  ],
  categorySummary: [
    { category: 'Social', count: 9 },
    { category: 'Events', count: 5 },
    { category: 'Entertainment', count: 3 },
    { category: 'Community', count: 1 }
  ],
  recentEmails: SOCIAL_EMAILS,
  summary: 'Your social and events emails include an invitation to speak at React India 2025 in Goa. You also have entertainment-related emails about your Netflix subscription. There\'s a local tech meetup happening next week that matches your interests. You\'ve been invited to a friend\'s birthday celebration on March 5th. The React India speaking opportunity is particularly prestigious and could boost your professional profile.',
  actionItems: [
    'Respond to React India speaking invitation by March 5th',
    'Prepare a talk proposal for the conference',
    'RSVP to the local tech meetup',
    'Confirm attendance for birthday celebration',
    'Update Netflix watchlist with new releases'
  ],
  followUps: [
    'Check conference dates to ensure no scheduling conflicts',
    'Look into accommodation options in Goa for the event',
    'Connect with other speakers at React India',
    'Share tech meetup details with colleagues'
  ]
};

// Sample email summary for all emails
const SAMPLE_SUMMARY: EmailSummary = {
  emailCount: 124,
  unreadCount: 18,
  importantCount: 32,
  topSenders: [
    { name: 'notifications@github.com', count: 23 },
    { name: 'alerts@hdfcbank.net', count: 15 },
    { name: 'newsletter@medium.com', count: 12 },
    { name: 'info@linkedin.com', count: 10 },
    { name: 'no-reply@amazon.in', count: 8 }
  ],
  categorySummary: [
    { category: 'Development', count: 45 },
    { category: 'Recruitment', count: 30 },
    { category: 'Finance', count: 25 },
    { category: 'Shopping', count: 15 },
    { category: 'Social', count: 9 }
  ],
  recentEmails: SAMPLE_EMAILS,
  summary: 'Your inbox has been active with recruitment opportunities this week, with 2 new job offers. You have several financial alerts from HDFC Bank. There are 4 emails requiring immediate attention, including a speaking invitation and job opportunities. Your Amazon order is scheduled for delivery tomorrow. You have 18 unread emails, with 8 of them marked as important.',
  actionItems: [
    'Respond to React India speaking invitation by March 5th',
    'Schedule meeting with Delve team about job opportunity',
    'Review GitHub pull request feedback',
    'Prepare for Headout interview in the next batch',
    'Pay HDFC credit card bill by March 10th'
  ],
  followUps: [
    'Track Amazon package delivery status',
    'Check Netflix subscription renewal on March 3rd',
    'Confirm flight details for Bangalore trip on March 15th',
    'Update resume with recent projects'
  ]
};

const GmailPage = ({ isConnected, onConnect, onDisconnect }: GmailPageProps) => {
  const [emailAddress, setEmailAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<EmailSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [summaryType, setSummaryType] = useState<SummaryType>('inbox');
  const [category, setCategory] = useState<string>('all');

  // Auto-load sample data when connected
  useEffect(() => {
    if (isConnected) {
      loadSummaryData('all');
    } else {
      setSummary(null);
    }
  }, [isConnected]);

  // Load different summary data based on category
  const loadSummaryData = (selectedCategory: string) => {
    setCategory(selectedCategory);
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      switch (selectedCategory) {
        case 'recruitment':
          setSummary(RECRUITMENT_SUMMARY);
          break;
        case 'finance':
          setSummary(FINANCE_SUMMARY);
          break;
        case 'social':
          setSummary(SOCIAL_SUMMARY);
          break;
        default:
          setSummary(SAMPLE_SUMMARY);
          break;
      }
      setLoading(false);
    }, 500);
  };

  const handleSubmit = async () => {
    if (!emailAddress.trim()) {
      setError('Please enter an email address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      setTimeout(() => {
        setSummary(SAMPLE_SUMMARY);
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError('Failed to analyze email');
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FaEnvelope className="text-[#D44638]" />
            Gmail Analysis
          </h1>
          <p className="text-muted-foreground mt-1">
            Analyze your email communications
          </p>
        </div>
        <Button
          variant={isConnected ? "destructive" : "default"}
          onClick={isConnected ? onDisconnect : onConnect}
        >
          {isConnected ? (
            <>
              <FaUnlink className="mr-2" />
              Disconnect
            </>
          ) : (
            <>
              <FaLink className="mr-2" />
              Connect to Gmail
            </>
          )}
        </Button>
      </div>

      {!isConnected ? (
        <Card>
          <CardHeader>
            <CardTitle>Not connected!</CardTitle>
            <CardDescription>
              Connect to Gmail to analyze your email communications.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyze Gmail Account</CardTitle>
              <CardDescription>
                Select a category to analyze or enter a specific email address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Select email category:</p>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={category === 'all' ? "default" : "outline"} 
                      size="sm"
                      onClick={() => loadSummaryData('all')}
                    >
                      All Emails
                    </Button>
                    <Button 
                      variant={category === 'recruitment' ? "default" : "outline"} 
                      size="sm"
                      onClick={() => loadSummaryData('recruitment')}
                    >
                      Recruitment
                    </Button>
                    <Button 
                      variant={category === 'finance' ? "default" : "outline"} 
                      size="sm"
                      onClick={() => loadSummaryData('finance')}
                    >
                      Finance
                    </Button>
                    <Button 
                      variant={category === 'social' ? "default" : "outline"} 
                      size="sm"
                      onClick={() => loadSummaryData('social')}
                    >
                      Social & Events
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Input
                    placeholder="e.g. your.email@gmail.com"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    disabled={loading}
                  />
                  <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Analyzing...' : 'Analyze'}
                  </Button>
                </div>
                
                {emailAddress && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Select what you want to analyze:</p>
                    <div className="flex gap-2">
                      <Button 
                        variant={summaryType === 'inbox' ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setSummaryType('inbox')}
                      >
                        All Inbox
                      </Button>
                      <Button 
                        variant={summaryType === 'important' ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setSummaryType('important')}
                      >
                        Important
                      </Button>
                      <Button 
                        variant={summaryType === 'unread' ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setSummaryType('unread')}
                      >
                        Unread
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {error && (
            <Card className="bg-destructive/15">
              <CardHeader>
                <CardTitle className="text-destructive">Error</CardTitle>
                <CardDescription>{error}</CardDescription>
              </CardHeader>
            </Card>
          )}

          {summary && (
            <Card>
              <CardHeader>
                <CardTitle>Email Analysis Results</CardTitle>
                <CardDescription>
                  {summaryType === 'inbox' && 'Summary of all emails in your inbox'}
                  {summaryType === 'important' && 'Analysis of important emails'}
                  {summaryType === 'unread' && 'Summary of unread emails'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="emails">Emails</TabsTrigger>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                    <TabsTrigger value="summary">AI Summary</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview">
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Emails</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{summary.emailCount}</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Unread</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{summary.unreadCount}</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Important</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{summary.importantCount}</div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Top Senders</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {summary.topSenders.map((sender, index) => (
                              <li key={index} className="flex justify-between items-center">
                                <span>{sender.name}</span>
                                <span className="text-muted-foreground">{sender.count} emails</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="emails">
                    <div className="space-y-4">
                      <ScrollArea className="h-[400px]">
                        {summary.recentEmails.map((email) => (
                          <Card key={email.id} className="mb-4">
                            <CardContent className="pt-6">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className={`font-medium ${!email.isRead ? 'font-bold' : ''}`}>{email.subject}</h3>
                                  <p className="text-sm text-muted-foreground">{email.sender}</p>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {formatDate(email.date)}
                                </div>
                              </div>
                              <p className="mt-2">{email.snippet}</p>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {email.labels.map((label, index) => (
                                  <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                                    {label}
                                  </span>
                                ))}
                                {email.hasAttachment && (
                                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">
                                    attachment
                                  </span>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </ScrollArea>
                    </div>
                  </TabsContent>

                  <TabsContent value="categories">
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Email Categories</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {summary.categorySummary.map((category, index) => (
                              <div key={index}>
                                <div className="flex justify-between items-center mb-1">
                                  <span>{category.category}</span>
                                  <span className="text-muted-foreground">{category.count} emails</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                  <div 
                                    className="bg-blue-600 h-2.5 rounded-full" 
                                    style={{ width: `${(category.count / summary.emailCount) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="summary">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-medium mb-2">Email Summary</h3>
                            <p>{summary.summary}</p>
                          </div>
                          <Separator />
                          <div>
                            <h3 className="text-lg font-medium mb-2">Action Items</h3>
                            <ul className="list-disc pl-5 space-y-1">
                              {summary.actionItems.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>
                          <Separator />
                          <div>
                            <h3 className="text-lg font-medium mb-2">Follow-ups</h3>
                            <ul className="list-disc pl-5 space-y-1">
                              {summary.followUps.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default GmailPage; 