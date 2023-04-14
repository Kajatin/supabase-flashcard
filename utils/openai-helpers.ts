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
