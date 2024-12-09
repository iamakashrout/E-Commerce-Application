const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Ordered', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Ordered',
    },
    shippingAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    paymentMethod: { type: String, required: true }, // e.g., 'Credit Card', 'UPI'
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('Order', OrderSchema);
  