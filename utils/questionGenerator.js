function generateQuestionsFromText(text) {
  const keywords = text
    .split(/[,.\n]/)
    .map((t) => t.trim())
    .filter((t) => t.length > 4)
    .slice(0, 5); // limit

  const questions = [];

  keywords.forEach((k) => {
    questions.push(`What is ${k}?`);
    questions.push(`Explain ${k}.`);
  });

  return questions;
}

module.exports = generateQuestionsFromText;
