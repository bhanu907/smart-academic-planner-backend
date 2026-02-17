const mongoose = require("mongoose");

const TimetableSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    filename: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Timetable", TimetableSchema);
