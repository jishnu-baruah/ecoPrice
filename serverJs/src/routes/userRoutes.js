
// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const limiters = require('../middleware/rateLimiter');

router.post('/register', limiters.auth, userController.register);
router.post('/login', limiters.auth, userController.login);
router.get('/me', protect, userController.getProfile);
router.put('/me', protect, userController.updateProfile);

module.exports = router;
