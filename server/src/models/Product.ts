import mongoose, { Schema, Document } from 'mongoose';

export enum ProductCategory {
  ELECTRONICS = 'electronics',
  FASHION = 'fashion',
  HOME = 'home',
  FOOD = 'food',
  BEAUTY = 'beauty',
  HEALTH = 'health'
}

export interface IProductPrice {
  retailerId: string;
  retailerName: string;
  price: number;
  url: string;
  lastUpdated: Date;
}

export interface ISustainabilityMetrics {
  ecoRating: number;
  carbonFootprint: number;
  recyclablePackaging: boolean;
  fairTrade: boolean;
  organicCertified: boolean;
  manufacturingImpact: number;
  transportationFootprint: number;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  category: ProductCategory;
  image: string;
  prices: IProductPrice[];
  sustainabilityMetrics: ISustainabilityMetrics;
  metadata: {
    brand: string;
    manufacturer: string;
    countryOfOrigin: string;
    certifications: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}


const ProductSchema = new Schema({
  name: { type: String, required: true, index: true },
  description: { type: String, required: true },
  category: { type: String, enum: Object.values(ProductCategory), required: true },
  image: { type: String, required: true },
  prices: [{
    retailerId: { type: String, required: true },
    retailerName: { type: String, required: true },
    price: { type: Number, required: true },
    url: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now }
  }],
  sustainabilityMetrics: {
    ecoRating: { type: Number, min: 0, max: 10, required: true },
    carbonFootprint: { type: Number, required: true },
    recyclablePackaging: { type: Boolean, default: false },
    fairTrade: { type: Boolean, default: false },
    organicCertified: { type: Boolean, default: false },
    manufacturingImpact: { type: Number, min: 0, max: 10, required: true },
    transportationFootprint: { type: Number, required: true }
  },
  metadata: {
    brand: { type: String, required: true },
    manufacturer: { type: String, required: true },
    countryOfOrigin: { type: String, required: true },
    certifications: [{ type: String }]
  }
}, { timestamps: true });

// Indexes for better query performance
ProductSchema.index({ category: 1 });
ProductSchema.index({ 'sustainabilityMetrics.ecoRating': 1 });
ProductSchema.index({ 'prices.price': 1 });

export default mongoose.model<IProduct>('Product', ProductSchema);