import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = (import.meta.env.VITE_API_URL as string | undefined) || "https://tailor-connect-backend.onrender.com/api/search";
const WORK_API = (import.meta.env.VITE_API_URL as string | undefined) || "https://tailor-connect-backend.onrender.com/api/work";
const PAGE_SIZE = 6;


interface Tailor {
  email: any;
  id: number;
  name: string;
  city: string;
  gender: string;
  specialties: string[];
  rating: number | null;
  experience: string | number;
  price: string;
  phone: string;
  verified: number;
}


interface WorkPost {
  _id: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
}


interface CityDropdownProps {
  value: string;
  onChange: (val: string) => void;
}

function CityDropdown({ value, onChange }: CityDropdownProps) {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(`${API}/cities`)
      .then((r) => r.json())
      .then((d: { cities: string[] }) => setCities(d.cities ?? []))
      .catch(() => setCities([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        disabled={loading}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          onChange(e.target.value)
        }
        style={{
          width: "100%",
          padding: "10px 36px 10px 14px",
          borderRadius: 10,
          border: "1.5px solid #e2cbb0",
          background: "#fffaf5",
          fontSize: 14,
          outline: "none",
          color: value ? "#3a2010" : "#999",
          fontFamily: "inherit",
          appearance: "none",
          cursor: "pointer",
          boxSizing: "border-box",
          opacity: loading ? 0.6 : 1,
        }}
      >
        <option value="">
          {loading ? "Loading cities…" : "Select city"}
        </option>
        {cities.map((c: string) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
     
      <span
        style={{
          position: "absolute",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          color: "#b5451b",
          fontSize: 11,
        }}
      >
        ▼
      </span>
    </div>
  );
}


interface TailorCardProps {
  tailor: Tailor;
  delay: number;
  
}

function TailorCard({ tailor, delay }: TailorCardProps) {
  const [expanded, setExpanded] = React.useState(false);
  const [workPosts, setWorkPosts] = React.useState<WorkPost[]>([]);
  const [loadingPosts, setLoadingPosts] = React.useState(false);

  const loadWork = () => {
    if (expanded) { setExpanded(false); return; }
    setExpanded(true);
    if (workPosts.length > 0) return; 
    setLoadingPosts(true);
    fetch(`${WORK_API}/${tailor.email}`) 
      .then(r => r.json())
      .then(d => setWorkPosts(d.posts || []))
      .catch(() => setWorkPosts([]))
      .finally(() => setLoadingPosts(false));
  };

    const palette = [
    "#b5451b",
    "#1b6b45",
    "#1b3b6b",
    "#6b1b5a",
    "#8b6914",
    "#1b5f6b",
  ];
  const bg = palette[tailor.id % palette.length];
  const initials = tailor.name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: "22px 20px",
        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
        border: "1px solid #f0e6d8",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        position: "relative",
        animation: `fadeUp 0.4s ease ${delay}s both`,
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(181,69,27,0.15)";
      }}
      onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.07)";
      }}
    >
      {tailor.verified === 1 && (
        <span
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "#e6f7ee",
            color: "#1b6b45",
            fontSize: 11,
            fontWeight: 700,
            padding: "3px 8px",
            borderRadius: 20,
          }}
        >
          ✓ Verified
        </span>
      )}

     
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 700,
          fontSize: 18,
          letterSpacing: 1,
        }}
      >
        {initials}
      </div>

      <div>
        <h3
          style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#2a1a0a" }}
        >
          {tailor.name}
        </h3>
        <p style={{ margin: "3px 0 0", fontSize: 13, color: "#888" }}>
          📍 {tailor.city}
        </p>
      </div>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        <span
          style={{
            background: "#fff4ed",
            color: "#b5451b",
            fontSize: 11,
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: 20,
          }}
        >
          {tailor.gender}
        </span>
        {(tailor.specialties ?? []).map((s: string) => (
          <span
            key={s}
            style={{
              background: "#f5f0ff",
              color: "#5b3fa0",
              fontSize: 11,
              fontWeight: 600,
              padding: "3px 10px",
              borderRadius: 20,
            }}
          >
            {s}
          </span>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 13,
          color: "#555",
        }}
      >
        <span>⭐ {tailor.rating ?? "New"}</span>
        <span>{tailor.experience ? `Since ${tailor.experience}` : "—"}</span>
      </div>

      {tailor.price && (
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 600,
            color: "#b5451b",
          }}
        >
          {tailor.price}
        </p>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <a
          href={`tel:${tailor.phone}`}
          style={{
            flex: 1,
            textAlign: "center",
            padding: "8px",
            borderRadius: 10,
            background: "#f5f0f0",
            color: "#3a2010",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
            border: "1px solid #e8d8cc",
          }}
        >
          📞 Call
        </a>
        <button
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: 10,
            border: "none",
            background: "linear-gradient(135deg, #b5451b, #e06030)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Book Now
        </button>
      </div>
  
  
      <button
        onClick={loadWork}
        style={{
          width:"100%", padding:"8px", borderRadius:10,
          border:"1.5px solid #e2cbb0",
          background: expanded ? "#2c1810" : "#fdf8f4",
          color: expanded ? "#fff" : "#2c1810",
          fontSize:12, fontWeight:700, cursor:"pointer",
          transition:"all 0.2s", marginTop:2
        }}
      >
        {expanded ? "▲ Hide Work" : "📸 View Work"}
      </button>

      {/* ── Work posts panel ── */}
      {expanded && (
        <div style={{ marginTop:10 }}>
          {loadingPosts ? (
            <p style={{ fontSize:12, color:"#aaa", textAlign:"center", padding:"12px 0" }}>Loading…</p>
          ) : workPosts.length === 0 ? (
            <p style={{ fontSize:12, color:"#bbb", textAlign:"center", fontStyle:"italic", padding:"10px 0" }}>
              No work photos posted yet.
            </p>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {workPosts.map((wp) => (
                <div key={wp._id} style={{
                  borderRadius:10, overflow:"hidden",
                  border:"1px solid #f0e6d8", background:"#fff"
                }}>
                  <div style={{ position:"relative", paddingTop:"80%", background:"#f5ece4" }}>
                    <img src={wp.imageUrl} alt={wp.title}
                      style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
                    {wp.price && (
                      <span style={{
                        position:"absolute", top:5, right:5,
                        background:"#2c1810", color:"#fff",
                        fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20
                      }}>{wp.price}</span>
                    )}
                  </div>
                  <div style={{ padding:"7px 8px" }}>
                    <p style={{ margin:0, fontSize:11, fontWeight:700, color:"#2a1a0a" }}>{wp.title}</p>
                    {wp.description && (
                      <p style={{ margin:"2px 0 0", fontSize:10, color:"#999", lineHeight:1.4 }}>{wp.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


export function FindTailorsPage() {
  const nav = useNavigate();
  const [city, setCity] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [dress, setDress] = useState<string>("");
  const [dressOptions, setDressOptions] = useState<string[]>([]);
  const [dressLoading, setDressLoading] = useState<boolean>(false);
  const [results, setResults] = useState<Tailor[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  
  useEffect(() => {
    setDress("");
    setDressOptions([]);
    if (!city && !gender) return;

    setDressLoading(true);
    const params = new URLSearchParams();
    if (city) params.append("city", city);
    if (gender) params.append("gender", gender);

    fetch(`${API}/dress-types?${params.toString()}`)
      .then((r) => r.json())
      .then((d: { dressTypes: string[] }) =>
        setDressOptions(d.dressTypes ?? [])
      )
      .catch(() => setDressOptions([]))
      .finally(() => setDressLoading(false));
  }, [city, gender]);

  const search = async (p: number = 1): Promise<void> => {
    setLoading(true);
    setSearched(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(p),
        limit: String(PAGE_SIZE),
      });
      if (city) params.append("city", city);
      if (gender) params.append("gender", gender);
      if (dress) params.append("dress", dress);

      const res = await fetch(`${API}/tailors?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error((data.error as string) ?? "Server error");

      setResults(data.tailors as Tailor[]);
      setTotal(data.total as number);
      setTotalPages(data.totalPages as number);
      setPage(p);
    } catch {
      setError("Could not load tailors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  
  const buildPages = (): (number | "…")[] => {
    const delta = 1;
    const range: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta)
      ) {
        range.push(i);
      }
    }
    const result: (number | "…")[] = [];
    let prev: number | null = null;
    for (const i of range) {
      if (prev !== null && i - prev > 1) result.push("…");
      result.push(i);
      prev = i;
    }
    return result;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fdf8f4",
        fontFamily: "'Georgia', serif",
      }}
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

     
      <div
        style={{
          background: "linear-gradient(135deg, #3a1a08, #b5451b)",
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        <button
         onClick={() => nav("/customer-dashboard")}
          style={{
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff",
            borderRadius: 10,
            padding: "8px 16px",
            cursor: "pointer",
            fontSize: 14,
            fontFamily: "inherit",
          }}
        >
          ← Back
        </button>
        <div>
          <h1
            style={{ margin: 0, color: "#fff", fontSize: 22, fontWeight: 700 }}
          >
            Find Tailors
          </h1>
          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.7)",
              fontSize: 13,
            }}
          >
            Discover skilled tailors in your city
          </p>
        </div>
      </div>

      <div
        style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}
      >
        {/* ── Filter Panel ── */}
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: "28px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            border: "1px solid #f0e6d8",
            marginBottom: 32,
            animation: "fadeUp 0.4s ease both",
          }}
        >
          <h2
            style={{
              margin: "0 0 20px",
              fontSize: 17,
              color: "#2a1a0a",
              fontWeight: 700,
            }}
          >
            🔍 Search Filters
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 20,
              marginBottom: 24,
            }}
          >
            {/* City */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#555",
                  marginBottom: 7,
                }}
              >
                City
              </label>
              <CityDropdown
                value={city}
                onChange={(v: string) => {
                  setCity(v);
                  setDress("");
                }}
              />
            </div>

            {/* Gender / Category */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#555",
                  marginBottom: 7,
                }}
              >
                Category
              </label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(["Men", "Women", "Children"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      setGender(g === gender ? "" : g);
                      setDress("");
                    }}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 600,
                      border: `1.5px solid ${
                        gender === g ? "#b5451b" : "#e2cbb0"
                      }`,
                      background: gender === g ? "#fff4ed" : "#fffaf5",
                      color: gender === g ? "#b5451b" : "#555",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      fontFamily: "inherit",
                    }}
                  >
                    {g === "Men" ? "👔" : g === "Women" ? "👗" : "🧒"} {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Dress Type — populated from tailors' actual profile specialties */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#555",
                  marginBottom: 7,
                }}
              >
                Dress Type
                {dressLoading && (
                  <span
                    style={{
                      marginLeft: 8,
                      color: "#b5451b",
                      fontSize: 11,
                      fontWeight: 400,
                    }}
                  >
                    loading…
                  </span>
                )}
              </label>
              <div style={{ position: "relative" }}>
                <select
                  value={dress}
                  disabled={!city && !gender}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setDress(e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "10px 36px 10px 14px",
                    borderRadius: 10,
                    border: "1.5px solid #e2cbb0",
                    background: "#fffaf5",
                    fontSize: 14,
                    outline: "none",
                    color: dress ? "#3a2010" : "#999",
                    opacity: !city && !gender ? 0.5 : 1,
                    cursor: !city && !gender ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    appearance: "none",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="">
                    {!city && !gender
                      ? "Select city or category first"
                      : dressOptions.length === 0 && !dressLoading
                      ? "No dress types found"
                      : "All Dress Types"}
                  </option>
                  {dressOptions.map((d: string) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <span
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    color: "#b5451b",
                    fontSize: 11,
                  }}
                >
                  ▼
                </span>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={() => search(1)}
            disabled={loading}
            style={{
              background: loading
                ? "#ccc"
                : "linear-gradient(135deg, #b5451b, #e06030)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "12px 36px",
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 16px rgba(181,69,27,0.3)",
              fontFamily: "inherit",
            }}
          >
            {loading ? "Searching…" : "🔍 Find Tailors"}
          </button>
        </div>

        {/* ── Spinner ── */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div
              style={{
                width: 40,
                height: 40,
                border: "4px solid #f0e6d8",
                borderTopColor: "#b5451b",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 16px",
              }}
            />
            <p style={{ color: "#888", fontStyle: "italic" }}>
              Finding tailors near you…
            </p>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div
            style={{
              background: "#fff0f0",
              border: "1px solid #fcc",
              borderRadius: 12,
              padding: "16px 20px",
              color: "#c00",
              marginBottom: 24,
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* ── Results ── */}
        {!loading && searched && !error && (
          <>
            {/* Count */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <p style={{ margin: 0, color: "#555", fontSize: 14 }}>
                <strong style={{ color: "#b5451b" }}>{total}</strong> tailor
                {total !== 1 ? "s" : ""} found
                {city && (
                  <>
                    {" "}
                    in <strong>{city}</strong>
                  </>
                )}
              </p>
              {totalPages > 1 && (
                <p style={{ margin: 0, color: "#888", fontSize: 13 }}>
                  Page {page} of {totalPages}
                </p>
              )}
            </div>

            {/* Cards grid */}
            {results.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  color: "#aaa",
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 12 }}>🪡</div>
                <p style={{ fontSize: 16, fontStyle: "italic" }}>
                  No tailors found. Try different filters.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 20,
                  marginBottom: 32,
                }}
              >
                {results.map((t: Tailor, i: number) => (
                  <TailorCard key={t.id} tailor={t} delay={i * 0.05} />
                ))}
              </div>
            )}

            {/* ── Pagination ── */}
            {totalPages >= 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 8,
                  flexWrap: "wrap",
                }}
              >
                {/* Prev */}
                <button
                  onClick={() => search(page - 1)}
                  disabled={page === 1}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    border: "1.5px solid #e2cbb0",
                    background: page === 1 ? "#f9f4ef" : "#fff",
                    color: page === 1 ? "#ccc" : "#b5451b",
                    cursor: page === 1 ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  ← Prev
                </button>

                {/* Page numbers with ellipsis */}
                {buildPages().map(
                  (p: number | "…", idx: number) =>
                    p === "…" ? (
                      <span
                        key={`ellipsis-${idx}`}
                        style={{ color: "#aaa", fontSize: 15, padding: "0 2px" }}
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => search(p as number)}
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 10,
                          fontSize: 14,
                          border: `1.5px solid ${
                            page === p ? "#b5451b" : "#e2cbb0"
                          }`,
                          background: page === p ? "#b5451b" : "#fff",
                          color: page === p ? "#fff" : "#555",
                          fontWeight: page === p ? 700 : 400,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        {p}
                      </button>
                    )
                )}

                {/* Next */}
                <button
                  onClick={() => search(page + 1)}
                  disabled={page === totalPages}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    border: "1.5px solid #e2cbb0",
                    background:
                      page === totalPages ? "#f9f4ef" : "#fff",
                    color: page === totalPages ? "#ccc" : "#b5451b",
                    cursor:
                      page === totalPages ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Next →
                </button>

                <span
                  style={{ marginLeft: 8, fontSize: 13, color: "#aaa" }}
                >
                  Page {page} of {totalPages}
                </span>
              </div>
            )}
          </>
        )}

        {/* ── Empty state (before first search) ── */}
        {!searched && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#bbb",
            }}
          >
            <div style={{ fontSize: 56, marginBottom: 12 }}>✂️</div>
            <p style={{ fontStyle: "italic", fontSize: 15 }}>
              Select a city and click "Find Tailors" to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
