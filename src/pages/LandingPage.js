import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ─── Gravity Physics Engine ───────────────────────────────────────────────────
function useGravity(containerRef) {
  const items = useRef([]);
  const animFrame = useRef(null);
  const gravity = 0.4;
  const friction = 0.98;
  const bounce = 0.55;

  const init = useCallback(() => {
    if (!containerRef.current) return;
    const els = containerRef.current.querySelectorAll("[data-gravity]");
    items.current = Array.from(els).map((el) => {
      const rect = el.getBoundingClientRect();
      const parent = containerRef.current.getBoundingClientRect();
      return {
        el,
        x: rect.left - parent.left,
        y: rect.top - parent.top,
        vx: (Math.random() - 0.5) * 2,
        vy: 0,
        w: rect.width,
        h: rect.height,
      };
    });
  }, [containerRef]);

  const startFall = useCallback(() => {
    if (!containerRef.current) return;
    init();
    const container = containerRef.current;
    const containerH = container.offsetHeight;

    const step = () => {
      items.current.forEach((item) => {
        item.vy += gravity;
        item.vx *= friction;
        item.vy *= friction;
        item.x += item.vx;
        item.y += item.vy;
        const floor = containerH - item.h;
        if (item.y >= floor) {
          item.y = floor;
          item.vy *= -bounce;
          item.vx *= 0.9;
        }
        if (item.x < 0) { item.x = 0; item.vx *= -bounce; }
        if (item.x + item.w > container.offsetWidth) {
          item.x = container.offsetWidth - item.w;
          item.vx *= -bounce;
        }
        item.el.style.position = "absolute";
        item.el.style.left = item.x + "px";
        item.el.style.top = item.y + "px";
        item.el.style.transition = "none";
      });
      animFrame.current = requestAnimationFrame(step);
    };
    animFrame.current = requestAnimationFrame(step);
  }, [init, containerRef]);

  const reset = useCallback(() => {
    cancelAnimationFrame(animFrame.current);
    items.current.forEach((item) => {
      item.el.style.position = "";
      item.el.style.left = "";
      item.el.style.top = "";
      item.el.style.transition = "all 0.8s cubic-bezier(0.23, 1, 0.32, 1)";
    });
  }, []);

  useEffect(() => () => cancelAnimationFrame(animFrame.current), []);
  return { startFall, reset };
}

// ─── Split Text ───────────────────────────────────────────────────────────────
function SplitText({ text, className, delay = 0, stagger = 30 }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <span ref={ref} className={className} style={{ display: "inline-block" }}>
      {text.split("").map((ch, i) => (
        <span key={i} style={{
          display: "inline-block",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) rotateX(0deg)" : "translateY(60px) rotateX(-90deg)",
          transition: `opacity 0.6s ease ${delay + i * stagger}ms, transform 0.6s cubic-bezier(0.23,1,0.32,1) ${delay + i * stagger}ms`,
          transformOrigin: "bottom center",
        }}>{ch === " " ? "\u00A0" : ch}</span>
      ))}
    </span>
  );
}

// ─── Blur Text ────────────────────────────────────────────────────────────────
function BlurText({ text, className, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <span ref={ref} className={className} style={{
      display: "inline-block",
      opacity: visible ? 1 : 0,
      filter: visible ? "blur(0px)" : "blur(20px)",
      transform: visible ? "scale(1)" : "scale(1.05)",
      transition: `all 1s cubic-bezier(0.23,1,0.32,1) ${delay}ms`,
    }}>{text}</span>
  );
}

// ─── Type Text ────────────────────────────────────────────────────────────────
function TypeText({ phrases, className }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = phrases[idx];
    let timeout;
    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIdx((idx + 1) % phrases.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, idx, phrases]);
  return (
    <span className={className}>
      {displayed}
      <span style={{ animation: "blink 1s infinite", borderRight: "2px solid currentColor", marginLeft: "2px" }} />
    </span>
  );
}

// ─── Counter ──────────────────────────────────────────────────────────────────
function Counter({ end, suffix = "", prefix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const startTime = Date.now();
        const tick = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * end));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// ─── Aurora Background ────────────────────────────────────────────────────────
function AuroraCanvas({ colors }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let t = 0;
    let raf;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const blobs = colors.map((c, i) => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.002,
      vy: (Math.random() - 0.5) * 0.002,
      r: 0.3 + Math.random() * 0.3,
      color: c,
      phase: i * (Math.PI * 2 / colors.length),
    }));
    const draw = () => {
      t += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      blobs.forEach(b => {
        b.x += b.vx + Math.sin(t + b.phase) * 0.001;
        b.y += b.vy + Math.cos(t + b.phase * 1.3) * 0.001;
        if (b.x < 0 || b.x > 1) b.vx *= -1;
        if (b.y < 0 || b.y > 1) b.vy *= -1;
        const grd = ctx.createRadialGradient(
          b.x * canvas.width, b.y * canvas.height, 0,
          b.x * canvas.width, b.y * canvas.height, b.r * Math.max(canvas.width, canvas.height)
        );
        grd.addColorStop(0, b.color.replace(")", ",0.18)").replace("rgb(", "rgba("));
        grd.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [colors]);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.85 }} />;
}

