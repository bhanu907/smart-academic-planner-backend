const express = require("express");
const { getQnABySubject } = require("../controllers/qnaController");

const router = express.Router();

router.get("/:subject", getQnABySubject);

module.exports = router;
