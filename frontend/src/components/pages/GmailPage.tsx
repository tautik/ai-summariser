import { useState, useEffect } from 'react';
import { FaEnvelope, FaLink, FaUnlink } from 'react-icons/fa';

interface GmailPageProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

interface Email {
  id: string;
  subject: string;
  sender: string;
  from: string;
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
  summary: string;
  timePeriod: string;
  topSenders: Array<{
    name: string;
    email: string;
    count: number;
  }>;
  recentEmails: Array<{
    id: string;
    subject: string;
    from: string;
    date: string;
    snippet: string;
    labels: string[];
    hasAttachment: boolean;
  }>;
  categorySummary: Array<{
    category: string;
    count: number;
  }>;
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
    from: 'Ekta Chaturvedi',
    date: '2025-04-04T20:17:00Z',
    snippet: 'Hi Tautik, Thank you for informing us about your unavailability for the assignment. Since you won\'t be able to complete it this weekend, we will include you in the next batch.',
    isRead: false,
    hasAttachment: false,
    labels: ['recruitment', 'important']
  },
  {
    id: '2',
    subject: 'Alert : Update on your HDFC Bank Credit Card',
    sender: 'HDFC Bank InstaAlerts <alerts@hdfcbank.net>',
    from: 'HDFC Bank',
    date: '2025-04-04T20:49:00Z',
    snippet: 'Dear Customer, Thank you for using HDFC Bank Card XX9764 for Rs. 119.0 at SPOTIFYINDIA on 04-04-2025 20:49:14',
    isRead: true,
    hasAttachment: false,
    labels: ['finance', 'alerts']
  },
  {
    id: '3',
    subject: 'Delve - Tautik - Teemgenie',
    sender: 'Isaiah de la Fuente <isaiah@delve.com>',
    from: 'Isaiah de la Fuente',
    date: '2025-04-03T00:15:00Z',
    snippet: 'Hey all! We recently have given Tautik an opportunity to join Delve. Please find time to sync so we work out payment and HR details.',
    isRead: false,
    hasAttachment: false,
    labels: ['recruitment', 'important']
  },
  {
    id: '4',
    subject: 'Your Amazon Order #402-7892345-2938456 has shipped',
    sender: 'Amazon.in <shipment-tracking@amazon.in>',
    from: 'Amazon',
    date: '2025-04-02T14:30:00Z',
    snippet: 'Your package with Logitech MX Master 3S Mouse is on the way and will be delivered tomorrow by 9 PM.',
    isRead: true,
    hasAttachment: false,
    labels: ['shopping', 'updates']
  },
  {
    id: '5',
    subject: 'Invitation to speak at React India 2025',
    sender: 'React India <organizers@reactindia.dev>',
    from: 'React India',
    date: '2025-04-01T09:45:00Z',
    snippet: 'Dear Tautik, We would like to invite you to speak at React India 2025 conference in Goa. Please let us know if you are interested.',
    isRead: false,
    hasAttachment: true,
    labels: ['events', 'important']
  },
  {
    id: '6',
    subject: 'Your Netflix subscription will renew soon',
    sender: 'Netflix <info@netflix.com>',
    from: 'Netflix',
    date: '2025-04-04T11:20:00Z',
    snippet: 'Your monthly subscription will be renewed on May 10th. Your Premium plan costs Rs. 649 per month.',
    isRead: true,
    hasAttachment: false,
    labels: ['entertainment', 'finance']
  },
  {
    id: '7',
    subject: 'Feedback on your recent pull request',
    sender: 'GitHub <notifications@github.com>',
    from: 'GitHub',
    date: '2025-04-02T16:05:00Z',
    snippet: 'Your pull request #342 on repository ai-summariser has received comments from the code owner.',
    isRead: false,
    hasAttachment: false,
    labels: ['development', 'updates']
  },
  {
    id: '8',
    subject: 'Your flight to Bangalore is confirmed',
    sender: 'MakeMyTrip <bookings@makemytrip.com>',
    from: 'MakeMyTrip',
    date: '2025-04-01T13:15:00Z',
    snippet: 'Your flight AI-505 from Delhi to Bangalore on May 11th is confirmed. Check-in opens 24 hours before departure.',
    isRead: true,
    hasAttachment: true,
    labels: ['travel', 'important']
  }
];

