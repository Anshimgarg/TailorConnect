//import axios from "axios";
import api from "../api";

import { useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";

interface LoginData {
  emailid?: string;
  pwd?: string;
}

export default function Login(): JSX.Element {
  const [d, setD] = useState<LoginData>({});
  const nav = useNavigate();

  const login = (): void => {
    /*axios.post("http://localhost:5000/api/login", d).then(r => {
      if (!r.data.success) {
      alert(r.data.message);
      return;   // ❗ STOP HERE
    }
    
    localStorage.setItem("email", d.emailid || "");
      nav("/profile");
    });*/
    if (!d.emailid || !d.pwd) {
    alert("Email and Password required");
    return;
  }

  api.post("/login", d)
    .then(r => {
      alert(r.data.message);

      if (r.data.message !== "Login Success") return;

    // ✅ store email + role
    localStorage.setItem("email", d.emailid || "");
    localStorage.setItem("utype", r.data.utype);
    localStorage.setItem("token", r.data.token);  // ← NEW: save JWT token


    // ✅ ROLE BASED REDIRECT
    if (r.data.utype === "tailor") {
      nav("/tailor-dashboard");
    } else {
      nav("/customer-dashboard");
    }
  });
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
        .lg-input {
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
        .lg-input::placeholder { color: rgba(245,230,200,0.3); }
        .lg-input:focus {
          border-color: rgba(201,168,76,0.7);
          background: rgba(255,255,255,0.09);
        }
        .lg-btn {
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
        .lg-btn:hover {
          opacity: 0.9;
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(201,168,76,0.5);
        }
      `}</style>

      {/* Card */}
      <div style={{
        width: "100%",
        maxWidth: 400,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(201,168,76,0.15)",
        borderRadius: 20,
        padding: "40px 36px",
        backdropFilter: "blur(12px)",
        boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        animation: "fadeUp 0.5s ease both",
      }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 30 }}>
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
          }}>Welcome back</p>
          {/* Gold divider */}
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
          <label style={{
            display: "block",
            fontSize: 11,
            fontWeight: 700,
            color: "rgba(201,168,76,0.7)",
            letterSpacing: "1.2px",
            textTransform: "uppercase",
            marginBottom: 6,
          }}>
            Email Address
          </label>
          <input
            placeholder="you@example.com"
            className="lg-input"
            onChange={e => setD({ ...d, emailid: e.target.value })}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 26 }}>
          <label style={{
            display: "block",
            fontSize: 11,
            fontWeight: 700,
            color: "rgba(201,168,76,0.7)",
            letterSpacing: "1.2px",
            textTransform: "uppercase",
            marginBottom: 6,
          }}>
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="lg-input"
            onChange={e => setD({ ...d, pwd: e.target.value })}
          />
        </div>

        {/* Submit */}
        <button className="lg-btn" onClick={login}>
          Login
        </button>

        {/* Signup link */}
        <p style={{
          textAlign: "center",
          marginTop: 20,
          fontSize: 13,
          color: "rgba(245,230,200,0.4)",
        }}>
          Don't have an account?{" "}
          <a href="/signup" style={{ color: "#c9a84c", textDecoration: "none", fontWeight: 700 }}>
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
