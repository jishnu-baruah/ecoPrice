// components/product/CarbonCalculator.tsx
"use client";

import { useState } from "react";
import { Product } from "@/types";
import { calculateCarbonSavings } from "@/lib/utils/ecoCalculations";

interface CarbonCalculatorProps {
  product: Product;
}

export default function CarbonCalculator({ product }: CarbonCalculatorProps) {
  const [comparisonFootprint, setComparisonFootprint] = useState("");
  const [savings, setSavings] = useState<number | null>(null);

  const handleCalculate = () => {
    const footprint = parseFloat(comparisonFootprint);
    if (!isNaN(footprint)) {
      setSavings(calculateCarbonSavings(footprint, product.carbonFootprint));
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Carbon Savings Calculator</h3>
      <div className="flex gap-4 mb-4">
        <input
          type="number"
          value={comparisonFootprint}
          onChange={(e) => setComparisonFootprint(e.target.value)}
          placeholder="Enter comparison product CO2 (kg)"
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleCalculate}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Calculate
        </button>
      </div>
      {savings !== null && (
        <div className="text-center p-3 bg-white rounded">
          <span className="block text-sm text-gray-600">Potential CO2 Savings</span>
          <span className="text-2xl font-bold text-green-600">
            {savings.toFixed(1)}kg CO2
          </span>
        </div>
      )}
    </div>
  );
}