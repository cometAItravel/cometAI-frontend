/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://cometai-backend.onrender.com";

// ── IATA map ──────────────────────────────────────────────────────────────────
const IATA = {
  "bangalore":"BLR","bengaluru":"BLR","mumbai":"BOM","bombay":"BOM",
  "delhi":"DEL","new delhi":"DEL","chennai":"MAA","madras":"MAA",
  "hyderabad":"HYD","kolkata":"CCU","goa":"GOI","pune":"PNQ",
  "kochi":"COK","cochin":"COK","ahmedabad":"AMD","jaipur":"JAI",
  "lucknow":"LKO","varanasi":"VNS","trivandrum":"TRV","coimbatore":"CBE",
  "dubai":"DXB","singapore":"SIN","bangkok":"BKK","london":"LHR",
  "new york":"JFK","paris":"CDG","tokyo":"NRT","sydney":"SYD","bali":"DPS",
};
const INDIA_CODES = new Set(["BLR","BOM","DEL","MAA","HYD","CCU","GOI","PNQ","COK","AMD","JAI","LKO","VNS","TRV","CBE"]);

function flink(from, to, ddmm, pax = 1) {
  const fc = IATA[from?.toLowerCase()] || from?.slice(0,3).toUpperCase() || "BLR";
  const tc = IATA[to?.toLowerCase()]   || to?.slice(0,3).toUpperCase()   || "BOM";
  const base = (INDIA_CODES.has(fc) && INDIA_CODES.has(tc))
    ? "https://www.aviasales.in" : "https://www.aviasales.com";
  return `${base}/search/${fc}${ddmm||""}${tc}${pax}?marker=714667&sub_id=alvryn_ai`;
}

