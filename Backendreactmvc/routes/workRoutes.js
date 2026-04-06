const express    = require("express");
const router     = express.Router();
const WorkPost   = require("../models/WorkPost");
const cloudinary = require("../config/cloudinary"); // your existing cloudinary config

// ── POST /api/work/post ───────────────────────────────────────────────────
// Body: { tailorEmail, title, description, price, imageBase64 }
router.post("/post", async (req, res) => {
  try {
    const { tailorEmail, title, description, price, imageBase64 } = req.body;

    if (!tailorEmail || !title || !imageBase64) {
      return res.status(400).json({ message: "tailorEmail, title and image are required" });
    }

    // Upload image to Cloudinary
    const upload = await cloudinary.uploader.upload(imageBase64, {
      folder: "tailor_work",
    });

    const post = await WorkPost.create({
      tailorEmail,
      title,
      description: description || "",
      price:       price       || "",
      imageUrl:    upload.secure_url,
    });

    res.json({ message: "Post created successfully", post });
  } catch (err) {
    console.error("[work/post] ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/work/:tailorEmail ────────────────────────────────────────────
// Returns all work posts for a tailor, newest first
router.get("/:tailorEmail", async (req, res) => {
  try {
    const posts = await WorkPost.find({ tailorEmail: req.params.tailorEmail })
      .sort({ createdAt: -1 });
    res.json({ posts });
  } catch (err) {
    console.error("[work/get] ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/work/:postId ─────────────────────────────────────────────────
// Body: { title, description, price, imageBase64? }
// imageBase64 is optional — only re-uploads if a new image is provided
router.put("/:postId", async (req, res) => {
  try {
    const { title, description, price, imageBase64 } = req.body;
    const update = { title, description, price };

    if (imageBase64 && imageBase64.startsWith("data:")) {
      const upload = await cloudinary.uploader.upload(imageBase64, {
        folder: "tailor_work",
      });
      update.imageUrl = upload.secure_url;
    }

    const updated = await WorkPost.findByIdAndUpdate(
      req.params.postId,
      { $set: update },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post updated", post: updated });
  } catch (err) {
    console.error("[work/update] ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/work/:postId ──────────────────────────────────────────────
router.delete("/:postId", async (req, res) => {
  try {
    const deleted = await WorkPost.findByIdAndDelete(req.params.postId);
    if (!deleted) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("[work/delete] ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
























