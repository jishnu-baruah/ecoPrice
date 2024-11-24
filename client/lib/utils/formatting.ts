// lib/utils/formatting.ts
export function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  }
  
  export function formatPercentage(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
  }
  
  export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
  }