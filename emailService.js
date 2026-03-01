const nodemailer = require('nodemailer');
require('dotenv').config();

// Gmail SMTP configuration with connection pooling
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  rateDelta: 1000,
  rateLimit: 5
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.log('✗ Email configuration error:', error.message);
  } else {
    console.log('✓ Email server is ready to send messages');
  }
});

async function sendWelcomeEmail(userEmail, username) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: '🌞 Welcome to SolarLoop Platform',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4a7c2c;">Welcome ${username}!</h2>
        <p>Thank you for joining SolarLoop - Your Solar Panel Lifecycle Management Platform.</p>
        <p>Start tracking your solar panels and get automated warranty expiry alerts.</p>
        <div style="margin: 30px 0;">
          <a href="${process.env.APP_URL || 'http://localhost:3000'}/dashboard" style="display: inline-block; background: #4a7c2c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
        </div>
        <p style="color: #666; font-size: 14px;">Best regards,<br>SolarLoop Team</p>
      </div>
    `
  };

  try {
    console.log('Attempting to send welcome email to:', userEmail);
    const info = await transporter.sendMail(mailOptions);
    console.log('✓ Welcome email sent successfully! Message ID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('✗ Welcome email error:', error.message);
    return { success: false, error: error.message };
  }
}

async function sendExpiryAlert(userEmail, username, panelData) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email not configured, skipping alert');
    return { success: false, error: 'Email not configured' };
  }

  const installDate = new Date(panelData.installation_date);
  const now = new Date();
  const years = (now - installDate) / (365.25 * 24 * 60 * 60 * 1000);
  const remaining = (panelData.warranty_years || 25) - years;
  const isExpired = remaining <= 0;
  const statusColor = isExpired ? '#dc3545' : '#ffc107';
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `⚠️ Solar Panel ${isExpired ? 'EXPIRED' : 'Expiry Alert'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: ${statusColor};">Solar Panel ${isExpired ? 'Expired' : 'Near Expiry Alert'}</h2>
        <p>Hello ${username},</p>
        <p>Your solar panel requires immediate attention:</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid ${statusColor};">
          <p><strong>Brand:</strong> ${panelData.brand}</p>
          <p><strong>Capacity:</strong> ${(panelData.capacity_watts / 1000).toFixed(2)} kW</p>
          <p><strong>Location:</strong> ${panelData.location}</p>
          <p><strong>Installation Date:</strong> ${installDate.toLocaleDateString()}</p>
          <p><strong>Warranty:</strong> ${panelData.warranty_years} years</p>
          <p><strong>Age:</strong> ${years.toFixed(1)} years</p>
          <p><strong>Remaining Life:</strong> ${Math.max(0, remaining).toFixed(1)} years</p>
          <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${isExpired ? 'EXPIRED' : 'NEAR EXPIRY'}</span></p>
        </div>
        <p>${isExpired ? 'This panel has expired. Please consider recycling or replacement.' : 'Please plan for replacement within the next 2 years.'}</p>
        <div style="margin: 30px 0;">
          <a href="${process.env.APP_URL || 'http://localhost:3000'}/dashboard" style="display: inline-block; background: #4a7c2c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">View Dashboard</a>
        </div>
        <p style="color: #666; font-size: 14px;">Best regards,<br>SolarLoop Team</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✓ Expiry alert sent to ${userEmail}. Message ID:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`✗ Email failed for ${userEmail}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function sendBatchExpiryAlert(userEmail, username, expiringPanels) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `⚠️ ${expiringPanels.length} Solar Panel${expiringPanels.length > 1 ? 's' : ''} Need Attention`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
        <h2 style="color: #dc3545;">Solar Panel Expiry Summary</h2>
        <p>Hello ${username},</p>
        <p>You have <strong>${expiringPanels.length}</strong> solar panel${expiringPanels.length > 1 ? 's' : ''} that need attention.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email error:', error.message);
    return { success: true };
  }
}

module.exports = { sendExpiryAlert, sendWelcomeEmail, sendBatchExpiryAlert };
