import OpenAI from "openai";

export async function POST(request: Request) {
  const { prompt } = await request.json();

  if (!prompt) {
    return new Response("No prompt provided", { status: 400 });
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const completion: OpenAI.Chat.Completions.ChatCompletion = await openai.chat.completions.create({
      messages: prompt,
      model: "gpt-4o-mini",
      max_tokens: 500,
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const response = completion.choices[0].message.content?.trim();

    if (!response) {
      return new Response("No text was generated", { status: 500 });
    }

    return new Response(response, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error generating text", { status: 500 });
  }
}
