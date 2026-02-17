const express = require("express");
const axios = require("axios");
const { getQnABySubject } = require("../controllers/qnaController");

const router = express.Router();

/* ================= GET Q&A BY SUBJECT ================= */
router.get("/:subject", getQnABySubject);

/* ================= DOUBT CLARIFIER ================= */
router.post("/doubt", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ answer: "Please ask a question" });
    }

    const response = await axios.post(
      "https://api.cohere.ai/v2/chat",
      {
        model: "command-a-03-2025", // ✅ NEW MODEL
        messages: [
          {
            role: "user",
            content: question,
          },
        ],
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const answer = response.data.message?.content?.[0]?.text || "No reply";

    res.json({ answer });
  } catch (err) {
    console.error("Cohere error:", err.response?.data || err.message);
    res.status(500).json({ answer: "AI error" });
  }
});

module.exports = router;
