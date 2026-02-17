const express = require("express");
const jwt = require("jsonwebtoken");
const Chat = require("../models/Chat");

const router = express.Router();

function getUser(req) {
  const token = req.headers.authorization;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch {
    return null;
  }
}

//
// GET → load chat history
//
router.get("/", async (req, res) => {
  const userId = getUser(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const chats = await Chat.find({ user: userId }).sort({ createdAt: 1 });
  res.json(chats);
});

//
// POST → save message
//
router.post("/", async (req, res) => {
  const userId = getUser(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { sender, text } = req.body;

  const chat = await Chat.create({
    user: userId,
    sender,
    text,
  });

  res.json(chat);
});

module.exports = router;