// ── THEMES ────────────────────────────────────────────────────────────────────
const THEMES = {
  gold: {
    name:"⭐ Alvryn Gold", bg:"#fdf8ee", msgArea:"#f5edda",
    sidebar:"#2a1f0a", navBg:"rgba(253,248,238,0.95)",
    userBubble:"#c9a84c", userText:"#1a1410",
    aiBubble:"#fffdf5", aiText:"#1a1410",
    border:"#c9a84c", inputBg:"#fffdf5",
    inputText:"#1a1410", placeholder:"#b89040",
    chipBg:"rgba(201,168,76,0.12)", chipBorder:"#c9a84c", chipText:"#8B6914",
    sbText:"#f0e6d0", sbSubText:"#c9a060", sbBorder:"rgba(201,168,76,0.3)",
    sbItemHover:"rgba(201,168,76,0.11)", accent:"#c9a84c", accentDark:"#8B6914",
    sendBtn:"linear-gradient(135deg,#c9a84c,#f0d080)", sendIcon:"#1a1410",
    globeColor:"#c9a84c", globeGlow:"rgba(201,168,76,0.4)",
    inkColor:"#8B6914",
  },
  avengers: {
    name:"🌌 Avengers", bg:"#0a0e1a", msgArea:"#0d1220",
    sidebar:"#060a14", navBg:"rgba(10,14,26,0.97)",
    userBubble:"#8b0000", userText:"#fff",
    aiBubble:"#111827", aiText:"#e0e8ff",
    border:"#4a90d9", inputBg:"#111827",
    inputText:"#e0e8ff", placeholder:"#4a6080",
    chipBg:"rgba(74,144,217,0.15)", chipBorder:"#4a90d9", chipText:"#7eb8f7",
    sbText:"#c8d8ff", sbSubText:"#6080b0", sbBorder:"rgba(74,144,217,0.3)",
    sbItemHover:"rgba(74,144,217,0.1)", accent:"#4a90d9", accentDark:"#2a60a9",
    sendBtn:"linear-gradient(135deg,#8b0000,#cc2200)", sendIcon:"#fff",
    globeColor:"#4a90d9", globeGlow:"rgba(74,144,217,0.5)",
    inkColor:"#7eb8f7",
  },
  f1: {
    name:"🏎️ F1 Racing", bg:"#0f0f0f", msgArea:"#141414",
    sidebar:"#0a0a0a", navBg:"rgba(15,15,15,0.97)",
    userBubble:"#cc0000", userText:"#fff",
    aiBubble:"#1a1a1a", aiText:"#f0f0f0",
    border:"#cc0000", inputBg:"#1a1a1a",
    inputText:"#f0f0f0", placeholder:"#666",
    chipBg:"rgba(204,0,0,0.12)", chipBorder:"#cc0000", chipText:"#ff4444",
    sbText:"#f0f0f0", sbSubText:"#888", sbBorder:"rgba(204,0,0,0.3)",
    sbItemHover:"rgba(204,0,0,0.1)", accent:"#cc0000", accentDark:"#990000",
    sendBtn:"linear-gradient(135deg,#cc0000,#ff4444)", sendIcon:"#fff",
    globeColor:"#cc0000", globeGlow:"rgba(204,0,0,0.5)",
    inkColor:"#ff6666",
  },
  wwe: {
    name:"🤼 WWE", bg:"#0a0a0a", msgArea:"#111",
    sidebar:"#050505", navBg:"rgba(10,10,10,0.97)",
    userBubble:"#c9a84c", userText:"#0a0a0a",
    aiBubble:"#1a1a1a", aiText:"#ffd700",
    border:"#c9a84c", inputBg:"#1a1a1a",
    inputText:"#ffd700", placeholder:"#665500",
    chipBg:"rgba(201,168,76,0.12)", chipBorder:"#c9a84c", chipText:"#ffd700",
    sbText:"#ffd700", sbSubText:"#aa8800", sbBorder:"rgba(201,168,76,0.3)",
    sbItemHover:"rgba(201,168,76,0.1)", accent:"#c9a84c", accentDark:"#8B6914",
    sendBtn:"linear-gradient(135deg,#c9a84c,#ffd700)", sendIcon:"#0a0a0a",
    globeColor:"#ffd700", globeGlow:"rgba(255,215,0,0.5)",
    inkColor:"#ffd700",
  },
  cricket: {
    name:"🏏 Cricket", bg:"#f0fff4", msgArea:"#e8f5e9",
    sidebar:"#1b4332", navBg:"rgba(240,255,244,0.97)",
    userBubble:"#2d6a4f", userText:"#fff",
    aiBubble:"#fff", aiText:"#1b4332",
    border:"#2d6a4f", inputBg:"#fff",
    inputText:"#1b4332", placeholder:"#52b788",
    chipBg:"rgba(45,106,79,0.1)", chipBorder:"#2d6a4f", chipText:"#2d6a4f",
    sbText:"#d8f3dc", sbSubText:"#74c69d", sbBorder:"rgba(45,106,79,0.3)",
    sbItemHover:"rgba(45,106,79,0.1)", accent:"#2d6a4f", accentDark:"#1b4332",
    sendBtn:"linear-gradient(135deg,#2d6a4f,#52b788)", sendIcon:"#fff",
    globeColor:"#2d6a4f", globeGlow:"rgba(45,106,79,0.4)",
    inkColor:"#1b4332",
  },
  football: {
    name:"⚽ Football", bg:"#f8fff8", msgArea:"#edfaed",
    sidebar:"#003d00", navBg:"rgba(248,255,248,0.97)",
    userBubble:"#006400", userText:"#fff",
    aiBubble:"#fff", aiText:"#003d00",
    border:"#006400", inputBg:"#fff",
    inputText:"#003d00", placeholder:"#4a9a4a",
    chipBg:"rgba(0,100,0,0.08)", chipBorder:"#006400", chipText:"#006400",
    sbText:"#ccffcc", sbSubText:"#66cc66", sbBorder:"rgba(0,100,0,0.3)",
    sbItemHover:"rgba(0,100,0,0.1)", accent:"#006400", accentDark:"#003d00",
    sendBtn:"linear-gradient(135deg,#006400,#228b22)", sendIcon:"#fff",
    globeColor:"#228b22", globeGlow:"rgba(34,139,34,0.4)",
    inkColor:"#006400",
  },
  basketball: {
    name:"🏀 Basketball", bg:"#1a0a00", msgArea:"#200d00",
    sidebar:"#100600", navBg:"rgba(26,10,0,0.97)",
    userBubble:"#e65100", userText:"#fff",
    aiBubble:"#2a1400", aiText:"#ffcc99",
    border:"#e65100", inputBg:"#2a1400",
    inputText:"#ffcc99", placeholder:"#884400",
    chipBg:"rgba(230,81,0,0.12)", chipBorder:"#e65100", chipText:"#ff8c40",
    sbText:"#ffcc99", sbSubText:"#cc7744", sbBorder:"rgba(230,81,0,0.3)",
    sbItemHover:"rgba(230,81,0,0.1)", accent:"#e65100", accentDark:"#bf360c",
    sendBtn:"linear-gradient(135deg,#e65100,#ff8c00)", sendIcon:"#fff",
    globeColor:"#e65100", globeGlow:"rgba(230,81,0,0.5)",
    inkColor:"#ff8c40",
  },
  ocean: {
    name:"🌊 Ocean", bg:"#001a2e", msgArea:"#002240",
    sidebar:"#000f1a", navBg:"rgba(0,26,46,0.97)",
    userBubble:"#0066cc", userText:"#fff",
    aiBubble:"#002a4a", aiText:"#b3e0ff",
    border:"#0099ff", inputBg:"#002a4a",
    inputText:"#b3e0ff", placeholder:"#336688",
    chipBg:"rgba(0,153,255,0.12)", chipBorder:"#0099ff", chipText:"#66ccff",
    sbText:"#b3e0ff", sbSubText:"#5599bb", sbBorder:"rgba(0,153,255,0.3)",
    sbItemHover:"rgba(0,153,255,0.1)", accent:"#0099ff", accentDark:"#0066cc",
    sendBtn:"linear-gradient(135deg,#0066cc,#00aaff)", sendIcon:"#fff",
    globeColor:"#00aaff", globeGlow:"rgba(0,170,255,0.5)",
    inkColor:"#66ccff",
  },
  sakura: {
    name:"🌸 Sakura", bg:"#fff0f5", msgArea:"#ffe8f0",
    sidebar:"#4a0020", navBg:"rgba(255,240,245,0.97)",
    userBubble:"#e91e8c", userText:"#fff",
    aiBubble:"#fff5f8", aiText:"#4a0020",
    border:"#e91e8c", inputBg:"#fff5f8",
    inputText:"#4a0020", placeholder:"#cc6699",
    chipBg:"rgba(233,30,140,0.08)", chipBorder:"#e91e8c", chipText:"#c0006a",
    sbText:"#ffd0e8", sbSubText:"#cc88aa", sbBorder:"rgba(233,30,140,0.3)",
    sbItemHover:"rgba(233,30,140,0.08)", accent:"#e91e8c", accentDark:"#c0006a",
    sendBtn:"linear-gradient(135deg,#e91e8c,#ff6bb5)", sendIcon:"#fff",
    globeColor:"#e91e8c", globeGlow:"rgba(233,30,140,0.4)",
    inkColor:"#c0006a",
  },
  midnight: {
    name:"🌙 Midnight", bg:"#05050f", msgArea:"#080818",
    sidebar:"#020208", navBg:"rgba(5,5,15,0.97)",
    userBubble:"#6c00ff", userText:"#fff",
    aiBubble:"#0d0d22", aiText:"#c8b4ff",
    border:"#6c00ff", inputBg:"#0d0d22",
    inputText:"#c8b4ff", placeholder:"#443388",
    chipBg:"rgba(108,0,255,0.12)", chipBorder:"#6c00ff", chipText:"#aa88ff",
    sbText:"#c8b4ff", sbSubText:"#7755cc", sbBorder:"rgba(108,0,255,0.3)",
    sbItemHover:"rgba(108,0,255,0.1)", accent:"#6c00ff", accentDark:"#4a00bb",
    sendBtn:"linear-gradient(135deg,#6c00ff,#aa44ff)", sendIcon:"#fff",
    globeColor:"#8844ff", globeGlow:"rgba(136,68,255,0.5)",
    inkColor:"#aa88ff",
  },
  lava: {
    name:"🔥 Lava", bg:"#0f0500", msgArea:"#180800",
    sidebar:"#080200", navBg:"rgba(15,5,0,0.97)",
    userBubble:"#ff4500", userText:"#fff",
    aiBubble:"#1a0a00", aiText:"#ffaa66",
    border:"#ff4500", inputBg:"#1a0a00",
    inputText:"#ffaa66", placeholder:"#883300",
    chipBg:"rgba(255,69,0,0.12)", chipBorder:"#ff4500", chipText:"#ff8855",
    sbText:"#ffaa66", sbSubText:"#cc5500", sbBorder:"rgba(255,69,0,0.3)",
    sbItemHover:"rgba(255,69,0,0.1)", accent:"#ff4500", accentDark:"#cc2200",
    sendBtn:"linear-gradient(135deg,#ff4500,#ff8c00)", sendIcon:"#fff",
    globeColor:"#ff4500", globeGlow:"rgba(255,69,0,0.6)",
    inkColor:"#ff8855",
  },
  nature: {
    name:"🌿 Nature", bg:"#f4f9f0", msgArea:"#eaf4e4",
    sidebar:"#1a3d1a", navBg:"rgba(244,249,240,0.97)",
    userBubble:"#4a7c3f", userText:"#fff",
    aiBubble:"#fff", aiText:"#1a3d1a",
    border:"#4a7c3f", inputBg:"#fff",
    inputText:"#1a3d1a", placeholder:"#6aaa55",
    chipBg:"rgba(74,124,63,0.1)", chipBorder:"#4a7c3f", chipText:"#4a7c3f",
    sbText:"#d4edcc", sbSubText:"#88bb77", sbBorder:"rgba(74,124,63,0.3)",
    sbItemHover:"rgba(74,124,63,0.1)", accent:"#4a7c3f", accentDark:"#2d5a24",
    sendBtn:"linear-gradient(135deg,#4a7c3f,#7abf66)", sendIcon:"#fff",
    globeColor:"#4a7c3f", globeGlow:"rgba(74,124,63,0.4)",
    inkColor:"#2d5a24",
  },
};

// ── SOUND EFFECTS (Web Audio API) ─────────────────────────────────────────────
function createSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "send") {
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === "receive") {
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.05);
      osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === "thinking") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(550, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch (e) {}
}

// ── HOLOGRAPHIC GLOBE ─────────────────────────────────────────────────────────
const CITIES_GLOBE = [
  { name:"Paris",     x:48, y:32,  label:"🗼" },
  { name:"Dubai",     x:58, y:42,  label:"🏙" },
  { name:"Singapore", x:72, y:55,  label:"🦁" },
  { name:"New York",  x:22, y:38,  label:"🗽" },
  { name:"Tokyo",     x:80, y:36,  label:"⛩" },
  { name:"Bangalore", x:62, y:52,  label:"🇮🇳" },
  { name:"London",    x:44, y:28,  label:"🎡" },
  { name:"Sydney",    x:82, y:72,  label:"🦘" },
  { name:"Mumbai",    x:60, y:48,  label:"🌊" },
  { name:"Bangkok",   x:71, y:50,  label:"🛕" },
];