// Sample email categories
const RECRUITMENT_EMAILS: Email[] = SAMPLE_EMAILS.filter(email => email.labels.includes('recruitment'));
const FINANCE_EMAILS: Email[] = SAMPLE_EMAILS.filter(email => email.labels.includes('finance'));
const SOCIAL_EMAILS: Email[] = SAMPLE_EMAILS.filter(email => email.labels.includes('events') || email.labels.includes('entertainment'));

// Create more detailed category-specific email summaries
const RECRUITMENT_SUMMARY: EmailSummary = {
  emailCount: 25,
  unreadCount: 8,
  importantCount: 15,
  timePeriod: 'Last 7 days',
  topSenders: [
    { name: 'Ekta Chaturvedi', email: 'ekta@headout.com', count: 5 },
    { name: 'Isaiah de la Fuente', email: 'isaiah@delve.com', count: 3 },
    { name: 'Google Careers', email: 'careers@google.com', count: 2 },
    { name: 'Microsoft Talent', email: 'talent@microsoft.com', count: 2 },
    { name: 'Amazon Jobs', email: 'jobs@amazon.com', count: 1 }
  ],
  categorySummary: [
    { category: 'Applications', count: 12 },
    { category: 'Interviews', count: 8 },
    { category: 'Rejections', count: 5 }
  ],
  recentEmails: RECRUITMENT_EMAILS,
  summary: 'You have received 2 new job opportunities this week from Headout and Delve. The Headout application requires follow-up for the next interview batch. The Delve opportunity involves scheduling a meeting to discuss payment and HR details. You have 3 pending interview invitations that require responses within the next 48 hours.',
  actionItems: [
    'Schedule meeting with Delve team about job opportunity',
    'Follow up with Headout about next interview batch',
    'Prepare resume for Google application'
  ],
  followUps: [
    'Check status of Microsoft application',
    'Ask for feedback on rejected applications',
    'Update LinkedIn profile with new skills'
  ]
};

const FINANCE_SUMMARY: EmailSummary = {
  emailCount: 32,
  unreadCount: 5,
  importantCount: 10,
  timePeriod: 'Last 7 days',
  topSenders: [
    { name: 'HDFC Bank', email: 'alerts@hdfcbank.net', count: 8 },
    { name: 'ICICI Bank', email: 'statements@icicibank.com', count: 5 },
    { name: 'Amazon Billing', email: 'billing@amazon.in', count: 4 },
    { name: 'PhonePe', email: 'payments@phonepe.com', count: 3 },
    { name: 'Income Tax Dept', email: 'tax@incometax.gov.in', count: 2 }
  ],
  categorySummary: [
    { category: 'Transactions', count: 15 },
    { category: 'Statements', count: 8 },
    { category: 'Subscriptions', count: 7 },
    { category: 'Tax', count: 2 }
  ],
  recentEmails: FINANCE_EMAILS,
  summary: 'Your financial emails show recent transactions from Spotify (Rs. 119) on your HDFC credit card. You have upcoming subscription renewals for Netflix (Rs. 649) on May 10th. Your credit card statement is due on May 11th with a total outstanding amount of Rs. 15,432. There are no unusual transactions detected in your accounts. Your mutual fund SIP of Rs. 10,000 was successfully processed on May 1st.',
  actionItems: [
    'Review credit card statement for May',
    'Pay credit card bill by May 11th',
    'Evaluate Netflix subscription renewal'
  ],
  followUps: [
    'Check for tax-saving investment options',
    'Review mutual fund performance',
    'Check for any unauthorized transactions',
    'Update KYC details for mutual fund investments'
  ]
};

const SOCIAL_SUMMARY: EmailSummary = {
  emailCount: 18,
  unreadCount: 3,
  importantCount: 5,
  timePeriod: 'Last 7 days',
  topSenders: [
    { name: 'React India', email: 'organizers@reactindia.dev', count: 2 },
    { name: 'Netflix', email: 'info@netflix.com', count: 2 },
    { name: 'Meetup', email: 'events@meetup.com', count: 2 },
    { name: 'Facebook', email: 'friends@facebook.com', count: 2 },
    { name: 'GitHub', email: 'community@github.com', count: 1 }
  ],
  categorySummary: [
    { category: 'Events', count: 8 },
    { category: 'Entertainment', count: 6 },
    { category: 'Social Media', count: 3 },
    { category: 'Community', count: 1 }
  ],
  recentEmails: SOCIAL_EMAILS,
  summary: 'Your social and events emails include an invitation to speak at React India 2025 in Goa. You also have entertainment-related emails about your Netflix subscription. There\'s a local tech meetup happening next week that matches your interests. You\'ve been invited to a friend\'s birthday celebration on May 10th. The React India speaking opportunity is particularly prestigious and could boost your professional profile.',
  actionItems: [
    'Respond to React India speaking invitation by May 10th',
    'RSVP to local tech meetup',
    'Confirm attendance for friend\'s birthday'
  ],
  followUps: [
    'Prepare talk proposal for React India',
    'Check Netflix content updates',
    'Connect with other speakers at React India',
    'Share tech meetup details with colleagues'
  ]
};

