const pdfParse = require("pdf-parse");

/**
 * Extract text from PDF buffer
 * @param {Buffer} buffer
 * @returns {Promise<string>}
 */
module.exports = async function extractPdfText(buffer) {
  if (!buffer) {
    throw new Error("PDF buffer is missing");
  }

  const data = await pdfParse(buffer);
  return data.text || "";
};
