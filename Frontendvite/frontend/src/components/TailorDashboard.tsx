import api from "../api";  // ← uses JWT token automatically

import { useEffect, useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import WorkPortfolio from "./WorkPortfolio";
//import axios from "axios";

export default function TailorDashboard(): JSX.Element {
  const nav = useNavigate();
  const email = localStorage.getItem("email") || "";
  const [tailor, setTailor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/tailor/find/${email}`)
      .then(r => setTailor(r.data))
      .catch(() => setTailor(null))
      .finally(() => setLoading(false));
  }, [email]);

  const handleLogout = () => {
    localStorage.clear();
    nav("/");
  };

  return (
    <div style={{ minHeight: "110vh", background: "#f0f4ff", fontFamily: "'Georgia', serif" }}>
      
      {/* TOP NAV */}
      <nav style={{
        background: "#1a1a2e", color: "#fff", padding: "14px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        boxShadow: "0 2px 12px rgba(0,0,0,0.3)"
      }}>
        <span style={{ fontSize: "1.3rem", fontWeight: "bold", letterSpacing: "1px" }}>
          🧵 TailorConnect
        </span>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ fontSize: "0.85rem", color: "#aab" }}>{email}</span>
          <button onClick={handleLogout} style={{
            background: "#e74c3c", color: "#fff", border: "none",
            padding: "7px 18px", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem"
          }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: "900px", margin: "40px auto", padding: "0 20px" }}>
        
        {/* WELCOME */}
        <h2 style={{ fontSize: "1.6rem", color: "#1a1a2e", marginBottom: "6px" }}>
          Welcome back{tailor?.name ? `, ${tailor.name}` : ""}! 👋
        </h2>
        <p style={{ color: "#666", marginBottom: "32px" }}>Tailor Dashboard</p>

        {/* PROFILE CARD */}
        <div style={{
          background: "#fff", borderRadius: "16px", padding: "28px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)", display: "flex",
          gap: "28px", alignItems: "flex-start", flexWrap: "wrap"
        }}>
          {/* PROFILE PIC */}
          <div style={{ flexShrink: 0 }}>
            {loading ? (
              <div style={{
                width: "110px", height: "110px", borderRadius: "50%",
                background: "#e0e0e0", display: "flex", alignItems: "center", justifyContent: "center"
              }}>⏳</div>
            ) : tailor?.profilePic ? (
              <img src={tailor.profilePic} alt="Profile"
                style={{ width: "110px", height: "110px", borderRadius: "50%", objectFit: "cover", border: "3px solid #1a1a2e" }} />
            ) : (
              <div style={{
                width: "110px", height: "110px", borderRadius: "50%",
                background: "#1a1a2e", color: "#fff", fontSize: "2.5rem",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                {tailor?.name ? tailor.name[0].toUpperCase() : "T"}
              </div>
            )}
          </div>

          {/* INFO */}
          <div style={{ flex: 1, minWidth: "200px" }}>
            {loading ? (
              <p style={{ color: "#999" }}>Loading profile...</p>
            ) : tailor ? (
              <>
                <h3 style={{ margin: "0 0 4px", fontSize: "1.3rem", color: "#1a1a2e" }}>
                  {tailor.name || "—"}
                </h3>
                <p style={{ margin: "0 0 10px", color: "#888", fontSize: "0.9rem" }}>{tailor.emailid}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 20px", fontSize: "0.9rem" }}>
                  {tailor.contact && <span>📞 {tailor.contact}</span>}
                  {tailor.city && <span>📍 {tailor.city}</span>}
                  {tailor.category && <span>👔 {tailor.category}</span>}
                  {tailor.worktype && <span>🏠 {tailor.worktype}</span>}
                  {tailor.spl && <span>⭐ {tailor.spl}</span>}
                  {tailor.since && <span>📅 Since {tailor.since}</span>}
                </div>
                {tailor.otherinfo && (
                  <p style={{ marginTop: "10px", color: "#555", fontSize: "0.88rem", fontStyle: "italic" }}>
                    "{tailor.otherinfo}"
                  </p>
                )}
              </>
            ) : (
              <div>
                <p style={{ color: "#999", marginBottom: "8px" }}>No profile created yet.</p>
                <p style={{ color: "#666", fontSize: "0.88rem" }}>Click the button below to set up your tailor profile.</p>
              </div>
            )}
          </div>

          {/* BADGE */}
          {tailor && (
            <div style={{ flexShrink: 0 }}>
              <span style={{
                background: "#e8f5e9", color: "#2e7d32", padding: "4px 12px",
                borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold"
              }}>✅ Active</span>
            </div>
          )}
        </div>

        {/* ACTION BUTTON */}
        <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
          <button
            onClick={() => nav("/ProfileTailor")}
            style={{
              background: "#1a1a2e", color: "#fff", border: "none",
              padding: "12px 28px", borderRadius: "8px", cursor: "pointer",
              fontSize: "1rem", fontWeight: "bold", letterSpacing: "0.5px",
              boxShadow: "0 4px 12px rgba(26,26,46,0.3)",
              transition: "transform 0.15s"
            }}
            onMouseOver={e => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseOut={e => (e.currentTarget.style.transform = "translateY(0)")}
          >
            {tailor ? "✏️ Edit Profile" : "➕ Create Profile"}
          </button>
        </div>

      </div>

      <div style={{ maxWidth: "900px", margin: "40px auto", padding: "0 20px" }}>
        <WorkPortfolio />
      </div>
    </div>
  );
}