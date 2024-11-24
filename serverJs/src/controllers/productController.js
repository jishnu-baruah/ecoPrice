// src/controllers/productController.js
const productService = require('../services/productService');

const productController = {
    // Search products with filters
    searchProducts: async (req, res) => {
        try {
            const { q = '', category, minEcoRating, maxPrice } = req.query;
            const products = await productService.searchProducts(
                q,
                category,
                Number(minEcoRating) || 0,
                Number(maxPrice) || Infinity
            );
            res.json({
                products,
                total: products.length
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get featured products
    getFeaturedProducts: async (req, res) => {
        console.log("hi")
        try {
            const products = await productService.getFeaturedProducts();
            console.log(products.json)
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get product categories
    getCategories: async (req, res) => {
        try {
            const products = await productService.getAllProducts();
            const categories = [...new Set(products.map(product => product.category))];
            res.json(categories);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get product details by ID
    getProductDetails: async (req, res) => {
        try {
            const { id } = req.params;
            const products = await productService.getAllProducts();
            const product = products.find(p => p.id === parseInt(id));
            
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            
            res.json(product);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = productController;