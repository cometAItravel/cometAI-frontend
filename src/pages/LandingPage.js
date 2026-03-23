import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const API = "https://cometai-backend.onrender.com";

/* ─── BlurText ─── */
const buildKF = (from, steps) => {
  const keys = new Set([...Object.keys(from), ...steps.flatMap(s => Object.keys(s))]);
  const kf = {}; keys.forEach(k => { kf[k] = [from[k], ...steps.map(s => s[k])]; }); return kf;
};
function BlurText({ text = '', delay = 100, animateBy = 'words', direction = 'top', stepDuration = 0.45, once = false, style = {} }) {
  const els = animateBy === 'words' ? text.split(' ') : text.split('');
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '-60px' });
  const from = useMemo(() => direction === 'top' ? { filter: 'blur(16px)', opacity: 0, y: -60 } : { filter: 'blur(16px)', opacity: 0, y: 60 }, [direction]);
  const to = useMemo(() => [{ filter: 'blur(7px)', opacity: 0.4, y: direction === 'top' ? 12 : -12 }, { filter: 'blur(0px)', opacity: 1, y: 0 }], [direction]);
  const steps = to.length + 1; const dur = stepDuration * (steps - 1);
  const times = Array.from({ length: steps }, (_, i) => steps === 1 ? 0 : i / (steps - 1));
  return (
    <div ref={ref} style={{ display: 'flex', flexWrap: 'wrap', ...style }}>
      {els.map((seg, i) => (
        <motion.span key={i} initial={from} animate={inView ? buildKF(from, to) : from}
          transition={{ duration: dur, times, delay: (i * delay) / 1000, ease: 'easeOut' }}
          style={{ display: 'inline-block', willChange: 'transform,filter,opacity' }}>
          {seg === '' ? '\u00A0' : seg}{animateBy === 'words' && i < els.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </div>
  );
}

/* ─── SplitText ─── */
function SplitText({ text = '', delay = 40, style = {}, once = true }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '-40px' });
  return (
    <div ref={ref} style={{ display: 'flex', flexWrap: 'wrap', ...style }}>
      {text.split('').map((ch, i) => (
        <motion.span key={i} initial={{ opacity: 0, y: 30, rotateX: -90 }}
          animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 30, rotateX: -90 }}
          transition={{ duration: 0.5, delay: i * delay / 1000, ease: [0.215, 0.61, 0.355, 1] }}
          style={{ display: 'inline-block', transformOrigin: 'bottom', whiteSpace: ch === ' ' ? 'pre' : 'normal' }}>
          {ch === ' ' ? '\u00A0' : ch}
        </motion.span>
      ))}
    </div>
  );
}