function HolographicGlobe({ themeKey, query }) {
  const T = THEMES[themeKey];
  const [tick, setTick] = useState(0);
  const [activeCities, setActiveCities] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!query) { setActiveCities([]); return; }
    const q = query.toLowerCase();
    const matched = CITIES_GLOBE.filter(c =>
      q.includes(c.name.toLowerCase()) ||
      (q.includes("europe") && ["Paris","London"].includes(c.name)) ||
      (q.includes("honeymoon") && ["Paris","Singapore","Bangkok"].includes(c.name)) ||
      (q.includes("india") && ["Bangalore","Mumbai"].includes(c.name)) ||
      (q.includes("asia") && ["Singapore","Bangkok","Tokyo"].includes(c.name))
    ).map(c => c.name);
    setActiveCities(matched.length ? matched : CITIES_GLOBE.slice(0,3).map(c => c.name));
  }, [query]);

  const rot = (tick * 0.4) % 360;
  const size = 200;
  const cx = size / 2, cy = size / 2, r = 80;

  // Generate meridians
  const meridians = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * 180 + rot * 0.5;
    const rad = (angle * Math.PI) / 180;
    const x1 = cx + r * Math.cos(rad);
    const y1 = cy - r;
    const x2 = cx - r * Math.cos(rad);
    const y2 = cy + r;
    return { x1, y1, x2, y2, op: 0.15 + 0.1 * Math.abs(Math.cos(rad)) };
  });

  // Generate parallels
  const parallels = Array.from({ length: 6 }, (_, i) => {
    const y = cy - r + (i + 1) * (r * 2 / 7);
    const rr = Math.sqrt(Math.max(0, r * r - (y - cy) * (y - cy)));
    return { cx, y, rx: rr, ry: rr * 0.3 };
  });

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "20px 0",
    }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
        style={{ filter: `drop-shadow(0 0 20px ${T.globeGlow})` }}>
        <defs>
          <radialGradient id="globeGrad" cx="40%" cy="35%">
            <stop offset="0%" stopColor={T.globeColor} stopOpacity="0.3"/>
            <stop offset="60%" stopColor={T.globeColor} stopOpacity="0.08"/>
            <stop offset="100%" stopColor={T.globeColor} stopOpacity="0.02"/>
          </radialGradient>
          <radialGradient id="glowGrad" cx="50%" cy="50%">
            <stop offset="0%" stopColor={T.globeColor} stopOpacity="0.15"/>
            <stop offset="100%" stopColor={T.globeColor} stopOpacity="0"/>
          </radialGradient>
          <clipPath id="globeClip">
            <circle cx={cx} cy={cy} r={r}/>
          </clipPath>
        </defs>

        {/* Outer glow */}
        <circle cx={cx} cy={cy} r={r + 15} fill="url(#glowGrad)"/>
        {/* Globe base */}
        <circle cx={cx} cy={cy} r={r} fill="url(#globeGrad)"
          stroke={T.globeColor} strokeWidth="1" strokeOpacity="0.4"/>

        {/* Grid lines */}
        <g clipPath="url(#globeClip)">
          {meridians.map((m, i) => (
            <line key={`m${i}`} x1={m.x1} y1={m.y1} x2={m.x2} y2={m.y2}
              stroke={T.globeColor} strokeWidth="0.5" strokeOpacity={m.op}/>
          ))}
          {parallels.map((p, i) => (
            <ellipse key={`p${i}`} cx={p.cx} cy={p.y} rx={p.rx} ry={p.ry}
              fill="none" stroke={T.globeColor} strokeWidth="0.5" strokeOpacity="0.2"/>
          ))}
        </g>

        {/* Animated arc paths between cities */}
        {activeCities.length >= 2 && activeCities.slice(0, 3).map((cityName, i) => {
          const c1 = CITIES_GLOBE.find(c => c.name === cityName);
          const c2 = CITIES_GLOBE.find(c => c.name === activeCities[(i + 1) % activeCities.length]);
          if (!c1 || !c2) return null;
          const x1 = (c1.x / 100) * size;
          const y1 = (c1.y / 100) * size;
          const x2 = (c2.x / 100) * size;
          const y2 = (c2.y / 100) * size;
          const mx = (x1 + x2) / 2;
          const my = Math.min(y1, y2) - 30;
          const dashOffset = -(tick * 0.8) % 40;
          return (
            <path key={`arc${i}`}
              d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
              fill="none" stroke={T.globeColor} strokeWidth="1.5"
              strokeOpacity="0.7" strokeDasharray="6 4"
              strokeDashoffset={dashOffset}/>
          );
        })}

        {/* City dots */}
        {CITIES_GLOBE.map((city, i) => {
          const px = (city.x / 100) * size;
          const py = (city.y / 100) * size;
          const isActive = activeCities.includes(city.name);
          const pulse = isActive ? 0.5 + 0.5 * Math.sin(tick * 0.1 + i) : 0;
          return (
            <g key={city.name}>
              {isActive && (
                <circle cx={px} cy={py} r={8 + pulse * 4}
                  fill={T.globeColor} fillOpacity={0.15 * pulse}/>
              )}
              <circle cx={px} cy={py} r={isActive ? 4 : 2.5}
                fill={isActive ? T.globeColor : T.globeColor}
                fillOpacity={isActive ? 0.9 : 0.4}/>
              {isActive && (
                <text x={px + 6} y={py - 6} fontSize="10" fill={T.globeColor}
                  fillOpacity="0.9">{city.label}</text>
              )}
            </g>
          );
        })}

        {/* Rotating highlight */}
        <circle cx={cx - r * 0.3} cy={cy - r * 0.3} r={r * 0.15}
          fill="white" fillOpacity="0.05"/>
      </svg>

      <div style={{
        fontFamily: "'Caveat', cursive",
        fontSize: 14, color: T.globeColor,
        marginTop: 8, letterSpacing: "0.1em",
        animation: "globePulse 1.5s ease-in-out infinite",
      }}>
        {activeCities.length > 0
          ? `✈ ${activeCities.slice(0, 2).join(" → ")} ...`
          : "🌍 Searching the world..."}
      </div>
    </div>
  );
}

// ── SHIMMER WORD REVEAL ───────────────────────────────────────────────────────
function ShimmerText({ text, themeKey, onDone }) {
  const T = THEMES[themeKey];
  const [visibleCount, setVisibleCount] = useState(0);
  const words = text ? text.split(" ") : [];
  const onDoneRef = useRef(onDone);
  useEffect(() => { onDoneRef.current = onDone; });

  useEffect(() => {
    setVisibleCount(0);
    const wordCount = text ? text.split(" ").length : 0;
    if (!wordCount) { if (onDoneRef.current) onDoneRef.current(); return; }
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleCount(i);
      if (i >= wordCount) {
        clearInterval(interval);
        if (onDoneRef.current) onDoneRef.current();
      }
    }, 60);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span style={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}>
      {words.map((word, i) => (
        <span key={i} style={{
          display: "inline-block",
          marginRight: "0.28em",
          opacity: i < visibleCount ? 1 : 0,
          transform: i < visibleCount ? "translateY(0) scale(1)" : "translateY(8px) scale(0.9)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
          color: i === visibleCount - 1 ? T.accent : T.aiText,
          textShadow: i === visibleCount - 1
            ? `0 0 12px ${T.globeGlow}, 0 0 24px ${T.globeGlow}` : "none",
          fontWeight: i === visibleCount - 1 ? 700 : 400,
          transitionDelay: `${i * 0.02}s`,
        }}>
          {word}
        </span>
      ))}
    </span>
  );
}

