// src/services/productService.js
const axios = require('axios');

class ProductService {
  constructor() {
    // Base URLs for different APIs
    this.fakeStoreAPI = 'https://fakestoreapi.com/products';
    this.dummyJsonAPI = 'https://dummyjson.com/products';
  }

  // Calculate mock eco metrics for products
  calculateEcoMetrics(product) {
    return {
      ecoRating: Math.floor(Math.random() * 5) + 5, // Rating between 5-10
      carbonFootprint: Math.floor(Math.random() * 100) + 50,
      recyclablePackaging: Math.random() > 0.5,
      fairTrade: Math.random() > 0.5,
      organicCertified: Math.random() > 0.7,
      manufacturingImpact: Math.floor(Math.random() * 5) + 5,
      transportationFootprint: Math.floor(Math.random() * 50) + 20
    };
  }

  // Transform FakeStore API data to our format
  transformFakeStoreProduct(product) {
    return {
      name: product.title,
      description: product.description,
      category: this.mapCategory(product.category),
      image: product.image,
      prices: [{
        retailerId: 'fakestore',
        retailerName: 'FakeStore',
        price: product.price,
        url: `https://fakestoreapi.com/products/${product.id}`,
        lastUpdated: new Date()
      }],
      sustainabilityMetrics: this.calculateEcoMetrics(product),
      metadata: {
        brand: 'FakeStore Brand',
        manufacturer: 'FakeStore Manufacturing',
        countryOfOrigin: 'United States',
        certifications: ['ISO 9001']
      }
    };
  }

  // Transform DummyJSON API data to our format
  transformDummyJsonProduct(product) {
    return {
      name: product.title,
      description: product.description,
      category: this.mapCategory(product.category),
      image: product.thumbnail,
      prices: [{
        retailerId: 'dummyjson',
        retailerName: 'DummyJSON Store',
        price: product.price,
        url: `https://dummyjson.com/products/${product.id}`,
        lastUpdated: new Date()
      }],
      sustainabilityMetrics: this.calculateEcoMetrics(product),
      metadata: {
        brand: product.brand,
        manufacturer: product.brand,
        countryOfOrigin: 'Various',
        certifications: []
      }
    };
  }

  // Map external categories to our internal categories
  mapCategory(externalCategory) {
    const categoryMap = {
      'electronics': 'ELECTRONICS',
      'jewelery': 'FASHION',
      "men's clothing": 'FASHION',
      "women's clothing": 'FASHION',
      'smartphones': 'ELECTRONICS',
      'laptops': 'ELECTRONICS',
      'fragrances': 'BEAUTY',
      'skincare': 'BEAUTY',
      'groceries': 'FOOD',
      'home-decoration': 'HOME',
      default: 'HOME'
    };
    return categoryMap[externalCategory.toLowerCase()] || categoryMap.default;
  }

  // Fetch products from FakeStore API
  async getFakeStoreProducts() {
    try {
      const response = await axios.get(this.fakeStoreAPI);
      return response.data.map(product => this.transformFakeStoreProduct(product));
    } catch (error) {
      console.error('Error fetching from FakeStore:', error);
      return [];
    }
  }

  // Fetch products from DummyJSON API
  async getDummyJsonProducts() {
    try {
      const response = await axios.get(this.dummyJsonAPI);
      return response.data.products.map(product => this.transformDummyJsonProduct(product));
    } catch (error) {
      console.error('Error fetching from DummyJSON:', error);
      return [];
    }
  }

  // Fetch and combine products from all sources
  async getAllProducts() {
    try {
      const [fakeStoreProducts, dummyJsonProducts] = await Promise.all([
        this.getFakeStoreProducts(),
        this.getDummyJsonProducts()
      ]);

      return [...fakeStoreProducts, ...dummyJsonProducts];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Search products with filters
  async searchProducts(query = '', category = '', minEcoRating = 0, maxPrice = Infinity) {
    const products = await this.getAllProducts();
    
    return products.filter(product => {
      const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase()) ||
                          product.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !category || product.category === category;
      const matchesEcoRating = product.sustainabilityMetrics.ecoRating >= minEcoRating;
      const matchesPrice = Math.min(...product.prices.map(p => p.price)) <= maxPrice;

      return matchesQuery && matchesCategory && matchesEcoRating && matchesPrice;
    });
  }

  // Get featured products (high eco-rating)
  async getFeaturedProducts() {
    const products = await this.getAllProducts();
    return products
      .filter(product => product.sustainabilityMetrics.ecoRating >= 8)
      .slice(0, 10);
  }
}

module.exports = new ProductService();