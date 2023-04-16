export function generatePrompt(title: string, language: string) {
  return (
    "You are a helpful " +
    language +
    " language instructor and a student is asking about a word. " +
    "You are going to help them understand the word by explaining in English and giving examples in " +
    language +
    ".\n" +
    "Start by giving them the definition of the word with an example as well as the pronunciation and part of speech. " +
    "Give them a synonym and an antonym too.\n" +
    "The word is " +
    title +
    "."
  );
}

export function generatePromptV2(title: string, language: string) {
  return (
    "You are being presented with a word or a phrase in " +
    language +
    ". Your job is to help me understand the word by explaining it in English and " +
    "giving one full sentence example in " +
    language +
    " with translations in English.\n" +
    "In your response give the definition of the word as well as the pronunciation and part of speech.\n" +
    "Synonyms and antonyms are optional but if given should be in " +
    language +
    ".\n" +
    "Your response must be formatted as a JSON object with the following keys: definition, pronunciation, partOfSpeech, examples, synonyms, antonyms.\n" +
    "The input is " +
    title +
    "."
  );
}

export function generatePromptV3(title: string, language: string) {
  return (
    "You are being presented with a word or a phrase in " +
    language +
    ". Your job is to help me understand the word by explaining it in English and " +
    "giving one full sentence example in " +
    language +
    " with translations in English.\n" +
    "In your response give the definition of the word as well as the pronunciation and part of speech.\n" +
    "Your response must be nicely formatted.\n" +
    "The input is " +
    title +
    "."
  );
}

export function generateRecommendationPrompt(
  words: string[],
  language: string,
  topic: string
) {
  return (
    "I am showing you a list of words or phrases that the user has entered into a collection. " +
    "The topic of this collection is " +
    topic +
    ". The use-case is for the user to learn " +
    language +
    ".\n" +
    "Your job is to recommend a word in " +
    language +
    "that the user should learn next.\n" +
    "Your response should be a single word that is not already in the list. Format the response in all lower case and without any punctuation.\n" +
    "The words are: " +
    words.join(", ") +
    "."
  );
}
