import React, { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { sendSummaryEmail } from '../../services/emailService';

const SettingsPage: React.FC = () => {
  const [isScheduleEnabled, setIsScheduleEnabled] = useState(false);
  const [cronInterval, setCronInterval] = useState<number>(20); // Default 20 seconds
  const [scheduledEmailAddress, setScheduledEmailAddress] = useState('tr5656@srmist.edu.in');
  const [nextRunTime, setNextRunTime] = useState<Date | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(20);
  const [sendStatus, setSendStatus] = useState<{success: boolean; message: string} | null>(null);

  // Update next run time when schedule is enabled or interval changes
  useEffect(() => {
    if (isScheduleEnabled) {
      const now = new Date();
      const next = new Date(now.getTime() + cronInterval * 1000);
      setNextRunTime(next);
      setCountdownSeconds(cronInterval);
    } else {
      setNextRunTime(null);
      setIsRunning(false);
    }
  }, [isScheduleEnabled, cronInterval]);

  // Countdown timer
  useEffect(() => {
    let intervalId: number;
    
    if (isScheduleEnabled && countdownSeconds > 0) {
      intervalId = window.setInterval(() => {
        setCountdownSeconds(prev => {
          const newCount = prev - 1;
          if (newCount <= 0) {
            // Trigger the email send
            sendScheduledEmail();
            // Reset countdown
            return cronInterval;
          }
          return newCount;
        });
      }, 1000);
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isScheduleEnabled, cronInterval, countdownSeconds]);

  // Get Twitter summary data
  const getTwitterSummaryData = () => {
    // This simulates what getTwitterSummaryData from TwitterPage.tsx would return
    return {
      summary: `Twitter Analysis for @TautikA: Recent tweets focus on developer tools and technologies, including mentions of Baserun AI and discussions about alternatives to Infisical for secret management.`,
      details: {
        profile: {
          name: "Tautik Agrahari",
          username: "TautikA",
          followers: 1250,
          following: 520,
          tweets: 1876
        },
        tweetInsights: {
          summaryType: "latest",
          tweetContent: "Tautik's tweets are concise and direct, often mentioning specific tools or services he's exploring. His content reflects an active interest in developer productivity tools, particularly those related to AI and security.",
          followingSummary: "Tautik follows 520 accounts, with a focus on tech founders, AI researchers, and developer tool companies."
        },
        topTweets: [
          { text: "genuine", engagement: 8 },
          { text: "never knew something like @baserunai existed", engagement: 20 },
          { text: "any alternative for storing secrets? @infisical really sucks at this point", engagement: 25 }
        ],
        tweetSummary: "Recent tweets focus on developer tools and technologies, especially AI testing frameworks and secret management solutions.",
        audioIncluded: true
      }
    };
  };

  const sendScheduledEmail = async () => {
    setSendStatus(null);
    
    try {
      // Get the twitter summary data using the same format as the "Sync to Email" feature
      const summaryData = getTwitterSummaryData();
      
      // Use the emailService to send the email, matching the format in SyncToEmailButton
      const result = await sendSummaryEmail({
        email: scheduledEmailAddress,
        serviceName: 'twitter', // Default service, could be made configurable
        summaryData
      });
      
      console.log('Scheduled email result:', result);
      setSendStatus(result);
      
      // Update next run time
      const now = new Date();
      const next = new Date(now.getTime() + cronInterval * 1000);
      setNextRunTime(next);
    } catch (error) {
      console.error('Failed to send scheduled email:', error);
      setSendStatus({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred sending the email'
      });
    }
  };

  const formatTime = (date: Date | null) => {
    if (!date) return 'Not scheduled';
    return date.toLocaleTimeString();
  };

  const formatTimeInterval = (seconds: number) => {
    if (seconds < 60) return `${seconds} seconds`;
    if (seconds === 60) return '1 minute';
    if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes} minute${minutes > 1 ? 's' : ''}${remainingSeconds > 0 ? ` ${remainingSeconds} seconds` : ''}`;
    }
    // Hours formatting
    const hours = Math.floor(seconds / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);
    return `${hours} hour${hours > 1 ? 's' : ''}${remainingMinutes > 0 ? ` ${remainingMinutes} minutes` : ''}`;
  };

  // Add calculateNextRunTimes function
  const calculateNextRunTimes = (count: number): Date[] => {
    if (!isScheduleEnabled || !nextRunTime) return [];
    
    const times: Date[] = [];
    let baseTime = nextRunTime.getTime();
    
    for (let i = 0; i < count; i++) {
      if (i === 0) {
        times.push(new Date(baseTime));
      } else {
        baseTime += cronInterval * 1000;
        times.push(new Date(baseTime));
      }
    }
    
    return times;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
        
        {/* CRON Scheduler Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Email Schedule</h2>
          <p className="text-gray-600 mb-6">
            Configure automatic email delivery with audio summaries on a schedule
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">Enable Scheduled Emails</h3>
                <p className="text-sm text-gray-500">Automatically send summaries on a schedule</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={isScheduleEnabled}
                  onChange={() => setIsScheduleEnabled(!isScheduleEnabled)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="border-t border-gray-100 pt-4">
              <h3 className="font-medium text-gray-800 mb-2">Delivery Interval</h3>
              <div className="mb-2">
                <p className="text-sm text-gray-500">
                  Send summary email every {formatTimeInterval(cronInterval)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">10s</span>
                <Slider
                  value={[cronInterval]}
                  min={10}
                  max={3600}
                  step={10}
                  onValueChange={(value: number[]) => setCronInterval(value[0])}
                  disabled={!isScheduleEnabled}
                  className="flex-1"
                />
                <span className="text-sm text-gray-500">1h</span>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4">
              <h3 className="font-medium text-gray-800 mb-2">Email Address</h3>
              <input 
                type="email" 
                value={scheduledEmailAddress}
                onChange={(e) => setScheduledEmailAddress(e.target.value)}
                placeholder="Email address"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                disabled={!isScheduleEnabled}
              />
              <p className="text-xs text-gray-500">Default: tr5656@srmist.edu.in</p>
            </div>

            {isScheduleEnabled && (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                    <h3 className="font-medium text-blue-800">Schedule Status: {isRunning ? 'Active' : 'Inactive'}</h3>
                  </div>
                  <div className="mt-2 text-sm text-blue-600">
                    <p>Next email will be sent in: {countdownSeconds} seconds</p>
                    <p className="mt-1">Scheduled time: {formatTime(nextRunTime)}</p>
                  </div>
                  
                  {/* Countdown Progress Bar */}
                  <div className="mt-3">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 transition-all duration-1000 ease-linear"
                        style={{ width: `${(countdownSeconds / cronInterval) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Now</span>
                      <span>{formatTimeInterval(cronInterval)}</span>
                    </div>
                  </div>

                  {/* Last Sent Status */}
                  <div className="mt-4 pt-4 border-t border-blue-100">
                    <p className="text-sm text-blue-700 font-medium">Email will be sent to:</p>
                    <p className="text-sm font-mono bg-white p-2 rounded mt-1 border border-blue-100">{scheduledEmailAddress}</p>
                    
                    {/* Send Status Message */}
                    {sendStatus && (
                      <div className={`mt-2 text-sm p-2 rounded ${sendStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {sendStatus.message || (sendStatus.success ? 'Email sent successfully!' : 'Failed to send email')}
                      </div>
                    )}
                    
                    <button 
                      onClick={sendScheduledEmail}
                      className="mt-3 bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded transition-colors"
                    >
                      Send Now
                    </button>
                  </div>
                </div>
                
                {/* Upcoming Schedule */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-md border border-gray-200">
                    <h3 className="font-medium text-gray-800 mb-3">Upcoming Schedule</h3>
                    <div className="space-y-2">
                      {calculateNextRunTimes(5).map((time, index) => (
                        <div 
                          key={index} 
                          className={`flex items-center border-l-4 p-2 ${index === 0 ? 'border-l-green-500 bg-green-50' : 'border-l-blue-300 bg-gray-50'}`}
                        >
                          <div className="mr-2 text-sm text-gray-500 w-8">{index + 1}.</div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">{time.toLocaleTimeString()}</div>
                            <div className="text-xs text-gray-500">
                              {index === 0 ? 'Next run' : `In ${formatTimeInterval((index * cronInterval))}`}
                            </div>
                          </div>
                          {index === 0 && (
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-ping mr-2"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Email Content Preview */}
                  <div className="bg-white p-4 rounded-md border border-gray-200">
                    <h3 className="font-medium text-gray-800 mb-3">Email Content</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Twitter Summary</p>
                            <p className="text-xs text-gray-500">Latest tweets and activity</p>
                          </div>
                        </div>
                        <div className="text-xs text-green-600 font-medium">Included</div>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Audio Summary</p>
                            <p className="text-xs text-gray-500">AI-narrated overview</p>
                          </div>
                        </div>
                        <div className="text-xs text-green-600 font-medium">Included</div>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200 opacity-60">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Other Services</p>
                            <p className="text-xs text-gray-500">Reddit, Gmail, Facebook</p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">Not connected</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Notification Preferences</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">Email Notifications</h3>
                <p className="text-sm text-gray-500">Receive daily summary reports via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked readOnly />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">Audio Summaries</h3>
                <p className="text-sm text-gray-500">Generate audio versions of summaries</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked readOnly />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">Weekly Analytics</h3>
                <p className="text-sm text-gray-500">Get weekly insights and trend analysis</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 