/* ─── Counter ─── */
function Counter({ to, prefix = '', suffix = '', duration = 2 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-40px' });
  useEffect(() => {
    if (!inView) { setVal(0); return; }
    let start = null;
    const step = ts => { if (!start) start = ts; const p = Math.min((ts - start) / (duration * 1000), 1); setVal(Math.floor(p * to)); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }, [inView, to, duration]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* ─── GravityCard ─── */
function GravityCard({ children, style = {}, intensity = 15 }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, shine: { x: 50, y: 50 } });
  const onMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (y - 0.5) * -intensity, y: (x - 0.5) * intensity, shine: { x: x * 100, y: y * 100 } });
  };
  const onLeave = () => setTilt({ x: 0, y: 0, shine: { x: 50, y: 50 } });
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ ...style, transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition: 'transform 0.15s ease', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at ${tilt.shine.x}% ${tilt.shine.y}%, rgba(255,255,255,0.12) 0%, transparent 60%)`, pointerEvents: 'none', zIndex: 1, borderRadius: 'inherit' }} />
      {children}
    </div>
  );
}

/* ─── TypeText ─── */
function TypeText({ texts = [], speed = 80, pause = 2000, style = {} }) {
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = texts[idx];
    if (!deleting && typed.length < current.length) {
      const t = setTimeout(() => setTyped(current.slice(0, typed.length + 1)), speed);
      return () => clearTimeout(t);
    }
    if (!deleting && typed.length === current.length) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }
    if (deleting && typed.length > 0) {
      const t = setTimeout(() => setTyped(typed.slice(0, -1)), speed / 2);
      return () => clearTimeout(t);
    }
    if (deleting && typed.length === 0) {
      setDeleting(false);
      setIdx((idx + 1) % texts.length);
    }
  }, [typed, deleting, idx, texts, speed, pause]);
  return <span style={style}>{typed}<span style={{ animation: 'blink .7s ease infinite' }}>|</span></span>;
}

/* ─── BounceCard ─── */
function BounceCard({ children, style = {}, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.9 }}
      transition={{ duration: 0.7, delay, ease: [0.34, 1.56, 0.64, 1] }}
      whileHover={{ y: -8, scale: 1.02 }}
      style={style}>
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeFeature, setActiveFeature] = useState(0);
  const [hue, setHue] = useState(0);
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroO = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => { fetch(`${API}/test`).catch(() => {}); const t = setInterval(() => fetch(`${API}/test`).catch(() => {}), 14 * 60 * 1000); return () => clearInterval(t); }, []);
  useEffect(() => { const r = () => setIsMobile(window.innerWidth < 768); window.addEventListener('resize', r); return () => window.removeEventListener('resize', r); }, []);

  // animated hue shift
  useEffect(() => {
    let frame;
    const tick = () => { setHue(h => (h + 0.3) % 360); frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  // canvas — aurora mesh
  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    let w = cv.width = window.innerWidth;
    let h = cv.height = window.innerHeight;
    const blobs = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: 200 + Math.random() * 300,
      hue: i * 60,
    }));
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.8 + 0.3,
      op: Math.random() * 0.6 + 0.2,
      vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
      tw: Math.random() * Math.PI * 2, ts: Math.random() * 0.015 + 0.003,
    }));
    const meteors = []; let mt = 0;
    const spawn = () => meteors.push({ x: Math.random() * w * 0.7, y: Math.random() * h * 0.4, len: 100 + Math.random() * 150, spd: 7 + Math.random() * 6, ang: Math.PI / 6 + Math.random() * 0.3, life: 0, max: 35 + Math.random() * 20 });
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      // aurora blobs
      blobs.forEach(b => {
        b.x += b.vx; b.y += b.vy;
        if (b.x < -b.r) b.x = w + b.r; if (b.x > w + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = h + b.r; if (b.y > h + b.r) b.y = -b.r;
        b.hue = (b.hue + 0.2) % 360;
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, `hsla(${b.hue},80%,65%,0.12)`);
        g.addColorStop(0.5, `hsla(${b.hue + 30},70%,55%,0.06)`);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      });
      // particles
      particles.forEach(p => {
        p.tw += p.ts; p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        const op = p.op * (0.5 + 0.5 * Math.sin(p.tw));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${op})`; ctx.fill();
      });
      // meteors
      mt++; if (mt > 80 + Math.random() * 60) { spawn(); mt = 0; }
      meteors.forEach((m, i) => {
        m.life++;
        const op = Math.sin((m.life / m.max) * Math.PI) * 0.8;
        const tx = Math.cos(m.ang) * m.len; const ty = Math.sin(m.ang) * m.len;
        const gr = ctx.createLinearGradient(m.x, m.y, m.x - tx, m.y - ty);
        gr.addColorStop(0, `rgba(255,255,255,${op})`); gr.addColorStop(0.3, `rgba(200,220,255,${op * 0.6})`); gr.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - tx, m.y - ty);
        ctx.strokeStyle = gr; ctx.lineWidth = 1.5; ctx.stroke();
        m.x += Math.cos(m.ang) * m.spd; m.y += Math.sin(m.ang) * m.spd;
        if (m.life >= m.max) meteors.splice(i, 1);
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { w = cv.width = window.innerWidth; h = cv.height = window.innerHeight; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', onResize); };
  }, []);

  const accentA = `hsl(${hue},85%,65%)`;
  const accentB = `hsl(${(hue + 60) % 360},80%,60%)`;
  const accentC = `hsl(${(hue + 120) % 360},85%,65%)`;
  const gradText = `linear-gradient(135deg,${accentA},${accentB},${accentC})`;

  const features = [
    { icon: '🤖', title: 'AI Flight Search', desc: 'Type naturally — "cheap BLR to BOM tomorrow morning" — instant smart results with zero effort', tag: 'Powered by AI' },
    { icon: '📱', title: 'WhatsApp Booking', desc: 'The only travel platform where you can complete a full booking via WhatsApp. No app needed.', tag: 'Industry first' },
    { icon: '⚡', title: 'Real-Time Data', desc: 'Live flight schedules from AviationStack API. Always accurate, always current.', tag: 'Live data' },
    { icon: '💸', title: 'Zero Booking Fees', desc: 'No service fee. No convenience fee. No hidden charges. What you see is exactly what you pay.', tag: 'Always free' },
    { icon: '🔐', title: 'Bank-Grade Security', desc: '256-bit SSL on every transaction. Your payment data is encrypted end-to-end.', tag: 'Fully secure' },
    { icon: '🚌', title: 'Bus Booking', desc: 'Book intercity buses across India — coming very soon with real-time seat selection.', tag: 'Coming soon' },
  ];

  const stats = [
    { n: 500, suffix: '+', label: 'Daily Flights', prefix: '' },
    { n: 0, suffix: '', label: 'Booking Fees', prefix: '₹' },
    { n: 14, suffix: '+', label: 'Indian Cities', prefix: '' },
    { n: 99, suffix: '%', label: 'Uptime', prefix: '' },
  ];

  const reviews = [
    { name: 'Arjun K.', city: 'Bangalore', text: 'Booked my Mumbai flight in 2 minutes on WhatsApp. Never thought travel booking could be this effortless.', avatar: '👨‍💻', rating: 5 },
    { name: 'Priya S.', city: 'Chennai', text: 'Just typed "cheap flight to Goa this weekend" and got perfect results instantly. The AI actually understands.', avatar: '👩‍💼', rating: 5 },
    { name: 'Rahul M.', city: 'Hyderabad', text: 'Zero booking fees is real. Saved ₹800 compared to other platforms on the exact same flight.', avatar: '👨‍🎓', rating: 5 },
  ];

  return (
    <div style={{ background: '#030008', minHeight: '100vh', overflowX: 'hidden', fontFamily: "'DM Sans',sans-serif", color: '#f0f0ff', position: 'relative' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{border-radius:2px;background:rgba(255,255,255,.3);}
        html{scroll-behavior:smooth;}
        @keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
        @keyframes floatA{0%,100%{transform:translateY(0) rotate(0deg);}50%{transform:translateY(-20px) rotate(4deg);}}
        @keyframes floatB{0%,100%{transform:translateY(0);}50%{transform:translateY(-14px);}}
        @keyframes ringRot{from{transform:rotateX(70deg) rotateZ(0deg);}to{transform:rotateX(70deg) rotateZ(360deg);}}
        @keyframes ringRot2{from{transform:rotateX(55deg) rotateZ(0deg);}to{transform:rotateX(55deg) rotateZ(-360deg);}}
        @keyframes scanLine{0%{top:-1px;opacity:0;}5%{opacity:.4;}95%{opacity:.4;}100%{top:100%;opacity:0;}}
        @keyframes gradShift{0%{background-position:0% 50%;}50%{background-position:100% 50%;}100%{background-position:0% 50%;}}
        @keyframes borderGlow{0%,100%{box-shadow:0 0 0 0 rgba(255,255,255,.1);}50%{box-shadow:0 0 0 4px rgba(255,255,255,.05);}}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.5;}}
        @keyframes dockBounce{0%,100%{transform:scale(1) translateY(0);}50%{transform:scale(1.2) translateY(-8px);}}
        @keyframes grain{0%,100%{transform:translate(0,0);}25%{transform:translate(-1%,-2%);}50%{transform:translate(2%,1%);}75%{transform:translate(-1%,2%);}}}
        .grain-fx{position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.025;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-size:200px;animation:grain 8s steps(10) infinite;}
        .scan{position:fixed;left:0;width:100%;height:1px;z-index:2;pointer-events:none;background:linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent);animation:scanLine 12s linear infinite;}
        .nav-a{text-decoration:none;font-size:13px;color:rgba(240,240,255,.55);transition:color .2s;position:relative;padding-bottom:2px;}
        .nav-a::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:white;transition:width .3s;}
        .nav-a:hover{color:white;}.nav-a:hover::after{width:100%;}
        .btn-primary{border:none;border-radius:14px;font-family:'DM Sans',sans-serif;font-weight:700;cursor:pointer;position:relative;overflow:hidden;transition:all .3s cubic-bezier(.23,1,.32,1);letter-spacing:.3px;color:white;}
        .btn-primary:hover{transform:translateY(-3px);}
        .btn-ghost{background:transparent;border:1px solid rgba(255,255,255,.18);color:rgba(240,240,255,.8);border-radius:14px;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .3s;backdrop-filter:blur(12px);}
        .btn-ghost:hover{border-color:rgba(255,255,255,.45);background:rgba(255,255,255,.06);color:white;transform:translateY(-2px);}
        .feat-pill{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:9px;letter-spacing:1px;text-transform:uppercase;font-family:'Space Mono',monospace;}
        .dock-item{display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;transition:transform .2s;}
        .dock-item:hover{animation:dockBounce .4s ease;}
        @media(max-width:768px){
          .hero-flex{flex-direction:column!important;text-align:center;align-items:center!important;}
          .planet-wrap{display:none!important;}
          .nav-links{display:none!important;}
          .stats-grid{grid-template-columns:repeat(2,1fr)!important;}
          .feat-grid{grid-template-columns:1fr!important;}
          .reviews-grid{grid-template-columns:1fr!important;}
          .hero-sec{padding:88px 20px 60px!important;}
          .sec{padding:60px 20px!important;}
          .cta-inner{padding:40px 20px!important;}
          .footer-row{flex-direction:column!important;gap:14px!important;text-align:center!important;}
          .nav-inner{padding:13px 20px!important;}
          .hero-btns{justify-content:center!important;}
        }
        @media(min-width:769px){
          .feat-grid{grid-template-columns:repeat(3,1fr)!important;}
          .reviews-grid{grid-template-columns:repeat(3,1fr)!important;}
          .stats-grid{grid-template-columns:repeat(4,1fr)!important;}
        }
      `}</style>

      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', inset: 0, background: '#030008', zIndex: -1 }} />
      <div className="grain-fx" />
      <div className="scan" />

      {/* animated grid */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)`,
        backgroundSize: '80px 80px',
        maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%,black 20%,transparent 80%)' }} />

      {/* ── NAV ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(3,0,8,.75)', backdropFilter: 'blur(28px)', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        <div className="nav-inner" style={{ maxWidth: 1160, margin: '0 auto', padding: '14px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* LOGO */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 }} onClick={() => navigate('/')}>
            {/* Alvryn icon — diamond A with wings */}
            <div style={{ width: 36, height: 36, flexShrink: 0, position: 'relative' }}>
              <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                <defs>
                  <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={accentA} />
                    <stop offset="50%" stopColor={accentB} />
                    <stop offset="100%" stopColor={accentC} />
                  </linearGradient>
                </defs>
                {/* diamond body */}
                <polygon points="18,3 30,18 18,33 6,18" fill="url(#iconGrad)" opacity="0.9" />
                {/* inner A shape */}
                <polygon points="18,8 25,22 11,22" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" />
                <line x1="13" y1="19" x2="23" y2="19" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" />
                {/* wing lines */}
                <line x1="2" y1="18" x2="6" y2="18" stroke={accentA} strokeWidth="1.5" opacity="0.7" />
                <line x1="30" y1="18" x2="34" y2="18" stroke={accentC} strokeWidth="1.5" opacity="0.7" />
              </svg>
            </div>
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 19, fontWeight: 800, letterSpacing: '1px', background: gradText, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Alvryn</span>
          </div>

          {/* NAV LINKS */}
          <div className="nav-links" style={{ display: 'flex', gap: 28 }}>
            {[['How it works', '#how'], ['Features', '#features'], ['WhatsApp', '#whatsapp'], ['Reviews', '#reviews']].map(([l, h]) => (
              <a key={l} href={h} className="nav-a">{l}</a>
            ))}
          </div>

          {/* BUTTONS */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-ghost" onClick={() => navigate('/login')} style={{ padding: '8px 20px', fontSize: 13 }}>Sign In</button>
            <button className="btn-primary" onClick={() => navigate('/register')} style={{ padding: '8px 20px', fontSize: 13, background: gradText }}>
              Get Started →
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════ HERO ══════════ */}
      <section ref={heroRef} className="hero-sec" style={{ position: 'relative', zIndex: 2, minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '90px 40px 60px', overflow: 'hidden' }}>
        <motion.div style={{ maxWidth: 1160, margin: '0 auto', width: '100%', y: heroY, opacity: heroO }}>
          <div className="hero-flex" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 48 }}>

            {/* LEFT */}
            <div style={{ maxWidth: 640 }}>
              {/* badge */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .1 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 24, padding: '7px 18px', backdropFilter: 'blur(12px)' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 10px #34d399', animation: 'pulse 2s ease infinite' }} />
                <span style={{ fontSize: 11, color: 'rgba(240,240,255,.7)', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'Space Mono',monospace" }}>Now Live · Travel Reimagined</span>
              </motion.div>

              {/* MAIN TITLE — SplitText */}
              <div style={{ marginBottom: 12, overflow: 'hidden' }}>
                <SplitText text="Travel Beyond" delay={35} once={true}
                  style={{ fontFamily: "'Syne',sans-serif", fontSize: isMobile ? 'clamp(38px,9vw,54px)' : 'clamp(54px,7vw,90px)', fontWeight: 800, lineHeight: 1, letterSpacing: '-2px', color: 'white', justifyContent: 'flex-start' }} />
                <div style={{ overflow: 'hidden' }}>
                  <SplitText text="Boundaries." delay={30} once={true}
                    style={{ fontFamily: "'Syne',sans-serif", fontSize: isMobile ? 'clamp(38px,9vw,54px)' : 'clamp(54px,7vw,90px)', fontWeight: 800, lineHeight: 1, letterSpacing: '-2px', background: gradText, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', justifyContent: 'flex-start', marginTop: 4 }} />
                </div>
              </div>

              {/* typetext */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: .6 }}
                style={{ fontFamily: "'Space Mono',monospace", fontSize: isMobile ? 12 : 14, color: 'rgba(255,255,255,.45)', marginBottom: 28, minHeight: 22 }}>
                <TypeText texts={['Book flights with AI in seconds.', 'Search via WhatsApp instantly.', 'Zero booking fees. Always.', 'India\'s smartest travel platform.']} speed={70} pause={2200} />
              </motion.div>

              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: .7 }}
                style={{ fontSize: isMobile ? 15 : 17, color: 'rgba(240,240,255,.5)', lineHeight: 1.75, marginBottom: 36, fontWeight: 300, maxWidth: 500 }}>
                Alvryn is India's most intelligent travel booking platform. Search flights naturally, book via WhatsApp, pay zero fees — all powered by AI.
              </motion.p>

              {/* CTAs */}
              <motion.div className="hero-btns" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.9, duration: .7 }}
                style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 56 }}>
                <button className="btn-primary" onClick={() => navigate('/register')} style={{ padding: '16px 40px', fontSize: 16, background: gradText, boxShadow: `0 14px 40px rgba(255,255,255,.1)` }}>
                  Start for Free ✈
                </button>
                <button className="btn-ghost" onClick={() => navigate('/login')} style={{ padding: '16px 32px', fontSize: 16 }}>
                  Sign In →
                </button>
              </motion.div>

              {/* STATS */}
              <motion.div className="stats-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1, duration: .8 }}
                style={{ display: 'grid', gap: 20 }}>
                {stats.map((st, i) => (
                  <div key={i} style={{ animationDelay: `${2.1 + i * .1}s` }}>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, background: gradText, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>
                      <Counter to={st.n} prefix={st.prefix} suffix={st.suffix} duration={2} />
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginTop: 3, letterSpacing: '.5px' }}>{st.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* PLANET */}
            <motion.div className="planet-wrap" initial={{ opacity: 0, scale: .7, rotate: -15 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: .3, duration: 1.3, ease: 'easeOut' }}
              style={{ position: 'relative', width: 440, height: 440, flexShrink: 0 }}>
              {/* glow */}
              <div style={{ position: 'absolute', inset: 30, borderRadius: '50%', background: `radial-gradient(circle,${accentA}25 0%,transparent 70%)`, filter: 'blur(30px)', animation: 'floatB 6s ease-in-out infinite' }} />
              {/* sphere */}
              <div style={{ position: 'absolute', inset: 55, borderRadius: '50%', overflow: 'hidden',
                background: `radial-gradient(ellipse at 32% 28%,rgba(255,255,255,.12) 0%,rgba(${parseInt(accentA.match(/\d+/)[0])},100,200,.08) 30%,rgba(5,2,20,.95) 65%,rgba(2,0,10,1) 100%)`,
                boxShadow: `inset -30px -25px 50px rgba(0,0,0,.9),inset 15px 12px 30px rgba(255,255,255,.06),0 0 70px ${accentA}25,0 0 130px ${accentB}12` }}>
                {[20,40,60,80,100,120,140,160].map(d => <div key={d} style={{ position:'absolute',inset:0,borderRadius:'50%',border:'1px solid rgba(255,255,255,.04)',transform:`rotateY(${d}deg)` }} />)}
                {[30,60,90,120,150].map(d => <div key={d} style={{ position:'absolute',inset:0,borderRadius:'50%',border:'1px solid rgba(255,255,255,.03)',transform:`rotateX(${d}deg)` }} />)}
              </div>
              {/* rings */}
              <div style={{ position:'absolute',inset:6,animation:'ringRot 9s linear infinite' }}>
                <div style={{ position:'absolute',inset:0,borderRadius:'50%',border:`1.5px solid ${accentA}40`,boxShadow:`0 0 14px ${accentA}20` }}>
                  <div style={{ position:'absolute',top:-6,left:'50%',width:12,height:12,borderRadius:'50%',background:accentA,boxShadow:`0 0 18px ${accentA}`,transform:'translateX(-50%)' }}/>
                </div>
              </div>
              <div style={{ position:'absolute',inset:-30,animation:'ringRot2 14s linear infinite' }}>
                <div style={{ position:'absolute',inset:0,borderRadius:'50%',border:`1px solid ${accentB}28` }}>
                  <div style={{ position:'absolute',bottom:-5,right:'20%',width:8,height:8,borderRadius:'50%',background:accentB,boxShadow:`0 0 12px ${accentB}` }}/>
                </div>
              </div>
              {/* planes */}
              {[{t:'5%',l:'6%',r:'22deg',d:'3.3s',dl:'0s'},{t:'73%',l:'77%',r:'-14deg',d:'4.1s',dl:'.9s'},{t:'80%',l:'5%',r:'40deg',d:'2.8s',dl:'1.5s'},{t:'14%',l:'81%',r:'-28deg',d:'3.7s',dl:'.4s'}].map((p,i)=>(
                <div key={i} style={{ position:'absolute',top:p.t,left:p.l,fontSize:15,animationName:'floatA',animationDuration:p.d,animationDelay:p.dl,animationTimingFunction:'ease-in-out',animationIterationCount:'infinite',transform:`rotate(${p.r})`,filter:`drop-shadow(0 0 10px ${accentA})` }}>✈</div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <div style={{ position:'absolute',bottom:24,left:'50%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:5,opacity:.3 }}>
          <span style={{ fontSize:8,color:'rgba(255,255,255,.6)',letterSpacing:'2.5px',textTransform:'uppercase',fontFamily:"'Space Mono',monospace" }}>Scroll</span>
          <div style={{ width:1,height:32,background:'linear-gradient(180deg,rgba(255,255,255,.6),transparent)' }}/>
        </div>
      </section>

      {/* ══════════ DOCK ══════════ */}
      <section className="sec" style={{ position:'relative',zIndex:2,padding:'40px 40px 80px' }}>
        <motion.div initial={{ opacity:0,y:30 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:false,margin:'-60px' }} transition={{ duration:.7 }}
          style={{ maxWidth:600,margin:'0 auto',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:28,padding:'16px 32px',display:'flex',alignItems:'center',justifyContent:'space-around',gap:8,backdropFilter:'blur(20px)' }}>
          {[{icon:'✈️',label:'Flights',active:true},{icon:'🚌',label:'Buses',active:false},{icon:'🚂',label:'Trains',active:false},{icon:'🏨',label:'Hotels',active:false},{icon:'🤖',label:'AI Search',active:false}].map((item,i)=>(
            <div key={i} className="dock-item" onClick={()=>navigate('/search')}
              style={{ opacity:item.active?1:.45 }}>
              <div style={{ width:48,height:48,borderRadius:14,background:item.active?gradText:'rgba(255,255,255,.06)',border:`1px solid ${item.active?'transparent':'rgba(255,255,255,.08)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,boxShadow:item.active?`0 8px 24px rgba(255,255,255,.1)`:'none' }}>
                {item.icon}
              </div>
              <span style={{ fontSize:10,color:'rgba(255,255,255,.5)',fontFamily:"'Space Mono',monospace",letterSpacing:'.5px' }}>{item.label}</span>
              {!item.active&&<span style={{ fontSize:8,color:'rgba(255,200,0,.6)',fontFamily:"'Space Mono',monospace" }}>soon</span>}
            </div>
          ))}
        </motion.div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section id="how" className="sec" style={{ position:'relative',zIndex:2,padding:'80px 40px' }}>
        <div style={{ maxWidth:1160,margin:'0 auto' }}>
          <div style={{ textAlign:'center',marginBottom:64 }}>
            <div style={{ fontFamily:"'Space Mono',monospace",fontSize:10,color:'rgba(255,255,255,.35)',letterSpacing:'3px',textTransform:'uppercase',marginBottom:16 }}>— How it works</div>
            <BlurText text="Three steps to anywhere" delay={90} animateBy="words" direction="top" stepDuration={0.4}
              style={{ fontFamily:"'Syne',sans-serif",fontSize:'clamp(28px,4vw,52px)',fontWeight:800,color:'white',letterSpacing:'-1px',justifyContent:'center' }} />
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:24 }}>
            {[
              { n:'01',t:'Create Account',d:"Sign up free in 30 seconds. No credit card required. Just your email and you're in.",icon:'👤' },
              { n:'02',t:'Search Your Flight',d:'Use AI text search, structured search, or WhatsApp. Filter by price, time, airline.',icon:'🔍' },
              { n:'03',t:'Book & Fly',d:'Pay with card, UPI or netbanking. Confirmation email sent instantly. Zero booking fees.',icon:'🚀' },
            ].map((s,i)=>(
              <BounceCard key={i} delay={i*.1} style={{ position:'relative' }}>
                <GravityCard style={{ background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:22,padding:34 }}>
                  <div style={{ position:'absolute',top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${accentA}50,transparent)` }}/>
                  <div style={{ fontFamily:"'Syne',sans-serif",fontSize:72,fontWeight:900,color:'rgba(255,255,255,.03)',position:'absolute',top:10,right:16,lineHeight:1 }}>{s.n}</div>
                  <div style={{ fontSize:36,marginBottom:14,filter:`drop-shadow(0 0 12px ${accentA}90)` }}>{s.icon}</div>
                  <div style={{ fontFamily:"'Space Mono',monospace",fontSize:10,color:'rgba(255,255,255,.3)',letterSpacing:'2px',marginBottom:12 }}>{s.n}</div>
                  <h3 style={{ fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,color:'white',marginBottom:10 }}>{s.t}</h3>
                  <p style={{ fontSize:14,color:'rgba(240,240,255,.45)',lineHeight:1.75,fontWeight:300 }}>{s.d}</p>
                </GravityCard>
              </BounceCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section id="features" className="sec" style={{ position:'relative',zIndex:2,padding:'80px 40px 100px' }}>
        <div style={{ maxWidth:1160,margin:'0 auto' }}>
          <div style={{ textAlign:'center',marginBottom:64 }}>
            <div style={{ fontFamily:"'Space Mono',monospace",fontSize:10,color:'rgba(255,255,255,.35)',letterSpacing:'3px',textTransform:'uppercase',marginBottom:16 }}>— Features</div>
            <BlurText text="Everything you need to fly" delay={80} animateBy="words" direction="top" stepDuration={0.38}
              style={{ fontFamily:"'Syne',sans-serif",fontSize:'clamp(28px,4vw,52px)',fontWeight:800,color:'white',letterSpacing:'-1px',justifyContent:'center' }} />
          </div>
          <div className="feat-grid" style={{ display:'grid',gap:18 }}>
            {features.map((f,i)=>(
              <BounceCard key={i} delay={i*.07}>
                <GravityCard intensity={10}
                  style={{ background: activeFeature===i ? 'rgba(255,255,255,.07)' : 'rgba(255,255,255,.03)', border:`1px solid ${activeFeature===i?'rgba(255,255,255,.14)':'rgba(255,255,255,.06)'}`,borderRadius:20,padding:28,cursor:'default',transition:'all .3s' }}
                  onMouseEnter={()=>setActiveFeature(i)}>
                  <div style={{ fontSize:34,marginBottom:14,filter:`drop-shadow(0 0 12px ${accentA}90)` }}>{f.icon}</div>
                  <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:10 }}>
                    <h3 style={{ fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:700,color:'white' }}>{f.title}</h3>
                    <span className="feat-pill" style={{ background:`rgba(255,255,255,.06)`,border:'1px solid rgba(255,255,255,.1)',color:'rgba(255,255,255,.5)' }}>{f.tag}</span>
                  </div>
                  <p style={{ fontSize:13,color:'rgba(240,240,255,.45)',lineHeight:1.75,fontWeight:300 }}>{f.desc}</p>
                  <div style={{ position:'absolute',bottom:0,left:0,height:2,width: activeFeature===i?'100%':'40%',background:gradText,borderRadius:1,transition:'width .4s ease' }}/>
                </GravityCard>
              </BounceCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ WHATSAPP ══════════ */}
      <section id="whatsapp" style={{ position:'relative',zIndex:2,padding:'80px 40px' }}>
        <div style={{ maxWidth:1060,margin:'0 auto' }}>
          <BounceCard>
            <GravityCard intensity={6} style={{ background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:28,padding:isMobile?'32px 20px':'56px 52px',position:'relative',overflow:'hidden',backdropFilter:'blur(20px)' }}>
              <div style={{ position:'absolute',top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${accentA}60,${accentB}50,transparent)` }}/>
              <div style={{ display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:44,alignItems:'center' }}>
                <div>
                  <div style={{ fontFamily:"'Space Mono',monospace",fontSize:10,color:'rgba(255,255,255,.35)',letterSpacing:'3px',textTransform:'uppercase',marginBottom:20 }}>— WhatsApp Bot</div>
                  <BlurText text="Book any flight on WhatsApp" delay={75} animateBy="words" direction="top" stepDuration={0.35}
                    style={{ fontFamily:"'Syne',sans-serif",fontSize:'clamp(24px,3.5vw,40px)',fontWeight:800,color:'white',marginBottom:16,letterSpacing:'-1px',flexWrap:'wrap' }}/>
                  <p style={{ fontSize:14,color:'rgba(240,240,255,.45)',lineHeight:1.85,marginBottom:26,fontWeight:300,maxWidth:420 }}>No app to download. No account needed. Just message our bot and book your flight in minutes.</p>
                  {['Message: "flights bangalore to mumbai tomorrow"','Choose your flight and enter your name','Reply CONFIRM — booking ID arrives instantly!'].map((s,i)=>(
                    <div key={i} style={{ display:'flex',gap:12,alignItems:'flex-start',marginBottom:12 }}>
                      <div style={{ width:22,height:22,borderRadius:'50%',background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'rgba(255,255,255,.6)',flexShrink:0,marginTop:1,fontFamily:"'Space Mono',monospace" }}>{i+1}</div>
                      <span style={{ fontSize:13,color:'rgba(240,240,255,.55)',lineHeight:1.6 }}>{s}</span>
                    </div>
                  ))}
                  <div style={{ marginTop:28,background:'rgba(37,211,102,.1)',border:'1px solid rgba(37,211,102,.25)',borderRadius:12,padding:'14px 18px',display:'inline-flex',alignItems:'center',gap:12 }}>
                    <span style={{ fontSize:22 }}>📱</span>
                    <div>
                      <div style={{ fontSize:10,color:'rgba(110,231,183,.5)',fontFamily:"'Space Mono',monospace",letterSpacing:'1.5px',marginBottom:2 }}>WHATSAPP NUMBER</div>
                      <div style={{ fontSize:15,color:'#34d399',fontWeight:700 }}>+1-415-523-8886</div>
                    </div>
                  </div>
                </div>
                {/* chat */}
                <div style={{ background:'#0b120b',borderRadius:22,overflow:'hidden',border:'1px solid rgba(37,211,102,.15)',boxShadow:'0 20px 60px rgba(0,0,0,.5)' }}>
                  <div style={{ background:'#075e54',padding:'12px 18px',display:'flex',alignItems:'center',gap:10 }}>
                    <div style={{ width:36,height:36,borderRadius:'50%',background:gradText,display:'flex',alignItems:'center',justifyContent:'center',fontSize:17 }}>
                      <svg viewBox="0 0 36 36" fill="none" style={{ width:22,height:22 }}>
                        <polygon points="18,3 30,18 18,33 6,18" fill="rgba(255,255,255,.9)" opacity="0.8"/>
                        <polygon points="18,8 25,22 11,22" fill="none" stroke="rgba(0,0,0,.6)" strokeWidth="1.5"/>
                        <line x1="13" y1="19" x2="23" y2="19" stroke="rgba(0,0,0,.6)" strokeWidth="1.5"/>
                      </svg>
                    </div>
                    <div><div style={{ fontSize:13,color:'white',fontWeight:600 }}>Alvryn Travel Bot</div><div style={{ fontSize:11,color:'rgba(255,255,255,.6)' }}>Online</div></div>
                  </div>
                  <div style={{ padding:16 }}>
                    {[
                      {r:false,m:'✈️ Hi! I can help you book flights.\nTry: "flights bangalore to mumbai tomorrow"'},
                      {r:true,m:'flights bangalore to mumbai tomorrow'},
                      {r:false,m:'✈️ Flights BLR → BOM\n\n1. IndiGo  06:00→08:05  ₹3,499\n2. Air India  09:30→11:45  ₹4,200\n3. SpiceJet  14:00→16:10  ₹2,899\n\nReply with a number to book'},
                      {r:true,m:'1'},
                      {r:false,m:'✅ IndiGo selected!\n⏰ 06:00 AM · ₹3,499\n\nWhat is your full name?'},
                    ].map((msg,i)=>(
                      <div key={i} style={{ display:'flex',justifyContent:msg.r?'flex-end':'flex-start',marginBottom:8 }}>
                        <div style={{ background:msg.r?'#005c4b':'rgba(255,255,255,.08)',borderRadius:msg.r?'14px 14px 2px 14px':'14px 14px 14px 2px',padding:'9px 13px',maxWidth:'82%' }}>
                          <div style={{ fontSize:12,color:'rgba(255,255,255,.85)',whiteSpace:'pre-wrap',lineHeight:1.55 }}>{msg.m}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GravityCard>
          </BounceCard>
        </div>
      </section>

      {/* ══════════ REVIEWS ══════════ */}
      <section id="reviews" className="sec" style={{ position:'relative',zIndex:2,padding:'80px 40px' }}>
        <div style={{ maxWidth:1160,margin:'0 auto' }}>
          <div style={{ textAlign:'center',marginBottom:60 }}>
            <div style={{ fontFamily:"'Space Mono',monospace",fontSize:10,color:'rgba(255,255,255,.35)',letterSpacing:'3px',textTransform:'uppercase',marginBottom:16 }}>— Early users</div>
            <BlurText text="Travellers love Alvryn" delay={80} animateBy="words" direction="top" stepDuration={0.38}
              style={{ fontFamily:"'Syne',sans-serif",fontSize:'clamp(26px,4vw,50px)',fontWeight:800,color:'white',letterSpacing:'-1px',justifyContent:'center' }}/>
          </div>
          <div className="reviews-grid" style={{ display:'grid',gap:18 }}>
            {reviews.map((r,i)=>(
              <BounceCard key={i} delay={i*.1}>
                <GravityCard intensity={8} style={{ background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)',borderRadius:20,padding:28 }}>
                  <div style={{ position:'absolute',top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${accentA}35,transparent)` }}/>
                  <div style={{ display:'flex',gap:3,marginBottom:14 }}>
                    {'★★★★★'.split('').map((s,j)=><span key={j} style={{ color:accentB,fontSize:14 }}>{s}</span>)}
                  </div>
                  <p style={{ fontSize:14,color:'rgba(240,240,255,.6)',lineHeight:1.75,marginBottom:20,fontStyle:'italic',fontWeight:300 }}>"{r.text}"</p>
                  <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                    <div style={{ width:38,height:38,borderRadius:'50%',background:'rgba(255,255,255,.07)',border:'1px solid rgba(255,255,255,.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18 }}>{r.avatar}</div>
                    <div>
                      <div style={{ fontSize:14,fontWeight:600,color:'white' }}>{r.name}</div>
                      <div style={{ fontSize:11,color:'rgba(255,255,255,.35)' }}>{r.city}</div>
                    </div>
                  </div>
                </GravityCard>
              </BounceCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section style={{ position:'relative',zIndex:2,padding:'100px 40px' }}>
        <div style={{ maxWidth:780,margin:'0 auto' }}>
          <BounceCard>
            <GravityCard intensity={5} style={{ background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.1)',borderRadius:30,padding:isMobile?'48px 24px':'64px 56px',textAlign:'center',position:'relative',overflow:'hidden',backdropFilter:'blur(24px)' }}>
              <div style={{ position:'absolute',top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${accentA}70,${accentB}60,transparent)` }}/>
              <div style={{ position:'absolute',bottom:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${accentC}40,transparent)` }}/>
              <div style={{ position:'absolute',inset:0,background:`radial-gradient(ellipse at 50% 0%,${accentA}10 0%,transparent 60%)`,pointerEvents:'none' }}/>

              <BlurText text="Ready for takeoff?" delay={100} animateBy="words" direction="top" stepDuration={0.45}
                style={{ fontFamily:"'Syne',sans-serif",fontSize:'clamp(32px,5vw,62px)',fontWeight:800,lineHeight:1.08,marginBottom:16,letterSpacing:'-1.5px',
                  background:gradText,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',justifyContent:'center' }}/>

              <motion.p initial={{ opacity:0,y:14 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:false }} transition={{ delay:.3,duration:.6 }}
                style={{ fontSize:16,color:'rgba(240,240,255,.4)',marginBottom:36,fontWeight:300,lineHeight:1.7 }}>
                Join India's smartest travel platform. No fees. AI-powered. WhatsApp-ready.
              </motion.p>

              <motion.div initial={{ opacity:0,scale:.92 }} whileInView={{ opacity:1,scale:1 }} viewport={{ once:false }} transition={{ delay:.5,duration:.5 }}
                style={{ display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap' }}>
                <button className="btn-primary" onClick={()=>navigate('/register')} style={{ padding:'17px 48px',fontSize:17,background:gradText,boxShadow:`0 14px 44px rgba(255,255,255,.08)` }}>
                  Create Free Account →
                </button>
                <button className="btn-ghost" onClick={()=>navigate('/login')} style={{ padding:'17px 38px',fontSize:17 }}>
                  Sign In
                </button>
              </motion.div>

              <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:false }} transition={{ delay:.7,duration:.5 }}
                style={{ fontSize:11,color:'rgba(255,255,255,.2)',marginTop:24,fontFamily:"'Space Mono',monospace",letterSpacing:'1px' }}>
                ✓ Free forever &nbsp;&nbsp; ✓ No credit card &nbsp;&nbsp; ✓ Zero booking fees
              </motion.p>
            </GravityCard>
          </BounceCard>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ position:'relative',zIndex:2,borderTop:'1px solid rgba(255,255,255,.06)',padding:'36px 40px' }}>
        <div className="footer-row" style={{ maxWidth:1160,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16 }}>
          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
            <div style={{ width:28,height:28 }}>
              <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%',height:'100%' }}>
                <defs><linearGradient id="fGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={accentA}/><stop offset="100%" stopColor={accentC}/></linearGradient></defs>
                <polygon points="18,3 30,18 18,33 6,18" fill="url(#fGrad)" opacity="0.8"/>
                <polygon points="18,8 25,22 11,22" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"/>
                <line x1="13" y1="19" x2="23" y2="19" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"/>
              </svg>
            </div>
            <span style={{ fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,color:'rgba(255,255,255,.4)',letterSpacing:'.5px' }}>Alvryn</span>
          </div>
          <p style={{ fontSize:12,color:'rgba(255,255,255,.18)' }}>© 2026 Alvryn · India's AI-powered travel platform</p>
          <div style={{ display:'flex',gap:20 }}>
            {['Privacy','Terms','Contact'].map(l=><span key={l} style={{ fontSize:12,color:'rgba(255,255,255,.25)',cursor:'pointer' }}>{l}</span>)}
          </div>
        </div>
      </footer>
    </div>
  );
}