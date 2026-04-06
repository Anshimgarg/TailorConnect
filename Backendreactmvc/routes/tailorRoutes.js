const express = require("express");
const router = express.Router();
const { 
    saveProfile,
    findProfile,
    updateProfile,
    deleteProfile,
 } = require("../controllers/tailorController");

router.post("/save", saveProfile);
router.get("/find/:emailid", findProfile);
router.put("/update/:emailid", updateProfile);
router.delete("/delete/:emailid", deleteProfile);
router.get("/contact/:contact", require("../controllers/tailorController").findByContact);
router.post("/rate", require("../controllers/tailorController").submitReview);

module.exports = router;
