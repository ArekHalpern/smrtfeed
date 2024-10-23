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

    const paper = await prisma.paper.findUnique({
      where: { id: paperId },
    });

    if (!paper) {
      console.log("Paper not found");
      return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
    }

    console.log("Paper details:", {
      title: paper.title,
      authors: paper.authors,
      keywords: paper.keywords,
      key_insights: paper.key_insights,
    });

    const prompt = `You are tasked with generating a concise summary about the following research paper:
    Title: ${paper.title}
    Authors: ${JSON.stringify(paper.authors)}
    Keywords: ${paper.keywords?.join(', ') || 'N/A'}
    Key Insights: ${JSON.stringify(paper.key_insights)}
    
    Please provide a summary in the following JSON format:
    {
      "summary": "A concise summary of the paper (max 50 words)"
    }

    Ensure that the output is valid JSON and can be parsed directly. Do not include any markdown formatting or code blocks.`;

    console.log("Sending prompt to OpenAI:", prompt);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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

    // Combine the generated summary with the existing key insights
    const result = {
      summary: parsedContent.summary,
      keyInsights: Array.isArray(paper.key_insights)
        ? paper.key_insights
            .filter((insight): insight is { description: string } => 
              typeof insight === 'object' && insight !== null && 'description' in insight)
            .map(insight => insight.description)
            .slice(0, 5)
        : []
    };

    return NextResponse.json({ success: true, content: result });
  } catch (error) {
    console.error('Error generating content:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to generate content', details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Failed to generate content', details: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
