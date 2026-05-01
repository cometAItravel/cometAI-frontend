/* eslint-disable no-useless-escape, no-unused-vars */
import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import MyBookings from "./pages/MyBookings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import AIChatPage from "./pages/AIChatPage";
import UserProfile from "./pages/UserProfile";

const API = "https://cometai-backend.onrender.com";

function track(eventType, details = "", source = "web") {
  const token = localStorage.getItem("token");
  fetch(`${API}/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ event_type: eventType, details: String(details), source }),
  }).catch(() => {});
}

const GOLD = "#c9a84c";
const GOLD_DARK = "#8B6914";
const GRAD = "linear-gradient(135deg,#c9a84c,#f0d080,#c9a84c)";

// ─── TAB THEMES — each tab gets its own animated world ────────────────────────
const TAB_THEMES = {
  flight: {
    name: "flight",
    bgFrom: "#0a1628",
    bgTo: "#0d2744",
    accent: "#38bdf8",
    accentSoft: "rgba(56,189,248,0.15)",
    grad: "linear-gradient(135deg,#0a1628 0%,#0d2744 40%,#1e3a5f 70%,#0a1628 100%)",
    tabGrad: "linear-gradient(135deg,#0a1628,#1e3a8a,#0284c7)",
    orbs: [
      { color: "#38bdf8", x: "15%", y: "20%", size: 420, opacity: 0.06 },
      { color: "#0ea5e9", x: "75%", y: "60%", size: 360, opacity: 0.05 },
      { color: "#7dd3fc", x: "50%", y: "85%", size: 280, opacity: 0.04 },
      { color: "#bae6fd", x: "88%", y: "15%", size: 200, opacity: 0.04 },
    ],
    particles: "✈",
    particleColor: "rgba(56,189,248,0.3)",
    gridColor: "rgba(56,189,248,0.04)",
    labelColor: "#38bdf8",
    btnBg: "linear-gradient(135deg,#0284c7,#38bdf8,#0284c7)",
    cardBorder: "rgba(56,189,248,0.2)",
    inputBorder: "rgba(56,189,248,0.3)",
    icon: "✈️",
    tagline: "Find Cheapest Flights",
  },
  bus: {
    name: "bus",
    bgFrom: "#042308",
    bgTo: "#063d0e",
    accent: "#4ade80",
    accentSoft: "rgba(74,222,128,0.15)",
    grad: "linear-gradient(135deg,#042308 0%,#063d0e 40%,#0f5c1a 70%,#042308 100%)",
    tabGrad: "linear-gradient(135deg,#042308,#166534,#16a34a)",
    orbs: [
      { color: "#4ade80", x: "20%", y: "25%", size: 400, opacity: 0.07 },
      { color: "#22c55e", x: "70%", y: "55%", size: 350, opacity: 0.05 },
      { color: "#86efac", x: "45%", y: "80%", size: 260, opacity: 0.05 },
      { color: "#bbf7d0", x: "85%", y: "20%", size: 180, opacity: 0.04 },
    ],
    particles: "🚌",
    particleColor: "rgba(74,222,128,0.25)",
    gridColor: "rgba(74,222,128,0.04)",
    labelColor: "#4ade80",
    btnBg: "linear-gradient(135deg,#16a34a,#4ade80,#16a34a)",
    cardBorder: "rgba(74,222,128,0.2)",
    inputBorder: "rgba(74,222,128,0.3)",
    icon: "🚌",
    tagline: "Search All Buses",
  },
  hotel: {
    name: "hotel",
    bgFrom: "#1a0a00",
    bgTo: "#2d1500",
    accent: "#fb923c",
    accentSoft: "rgba(251,146,60,0.15)",
    grad: "linear-gradient(135deg,#1a0a00 0%,#2d1500 40%,#4a2000 70%,#1a0a00 100%)",
    tabGrad: "linear-gradient(135deg,#1a0a00,#9a3412,#ea580c)",
    orbs: [
      { color: "#fb923c", x: "25%", y: "30%", size: 380, opacity: 0.07 },
      { color: "#f97316", x: "72%", y: "50%", size: 340, opacity: 0.06 },
      { color: "#fdba74", x: "48%", y: "78%", size: 270, opacity: 0.05 },
      { color: "#fed7aa", x: "82%", y: "18%", size: 190, opacity: 0.04 },
    ],
    particles: "🏨",
    particleColor: "rgba(251,146,60,0.25)",
    gridColor: "rgba(251,146,60,0.04)",
    labelColor: "#fb923c",
    btnBg: "linear-gradient(135deg,#ea580c,#fb923c,#ea580c)",
    cardBorder: "rgba(251,146,60,0.2)",
    inputBorder: "rgba(251,146,60,0.3)",
    icon: "🏨",
    tagline: "Discover Hotels",
  },
  train: {
    name: "train",
    bgFrom: "#0f0520",
    bgTo: "#1a0a35",
    accent: "#a78bfa",
    accentSoft: "rgba(167,139,250,0.15)",
    grad: "linear-gradient(135deg,#0f0520 0%,#1a0a35 40%,#2d1260 70%,#0f0520 100%)",
    tabGrad: "linear-gradient(135deg,#0f0520,#4c1d95,#7c3aed)",
    orbs: [
      { color: "#a78bfa", x: "18%", y: "22%", size: 400, opacity: 0.07 },
      { color: "#8b5cf6", x: "74%", y: "58%", size: 360, opacity: 0.06 },
      { color: "#c4b5fd", x: "44%", y: "82%", size: 270, opacity: 0.05 },
      { color: "#ddd6fe", x: "86%", y: "16%", size: 190, opacity: 0.04 },
    ],
    particles: "🚂",
    particleColor: "rgba(167,139,250,0.25)",
    gridColor: "rgba(167,139,250,0.04)",
    labelColor: "#a78bfa",
    btnBg: "linear-gradient(135deg,#7c3aed,#a78bfa,#7c3aed)",
    cardBorder: "rgba(167,139,250,0.2)",
    inputBorder: "rgba(167,139,250,0.3)",
    icon: "🚂",
    tagline: "Book Train Tickets",
  },
  cab: {
    name: "cab",
    bgFrom: "#1a0e00",
    bgTo: "#2d1e00",
    accent: "#fbbf24",
    accentSoft: "rgba(251,191,36,0.15)",
    grad: "linear-gradient(135deg,#1a0e00 0%,#2d1e00 40%,#4a3200 70%,#1a0e00 100%)",
    tabGrad: "linear-gradient(135deg,#1a0e00,#78350f,#c9a84c)",
    orbs: [
      { color: "#fbbf24", x: "22%", y: "28%", size: 380, opacity: 0.07 },
      { color: "#f59e0b", x: "71%", y: "54%", size: 340, opacity: 0.06 },
      { color: "#fcd34d", x: "46%", y: "80%", size: 260, opacity: 0.05 },
      { color: "#fef3c7", x: "84%", y: "19%", size: 185, opacity: 0.04 },
    ],
    particles: "🚗",
    particleColor: "rgba(251,191,36,0.25)",
    gridColor: "rgba(251,191,36,0.04)",
    labelColor: "#fbbf24",
    btnBg: "linear-gradient(135deg,#c9a84c,#fbbf24,#c9a84c)",
    cardBorder: "rgba(251,191,36,0.2)",
    inputBorder: "rgba(251,191,36,0.3)",
    icon: "🚗",
    tagline: "Book Cabs",
  },
};

function flightLink(fromCode, toCode, dateStr, passengers = 1, subId = "alvryn_web") {
  let d = "";
  if (dateStr) {
    const parts = dateStr.split("-");
    if (parts.length === 3) d = parts[2] + parts[1];
  }
  const pax = Math.max(1, passengers);
  const INDIA_CODES = new Set([
    "BLR","BOM","DEL","MAA","HYD","CCU","GOI","PNQ","COK","AMD","JAI",
    "LKO","VNS","PAT","IXC","GAU","BBI","CBE","IXM","IXE","MYQ","TRV",
    "VTZ","VGA","IXR","BHO","SXR","IXJ","HBX","IXG","TIR","IXL","IXZ",
    "NAG","IDR","RPR","DED","SLV","ATQ","UDR","JDH","AGR","STV",
  ]);
  const isIndia = INDIA_CODES.has(fromCode) && INDIA_CODES.has(toCode);
  const base = isIndia ? "https://www.aviasales.in" : "https://www.aviasales.com";
  return `${base}/search/${fromCode}${d}${toCode}${pax}?marker=714667&sub_id=${subId}`;
}

function busLink(from, to, dateStr) {
  const f = from.toLowerCase().replace(/\s+/g, "-");
  const t = to.toLowerCase().replace(/\s+/g, "-");
  if (dateStr) {
    try {
      const d = new Date(dateStr);
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const formatted = d.getDate().toString().padStart(2,"0") + "-" + months[d.getMonth()] + "-" + d.getFullYear();
      return `https://www.redbus.in/bus-tickets/${f}-to-${t}?doj=${formatted}`;
    } catch {}
  }
  return `https://www.redbus.in/bus-tickets/${f}-to-${t}`;
}

function hotelLink(city, checkIn, checkOut) {
  let url = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city)}&lang=en-gb`;
  if (checkIn) url += `&checkin=${checkIn}`;
  if (checkOut) url += `&checkout=${checkOut}`;
  return url;
}

function trainLink(from, to, dateStr) {
  const f = (from||"").toUpperCase().slice(0,5);
  const t = (to||"").toUpperCase().slice(0,5);
  if (dateStr) {
    const d = dateStr.replace(/-/g,"");
    return `https://www.irctc.co.in/nget/train-search?fromStation=${f}&toStation=${t}&jdate=${d}`;
  }
  return `https://www.irctc.co.in/nget/train-search`;
}

// ─── DYNAMIC ANIMATED BACKGROUND ─────────────────────────────────────────────
function DynamicBackground({ theme, transitioning }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Init floating orb particles
    particlesRef.current = Array.from({ length: 18 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 120 + Math.random() * 200,
      alpha: 0.03 + Math.random() * 0.05,
      colorIdx: i % 4,
      phase: Math.random() * Math.PI * 2,
    }));

    let frame = 0;
    const draw = () => {
      const t = themeRef.current;
      const W = canvas.width, H = canvas.height;
      frame++;

      ctx.clearRect(0, 0, W, H);

      // Base gradient
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, t.bgFrom);
      grad.addColorStop(0.5, t.bgTo);
      grad.addColorStop(1, t.bgFrom);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Subtle grid lines
      ctx.strokeStyle = t.gridColor;
      ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += 60) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 60) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Animated orbs
      t.orbs.forEach((orb, i) => {
        const p = particlesRef.current[i] || {};
        const ox = parseFloat(orb.x) / 100 * W + Math.sin(frame * 0.005 + i) * 40;
        const oy = parseFloat(orb.y) / 100 * H + Math.cos(frame * 0.004 + i) * 30;
        const radial = ctx.createRadialGradient(ox, oy, 0, ox, oy, orb.size);
        radial.addColorStop(0, orb.color + Math.round(orb.opacity * 255).toString(16).padStart(2,"0"));
        radial.addColorStop(1, "transparent");
        ctx.fillStyle = radial;
        ctx.beginPath();
        ctx.arc(ox, oy, orb.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Vignette
      const vignette = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H) * 0.75);
      vignette.addColorStop(0, "transparent");
      vignette.addColorStop(1, "rgba(0,0,0,0.4)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, W, H);

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [theme.name]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        opacity: transitioning ? 0 : 1,
        transition: "opacity 0.6s ease",
      }}
    />
  );
}

