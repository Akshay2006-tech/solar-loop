const mongoose = require('mongoose');
const User = require('./models/UserMongo');
require('dotenv').config();

async function setAdminUser(username) {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/solar-recycle');
    console.log('Connected to MongoDB');
    
    const user = await User.findOne({ username });
    
    if (!user) {
      console.log(`User "${username}" not found`);
      process.exit(1);
    }
    
    user.isAdmin = true;
    await user.save();
    
    console.log(`✓ User "${username}" is now an admin`);
    console.log('Next time they login, they will be redirected to admin dashboard');
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

async function removeAdminUser(username) {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/solar-recycle');
    console.log('Connected to MongoDB');
    
    const user = await User.findOne({ username });
    
    if (!user) {
      console.log(`User "${username}" not found`);
      process.exit(1);
    }
    
    user.isAdmin = false;
    await user.save();
    
    console.log(`✓ Admin privileges removed from user "${username}"`);
    console.log('Next time they login, they will be redirected to normal user dashboard');
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

// Get command line arguments
const command = process.argv[2];
const username = process.argv[3];

if (!command || !username) {
  console.log('Usage:');
  console.log('  node manage-admin.js set <username>    - Set user as admin');
  console.log('  node manage-admin.js remove <username> - Remove admin privileges');
  process.exit(1);
}

if (command === 'set') {
  setAdminUser(username);
} else if (command === 'remove') {
  removeAdminUser(username);
} else {
  console.log('Invalid command. Use "set" or "remove"');
  process.exit(1);
}