// ── PRICE ALERT BUTTON ────────────────────────────────────────────────────────
function PriceAlertButton({ from, to, currentPrice, themeKey }) {
  const T = THEMES[themeKey];
  const [set, setSet] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const setAlert = async () => {
    if (!token) { alert("Please sign in to set price alerts"); return; }
    setLoading(true);
    try {
      await fetch(`${API}/price-alert`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ from_city: from, to_city: to, current_price: currentPrice }),
      });
      setSet(true);
    } catch {}
    setLoading(false);
  };

  if (set) return (
    <div style={{ fontSize: 11, color: "#16a34a", fontFamily: "'Caveat', cursive" }}>
      🔔 Alert set! We'll notify you when prices drop.
    </div>
  );
  return (
    <button onClick={setAlert} disabled={loading}
      style={{
        padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
        cursor: "pointer", background: "transparent",
        border: `2px solid ${T.border}`, color: T.accent,
        fontFamily: "'Caveat', cursive", transition: "all 0.15s",
      }}>
      🔔 {loading ? "Setting..." : "Track Price"}
    </button>
  );
}

// ── FLIGHT CARD ───────────────────────────────────────────────────────────────
function FlightCard({ f, i, themeKey }) {
  const T = THEMES[themeKey];
  return (
    <div onClick={() => window.open(f.link, "_blank", "noopener")}
      style={{
        background: T.aiBubble, border: `2px solid ${T.border}`,
        borderRadius: "16px 16px 16px 4px",
        padding: "14px 16px", marginBottom: 10, cursor: "pointer",
        boxShadow: `3px 3px 0 ${T.border}`,
        transition: "transform 0.15s, box-shadow 0.15s",
        fontFamily: "'Caveat', cursive",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translate(-2px,-2px)";
        e.currentTarget.style.boxShadow = `5px 5px 0 ${T.border}`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translate(0,0)";
        e.currentTarget.style.boxShadow = `3px 3px 0 ${T.border}`;
      }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>✈️</span>
          <span style={{ fontSize: 16, color: T.aiText, fontWeight: 700 }}>
            {f.airline || "Multiple Airlines"}
          </span>
        </div>
        {f.label && (
          <span style={{
            padding: "3px 10px", borderRadius: 20, fontSize: 12,
            border: `1.5px solid ${T.accent}`, color: T.accent,
            background: "transparent",
          }}>{f.label}</span>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: T.aiText }}>{f.departure || "—"}</div>
          <div style={{ fontSize: 13, color: T.accent, opacity: 0.8 }}>{f.fromCode}</div>
        </div>
        <div style={{ flex: 1, textAlign: "center", padding: "0 10px" }}>
          <div style={{ fontSize: 12, color: T.aiText, opacity: 0.6 }}>{f.duration || "Direct"}</div>
          <div style={{
            height: 2, background: `linear-gradient(90deg,transparent,${T.accent},transparent)`,
            margin: "4px 0", position: "relative",
          }}>
            <span style={{
              position: "absolute", top: -8, left: "50%",
              transform: "translateX(-50%)", fontSize: 14,
            }}>✈</span>
          </div>
          <div style={{ fontSize: 11, color: T.accent }}>DIRECT</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: T.aiText }}>{f.arrival || "—"}</div>
          <div style={{ fontSize: 13, color: T.accent, opacity: 0.8 }}>{f.toCode}</div>
        </div>
      </div>

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingTop: 10, borderTop: `1.5px dashed ${T.border}`,
      }}>
        <div>
          <div style={{ fontSize: 11, color: T.aiText, opacity: 0.5 }}>APPROX FROM</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: T.accent }}>
            {f.price ? `₹${f.price.toLocaleString()}` : "Live rates"}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
          <div style={{
            padding: "8px 16px", borderRadius: 10, border: `2px solid ${T.accent}`,
            background: T.accent, color: T.userText,
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            boxShadow: `2px 2px 0 ${T.accentDark}`,
          }}>
            Book Best Price →
          </div>
          {f.from && f.to && (
            <PriceAlertButton from={f.from} to={f.to} currentPrice={f.price} themeKey={themeKey}/>
          )}
        </div>
      </div>
      {f.insight && (
        <div style={{
          marginTop: 8, padding: "6px 10px", borderRadius: 8,
          border: `1px dashed ${T.border}`, fontSize: 13, color: T.aiText,
          opacity: 0.8,
        }}>💡 {f.insight}</div>
      )}
    </div>
  );
}

// ── BUS CARD ──────────────────────────────────────────────────────────────────
function BusCard({ b, i, themeKey }) {
  const T = THEMES[themeKey];
  return (
    <div onClick={() => window.open(b.link, "_blank", "noopener")}
      style={{
        background: T.aiBubble, border: `2px solid ${T.border}`,
        borderRadius: "16px 16px 16px 4px",
        padding: "14px 16px", marginBottom: 10, cursor: "pointer",
        boxShadow: `3px 3px 0 ${T.border}`,
        transition: "transform 0.15s, box-shadow 0.15s",
        fontFamily: "'Caveat', cursive",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translate(-2px,-2px)";
        e.currentTarget.style.boxShadow = `5px 5px 0 ${T.border}`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translate(0,0)";
        e.currentTarget.style.boxShadow = `3px 3px 0 ${T.border}`;
      }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🚌</span>
          <span style={{ fontSize: 16, color: T.aiText, fontWeight: 700 }}>{b.operator}</span>
        </div>
        <span style={{ fontSize: 13, color: T.aiText, opacity: 0.7 }}>{b.type}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: T.aiText }}>{b.departure}</div>
          <div style={{ fontSize: 13, color: T.accent }}>{b.from}</div>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: T.aiText, opacity: 0.6 }}>{b.duration || "Direct"}</div>
          <div style={{ height: 2, background: `linear-gradient(90deg,transparent,${T.accent},transparent)`, margin: "4px 0" }}/>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: T.aiText }}>{b.arrival}</div>
          <div style={{ fontSize: 13, color: T.accent }}>{b.to}</div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: `1.5px dashed ${T.border}` }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: T.accent }}>
          ₹{b.price?.toLocaleString() || "—"}
        </div>
        <div style={{
          padding: "8px 16px", borderRadius: 10, border: `2px solid ${T.accent}`,
          background: T.accent, color: T.userText, fontSize: 13,
          fontWeight: 700, cursor: "pointer", boxShadow: `2px 2px 0 ${T.accentDark}`,
        }}>
          View on RedBus →
        </div>
      </div>
    </div>
  );
}

// ── HOTEL CARD ────────────────────────────────────────────────────────────────
function HotelCard({ h, i, themeKey }) {
  const T = THEMES[themeKey];
  return (
    <div onClick={() => window.open(h.link, "_blank", "noopener")}
      style={{
        background: T.aiBubble, border: `2px solid ${T.border}`,
        borderRadius: "16px 16px 16px 4px",
        padding: "14px 16px", marginBottom: 10, cursor: "pointer",
        boxShadow: `3px 3px 0 ${T.border}`,
        fontFamily: "'Caveat', cursive",
      }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 20 }}>🏨</span>
        <span style={{ fontSize: 16, color: T.aiText, fontWeight: 700 }}>Hotels in {h.city}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: `1.5px dashed ${T.border}` }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: T.accent }}>₹{h.priceRange}/night</div>
        <div style={{
          padding: "8px 16px", borderRadius: 10, border: `2px solid ${T.accent}`,
          background: T.accent, color: T.userText, fontSize: 13,
          fontWeight: 700, cursor: "pointer", boxShadow: `2px 2px 0 ${T.accentDark}`,
        }}>
          View Hotels →
        </div>
      </div>
    </div>
  );
}

