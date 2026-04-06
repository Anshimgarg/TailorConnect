const Tailor = require("../models/TailorProfile");
const cloudinary = require("../config/cloudinary");

exports.saveProfile = async (req, res) => {
  try {
    let imgUrl = "";

    if (req.body.profilePic) {
      const upload = await cloudinary.uploader.upload(
        req.body.profilePic,
        { folder: "tailors" }
      );
      imgUrl = upload.secure_url;
    }

    const profile = new Tailor({
      ...req.body,
      profilePic: imgUrl,
    });

    await profile.save();
    res.json({ message: "Profile saved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🔍 FIND by email
exports.findProfile = async (req, res) => {
  try {
    const { emailid } = req.params;
    const profile = await Tailor.findOne({ emailid });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✏️ UPDATE by email
exports.updateProfile = async (req, res) => {
  try {
    const { emailid } = req.params;

    let imgUrl = req.body.profilePic || "";
    if (req.body.profilePic && req.body.profilePic.startsWith("data:")) {
      const upload = await cloudinary.uploader.upload(req.body.profilePic, { folder: "tailors" });
      imgUrl = upload.secure_url;
    }

    const updated = await Tailor.findOneAndUpdate(
      { emailid },
      { ...req.body, profilePic: imgUrl },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Profile not found" });
    res.json({ message: "Profile updated successfully", profile: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🗑️ DELETE by email
exports.deleteProfile = async (req, res) => {
  try {
    const { emailid } = req.params;
    const deleted = await Tailor.findOneAndDelete({ emailid });
    if (!deleted) return res.status(404).json({ message: "Profile not found" });
    res.json({ message: "Profile deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🔍 Find tailor by mobile number
exports.findByContact = async (req, res) => {
  try {
    const { contact } = req.params;
    const tailor = await Tailor.findOne({ contact });
    if (!tailor) return res.status(404).json({ message: "Tailor not found" });
    res.json(tailor);
  } catch (err) {
    res.status(500).json({ message: "Search error" });
  }
};

// ⭐ Submit Rating & Review
exports.submitReview = async (req, res) => {
  const { tailorId, stars, review, customerEmail } = req.body;
  try {
    const tailor = await Tailor.findById(tailorId);
    
    // Push new review
    tailor.ratings.push({ customerEmail, stars, review });

    // Update Average
    const totalStars = tailor.ratings.reduce((acc, curr) => acc + curr.stars, 0);
    tailor.averageRating = totalStars / tailor.ratings.length;

    await tailor.save();
    res.json({ message: "Review published!", averageRating: tailor.averageRating });
  } catch (err) {
    res.status(500).json({ message: "Failed to publish review" });
  }
};
























