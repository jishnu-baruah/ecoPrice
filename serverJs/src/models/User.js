// src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  profile: {
    avatar: String,
    preferences: {
      preferredCategories: [{
        type: String,
        enum: ['ELECTRONICS', 'FASHION', 'HOME', 'FOOD', 'BEAUTY', 'HEALTH']
      }],
      sustainabilityPriorities: [String],
      priceAlerts: Boolean
    }
  },
  savedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  searchHistory: [{
    query: String,
    timestamp: Date
  }],
  carbonSavings: Number
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
