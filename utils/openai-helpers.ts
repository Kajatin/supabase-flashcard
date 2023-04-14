import { Configuration, OpenAIApi } from "openai";

const key = localStorage.getItem("openai-api-key") || "";

const configuration = new Configuration({
  apiKey: key,
});
const openai = new OpenAIApi(configuration);

export async function generateText(prompt: string) {
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt || "No prompt was provided, do not do anything",
      max_tokens: 500,
      temperature: 0.5,
    });

    return completion.data.choices[0].text?.trim() || "No text was generated";
  } catch (error) {
    console.error(error);
    return "Error generating text - try adding your API key under settings";
  }
}

export function generatePrompt(title: string) {
  return (
    "You are a helpful Danish language instructor and a student is asking about a word." +
    "You are going to help them understand the word by explaining in English and giving examples in Danish." +
    "Start by giving them the definition of the word with an example as well as the pronunciation and part of speech." +
    "Give them a synonym and an antonym too.\n" +
    "The word is " +
    title +
    "."
  );
}