// ── TRAIN CARD ────────────────────────────────────────────────────────────────
function TrainCard({ t, i, themeKey }) {
  const T = THEMES[themeKey];
  return (
    <div onClick={() => window.open(t.link, "_blank", "noopener")}
      style={{
        background: T.aiBubble, border: `2px solid ${T.border}`,
        borderRadius: "16px 16px 16px 4px",
        padding: "14px 16px", marginBottom: 10, cursor: "pointer",
        boxShadow: `3px 3px 0 ${T.border}`,
        fontFamily: "'Caveat', cursive",
      }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 20 }}>🚂</span>
        <span style={{ fontSize: 16, color: T.aiText, fontWeight: 700 }}>{t.from} → {t.to}</span>
      </div>
      {t.insight && <div style={{ fontSize: 13, color: T.aiText, opacity: 0.7, marginBottom: 8 }}>💡 {t.insight}</div>}
      {t.date && <div style={{ fontSize: 13, color: T.accent, marginBottom: 8 }}>📅 {t.date}</div>}
      <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 8, borderTop: `1.5px dashed ${T.border}` }}>
        <div style={{
          padding: "8px 16px", borderRadius: 10, border: `2px solid ${T.accent}`,
          background: T.accent, color: T.userText, fontSize: 13,
          fontWeight: 700, cursor: "pointer", boxShadow: `2px 2px 0 ${T.accentDark}`,
        }}>
          Search on IRCTC →
        </div>
      </div>
    </div>
  );
}

