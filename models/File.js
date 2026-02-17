const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },

  // 🔥 NEW: who uploaded
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("File", fileSchema);
