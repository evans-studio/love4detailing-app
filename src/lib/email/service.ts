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
  switch (EMAIL.provider.type) {
    case 'resend':
      return new Resend(process.env.RESEND_API_KEY)
    // Add other providers here when needed
    default:
      throw new Error(`Unsupported email provider: ${EMAIL.provider.type}`)
  }
}

// Email service class
export class EmailService {
  private client: Resend
  
  constructor() {
    this.client = getEmailClient()
  }
  
  /**
   * Send booking confirmation email to customer
   */
  async sendBookingConfirmation(booking: BookingData) {
    try {
      const email = generateBookingConfirmationEmail(booking)
      
      await this.client.emails.send({
        from: `${EMAIL.provider.fromName} <${EMAIL.provider.fromEmail}>`,
        replyTo: EMAIL.provider.replyTo,
        to: booking.email,
        subject: email.subject,
        html: email.html,
        text: email.text,
      })
      
      // Send admin alert if enabled
      if (EMAIL.adminNotifications.enabled) {
        await this.sendAdminAlert(booking)
      }
    } catch (error) {
      console.error('Failed to send booking confirmation email:', error)
      throw error
    }
  }
  
  /**
   * Send booking reminder email to customer
   */
  async sendBookingReminder(booking: BookingData) {
    try {
      const email = generateBookingReminderEmail(booking)
      
      await this.client.emails.send({
        from: `${EMAIL.provider.fromName} <${EMAIL.provider.fromEmail}>`,
        replyTo: EMAIL.provider.replyTo,
        to: booking.email,
        subject: email.subject,
        html: email.html,
        text: email.text,
      })
    } catch (error) {
      console.error('Failed to send booking reminder email:', error)
      throw error
    }
  }
  
  /**
   * Send admin alert email
   */
  private async sendAdminAlert(booking: BookingData) {
    try {
      const email = generateAdminAlertEmail(booking)
      
      await this.client.emails.send({
        from: `${EMAIL.provider.fromName} <${EMAIL.provider.fromEmail}>`,
        replyTo: EMAIL.provider.replyTo,
        to: [...EMAIL.adminNotifications.recipients],
        subject: email.subject,
        html: email.html,
        text: email.text,
      })
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
      
      await this.client.emails.send({
        from: `${EMAIL.provider.fromName} <${EMAIL.provider.fromEmail}>`,
        replyTo: EMAIL.provider.replyTo,
        to: data.email,
        subject: email.subject,
        html: email.html,
        text: email.text,
      })
    } catch (error) {
      console.error('Failed to send loyalty redemption email:', error)
      throw error
    }
  }
}

// Export singleton instance
export const emailService = new EmailService() 