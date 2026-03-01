require('dotenv').config();
const { sendWelcomeEmail } = require('./emailService');

async function testEmail() {
  console.log('Testing email with credentials:');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');
  
  try {
    const result = await sendWelcomeEmail('test@example.com', 'TestUser');
    console.log('Email test result:', result);
  } catch (error) {
    console.error('Email test failed:', error);
  }
}

testEmail();