// ─── Tilt Card ────────────────────────────────────────────────────────────────
function TiltCard({ children, className, style }) {
  const ref = useRef(null);
  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    ref.current.style.transform = `perspective(800px) rotateY(${dx * 12}deg) rotateX(${-dy * 12}deg) scale(1.02)`;
  };
  const handleMouseLeave = () => {
    ref.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
  };
  return (
    <div ref={ref} className={className} style={{ transition: "transform 0.3s ease", ...style }}
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {children}
    </div>
  );
}

// ─── Floating Particles ───────────────────────────────────────────────────────
function Particles({ count = 60 }) {
  const particles = useRef(Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    speed: Math.random() * 0.3 + 0.1,
    opacity: Math.random() * 0.5 + 0.1,
  }))).current;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          left: `${p.x}%`,
          top: `${p.y}%`,
          width: `${p.size}px`,
          height: `${p.size}px`,
          borderRadius: "50%",
          background: "white",
          opacity: p.opacity,
          animation: `floatUp ${10 / p.speed}s linear infinite`,
          animationDelay: `${Math.random() * 10}s`,
        }} />
      ))}
    </div>
  );
}

// ─── Unique Alvryn Logo — Compass Star ────────────────────────────────────────
function AlvrynLogo({ size = 36, animated = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={animated ? { animation: "spinLogo 8s linear infinite" } : {}}>
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f5a0" />
          <stop offset="50%" stopColor="#00d9f5" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient id="logoGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      {/* Outer orbit ring */}
      <circle cx="32" cy="32" r="30" stroke="url(#logoGrad)" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
      {/* Main compass/star shape */}
      <path d="M32 4 L36 28 L60 32 L36 36 L32 60 L28 36 L4 32 L28 28 Z" fill="url(#logoGrad)" opacity="0.9" />
      {/* Inner diamond */}
      <path d="M32 20 L38 32 L32 44 L26 32 Z" fill="url(#logoGrad2)" opacity="0.95" />
      {/* Center dot */}
      <circle cx="32" cy="32" r="3" fill="white" />
      {/* Wing tips glow dots */}
      <circle cx="32" cy="4" r="2" fill="#00f5a0" />
      <circle cx="60" cy="32" r="2" fill="#00d9f5" />
      <circle cx="32" cy="60" r="2" fill="#a78bfa" />
      <circle cx="4" cy="32" r="2" fill="#f59e0b" />
    </svg>
  );
}

// ─── Magnetic Button ──────────────────────────────────────────────────────────
function MagneticBtn({ children, onClick, className, style }) {
  const ref = useRef(null);
  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    ref.current.style.transform = `translate(${dx * 0.3}px, ${dy * 0.3}px)`;
  };
  const handleMouseLeave = () => { ref.current.style.transform = "translate(0,0)"; };
  return (
    <button ref={ref} onClick={onClick} className={className}
      style={{ transition: "transform 0.3s cubic-bezier(0.23,1,0.32,1)", cursor: "pointer", ...style }}
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {children}
    </button>
  );
}

