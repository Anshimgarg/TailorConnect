const express = require("express");
const router = express.Router();
const c = require("../controllers/userController");
const auth = require("../middleware/auth");   // ← NEW

router.post("/signup",c.signup);
router.post("/login",c.login);
router.post("/saveprofile",      auth, c.saveProfile);
router.post("/updateprofile",    auth, c.updateProfile);
router.get("/getprofile/:email", auth, c.getProfile);

module.exports = router;