const Exam = require("../models/Exam");
const Notification = require("../models/Notification");

const DAYS_BEFORE = 3; // change 3 or 4 as you like

async function runExamReminders() {
  try {
    const today = new Date();

    const target = new Date();
    target.setDate(today.getDate() + DAYS_BEFORE);

    console.log("⏰ Checking exam reminders for:", target.toDateString());

    const exams = await Exam.find({});

    for (const exam of exams) {
      const d = new Date(exam.date);

      if (
        d.getDate() === target.getDate() &&
        d.getMonth() === target.getMonth() &&
        d.getFullYear() === target.getFullYear()
      ) {
        // prevent duplicates
        const exists = await Notification.findOne({
          user: exam.user,
          message: `Upcoming: ${exam.title} on ${d.toDateString()}`,
        });

        if (!exists) {
          await Notification.create({
            user: exam.user,
            message: `Upcoming: ${exam.title} on ${d.toDateString()}`,
            cleared: false,
          });

          console.log("🔔 Reminder created for:", exam.title);
        }
      }
    }
  } catch (err) {
    console.log("❌ Reminder error:", err.message);
  }
}

module.exports = runExamReminders;