// ─── Section Themes ───────────────────────────────────────────────────────────
const SECTION_THEMES = [
  { bg: "#030008", text: "#ffffff", accent: "#00f5a0", secondary: "#00d9f5", auroraColors: ["rgb(0,245,160)", "rgb(0,217,245)", "rgb(167,139,250)"] },
  { bg: "#f0fdf4", text: "#052e16", accent: "#059669", secondary: "#0891b2", auroraColors: ["rgb(5,150,105)", "rgb(8,145,178)", "rgb(16,185,129)"] },
  { bg: "#fdf4ff", text: "#3b0764", accent: "#a855f7", secondary: "#ec4899", auroraColors: ["rgb(168,85,247)", "rgb(236,72,153)", "rgb(139,92,246)"] },
  { bg: "#fff7ed", text: "#431407", accent: "#ea580c", secondary: "#eab308", auroraColors: ["rgb(234,88,12)", "rgb(234,179,8)", "rgb(239,68,68)"] },
  { bg: "#eff6ff", text: "#0f172a", accent: "#2563eb", secondary: "#0ea5e9", auroraColors: ["rgb(37,99,235)", "rgb(14,165,233)", "rgb(99,102,241)"] },
  { bg: "#030008", text: "#ffffff", accent: "#00f5a0", secondary: "#a78bfa", auroraColors: ["rgb(0,245,160)", "rgb(167,139,250)", "rgb(0,217,245)"] },
];

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);
  const [gravityActive, setGravityActive] = useState(false);
  const gravityRef = useRef(null);
  const { startFall, reset } = useGravity(gravityRef);
  const [activeFeature, setActiveFeature] = useState(0);

  // Scroll-based theme detection
  useEffect(() => {
    const sections = document.querySelectorAll("[data-section]");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setTheme(parseInt(e.target.dataset.section));
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(s => obs.observe(s));
    const handleScroll = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => { obs.disconnect(); window.removeEventListener("scroll", handleScroll); };
  }, []);

  const currentTheme = SECTION_THEMES[theme];
  const isDark = theme === 0 || theme === 5;

  const handleGravity = () => {
    if (gravityActive) { reset(); setGravityActive(false); }
    else { startFall(); setGravityActive(true); }
  };

  const features = [
    { icon: "✈️", title: "AI Flight Search", desc: "Type naturally — \"flights from Bangalore to Goa next weekend under ₹3000\" and watch magic happen." },
    { icon: "💬", title: "WhatsApp Booking", desc: "Book your entire trip via WhatsApp. No app needed. Just message and fly." },
    { icon: "🎯", title: "Zero Fees", desc: "No hidden charges. No booking fees. What you see is exactly what you pay." },
    { icon: "🔔", title: "Smart Alerts", desc: "Price drops, gate changes, delays — all sent to your WhatsApp before you even think to check." },
    { icon: "🌍", title: "Real-time Prices", desc: "Live flight data from all major airlines. Always the freshest deals." },
    { icon: "🤝", title: "Referral Rewards", desc: "Share Alvryn. Friend books. You both save. Simple as that." },
  ];

  const destinations = [
    { city: "Goa", temp: "29°C", emoji: "🏖️", price: "₹2,499", tag: "Trending" },
    { city: "Manali", temp: "8°C", emoji: "🏔️", price: "₹3,199", tag: "Adventure" },
    { city: "Mumbai", temp: "32°C", emoji: "🌆", price: "₹1,899", tag: "Business" },
    { city: "Jaipur", temp: "25°C", emoji: "🏯", price: "₹2,099", tag: "Heritage" },
    { city: "Kerala", temp: "27°C", emoji: "🌴", price: "₹2,799", tag: "Nature" },
    { city: "Delhi", temp: "22°C", emoji: "🕌", price: "₹1,699", tag: "Capital" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Cabinet+Grotesk:wght@300;400;500;700;800&family=Fira+Code:wght@300;400;500&display=swap');
        
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Cabinet Grotesk', sans-serif; transition: background-color 0.8s ease, color 0.8s ease; overflow-x: hidden; }
        .display-font { font-family: 'Clash Display', sans-serif; }
        .mono-font { font-family: 'Fira Code', monospace; }

        @keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }
        @keyframes floatUp { 0% { transform: translateY(0); opacity: inherit; } 100% { transform: translateY(-100vh); opacity: 0; } }
        @keyframes spinLogo { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes gradShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes meteorFall { 0% { transform: translateX(0) translateY(0); opacity: 1; } 100% { transform: translateX(300px) translateY(300px); opacity: 0; } }
        @keyframes orbitSpin { from { transform: rotate(0deg) translateX(80px) rotate(0deg); } to { transform: rotate(360deg) translateX(80px) rotate(-360deg); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-16px); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes breathe { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.3); opacity: 0.6; } }

        .gradient-text {
          background: linear-gradient(135deg, #00f5a0, #00d9f5, #a78bfa, #f59e0b);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradShift 4s ease infinite;
        }

        .glass-card { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.15); }

        .btn-primary {
          background: linear-gradient(135deg, #00f5a0, #00d9f5);
          color: #000;
          border: none;
          border-radius: 100px;
          padding: 14px 32px;
          font-family: 'Cabinet Grotesk', sans-serif;
          font-weight: 700;
          font-size: 15px;
          position: relative;
          overflow: hidden;
        }
        .btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #00d9f5, #a78bfa);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .btn-primary:hover::before { opacity: 1; }
        .btn-primary span { position: relative; z-index: 1; }

        .meteor { position: absolute; width: 2px; height: 80px; background: linear-gradient(to bottom, white, transparent); transform: rotate(45deg); animation: meteorFall linear infinite; opacity: 0; }

        .feature-card {
          border-radius: 24px;
          padding: 32px;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 24px;
          padding: 1px;
          background: linear-gradient(135deg, #00f5a0, #00d9f5, #a78bfa);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .feature-card:hover::before { opacity: 1; }
        .feature-card:hover { transform: translateY(-8px); }

        .dest-card { border-radius: 20px; overflow: hidden; transition: all 0.4s cubic-bezier(0.23,1,0.32,1); cursor: pointer; }
        .dest-card:hover { transform: translateY(-12px) scale(1.02); }

        .marquee-track { animation: marquee 20s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }

        .orbit-dot { position: absolute; width: 8px; height: 8px; border-radius: 50%; top: 50%; left: 50%; margin: -4px; }
        .orbit-dot:nth-child(1) { animation: orbitSpin 3s linear infinite; background: #00f5a0; }
        .orbit-dot:nth-child(2) { animation: orbitSpin 4s linear infinite reverse; background: #00d9f5; animation-delay: -1s; }
        .orbit-dot:nth-child(3) { animation: orbitSpin 5s linear infinite; background: #a78bfa; animation-delay: -2s; }

        .float-anim { animation: float 6s ease-in-out infinite; }
        .section-transition { transition: background-color 0.8s ease, color 0.8s ease; }

        @media (max-width: 768px) {
          .hero-title { font-size: clamp(40px, 12vw, 80px) !important; }
          .nav-links { display: none !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: navScrolled ? "12px 40px" : "20px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all 0.4s ease",
        background: navScrolled
          ? isDark ? "rgba(3,0,8,0.85)" : "rgba(255,255,255,0.85)"
          : "transparent",
        backdropFilter: navScrolled ? "blur(20px)" : "none",
        borderBottom: navScrolled ? `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` : "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <AlvrynLogo size={32} />
          <span className="display-font" style={{
            fontSize: "20px", fontWeight: 700, letterSpacing: "-0.5px",
            color: isDark ? "white" : currentTheme.text,
          }}>Alvryn</span>
        </div>

        <div className="nav-links" style={{ display: "flex", gap: "36px", alignItems: "center" }}>
          {["How it works", "Features", "WhatsApp", "Reviews"].map(link => (
            <a key={link} href={`#${link.toLowerCase().replace(/ /g, "-")}`} style={{
              color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 500,
              transition: "color 0.3s",
            }}
              onMouseEnter={e => e.target.style.color = currentTheme.accent}
              onMouseLeave={e => e.target.style.color = isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)"}
            >{link}</a>
          ))}
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <MagneticBtn onClick={() => navigate("/login")} style={{
            background: "transparent",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)"}`,
            borderRadius: "100px",
            padding: "10px 24px",
            fontSize: "14px",
            fontWeight: 600,
            color: isDark ? "white" : currentTheme.text,
          }}>Sign In</MagneticBtn>
          <MagneticBtn onClick={() => navigate("/register")} className="btn-primary">
            <span>Get Started →</span>
          </MagneticBtn>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section data-section="0" style={{
        minHeight: "100vh",
        background: "#030008",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 40px 80px",
      }}>
        <AuroraCanvas colors={SECTION_THEMES[0].auroraColors} />
        <Particles count={50} />

        {/* Meteors */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="meteor" style={{
            left: `${10 + i * 12}%`,
            top: `${Math.random() * 30}%`,
            animationDuration: `${3 + i * 0.7}s`,
            animationDelay: `${i * 0.8}s`,
          }} />
        ))}

        {/* Gravity zone */}
        <div ref={gravityRef} style={{
          position: "absolute",
          top: "18%",
          right: "6%",
          width: "200px",
          height: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{ position: "relative", width: "160px", height: "160px" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px dashed rgba(255,255,255,0.12)" }} />
            <div style={{ position: "absolute", inset: "30px", borderRadius: "50%", border: "1px dashed rgba(0,245,160,0.18)" }} />
            <div style={{ position: "absolute", inset: 0 }}>
              <div className="orbit-dot" />
              <div className="orbit-dot" />
              <div className="orbit-dot" />
            </div>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AlvrynLogo size={40} animated />
            </div>
          </div>
        </div>

        {/* Gravity trigger */}
        <div
          data-gravity
          onClick={handleGravity}
          style={{
            position: "absolute",
            top: "14%",
            left: "4%",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "100px",
            padding: "8px 18px",
            fontSize: "11px",
            color: "rgba(255,255,255,0.55)",
            cursor: "pointer",
            fontFamily: "'Fira Code', monospace",
            transition: "all 0.3s",
            zIndex: 10,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#00f5a0"; e.currentTarget.style.color = "#00f5a0"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
        >
          {gravityActive ? "↑ float back" : "⚡ try gravity"}
        </div>

        {/* Hero Content */}
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: "900px" }}>
          {/* Live badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(0,245,160,0.08)", border: "1px solid rgba(0,245,160,0.25)",
            borderRadius: "100px", padding: "6px 16px 6px 8px", marginBottom: "40px",
            animation: "fadeInUp 0.8s ease forwards",
          }}>
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%", background: "#00f5a0",
              boxShadow: "0 0 8px #00f5a0", animation: "breathe 2s ease infinite", display: "inline-block",
            }} />
            <span className="mono-font" style={{ fontSize: "11px", color: "#00f5a0", letterSpacing: "1px" }}>
              NOW LIVE · INDIA'S SMARTEST TRAVEL AI
            </span>
          </div>

          {/* Title */}
          <h1 className="display-font hero-title" style={{
            fontSize: "clamp(56px, 9vw, 110px)",
            fontWeight: 700,
            lineHeight: 0.95,
            letterSpacing: "-3px",
            marginBottom: "8px",
            color: "white",
          }}>
            <SplitText text="Travel" delay={200} stagger={40} />
            <br />
            <span className="gradient-text">
              <SplitText text="Beyond" delay={600} stagger={40} />
            </span>
            <br />
            <SplitText text="Boundaries" delay={1000} stagger={35} />
          </h1>

          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.5)", marginTop: "28px", marginBottom: "16px", fontWeight: 400 }}>
            <BlurText text="Book flights. Chat on WhatsApp. Pay zero fees." delay={1400} />
          </p>

          <p className="mono-font" style={{ fontSize: "14px", color: "#00f5a0", marginBottom: "48px", minHeight: "22px" }}>
            <TypeText phrases={[
              "Search via WhatsApp instantly.",
              "\"Flights from BLR to GOA under ₹3000\"",
              "AI understands natural language.",
              "Zero booking fees. Ever.",
              "Book in 60 seconds flat.",
            ]} />
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <MagneticBtn onClick={() => navigate("/register")} className="btn-primary"
              style={{ padding: "16px 40px", fontSize: "16px", borderRadius: "100px" }}>
              <span>Start for Free →</span>
            </MagneticBtn>
            <MagneticBtn onClick={() => navigate("/login")} style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "100px", padding: "16px 40px",
              fontSize: "16px", fontWeight: 600, color: "white",
            }}>Sign In ↗</MagneticBtn>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "40px", justifyContent: "center", marginTop: "64px", flexWrap: "wrap" }}>
            {[
              { label: "Waitlist Users", val: <><Counter end={12400} suffix="+" /></> },
              { label: "Routes Covered", val: <><Counter end={847} suffix="+" /></> },
              { label: "Booking Fees", val: <span style={{ color: "#00f5a0" }}>₹0</span> },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div className="display-font" style={{ fontSize: "36px", fontWeight: 700, color: "white" }}>{s.val}</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginTop: "4px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{
          position: "absolute", bottom: "36px", left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
          animation: "float 2s ease-in-out infinite",
        }}>
          <span className="mono-font" style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", letterSpacing: "2px" }}>SCROLL</span>
          <div style={{ width: "1px", height: "36px", background: "linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)" }} />
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ background: "#00f5a0", overflow: "hidden", padding: "14px 0", position: "relative", zIndex: 5 }}>
        <div style={{ display: "flex", width: "200%" }} className="marquee-track">
          {[0, 1].map(ri => (
            <div key={ri} style={{ display: "flex", gap: "48px", alignItems: "center", paddingRight: "48px", flexShrink: 0 }}>
              {["✈️ AI-Powered Search", "🚌 Bus Booking", "💬 WhatsApp Native", "🔔 Smart Alerts", "₹ Zero Fees", "🇮🇳 Made for India", "⚡ Book in 60s", "🎯 Real-time Prices"].map((t, i) => (
                <span key={i} style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 700, fontSize: "14px", color: "#000", whiteSpace: "nowrap", letterSpacing: "0.5px" }}>{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" data-section="1" className="section-transition" style={{
        background: SECTION_THEMES[1].bg, padding: "120px 40px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.25 }}>
          <AuroraCanvas colors={SECTION_THEMES[1].auroraColors} />
        </div>
        <div style={{ position: "relative", zIndex: 2, maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <span className="mono-font" style={{ fontSize: "11px", color: SECTION_THEMES[1].accent, letterSpacing: "3px", textTransform: "uppercase" }}>How It Works</span>
            <h2 className="display-font" style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 700, color: SECTION_THEMES[1].text, letterSpacing: "-2px", marginTop: "12px", lineHeight: 1.05 }}>
              <SplitText text="Three steps." stagger={50} />
              <br />
              <span style={{ color: SECTION_THEMES[1].accent }}><SplitText text="That's all." delay={400} stagger={50} /></span>
            </h2>
          </div>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "28px" }}>
            {[
              { num: "01", title: "Search Naturally", desc: "Type or WhatsApp what you want. \"3 tickets Bangalore to Mumbai next Friday morning\" — no dropdowns.", icon: "🔍" },
              { num: "02", title: "Pick Your Flight", desc: "Best options sorted by price, duration, and airline — instantly fetched from all carriers.", icon: "✈️" },
              { num: "03", title: "Book & Fly", desc: "Confirm in one tap. Ticket lands on your WhatsApp and email in seconds.", icon: "🎉" },
            ].map((step, i) => (
              <TiltCard key={i} style={{
                background: "white", borderRadius: "24px", padding: "40px 32px",
                boxShadow: "0 4px 40px rgba(0,0,0,0.06)",
                animation: `fadeInUp 0.8s ease ${i * 200}ms both`,
              }}>
                <div className="mono-font" style={{ fontSize: "11px", color: SECTION_THEMES[1].accent, letterSpacing: "2px", marginBottom: "20px" }}>STEP {step.num}</div>
                <div style={{ fontSize: "44px", marginBottom: "20px" }}>{step.icon}</div>
                <h3 className="display-font" style={{ fontSize: "22px", fontWeight: 700, color: SECTION_THEMES[1].text, marginBottom: "10px" }}>{step.title}</h3>
                <p style={{ fontSize: "15px", color: "rgba(5,46,22,0.55)", lineHeight: 1.65 }}>{step.desc}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" data-section="2" className="section-transition" style={{
        background: SECTION_THEMES[2].bg, padding: "120px 40px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.2 }}>
          <AuroraCanvas colors={SECTION_THEMES[2].auroraColors} />
        </div>
        <div style={{ position: "relative", zIndex: 2, maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <span className="mono-font" style={{ fontSize: "11px", color: SECTION_THEMES[2].accent, letterSpacing: "3px", textTransform: "uppercase" }}>Features</span>
            <h2 className="display-font" style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 700, color: SECTION_THEMES[2].text, letterSpacing: "-2px", marginTop: "12px" }}>
              <BlurText text="Built different." /><br />
              <span style={{ color: SECTION_THEMES[2].accent }}><BlurText text="Designed for you." delay={300} /></span>
            </h2>
          </div>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {features.map((f, i) => (
              <div key={i} className="feature-card" onClick={() => setActiveFeature(i)} style={{
                background: activeFeature === i
                  ? `linear-gradient(135deg, ${SECTION_THEMES[2].accent}15, ${SECTION_THEMES[2].secondary}15)`
                  : "rgba(255,255,255,0.65)",
                border: `1px solid ${activeFeature === i ? SECTION_THEMES[2].accent : "rgba(0,0,0,0.06)"}`,
                animation: `fadeInUp 0.6s ease ${i * 100}ms both`,
              }}>
                <div style={{ fontSize: "36px", marginBottom: "16px" }}>{f.icon}</div>
                <h3 className="display-font" style={{ fontSize: "18px", fontWeight: 700, color: SECTION_THEMES[2].text, marginBottom: "8px" }}>{f.title}</h3>
                <p style={{ fontSize: "14px", color: "rgba(59,7,100,0.55)", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESTINATIONS ── */}
      <section data-section="3" className="section-transition" style={{
        background: SECTION_THEMES[3].bg, padding: "120px 40px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.18 }}>
          <AuroraCanvas colors={SECTION_THEMES[3].auroraColors} />
        </div>
        <div style={{ position: "relative", zIndex: 2, maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "56px", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <span className="mono-font" style={{ fontSize: "11px", color: SECTION_THEMES[3].accent, letterSpacing: "3px", textTransform: "uppercase" }}>Destinations</span>
              <h2 className="display-font" style={{ fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 700, color: SECTION_THEMES[3].text, letterSpacing: "-2px", marginTop: "12px" }}>
                Where will you go?
              </h2>
            </div>
            <MagneticBtn onClick={() => navigate("/search")} style={{
              background: SECTION_THEMES[3].accent, border: "none", borderRadius: "100px",
              padding: "12px 28px", fontSize: "14px", fontWeight: 700, color: "white",
            }}>Search All Flights →</MagneticBtn>
          </div>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {destinations.map((dest, i) => (
              <TiltCard key={i} className="dest-card" style={{
                background: "white", boxShadow: "0 8px 40px rgba(0,0,0,0.07)",
                animation: `fadeInUp 0.6s ease ${i * 100}ms both`,
              }}>
                <div style={{
                  height: "130px",
                  background: `linear-gradient(135deg, ${SECTION_THEMES[3].accent}30, ${SECTION_THEMES[3].secondary}30)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "60px", position: "relative",
                }}>
                  {dest.emoji}
                  <span style={{
                    position: "absolute", top: "12px", right: "12px",
                    background: SECTION_THEMES[3].accent, color: "white",
                    fontSize: "10px", fontWeight: 700, padding: "3px 10px",
                    borderRadius: "100px", fontFamily: "'Fira Code', monospace",
                  }}>{dest.tag}</span>
                </div>
                <div style={{ padding: "18px 22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <h3 className="display-font" style={{ fontSize: "20px", fontWeight: 700, color: SECTION_THEMES[3].text }}>{dest.city}</h3>
                    <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.35)" }}>{dest.temp}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.35)" }}>from Bangalore</span>
                    <span className="display-font" style={{ fontSize: "18px", fontWeight: 800, color: SECTION_THEMES[3].accent }}>{dest.price}</span>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHATSAPP ── */}
      <section id="whatsapp" data-section="4" className="section-transition" style={{
        background: SECTION_THEMES[4].bg, padding: "120px 40px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.18 }}>
          <AuroraCanvas colors={SECTION_THEMES[4].auroraColors} />
        </div>
        <div style={{ position: "relative", zIndex: 2, maxWidth: "1000px", margin: "0 auto" }}>
          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
            <div>
              <span className="mono-font" style={{ fontSize: "11px", color: SECTION_THEMES[4].accent, letterSpacing: "3px", textTransform: "uppercase" }}>WhatsApp Native</span>
              <h2 className="display-font" style={{
                fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 700, color: SECTION_THEMES[4].text,
                letterSpacing: "-2px", marginTop: "16px", marginBottom: "22px", lineHeight: 1.1,
              }}>
                Your travel agent<br /><span style={{ color: SECTION_THEMES[4].accent }}>lives in WhatsApp</span>
              </h2>
              <p style={{ fontSize: "16px", color: "rgba(15,23,42,0.55)", lineHeight: 1.7, marginBottom: "32px" }}>
                No app downloads. No complicated forms. Just message us like you'd text a friend — and we handle everything.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "36px" }}>
                {["Message us what you need", "We search all airlines instantly", "Confirm with one tap", "Ticket sent to your WhatsApp"].map((step, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{
                      width: "26px", height: "26px", borderRadius: "50%",
                      background: `linear-gradient(135deg, ${SECTION_THEMES[4].accent}, ${SECTION_THEMES[4].secondary})`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "11px", fontWeight: 700, color: "white", flexShrink: 0,
                    }}>{i + 1}</div>
                    <span style={{ fontSize: "15px", color: SECTION_THEMES[4].text, fontWeight: 500 }}>{step}</span>
                  </div>
                ))}
              </div>
              <a href="https://wa.me/14155238886?text=join%20meal-biggest" target="_blank" rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "10px",
                  background: "#25D366", color: "white", borderRadius: "100px",
                  padding: "14px 32px", fontWeight: 700, fontSize: "15px",
                  textDecoration: "none", transition: "transform 0.3s, box-shadow 0.3s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(37,211,102,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <span style={{ fontSize: "20px" }}>💬</span> Try WhatsApp Bot
              </a>
            </div>

            {/* WhatsApp mockup */}
            <div className="float-anim">
              <div style={{ background: "white", borderRadius: "28px", boxShadow: "0 40px 80px rgba(0,0,0,0.13)", overflow: "hidden", maxWidth: "320px", margin: "0 auto" }}>
                <div style={{ background: "#075E54", padding: "14px 18px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <AlvrynLogo size={22} />
                  </div>
                  <div>
                    <div style={{ color: "white", fontWeight: 600, fontSize: "14px" }}>Alvryn Travel AI</div>
                    <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "11px" }}>● Online</div>
                  </div>
                </div>
                <div style={{ background: "#ECE5DD", padding: "14px", display: "flex", flexDirection: "column", gap: "10px", minHeight: "260px" }}>
                  {[
                    { from: "user", text: "Flights from Bangalore to Goa this weekend under ₹3000" },
                    { from: "bot", text: "✈️ Found 3 flights!\n\n🥇 IndiGo 6E-234\n   BLR→GOI | 1h 10m\n   Sat 6AM | ₹2,499\n\nReply 1 to book!" },
                    { from: "user", text: "1" },
                    { from: "bot", text: "🎉 Booking confirmed!\nTicket sent to you ✅" },
                  ].map((msg, i) => (
                    <div key={i} style={{ alignSelf: msg.from === "user" ? "flex-end" : "flex-start", maxWidth: "82%" }}>
                      <div style={{
                        background: msg.from === "user" ? "#DCF8C6" : "white",
                        borderRadius: msg.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        padding: "9px 13px", fontSize: "12px", lineHeight: 1.5, color: "#000",
                        whiteSpace: "pre-line", boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                        animation: `fadeInUp 0.4s ease ${i * 250}ms both`,
                      }}>{msg.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section id="reviews" data-section="5" className="section-transition" style={{
        background: SECTION_THEMES[5].bg, padding: "120px 40px", position: "relative", overflow: "hidden",
      }}>
        <AuroraCanvas colors={SECTION_THEMES[5].auroraColors} />
        <Particles count={30} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <span className="mono-font" style={{ fontSize: "11px", color: "#00f5a0", letterSpacing: "3px", textTransform: "uppercase" }}>Reviews</span>
            <h2 className="display-font" style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 700, color: "white", letterSpacing: "-2px", marginTop: "12px" }}>
              <BlurText text="Loved by travelers" />
            </h2>
          </div>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {[
              { name: "Priya S.", city: "Bengaluru", text: "Booked my Goa trip in literally 2 minutes on WhatsApp. No joke. This is the future of travel.", stars: 5 },
              { name: "Arjun M.", city: "Chennai", text: "The AI understood 'cheapest flight Sunday morning' — no dropdowns, no forms. Genuinely insane.", stars: 5 },
              { name: "Sneha R.", city: "Hyderabad", text: "Zero fees is real. I saved ₹400 compared to MakeMyTrip on the exact same IndiGo flight.", stars: 5 },
            ].map((r, i) => (
              <TiltCard key={i} className="glass-card" style={{
                borderRadius: "24px", padding: "32px",
                background: "rgba(255,255,255,0.04)",
                animation: `fadeInUp 0.6s ease ${i * 150}ms both`,
              }}>
                <div style={{ fontSize: "18px", marginBottom: "16px", letterSpacing: "1px" }}>{"⭐".repeat(r.stars)}</div>
                <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.75)", lineHeight: 1.65, marginBottom: "24px", fontStyle: "italic" }}>"{r.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #00f5a0, #00d9f5)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "15px", fontWeight: 700, color: "#000",
                  }}>{r.name[0]}</div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "white" }}>{r.name}</div>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{r.city}</div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>

          {/* Stats */}
          <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginTop: "72px" }}>
            {[
              { n: 12400, s: "+", label: "Users on Waitlist" },
              { n: 98, s: "%", label: "Satisfaction Rate" },
              { n: 847, s: "+", label: "Routes Available" },
              { n: 60, s: "s", label: "Avg. Booking Time" },
            ].map((stat, i) => (
              <div key={i} className="glass-card" style={{
                borderRadius: "20px", padding: "28px 20px", textAlign: "center",
                background: "rgba(255,255,255,0.04)",
                animation: `fadeInUp 0.6s ease ${i * 100}ms both`,
              }}>
                <div className="display-font" style={{ fontSize: "38px", fontWeight: 700, color: "#00f5a0" }}>
                  <Counter end={stat.n} suffix={stat.s} />
                </div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "6px" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background: "#030008", padding: "120px 40px", position: "relative", overflow: "hidden", textAlign: "center" }}>
        <AuroraCanvas colors={["rgb(0,245,160)", "rgb(0,217,245)", "rgb(167,139,250)", "rgb(245,158,11)"]} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <AlvrynLogo size={64} animated />
          <h2 className="display-font" style={{
            fontSize: "clamp(40px, 6vw, 80px)", fontWeight: 700, color: "white",
            letterSpacing: "-3px", marginTop: "32px", marginBottom: "20px", lineHeight: 1,
          }}>
            <SplitText text="Ready to fly?" stagger={60} />
          </h2>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.45)", marginBottom: "48px" }}>
            <BlurText text="Join 12,400+ travelers on the waitlist." delay={500} />
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <MagneticBtn onClick={() => navigate("/register")} className="btn-primary"
              style={{ padding: "18px 48px", fontSize: "17px", borderRadius: "100px" }}>
              <span>Join Waitlist Free →</span>
            </MagneticBtn>
            <MagneticBtn onClick={() => navigate("/search")} style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "100px", padding: "18px 48px", fontSize: "17px", fontWeight: 600, color: "white",
            }}>Search Flights</MagneticBtn>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#000", padding: "44px 40px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <AlvrynLogo size={26} />
            <span className="display-font" style={{ color: "white", fontWeight: 700, fontSize: "17px" }}>Alvryn</span>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "13px", marginLeft: "6px" }}>· Travel Beyond Boundaries</span>
          </div>
          <div style={{ display: "flex", gap: "28px" }}>
            {["Privacy", "Terms", "Contact", "Careers"].map(l => (
              <a key={l} href="#" style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#00f5a0"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.35)"}
              >{l}</a>
            ))}
          </div>
          <span className="mono-font" style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px" }}>
            © 2026 Alvryn · Made in Bangalore 🇮🇳
          </span>
        </div>
      </footer>
    </>
  );
}