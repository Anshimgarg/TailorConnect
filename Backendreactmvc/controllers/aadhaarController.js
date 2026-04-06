const Tesseract = require("tesseract.js");

exports.extractAadhaar = async (req, res) => {
  try {
    const image = req.body.image; // base64 image

    const result = await Tesseract.recognize(
      image,
      "eng",
      { logger: m => console.log(m) }
    );

    const text = result.data.text;

    // 🔍 Aadhaar Number (12 digits)
    const aadhaarMatch = text.match(/\b\d{4}\s\d{4}\s\d{4}\b/);

    // 🏠 Address (basic extraction)
    let address = "";
    const lines = text.split("\n");
    lines.forEach(line => {
      if (
        line.toLowerCase().includes("address") ||
        line.toLowerCase().includes("s/o") ||
        line.toLowerCase().includes("c/o")
      ) {
        address += line + " ";
      }
    });

    // 🏙️ City (simple guess)
    let city = "";
    const cityMatch = address.match(/\b[A-Z][a-z]+/g);
    if (cityMatch) city = cityMatch[cityMatch.length - 1];

    res.json({
      aadhaarno: aadhaarMatch ? aadhaarMatch[0] : "",
      address,
      city
    });
  } catch (err) {
    res.status(500).json({ message: "OCR failed" });
  }
};
