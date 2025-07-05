import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { status } = body;

    if (!['yes', 'no'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quiz/updatequiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.SECRET_KEY
      },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to update quiz');
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Error in toggle route:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
