import axios from 'axios';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 10;

  const API_URL = process.env.NEXT_PUBLIC_API_URL; // e.g., http://localhost:5000
  const API_PASS = process.env.SECRET_KEY;         // Your API key if required

  try {
    const response = await axios.get(`${API_URL}/api/podcasts`, {
      params: { page, limit },
      headers: {
        'x-api-key': API_PASS,
      },
    });

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.response?.data?.error || 'Failed to fetch podcasts' }),
      {
        status: err.response?.status || 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}