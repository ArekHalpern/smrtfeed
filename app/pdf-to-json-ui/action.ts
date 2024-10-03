'use server';

import { revalidatePath } from 'next/cache';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

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
  revalidatePath('/pdf-to-json-ui');
  return result;
}

export async function saveToDatabase(data: Prisma.PaperCreateInput) {
  try {
    const paper = await prisma.paper.create({
      data: {
        title: data.title,
        authors: data.authors,
        keywords: data.keywords as string[],
        key_insights: data.key_insights,
        conclusion: data.conclusion,
      },
    });
    revalidatePath('/pdf-to-json-ui');
    return { success: true, id: paper.id };
  } catch (error) {
    console.error('Error saving to database:', error);
    return { success: false, error: (error as Error).message };
  }
}
