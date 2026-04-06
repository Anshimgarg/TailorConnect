//import axios from "axios";
import api from "../api";

import { useState, type JSX } from "react";

interface SignupData {
  emailid?: string;
  pwd?: string;
  utype?: string;
}

export default function Signup(): JSX.Element {
  const [d, setD] = useState<SignupData>({});
 
  const signup = (): void => {
   
    if (!d.emailid || !d.pwd || !d.utype) {
    alert("All fields are required");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(d.emailid)) {
    alert("Invalid email format");
    return;
  }

  if (d.pwd.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

    api
      .post("/signup", d)
      .then(r => alert(r.data.message));
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a0a05 0%, #2c1810 50%, #1a0a05 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Georgia', serif",
      padding: "20px",
    }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sg-input {
          width: 100%;
          padding: 13px 16px;
          background: rgba(255,255,255,0.06);
          border: 1.5px solid rgba(201,168,76,0.25);
          border-radius: 10px;
          color: #f5e6c8;
          font-size: 14px;
          font-family: 'Georgia', serif;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .sg-input::placeholder { color: rgba(245,230,200,0.3); }
        .sg-input:focus {
          border-color: rgba(201,168,76,0.7);
          background: rgba(255,255,255,0.09);
        }
        .sg-btn {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #c9a84c, #e8c96e);
          color: #1a0a05;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Georgia', serif;
          letter-spacing: 1px;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(201,168,76,0.35);
        }
        .sg-btn:hover {
          opacity: 0.9;
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(201,168,76,0.5);
        }
        .type-card {
          flex: 1;
          padding: 14px 10px;
          border-radius: 12px;
          border: 1.5px solid rgba(201,168,76,0.2);
          background: rgba(255,255,255,0.03);
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
          color: rgba(245,230,200,0.5);
          user-select: none;
        }
        .type-card:hover {
          border-color: rgba(201,168,76,0.5);
          background: rgba(201,168,76,0.07);
          color: #f5e6c8;
        }
        .type-card.selected {
          border-color: #c9a84c;
          background: rgba(201,168,76,0.13);
          color: #e8c96e;
        }
      `}</style>

      {/* Card */}
      <div style={{
        width: "100%",
        maxWidth: 420,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(201,168,76,0.15)",
        borderRadius: 20,
        padding: "40px 36px",
        backdropFilter: "blur(12px)",
        boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        animation: "fadeUp 0.5s ease both",
      }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 38, marginBottom: 8 }}>🧵</div>
          <h1 style={{
            margin: 0,
            fontSize: 26,
            fontWeight: 700,
            color: "#e8c96e",
            letterSpacing: "1px",
          }}>TailorConnect</h1>
          <p style={{
            margin: "6px 0 0",
            fontSize: 13,
            color: "rgba(245,230,200,0.45)",
            letterSpacing: "0.5px",
          }}>Create your account</p>
          {/* Divider */}
          <div style={{
            margin: "18px auto 0",
            width: 48,
            height: 2,
            background: "linear-gradient(to right, transparent, #c9a84c, transparent)",
            borderRadius: 2,
          }} />
        </div>

        {/* Email */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(201,168,76,0.7)", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 6 }}>
            Email Address
          </label>
          <input
            placeholder="you@example.com"
            className="sg-input"
            onChange={e => setD({ ...d, emailid: e.target.value })}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(201,168,76,0.7)", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 6 }}>
            Password
          </label>
          <input
            type="password"
            placeholder="Min. 6 characters"
            className="sg-input"
            onChange={e => setD({ ...d, pwd: e.target.value })}
          />
        </div>

        {/* User Type */}
        <div style={{ marginBottom: 26 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(201,168,76,0.7)", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 10 }}>
            I am a
          </label>
          <div style={{ display: "flex", gap: 10 }}>
            {/* Customer */}
            <div
              className={`type-card${d.utype === "customer" ? " selected" : ""}`}
              onClick={() => setD({ ...d, utype: "customer" })}
            >
              <div style={{ fontSize: 24, marginBottom: 5 }}>🛍️</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Customer</div>
              <div style={{ fontSize: 11, marginTop: 2, opacity: 0.6 }}>Find tailors</div>
              {/* hidden checkbox — preserves original logic */}
              <input
                type="checkbox"
                checked={d.utype === "customer"}
                onChange={() => setD({ ...d, utype: "customer" })}
                style={{ display: "none" }}
              />
            </div>
            {/* Tailor */}
            <div
              className={`type-card${d.utype === "tailor" ? " selected" : ""}`}
              onClick={() => setD({ ...d, utype: "tailor" })}
            >
              <div style={{ fontSize: 24, marginBottom: 5 }}>🧵</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Tailor</div>
              <div style={{ fontSize: 11, marginTop: 2, opacity: 0.6 }}>Offer services</div>
              {/* hidden checkbox — preserves original logic */}
              <input
                type="checkbox"
                checked={d.utype === "tailor"}
                onChange={() => setD({ ...d, utype: "tailor" })}
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button onClick={signup} className="sg-btn">
          Create Account
        </button>

        {/* Login link */}
        <p style={{
          textAlign: "center",
          marginTop: 20,
          fontSize: 13,
          color: "rgba(245,230,200,0.4)",
        }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#c9a84c", textDecoration: "none", fontWeight: 700 }}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
