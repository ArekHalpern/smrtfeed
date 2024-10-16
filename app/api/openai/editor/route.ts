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

    // Log the input
    console.log('Input:');
    console.log('Text:', text);
    console.log('Prompt:', prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant that provides text editing suggestions. Only provide the edited text, no other text or comments. Do not include any markdown formatting. Do not include any quotation marks." },
        { role: "user", content: `Original text: "${text}"\n\nEdit request: ${prompt}\n\nProvide an edited version of the text based on the edit request.` }
      ],
    });

    const suggestion = completion.choices[0].message.content;

    // Log the output
    console.log('Output:');
    console.log('Suggestion:', suggestion);

    return NextResponse.json({ suggestion });
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error('OpenAI API Error:', error.status, error.message);
      return NextResponse.json({ error: error.message }, { status: error.status });
    } else {
      console.error(`Error with OpenAI API request:`, error);
      return NextResponse.json({ error: 'An error occurred during your request.' }, { status: 500 });
    }
  }
}
