// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface APIError {
  message: string;
  status: number;
}

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const error: APIError = await res.json();
      throw new Error(error.message || 'An error occurred');
    }

    return res.json();
  } catch (error) {
    throw error;
  }
}

export async function searchProducts(query: string, filters?: {
  minEcoRating?: number;
  maxPrice?: number;
  sustainabilityFeatures?: string[];
}) {
  const params = new URLSearchParams({
    q: query,
    ...(filters?.minEcoRating && { minEcoRating: filters.minEcoRating.toString() }),
    ...(filters?.maxPrice && { maxPrice: filters.maxPrice.toString() }),
    ...(filters?.sustainabilityFeatures && { features: filters.sustainabilityFeatures.join(',') }),
  });

  return fetchAPI(`/products/search?${params}`);
}

export async function getProduct(id: string) {
  return fetchAPI(`/products/${id}`);
}

export async function getFeaturedProducts() {
  return fetchAPI('/products/featured');
}

export async function getUser(id: string) {
  return fetchAPI(`/users/${id}`);
}

export async function saveProduct(productId: string) {
  return fetchAPI('/users/save-product', {
    method: 'POST',
    body: JSON.stringify({ productId }),
  });
}

export async function getCommunityPosts() {
  return fetchAPI('/community/posts');
}

export async function createPost(data: {
  title: string;
  content: string;
}) {
  return fetchAPI('/community/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
