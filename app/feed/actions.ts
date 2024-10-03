"use server";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function generateTweet() {
  console.log("generateTweet function called");
  try {
    // Fetch a random paper ID from the database
    const randomPaper = await prisma.paper.findFirst({
      select: { id: true, title: true },
      orderBy: { id: 'asc' }
    });

    if (!randomPaper) {
      throw new Error("No papers found in the database");
    }

    const paperId = randomPaper.id;
    const paperTitle = randomPaper.title;
    console.log("Using paperId:", paperId);

    const apiUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/openai/create-insight`;
    console.log("Attempting to fetch from:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paperId }),
    });

    console.log("Response status:", response.status);

    const data = await response.json();

    if (!response.ok) {
      console.error("API response error:", response.status, data);
      throw new Error(`Failed to generate content: ${response.status} ${response.statusText}. Details: ${data.details || 'Unknown error'}`);
    }

    console.log("API response data:", data);

    if (!data.content) {
      console.error("Invalid API response:", data);
      throw new Error("Invalid API response: content not found in data");
    }

    // Format the content into a tweet-like structure with line breaks
    const tweet = `${paperTitle} Snapshot: ${data.content.title}\n\n${data.content.summary}\n\nKey Insights:\n${data.content.keyInsights.map((insight: string, index: number) => `${index + 1}. ${insight}`).join('\n')}\n\nConclusion:\n${data.content.conclusion}`;

    return tweet;
  } catch (error) {
    console.error("Error generating tweet:", error);
    throw error;
  }
}
