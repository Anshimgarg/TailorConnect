//import axios from "axios";
import api from "../api";  // ← uses JWT token automatically

import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Profile{
    emailid:string;
    name:string;
    city:string;
    address:string;
    state:string;
    gender:string;
    profilepic: String;
}

export default function Profile(){
  const email = localStorage.getItem("email");
  const [d,setD]=useState<Profile>({
    emailid:"",
    name:"",
    city:"",
    address:"",
    state:"",
    gender:"",
    profilepic:"",
  });
  const [imageBase64, setImageBase64] = useState<string>("");
  const [exists,setExists]=useState(false);
  const [searchEmail, setSearchEmail] = useState<string>("");


 const searchProfile = (): void => {
    if (!searchEmail) {
      alert("Enter email to search");
      return;
    }

    api
      .get(`/getprofile/${searchEmail}`)
      .then(r => {
        if (!r.data) {
          alert("User not found");
          setExists(false);
          return;
        }
        setD(r.data);
        setExists(true);
      });
  };

  const save=()=>{
  api.post("/saveprofile",{...d,emailid:email}).then(r=>alert(r.data.message));  
  };

  const update=()=>{
  api.post("/updateprofile",{...d,emailid:email}).then(r=>alert(r.data.message));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files) return;

  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onloadend = () => {
    setImageBase64(reader.result as string);
    setD({ ...d, profilepic: reader.result as string });

  };

  reader.readAsDataURL(file);
};

 const nav = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f2e8df",
      fontFamily: "'Georgia', serif",
    }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pf-input {
          width: 100%;
          padding: 11px 14px;
          background: #fff;
          border: 1.5px solid #dcc9a8;
          border-radius: 9px;
          color: #2c1810;
          font-size: 14px;
          font-family: 'Georgia', serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .pf-input::placeholder { color: #c4a882; }
        .pf-input:focus {
          border-color: #b5451b;
          box-shadow: 0 0 0 3px rgba(181,69,27,0.1);
        }
        .pf-input option { background: #fff; color: #2c1810; }
        .pf-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #9a6a3a;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        .pf-save-btn {
          width: 100%;
          padding: 13px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #b5451b, #e06030);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Georgia', serif;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 18px rgba(181,69,27,0.3);
        }
        .pf-save-btn:hover { opacity:0.9; transform:translateY(-2px); }
        .pf-update-btn {
          width: 100%;
          padding: 13px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #1b6b45, #2e9e68);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Georgia', serif;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          box-shadow: 0 4px 18px rgba(27,107,69,0.25);
        }
        .pf-update-btn:hover { opacity:0.9; transform:translateY(-2px); }
        .pf-search-btn {
          padding: 11px 20px;
          border: none;
          border-radius: 9px;
          background: #2c1810;
          color: #f5e6c8;
          font-size: 13px;
          font-weight: 700;
          font-family: 'Georgia', serif;
          cursor: pointer;
          white-space: nowrap;
          transition: opacity 0.2s;
        }
        .pf-search-btn:hover { opacity: 0.85; }
      `}</style>

      {/* ── Dark top nav ── */}
      <div style={{
        background: "#2c1810",
        padding: "14px 32px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
      }}>
        <button
          onClick={() => nav("/customer-dashboard")}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#f5e6c8",
            padding: "7px 16px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 13,
            fontFamily: "'Georgia', serif",
            display: "flex", alignItems: "center", gap: 6,
          }}
        >← Back</button>
        <span style={{ fontSize: 18, color: "#e8c96e" }}>🧵</span>
        <span style={{ color: "#f5e6c8", fontSize: 16, fontWeight: 700, letterSpacing: "0.5px" }}>
          TailorConnect
        </span>
      </div>

      {/* ── Body ── */}
      <div style={{
        maxWidth: 860,
        margin: "36px auto",
        padding: "0 20px",
        animation: "fadeUp 0.45s ease both",
      }}>

        {/* Title row */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#2c1810" }}>
            Customer Profile
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#9a6a3a" }}>
            Manage your personal information
          </p>
          <div style={{
            marginTop: 10, height: 3, width: 48,
            background: "linear-gradient(to right, #b5451b, #e8c96e)",
            borderRadius: 2,
          }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "210px 1fr", gap: 22, alignItems: "start" }}>

          {/* ── Left: avatar + search ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Avatar card */}
            <div style={{
              background: "#fff",
              borderRadius: 16,
              padding: "24px 18px",
              textAlign: "center",
              boxShadow: "0 2px 14px rgba(44,24,16,0.09)",
              border: "1px solid #e8d5bb",
            }}>
              <input
                type="file"
                id="profilePic"
                accept="image/*"
                onChange={handleImage}
                style={{ display: "none" }}
              />
              <img
                src={imageBase64 || (d.profilepic as string) || "/default-avatar.png"}
                style={{
                  width: 88, height: 88,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #dcc9a8",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                  marginBottom: 10,
                  display: "block",
                  marginLeft: "auto", marginRight: "auto",
                }}
              />
              <p style={{ margin: "0 0 12px", fontSize: 13, color: "#9a6a3a", fontStyle: "italic" }}>
                {d.name || "Your Name"}
              </p>
              <label htmlFor="profilePic" style={{
                cursor: "pointer",
                display: "inline-block",
                background: "#fdf0e6",
                border: "1.5px solid #dcc9a8",
                color: "#b5451b",
                padding: "7px 16px",
                borderRadius: 8,
                fontSize: 12,
                fontFamily: "'Georgia', serif",
                fontWeight: 700,
              }}>
                📷 Browse
              </label>
            </div>

            {/* Search card */}
            <div style={{
              background: "#fff",
              borderRadius: 16,
              padding: "18px",
              boxShadow: "0 2px 14px rgba(44,24,16,0.09)",
              border: "1px solid #e8d5bb",
            }}>
              <label className="pf-label">Search by Email</label>
              <input
                placeholder="user@example.com"
                className="pf-input"
                value={searchEmail}
                onChange={e => setSearchEmail(e.target.value)}
                style={{ marginBottom: 10 }}
              />
              <button className="pf-search-btn" onClick={searchProfile} style={{ width: "100%" }}>
                Search User
              </button>
            </div>

          </div>

          {/* ── Right: form ── */}
          <div style={{
            background: "#fff",
            borderRadius: 16,
            padding: "28px",
            boxShadow: "0 2px 14px rgba(44,24,16,0.09)",
            border: "1px solid #e8d5bb",
          }}>
            <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 700, color: "#2c1810" }}>
              Personal Details
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

              <div>
                <label className="pf-label">Name</label>
                <input placeholder="Full name" className="pf-input"
                  value={d.name||""} onChange={e=>setD({...d,name:e.target.value})}/>
              </div>

              <div>
                <label className="pf-label">City</label>
                <input placeholder="Your city" className="pf-input"
                  value={d.city||""} onChange={e=>setD({...d,city:e.target.value})}/>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label className="pf-label">Address</label>
                <input placeholder="Street address" className="pf-input"
                  value={d.address||""} onChange={e=>setD({...d,address:e.target.value})}/>
              </div>

              <div>
                <label className="pf-label">State</label>
                <select className="pf-input" value={d.state||""} onChange={e=>setD({...d,state:e.target.value})}>
                  <option value="">Select State</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Rajasthan">Rajasthan</option>
                </select>
              </div>

              <div>
                <label className="pf-label">Gender</label>
                <select className="pf-input" value={d.gender||""} onChange={e=>setD({...d,gender:e.target.value})}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

            </div>

            <div style={{ height: 1, background: "#f0dfc8", margin: "20px 0" }} />

            {!exists
              ? <button onClick={save} className="pf-save-btn">Save Profile</button>
              : <button onClick={update} className="pf-update-btn">Update Profile</button>
            }
          </div>

        </div>
      </div>
    </div>
  );
}