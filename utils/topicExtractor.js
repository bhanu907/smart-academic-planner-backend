function clean(t) {
  return t.replace(/\s+/g, " ").trim();
}

function valid(t) {
  if (!t) return false;
  if (t.split(" ").length < 2) return false;
  if (/book|reference|edition|press|http|www|page/i.test(t)) return false;
  return true;
}

function topicExtractor(text) {
  const lines = text.split("\n").map(clean).filter(Boolean);

  const units = [];
  let current = null;

  for (const line of lines) {
    if (/^unit\s*[–\-:]?\s*(\d+|[ivx]+)/i.test(line)) {
      current = { unitName: line.toUpperCase(), concepts: [] };
      units.push(current);
      continue;
    }

    if (!current) continue;

    line.split(/[-–,]/).forEach((p) => {
      if (valid(p)) current.concepts.push(p);
    });
  }

  units.forEach((u) => {
    u.concepts = [...new Set(u.concepts)].slice(0, 8); // exam-focused
  });

  return units;
}

module.exports = topicExtractor;
