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
    const profile = details.profile?.data || {};
    const tweetSummary = details.tweetSummary || 'No tweet summary available';
    const followingSummary = details.followingSummary || 'No following summary available';
    
    return `
      <div style="margin-bottom: 25px;">
        <h2 style="margin: 0 0 15px; color: #1e40af; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
          Twitter Summaries
        </h2>
        
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <!-- Tweet Summary -->
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #1d9bf0;">
            <h3 style="margin: 0 0 10px; font-size: 18px; color: #1e40af;">Tweet Activity</h3>
            <p style="margin: 0; line-height: 1.6;">${tweetSummary}</p>
          </div>
          
          <!-- Following Summary -->
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #1d9bf0;">
            <h3 style="margin: 0 0 10px; font-size: 18px; color: #1e40af;">Following Activity</h3>
            <p style="margin: 0; line-height: 1.6;">${followingSummary}</p>
          </div>
        </div>
      </div>
    `;
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
    const topTopics = metrics.topTopics || [];
    const sentimentScore = metrics.sentimentScore || 0;
    
    return `
      <div style="margin-bottom: 25px;">
        <h2 style="margin: 0 0 15px; color: #1e40af; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
          Overall Dashboard Summary
        </h2>
        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 20px;">
            <div style="flex: 1; min-width: 150px; background-color: #dbeafe; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 24px; font-weight: 700; color: #1e40af;">${(engagementRate * 100).toFixed(1)}%</div>
              <div style="color: #64748b;">Engagement Rate</div>
            </div>
            <div style="flex: 1; min-width: 150px; background-color: ${this.getSentimentColor(sentimentScore)}; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 24px; font-weight: 700; color: #1e3a8a;">${this.getSentimentLabel(sentimentScore)}</div>
              <div style="color: #64748b;">Overall Sentiment</div>
            </div>
          </div>
          
          <h3 style="margin: 20px 0 10px; font-size: 18px; color: #1e40af;">Top Topics</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px;">
            ${topTopics.map((topic: string) => `
              <div style="background-color: #dbeafe; padding: 8px 12px; border-radius: 6px; font-weight: 500;">${topic}</div>
            `).join('')}
          </div>
        </div>
        
        <h2 style="margin: 25px 0 15px; color: #1e40af; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
          Connected Services
        </h2>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px;">
          <p style="margin: 0 0 15px; line-height: 1.6;">
            This is a summary of all your connected social media and communication services. 
            For more detailed information about a specific service, use the "Sync to Email" button 
            while viewing that service's page.
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 15px;">
            <div style="background-color: #e8f5fe; padding: 12px; border-radius: 8px; border-left: 3px solid #1d9bf0; flex: 1; min-width: 200px;">
              <div style="font-weight: 600; margin-bottom: 5px;">Twitter</div>
              <div style="color: #64748b; font-size: 14px;">View tweets, engagement, and follower insights</div>
            </div>
            <div style="background-color: #fff4e5; padding: 12px; border-radius: 8px; border-left: 3px solid #ff4500; flex: 1; min-width: 200px;">
              <div style="font-weight: 600; margin-bottom: 5px;">Reddit</div>
              <div style="color: #64748b; font-size: 14px;">Analyze subreddit activity and post engagement</div>
            </div>
            <div style="background-color: #f0f4f9; padding: 12px; border-radius: 8px; border-left: 3px solid #4285f4; flex: 1; min-width: 200px;">
              <div style="font-weight: 600; margin-bottom: 5px;">Gmail</div>
              <div style="color: #64748b; font-size: 14px;">Summarize email communications and priorities</div>
            </div>
            <div style="background-color: #f0f2fa; padding: 12px; border-radius: 8px; border-left: 3px solid #1877f2; flex: 1; min-width: 200px;">
              <div style="font-weight: 600; margin-bottom: 5px;">Facebook</div>
              <div style="color: #64748b; font-size: 14px;">Track page engagement and audience insights</div>
            </div>
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
    
    // Create HTML content
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9fafb; }
          h1, h2, h3, h4 { margin-top: 0; }
          p { margin: 0 0 16px; }
        </style>
      </head>
      <body>
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(90deg, #3b82f6, #60a5fa); color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 600;">${service} Summary Report</h1>
            <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.8;">Generated on: ${timestamp}</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px;">
            <!-- Service-specific content -->
            ${this.formatServiceContent(serviceName, details)}
          </div>
          
          <!-- Footer -->
          <div style="padding: 20px; background-color: #f1f5f9; border-top: 1px solid #e2e8f0; border-radius: 0 0 10px 10px; text-align: center; color: #64748b; font-size: 12px;">
            <p style="margin: 0 0 10px;">This is an automated report from AI Summarizer. Please do not reply to this email.</p>
            <p style="margin: 0;">© ${new Date().getFullYear()} AI Summarizer. All rights reserved.</p>
          </div>
        </div>
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