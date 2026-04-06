const express = require("express");
const router = express.Router();
const { extractAadhaar } = require("../controllers/aadhaarController");

router.post("/extract", extractAadhaar);

module.exports = router;
