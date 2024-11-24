// src/app.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
// const redisClient = require('./config/cache');
const { port } = require('./config/environment');

// Route imports
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Initialize express
const app = express();

// Connect to MongoDB
connectDB();

// Connect to Redis
// redisClient.connect().catch(console.error);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);





// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;