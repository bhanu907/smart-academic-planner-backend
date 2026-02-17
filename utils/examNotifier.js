const Exam = require("../models/Exam");
const Notification = require("../models/Notification");

const HOURS_BEFORE = 72;

const checkExams = async () => {
  try {
    const now = new Date();
    console.log("📆 Now:", now.toISOString());

    const exams = await Exam.find();

    for (const exam of exams) {
      if (!exam.date || !exam.user) continue;

      const examDate = new Date(exam.date);
      const hoursLeft = (examDate - now) / (1000 * 60 * 60);

      console.log(
        "📅 Checking:",
        exam.title,
        "| Hours left:",
        hoursLeft.toFixed(2),
      );

      if (hoursLeft < 0) continue;

      if (hoursLeft <= HOURS_BEFORE) {
        // ✅ check by exam id
        const already = await Notification.findOne({
          exam: exam._id,
          user: exam.user,
        });

        if (already) {
          console.log("⛔ Already sent →", exam.title);
          continue;
        }

        await Notification.create({
          user: exam.user,
          exam: exam._id, // ⭐ LINK TO EXAM
          message: exam.title,
          read: false,
        });

        console.log("🔔 Notification CREATED for", exam.title);
      }
    }
  } catch (err) {
    console.log("Notifier error:", err.message);
  }
};

const startExamNotifier = () => {
  console.log("🔔 Exam notifier started");

  checkExams();
  setInterval(checkExams, 60 * 1000);
};

module.exports = startExamNotifier;
