import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || 20;
    const offset = searchParams.get("offset") || 0;

    console.log("Fetching quiz responses with limit:", limit, "and offset:", offset);

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/quiz/quiz-responses?limit=${limit}&offset=${offset}`
            , {
                headers: {
                    'x-api-key': process.env.SECRET_KEY,
                },
            }
        );

        const data = await res.json();

        if (!res.ok || !data.success) {
            throw new Error(data.error || "Failed to fetch quiz responses");
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error("❌ Error fetching quiz responses:", err.message);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
