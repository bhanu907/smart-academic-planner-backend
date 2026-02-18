const express = require("express");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const pdf = require("pdf-parse");
const Exam = require("../models/Exam");
const Timetable = require("../models/timetable");

const router = express.Router();

/* ================= MULTER ================= */
const upload = multer({ storage: multer.memoryStorage() });

/* ================= TOKEN ================= */
function getUserFromToken(req) {
  const token = req.headers.authorization;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id || decoded.userId;
  } catch (err) {
    return null;
  }
}

/* ================= GET EXAMS ================= */
router.get("/", async (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) return res.status(401).json([]);

    const exams = await Exam.find({ user: userId }).sort({ date: 1 });
    res.json(exams);
  } catch (err) {
    console.log(err);
    res.json([]);
  }
});

/* ================= GET TIMETABLE FILES ================= */
router.get("/timetables", async (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) return res.status(401).json([]);

    const files = await Timetable.find({ user: userId });
    res.json(files);
  } catch (err) {
    res.json([]);
  }
});

/* ================= DELETE TIMETABLE ================= */
router.delete("/timetable/:id", async (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) return res.status(401).json({});

    await Timetable.deleteOne({ _id: req.params.id, user: userId });
    await Exam.deleteMany({ user: userId });

    res.json({ message: "Deleted" });
  } catch (err) {
    res.json({});
  }
});

/* ================= UPLOAD & EXTRACT ================= */
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("📄 Timetable uploaded for:", userId);

    await Timetable.create({
      user: userId,
      filename: req.file.originalname,
    });

    const data = await pdf(req.file.buffer);
    const text = data.text;

    await Exam.deleteMany({ user: userId });

    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l);

    const dateRegex = /(\d{2})-(\d{2})-(\d{4})$/;

    let extractedCount = 0;

    console.log("🧠 Total lines:", lines.length);

    /* ===== ORIGINAL EXTRACTION (UNCHANGED) ===== */
    for (let line of lines) {
      const match = line.match(dateRegex);

      if (match) {
        const day = parseInt(match[1]);
        const month = parseInt(match[2]) - 1;
        const year = parseInt(match[3]);

        const examDate = new Date(year, month, day);

        const title = line.replace(dateRegex, "").trim();

        if (!title || title.length < 4) continue;

        await Exam.create({
          user: userId,
          title,
          date: examDate,
        });

        extractedCount++;
        console.log("✅", examDate, "→", title);
      }
    }

    /* ===== NEW SAFETY FALLBACK (ADDED ONLY) ===== */
    if (extractedCount === 0) {
      console.log("⚠ No exams found with strict method. Trying fallback...");

      const fallbackRegex = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/g;
      const matches = [...text.matchAll(fallbackRegex)];

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

        console.log("🛟 Fallback saved:", examDate);
      }
    }

    res.json({ message: "Timetable processed successfully ✅" });
  } catch (err) {
    console.log("❌ Extraction error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = router;
