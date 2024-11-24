// app/profile/page.tsx
import { getUser } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductCard from "@/components/product/ProductCard";
import { User, Product } from "@/types";

async function getUserData(): Promise<{ user: User; savedProducts: Product[] }> {
  const userId = "current-user-id";
  const user = await getUser(userId);
  const savedProducts = await Promise.all(
    user.savedProducts.map((id) => fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`).then(res => res.json()))
  );
  return { user, savedProducts };
}

export default async function ProfilePage() {
  const { user, savedProducts } = await getUserData();

  return (
    <div className="container">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{user.name}'s Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <span className="block text-sm text-muted-foreground">Total Carbon Savings</span>
                  <span className="text-2xl font-bold">{user.carbonSavings.toFixed(1)}kg CO2</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <span className="block text-sm text-muted-foreground">Saved Products</span>
                  <span className="text-2xl font-bold">{savedProducts.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <section>
        <h2 className="text-xl font-semibold mb-6">Saved Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {savedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
