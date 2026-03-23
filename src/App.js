import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import MyBookings from "./pages/MyBookings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";

const API = "https://cometai-backend.onrender.com";

// ─── SHARED FONTS + KEYFRAMES ────────────────────────────────────────────────
const SHARED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);} }
  @keyframes floatUD   { 0%,100%{transform:translateY(0);}50%{transform:translateY(-9px);} }
  @keyframes blink     { 50%{opacity:0;} }
  @keyframes gradShift { 0%,100%{background-position:0% 50%;}50%{background-position:100% 50%;} }
  @keyframes planeOrbit{ from{transform:rotate(0deg) translateX(22px) rotate(0deg);}to{transform:rotate(360deg) translateX(22px) rotate(-360deg);} }
  @keyframes orbitRing { from{transform:rotate(0deg);}to{transform:rotate(360deg);} }
  @keyframes pulseRing { 0%{transform:translate(-50%,-50%) scale(1);opacity:0.4;}100%{transform:translate(-50%,-50%) scale(2.3);opacity:0;} }
  @keyframes spinSlow  { from{transform:rotate(0deg);}to{transform:rotate(360deg);} }
  ::-webkit-scrollbar{width:3px;}
  ::-webkit-scrollbar-thumb{background:#6C63FF;border-radius:2px;}
`;

// ─── ALVRYN ICON ─────────────────────────────────────────────────────────────
function AlvrynIcon({ size = 40, spin = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ig_a" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6C63FF"/><stop offset="100%" stopColor="#00C2FF"/>
        </linearGradient>
        <linearGradient id="ig_p" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B6B"/><stop offset="100%" stopColor="#FFD93D"/>
        </linearGradient>
      </defs>
      <ellipse cx="30" cy="30" rx="27" ry="11"
        stroke="url(#ig_a)" strokeWidth="1.2" strokeDasharray="5 3" opacity="0.45"
        style={spin ? { animation:"orbitRing 5s linear infinite", transformOrigin:"30px 30px" } : {}}/>
      <text x="10" y="47" fontFamily="'Syne',sans-serif" fontWeight="900"
        fontSize="40" fill="url(#ig_a)">A</text>
      <g style={spin ? { animation:"planeOrbit 5s linear infinite", transformOrigin:"30px 30px" } : {}}>
        <path d="M57 30 L50 26 L52 30 L50 34 Z" fill="url(#ig_p)"/>
        <path d="M51 26.5 L51 22 L54 27 Z" fill="url(#ig_p)" opacity="0.75"/>
      </g>
    </svg>
  );
}

// ─── AURORA CANVAS ────────────────────────────────────────────────────────────
function AuroraBackground({ colors, opacity = 1 }) {
  const ref = React.useRef(null);
  const raf = React.useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let W = c.offsetWidth, H = c.offsetHeight;
    c.width = W; c.height = H;
    const blobs = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
      r: 200 + Math.random() * 180, ci: i % colors.length,
    }));
    const resize = () => { W = c.offsetWidth; H = c.offsetHeight; c.width = W; c.height = H; };
    window.addEventListener("resize", resize);
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      blobs.forEach(b => {
        b.x += b.vx; b.y += b.vy;
        if (b.x < -b.r || b.x > W + b.r) b.vx *= -1;
        if (b.y < -b.r || b.y > H + b.r) b.vy *= -1;
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, colors[b.ci % colors.length] + "28");
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
      });
      raf.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener("resize", resize); };
  }, [colors]);
  return <canvas ref={ref} style={{
    position:"absolute", inset:0, width:"100%", height:"100%",
    pointerEvents:"none", zIndex:0, opacity,
  }}/>;
}

// ─── CITIES + DATA ─────────────────────────────────────────────────────────
const CITIES = [
  { code:"BLR", name:"Bangalore", full:"Kempegowda International", country:"India" },
  { code:"BOM", name:"Mumbai", full:"Chhatrapati Shivaji International", country:"India" },
  { code:"DEL", name:"Delhi", full:"Indira Gandhi International", country:"India" },
  { code:"MAA", name:"Chennai", full:"Chennai International", country:"India" },
  { code:"HYD", name:"Hyderabad", full:"Rajiv Gandhi International", country:"India" },
  { code:"CCU", name:"Kolkata", full:"Netaji Subhas Chandra Bose Intl", country:"India" },
  { code:"GOI", name:"Goa", full:"Dabolim Airport", country:"India" },
  { code:"PNQ", name:"Pune", full:"Pune Airport", country:"India" },
  { code:"COK", name:"Kochi", full:"Cochin International", country:"India" },
  { code:"AMD", name:"Ahmedabad", full:"Sardar Vallabhbhai Patel Intl", country:"India" },
  { code:"JAI", name:"Jaipur", full:"Jaipur International", country:"India" },
  { code:"DXB", name:"Dubai", full:"Dubai International", country:"UAE" },
  { code:"SIN", name:"Singapore", full:"Changi Airport", country:"Singapore" },
];
const CLASSES = ["Economy", "Premium Economy", "Business", "First Class"];

function formatTime(dt) { if (!dt) return "--:--"; return new Date(dt).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:false}); }
function formatDate(dt) { if (!dt) return ""; return new Date(dt).toLocaleDateString("en-IN",{day:"numeric",month:"short"}); }
function calcDuration(dep, arr) {
  if (!dep || !arr) return "";
  const diff = (new Date(arr) - new Date(dep)) / 60000;
  const h = Math.floor(diff / 60), m = diff % 60;
  return `${h}h${m > 0 ? " " + m + "m" : ""}`.trim();
}

// ─── CITY MODAL ───────────────────────────────────────────────────────────────
function CityModal({ title, onSelect, onClose, exclude }) {
  const [search, setSearch] = useState("");
  const filtered = CITIES.filter(c =>
    c.code !== exclude &&
    (c.name.toLowerCase().includes(search.toLowerCase()) ||
     c.code.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,0.5)",
      zIndex:500, display:"flex", alignItems:"center", justifyContent:"center",
      backdropFilter:"blur(8px)", padding:20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width:"100%", maxWidth:440,
        background:"rgba(255,255,255,0.96)", backdropFilter:"blur(20px)",
        borderRadius:22, padding:28, boxShadow:"0 24px 80px rgba(0,0,0,0.15)",
        border:"1px solid rgba(0,0,0,0.06)", animation:"fadeUp 0.3s both",
      }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:18,
          color:"#0a0a0a", marginBottom:16 }}>{title}</div>
        <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search city…"
          style={{ width:"100%", padding:"12px 16px", borderRadius:12, fontSize:15,
            fontFamily:"'DM Sans',sans-serif", border:"1.5px solid rgba(108,99,255,0.3)",
            outline:"none", marginBottom:16, color:"#0a0a0a", background:"#fafafa" }}/>
        <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:320, overflowY:"auto" }}>
          {filtered.map(city => (
            <div key={city.code} onClick={() => onSelect(city)}
              style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"13px 16px", borderRadius:12, cursor:"pointer",
                background:"#fafafa", border:"1px solid rgba(0,0,0,0.05)",
                transition:"all 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f0eeff"}
              onMouseLeave={e => e.currentTarget.style.background = "#fafafa"}>
              <div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600,
                  fontSize:15, color:"#0a0a0a" }}>{city.name}</div>
                <div style={{ fontSize:12, color:"#aaa", marginTop:2 }}>{city.full} · {city.country}</div>
              </div>
              <div style={{ fontFamily:"'Space Mono',monospace", fontWeight:700,
                fontSize:15, color:"#6C63FF" }}>{city.code}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PAYMENT MODAL (kept from original) ──────────────────────────────────────
function PaymentModal({ flight, passengerName, passengers, cabinClass, onSuccess, onCancel }) {
  const [step, setStep] = useState("payment");
  const [payMethod, setPayMethod] = useState("card");
  const [cardNo, setCardNo] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [bookingId] = useState("ALV" + Date.now().toString(36).toUpperCase().slice(-6));
  const total = flight.price * passengers;
  const fmtCard = v => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const fmtExp  = v => { const d=v.replace(/\D/g,"").slice(0,4); return d.length>=3?d.slice(0,2)+"/"+d.slice(2):d; };
  const handlePay = () => {
    if (payMethod==="card" && (!cardNo||!expiry||!cvv)) { alert("Fill all card details"); return; }
    setStep("processing");
    setTimeout(() => setStep("success"), 2500);
  };

  const overlayStyle = {
    position:"fixed", inset:0, background:"rgba(0,0,0,0.55)",
    zIndex:600, display:"flex", alignItems:"center", justifyContent:"center",
    backdropFilter:"blur(10px)", padding:20,
  };
  const cardStyle = {
    width:"100%", maxWidth:440,
    background:"rgba(255,255,255,0.97)", backdropFilter:"blur(20px)",
    borderRadius:24, overflow:"hidden",
    boxShadow:"0 32px 100px rgba(0,0,0,0.18)", animation:"fadeUp 0.4s both",
  };

  if (step==="processing") return (
    <div style={overlayStyle}>
      <div style={cardStyle}>
        <div style={{ background:"linear-gradient(135deg,#6C63FF,#00C2FF)", padding:"18px 24px",
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, color:"#fff", fontSize:16 }}>Alvryn Pay</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.8)" }}>🔒 Secure</div>
        </div>
        <div style={{ padding:"60px 24px", textAlign:"center" }}>
          <div style={{ width:52, height:52, border:"3px solid rgba(108,99,255,0.2)",
            borderTopColor:"#6C63FF", borderRadius:"50%",
            animation:"spinSlow 1s linear infinite", margin:"0 auto 20px" }}/>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:"#6C63FF",
            fontSize:14, letterSpacing:"0.1em" }}>Processing payment…</div>
        </div>
      </div>
    </div>
  );

  if (step==="success") return (
    <div style={overlayStyle}>
      <div style={cardStyle}>
        <div style={{ background:"linear-gradient(135deg,#6C63FF,#00C2FF)", padding:"18px 24px" }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, color:"#fff", fontSize:16 }}>Alvryn Pay</div>
        </div>
        <div style={{ padding:"40px 28px", textAlign:"center" }}>
          <div style={{ fontSize:56, marginBottom:16 }}>🎉</div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:22,
            color:"#0a0a0a", marginBottom:10 }}>Booking Confirmed!</div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:"#777",
            lineHeight:1.7, marginBottom:24 }}>
            {flight.airline} · {flight.from_city} → {flight.to_city}<br/>
            Passenger: {passengerName}{passengers>1?` +${passengers-1} more`:""}<br/>
            Class: {cabinClass}
          </div>
          <div style={{ background:"#f0eeff", borderRadius:14, padding:"16px",
            marginBottom:24, border:"1px solid rgba(108,99,255,0.2)" }}>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10,
              color:"#aaa", marginBottom:6, letterSpacing:"0.12em" }}>BOOKING ID</div>
            <div style={{ fontFamily:"'Space Mono',monospace", fontWeight:700,
              fontSize:18, color:"#6C63FF", letterSpacing:"0.15em" }}>{bookingId}</div>
          </div>
          <button onClick={() => onSuccess(bookingId)}
            style={{ width:"100%", padding:"14px", borderRadius:13, fontSize:15,
              fontWeight:700, fontFamily:"'Syne',sans-serif", color:"#fff",
              background:"linear-gradient(135deg,#6C63FF,#00C2FF)", border:"none", cursor:"pointer",
              boxShadow:"0 6px 24px rgba(108,99,255,0.4)" }}>
            View My Bookings →
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={overlayStyle} onClick={onCancel}>
      <div style={cardStyle} onClick={e => e.stopPropagation()}>
        <div style={{ background:"linear-gradient(135deg,#6C63FF,#00C2FF)", padding:"18px 24px",
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, color:"#fff", fontSize:16 }}>Alvryn Pay</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.8)" }}>🔒 256-bit SSL</div>
        </div>
        <div style={{ padding:"28px" }}>
          {/* Amount */}
          <div style={{ textAlign:"center", padding:"16px", borderRadius:14,
            background:"#f0eeff", border:"1px solid rgba(108,99,255,0.15)", marginBottom:22 }}>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10,
              color:"#aaa", marginBottom:6, letterSpacing:"0.12em" }}>TOTAL AMOUNT</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:30,
              color:"#6C63FF" }}>₹{total.toLocaleString()}</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"#aaa", marginTop:4 }}>
              {flight.from_city} → {flight.to_city} · {passengers} pax · {cabinClass}
            </div>
          </div>
          {/* Method tabs */}
          <div style={{ display:"flex", gap:8, marginBottom:20 }}>
            {[["card","💳 Card"],["upi","⚡ UPI"],["netbanking","🏦 Net Banking"]].map(([id,label]) => (
              <button key={id} onClick={() => setPayMethod(id)}
                style={{ flex:1, padding:"10px 4px", borderRadius:10, fontSize:12,
                  fontWeight:600, fontFamily:"'DM Sans',sans-serif", cursor:"pointer",
                  border: payMethod===id ? "1.5px solid #6C63FF" : "1.5px solid rgba(0,0,0,0.1)",
                  background: payMethod===id ? "#f0eeff" : "#fafafa",
                  color: payMethod===id ? "#6C63FF" : "#999" }}>
                {label}
              </button>
            ))}
          </div>
          {/* Card fields */}
          {payMethod==="card" && (
            <>
              {[
                { label:"Card Number", val:cardNo, set:v=>setCardNo(fmtCard(v)), ph:"4111 1111 1111 1111", max:19 },
              ].map(f => (
                <div key={f.label} style={{ marginBottom:14 }}>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600,
                    color:"#aaa", marginBottom:7, letterSpacing:"0.1em" }}>{f.label.toUpperCase()}</div>
                  <input value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph} maxLength={f.max}
                    style={{ width:"100%", padding:"12px 14px", borderRadius:11, fontSize:15,
                      fontFamily:"'DM Sans',sans-serif", border:"1.5px solid rgba(0,0,0,0.1)",
                      outline:"none", color:"#0a0a0a", background:"#fafafa" }}/>
                </div>
              ))}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
                {[
                  { label:"Expiry", val:expiry, set:v=>setExpiry(fmtExp(v)), ph:"MM/YY", max:5 },
                  { label:"CVV", val:cvv, set:v=>setCvv(v.slice(0,3)), ph:"•••", max:3, type:"password" },
                ].map(f => (
                  <div key={f.label}>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600,
                      color:"#aaa", marginBottom:7, letterSpacing:"0.1em" }}>{f.label}</div>
                    <input type={f.type||"text"} value={f.val} onChange={e=>f.set(e.target.value)}
                      placeholder={f.ph} maxLength={f.max}
                      style={{ width:"100%", padding:"12px 14px", borderRadius:11, fontSize:15,
                        fontFamily:"'DM Sans',sans-serif", border:"1.5px solid rgba(0,0,0,0.1)",
                        outline:"none", color:"#0a0a0a", background:"#fafafa" }}/>
                  </div>
                ))}
              </div>
            </>
          )}
          {payMethod==="upi" && (
            <div style={{ marginBottom:14 }}>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600,
                color:"#aaa", marginBottom:7, letterSpacing:"0.1em" }}>UPI ID</div>
              <input placeholder="yourname@upi"
                style={{ width:"100%", padding:"12px 14px", borderRadius:11, fontSize:15,
                  fontFamily:"'DM Sans',sans-serif", border:"1.5px solid rgba(0,0,0,0.1)",
                  outline:"none", color:"#0a0a0a", background:"#fafafa" }}/>
            </div>
          )}
          {payMethod==="netbanking" && (
            <div style={{ marginBottom:14 }}>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600,
                color:"#aaa", marginBottom:7, letterSpacing:"0.1em" }}>SELECT BANK</div>
              <select style={{ width:"100%", padding:"12px 14px", borderRadius:11, fontSize:15,
                fontFamily:"'DM Sans',sans-serif", border:"1.5px solid rgba(0,0,0,0.1)",
                outline:"none", color:"#0a0a0a", background:"#fafafa", cursor:"pointer" }}>
                {["SBI — State Bank of India","HDFC Bank","ICICI Bank","Axis Bank","Kotak Mahindra Bank"].map(b=>(
                  <option key={b}>{b}</option>
                ))}
              </select>
            </div>
          )}
          <button onClick={handlePay}
            style={{ width:"100%", padding:"15px", borderRadius:13, fontSize:16, fontWeight:800,
              fontFamily:"'Syne',sans-serif", color:"#fff", border:"none", cursor:"pointer",
              background:"linear-gradient(135deg,#6C63FF,#00C2FF)", backgroundSize:"200% 200%",
              animation:"gradShift 3s ease infinite",
              boxShadow:"0 8px 28px rgba(108,99,255,0.4)", marginTop:6 }}>
            Pay ₹{total.toLocaleString()} →
          </button>
          <div style={{ textAlign:"center", fontSize:11, color:"#ccc", marginTop:12,
            fontFamily:"'DM Sans',sans-serif" }}>
            🔒 Demo payment — no real money charged
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SEARCH PAGE ──────────────────────────────────────────────────────────────
function SearchPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Auth guard
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const [travelType, setTravelType]       = useState("flight");
  const [tripType, setTripType]           = useState("oneway");
  const [fromCity, setFromCity]           = useState(CITIES[0]);
  const [toCity, setToCity]               = useState(CITIES[1]);
  const [date, setDate]                   = useState("");
  const [returnDate, setReturnDate]       = useState("");
  const [passengers, setPassengers]       = useState(1);
  const [cabinClass, setCabinClass]       = useState("Economy");
  const [showFromModal, setShowFromModal] = useState(false);
  const [showToModal, setShowToModal]     = useState(false);
  const [mode, setMode]                   = useState("structured");
  const [aiQuery, setAiQuery]             = useState("");
  const [flights, setFlights]             = useState([]);
  const [filtered, setFiltered]           = useState([]);
  const [loading, setLoading]             = useState(false);
  const [searched, setSearched]           = useState(false);
  const [bookingFlight, setBookingFlight] = useState(null);
  const [passengerName, setPassengerName] = useState("");
  const [showPayment, setShowPayment]     = useState(false);
  const [filterTime, setFilterTime]       = useState("any");
  const [filterMaxPrice, setFilterMaxPrice] = useState(20000);
  const [sortBy, setSortBy]               = useState("price");
  const [navScrolled, setNavScrolled]     = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetch(`${API}/test`).catch(() => {});
    const t = setInterval(() => fetch(`${API}/test`).catch(() => {}), 14 * 60 * 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    let result = [...flights];
    if (filterTime === "morning")   result = result.filter(f => { const h = new Date(f.departure_time).getHours(); return h >= 5 && h < 12; });
    if (filterTime === "afternoon") result = result.filter(f => { const h = new Date(f.departure_time).getHours(); return h >= 12 && h < 17; });
    if (filterTime === "evening")   result = result.filter(f => { const h = new Date(f.departure_time).getHours(); return h >= 17; });
    result = result.filter(f => f.price <= filterMaxPrice);
    if (sortBy === "price")       result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc")  result.sort((a, b) => b.price - a.price);
    if (sortBy === "departure")   result.sort((a, b) => new Date(a.departure_time) - new Date(b.departure_time));
    if (sortBy === "duration")    result.sort((a, b) => (new Date(a.arrival_time) - new Date(a.departure_time)) - (new Date(b.arrival_time) - new Date(b.departure_time)));
    setFiltered(result);
  }, [flights, filterTime, filterMaxPrice, sortBy]);

  const swapCities = () => { const t = fromCity; setFromCity(toCity); setToCity(t); };

  const searchStructured = async () => {
    setLoading(true); setSearched(true);
    try {
      const params = new URLSearchParams({ from: fromCity.name, to: toCity.name });
      if (date) params.append("date", date);
      const res = await axios.get(`${API}/flights?${params}`);
      setFlights(res.data);
      setFilterMaxPrice(res.data.length > 0 ? Math.max(...res.data.map(f => f.price)) + 1000 : 20000);
    } catch { setFlights([]); }
    setLoading(false);
  };

  const searchAI = async () => {
    if (!aiQuery.trim()) return;
    setLoading(true); setSearched(true);
    try {
      const res = await axios.post(`${API}/ai-search`, { query: aiQuery });
      setFlights(res.data);
      setFilterMaxPrice(res.data.length > 0 ? Math.max(...res.data.map(f => f.price)) + 1000 : 20000);
    } catch { setFlights([]); }
    setLoading(false);
  };

  const handleBookClick = (flight) => {
    if (!token) { navigate("/login"); return; }
    setBookingFlight(flight);
  };

  const handlePassengerConfirm = (name) => { setPassengerName(name); setShowPayment(true); };

  const handlePaymentSuccess = async () => {
    try {
      await axios.post(`${API}/book`, { flight_id: bookingFlight.id, passenger_name: passengerName },
        { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) { console.error(e); }
    setShowPayment(false); setBookingFlight(null);
    navigate("/bookings");
  };

  const accent = "#6C63FF";
  const grad = "linear-gradient(135deg,#6C63FF,#00C2FF)";

  const TRAVEL_TABS = [
    { id:"flight", icon:"✈️", label:"Flights",  cs:false },
    { id:"bus",    icon:"🚌", label:"Buses",    cs:true  },
    { id:"train",  icon:"🚂", label:"Trains",   cs:true  },
    { id:"hotel",  icon:"🏨", label:"Hotels",   cs:true  },
  ];
  const CS_DATA = {
    bus:   { icon:"🚌", title:"Bus Booking", desc:"Book intercity buses across India. AC Sleeper, Semi-Sleeper. Powered by RedBus — coming soon." },
    train: { icon:"🚂", title:"Train Booking", desc:"Search and book Indian Railways tickets. Check PNR status. IRCTC API — coming soon." },
    hotel: { icon:"🏨", title:"Hotel Booking", desc:"Find and book hotels across India and abroad. Booking.com API — coming soon." },
  };

  const inputStyle = {
    width:"100%", padding:"12px 14px", borderRadius:12, fontSize:14,
    fontFamily:"'DM Sans',sans-serif", color:"#0a0a0a",
    background:"#fafafa", border:"1.5px solid rgba(0,0,0,0.09)",
    outline:"none", transition:"border-color 0.2s",
  };
  const labelStyle = {
    fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600,
    color:"#aaa", display:"block", marginBottom:7, letterSpacing:"0.1em",
  };

  return (
    <div style={{ minHeight:"100vh", background:"#f8f8fa", position:"relative", overflowX:"hidden",
      fontFamily:"'DM Sans',sans-serif" }}>
      <style>{SHARED_CSS}</style>
      <AuroraBackground colors={["#6C63FF","#00C2FF","#a78bfa"]} opacity={0.55} />

      {/* Modals */}
      {showFromModal && <CityModal title="Select departure city" onSelect={c=>{setFromCity(c);setShowFromModal(false);}} onClose={()=>setShowFromModal(false)} exclude={toCity.code}/>}
      {showToModal   && <CityModal title="Select destination city" onSelect={c=>{setToCity(c);setShowToModal(false);}} onClose={()=>setShowToModal(false)} exclude={fromCity.code}/>}
      {bookingFlight && !showPayment && (
        <PassengerModal flight={bookingFlight} passengers={passengers}
          onConfirm={handlePassengerConfirm} onCancel={()=>setBookingFlight(null)}/>
      )}
      {bookingFlight && showPayment && (
        <PaymentModal flight={bookingFlight} passengerName={passengerName}
          passengers={passengers} cabinClass={cabinClass}
          onSuccess={handlePaymentSuccess} onCancel={()=>{setShowPayment(false);setBookingFlight(null);}}/>
      )}

      {/* ── NAVBAR ── */}
      <nav style={{
        position:"sticky", top:0, zIndex:200,
        height:66, padding:"0 5%",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background: navScrolled ? "rgba(248,248,250,0.9)" : "rgba(248,248,250,0.7)",
        backdropFilter:"blur(22px)",
        borderBottom:"1px solid rgba(0,0,0,0.05)",
        transition:"all 0.3s ease",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}
          onClick={() => navigate("/")}>
          <div style={{ animation:"floatUD 4s ease-in-out infinite" }}>
            <AlvrynIcon size={38} spin />
          </div>
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:16,
              color:"#0a0a0a", letterSpacing:"-0.04em", lineHeight:1.1 }}>ALVRYN</div>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:7,
              color:accent, letterSpacing:"0.18em" }}>TRAVEL BEYOND</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={() => navigate("/bookings")}
            style={{ padding:"8px 18px", borderRadius:10, fontSize:13, fontWeight:600,
              fontFamily:"'DM Sans',sans-serif", cursor:"pointer",
              background:"transparent", color:"#555", border:"1.5px solid rgba(0,0,0,0.12)",
              transition:"all 0.2s" }}>
            My Bookings
          </button>
          <button onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/login"); }}
            style={{ padding:"8px 18px", borderRadius:10, fontSize:13, fontWeight:600,
              fontFamily:"'DM Sans',sans-serif", cursor:"pointer",
              background:"#fff0f0", color:"#e53935", border:"1.5px solid rgba(229,57,53,0.2)" }}>
            Sign Out
          </button>
        </div>
      </nav>

      {/* ── CONTENT ── */}
      <div style={{ position:"relative", zIndex:1, maxWidth:860, margin:"0 auto", padding:"40px 5% 80px" }}>

        {/* Hero */}
        <div style={{ marginBottom:36, animation:"fadeUp 0.6s both" }}>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:accent,
            letterSpacing:"0.2em", marginBottom:10 }}>SEARCH TRAVEL</div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:900,
            fontSize:"clamp(28px,4vw,48px)", color:"#0a0a0a", lineHeight:1.05, marginBottom:6 }}>
            Hey {user.name?.split(" ")[0] || "Traveller"} 👋
          </h1>
          <p style={{ fontSize:16, color:"#888" }}>Where do you want to fly or ride today?</p>
        </div>

        {/* Travel type tabs */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:28 }}>
          {TRAVEL_TABS.map(tab => (
            <button key={tab.id} onClick={() => { setTravelType(tab.id); setFlights([]); setSearched(false); }}
              style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                padding:"12px 8px", borderRadius:14, cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600,
                border: travelType===tab.id ? `2px solid ${accent}` : "1.5px solid rgba(0,0,0,0.08)",
                background: travelType===tab.id ? "#f0eeff" : "#fff",
                color: travelType===tab.id ? accent : "#888",
                transition:"all 0.2s",
                boxShadow: travelType===tab.id ? `0 4px 16px ${accent}22` : "0 2px 8px rgba(0,0,0,0.04)" }}>
              <span style={{ fontSize:18 }}>{tab.icon}</span>
              {tab.label}
              {tab.cs && (
                <span style={{ fontSize:8, background:"#fff7ed", border:"1px solid rgba(251,191,36,0.3)",
                  color:"#f59e0b", padding:"2px 6px", borderRadius:8, letterSpacing:"0.05em" }}>SOON</span>
              )}
            </button>
          ))}
        </div>

        {/* Coming soon panel */}
        {travelType !== "flight" && (
          <div style={{ background:"#fff", borderRadius:22, padding:"48px 32px", textAlign:"center",
            boxShadow:"0 4px 20px rgba(0,0,0,0.05)", border:"1px solid rgba(0,0,0,0.05)",
            animation:"fadeUp 0.4s both" }}>
            <div style={{ fontSize:56, marginBottom:20 }}>{CS_DATA[travelType].icon}</div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:22,
              color:"#0a0a0a", marginBottom:12 }}>{CS_DATA[travelType].title} — Coming Soon</h2>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, color:"#888",
              lineHeight:1.7, maxWidth:400, margin:"0 auto" }}>{CS_DATA[travelType].desc}</p>
          </div>
        )}

        {/* Flight search */}
        {travelType === "flight" && (
          <>
            {/* Search card */}
            <div style={{ background:"#fff", borderRadius:22, padding:"28px",
              boxShadow:"0 4px 20px rgba(0,0,0,0.06)", border:"1px solid rgba(0,0,0,0.05)",
              marginBottom:24, animation:"fadeUp 0.5s 0.1s both" }}>

              {/* Trip type toggle */}
              <div style={{ display:"flex", gap:4, background:"#f5f5f5", borderRadius:12,
                padding:4, marginBottom:22 }}>
                {["oneway","roundtrip"].map(t => (
                  <button key={t} onClick={() => setTripType(t)}
                    style={{ flex:1, padding:"9px", border:"none", borderRadius:10,
                      fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600,
                      cursor:"pointer", transition:"all 0.2s",
                      background: tripType===t ? "#fff" : "transparent",
                      color: tripType===t ? "#0a0a0a" : "#aaa",
                      boxShadow: tripType===t ? "0 2px 8px rgba(0,0,0,0.08)" : "none" }}>
                    {t === "oneway" ? "One Way" : "Round Trip"}
                  </button>
                ))}
              </div>

              {/* Mode toggle */}
              <div style={{ display:"flex", gap:4, background:"#f5f5f5", borderRadius:12,
                padding:4, marginBottom:22 }}>
                {[["structured","🗺 Search"],["ai","🤖 AI Search"]].map(([id,label]) => (
                  <button key={id} onClick={() => { setMode(id); setFlights([]); setSearched(false); }}
                    style={{ flex:1, padding:"9px", border:"none", borderRadius:10,
                      fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600,
                      cursor:"pointer", transition:"all 0.2s",
                      background: mode===id ? "#fff" : "transparent",
                      color: mode===id ? accent : "#aaa",
                      boxShadow: mode===id ? `0 2px 8px rgba(108,99,255,0.12)` : "none" }}>
                    {label}
                  </button>
                ))}
              </div>

              {mode === "structured" && (
                <>
                  {/* City row */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:10,
                    alignItems:"center", marginBottom:14 }}>
                    {[
                      { label:"FROM", city:fromCity, onClick:()=>setShowFromModal(true) },
                      null,
                      { label:"TO",   city:toCity,   onClick:()=>setShowToModal(true)   },
                    ].map((item, i) => item === null ? (
                      <button key="swap" onClick={swapCities}
                        style={{ width:38, height:38, borderRadius:"50%",
                          background:"#f0eeff", border:"1.5px solid rgba(108,99,255,0.25)",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          cursor:"pointer", fontSize:16, color:accent,
                          transition:"all 0.3s", justifySelf:"center" }}
                        onMouseEnter={e=>e.currentTarget.style.transform="rotate(180deg)"}
                        onMouseLeave={e=>e.currentTarget.style.transform="rotate(0deg)"}>
                        ⇄
                      </button>
                    ) : (
                      <div key={item.label} onClick={item.onClick}
                        style={{ background:"#fafafa", borderRadius:14, padding:"14px 16px",
                          border:"1.5px solid rgba(0,0,0,0.08)", cursor:"pointer",
                          transition:"all 0.2s" }}
                        onMouseEnter={e=>{ e.currentTarget.style.borderColor=accent+"55"; e.currentTarget.style.background="#f0eeff"; }}
                        onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(0,0,0,0.08)"; e.currentTarget.style.background="#fafafa"; }}>
                        <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9,
                          color:"#bbb", letterSpacing:"0.15em", marginBottom:4 }}>{item.label}</div>
                        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:900,
                          fontSize:24, color:"#0a0a0a", letterSpacing:"0.05em" }}>{item.city.code}</div>
                        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12,
                          color:"#aaa", marginTop:2 }}>{item.city.name}</div>
                      </div>
                    ))}
                  </div>

                  {/* Date row */}
                  <div style={{ display:"grid", gridTemplateColumns: tripType==="roundtrip" ? "1fr 1fr" : "1fr",
                    gap:12, marginBottom:14 }}>
                    {[
                      { label:"DEPARTURE", val:date, set:setDate, min:today },
                      ...(tripType==="roundtrip" ? [{ label:"RETURN", val:returnDate, set:setReturnDate, min:date||today }] : []),
                    ].map(f => (
                      <div key={f.label} style={{ background:"#fafafa", borderRadius:14,
                        padding:"14px 16px", border:"1.5px solid rgba(0,0,0,0.08)" }}>
                        <label style={labelStyle}>{f.label}</label>
                        <input type="date" value={f.val} min={f.min}
                          onChange={e => f.set(e.target.value)}
                          style={{ ...inputStyle, padding:0, background:"transparent",
                            border:"none", fontSize:15, color:"#0a0a0a" }}/>
                      </div>
                    ))}
                  </div>

                  {/* Passengers + class */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                    <div style={{ background:"#fafafa", borderRadius:14, padding:"14px 16px",
                      border:"1.5px solid rgba(0,0,0,0.08)" }}>
                      <label style={labelStyle}>TRAVELLERS</label>
                      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                        <button onClick={()=>setPassengers(p=>Math.max(1,p-1))}
                          style={{ width:30, height:30, borderRadius:"50%",
                            background:"#f0eeff", border:"1px solid rgba(108,99,255,0.25)",
                            color:accent, fontSize:18, cursor:"pointer",
                            display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
                        <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:900,
                          fontSize:20, color:"#0a0a0a", minWidth:20, textAlign:"center" }}>{passengers}</span>
                        <button onClick={()=>setPassengers(p=>Math.min(9,p+1))}
                          style={{ width:30, height:30, borderRadius:"50%",
                            background:"#f0eeff", border:"1px solid rgba(108,99,255,0.25)",
                            color:accent, fontSize:18, cursor:"pointer",
                            display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
                        <span style={{ fontSize:12, color:"#bbb" }}>Adult{passengers>1?"s":""}</span>
                      </div>
                    </div>
                    <div style={{ background:"#fafafa", borderRadius:14, padding:"14px 16px",
                      border:"1.5px solid rgba(0,0,0,0.08)" }}>
                      <label style={labelStyle}>CLASS</label>
                      <select value={cabinClass} onChange={e=>setCabinClass(e.target.value)}
                        style={{ background:"transparent", border:"none", outline:"none",
                          fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600,
                          color:"#0a0a0a", width:"100%", cursor:"pointer" }}>
                        {CLASSES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </>
              )}

              {mode === "ai" && (
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:12,
                    background:"#fafafa", borderRadius:14, padding:"4px 4px 4px 16px",
                    border:`1.5px solid ${accent}33`, marginBottom:10 }}>
                    <span style={{ fontSize:18, opacity:0.6 }}>🤖</span>
                    <input value={aiQuery} onChange={e=>setAiQuery(e.target.value)}
                      onKeyDown={e => e.key==="Enter" && searchAI()}
                      placeholder="Cheapest flights bangalore to mumbai tomorrow…"
                      style={{ flex:1, background:"transparent", border:"none", outline:"none",
                        fontFamily:"'DM Sans',sans-serif", fontSize:15, color:"#0a0a0a",
                        padding:"12px 0" }}/>
                  </div>
                  <div style={{ fontSize:12, color:"#bbb", textAlign:"center",
                    fontFamily:"'DM Sans',sans-serif" }}>
                    Try: "cheap flights blr to del next friday"
                  </div>
                </div>
              )}

              <button onClick={mode==="structured" ? searchStructured : searchAI}
                style={{ width:"100%", padding:"15px", borderRadius:14, fontSize:15, fontWeight:800,
                  fontFamily:"'Syne',sans-serif", color:"#fff", border:"none", cursor:"pointer",
                  background:grad, backgroundSize:"200% 200%", animation:"gradShift 4s ease infinite",
                  boxShadow:`0 8px 28px ${accent}44`, marginTop:20,
                  transition:"transform 0.2s" }}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                {mode==="structured" ? "Search Flights ✈" : "Search with AI 🤖"}
              </button>
            </div>

            {/* Loading */}
            {loading && (
              <div style={{ textAlign:"center", padding:"60px 0", animation:"fadeUp 0.4s both" }}>
                <div style={{ width:44, height:44, border:`3px solid ${accent}22`,
                  borderTopColor:accent, borderRadius:"50%",
                  animation:"spinSlow 1s linear infinite", margin:"0 auto 16px" }}/>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700,
                  fontSize:15, color:accent }}>Scanning flight paths…</div>
              </div>
            )}

            {/* Filters */}
            {!loading && flights.length > 0 && (
              <div style={{ background:"#fff", borderRadius:18, padding:"20px 22px",
                boxShadow:"0 4px 16px rgba(0,0,0,0.05)", border:"1px solid rgba(0,0,0,0.05)",
                marginBottom:20, animation:"fadeUp 0.4s both" }}>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10,
                  color:"#bbb", letterSpacing:"0.15em", marginBottom:14 }}>FILTER & SORT</div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
                  {[["any","All"],["morning","Morning"],["afternoon","Afternoon"],["evening","Evening"]].map(([v,l]) => (
                    <button key={v} onClick={()=>setFilterTime(v)}
                      style={{ padding:"6px 14px", borderRadius:100, fontSize:12, fontWeight:600,
                        fontFamily:"'DM Sans',sans-serif", cursor:"pointer",
                        border: filterTime===v ? `1.5px solid ${accent}` : "1.5px solid rgba(0,0,0,0.08)",
                        background: filterTime===v ? "#f0eeff" : "#fafafa",
                        color: filterTime===v ? accent : "#aaa" }}>
                      {l}
                    </button>
                  ))}
                  {[["price","Cheapest"],["departure","Earliest"],["duration","Fastest"],["price-desc","Priciest"]].map(([v,l]) => (
                    <button key={v} onClick={()=>setSortBy(v)}
                      style={{ padding:"6px 14px", borderRadius:100, fontSize:12, fontWeight:600,
                        fontFamily:"'DM Sans',sans-serif", cursor:"pointer",
                        border: sortBy===v ? `1.5px solid ${accent}` : "1.5px solid rgba(0,0,0,0.08)",
                        background: sortBy===v ? "#f0eeff" : "#fafafa",
                        color: sortBy===v ? accent : "#aaa" }}>
                      {l}
                    </button>
                  ))}
                </div>
                <input type="range" min="1000" max={filterMaxPrice+1000} step="500"
                  value={filterMaxPrice} onChange={e=>setFilterMaxPrice(Number(e.target.value))}
                  style={{ width:"100%", accentColor:accent }}/>
                <div style={{ display:"flex", justifyContent:"space-between",
                  fontFamily:"'Space Mono',monospace", fontSize:11, color:"#bbb", marginTop:6 }}>
                  <span>₹1,000</span>
                  <span style={{ color:accent }}>Max ₹{filterMaxPrice.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Results */}
            {!loading && searched && (
              <>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10,
                  color:"#bbb", letterSpacing:"0.15em", marginBottom:16 }}>
                  {filtered.length > 0 ? `${filtered.length} of ${flights.length} FLIGHTS` : "NO FLIGHTS MATCH"}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {filtered.map((flight, i) => (
                    <div key={flight.id}
                      style={{ background:"#fff", borderRadius:20, padding:"22px 24px",
                        boxShadow:"0 4px 18px rgba(0,0,0,0.05)", border:"1px solid rgba(0,0,0,0.05)",
                        animation:`fadeUp 0.4s ${i*70}ms both`,
                        transition:"all 0.25s" }}
                      onMouseEnter={e=>{ e.currentTarget.style.borderColor=accent+"44"; e.currentTarget.style.transform="translateY(-2px)"; }}
                      onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(0,0,0,0.05)"; e.currentTarget.style.transform="translateY(0)"; }}>
                      {/* Top row */}
                      <div style={{ display:"flex", justifyContent:"space-between",
                        alignItems:"center", marginBottom:18 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:8, height:8, borderRadius:"50%", background:accent }}/>
                          <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800,
                            fontSize:14, color:"#0a0a0a" }}>{flight.airline}</span>
                          <span style={{ fontFamily:"'Space Mono',monospace", fontSize:11,
                            color:"#bbb" }}>{flight.flight_no}</span>
                        </div>
                        <span style={{ padding:"4px 10px", borderRadius:20, fontSize:10,
                          background:"rgba(52,211,153,0.1)", border:"1px solid rgba(52,211,153,0.25)",
                          color:"#10b981", fontFamily:"'Space Mono',monospace" }}>Non-stop</span>
                      </div>
                      {/* Route */}
                      <div style={{ display:"flex", alignItems:"center",
                        justifyContent:"space-between", marginBottom:18 }}>
                        <div style={{ textAlign:"center" }}>
                          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:900,
                            fontSize:22, color:"#0a0a0a", letterSpacing:"0.03em" }}>
                            {formatTime(flight.departure_time)}
                          </div>
                          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:12,
                            color:"#bbb", marginTop:3 }}>
                            {flight.from_city?.slice(0,3).toUpperCase()}
                          </div>
                          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11,
                            color:"#ccc" }}>{formatDate(flight.departure_time)}</div>
                        </div>
                        <div style={{ flex:1, display:"flex", flexDirection:"column",
                          alignItems:"center", gap:4, padding:"0 16px" }}>
                          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12,
                            color:"#bbb" }}>{calcDuration(flight.departure_time, flight.arrival_time)}</span>
                          <div style={{ width:"100%", display:"flex", alignItems:"center", gap:4 }}>
                            <div style={{ flex:1, height:1,
                              background:`linear-gradient(90deg,${accent}33,${accent}88,${accent}33)` }}/>
                            <span style={{ fontSize:12, color:accent }}>✈</span>
                            <div style={{ flex:1, height:1,
                              background:`linear-gradient(90deg,${accent}88,${accent}33)` }}/>
                          </div>
                          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11,
                            color:"#10b981" }}>Direct</span>
                        </div>
                        <div style={{ textAlign:"center" }}>
                          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:900,
                            fontSize:22, color:"#0a0a0a", letterSpacing:"0.03em" }}>
                            {formatTime(flight.arrival_time)}
                          </div>
                          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:12,
                            color:"#bbb", marginTop:3 }}>
                            {flight.to_city?.slice(0,3).toUpperCase()}
                          </div>
                          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11,
                            color:"#ccc" }}>{formatDate(flight.arrival_time)}</div>
                        </div>
                      </div>
                      {/* Bottom */}
                      <div style={{ display:"flex", alignItems:"center",
                        justifyContent:"space-between",
                        paddingTop:16, borderTop:"1px solid rgba(0,0,0,0.05)" }}>
                        <div>
                          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9,
                            color:"#ccc", letterSpacing:"0.1em" }}>FROM</div>
                          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:900,
                            fontSize:24, color:accent }}>
                            ₹{(flight.price * passengers).toLocaleString()}
                          </div>
                          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"#bbb" }}>
                            {passengers} pax · {cabinClass}
                          </div>
                        </div>
                        <button onClick={() => handleBookClick(flight)}
                          style={{ padding:"12px 26px", borderRadius:13, fontSize:14, fontWeight:700,
                            fontFamily:"'Syne',sans-serif", color:"#fff", border:"none", cursor:"pointer",
                            background:grad, boxShadow:`0 4px 16px ${accent}44`,
                            transition:"all 0.2s" }}
                          onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; }}
                          onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; }}>
                          Book →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Empty */}
            {!loading && !searched && (
              <div style={{ textAlign:"center", padding:"80px 20px", animation:"fadeUp 0.5s both" }}>
                <div style={{ fontSize:64, marginBottom:20, animation:"floatUD 3s ease-in-out infinite" }}>✈️</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700,
                  fontSize:18, color:"#ccc" }}>Your journey starts here</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:"#ddd", marginTop:8 }}>
                  Search flights above or try AI search
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Passenger name modal
function PassengerModal({ flight, passengers, onConfirm, onCancel }) {
  const [name, setName] = useState("");
  return (
    <div onClick={onCancel} style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,0.45)",
      zIndex:500, display:"flex", alignItems:"center", justifyContent:"center",
      backdropFilter:"blur(8px)", padding:20,
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:"100%", maxWidth:420,
        background:"rgba(255,255,255,0.97)", borderRadius:24, padding:"40px 36px",
        boxShadow:"0 24px 80px rgba(0,0,0,0.18)", animation:"fadeUp 0.3s both",
      }}>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:22,
          color:"#0a0a0a", marginBottom:8 }}>Passenger Details</h2>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:"#888", marginBottom:28 }}>
          {flight.airline} · {flight.from_city} → {flight.to_city} · {passengers} passenger{passengers>1?"s":""}
        </p>
        <label style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600,
          color:"#aaa", display:"block", marginBottom:8, letterSpacing:"0.1em" }}>
          FULL NAME
        </label>
        <input autoFocus value={name} onChange={e=>setName(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&name.trim()&&onConfirm(name)}
          placeholder="Enter your full name"
          style={{ width:"100%", padding:"13px 16px", borderRadius:13, fontSize:15,
            fontFamily:"'DM Sans',sans-serif", border:"1.5px solid rgba(108,99,255,0.3)",
            outline:"none", color:"#0a0a0a", background:"#fafafa", marginBottom:24 }}/>
        <div style={{ display:"flex", gap:12 }}>
          <button onClick={onCancel}
            style={{ padding:"13px 22px", borderRadius:13, fontSize:14, fontWeight:600,
              fontFamily:"'DM Sans',sans-serif", background:"transparent", color:"#aaa",
              border:"1.5px solid rgba(0,0,0,0.1)", cursor:"pointer" }}>Cancel</button>
          <button onClick={()=>name.trim()&&onConfirm(name)}
            style={{ flex:1, padding:"13px", borderRadius:13, fontSize:14, fontWeight:700,
              fontFamily:"'Syne',sans-serif", color:"#fff", border:"none", cursor:"pointer",
              background:"linear-gradient(135deg,#6C63FF,#00C2FF)",
              boxShadow:"0 6px 22px rgba(108,99,255,0.4)" }}>
            Continue to Payment →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── APP ROUTER ───────────────────────────────────────────────────────────────
function App() {
  // Keep backend alive
  useEffect(() => {
    fetch(`${API}/test`).catch(() => {});
    const t = setInterval(() => fetch(`${API}/test`).catch(() => {}), 14 * 60 * 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/"          element={<LandingPage />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/search"    element={<SearchPage />} />
        <Route path="/bookings"  element={<MyBookings />} />
        <Route path="/admin"     element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;