// ─── SHARED CSS ───────────────────────────────────────────────────────────────
const SHARED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600&family=Space+Mono:wght@400;700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);}}
  @keyframes floatUD{0%,100%{transform:translateY(0);}50%{transform:translateY(-9px);}}
  @keyframes gradShift{0%,100%{background-position:0% 50%;}50%{background-position:100% 50%;}}
  @keyframes spinSlow{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
  @keyframes tabSlide{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);}}
  @keyframes bgMorph{0%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%;}50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%;}100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%;}}
  @keyframes pulseGlow{0%,100%{box-shadow:0 0 0 0 transparent;}50%{box-shadow:0 0 30px 4px rgba(201,168,76,0.2);}}
  ::-webkit-scrollbar{width:2px;}
  ::-webkit-scrollbar-thumb{background:linear-gradient(#c9a84c,#8B6914);border-radius:2px;}
  @media(max-width:768px){
    .search-city-grid{grid-template-columns:1fr!important;}
    .search-date-grid{grid-template-columns:1fr 1fr!important;}
    .results-card-bottom{flex-direction:column!important;gap:12px!important;}
    .nav-right-btns{gap:4px!important;}
    .nav-right-btns button{padding:6px 10px!important;font-size:11px!important;}
  }
  @media(max-width:480px){
    .nav-right-btns .hide-mobile{display:none!important;}
  }
`;

function AlvrynIcon({ size = 40, accent = "#c9a84c" }) {
  const uid = `app_${size}_${accent.replace(/[^a-z0-9]/gi,"")}`;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={`${uid}g`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c9a84c"/>
          <stop offset="50%" stopColor="#f0d080"/>
          <stop offset="100%" stopColor={accent}/>
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" stroke={`url(#${uid}g)`} strokeWidth="1.2" fill="none"/>
      <circle cx="32" cy="32" r="26" stroke={`url(#${uid}g)`} strokeWidth="0.5" fill="none" opacity="0.4"/>
      <path d="M20 46 L28 18 L36 46" stroke={`url(#${uid}g)`} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M22.5 36 L33.5 36" stroke={`url(#${uid}g)`} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M26 46 L34 18 L42 46" stroke={`url(#${uid}g)`} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.45"/>
      <path d="M28 36 L40 36" stroke={`url(#${uid}g)`} strokeWidth="1" strokeLinecap="round" opacity="0.45"/>
      <circle cx="32" cy="9" r="1.5" fill={`url(#${uid}g)`}/>
    </svg>
  );
}

// ─── CITY ALIASES & IATA ──────────────────────────────────────────────────────
const CITY_ALIASES = {
  "bangalore":"bangalore","bengaluru":"bangalore","bengalore":"bangalore","bangaluru":"bangalore",
  "blr":"bangalore","bang":"bangalore","banglore":"bangalore","bangalor":"bangalore",
  "bengalure":"bangalore","banglaore":"bangalore","b'lore":"bangalore","blore":"bangalore",
  "mumbai":"mumbai","bombay":"mumbai","bom":"mumbai","mum":"mumbai","mumbi":"mumbai",
  "mombai":"mumbai","mumbay":"mumbai","bombai":"mumbai",
  "delhi":"delhi","new delhi":"delhi","del":"delhi","dilli":"delhi","nai dilli":"delhi",
  "dilhi":"delhi","deli":"delhi","ncr":"delhi",
  "chennai":"chennai","madras":"chennai","maa":"chennai","chenai":"chennai","chinnai":"chennai",
  "hyderabad":"hyderabad","hyd":"hyderabad","hydrabad":"hyderabad","secunderabad":"hyderabad",
  "kolkata":"kolkata","calcutta":"kolkata","ccu":"kolkata","kolkatta":"kolkata",
  "goa":"goa","goi":"goa","north goa":"goa","south goa":"goa","panaji":"goa",
  "pune":"pune","pnq":"pune","poona":"pune","puna":"pune",
  "kochi":"kochi","cochin":"kochi","cok":"kochi","ernakulam":"kochi",
  "ahmedabad":"ahmedabad","amd":"ahmedabad","ahemdabad":"ahmedabad",
  "jaipur":"jaipur","jai":"jaipur","pink city":"jaipur",
  "lucknow":"lucknow","lko":"lucknow","lakhnau":"lucknow",
  "varanasi":"varanasi","vns":"varanasi","banaras":"varanasi","kashi":"varanasi",
  "trivandrum":"trivandrum","thiruvananthapuram":"trivandrum","trv":"trivandrum","trivandram":"trivandrum",
  "coimbatore":"coimbatore","cbe":"coimbatore","kovai":"coimbatore",
  "madurai":"madurai","mdu":"madurai","temple city":"madurai",
  "mangalore":"mangalore","mangaluru":"mangalore","ixe":"mangalore",
  "mysore":"mysore","mysuru":"mysore",
  "dubai":"dubai","dxb":"dubai","dubi":"dubai",
  "singapore":"singapore","sin":"singapore","singapur":"singapore",
  "bangkok":"bangkok","bkk":"bangkok",
  "london":"london","lhr":"london",
  "new york":"new york","jfk":"new york","nyc":"new york",
  "kuala lumpur":"kuala lumpur","kul":"kuala lumpur","kl":"kuala lumpur",
  "colombo":"colombo","cmb":"colombo",
  "paris":"paris","cdg":"paris",
  "tokyo":"tokyo","nrt":"tokyo",
  "sydney":"sydney","syd":"sydney",
  "bali":"bali","dps":"bali",
  "maldives":"male","male":"male",
  "doha":"doha","doh":"doha",
  "abu dhabi":"abu dhabi","auh":"abu dhabi",
  "istanbul":"istanbul","ist":"istanbul",
  "patna":"patna","chandigarh":"chandigarh","guwahati":"guwahati",
  "bhubaneswar":"bhubaneswar","nagpur":"nagpur","indore":"indore",
  "shimla":"shimla","dehradun":"dehradun","leh":"leh","ladakh":"leh",
  "amritsar":"amritsar","udaipur":"udaipur","jodhpur":"jodhpur","agra":"agra",
  "visakhapatnam":"visakhapatnam","vizag":"visakhapatnam",
  "ranchi":"ranchi","bhopal":"bhopal","srinagar":"srinagar",
  "kathmandu":"kathmandu","ktm":"kathmandu",
};

const CITY_TO_IATA = {
  "bangalore":"BLR","mumbai":"BOM","delhi":"DEL","chennai":"MAA","hyderabad":"HYD",
  "kolkata":"CCU","goa":"GOI","pune":"PNQ","kochi":"COK","ahmedabad":"AMD","jaipur":"JAI",
  "lucknow":"LKO","varanasi":"VNS","patna":"PAT","chandigarh":"IXC","guwahati":"GAU",
  "bhubaneswar":"BBI","coimbatore":"CBE","madurai":"IXM","mangalore":"IXE","mysore":"MYQ",
  "trivandrum":"TRV","visakhapatnam":"VTZ","ranchi":"IXR","bhopal":"BHO",
  "srinagar":"SXR","amritsar":"ATQ","udaipur":"UDR","jodhpur":"JDH","agra":"AGR",
  "indore":"IDR","shimla":"SLV","dehradun":"DED","leh":"IXL","nagpur":"NAG",
  "dubai":"DXB","singapore":"SIN","bangkok":"BKK","london":"LHR","new york":"JFK",
  "kuala lumpur":"KUL","colombo":"CMB","paris":"CDG","tokyo":"NRT","sydney":"SYD",
  "doha":"DOH","abu dhabi":"AUH","istanbul":"IST","bali":"DPS","maldives":"MLE","male":"MLE",
  "kathmandu":"KTM",
};

const CITIES = [
  {code:"BLR",name:"Bangalore",full:"Kempegowda International",country:"India",popular:true},
  {code:"BOM",name:"Mumbai",full:"Chhatrapati Shivaji Intl",country:"India",popular:true},
  {code:"DEL",name:"Delhi",full:"Indira Gandhi International",country:"India",popular:true},
  {code:"MAA",name:"Chennai",full:"Chennai International",country:"India",popular:true},
  {code:"HYD",name:"Hyderabad",full:"Rajiv Gandhi International",country:"India",popular:true},
  {code:"CCU",name:"Kolkata",full:"Netaji Subhas Chandra Bose Intl",country:"India",popular:true},
  {code:"GOI",name:"Goa",full:"Dabolim / Mopa Airport",country:"India",popular:true},
  {code:"PNQ",name:"Pune",full:"Pune Airport",country:"India",popular:true},
  {code:"COK",name:"Kochi",full:"Cochin International",country:"India",popular:true},
  {code:"AMD",name:"Ahmedabad",full:"Sardar Vallabhbhai Patel Intl",country:"India",popular:true},
  {code:"JAI",name:"Jaipur",full:"Jaipur International",country:"India",popular:true},
  {code:"TRV",name:"Trivandrum",full:"Trivandrum International",country:"India",popular:false},
  {code:"LKO",name:"Lucknow",full:"Chaudhary Charan Singh Intl",country:"India",popular:false},
  {code:"VNS",name:"Varanasi",full:"Lal Bahadur Shastri Airport",country:"India",popular:false},
  {code:"PAT",name:"Patna",full:"Jay Prakash Narayan Airport",country:"India",popular:false},
  {code:"BHO",name:"Bhopal",full:"Raja Bhoj Airport",country:"India",popular:false},
  {code:"NAG",name:"Nagpur",full:"Dr. Babasaheb Ambedkar Intl",country:"India",popular:false},
  {code:"SXR",name:"Srinagar",full:"Sheikh ul-Alam Airport",country:"India",popular:false},
  {code:"IXC",name:"Chandigarh",full:"Chandigarh Airport",country:"India",popular:false},
  {code:"GAU",name:"Guwahati",full:"Lokpriya Gopinath Bordoloi Intl",country:"India",popular:false},
  {code:"BBI",name:"Bhubaneswar",full:"Biju Patnaik International",country:"India",popular:false},
  {code:"UDR",name:"Udaipur",full:"Maharana Pratap Airport",country:"India",popular:false},
  {code:"ATQ",name:"Amritsar",full:"Sri Guru Ram Dass Jee Intl",country:"India",popular:false},
  {code:"IDR",name:"Indore",full:"Devi Ahilyabai Holkar Airport",country:"India",popular:false},
  {code:"VTZ",name:"Visakhapatnam",full:"Visakhapatnam Airport",country:"India",popular:false},
  {code:"IXR",name:"Ranchi",full:"Birsa Munda Airport",country:"India",popular:false},
  {code:"CBE",name:"Coimbatore",full:"Coimbatore International",country:"India",popular:false},
  {code:"IXE",name:"Mangalore",full:"Mangalore International",country:"India",popular:false},
  {code:"MYQ",name:"Mysore",full:"Mysore Airport",country:"India",popular:false},
  {code:"DED",name:"Dehradun",full:"Jolly Grant Airport",country:"India",popular:false},
  {code:"SLV",name:"Shimla",full:"Jubarhatti Airport",country:"India",popular:false},
  {code:"IXL",name:"Leh",full:"Kushok Bakula Rimpochee Airport",country:"India",popular:false},
  {code:"TIR",name:"Tirupati",full:"Tirupati Airport",country:"India",popular:false},
  {code:"MDU",name:"Madurai",full:"Madurai Airport",country:"India",popular:false},
  {code:"IXM",name:"Madurai",full:"Madurai Airport",country:"India",popular:false},
  {code:"DXB",name:"Dubai",full:"Dubai International",country:"UAE",popular:true},
  {code:"SIN",name:"Singapore",full:"Changi Airport",country:"Singapore",popular:true},
  {code:"BKK",name:"Bangkok",full:"Suvarnabhumi Airport",country:"Thailand",popular:true},
  {code:"LHR",name:"London",full:"Heathrow Airport",country:"UK",popular:true},
  {code:"JFK",name:"New York",full:"JFK International",country:"USA",popular:true},
  {code:"KUL",name:"Kuala Lumpur",full:"KLIA Airport",country:"Malaysia",popular:true},
  {code:"CMB",name:"Colombo",full:"Bandaranaike International",country:"Sri Lanka",popular:true},
  {code:"CDG",name:"Paris",full:"Charles de Gaulle",country:"France",popular:false},
  {code:"NRT",name:"Tokyo",full:"Narita International",country:"Japan",popular:false},
  {code:"SYD",name:"Sydney",full:"Kingsford Smith",country:"Australia",popular:false},
  {code:"DOH",name:"Doha",full:"Hamad International",country:"Qatar",popular:false},
  {code:"AUH",name:"Abu Dhabi",full:"Zayed International",country:"UAE",popular:false},
  {code:"IST",name:"Istanbul",full:"Istanbul Airport",country:"Turkey",popular:false},
  {code:"DPS",name:"Bali",full:"Ngurah Rai International",country:"Indonesia",popular:false},
  {code:"MLE",name:"Maldives",full:"Velana International",country:"Maldives",popular:false},
  {code:"KTM",name:"Kathmandu",full:"Tribhuvan International",country:"Nepal",popular:false},
];

const BUS_ROUTES = [
  {from:"Bangalore",to:"Chennai",dur:"5h 30m",dep:"06:00",arr:"11:30",price:650,type:"AC Sleeper",op:"VRL Travels"},
  {from:"Bangalore",to:"Chennai",dur:"5h 30m",dep:"21:00",arr:"02:30",price:550,type:"Semi-Sleeper",op:"KSRTC"},
  {from:"Bangalore",to:"Chennai",dur:"5h 30m",dep:"14:00",arr:"19:30",price:720,type:"AC Sleeper",op:"SRS Travels"},
  {from:"Bangalore",to:"Hyderabad",dur:"8h",dep:"20:00",arr:"04:00",price:800,type:"AC Sleeper",op:"SRS Travels"},
  {from:"Bangalore",to:"Hyderabad",dur:"8h",dep:"10:00",arr:"18:00",price:750,type:"Semi-Sleeper",op:"Orange Travels"},
  {from:"Bangalore",to:"Goa",dur:"9h",dep:"21:30",arr:"06:30",price:900,type:"AC Sleeper",op:"Neeta Tours"},
  {from:"Bangalore",to:"Goa",dur:"9h",dep:"08:00",arr:"17:00",price:850,type:"AC Sleeper",op:"Paulo Travels"},
  {from:"Bangalore",to:"Mumbai",dur:"16h",dep:"17:00",arr:"09:00",price:1400,type:"AC Sleeper",op:"VRL Travels"},
  {from:"Bangalore",to:"Pune",dur:"14h",dep:"18:00",arr:"08:00",price:1200,type:"AC Sleeper",op:"Paulo Travels"},
  {from:"Bangalore",to:"Coimbatore",dur:"4h",dep:"07:00",arr:"11:00",price:400,type:"AC Seater",op:"KSRTC"},
  {from:"Bangalore",to:"Mangalore",dur:"7h",dep:"22:00",arr:"05:00",price:700,type:"AC Sleeper",op:"VRL Travels"},
  {from:"Bangalore",to:"Mysore",dur:"3h",dep:"07:00",arr:"10:00",price:250,type:"AC Seater",op:"KSRTC"},
  {from:"Bangalore",to:"Kochi",dur:"10h",dep:"21:00",arr:"07:00",price:950,type:"AC Sleeper",op:"KSRTC"},
  {from:"Bangalore",to:"Madurai",dur:"8h",dep:"21:00",arr:"05:00",price:750,type:"AC Sleeper",op:"Parveen Travels"},
  {from:"Bangalore",to:"Tirupati",dur:"5h",dep:"05:30",arr:"10:30",price:450,type:"AC Seater",op:"APSRTC"},
  {from:"Chennai",to:"Hyderabad",dur:"7h",dep:"21:00",arr:"04:00",price:750,type:"AC Sleeper",op:"TSRTC"},
  {from:"Chennai",to:"Bangalore",dur:"5h 30m",dep:"07:00",arr:"12:30",price:630,type:"AC Sleeper",op:"VRL Travels"},
  {from:"Chennai",to:"Coimbatore",dur:"4h 30m",dep:"08:00",arr:"12:30",price:350,type:"AC Seater",op:"TNSTC"},
  {from:"Chennai",to:"Madurai",dur:"5h",dep:"22:00",arr:"03:00",price:450,type:"AC Sleeper",op:"Parveen Travels"},
  {from:"Hyderabad",to:"Bangalore",dur:"8h",dep:"21:00",arr:"05:00",price:800,type:"AC Sleeper",op:"Orange Travels"},
  {from:"Hyderabad",to:"Mumbai",dur:"12h",dep:"18:00",arr:"06:00",price:1100,type:"AC Sleeper",op:"VRL Travels"},
  {from:"Mumbai",to:"Pune",dur:"3h",dep:"07:00",arr:"10:00",price:300,type:"AC Seater",op:"MSRTC"},
  {from:"Mumbai",to:"Goa",dur:"10h",dep:"22:00",arr:"08:00",price:950,type:"AC Sleeper",op:"Paulo Travels"},
  {from:"Delhi",to:"Jaipur",dur:"5h",dep:"06:00",arr:"11:00",price:500,type:"AC Seater",op:"RSRTC"},
  {from:"Delhi",to:"Agra",dur:"4h",dep:"07:00",arr:"11:00",price:400,type:"AC Seater",op:"UP Roadways"},
  {from:"Delhi",to:"Chandigarh",dur:"4h",dep:"08:00",arr:"12:00",price:450,type:"AC Seater",op:"HRTC"},
  {from:"Delhi",to:"Lucknow",dur:"7h",dep:"22:00",arr:"05:00",price:700,type:"AC Sleeper",op:"UP SRTC"},
  {from:"Delhi",to:"Amritsar",dur:"7h",dep:"21:30",arr:"04:30",price:750,type:"AC Sleeper",op:"PRTC"},
  {from:"Delhi",to:"Shimla",dur:"8h",dep:"05:30",arr:"13:30",price:650,type:"AC Seater",op:"HRTC"},
  {from:"Kolkata",to:"Bhubaneswar",dur:"6h",dep:"21:00",arr:"03:00",price:600,type:"AC Sleeper",op:"OSRTC"},
  {from:"Kolkata",to:"Patna",dur:"9h",dep:"20:00",arr:"05:00",price:750,type:"AC Sleeper",op:"BSRTC"},
  {from:"Pune",to:"Goa",dur:"8h",dep:"22:30",arr:"06:30",price:850,type:"AC Sleeper",op:"Neeta Tours"},
  {from:"Pune",to:"Hyderabad",dur:"10h",dep:"20:00",arr:"06:00",price:950,type:"AC Sleeper",op:"SRS Travels"},
  {from:"Bangalore",to:"Ooty",dur:"5h",dep:"07:30",arr:"12:30",price:380,type:"AC Seater",op:"KSRTC"},
  {from:"Bangalore",to:"Pondicherry",dur:"5h",dep:"07:00",arr:"12:00",price:450,type:"AC Seater",op:"TNSTC"},
  {from:"Bangalore",to:"Salem",dur:"3h 30m",dep:"07:30",arr:"11:00",price:320,type:"AC Seater",op:"KSRTC"},
  {from:"Bangalore",to:"Vellore",dur:"3h",dep:"06:30",arr:"09:30",price:280,type:"AC Seater",op:"TNSTC"},
  {from:"Coimbatore",to:"Chennai",dur:"7h",dep:"21:00",arr:"04:00",price:600,type:"AC Sleeper",op:"TNSTC"},
  {from:"Coimbatore",to:"Bangalore",dur:"4h",dep:"07:00",arr:"11:00",price:380,type:"AC Seater",op:"KSRTC"},
  {from:"Madurai",to:"Chennai",dur:"8h",dep:"21:00",arr:"05:00",price:580,type:"AC Sleeper",op:"TNSTC"},
  {from:"Kochi",to:"Trivandrum",dur:"4h",dep:"07:30",arr:"11:30",price:350,type:"AC Seater",op:"KSRTC"},
  {from:"Kochi",to:"Bangalore",dur:"10h",dep:"22:00",arr:"08:00",price:950,type:"AC Sleeper",op:"KSRTC"},
  {from:"Trivandrum",to:"Kochi",dur:"4h",dep:"07:00",arr:"11:00",price:350,type:"AC Seater",op:"KSRTC"},
  {from:"Jaipur",to:"Udaipur",dur:"6h",dep:"07:00",arr:"13:00",price:550,type:"AC Seater",op:"RSRTC"},
  {from:"Jaipur",to:"Delhi",dur:"5h",dep:"06:00",arr:"11:00",price:490,type:"AC Seater",op:"RSRTC"},
];

const HOTEL_CITIES = [
  "Bangalore","Mumbai","Delhi","Chennai","Hyderabad","Kolkata","Goa","Pune","Kochi",
  "Ahmedabad","Jaipur","Agra","Varanasi","Udaipur","Mysore","Shimla","Manali","Ooty",
  "Coorg","Munnar","Rishikesh","Haridwar","Amritsar","Chandigarh","Lucknow",
  "Bhubaneswar","Visakhapatnam","Tirupati","Madurai","Coimbatore","Mangalore",
  "Srinagar","Leh","Port Blair","Darjeeling","Guwahati",
  "Dubai","Singapore","Bangkok","London","New York","Paris","Tokyo","Sydney",
  "Kuala Lumpur","Colombo","Bali","Phuket","Hong Kong","Istanbul","Rome","Barcelona",
  "Amsterdam","Maldives","Kathmandu","Doha","Abu Dhabi","Muscat","Cairo","Nairobi",
];

const BUS_CITIES = [...new Set([...BUS_ROUTES.map(r=>r.from),...BUS_ROUTES.map(r=>r.to)])].sort();
const CLASSES = ["Economy","Premium Economy","Business","First Class"];
const BUS_TYPES = ["Any","AC Sleeper","Semi-Sleeper","AC Seater"];

function fmtTime(dt){if(!dt)return"--:--";return new Date(dt).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:false});}
function fmtDate(dt){if(!dt)return"";return new Date(dt).toLocaleDateString("en-IN",{day:"numeric",month:"short"});}
function calcDur(dep,arr){if(!dep||!arr)return"";const d=(new Date(arr)-new Date(dep))/60000;return`${Math.floor(d/60)}h${d%60>0?" "+d%60+"m":""}`.trim();}

