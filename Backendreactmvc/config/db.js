const mongoose = require("mongoose");

//mongoose.connect("mongodb://127.0.0.1:27017/tailorconnect")
//.then(()=>console.log("MongoDB Connected"));

//mongodb+srv://anshimmern:mernanshim@cluster0.m6pvllp.mongodb.net/?appName=Cluster0

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env file");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

module.exports = mongoose;











































