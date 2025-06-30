import { createTransport } from 'nodemailer'
import { compile } from 'handlebars'
import { readFileSync } from 'fs'
import { join } from 'path'
import { EmailServiceImpl, BookingConfirmationData, PaymentConfirmationData } from './types'

// Initialize email transport
const transport = createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Load email templates
const templateDir = join(process.cwd(), 'src/lib/email/templates')
const bookingConfirmationTemplate = compile(
  readFileSync(join(templateDir, 'booking-confirmation.hbs'), 'utf-8')
)
const paymentConfirmationTemplate = compile(
  readFileSync(join(templateDir, 'payment-confirmation.hbs'), 'utf-8')
)

export const emailService: EmailServiceImpl = {
  async sendBookingConfirmation(data: BookingConfirmationData) {
    const html = bookingConfirmationTemplate(data)
    
    await transport.sendMail({
      from: process.env.EMAIL_FROM,
      to: data.email,
      subject: `Booking Confirmation - ${data.booking_reference}`,
      html
    })
  },

  async sendPaymentConfirmation(data: PaymentConfirmationData) {
    const html = paymentConfirmationTemplate(data)
    
    await transport.sendMail({
      from: process.env.EMAIL_FROM,
      to: data.email,
      subject: `Payment Confirmation - ${data.booking_reference}`,
      html
    })
  }
} 