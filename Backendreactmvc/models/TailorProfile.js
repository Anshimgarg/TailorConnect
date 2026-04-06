const mongoose = require("mongoose");

const tailorSchema = new mongoose.Schema({
  emailid: String,
  name: String,
  contact: String,
  aadhaarPic:String,
  address: String,
  city: String,
  aadharno: String,
  category: String,
  spl: String,
  social: String,
  since: String,
  worktype: String,
  shopadr: String,
  shopcity: String,
  otherinfo: String,
  profilePic: String,

  mobile: String, // Ensure you have this field to search by
  ratings: [{
    customerEmail: String,
    stars: Number,
    review: String,
    date: { type: Date, default: Date.now }
  }],
  averageRating: { type: Number, default: 0 }
});

module.exports = mongoose.model("TailorProfile", tailorSchema);
