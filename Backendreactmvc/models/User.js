const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  emailid: String,
  pwd: String,
  utype: String,
  status: Boolean,
  dos: { type: Date, default: Date.now }
});

module.exports = mongoose.model("users", UserSchema);