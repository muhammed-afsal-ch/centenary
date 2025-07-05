// 📦 API route to fetch quiz availability from Express backend
export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quiz/quizavailable`, {
      headers: {
        'x-api-key': process.env.SECRET_KEY
      }
    });

    if (!res.ok) {
      throw new Error('Failed to fetch quiz status');
    }

    const data = await res.json();

    if (!data || typeof data.status !== 'string') {
      throw new Error('Invalid response from quiz API');
    }

    console.log("✅ Quiz availability status:", data.status);

    return Response.json({ status: data.status });
  } catch (error) {
    console.error("❌ Error in /api/quiz/available:", error.message);
    return Response.json({ status: "no", error: error.message }, { status: 500 });
  }
}
