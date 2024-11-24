// src/models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  content: String,
  sustainabilityRating: {
    type: Number,
    min: 1,
    max: 5
  },
  verifiedPurchase: Boolean,
  likes: Number
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