const DEFAULT_SUMMARY: EmailSummary = {
  emailCount: 125,
  unreadCount: 18,
  importantCount: 32,
  timePeriod: 'Last 7 days',
  topSenders: [
    { name: 'GitHub', email: 'notifications@github.com', count: 23 },
    { name: 'HDFC Bank', email: 'alerts@hdfcbank.net', count: 15 },
    { name: 'Medium', email: 'newsletter@medium.com', count: 12 },
    { name: 'LinkedIn', email: 'info@linkedin.com', count: 10 },
    { name: 'Amazon', email: 'no-reply@amazon.in', count: 8 }
  ],
  categorySummary: [
    { category: 'Updates', count: 42 },
    { category: 'Finance', count: 28 },
    { category: 'Recruitment', count: 15 },
    { category: 'Shopping', count: 12 },
    { category: 'Social', count: 9 }
  ],
  recentEmails: SAMPLE_EMAILS,
  summary: 'Your inbox has been active with recruitment opportunities this week, with 2 new job offers. You have several financial alerts from HDFC Bank. There are 4 emails requiring immediate attention, including a speaking invitation and job opportunities. Your Amazon order is scheduled for delivery tomorrow. You have 18 unread emails, with 8 of them marked as important.',
  actionItems: [
    'Respond to React India speaking invitation by May 10th',
    'Schedule meeting with Delve team',
    'Review credit card statement',
    'Confirm flight details for Bangalore trip'
  ],
  followUps: [
    'Check status of Amazon delivery',
    'Follow up with Headout about next interview batch',
    'Confirm flight details for Bangalore trip on May 11th',
    'Update resume with recent projects'
  ]
};

