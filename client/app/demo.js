import React, { useState } from 'react';
import { Search, ShoppingCart, Loader2, Star, Package, Award, Leaf, Tag } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const EcoPriceDemo = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    amazon: [],
    flipkart: []
  });
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const API_KEY = process.env.RAPID_API_KEY; 

  const fetchAmazonProducts = async (query) => {
    try {
      const searchResponse = await fetch(
        `https://real-time-amazon-data.p.rapidapi.com/search?query=${encodeURIComponent(query)}&country=IN`,
        {
          headers: {
            'x-rapidapi-host': 'real-time-amazon-data.p.rapidapi.com',
            'x-rapidapi-key': API_KEY
          }
        }
      );

      if (!searchResponse.ok) throw new Error('Amazon search failed');
      
      const searchData = await searchResponse.json();
      const products = searchData.data?.products || [];

      // Get details for first 3 products
      const detailedProducts = await Promise.all(
        products.slice(0, 3).map(async (product) => {
          try {
            const detailsResponse = await fetch(
              `https://real-time-amazon-data.p.rapidapi.com/product-details?asin=${product.asin}&country=IN`,
              {
                headers: {
                  'x-rapidapi-host': 'real-time-amazon-data.p.rapidapi.com',
                  'x-rapidapi-key': API_KEY
                }
              }
            );

            if (!detailsResponse.ok) return product;
            
            const details = await detailsResponse.json();
            return details.data || product;
          } catch {
            return product;
          }
        })
      );

      return detailedProducts;
    } catch (error) {
      console.error('Amazon API Error:', error);
      return [];
    }
  };

  const fetchFlipkartProducts = async (query) => {
    try {
      const response = await fetch(`/api/flipkart?query=${encodeURIComponent(query)}&page=1&sort_by=popularity`);
  
      if (!response.ok) throw new Error('Flipkart search failed');
  
      const data = await response.json();
      return (data.products || []).slice(0, 3).map(product => ({
        pid: product.pid || Math.random().toString(),
        title: product.title || 'Unnamed Product',
        imageUrl: product.images?.[0] || '/api/placeholder/400/320',
        price: product.price,
        mrp: product.mrp,
        rating: product.rating?.average || 'No rating',
        ratingCount: product.rating?.count || 0,
        url: product.url,
        brand: product.brand,
        highlights: product.highlights || []
      }));
    } catch (error) {
      console.error('Flipkart API Error:', error);
      return [];
    }
  };

  const renderAmazonProduct = (product) => (
    <Card key={product.asin} className="overflow-hidden">
      <div className="h-48 overflow-hidden relative">
        <img
          src={product.product_photo || product.product_main_image_url}
          alt={product.product_title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/api/placeholder/400/320';
          }}
        />
        {(product.is_prime || product.climate_pledge_friendly) && (
          <div className="absolute top-2 right-2 flex gap-1">
            {product.is_prime && (
              <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                Prime
              </span>
            )}
            {product.climate_pledge_friendly && (
              <span className="bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                <Leaf size={12} /> Eco
              </span>
            )}
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-sm mb-2 line-clamp-2">
          {product.product_title}
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-blue-600">
           {product.product_price || 'Price unavailable'}
            </span>
            {product.product_original_price && (
              <span className="text-sm text-gray-500 line-through">
               {product.product_original_price}
              </span>
            )}
          </div>
          
          {product.product_star_rating && (
            <div className="flex items-center gap-1">
              <Star className="text-yellow-400 fill-yellow-400" size={16} />
              <span className="text-sm">
                {product.product_star_rating}
                {product.product_num_ratings && (
                  <span className="text-gray-500">
                    {' '}({product.product_num_ratings.toLocaleString()} reviews)
                  </span>
                )}
              </span>
            </div>
          )}

          {product.is_best_seller && (
            <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded flex items-center gap-1">
              <Award size={12} /> Best Seller
            </span>
          )}
        </div>

        {product.product_url && (
          <a
            href={product.product_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-4 text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            View on Amazon
          </a>
        )}
      </CardContent>
    </Card>
  );

  const renderFlipkartProduct = (product) => (
    <Card key={product.pid} className="overflow-hidden">
      <div className="h-48 overflow-hidden relative">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/api/placeholder/400/320';
          }}
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-sm mb-2 line-clamp-2">
          {product.title}
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-blue-600">
              ₹{product.price?.toLocaleString() || 'Price unavailable'}
            </span>
            {product.mrp && product.mrp !== product.price && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.mrp.toLocaleString()}
              </span>
            )}
          </div>
          
          {product.rating && (
            <div className="flex items-center gap-1">
              <Star className="text-yellow-400 fill-yellow-400" size={16} />
              <span className="text-sm">
                {product.rating}
                {product.ratingCount > 0 && (
                  <span className="text-gray-500">
                    {' '}({product.ratingCount.toLocaleString()} ratings)
                  </span>
                )}
              </span>
            </div>
          )}

          {product.brand && (
            <div className="text-sm text-gray-600">
              Brand: {product.brand}
            </div>
          )}

          {product.highlights?.length > 0 && (
            <div className="text-sm text-gray-600 space-y-1">
              {product.highlights.slice(0, 2).map((highlight, index) => (
                <div key={index} className="line-clamp-1">• {highlight}</div>
              ))}
            </div>
          )}
        </div>

        {product.url && (
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-4 text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            View on Flipkart
          </a>
        )}
      </CardContent>
    </Card>
  );

  const fetchPriceComparisons = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [amazonProducts, flipkartProducts] = await Promise.all([
        fetchAmazonProducts(searchTerm),
        fetchFlipkartProducts(searchTerm)
      ]);

      setResults({
        amazon: amazonProducts,
        flipkart: flipkartProducts
      });
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Price Comparison</h1>
      
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a product..."
            className="w-full p-3 pr-10 border rounded-lg"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                fetchPriceComparisons();
              }
            }}
          />
          <Search className="absolute right-3 top-3 text-gray-400" size={20} />
        </div>
        <button
          onClick={fetchPriceComparisons}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <ShoppingCart size={20} />
          )}
          Compare Prices
        </button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-8">
        {Object.entries(results).map(([source, items]) => (
          <div key={source} className="border-t pt-4">
            <h2 className="text-xl font-semibold mb-4 capitalize">{source}</h2>
            {items.length === 0 ? (
              <div className="text-gray-500 text-center py-4">
                No results available from {source}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((product) => (
                  source === 'amazon' ? 
                    renderAmazonProduct(product) : 
                    renderFlipkartProduct(product)
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EcoPriceDemo;