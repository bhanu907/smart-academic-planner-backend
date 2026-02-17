const express = require("express");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const File = require("../models/File");
const Notification = require("../models/Notification");
const { generateAndStoreQA } = require("../controllers/qnaController");
const { extractAndSaveExams } = require("../utils/extractExam"); // ⭐ NEW

const router = express.Router();

// Multer
const upload = multer({
  storage: multer.memoryStorage(),
});

// 🔥 Helper → get user from token
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

// ================= UPLOAD FILES =================
router.post("/", upload.array("files"), async (req, res) => {
  try {
    const userId = getUserFromToken(req);

    console.log("👤 Upload request from user:", userId);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const savedFiles = [];

    for (const file of req.files) {
      const subject = file.originalname
        .replace(".pdf", "")
        .trim()
        .toUpperCase();

      console.log("📄 Registering subject:", subject);

      // ✅ Save file
      const saved = await File.create({
        name: subject,
        user: userId,
      });

      // ✅ Notification
      try {
        const note = await Notification.create({
          message: `Uploaded ${subject}`,
          user: userId,
        });

        console.log("🔔 Notification saved:", note._id);
      } catch (err) {
        console.error("❌ Notification save failed:", err.message);
      }

      // ✅ Q&A
      try {
        await generateAndStoreQA(subject);
      } catch (err) {
        console.error("⚠️ Q&A generation failed:", err.message);
      }

      // ⭐⭐⭐ NEW MAGIC ⭐⭐⭐
      try {
        await extractAndSaveExams(file.buffer, userId);
      } catch (err) {
        console.error("⚠️ Exam extraction failed:", err.message);
      }

      savedFiles.push(saved);
    }

    res.json(savedFiles);
  } catch (err) {
    console.error("❌ Upload failed:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});

// ================= GET FILES =================
router.get("/", async (req, res) => {
  try {
    const userId = getUserFromToken(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const files = await File.find({ user: userId }).sort({
      uploadedAt: -1,
    });

    res.json(files);
  } catch (err) {
    console.error("❌ Fetch files failed:", err.message);
    res.status(500).json([]);
  }
});

// ================= DELETE FILE =================
router.delete("/:id", async (req, res) => {
  try {
    const userId = getUserFromToken(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await File.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Delete failed:", err.message);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
