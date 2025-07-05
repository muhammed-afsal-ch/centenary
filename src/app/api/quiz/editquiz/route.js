import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quiz/editquiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.SECRET_KEY, // optional if your Express backend uses this
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to update question");
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ Error in POST editquiz:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
