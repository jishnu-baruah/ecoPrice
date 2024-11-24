// src/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['ELECTRONICS', 'FASHION', 'HOME', 'FOOD', 'BEAUTY', 'HEALTH']
  },
  image: String,
  prices: [{
    retailerId: String,
    retailerName: String,
    price: Number,
    url: String,
    lastUpdated: Date
  }],
  sustainabilityMetrics: {
    ecoRating: { type: Number, min: 0, max: 10 },
    carbonFootprint: Number,
    recyclablePackaging: Boolean,
    fairTrade: Boolean,
    organicCertified: Boolean,
    manufacturingImpact: { type: Number, min: 0, max: 10 },
    transportationFootprint: Number
  },
  metadata: {
    brand: String,
    manufacturer: String,
    countryOfOrigin: String,
    certifications: [String]
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
