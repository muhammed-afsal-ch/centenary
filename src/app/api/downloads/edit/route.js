// app/api/downloads/edit/route.js
'use server'; // Indicates this is a server-side route

export async function PATCH(req) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiKey = process.env.SECRET_KEY;

  try {
    // Parse the incoming request body (JSON)
    const { downloadId, title, description, previewImage } = await req.json();

    if (!downloadId || !title || !description || !previewImage) {
      return new Response(JSON.stringify({ error: "Download ID, title, description, and preview image URL are required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Ensure a trailing slash in apiUrl and construct the full URL
    const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
    const fullUrl = `${baseUrl}api/downloads/edit`;

    // Set up a timeout for the fetch request (60 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    // Forward the request to the external API
    const response = await fetch(fullUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({ downloadId, title, description, previewImage }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server did not return JSON');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update download');
    }

    return new Response(JSON.stringify({ message: 'Download updated successfully!', ...data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    let errorMessage = 'Failed to update download';
    if (error.name === 'AbortError') {
      errorMessage = 'Request timed out after 60 seconds. The external API may be down or unreachable.';
    } else if (error.cause?.code === 'UND_ERR_CONNECT_TIMEOUT') {
      errorMessage = 'Connection timeout. Unable to reach the external API.';
    } else if (error.code === 'ERR_INVALID_URL') {
      errorMessage = 'Invalid URL for the external API. Please check NEXT_PUBLIC_API_URL.';
    }
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}