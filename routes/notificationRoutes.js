const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Notification = require("../models/Notification");

/* ================= GET USER FROM TOKEN ================= */
function getUserFromToken(req) {
  let token = req.headers.authorization;

  if (!token) return null;

  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id || decoded.userId;
  } catch (err) {
    return null;
  }
}

/* ================= GET NOTIFICATIONS ================= */
router.get("/", async (req, res) => {
  const userId = getUserFromToken(req);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const data = await Notification.find({
      user: userId,
      read: false, // ⭐ THIS WAS THE BUG
    }).sort({ createdAt: -1 });

    console.log("🔔 Sending notifications:", data.length);
    res.json(data);
  } catch (err) {
    res.status(500).json([]);
  }
});

/* ================= CLEAR NOTIFICATIONS ================= */
router.delete("/", async (req, res) => {
  const userId = getUserFromToken(req);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await Notification.updateMany({ user: userId }, { $set: { read: true } });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({});
  }
});

module.exports = router;
