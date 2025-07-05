import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '10';
  const search = searchParams.get('search') || '';

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const API_PASS = process.env.SECRET_KEY;

  if (!API_URL || !API_PASS) {
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  try {
    const response = await axios.get(
      `${API_URL}/api/updates?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
      {
        headers: { 'x-api-key': API_PASS },
      }
    );

    return NextResponse.json(response.data, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: err.response?.data?.error || 'Failed to fetch updates',
      },
      {
        status: err.response?.status || 500,
      }
    );
  }
}