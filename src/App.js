import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import MyBookings from "./pages/MyBookings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";

const API = "https://cometai-backend.onrender.com";

// ─── SHARED CSS ───────────────────────────────────────────────────────────────
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
  @keyframes spinSlow  { from{transform:rotate(0deg);}to{transform:rotate(360deg);} }
  @keyframes pulseGlow { 0%,100%{box-shadow:0 0 0 0 rgba(108,99,255,0.4);}50%{box-shadow:0 0 0 8px rgba(108,99,255,0);} }
  ::-webkit-scrollbar{width:3px;}
  ::-webkit-scrollbar-thumb{background:#6C63FF;border-radius:2px;}
`;

const ACCENT = "#6C63FF";
const GRAD   = "linear-gradient(135deg,#6C63FF,#00C2FF)";

// ─── CITIES — popular + local ─────────────────────────────────────────────────
const CITIES = [
  // Metros
  { code:"BLR", name:"Bangalore",   full:"Kempegowda International",          country:"India", popular:true  },
  { code:"BOM", name:"Mumbai",      full:"Chhatrapati Shivaji International",  country:"India", popular:true  },
  { code:"DEL", name:"Delhi",       full:"Indira Gandhi International",        country:"India", popular:true  },
  { code:"MAA", name:"Chennai",     full:"Chennai International",              country:"India", popular:true  },
  { code:"HYD", name:"Hyderabad",   full:"Rajiv Gandhi International",        country:"India", popular:true  },
  { code:"CCU", name:"Kolkata",     full:"Netaji Subhas Chandra Bose Intl",   country:"India", popular:true  },
  // Tier 2
  { code:"GOI", name:"Goa",         full:"Dabolim / Mopa Airport",            country:"India", popular:true  },
  { code:"PNQ", name:"Pune",        full:"Pune Airport",                      country:"India", popular:true  },
  { code:"COK", name:"Kochi",       full:"Cochin International",              country:"India", popular:true  },
  { code:"AMD", name:"Ahmedabad",   full:"Sardar Vallabhbhai Patel Intl",     country:"India", popular:true  },
  { code:"JAI", name:"Jaipur",      full:"Jaipur International",              country:"India", popular:true  },
  { code:"LKO", name:"Lucknow",     full:"Chaudhary Charan Singh Intl",      country:"India", popular:false },
  { code:"VNS", name:"Varanasi",    full:"Lal Bahadur Shastri Airport",       country:"India", popular:false },
  { code:"PAT", name:"Patna",       full:"Jay Prakash Narayan Airport",       country:"India", popular:false },
  { code:"BHO", name:"Bhopal",      full:"Raja Bhoj Airport",                 country:"India", popular:false },
  { code:"NAG", name:"Nagpur",      full:"Dr. Babasaheb Ambedkar Intl",       country:"India", popular:false },
  { code:"SXR", name:"Srinagar",    full:"Sheikh ul-Alam Airport",            country:"India", popular:false },
  { code:"IXC", name:"Chandigarh",  full:"Chandigarh Airport",                country:"India", popular:false },
  { code:"GAU", name:"Guwahati",    full:"Lokpriya Gopinath Bordoloi Intl",   country:"India", popular:false },
  { code:"BBI", name:"Bhubaneswar", full:"Biju Patnaik International",        country:"India", popular:false },
  { code:"TRV", name:"Trivandrum",  full:"Trivandrum International",          country:"India", popular:false },
  { code:"IXZ", name:"Port Blair",  full:"Veer Savarkar International",       country:"India", popular:false },
  { code:"UDR", name:"Udaipur",     full:"Maharana Pratap Airport",           country:"India", popular:false },
  { code:"ATQ", name:"Amritsar",    full:"Sri Guru Ram Dass Jee Intl",        country:"India", popular:false },
  { code:"IDR", name:"Indore",      full:"Devi Ahilyabai Holkar Airport",     country:"India", popular:false },
  { code:"RPR", name:"Raipur",      full:"Swami Vivekananda Airport",         country:"India", popular:false },
  // International
  { code:"DXB", name:"Dubai",       full:"Dubai International",               country:"UAE",       popular:true  },
  { code:"SIN", name:"Singapore",   full:"Changi Airport",                    country:"Singapore", popular:true  },
  { code:"BKK", name:"Bangkok",     full:"Suvarnabhumi Airport",              country:"Thailand",  popular:true  },
  { code:"KUL", name:"Kuala Lumpur",full:"Kuala Lumpur International",        country:"Malaysia",  popular:false },
  { code:"LHR", name:"London",      full:"Heathrow Airport",                  country:"UK",        popular:true  },
  { code:"JFK", name:"New York",    full:"John F. Kennedy International",     country:"USA",       popular:true  },
  { code:"CDG", name:"Paris",       full:"Charles de Gaulle Airport",         country:"France",    popular:false },
  { code:"FRA", name:"Frankfurt",   full:"Frankfurt Airport",                 country:"Germany",   popular:false },
  { code:"NRT", name:"Tokyo",       full:"Narita International",              country:"Japan",     popular:false },
  { code:"SYD", name:"Sydney",      full:"Kingsford Smith Airport",           country:"Australia", popular:false },
];

const CLASSES = ["Economy", "Premium Economy", "Business", "First Class"];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function formatTime(dt) {
  if (!dt) return "--:--";
  return new Date(dt).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:false});
}
function formatDate(dt) {
  if (!dt) return "";
  return new Date(dt).toLocaleDateString("en-IN",{day:"numeric",month:"short"});
}
function calcDuration(dep, arr) {
  if (!dep || !arr) return "";
  const diff = (new Date(arr) - new Date(dep)) / 60000;
  const h = Math.floor(diff/60), m = diff%60;
  return `${h}h${m>0?" "+m+"m":""}`.trim();
}

// ─── ALVRYN ICON ─────────────────────────────────────────────────────────────
function AlvrynIcon({ size=40, spin=false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
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
        style={spin?{animation:"orbitRing 5s linear infinite",transformOrigin:"30px 30px"}:{}}/>
      <text x="10" y="47" fontFamily="'Syne',sans-serif" fontWeight="900"
        fontSize="40" fill="url(#ig_a)">A</text>
      <g style={spin?{animation:"planeOrbit 5s linear infinite",transformOrigin:"30px 30px"}:{}}>
        <path d="M57 30 L50 26 L52 30 L50 34 Z" fill="url(#ig_p)"/>
        <path d="M51 26.5 L51 22 L54 27 Z" fill="url(#ig_p)" opacity="0.75"/>
      </g>
    </svg>
  );
}

// ─── AURORA BACKGROUND ────────────────────────────────────────────────────────
function AuroraBackground({ colors, opacity=1 }) {
  const ref = React.useRef(null);
  const raf = React.useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let W=c.offsetWidth, H=c.offsetHeight; c.width=W; c.height=H;
    const blobs = Array.from({length:5},(_,i)=>({
      x:Math.random()*W, y:Math.random()*H,
      vx:(Math.random()-0.5)*0.5, vy:(Math.random()-0.5)*0.5,
      r:200+Math.random()*180, ci:i%colors.length,
    }));
    const resize=()=>{W=c.offsetWidth;H=c.offsetHeight;c.width=W;c.height=H;};
    window.addEventListener("resize",resize);
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      blobs.forEach(b=>{
        b.x+=b.vx; b.y+=b.vy;
        if(b.x<-b.r||b.x>W+b.r) b.vx*=-1;
        if(b.y<-b.r||b.y>H+b.r) b.vy*=-1;
        const g=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r);
        g.addColorStop(0,colors[b.ci%colors.length]+"28");
        g.addColorStop(1,"transparent");
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fill();
      });
      raf.current=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf.current);window.removeEventListener("resize",resize);};
  },[colors]);
  return <canvas ref={ref} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0,opacity}}/>;
}

// ─── CITY MODAL ───────────────────────────────────────────────────────────────
function CityModal({ title, onSelect, onClose, exclude }) {
  const [search, setSearch] = useState("");
  const popular = CITIES.filter(c=>c.code!==exclude && c.popular && c.name.toLowerCase().includes(search.toLowerCase())||c.code!==exclude&&c.code.toLowerCase().includes(search.toLowerCase())&&c.popular);
  const all = CITIES.filter(c=>
    c.code!==exclude &&
    (c.name.toLowerCase().includes(search.toLowerCase())||c.code.toLowerCase().includes(search.toLowerCase()))
  );
  const shown = search ? all : CITIES.filter(c=>c.code!==exclude);

  return (
    <div onClick={onClose} style={{
      position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",
      zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",
      backdropFilter:"blur(8px)",padding:20,
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:"100%",maxWidth:480,
        background:"rgba(255,255,255,0.97)",backdropFilter:"blur(20px)",
        borderRadius:22,padding:28,boxShadow:"0 24px 80px rgba(0,0,0,0.15)",
        border:"1px solid rgba(0,0,0,0.06)",animation:"fadeUp 0.3s both",
        maxHeight:"80vh",display:"flex",flexDirection:"column",
      }}>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:18,color:"#0a0a0a",marginBottom:14}}>{title}</div>
        <input autoFocus value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search city or airport code…"
          style={{width:"100%",padding:"11px 16px",borderRadius:12,fontSize:14,
            fontFamily:"'DM Sans',sans-serif",border:"1.5px solid rgba(108,99,255,0.3)",
            outline:"none",marginBottom:14,color:"#0a0a0a",background:"#fafafa"}}/>
        {!search && (
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:"#bbb",
            letterSpacing:"0.15em",marginBottom:10}}>POPULAR</div>
        )}
        <div style={{display:"flex",flexDirection:"column",gap:5,overflowY:"auto",flex:1}}>
          {shown.map(city=>(
            <div key={city.code} onClick={()=>onSelect(city)}
              style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                padding:"12px 14px",borderRadius:11,cursor:"pointer",
                background:"#fafafa",border:"1px solid rgba(0,0,0,0.05)",transition:"all 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.background="#f0eeff"}
              onMouseLeave={e=>e.currentTarget.style.background="#fafafa"}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:14,color:"#0a0a0a"}}>{city.name}</span>
                  {city.popular && <span style={{fontSize:8,background:"#f0eeff",color:ACCENT,padding:"2px 6px",borderRadius:6,fontFamily:"'Space Mono',monospace"}}>TOP</span>}
                </div>
                <div style={{fontSize:11,color:"#aaa",marginTop:1}}>{city.full} · {city.country}</div>
              </div>
              <div style={{fontFamily:"'Space Mono',monospace",fontWeight:700,fontSize:14,color:ACCENT}}>{city.code}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SEAT SELECTION MODAL ────────────────────────────────────────────────────
function SeatModal({ flight, passengers, onConfirm, onCancel }) {
  // Mock seat map: 6 cols A-F, 20 rows
  const COLS = ["A","B","C","D","E","F"];
  const ROWS = Array.from({length:20},(_,i)=>i+1);
  const [taken] = useState(() => {
    // Random mock taken seats
    const t = new Set();
    for(let i=0;i<18;i++) t.add(`${Math.ceil(Math.random()*20)}${COLS[Math.floor(Math.random()*6)]}`);
    return t;
  });
  const [selected, setSelected] = useState([]);

  const toggle = (seat) => {
    if(taken.has(seat)) return;
    setSelected(prev =>
      prev.includes(seat) ? prev.filter(s=>s!==seat)
        : prev.length < passengers ? [...prev, seat] : prev
    );
  };

  const getSeatColor = (seat) => {
    if(taken.has(seat)) return "#e5e7eb";
    if(selected.includes(seat)) return ACCENT;
    const row = parseInt(seat);
    if(row <= 3) return "#fef3c7"; // business-ish
    if(row <= 6) return "#dbeafe"; // premium
    return "#f0fdf4"; // economy
  };

  return (
    <div onClick={onCancel} style={{
      position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",
      zIndex:700,display:"flex",alignItems:"center",justifyContent:"center",
      backdropFilter:"blur(10px)",padding:20,
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:"100%",maxWidth:520,background:"#fff",borderRadius:24,
        boxShadow:"0 32px 100px rgba(0,0,0,0.2)",animation:"fadeUp 0.3s both",
        maxHeight:"90vh",display:"flex",flexDirection:"column",overflow:"hidden",
      }}>
        {/* Header */}
        <div style={{background:GRAD,padding:"18px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,color:"#fff",fontSize:16}}>Select Seats</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.8)",marginTop:3}}>
              {flight.from_city} → {flight.to_city} · Pick {passengers} seat{passengers>1?"s":""}
            </div>
          </div>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:12,color:"rgba(255,255,255,0.9)"}}>
            {selected.length}/{passengers} selected
          </div>
        </div>

        {/* Legend */}
        <div style={{display:"flex",gap:16,padding:"12px 24px",borderBottom:"1px solid rgba(0,0,0,0.05)",flexWrap:"wrap"}}>
          {[
            {color:"#fef3c7",label:"Rows 1-3 (Front)"},
            {color:"#dbeafe",label:"Rows 4-6 (Mid)"},
            {color:"#f0fdf4",label:"Rows 7+ (Economy)"},
            {color:ACCENT,label:"Selected",text:"#fff"},
            {color:"#e5e7eb",label:"Taken"},
          ].map(l=>(
            <div key={l.label} style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:14,height:14,borderRadius:4,background:l.color,border:"1px solid rgba(0,0,0,0.1)"}}/>
              <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#888"}}>{l.label}</span>
            </div>
          ))}
        </div>

        {/* Plane nose */}
        <div style={{textAlign:"center",padding:"10px 0 6px",fontSize:22}}>✈️</div>

        {/* Seat map */}
        <div style={{overflowY:"auto",padding:"0 24px 16px"}}>
          {/* Column labels */}
          <div style={{display:"grid",gridTemplateColumns:"28px 1fr 8px 1fr",gap:4,marginBottom:8}}>
            <div/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4}}>
              {COLS.slice(0,3).map(c=>(
                <div key={c} style={{textAlign:"center",fontFamily:"'Space Mono',monospace",fontSize:10,color:"#bbb"}}>{c}</div>
              ))}
            </div>
            <div/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4}}>
              {COLS.slice(3).map(c=>(
                <div key={c} style={{textAlign:"center",fontFamily:"'Space Mono',monospace",fontSize:10,color:"#bbb"}}>{c}</div>
              ))}
            </div>
          </div>
          {ROWS.map(row=>(
            <div key={row} style={{display:"grid",gridTemplateColumns:"28px 1fr 8px 1fr",gap:4,marginBottom:4,alignItems:"center"}}>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"#ccc",textAlign:"right",paddingRight:4}}>{row}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4}}>
                {COLS.slice(0,3).map(col=>{
                  const seat=`${row}${col}`;
                  return (
                    <div key={seat} onClick={()=>toggle(seat)}
                      style={{height:28,borderRadius:6,background:getSeatColor(seat),
                        border:`1px solid ${taken.has(seat)?"#d1d5db":selected.includes(seat)?"#5b52d6":"rgba(0,0,0,0.08)"}`,
                        cursor:taken.has(seat)?"not-allowed":"pointer",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:8,fontFamily:"'Space Mono',monospace",
                        color:selected.includes(seat)?"#fff":"#888",
                        transition:"all 0.15s",fontWeight:700,
                      }}>
                      {taken.has(seat)?"X":selected.includes(seat)?seat:""}
                    </div>
                  );
                })}
              </div>
              {/* Aisle */}
              <div/>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4}}>
                {COLS.slice(3).map(col=>{
                  const seat=`${row}${col}`;
                  return (
                    <div key={seat} onClick={()=>toggle(seat)}
                      style={{height:28,borderRadius:6,background:getSeatColor(seat),
                        border:`1px solid ${taken.has(seat)?"#d1d5db":selected.includes(seat)?"#5b52d6":"rgba(0,0,0,0.08)"}`,
                        cursor:taken.has(seat)?"not-allowed":"pointer",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:8,fontFamily:"'Space Mono',monospace",
                        color:selected.includes(seat)?"#fff":"#888",
                        transition:"all 0.15s",fontWeight:700,
                      }}>
                      {taken.has(seat)?"X":selected.includes(seat)?seat:""}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{padding:"16px 24px",borderTop:"1px solid rgba(0,0,0,0.06)",display:"flex",gap:12,alignItems:"center"}}>
          <div style={{flex:1}}>
            {selected.length > 0 ? (
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#0a0a0a"}}>
                Seats: {selected.join(", ")}
              </div>
            ) : (
              <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#bbb"}}>No seats selected</div>
            )}
          </div>
          <button onClick={onCancel}
            style={{padding:"10px 18px",borderRadius:11,fontSize:13,fontWeight:600,
              fontFamily:"'DM Sans',sans-serif",background:"transparent",color:"#aaa",
              border:"1.5px solid rgba(0,0,0,0.1)",cursor:"pointer"}}>Cancel</button>
          <button onClick={()=>selected.length===passengers&&onConfirm(selected)}
            disabled={selected.length!==passengers}
            style={{padding:"10px 22px",borderRadius:11,fontSize:13,fontWeight:700,
              fontFamily:"'Syne',sans-serif",color:"#fff",border:"none",cursor:"pointer",
              background:selected.length===passengers?GRAD:"#e5e7eb",
              boxShadow:selected.length===passengers?"0 4px 16px rgba(108,99,255,0.4)":"none"}}>
            Confirm Seats →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PASSENGER MODAL ─────────────────────────────────────────────────────────
function PassengerModal({ flight, passengers, onConfirm, onCancel }) {
  const [name, setName] = useState("");
  return (
    <div onClick={onCancel} style={{
      position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",
      zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",
      backdropFilter:"blur(8px)",padding:20,
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:"100%",maxWidth:420,background:"rgba(255,255,255,0.97)",
        borderRadius:24,padding:"40px 36px",
        boxShadow:"0 24px 80px rgba(0,0,0,0.18)",animation:"fadeUp 0.3s both",
      }}>
        <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22,color:"#0a0a0a",marginBottom:8}}>
          Passenger Details
        </h2>
        <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#888",marginBottom:28}}>
          {flight.airline} · {flight.from_city} → {flight.to_city} · {passengers} pax
        </p>
        <label style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:"#aaa",display:"block",marginBottom:8,letterSpacing:"0.1em"}}>FULL NAME</label>
        <input autoFocus value={name} onChange={e=>setName(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&name.trim()&&onConfirm(name)}
          placeholder="Enter your full name"
          style={{width:"100%",padding:"13px 16px",borderRadius:13,fontSize:15,
            fontFamily:"'DM Sans',sans-serif",border:"1.5px solid rgba(108,99,255,0.3)",
            outline:"none",color:"#0a0a0a",background:"#fafafa",marginBottom:24}}/>
        <div style={{display:"flex",gap:12}}>
          <button onClick={onCancel}
            style={{padding:"13px 22px",borderRadius:13,fontSize:14,fontWeight:600,
              fontFamily:"'DM Sans',sans-serif",background:"transparent",color:"#aaa",
              border:"1.5px solid rgba(0,0,0,0.1)",cursor:"pointer"}}>Cancel</button>
          <button onClick={()=>name.trim()&&onConfirm(name)}
            style={{flex:1,padding:"13px",borderRadius:13,fontSize:14,fontWeight:700,
              fontFamily:"'Syne',sans-serif",color:"#fff",border:"none",cursor:"pointer",
              background:GRAD,boxShadow:"0 6px 22px rgba(108,99,255,0.4)"}}>
            Select Seats →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PAYMENT MODAL ────────────────────────────────────────────────────────────
function PaymentModal({ flight, passengerName, passengers, cabinClass, seats, onSuccess, onCancel }) {
  const [step, setStep]         = useState("payment");
  const [payMethod, setPayMethod] = useState("card");
  const [cardNo, setCardNo]     = useState("");
  const [expiry, setExpiry]     = useState("");
  const [cvv, setCvv]           = useState("");
  const [bookingId]             = useState("ALV"+Date.now().toString(36).toUpperCase().slice(-6));
  const total = flight.price * passengers;
  const fmtCard = v=>v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const fmtExp  = v=>{const d=v.replace(/\D/g,"").slice(0,4);return d.length>=3?d.slice(0,2)+"/"+d.slice(2):d;};

  const handlePay = () => {
    if(payMethod==="card"&&(!cardNo||!expiry||!cvv)){alert("Fill all card details");return;}
    setStep("processing");
    setTimeout(()=>setStep("success"),2500);
  };

  const overlay = {position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:600,
    display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(10px)",padding:20};
  const card   = {width:"100%",maxWidth:440,background:"rgba(255,255,255,0.97)",
    backdropFilter:"blur(20px)",borderRadius:24,overflow:"hidden",
    boxShadow:"0 32px 100px rgba(0,0,0,0.18)",animation:"fadeUp 0.4s both"};
  const hdr    = {background:GRAD,padding:"18px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"};

  if(step==="processing") return (
    <div style={overlay}><div style={card}>
      <div style={hdr}>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,color:"#fff",fontSize:16}}>Alvryn Pay</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.8)"}}>🔒 Secure</div>
      </div>
      <div style={{padding:"60px 24px",textAlign:"center"}}>
        <div style={{width:52,height:52,border:"3px solid rgba(108,99,255,0.2)",
          borderTopColor:"#6C63FF",borderRadius:"50%",
          animation:"spinSlow 1s linear infinite",margin:"0 auto 20px"}}/>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:"#6C63FF",fontSize:14,letterSpacing:"0.1em"}}>
          Processing payment…
        </div>
      </div>
    </div></div>
  );

  if(step==="success") return (
    <div style={overlay}><div style={card}>
      <div style={hdr}>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,color:"#fff",fontSize:16}}>Alvryn Pay</div>
      </div>
      <div style={{padding:"40px 28px",textAlign:"center"}}>
        <div style={{fontSize:56,marginBottom:16}}>🎉</div>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22,color:"#0a0a0a",marginBottom:10}}>
          Booking Confirmed!
        </div>
        <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#777",lineHeight:1.7,marginBottom:20}}>
          {flight.airline} · {flight.from_city} → {flight.to_city}<br/>
          Passenger: {passengerName}{passengers>1?` +${passengers-1} more`:""}<br/>
          Class: {cabinClass}
          {seats&&seats.length>0&&<><br/>Seats: <strong>{seats.join(", ")}</strong></>}
        </div>
        <div style={{background:"#f0eeff",borderRadius:14,padding:"14px",marginBottom:22,border:"1px solid rgba(108,99,255,0.2)"}}>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:"#aaa",marginBottom:5,letterSpacing:"0.12em"}}>BOOKING ID</div>
          <div style={{fontFamily:"'Space Mono',monospace",fontWeight:700,fontSize:18,color:"#6C63FF",letterSpacing:"0.15em"}}>{bookingId}</div>
        </div>
        <button onClick={()=>onSuccess(bookingId)}
          style={{width:"100%",padding:"14px",borderRadius:13,fontSize:15,fontWeight:700,
            fontFamily:"'Syne',sans-serif",color:"#fff",background:GRAD,border:"none",cursor:"pointer",
            boxShadow:"0 6px 24px rgba(108,99,255,0.4)"}}>
          View My Bookings →
        </button>
      </div>
    </div></div>
  );

  return (
    <div style={overlay} onClick={onCancel}>
      <div style={card} onClick={e=>e.stopPropagation()}>
        <div style={hdr}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,color:"#fff",fontSize:16}}>Alvryn Pay</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.8)"}}>🔒 256-bit SSL</div>
        </div>
        <div style={{padding:"26px"}}>
          <div style={{textAlign:"center",padding:"14px",borderRadius:14,background:"#f0eeff",
            border:"1px solid rgba(108,99,255,0.15)",marginBottom:20}}>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:"#aaa",marginBottom:5,letterSpacing:"0.12em"}}>TOTAL AMOUNT</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:28,color:"#6C63FF"}}>₹{total.toLocaleString()}</div>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#aaa",marginTop:3}}>
              {flight.from_city} → {flight.to_city} · {passengers} pax · {cabinClass}
              {seats&&seats.length>0&&` · Seats: ${seats.join(", ")}`}
            </div>
          </div>
          {/* Pay method */}
          <div style={{display:"flex",gap:8,marginBottom:18}}>
            {[["card","💳 Card"],["upi","⚡ UPI"],["netbanking","🏦 Net Banking"]].map(([id,label])=>(
              <button key={id} onClick={()=>setPayMethod(id)}
                style={{flex:1,padding:"9px 4px",borderRadius:10,fontSize:12,fontWeight:600,
                  fontFamily:"'DM Sans',sans-serif",cursor:"pointer",
                  border:payMethod===id?"1.5px solid #6C63FF":"1.5px solid rgba(0,0,0,0.1)",
                  background:payMethod===id?"#f0eeff":"#fafafa",
                  color:payMethod===id?"#6C63FF":"#999"}}>{label}</button>
            ))}
          </div>
          {payMethod==="card"&&<>
            <div style={{marginBottom:12}}>
              <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:600,color:"#aaa",marginBottom:6,letterSpacing:"0.1em"}}>CARD NUMBER</div>
              <input value={cardNo} onChange={e=>setCardNo(fmtCard(e.target.value))} placeholder="4111 1111 1111 1111" maxLength={19}
                style={{width:"100%",padding:"12px 14px",borderRadius:11,fontSize:15,fontFamily:"'DM Sans',sans-serif",border:"1.5px solid rgba(0,0,0,0.1)",outline:"none",color:"#0a0a0a",background:"#fafafa"}}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
              <div>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:600,color:"#aaa",marginBottom:6}}>EXPIRY</div>
                <input value={expiry} onChange={e=>setExpiry(fmtExp(e.target.value))} placeholder="MM/YY" maxLength={5}
                  style={{width:"100%",padding:"12px 14px",borderRadius:11,fontSize:15,fontFamily:"'DM Sans',sans-serif",border:"1.5px solid rgba(0,0,0,0.1)",outline:"none",color:"#0a0a0a",background:"#fafafa"}}/>
              </div>
              <div>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:600,color:"#aaa",marginBottom:6}}>CVV</div>
                <input type="password" value={cvv} onChange={e=>setCvv(e.target.value.slice(0,3))} placeholder="•••" maxLength={3}
                  style={{width:"100%",padding:"12px 14px",borderRadius:11,fontSize:15,fontFamily:"'DM Sans',sans-serif",border:"1.5px solid rgba(0,0,0,0.1)",outline:"none",color:"#0a0a0a",background:"#fafafa"}}/>
              </div>
            </div>
          </>}
          {payMethod==="upi"&&<div style={{marginBottom:12}}>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:600,color:"#aaa",marginBottom:6}}>UPI ID</div>
            <input placeholder="yourname@upi"
              style={{width:"100%",padding:"12px 14px",borderRadius:11,fontSize:15,fontFamily:"'DM Sans',sans-serif",border:"1.5px solid rgba(0,0,0,0.1)",outline:"none",color:"#0a0a0a",background:"#fafafa"}}/>
          </div>}
          {payMethod==="netbanking"&&<div style={{marginBottom:12}}>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:600,color:"#aaa",marginBottom:6}}>SELECT BANK</div>
            <select style={{width:"100%",padding:"12px 14px",borderRadius:11,fontSize:15,fontFamily:"'DM Sans',sans-serif",border:"1.5px solid rgba(0,0,0,0.1)",outline:"none",color:"#0a0a0a",background:"#fafafa",cursor:"pointer"}}>
              {["SBI — State Bank of India","HDFC Bank","ICICI Bank","Axis Bank","Kotak Mahindra Bank"].map(b=><option key={b}>{b}</option>)}
            </select>
          </div>}
          <button onClick={handlePay}
            style={{width:"100%",padding:"14px",borderRadius:13,fontSize:16,fontWeight:800,
              fontFamily:"'Syne',sans-serif",color:"#fff",border:"none",cursor:"pointer",
              background:GRAD,backgroundSize:"200% 200%",animation:"gradShift 3s ease infinite",
              boxShadow:"0 8px 28px rgba(108,99,255,0.4)",marginTop:4}}>
            Pay ₹{total.toLocaleString()} →
          </button>
          <div style={{textAlign:"center",fontSize:11,color:"#ccc",marginTop:10,fontFamily:"'DM Sans',sans-serif"}}>
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

  // ── ALL HOOKS FIRST — no early returns before this block ──
  const [travelType,     setTravelType]     = useState("flight");
  const [tripType,       setTripType]       = useState("oneway");
  const [fromCity,       setFromCity]       = useState(CITIES[0]);
  const [toCity,         setToCity]         = useState(CITIES[1]);
  const [date,           setDate]           = useState("");
  const [returnDate,     setReturnDate]     = useState("");
  const [passengers,     setPassengers]     = useState(1);
  const [cabinClass,     setCabinClass]     = useState("Economy");
  const [showFromModal,  setShowFromModal]  = useState(false);
  const [showToModal,    setShowToModal]    = useState(false);
  const [mode,           setMode]           = useState("structured");
  const [aiQuery,        setAiQuery]        = useState("");
  const [flights,        setFlights]        = useState([]);
  const [filtered,       setFiltered]       = useState([]);
  const [loading,        setLoading]        = useState(false);
  const [searched,       setSearched]       = useState(false);
  const [bookingFlight,  setBookingFlight]  = useState(null);
  const [passengerName,  setPassengerName]  = useState("");
  const [showSeats,      setShowSeats]      = useState(false);
  const [selectedSeats,  setSelectedSeats]  = useState([]);
  const [showPayment,    setShowPayment]    = useState(false);
  const [filterTime,     setFilterTime]     = useState("any");
  const [filterMaxPrice, setFilterMaxPrice] = useState(20000);
  const [sortBy,         setSortBy]         = useState("price");
  const [navScrolled,    setNavScrolled]    = useState(false);
  const [specialFare,    setSpecialFare]    = useState("regular");

  const today = new Date().toISOString().split("T")[0];

  // Safe user parse — AFTER hooks
  let user = {};
  try { user = JSON.parse(localStorage.getItem("user") || "{}"); } catch(e) { user = {}; }
  const token = localStorage.getItem("token");

  // ── Effects ──
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  useEffect(() => {
    fetch(`${API}/test`).catch(()=>{});
    const t = setInterval(()=>fetch(`${API}/test`).catch(()=>{}), 14*60*1000);
    return ()=>clearInterval(t);
  }, []);

  useEffect(() => {
    const fn = ()=>setNavScrolled(window.scrollY>30);
    window.addEventListener("scroll",fn,{passive:true});
    return ()=>window.removeEventListener("scroll",fn);
  }, []);

  useEffect(() => {
    let result = [...flights];
    if(filterTime==="morning")   result=result.filter(f=>{const h=new Date(f.departure_time).getHours();return h>=5&&h<12;});
    if(filterTime==="afternoon") result=result.filter(f=>{const h=new Date(f.departure_time).getHours();return h>=12&&h<17;});
    if(filterTime==="evening")   result=result.filter(f=>{const h=new Date(f.departure_time).getHours();return h>=17;});
    result=result.filter(f=>f.price<=filterMaxPrice);
    if(sortBy==="price")      result.sort((a,b)=>a.price-b.price);
    if(sortBy==="price-desc") result.sort((a,b)=>b.price-a.price);
    if(sortBy==="departure")  result.sort((a,b)=>new Date(a.departure_time)-new Date(b.departure_time));
    if(sortBy==="duration")   result.sort((a,b)=>(new Date(a.arrival_time)-new Date(a.departure_time))-(new Date(b.arrival_time)-new Date(b.departure_time)));
    setFiltered(result);
  }, [flights,filterTime,filterMaxPrice,sortBy]);

  // ── Handlers ──
  const swapCities = useCallback(()=>{setFromCity(toCity);setToCity(fromCity);},[fromCity,toCity]);

  const searchStructured = async () => {
    setLoading(true); setSearched(true);
    try {
      const params = new URLSearchParams({from:fromCity.name,to:toCity.name});
      if(date) params.append("date",date);
      const res = await axios.get(`${API}/flights?${params}`);
      setFlights(res.data);
      setFilterMaxPrice(res.data.length>0?Math.max(...res.data.map(f=>f.price))+1000:20000);
    } catch { setFlights([]); }
    setLoading(false);
  };

  const searchAI = async () => {
    if(!aiQuery.trim()) return;
    setLoading(true); setSearched(true);
    try {
      const res = await axios.post(`${API}/ai-search`,{query:aiQuery});
      setFlights(res.data);
      setFilterMaxPrice(res.data.length>0?Math.max(...res.data.map(f=>f.price))+1000:20000);
    } catch { setFlights([]); }
    setLoading(false);
  };

  const handleBookClick = (flight) => {
    if(!token){navigate("/login");return;}
    setBookingFlight(flight);
  };

  const handlePassengerConfirm = (name) => {
    setPassengerName(name);
    // For domestic flights show seat selection, international skip to payment
    const isDomestic = fromCity.country==="India" && toCity.country==="India";
    if(isDomestic) setShowSeats(true);
    else { setSelectedSeats([]); setShowPayment(true); }
  };

  const handleSeatsConfirm = (seats) => {
    setSelectedSeats(seats);
    setShowSeats(false);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      await axios.post(`${API}/book`,
        {flight_id:bookingFlight.id, passenger_name:passengerName},
        {headers:{Authorization:`Bearer ${token}`}}
      );
    } catch(e){console.error(e);}
    setShowPayment(false);
    setShowSeats(false);
    setBookingFlight(null);
    navigate("/bookings");
  };

  // ── UI constants ──
  const TRAVEL_TABS = [
    {id:"flight", icon:"✈️", label:"Flights",       cs:false},
    {id:"bus",    icon:"🚌", label:"Buses",          cs:true },
    {id:"train",  icon:"🚂", label:"Trains",         cs:true },
    {id:"hotel",  icon:"🏨", label:"Hotels",         cs:true },
    {id:"cab",    icon:"🚗", label:"Cabs",           cs:true },
    {id:"holiday",icon:"🌴", label:"Holiday Pkg",   cs:true },
  ];

  const CS_DATA = {
    bus:    {icon:"🚌",title:"Bus Booking",     desc:"Book intercity AC/Sleeper buses across India. Powered by RedBus affiliate — launching soon."},
    train:  {icon:"🚂",title:"Train Booking",   desc:"Search Indian Railways tickets, check PNR status. IRCTC API integration — coming soon."},
    hotel:  {icon:"🏨",title:"Hotel Booking",   desc:"Compare and book hotels across India and abroad. Booking.com + MakeMyTrip affiliate — coming soon."},
    cab:    {icon:"🚗",title:"Cab Booking",     desc:"Airport transfers and intercity cabs. Ola/Uber affiliate integration — coming soon."},
    holiday:{icon:"🌴",title:"Holiday Packages",desc:"Curated holiday packages with flights + hotels + activities. Travelpayouts affiliate — coming soon."},
  };

  const SPECIAL_FARES = [
    {id:"regular",  label:"Regular",      desc:"Regular fares"},
    {id:"student",  label:"Student",      desc:"Extra discounts"},
    {id:"senior",   label:"Senior Citizen",desc:"Up to ₹600 off"},
    {id:"armed",    label:"Armed Forces", desc:"Up to ₹600 off"},
    {id:"doctor",   label:"Doctor/Nurse", desc:"Special fares"},
  ];

  const isDomestic = fromCity.country==="India" && toCity.country==="India";

  const labelStyle = {fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:600,color:"#aaa",display:"block",marginBottom:6,letterSpacing:"0.1em"};

  return (
    <div style={{minHeight:"100vh",background:"#f8f8fa",position:"relative",overflowX:"hidden",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{SHARED_CSS}</style>
      <AuroraBackground colors={["#6C63FF","#00C2FF","#a78bfa"]} opacity={0.5}/>

      {/* Modals */}
      {showFromModal&&<CityModal title="Select departure city" onSelect={c=>{setFromCity(c);setShowFromModal(false);}} onClose={()=>setShowFromModal(false)} exclude={toCity.code}/>}
      {showToModal&&<CityModal title="Select destination city" onSelect={c=>{setToCity(c);setShowToModal(false);}} onClose={()=>setShowToModal(false)} exclude={fromCity.code}/>}
      {bookingFlight&&!showSeats&&!showPayment&&(
        <PassengerModal flight={bookingFlight} passengers={passengers} onConfirm={handlePassengerConfirm} onCancel={()=>setBookingFlight(null)}/>
      )}
      {bookingFlight&&showSeats&&!showPayment&&(
        <SeatModal flight={bookingFlight} passengers={passengers} onConfirm={handleSeatsConfirm} onCancel={()=>{setShowSeats(false);setBookingFlight(null);}}/>
      )}
      {bookingFlight&&showPayment&&(
        <PaymentModal flight={bookingFlight} passengerName={passengerName} passengers={passengers}
          cabinClass={cabinClass} seats={selectedSeats}
          onSuccess={handlePaymentSuccess} onCancel={()=>{setShowPayment(false);setBookingFlight(null);}}/>
      )}

      {/* ── NAV ── */}
      <nav style={{
        position:"sticky",top:0,zIndex:200,height:66,padding:"0 5%",
        display:"flex",alignItems:"center",justifyContent:"space-between",
        background:navScrolled?"rgba(248,248,250,0.92)":"rgba(248,248,250,0.75)",
        backdropFilter:"blur(22px)",borderBottom:"1px solid rgba(0,0,0,0.05)",transition:"all 0.3s",
      }}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>navigate("/")}>
          <div style={{animation:"floatUD 4s ease-in-out infinite"}}><AlvrynIcon size={38} spin/></div>
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:16,color:"#0a0a0a",letterSpacing:"-0.04em",lineHeight:1.1}}>ALVRYN</div>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:7,color:ACCENT,letterSpacing:"0.18em"}}>TRAVEL BEYOND</div>
          </div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>navigate("/bookings")}
            style={{padding:"8px 18px",borderRadius:10,fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",background:"transparent",color:"#555",border:"1.5px solid rgba(0,0,0,0.12)"}}>
            My Bookings
          </button>
          <button onClick={()=>{localStorage.removeItem("token");localStorage.removeItem("user");navigate("/login");}}
            style={{padding:"8px 18px",borderRadius:10,fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",background:"#fff0f0",color:"#e53935",border:"1.5px solid rgba(229,57,53,0.2)"}}>
            Sign Out
          </button>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <div style={{position:"relative",zIndex:1,maxWidth:960,margin:"0 auto",padding:"36px 5% 80px"}}>

        {/* Greeting */}
        <div style={{marginBottom:28,animation:"fadeUp 0.6s both"}}>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:ACCENT,letterSpacing:"0.2em",marginBottom:8}}>SEARCH TRAVEL</div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"clamp(26px,4vw,44px)",color:"#0a0a0a",marginBottom:4}}>
            Hey {user.name?.split(" ")[0]||"Traveller"} 👋
          </h1>
          <p style={{fontSize:15,color:"#888"}}>Where do you want to fly or ride today?</p>
        </div>

        {/* Travel type tabs — MakeMyTrip style */}
        <div style={{display:"flex",gap:0,marginBottom:0,overflowX:"auto",background:"#fff",
          borderRadius:"16px 16px 0 0",border:"1px solid rgba(0,0,0,0.07)",borderBottom:"none"}}>
          {TRAVEL_TABS.map((tab,i)=>(
            <button key={tab.id} onClick={()=>{setTravelType(tab.id);setFlights([]);setSearched(false);}}
              style={{
                display:"flex",flexDirection:"column",alignItems:"center",gap:4,
                padding:"16px 20px",cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,
                border:"none",borderBottom:travelType===tab.id?`2.5px solid ${ACCENT}`:"2.5px solid transparent",
                background:"transparent",
                color:travelType===tab.id?ACCENT:"#888",
                transition:"all 0.2s",whiteSpace:"nowrap",
                borderRadius:i===0?"16px 0 0 0":i===TRAVEL_TABS.length-1?"0 16px 0 0":"0",
              }}>
              <span style={{fontSize:22}}>{tab.icon}</span>
              {tab.label}
              {tab.cs&&<span style={{fontSize:8,background:"#fff7ed",border:"1px solid rgba(251,191,36,0.3)",color:"#f59e0b",padding:"1px 5px",borderRadius:6}}>SOON</span>}
            </button>
          ))}
        </div>

        {/* Coming soon panel */}
        {travelType!=="flight"&&(
          <div style={{background:"#fff",borderRadius:"0 0 20px 20px",padding:"56px 32px",textAlign:"center",
            boxShadow:"0 4px 20px rgba(0,0,0,0.05)",border:"1px solid rgba(0,0,0,0.07)",borderTop:"none",
            animation:"fadeUp 0.4s both"}}>
            <div style={{fontSize:60,marginBottom:20}}>{CS_DATA[travelType]?.icon}</div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:24,color:"#0a0a0a",marginBottom:12}}>
              {CS_DATA[travelType]?.title} — Coming Soon
            </h2>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#888",lineHeight:1.7,maxWidth:440,margin:"0 auto 20px"}}>
              {CS_DATA[travelType]?.desc}
            </p>
            <span style={{display:"inline-block",padding:"8px 20px",borderRadius:20,background:"#f0eeff",
              border:"1px solid rgba(108,99,255,0.2)",fontFamily:"'Space Mono',monospace",
              fontSize:11,color:ACCENT}}>Phase 2 Feature</span>
          </div>
        )}

        {/* Flight search panel */}
        {travelType==="flight"&&(
          <div style={{background:"#fff",borderRadius:"0 0 20px 20px",padding:"24px 28px",
            boxShadow:"0 4px 20px rgba(0,0,0,0.06)",border:"1px solid rgba(0,0,0,0.07)",borderTop:"none",
            marginBottom:24}}>

            {/* Trip type + international badge */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
              <div style={{display:"flex",gap:0,background:"#f5f5f5",borderRadius:10,padding:3}}>
                {["oneway","roundtrip","multicity"].map(t=>(
                  <button key={t} onClick={()=>setTripType(t)}
                    style={{padding:"8px 16px",border:"none",borderRadius:8,fontFamily:"'DM Sans',sans-serif",
                      fontSize:13,fontWeight:600,cursor:"pointer",transition:"all 0.2s",
                      background:tripType===t?"#fff":"transparent",
                      color:tripType===t?"#0a0a0a":"#aaa",
                      boxShadow:tripType===t?"0 2px 6px rgba(0,0,0,0.08)":"none"}}>
                    {t==="oneway"?"One Way":t==="roundtrip"?"Round Trip":"Multi City"}
                  </button>
                ))}
              </div>
              {!isDomestic&&(
                <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",
                  borderRadius:8,background:"#f0f9ff",border:"1px solid #bae6fd"}}>
                  <span style={{fontSize:14}}>🌍</span>
                  <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,color:"#0284c7"}}>
                    International Flight
                  </span>
                </div>
              )}
              {isDomestic&&(
                <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",
                  borderRadius:8,background:"#f0fdf4",border:"1px solid #bbf7d0"}}>
                  <span style={{fontSize:14}}>🇮🇳</span>
                  <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,color:"#16a34a"}}>
                    Domestic · Seat selection available
                  </span>
                </div>
              )}
            </div>

            {/* Mode toggle */}
            <div style={{display:"flex",gap:4,background:"#f5f5f5",borderRadius:10,padding:3,marginBottom:20,width:"fit-content"}}>
              {[["structured","🗺 Search"],["ai","🤖 AI Search"]].map(([id,label])=>(
                <button key={id} onClick={()=>{setMode(id);setFlights([]);setSearched(false);}}
                  style={{padding:"8px 20px",border:"none",borderRadius:8,fontFamily:"'DM Sans',sans-serif",
                    fontSize:13,fontWeight:600,cursor:"pointer",transition:"all 0.2s",
                    background:mode===id?"#fff":"transparent",
                    color:mode===id?ACCENT:"#aaa",
                    boxShadow:mode===id?"0 2px 6px rgba(108,99,255,0.15)":"none"}}>
                  {label}
                </button>
              ))}
            </div>

            {mode==="structured"&&(
              <>
                {/* City row */}
                <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:10,alignItems:"center",marginBottom:12}}>
                  {[
                    {label:"FROM",city:fromCity,onClick:()=>setShowFromModal(true)},
                    null,
                    {label:"TO",  city:toCity,  onClick:()=>setShowToModal(true)},
                  ].map((item,i)=>item===null?(
                    <button key="swap" onClick={swapCities}
                      style={{width:40,height:40,borderRadius:"50%",background:"#f0eeff",
                        border:"1.5px solid rgba(108,99,255,0.25)",display:"flex",alignItems:"center",
                        justifyContent:"center",cursor:"pointer",fontSize:18,color:ACCENT,
                        transition:"transform 0.3s",justifySelf:"center"}}
                      onMouseEnter={e=>e.currentTarget.style.transform="rotate(180deg)"}
                      onMouseLeave={e=>e.currentTarget.style.transform="rotate(0)"}>
                      ⇄
                    </button>
                  ):(
                    <div key={item.label} onClick={item.onClick}
                      style={{background:"#fafafa",borderRadius:14,padding:"14px 18px",
                        border:"1.5px solid rgba(0,0,0,0.08)",cursor:"pointer",transition:"all 0.2s"}}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=ACCENT+"55";e.currentTarget.style.background="#f0eeff";}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(0,0,0,0.08)";e.currentTarget.style.background="#fafafa";}}>
                      <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:"#bbb",letterSpacing:"0.15em",marginBottom:4}}>{item.label}</div>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:26,color:"#0a0a0a",letterSpacing:"0.03em"}}>{item.city.code}</div>
                      <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#888",marginTop:2}}>{item.city.name}, {item.city.country}</div>
                    </div>
                  ))}
                </div>

                {/* Date + passengers + class */}
                <div style={{display:"grid",gridTemplateColumns:tripType==="roundtrip"?"1fr 1fr 1fr 1fr":"1fr 1fr 1fr",gap:10,marginBottom:16}}>
                  <div style={{background:"#fafafa",borderRadius:12,padding:"12px 16px",border:"1.5px solid rgba(0,0,0,0.08)"}}>
                    <label style={labelStyle}>DEPARTURE</label>
                    <input type="date" value={date} min={today} onChange={e=>setDate(e.target.value)}
                      style={{background:"transparent",border:"none",outline:"none",fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:600,color:"#0a0a0a",width:"100%",cursor:"pointer"}}/>
                    {date&&<div style={{fontSize:11,color:"#aaa",marginTop:3}}>{new Date(date).toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"})}</div>}
                  </div>
                  {tripType==="roundtrip"&&(
                    <div style={{background:"#fafafa",borderRadius:12,padding:"12px 16px",border:"1.5px solid rgba(0,0,0,0.08)"}}>
                      <label style={labelStyle}>RETURN</label>
                      <input type="date" value={returnDate} min={date||today} onChange={e=>setReturnDate(e.target.value)}
                        style={{background:"transparent",border:"none",outline:"none",fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:600,color:"#0a0a0a",width:"100%",cursor:"pointer"}}/>
                    </div>
                  )}
                  <div style={{background:"#fafafa",borderRadius:12,padding:"12px 16px",border:"1.5px solid rgba(0,0,0,0.08)"}}>
                    <label style={labelStyle}>TRAVELLERS</label>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <button onClick={()=>setPassengers(p=>Math.max(1,p-1))}
                        style={{width:28,height:28,borderRadius:"50%",background:"#f0eeff",border:"1px solid rgba(108,99,255,0.25)",color:ACCENT,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                      <span style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:18,color:"#0a0a0a",minWidth:18,textAlign:"center"}}>{passengers}</span>
                      <button onClick={()=>setPassengers(p=>Math.min(9,p+1))}
                        style={{width:28,height:28,borderRadius:"50%",background:"#f0eeff",border:"1px solid rgba(108,99,255,0.25)",color:ACCENT,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                      <span style={{fontSize:11,color:"#bbb"}}>Adult{passengers>1?"s":""}</span>
                    </div>
                  </div>
                  <div style={{background:"#fafafa",borderRadius:12,padding:"12px 16px",border:"1.5px solid rgba(0,0,0,0.08)"}}>
                    <label style={labelStyle}>CLASS</label>
                    <select value={cabinClass} onChange={e=>setCabinClass(e.target.value)}
                      style={{background:"transparent",border:"none",outline:"none",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,color:"#0a0a0a",width:"100%",cursor:"pointer"}}>
                      {CLASSES.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Special fares — MakeMyTrip style */}
                <div style={{marginBottom:16}}>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:"#aaa",letterSpacing:"0.08em",marginBottom:8}}>SPECIAL FARES</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {SPECIAL_FARES.map(sf=>(
                      <button key={sf.id} onClick={()=>setSpecialFare(sf.id)}
                        style={{padding:"7px 14px",borderRadius:10,fontSize:12,fontWeight:600,
                          fontFamily:"'DM Sans',sans-serif",cursor:"pointer",
                          border:specialFare===sf.id?`1.5px solid ${ACCENT}`:"1.5px solid rgba(0,0,0,0.1)",
                          background:specialFare===sf.id?"#f0eeff":"#fafafa",
                          color:specialFare===sf.id?ACCENT:"#888",transition:"all 0.2s"}}>
                        {sf.label}
                        <span style={{display:"block",fontSize:9,color:specialFare===sf.id?ACCENT+"99":"#ccc",marginTop:1}}>{sf.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {mode==="ai"&&(
              <div style={{marginBottom:16}}>
                <div style={{display:"flex",alignItems:"center",gap:12,background:"#fafafa",
                  borderRadius:14,padding:"4px 4px 4px 18px",border:`1.5px solid ${ACCENT}33`,marginBottom:10}}>
                  <span style={{fontSize:18,opacity:0.6}}>🤖</span>
                  <input value={aiQuery} onChange={e=>setAiQuery(e.target.value)}
                    onKeyDown={e=>e.key==="Enter"&&searchAI()}
                    placeholder="Cheapest flights from Bangalore to Mumbai tomorrow…"
                    style={{flex:1,background:"transparent",border:"none",outline:"none",
                      fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#0a0a0a",padding:"12px 0"}}/>
                </div>
                <div style={{fontSize:12,color:"#bbb",textAlign:"center",fontFamily:"'DM Sans',sans-serif"}}>
                  Try: "cheap flights blr to del next friday" or "goa flights under 3000 this weekend"
                </div>
              </div>
            )}

            <button onClick={mode==="structured"?searchStructured:searchAI}
              style={{width:"100%",padding:"15px",borderRadius:14,fontSize:16,fontWeight:800,
                fontFamily:"'Syne',sans-serif",color:"#fff",border:"none",cursor:"pointer",
                background:GRAD,backgroundSize:"200% 200%",animation:"gradShift 4s ease infinite",
                boxShadow:`0 8px 28px ${ACCENT}44`,marginTop:4,transition:"transform 0.2s"}}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
              onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
              {loading?"Searching…":mode==="structured"?"Search Flights ✈":"Search with AI 🤖"}
            </button>
          </div>
        )}

        {/* Loading */}
        {loading&&(
          <div style={{textAlign:"center",padding:"60px 0",animation:"fadeUp 0.4s both"}}>
            <div style={{width:44,height:44,border:`3px solid ${ACCENT}22`,borderTopColor:ACCENT,
              borderRadius:"50%",animation:"spinSlow 1s linear infinite",margin:"0 auto 16px"}}/>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:ACCENT}}>
              Scanning flight paths…
            </div>
          </div>
        )}

        {/* Filters */}
        {!loading&&flights.length>0&&(
          <div style={{background:"#fff",borderRadius:16,padding:"18px 20px",
            boxShadow:"0 4px 16px rgba(0,0,0,0.05)",border:"1px solid rgba(0,0,0,0.05)",
            marginBottom:18,animation:"fadeUp 0.4s both"}}>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:"#bbb",letterSpacing:"0.15em",marginBottom:12}}>FILTER & SORT</div>
            <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:12}}>
              {[["any","All times"],["morning","Morning"],["afternoon","Afternoon"],["evening","Evening"]].map(([v,l])=>(
                <button key={v} onClick={()=>setFilterTime(v)}
                  style={{padding:"5px 12px",borderRadius:100,fontSize:11,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",
                    border:filterTime===v?`1.5px solid ${ACCENT}`:"1.5px solid rgba(0,0,0,0.08)",
                    background:filterTime===v?"#f0eeff":"#fafafa",color:filterTime===v?ACCENT:"#aaa"}}>{l}</button>
              ))}
              {[["price","Cheapest"],["departure","Earliest"],["duration","Fastest"],["price-desc","Priciest"]].map(([v,l])=>(
                <button key={v} onClick={()=>setSortBy(v)}
                  style={{padding:"5px 12px",borderRadius:100,fontSize:11,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",
                    border:sortBy===v?`1.5px solid ${ACCENT}`:"1.5px solid rgba(0,0,0,0.08)",
                    background:sortBy===v?"#f0eeff":"#fafafa",color:sortBy===v?ACCENT:"#aaa"}}>{l}</button>
              ))}
            </div>
            <input type="range" min="1000" max={filterMaxPrice+1000} step="500"
              value={filterMaxPrice} onChange={e=>setFilterMaxPrice(Number(e.target.value))}
              style={{width:"100%",accentColor:ACCENT}}/>
            <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Space Mono',monospace",fontSize:10,color:"#bbb",marginTop:5}}>
              <span>₹1,000</span>
              <span style={{color:ACCENT}}>Max ₹{filterMaxPrice.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading&&searched&&(
          <>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:"#bbb",letterSpacing:"0.15em",marginBottom:14}}>
              {filtered.length>0?`${filtered.length} of ${flights.length} FLIGHTS`:"NO FLIGHTS MATCH FILTERS"}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {filtered.map((flight,i)=>(
                <div key={flight.id}
                  style={{background:"#fff",borderRadius:18,padding:"20px 24px",
                    boxShadow:"0 4px 16px rgba(0,0,0,0.05)",border:"1px solid rgba(0,0,0,0.05)",
                    animation:`fadeUp 0.4s ${i*60}ms both`,transition:"all 0.2s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=ACCENT+"44";e.currentTarget.style.transform="translateY(-2px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(0,0,0,0.05)";e.currentTarget.style.transform="translateY(0)";}}>
                  {/* Top */}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:ACCENT}}/>
                      <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:14,color:"#0a0a0a"}}>{flight.airline}</span>
                      <span style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:"#ccc"}}>{flight.flight_no}</span>
                    </div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      {isDomestic&&(
                        <span style={{padding:"3px 9px",borderRadius:20,fontSize:10,
                          background:"#f0eeff",border:`1px solid ${ACCENT}22`,
                          color:ACCENT,fontFamily:"'Space Mono',monospace"}}>Seat selection ✓</span>
                      )}
                      <span style={{padding:"3px 9px",borderRadius:20,fontSize:10,
                        background:"rgba(52,211,153,0.1)",border:"1px solid rgba(52,211,153,0.2)",
                        color:"#10b981",fontFamily:"'Space Mono',monospace"}}>Non-stop</span>
                    </div>
                  </div>
                  {/* Route */}
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22,color:"#0a0a0a"}}>{formatTime(flight.departure_time)}</div>
                      <div style={{fontFamily:"'Space Mono',monospace",fontSize:12,color:"#bbb",marginTop:2}}>{flight.from_city?.slice(0,3).toUpperCase()}</div>
                      <div style={{fontSize:11,color:"#ccc"}}>{formatDate(flight.departure_time)}</div>
                    </div>
                    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"0 16px"}}>
                      <span style={{fontSize:12,color:"#bbb",fontFamily:"'DM Sans',sans-serif"}}>{calcDuration(flight.departure_time,flight.arrival_time)}</span>
                      <div style={{width:"100%",display:"flex",alignItems:"center",gap:4}}>
                        <div style={{flex:1,height:1,background:`linear-gradient(90deg,${ACCENT}33,${ACCENT}88,${ACCENT}33)`}}/>
                        <span style={{fontSize:12,color:ACCENT}}>✈</span>
                        <div style={{flex:1,height:1,background:`linear-gradient(90deg,${ACCENT}88,${ACCENT}33)`}}/>
                      </div>
                      <span style={{fontSize:11,color:"#10b981",fontFamily:"'DM Sans',sans-serif"}}>Direct</span>
                    </div>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22,color:"#0a0a0a"}}>{formatTime(flight.arrival_time)}</div>
                      <div style={{fontFamily:"'Space Mono',monospace",fontSize:12,color:"#bbb",marginTop:2}}>{flight.to_city?.slice(0,3).toUpperCase()}</div>
                      <div style={{fontSize:11,color:"#ccc"}}>{formatDate(flight.arrival_time)}</div>
                    </div>
                  </div>
                  {/* Bottom */}
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:14,borderTop:"1px solid rgba(0,0,0,0.05)"}}>
                    <div>
                      <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:"#ccc",letterSpacing:"0.1em"}}>FROM</div>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:24,color:ACCENT}}>
                        ₹{(flight.price*passengers).toLocaleString()}
                      </div>
                      <div style={{fontSize:12,color:"#bbb",fontFamily:"'DM Sans',sans-serif"}}>{passengers} pax · {cabinClass}</div>
                    </div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <button onClick={()=>handleBookClick(flight)}
                        style={{padding:"11px 24px",borderRadius:12,fontSize:14,fontWeight:700,
                          fontFamily:"'Syne',sans-serif",color:"#fff",border:"none",cursor:"pointer",
                          background:GRAD,boxShadow:`0 4px 14px ${ACCENT}44`,transition:"all 0.2s"}}
                        onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                        onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                        Book →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty state */}
        {!loading&&!searched&&(
          <div style={{textAlign:"center",padding:"80px 20px",animation:"fadeUp 0.5s both"}}>
            <div style={{fontSize:64,marginBottom:20,animation:"floatUD 3s ease-in-out infinite"}}>✈️</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:18,color:"#ccc"}}>Your journey starts here</div>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#ddd",marginTop:8}}>Search flights above or try AI search</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
function App() {
  useEffect(() => {
    fetch(`${API}/test`).catch(()=>{});
    const t = setInterval(()=>fetch(`${API}/test`).catch(()=>{}), 14*60*1000);
    return ()=>clearInterval(t);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/"         element={<LandingPage />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search"   element={<SearchPage />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/admin"    element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;