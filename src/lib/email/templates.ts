import { BRAND, EMAIL } from '@/lib/constants'
import type { BookingData } from '@/lib/schemas'
import { formatDate, formatCurrency } from '@/lib/utils'

// Shared components
const emailHeader = (title: string, subtitle: string) => `
  <div style="background: linear-gradient(to right, ${BRAND.colors.purple[500]}, ${BRAND.colors.purple[700]}); padding: 32px 0; text-align: center;">
    <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo.png" alt="Love4Detailing" style="height: 40px; margin-bottom: 16px;">
    <h1 style="color: white; font-size: 24px; margin: 0 0 8px 0;">${title}</h1>
    <p style="color: ${BRAND.colors.offWhite}; font-size: 16px; margin: 0;">${subtitle}</p>
  </div>
`

const emailFooter = () => `
  <div style="background: ${BRAND.colors.black}; color: ${BRAND.colors.offWhite}; padding: 32px; text-align: center; font-size: 14px;">
    <p style="margin: 0 0 16px 0;">${EMAIL.footer.address}</p>
    <div style="margin-bottom: 16px;">
      <a href="tel:${EMAIL.footer.contact.phone}" style="color: ${BRAND.colors.offWhite}; text-decoration: none; margin: 0 8px;">
        ${EMAIL.footer.contact.phone}
      </a>
      <span>|</span>
      <a href="mailto:${EMAIL.footer.contact.email}" style="color: ${BRAND.colors.offWhite}; text-decoration: none; margin: 0 8px;">
        ${EMAIL.footer.contact.email}
      </a>
    </div>
    <div style="margin-bottom: 16px;">
      <a href="${EMAIL.footer.legal.privacyUrl}" style="color: ${BRAND.colors.offWhite}; text-decoration: none; margin: 0 8px;">
        Privacy Policy
      </a>
      <span>|</span>
      <a href="${EMAIL.footer.legal.termsUrl}" style="color: ${BRAND.colors.offWhite}; text-decoration: none; margin: 0 8px;">
        Terms & Conditions
      </a>
      <span>|</span>
      <a href="${EMAIL.footer.legal.unsubscribeUrl}" style="color: ${BRAND.colors.offWhite}; text-decoration: none; margin: 0 8px;">
        Unsubscribe
      </a>
    </div>
    <div style="font-size: 12px; color: ${BRAND.colors.textMuted};">
      © ${new Date().getFullYear()} Love4Detailing. All rights reserved.
    </div>
  </div>
`

