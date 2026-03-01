const mongoose = require('mongoose');
const Recycler = require('./models/RecyclerMongo');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/solar-recycle';

const recyclers = [
  { name: 'GreenTech Recycling', contact_number: '555-0101', email: 'info@greentech.com', location: 'New York', service_type: 'recycling', verified: true },
  { name: 'EcoSolar Solutions', contact_number: '555-0102', email: 'contact@ecosolar.com', location: 'California', service_type: 'recycling', verified: true },
  { name: 'Solar Waste Management', contact_number: '555-0103', email: 'help@solarwaste.com', location: 'Texas', service_type: 'recycling', verified: true },
  { name: 'Panel Refurb Pro', contact_number: '555-0201', email: 'service@panelrefurb.com', location: 'Florida', service_type: 'refurbishing', verified: true },
  { name: 'Renewed Solar Co', contact_number: '555-0202', email: 'info@renewedsolar.com', location: 'Arizona', service_type: 'refurbishing', verified: true }
];

mongoose.connect(MONGODB_URI)
  .then(async () => {
    await Recycler.insertMany(recyclers);
    console.log('5 recyclers added successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });