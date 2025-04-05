import nodemailer from 'nodemailer';
import { createLogger } from '../utils/logger';

const logger = createLogger('EmailService');

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;
  
  constructor() {
    // Create a test account using Ethereal for development
    // In production, you would use actual SMTP credentials
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER || 'ethereal.user@ethereal.email',
        pass: process.env.EMAIL_PASSWORD || 'ethereal_password'
      }
    });
    
    logger.info('Email service initialized');
  }
  
  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'AI Summarizer <ai-summarizer@example.com>',
        to: options.to,
        subject: options.subject,
        text: options.text || '',
        html: options.html
      };
      
      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent: ${info.messageId}`);
      
      // If using Ethereal, log the preview URL
      if (info.messageId && info.messageId.includes('ethereal')) {
        logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
      
      return true;
    } catch (error) {
      logger.error('Error sending email:', error);
      return false;
    }
  }
  
  /**
   * Format metrics into a visually appealing HTML table
   */
  private formatMetricsTable(metrics: any): string {
    if (!metrics || Object.keys(metrics).length === 0) {
      return '<p>No metrics available</p>';
    }
    
    let tableRows = '';
    
    // Handle special cases for better formatting
    Object.entries(metrics).forEach(([key, value]) => {
      let formattedValue = '';
      
      if (Array.isArray(value)) {
        // Format arrays (like topTopics) as a list
        formattedValue = `
          <ul style="margin: 0; padding-left: 20px;">
            ${(value as any[]).map(item => `<li>${item}</li>`).join('')}
          </ul>
        `;
      } else if (typeof value === 'number') {
        // Format numbers with 2 decimal places if they have decimals
        formattedValue = Number.isInteger(value) 
          ? value.toString() 
          : (value as number).toFixed(2);
          
        // Add percentage sign for rates and scores between 0-1
        if (key.toLowerCase().includes('rate') || key.toLowerCase().includes('score')) {
          if (value <= 1) {
            formattedValue = `${((value as number) * 100).toFixed(1)}%`;
          } else if (key.toLowerCase().includes('rate')) {
            formattedValue = `${formattedValue}%`;
          }
        }
      } else if (typeof value === 'object') {
        // Format nested objects as JSON
        formattedValue = `<pre style="margin: 0;">${JSON.stringify(value, null, 2)}</pre>`;
      } else {
        formattedValue = String(value);
      }
      
      // Format the key for display (camelCase to Title Case)
      const formattedKey = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
      
      tableRows += `
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-weight: 500;">${formattedKey}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0;">${formattedValue}</td>
        </tr>
      `;
    });
    
    return `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
        <thead>
          <tr style="background-color: #edf2f7;">
            <th style="text-align: left; padding: 10px 12px; border-bottom: 2px solid #cbd5e0;">Metric</th>
            <th style="text-align: left; padding: 10px 12px; border-bottom: 2px solid #cbd5e0;">Value</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;
  }
  
  /**
   * Format a date string in a more readable format
   */
  private formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  }

  /**
   * Format email content based on service type
   */
  private formatServiceContent(serviceName: string, details: any): string {
    if (!details) return '<p>No details available for this service.</p>';
    
    // Check if we have the specific service data in the details
    switch (serviceName.toLowerCase()) {
      case 'twitter':
        return this.formatTwitterContent(details);
      case 'gmail':
        // For Gmail, check if we have category-specific data
        if (details.metrics && details.metrics.categorySummary) {
          return this.formatGmailCategorySummaries(details.metrics);
        }
        return this.formatGmailContent(details.metrics || details);
      case 'reddit':
        return this.formatRedditContent(details);
      case 'facebook':
        return this.formatFacebookContent(details);
      case 'dashboard':
        // For Dashboard, show a summary of all connected services
        return this.formatDashboardContent(details);
      default:
        return this.formatGenericContent(details);
    }
  }

  /**
   * Format Twitter content for email
   */
  private formatTwitterContent(details: any): string {
    // Extract Twitter-specific data
    const profile = details.profile || {};
    const tweetSummary = details.tweetSummary || 'No tweet summary available';
    const tweetContent = details.tweetContent || 'No tweet content analysis available';
    const followingSummary = details.followingSummary || 'No following summary available';
    const summaryType = details.tweetInsights?.summaryType || 'latest';
    const topTweets = details.topTweets || [];
    
    // Profile metrics
    const followers = profile.followers || 0;
    const following = profile.following || 0;
    const tweets = profile.tweets || 0;
    const username = profile.username || 'unknown';
    const name = profile.name || 'Unknown User';
    
    // Format the summary type for display
    const summaryTypeFormatted = 
      summaryType === 'latest' ? 'Latest Tweets' : 
      summaryType === 'replies' ? 'Replies & Mentions' : 
      summaryType === 'trending' ? 'Trending Topics' : 'Twitter Activity';
    
    // Twitter brand color
    const twitterBlue = '#1DA1F2';
    
    return `
      <div style="margin-bottom: 30px;">
        <!-- Twitter Header with Logo -->
        <div style="display: flex; align-items: center; margin-bottom: 20px;">
          <div style="background-color: ${twitterBlue}; border-radius: 10px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
            </svg>
          </div>
          <h2 style="margin: 0; color: #1e3a8a; font-size: 22px; font-weight: 700;">
            Twitter Insights: ${summaryTypeFormatted}
          </h2>
        </div>
        
        <!-- Profile Overview Card -->
        <div style="background-color: #f3f4f6; border-radius: 12px; padding: 20px; margin-bottom: 25px; border: 1px solid #e5e7eb;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
            <div style="margin-bottom: 15px;">
              <h3 style="margin: 0; font-size: 20px; color: #111827;">@${username}</h3>
              <p style="margin: 5px 0 0; color: #4b5563; font-size: 15px;">${name}</p>
            </div>
            
            <div style="display: flex; flex-wrap: wrap; gap: 15px;">
              <div style="text-align: center; background-color: white; padding: 10px 15px; border-radius: 8px; min-width: 70px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                <div style="font-size: 18px; font-weight: 700; color: #1e3a8a;">${this.formatNumber(followers)}</div>
                <div style="color: #6b7280; font-size: 13px;">Followers</div>
              </div>
              
              <div style="text-align: center; background-color: white; padding: 10px 15px; border-radius: 8px; min-width: 70px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                <div style="font-size: 18px; font-weight: 700; color: #1e3a8a;">${this.formatNumber(following)}</div>
                <div style="color: #6b7280; font-size: 13px;">Following</div>
              </div>
              
              <div style="text-align: center; background-color: white; padding: 10px 15px; border-radius: 8px; min-width: 70px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                <div style="font-size: 18px; font-weight: 700; color: #1e3a8a;">${this.formatNumber(tweets)}</div>
                <div style="color: #6b7280; font-size: 13px;">Tweets</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Main Analysis Section -->
        <div style="background-color: white; border-radius: 12px; padding: 25px; margin-bottom: 25px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h3 style="margin: 0 0 15px; font-size: 18px; color: #111827; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            Twitter Activity Summary
          </h3>
          
          <p style="margin: 0 0 20px; line-height: 1.7; color: #4b5563; font-size: 15px;">
            ${tweetSummary}
          </p>
          
          <div style="background-color: #f3f4f6; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
            <h4 style="margin: 0 0 10px; font-size: 16px; color: #374151;">Tweet Content Analysis</h4>
            <p style="margin: 0; line-height: 1.7; color: #4b5563; font-size: 15px;">
              ${tweetContent}
            </p>
          </div>
          
          <div style="background-color: #f3f4f6; border-radius: 8px; padding: 15px;">
            <h4 style="margin: 0 0 10px; font-size: 16px; color: #374151;">Following Analysis</h4>
            <p style="margin: 0; line-height: 1.7; color: #4b5563; font-size: 15px;">
              ${followingSummary}
            </p>
          </div>
        </div>
        
        ${topTweets.length > 0 ? `
        <!-- Top Tweets Section -->
        <div style="background-color: white; border-radius: 12px; padding: 25px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h3 style="margin: 0 0 15px; font-size: 18px; color: #111827; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            Top Performing Tweets
          </h3>
          
          <div style="display: flex; flex-direction: column; gap: 15px;">
            ${topTweets.map((tweet: any, index: number) => `
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 15px; border-left: 4px solid ${twitterBlue};">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="font-weight: 600; color: #4b5563;">Tweet #${index + 1}</span>
                  <span style="background-color: #dbeafe; color: #1e40af; font-size: 13px; font-weight: 500; padding: 3px 8px; border-radius: 4px;">
                    ${this.formatNumber(tweet.engagement)} engagement
                  </span>
                </div>
                <p style="margin: 0; line-height: 1.5; color: #1f2937; font-size: 15px;">
                  "${tweet.text}"
                </p>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
        
        <!-- Action Button -->
        <div style="margin-top: 25px; text-align: center;">
          <a href="https://x.com/${username}" 
             style="display: inline-block; background-color: ${twitterBlue}; color: white; text-decoration: none; padding: 12px 25px; border-radius: 30px; font-weight: 600; font-size: 16px;">
            View Profile on Twitter
          </a>
        </div>
      </div>
    `;
  }

  /**
   * Format numbers for better readability (e.g., 1200 -> 1.2K)
   */
  private formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  /**
   * Format Gmail content for email
   */
  private formatGmailContent(details: any): string {
    const metrics = details.metrics || {};
    const emailCount = metrics.emailCount || 0;
    const unreadCount = metrics.unreadCount || 0;
    const importantCount = metrics.importantCount || 0;
    const summary = metrics.summary || 'No email summary available';
    const topSenders = metrics.topSenders || [];
    const categorySummary = metrics.categorySummary || [];
    const recentEmails = metrics.recentEmails || [];
    const actionItems = metrics.actionItems || [];
    const followUps = metrics.followUps || [];
    
    return `
      <div style="margin-bottom: 25px;">
        <h2 style="margin: 0 0 15px; color: #1e40af; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
          Email Overview
        </h2>
        <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 20px;">
          <div style="flex: 1; min-width: 150px; background-color: #dbeafe; padding: 15px; border-radius: 8px; text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #1e40af;">${emailCount}</div>
            <div style="color: #64748b;">Total Emails</div>
          </div>
          <div style="flex: 1; min-width: 150px; background-color: #fef3c7; padding: 15px; border-radius: 8px; text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #92400e;">${unreadCount}</div>
            <div style="color: #64748b;">Unread</div>
          </div>
          <div style="flex: 1; min-width: 150px; background-color: #dcfce7; padding: 15px; border-radius: 8px; text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #166534;">${importantCount}</div>
            <div style="color: #64748b;">Important</div>
          </div>
        </div>
        
        <h2 style="margin: 25px 0 15px; color: #1e40af; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
          Email Summary
        </h2>
        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 20px;">
          <p style="margin: 0; line-height: 1.6;">${summary}</p>
        </div>
        
        <h2 style="margin: 25px 0 15px; color: #1e40af; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
          Top Senders
        </h2>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          ${topSenders.length > 0 ? 
            `<div style="display: flex; flex-direction: column; gap: 10px;">
              ${topSenders.map((sender: any) => `
                <div style="display: flex; justify-content: space-between; padding: 10px; background-color: #f1f5f9; border-radius: 6px;">
                  <div style="font-weight: 500;">${sender.name} (${sender.email})</div>
                  <div style="background-color: #dbeafe; padding: 2px 8px; border-radius: 12px; font-size: 14px;">${sender.count} emails</div>
                </div>
              `).join('')}
            </div>` : 
            '<p style="margin: 0; color: #64748b;">No sender data available</p>'
          }
        </div>
        
        <h2 style="margin: 25px 0 15px; color: #1e40af; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
          Recent Emails
        </h2>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          ${recentEmails.length > 0 ? 
            `<div style="display: flex; flex-direction: column; gap: 15px;">
              ${recentEmails.slice(0, 5).map((email: any) => `
                <div style="padding: 15px; background-color: #f1f5f9; border-radius: 8px; border-left: 3px solid ${email.labels?.includes('important') ? '#f59e0b' : '#3b82f6'};">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <div style="font-weight: 600; ${!email.isRead ? 'color: #1e40af;' : ''}">${email.subject}</div>
                    <div style="color: #64748b; font-size: 14px;">${email.date}</div>
                  </div>
                  <div style="color: #334155; margin-bottom: 8px;">From: ${email.from || email.sender}</div>
                  <div style="color: #64748b; font-size: 14px;">${email.snippet}</div>
                  ${email.labels && email.labels.length > 0 ? 
                    `<div style="display: flex; gap: 5px; margin-top: 10px; flex-wrap: wrap;">
                      ${email.labels.map((label: string) => 
                        `<span style="background-color: #e2e8f0; padding: 2px 8px; border-radius: 12px; font-size: 12px;">${label}</span>`
                      ).join('')}
                    </div>` : ''
                  }
                </div>
              `).join('')}
            </div>` : 
            '<p style="margin: 0; color: #64748b;">No recent emails available</p>'
          }
        </div>
        
        <h2 style="margin: 25px 0 15px; color: #1e40af; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
          Action Items
        </h2>
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9; margin-bottom: 20px;">
          ${actionItems.length > 0 ? 
            `<ul style="margin: 0; padding-left: 20px; line-height: 1.6;">
              ${actionItems.map((item: string) => `<li>${item}</li>`).join('')}
            </ul>` : 
            '<p style="margin: 0; color: #64748b;">No action items available</p>'
          }
        </div>
        
        <h2 style="margin: 25px 0 15px; color: #1e40af; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
          Follow-ups
        </h2>
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
          ${followUps.length > 0 ? 
            `<ul style="margin: 0; padding-left: 20px; line-height: 1.6;">
              ${followUps.map((item: string) => `<li>${item}</li>`).join('')}
            </ul>` : 
            '<p style="margin: 0; color: #64748b;">No follow-ups available</p>'
          }
        </div>
      </div>
    `;
  }

  /**
   * Format Reddit content for email
   */
  private formatRedditContent(details: any): string {
    // Extract Reddit-specific data
    const subredditSummary = details.subredditSummary || 'No subreddit summary available';
    const postSummary = details.postSummary || 'No post summary available';
    const commentSummary = details.commentSummary || 'No comment summary available';
    
    return `
      <div style="margin-bottom: 25px;">
        <h2 style="margin: 0 0 15px; color: #1e40af; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
          Reddit Summaries
        </h2>
        
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <!-- Subreddit Summary -->
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #ff4500;">
            <h3 style="margin: 0 0 10px; font-size: 18px; color: #1e40af;">Subreddit Activity</h3>
            <p style="margin: 0; line-height: 1.6;">${subredditSummary}</p>
          </div>
          
          <!-- Post Summary -->
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #ff4500;">
            <h3 style="margin: 0 0 10px; font-size: 18px; color: #1e40af;">Post Activity</h3>
            <p style="margin: 0; line-height: 1.6;">${postSummary}</p>
          </div>
          
          <!-- Comment Summary -->
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #ff4500;">
            <h3 style="margin: 0 0 10px; font-size: 18px; color: #1e40af;">Comment Activity</h3>
            <p style="margin: 0; line-height: 1.6;">${commentSummary}</p>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Format Facebook content for email
   */
  private formatFacebookContent(details: any): string {
    // Since Facebook is coming soon, we'll just show a placeholder
    return `
      <div style="margin-bottom: 25px; text-align: center;">
        <div style="font-size: 48px; color: #1877f2; margin-bottom: 20px;">f</div>
        <h2 style="margin: 0 0 15px; font-size: 24px; font-weight: 600;">Facebook Integration Coming Soon!</h2>
        <p style="margin: 0; color: #64748b; max-width: 500px; margin: 0 auto; line-height: 1.6;">
          Facebook integration is currently under development. Check back soon for updates on this feature.
        </p>
      </div>
    `;
  }

  /**
   * Format generic content for email when service type is unknown
   */
  private formatGenericContent(details: any): string {
    const metrics = details.metrics || {};
    const summary = details.summary || metrics.summary || 'No summary available';
    
    return `
      <div style="margin-bottom: 25px;">
        <h2 style="margin: 0 0 15px; color: #1e40af; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
          Summary
        </h2>
        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
          <p style="margin: 0; line-height: 1.6;">${summary}</p>
        </div>
        
        <h2 style="margin: 25px 0 15px; color: #1e40af; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
          Details
        </h2>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; font-family: monospace; white-space: pre-wrap;">
          ${JSON.stringify(details, null, 2)}
        </div>
      </div>
    `;
  }
  
  /**
   * Format Dashboard content for email
   */
  private formatDashboardContent(details: any): string {
    const metrics = details.metrics || {};
    const engagementRate = metrics.engagementRate || 0;
    const topTopics = metrics.topTopics || ['AI', 'Technology', 'Innovation'];
    const sentimentScore = metrics.sentimentScore || 0;
    
    // Custom theme colors
    const primaryColor = '#4C6EF5'; // Indigo
    const primaryLight = '#E7EBFF';
    const secondaryColor = '#1E293B'; // Slate dark
    const accentColor = '#10B981'; // Emerald
    const lightGray = '#F8FAFC';
    const borderColor = '#E2E8F0';
    
    // Format engagement rate for display
    const formattedEngagementRate = `${(engagementRate * 100).toFixed(1)}%`;
    
    // Get sentiment label and appropriate colors
    const sentimentLabel = this.getSentimentLabel(sentimentScore);
    const sentimentColor = this.getSentimentColor(sentimentScore);
    const sentimentTextColor = sentimentScore >= 0.5 ? '#047857' : (sentimentScore >= 0 ? '#854D0E' : '#B91C1C');
    
    return `
      <div style="margin-bottom: 25px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <!-- Hero Section with Gradient Background -->
        <div style="background: linear-gradient(135deg, ${primaryColor}, #818CF8); color: white; padding: 30px; border-radius: 10px; margin-bottom: 25px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h1 style="margin: 0 0 10px; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Dashboard Summary Report</h1>
          <p style="margin: 0; opacity: 0.9; font-size: 16px;">Your social media and communications at a glance</p>
        </div>
        
        <!-- Main Summary Section -->
        <div style="background-color: white; border-radius: 10px; padding: 25px; margin-bottom: 25px; border: 1px solid ${borderColor}; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
          <h2 style="margin: 0 0 20px; color: ${secondaryColor}; font-size: 22px; font-weight: 700; letter-spacing: -0.3px; border-bottom: 2px solid ${borderColor}; padding-bottom: 10px;">
            Overall Dashboard Summary
          </h2>
          
          <!-- Key Metrics Cards - 2 column layout -->
          <div style="display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 25px;">
            <!-- Engagement Rate Card -->
            <div style="flex: 1; min-width: 220px; background-color: ${primaryLight}; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.04); border: 1px solid ${borderColor};">
              <div style="font-size: 16px; color: ${secondaryColor}; margin-bottom: 5px; font-weight: 500;">Engagement Rate</div>
              <div style="font-size: 36px; font-weight: 800; color: ${primaryColor}; letter-spacing: -1px; margin-bottom: 5px;">
                ${formattedEngagementRate}
              </div>
              <div style="font-size: 14px; color: #64748B; font-weight: 400;">
                Audience interaction across platforms
              </div>
            </div>
            
            <!-- Sentiment Score Card -->
            <div style="flex: 1; min-width: 220px; background-color: ${sentimentColor}; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.04); border: 1px solid ${borderColor};">
              <div style="font-size: 16px; color: ${secondaryColor}; margin-bottom: 5px; font-weight: 500;">Overall Sentiment</div>
              <div style="font-size: 36px; font-weight: 800; color: ${sentimentTextColor}; letter-spacing: -1px; margin-bottom: 5px;">
                ${sentimentLabel}
              </div>
              <div style="font-size: 14px; color: #64748B; font-weight: 400;">
                Audience perception of your content
              </div>
            </div>
          </div>
          
          <!-- Top Topics Section -->
          <div style="margin-bottom: 25px;">
            <h3 style="margin: 0 0 15px; font-size: 18px; color: ${secondaryColor}; font-weight: 600;">Top Topics</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 5px;">
              ${topTopics.map((topic: string) => `
                <div style="background-color: ${primaryLight}; padding: 8px 14px; border-radius: 20px; font-weight: 500; color: ${primaryColor}; border: 1px solid ${primaryColor}30; font-size: 15px;">
                  ${topic}
                </div>
              `).join('')}
            </div>
            <p style="margin: 15px 0 0; font-size: 14px; color: #64748B;">
              These topics are trending across your connected platforms.
            </p>
          </div>
        </div>
        
        <!-- Connected Services Section -->
        <div style="background-color: white; border-radius: 10px; padding: 25px; border: 1px solid ${borderColor}; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
          <h2 style="margin: 0 0 20px; color: ${secondaryColor}; font-size: 22px; font-weight: 700; letter-spacing: -0.3px; border-bottom: 2px solid ${borderColor}; padding-bottom: 10px;">
            Connected Services
          </h2>
          
          <p style="margin: 0 0 20px; line-height: 1.6; color: #475569;">
            This is a summary of all your connected social media and communication services. 
            For more detailed information about a specific service, use the "Sync to Email" button 
            while viewing that service's page.
          </p>
          
          <!-- Services Grid - Modern Card Design -->
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px;">
            <!-- Twitter Card -->
            <div style="background-color: white; padding: 20px; border-radius: 10px; border: 1px solid ${borderColor}; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="background-color: #1DA1F2; border-radius: 10px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
                  </svg>
                </div>
                <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: ${secondaryColor};">Twitter</h3>
              </div>
              <p style="margin: 0; color: #64748B; font-size: 14px; line-height: 1.5;">
                View tweets, engagement, and follower insights
              </p>
            </div>
            
            <!-- Reddit Card -->
            <div style="background-color: white; padding: 20px; border-radius: 10px; border: 1px solid ${borderColor}; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="background-color: #FF4500; border-radius: 10px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm0-18c-4.42 0-8 3.58-8 8 0 1.95.7 3.73 1.86 5.12.05-.39.11-.79.11-1.21 0-1.86 1.27-3.43 3-3.87-.34-.07-.7-.11-1.07-.11-.43 0-.84.09-1.22.23-.19-.31-.37-.63-.53-.97.17-.01.34-.03.51-.03.26 0 .51.02.75.07 1.43-.95 3.09-1.51 4.89-1.51 1.69 0 3.26.49 4.64 1.36.33-.3.75-.48 1.21-.48.1 0 .2.01.3.03.65.12 1.15.65 1.27 1.3.03.17.01.35-.05.51-.13.36-.44.64-.81.76.26.52.41 1.1.41 1.71 0 .44-.07.87-.21 1.27 1.33-1.42 2.15-3.34 2.15-5.46 0-4.42-3.58-8-8-8z"></path>
                  </svg>
                </div>
                <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: ${secondaryColor};">Reddit</h3>
              </div>
              <p style="margin: 0; color: #64748B; font-size: 14px; line-height: 1.5;">
                Analyze subreddit activity and post engagement
              </p>
            </div>
            
            <!-- Gmail Card -->
            <div style="background-color: white; padding: 20px; border-radius: 10px; border: 1px solid ${borderColor}; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="background-color: #D93025; border-radius: 10px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-.4 4.25l-7.07 4.42c-.32.2-.74.2-1.06 0L4.4 8.25c-.25-.16-.4-.43-.4-.72 0-.67.73-1.07 1.3-.72L12 11l6.7-4.19c.57-.35 1.3.05 1.3.72 0 .29-.15.56-.4.72z"></path>
                  </svg>
                </div>
                <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: ${secondaryColor};">Gmail</h3>
              </div>
              <p style="margin: 0; color: #64748B; font-size: 14px; line-height: 1.5;">
                Summarize email communications and priorities
              </p>
            </div>
            
            <!-- Facebook Card -->
            <div style="background-color: white; padding: 20px; border-radius: 10px; border: 1px solid ${borderColor}; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="background-color: #1877F2; border-radius: 10px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.9 2H3.1A1.1 1.1 0 0 0 2 3.1v17.8A1.1 1.1 0 0 0 3.1 22h9.58v-7.75h-2.6v-3h2.6V9a3.64 3.64 0 0 1 3.88-4 20.26 20.26 0 0 1 2.33.12v2.7H17.3c-1.26 0-1.5.6-1.5 1.47v1.93h3l-.39 3H15.8V22h5.1a1.1 1.1 0 0 0 1.1-1.1V3.1A1.1 1.1 0 0 0 20.9 2z"></path>
                  </svg>
                </div>
                <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: ${secondaryColor};">Facebook</h3>
              </div>
              <p style="margin: 0; color: #64748B; font-size: 14px; line-height: 1.5;">
                Track page engagement and audience insights
              </p>
            </div>
          </div>
          
          <!-- Action Button -->
          <div style="margin-top: 25px; text-align: center;">
            <a href="#" style="display: inline-block; background-color: ${primaryColor}; color: white; text-decoration: none; padding: 12px 25px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              View Full Dashboard
            </a>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Get sentiment color based on score
   */
  private getSentimentColor(score: number): string {
    if (score >= 0.5) return '#dcfce7'; // Positive - green
    if (score >= 0) return '#fef9c3';   // Neutral - yellow
    return '#fee2e2';                   // Negative - red
  }

  /**
   * Get sentiment label based on score
   */
  private getSentimentLabel(score: number): string {
    if (score >= 0.5) return 'Positive';
    if (score >= 0) return 'Neutral';
    return 'Negative';
  }
  
  async sendSummaryReport(email: string, serviceName: string, summaryData: any): Promise<boolean> {
    const { summary, details } = summaryData;
    
    // Format the current date
    const timestamp = this.formatDate(new Date().toISOString());
    
    // Determine the service name for display
    const service = serviceName.charAt(0).toUpperCase() + serviceName.slice(1);
    
    // Create email subject
    const subject = `${service} Summary Report - ${timestamp}`;
    
    // Set theme colors
    const primaryColor = '#4C6EF5'; // Indigo
    const secondaryColor = '#1E293B'; // Slate dark
    const backgroundColor = '#F9FAFB'; // Very light gray
    const borderColor = '#E2E8F0'; // Light gray
    
    // Create HTML content
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6; 
            color: #1E293B; 
            margin: 0; 
            padding: 0; 
            background-color: ${backgroundColor};
            -webkit-font-smoothing: antialiased;
          }
          h1, h2, h3, h4 { margin-top: 0; font-weight: 600; line-height: 1.3; }
          p { margin: 0 0 16px; }
          a { color: ${primaryColor}; text-decoration: none; }
          
          @media only screen and (max-width: 620px) {
            .container { width: 100% !important; }
            .responsive-table { width: 100% !important; }
            .mobile-padding { padding: 15px !important; }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0;">
        <!-- Background Table -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="${backgroundColor}">
          <tr>
            <td align="center" style="padding: 30px 0;">
              <!-- Container Table -->
              <table border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, ${primaryColor}, #818CF8); padding: 30px;" class="mobile-padding">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center">
                          <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">${service} Summary Report</h1>
                          <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Generated on: ${timestamp}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 30px;" class="mobile-padding">
                    <!-- Service-specific content -->
                    ${this.formatServiceContent(serviceName, details)}
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: ${backgroundColor}; border-top: 1px solid ${borderColor}; padding: 20px;" class="mobile-padding">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center">
                          <table border="0" cellpadding="0" cellspacing="0">
                            <tr>
                              <td>
                                <a href="#" style="display: inline-block; margin: 0 10px; color: #64748B; font-size: 14px; text-decoration: none;">Dashboard</a>
                              </td>
                              <td>
                                <a href="#" style="display: inline-block; margin: 0 10px; color: #64748B; font-size: 14px; text-decoration: none;">Account</a>
                              </td>
                              <td>
                                <a href="#" style="display: inline-block; margin: 0 10px; color: #64748B; font-size: 14px; text-decoration: none;">Settings</a>
                              </td>
                            </tr>
                          </table>
                          <p style="margin: 15px 0 0; color: #94A3B8; font-size: 13px; text-align: center;">
                            This is an automated report from AI Summarizer.<br>Please do not reply to this email.
                          </p>
                          <p style="margin: 10px 0 0; color: #94A3B8; font-size: 13px; text-align: center;">
                            © ${new Date().getFullYear()} AI Summarizer. All rights reserved.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
    
    return this.sendEmail({
      to: email,
      subject,
      html
    });
  }

  /**
   * Format Gmail category summaries for email
   */
  private formatGmailCategorySummaries(metrics: any): string {
    const categorySummary = metrics.categorySummary || [];
    
    if (categorySummary.length === 0) {
      return `
        <div style="margin-bottom: 25px;">
          <h2 style="margin: 0 0 15px; color: #1e40af; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
            Gmail Categories
          </h2>
          <p>No category summaries available.</p>
        </div>
      `;
    }
    
    return `
      <div style="margin-bottom: 25px;">
        <h2 style="margin: 0 0 15px; color: #1e40af; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
          Gmail Categories
        </h2>
        
        <div style="display: flex; flex-direction: column; gap: 20px;">
          ${categorySummary.map((category: any) => `
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #4285f4;">
              <h3 style="margin: 0 0 10px; font-size: 18px; color: #1e40af;">${category.category.charAt(0).toUpperCase() + category.category.slice(1)}</h3>
              <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <div style="background-color: #dbeafe; padding: 5px 10px; border-radius: 20px; font-weight: 500; font-size: 14px;">
                  ${category.count} emails
                </div>
              </div>
              <p style="margin: 0; line-height: 1.6;">${category.summary || 'No summary available for this category.'}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

// Export a singleton instance
export const emailService = new EmailService(); 