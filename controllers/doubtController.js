const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

exports.askDoubt = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ answer: "Ask something bro 🙂" });
    }

    // ✅ NEW CHAT API
    const response = await cohere.chat({
      model: "command-r-plus",
      message: question,
      temperature: 0.7,
    });

    res.json({ answer: response.text });
  } catch (error) {
    console.log("Cohere error:", error.message);
    res.status(500).json({ answer: "AI error" });
  }
};
