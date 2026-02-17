const pdf = require("pdf-parse");
const Exam = require("../models/Exam");

exports.extractAndSaveExams = async (buffer, userId) => {
  const data = await pdf(buffer);
  const text = data.text;

  console.log("📄 PDF TEXT:\n", text);

  // example patterns: 18-02-2026 or 18/02/2026
  const regex = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/g;

  const matches = [...text.matchAll(regex)];

  console.log("📅 Dates found:", matches.length);

  for (const m of matches) {
    const day = parseInt(m[1]);
    const month = parseInt(m[2]) - 1;
    const year = parseInt(m[3]);

    const examDate = new Date(year, month, day);

    await Exam.create({
      user: userId,
      title: "Exam",
      date: examDate,
    });

    console.log("✅ Saved:", examDate);
  }
};