// ── CHAT SIDEBAR ITEM ─────────────────────────────────────────────────────────
function ChatSidebarItem({ chat, isActive, onLoad, onRename, onDelete, themeKey }) {
  const T = THEMES[themeKey];
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameVal, setRenameVal] = useState(chat.title);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [menuOpen]);

  return (
    <div style={{ position: "relative", marginBottom: 4 }}>
      <div onClick={() => { if (!menuOpen && !renaming) onLoad(); }}
        style={{
          padding: "9px 12px", borderRadius: 10, cursor: "pointer",
          background: isActive ? `${T.accent}18` : "transparent",
          border: isActive ? `2px solid ${T.accent}` : "2px solid transparent",
          display: "flex", alignItems: "center", gap: 6,
          transition: "all 0.14s", fontFamily: "'Caveat', cursive",
        }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {renaming ? (
            <input value={renameVal} autoFocus onChange={e => setRenameVal(e.target.value)}
              onBlur={() => { onRename(chat.id, renameVal.trim() || chat.title); setRenaming(false); }}
              onKeyDown={e => { if (e.key === "Enter") { onRename(chat.id, renameVal.trim() || chat.title); setRenaming(false); } if (e.key === "Escape") setRenaming(false); }}
              onClick={e => e.stopPropagation()}
              style={{
                width: "100%", background: "rgba(255,255,255,0.15)",
                border: `1px solid ${T.accent}`, borderRadius: 5,
                padding: "2px 6px", fontSize: 14, color: T.sbText,
                outline: "none", fontFamily: "'Caveat', cursive",
              }}/>
          ) : (
            <div style={{ fontSize: 14, color: T.sbText, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {chat.title}
            </div>
          )}
          <div style={{ fontSize: 11, color: T.sbSubText, marginTop: 1 }}>
            {new Date(chat.time).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </div>
        </div>
        <button onClick={e => { e.stopPropagation(); setMenuOpen(s => !s); }}
          style={{
            flexShrink: 0, width: 26, height: 26, borderRadius: 5,
            background: "transparent", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: T.sbSubText, fontSize: 16,
          }}>⋯</button>
      </div>
      {menuOpen && (
        <div ref={menuRef} onClick={e => e.stopPropagation()}
          style={{
            position: "absolute", right: 0, top: 34, zIndex: 100,
            background: T.aiBubble, borderRadius: 10, padding: "4px 0",
            boxShadow: `3px 3px 0 ${T.border}`, border: `2px solid ${T.border}`,
            minWidth: 130, fontFamily: "'Caveat', cursive",
          }}>
          <button onClick={() => { setRenaming(true); setMenuOpen(false); }}
            style={{ display: "block", width: "100%", padding: "9px 14px", textAlign: "left", background: "none", border: "none", cursor: "pointer", fontSize: 14, color: T.aiText }}>
            ✏️ Rename
          </button>
          <button onClick={() => { onDelete(chat.id); setMenuOpen(false); }}
            style={{ display: "block", width: "100%", padding: "9px 14px", textAlign: "left", background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#ef4444" }}>
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ── THEME PICKER ──────────────────────────────────────────────────────────────
function ThemePicker({ currentTheme, onSelect }) {
  const T = THEMES[currentTheme];
  return (
    <div>
      <div style={{ fontSize: 13, color: T.sbSubText, letterSpacing: "0.1em", marginBottom: 10, fontFamily: "'Caveat', cursive" }}>
        🎨 CHOOSE THEME
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {Object.entries(THEMES).map(([key, theme]) => (
          <button key={key} onClick={() => onSelect(key)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "9px 12px", borderRadius: 10, cursor: "pointer",
              border: currentTheme === key ? `2px solid ${T.accent}` : "2px solid transparent",
              background: currentTheme === key ? `${T.accent}18` : "transparent",
              color: T.sbText, fontFamily: "'Caveat', cursive",
              fontSize: 14, textAlign: "left", width: "100%",
              transition: "all 0.15s",
            }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: theme.accent, flexShrink: 0, border: "2px solid rgba(255,255,255,0.3)" }}/>
            <span>{theme.name}</span>
            {currentTheme === key && <span style={{ marginLeft: "auto", color: T.accent }}>✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── ALVRYN LOGO ───────────────────────────────────────────────────────────────
function AlvrynLogo({ size = 32, color = "#c9a84c" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="logoG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color}/>
          <stop offset="100%" stopColor={color} stopOpacity="0.6"/>
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" stroke={color} strokeWidth="1.5" fill="none"/>
      <path d="M20 46 L28 18 L36 46" stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      <path d="M22.5 36 L33.5 36" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M26 46 L34 18 L42 46" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.5"/>
    </svg>
  );
}

// ══ MAIN COMPONENT ════════════════════════════════════════════════════════════
export default function AIChatPage() {
  const navigate = useNavigate();
  const [themeKey, setThemeKey] = useState(() => localStorage.getItem("alvryn_theme") || "gold");
  const [chats, setChats] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [thinkQuery, setThinkQuery] = useState("");
  const [sbOpen, setSbOpen] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);
  const sessionIdRef = useRef(sessionStorage.getItem("alvryn_sid") || null);
  const thinkStartRef = useRef(0);

  const T = THEMES[themeKey];
  const token = localStorage.getItem("token");
  let user = {};
  try { user = JSON.parse(localStorage.getItem("user") || "{}"); } catch {}

  // Auth gate
  useEffect(() => { if (!token) navigate("/login"); }, [token, navigate]);

  // Auto scroll
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, thinking]);

  // Keep backend alive
  useEffect(() => {
    fetch(`${API}/test`).catch(() => {});
    const t = setInterval(() => fetch(`${API}/test`).catch(() => {}), 14 * 60 * 1000);
    return () => clearInterval(t);
  }, []);

  // Save theme to localStorage
  useEffect(() => { localStorage.setItem("alvryn_theme", themeKey); }, [themeKey]);

  // Load chats from localStorage first, then sync from DB
  useEffect(() => {
    if (!token) return;
    try {
      const local = JSON.parse(localStorage.getItem("alvryn_chats") || "[]");
      if (local.length > 0) setChats(local);
    } catch {}
    fetch(`${API}/chats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(data => {
        if (!Array.isArray(data) || !data.length) return;
        const mapped = data.map(c => ({
          id: c.chat_id,
          title: c.title || "New chat",
          messages: (Array.isArray(c.messages) ? c.messages : []).map(m => ({
            ...m, id: m.id || m.time || Date.now(),
            role: m.role || "user", content: m.content || m.text || "",
          })),
          time: new Date(c.updated_at || c.created_at).getTime(),
        }));
        setChats(mapped);
        localStorage.setItem("alvryn_chats", JSON.stringify(mapped.slice(0, 30)));
      })
      .catch(() => {});
  }, [token]);

  const saveChat = useCallback((id, msgs, chatTitle) => {
    const title = chatTitle || "New chat";
    setChats(prev => {
      const ex = prev.find(c => c.id === id);
      const t2 = ex?.title || title;
      if (ex) return prev.map(c => c.id === id ? { ...c, messages: msgs, time: Date.now() } : c);
      return [{ id, title: t2, messages: msgs, time: Date.now() }, ...prev].slice(0, 50);
    });
    try {
      const stored = JSON.parse(localStorage.getItem("alvryn_chats") || "[]");
      const filtered = stored.filter(c => c.id !== id);
      const t3 = stored.find(c => c.id === id)?.title || title;
      localStorage.setItem("alvryn_chats", JSON.stringify(
        [{ id, title: t3, messages: msgs, time: Date.now() }, ...filtered].slice(0, 30)
      ));
    } catch {}
    if (token) {
      const storedChats = JSON.parse(localStorage.getItem("alvryn_chats") || "[]");
      const t4 = storedChats.find(c => c.id === id)?.title || title;
      fetch(`${API}/chats/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: t4,
          messages: msgs.slice(0, 100).map(m => ({
            role: m.role, content: m.content || "", text: m.text || "",
            cards: (m.cards || []).slice(0, 5), id: m.id,
          })),
        }),
      }).catch(() => {});
    }
  }, [token]);

  const newChat = useCallback(() => {
    setActiveId(Date.now().toString());
    setMessages([]);
    setInput("");
    setSbOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const loadChat = useCallback(chat => {
    setActiveId(chat.id);
    setMessages(chat.messages || []);
    setSbOpen(false);
  }, []);

  const deleteChat = useCallback(chatId => {
    setChats(prev => prev.filter(c => c.id !== chatId));
    if (chatId === activeId) { setActiveId(null); setMessages([]); }
    if (token) {
      fetch(`${API}/chats/${chatId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    }
  }, [activeId, token]);

  const renameChat = useCallback((chatId, newTitle) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, title: newTitle } : c));
    if (token) {
      const chat = JSON.parse(localStorage.getItem("alvryn_chats") || "[]").find(c => c.id === chatId);
      if (chat) {
        fetch(`${API}/chats/${chatId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ title: newTitle, messages: chat.messages || [] }),
        }).catch(() => {});
      }
    }
  }, [token]);

  const send = useCallback(async text => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    createSound("send");

    const id = activeId || Date.now().toString();
    if (!activeId) setActiveId(id);

    const uMsg = { role: "user", content: q, id: Date.now() };
    const next = [...messages, uMsg];
    setMessages(next);
    setLoading(true);
    setThinking(true);
    setThinkQuery(q);
    thinkStartRef.current = Date.now();

    createSound("thinking");

    try {
      const res = await fetch(`${API}/ai-chat-v2`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: q, history: messages.slice(-6), sessionId: sessionIdRef.current }),
      });
      const data = await res.json();

      // Ensure minimum thinking time of 2s
      const elapsed = Date.now() - thinkStartRef.current;
      if (elapsed < 2000) await new Promise(r => setTimeout(r, 2000 - elapsed));

      if (data.sessionId) {
        sessionIdRef.current = data.sessionId;
        sessionStorage.setItem("alvryn_sid", data.sessionId);
      }

      setThinking(false);
      createSound("receive");

      const aMsg = {
        role: "assistant", id: Date.now() + 1,
        text: data.text || "",
        displayText: "", // starts empty, fills via shimmer
        cards: data.cards || [], cta: data.cta || null,
        quickReplies: data.quickReplies || [],
        _shimmerDone: false,
      };
      const final = [...next, aMsg];
      setMessages(final);

      const chatTitle = next[0]?.content?.slice(0, 44) + (next[0]?.content?.length > 44 ? "…" : "") || "New chat";
      saveChat(id, final, chatTitle);
    } catch {
      setThinking(false);
      const errMsg = {
        role: "assistant", id: Date.now() + 1,
        text: "Sorry, something went wrong. Please try again! 🙏",
        cards: [], cta: null,
      };
      setMessages([...next, errMsg]);
    }
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 80);
  }, [input, loading, messages, token, activeId, saveChat]);

  const handleKey = e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const handleInput = e => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 140) + "px";
    }
  };

  const empty = messages.length === 0;
  const chatTitle = chats.find(c => c.id === activeId)?.title || "Alvryn AI";

  // CSS
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Indie+Flower&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; }
    @keyframes globePulse { 0%,100%{opacity:0.7;} 50%{opacity:1;} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(12px);} to{opacity:1;transform:translateY(0);} }
    @keyframes sketchIn { from{opacity:0;transform:scale(0.92) rotate(-1deg);} to{opacity:1;transform:scale(1) rotate(0deg);} }
    @keyframes spin { to{transform:rotate(360deg);} }
    @keyframes shimmerPulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
    @keyframes wobble { 0%,100%{transform:rotate(-1deg);} 50%{transform:rotate(1deg);} }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-thumb { border-radius: 2px; }
    .chip-btn:hover { transform: translateY(-2px) rotate(-1deg) !important; }
    .sb-overlay { display: none; position: fixed; inset: 0; z-index: 390; }
    @media(max-width:768px) {
      .sb-overlay { display: block; }
      .hamburger-btn { display: flex !important; }
    }
    @media(min-width:769px) {
      .hamburger-btn { display: flex !important; }
    }
    textarea::placeholder { font-family: 'Caveat', cursive !important; }
  `;

  return (
    <div style={{ display: "flex", height: "100vh", background: T.bg, overflow: "hidden", fontFamily: "'Caveat', cursive", transition: "background 0.5s ease" }}>
      <style>{css}</style>

      {/* Sidebar overlay (mobile) */}
      {sbOpen && (
        <div className="sb-overlay" onClick={() => setSbOpen(false)}
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}/>
      )}

      {/* ══ SIDEBAR ══ */}
      <div style={{
        width: sbOpen ? "min(85vw, 290px)" : 0,
        flexShrink: 0, background: T.sidebar,
        borderRight: `2px solid ${T.sbBorder}`,
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        transition: "width 0.28s cubic-bezier(0.4,0,0.2,1)",
        position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 400,
        boxShadow: sbOpen ? `4px 0 24px rgba(0,0,0,0.4)` : "none",
      }}>
        <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "16px 12px", overflowY: "auto", overflowX: "hidden", whiteSpace: "nowrap" }}>

          {/* Logo + close */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingBottom: 14, borderBottom: `2px dashed ${T.sbBorder}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/")}>
              <AlvrynLogo size={32} color={T.accent}/>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: T.accent, letterSpacing: "0.1em" }}>ALVRYN</div>
                <div style={{ fontSize: 11, color: T.sbSubText }}>AI Travel</div>
              </div>
            </div>
            <button onClick={() => setSbOpen(false)}
              style={{ width: 30, height: 30, borderRadius: "50%", background: "transparent", border: `2px solid ${T.sbBorder}`, cursor: "pointer", color: T.sbSubText, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
              ×
            </button>
          </div>

          {/* New Chat */}
          <button onClick={newChat}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
              borderRadius: 12, background: T.accent, border: `2px solid ${T.accentDark}`,
              cursor: "pointer", color: T.userText,
              fontSize: 15, fontWeight: 700, marginBottom: 16, width: "100%",
              fontFamily: "'Caveat', cursive",
              boxShadow: `3px 3px 0 ${T.accentDark}`,
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translate(-2px,-2px)"; e.currentTarget.style.boxShadow = `5px 5px 0 ${T.accentDark}`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translate(0,0)"; e.currentTarget.style.boxShadow = `3px 3px 0 ${T.accentDark}`; }}>
            <span style={{ fontSize: 18 }}>✚</span> New Chat
          </button>

          {/* Theme picker toggle */}
          <button onClick={() => setShowThemes(s => !s)}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
              borderRadius: 10, background: "transparent",
              border: `2px dashed ${T.sbBorder}`, cursor: "pointer",
              color: T.sbText, fontSize: 14, marginBottom: 12, width: "100%",
              fontFamily: "'Caveat', cursive", textAlign: "left",
            }}>
            🎨 Change Theme {showThemes ? "▲" : "▼"}
          </button>

          {showThemes && (
            <div style={{ marginBottom: 16, padding: "8px", background: "rgba(255,255,255,0.05)", borderRadius: 10, border: `1px dashed ${T.sbBorder}` }}>
              <ThemePicker currentTheme={themeKey} onSelect={key => { setThemeKey(key); }}/>
            </div>
          )}

          {/* Chat history */}
          <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
            {chats.length > 0 && (
              <>
                <div style={{ fontSize: 11, color: T.sbSubText, letterSpacing: "0.12em", marginBottom: 8, paddingLeft: 4 }}>
                  RECENT CHATS
                </div>
                {chats.slice(0, 30).map(chat => (
                  <ChatSidebarItem key={chat.id} chat={chat}
                    isActive={activeId === chat.id}
                    onLoad={() => loadChat(chat)}
                    onRename={(id, t) => renameChat(id, t)}
                    onDelete={id => deleteChat(id)}
                    themeKey={themeKey}/>
                ))}
              </>
            )}
            {chats.length === 0 && (
              <div style={{ fontSize: 13, color: T.sbSubText, textAlign: "center", padding: "20px 0" }}>
                No chats yet.<br/>Start a new conversation! ✈️
              </div>
            )}
          </div>

          {/* User info + nav */}
          <div style={{ borderTop: `2px dashed ${T.sbBorder}`, paddingTop: 12, marginTop: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                background: T.accent, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 16, fontWeight: 700, color: T.userText,
                border: `2px solid ${T.accentDark}`,
              }}>
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div style={{ overflow: "hidden", flex: 1 }}>
                <div style={{ fontSize: 15, color: T.sbText, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.name || "Traveller"}
                </div>
                <div style={{ fontSize: 11, color: T.sbSubText, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.email || ""}
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {[["🔍 Search", "/search"], ["👤 Profile", "/profile"], ["🏠 Home", "/"], ["🎫 Bookings", "/bookings"]].map(([label, path]) => (
                <button key={path} onClick={() => navigate(path)}
                  style={{
                    padding: "7px 6px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                    cursor: "pointer", background: "rgba(255,255,255,0.05)",
                    color: T.sbSubText, border: `2px solid ${T.sbBorder}`,
                    fontFamily: "'Caveat', cursive", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${T.accent}22`; e.currentTarget.style.color = T.sbText; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = T.sbSubText; }}>
                  {label}
                </button>
              ))}
            </div>
            <button onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/login"); }}
              style={{
                marginTop: 8, width: "100%", padding: "8px", borderRadius: 8,
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                background: "rgba(239,68,68,0.08)", color: "rgba(239,68,68,0.8)",
                border: "2px dashed rgba(239,68,68,0.3)", fontFamily: "'Caveat', cursive",
              }}>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* ══ MAIN AREA ══ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* Top bar */}
        <div style={{
          height: 58, padding: "0 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: `2px dashed ${T.border}`,
          flexShrink: 0, background: T.navBg,
          backdropFilter: "blur(12px)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Hamburger — always visible */}
            <button className="hamburger-btn" onClick={() => setSbOpen(s => !s)}
              style={{
                width: 40, height: 40, borderRadius: 10,
                background: "transparent", border: `2px solid ${T.border}`,
                cursor: "pointer", display: "flex", alignItems: "center",
                justifyContent: "center", flexDirection: "column", gap: 4,
                padding: "8px",
                flexShrink: 0,
              }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: "100%", height: 2.5, background: T.inkColor, borderRadius: 2 }}/>
              ))}
            </button>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.aiText, fontFamily: "'Caveat', cursive" }}>
              {empty ? "Alvryn AI ✈" : chatTitle}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 5, padding: "5px 12px",
              borderRadius: 20, border: `2px dashed ${T.accent}`,
              background: `${T.accent}10`,
            }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", animation: "shimmerPulse 2s infinite" }}/>
              <span style={{ fontFamily: "'Caveat', cursive", fontSize: 12, color: T.accent }}>AI LIVE</span>
            </div>
            <button onClick={newChat}
              style={{
                padding: "7px 16px", borderRadius: 10, background: T.accent,
                border: `2px solid ${T.accentDark}`, color: T.userText,
                fontSize: 13, fontWeight: 700, cursor: "pointer",
                fontFamily: "'Caveat', cursive",
                boxShadow: `2px 2px 0 ${T.accentDark}`,
              }}>
              + New
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div style={{
          flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch",
          padding: "clamp(10px,2vw,20px) clamp(8px,2vw,16px)",
          background: T.msgArea, minHeight: 0,
          transition: "background 0.5s ease",
        }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>

            {/* Empty state */}
            {empty && (
              <div style={{ textAlign: "center", paddingTop: "clamp(20px,6vh,60px)", animation: "fadeUp 0.5s both" }}>
                <div style={{ fontSize: 56, marginBottom: 16, animation: "wobble 3s ease-in-out infinite" }}>✈️</div>
                <h1 style={{
                  fontFamily: "'Caveat', cursive", fontWeight: 700,
                  fontSize: "clamp(28px,6vw,52px)", color: T.aiText,
                  marginBottom: 10, lineHeight: 1.1,
                }}>
                  Where do you want to go?
                </h1>
                <p style={{ fontFamily: "'Caveat', cursive", fontSize: "clamp(14px,3vw,18px)", color: T.aiText, opacity: 0.7, marginBottom: 24, lineHeight: 1.6 }}>
                  Flights · Buses · Hotels · Trains · Trip planning<br/>
                  <span style={{ fontSize: "clamp(12px,2.5vw,14px)", opacity: 0.5 }}>Any language. Any route. Typos? No problem 😄</span>
                </p>

                {/* Suggestion chips */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(clamp(130px,38vw,240px),1fr))", gap: 10, maxWidth: 600, margin: "0 auto", padding: "0 10px" }}>
                  {[
                    "✈️ Cheapest flight Bangalore to Delhi tomorrow",
                    "🚌 Bus Chennai to Hyderabad tonight",
                    "🏨 Hotels in Goa under ₹2000",
                    "🚂 Train Delhi to Mumbai this weekend",
                    "🗺️ Plan 2-day trip under ₹5000",
                    "🌍 Flights to Dubai next month",
                    "⚡ Fastest way Bangalore to Mumbai",
                    "🏖️ Best honeymoon destination Europe",
                  ].map((s, i) => (
                    <button key={i} className="chip-btn" onClick={() => send(s)}
                      style={{
                        padding: "10px 14px", borderRadius: 14,
                        background: T.aiBubble,
                        border: `2px solid ${T.border}`,
                        color: T.aiText, fontFamily: "'Caveat', cursive",
                        fontSize: "clamp(12px,2.8vw,14px)", cursor: "pointer",
                        textAlign: "left", lineHeight: 1.4,
                        boxShadow: `2px 2px 0 ${T.border}`,
                        transition: "transform 0.18s, box-shadow 0.18s",
                        animation: `sketchIn 0.35s ${i * 50}ms both`,
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map(m => (
              <div key={m.id}>
                {m.role === "user" ? (
                  // User message
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18, animation: "sketchIn 0.25s both" }}>
                    <div style={{
                      maxWidth: "72%", padding: "12px 18px",
                      borderRadius: "18px 18px 4px 18px",
                      background: T.userBubble,
                      border: `2px solid ${T.accentDark}`,
                      boxShadow: `3px 3px 0 ${T.accentDark}`,
                      fontFamily: "'Caveat', cursive",
                      fontSize: "clamp(14px,3vw,17px)",
                      color: T.userText, fontWeight: 600, lineHeight: 1.6,
                    }}>
                      {m.content}
                    </div>
                  </div>
                ) : (
                  // AI message
                  <div style={{ display: "flex", gap: 10, marginBottom: 24, animation: "fadeUp 0.3s both" }}>
                    <div style={{
                      flexShrink: 0, width: 36, height: 36, borderRadius: "50%",
                      background: T.userBubble,
                      border: `2px solid ${T.accentDark}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginTop: 4, boxShadow: `2px 2px 0 ${T.accentDark}`,
                    }}>
                      <AlvrynLogo size={22} color={T.userText}/>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {m.text && (
                        <div style={{
                          background: T.aiBubble,
                          border: `2px solid ${T.border}`,
                          borderRadius: "4px 18px 18px 18px",
                          padding: "14px 18px", marginBottom: m.cards?.length ? 12 : 0,
                          boxShadow: `3px 3px 0 ${T.border}`,
                          fontFamily: "'Caveat', cursive",
                          fontSize: "clamp(14px,3vw,17px)",
                          color: T.aiText, lineHeight: 1.75,
                        }}>
                          {m._shimmerDone === false && !m._shimmerStarted ? (
                            <ShimmerText
                              text={m.text}
                              themeKey={themeKey}
                              onDone={() => {
                                setMessages(prev => prev.map(msg =>
                                  msg.id === m.id ? { ...msg, _shimmerDone: true } : msg
                                ));
                              }}
                            />
                          ) : (
                            <span style={{ whiteSpace: "pre-wrap" }}>{m.text}</span>
                          )}
                        </div>
                      )}

                      {/* Cards */}
                      {m.cards?.filter(c => c.type === "flight").map((c, i) => (
                        <FlightCard key={i} f={c} i={i} themeKey={themeKey}/>
                      ))}
                      {m.cards?.filter(c => c.type === "bus").map((c, i) => (
                        <BusCard key={i} b={c} i={i} themeKey={themeKey}/>
                      ))}
                      {m.cards?.filter(c => c.type === "hotel").map((c, i) => (
                        <HotelCard key={i} h={c} i={i} themeKey={themeKey}/>
                      ))}
                      {m.cards?.filter(c => c.type === "train").map((c, i) => (
                        <TrainCard key={i} t={c} i={i} themeKey={themeKey}/>
                      ))}

                      {m.cards?.length > 0 && (
                        <div style={{ fontFamily: "'Caveat', cursive", fontSize: 12, color: T.aiText, opacity: 0.45, marginTop: 4 }}>
                          Prices are approximate. Tap any card to check live availability.
                        </div>
                      )}

                      {m.cta && (
                        <div style={{
                          marginTop: 12, padding: "10px 14px", borderRadius: 10,
                          border: `2px dashed ${T.border}`,
                          fontFamily: "'Caveat', cursive", fontSize: 14,
                          color: T.accent, fontStyle: "italic",
                          background: `${T.accent}08`,
                        }}>
                          {m.cta}
                        </div>
                      )}

                      {m.quickReplies?.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                          {m.quickReplies.map((r, i) => (
                            <button key={i} onClick={() => send(r)}
                              style={{
                                padding: "7px 14px", borderRadius: 20,
                                background: T.aiBubble,
                                border: `2px solid ${T.border}`,
                                color: T.accent, fontFamily: "'Caveat', cursive",
                                fontSize: 13, fontWeight: 600, cursor: "pointer",
                                boxShadow: `2px 2px 0 ${T.border}`,
                                transition: "all 0.15s",
                              }}
                              onMouseEnter={e => { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = `3px 3px 0 ${T.border}`; }}
                              onMouseLeave={e => { e.currentTarget.style.transform = "translate(0,0)"; e.currentTarget.style.boxShadow = `2px 2px 0 ${T.border}`; }}>
                              {r}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Thinking animation — globe */}
            {thinking && (
              <div style={{ display: "flex", gap: 10, marginBottom: 20, animation: "fadeUp 0.3s both" }}>
                <div style={{
                  flexShrink: 0, width: 36, height: 36, borderRadius: "50%",
                  background: T.userBubble, border: `2px solid ${T.accentDark}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginTop: 4, boxShadow: `2px 2px 0 ${T.accentDark}`,
                }}>
                  <AlvrynLogo size={22} color={T.userText}/>
                </div>
                <div style={{
                  background: T.aiBubble, border: `2px solid ${T.border}`,
                  borderRadius: "4px 18px 18px 18px",
                  padding: "8px 16px",
                  boxShadow: `3px 3px 0 ${T.border}`,
                  minWidth: 220,
                }}>
                  <HolographicGlobe themeKey={themeKey} query={thinkQuery}/>
                </div>
              </div>
            )}

            <div ref={bottomRef}/>
          </div>
        </div>

        {/* Input area */}
        <div style={{
          padding: "10px 16px 16px",
          borderTop: `2px dashed ${T.border}`,
          flexShrink: 0, background: T.navBg,
          backdropFilter: "blur(12px)",
          transition: "background 0.5s ease",
        }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div style={{
              display: "flex", alignItems: "flex-end", gap: 10,
              background: T.inputBg, borderRadius: 16, padding: "10px 14px",
              border: `2px solid ${T.border}`,
              boxShadow: `3px 3px 0 ${T.border}`,
              transition: "box-shadow 0.2s, border-color 0.2s",
            }}>
              <textarea
                ref={el => { inputRef.current = el; textareaRef.current = el; }}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKey}
                placeholder="Ask anything... ✈"
                rows={1}
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  fontFamily: "'Caveat', cursive", fontSize: "clamp(14px,3vw,17px)",
                  color: T.inputText, resize: "none", lineHeight: 1.6,
                  maxHeight: 140, overflowY: "auto", paddingTop: 2,
                }}
              />
              <button onClick={() => send()} disabled={!input.trim() || loading}
                style={{
                  flexShrink: 0, width: 40, height: 40, borderRadius: 12,
                  background: input.trim() && !loading ? T.accent : "rgba(128,128,128,0.2)",
                  border: `2px solid ${input.trim() && !loading ? T.accentDark : "transparent"}`,
                  cursor: input.trim() && !loading ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, transition: "all 0.2s",
                  boxShadow: input.trim() && !loading ? `2px 2px 0 ${T.accentDark}` : "none",
                  color: input.trim() && !loading ? T.userText : "rgba(128,128,128,0.5)",
                }}>
                {loading
                  ? <div style={{ width: 16, height: 16, border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}/>
                  : "↑"
                }
              </button>
            </div>
            <div style={{ textAlign: "center", marginTop: 6, fontFamily: "'Caveat', cursive", fontSize: 11, color: T.aiText, opacity: 0.4 }}>
              Alvryn AI · Flights · Buses · Hotels · Trains · Bookings on partner sites
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}