const User = require("../models/User");
const Cust = require("../models/CustProfile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");                          // ← NEW
const cloudinary = require("../config/cloudinary");
const transporter = require("../config/mailer");

const SECRET = process.env.JWT_SECRET || "tailorconnect_secret_key"; // ← NEW

exports.signup = async (req,res)=>{
  const { emailid, pwd, utype } = req.body;

  if (!["customer", "tailor"].includes(utype)) {
    return res.send({ message: "Invalid user type" });
  }

  if (!emailid || !pwd || !utype) {
    return res.json({ message: "All fields required" });
  }

  const exists = await User.findOne({ emailid });
  if (exists) {
    return res.json({ message: "Email already registered" });
  }

  if (pwd.length < 6) {
    return res.json({ message: "Password too short" });
  }


    const hash = await bcrypt.hash(req.body.pwd,10);
  await User.create({
    emailid:req.body.emailid,
    pwd:hash,
    utype:req.body.utype,
    status:true
  });
  res.send({message:"Signup Successful"});


await transporter.sendMail({
    from: "TailorConnect <yourgmail@gmail.com>",
    to: emailid,
    subject: "Welcome to TailorConnect 🎉",
    html: `
      <h2>Welcome to TailorConnect</h2>
      <p>Your account has been created successfully.</p>
      <p><b>User Type:</b> ${utype}</p>
      <p>Thank you for joining us!</p>
    `
  });

  res.send({ message: "Signup Successful. Email sent!" });
};

exports.login = async (req,res)=>{
  const { emailid, pwd } = req.body;
  if (!emailid || !pwd) {
    return res.json({ success:false, message:"All fields required" });
  }
  const user = await User.findOne({emailid:req.body.emailid});
  if(!user) return res.send({message:"Invalid Email"});
  const ok = await bcrypt.compare(req.body.pwd,user.pwd);
  if(!ok) return res.send({success: false,message:"Wrong Password"});
  
  // ── NEW: generate JWT token ──────────────────────────────────────────
  const token = jwt.sign(
    { email: user.emailid, utype: user.utype },
    SECRET,
    { expiresIn: "7d" }   // token valid for 7 days
  );
  // ─────────────────────────────────────────────────────────────────────

  res.send({
    success: true,
    message: "Login Success",
    utype: user.utype,
    token,              // ← NEW: send token to frontend
  });
};

exports.saveProfile = async (req,res)=>{
  try {
    let imageUrl = "";

    if (req.body.profilepic) {
      const uploadRes = await cloudinary.uploader.upload(
        req.body.profilepic,
        { folder: "tailorconnect_profiles" }
      );
      imageUrl = uploadRes.secure_url;
    }
  await Cust.create({
      emailid: req.body.emailid,
      name: req.body.name,
      city: req.body.city,
      state: req.body.state,
      gender: req.body.gender,
      profilepic: imageUrl
  });
  res.send({message:"Profile Saved"});
  }
  catch (err) {
    res.status(500).json({ message: "Profile save failed" });
  }
  };

exports.getProfile = async (req,res)=>{
  const data = await Cust.findOne({emailid:req.params.email});
  res.send(data);
};

exports.updateProfile = async (req,res)=>{
  try {
    let updateData = {
      name: req.body.name,
      city: req.body.city,
      state: req.body.state,
      gender: req.body.gender
    };

    if (req.body.profilepic) {
      const uploadRes = await cloudinary.uploader.upload(
        req.body.profilepic,
        { folder: "tailorconnect_profiles" }
      );
      updateData.profilepic = uploadRes.secure_url;
    }
  await Cust.updateOne({emailid:req.body.emailid},{$set:req.body});
  res.send({message:"Profile Updated"});
}
catch (err) {
    res.status(500).json({ message: "Profile update failed" });
  }
};
