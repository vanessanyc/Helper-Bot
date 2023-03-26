const mongoose = require('mongoose');

const MafundsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  services: {
    type: [String],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  groups: {
    type: [String],
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  website: {
    type: String,
    required: true
  },
  additionalInfo: {
    type: String
  }
});

const Mafunds = mongoose.model("maFunds", MafundsSchema)
module.exports = Mafunds

