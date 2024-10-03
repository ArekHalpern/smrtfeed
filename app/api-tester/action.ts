'use server';

import { revalidatePath } from 'next/cache';

export async function analyzeResearchPaper(text: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    throw new Error('API URL is not defined in the environment variables');
  }

  const response = await fetch(`${apiUrl}/api/v1/research-paper-parser/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  revalidatePath('/api-tester');
  return result;
}
