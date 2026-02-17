const mongoose = require("mongoose");

const qnaSchema = new mongoose.Schema({
  subject: String,
  unit: String,
  unitNumber: Number,
  topic: String,
  question: String,
  answer: String,
});

qnaSchema.index({ subject: 1, unitNumber: 1, topic: 1 }, { unique: true });

module.exports = mongoose.model("Qna", qnaSchema);
