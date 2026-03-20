import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";

const API = "https://cometai-backend.onrender.com";

/* ── BlurText ── */
const buildKF = (from, steps) => {
  const keys = new Set([...Object.keys(from), ...steps.flatMap(s => Object.keys(s))]);
  const kf = {}; keys.forEach(k => { kf[k] = [from[k], ...steps.map(s => s[k])]; }); return kf;
};
function BlurText({ text = '', delay = 120, animateBy = 'words', direction = 'top', stepDuration = 0.4, once = false, style = {} }) {
  const els = animateBy === 'words' ? text.split(' ') : text.split('');
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '-60px' });
  const from = useMemo(() => direction === 'top' ? { filter: 'blur(14px)', opacity: 0, y: -50 } : { filter: 'blur(14px)', opacity: 0, y: 50 }, [direction]);
  const to = useMemo(() => [{ filter: 'blur(6px)', opacity: 0.4, y: direction === 'top' ? 10 : -10 }, { filter: 'blur(0px)', opacity: 1, y: 0 }], [direction]);
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

/* ── Counter ── */
function Counter({ to, duration = 1.8, prefix = '', suffix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-40px' });
  useEffect(() => {
    if (!inView) { setVal(0); return; }
    let start = null;
    const step = ts => { if (!start) start = ts; const p = Math.min((ts - start) / (duration * 1000), 1); setVal(Math.floor(p * to)); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }, [inView, to, duration]);
  return <span ref={ref}>{prefix}{val}{suffix}</span>;
}

/* ── FadeSection ── */
function FadeSection({ children, style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-80px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 36 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }} transition={{ duration: 0.7, ease: 'easeOut' }} style={style}>
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [typed, setTyped] = useState('');
  const [cur, setCur] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [scrollSection, setScrollSection] = useState(0);
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const full = 'Book smarter. Fly faster.';

  useEffect(() => { fetch(`${API}/test`).catch(() => {}); const t = setInterval(() => fetch(`${API}/test`).catch(() => {}), 14 * 60 * 1000); return () => clearInterval(t); }, []);
  useEffect(() => { const r = () => setIsMobile(window.innerWidth < 768); window.addEventListener('resize', r); return () => window.removeEventListener('resize', r); }, []);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => { if (i <= full.length) { setTyped(full.slice(0, i)); i++; } else clearInterval(iv); }, 85);
    const b = setInterval(() => setCur(c => !c), 520);
    return () => { clearInterval(iv); clearInterval(b); };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY; const h = window.innerHeight;
      if (y < h * 0.8) setScrollSection(0);
      else if (y < h * 1.8) setScrollSection(1);
      else if (y < h * 2.8) setScrollSection(2);
      else if (y < h * 3.8) setScrollSection(3);
      else setScrollSection(4);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── canvas — light particles ── */
  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    cv.width = window.innerWidth; cv.height = window.innerHeight;

    const particles = Array.from({ length: 180 }, () => ({
      x: Math.random() * cv.width, y: Math.random() * cv.height,
      r: Math.random() * 3 + 0.5,
      op: Math.random() * 0.5 + 0.1,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      tw: Math.random() * Math.PI * 2, ts: Math.random() * 0.015 + 0.003,
      hue: Math.floor(Math.random() * 60) + 200,
    }));

    const meteors = []; let mt = 0;
    const spawn = () => meteors.push({
      x: Math.random() * cv.width * 0.7, y: Math.random() * cv.height * 0.4,
      len: 80 + Math.random() * 140, spd: 6 + Math.random() * 6,
      ang: Math.PI / 6 + Math.random() * 0.3, life: 0, max: 32 + Math.random() * 20,
    });

    const draw = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      particles.forEach(p => {
        p.tw += p.ts; p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = cv.width; if (p.x > cv.width) p.x = 0;
        if (p.y < 0) p.y = cv.height; if (p.y > cv.height) p.y = 0;
        const op = p.op * (0.5 + 0.5 * Math.sin(p.tw));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},80%,60%,${op})`; ctx.fill();
        if (p.r > 2) {
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue},80%,70%,${op * 0.2})`; ctx.fill();
        }
      });
      mt++; if (mt > 100 + Math.random() * 60) { spawn(); mt = 0; }
      meteors.forEach((m, i) => {
        m.life++;
        const op = Math.sin((m.life / m.max) * Math.PI) * 0.6;
        const tx = Math.cos(m.ang) * m.len; const ty = Math.sin(m.ang) * m.len;
        const g = ctx.createLinearGradient(m.x, m.y, m.x - tx, m.y - ty);
        g.addColorStop(0, `rgba(100,100,255,${op})`);
        g.addColorStop(0.4, `rgba(150,120,255,${op * 0.6})`);
        g.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - tx, m.y - ty);
        ctx.strokeStyle = g; ctx.lineWidth = 1.5; ctx.stroke();
        m.x += Math.cos(m.ang) * m.spd; m.y += Math.sin(m.ang) * m.spd;
        if (m.life >= m.max) meteors.splice(i, 1);
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    const r = () => { cv.width = window.innerWidth; cv.height = window.innerHeight; };
    window.addEventListener('resize', r);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', r); };
  }, []);

  /* ── LIGHT THEMES per section ── */
  const themes = [
    // 0 Hero — Pearl white + soft violet
    { bg: 'linear-gradient(135deg, #f8f6ff 0%, #f0ebff 30%, #e8f4ff 60%, #f5f8ff 100%)', accent: '#6d28d9', accent2: '#8b5cf6', text: '#1e1033', sub: '#4c1d95', card: 'rgba(255,255,255,0.75)', cardBorder: 'rgba(109,40,217,0.12)', navBg: 'rgba(255,255,255,0.8)', navBorder: 'rgba(109,40,217,0.1)' },
    // 1 How it works — Soft mint + teal
    { bg: 'linear-gradient(135deg, #f0fdf9 0%, #e0faf4 30%, #ccfbf0 60%, #f0fdf9 100%)', accent: '#059669', accent2: '#10b981', text: '#064e3b', sub: '#065f46', card: 'rgba(255,255,255,0.8)', cardBorder: 'rgba(5,150,105,0.15)', navBg: 'rgba(240,253,249,0.85)', navBorder: 'rgba(5,150,105,0.12)' },
    // 2 Features — Blush + rose
    { bg: 'linear-gradient(135deg, #fff1f4 0%, #ffe4ea 30%, #ffd6e0 60%, #fff1f4 100%)', accent: '#e11d48', accent2: '#f43f5e', text: '#881337', sub: '#9f1239', card: 'rgba(255,255,255,0.8)', cardBorder: 'rgba(225,29,72,0.12)', navBg: 'rgba(255,241,244,0.85)', navBorder: 'rgba(225,29,72,0.1)' },
    // 3 WhatsApp — Sky + azure
    { bg: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 30%, #bae6fd 60%, #f0f9ff 100%)', accent: '#0284c7', accent2: '#0ea5e9', text: '#0c4a6e', sub: '#075985', card: 'rgba(255,255,255,0.8)', cardBorder: 'rgba(2,132,199,0.15)', navBg: 'rgba(240,249,255,0.85)', navBorder: 'rgba(2,132,199,0.12)' },
    // 4 CTA — Golden sunrise
    { bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 30%, #fde68a 60%, #fffbeb 100%)', accent: '#d97706', accent2: '#f59e0b', text: '#78350f', sub: '#92400e', card: 'rgba(255,255,255,0.85)', cardBorder: 'rgba(217,119,6,0.15)', navBg: 'rgba(255,251,235,0.85)', navBorder: 'rgba(217,119,6,0.1)' },
  ];

  const theme = themes[scrollSection] || themes[0];

  const features = [
    { icon: '🤖', title: 'AI Search', desc: 'Type naturally — "cheap flights BLR to BOM tomorrow" — instant results' },
    { icon: '📱', title: 'WhatsApp Booking', desc: 'Book flights directly on WhatsApp. No app download needed — ever' },
    { icon: '⚡', title: 'Real-Time Flights', desc: 'Live schedules powered by AviationStack — always up to date' },
    { icon: '💸', title: 'Zero Booking Fees', desc: 'What you see is what you pay. No hidden charges. Ever.' },
    { icon: '🔐', title: 'Bank-Grade Security', desc: '256-bit SSL encryption on every transaction. Fully secure.' },
    { icon: '🎯', title: 'Smart Filters', desc: 'Filter by time, price, airline, duration — your flight, your rules.' },
  ];

  const testimonials = [
    { name: 'Arjun K.', city: 'Bangalore', text: 'Booked my Mumbai flight in 2 minutes on WhatsApp. Insane how easy this is.', avatar: '👨‍💻' },
    { name: 'Priya S.', city: 'Chennai', text: 'Just typed "cheap flight to Goa this weekend" and got perfect results. The AI actually works!', avatar: '👩‍💼' },
    { name: 'Rahul M.', city: 'Hyderabad', text: 'Zero booking fees is real. Saved ₹800 compared to MakeMyTrip on the same flight.', avatar: '👨‍🎓' },
  ];

  return (
    <div style={{ background: theme.bg, minHeight: '100vh', overflowX: 'hidden', fontFamily: "'DM Sans',sans-serif", transition: 'background 1.6s ease', position: 'relative' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-thumb{border-radius:2px;}
        html{scroll-behavior:smooth;}
        @keyframes floatPlane{0%,100%{transform:translateY(0) rotate(var(--r,0deg));}50%{transform:translateY(-18px) rotate(var(--r,0deg));}}
        @keyframes ringA{from{transform:rotateX(70deg) rotateZ(0deg);}to{transform:rotateX(70deg) rotateZ(360deg);}}
        @keyframes ringB{from{transform:rotateX(55deg) rotateZ(40deg);}to{transform:rotateX(55deg) rotateZ(400deg);}}
        @keyframes breathe{0%,100%{transform:scale(1);}50%{transform:scale(1.06);}}
        @keyframes counterUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
        @keyframes shimText{0%{background-position:0% center;}100%{background-position:400% center;}}
        @keyframes floatBlob{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(2%,-3%) scale(1.05);}66%{transform:translate(-2%,2%) scale(0.97);}}
        @keyframes scanLine{0%{top:-1px;opacity:0;}5%{opacity:.4;}95%{opacity:.4;}100%{top:100%;opacity:0;}}

        .btn-main{border:none;border-radius:14px;font-family:'DM Sans',sans-serif;font-weight:700;cursor:pointer;position:relative;overflow:hidden;transition:all .3s cubic-bezier(.23,1,.32,1);letter-spacing:.3px;}
        .btn-main::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.25),transparent);}
        .btn-main:hover{transform:translateY(-3px);}
        .btn-out{background:transparent;border-radius:14px;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .3s;}
        .btn-out:hover{transform:translateY(-2px);}
        .feat-card{border-radius:22px;transition:all .35s cubic-bezier(.23,1,.32,1);position:relative;overflow:hidden;cursor:default;}
        .feat-card:hover{transform:translateY(-8px) perspective(800px) rotateX(-2deg);}
        .step-card{border-radius:22px;transition:all .3s;position:relative;overflow:hidden;}
        .step-card:hover{transform:translateY(-5px);}
        .review-card{border-radius:20px;transition:all .3s;position:relative;overflow:hidden;}
        .review-card:hover{transform:translateY(-4px);}
        .nav-a{text-decoration:none;font-size:13px;transition:color .2s;position:relative;padding-bottom:2px;}
        .nav-a::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1.5px;transition:width .3s;}
        .nav-a:hover::after{width:100%;}
        .scan{position:fixed;left:0;width:100%;height:1px;pointer-events:none;z-index:2;animation:scanLine 14s linear infinite;}

        @media(max-width:768px){
          .hero-flex{flex-direction:column!important;text-align:center;align-items:center!important;}
          .planet-side{display:none!important;}
          .stats-wrap{justify-content:center!important;gap:20px!important;}
          .nav-links{display:none!important;}
          .feat-grid{grid-template-columns:1fr!important;}
          .steps-grid{grid-template-columns:1fr!important;}
          .wa-grid{grid-template-columns:1fr!important;}
          .rev-grid{grid-template-columns:1fr!important;}
          .hero-btns{justify-content:center!important;}
          .hero-sec{padding:88px 20px 60px!important;}
          .sec{padding:60px 20px!important;}
          .wa-inner{padding:28px 18px!important;}
          .nav-inner{padding:13px 18px!important;}
          .cta-inner{padding:40px 20px!important;}
          .footer-wrap{flex-direction:column!important;gap:12px!important;text-align:center!important;}
        }
        @media(min-width:769px){
          .feat-grid{grid-template-columns:repeat(3,1fr)!important;}
          .steps-grid{grid-template-columns:repeat(3,1fr)!important;}
          .wa-grid{grid-template-columns:1fr 1fr!important;}
          .rev-grid{grid-template-columns:repeat(3,1fr)!important;}
        }
      `}</style>

      {/* CANVAS */}
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.6 }} />

      {/* MORPHING BG BLOBS */}
      <motion.div animate={{ background: `radial-gradient(ellipse at 15% 40%, ${theme.accent}18 0%, transparent 55%)` }} transition={{ duration: 1.8, ease: 'easeInOut' }}
        style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', animation: 'floatBlob 12s ease-in-out infinite' }} />
      <motion.div animate={{ background: `radial-gradient(ellipse at 80% 20%, ${theme.accent2}14 0%, transparent 50%)` }} transition={{ duration: 1.8 }}
        style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', animation: 'floatBlob 16s ease-in-out infinite reverse' }} />
      <motion.div animate={{ background: `radial-gradient(ellipse at 50% 85%, ${theme.accent}10 0%, transparent 45%)` }} transition={{ duration: 1.8 }}
        style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

      {/* GRID */}
      <motion.div animate={{ backgroundImage: `linear-gradient(${theme.accent}08 1px,transparent 1px),linear-gradient(90deg,${theme.accent}08 1px,transparent 1px)` }} transition={{ duration: 1.8 }}
        style={{ position: 'fixed', inset: 0, backgroundSize: '72px 72px', maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%,black 20%,transparent 80%)', zIndex: 0, pointerEvents: 'none' }} />

      {/* SCAN LINE */}
      <div className="scan" style={{ background: `linear-gradient(90deg,transparent,${theme.accent}20,transparent)` }} />

      {/* ── NAV ── */}
      <motion.nav
        animate={{ background: theme.navBg, borderBottomColor: theme.navBorder }}
        transition={{ duration: 1.6 }}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderBottom: '1px solid', boxShadow: `0 1px 24px ${theme.accent}10` }}>
        <div className="nav-inner" style={{ maxWidth: 1160, margin: '0 auto', padding: '14px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* LOGO */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 }} onClick={() => navigate('/')}>
            <motion.div animate={{ background: `linear-gradient(135deg,${theme.accent},${theme.accent2})`, boxShadow: `0 4px 16px ${theme.accent}40` }} transition={{ duration: 1.6 }}
              style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, color: 'white', flexShrink: 0 }}>☄</motion.div>
            <motion.span animate={{ color: theme.text }} transition={{ duration: 1.6 }}
              style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, letterSpacing: '.5px' }}>COMETAI</motion.span>
          </div>

          {/* NAV LINKS */}
          <div className="nav-links" style={{ display: 'flex', gap: 28 }}>
            {[['How it Works', '#how'], ['Features', '#features'], ['WhatsApp', '#whatsapp'], ['Reviews', '#reviews']].map(([l, h]) => (
              <motion.a key={l} href={h} className="nav-a" animate={{ color: `${theme.sub}cc` }} transition={{ duration: 1.6 }}
                style={{ '--underline': theme.accent }}>
                {l}
              </motion.a>
            ))}
          </div>

          {/* BUTTONS */}
          <div style={{ display: 'flex', gap: 10 }}>
            <motion.button className="btn-out" onClick={() => navigate('/login')}
              animate={{ borderColor: `${theme.accent}40`, color: theme.sub }} transition={{ duration: 1.6 }}
              style={{ padding: '8px 20px', fontSize: 13, border: '1px solid' }}>Sign In</motion.button>
            <motion.button className="btn-main" onClick={() => navigate('/register')}
              animate={{ background: `linear-gradient(135deg,${theme.accent},${theme.accent2})`, color: 'white', boxShadow: `0 8px 28px ${theme.accent}40` }}
              transition={{ duration: 1.6 }}
              style={{ padding: '8px 20px', fontSize: 13 }}>Get Started →</motion.button>
          </div>
        </div>
      </motion.nav>

      {/* ══════════ HERO ══════════ */}
      <section className="hero-sec" style={{ position: 'relative', zIndex: 2, minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '90px 40px 60px', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', width: '100%' }}>
          <div className="hero-flex" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40 }}>

            {/* LEFT */}
            <div style={{ maxWidth: 640 }}>
              {/* badge */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .1 }}>
                <motion.div animate={{ background: `${theme.accent}12`, borderColor: `${theme.accent}35` }} transition={{ duration: 1.6 }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28, border: '1px solid', borderRadius: 24, padding: '7px 18px' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                  <motion.span animate={{ color: theme.sub }} transition={{ duration: 1.6 }} style={{ fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'Space Mono',monospace" }}>Now Live · AI Travel Platform</motion.span>
                </motion.div>
              </motion.div>

              {/* HERO TITLE */}
              <BlurText
                text="Fly Smarter. Travel Further."
                delay={130} animateBy="words" direction="top" stepDuration={0.55} once={true}
                style={{ fontFamily: "'Syne',sans-serif", fontSize: isMobile ? 'clamp(36px,9vw,52px)' : 'clamp(52px,7vw,86px)', fontWeight: 800, lineHeight: 1.02, letterSpacing: '-2.5px', marginBottom: 16, color: theme.text, flexWrap: 'wrap' }}
              />

              {/* subtitles */}
              <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: .7 }}
                style={{ fontSize: isMobile ? 15 : 18, color: `${theme.sub}cc`, lineHeight: 1.75, marginBottom: 10, fontWeight: 300, maxWidth: 520 }}>
                India's most intelligent travel platform.
              </motion.p>
              <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: .7 }}
                style={{ fontSize: isMobile ? 14 : 16, color: `${theme.sub}88`, lineHeight: 1.75, marginBottom: 30, fontWeight: 300, maxWidth: 480 }}>
                Book flights with AI, WhatsApp, or classic search — zero fees, real-time data.
              </motion.p>

              {/* typewriter */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: .6 }}>
                <motion.div animate={{ color: theme.accent }} transition={{ duration: 1.6 }}
                  style={{ fontFamily: "'Space Mono',monospace", fontSize: isMobile ? 11 : 13, marginBottom: 30, minHeight: 20, letterSpacing: '.5px' }}>
                  ✦ {typed}{cur ? '|' : ' '}
                </motion.div>
              </motion.div>

              {/* CTAs */}
              <motion.div className="hero-btns" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2, duration: .7 }}
                style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 52 }}>
                <motion.button className="btn-main" onClick={() => navigate('/register')}
                  animate={{ background: `linear-gradient(135deg,${theme.accent},${theme.accent2})`, boxShadow: `0 12px 36px ${theme.accent}45` }}
                  transition={{ duration: 1.6 }} style={{ padding: '16px 40px', fontSize: 16, color: 'white' }}>
                  Start for Free ✈
                </motion.button>
                <motion.button className="btn-out" onClick={() => navigate('/login')}
                  animate={{ borderColor: `${theme.accent}40`, color: theme.sub }} transition={{ duration: 1.6 }}
                  style={{ padding: '16px 32px', fontSize: 16, border: '1px solid' }}>
                  Sign In →
                </motion.button>
              </motion.div>

              {/* stats */}
              <motion.div className="stats-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: .8 }}
                style={{ display: 'flex', gap: 36, flexWrap: 'wrap' }}>
                {[{ n: 500, s: '+', l: 'Daily Flights' }, { n: 0, pre: '₹', l: 'Booking Fees' }, { n: 14, s: '+', l: 'Indian Cities' }, { n: 100, s: '%', l: 'Real Data' }].map((st, i) => (
                  <div key={i} style={{ animation: `counterUp .6s ease ${2.2 + i * .1}s both` }}>
                    <motion.div animate={{ color: theme.accent }} transition={{ duration: 1.6 }}
                      style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, lineHeight: 1 }}>
                      <Counter to={st.n} duration={1.8} prefix={st.pre || ''} suffix={st.s || ''} />
                    </motion.div>
                    <div style={{ fontSize: 11, color: `${theme.sub}66`, marginTop: 3, letterSpacing: '.5px' }}>{st.l}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* PLANET — light glass style */}
            <motion.div className="planet-side"
              initial={{ opacity: 0, scale: .7, rotate: -12 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: .3, duration: 1.2, ease: 'easeOut' }}
              style={{ position: 'relative', width: 420, height: 420, flexShrink: 0 }}>
              {/* glow */}
              <motion.div animate={{ background: `radial-gradient(circle,${theme.accent}20 0%,transparent 70%)` }} transition={{ duration: 1.6 }}
                style={{ position: 'absolute', inset: 20, borderRadius: '50%', filter: 'blur(32px)', animation: 'breathe 6s ease-in-out infinite' }} />
              {/* glass sphere */}
              <motion.div animate={{ boxShadow: `inset -30px -24px 48px rgba(0,0,0,.08),inset 20px 16px 32px rgba(255,255,255,.6),0 0 60px ${theme.accent}20,0 0 120px ${theme.accent}10` }} transition={{ duration: 1.6 }}
                style={{ position: 'absolute', inset: 50, borderRadius: '50%', background: `radial-gradient(ellipse at 32% 28%,rgba(255,255,255,.95) 0%,${theme.accent}18 40%,${theme.accent}08 70%,rgba(255,255,255,.3) 100%)`, overflow: 'hidden', backdropFilter: 'blur(8px)' }}>
                {[20, 40, 60, 80, 100, 120, 140, 160].map(d => (
                  <motion.div key={d} animate={{ borderColor: `${theme.accent}15` }} transition={{ duration: 1.6 }}
                    style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid', transform: `rotateY(${d}deg)` }} />
                ))}
                {[30, 60, 90, 120, 150].map(d => (
                  <motion.div key={d} animate={{ borderColor: `${theme.accent}10` }} transition={{ duration: 1.6 }}
                    style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid', transform: `rotateX(${d}deg)` }} />
                ))}
              </motion.div>
              {/* rings */}
              <div style={{ position: 'absolute', inset: 8, animation: 'ringA 9s linear infinite' }}>
                <motion.div animate={{ borderColor: `${theme.accent}35` }} transition={{ duration: 1.6 }}
                  style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1.5px solid' }}>
                  <motion.div animate={{ background: theme.accent, boxShadow: `0 0 16px ${theme.accent}` }} transition={{ duration: 1.6 }}
                    style={{ position: 'absolute', top: -6, left: '50%', width: 12, height: 12, borderRadius: '50%', transform: 'translateX(-50%)' }} />
                </motion.div>
              </div>
              <div style={{ position: 'absolute', inset: -28, animation: 'ringB 14s linear infinite' }}>
                <motion.div animate={{ borderColor: `${theme.accent2}25` }} transition={{ duration: 1.6 }}
                  style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid' }}>
                  <motion.div animate={{ background: theme.accent2 }} transition={{ duration: 1.6 }}
                    style={{ position: 'absolute', top: -5, right: '20%', width: 8, height: 8, borderRadius: '50%' }} />
                </motion.div>
              </div>
              {/* planes */}
              {[{ t: '6%', l: '8%', r: '20deg', d: '3.4s', dl: '0s' }, { t: '74%', l: '78%', r: '-12deg', d: '4.2s', dl: '.8s' }, { t: '82%', l: '6%', r: '38deg', d: '2.9s', dl: '1.4s' }, { t: '15%', l: '82%', r: '-30deg', d: '3.8s', dl: '.4s' }].map((p, i) => (
                <motion.div key={i} animate={{ filter: `drop-shadow(0 0 10px ${theme.accent}cc)`, color: theme.accent }} transition={{ duration: 1.6 }}
                  style={{ position: 'absolute', top: p.t, left: p.l, fontSize: 16, animationName: 'floatPlane', animationDuration: p.d, animationDelay: p.dl, animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', '--r': p.r, transform: `rotate(${p.r})` }}>✈</motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* scroll hint */}
        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, opacity: .35 }}>
          <motion.span animate={{ color: theme.sub }} transition={{ duration: 1.6 }} style={{ fontSize: 8, letterSpacing: '2.5px', textTransform: 'uppercase', fontFamily: "'Space Mono',monospace" }}>Scroll</motion.span>
          <motion.div animate={{ background: `linear-gradient(180deg,${theme.accent},transparent)` }} transition={{ duration: 1.6 }} style={{ width: 1, height: 32 }} />
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section id="how" className="sec" style={{ position: 'relative', zIndex: 2, padding: '110px 40px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <FadeSection>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <motion.p animate={{ color: theme.accent }} transition={{ duration: 1.6 }} style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14 }}>— How it works</motion.p>
              <BlurText text="Three steps to anywhere" delay={90} animateBy="words" direction="top" stepDuration={0.38}
                style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(28px,4vw,50px)', fontWeight: 800, color: theme.text, letterSpacing: '-1px', justifyContent: 'center' }} />
            </div>
          </FadeSection>
          <div className="steps-grid" style={{ display: 'grid', gap: 22 }}>
            {[
              { n: '01', t: 'Create Account', d: "Sign up free in 30 seconds. No credit card required. Just your email and you're in.", icon: '👤' },
              { n: '02', t: 'Search Your Flight', d: 'AI text search or structured search. Filter by price, time, airline, duration.', icon: '🔍' },
              { n: '03', t: 'Book & Fly', d: 'Pay with card, UPI or netbanking. Instant confirmation email. Zero booking fees.', icon: '🚀' },
            ].map((s, i) => (
              <motion.div key={i} className="step-card"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: '-60px' }} transition={{ delay: i * .12, duration: .6 }}
                whileHover={{ boxShadow: `0 20px 50px ${theme.accent}18` }}
                style={{ padding: 34, background: theme.card, border: `1px solid ${theme.cardBorder}`, boxShadow: `0 4px 24px ${theme.accent}08` }}>
                <motion.div animate={{ background: `linear-gradient(90deg,transparent,${theme.accent}25,transparent)` }} transition={{ duration: 1.6 }}
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1 }} />
                <motion.p animate={{ color: `${theme.accent}10` }} transition={{ duration: 1.6 }}
                  style={{ fontFamily: "'Syne',sans-serif", fontSize: 72, fontWeight: 900, position: 'absolute', top: 10, right: 16, lineHeight: 1 }}>{s.n}</motion.p>
                <div style={{ fontSize: 36, marginBottom: 14, filter: `drop-shadow(0 0 8px ${theme.accent}60)` }}>{s.icon}</div>
                <motion.p animate={{ color: theme.accent }} transition={{ duration: 1.6 }} style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '2px', marginBottom: 12 }}>{s.n}</motion.p>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 700, color: theme.text, marginBottom: 10 }}>{s.t}</h3>
                <p style={{ fontSize: 14, color: `${theme.sub}88`, lineHeight: 1.75, fontWeight: 300 }}>{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section id="features" className="sec" style={{ position: 'relative', zIndex: 2, padding: '80px 40px 110px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <FadeSection>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <motion.p animate={{ color: theme.accent }} transition={{ duration: 1.6 }} style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14 }}>— Features</motion.p>
              <BlurText text="Everything you need to fly" delay={80} animateBy="words" direction="top" stepDuration={0.35}
                style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(28px,4vw,50px)', fontWeight: 800, color: theme.text, letterSpacing: '-1px', justifyContent: 'center' }} />
            </div>
          </FadeSection>
          <div className="feat-grid" style={{ display: 'grid', gap: 18 }}>
            {features.map((f, i) => (
              <motion.div key={i} className="feat-card"
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: '-60px' }} transition={{ delay: i * .08, duration: .55 }}
                whileHover={{ boxShadow: `0 24px 60px ${theme.accent}18,0 0 0 1px ${theme.accent}20` }}
                style={{ padding: 30, background: theme.card, border: `1px solid ${theme.cardBorder}`, boxShadow: `0 4px 24px ${theme.accent}06` }}>
                <motion.div animate={{ background: `radial-gradient(ellipse at 10% 10%,${theme.accent}08 0%,transparent 55%)` }} transition={{ duration: 1.6 }}
                  style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 22 }} />
                <div style={{ fontSize: 36, marginBottom: 16, filter: `drop-shadow(0 0 8px ${theme.accent}50)` }}>{f.icon}</div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700, color: theme.text, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: `${theme.sub}88`, lineHeight: 1.75, fontWeight: 300 }}>{f.desc}</p>
                <motion.div animate={{ background: `linear-gradient(90deg,${theme.accent},transparent)` }} transition={{ duration: 1.6 }}
                  style={{ position: 'absolute', bottom: 0, left: 0, height: 2, width: '40%', borderRadius: 1 }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ WHATSAPP ══════════ */}
      <section id="whatsapp" style={{ position: 'relative', zIndex: 2, padding: '80px 40px' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <motion.div className="wa-inner"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: '-60px' }} transition={{ duration: .7 }}
            style={{ background: theme.card, border: `1px solid ${theme.cardBorder}`, borderRadius: 30, padding: '56px 52px', position: 'relative', overflow: 'hidden', boxShadow: `0 8px 48px ${theme.accent}10` }}>
            <motion.div animate={{ background: `linear-gradient(90deg,transparent,${theme.accent}40,${theme.accent2}30,transparent)` }} transition={{ duration: 1.6 }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1 }} />
            <div className="wa-grid" style={{ display: 'grid', gap: 44, alignItems: 'center' }}>
              <div>
                <motion.p animate={{ color: theme.accent }} transition={{ duration: 1.6 }} style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 20 }}>— WhatsApp Bot</motion.p>
                <BlurText text="Book any flight on WhatsApp" delay={75} animateBy="words" direction="top" stepDuration={0.35}
                  style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 800, color: theme.text, marginBottom: 16, letterSpacing: '-1px', flexWrap: 'wrap' }} />
                <p style={{ fontSize: 14, color: `${theme.sub}88`, lineHeight: 1.85, marginBottom: 26, fontWeight: 300, maxWidth: 420 }}>No app to download. No account needed. Just send a WhatsApp message and book your flight in minutes.</p>
                {['Message: "flights bangalore to mumbai tomorrow"', 'Choose your flight and enter your name', 'Reply CONFIRM — booking ID arrives instantly!'].map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                    <motion.div animate={{ background: `${theme.accent}15`, borderColor: `${theme.accent}35`, color: theme.accent }} transition={{ duration: 1.6 }}
                      style={{ width: 22, height: 22, borderRadius: '50%', border: '1px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, flexShrink: 0, marginTop: 1, fontFamily: "'Space Mono',monospace" }}>{i + 1}</motion.div>
                    <span style={{ fontSize: 13, color: `${theme.sub}88`, lineHeight: 1.6 }}>{s}</span>
                  </div>
                ))}
                <div style={{ marginTop: 28, background: 'rgba(37,211,102,.08)', border: '1px solid rgba(37,211,102,.25)', borderRadius: 12, padding: '14px 18px', display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 22 }}>📱</span>
                  <div>
                    <div style={{ fontSize: 10, color: 'rgba(5,150,105,.6)', fontFamily: "'Space Mono',monospace", letterSpacing: '1.5px', marginBottom: 2 }}>WHATSAPP NUMBER</div>
                    <div style={{ fontSize: 15, color: '#059669', fontWeight: 700 }}>+1-415-523-8886</div>
                  </div>
                </div>
              </div>
              {/* chat */}
              <div style={{ background: '#f0fdf4', borderRadius: 22, overflow: 'hidden', border: '1px solid rgba(5,150,105,.15)', boxShadow: '0 8px 32px rgba(5,150,105,.08)' }}>
                <div style={{ background: '#075e54', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg,${theme.accent},${theme.accent2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: 'white' }}>☄</div>
                  <div><div style={{ fontSize: 13, color: 'white', fontWeight: 600 }}>CometAI Travel Bot</div><div style={{ fontSize: 11, color: 'rgba(255,255,255,.65)' }}>Online</div></div>
                </div>
                <div style={{ padding: 16 }}>
                  {[
                    { r: false, m: '✈️ Hi! I can help you book flights.\nTry: "flights bangalore to mumbai tomorrow"' },
                    { r: true, m: 'flights bangalore to mumbai tomorrow' },
                    { r: false, m: '✈️ Flights BLR → BOM\n\n1. IndiGo  06:00→08:05  ₹3,499\n2. Air India  09:30→11:45  ₹4,200\n3. SpiceJet  14:00→16:10  ₹2,899\n\nReply with a number' },
                    { r: true, m: '1' },
                    { r: false, m: '✅ IndiGo selected!\n⏰ 06:00 AM · ₹3,499\n\nWhat is your full name?' },
                  ].map((msg, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: msg.r ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
                      <div style={{ background: msg.r ? '#dcf8c6' : 'white', borderRadius: msg.r ? '14px 14px 2px 14px' : '14px 14px 14px 2px', padding: '9px 13px', maxWidth: '82%', boxShadow: '0 1px 4px rgba(0,0,0,.08)' }}>
                        <div style={{ fontSize: 12, color: '#1a1a1a', whiteSpace: 'pre-wrap', lineHeight: 1.55 }}>{msg.m}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section id="reviews" className="sec" style={{ position: 'relative', zIndex: 2, padding: '80px 40px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <FadeSection>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <motion.p animate={{ color: theme.accent }} transition={{ duration: 1.6 }} style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14 }}>— Early Users</motion.p>
              <BlurText text="Travellers love CometAI" delay={80} animateBy="words" direction="top" stepDuration={0.35}
                style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(26px,4vw,48px)', fontWeight: 800, color: theme.text, letterSpacing: '-1px', justifyContent: 'center' }} />
            </div>
          </FadeSection>
          <div className="rev-grid" style={{ display: 'grid', gap: 18 }}>
            {testimonials.map((t, i) => (
              <motion.div key={i} className="review-card"
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: '-60px' }} transition={{ delay: i * .1, duration: .6 }}
                whileHover={{ boxShadow: `0 20px 50px ${theme.accent}14` }}
                style={{ padding: 28, background: theme.card, border: `1px solid ${theme.cardBorder}`, boxShadow: `0 4px 20px ${theme.accent}06` }}>
                <motion.div animate={{ background: `linear-gradient(90deg,transparent,${theme.accent}18,transparent)` }} transition={{ duration: 1.6 }}
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1 }} />
                <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                  {'★★★★★'.split('').map((s, j) => <motion.span key={j} animate={{ color: theme.accent2 }} transition={{ duration: 1.6 }} style={{ fontSize: 14 }}>{s}</motion.span>)}
                </div>
                <p style={{ fontSize: 14, color: `${theme.sub}99`, lineHeight: 1.75, marginBottom: 20, fontStyle: 'italic', fontWeight: 300 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <motion.div animate={{ background: `linear-gradient(135deg,${theme.accent}25,${theme.accent}10)`, borderColor: `${theme.accent}25` }} transition={{ duration: 1.6 }}
                    style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{t.avatar}</motion.div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: `${theme.sub}66` }}>{t.city}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section style={{ position: 'relative', zIndex: 2, padding: '100px 40px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <motion.div className="cta-inner"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: '-60px' }} transition={{ duration: .7 }}
            style={{ background: theme.card, border: `1px solid ${theme.cardBorder}`, borderRadius: 30, padding: '64px 56px', textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: `0 12px 60px ${theme.accent}12` }}>
            <motion.div animate={{ background: `linear-gradient(90deg,transparent,${theme.accent}50,${theme.accent2}35,transparent)` }} transition={{ duration: 1.6 }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1 }} />
            <motion.div animate={{ background: `radial-gradient(ellipse at 50% 0%,${theme.accent}10 0%,transparent 60%)` }} transition={{ duration: 1.6 }}
              style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
            <BlurText text="Ready for takeoff?" delay={100} animateBy="words" direction="top" stepDuration={0.45}
              style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(32px,5vw,60px)', fontWeight: 800, lineHeight: 1.08, marginBottom: 16, letterSpacing: '-1.5px', color: theme.text, justifyContent: 'center' }} />
            <motion.p initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ delay: .3, duration: .6 }}
              style={{ fontSize: 16, color: `${theme.sub}88`, marginBottom: 36, fontWeight: 300, lineHeight: 1.7 }}>
              Join India's smartest travel platform. No fees, no fuss — just great flights.
            </motion.p>
            <motion.div initial={{ opacity: 0, scale: .92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: false }} transition={{ delay: .5, duration: .5 }}
              style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.button className="btn-main" onClick={() => navigate('/register')}
                animate={{ background: `linear-gradient(135deg,${theme.accent},${theme.accent2})`, boxShadow: `0 12px 40px ${theme.accent}45` }}
                transition={{ duration: 1.6 }} style={{ padding: '17px 48px', fontSize: 17, color: 'white' }}>
                Create Free Account →
              </motion.button>
              <motion.button className="btn-out" onClick={() => navigate('/login')}
                animate={{ borderColor: `${theme.accent}40`, color: theme.sub }} transition={{ duration: 1.6 }}
                style={{ padding: '17px 38px', fontSize: 17, border: '1px solid' }}>
                Sign In
              </motion.button>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false }} transition={{ delay: .7, duration: .5 }}
              style={{ fontSize: 11, color: `${theme.sub}45`, marginTop: 24, fontFamily: "'Space Mono',monospace", letterSpacing: '1px' }}>
              ✓ Free forever &nbsp;&nbsp; ✓ No credit card &nbsp;&nbsp; ✓ Zero booking fees
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <motion.footer animate={{ borderTopColor: `${theme.accent}15` }} transition={{ duration: 1.6 }}
        style={{ position: 'relative', zIndex: 2, borderTop: '1px solid', padding: '36px 40px' }}>
        <div className="footer-wrap" style={{ maxWidth: 1160, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <motion.div animate={{ background: `linear-gradient(135deg,${theme.accent},${theme.accent2})` }} transition={{ duration: 1.6 }}
              style={{ width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'white' }}>☄</motion.div>
            <motion.span animate={{ color: `${theme.sub}66` }} transition={{ duration: 1.6 }} style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: '.5px' }}>COMETAI TRAVEL</motion.span>
          </div>
          <motion.p animate={{ color: `${theme.text}40` }} transition={{ duration: 1.6 }} style={{ fontSize: 12 }}>© 2026 CometAI Travel · India's AI-powered travel platform</motion.p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <motion.span key={l} animate={{ color: `${theme.sub}55` }} transition={{ duration: 1.6 }} style={{ fontSize: 12, cursor: 'pointer' }}>{l}</motion.span>
            ))}
          </div>
        </div>
      </motion.footer>
    </div>
  );
}