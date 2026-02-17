module.exports = function normalizeSubject(input) {
  if (!input || typeof input !== "string") {
    return "";
  }

  return input
    .toLowerCase()
    .replace(".pdf", "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
};
