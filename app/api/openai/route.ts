import { cookies } from "next/headers";
import { Configuration, OpenAIApi } from "openai";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const key = cookieStore.get("openai-api-key")?.value;
  const { prompt } = await request.json();

  if (!key) {
    return new Response("No API key provided", { status: 401 });
  }

  if (!prompt) {
    return new Response("No prompt provided", { status: 400 });
  }

  const configuration = new Configuration({
    apiKey: key,
  });
  const openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 500,
      temperature: 0.5,
    });

    return new Response(
      completion.data.choices[0].text?.trim() || "No text was generated",
      { status: 200 }
    );
  } catch (error) {
    return new Response("Error generating text", { status: 500 });
  }
}
