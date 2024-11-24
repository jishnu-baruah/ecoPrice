'use client';
import { useState } from 'react';

export default function FlipkartSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('popularity');

  const handleSearch = async () => {
    setResults([]);
    setError('');

    if (!query.trim()) {
      setError('Please enter a search term.');
      return;
    }

    try {
      const response = await fetch(`/api/flipkart?query=${encodeURIComponent(query)}&page=${page}&sort_by=${sortBy}`);
      const data = await response.json();

      if (response.ok) {
        setResults(data.products || []);
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
    }
  };

  return (
    <div>
      <h1>Flipkart Product Search</h1>
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="popularity">Popularity</option>
        <option value="price_low_to_high">Price: Low to High</option>
        <option value="price_high_to_low">Price: High to Low</option>
      </select>
      <input
        type="number"
        min="1"
        value={page}
        onChange={(e) => setPage(Number(e.target.value))}
      />
      <button onClick={handleSearch}>Search</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {results.length > 0 ? (
          results.map((product) => (
            <div key={product.pid} style={{ border: '1px solid #ccc', padding: '10px', width: '250px' }}>
              <img
                src={product.images[0]}
                alt={product.title}
                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
              />
              <h3>{product.title}</h3>
              <p><strong>Brand:</strong> {product.brand}</p>
              <p><strong>Price:</strong> ₹{product.price}</p>
              <p><strong>MRP:</strong> <del>₹{product.mrp}</del></p>
              <p><strong>Rating:</strong> {product.rating.average} ({product.rating.count} reviews)</p>
              <a href={product.url} target="_blank" rel="noopener noreferrer">View on Flipkart</a>
            </div>
          ))
        ) : (
          !error && <p>No products found.</p>
        )}
      </div>
    </div>
  );
}
