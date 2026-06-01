const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String }, // Optional: path to logo image
  order: { type: Number, default: 0 },
}, {
  timestamps: true,
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
