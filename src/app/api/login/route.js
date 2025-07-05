import axios from 'axios';

export async function POST(request) {
  const body = await request.json();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const API_PASS = process.env.SECRET_KEY;

  try {
    const response = await axios.post(`${API_URL}/api/login`, body, {
      headers: {
        'x-api-key': API_PASS,
        'Content-Type': 'application/json'
      }
    });

    // Optional: Set cookie here if needed
    // const { token } = response.data;
    // const headers = new Headers({
    //   'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict; Secure`
    // });

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // ...headers
      }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.response?.data?.error || 'Login failed' }),
      {
        status: err.response?.status || 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
