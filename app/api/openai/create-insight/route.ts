import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import prisma from '@/lib/db/prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  console.log("API route handler called");
  try {
    const { paperId } = await request.json();
    console.log("Received paperId:", paperId);

    let paper;
    if (paperId) {
      paper = await prisma.paper.findUnique({
        where: { id: paperId },
      });
    } else {
      // If no paperId is provided, select a random paper
      const paperCount = await prisma.paper.count();
      const skip = Math.floor(Math.random() * paperCount);
      paper = await prisma.paper.findFirst({
        skip: skip,
      });
    }

    console.log("Found paper:", paper ? "Yes" : "No");

    if (!paper) {
      console.log("Paper not found");
      return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
    }

    console.log("Paper details:", {
      title: paper.title,
      authors: paper.authors,
      keywords: paper.keywords,
      key_insights: paper.key_insights,
      conclusion: paper.conclusion,
    });

    const prompt = `You are tasked with generating a summarization about the following research paper:
    Authors: ${JSON.stringify(paper.authors)}
    Keywords: ${paper.keywords.join(', ')}
    Key Insights: ${JSON.stringify(paper.key_insights)}
    
    Please provide a summary in the following JSON format:
    {
      "summary": "A concise summary of the paper (max 50 words)",
      "keyInsights": [
        "Key insight 1",
        "Key insight 2",
        "Key insight 3",
        "Key insight 4",
        "Key insight 5"
      ]
    }

    Ensure that the output is valid JSON and can be parsed directly. Do not include any markdown formatting or code blocks.`;

    console.log("Sending prompt to OpenAI:", prompt);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Changed from "gpt-4o-mini" to a valid model name
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const generatedContent = response.choices[0].message.content?.trim();
    console.log("Generated content:", generatedContent);

    // Parse the generated content as JSON
    let parsedContent;
    try {
      parsedContent = JSON.parse(generatedContent || '{}');
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return NextResponse.json({ error: 'Failed to parse generated content', details: generatedContent }, { status: 500 });
    }

    return NextResponse.json({ success: true, content: parsedContent });
  } catch (error) {
    console.error('Error generating content:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to generate content', details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Failed to generate content', details: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