function parseQuery(text) {
  let t = text.toLowerCase()
    .replace(/[^\w\s₹]/g," ")
    .replace(/\b(mujhe|muje|chahiye|show|please|kya|hai|se|ko|ka|ek|ticket|find|search|want|need|bata|dikha|enakku|vendum|naaku|kavali)\b/gi," ")
    .replace(/\s+/g," ").trim();

  let found = [];
  const multiWord = Object.keys(CITY_ALIASES).filter(k=>k.includes(" ")).sort((a,b)=>b.length-a.length);
  let remaining = t;
  for (const key of multiWord) {
    if (remaining.includes(key) && found.length < 2) { found.push(CITY_ALIASES[key]); remaining = remaining.replace(key," "); }
  }
  const words = remaining.split(/[\s,\-\/→➡to]+/);
  for (const word of words) {
    const clean = word.replace(/[^a-z]/g,"");
    if (clean.length >= 2 && CITY_ALIASES[clean] && found.length < 2 && !found.includes(CITY_ALIASES[clean])) found.push(CITY_ALIASES[clean]);
  }
  if (found.length < 2) {
    const allKeys = Object.keys(CITY_ALIASES);
    for (const w of remaining.split(/\s+/)) {
      if (w.length < 3) continue;
      for (const key of allKeys) {
        if (key.length >= 3 && w.slice(0,3) === key.slice(0,3) && !found.includes(CITY_ALIASES[key])) {
          found.push(CITY_ALIASES[key]); if (found.length === 2) break;
        }
      }
      if (found.length === 2) break;
    }
  }

  const now = new Date(); let date = null;
  const months = {jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11,
    january:0,february:1,march:2,april:3,june:5,july:6,august:7,september:8,october:9,november:10,december:11};
  for (const [mon,idx] of Object.entries(months)) {
    const m = t.match(new RegExp(`(\\d{1,2})\\s*${mon}|${mon}\\s*(\\d{1,2})`));
    if (m) { const day=parseInt(m[1]||m[2]); const d=new Date(now.getFullYear(),idx,day); if(d<now)d.setFullYear(d.getFullYear()+1); date=d; break; }
  }
  if (!date) {
    if(/today|aaj/.test(t)) date=new Date(now);
    else if(/day after tomorrow|parso/.test(t)){date=new Date(now);date.setDate(date.getDate()+2);}
    else if(/tomorrow|kal|tmrw|nale|repu/.test(t)){date=new Date(now);date.setDate(date.getDate()+1);}
    else if(/weekend/.test(t)){date=new Date(now);const diff=(6-now.getDay()+7)%7||7;date.setDate(now.getDate()+diff);}
  }
  if (date && date < new Date(new Date(now).setHours(0,0,0,0))) return{from:found[0]||null,to:found[1]||null,date:null,pastDate:true,budget:null,singleCity:found[0]||null};

  let budget = null;
  const bP = [/under\s*[₹rs.]*\s*(\d+)k?/,/below\s*[₹rs.]*\s*(\d+)k?/,/less\s*than\s*[₹rs.]*\s*(\d+)k?/,/max\s*[₹rs.]*\s*(\d+)k?/];
  for (const p of bP) { const m=t.match(p); if(m){let v=parseInt(m[1]);if(t.match(/\d+k/))v*=1000;budget=v;break;} }

  return{from:found[0]||null,to:found[1]||null,date,pastDate:false,budget,singleCity:found[0]||null};
}

