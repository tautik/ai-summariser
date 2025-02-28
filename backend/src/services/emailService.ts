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
  
  async sendSummaryReport(email: string, serviceName: string, summaryData: any): Promise<boolean> {
    const subject = `AI Summarizer - ${serviceName} Summary Report`;
    
    // Create HTML content for the email
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(90deg, #4299e1, #63b3ed); padding: 20px; color: white; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">AI Summarizer Report</h1>
          <p style="margin: 5px 0 0;">Service: ${serviceName}</p>
        </div>
        
        <div style="padding: 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
          <h2>Summary</h2>
          <div style="background-color: #f7fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p>${summaryData.summary || 'No summary available'}</p>
          </div>
          
          <h2>Detailed Analysis</h2>
          <div style="background-color: #f7fafc; padding: 15px; border-radius: 8px;">
            <pre style="white-space: pre-wrap; font-family: monospace;">${JSON.stringify(summaryData.details || {}, null, 2)}</pre>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #718096; font-size: 12px;">
            <p>This is an automated report from AI Summarizer. Please do not reply to this email.</p>
          </div>
        </div>
      </div>
    `;
    
    return this.sendEmail({
      to: email,
      subject,
      html
    });
  }
}

// Export a singleton instance
export const emailService = new EmailService(); 