const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    addressLine: { type: String, required: true },
  });
  
  module.exports = mongoose.model('Address', AddressSchema);
  