// ─── CITY MODAL ───────────────────────────────────────────────────────────────
function CityModal({title,onSelect,onClose,exclude,theme}){
  const [s,setS]=useState("");
  const shown=CITIES.filter(c=>c.code!==exclude&&(c.name.toLowerCase().includes(s.toLowerCase())||c.code.toLowerCase().includes(s.toLowerCase())||c.country.toLowerCase().includes(s.toLowerCase())));
  const T = theme || TAB_THEMES.flight;
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(12px)",padding:20}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:480,background:"rgba(10,10,20,0.95)",borderRadius:22,padding:28,boxShadow:`0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px ${T.accent}33`,border:`1px solid ${T.accent}33`,maxHeight:"80vh",display:"flex",flexDirection:"column"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:20,color:"#fff",marginBottom:14}}>{title}</div>
        <input autoFocus value={s} onChange={e=>setS(e.target.value)} placeholder="Search city, code or country…"
          style={{width:"100%",padding:"11px 16px",borderRadius:12,fontSize:14,fontFamily:"'DM Sans',sans-serif",border:`1.5px solid ${T.accent}55`,outline:"none",marginBottom:12,color:"#fff",background:"rgba(255,255,255,0.06)"}}/>
        <div style={{display:"flex",flexDirection:"column",gap:5,overflowY:"auto",flex:1}}>
          {shown.map(city=>(
            <div key={city.code} onClick={()=>onSelect(city)}
              style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",borderRadius:11,cursor:"pointer",background:"rgba(255,255,255,0.04)",border:`1px solid ${T.accent}22`,transition:"all 0.15s"}}
              onMouseEnter={e=>{e.currentTarget.style.background=T.accentSoft;e.currentTarget.style.borderColor=T.accent+"55";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.borderColor=T.accent+"22";}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:14,color:"#fff"}}>{city.name}</span>
                  {city.popular&&<span style={{fontSize:8,background:T.accentSoft,color:T.accent,padding:"2px 6px",borderRadius:6,fontFamily:"'Space Mono',monospace"}}>TOP</span>}
                </div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",marginTop:2}}>{city.full} · {city.country}</div>
              </div>
              <div style={{fontFamily:"'Space Mono',monospace",fontWeight:700,fontSize:14,color:T.accent}}>{city.code}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BusCityModal({title,onSelect,onClose,exclude,theme}){
  const [s,setS]=useState("");
  const shown=BUS_CITIES.filter(c=>c.toLowerCase().includes(s.toLowerCase())&&c!==exclude);
  const T = theme || TAB_THEMES.bus;
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(12px)",padding:20}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:440,background:"rgba(4,35,8,0.97)",borderRadius:22,padding:28,boxShadow:`0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px ${T.accent}33`,border:`1px solid ${T.accent}33`,maxHeight:"75vh",display:"flex",flexDirection:"column"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:20,color:"#fff",marginBottom:14}}>{title}</div>
        <input autoFocus value={s} onChange={e=>setS(e.target.value)} placeholder="Search city…"
          style={{width:"100%",padding:"11px 16px",borderRadius:12,fontSize:14,fontFamily:"'DM Sans',sans-serif",border:`1.5px solid ${T.accent}55`,outline:"none",marginBottom:12,color:"#fff",background:"rgba(255,255,255,0.06)"}}/>
        <div style={{display:"flex",flexDirection:"column",gap:5,overflowY:"auto",flex:1}}>
          {shown.map(city=>(
            <div key={city} onClick={()=>onSelect(city)}
              style={{padding:"13px 16px",borderRadius:11,cursor:"pointer",background:"rgba(255,255,255,0.04)",border:`1px solid ${T.accent}22`,fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:600,color:"#fff",transition:"all 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.background=T.accentSoft}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}>
              🚌 {city}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HotelCityModal({title,onSelect,onClose,theme}){
  const [s,setS]=useState("");
  const shown=HOTEL_CITIES.filter(c=>c.toLowerCase().includes(s.toLowerCase()));
  const T = theme || TAB_THEMES.hotel;
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(12px)",padding:20}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:440,background:"rgba(26,10,0,0.97)",borderRadius:22,padding:28,boxShadow:`0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px ${T.accent}33`,border:`1px solid ${T.accent}33`,maxHeight:"75vh",display:"flex",flexDirection:"column"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:20,color:"#fff",marginBottom:14}}>{title}</div>
        <input autoFocus value={s} onChange={e=>setS(e.target.value)} placeholder="Search city…"
          style={{width:"100%",padding:"11px 16px",borderRadius:12,fontSize:14,fontFamily:"'DM Sans',sans-serif",border:`1.5px solid ${T.accent}55`,outline:"none",marginBottom:12,color:"#fff",background:"rgba(255,255,255,0.06)"}}/>
        <div style={{display:"flex",flexDirection:"column",gap:5,overflowY:"auto",flex:1}}>
          {shown.map(city=>(
            <div key={city} onClick={()=>onSelect(city)}
              style={{padding:"13px 16px",borderRadius:11,cursor:"pointer",background:"rgba(255,255,255,0.04)",border:`1px solid ${T.accent}22`,fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:600,color:"#fff",transition:"all 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.background=T.accentSoft}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}>
              🏨 {city}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TRAIN PANEL ─────────────────────────────────────────────────────────────
function TrainPanel({ theme }) {
  const T = theme || TAB_THEMES.train;
  const STATIONS = [
    {name:"Bangalore (SBC)",code:"SBC"},{name:"Mumbai CSMT",code:"CSTM"},
    {name:"Delhi New Delhi",code:"NDLS"},{name:"Chennai Central",code:"MAS"},
    {name:"Hyderabad Deccan",code:"HYB"},{name:"Kolkata Howrah",code:"HWH"},
    {name:"Pune Junction",code:"PUNE"},{name:"Kochi Ernakulam",code:"ERS"},
    {name:"Jaipur Junction",code:"JP"},{name:"Ahmedabad Junction",code:"ADI"},
    {name:"Lucknow Charbagh",code:"LKO"},{name:"Varanasi Junction",code:"BSB"},
    {name:"Patna Junction",code:"PNBE"},{name:"Bhopal Junction",code:"BPL"},
    {name:"Nagpur Junction",code:"NGP"},{name:"Chandigarh",code:"CDG"},
    {name:"Guwahati",code:"GHY"},{name:"Coimbatore Junction",code:"CBE"},
    {name:"Madurai Junction",code:"MDU"},{name:"Trivandrum Central",code:"TVC"},
    {name:"Visakhapatnam",code:"VSKP"},{name:"Amritsar",code:"ASR"},
    {name:"Indore Junction",code:"INDB"},{name:"Surat",code:"ST"},
    {name:"Agra Cantt",code:"AGC"},{name:"Gwalior",code:"GWL"},
    {name:"Jodhpur",code:"JU"},{name:"Udaipur City",code:"UDZ"},
    {name:"Ranchi",code:"RNC"},{name:"Ajmer Junction",code:"AII"},
  ];
  const [from,setFrom]=useState("Bangalore (SBC)");
  const [to,setTo]=useState("Chennai Central");
  const [date,setDate]=useState("");
  const [fromQ,setFromQ]=useState("Bangalore (SBC)");
  const [toQ,setToQ]=useState("Chennai Central");
  const [fromOpen,setFromOpen]=useState(false);
  const [toOpen,setToOpen]=useState(false);
  const today=new Date().toISOString().split("T")[0];

  const fromFiltered=fromQ.trim()?STATIONS.filter(s=>s.name.toLowerCase().includes(fromQ.toLowerCase())||s.code.toLowerCase().includes(fromQ.toLowerCase())).slice(0,8):STATIONS.slice(0,8);
  const toFiltered=toQ.trim()?STATIONS.filter(s=>s.name.toLowerCase().includes(toQ.toLowerCase())||s.code.toLowerCase().includes(toQ.toLowerCase())).slice(0,8):STATIONS.slice(0,8);

  const search=()=>{
    const fromCode=STATIONS.find(s=>s.name===from)?.code||from.slice(0,4).toUpperCase();
    const toCode=STATIONS.find(s=>s.name===to)?.code||to.slice(0,4).toUpperCase();
    let url=`https://www.irctc.co.in/nget/train-search?fromStation=${fromCode}&toStation=${toCode}&isCallFromDpDown=true&quota=GN&class=SL`;
    if(date){
      const d=new Date(date);
      url+=`&journeyDate=${String(d.getDate()).padStart(2,"0")}-${String(d.getMonth()+1).padStart(2,"0")}-${d.getFullYear()}`;
    }
    window.open(url,"_blank","noopener,noreferrer");
  };

  const inp={padding:"12px 14px",borderRadius:12,fontSize:14,fontFamily:"'DM Sans',sans-serif",
    border:`1.5px solid ${T.accent}44`,outline:"none",color:"#fff",
    background:"rgba(255,255,255,0.07)",width:"100%",boxSizing:"border-box"};
  const dropStyle={position:"absolute",top:"100%",left:0,right:0,zIndex:200,
    background:"rgba(15,5,32,0.98)",borderRadius:10,boxShadow:"0 8px 28px rgba(0,0,0,0.5)",
    border:`1px solid ${T.accent}33`,maxHeight:220,overflowY:"auto",marginTop:2};

  return(
    <div style={{borderRadius:"0 0 20px 20px",padding:"clamp(18px,4vw,28px) clamp(16px,4vw,26px)",
      background:"rgba(15,5,32,0.7)",backdropFilter:"blur(20px)",
      border:`1px solid ${T.accent}33`,borderTop:"none",marginBottom:22,animation:"fadeUp 0.4s both"}}>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:22,color:"#fff",marginBottom:4}}>Find Trains</div>
      <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:`${T.accent}99`,marginBottom:18}}>
        Search trains — route pre-filled on IRCTC when you tap Search.
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:10,alignItems:"center",marginBottom:14}}>
        <div>
          <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,color:T.accent,marginBottom:6,letterSpacing:"0.08em"}}>FROM</div>
          <div style={{position:"relative"}}>
            <input value={fromQ} placeholder="Station or code..." onChange={e=>{setFromQ(e.target.value);setFromOpen(true);}} onFocus={e=>{e.target.select();setFromQ("");setFromOpen(true);}} onBlur={()=>setTimeout(()=>{setFromOpen(false);if(!fromQ.trim())setFromQ(from);},200)} style={inp}/>
            {fromOpen&&fromFiltered.length>0&&(<div style={dropStyle}>{fromFiltered.map(s=>(
              <div key={s.code} onMouseDown={()=>{setFrom(s.name);setFromQ(s.name);setFromOpen(false);}}
                style={{padding:"9px 14px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"background 0.1s"}}
                onMouseEnter={e=>e.currentTarget.style.background=T.accentSoft}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <span>{s.name}</span>
                <span style={{fontSize:10,color:T.accent,fontFamily:"'Space Mono',monospace",background:T.accentSoft,padding:"2px 6px",borderRadius:4}}>{s.code}</span>
              </div>
            ))}</div>)}
          </div>
        </div>
        <button onClick={()=>{const t=from;setFrom(to);setFromQ(to);setTo(t);setToQ(t);}}
          style={{width:40,height:40,borderRadius:"50%",background:T.accentSoft,border:`1.5px solid ${T.accent}55`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:18,color:T.accent,marginTop:18}}>⇄</button>
        <div>
          <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,color:T.accent,marginBottom:6,letterSpacing:"0.08em"}}>TO</div>
          <div style={{position:"relative"}}>
            <input value={toQ} placeholder="Station or code..." onChange={e=>{setToQ(e.target.value);setToOpen(true);}} onFocus={e=>{e.target.select();setToQ("");setToOpen(true);}} onBlur={()=>setTimeout(()=>{setToOpen(false);if(!toQ.trim())setToQ(to);},200)} style={inp}/>
            {toOpen&&toFiltered.length>0&&(<div style={dropStyle}>{toFiltered.map(s=>(
              <div key={s.code} onMouseDown={()=>{setTo(s.name);setToQ(s.name);setToOpen(false);}}
                style={{padding:"9px 14px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"background 0.1s"}}
                onMouseEnter={e=>e.currentTarget.style.background=T.accentSoft}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <span>{s.name}</span>
                <span style={{fontSize:10,color:T.accent,fontFamily:"'Space Mono',monospace",background:T.accentSoft,padding:"2px 6px",borderRadius:4}}>{s.code}</span>
              </div>
            ))}</div>)}
          </div>
        </div>
      </div>
      <div style={{marginBottom:16}}>
        <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,color:T.accent,marginBottom:6,letterSpacing:"0.08em"}}>JOURNEY DATE</div>
        <input type="date" value={date} min={today} onChange={e=>setDate(e.target.value)} style={inp}/>
      </div>
      <button onClick={search} style={{width:"100%",padding:"14px",borderRadius:13,fontSize:15,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.08em",color:"#0f0520",border:"none",cursor:"pointer",background:T.btnBg,backgroundSize:"200% 200%",animation:"gradShift 3s ease infinite",boxShadow:`0 6px 22px ${T.accent}44`,marginBottom:12}}>
        Search Trains on IRCTC 🚂
      </button>
      <div style={{textAlign:"center",fontFamily:"'DM Sans',sans-serif",fontSize:11,color:`${T.accent}66`}}>
        ✅ Route & date auto pre-filled on IRCTC
      </div>
    </div>
  );
}

function getFlightInsight(from, to, flights) {
  if (!flights || !flights.length) return null;
  const prices = flights.map(f=>f.price);
  const min=Math.min(...prices),max=Math.max(...prices);
  if (min!==max) return `💡 Fares range from ₹${min.toLocaleString()} to ₹${max.toLocaleString()}. Check live availability for latest prices.`;
  return `💡 Booking early usually gets better fares on this route.`;
}

function getBusInsight(buses) {
  if (!buses||!buses.length) return null;
  const night=buses.filter(b=>{const h=parseInt(b.dep.split(":")[0]);return h>=20||h<5;});
  if (night.length>0) return `💡 ${night.length} overnight option${night.length>1?"s":""} available — save on hotel by travelling overnight.`;
  return `💡 Multiple operators serve this route. Compare timing before booking.`;
}

// ═══════════════════════════════════════════════════════
//  SEARCH PAGE
// ═══════════════════════════════════════════════════════
function SearchPage() {
  const navigate = useNavigate();
  const [travelType,setTravelType]=useState("flight");
  const [prevType,setPrevType]=useState("flight");
  const [transitioning,setTransitioning]=useState(false);
  const [tripType,setTripType]=useState("oneway");
  const [fromCity,setFromCity]=useState(CITIES[0]);
  const [toCity,setToCity]=useState(CITIES[1]);
  const [busFrom,setBusFrom]=useState("Bangalore");
  const [busTo,setBusTo]=useState("Chennai");
  const [hotelCity,setHotelCity]=useState("Bangalore");
  const [date,setDate]=useState("");
  const [returnDate,setReturnDate]=useState("");
  const [checkOut,setCheckOut]=useState("");
  const [passengers,setPassengers]=useState(1);
  const [cabinClass,setCabinClass]=useState("Economy");
  const [busType,setBusType]=useState("Any");
  const [showFromModal,setShowFromModal]=useState(false);
  const [showToModal,setShowToModal]=useState(false);
  const [showBusFromModal,setShowBusFromModal]=useState(false);
  const [showBusToModal,setShowBusToModal]=useState(false);
  const [showHotelModal,setShowHotelModal]=useState(false);
  const [mode,setMode]=useState("structured");
  const [aiQuery,setAiQuery]=useState("");
  const [aiError,setAiError]=useState("");
  const [validErr,setValidErr]=useState("");
  const [loading,setLoading]=useState(false);
  const [searched,setSearched]=useState(false);
  const [flights,setFlights]=useState([]);
  const [buses,setBuses]=useState([]);
  const [filtered,setFiltered]=useState([]);
  const [flightInsight,setFlightInsight]=useState(null);
  const [busInsight,setBusInsight]=useState(null);
  const [filterTime,setFilterTime]=useState("any");
  const [filterMaxPrice,setFilterMaxPrice]=useState(20000);
  const [sortBy,setSortBy]=useState("price");
  const [navScrolled,setNavScrolled]=useState(false);
  const [specialFare,setSpecialFare]=useState("regular");

  const today = new Date().toISOString().split("T")[0];
  let user={}; try{user=JSON.parse(localStorage.getItem("user")||"{}"); }catch{}
  const token = localStorage.getItem("token");
  const T = TAB_THEMES[travelType] || TAB_THEMES.flight;

  useEffect(()=>{ if(!token) navigate("/login"); },[token,navigate]);
  useEffect(()=>{ fetch(`${API}/test`).catch(()=>{}); const t=setInterval(()=>fetch(`${API}/test`).catch(()=>{}),14*60*1000); return()=>clearInterval(t); },[]);
  useEffect(()=>{ const fn=()=>setNavScrolled(window.scrollY>30); window.addEventListener("scroll",fn,{passive:true}); return()=>window.removeEventListener("scroll",fn); },[]);

  useEffect(()=>{
    const items=travelType==="bus"?buses:flights;
    let r=[...items];
    if(travelType==="flight"){
      if(filterTime==="morning") r=r.filter(f=>{const h=new Date(f.departure_time).getHours();return h>=5&&h<12;});
      if(filterTime==="afternoon") r=r.filter(f=>{const h=new Date(f.departure_time).getHours();return h>=12&&h<17;});
      if(filterTime==="evening") r=r.filter(f=>{const h=new Date(f.departure_time).getHours();return h>=17;});
    }
    r=r.filter(f=>f.price<=filterMaxPrice);
    if(sortBy==="price") r.sort((a,b)=>a.price-b.price);
    if(sortBy==="price-desc") r.sort((a,b)=>b.price-a.price);
    if(sortBy==="departure"&&travelType==="flight") r.sort((a,b)=>new Date(a.departure_time)-new Date(b.departure_time));
    setFiltered(r);
  },[flights,buses,filterTime,filterMaxPrice,sortBy,travelType]);

  // Smooth tab transition
  const switchTab = useCallback((newTab) => {
    if (newTab === travelType) return;
    setTransitioning(true);
    setTimeout(() => {
      setTravelType(newTab);
      setFlights([]); setBuses([]); setSearched(false); setValidErr(""); setAiError("");
      setTimeout(() => setTransitioning(false), 50);
    }, 300);
  }, [travelType]);

  const swapFlight=useCallback(()=>{setFromCity(toCity);setToCity(fromCity);},[fromCity,toCity]);
  const swapBus=useCallback(()=>{setBusFrom(busTo);setBusTo(busFrom);},[busFrom,busTo]);

  const openFlightLink=useCallback((from,to,dt,pax)=>{
    const fc=CITY_TO_IATA[from.toLowerCase()]||from.toUpperCase().slice(0,3);
    const tc=CITY_TO_IATA[to.toLowerCase()]||to.toUpperCase().slice(0,3);
    window.open(flightLink(fc,tc,dt,pax),"_blank","noopener,noreferrer");
  },[]);

  const openBusLink=useCallback((from,to,dt)=>{
    track("bus_search",`${from} → ${to}`,"web");
    window.open(busLink(from,to,dt||date),"_blank","noopener,noreferrer");
  },[date]);

  const openHotelLink=useCallback((city,ci,co)=>{
    track("hotel_search",city,"web");
    window.open(hotelLink(city,ci||date,co||checkOut),"_blank","noopener,noreferrer");
  },[date,checkOut]);

  const handleFlightDeal=(fromName,toName)=>{
    track("view_deal",`${fromName} → ${toName}`,"web");
    openFlightLink(fromName,toName,date,passengers);
  };

  const searchFlights=async()=>{
    setValidErr(""); if(!date){setValidErr("Please select a departure date");return;}
    setLoading(true); setSearched(true); setFlights([]);
    try{
      const params=new URLSearchParams({from:fromCity.name,to:toCity.name,date});
      const res=await axios.get(`${API}/flights?${params}`);
      const data=res.data||[];
      if(!data.length){
        setFlights([{id:"aff",airline:"Multiple Airlines",from_city:fromCity.name,to_city:toCity.name,departure_time:null,arrival_time:null,price:0,affiliate:true}]);
      } else {
        setFlights(data);
        setFlightInsight(getFlightInsight(fromCity.name,toCity.name,data));
        setFilterMaxPrice(Math.max(...data.map(f=>f.price))+1000);
      }
    }catch{
      setFlights([{id:"aff",airline:"Multiple Airlines",from_city:fromCity.name,to_city:toCity.name,departure_time:null,arrival_time:null,price:0,affiliate:true}]);
    }
    setLoading(false);
  };

  const searchBuses=()=>{
    track("bus_search",`${busFrom} → ${busTo}`,"web");
    setValidErr(""); if(!date){setValidErr("Please select a travel date");return;}
    setLoading(true); setSearched(true); setBuses([]);
    setTimeout(()=>{
      let results=BUS_ROUTES.filter(b=>b.from.toLowerCase()===busFrom.toLowerCase()&&b.to.toLowerCase()===busTo.toLowerCase());
      if(busType!=="Any") results=results.filter(b=>b.type===busType);
      setBuses(results);
      setBusInsight(getBusInsight(results));
      setFilterMaxPrice(results.length>0?Math.max(...results.map(b=>b.price))+500:5000);
      setLoading(false);
    },700);
  };

  const searchAI=async()=>{
    if(!aiQuery.trim()) return;
    setAiError(""); setLoading(true); setSearched(true); setFlights([]); setBuses([]);
    const q=aiQuery.toLowerCase();
    const busKw=/\b(bus|buses|coach|sleeper|seater|ksrtc|msrtc|redbus)\b/i;
    const hotelKw=/\b(hotel|hotels|stay|rooms?|accommodation)\b/i;
    const flightKw=/\b(flight|fly|plane|airways|airlines)\b/i;
    let intent=travelType;
    if(busKw.test(q)) intent="bus";
    else if(hotelKw.test(q)) intent="hotel";
    else if(flightKw.test(q)) intent="flight";
    const parsed=parseQuery(aiQuery);
    if(parsed.pastDate){setAiError("That date is in the past! Please search for today or a future date.");setLoading(false);return;}
    if(intent==="hotel"){
      const city=parsed.singleCity||parsed.from||"";
      if(!city){setAiError("Couldn't detect city. Try: 'hotels in Goa'");setLoading(false);return;}
      openHotelLink(city.charAt(0).toUpperCase()+city.slice(1));
      setLoading(false); return;
    }
    if(intent==="bus"){
      if(!parsed.from||!parsed.to){setAiError("Couldn't find cities. Try: 'bus bangalore to chennai kal'");setLoading(false);return;}
      let results=BUS_ROUTES.filter(b=>b.from.toLowerCase()===parsed.from&&b.to.toLowerCase()===parsed.to);
      if(parsed.budget) results=results.filter(b=>b.price<=parsed.budget);
      if(/cheap|sasta|budget|lowest|kam/i.test(q)) results.sort((a,b)=>a.price-b.price);
      setBuses(results); setBusInsight(getBusInsight(results));
      setFilterMaxPrice(results.length>0?Math.max(...results.map(b=>b.price))+500:5000);
      if(!results.length) setAiError(`No buses found. Redirecting to RedBus…`);
      setLoading(false);
    } else {
      if(!parsed.from||!parsed.to){setAiError("Couldn't find cities. Try: 'flights bangalore to mumbai tomorrow'");setLoading(false);return;}
      try{
        const res=await axios.post(`${API}/ai-search`,{query:aiQuery});
        const data=(res.data&&!res.data.message)?res.data:[];
        const fin=parsed.budget?data.filter(f=>f.price<=parsed.budget):data;
        if(!fin.length){
          setFlights([{id:"aff",airline:"Multiple Airlines",from_city:parsed.from,to_city:parsed.to,departure_time:null,arrival_time:null,price:0,affiliate:true}]);
        } else {
          setFlights(fin);
          setFilterMaxPrice(Math.max(...fin.map(f=>f.price))+1000);
        }
      }catch{
        setFlights([{id:"aff",airline:"Multiple Airlines",from_city:parsed.from,to_city:parsed.to,departure_time:null,arrival_time:null,price:0,affiliate:true}]);
      }
      setLoading(false);
    }
  };

  const isDomestic=fromCity.country==="India"&&toCity.country==="India";
  const TRAVEL_TABS=[
    {id:"flight",icon:"✈️",label:"Flights"},
    {id:"bus",icon:"🚌",label:"Buses"},
    {id:"hotel",icon:"🏨",label:"Hotels"},
    {id:"train",icon:"🚂",label:"Trains"},
    {id:"cab",icon:"🚗",label:"Cabs",cs:true},
  ];
  const SPECIAL_FARES=[{id:"regular",label:"Regular"},{id:"student",label:"Student"},{id:"senior",label:"Senior Citizen"},{id:"armed",label:"Armed Forces"},{id:"doctor",label:"Doctor / Nurse"}];

  // Theme-aware input style
  const inp={background:"rgba(255,255,255,0.07)",borderRadius:12,padding:"12px 14px",border:`1.5px solid ${T.accent}44`,transition:"border-color 0.3s,background 0.3s",color:"#fff"};
  const lbl={fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,color:T.accent,display:"block",marginBottom:6,letterSpacing:"0.1em"};

  return(
    <div style={{minHeight:"100vh",position:"relative",overflowX:"hidden",fontFamily:"'DM Sans',sans-serif",color:"#fff"}}>
      <style>{SHARED_CSS}</style>

      {/* ── DYNAMIC ANIMATED BACKGROUND ── */}
      <DynamicBackground theme={T} transitioning={transitioning}/>

      {/* ── MODALS ── */}
      {showFromModal&&<CityModal title="Select departure city" onSelect={c=>{setFromCity(c);setShowFromModal(false);}} onClose={()=>setShowFromModal(false)} exclude={toCity.code} theme={T}/>}
      {showToModal&&<CityModal title="Select destination city" onSelect={c=>{setToCity(c);setShowToModal(false);}} onClose={()=>setShowToModal(false)} exclude={fromCity.code} theme={T}/>}
      {showBusFromModal&&<BusCityModal title="Bus departure city" onSelect={c=>{setBusFrom(c);setShowBusFromModal(false);}} onClose={()=>setShowBusFromModal(false)} exclude={busTo} theme={T}/>}
      {showBusToModal&&<BusCityModal title="Bus destination city" onSelect={c=>{setBusTo(c);setShowBusToModal(false);}} onClose={()=>setShowBusToModal(false)} exclude={busFrom} theme={T}/>}
      {showHotelModal&&<HotelCityModal title="Select hotel city" onSelect={c=>{setHotelCity(c);setShowHotelModal(false);}} onClose={()=>setShowHotelModal(false)} theme={T}/>}

      {/* ── NAV ── */}
      <nav style={{position:"sticky",top:0,zIndex:200,height:64,padding:"0 5%",display:"flex",alignItems:"center",justifyContent:"space-between",
        background:navScrolled?"rgba(0,0,0,0.8)":"transparent",
        backdropFilter:navScrolled?"blur(24px)":"none",
        borderBottom:navScrolled?`1px solid ${T.accent}22`:"none",transition:"all 0.4s ease"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>navigate("/")}>
          <div style={{animation:"floatUD 4s ease-in-out infinite"}}><AlvrynIcon size={38} accent={T.accent}/></div>
          <div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:16,color:"#fff",letterSpacing:"0.12em",lineHeight:1.1}}>ALVRYN</div>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:7,color:T.accent,letterSpacing:"0.18em"}}>TRAVEL BEYOND</div>
          </div>
        </div>
        <div className="nav-right-btns" style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <button onClick={()=>navigate("/ai")}
            style={{padding:"8px 16px",borderRadius:10,fontSize:13,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.04em",cursor:"pointer",background:`linear-gradient(135deg,${T.accent},${T.accent}cc)`,color:"#000",border:"none",boxShadow:`0 4px 12px ${T.accent}44`}}>
            🤖 AI Chat
          </button>
          <button className="hide-mobile" onClick={()=>navigate("/bookings")}
            style={{padding:"8px 14px",borderRadius:10,fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",background:"rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.8)",border:`1.5px solid rgba(255,255,255,0.15)`}}>
            My Bookings
          </button>
          <button onClick={()=>navigate("/profile")}
            style={{padding:"8px 14px",borderRadius:10,fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",background:T.accentSoft,color:T.accent,border:`1.5px solid ${T.accent}44`}}>
            Profile
          </button>
          <button onClick={()=>{localStorage.removeItem("token");localStorage.removeItem("user");navigate("/login");}}
            style={{padding:"8px 14px",borderRadius:10,fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",background:"rgba(239,68,68,0.1)",color:"#f87171",border:"1.5px solid rgba(239,68,68,0.25)"}}>
            Sign Out
          </button>
        </div>
      </nav>

      <div style={{position:"relative",zIndex:1,maxWidth:960,margin:"0 auto",padding:"clamp(16px,3vw,32px) 5% 80px"}}>

        {/* ── GREETING ── */}
        <div style={{marginBottom:28,animation:"fadeUp 0.6s both"}}>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:T.accent,letterSpacing:"0.2em",marginBottom:8}}>SEARCH TRAVEL</div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"clamp(24px,4vw,48px)",color:"#fff",marginBottom:6,textShadow:"0 2px 20px rgba(0,0,0,0.5)"}}>
            Hey {user.name?.split(" ")[0]||"Traveller"} 👋
          </h1>
          <p style={{fontSize:15,color:"rgba(255,255,255,0.65)",fontWeight:400}}>Where do you want to fly, ride or stay today?</p>
          {/* Tab tagline badge */}
          <div style={{display:"inline-flex",alignItems:"center",gap:8,marginTop:12,padding:"7px 18px",
            borderRadius:100,background:T.accentSoft,border:`1px solid ${T.accent}44`,
            boxShadow:`0 4px 16px ${T.accent}22`,
            opacity:transitioning?0:1,transform:transitioning?"translateY(-8px)":"translateY(0)",
            transition:"all 0.4s cubic-bezier(0.34,1.56,0.64,1)"}}>
            <span style={{fontSize:16}}>{T.icon}</span>
            <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:700,color:T.accent,letterSpacing:"0.04em"}}>{T.tagline}</span>
          </div>
        </div>

        {/* ── TRAVEL TABS ── */}
        <div style={{display:"flex",gap:0,borderRadius:"18px 18px 0 0",overflow:"hidden",
          background:"rgba(0,0,0,0.3)",backdropFilter:"blur(20px)",
          border:`1px solid rgba(255,255,255,0.08)`,borderBottom:"none",overflowX:"auto",
          scrollbarWidth:"none"}}>
          {TRAVEL_TABS.map((tab,i)=>{
            const isActive=travelType===tab.id;
            const tabT=TAB_THEMES[tab.id]||TAB_THEMES.flight;
            return(
              <button key={tab.id} onClick={()=>!tab.cs&&switchTab(tab.id)}
                style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,
                  padding:"14px clamp(10px,2.5vw,20px)",cursor:tab.cs?"default":"pointer",
                  border:"none",
                  borderBottom:isActive?`2.5px solid ${tabT.accent}`:"2.5px solid transparent",
                  background:isActive?`${tabT.accent}14`:"transparent",
                  color:isActive?tabT.accent:"rgba(255,255,255,0.45)",
                  fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:700,
                  transition:"all 0.3s cubic-bezier(0.4,0,0.2,1)",
                  whiteSpace:"nowrap",minWidth:0,
                  borderRadius:i===0?"18px 0 0 0":i===TRAVEL_TABS.length-1?"0 18px 0 0":"0",
                  textShadow:isActive?`0 0 20px ${tabT.accent}66`:"none"}}>
                <span style={{fontSize:22,transition:"transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",transform:isActive?"scale(1.25)":"scale(1)"}}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                {tab.cs&&<span style={{fontSize:7,background:`${tabT.accent}22`,border:`1px solid ${tabT.accent}44`,color:tabT.accent,padding:"1px 4px",borderRadius:5}}>SOON</span>}
              </button>
            );
          })}
        </div>

        {/* ── CAB COMING SOON ── */}
        {travelType==="cab"&&(
          <div style={{background:"rgba(0,0,0,0.5)",backdropFilter:"blur(20px)",borderRadius:"0 0 20px 20px",padding:"52px 32px",textAlign:"center",border:`1px solid ${T.accent}22`,borderTop:"none",animation:"fadeUp 0.4s both"}}>
            <div style={{fontSize:56,marginBottom:18}}>🚗</div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:24,color:"#fff",marginBottom:10}}>Cab Booking — Coming Soon</h2>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"rgba(255,255,255,0.55)",lineHeight:1.7,maxWidth:400,margin:"0 auto"}}>Airport transfers and intercity cabs. We're working on it!</p>
          </div>
        )}

        {/* ── TRAIN PANEL ── */}
        {travelType==="train"&&<TrainPanel theme={T}/>}

        {/* ── SEARCH PANEL ── */}
        {travelType!=="cab"&&travelType!=="train"&&(
          <div style={{background:"rgba(0,0,0,0.45)",backdropFilter:"blur(24px)",borderRadius:"0 0 20px 20px",
            padding:"24px clamp(14px,4vw,28px)",
            border:`1px solid ${T.accent}22`,borderTop:"none",marginBottom:24,
            opacity:transitioning?0:1,transform:transitioning?"translateY(10px)":"translateY(0)",
            transition:"opacity 0.4s ease,transform 0.4s ease,border-color 0.6s ease"}}>

            {/* Mode toggle */}
            <div style={{display:"flex",gap:0,background:"rgba(255,255,255,0.06)",borderRadius:10,padding:3,marginBottom:20,width:"fit-content"}}>
              {[["structured","Manual Search"],["ai","🤖 AI Search"]].map(([id,label])=>(
                <button key={id} onClick={()=>{setMode(id);setFlights([]);setBuses([]);setSearched(false);setAiError("");setValidErr("");}}
                  style={{padding:"8px 20px",border:"none",borderRadius:8,fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,cursor:"pointer",transition:"all 0.2s",
                    background:mode===id?T.accentSoft:"transparent",
                    color:mode===id?T.accent:"rgba(255,255,255,0.5)",
                    boxShadow:mode===id?`0 2px 8px ${T.accent}33`:"none"}}>
                  {label}
                </button>
              ))}
            </div>

            {/* ── FLIGHT STRUCTURED ── */}
            {travelType==="flight"&&mode==="structured"&&(
              <>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:8}}>
                  <div style={{display:"flex",gap:0,background:"rgba(255,255,255,0.06)",borderRadius:10,padding:3}}>
                    {["oneway","roundtrip"].map(t=>(
                      <button key={t} onClick={()=>setTripType(t)} style={{padding:"7px 16px",border:"none",borderRadius:8,fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,cursor:"pointer",transition:"all 0.2s",background:tripType===t?T.accentSoft:"transparent",color:tripType===t?T.accent:"rgba(255,255,255,0.5)",boxShadow:tripType===t?`0 2px 6px ${T.accent}33`:"none"}}>
                        {t==="oneway"?"One Way":"Round Trip"}
                      </button>
                    ))}
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:8,background:T.accentSoft,border:`1px solid ${T.accent}44`}}>
                    <span>{isDomestic?"🇮🇳":"🌍"}</span>
                    <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,color:T.accent}}>{isDomestic?"Domestic":"International"}</span>
                  </div>
                </div>
                <div className="search-city-grid" style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:10,alignItems:"center",marginBottom:14}}>
                  {[{label:"FROM",city:fromCity,onClick:()=>setShowFromModal(true)},null,{label:"TO",city:toCity,onClick:()=>setShowToModal(true)}].map((item,i)=>item===null?(
                    <button key="swap" onClick={swapFlight} style={{width:40,height:40,borderRadius:"50%",background:T.accentSoft,border:`1.5px solid ${T.accent}55`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:18,color:T.accent,transition:"transform 0.3s",justifySelf:"center"}}
                      onMouseEnter={e=>e.currentTarget.style.transform="rotate(180deg)"}
                      onMouseLeave={e=>e.currentTarget.style.transform="rotate(0)"}>⇄</button>
                  ):(
                    <div key={item.label} onClick={item.onClick} style={{...inp,cursor:"pointer",borderRadius:14}}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accent;e.currentTarget.style.background="rgba(255,255,255,0.1)";}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor=`${T.accent}44`;e.currentTarget.style.background="rgba(255,255,255,0.07)";}}>
                      <div style={{...lbl,marginBottom:4}}>{item.label}</div>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:30,color:"#fff",textShadow:`0 2px 12px ${T.accent}44`}}>{item.city.code}</div>
                      <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"rgba(255,255,255,0.6)",marginTop:2}}>{item.city.name}</div>
                    </div>
                  ))}
                </div>
                <div className="search-date-grid" style={{display:"grid",gridTemplateColumns:tripType==="roundtrip"?"1fr 1fr 1fr 1fr":"1fr 1fr 1fr",gap:10,marginBottom:14}}>
                  <div style={{...inp,borderColor:!date&&validErr?"#ef4444":`${T.accent}44`,borderRadius:12}}>
                    <label style={lbl}>DEPARTURE{!date&&<span style={{color:"#ef4444"}}> *</span>}</label>
                    <input type="date" value={date} min={today} onChange={e=>{setDate(e.target.value);setValidErr("");}} style={{background:"transparent",border:"none",outline:"none",fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:600,color:"#fff",width:"100%",cursor:"pointer",colorScheme:"dark"}}/>
                    {date&&<div style={{fontSize:12,color:T.accent,marginTop:2}}>{new Date(date).toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"})}</div>}
                  </div>
                  {tripType==="roundtrip"&&(
                    <div style={{...inp,borderRadius:12}}>
                      <label style={lbl}>RETURN</label>
                      <input type="date" value={returnDate} min={date||today} onChange={e=>setReturnDate(e.target.value)} style={{background:"transparent",border:"none",outline:"none",fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:600,color:"#fff",width:"100%",cursor:"pointer",colorScheme:"dark"}}/>
                    </div>
                  )}
                  <div style={{...inp,borderRadius:12}}>
                    <label style={lbl}>TRAVELLERS</label>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <button onClick={()=>setPassengers(p=>Math.max(1,p-1))} style={{width:28,height:28,borderRadius:"50%",background:T.accentSoft,border:`1px solid ${T.accent}55`,color:T.accent,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>-</button>
                      <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:22,color:"#fff",minWidth:20,textAlign:"center"}}>{passengers}</span>
                      <button onClick={()=>setPassengers(p=>Math.min(9,p+1))} style={{width:28,height:28,borderRadius:"50%",background:T.accentSoft,border:`1px solid ${T.accent}55`,color:T.accent,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>+</button>
                    </div>
                  </div>
                  <div style={{...inp,borderRadius:12}}>
                    <label style={lbl}>CLASS</label>
                    <select value={cabinClass} onChange={e=>setCabinClass(e.target.value)} style={{background:"transparent",border:"none",outline:"none",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,color:"#fff",width:"100%",cursor:"pointer",colorScheme:"dark"}}>{CLASSES.map(c=><option key={c} style={{background:"#1a1a2e"}}>{c}</option>)}</select>
                  </div>
                </div>
                <div style={{marginBottom:14}}>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,color:T.accent,letterSpacing:"0.08em",marginBottom:8}}>SPECIAL FARES</div>
                  <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                    {SPECIAL_FARES.map(sf=>(
                      <button key={sf.id} onClick={()=>setSpecialFare(sf.id)} style={{padding:"6px 13px",borderRadius:9,fontSize:12,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",border:specialFare===sf.id?`1.5px solid ${T.accent}`:` 1.5px solid rgba(255,255,255,0.15)`,background:specialFare===sf.id?T.accentSoft:"rgba(255,255,255,0.05)",color:specialFare===sf.id?T.accent:"rgba(255,255,255,0.6)",transition:"all 0.2s"}}>{sf.label}</button>
                    ))}
                  </div>
                </div>
                {validErr&&<div style={{padding:"10px 14px",borderRadius:10,background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.35)",fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#f87171",marginBottom:12}}>{validErr}</div>}
                <button onClick={searchFlights}
                  style={{width:"100%",padding:"15px",borderRadius:14,fontSize:15,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.08em",color:"#0a1628",border:"none",cursor:"pointer",background:T.btnBg,backgroundSize:"200% 200%",animation:"gradShift 4s ease infinite",boxShadow:`0 8px 28px ${T.accent}44`,transition:"transform 0.2s"}}
                  onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>Search Flights ✈</button>
              </>
            )}

            {/* ── BUS STRUCTURED ── */}
            {travelType==="bus"&&mode==="structured"&&(
              <>
                <div className="search-city-grid" style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:10,alignItems:"center",marginBottom:14}}>
                  {[{label:"FROM",city:busFrom,onClick:()=>setShowBusFromModal(true)},null,{label:"TO",city:busTo,onClick:()=>setShowBusToModal(true)}].map((item,i)=>item===null?(
                    <button key="swap" onClick={swapBus} style={{width:40,height:40,borderRadius:"50%",background:T.accentSoft,border:`1.5px solid ${T.accent}55`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:18,color:T.accent,transition:"transform 0.3s",justifySelf:"center"}}
                      onMouseEnter={e=>e.currentTarget.style.transform="rotate(180deg)"}
                      onMouseLeave={e=>e.currentTarget.style.transform="rotate(0)"}>⇄</button>
                  ):(
                    <div key={item.label} onClick={item.onClick} style={{...inp,cursor:"pointer",borderRadius:14}}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accent;e.currentTarget.style.background="rgba(255,255,255,0.1)";}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor=`${T.accent}44`;e.currentTarget.style.background="rgba(255,255,255,0.07)";}}>
                      <div style={{...lbl,marginBottom:4}}>{item.label}</div>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:22,color:"#fff"}}>🚌 {item.city}</div>
                    </div>
                  ))}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
                  <div style={{...inp,borderColor:!date&&validErr?"#ef4444":`${T.accent}44`,borderRadius:12}}>
                    <label style={lbl}>TRAVEL DATE{!date&&<span style={{color:"#ef4444"}}> *</span>}</label>
                    <input type="date" value={date} min={today} onChange={e=>{setDate(e.target.value);setValidErr("");}} style={{background:"transparent",border:"none",outline:"none",fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:600,color:"#fff",width:"100%",cursor:"pointer",colorScheme:"dark"}}/>
                    {date&&<div style={{fontSize:12,color:T.accent,marginTop:2}}>{new Date(date).toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"})}</div>}
                  </div>
                  <div style={{...inp,borderRadius:12}}>
                    <label style={lbl}>PASSENGERS</label>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <button onClick={()=>setPassengers(p=>Math.max(1,p-1))} style={{width:28,height:28,borderRadius:"50%",background:T.accentSoft,border:`1px solid ${T.accent}55`,color:T.accent,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>-</button>
                      <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:22,color:"#fff",minWidth:20,textAlign:"center"}}>{passengers}</span>
                      <button onClick={()=>setPassengers(p=>Math.min(6,p+1))} style={{width:28,height:28,borderRadius:"50%",background:T.accentSoft,border:`1px solid ${T.accent}55`,color:T.accent,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>+</button>
                    </div>
                  </div>
                  <div style={{...inp,borderRadius:12}}>
                    <label style={lbl}>BUS TYPE</label>
                    <select value={busType} onChange={e=>setBusType(e.target.value)} style={{background:"transparent",border:"none",outline:"none",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,color:"#fff",width:"100%",cursor:"pointer",colorScheme:"dark"}}>{BUS_TYPES.map(t=><option key={t} style={{background:"#042308"}}>{t}</option>)}</select>
                  </div>
                </div>
                {validErr&&<div style={{padding:"10px 14px",borderRadius:10,background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.35)",fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#f87171",marginBottom:12}}>{validErr}</div>}
                <button onClick={searchBuses}
                  style={{width:"100%",padding:"15px",borderRadius:14,fontSize:15,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.08em",color:"#042308",border:"none",cursor:"pointer",background:T.btnBg,backgroundSize:"200% 200%",animation:"gradShift 4s ease infinite",boxShadow:`0 8px 28px ${T.accent}44`,transition:"transform 0.2s"}}
                  onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>Search Buses 🚌</button>
              </>
            )}

            {/* ── HOTEL STRUCTURED ── */}
            {travelType==="hotel"&&mode==="structured"&&(
              <>
                <div style={{marginBottom:16}}>
                  <div style={lbl}>DESTINATION</div>
                  <div onClick={()=>setShowHotelModal(true)} style={{...inp,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",borderRadius:14}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accent;e.currentTarget.style.background="rgba(255,255,255,0.1)";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=`${T.accent}44`;e.currentTarget.style.background="rgba(255,255,255,0.07)";}}>
                    <div>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:22,color:"#fff"}}>🏨 {hotelCity}</div>
                      <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"rgba(255,255,255,0.5)",marginTop:2}}>Tap to change city</div>
                    </div>
                    <span style={{color:T.accent,fontSize:18}}>›</span>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                  <div style={{...inp,borderColor:!date&&validErr?"#ef4444":`${T.accent}44`,borderRadius:12}}>
                    <label style={lbl}>CHECK-IN{!date&&<span style={{color:"#ef4444"}}> *</span>}</label>
                    <input type="date" value={date} min={today} onChange={e=>{setDate(e.target.value);setValidErr("");}} style={{background:"transparent",border:"none",outline:"none",fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:600,color:"#fff",width:"100%",cursor:"pointer",colorScheme:"dark"}}/>
                  </div>
                  <div style={{...inp,borderRadius:12}}>
                    <label style={lbl}>CHECK-OUT</label>
                    <input type="date" value={checkOut} min={date||today} onChange={e=>setCheckOut(e.target.value)} style={{background:"transparent",border:"none",outline:"none",fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:600,color:"#fff",width:"100%",cursor:"pointer",colorScheme:"dark"}}/>
                  </div>
                </div>
                {validErr&&<div style={{padding:"10px 14px",borderRadius:10,background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.35)",fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#f87171",marginBottom:12}}>{validErr}</div>}
                <button onClick={()=>{setValidErr("");if(!date){setValidErr("Please select a check-in date");return;}openHotelLink(hotelCity);}}
                  style={{width:"100%",padding:"15px",borderRadius:14,fontSize:15,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.08em",color:"#1a0a00",border:"none",cursor:"pointer",background:T.btnBg,backgroundSize:"200% 200%",animation:"gradShift 4s ease infinite",boxShadow:`0 8px 28px ${T.accent}44`,transition:"transform 0.2s"}}
                  onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>Search Hotels on Booking.com 🏨</button>
                <div style={{textAlign:"center",marginTop:10,fontFamily:"'DM Sans',sans-serif",fontSize:12,color:`${T.accent}88`}}>You'll be redirected to Booking.com — best prices guaranteed</div>
              </>
            )}

            {/* ── AI MODE ── */}
            {mode==="ai"&&(
              <div>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"rgba(255,255,255,0.6)",marginBottom:12,lineHeight:1.6}}>
                  Type in any language — English, Hindi, Tamil, Kannada, Telugu. Typos are fine 😄
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:14}}>
                  {[
                    travelType==="hotel"&&"hotel in goa",
                    travelType==="hotel"&&"hotels bangalore",
                    travelType==="bus"&&"bus bangalore to chennai kal",
                    travelType==="bus"&&"bus blr to hyd raat",
                    travelType==="flight"&&"flights frm bangaluru to mumbai kal",
                    travelType==="flight"&&"blr to del friday sasta flight",
                    travelType==="flight"&&"flight bangalore to dubai tomorrow",
                    travelType==="flight"&&"mumbai to delhi kal subah",
                  ].filter(Boolean).map(ex=>(
                    <button key={ex} onClick={()=>setAiQuery(ex)} style={{padding:"6px 13px",borderRadius:100,fontSize:12,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",background:T.accentSoft,border:`1px solid ${T.accent}44`,color:T.accent,fontWeight:500,transition:"all 0.15s"}}
                      onMouseEnter={e=>e.currentTarget.style.background=`${T.accent}25`}
                      onMouseLeave={e=>e.currentTarget.style.background=T.accentSoft}>{ex}</button>
                  ))}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:12,background:"rgba(255,255,255,0.06)",borderRadius:14,padding:"4px 4px 4px 18px",border:`1.5px solid ${T.accent}44`,marginBottom:8}}>
                  <span style={{fontSize:18,opacity:0.7}}>🤖</span>
                  <input value={aiQuery} onChange={e=>{setAiQuery(e.target.value);setAiError("");}} onKeyDown={e=>e.key==="Enter"&&searchAI()}
                    placeholder={travelType==="hotel"?"e.g. hotels in Goa, best hotels Mumbai under 2000":travelType==="bus"?"e.g. bus Bangalore to Chennai tomorrow night":"e.g. cheap flights BLR to GOA this weekend"}
                    style={{flex:1,background:"transparent",border:"none",outline:"none",fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#fff",padding:"12px 0"}}/>
                </div>
                {aiError&&<div style={{padding:"10px 14px",borderRadius:10,background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.35)",fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#f87171",marginBottom:8}}>{aiError}</div>}
                <button onClick={searchAI}
                  style={{width:"100%",padding:"15px",borderRadius:14,fontSize:15,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.08em",color:"#0a1628",border:"none",cursor:"pointer",background:T.btnBg,backgroundSize:"200% 200%",animation:"gradShift 4s ease infinite",boxShadow:`0 8px 28px ${T.accent}44`,transition:"transform 0.2s"}}
                  onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>Search with AI 🤖</button>
              </div>
            )}
          </div>
        )}

        {/* ── LOADING ── */}
        {loading&&(
          <div style={{textAlign:"center",padding:"60px 0",animation:"fadeUp 0.4s both"}}>
            <div style={{width:48,height:48,border:`3px solid ${T.accent}33`,borderTopColor:T.accent,borderRadius:"50%",animation:"spinSlow 1s linear infinite",margin:"0 auto 16px"}}/>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:17,color:T.accent}}>
              {travelType==="bus"?"Scanning bus routes…":travelType==="hotel"?"Finding hotels…":"Scanning flight paths…"}
            </div>
          </div>
        )}

        {/* ── FILTERS ── */}
        {!loading&&filtered.length>0&&travelType!=="hotel"&&(
          <div style={{background:"rgba(0,0,0,0.4)",backdropFilter:"blur(16px)",borderRadius:16,padding:"18px 20px",border:`1px solid ${T.accent}22`,marginBottom:18,animation:"fadeUp 0.4s both"}}>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:T.accent,letterSpacing:"0.15em",marginBottom:12,fontWeight:700}}>FILTER & SORT</div>
            <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:10}}>
              {travelType==="flight"&&[["any","All times"],["morning","Morning"],["afternoon","Afternoon"],["evening","Evening"]].map(([v,l])=>(
                <button key={v} onClick={()=>setFilterTime(v)} style={{padding:"6px 14px",borderRadius:100,fontSize:12,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",border:filterTime===v?`1.5px solid ${T.accent}`:"1.5px solid rgba(255,255,255,0.2)",background:filterTime===v?T.accentSoft:"rgba(255,255,255,0.06)",color:filterTime===v?T.accent:"rgba(255,255,255,0.6)"}}>{l}</button>
              ))}
              {[["price","Cheapest"],["price-desc","Priciest"],["departure","Earliest"]].map(([v,l])=>(
                <button key={v} onClick={()=>setSortBy(v)} style={{padding:"6px 14px",borderRadius:100,fontSize:12,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",border:sortBy===v?`1.5px solid ${T.accent}`:"1.5px solid rgba(255,255,255,0.2)",background:sortBy===v?T.accentSoft:"rgba(255,255,255,0.06)",color:sortBy===v?T.accent:"rgba(255,255,255,0.6)"}}>{l}</button>
              ))}
            </div>
            <input type="range" min="100" max={filterMaxPrice+500} step="100" value={filterMaxPrice} onChange={e=>setFilterMaxPrice(Number(e.target.value))} style={{width:"100%",accentColor:T.accent}}/>
            <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Space Mono',monospace",fontSize:11,color:`${T.accent}88`,marginTop:6}}>
              <span>Min</span><span style={{color:T.accent}}>Max ₹{filterMaxPrice.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* ── RESULTS ── */}
        {!loading&&searched&&(
          <>
            {filtered.length>0&&(
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:T.accent,letterSpacing:"0.15em",marginBottom:10,fontWeight:700}}>
                {travelType==="bus"?`${filtered.length} BUSES FOUND`:travelType==="flight"&&!filtered[0]?.affiliate?`${filtered.length} FLIGHTS FOUND`:""}
              </div>
            )}
            {(flightInsight||busInsight)&&(
              <div style={{marginBottom:14,padding:"12px 18px",background:`${T.accent}11`,borderRadius:12,border:`1px solid ${T.accent}33`,animation:"fadeUp 0.4s both"}}>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:T.accent,lineHeight:1.6}}>{travelType==="bus"?busInsight:flightInsight}</div>
              </div>
            )}
            <div style={{display:"flex",flexDirection:"column",gap:14}}>

              {/* Flight results */}
              {travelType==="flight"&&filtered.map((flight,i)=>(
                <div key={flight.id||i}
                  style={{background:"rgba(0,0,0,0.5)",backdropFilter:"blur(16px)",borderRadius:18,padding:"22px",
                    border:`1px solid ${T.accent}22`,animation:`fadeUp 0.4s ${i*60}ms both`,transition:"all 0.2s",
                    boxShadow:`0 4px 20px rgba(0,0,0,0.3)`}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=`${T.accent}55`;e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 8px 32px ${T.accent}22`;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=`${T.accent}22`;e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.3)";}}>
                  {flight.affiliate?(
                    <div style={{textAlign:"center",padding:"10px 0"}}>
                      <div style={{fontSize:44,marginBottom:14}}>✈️</div>
                      <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:22,color:"#fff",marginBottom:8}}>
                        {flight.from_city?.charAt(0).toUpperCase()+flight.from_city?.slice(1)} → {flight.to_city?.charAt(0).toUpperCase()+flight.to_city?.slice(1)}
                      </h3>
                      <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"rgba(255,255,255,0.55)",marginBottom:20}}>Live fares from 700+ airlines — best prices guaranteed</p>
                      <button onClick={()=>handleFlightDeal(flight.from_city,flight.to_city)}
                        style={{padding:"14px 36px",borderRadius:14,fontSize:16,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.06em",color:"#0a1628",border:"none",cursor:"pointer",background:T.btnBg,backgroundSize:"200% 200%",animation:"gradShift 3s ease infinite",boxShadow:`0 6px 20px ${T.accent}44`}}>
                        Check Live Prices →
                      </button>
                      <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"rgba(255,255,255,0.25)",marginTop:12}}>Prices on partner site · may vary</div>
                    </div>
                  ):(
                    <>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <div style={{width:8,height:8,borderRadius:"50%",background:T.accent,boxShadow:`0 0 8px ${T.accent}`}}/>
                          <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:16,color:"#fff"}}>{flight.airline}</span>
                          <span style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:"rgba(255,255,255,0.4)"}}>{flight.flight_no}</span>
                        </div>
                        <div style={{display:"flex",gap:7}}>
                          {isDomestic&&<span style={{padding:"3px 9px",borderRadius:20,fontSize:10,background:T.accentSoft,border:`1px solid ${T.accent}55`,color:T.accent,fontFamily:"'Space Mono',monospace",fontWeight:600}}>Seats ✓</span>}
                          <span style={{padding:"3px 9px",borderRadius:20,fontSize:10,background:"rgba(22,163,74,0.12)",border:"1px solid rgba(22,163,74,0.3)",color:"#4ade80",fontFamily:"'Space Mono',monospace",fontWeight:600}}>Non-stop</span>
                        </div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
                        <div style={{textAlign:"center"}}>
                          <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:30,color:"#fff"}}>{fmtTime(flight.departure_time)}</div>
                          <div style={{fontFamily:"'Space Mono',monospace",fontSize:12,color:"rgba(255,255,255,0.45)",marginTop:2,fontWeight:600}}>{flight.from_city?.slice(0,3).toUpperCase()}</div>
                          <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",fontWeight:500}}>{fmtDate(flight.departure_time)}</div>
                        </div>
                        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"0 16px"}}>
                          <span style={{fontSize:12,color:"rgba(255,255,255,0.45)",fontFamily:"'DM Sans',sans-serif"}}>{calcDur(flight.departure_time,flight.arrival_time)}</span>
                          <div style={{width:"100%",display:"flex",alignItems:"center",gap:4}}>
                            <div style={{flex:1,height:1,background:`linear-gradient(90deg,${T.accent}44,${T.accent}cc,${T.accent}44)`}}/>
                            <span style={{fontSize:16,color:T.accent}}>✈</span>
                            <div style={{flex:1,height:1,background:`linear-gradient(90deg,${T.accent}cc,${T.accent}44)`}}/>
                          </div>
                          <span style={{fontSize:12,color:"#4ade80",fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>Direct</span>
                        </div>
                        <div style={{textAlign:"center"}}>
                          <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:30,color:"#fff"}}>{fmtTime(flight.arrival_time)}</div>
                          <div style={{fontFamily:"'Space Mono',monospace",fontSize:12,color:"rgba(255,255,255,0.45)",marginTop:2,fontWeight:600}}>{flight.to_city?.slice(0,3).toUpperCase()}</div>
                          <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",fontWeight:500}}>{fmtDate(flight.arrival_time)}</div>
                        </div>
                      </div>
                      <div className="results-card-bottom" style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:16,borderTop:`1px solid ${T.accent}22`}}>
                        <div>
                          <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:"rgba(255,255,255,0.35)",letterSpacing:"0.1em",fontWeight:600}}>APPROX FROM</div>
                          <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:32,color:T.accent}}>{`₹${(flight.price*passengers).toLocaleString()}`}</div>
                          <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",fontFamily:"'DM Sans',sans-serif"}}>{passengers} pax · {cabinClass}</div>
                        </div>
                        <button onClick={()=>handleFlightDeal(flight.from_city,flight.to_city)}
                          style={{padding:"13px 28px",borderRadius:13,fontSize:14,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.06em",color:"#0a1628",border:"none",cursor:"pointer",background:T.btnBg,backgroundSize:"200% 200%",animation:"gradShift 3s ease infinite",boxShadow:`0 6px 20px ${T.accent}44`,transition:"transform 0.2s"}}
                          onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                          onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>Check Live Prices →</button>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {/* Bus results */}
              {travelType==="bus"&&filtered.length===0&&searched&&!loading&&(
                <div style={{background:"rgba(0,0,0,0.5)",backdropFilter:"blur(16px)",borderRadius:18,padding:"32px",border:`1px solid ${T.accent}22`,textAlign:"center",animation:"fadeUp 0.4s both"}}>
                  <div style={{fontSize:48,marginBottom:14}}>🚌</div>
                  <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:20,color:"#fff",marginBottom:8}}>More options on RedBus</h3>
                  <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"rgba(255,255,255,0.5)",marginBottom:18}}>Check full schedule and live seat availability for {busFrom} → {busTo}</p>
                  <button onClick={()=>openBusLink(busFrom,busTo)}
                    style={{padding:"13px 32px",borderRadius:13,fontSize:15,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.08em",color:"#042308",border:"none",cursor:"pointer",background:T.btnBg,backgroundSize:"200% 200%",animation:"gradShift 3s ease infinite",boxShadow:`0 6px 20px ${T.accent}44`}}>
                    View on RedBus →
                  </button>
                </div>
              )}

              {travelType==="bus"&&filtered.map((bus,i)=>(
                <div key={i}
                  style={{background:"rgba(0,0,0,0.5)",backdropFilter:"blur(16px)",borderRadius:18,padding:"22px",
                    border:`1px solid ${T.accent}22`,animation:`fadeUp 0.4s ${i*60}ms both`,transition:"all 0.2s",
                    boxShadow:"0 4px 20px rgba(0,0,0,0.3)"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=`${T.accent}55`;e.currentTarget.style.transform="translateY(-2px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=`${T.accent}22`;e.currentTarget.style.transform="translateY(0)";}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:T.accent,boxShadow:`0 0 8px ${T.accent}`}}/>
                      <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:16,color:"#fff"}}>{bus.op}</span>
                    </div>
                    <div style={{display:"flex",gap:7}}>
                      <span style={{padding:"3px 9px",borderRadius:20,fontSize:10,background:T.accentSoft,border:`1px solid ${T.accent}55`,color:T.accent,fontFamily:"'Space Mono',monospace",fontWeight:600}}>Seats ✓</span>
                      <span style={{padding:"3px 9px",borderRadius:20,fontSize:10,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.6)",fontFamily:"'Space Mono',monospace",fontWeight:600}}>{bus.type}</span>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:28,color:"#fff"}}>{bus.dep}</div>
                      <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"rgba(255,255,255,0.5)",marginTop:2}}>{bus.from}</div>
                    </div>
                    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"0 16px"}}>
                      <span style={{fontSize:12,color:"rgba(255,255,255,0.45)",fontFamily:"'DM Sans',sans-serif"}}>{bus.dur}</span>
                      <div style={{width:"100%",display:"flex",alignItems:"center",gap:4}}>
                        <div style={{flex:1,height:1,background:`linear-gradient(90deg,${T.accent}44,${T.accent}cc,${T.accent}44)`}}/>
                        <span style={{fontSize:18}}>🚌</span>
                        <div style={{flex:1,height:1,background:`linear-gradient(90deg,${T.accent}cc,${T.accent}44)`}}/>
                      </div>
                      <span style={{fontSize:12,color:"#4ade80",fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>Direct</span>
                    </div>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:28,color:"#fff"}}>{bus.arr}</div>
                      <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"rgba(255,255,255,0.5)",marginTop:2}}>{bus.to}</div>
                    </div>
                  </div>
                  <div className="results-card-bottom" style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:14,borderTop:`1px solid ${T.accent}22`}}>
                    <div>
                      <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:"rgba(255,255,255,0.35)",letterSpacing:"0.1em",fontWeight:600}}>APPROX FROM</div>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:30,color:T.accent}}>₹{(bus.price*passengers).toLocaleString()}</div>
                      <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",fontFamily:"'DM Sans',sans-serif"}}>{passengers} pax</div>
                    </div>
                    <button onClick={()=>openBusLink(bus.from,bus.to)}
                      style={{padding:"13px 28px",borderRadius:13,fontSize:14,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.06em",color:"#042308",border:"none",cursor:"pointer",background:T.btnBg,backgroundSize:"200% 200%",animation:"gradShift 3s ease infinite",boxShadow:`0 6px 20px ${T.accent}44`,transition:"transform 0.2s"}}
                      onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                      onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>Check Live Prices →</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty state */}
        {!loading&&!searched&&(
          <div style={{textAlign:"center",padding:"80px 20px",animation:"fadeUp 0.5s both"}}>
            <div style={{fontSize:72,marginBottom:20,animation:"floatUD 3s ease-in-out infinite",filter:`drop-shadow(0 0 30px ${T.accent}55)`}}>
              {T.icon}
            </div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:300,fontSize:28,color:"#fff",marginBottom:8,textShadow:"0 2px 20px rgba(0,0,0,0.5)"}}>Your journey starts here</div>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"rgba(255,255,255,0.45)",marginTop:8}}>Search above or use AI search in any language</div>
          </div>
        )}
      </div>

      {/* Affiliate disclosure */}
      <div style={{position:"relative",zIndex:1,textAlign:"center",padding:"16px 5%",borderTop:`1px solid rgba(255,255,255,0.06)`,fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"rgba(255,255,255,0.2)"}}>
        Alvryn is a travel discovery platform. We may earn a commission from partner links at no extra cost to you.
      </div>
    </div>
  );
}

function App() {
  useEffect(()=>{
    fetch(`${API}/test`).catch(()=>{});
    const t=setInterval(()=>fetch(`${API}/test`).catch(()=>{}),14*60*1000);
    return()=>clearInterval(t);
  },[]);
  return(
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/search" element={<SearchPage/>}/>
        <Route path="/bookings" element={<MyBookings/>}/>
        <Route path="/profile" element={<UserProfile/>}/>
        <Route path="/admin" element={<AdminDashboard/>}/>
        <Route path="/ai" element={<AIChatPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;