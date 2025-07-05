// src/app/api/posts/[id]/route.js
import axios from 'axios';

export async function GET(request, context) {
  const params = await context.params; // ✅ async access for Next.js 15+
  const { id } = params;

  console.log('Fetching post with ID:', id);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const API_PASS = process.env.SECRET_KEY;

  try {
    const response = await axios.get(`${API_URL}/api/posts/posts/${id}`, {
      headers: { 'x-api-key': API_PASS },
    });

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('API Error:', err.message);
    return new Response(
      JSON.stringify({
        message: err.response?.data?.message || 'Error fetching post',
      }),
      {
        status: err.response?.status || 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
