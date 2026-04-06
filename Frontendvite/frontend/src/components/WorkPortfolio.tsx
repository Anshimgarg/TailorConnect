import React, { useState, useEffect, useRef } from "react";
import api from "../api";
//import axios from "axios";

const API = "/work";

interface WorkPost {
  _id: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  createdAt: string;
}

const empty = { title: "", description: "", price: "", imageBase64: "", imagePreview: "" };

export default function WorkPortfolio() {
  const email = localStorage.getItem("email") || "";

  const [posts, setPosts]         = useState<WorkPost[]>([]);
  const [loading, setLoading]     = useState(true);
  const [form, setForm]           = useState(empty);
  const [editId, setEditId]       = useState<string | null>(null);
  const [saving, setSaving]       = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const fileRef                   = useRef<HTMLInputElement>(null);

  const fetchPosts = () => {
    setLoading(true);
    api.get(`${API}/${email}`)
      .then(r => setPosts(r.data.posts || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(f => ({ ...f, imageBase64: reader.result as string, imagePreview: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const openNew = () => {
    setForm(empty);
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (p: WorkPost) => {
    setForm({ title: p.title, description: p.description, price: p.price, imageBase64: "", imagePreview: p.imageUrl });
    setEditId(p._id);
    setShowForm(true);
  };

  const cancel = () => { setShowForm(false); setForm(empty); setEditId(null); };

  const save = async () => {
    if (!form.title.trim()) return alert("Title is required");
    if (!editId && !form.imageBase64) return alert("Please select a photo");
    setSaving(true);
    try {
      if (editId) {
        await api.put(`${API}/${editId}`, {
          title: form.title, description: form.description, price: form.price,
          ...(form.imageBase64 ? { imageBase64: form.imageBase64 } : {}),
        });
      } else {
        await api.post(`${API}/post`, {
          tailorEmail: email, title: form.title,
          description: form.description, price: form.price,
          imageBase64: form.imageBase64,
        });
      }
      cancel();
      fetchPosts();
    } catch {
      alert("Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    if (!window.confirm("Delete this post?")) return;
    await api.delete(`${API}/${id}`);
    fetchPosts();
  };

  return (
    <div style={{ fontFamily: "'Georgia', serif" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
        .wp-card:hover { transform:translateY(-4px); box-shadow:0 12px 36px rgba(44,24,16,0.15) !important; }
        .wp-card { transition: transform 0.2s, box-shadow 0.2s; }
        .wp-btn:hover { opacity: 0.85; }
      `}</style>

      {/* ── Section Header ── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <h3 style={{ margin:0, fontSize:20, fontWeight:700, color:"#2c1810" }}>🧵 My Work Portfolio</h3>
          <p style={{ margin:"4px 0 0", fontSize:13, color:"#999" }}>Post your dress photos & prices for customers to see</p>
        </div>
        <button
          onClick={openNew}
          className="wp-btn"
          style={{
            background:"linear-gradient(135deg,#2c1810,#b5451b)", color:"#fff",
            border:"none", borderRadius:12, padding:"10px 22px",
            fontSize:14, fontWeight:700, cursor:"pointer",
            boxShadow:"0 4px 16px rgba(181,69,27,0.3)"
          }}
        >+ Add Post</button>
      </div>

      {/* ── Posts Grid ── */}
      {loading ? (
        <p style={{ color:"#aaa", textAlign:"center", padding:"40px 0" }}>Loading posts…</p>
      ) : posts.length === 0 ? (
        <div style={{
          textAlign:"center", padding:"48px 20px", background:"#fff",
          borderRadius:16, border:"2px dashed #f0e6d8"
        }}>
          <div style={{ fontSize:48, marginBottom:10 }}>📸</div>
          <p style={{ color:"#bbb", fontStyle:"italic" }}>No posts yet. Add your first work photo!</p>
        </div>
      ) : (
        <div style={{
          display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:18
        }}>
          {posts.map((p, i) => (
            <div
              key={p._id}
              className="wp-card"
              style={{
                background:"#fff", borderRadius:16, overflow:"hidden",
                boxShadow:"0 2px 16px rgba(0,0,0,0.07)", border:"1px solid #f0e6d8",
                animation:`fadeUp 0.35s ease ${i*0.05}s both`
              }}
            >
              {/* Photo */}
              <div style={{ position:"relative", paddingTop:"72%", background:"#f5ece4" }}>
                <img
                  src={p.imageUrl} alt={p.title}
                  style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}
                />
                {p.price && (
                  <span style={{
                    position:"absolute", top:10, right:10,
                    background:"#2c1810", color:"#fff",
                    fontSize:12, fontWeight:700, padding:"4px 10px", borderRadius:20
                  }}>{p.price}</span>
                )}
              </div>

              {/* Info */}
              <div style={{ padding:"14px 16px" }}>
                <h4 style={{ margin:"0 0 4px", fontSize:15, fontWeight:700, color:"#2c1810" }}>{p.title}</h4>
                {p.description && (
                  <p style={{ margin:"0 0 10px", fontSize:12, color:"#888", lineHeight:1.5 }}>{p.description}</p>
                )}

                {/* Action buttons */}
                <div style={{ display:"flex", gap:8 }}>
                  <button
                    onClick={() => openEdit(p)}
                    className="wp-btn"
                    style={{
                      flex:1, padding:"7px", borderRadius:8, border:"1.5px solid #e2cbb0",
                      background:"#fff", color:"#2c1810", fontSize:12, fontWeight:600, cursor:"pointer"
                    }}
                  >✏️ Edit</button>
                  <button
                    onClick={() => del(p._id)}
                    className="wp-btn"
                    style={{
                      flex:1, padding:"7px", borderRadius:8, border:"none",
                      background:"#fff0f0", color:"#c0392b", fontSize:12, fontWeight:600, cursor:"pointer"
                    }}
                  >🗑️ Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal Form ── */}
      {showForm && (
        <div style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.55)",
          display:"flex", alignItems:"center", justifyContent:"center",
          zIndex:1000, padding:20
        }}
          onClick={(e) => { if (e.target === e.currentTarget) cancel(); }}
        >
          <div style={{
            background:"#fff", borderRadius:20, padding:32, width:"100%", maxWidth:480,
            boxShadow:"0 24px 80px rgba(0,0,0,0.25)", animation:"modalIn 0.2s ease both"
          }}>
            <h3 style={{ margin:"0 0 20px", fontSize:18, fontWeight:700, color:"#2c1810" }}>
              {editId ? "✏️ Edit Post" : "📸 New Work Post"}
            </h3>

            {/* Image picker */}
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                width:"100%", paddingTop:"56%", position:"relative",
                borderRadius:12, overflow:"hidden", cursor:"pointer",
                background: form.imagePreview ? "transparent" : "#fdf4ee",
                border: form.imagePreview ? "none" : "2px dashed #e2cbb0",
                marginBottom:16
              }}
            >
              {form.imagePreview ? (
                <img src={form.imagePreview} alt="preview"
                  style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
              ) : (
                <div style={{
                  position:"absolute", inset:0, display:"flex",
                  flexDirection:"column", alignItems:"center", justifyContent:"center", color:"#c9a87e"
                }}>
                  <span style={{ fontSize:32 }}>📷</span>
                  <span style={{ fontSize:13, marginTop:6 }}>Click to upload photo</span>
                </div>
              )}
              {form.imagePreview && (
                <div style={{
                  position:"absolute", inset:0, background:"rgba(0,0,0,0)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  opacity:0, transition:"opacity 0.2s"
                }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
                >
                  <span style={{
                    background:"rgba(0,0,0,0.6)", color:"#fff",
                    padding:"6px 14px", borderRadius:20, fontSize:12
                  }}>Change Photo</span>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleImage} />

            {/* Fields */}
            {[
              { label:"Title *", key:"title",       placeholder:"e.g. Bridal Lehenga, Men's Suit" },
              { label:"Price",   key:"price",       placeholder:"e.g. ₹1200 or ₹800–₹1500" },
              { label:"Description", key:"description", placeholder:"Brief note about this work…" },
            ].map(({ label, key, placeholder }) => (
              <div key={key} style={{ marginBottom:14 }}>
                <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#555", marginBottom:5 }}>
                  {label}
                </label>
                {key === "description" ? (
                  <textarea
                    value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    rows={3}
                    style={{
                      width:"100%", padding:"10px 12px", borderRadius:10,
                      border:"1.5px solid #e2cbb0", fontSize:13, fontFamily:"inherit",
                      outline:"none", resize:"vertical", boxSizing:"border-box"
                    }}
                  />
                ) : (
                  <input
                    value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    style={{
                      width:"100%", padding:"10px 12px", borderRadius:10,
                      border:"1.5px solid #e2cbb0", fontSize:13, fontFamily:"inherit",
                      outline:"none", boxSizing:"border-box"
                    }}
                  />
                )}
              </div>
            ))}

            {/* Buttons */}
            <div style={{ display:"flex", gap:10, marginTop:4 }}>
              <button
                onClick={cancel}
                style={{
                  flex:1, padding:"11px", borderRadius:10,
                  border:"1.5px solid #e2cbb0", background:"#fff",
                  color:"#555", fontSize:14, fontWeight:600, cursor:"pointer"
                }}
              >Cancel</button>
              <button
                onClick={save}
                disabled={saving}
                style={{
                  flex:2, padding:"11px", borderRadius:10, border:"none",
                  background: saving ? "#ccc" : "linear-gradient(135deg,#2c1810,#b5451b)",
                  color:"#fff", fontSize:14, fontWeight:700, cursor: saving ? "not-allowed" : "pointer",
                  boxShadow:"0 4px 16px rgba(181,69,27,0.3)"
                }}
              >{saving ? "Saving…" : editId ? "Update Post" : "Publish Post"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}