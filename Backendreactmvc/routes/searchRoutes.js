const express = require("express");
const router  = express.Router();
const Tailor  = require("../models/TailorProfile"); // your existing Mongoose model

router.get("/cities", async (req, res) => {
  try {
    const cities = await Tailor.distinct("city", {
      city: { $nin: [null, ""] }
    });
    res.json({ cities: cities.sort() });
  } catch (err) {
    console.error("[search/cities]", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get("/dress-types", async (req, res) => {
  try {
    const { city, gender } = req.query;

    const filter = { spl: { $nin: [null, ""] } };
    if (city)   filter.city     = city;
    if (gender) filter.category = gender; // category = "Men" / "Women" / "Children"

    const tailors = await Tailor.find(filter, { spl: 1, _id: 0 });

    // spl can be "Pant,Shirt,Coat" — split, flatten, deduplicate, sort
    const all = tailors.flatMap((t) =>
      t.spl.split(",").map((s) => s.trim())
    );
    const dressTypes = [...new Set(all)].filter(Boolean).sort();

    res.json({ dressTypes });
  } catch (err) {
    console.error("[search/dress-types]", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/search/tailors?city=&gender=&dress=&page=1&limit=6 ───────────
// Returns paginated tailors matching filters — all data from their own profiles
router.get("/tailors", async (req, res) => {
  try {
    const { city, gender, dress, page = "1", limit = "6" } = req.query;
    const pageNum  = parseInt(page,  10);
    const limitNum = parseInt(limit, 10);
    const skip     = (pageNum - 1) * limitNum;

    // Build Mongoose filter
    const filter = { city: { $nin: [null, ""] } }; // must have a city
    if (city)   filter.city     = city;
    if (gender) filter.category = gender;             // category = Men/Women/Children
    if (dress)  filter.spl      = { $regex: dress, $options: "i" }; // spl contains dress type

    const total      = await Tailor.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    const tailors = await Tailor
      .find(filter)
      .sort({ averageRating: -1 }) // highest rated first
      .skip(skip)
      .limit(limitNum)
      .select("emailid name city category spl contact since worktype averageRating profilePic otherinfo");

    // Map to shape expected by FindTailor.tsx frontend
    const result = tailors.map((t) => ({
      id:          t._id,
      name:        t.name        || "—",
      city:        t.city        || "—",
      gender:      t.category    || "—",   // category → gender
      specialties: t.spl
                   ? t.spl.split(",").map((s) => s.trim())
                   : [],                   // spl → specialties array
      rating:      t.averageRating || null,
      experience:  t.since        || "—",  // since → experience
      price:       "",                     // not in schema, leave blank
      phone:       t.contact      || "—",  // contact → phone
      email:       t.emailid   || "",    // used to fetch work posts
      verified:    0,                      // not in schema
    }));

    res.json({ tailors: result, total, page: pageNum, totalPages });
  } catch (err) {
    console.error("[search/tailors]", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;