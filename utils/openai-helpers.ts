export function generatePrompt(title: string, language: string) {
  return [
    { role: "system", content: "You are a helpful language assistant." },
    { role: "system", content: "You must provide your response as a valid JSON object." },
    { role: "system", content: "You are being presented with a word or a phrase in " + language + ". Your job is to help me understand the word by explaining it in English and giving one full sentence example in " + language + " with translations in English." },
    { role: "user", content: "The word is 'goddag'." },
    { role: "assistant", content: JSON.stringify(exampleTranslationData) },
    { role: "user", content: "The word is '" + title + "'." },
  ];
}

export function generateRecommendationPrompt(words: string[], language: string, topic: string) {
  return [
    { role: "system", content: "You are a helpful language assistant." },
    { role: "system", content: "You must provide your response as a valid JSON object." },
    { role: "system", content: "You are shown a list of words or phrases that the user has entered into a collection. Your job is to recommend a word in " + language + " that the user should learn next. Your response should be a single word that is not already in the list. Format the response in all lower case and without any punctuation." },
    { role: "user", content: "The topic of this collection is Travel. The words are: lufthavn, bil, afgang." },
    { role: "assistant", content: JSON.stringify({ word: "fly" }) },
    { role: "user", content: "The topic of this collection is " + topic + ". The words are: " + words.join(", ") + "." },
  ];
}

export type RecommendationData = {
  word: string;
};

export type Example = {
  native: string;
  translation: string;
};

export type TranslationData = {
  translation: string;
  explanation: string;
  pronunciation: string;
  partOfSpeech: string;
  examples: Example[];
  synonyms: string[];
  antonyms: string[];
};

export const exampleTranslationData: TranslationData = {
  translation: "hello",
  explanation: "It is used as a greeting.",
  pronunciation: "goh-dahg",
  partOfSpeech: "interjection",
  examples: [{ native: "Goddag! Hvordan har du det?", translation: "Hello! How are you?" }],
  synonyms: ["hej", "hallo"],
  antonyms: ["farvel", "hej hej"],
};
