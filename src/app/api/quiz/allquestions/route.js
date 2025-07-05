import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page') || 1;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quiz/allquestions?page=${page}`, {
      headers: {
        'x-api-key': process.env.SECRET_KEY,
      }
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to fetch questions");
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ Error in GET allquestions:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
