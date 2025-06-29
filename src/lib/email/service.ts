import { Resend } from 'resend'
import { EMAIL } from '@/lib/constants'
import type { BookingData } from '@/lib/schemas'
import {
  generateBookingConfirmationEmail,
  generateBookingReminderEmail,
  generateAdminAlertEmail,
  generateLoyaltyRedemptionEmail,
} from './templates'

// Initialize email client based on provider
const getEmailClient = () => {
  const apiKey = process.env.RESEND_API_KEY
  
  if (!apiKey) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ RESEND_API_KEY not found. Email service will run in mock mode.')
      return null
    }
    throw new Error('Missing RESEND_API_KEY. Please add it to your environment variables.')
  }

  switch (EMAIL.provider.type) {
    case 'resend':
      return new Resend(apiKey)
    // Add other providers here when needed
    default:
      throw new Error(`Unsupported email provider: ${EMAIL.provider.type}`)
  }
}

// Email service class
export class EmailService {
  private client: Resend | null
  private isMockMode: boolean
  
  constructor() {
    this.client = getEmailClient()
    this.isMockMode = !this.client
  }

  private async mockEmailSend(emailData: any) {
    console.log('📧 [MOCK EMAIL] Would send email:', {
      to: emailData.to,
      subject: emailData.subject,
      from: emailData.from,
    })
    return { id: 'mock-email-id' }
  }
  
  /**
   * Send booking confirmation email to customer
   */
  async sendBookingConfirmation(booking: BookingData) {
    try {
      const email = generateBookingConfirmationEmail(booking)
      
      const emailData = {
        from: `${EMAIL.provider.fromName} <${EMAIL.provider.fromEmail}>`,
        replyTo: EMAIL.provider.replyTo,
        to: booking.email,
        subject: email.subject,
        html: email.html,
        text: email.text,
      }

      if (this.isMockMode) {
        await this.mockEmailSend(emailData)
      } else {
        await this.client!.emails.send(emailData)
      }
      
      // Send admin alert if enabled
      if (EMAIL.adminNotifications.enabled) {
        await this.sendAdminAlert(booking)
      }
    } catch (error) {
      console.error('Failed to send booking confirmation email:', error)
      if (!this.isMockMode) {
        throw error
      }
    }
  }
  
  /**
   * Send booking reminder email to customer
   */
  async sendBookingReminder(booking: BookingData) {
    try {
      const email = generateBookingReminderEmail(booking)
      
      const emailData = {
        from: `${EMAIL.provider.fromName} <${EMAIL.provider.fromEmail}>`,
        replyTo: EMAIL.provider.replyTo,
        to: booking.email,
        subject: email.subject,
        html: email.html,
        text: email.text,
      }

      if (this.isMockMode) {
        await this.mockEmailSend(emailData)
      } else {
        await this.client!.emails.send(emailData)
      }
    } catch (error) {
      console.error('Failed to send booking reminder email:', error)
      if (!this.isMockMode) {
        throw error
      }
    }
  }
  
  /**
   * Send admin alert email
   */
  private async sendAdminAlert(booking: BookingData) {
    try {
      const email = generateAdminAlertEmail(booking)
      
      const emailData = {
        from: `${EMAIL.provider.fromName} <${EMAIL.provider.fromEmail}>`,
        replyTo: EMAIL.provider.replyTo,
        to: [...EMAIL.adminNotifications.recipients],
        subject: email.subject,
        html: email.html,
        text: email.text,
      }

      if (this.isMockMode) {
        await this.mockEmailSend(emailData)
      } else {
        await this.client!.emails.send(emailData)
      }
    } catch (error) {
      console.error('Failed to send admin alert email:', error)
      // Don't throw error for admin alerts
    }
  }

  /**
   * Send loyalty points redemption confirmation email
   */
  async sendLoyaltyRedemption(data: {
    customerName: string
    email: string
    pointsRedeemed: number
    rewardAmount: number
    remainingPoints: number
    bookingId?: string
  }) {
    try {
      const email = generateLoyaltyRedemptionEmail(data)
      
      const emailData = {
        from: `${EMAIL.provider.fromName} <${EMAIL.provider.fromEmail}>`,
        replyTo: EMAIL.provider.replyTo,
        to: data.email,
        subject: email.subject,
        html: email.html,
        text: email.text,
      }

      if (this.isMockMode) {
        await this.mockEmailSend(emailData)
      } else {
        await this.client!.emails.send(emailData)
      }
    } catch (error) {
      console.error('Failed to send loyalty redemption email:', error)
      if (!this.isMockMode) {
        throw error
      }
    }
  }
}

// Export singleton instance
export const emailService = new EmailService() 