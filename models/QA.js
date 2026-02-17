const mongoose = require("mongoose");

const QASchema = new mongoose.Schema({
  subject: String,
  unit: String,
  topic: String,
  question: String,
  answer: String,
});

module.exports = mongoose.model("QA", QASchema);
