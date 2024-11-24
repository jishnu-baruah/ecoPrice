
// src/controllers/reviewController.js
const Review = require('../models/Review');

const reviewController = {
  // Create review
  async createReview(req, res) {
    try {
      const { rating, content, sustainabilityRating } = req.body;
      const review = await Review.create({
        productId: req.params.productId,
        userId: req.user._id,
        rating,
        content,
        sustainabilityRating
      });
      res.status(201).json(review);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get product reviews
  async getProductReviews(req, res) {
    try {
      const reviews = await Review.find({ productId: req.params.productId })
        .populate('userId', 'name')
        .sort({ createdAt: -1 });
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = reviewController;