// Booking confirmation email
export const generateBookingConfirmationEmail = (booking: BookingData) => {
  const template = EMAIL.templates.bookingConfirmation
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${template.subject}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; line-height: 1.5;">
        ${emailHeader(template.heading, template.subheading)}
        
        <div style="max-width: 600px; margin: 0 auto; padding: 32px 16px;">
          <p style="margin-bottom: 24px;">
            Hi ${booking.customerName},
          </p>
          
          <p style="margin-bottom: 24px;">
            Your car detailing service has been confirmed. Here are your booking details:
          </p>
          
          <div style="background: ${BRAND.colors.offWhite}; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
            <h2 style="margin: 0 0 16px 0; color: ${BRAND.colors.black}; font-size: 18px;">
              Booking Summary
            </h2>
            
            <div style="margin-bottom: 16px;">
              <p style="margin: 0 0 4px 0; color: ${BRAND.colors.textMuted};">Service</p>
              <p style="margin: 0; font-weight: 600;">${booking.serviceName}</p>
            </div>
            
            <div style="margin-bottom: 16px;">
              <p style="margin: 0 0 4px 0; color: ${BRAND.colors.textMuted};">Date & Time</p>
              <p style="margin: 0; font-weight: 600;">
                ${formatDate(new Date(booking.date))} at ${booking.timeSlot}
              </p>
            </div>
            
            <div style="margin-bottom: 16px;">
              <p style="margin: 0 0 4px 0; color: ${BRAND.colors.textMuted};">Vehicle</p>
              <p style="margin: 0; font-weight: 600;">${booking.vehicleInfo}</p>
            </div>
            
            <div style="margin-bottom: 16px;">
              <p style="margin: 0 0 4px 0; color: ${BRAND.colors.textMuted};">Location</p>
              <p style="margin: 0; font-weight: 600;">${booking.address}, ${booking.postcode}</p>
            </div>
            
            <div style="margin-bottom: 16px;">
              <p style="margin: 0 0 4px 0; color: ${BRAND.colors.textMuted};">Payment Method</p>
              <p style="margin: 0; font-weight: 600;">Cash Payment (Due on Service Day)</p>
            </div>
            
            <div>
              <p style="margin: 0 0 4px 0; color: ${BRAND.colors.textMuted};">Total Amount</p>
              <p style="margin: 0; font-weight: 600; color: ${BRAND.colors.primary};">
                ${formatCurrency(booking.totalAmount)}
              </p>
            </div>
          </div>
          
          <p style="margin-bottom: 24px;">
            Please ensure someone is available at the service address during the scheduled time.
            Our team will arrive within a 30-minute window of your booking time.
          </p>
          
          <p style="margin-bottom: 24px;">
            If you need to make any changes to your booking or have any questions,
            please don't hesitate to contact us.
          </p>
          
          <p style="margin-bottom: 32px;">
            Thank you for choosing Love4Detailing!
          </p>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/bookings/${booking.id}"
               style="display: inline-block; background: ${BRAND.colors.primary}; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600;">
              View Booking Details
            </a>
          </div>
        </div>
        
        ${emailFooter()}
      </body>
    </html>
  `
  
  const text = `
Hi ${booking.customerName},

Your car detailing service has been confirmed. Here are your booking details:

Service: ${booking.serviceName}
Date & Time: ${formatDate(new Date(booking.date))} at ${booking.timeSlot}
Vehicle: ${booking.vehicleInfo}
Location: ${booking.address}, ${booking.postcode}
Payment Method: Cash Payment (Due on Service Day)
Total Amount: ${formatCurrency(booking.totalAmount)}

Please ensure someone is available at the service address during the scheduled time.
Our team will arrive within a 30-minute window of your booking time.

If you need to make any changes to your booking or have any questions,
please don't hesitate to contact us.

Thank you for choosing Love4Detailing!

View your booking at: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/bookings/${booking.id}

--
${EMAIL.footer.address}
${EMAIL.footer.contact.phone} | ${EMAIL.footer.contact.email}
  `
  
  return {
    subject: template.subject,
    html,
    text,
  }
}

// Booking reminder email
export const generateBookingReminderEmail = (booking: BookingData) => {
  const template = EMAIL.templates.bookingReminder
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${template.subject}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; line-height: 1.5;">
        ${emailHeader(template.heading, template.subheading)}
        
        <div style="max-width: 600px; margin: 0 auto; padding: 32px 16px;">
          <p style="margin-bottom: 24px;">
            Hi ${booking.customerName},
          </p>
          
          <p style="margin-bottom: 24px;">
            This is a friendly reminder that your car detailing service is scheduled for tomorrow.
            Here are your booking details:
          </p>
          
          <div style="background: ${BRAND.colors.offWhite}; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
            <div style="margin-bottom: 16px;">
              <p style="margin: 0 0 4px 0; color: ${BRAND.colors.textMuted};">Service</p>
              <p style="margin: 0; font-weight: 600;">${booking.serviceName}</p>
            </div>
            
            <div style="margin-bottom: 16px;">
              <p style="margin: 0 0 4px 0; color: ${BRAND.colors.textMuted};">Date & Time</p>
              <p style="margin: 0; font-weight: 600;">
                ${formatDate(new Date(booking.date))} at ${booking.timeSlot}
              </p>
            </div>
            
            <div style="margin-bottom: 16px;">
              <p style="margin: 0 0 4px 0; color: ${BRAND.colors.textMuted};">Location</p>
              <p style="margin: 0; font-weight: 600;">${booking.address}, ${booking.postcode}</p>
            </div>
            
            <div>
              <p style="margin: 0 0 4px 0; color: ${BRAND.colors.textMuted};">Payment</p>
              <p style="margin: 0; font-weight: 600;">
                Cash Payment of ${formatCurrency(booking.totalAmount)} due tomorrow
              </p>
            </div>
          </div>
          
          <div style="background: ${BRAND.colors.purple[50]}; border: 1px solid ${BRAND.colors.purple[200]}; border-radius: 8px; padding: 16px; margin-bottom: 32px;">
            <h3 style="margin: 0 0 8px 0; color: ${BRAND.colors.primary}; font-size: 16px;">
              Important Reminders
            </h3>
            <ul style="margin: 0; padding-left: 20px; color: ${BRAND.colors.black};">
              <li style="margin-bottom: 4px;">Please ensure your vehicle is accessible</li>
              <li style="margin-bottom: 4px;">Have the cash payment ready</li>
              <li style="margin-bottom: 4px;">Our team will arrive within a 30-minute window</li>
              <li>Remove any valuables from the vehicle</li>
            </ul>
          </div>
          
          <p style="margin-bottom: 24px;">
            If you need to make any last-minute changes or have questions,
            please contact us immediately.
          </p>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/bookings/${booking.id}"
               style="display: inline-block; background: ${BRAND.colors.primary}; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600;">
              View Booking Details
            </a>
          </div>
        </div>
        
        ${emailFooter()}
      </body>
    </html>
  `
  
  const text = `
Hi ${booking.customerName},

This is a friendly reminder that your car detailing service is scheduled for tomorrow.
Here are your booking details:

Service: ${booking.serviceName}
Date & Time: ${formatDate(new Date(booking.date))} at ${booking.timeSlot}
Location: ${booking.address}, ${booking.postcode}
Payment: Cash Payment of ${formatCurrency(booking.totalAmount)} due tomorrow

Important Reminders:
- Please ensure your vehicle is accessible
- Have the cash payment ready
- Our team will arrive within a 30-minute window
- Remove any valuables from the vehicle

If you need to make any last-minute changes or have questions,
please contact us immediately.

View your booking at: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/bookings/${booking.id}

--
${EMAIL.footer.address}
${EMAIL.footer.contact.phone} | ${EMAIL.footer.contact.email}
  `
  
  return {
    subject: template.subject,
    html,
    text,
  }
}

