import api from "../api";

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "/tailor";

// Masks Aadhaar: "3293 3033 2309" → "3293 XXXX XXXX"
const maskAadhaar = (num: string): string => {
  if (!num) return "";
  const digits = num.replace(/\D/g, "");
  if (digits.length !== 12) return num;
  return `${digits.slice(0, 4)} XXXX XXXX`;
};

const emptyForm = {
  emailid: "", name: "", contact: "", aadhaarPic: "",
  address: "", city: "", aadharno: "", category: "",
  spl: "", social: "", since: "", worktype: "",
  shopadr: "", shopcity: "", otherinfo: "", profilePic: "",
};


const ProfileTailor = () => {
  const [form, setForm] = useState<any>({
    emailid: "",
    name: "",
    contact: "",
    aadhaarPic:"",
    address: "",
    city: "",
    aadharno: "",
    category: "",
    spl: "",
    social: "",
    since: "",
    worktype: "",
    shopadr: "",
    shopcity: "",
    otherinfo: "",
    profilePic: "",
  });
const [aadhaarPic, setAadhaarFile] = useState<File | null>(null);
const [aadhaarPreview, setAadhaarPreview] = useState<string | null>(null);

const [, setProfileFile] = useState<File | null>(null);
const [profilePreview, setProfilePreview] = useState<string | null>(null);
const [ocrLoading, setOcrLoading] = useState(false); // FIX: loading state for OCR
const [ocrError, setOcrError] = useState<string | null>(null); // FIX: error state for OCR
const [findEmail, setFindEmail] = useState("");
const [mode, setMode] = useState<"save" | "update">("save"); // track current mode


  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setAadhaarFile(null);
    setAadhaarPreview(null);
    setProfileFile(null);
    setProfilePreview(null);
    setOcrError(null);
    setMode("save");
  };

  const handleSubmit = async () => {
    try {
      const res = await api.post(
        "/tailor/save",
        form
      );
      alert(res.data.message);
    } catch (err) {
      alert("Error saving profile");
    }
  };

