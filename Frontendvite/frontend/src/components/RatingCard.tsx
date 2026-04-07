import { useState } from "react";
import axios from "axios";

export default function RatingCard({ customerEmail }: { customerEmail: string }) {
  const [contact, setContact] = useState("");
  const [foundTailor, setFoundTailor] = useState<any>(null);
  const [stars, setStars] = useState(0);
  const [review, setReview] = useState("");

  const searchTailor = async () => {
    try {
      const res = await axios.get(`https://tailor-connect-backendreactmvc.vercel.app/api/tailor/contact/${contact}`);
      setFoundTailor(res.data);
    } catch (err) {
      alert("Tailor not found with this contact number");
      setFoundTailor(null);
    }
  };

  const publishReview = async () => {
    if (stars === 0) return alert("Please select stars");
    try {
      await axios.post("https://tailor-connect-backendreactmvc.vercel.app/api/tailor/rate", {
        tailorId: foundTailor._id,
        stars,
        review,
        customerEmail
      });
      alert("Review Published Successfully!");
      setFoundTailor(null); // Reset
      setContact("");
    } catch (err) {
      alert("Error publishing review");
    }
  };

  return (
    <div style={{ background: "#fff", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
      <h3 style={{ color: "#2c1810", marginBottom: "15px" }}>Rate a Tailor</h3>
      
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input 
          type="text" placeholder="Enter Tailor's Mobile Number"
          style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
          value={contact} onChange={(e) => setContact(e.target.value)}
        />
        <button onClick={searchTailor} style={{ background: "#2c1810", color: "#fff", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>
          Find
        </button>
      </div>

      {foundTailor && (
        <div style={{ borderTop: "1px solid #eee", paddingTop: "20px", textAlign: "center" }}>
          <img src={foundTailor.profilePic} style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover" }} />
          <h4 style={{ margin: "10px 0" }}>Reviewing: {foundTailor.name}</h4>
          
          <div style={{ fontSize: "1.5rem", marginBottom: "15px" }}>
            {[1, 2, 3, 4, 5].map(s => (
              <span key={s} onClick={() => setStars(s)} style={{ cursor: "pointer", color: s <= stars ? "#e8c547" : "#ccc" }}>★</span>
            ))}
          </div>

          <textarea 
            placeholder="Write your review here..."
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", marginBottom: "15px" }}
            onChange={(e) => setReview(e.target.value)}
          />

          <button 
            onClick={publishReview}
            style={{ width: "100%", background: "#e8c547", color: "#2c1810", fontWeight: "bold", padding: "12px", border: "none", borderRadius: "8px", cursor: "pointer" }}
          >
            Publish Review
          </button>
        </div>
      )}
    </div>
  );
}