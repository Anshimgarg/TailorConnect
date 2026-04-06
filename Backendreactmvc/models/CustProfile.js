const mongoose = require("mongoose");

const CustSchema = new mongoose.Schema({
  emailid: String,
  name: String,
  address: String,
  city: String,
  state: String,
  gender: String,
  profilepic: String   // ✅ Cloudinary image URL

});

module.exports = mongoose.model("custprofiles", CustSchema);