import { NextResponse } from 'next/server';

const API_KEY = process.env.RAPID_API_KEY; // Replace with your actual API key
const FLIPKART_API_HOST = 'real-time-flipkart-api.p.rapidapi.com';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const page = searchParams.get('page') || '1';  // Default to page 1
  const sortBy = searchParams.get('sort_by') || 'popularity'; // Default sort option

  if (!query) {
    console.error('Error: Query parameter is missing');
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    console.log(`Fetching data for query: ${query}, page: ${page}, sort_by: ${sortBy}`);

    const url = `https://${FLIPKART_API_HOST}/product-search?q=${encodeURIComponent(query)}&page=${page}&sort_by=${sortBy}`;
    
    const response = await fetch(url, {
      headers: {
        'x-rapidapi-host': FLIPKART_API_HOST,
        'x-rapidapi-key': API_KEY,
        'Accept': 'application/json'
      }
    });

    console.log('Flipkart API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text(); // Log exact error from API
      console.error('Flipkart API Error Response:', errorText);
      throw new Error(`Flipkart API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Flipkart API Data:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data from Flipkart API:', error);
    return NextResponse.json({ error: 'Failed to fetch Flipkart data' }, { status: 500 });
  }
}
