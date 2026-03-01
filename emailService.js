const { Resend } = require('resend');
require('dotenv').config();

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

if (resend) {
  console.log('✓ Resend email configured');
} else {
  console.log('⚠️  Email not configured');
}

async function sendWelcomeEmail(userEmail, username) {
  if (!resend) return { success: false };

  try {
    await resend.emails.send({
      from: 'SolarLoop <onboarding@resend.dev>',
      to: userEmail,
      subject: '🌞 Welcome to SolarLoop Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4a7c2c;">Welcome ${username}!</h2>
          <p>Thank you for joining SolarLoop - Your Solar Panel Lifecycle Management Platform.</p>
          <p>Start tracking your solar panels and get automated warranty expiry alerts.</p>
          <a href="${process.env.APP_URL || 'http://localhost:3000'}/dashboard" style="display: inline-block; background: #4a7c2c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Go to Dashboard</a>
        </div>
      `
    });
    console.log('✓ Welcome email sent to', userEmail);
    return { success: true };
  } catch (error) {
    console.log('✗ Email error:', error.message);
    return { success: false };
  }
}

async function sendExpiryAlert(userEmail, username, panelData) {
  if (!resend) return { success: false };

  const installDate = new Date(panelData.installation_date);
  const now = new Date();
  const years = (now - installDate) / (365.25 * 24 * 60 * 60 * 1000);
  const remaining = (panelData.warranty_years || 25) - years;
  const isExpired = remaining <= 0;
  const statusColor = isExpired ? '#dc3545' : '#ffc107';

  try {
    await resend.emails.send({
      from: 'SolarLoop <alerts@resend.dev>',
      to: userEmail,
      subject: `⚠️ Solar Panel ${isExpired ? 'EXPIRED' : 'Expiry Alert'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: ${statusColor};">Solar Panel ${isExpired ? 'Expired' : 'Near Expiry'} Alert</h2>
          <p>Hello ${username},</p>
          <p>Your solar panel requires attention:</p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p><strong>Brand:</strong> ${panelData.brand}</p>
            <p><strong>Capacity:</strong> ${(panelData.capacity_watts / 1000).toFixed(2)} kW</p>
            <p><strong>Location:</strong> ${panelData.location}</p>
            <p><strong>Remaining warranty:</strong> ${Math.max(0, remaining).toFixed(1)} years</p>
          </div>
          <a href="${process.env.APP_URL || 'http://localhost:3000'}/dashboard" style="display: inline-block; background: #4a7c2c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">View Dashboard</a>
        </div>
      `
    });
    console.log(`✓ Alert sent to ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.log('✗ Email error:', error.message);
    return { success: false };
  }
}

async function sendBatchExpiryAlert(userEmail, username, expiringPanels) {
  if (!resend) return { success: false };

  try {
    await resend.emails.send({
      from: 'SolarLoop <alerts@resend.dev>',
      to: userEmail,
      subject: `⚠️ ${expiringPanels.length} Solar Panel${expiringPanels.length > 1 ? 's' : ''} Need Attention`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
          <h2 style="color: #dc3545;">Solar Panel Expiry Summary</h2>
          <p>Hello ${username},</p>
          <p>You have <strong>${expiringPanels.length}</strong> solar panel${expiringPanels.length > 1 ? 's' : ''} that need attention.</p>
        </div>
      `
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

module.exports = { sendExpiryAlert, sendWelcomeEmail, sendBatchExpiryAlert };
