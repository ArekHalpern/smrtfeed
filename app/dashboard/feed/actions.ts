"use server";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getPapers() {
  try {
    const papers = await prisma.paper.findMany({
      select: { id: true, title: true, datePublished: true },
      orderBy: { datePublished: 'desc' }
    });
    return papers;
  } catch (error) {
    console.error("Error fetching papers:", error);
    throw error;
  }
}

export async function getRandomPaperId() {
  try {
    const papersCount = await prisma.paper.count();
    const skip = Math.floor(Math.random() * papersCount);
    const randomPaper = await prisma.paper.findFirst({
      skip: skip,
      select: { id: true }
    });
    return randomPaper?.id || null;
  } catch (error) {
    console.error("Error fetching random paper:", error);
    throw error;
  }
}

export async function generateTweet(paperId: string) {
  console.log("generateTweet function called");
  try {
    const paper = await prisma.paper.findUnique({
      where: { id: paperId },
      select: { id: true, title: true, datePublished: true }
    });

    if (!paper) {
      throw new Error("Paper not found");
    }

    const paperTitle = paper.title;
    const datePublished = paper.datePublished.toISOString().split('T')[0]; // Format as YYYY-MM-DD
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
    const tweet = `"${paperTitle}"\nPublished: ${datePublished}\n\nOverview:\n${data.content.summary}\n\nKey Insights:\n${data.content.keyInsights.map((insight: string, index: number) => `${index + 1}. ${insight}`).join('\n')}\n\nConclusion:\n${data.content.conclusion}`;

    return tweet;
  } catch (error) {
    console.error("Error generating tweet:", error);
    throw error;
  }
}
