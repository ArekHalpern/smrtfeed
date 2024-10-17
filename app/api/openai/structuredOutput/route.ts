import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { text } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that converts unstructured text into structured JSON. Analyze the given text and create an appropriate JSON structure based on its content.",
        },
        { role: "user", content: text },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (content === null) {
      throw new Error("Received null content from OpenAI");
    }

    const structuredOutput = JSON.parse(content);
    return NextResponse.json({ structuredOutput });
  } catch (error) {
    console.error("Error in structuredOutput route:", error);
    return NextResponse.json({ error: "Failed to process the text" }, { status: 500 });
  }
}
