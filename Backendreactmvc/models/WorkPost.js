const mongoose = require("mongoose");

const workPostSchema = new mongoose.Schema({
  tailorEmail: { type: String, required: true }, // links to TailorProfile.emailid
  title:       { type: String, required: true }, // e.g. "Bridal Lehenga"
  description: { type: String, default: "" },    // short note about the work
  price:       { type: String, default: "" },    // e.g. "₹1200" or "₹800–₹1500"
  imageUrl:    { type: String, required: true }, // Cloudinary URL
  createdAt:   { type: Date, default: Date.now },
});

module.exports = mongoose.model("WorkPost", workPostSchema);
























