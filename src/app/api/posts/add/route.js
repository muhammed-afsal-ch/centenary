export async function POST(req) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiKey = process.env.SECRET_KEY;


  try {
    // Parse the incoming FormData 
    const formData = await req.formData();

    // Debug: Log the FormData contents
    console.log('Outgoing FormData entries:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // Ensure a trailing slash in apiUrl and construct the full URL
    const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
    const fullUrl = `${baseUrl}api/posts/add`;
    console.log('Constructed URL:', fullUrl);

    // Set up a timeout for the fetch request (60 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);


    // Forward the FormData to the external API
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
      },
      body: formData,
      signal: controller.signal,
    });

    // Log response status and headers

    
    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server did not return JSON');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit post');
    }

    return new Response(JSON.stringify({ message: 'Post uploaded successfully!', ...data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in addpost API:', error);
    let errorMessage = 'Failed to submit post';
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