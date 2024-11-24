
// components/product/ProductCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import EcoRating from "./EcoRating";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const lowestPrice = Math.min(...product.prices.map(p => p.price));

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="relative aspect-square">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain rounded-lg"
            />
          </div>
          <CardTitle className="mt-2">{product.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">
              ${lowestPrice.toFixed(2)}
            </span>
            <EcoRating rating={product.ecoRating} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}