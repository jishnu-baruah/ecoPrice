// components/product/EcoRating.tsx
interface EcoRatingProps {
    rating: number;
  }
  
  export default function EcoRating({ rating }: EcoRatingProps) {
    const getColor = (rating: number) => {
      if (rating >= 8) return "bg-green-500";
      if (rating >= 6) return "bg-yellow-500";
      return "bg-red-500";
    };
  
    return (
      <div className="flex items-center gap-1">
        <div className={`w-8 h-8 rounded-full ${getColor(rating)} flex items-center justify-center text-white font-bold`}>
          {rating}
        </div>
        <span className="text-sm text-gray-600">Eco Score</span>
      </div>
    );
  }
  