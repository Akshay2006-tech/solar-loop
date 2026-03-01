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

async function sendExpiryAlert(userEmail, panelData) {
  const daysLeft = Math.ceil((panelData.expiryDate() - new Date()) / (24 * 60 * 60 * 1000));
  const isExpired = daysLeft < 0;
  const statusColor = isExpired ? '#dc3545' : '#ffc107';
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `⚠️ Solar Panel ${isExpired ? 'EXPIRED' : 'Expiry Alert'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${statusColor};">Solar Panel ${isExpired ? 'Expired' : 'Expiry Alert'}</h2>
        <p>Your solar panel requires immediate attention:</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid ${statusColor};">
          <p><strong>Brand:</strong> ${panelData.brand}</p>
          <p><strong>Capacity:</strong> ${panelData.capacity_kw} kW</p>
          <p><strong>Location:</strong> ${panelData.location}</p>
          <p><strong>Installation Date:</strong> ${new Date(panelData.installation_date).toLocaleDateString()}</p>
          <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${isExpired ? 'EXPIRED' : 'NEAR EXPIRY'}</span></p>
        </div>
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
