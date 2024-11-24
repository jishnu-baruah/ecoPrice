// types/index.ts
export interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    prices: {
      retailerId: string;
      retailerName: string;
      price: number;
      url: string;
    }[];
    ecoRating: number;
    carbonFootprint: number;
    sustainabilityMetrics: {
      recyclablePackaging: boolean;
      fairTrade: boolean;
      organicCertified: boolean;
    };
    image: string;
  }
  
  export interface User {
    id: string;
    email: string;
    name: string;
    savedProducts: string[];
    carbonSavings: number;
  }