// 🔍 FIND
  const handleFind = async () => {
    if (!findEmail) return alert("Enter an email to search");
    try {
      const res = await api.get(`${API}/find/${findEmail}`);
      const data = res.data;
      setForm(data);
      setProfilePreview(data.profilePic || null);
      setAadhaarPreview(data.aadhaarPic || null);
      setMode("update"); // switch to update mode after finding
      alert("✅ Profile found! You can now edit and update.");
    } catch (err: any) {
      alert("❌ " + (err?.response?.data?.message || "Profile not found"));
    }
  };

  // ✏️ UPDATE
  const handleUpdate = async () => {
    if (!form.emailid) return alert("Email ID is required");
    try {
      const res = await api.put(`${API}/update/${form.emailid}`, form);
      alert("✅ " + res.data.message);
    } catch (err: any) {
      alert("❌ " + (err?.response?.data?.message || "Error updating profile"));
    }
  };

  // 🗑️ DELETE
  const handleDelete = async () => {
    if (!form.emailid) return alert("Email ID is required. Use Find first.");
    if (!window.confirm(`Are you sure you want to delete profile of ${form.name || form.emailid}?`)) return;
    try {
      const res = await api.delete(`${API}/delete/${form.emailid}`);
      alert("✅ " + res.data.message);
      resetForm();
    } catch (err: any) {
      alert("❌ " + (err?.response?.data?.message || "Error deleting profile"));
    }
  };

 const uploadAadhaarAndExtract = async () => {
    if (!aadhaarPic) {
      alert("Please select an Aadhaar image first.");
      return;
    }
    setOcrLoading(true);
    setOcrError(null);

try{
  const formData = new FormData();
  formData.append("file", aadhaarPic);
  formData.append("upload_preset", "tailorconnect");

  // ⬆️ Upload to Cloudinary
  const cloudRes = await axios.post(
    "https://api.cloudinary.com/v1_1/dj378wdii/image/upload",
    formData
  );

  const imageUrl = cloudRes.data.secure_url;

  // 🧠 OCR API
  const ocrRes = await api.post(
    "/ocr/aadhaar",
    { imageUrl }
  );

  // 🧩 Auto-fill fields

   const { aadhaar, address, city } = ocrRes.data;

      // FIX: Check OCR actually returned data before filling
      if (!aadhaar && !address && !city) {
        throw new Error("OCR returned no data. Check the backend /api/ocr/aadhaar response.");
      }
  setForm((prev: any) => ({
        ...prev,
        aadharno: aadhaar || prev.aadharno,
        address: address || prev.address,
        city: city || prev.city,
        aadhaarPic: imageUrl,
      }));

      alert("✅ Aadhaar details extracted successfully!");
} catch (err: any) {
      console.error("OCR Error:", err);
      const msg =
        err?.response?.data?.message || err?.message || "OCR extraction failed.";
      setOcrError(msg);
      alert("❌ " + msg);
    } finally {
      setOcrLoading(false);
    }
 };

  const nav = useNavigate();


  return (
    <div className="p-6 max-w-5xl mx-auto border">
      {/* BACK BUTTON */}
      <button
        onClick={() => nav("/tailor-dashboard")}
        style={{ marginBottom: "16px", background: "none", border: "1px solid #ccc", padding: "6px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px" }}
      >
        ← Back to Dashboard
      </button>
      <h2 className="text-xl font-bold mb-4">Tailor Profile</h2>

     {/* 🔍 FIND BAR */}
      <div className="flex gap-2 mb-6 p-3 bg-gray-50 border rounded">
        <input
          placeholder="Enter Email to Find Profile"
          value={findEmail}
          onChange={(e) => setFindEmail(e.target.value)}
          className="flex-1 border px-3 py-1 rounded"
        />
        <button onClick={handleFind} className="px-4 py-1 bg-purple-600 text-white rounded">
          🔍 Find
        </button>
        <button onClick={resetForm} className="px-4 py-1 bg-gray-400 text-white rounded">
          🔄 Reset
        </button>
      </div>

      {/* MODE INDICATOR */}
      <div className={`text-sm font-semibold mb-3 px-3 py-1 rounded w-fit ${mode === "update" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
        {mode === "update" ? "✏️ Edit Mode — Profile Loaded" : "➕ New Profile"}
      </div>


      <div className="grid grid-cols-3 gap-4">
        <input name="emailid" placeholder="Email Id" value={form.emailid} onChange={handleChange} />
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="contact" placeholder="Contact Number" value={form.contact} onChange={handleChange} />
 
      <div className="mt-4">
    <label className="block font-semibold">Upload Aadhar card</label>

        <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAadhaarFile(file);
      setAadhaarPreview(URL.createObjectURL(file));
      setOcrError(null);

    }
  }}
/>
{aadhaarPreview && (
  <img
    src={aadhaarPreview}
    alt="Aadhaar Preview"
    style={{
      width: "220px",
      marginTop: "8px",
      border: "1px solid #ccc",
      borderRadius: "6px"
    }}
  />
)}
<button
          onClick={uploadAadhaarAndExtract}
          disabled={ocrLoading || !aadhaarPic}
          className="mt-2 px-4 py-1 bg-green-600 text-white disabled:opacity-50"
        >
          {ocrLoading ? "Extracting..." : "Upload & Extract"}
        </button>
        {ocrError && (
          <p className="text-red-500 text-sm mt-1">⚠️ {ocrError}</p>
        )}
        </div>


        <input name="address" placeholder="Address" value={form.address}  onChange={handleChange} />
        <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
        <input name="aadharno" placeholder="Aadhar No" value={maskAadhaar(form.aadharno)} onChange={handleChange} />

        <select name="category" value={form.category} onChange={handleChange}>
          <option value="">Category</option>
          <option>Men</option>
          <option>Women</option>
          <option>Children</option>
          <option>Both</option>
        </select>

        <input name="spl" placeholder="Speciality" value={form.spl} onChange={handleChange} />
        <input name="social" placeholder="Website / Insta / FB" value={form.social} onChange={handleChange} />

        <input name="since" placeholder="Since" value={form.since} onChange={handleChange} />
        <select name="worktype" value={form.worktype} onChange={handleChange}>
          <option value="">Work Type</option>
          <option>Home</option>
          <option>Shop</option>
          <option>Both</option>
        </select>

        <input name="shopadr" placeholder="Shop Address" value={form.shopadr} onChange={handleChange} />
        <input name="shopcity" placeholder="Shop City" value={form.shopcity} onChange={handleChange} />
      </div>

      <textarea
        name="otherinfo"
        placeholder="Other Information"
        className="w-full mt-4"
        value={form.otherinfo}
        onChange={handleChange}
      />

      {/* PROFILE PIC */}
      <div className="mt-4">
        <label className="block font-semibold">Profile Pic</label>
        <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      setProfilePreview(URL.createObjectURL(file));
      const reader = new FileReader();
              reader.onloadend = () => {
                setForm((prev: any) => ({ ...prev, profilePic: reader.result }));
              };
              reader.readAsDataURL(file);
    }
  }}
/>
{profilePreview && (
  <img
    src={profilePreview}
    alt="Profile Preview"
    style={{
      width: "150px",
      marginTop: "8px",
      borderRadius: "50%",
      border: "1px solid #aaa"
    }}
  />
)}

      </div>

      <div className="flex gap-3 mt-6">
        {mode === "save" ? (
          <button onClick={handleSubmit} className="px-6 py-2 bg-blue-600 text-white rounded">
            💾 Save
          </button>
        ) : (
          <>
            <button onClick={handleUpdate} className="px-6 py-2 bg-yellow-500 text-white rounded">
              ✏️ Update
            </button>
            <button onClick={handleDelete} className="px-6 py-2 bg-red-600 text-white rounded">
              🗑️ Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileTailor;
