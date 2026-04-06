const Tesseract = require("tesseract.js");

const isGarbageLine = (line) => {
  const lower = line.toLowerCase();
  return (
    /^\s*[=\-|©@*#^~`]+\s*$/.test(line) ||
    lower.includes("mera aadhaar") ||
    lower.includes("मेरा आधार") ||
    lower.includes("meri pehchaan") ||
    lower.includes("मेरी पहचान") ||
    lower.includes("government of india") ||
    lower.includes("aadhaar will be") ||
    lower.includes("availing government") ||
    lower.includes("non-government") ||
    lower.includes("your aadhaar no") ||
    lower.includes("aadhaar no") ||
    lower.includes("proof of identity") ||
    lower.includes("scanning of qr") ||
    lower.includes("offline xml") ||
    lower.includes("enrollment no") ||
    /\b\d{4}\s\d{4}\s\d{4}\b/.test(line) ||
    /^[^a-zA-Z\u0900-\u097F]{0,5}$/.test(line) ||
    line.length < 4
  );
};

exports.extractAadhaarData = async (req, res) => {
  const { imageUrl } = req.body;

  try {
    const result = await Tesseract.recognize(
      imageUrl,
      "eng+hin",
      { logger: (m) => console.log(m) }
    );

    const text = result.data.text;
    console.log("📄 OCR RAW TEXT:\n", text); 

    // 🔍 Aadhaar Number (12 digits)
     let aadhaarNumber = "";

    // Strategy 1: perfect format "XXXX XXXX XXXX"
    const perfect = text.match(/\b\d{4}\s\d{4}\s\d{4}\b/);
    if (perfect) {
      aadhaarNumber = perfect[0];
    }

    // Strategy 2: dashed "XXXX-XXXX-XXXX"
    if (!aadhaarNumber) {
      const dashed = text.match(/\b\d{4}-\d{4}-\d{4}\b/);
      if (dashed) aadhaarNumber = dashed[0];
    }

    // Strategy 3: 12 digits no space
    if (!aadhaarNumber) {
      const plain = text.match(/\b\d{12}\b/);
      if (plain) aadhaarNumber = plain[0];
    }

    // Strategy 4: OCR misread — partial groups like "3 3033 2309" or "32 3033 2309"
    // Collect ALL digit groups near each other and try to reconstruct 12 digits
    if (!aadhaarNumber) {
      const lines = text.split("\n");
      let foundAadhaarLabel = false;
      for (let i = 0; i < lines.length; i++) {
        const lower = lines[i].toLowerCase();
        if (lower.includes("aadhaar no") || lower.includes("aadhar no") || lower.includes("aadhaar number")) {
          foundAadhaarLabel = true;
        }
        if (foundAadhaarLabel) {
          // Check next few lines for digit groups
          const digits = lines[i].replace(/\D/g, "");
          if (digits.length >= 8) { // at least partial aadhaar
            // look for digit groups in this line
            const groups = lines[i].match(/\d+/g);
            if (groups) {
              const combined = groups.join("");
              if (combined.length === 12) {
                aadhaarNumber = `${combined.slice(0,4)} ${combined.slice(4,8)} ${combined.slice(8,12)}`;
                break;
              }
              // also check 2-3 consecutive lines combined
              if (i + 1 < lines.length) {
                const nextGroups = lines[i+1].match(/\d+/g) || [];
                const combined2 = [...groups, ...nextGroups].join("");
                if (combined2.length === 12) {
                  aadhaarNumber = `${combined2.slice(0,4)} ${combined2.slice(4,8)} ${combined2.slice(8,12)}`;
                  break;
                }
              }
            }
          }
        }
      }
    }

    // Strategy 5: strip all non-digits per line, find line with exactly 12 digits
    // but SKIP lines that contain enrollment/mobile/pin patterns
    if (!aadhaarNumber) {
      const lines = text.split("\n");
      for (const line of lines) {
        const lower = line.toLowerCase();
        if (lower.includes("enrollment") || lower.includes("enrolment") || lower.includes("mobile")) continue;
        const digits = line.replace(/\D/g, "");
        if (digits.length === 12 && !digits.startsWith("0")) {
          aadhaarNumber = `${digits.slice(0,4)} ${digits.slice(4,8)} ${digits.slice(8,12)}`;
          break;
        }
      }
    }

    // Strategy 6: remove known non-aadhaar patterns, find 12-digit sequence
    // Skip enrollment number (format: XXXX/XXXXX/XXXXX) by removing slash-separated numbers
    if (!aadhaarNumber) {
      const cleanText = text
        .replace(/\d+\/\d+\/\d+/g, "")     // remove enrollment no (1104/75366/00681)
        .replace(/\b\d{6}\b/g, "")          // remove PIN codes
        .replace(/\b(19|20)\d{2}\b/g, "")   // remove years
        .replace(/\b\d{10}\b/g, "")         // remove phone numbers
        .replace(/mobile[:\s]*\d+/gi, "");   // remove mobile numbers

      const allDigits = cleanText.replace(/\D/g, "");
      const match = allDigits.match(/[1-9]\d{11}/);
      if (match) {
        const d = match[0];
        aadhaarNumber = `${d.slice(0,4)} ${d.slice(4,8)} ${d.slice(8,12)}`;
      }
    }


    console.log("🔢 Aadhaar:", aadhaarNumber || "NOT FOUND");


    // 🔍 Address (basic heuristic)
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

    let addressLines = [];
    let capture = false;

    for (let i = 0; i < lines.length; i++) {
      const lower = lines[i].toLowerCase();

      // Start capturing after address-related keywords
      if (
        lower.includes("s/o") ||
        lower.includes("c/o") ||
        lower.includes("w/o") ||
        lower.includes("d/o") ||
        lower.includes("house") ||
        lower.includes("village") ||
        lower.includes("po:")||
        lower.includes("near") ||
        lower.includes("vtc") ||
        lower.includes("street") ||
        lower.includes("ward") ||
        lower.includes("address:")
        
      ) {
        capture = true;
      }

      if (capture && !isGarbageLine(lines[i])) {
        // Clean the line — remove stray | characters and extra spaces
        const cleaned = lines[i].replace(/\|/g, "").replace(/\s+/g, " ").trim();
        if (cleaned.length > 2) {
          addressLines.push(cleaned);
        }
        if (/\b\d{6}\b/.test(lines[i])) break;
        if (addressLines.length >= 6) break;
      }
    }

    const address = addressLines
    .join(", ")
    .replace(/,\s*,/g, ",")
    .replace(/\s+/g, " ")
    .trim();
    console.log("🏠 Address:", address);

    // 🏙️ City — expanded list of Indian cities
    const cityList = [
      "Ludhiana","Amritsar","Chandigarh","Patiala","Jalandhar",
      "Mohali","Bathinda","Firozpur","Moga",
      "Hoshiarpur","Gurdaspur","Rupnagar","Sangrur","Barnala","Fazilka",
      "Pathankot","Kapurthala","Muktsar","Nawanshahr","Fatehgarh","Tarn Taran",
      "Ferozepur","Zirakpur","Khanna","Phagwara","Abohar","Malout","Sunam",
      "Mandi Gobindgarh","Rajpura","Morinda","Sirhind","Nabha","Ropar"
    ];

    const cityRegex = new RegExp(`\\b(${cityList.join("|")})\\b`, "i");
    let cityMatch = text.match(cityRegex);
    let city = cityMatch ? cityMatch[0] : "";

    // 🏙️ Strategy 2: word before 6-digit PIN code
    if (!city) {
      const pinLineMatch = text.match(/([A-Za-z][A-Za-z\s]{2,20})\s*[,\-]?\s*\b(\d{6})\b/);
      if (pinLineMatch) {
        const words = pinLineMatch[1].trim().split(/\s+/);
        city = words[words.length - 1];
      }
    }

    // 🏙️ Strategy 3: look for "District Bathinda" or "Dist: Bathinda" pattern
    if (!city) {
      const distMatch = text.match(/(?:dist(?:rict)?\.?\s*:?\s*)([A-Za-z]+)/i);
      if (distMatch) city = distMatch[1];
    }

    console.log("🏙️ City:", city || "NOT FOUND");

    res.json({
      aadhaar: aadhaarNumber,
      address,
      city,
    });
  } catch (err) {
    console.error("OCR Error:", err);
    res.status(500).json({ message: "OCR Failed", error: err.message });
  }
};


















