const express = require("express");
const router = express.Router();
const { extractAadhaarData } = require("../controllers/ocrController");

router.post("/aadhaar", extractAadhaarData);

module.exports = router;
