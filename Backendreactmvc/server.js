require("dotenv").config();   

const express = require("express");
const cors = require("cors");
require("./config/db");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));


app.use("/api",require("./routes/userRoutes"));
app.use("/api/tailor", require("./routes/tailorRoutes"));
app.use("/api/aadhaar", require("./routes/aadhaarRoutes"));
app.use("/api/ocr", require("./routes/ocrRoutes"));
app.use("/api/search", require("./routes/searchRoutes")); 

const workRoutes = require("./routes/workRoutes");
app.use("/api/work", workRoutes);

app.use((req, res) => {
  console.log(req.method, req.url);
  res.status(404).send("Invalid URL");
});

app.listen(5000,()=>{
    console.log("Server Started on :"+5000);
})


