const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('Connection URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/solar-recycle');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/solar-recycle');
    
    console.log('✓ MongoDB connected successfully!');
    console.log('✓ Database:', mongoose.connection.name);
    console.log('✓ Host:', mongoose.connection.host);
    
    // Test collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nExisting collections:');
    if (collections.length === 0) {
      console.log('  (No collections yet - will be created when you add data)');
    } else {
      collections.forEach(col => {
        console.log(`  - ${col.name}`);
      });
    }
    
    await mongoose.connection.close();
    console.log('\n✓ Connection test completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('\n✗ MongoDB connection failed!');
    console.error('Error:', err.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure MongoDB is running (if using local)');
    console.log('2. Check your MONGODB_URI in .env file');
    console.log('3. For MongoDB Atlas, verify:');
    console.log('   - Network access allows your IP');
    console.log('   - Database user credentials are correct');
    console.log('   - Connection string format is correct');
    process.exit(1);
  }
}

testConnection();
