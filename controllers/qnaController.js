const fs = require("fs");
const path = require("path");

/* ================= LOAD KNOWLEDGE ================= */
function loadKnowledge(subject) {
  const filePath = path.join(__dirname, "../knowledge", `${subject}.json`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

/* ================= NO-OP FOR UPLOAD ================= */
async function generateAndStoreQA(subject) {
  console.log("📄 Subject registered:", subject);
}

/* ================= FETCH Q&A (UNIVERSAL) ================= */
function getQnABySubject(req, res) {
  try {
    const subject = req.params.subject.toUpperCase();
    const data = loadKnowledge(subject);

    if (!data || !data.units) {
      return res.json([]);
    }

    const result = [];

    Object.entries(data.units).forEach(([unitName, unitContent]) => {
      Object.entries(unitContent).forEach(([key, value]) => {
        // ✅ CASE 1: Question → Answer (GB)
        if (typeof value === "string") {
          result.push({
            unit: unitName,
            question: key,
            answer: value,
          });
        }

        // ✅ CASE 2: Topic → Object (DS / ML)
        else if (typeof value === "object" && value !== null) {
          result.push({
            unit: unitName,
            question: key,
            answer: Object.values(value).join("\n\n"),
          });
        }

        // ✅ SAFETY FALLBACK
        else {
          result.push({
            unit: unitName,
            question: key,
            answer: String(value),
          });
        }
      });
    });

    res.json(result);
  } catch (err) {
    console.error("❌ Fetch Q&A failed:", err.message);
    res.status(500).json([]);
  }
}

module.exports = {
  generateAndStoreQA,
  getQnABySubject,
};