// Admin alert email
export const generateAdminAlertEmail = (booking: BookingData) => {
  const template = EMAIL.templates.adminAlert
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${template.subject}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; line-height: 1.5;">
        ${emailHeader(template.heading, template.subheading)}
        
        <div style="max-width: 600px; margin: 0 auto; padding: 32px 16px;">
          <div style="background: ${BRAND.colors.offWhite}; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
            <h2 style="margin: 0 0 16px 0; color: ${BRAND.colors.black}; font-size: 18px;">
              New Booking Details
            </h2>
            
            <div style="margin-bottom: 16px;">
              <p style="margin: 0 0 4px 0; color: ${BRAND.colors.textMuted};">Customer</p>
              <p style="margin: 0; font-weight: 600;">
                ${booking.customerName}<br>
                ${booking.email}<br>
                ${booking.phone}
              </p>
            </div>
            
            <div style="margin-bottom: 16px;">
              <p style="margin: 0 0 4px 0; color: ${BRAND.colors.textMuted};">Service</p>
              <p style="margin: 0; font-weight: 600;">${booking.serviceName}</p>
            </div>
            
            <div style="margin-bottom: 16px;">
              <p style="margin: 0 0 4px 0; color: ${BRAND.colors.textMuted};">Date & Time</p>
              <p style="margin: 0; font-weight: 600;">
                ${formatDate(new Date(booking.date))} at ${booking.timeSlot}
              </p>
            </div>
            
            <div style="margin-bottom: 16px;">
              <p style="margin: 0 0 4px 0; color: ${BRAND.colors.textMuted};">Vehicle</p>
              <p style="margin: 0; font-weight: 600;">${booking.vehicleInfo}</p>
            </div>
            
            <div style="margin-bottom: 16px;">
              <p style="margin: 0 0 4px 0; color: ${BRAND.colors.textMuted};">Location</p>
              <p style="margin: 0; font-weight: 600;">${booking.address}, ${booking.postcode}</p>
            </div>
            
            <div>
              <p style="margin: 0 0 4px 0; color: ${BRAND.colors.textMuted};">Payment</p>
              <p style="margin: 0; font-weight: 600;">
                Cash Payment of ${formatCurrency(booking.totalAmount)}
              </p>
            </div>
          </div>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/bookings/${booking.id}"
               style="display: inline-block; background: ${BRAND.colors.primary}; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600;">
              View in Admin Dashboard
            </a>
          </div>
        </div>
        
        ${emailFooter()}
      </body>
    </html>
  `
  
  const text = `
New Booking Alert

Customer:
${booking.customerName}
${booking.email}
${booking.phone}

Service: ${booking.serviceName}
Date & Time: ${formatDate(new Date(booking.date))} at ${booking.timeSlot}
Vehicle: ${booking.vehicleInfo}
Location: ${booking.address}, ${booking.postcode}
Payment: Cash Payment of ${formatCurrency(booking.totalAmount)}

View in admin dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/admin/bookings/${booking.id}

--
${EMAIL.footer.address}
${EMAIL.footer.contact.phone} | ${EMAIL.footer.contact.email}
  `
  
  return {
    subject: template.subject,
    html,
    text,
  }
}

// Loyalty redemption email
export const generateLoyaltyRedemptionEmail = (data: { 
  customerName: string
  pointsRedeemed: number
  rewardAmount: number
  remainingPoints: number
  bookingId?: string
}) => {
  const template = EMAIL.templates.loyaltyRedemption
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${template.subject}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; line-height: 1.5;">
        ${emailHeader(template.heading, template.subheading)}
        
        <div style="max-width: 600px; margin: 0 auto; padding: 32px 16px;">
          <p style="margin-bottom: 24px;">
            Hi ${data.customerName},
          </p>
          
          <p style="margin-bottom: 24px;">
            You have successfully redeemed ${data.pointsRedeemed} reward points for a 
            ${formatCurrency(data.rewardAmount)} discount on your booking.
          </p>
          
          <div style="background: ${BRAND.colors.offWhite}; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
            <h2 style="margin: 0 0 16px 0; color: ${BRAND.colors.black}; font-size: 18px;">
              Reward Summary
            </h2>
            
            <div style="margin-bottom: 16px;">
              <p style="margin: 0 0 4px 0; color: ${BRAND.colors.textMuted};">Points Redeemed</p>
              <p style="margin: 0; font-weight: 600;">${data.pointsRedeemed} points</p>
            </div>
            
            <div style="margin-bottom: 16px;">
              <p style="margin: 0 0 4px 0; color: ${BRAND.colors.textMuted};">Discount Amount</p>
              <p style="margin: 0; font-weight: 600; color: ${BRAND.colors.success};">
                ${formatCurrency(data.rewardAmount)}
              </p>
            </div>
            
            <div>
              <p style="margin: 0 0 4px 0; color: ${BRAND.colors.textMuted};">Remaining Points</p>
              <p style="margin: 0; font-weight: 600;">${data.remainingPoints} points</p>
            </div>
          </div>
          
          <p style="margin-bottom: 24px;">
            Thank you for being a loyal customer. Keep earning points with every booking!
          </p>
          
          ${data.bookingId ? `
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/bookings/${data.bookingId}"
                 style="display: inline-block; background: ${BRAND.colors.primary}; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600;">
                View Booking Details
              </a>
            </div>
          ` : ''}
        </div>
        
        ${emailFooter()}
      </body>
    </html>
  `
  
  const text = `
Hi ${data.customerName},

You have successfully redeemed ${data.pointsRedeemed} reward points for a ${formatCurrency(data.rewardAmount)} discount on your booking.

Reward Summary:
- Points Redeemed: ${data.pointsRedeemed} points
- Discount Amount: ${formatCurrency(data.rewardAmount)}
- Remaining Points: ${data.remainingPoints} points

Thank you for being a loyal customer. Keep earning points with every booking!

${data.bookingId ? `View your booking at: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/bookings/${data.bookingId}` : ''}

--
${EMAIL.footer.address}
${EMAIL.footer.contact.phone} | ${EMAIL.footer.contact.email}
  `
  
  return {
    subject: template.subject,
    html,
    text,
  }
} 