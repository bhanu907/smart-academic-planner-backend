function generateExamAnswer(topic, subject) {
  return `
${topic} is an important topic in the subject ${subject}. 
It deals with the core ideas and concepts that help in understanding how this area is applied in real-world scenarios.

In simple terms, ${topic} explains the principles involved and how they are used to solve practical problems. 
The concept focuses on understanding the structure, functioning, and relevance of the topic within the subject.

This topic is useful for analyzing problems, interpreting results, and applying theoretical knowledge in exams and applications. 
Students should understand the concept clearly and be able to explain it with suitable examples.

Overall, ${topic} plays a significant role in building strong fundamentals in ${subject} and is commonly asked in university examinations.
`.trim();
}

module.exports = generateExamAnswer;
