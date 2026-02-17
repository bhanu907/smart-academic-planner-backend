const express = require("express");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const { extractAndSaveExams } = require("../utils/extractExam");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

// get user
function getUserFromToken(req) {
  const token = req.headers.authorization;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id || decoded.userId;
  } catch {
    return null;
  }
}

/* ================= UPLOAD TIMETABLE ================= */
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (!req.file) return res.status(400).json({ message: "No file" });

    await extractAndSaveExams(req.file.buffer, userId);

    res.json({ message: "Exams extracted" });
  } catch (err) {
    console.log("❌ Extraction error:", err.message);
    res.status(500).json({ message: "Failed" });
  }
});

module.exports = router;
