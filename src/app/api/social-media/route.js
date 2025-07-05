import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const API_PASS = process.env.SECRET_KEY;

  try {
    const response = await axios.get(`${API_URL}/api/posts/social-media`, {
      headers: { 'x-api-key': API_PASS },
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (err) {
    console.error('Error fetching social media links:', err);
    return NextResponse.json(
      { error: err.response?.data?.error || 'Failed to fetch social media links' },
      { status: err.response?.status || 500 }
    );
  }
}