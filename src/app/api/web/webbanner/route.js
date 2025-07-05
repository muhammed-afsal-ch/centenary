import axios from 'axios';

export async function GET() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  try {
    const res = await axios.get(`${API_URL}/api/web/bannernews`);
    return new Response(JSON.stringify(res.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch web banner news' }),
      { status: 500 }
    );
  }
}
