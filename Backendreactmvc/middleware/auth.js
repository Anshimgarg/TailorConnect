const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "tailorconnect_secret_key";

module.exports = function auth(req, res, next) {
  // Expect header:  Authorization: Bearer <token>
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token. Please login." });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // { email, utype, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token. Please login again." });
  }
};


































