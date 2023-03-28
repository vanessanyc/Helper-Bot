const mongoose = require('mongoose');

const MafundsSchema = new mongoose.Schema({
  name: String,
  description: String,
  services: [String],
  location: String,
  groups: String,
  contact: [String],
  website: String
});

const Mafunds = mongoose.model('maFunds', MafundsSchema, 'maFunds')
module.exports = Mafunds;

