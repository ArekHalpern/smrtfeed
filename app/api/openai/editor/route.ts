import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
  }

  try {
    const { text, prompt } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant that provides text editing suggestions." },
        { role: "user", content: `Original text: "${text}"\n\nEdit request: ${prompt}\n\nProvide an edited version of the text based on the edit request.` }
      ],
    });

    const suggestion = completion.choices[0].message.content;

    return NextResponse.json({ suggestion });
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error(error.status, error.message);
      return NextResponse.json({ error: error.message }, { status: error.status });
    } else {
      console.error(`Error with OpenAI API request: ${error}`);
      return NextResponse.json({ error: 'An error occurred during your request.' }, { status: 500 });
    }
  }
}