const GmailPage = ({ isConnected, onConnect, onDisconnect }: GmailPageProps) => {
  const [emailAddress, setEmailAddress] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [summary, setSummary] = useState<EmailSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [summaryType, setSummaryType] = useState<string>('inbox');
  const [category, setCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('overview');

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
          setSummary(DEFAULT_SUMMARY);
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
        setSummary(DEFAULT_SUMMARY);
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

  const loadDefaultSummary = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data
      const mockSummary: EmailSummary = {
        emailCount: 1243,
        unreadCount: 57,
        importantCount: 89,
        timePeriod: "Last 30 days",
        summary: "Your inbox has been moderately active in the past month with communications primarily from work contacts and subscription services. There's been a 15% increase in email volume compared to the previous month.",
        topSenders: [
          { name: "GitHub", email: "noreply@github.com", count: 35 },
          { name: "LinkedIn", email: "news@linkedin.com", count: 28 },
          { name: "Slack", email: "notifications@slack.com", count: 22 },
          { name: "Twitter", email: "info@twitter.com", count: 18 },
          { name: "Amazon", email: "orders@amazon.com", count: 12 }
        ],
        recentEmails: [
          {
            id: "1",
            subject: "Your weekly GitHub digest",
            from: "GitHub",
            date: "2025-04-04T10:23:45Z",
            snippet: "Here's what happened in your repositories this week...",
            labels: ["Updates", "Social"],
            hasAttachment: false
          },
          {
            id: "2",
            subject: "Invoice #12345",
            from: "Billing Department",
            date: "2025-04-03T14:15:00Z",
            snippet: "Please find attached your invoice for May 2025...",
            labels: ["Finance"],
            hasAttachment: true
          },
          {
            id: "3",
            subject: "Meeting reminder: Project Review",
            from: "Calendar",
            date: "2025-04-04T09:00:00Z",
            snippet: "This is a reminder about your upcoming meeting at 2:00 PM...",
            labels: ["Important", "Work"],
            hasAttachment: false
          },
          {
            id: "4",
            subject: "Your order has shipped",
            from: "Amazon",
            date: "2025-04-02T16:30:00Z",
            snippet: "Your recent order #AB123456 has shipped and is on its way...",
            labels: ["Shopping"],
            hasAttachment: false
          },
          {
            id: "5",
            subject: "New connection request",
            from: "LinkedIn",
            date: "2025-04-01T11:45:00Z",
            snippet: "You have a new connection request from Jane Smith...",
            labels: ["Social", "Network"],
            hasAttachment: false
          }
        ],
        categorySummary: [
          { category: "Updates", count: 156 },
          { category: "Social", count: 98 },
          { category: "Promotions", count: 423 },
          { category: "Finance", count: 57 },
          { category: "Work", count: 289 }
        ],
        actionItems: [
          "Respond to meeting invitation from Marketing team",
          "Review and pay invoice #12345",
          "Confirm attendance for conference on May 10"
        ],
        followUps: [
          "Check status of support ticket #45678",
          "Follow up with Jane about project proposal",
          "Verify shipment delivery for order #AB123456"
        ]
      };
      
      setSummary(mockSummary);
      setError(null);
    } catch (err) {
      console.error('Error loading summary:', err);
      setError('Failed to load email summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      {!isConnected ? (
        <div className="flex flex-col items-center justify-center space-y-6 p-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <FaEnvelope className="text-red-500 text-6xl mb-2" />
          <h2 className="text-2xl font-bold text-center">Connect to Gmail</h2>
          <p className="text-gray-500 text-center max-w-md">
            Connect your Gmail account to analyze emails and get AI-powered insights
          </p>
          <button
            onClick={onConnect}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full transition-colors"
          >
            <FaLink className="text-sm" /> Connect Gmail
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">Gmail Analysis</h1>
              <p className="text-gray-500">Analyze your emails and get insights</p>
            </div>
            <button
              onClick={onDisconnect}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              <FaUnlink className="text-sm" /> Disconnect
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
              <p className="text-gray-500">Loading your email data...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Error</h3>
              <p>{error}</p>
              <button 
                onClick={loadDefaultSummary}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : summary ? (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">Email Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-gray-500 mb-1">Total Emails</div>
                    <div className="text-2xl font-bold">{summary.emailCount.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-gray-500 mb-1">Unread Emails</div>
                    <div className="text-2xl font-bold">{summary.unreadCount.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-gray-500 mb-1">Time Period</div>
                    <div className="text-2xl font-bold">{summary.timePeriod}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Email Analysis</h2>
                  <p className="text-gray-500">{summary.summary}</p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex mb-4 border-b border-gray-200">
                    <button
                      className={`pb-2 px-4 font-medium ${
                        activeTab === 'overview' 
                          ? 'text-red-500 border-b-2 border-red-500' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab('overview')}
                    >
                      Overview
                    </button>
                    <button
                      className={`pb-2 px-4 font-medium ${
                        activeTab === 'recent' 
                          ? 'text-red-500 border-b-2 border-red-500' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab('recent')}
                    >
                      Recent Emails
                    </button>
                    <button
                      className={`pb-2 px-4 font-medium ${
                        activeTab === 'categories' 
                          ? 'text-red-500 border-b-2 border-red-500' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab('categories')}
                    >
                      Categories
                    </button>
                  </div>

                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-3">Top Senders</h3>
                        <div className="space-y-3">
                          {summary.topSenders.map((sender, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500 mr-3">
                                  {sender.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-medium">{sender.name}</div>
                                  <div className="text-sm text-gray-500">{sender.email}</div>
                                </div>
                              </div>
                              <div className="text-gray-500">{sender.count} emails</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'recent' && (
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                      {summary.recentEmails.map((email, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex justify-between mb-2">
                            <div className="font-medium">{email.from}</div>
                            <div className="text-sm text-gray-500">{email.date}</div>
                          </div>
                          <div className="font-medium text-gray-800 mb-2">{email.subject}</div>
                          <p className="text-gray-600 text-sm">{email.snippet}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {email.labels.map((label, index) => (
                              <span key={index} className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                                {label}
                              </span>
                            ))}
                            {email.hasAttachment && (
                              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
                                attachment
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'categories' && (
                    <div className="space-y-4">
                      {summary.categorySummary.map((category, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{category.category}</span>
                            <span className="text-gray-500">{category.count} emails</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-red-500 h-2.5 rounded-full" 
                              style={{ width: `${(category.count / summary.emailCount) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <p className="text-gray-500 mb-4">No email data available. Click the button below to load your data.</p>
              <button
                onClick={loadDefaultSummary}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Load Email Data
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GmailPage; 