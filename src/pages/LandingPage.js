import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────
   ALVRYN ICON  — plane orbiting letter A
───────────────────────────────────────────── */
const AlvrynIcon = ({ size = 40, spinning = false }) => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="agrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6C63FF"/>
        <stop offset="100%" stopColor="#00C2FF"/>
      </linearGradient>
      <linearGradient id="planegrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF6B6B"/>
        <stop offset="100%" stopColor="#FFD93D"/>
      </linearGradient>
    </defs>
    <text x="11" y="44" fontFamily="'Syne',sans-serif" fontWeight="900"
      fontSize="38" fill="url(#agrad)">A</text>
    <ellipse cx="28" cy="28" rx="25" ry="10" stroke="url(#agrad)"
      strokeWidth="1.2" strokeDasharray="4 3" opacity="0.4"
      style={spinning ? { animation:"orbitRingAnim 4s linear infinite", transformOrigin:"28px 28px" } : {}}/>
    <g style={spinning
      ? { animation:"planeOrbit 4s linear infinite", transformOrigin:"28px 28px" }
      : { transform:"translate(0,0)" }}>
      <path d="M53 28 L47 24 L49 28 L47 32 Z" fill="url(#planegrad)"/>
      <path d="M48 24 L48 21 L50 25 Z" fill="url(#planegrad)" opacity="0.7"/>
    </g>
  </svg>
);

/* ─────────────────────────────────────────────
   AURORA BACKGROUND CANVAS
───────────────────────────────────────────── */
const AuroraBackground = ({ colors }) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const blobsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    blobsRef.current = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: 220 + Math.random() * 180,
      colorIdx: i % colors.length,
    }));

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      blobsRef.current.forEach(b => {
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < -b.r || b.x > W + b.r) b.vx *= -1;
        if (b.y < -b.r || b.y > H + b.r) b.vy *= -1;
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, colors[b.colorIdx % colors.length] + "2E");
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [colors]);

  return (
    <canvas ref={canvasRef} style={{
      position: "absolute", inset: 0,
      width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 0,
    }}/>
  );
};

