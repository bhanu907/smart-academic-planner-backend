const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const fileRoutes = require("./routes/files");
const qaRoutes = require("./routes/qa");
const notificationRoutes = require("./routes/notificationRoutes");
const examRoutes = require("./routes/examRoutes");
const runExamReminders = require("./utils/examReminder");
const startExamNotifier = require("./utils/examNotifier");

// ⭐ NEW
const chatRoutes = require("./routes/chatRoutes");

const app = express();

/* ================= MIDDLEWARE ================= */

// ✅ PRODUCTION CORS CONFIG
app.use(
  cors({
    origin: [
      "http://localhost:3000", // local frontend
      "http://localhost:5173", // vite
      "https://your-frontend-name.netlify.app", // 🔥 replace after deploy
    ],
    credentials: true,
  }),
);

app.use(express.json());

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/qa", qaRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/exams", examRoutes);

// ⭐ NEW
app.use("/api/chat", chatRoutes);

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.send("🚀 Smart Academic Planner Backend Running");
});

/* ================= DATABASE ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    // ⭐ START ONLY AFTER DB CONNECTS
    startExamNotifier();

    if (runExamReminders) {
      runExamReminders();
    }
  })
  .catch((err) => console.error("❌ MongoDB error:", err.message));

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("🔥 SERVER RUNNING 🔥");
  console.log(`🚀 Server running on port ${PORT}`);
});
