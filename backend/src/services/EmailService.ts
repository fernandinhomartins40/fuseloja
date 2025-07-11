import nodemailer from 'nodemailer';
import config from '../utils/config';
import logger from '../utils/logger';
import { EmailTemplate } from '../types';

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isProduction: boolean;

  constructor() {
    this.isProduction = config.nodeEnv === 'production';
    this.initializeTransporter();
  }

  private async initializeTransporter(): Promise<void> {
    try {
      if (this.isProduction && config.emailUser && config.emailPassword) {
        // Production email configuration
        this.transporter = nodemailer.createTransport({
          host: config.emailHost,
          port: config.emailPort,
          secure: config.emailPort === 465,
          auth: {
            user: config.emailUser,
            pass: config.emailPassword
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        // Verify connection
        await this.transporter.verify();
        logger.info('Email service connected successfully');
      } else {
        // Development - use ethereal email for testing
        const testAccount = await nodemailer.createTestAccount();
        
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });

        logger.info('Email service initialized with test account', {
          user: testAccount.user,
          password: testAccount.pass
        });
      }
    } catch (error) {
      logger.error('Failed to initialize email service', error);
      // Continue without email service
      this.transporter = null;
    }
  }

  async sendEmail(to: string, subject: string, html: string, text?: string): Promise<boolean> {
    try {
      if (!this.transporter) {
        // Simulate email sending in development/when no transporter
        logger.info('Email simulated (no transporter configured)', {
          to,
          subject,
          html: html.substring(0, 100) + '...'
        });
        return true;
      }

      const mailOptions = {
        from: config.emailFrom,
        to,
        subject,
        html,
        text: text || this.stripHtml(html)
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      if (this.isProduction) {
        logger.info('Email sent successfully', {
          to,
          subject,
          messageId: info.messageId
        });
      } else {
        logger.info('Email sent successfully', {
          to,
          subject,
          messageId: info.messageId,
          previewUrl: nodemailer.getTestMessageUrl(info)
        });
      }

      return true;
    } catch (error) {
      logger.error('Failed to send email', {
        to,
        subject,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<boolean> {
    const template = this.getWelcomeTemplate(firstName);
    return await this.sendEmail(email, template.subject, template.html, template.text);
  }

  async sendVerificationEmail(email: string, token: string): Promise<boolean> {
    const template = this.getVerificationTemplate(token);
    return await this.sendEmail(email, template.subject, template.html, template.text);
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    const template = this.getPasswordResetTemplate(token);
    return await this.sendEmail(email, template.subject, template.html, template.text);
  }

  async sendPasswordChangedEmail(email: string, firstName: string): Promise<boolean> {
    const template = this.getPasswordChangedTemplate(firstName);
    return await this.sendEmail(email, template.subject, template.html, template.text);
  }

  async sendLoginNotificationEmail(email: string, firstName: string, location?: string): Promise<boolean> {
    const template = this.getLoginNotificationTemplate(firstName, location);
    return await this.sendEmail(email, template.subject, template.html, template.text);
  }

  async sendAccountDeactivatedEmail(email: string, firstName: string): Promise<boolean> {
    const template = this.getAccountDeactivatedTemplate(firstName);
    return await this.sendEmail(email, template.subject, template.html, template.text);
  }

  // Email Templates
  private getWelcomeTemplate(firstName: string): EmailTemplate {
    return {
      subject: 'Welcome to Our Platform!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Welcome ${firstName}!</h1>
          <p style="color: #666; font-size: 16px;">
            Thank you for joining our platform. We're excited to have you on board!
          </p>
          <p style="color: #666; font-size: 16px;">
            You can now access all the features of our platform. If you have any questions, 
            feel free to contact our support team.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background-color: #007bff; color: white; padding: 12px 24px; 
                             text-decoration: none; border-radius: 4px; display: inline-block;">
              Get Started
            </a>
          </div>
          <p style="color: #999; font-size: 14px; text-align: center;">
            Best regards,<br>
            The Team
          </p>
        </div>
      `,
      text: `Welcome ${firstName}! Thank you for joining our platform. We're excited to have you on board!`
    };
  }

  private getVerificationTemplate(token: string): EmailTemplate {
    const verificationUrl = `${config.corsOrigins[0]}/verify-email?token=${token}`;
    
    return {
      subject: 'Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Verify Your Email</h1>
          <p style="color: #666; font-size: 16px;">
            Please click the button below to verify your email address and activate your account.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #28a745; color: white; padding: 12px 24px; 
                                              text-decoration: none; border-radius: 4px; display: inline-block;">
              Verify Email
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="color: #666; font-size: 14px; word-break: break-all;">
            ${verificationUrl}
          </p>
          <p style="color: #999; font-size: 14px; text-align: center;">
            This link will expire in 24 hours.
          </p>
        </div>
      `,
      text: `Please verify your email by visiting: ${verificationUrl}`
    };
  }

  private getPasswordResetTemplate(token: string): EmailTemplate {
    const resetUrl = `${config.corsOrigins[0]}/reset-password?token=${token}`;
    
    return {
      subject: 'Reset Your Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Reset Your Password</h1>
          <p style="color: #666; font-size: 16px;">
            You requested to reset your password. Click the button below to set a new password.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #dc3545; color: white; padding: 12px 24px; 
                                        text-decoration: none; border-radius: 4px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            If you didn't request a password reset, you can safely ignore this email.
          </p>
          <p style="color: #666; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="color: #666; font-size: 14px; word-break: break-all;">
            ${resetUrl}
          </p>
          <p style="color: #999; font-size: 14px; text-align: center;">
            This link will expire in 1 hour.
          </p>
        </div>
      `,
      text: `Reset your password by visiting: ${resetUrl}`
    };
  }

  private getPasswordChangedTemplate(firstName: string): EmailTemplate {
    return {
      subject: 'Password Changed Successfully',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Password Changed</h1>
          <p style="color: #666; font-size: 16px;">
            Hi ${firstName},
          </p>
          <p style="color: #666; font-size: 16px;">
            Your password has been successfully changed. If you didn't make this change, 
            please contact our support team immediately.
          </p>
          <p style="color: #666; font-size: 16px;">
            For security reasons, you have been logged out of all devices.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${config.corsOrigins[0]}/login" style="background-color: #007bff; color: white; padding: 12px 24px; 
                                                          text-decoration: none; border-radius: 4px; display: inline-block;">
              Sign In
            </a>
          </div>
          <p style="color: #999; font-size: 14px; text-align: center;">
            Time: ${new Date().toLocaleString()}
          </p>
        </div>
      `,
      text: `Hi ${firstName}, your password has been successfully changed.`
    };
  }

  private getLoginNotificationTemplate(firstName: string, location?: string): EmailTemplate {
    return {
      subject: 'New Login to Your Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">New Login Detected</h1>
          <p style="color: #666; font-size: 16px;">
            Hi ${firstName},
          </p>
          <p style="color: #666; font-size: 16px;">
            We detected a new login to your account.
          </p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; color: #666;">
              <strong>Time:</strong> ${new Date().toLocaleString()}<br>
              ${location ? `<strong>Location:</strong> ${location}<br>` : ''}
            </p>
          </div>
          <p style="color: #666; font-size: 16px;">
            If this was you, you can safely ignore this email. If you don't recognize this activity, 
            please secure your account immediately.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${config.corsOrigins[0]}/account/security" style="background-color: #dc3545; color: white; padding: 12px 24px; 
                                                                     text-decoration: none; border-radius: 4px; display: inline-block;">
              Secure Account
            </a>
          </div>
        </div>
      `,
      text: `Hi ${firstName}, we detected a new login to your account at ${new Date().toLocaleString()}.`
    };
  }

  private getAccountDeactivatedTemplate(firstName: string): EmailTemplate {
    return {
      subject: 'Account Deactivated',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Account Deactivated</h1>
          <p style="color: #666; font-size: 16px;">
            Hi ${firstName},
          </p>
          <p style="color: #666; font-size: 16px;">
            Your account has been deactivated. If you believe this was done in error, 
            please contact our support team.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:support@example.com" style="background-color: #6c757d; color: white; padding: 12px 24px; 
                                                        text-decoration: none; border-radius: 4px; display: inline-block;">
              Contact Support
            </a>
          </div>
          <p style="color: #999; font-size: 14px; text-align: center;">
            Thank you for using our platform.
          </p>
        </div>
      `,
      text: `Hi ${firstName}, your account has been deactivated. Contact support if you believe this was an error.`
    };
  }

  // Utility method to strip HTML tags
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
  }

  // Method to test email configuration
  async testEmailConfiguration(): Promise<boolean> {
    try {
      if (!this.transporter) {
        logger.warn('No email transporter configured');
        return false;
      }

      await this.transporter.verify();
      logger.info('Email configuration test successful');
      return true;
    } catch (error) {
      logger.error('Email configuration test failed', error);
      return false;
    }
  }

  // Bulk email sending
  async sendBulkEmails(emails: Array<{ to: string; subject: string; html: string; text?: string }>): Promise<number> {
    let successCount = 0;
    
    for (const email of emails) {
      const success = await this.sendEmail(email.to, email.subject, email.html, email.text);
      if (success) successCount++;
      
      // Add delay to prevent overwhelming the email server
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    logger.info(`Bulk email sending completed`, {
      total: emails.length,
      successful: successCount,
      failed: emails.length - successCount
    });

    return successCount;
  }
}

export default EmailService; 