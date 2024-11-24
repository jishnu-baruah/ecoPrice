// components/layout/Header.tsx
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          EcoPrice
        </Link>

        <nav className="hidden md:flex gap-6">
          <Link href="/products">Products</Link>
          <Link href="/community">Community</Link>
          <Link href="/profile">Profile</Link>
        </nav>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <nav className="flex flex-col gap-4">
              <Link href="/products">Products</Link>
              <Link href="/community">Community</Link>
              <Link href="/profile">Profile</Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
