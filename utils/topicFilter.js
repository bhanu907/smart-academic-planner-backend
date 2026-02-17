function isValidExamTopic(topic) {
  if (!topic) return false;

  const t = topic.toLowerCase();

  // ❌ reject garbage
  const blacklist = [
    "http",
    "www",
    "pdf",
    "edition",
    "press",
    "youtube",
    "playlist",
    "mit",
    "nptel",
    "coursera",
    "author",
    "mcgraw",
    "wiley",
    "sarkar",
    "tom mitchell",
    "lkm",
    "intro -",
    "5nov",
    "unit module",
    "micro syllabus",
  ];

  if (blacklist.some((word) => t.includes(word))) return false;

  // ❌ too short / meaningless
  if (topic.length < 6) return false;

  // ❌ numbers / codes only
  if (/^\d+$/.test(topic)) return false;

  return true;
}

module.exports = { isValidExamTopic };
