const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000
});

async function sendWelcomeEmail(userEmail, username) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: '🌞 Welcome to Solar Recycle Platform',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2d9c5e;">Welcome ${username}!</h2>
        <p>Thank you for joining Solar Recycle Platform.</p>
        <p>Start tracking your solar panels and get automated expiry alerts.</p>
      </div>
    `
  };

  try {
    console.log('Attempting to send welcome email to:', userEmail);
    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', result.messageId);
    return { success: true };
  } catch (error) {
    console.error('Welcome email error:', error.message);
    return { success: true };
  }
}

async function sendExpiryAlert(userEmail, username, panelData) {
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
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
        <p>Please consider ${isExpired ? 'recycling or replacing' : 'planning for replacement of'} this panel.</p>
        <a href="${process.env.APP_URL || 'http://localhost:3000'}/dashboard" style="display: inline-block; background: #4a7c2c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Dashboard</a>
      </div>
    `
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log(`Expiry alert sent to ${userEmail} for panel ${panelData.brand}`);
    return { success: true };
  } catch (error) {
    console.error('Expiry alert email error:', error.message);
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
    const result = await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email error:', error.message);
    return { success: true };
  }
}

module.exports = { sendExpiryAlert, sendWelcomeEmail, sendBatchExpiryAlert };
