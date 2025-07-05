import axios from 'axios';

export async function GET(request) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const API_PASS = process.env.SECRET_KEY;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');

  try {
    const response = await axios.get(`${API_URL}/api/posts/recentposts?page=${page}&limit=${limit}`, {
      headers: { 'x-api-key': API_PASS },
    });

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.response?.data?.error || 'Failed to fetch posts' }),
      {
        status: err.response?.status || 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
