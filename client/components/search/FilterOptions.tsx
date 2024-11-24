// components/search/FilterOptions.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function FilterOptions() {
  const [filters, setFilters] = useState({
    minEcoRating: [0],
    maxPrice: "",
    sustainabilityFeatures: {
      recyclable: false,
      fairTrade: false,
      organic: false,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Minimum Eco Rating</Label>
          <Slider
            value={filters.minEcoRating}
            onValueChange={(value) => setFilters(prev => ({ ...prev, minEcoRating: value }))}
            max={10}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <Label>Maximum Price</Label>
          <Input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
            placeholder="Enter max price"
          />
        </div>

        <div className="space-y-2">
          <Label>Sustainability Features</Label>
          {Object.entries(filters.sustainabilityFeatures).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox
                id={key}
                checked={value}
                onCheckedChange={(checked) =>
                  setFilters(prev => ({
                    ...prev,
                    sustainabilityFeatures: {
                      ...prev.sustainabilityFeatures,
                      [key]: checked === true,
                    },
                  }))
                }
              />
              <Label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}