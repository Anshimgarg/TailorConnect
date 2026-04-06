import api from "../api";  // ← uses JWT token automatically

import { useEffect, useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
//import axios from "axios";
import RatingCard from "./RatingCard"; // Import the new component



export default function CustomerDashboard(): JSX.Element {
  const nav = useNavigate();
  const email = localStorage.getItem("email") || "";
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/getprofile/${email}`)
      .then(r => setCustomer(r.data))
      .catch(() => setCustomer(null))
      .finally(() => setLoading(false));
  }, [email]);

  const handleLogout = () => {
    localStorage.clear();
    nav("/");
  };

   function onFindTailors(): void {
    nav("/find-tailor");  // ← nav already exists from useNavigate() on line 9
}

  return (
    <div style={{ minHeight: "150vh", background: "#fff8f0", fontFamily: "'Georgia', serif" }}>

      {/* TOP NAV */}
      <nav style={{
        background: "#2c1810", color: "#fff", padding: "14px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        boxShadow: "0 2px 12px rgba(0,0,0,0.3)"
      }}>
        <span style={{ fontSize: "1.3rem", fontWeight: "bold", letterSpacing: "1px" }}>
          🧵 TailorConnect
        </span>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ fontSize: "0.85rem", color: "#cba" }}>{email}</span>
          <button onClick={handleLogout} style={{
            background: "#e74c3c", color: "#fff", border: "none",
            padding: "7px 18px", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem"
          }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: "900px", margin: "40px auto", padding: "0 20px" }}>

        {/* WELCOME */}
        <h2 style={{ fontSize: "1.6rem", color: "#2c1810", marginBottom: "6px" }}>
          Welcome back{customer?.name ? `, ${customer.name}` : ""}! 👋
        </h2>
        <p style={{ color: "#888", marginBottom: "32px" }}>Customer Dashboard</p>

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
            ) : customer?.profilepic ? (
              <img src={customer.profilepic} alt="Profile"
                style={{ width: "110px", height: "110px", borderRadius: "50%", objectFit: "cover", border: "3px solid #2c1810" }} />
            ) : (
              <div style={{
                width: "110px", height: "110px", borderRadius: "50%",
                background: "#2c1810", color: "#fff", fontSize: "2.5rem",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                {customer?.name ? customer.name[0].toUpperCase() : "C"}
              </div>
            )}
          </div>

          {/* INFO */}
          <div style={{ flex: 1, minWidth: "200px" }}>
            {loading ? (
              <p style={{ color: "#999" }}>Loading profile...</p>
            ) : customer ? (
              <>
                <h3 style={{ margin: "0 0 4px", fontSize: "1.3rem", color: "#2c1810" }}>
                  {customer.name || "—"}
                </h3>
                <p style={{ margin: "0 0 10px", color: "#888", fontSize: "0.9rem" }}>{customer.emailid}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 20px", fontSize: "0.9rem" }}>
                  {customer.gender && <span>👤 {customer.gender}</span>}
                  {customer.city && <span>📍 {customer.city}</span>}
                  {customer.state && <span>🗺️ {customer.state}</span>}
                  {customer.address && <span>🏠 {customer.address}</span>}
                </div>
              </>
            ) : (
              <div>
                <p style={{ color: "#999", marginBottom: "8px" }}>No profile created yet.</p>
                <p style={{ color: "#666", fontSize: "0.88rem" }}>Click the button below to set up your profile.</p>
              </div>
            )}
          </div>

          {/* BADGE */}
          {customer && (
            <div style={{ flexShrink: 0 }}>
              <span style={{
                background: "#e8f5e9", color: "#2e7d32", padding: "4px 12px",
                borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold"
              }}>✅ Active</span>
            </div>
          )}
        </div>

        {/* ACTION BUTTON */}
        <div style={{ marginTop: "24px" }}>
          <button
            onClick={() => nav("/profile")}
            style={{
              background: "#2c1810", color: "#fff", border: "none",
              padding: "12px 28px", borderRadius: "8px", cursor: "pointer",
              fontSize: "1rem", fontWeight: "bold", letterSpacing: "0.5px",
              boxShadow: "0 4px 12px rgba(44,24,16,0.3)",
              transition: "transform 0.15s"
            }}
            onMouseOver={e => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseOut={e => (e.currentTarget.style.transform = "translateY(0)")}
          >
            {customer ? "✏️ Edit Profile" : "➕ Create Profile"}
          </button>
        </div>

      </div>

      

<div>
    <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      
      <div
        style={{ maxWidth: 920, margin: "0 auto", padding: "32px 24px" }}
      >
        {/* ── Find Tailors Card ── */}
        <div
          style={{
            background: "linear-gradient(135deg, #fef6f1ff)",
            borderRadius: 20,
            padding: "32px 36px",
            marginBottom: 28,
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(30, 29, 27, 0.35)",
            animation: "fadeUp 0.4s ease both",
          }}
        >
          {/* Decorative circles */}
          <div
            style={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 140,
              height: 140,
              background: "rgba(255,255,255,0.08)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -20,
              right: 60,
              width: 90,
              height: 90,
              background: "rgba(255,255,255,0.06)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />

          {/* Card content */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 24,
            }}
          >
            {/* Left: info */}
            <div>
              <div style={{ fontSize: 40, marginBottom: 10 }}>✂️</div>
              <h2
                style={{
                  margin: "0 0 8px",
                  color: "#090808ff",
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                Find Tailors Near You
              </h2>
              <p
                style={{
                  margin: 0,
                  color: "rgba(27, 26, 26, 0.85)",
                  fontSize: 14,
                  lineHeight: 1.6,
                  maxWidth: 420,
                }}
              >
                Discover skilled tailors in your city. Filter by gender, dress
                type, and specialty to find your perfect match.
              </p>
            </div>

            {/* Right: CTA button */}
            <button
              onClick={onFindTailors}
              style={{
                background: "#fff",
                color: "#b5451b",
                border: "none",
                borderRadius: 14,
                padding: "14px 32px",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                transition: "transform 0.15s, box-shadow 0.15s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0 6px 28px rgba(0,0,0,0.22)";
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(0,0,0,0.15)";
              }}
            >
              🔍 Find Tailors
            </button>
          </div>
        </div>

       
         
      </div>
</div>

<div style={{ maxWidth: "900px", margin: "40px auto", padding: "0 20px" }}>
        
        {/* NEW RATING SECTION */}
        <section>
          <RatingCard customerEmail={email} />
        </section>
       </div>

</div>
  );
}