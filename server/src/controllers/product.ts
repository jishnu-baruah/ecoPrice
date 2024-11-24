import { Request, Response } from 'express';
import Product, { ProductCategory } from '../models/Product';
import { calculateSustainabilityScore } from '../services/sustainabilityScore';
import { aggregatePrices } from '../services/priceAggregator';


export const getProductDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        status: 404,
        code: 'NOT_FOUND',
        message: 'Product not found'
      });
    }

    // Update prices and sustainability data in background
    Promise.all([
      aggregatePrices(product),
      calculateSustainabilityScore(product)
    ]).then(async ([prices, sustainabilityMetrics]) => {
      // Type assertion because we know the structure matches
      product.prices = prices as typeof product.prices;
      product.sustainabilityMetrics = sustainabilityMetrics;
      await product.save();
    }).catch(console.error);

    return res.json(product);
  } catch (error) {
    console.error('Get product details error:', error);
    return res.status(500).json({
      status: 500,
      code: 'INTERNAL_ERROR',
      message: 'An error occurred while fetching product details'
    });
  }
};

// ... rest of the controller code remains the same

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const {
      q,
      category,
      minEcoRating,
      maxPrice,
      sustainabilityFeatures,
      page = 1,
      limit = 10
    } = req.query;

    const query: any = {};

    // Build search query
    if (q) {
      query.name = { $regex: q as string, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (minEcoRating) {
      query['sustainabilityMetrics.ecoRating'] = { $gte: Number(minEcoRating) };
    }

    if (maxPrice) {
      query['prices.price'] = { $lte: Number(maxPrice) };
    }

    if (sustainabilityFeatures) {
      const features = (sustainabilityFeatures as string).split(',');
      features.forEach(feature => {
        query[`sustainabilityMetrics.${feature}`] = true;
      });
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query)
        .skip(skip)
        .limit(Number(limit))
        .sort({ 'sustainabilityMetrics.ecoRating': -1 }),
      Product.countDocuments(query)
    ]);

    return res.json({
      data: products,
      metadata: {
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Search products error:', error);
    return res.status(500).json({
      status: 500,
      code: 'INTERNAL_ERROR',
      message: 'An error occurred while searching products'
    });
  }
};


export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const { limit = 10, category } = req.query;
    const query: any = {
      'sustainabilityMetrics.ecoRating': { $gte: 8 }
    };

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query)
      .limit(Number(limit))
      .sort({ 'sustainabilityMetrics.ecoRating': -1 });

    return res.json(products);
  } catch (error) {
    console.error('Get featured products error:', error);
    return res.status(500).json({
      status: 500,
      code: 'INTERNAL_ERROR',
      message: 'An error occurred while fetching featured products'
    });
  }
};