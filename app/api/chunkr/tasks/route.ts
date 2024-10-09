import { NextResponse } from 'next/server';

const CHUNKR_API_URL = 'https://api.chunkr.ai/api/v1/task';

export async function GET() {
  const apiKey = process.env.CHUNKR_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'CHUNKR_API_KEY is not set' }, { status: 500 });
  }

  try {
    const response = await fetch(`${CHUNKR_API_URL}s`, { // Note the 's' at the end to fetch all tasks
      headers: {
        'Authorization': apiKey,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Chunkr API error:', response.status, response.statusText);
      console.error('Error body:', errorBody);
      throw new Error(`Chunkr API error: ${response.status} ${response.statusText}`);
    }

    const tasks = await response.json();
    return NextResponse.json(tasks);

  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'An error occurred while fetching tasks' }, { status: 500 });
  }
}