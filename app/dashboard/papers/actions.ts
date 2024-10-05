"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from 'next/cache';
import { ExtendedPaper, Author, Insight } from "./_components/PaperModal";
import prisma from '@/lib/db/prisma';

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
        diagrams: result.diagrams || [], // Add this line to include diagrams
      },
    });
    revalidatePath('/dashboard/papers');
    return { 
      paper: {
        ...paper,
        authors: paper.authors as unknown as Author[],
        key_insights: paper.key_insights as unknown as Insight[],
        diagrams: paper.diagrams as string[], // Add this line
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

  try {
    const response = await fetch(`${apiUrl}/api/v1/extract-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error('Failed to extract paper information');
    }

    const paperData = await response.json();

    // Validate and format the date
    let datePublished;
    if (paperData.datePublished) {
      const parsedDate = new Date(paperData.datePublished);
      if (!isNaN(parsedDate.getTime())) {
        datePublished = parsedDate;
      } else {
        // If the date is invalid, use the current date as a fallback
        datePublished = new Date();
        console.warn('Invalid date provided. Using current date as fallback.');
      }
    } else {
      // If no date is provided, use the current date
      datePublished = new Date();
      console.warn('No date provided. Using current date as fallback.');
    }

    // Create the paper in the database
    const paper = await prisma.paper.create({
      data: {
        ...paperData,
        datePublished,
      },
    });

    revalidatePath('/dashboard/papers');
    return { success: true, paper };
  } catch (error) {
    console.error('Error extracting or saving paper:', error);
    return { success: false, error: (error as Error).message };
  }
}

// Remove or comment out the old extractPaperFromUrl function if it's no longer needed

export async function deletePaper(paperId: string) {
  try {
    await prisma.paper.delete({
      where: { id: paperId },
    });
    revalidatePath('/dashboard/papers');
    return { success: true };
  } catch (error) {
    console.error("Error deleting paper:", error);
    return { success: false, error: "Failed to delete paper" };
  }
}