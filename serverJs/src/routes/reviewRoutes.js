
// src/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.post('/:productId/reviews', protect, reviewController.createReview);
router.get('/:productId/reviews', reviewController.getProductReviews);

module.exports = router;