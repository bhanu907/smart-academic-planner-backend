const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: String,
  date: Date,
});

module.exports = mongoose.model("Exam", examSchema);
