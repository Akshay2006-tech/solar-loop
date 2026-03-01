const mongoose = require('mongoose');

const solarPanelSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  brand: { type: String, required: true },
  model: String,
  capacity_watts: { type: Number, required: true },
  warranty_years: { type: Number, default: 25 },
  installation_date: { type: Date, required: true },
  location: String,
  serial_number: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SolarPanel', solarPanelSchema);
