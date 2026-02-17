const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sender: String, // "user" or "bot"
    text: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Chat", chatSchema);
