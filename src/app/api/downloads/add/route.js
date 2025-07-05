// app/api/downloads/add/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
    const expressBackendUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiPass = process.env.SECRET_KEY;

    try {
        const formDataFromClient = await req.formData();

        const baseUrl = expressBackendUrl.endsWith('/') ? expressBackendUrl : `${expressBackendUrl}/`;
        const fullBackendUrl = `${baseUrl}api/downloads/add`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);

        const response = await fetch(fullBackendUrl, {
            method: 'POST',
            headers: {
                'x-api-key': apiPass,
            },
            body: formDataFromClient,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const contentType = response.headers.get('content-type');
        let data;

        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const textResponse = await response.text();
            throw new Error(`Server did not return JSON. Response: ${textResponse.substring(0, 100)}...`);
        }

        if (!response.ok) {
            const errorMessage = data.error || `Backend responded with status ${response.status}`;
            return NextResponse.json({ error: errorMessage }, { status: response.status });
        }

        return NextResponse.json(data, { status: response.status });

    } catch (error) {
        console.error('Error in /api/downloads/add:', error);
        let errorMessage = 'An unexpected error occurred.';

        if (error.name === 'AbortError') {
            errorMessage = 'Request to backend timed out.';
        } else if (error.message.includes('Server did not return JSON')) {
            errorMessage = error.message;
        } else if (error.cause?.code === 'UND_ERR_CONNECT_TIMEOUT') {
            errorMessage = 'Connection timeout to the external API.';
        } else if (error.code === 'ERR_INVALID_URL') {
            errorMessage = 'Invalid backend API URL.';
        } else if (error instanceof TypeError && error.message.includes('Failed to parse URL')) {
            errorMessage = 'Invalid backend API URL.';
        } else if (error.message) {
            errorMessage = error.message;
        }

        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
