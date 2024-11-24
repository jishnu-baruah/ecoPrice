// lib/utils/ecoCalculations.ts
export function calculateCarbonSavings(productA: number, productB: number): number {
    return Math.max(0, productA - productB);
  }
  
  export function getEcoRatingColor(rating: number): string {
    if (rating >= 8) return 'green';
    if (rating >= 6) return 'yellow';
    return 'red';
  }
  
  export function calculateTotalImpact(sustainabilityMetrics: Record<string, boolean>): number {
    const weights = {
      recyclablePackaging: 0.3,
      fairTrade: 0.4,
      organicCertified: 0.3,
    };
  
    return Object.entries(sustainabilityMetrics).reduce((total, [key, value]) => {
      return total + (value ? weights[key as keyof typeof weights] : 0);
    }, 0) * 10;
  }