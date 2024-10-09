import { NextResponse } from 'next/server';

const CHUNKR_API_URL = 'https://api.chunkr.ai/api/v1/task';

export async function POST(request: Request) {
  const apiKey = process.env.CHUNKR_API_KEY;
  console.log('API Key:', apiKey ? `Set (${apiKey.substring(0, 5)}...)` : 'Not set');
  console.log('API Key length:', apiKey?.length);

  if (!apiKey) {
    return NextResponse.json({ error: 'CHUNKR_API_KEY is not set' }, { status: 500 });
  }

  if (!apiKey.startsWith('lu_') || apiKey.length !== 48) {
    console.error('Invalid API key format');
    return NextResponse.json({ error: 'Invalid API key format' }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const url = formData.get('url') as string;

    if (!file && !url) {
      return NextResponse.json({ error: 'No file uploaded or URL provided' }, { status: 400 });
    }

    const chunkrFormData = new FormData();
    if (file) {
      chunkrFormData.append('file', file, file.name);
    } else if (url) {
      chunkrFormData.append('url', url);
    }
    chunkrFormData.append('model', 'Fast');

    console.log('File name:', file?.name);
    console.log('File type:', file?.type);
    console.log('File size:', file?.size);

    const response = await fetch(CHUNKR_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
      },
      body: chunkrFormData,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', JSON.stringify(Object.fromEntries(response.headers)));

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Chunkr API error:', response.status, response.statusText);
      console.error('Error body:', errorBody);
      throw new Error(`Chunkr API error: ${response.status} ${response.statusText}`);
    }

    const taskData = await response.json();
    console.log('Chunkr task created:', taskData);

    return NextResponse.json(taskData);

  } catch (error) {
    console.error('Error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'An error occurred while processing the request', details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred while processing the request' }, { status: 500 });
    }
  }
}

export async function GET(request: Request) {
  const apiKey = process.env.CHUNKR_API_KEY;
  console.log('API Key (GET):', apiKey ? `Set (${apiKey.substring(0, 5)}...)` : 'Not set');

  if (!apiKey) {
    return NextResponse.json({ error: 'CHUNKR_API_KEY is not set' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('taskId');

  if (!taskId) {
    return NextResponse.json({ error: 'No taskId provided' }, { status: 400 });
  }

  try {
    const response = await fetch(`${CHUNKR_API_URL}/${taskId}`, {
      headers: {
        'Authorization': apiKey, // Remove 'Bearer ' prefix
      },
    });

    console.log('GET Response status:', response.status);
    console.log('GET Response headers:', JSON.stringify(Object.fromEntries(response.headers)));

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Chunkr API GET error:', response.status, response.statusText);
      console.error('GET Error body:', errorBody);
      throw new Error(`Chunkr API error: ${response.status} ${response.statusText}`);
    }

    const taskStatus = await response.json();
    console.log('Chunkr task status:', taskStatus);

    return NextResponse.json(taskStatus);
  } catch (error) {
    console.error('GET Error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'An error occurred while fetching task status', details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred while fetching task status' }, { status: 500 });
    }
  }
}
