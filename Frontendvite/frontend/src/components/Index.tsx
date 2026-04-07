import type { JSX } from "react";
import { useNavigate } from "react-router-dom";

export default function Index(): JSX.Element {

  const nav = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#f5f0eb", fontFamily: "'Georgia', serif" }}>
    
    
      <nav style={{
        background: "#1a1a2e", color: "#fff", padding: "14px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        boxShadow: "0 2px 12px rgba(0,0,0,0.3)", position: "fixed",
        top: 0, width: "100%", zIndex: 50, boxSizing: "border-box"
      }}>
        <span style={{ fontSize: "1.3rem", fontWeight: "bold", letterSpacing: "1px" }}>
          🧵 TailorConnect
        </span>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => nav("/signup")}
            style={{
              background: "#e8c547", color: "#1a1a2e", border: "none",
              padding: "8px 20px", borderRadius: "6px", cursor: "pointer",
              fontWeight: "bold", fontSize: "0.9rem"
            }}
          >
            Signup
          </button>
          <button
            onClick={() => nav("/login")}
            style={{
              background: "transparent", color: "#fff",
              border: "1px solid #fff", padding: "8px 20px",
              borderRadius: "6px", cursor: "pointer", fontSize: "0.9rem"
            }}
          >
            Login
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ paddingTop: "80px" }}>
        <section style={{
          textAlign: "center", padding: "80px 20px 60px",
          background: "linear-gradient(135deg, #1a1a2e 0%, #2c1810 100%)",
          color: "#fff"
        }}>
          <h1 style={{
            fontSize: "3rem", fontWeight: "bold", marginBottom: "16px",
            letterSpacing: "1px", lineHeight: 1.2
          }}>
            Your Perfect TAILOR,<br />Just a Click Away
          </h1>
          <p style={{ fontSize: "1.15rem", color: "#ccc", maxWidth: "500px", margin: "0 auto 32px" }}>
            Connect with skilled tailors in your city. Get custom fits, and quality stitching.
            <br></br>
            CUSTOMER satisfaction above all.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            
          </div>
        </section>

        {/* CARDS SECTION */}
        <section style={{ padding: "60px 20px", maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "1.8rem", color: "#1a1a2e", marginBottom: "40px" }}>
            Who is TailorConnect for?
          </h2>

          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "center" }}>

            {/* CUSTOMER CARD */}
            <div style={{
              background: "#fff", borderRadius: "16px", padding: "32px 28px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)", flex: "1", minWidth: "260px", maxWidth: "380px",
              borderTop: "4px solid #2c1810"
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>👗</div>
              <h3 style={{ fontSize: "1.3rem", color: "#2c1810", marginBottom: "8px" }}>For Customers</h3>
              <p style={{ color: "#666", fontSize: "0.95rem", marginBottom: "24px", lineHeight: 1.6 }}>
                Find trusted tailors near you. Get custom clothes stitched at the best prices.
              </p>
            </div>

            {/* TAILOR CARD */}
            <div style={{
              background: "#fff", borderRadius: "16px", padding: "32px 28px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)", flex: "1", minWidth: "260px", maxWidth: "380px",
              borderTop: "4px solid #1a1a2e"
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🧵</div>
              <h3 style={{ fontSize: "1.3rem", color: "#1a1a2e", marginBottom: "8px" }}>For Tailors</h3>
              <p style={{ color: "#666", fontSize: "0.95rem", marginBottom: "24px", lineHeight: 1.6 }}>
                Showcase your skills, grow your client base, and manage your orders — all in one place.
              </p>
            </div>

          </div>
        </section>

        {/* FOOTER */}
        <footer style={{
          textAlign: "center", padding: "24px",
          color: "#999", fontSize: "0.85rem",
          borderTop: "1px solid #e0e0e0"
        }}>
          © 2025 TailorConnect. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
