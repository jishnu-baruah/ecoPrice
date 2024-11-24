import { IProduct } from '../models/Product';

interface SustainabilityMetrics {
  ecoRating: number;
  carbonFootprint: number;
  recyclablePackaging: boolean;
  fairTrade: boolean;
  organicCertified: boolean;
  manufacturingImpact: number;
  transportationFootprint: number;
}

export const calculateSustainabilityScore = async (
  product: IProduct
): Promise<SustainabilityMetrics> => {
  try {
    // In a real application, you would fetch data from sustainability APIs
    // For MVP, we'll calculate based on existing metrics
    const {
      carbonFootprint,
      manufacturingImpact,
      transportationFootprint,
      recyclablePackaging,
      fairTrade,
      organicCertified
    } = product.sustainabilityMetrics;

    // Calculate eco rating (0-10 scale)
    const ecoRating = calculateEcoRating({
      carbonFootprint,
      manufacturingImpact,
      transportationFootprint,
      recyclablePackaging,
      fairTrade,
      organicCertified
    });

    return {
      ecoRating,
      carbonFootprint,
      recyclablePackaging,
      fairTrade,
      organicCertified,
      manufacturingImpact,
      transportationFootprint
    };
  } catch (error) {
    console.error('Sustainability calculation error:', error);
    return product.sustainabilityMetrics; // Return existing metrics if calculation fails
  }
};

const calculateEcoRating = (metrics: {
  carbonFootprint: number;
  manufacturingImpact: number;
  transportationFootprint: number;
  recyclablePackaging: boolean;
  fairTrade: boolean;
  organicCertified: boolean;
}): number => {
  // Weight factors for different components
  const weights = {
    carbonFootprint: 0.3,
    manufacturingImpact: 0.25,
    transportationFootprint: 0.15,
    recyclablePackaging: 0.1,
    fairTrade: 0.1,
    organicCertified: 0.1
  };

  // Normalize carbon footprint (assuming 1000kg is max)
  const normalizedCarbonScore = 10 - (metrics.carbonFootprint / 1000) * 10;
  
  // Normalize transportation footprint (assuming 500kg is max)
  const normalizedTransportScore = 10 - (metrics.transportationFootprint / 500) * 10;

  // Calculate weighted score
  const score = 
    normalizedCarbonScore * weights.carbonFootprint +
    metrics.manufacturingImpact * weights.manufacturingImpact +
    normalizedTransportScore * weights.transportationFootprint +
    (metrics.recyclablePackaging ? 10 : 0) * weights.recyclablePackaging +
    (metrics.fairTrade ? 10 : 0) * weights.fairTrade +
    (metrics.organicCertified ? 10 : 0) * weights.organicCertified;

  // Ensure score is between 0 and 10
  return Math.min(Math.max(score, 0), 10);
};

// Calculate carbon savings compared to average product
export const calculateCarbonSavings = (
  productFootprint: number,
  categoryAverageFootprint: number
): number => {
  return Math.max(categoryAverageFootprint - productFootprint, 0);
};