// src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { cache } = require('../middleware/cache');
const limiters = require('../middleware/rateLimiter');

// Verify that controller methods exist before adding routes
router.get('/search', limiters.search, cache(300), productController.searchProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/categories', cache(21600), productController.getCategories);
router.get('/:id', cache(3600), productController.getProductDetails);

module.exports = router;