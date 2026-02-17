const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function extractCleanUnits(text, subject) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are a university syllabus parser.

Subject: ${subject}

TASK:
- Extract ONLY UNIT I, UNIT II, UNIT III, UNIT IV, UNIT V
- Under each unit, list ONLY academic TOPICS
- STRICTLY EXCLUDE:
  books, authors, years, URLs, hours, objectives, outcomes, COs, Bloom levels
- Maintain the correct UNIT ORDER
- Do NOT invent topics
- Do NOT merge units

Return STRICT JSON ONLY in this format:

{
  "UNIT I": ["topic1", "topic2"],
  "UNIT II": ["topic1"],
  "UNIT III": [],
  "UNIT IV": [],
  "UNIT V": []
}

SYLLABUS TEXT:
${text}
`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text();

  const json = raw.match(/\{[\s\S]*\}/);
  if (!json) throw new Error("Invalid syllabus JSON");

  return JSON.parse(json[0]);
}

module.exports = { extractCleanUnits };
