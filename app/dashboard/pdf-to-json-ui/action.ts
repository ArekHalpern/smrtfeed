'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db/prisma';

export async function analyzeAndSaveResearchPaper(text: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    throw new Error('API URL is not defined in the environment variables');
  }

  // Analyze the paper
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

  // Save the paper to the database
  try {
    const paper = await prisma.paper.create({
      data: {
        title: result.title,
        authors: result.authors,
        keywords: result.keywords as string[],
        key_insights: result.key_insights,
        conclusion: result.conclusion,
        datePublished: new Date(), // Add this line, using current date as default
      },
    });
    revalidatePath('/pdf-to-json-ui');
    return { paper: result, id: paper.id };
  } catch (error) {
    console.error('Error saving to database:', error);
    throw new Error(`Failed to save to database: ${(error as Error).message}`);
  }
}

export async function createPaper(formData: FormData) {
  const title = formData.get('title') as string;
  const authors = formData.get('authors') as string;
  const keywords = formData.get('keywords') as string;
  const key_insights = formData.get('key_insights') as string;
  const conclusion = formData.get('conclusion') as string;
  const datePublished = formData.get('datePublished') as string;

  // Validate the datePublished input
  let parsedDatePublished: Date;
  if (datePublished) {
    parsedDatePublished = new Date(datePublished);
    if (isNaN(parsedDatePublished.getTime())) {
      return { error: 'Invalid date format for datePublished' };
    }
  } else {
    parsedDatePublished = new Date(); // Set to current date if not provided
  }

  try {
    const paper = await prisma.paper.create({
      data: {
        title,
        authors: JSON.parse(authors), // Assuming authors is a JSON string
        keywords: keywords.split(',').map(k => k.trim()),
        key_insights: JSON.parse(key_insights), // Assuming key_insights is a JSON string
        conclusion,
        datePublished: parsedDatePublished,
      },
    });

    return { success: true, paper };
  } catch (error) {
    console.error('Error creating paper:', error);
    return { error: 'Failed to create paper' };
  }
}