/* ─────────────────────────────────────────────
   KINETIC TITLE — chars drop in one by one
───────────────────────────────────────────── */
const KineticTitle = ({ line1, line2, accentGrad, started }) => {
  const c1 = line1.split("");
  const c2 = line2.split("");
  const baseDelay = 80;

  return (
    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, lineHeight: 1, userSelect: "none" }}>
      <div>
        {c1.map((ch, i) => (
          <span key={i} style={{
            display: "inline-block",
            opacity: started ? 1 : 0,
            transform: started ? "translateY(0) rotate(0deg)" : "translateY(90px) rotate(10deg)",
            transition: `opacity 0.55s ${i * baseDelay}ms cubic-bezier(0.22,1,0.36,1),
                         transform 0.65s ${i * baseDelay}ms cubic-bezier(0.34,1.56,0.64,1)`,
            fontSize: "clamp(52px,8.5vw,112px)",
            color: "#0a0a0a",
            letterSpacing: "-0.04em",
          }}>{ch === " " ? "\u00A0" : ch}</span>
        ))}
      </div>
      <div>
        {c2.map((ch, i) => (
          <span key={i} style={{
            display: "inline-block",
            opacity: started ? 1 : 0,
            transform: started ? "translateY(0) rotate(0deg)" : "translateY(90px) rotate(-8deg)",
            transition: `opacity 0.55s ${c1.length * baseDelay + 120 + i * baseDelay}ms cubic-bezier(0.22,1,0.36,1),
                         transform 0.65s ${c1.length * baseDelay + 120 + i * baseDelay}ms cubic-bezier(0.34,1.56,0.64,1)`,
            fontSize: "clamp(52px,8.5vw,112px)",
            background: accentGrad,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.04em",
          }}>{ch === " " ? "\u00A0" : ch}</span>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   TYPEWRITER
───────────────────────────────────────────── */
const TypeWriter = ({ phrases, style }) => {
  const [pIdx, setPIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [charI, setCharI] = useState(0);

  useEffect(() => {
    const word = phrases[pIdx % phrases.length];
    if (!deleting) {
      if (charI < word.length) {
        const t = setTimeout(() => { setText(word.slice(0, charI + 1)); setCharI(c => c + 1); }, 72);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setDeleting(true), 2200);
        return () => clearTimeout(t);
      }
    } else {
      if (charI > 0) {
        const t = setTimeout(() => { setText(word.slice(0, charI - 1)); setCharI(c => c - 1); }, 42);
        return () => clearTimeout(t);
      } else {
        setDeleting(false);
        setPIdx(p => p + 1);
      }
    }
  }, [charI, deleting, pIdx, phrases]);

  return (
    <span style={style}>
      {text}<span style={{ animation: "blink 0.9s step-end infinite" }}>|</span>
    </span>
  );
};

/* ─────────────────────────────────────────────
   3D TILT CARD
───────────────────────────────────────────── */
const TiltCard = ({ children, style, className }) => {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, s: 1 });
  return (
    <div
      className={className}
      onMouseMove={e => {
        const r = e.currentTarget.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width - 0.5;
        const cy = (e.clientY - r.top) / r.height - 0.5;
        setTilt({ rx: cy * -14, ry: cx * 14, s: 1.025 });
      }}
      onMouseLeave={() => setTilt({ rx: 0, ry: 0, s: 1 })}
      style={{
        transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.s})`,
        transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        ...style,
      }}
    >{children}</div>
  );
};

/* ─────────────────────────────────────────────
   COUNTER
───────────────────────────────────────────── */
const Counter = ({ end, suffix = "" }) => {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const s = Date.now();
        const step = () => {
          const p = Math.min((Date.now() - s) / 1800, 1);
          setN(Math.round((1 - Math.pow(1 - p, 3)) * end));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
};

/* ─────────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────────── */
const Reveal = ({ children, delay = 0, style }) => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(36px)",
      transition: `opacity 0.7s ${delay}ms ease, transform 0.7s ${delay}ms cubic-bezier(0.22,1,0.36,1)`,
      ...style,
    }}>{children}</div>
  );
};

/* ─────────────────────────────────────────────
   SEARCH RESULT MOCKUP
───────────────────────────────────────────── */
const SearchMockup = ({ accent }) => {
  const queries = [
    "Flights BLR → GOA Friday under ₹3500",
    "Bus Hyderabad to Chennai tomorrow 6 AM",
    "Cheapest flight Delhi next week",
  ];
  const [qi, setQi] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setQi(q => (q + 1) % queries.length), 3200);
    return () => clearInterval(t);
  }, [queries.length]);

  return (
    <div style={{
      width: "100%", maxWidth: 500,
      background: "#fff", borderRadius: 22,
      boxShadow: "0 32px 80px rgba(0,0,0,0.11), 0 2px 8px rgba(0,0,0,0.04)",
      overflow: "hidden", border: "1px solid rgba(0,0,0,0.05)",
    }}>
      <div style={{ background: "#f5f5f7", padding: "13px 18px",
        display: "flex", alignItems: "center", gap: 8,
        borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
        {["#FF5F57","#FFBD2E","#28CA41"].map(c => (
          <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }}/>
        ))}
        <div style={{ flex: 1, background: "#fff", borderRadius: 7, padding: "5px 12px",
          marginLeft: 8, fontSize: 11, color: "#aaa", fontFamily: "'DM Sans',sans-serif" }}>
          alvryn.in/search
        </div>
      </div>
      <div style={{ padding: "20px 20px 8px" }}>
        <div style={{ background: "#f8f8f8", borderRadius: 12, padding: "13px 16px",
          display: "flex", alignItems: "center", gap: 10,
          border: `1.5px solid ${accent}33` }}>
          <span>🔍</span>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#555", flex: 1 }}>
            {queries[qi]}<span style={{ animation: "blink 0.9s step-end infinite", color: accent }}>|</span>
          </span>
        </div>
      </div>
      <div style={{ padding: "10px 20px 20px", display: "flex", flexDirection: "column", gap: 9 }}>
        {[
          { airline: "FastAir", code: "FA-204", time: "06:10 → 08:55", price: "₹3,240", tag: "CHEAPEST" },
{ airline: "SkyLine",  code: "SL-501", time: "09:30 → 12:15", price: "₹3,840", tag: "" },
{ airline: "BluJet",   code: "BJ-173", time: "14:20 → 17:05", price: "₹4,100", tag: "" },
        ].map((f, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "13px 14px", borderRadius: 12,
            background: i === 0 ? `${accent}0F` : "#fafafa",
            border: `1px solid ${i === 0 ? accent + "28" : "rgba(0,0,0,0.04)"}`,
            animation: `fadeSlideUp 0.4s ${i * 100 + 200}ms both`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9,
                background: accent + "14", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✈️</div>
              <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12.5, color: "#111" }}>
                  {f.airline} <span style={{ fontWeight: 400, color: "#bbb", fontSize: 11 }}>{f.code}</span>
                </div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, color: "#888" }}>{f.time}</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14,
                color: i === 0 ? accent : "#111" }}>{f.price}</div>
              {f.tag && (
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 8.5,
                  background: accent, color: "#fff", padding: "2px 5px", borderRadius: 4, marginTop: 2 }}>{f.tag}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   SECTION THEMES
───────────────────────────────────────────── */
const THEMES = [
  { blobs: ["#6C63FF","#00C2FF","#a78bfa"], accent: "#6C63FF", grad: "linear-gradient(135deg,#6C63FF,#00C2FF)" },
  { blobs: ["#00C2B0","#34D399","#6EE7B7"], accent: "#00B89C", grad: "linear-gradient(135deg,#00B89C,#34D399)" },
  { blobs: ["#FF6B6B","#FF8C42","#FFD93D"], accent: "#FF6B6B", grad: "linear-gradient(135deg,#FF6B6B,#FFD93D)" },
  { blobs: ["#3B82F6","#6366F1","#8B5CF6"], accent: "#3B82F6", grad: "linear-gradient(135deg,#3B82F6,#8B5CF6)" },
  { blobs: ["#EC4899","#F43F5E","#FB923C"], accent: "#EC4899", grad: "linear-gradient(135deg,#EC4899,#FB923C)" },
];

/* ═══════════════════════════════════════════
   LANDING PAGE
═══════════════════════════════════════════ */
export default function LandingPage() {
  const navigate = useNavigate();
  const [themeIdx, setThemeIdx] = useState(0);
  const [heroReady, setHeroReady] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  const T = THEMES[themeIdx];

  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 250);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setNavScrolled(window.scrollY > 50);
      const idx = Math.min(Math.floor(window.scrollY / window.innerHeight), THEMES.length - 1);
      setThemeIdx(idx);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goSearch = useCallback(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/search");
    else navigate("/login");
  }, [navigate]);

  const features = [
    { icon: "🧠", title: "AI Natural Search",    desc: "Type like texting. \"Cheapest BLR to GOA this Friday\" and you're done.", color: "#6C63FF" },
    { icon: "✈️", title: "Flight Booking",       desc: "500+ routes, real-time fares, instant seat lock + email confirmation.", color: "#00C2FF" },
    { icon: "🚌", title: "Bus Booking",          desc: "AC, Sleeper, Semi-Sleeper. RedBus routes booked directly from Alvryn.", color: "#00B89C" },
    { icon: "💬", title: "WhatsApp Native",      desc: "Search, book, get your ticket — without ever opening a browser.", color: "#25D366" },
    { icon: "⚡", title: "60-Second Booking",    desc: "Search to boarding pass in under a minute. Zero friction.", color: "#FF6B6B" },
    { icon: "🔒", title: "Zero Hidden Fees",     desc: "Price you see is price you pay. Always transparent.", color: "#F59E0B" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#fafafa", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        @keyframes blink{50%{opacity:0}}
        @keyframes fadeSlideUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes floatUD{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes planeOrbit{from{transform:rotate(0deg) translateX(26px) rotate(0deg)}to{transform:rotate(360deg) translateX(26px) rotate(-360deg)}}
        @keyframes orbitRingAnim{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes gradShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
        @keyframes pulseRing{0%{transform:translate(-50%,-50%) scale(1);opacity:0.5}100%{transform:translate(-50%,-50%) scale(2.2);opacity:0}}
        .btn-shine{position:relative;overflow:hidden;cursor:pointer;transition:transform 0.2s,box-shadow 0.2s}
        .btn-shine:hover{transform:translateY(-2px)}
        .btn-shine::after{content:'';position:absolute;inset:0;background:linear-gradient(120deg,transparent 30%,rgba(255,255,255,0.3) 50%,transparent 70%);transform:translateX(-100%);transition:transform 0.5s}
        .btn-shine:hover::after{transform:translateX(100%)}
        .nav-lnk{opacity:0.6;transition:opacity 0.2s;cursor:pointer;text-decoration:none}
        .nav-lnk:hover{opacity:1}
        .feat-card{transition:transform 0.3s,box-shadow 0.3s!important}
        .feat-card:hover{transform:translateY(-7px)!important;box-shadow:0 22px 60px rgba(0,0,0,0.09)!important}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:#6C63FF;border-radius:2px}
      `}</style>

      {/* ══════ NAVBAR ══════ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        height: 68, padding: "0 6%",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: navScrolled ? "rgba(250,250,250,0.85)" : "transparent",
        backdropFilter: navScrolled ? "blur(22px)" : "none",
        borderBottom: navScrolled ? "1px solid rgba(0,0,0,0.05)" : "none",
        transition: "all 0.4s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div style={{ animation: "floatUD 4s ease-in-out infinite" }}>
            <AlvrynIcon size={42} spinning />
          </div>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 18,
              color: "#0a0a0a", letterSpacing: "-0.04em", lineHeight: 1.1 }}>ALVRYN</div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 8,
              color: T.accent, letterSpacing: "0.18em" }}>TRAVEL BEYOND</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 32 }}>
          {["How it works","Features","Flights","Buses"].map(l => (
            <span key={l} className="nav-lnk"
              style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500, color: "#0a0a0a" }}>
              {l}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => navigate("/login")} className="btn-shine"
            style={{ padding: "9px 22px", borderRadius: 12, fontSize: 14, fontWeight: 600,
              fontFamily: "'DM Sans',sans-serif", background: "transparent", color: "#0a0a0a",
              border: "1.5px solid rgba(0,0,0,0.13)" }}>
            Sign In
          </button>
          <button onClick={() => navigate("/register")} className="btn-shine"
            style={{ padding: "9px 22px", borderRadius: 12, fontSize: 14, fontWeight: 700,
              fontFamily: "'Syne',sans-serif", color: "#fff", border: "none",
              background: T.grad, boxShadow: `0 4px 18px ${T.accent}44` }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* ══════ HERO ══════ */}
      <section style={{
        minHeight: "100vh", background: "#fafafa",
        display: "flex", alignItems: "center",
        position: "relative", overflow: "hidden",
        padding: "0 6%",
      }}>
        <AuroraBackground colors={T.blobs} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 860, paddingTop: 80 }}>
          {/* Live badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "8px 18px", borderRadius: 100,
            background: `${T.accent}10`, border: `1px solid ${T.accent}28`,
            marginBottom: 48,
            opacity: heroReady ? 1 : 0,
            transform: heroReady ? "translateY(0)" : "translateY(-16px)",
            transition: "all 0.5s ease",
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%",
              background: T.accent, boxShadow: `0 0 8px ${T.accent}`, display: "inline-block" }}/>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10.5,
              color: T.accent, letterSpacing: "0.14em" }}>
              NOW LIVE · INDIA'S SMARTEST TRAVEL AI
            </span>
          </div>

          {/* BIG KINETIC TITLE */}
          <KineticTitle
            line1="Travel Beyond"
            line2="Boundaries."
            accentGrad={T.grad}
            started={heroReady}
          />

          {/* Typewriter */}
          <div style={{
            marginTop: 30, marginBottom: 52,
            fontSize: "clamp(17px,2.2vw,23px)", color: "#555", lineHeight: 1.5,
            opacity: heroReady ? 1 : 0,
            transform: heroReady ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.6s 1.5s ease",
          }}>
            Book flights & buses with{" "}
            <TypeWriter
              phrases={["plain English.", "a WhatsApp message.", "AI superpowers.", "zero hidden fees."]}
              style={{ fontWeight: 700, color: T.accent }}
            />
          </div>

          {/* CTAs */}
          <div style={{
            display: "flex", gap: 14, flexWrap: "wrap",
            opacity: heroReady ? 1 : 0,
            transform: heroReady ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.6s 1.8s ease",
          }}>
            <button onClick={goSearch} className="btn-shine"
              style={{ padding: "16px 38px", borderRadius: 14, fontSize: 16, fontWeight: 800,
                fontFamily: "'Syne',sans-serif", color: "#fff", border: "none",
                background: T.grad, backgroundSize: "200% 200%",
                animation: "gradShift 4s ease infinite",
                boxShadow: `0 10px 38px ${T.accent}44` }}>
              Search Flights ✈
            </button>
            <button onClick={goSearch} className="btn-shine"
              style={{ padding: "16px 38px", borderRadius: 14, fontSize: 16, fontWeight: 700,
                fontFamily: "'DM Sans',sans-serif", color: "#0a0a0a",
                background: "#fff", border: "1.5px solid rgba(0,0,0,0.1)",
                boxShadow: "0 4px 18px rgba(0,0,0,0.06)" }}>
              Book a Bus 🚌
            </button>
            <button onClick={() => navigate("/register")} className="btn-shine"
              style={{ padding: "16px 26px", borderRadius: 14, fontSize: 15, fontWeight: 600,
                fontFamily: "'DM Sans',sans-serif", color: "#777",
                background: "transparent", border: "1.5px solid rgba(0,0,0,0.1)" }}>
              Create Account →
            </button>
          </div>

          {/* Trust pills */}
          <div style={{
            display: "flex", gap: 24, marginTop: 44, flexWrap: "wrap",
            opacity: heroReady ? 1 : 0, transition: "opacity 0.6s 2.1s ease",
          }}>
            {["🔒 Secure","📧 Instant Tickets","💬 WhatsApp","500+ Routes"].map(b => (
              <span key={b} style={{ fontFamily: "'Space Mono',monospace", fontSize: 10.5, color: "#bbb", letterSpacing: "0.05em" }}>{b}</span>
            ))}
          </div>
        </div>

        {/* Floating search mockup RIGHT */}
        <div style={{
          position: "absolute", right: "4%", top: "50%",
          transform: "translateY(-47%)",
          animation: "floatUD 6s ease-in-out infinite",
          opacity: heroReady ? 1 : 0,
          transition: "opacity 0.7s 2.3s ease",
        }}>
          <SearchMockup accent={T.accent} />
        </div>

        {/* Scroll cue */}
        <div style={{ position: "absolute", bottom: 34, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          animation: "floatUD 2.2s ease-in-out infinite" }}>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9,
            color: "#ccc", letterSpacing: "0.18em" }}>SCROLL</span>
          <div style={{ width: 1, height: 34, background: `linear-gradient(to bottom,${T.accent}70,transparent)` }}/>
        </div>
      </section>

      {/* ══════ HOW IT WORKS ══════ */}
      <section style={{
        minHeight: "100vh", background: "#fafafa",
        position: "relative", overflow: "hidden",
        padding: "120px 6%", display: "flex", alignItems: "center",
      }}>
        <AuroraBackground colors={THEMES[1].blobs} />
        <div style={{ position: "relative", zIndex: 2, width: "100%" }}>
          <Reveal>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10.5,
              color: THEMES[1].accent, letterSpacing: "0.2em", marginBottom: 14 }}>HOW IT WORKS</div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900,
              fontSize: "clamp(34px,5vw,66px)", color: "#0a0a0a", lineHeight: 1.05, marginBottom: 28 }}>
              Book like you text a friend.
            </h2>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900,
              fontSize: "clamp(34px,5vw,66px)", lineHeight: 1.05, marginBottom: 64,
              background: THEMES[1].grad, WebkitBackgroundClip: "text",
              backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              No learning curve.
            </h2>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 26 }}>
            {[
              { n: "01", icon: "💬", title: "Type Naturally", desc: "\"Flights BLR to GOA Friday under ₹3500\" — Alvryn understands context, dates and budgets." },
              { n: "02", icon: "⚡", title: "AI Finds Best Options", desc: "Our model searches across airlines and bus operators in real time and ranks by value." },
              { n: "03", icon: "✅", title: "Book in Seconds", desc: "Pick, confirm, done. Your ticket arrives via email + WhatsApp instantly." },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 140}>
                <TiltCard style={{ padding: "38px 30px", background: "#fff", borderRadius: 22,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.05)",
                  cursor: "default", height: "100%" }}>
                  <div style={{ fontSize: 38, marginBottom: 18 }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 26,
                    color: THEMES[1].accent, marginBottom: 10 }}>{s.n}</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 19,
                    color: "#0a0a0a", marginBottom: 12 }}>{s.title}</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14.5,
                    color: "#777", lineHeight: 1.65 }}>{s.desc}</div>
                </TiltCard>
              </Reveal>
            ))}
          </div>

          {/* Auth note */}
          <Reveal delay={380}>
            <div style={{ marginTop: 44, padding: "18px 26px", borderRadius: 14,
              background: `${THEMES[1].accent}0D`, border: `1px solid ${THEMES[1].accent}22`,
              display: "inline-flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 20 }}>🔐</span>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14.5, color: "#555" }}>
                A free account is needed to search and book. Takes 30 seconds.{" "}
                <span onClick={() => navigate("/register")}
                  style={{ color: THEMES[1].accent, cursor: "pointer", fontWeight: 700, textDecoration: "underline" }}>
                  Sign up free →
                </span>
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════ FEATURES ══════ */}
      <section style={{
        minHeight: "100vh", background: "#fafafa",
        position: "relative", overflow: "hidden", padding: "120px 6%",
      }}>
        <AuroraBackground colors={THEMES[2].blobs} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <Reveal style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10.5,
              color: THEMES[2].accent, letterSpacing: "0.2em", marginBottom: 14 }}>FEATURES</div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900,
              fontSize: "clamp(30px,4.5vw,58px)", color: "#0a0a0a", lineHeight: 1.05, marginBottom: 12 }}>
              Everything you need.
            </h2>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900,
              fontSize: "clamp(30px,4.5vw,58px)", lineHeight: 1.05, marginBottom: 68,
              background: THEMES[2].grad, WebkitBackgroundClip: "text",
              backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Nothing you don't.
            </h2>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 75}>
                <TiltCard className="feat-card"
                  style={{ padding: "34px 26px", background: "#fff", borderRadius: 20,
                    boxShadow: "0 4px 18px rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.05)",
                    cursor: "default", height: "100%" }}>
                  <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18,
                    color: "#0a0a0a", marginBottom: 10 }}>{f.title}</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#777", lineHeight: 1.65 }}>
                    {f.desc}
                  </div>
                  <div style={{ marginTop: 22, height: 3, borderRadius: 2,
                    background: `linear-gradient(90deg,${f.color},transparent)`, width: "55%" }}/>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ STATS ══════ */}
      <section style={{
        minHeight: "50vh", background: "#fafafa",
        position: "relative", overflow: "hidden",
        padding: "110px 6%", display: "flex", alignItems: "center",
      }}>
        <AuroraBackground colors={THEMES[3].blobs} />
        <div style={{ position: "relative", zIndex: 2, width: "100%", textAlign: "center" }}>
          <Reveal>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900,
              fontSize: "clamp(26px,3.5vw,48px)", color: "#0a0a0a", marginBottom: 64 }}>
              Alvryn is growing fast 🚀
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
            {[
              { val: 12000, suf: "+", label: "Waitlist Members" },
              { val: 98,    suf: "%", label: "Satisfaction Rate" },
              { val: 500,   suf: "+", label: "Routes Covered" },
              { val: 60,    suf: "s", label: "Avg Booking Time" },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 90}>
                <TiltCard style={{ padding: "40px 18px", background: "#fff", borderRadius: 20,
                  boxShadow: "0 4px 18px rgba(0,0,0,0.05)", cursor: "default" }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 48,
                    color: THEMES[3].accent, lineHeight: 1 }}>
                    <Counter end={s.val} suffix={s.suf} />
                  </div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, color: "#999",
                    marginTop: 8 }}>{s.label}</div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ WHATSAPP ══════ */}
      <section style={{
        minHeight: "80vh", background: "#fafafa",
        position: "relative", overflow: "hidden",
        padding: "120px 6%", display: "flex", alignItems: "center",
      }}>
        <AuroraBackground colors={THEMES[4].blobs} />
        <div style={{
          position: "relative", zIndex: 2, width: "100%",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center",
        }}>
          <Reveal>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10.5,
              color: THEMES[4].accent, letterSpacing: "0.2em", marginBottom: 18 }}>WHATSAPP NATIVE</div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900,
              fontSize: "clamp(28px,4vw,52px)", color: "#0a0a0a", lineHeight: 1.05, marginBottom: 12 }}>
              Your entire trip.
            </h2>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900,
              fontSize: "clamp(28px,4vw,52px)", lineHeight: 1.05, marginBottom: 28,
              background: THEMES[4].grad, WebkitBackgroundClip: "text",
              backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              One chat thread.
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16.5, color: "#666",
              lineHeight: 1.7, marginBottom: 38 }}>
              Search flights and buses, lock seats, get your ticket — all inside WhatsApp. No app download. Just text us.
            </p>
            <div style={{ marginBottom: 40, padding: "14px 20px", borderRadius: 12,
              background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.07)",
              display: "inline-block" }}>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: "#555" }}>
                📱 +1-415-523-8886 · Join code:{" "}
                <strong style={{ color: "#0a0a0a" }}>join meal-biggest</strong>
              </span>
            </div>
            <div>
              <button onClick={goSearch} className="btn-shine"
                style={{ padding: "15px 34px", borderRadius: 14, fontSize: 15, fontWeight: 700,
                  fontFamily: "'Syne',sans-serif", color: "#fff", border: "none",
                  background: THEMES[4].grad, boxShadow: `0 8px 26px ${THEMES[4].accent}44` }}>
                Book a Flight Now ✈
              </button>
            </div>
          </Reveal>

          <Reveal delay={180}>
            <TiltCard style={{ width: "100%", maxWidth: 330, margin: "0 auto", cursor: "default" }}>
              <div style={{ borderRadius: 26, overflow: "hidden",
                boxShadow: "0 28px 72px rgba(0,0,0,0.13)", border: "1px solid rgba(0,0,0,0.04)" }}>
                <div style={{ background: "#128C7E", padding: "15px 18px",
                  display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <AlvrynIcon size={28} spinning />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#fff", fontSize: 14 }}>Alvryn</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>● online</div>
                  </div>
                </div>
                <div style={{ background: "#E5DDD5", padding: "16px 12px",
                  display: "flex", flexDirection: "column", gap: 9 }}>
                  {[
                    { me: false, msg: "Flight BLR to DEL 28th March under ₹5000 🙏" },
                    { me: true,  msg: "Found 3 flights! ✈️\n6E-204 · ₹3,840 · 6:10 AM\nAI-501 · ₹4,120 · 9:30 AM\nReply 1 or 2 to book" },
                    { me: false, msg: "1" },
                    { me: true,  msg: "✅ Booked!\nIndiGo 6E-204 · ₹3,840\nTicket sent to email 📧" },
                  ].map((m, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: m.me ? "flex-end" : "flex-start" }}>
                      <div style={{
                        maxWidth: "85%", padding: "9px 13px",
                        borderRadius: m.me ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                        background: m.me ? "#DCF8C6" : "#fff",
                        fontSize: 12, lineHeight: 1.55,
                        fontFamily: "'DM Sans',sans-serif", color: "#1a1a1a", whiteSpace: "pre-line",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                        animation: `fadeSlideUp 0.4s ${i * 140 + 300}ms both`,
                      }}>{m.msg}</div>
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </section>

      {/* ══════ FINAL CTA ══════ */}
      <section style={{
        minHeight: "70vh", background: "#fafafa",
        position: "relative", overflow: "hidden",
        padding: "120px 6%", display: "flex", alignItems: "center", justifyContent: "center",
        textAlign: "center",
      }}>
        <AuroraBackground colors={THEMES[0].blobs} />
        {[160, 280, 400].map((r, i) => (
          <div key={i} style={{
            position: "absolute", width: r, height: r, borderRadius: "50%",
            border: `1px solid ${T.accent}1A`,
            top: "50%", left: "50%",
            animation: `pulseRing ${2.5 + i}s ease-out infinite`,
            animationDelay: `${i * 0.7}s`,
          }}/>
        ))}

        <div style={{ position: "relative", zIndex: 2, maxWidth: 660 }}>
          <Reveal>
            <div style={{ animation: "floatUD 4s ease-in-out infinite", marginBottom: 28 }}>
              <AlvrynIcon size={76} spinning />
            </div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900,
              fontSize: "clamp(36px,6vw,76px)", color: "#0a0a0a", lineHeight: 1.02, marginBottom: 22 }}>
              Ready to fly
            </h2>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900,
              fontSize: "clamp(36px,6vw,76px)", lineHeight: 1.02, marginBottom: 26,
              background: T.grad, WebkitBackgroundClip: "text",
              backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              smarter?
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 17, color: "#777",
              lineHeight: 1.7, marginBottom: 50 }}>
              India's most intelligent travel booking platform. Best fares on flights and buses, instantly.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => navigate("/register")} className="btn-shine"
                style={{ padding: "17px 44px", borderRadius: 15, fontSize: 16, fontWeight: 900,
                  fontFamily: "'Syne',sans-serif", color: "#fff", border: "none",
                  background: T.grad, backgroundSize: "200% 200%",
                  animation: "gradShift 3s ease infinite",
                  boxShadow: `0 12px 48px ${T.accent}44` }}>
                Create Free Account ✈
              </button>
              <button onClick={() => navigate("/login")} className="btn-shine"
                style={{ padding: "17px 36px", borderRadius: 15, fontSize: 16, fontWeight: 600,
                  fontFamily: "'DM Sans',sans-serif", color: "#0a0a0a",
                  background: "#fff", border: "1.5px solid rgba(0,0,0,0.1)",
                  boxShadow: "0 4px 18px rgba(0,0,0,0.05)" }}>
                Sign In →
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer style={{ background: "#f2f2f4", borderTop: "1px solid rgba(0,0,0,0.06)", padding: "42px 6%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <AlvrynIcon size={32} />
            <div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 15, color: "#0a0a0a" }}>ALVRYN</div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, color: T.accent, letterSpacing: "0.18em" }}>TRAVEL BEYOND BOUNDARIES</div>
            </div>
          </div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#aaa" }}>
            © 2026 Alvryn · Built with ☕ in Bangalore
          </div>
          <div style={{ display: "flex", gap: 26 }}>
            {["Privacy","Terms","Contact"].map(l => (
              <span key={l} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#aaa", cursor: "pointer" }}>{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}