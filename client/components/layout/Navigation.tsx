// components/layout/Navigation.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Community", href: "/community" },
  { label: "Profile", href: "/profile" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`${
            pathname === item.href
              ? "text-green-600 font-semibold"
              : "text-gray-600 hover:text-green-600"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}