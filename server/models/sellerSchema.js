const mongoose = require('mongoose');

const SellerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('Seller', SellerSchema);
  