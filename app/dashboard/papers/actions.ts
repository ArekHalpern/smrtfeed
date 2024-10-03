"use server";

import { PrismaClient, Prisma } from "@prisma/client";
import { revalidatePath } from 'next/cache';
import { ExtendedPaper, Author, Insight } from "./_components/PaperModal";

const prisma = new PrismaClient();

export async function getPapers(): Promise<ExtendedPaper[]> {
  try {
    const papers = await prisma.paper.findMany({
      orderBy: { datePublished: "desc" },
    });
    return papers.map(paper => ({
      ...paper,
      authors: paper.authors as unknown as Author[],
      key_insights: paper.key_insights as unknown as Insight[]
    }));
  } catch (error) {
    console.error("Error fetching papers:", error);
    throw error;
  }
}

export async function updatePaper(paper: ExtendedPaper) {
  try {
    const updatedPaper = await prisma.paper.update({
      where: { id: paper.id },
      data: {
        title: paper.title,
        authors: paper.authors as unknown as Prisma.InputJsonValue,
        keywords: paper.keywords,
        key_insights: paper.key_insights as unknown as Prisma.InputJsonValue,
        conclusion: paper.conclusion,
        datePublished: paper.datePublished,
        url: paper.url,
      },
    });
    return { 
      success: true, 
      paper: {
        ...updatedPaper,
        authors: updatedPaper.authors as unknown as Author[],
        key_insights: updatedPaper.key_insights as unknown as Insight[]
      } as ExtendedPaper 
    };
  } catch (error) {
    console.error("Error updating paper:", error);
    return { success: false, error: "Failed to update paper" };
  }
}

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
        authors: result.authors as Prisma.InputJsonValue,
        keywords: result.keywords as string[],
        key_insights: result.key_insights as Prisma.InputJsonValue,
        conclusion: result.conclusion,
        datePublished: new Date(), // Using current date as default
      },
    });
    revalidatePath('/dashboard/papers');
    return { 
      paper: {
        ...paper,
        authors: paper.authors as unknown as Author[],
        key_insights: paper.key_insights as unknown as Insight[]
      } as ExtendedPaper, 
      id: paper.id 
    };
  } catch (error) {
    console.error('Error saving to database:', error);
    throw new Error(`Failed to save to database: ${(error as Error).message}`);
  }
}

export async function extractAndSavePaperFromUrl(url: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    throw new Error('API URL is not defined in the environment variables');
  }

  const response = await fetch(`${apiUrl}/api/v1/extract-url/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
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
        authors: result.authors as Prisma.InputJsonValue,
        keywords: result.keywords as string[],
        key_insights: result.key_insights as Prisma.InputJsonValue,
        conclusion: result.conclusion,
        datePublished: new Date(result.datePublished) || new Date(), // Use the extracted date if available, otherwise use current date
        url: url, // Save the original URL
      },
    });
    revalidatePath('/dashboard/papers');
    return { 
      paper: {
        ...paper,
        authors: paper.authors as unknown as Author[],
        key_insights: paper.key_insights as unknown as Insight[]
      } as ExtendedPaper, 
      id: paper.id 
    };
  } catch (error) {
    console.error('Error saving to database:', error);
    throw new Error(`Failed to save to database: ${(error as Error).message}`);
  }
}

// Remove or comment out the old extractPaperFromUrl function if it's no longer needed