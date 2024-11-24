import { IProduct } from '../models/Product';

interface RetailerPrice {
  retailerId: string;
  retailerName: string;
  price: number;
  url: string;
  lastUpdated: Date;  // Added lastUpdated to match Product model
}

export const aggregatePrices = async (product: IProduct): Promise<RetailerPrice[]> => {
  try {
    // Here you would integrate with real retailer APIs
    // For MVP, we'll return mock data
    const mockRetailers: RetailerPrice[] = [
      {
        retailerId: '1',
        retailerName: 'EcoStore',
        price: product.prices[0]?.price || 99.99,
        url: 'http://example.com/product1',
        lastUpdated: new Date()
      },
      {
        retailerId: '2',
        retailerName: 'GreenMart',
        price: (product.prices[0]?.price || 99.99) * 1.1, // 10% higher
        url: 'http://example.com/product2',
        lastUpdated: new Date()
      },
      {
        retailerId: '3',
        retailerName: 'SustainableShop',
        price: (product.prices[0]?.price || 99.99) * 0.95, // 5% lower
        url: 'http://example.com/product3',
        lastUpdated: new Date()
      }
    ];

    return mockRetailers;
  } catch (error) {
    console.error('Price aggregation error:', error);
    return product.prices; // Return existing prices if aggregation fails
  }
};