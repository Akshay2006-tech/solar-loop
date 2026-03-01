const cron = require('node-cron');
const User = require('./models/UserMongo');
const SolarPanel = require('./models/SolarPanelMongo');
const { sendExpiryAlert } = require('./emailService');

// Run daily at 9:00 AM
const scheduleExpiryAlerts = () => {
  cron.schedule('0 9 * * *', async () => {
    console.log('Running daily expiry check...');
    
    try {
      const panels = await SolarPanel.find();
      const now = new Date();
      let alertsSent = 0;
      
      for (const panel of panels) {
        const years = (now - new Date(panel.installation_date)) / (365.25 * 24 * 60 * 60 * 1000);
        const remaining = (panel.warranty_years || 25) - years;
        
        // Send alert if expired or near expiry (< 2 years)
        if (remaining <= 2) {
          const user = await User.findById(panel.userId);
          
          if (user && user.email) {
            const result = await sendExpiryAlert(user.email, user.username, panel);
            if (result.success) {
              alertsSent++;
            }
          }
        }
      }
      
      console.log(`Expiry check complete. Alerts sent: ${alertsSent}`);
    } catch (error) {
      console.error('Error in expiry check:', error);
    }
  });
  
  console.log('Expiry alert scheduler started (runs daily at 9:00 AM)');
};

module.exports = { scheduleExpiryAlerts };
