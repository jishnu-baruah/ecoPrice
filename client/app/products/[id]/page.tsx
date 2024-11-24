
// app/products/[id]/page.tsx
import { getProduct } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import CarbonCalculator from "@/components/product/CarbonCalculator";
import EcoRating from "@/components/product/EcoRating";
import { formatPrice } from "@/lib/utils/formatting";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  return (
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <Card>
          <CardContent className="p-6">
            <div className="relative aspect-square">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain"
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <EcoRating rating={product.ecoRating} />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Available Prices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.prices.map((price) => (
                <div key={price.retailerId} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{price.retailerName}</span>
                  <div className="flex items-center gap-4">
                    <span className="font-bold">{formatPrice(price.price)}</span>
                    <Button asChild>
                      <a href={price.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Buy Now
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sustainability Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <span className="block text-sm text-muted-foreground">Carbon Footprint</span>
                  <span className="text-lg font-semibold">{product.carbonFootprint}kg CO2</span>
                </div>
                {Object.entries(product.sustainabilityMetrics).map(([key, value]) => (
                  <div key={key} className="p-4 bg-muted rounded-lg">
                    <span className="block text-sm text-muted-foreground">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-lg">{value ? '✅' : '❌'}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <CarbonCalculator product={product} />
        </div>
      </div>
    </div>
  );
}