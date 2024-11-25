// app/page.tsx
'use client';
import EcoPriceDemo from './demo';
import FlipkartSearch from './flipkartSerach';


export default function Home() {
  return (
    <div className="container mx-auto">
      <section className="py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Shop Sustainably, Save Money</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Compare prices and environmental impact in one place
        </p>
        <EcoPriceDemo/>
      </section>
    </div>
  );
}