import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quiz/addquestion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.SECRET_KEY,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to add question");
    }

    return NextResponse.json({ success: true, message: data.message });
  } catch (err) {
    console.error("❌ Error in API route:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
