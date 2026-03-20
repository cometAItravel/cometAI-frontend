import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";

const API = "https://cometai-backend.onrender.com";

/* ── BlurText — always re-animates on scroll ── */
const buildKF = (from, steps) => {
  const keys = new Set([...Object.keys(from), ...steps.flatMap(s => Object.keys(s))]);
  const kf = {}; keys.forEach(k => { kf[k] = [from[k], ...steps.map(s => s[k])]; }); return kf;
};

function BlurText({ text = '', delay = 120, animateBy = 'words', direction = 'top', stepDuration = 0.4, style = {}, once = false }) {
  const els = animateBy === 'words' ? text.split(' ') : text.split('');
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '-80px' });

  const from = useMemo(() =>
    direction === 'top' ? { filter: 'blur(14px)', opacity: 0, y: -55 } : { filter: 'blur(14px)', opacity: 0, y: 55 },
    [direction]);
  const to = useMemo(() => [
    { filter: 'blur(6px)', opacity: 0.4, y: direction === 'top' ? 10 : -10 },
    { filter: 'blur(0px)', opacity: 1, y: 0 },
  ], [direction]);

  const steps = to.length + 1;
  const dur = stepDuration * (steps - 1);
  const times = Array.from({ length: steps }, (_, i) => steps === 1 ? 0 : i / (steps - 1));

  return (
    <div ref={ref} style={{ display: 'flex', flexWrap: 'wrap', ...style }}>
      {els.map((seg, i) => (
        <motion.span
          key={i}
          initial={from}
          animate={inView ? buildKF(from, to) : from}
          transition={{ duration: dur, times, delay: (i * delay) / 1000, ease: 'easeOut' }}
          style={{ display: 'inline-block', willChange: 'transform,filter,opacity' }}
        >
          {seg === '' ? '\u00A0' : seg}{animateBy === 'words' && i < els.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </div>
  );
}

/* ── Animated Counter ── */
function Counter({ to, duration = 1.8, suffix = '', prefix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-40px' });

  useEffect(() => {
    if (!inView) { setVal(0); return; }
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / (duration * 1000), 1);
      setVal(Math.floor(p * to));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, to, duration]);

  return <span ref={ref}>{prefix}{val}{suffix}</span>;
}

/* ── Section wrapper with fade-in-out on scroll ── */
function FadeSection({ children, style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-100px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      style={style}
    >
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
  const containerRef = useRef(null);
  const full = 'Book smarter. Fly faster.';

  // keep-alive
  useEffect(() => {
    fetch(`${API}/test`).catch(() => {});
    const t = setInterval(() => fetch(`${API}/test`).catch(() => {}), 14 * 60 * 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const r = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);

  // typewriter
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      if (i <= full.length) { setTyped(full.slice(0, i)); i++; }
      else clearInterval(iv);
    }, 85);
    const b = setInterval(() => setCur(c => !c), 520);
    return () => { clearInterval(iv); clearInterval(b); };
  }, []);

  // scroll section tracker for theme morphing
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = window.innerHeight;
      if (y < h * 0.8) setScrollSection(0);
      else if (y < h * 1.8) setScrollSection(1);
      else if (y < h * 2.8) setScrollSection(2);
      else if (y < h * 3.8) setScrollSection(3);
      else setScrollSection(4);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // canvas starfield
  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    cv.width = window.innerWidth; cv.height = window.innerHeight;

    const stars = Array.from({ length: 280 }, () => ({
      x: Math.random() * cv.width, y: Math.random() * cv.height,
      r: Math.random() * 2 + 0.2, op: Math.random() * 0.7 + 0.2,
      tw: Math.random() * Math.PI * 2, ts: Math.random() * 0.016 + 0.004,
    }));

    const meteors = []; let mt = 0;
    const spawn = () => meteors.push({
      x: Math.random() * cv.width * 0.65, y: Math.random() * cv.height * 0.35,
      len: 90 + Math.random() * 180, spd: 7 + Math.random() * 7,
      ang: Math.PI / 6 + Math.random() * 0.35, life: 0, max: 36 + Math.random() * 22,
    });

    const draw = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      stars.forEach(s => {
        s.tw += s.ts;
        const op = s.op * (0.5 + 0.5 * Math.sin(s.tw));
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${op})`; ctx.fill();
        if (s.r > 1.4) {
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180,190,255,${op * 0.12})`; ctx.fill();
        }
      });
      mt++;
      if (mt > 85 + Math.random() * 65) { spawn(); mt = 0; }
      meteors.forEach((m, i) => {
        m.life++;
        const op = Math.sin((m.life / m.max) * Math.PI);
        const tx = Math.cos(m.ang) * m.len; const ty = Math.sin(m.ang) * m.len;
        const g = ctx.createLinearGradient(m.x, m.y, m.x - tx, m.y - ty);
        g.addColorStop(0, `rgba(255,255,255,${op})`);
        g.addColorStop(0.3, `rgba(180,200,255,${op * 0.7})`);
        g.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - tx, m.y - ty);
        ctx.strokeStyle = g; ctx.lineWidth = 1.8; ctx.stroke();
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

  // THEME CONFIG per section
  const themes = [
    // 0 - Hero: Deep midnight violet
    { bg: 'radial-gradient(ellipse at 20% 40%, rgba(76,29,149,.35) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(29,78,216,.22) 0%, transparent 50%), radial-gradient(ellipse at 55% 85%, rgba(109,40,217,.18) 0%, transparent 50%), #020008', accent: '#7c3aed', accent2: '#a78bfa', text: '#ede9fe', sub: '#c4b5fd' },
    // 1 - How it works: Deep ocean teal
    { bg: 'radial-gradient(ellipse at 30% 50%, rgba(6,78,59,.4) 0%, transparent 55%), radial-gradient(ellipse at 75% 25%, rgba(5,150,105,.2) 0%, transparent 50%), radial-gradient(ellipse at 50% 90%, rgba(4,120,87,.15) 0%, transparent 50%), #010d0a', accent: '#10b981', accent2: '#6ee7b7', text: '#ecfdf5', sub: '#a7f3d0' },
    // 2 - Features: Cosmic crimson
    { bg: 'radial-gradient(ellipse at 25% 45%, rgba(127,29,29,.4) 0%, transparent 55%), radial-gradient(ellipse at 70% 30%, rgba(185,28,28,.22) 0%, transparent 50%), radial-gradient(ellipse at 55% 80%, rgba(153,27,27,.18) 0%, transparent 50%), #0c0000', accent: '#ef4444', accent2: '#fca5a5', text: '#fef2f2', sub: '#fecaca' },
    // 3 - WhatsApp: Aurora nebula blue
    { bg: 'radial-gradient(ellipse at 20% 40%, rgba(30,58,138,.4) 0%, transparent 55%), radial-gradient(ellipse at 80% 25%, rgba(37,99,235,.25) 0%, transparent 50%), radial-gradient(ellipse at 50% 85%, rgba(29,78,216,.18) 0%, transparent 50%), #00030d', accent: '#3b82f6', accent2: '#93c5fd', text: '#eff6ff', sub: '#bfdbfe' },
    // 4 - CTA: Golden launch
    { bg: 'radial-gradient(ellipse at 30% 40%, rgba(120,53,15,.45) 0%, transparent 55%), radial-gradient(ellipse at 75% 30%, rgba(180,83,9,.28) 0%, transparent 50%), radial-gradient(ellipse at 50% 85%, rgba(146,64,14,.2) 0%, transparent 50%), #080400', accent: '#f59e0b', accent2: '#fcd34d', text: '#fffbeb', sub: '#fde68a' },
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
    <div ref={containerRef} style={{ background: '#020008', minHeight: '100vh', overflowX: 'hidden', fontFamily: "'DM Sans',sans-serif", color: '#e8eaf6', position: 'relative' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:#020008;}::-webkit-scrollbar-thumb{background:var(--accent,#7c3aed);border-radius:2px;}
        html{scroll-behavior:smooth;}
        @keyframes shimText{0%{background-position:0% center;}100%{background-position:400% center;}}
        @keyframes floatPlane{0%,100%{transform:translateY(0) rotate(var(--r,0deg));}50%{transform:translateY(-18px) rotate(var(--r,0deg));}}
        @keyframes ringA{from{transform:rotateX(70deg) rotateZ(0deg);}to{transform:rotateX(70deg) rotateZ(360deg);}}
        @keyframes ringB{from{transform:rotateX(55deg) rotateZ(40deg);}to{transform:rotateX(55deg) rotateZ(400deg);}}
        @keyframes badgePulse{0%,100%{box-shadow:0 0 0 0 rgba(124,58,237,.5);}70%{box-shadow:0 0 0 12px rgba(124,58,237,0);}}
        @keyframes glowPulse{0%,100%{box-shadow:0 0 20px rgba(124,58,237,.25);}50%{box-shadow:0 0 50px rgba(124,58,237,.6),0 0 90px rgba(139,92,246,.25);}}
        @keyframes scanLine{0%{top:-1px;opacity:0;}5%{opacity:.5;}95%{opacity:.5;}100%{top:100%;opacity:0;}}
        @keyframes grain{0%,100%{transform:translate(0,0);}20%{transform:translate(-2%,-3%);}40%{transform:translate(3%,2%);}60%{transform:translate(-1%,4%);}80%{transform:translate(2%,-2%);}}}
        @keyframes auroraDrift{0%,100%{transform:scale(1) translate(0,0);}50%{transform:scale(1.12) translate(2%,-2%);}}
        @keyframes counterUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
        @keyframes borderFlow{0%,100%{border-color:rgba(124,58,237,.3);}50%{border-color:rgba(167,139,250,.7);box-shadow:0 0 28px rgba(124,58,237,.25);}}

        .grain-layer{position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.03;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size:200px;animation:grain 8s steps(10) infinite;}
        .scan{position:fixed;left:0;width:100%;height:1px;pointer-events:none;z-index:2;animation:scanLine 12s linear infinite;}

        .nav-a{text-decoration:none;font-size:13px;transition:color .2s;position:relative;padding-bottom:2px;}
        .nav-a::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;transition:width .3s;}
        .nav-a:hover::after{width:100%;}

        .btn-main{border:none;color:white;border-radius:14px;font-family:'DM Sans',sans-serif;font-weight:700;cursor:pointer;position:relative;overflow:hidden;transition:all .3s cubic-bezier(.23,1,.32,1);letter-spacing:.3px;}
        .btn-main::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.15),transparent);}
        .btn-main:hover{transform:translateY(-3px);}
        .btn-out{background:transparent;border-radius:14px;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .3s;backdrop-filter:blur(12px);}
        .btn-out:hover{transform:translateY(-2px);}

        .feat-card{border-radius:22px;backdrop-filter:blur(20px);transition:all .35s cubic-bezier(.23,1,.32,1);position:relative;overflow:hidden;cursor:default;}
        .feat-card:hover{transform:translateY(-8px) perspective(800px) rotateX(-2deg);box-shadow:0 30px 70px rgba(0,0,0,.7);}
        .step-card{border-radius:22px;backdrop-filter:blur(20px);transition:all .3s;position:relative;overflow:hidden;}
        .step-card:hover{transform:translateY(-5px);}
        .review-card{border-radius:20px;backdrop-filter:blur(20px);transition:all .3s;position:relative;overflow:hidden;}
        .review-card:hover{transform:translateY(-4px);}

        @media(max-width:768px){
          .hero-flex{flex-direction:column!important;text-align:center;align-items:center!important;}
          .planet-side{display:none!important;}
          .stats-wrap{justify-content:center!important;gap:18px!important;}
          .nav-links{display:none!important;}
          .feat-grid{grid-template-columns:1fr!important;}
          .steps-grid{grid-template-columns:1fr!important;}
          .wa-grid{grid-template-columns:1fr!important;}
          .rev-grid{grid-template-columns:1fr!important;}
          .hero-btns-wrap{justify-content:center!important;}
          .hero-sec{padding:88px 20px 60px!important;}
          .sec{padding:60px 20px!important;}
          .wa-inner{padding:30px 18px!important;}
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

      {/* fixed canvas */}
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: -1, background: '#020008' }} />
      <div className="grain-layer" />
      <div className="scan" style={{ background: `linear-gradient(90deg,transparent,${theme.accent}22,${theme.accent}15,transparent)` }} />

      {/* MORPHING BG */}
      <motion.div
        animate={{ background: theme.bg }}
        transition={{ duration: 1.8, ease: 'easeInOut' }}
        style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      />

      {/* AURORA BLOBS — morph color with theme */}
      <motion.div animate={{ background: `radial-gradient(circle,${theme.accent}30 0%,${theme.accent}12 40%,transparent 70%)` }} transition={{ duration: 1.8 }}
        style={{ position: 'fixed', width: 700, height: 700, left: '-15%', top: '5%', borderRadius: '50%', filter: 'blur(80px)', animation: 'auroraDrift 10s ease-in-out infinite', zIndex: 0, pointerEvents: 'none' }} />
      <motion.div animate={{ background: `radial-gradient(circle,${theme.accent2}25 0%,${theme.accent}10 40%,transparent 70%)` }} transition={{ duration: 1.8 }}
        style={{ position: 'fixed', width: 550, height: 550, right: '-10%', top: '15%', borderRadius: '50%', filter: 'blur(80px)', animation: 'auroraDrift 14s ease-in-out infinite reverse', zIndex: 0, pointerEvents: 'none' }} />

      {/* grid pattern — also morphs */}
      <motion.div
        animate={{ backgroundImage: `linear-gradient(${theme.accent}09 1px,transparent 1px),linear-gradient(90deg,${theme.accent}09 1px,transparent 1px)` }}
        transition={{ duration: 1.8 }}
        style={{ position: 'fixed', inset: 0, backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%,black,transparent)', zIndex: 0, pointerEvents: 'none' }}
      />

      {/* ── NAV ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(2,0,8,.75)', backdropFilter: 'blur(28px)', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        <div className="nav-inner" style={{ maxWidth: 1160, margin: '0 auto', padding: '15px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 }} onClick={() => navigate('/')}>
            <motion.div animate={{ boxShadow: `0 0 24px ${theme.accent}80` }} transition={{ duration: 1.8 }}
              style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg,${theme.accent},${theme.accent}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>☄</motion.div>
            <motion.span animate={{ background: `linear-gradient(90deg,${theme.text},${theme.sub})` }} transition={{ duration: 1.8 }}
              style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, letterSpacing: '.5px', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>COMETAI</motion.span>
          </div>
          <div className="nav-links" style={{ display: 'flex', gap: 28 }}>
            {[['How it Works', '#how'], ['Features', '#features'], ['WhatsApp', '#whatsapp'], ['Reviews', '#reviews']].map(([l, h]) => (
              <motion.a key={l} href={h} className="nav-a"
                animate={{ color: `${theme.sub}aa` }}
                transition={{ duration: 1.5 }}
                style={{ '--link-color': theme.accent }}>
                {l}
              </motion.a>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <motion.button className="btn-out" onClick={() => navigate('/login')}
              animate={{ borderColor: `${theme.accent}55`, color: theme.sub }}
              transition={{ duration: 1.8 }}
              style={{ padding: '8px 20px', fontSize: 13, border: '1px solid' }}>Sign In</motion.button>
            <motion.button className="btn-main" onClick={() => navigate('/register')}
              animate={{ background: `linear-gradient(135deg,${theme.accent},${theme.accent}cc)`, boxShadow: `0 8px 28px ${theme.accent}55` }}
              transition={{ duration: 1.8 }}
              style={{ padding: '8px 20px', fontSize: 13 }}>Get Started →</motion.button>
          </div>
        </div>
      </nav>

      {/* ══════════════ HERO ══════════════ */}
      <section className="hero-sec" style={{ position: 'relative', zIndex: 2, minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '90px 40px 60px', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', width: '100%' }}>
          <div className="hero-flex" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40 }}>

            {/* LEFT */}
            <div style={{ maxWidth: 640 }}>
              {/* badge */}
              <motion.div initial={{ opacity: 0, y: 20, scale: .9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .6, delay: .15 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28, background: `${theme.accent}18`, border: `1px solid ${theme.accent}45`, borderRadius: 24, padding: '7px 18px' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 10px #34d399' }} />
                <span style={{ fontSize: 11, color: theme.sub, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'Space Mono',monospace" }}>Now Live · AI Travel Platform</span>
              </motion.div>

              {/* HERO TITLE — big, visible, BlurText */}
              <BlurText
                text="Fly Smarter. Travel Further."
                delay={130}
                animateBy="words"
                direction="top"
                stepDuration={0.55}
                once={true}
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontSize: isMobile ? 'clamp(36px,9vw,52px)' : 'clamp(52px,7vw,88px)',
                  fontWeight: 800, lineHeight: 1.02, letterSpacing: '-2.5px', marginBottom: 16,
                  color: '#ffffff',
                  flexWrap: 'wrap',
                }}
              />

              {/* subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: .7 }}
                style={{ fontSize: isMobile ? 15 : 18, color: 'rgba(255,255,255,.55)', lineHeight: 1.75, marginBottom: 12, fontWeight: 300, maxWidth: 520 }}
              >
                India's most intelligent travel platform.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: .7 }}
                style={{ fontSize: isMobile ? 14 : 16, color: 'rgba(255,255,255,.38)', lineHeight: 1.75, marginBottom: 32, fontWeight: 300, maxWidth: 480 }}
              >
                Book flights with AI, WhatsApp, or classic search — zero fees, real-time data.
              </motion.p>

              {/* typewriter */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: .6 }}
                style={{ fontFamily: "'Space Mono',monospace", fontSize: isMobile ? 11 : 13, color: theme.accent, marginBottom: 32, minHeight: 20, letterSpacing: '.5px' }}>
                ✦ {typed}{cur ? '|' : ' '}
              </motion.div>

              {/* CTAs */}
              <motion.div className="hero-btns-wrap"
                initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: .7, ease: 'easeOut' }}
                style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 52 }}>
                <button className="btn-main" onClick={() => navigate('/register')} style={{
                  padding: '16px 40px', fontSize: 16,
                  background: `linear-gradient(135deg,${theme.accent},${theme.accent}cc)`,
                  boxShadow: `0 12px 40px ${theme.accent}55`
                }}>Start for Free ✈</button>
                <button className="btn-out" onClick={() => navigate('/login')} style={{
                  padding: '16px 32px', fontSize: 16,
                  border: `1px solid ${theme.accent}44`, color: theme.sub
                }}>Sign In →</button>
              </motion.div>

              {/* stats */}
              <motion.div className="stats-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3, duration: .8 }}
                style={{ display: 'flex', gap: 36, flexWrap: 'wrap' }}>
                {[{ n: 500, s: '+', l: 'Daily Flights' }, { n: 0, s: '', l: '₹ Booking Fees', pre: '₹' }, { n: 14, s: '+', l: 'Indian Cities' }, { n: 100, s: '%', l: 'Real Data' }].map((st, i) => (
                  <div key={i} style={{ animation: `counterUp .6s ease ${2.3 + i * .1}s both` }}>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, color: theme.accent2, lineHeight: 1 }}>
                      {st.pre || ''}<Counter to={st.n} duration={1.8} />{st.s}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,.32)', marginTop: 3, letterSpacing: '.5px' }}>{st.l}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* PLANET */}
            <motion.div className="planet-side"
              initial={{ opacity: 0, scale: .7, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: .3, duration: 1.3, ease: 'easeOut' }}
              style={{ position: 'relative', width: 420, height: 420, flexShrink: 0 }}>
              <motion.div animate={{ background: `radial-gradient(circle,${theme.accent}28 0%,transparent 70%)` }} transition={{ duration: 1.8 }}
                style={{ position: 'absolute', inset: 20, borderRadius: '50%', filter: 'blur(30px)' }} />
              <div style={{ position: 'absolute', inset: 50, borderRadius: '50%', background: 'radial-gradient(ellipse at 30% 28%,#2d1b69 0%,#130d3b 30%,#080420 60%,#030112 100%)', boxShadow: 'inset -35px -28px 55px rgba(0,0,0,.95),inset 18px 14px 35px rgba(109,40,217,.14)', overflow: 'hidden' }}>
                {[15, 35, 55, 75, 95, 115, 135, 155].map(d => <div key={d} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(109,40,217,.06)', transform: `rotateY(${d}deg)` }} />)}
                {[25, 50, 80, 110, 140].map(d => <div key={d} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(109,40,217,.05)', transform: `rotateX(${d}deg)` }} />)}
              </div>
              <motion.div animate={{ borderColor: `${theme.accent}45` }} transition={{ duration: 1.8 }}
                style={{ position: 'absolute', inset: 8, animation: 'ringA 9s linear infinite', borderRadius: '50%' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1.5px solid rgba(124,58,237,.25)' }}>
                  <motion.div animate={{ background: theme.accent, boxShadow: `0 0 18px ${theme.accent}` }} transition={{ duration: 1.8 }}
                    style={{ position: 'absolute', top: -6, left: '50%', width: 12, height: 12, borderRadius: '50%', transform: 'translateX(-50%)' }} />
                </div>
              </motion.div>
              <div style={{ position: 'absolute', inset: -28, animation: 'ringB 14s linear infinite', borderRadius: '50%' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(167,139,250,.14)' }}>
                  <motion.div animate={{ background: theme.accent2 }} transition={{ duration: 1.8 }}
                    style={{ position: 'absolute', top: -5, right: '20%', width: 8, height: 8, borderRadius: '50%' }} />
                </div>
              </div>
              {[{ t: '6%', l: '8%', r: '20deg', d: '3.4s', dl: '0s' }, { t: '74%', l: '78%', r: '-12deg', d: '4.2s', dl: '.8s' }, { t: '82%', l: '6%', r: '38deg', d: '2.9s', dl: '1.4s' }, { t: '15%', l: '82%', r: '-30deg', d: '3.8s', dl: '.4s' }].map((p, i) => (
                <div key={i} style={{ position: 'absolute', top: p.t, left: p.l, fontSize: 15, animationName: 'floatPlane', animationDuration: p.d, animationDelay: p.dl, animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', '--r': p.r, filter: `drop-shadow(0 0 10px ${theme.accent}ee)` }}>✈</div>
              ))}
            </motion.div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, opacity: .3 }}>
          <span style={{ fontSize: 8, color: theme.sub, letterSpacing: '2.5px', textTransform: 'uppercase', fontFamily: "'Space Mono',monospace" }}>Scroll</span>
          <motion.div animate={{ background: `linear-gradient(180deg,${theme.accent},transparent)` }} transition={{ duration: 1.8 }}
            style={{ width: 1, height: 32 }} />
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section id="how" className="sec" style={{ position: 'relative', zIndex: 2, padding: '110px 40px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <FadeSection>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <motion.div animate={{ color: theme.accent }} transition={{ duration: 1.8 }}
                style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14 }}>— How it works</motion.div>
              <BlurText text="Three steps to anywhere" delay={90} animateBy="words" direction="top" stepDuration={0.38}
                style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(28px,4vw,50px)', fontWeight: 800, color: theme.text, letterSpacing: '-1px', justifyContent: 'center' }} />
            </div>
          </FadeSection>
          <div className="steps-grid" style={{ display: 'grid', gap: 22 }}>
            {[
              { n: '01', t: 'Create Account', d: "Sign up free in 30 seconds. No credit card. Just your email and you're in.", icon: '👤' },
              { n: '02', t: 'Search Your Flight', d: 'Use AI text search or structured search. Filter by price, time, airline, duration.', icon: '🔍' },
              { n: '03', t: 'Book & Fly', d: 'Pay with card, UPI or netbanking. Instant confirmation email. Zero booking fees.', icon: '🚀' },
            ].map((s, i) => (
              <motion.div key={i} className="step-card"
                style={{ padding: 34, background: `linear-gradient(145deg,rgba(10,6,30,.9),rgba(15,9,40,.85))`, border: `1px solid ${theme.accent}18` }}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: '-60px' }}
                transition={{ delay: i * .12, duration: .6 }}
                whileHover={{ borderColor: `${theme.accent}40`, boxShadow: `0 20px 50px rgba(0,0,0,.6),0 0 30px ${theme.accent}15` }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${theme.accent}40,transparent)` }} />
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 72, fontWeight: 900, color: `${theme.accent}08`, position: 'absolute', top: 10, right: 16, lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 36, marginBottom: 14, filter: `drop-shadow(0 0 12px ${theme.accent}80)` }}>{s.icon}</div>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: theme.accent, letterSpacing: '2px', marginBottom: 12 }}>{s.n}</div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 700, color: theme.text, marginBottom: 10 }}>{s.t}</h3>
                <p style={{ fontSize: 14, color: `${theme.sub}70`, lineHeight: 1.75, fontWeight: 300 }}>{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section id="features" className="sec" style={{ position: 'relative', zIndex: 2, padding: '80px 40px 110px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <FadeSection>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <motion.div animate={{ color: theme.accent }} transition={{ duration: 1.8 }}
                style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14 }}>— Features</motion.div>
              <BlurText text="Everything you need to fly" delay={80} animateBy="words" direction="top" stepDuration={0.35}
                style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(28px,4vw,50px)', fontWeight: 800, color: theme.text, letterSpacing: '-1px', justifyContent: 'center' }} />
            </div>
          </FadeSection>
          <div className="feat-grid" style={{ display: 'grid', gap: 18 }}>
            {features.map((f, i) => (
              <motion.div key={i} className="feat-card"
                style={{ padding: 30, background: 'linear-gradient(145deg,rgba(10,6,30,.92),rgba(20,12,50,.88))', border: `1px solid ${theme.accent}12` }}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: '-60px' }}
                transition={{ delay: i * .08, duration: .55 }}
                whileHover={{ borderColor: `${theme.accent}35`, boxShadow: `0 30px 70px rgba(0,0,0,.7),0 0 40px ${theme.accent}18` }}>
                <motion.div animate={{ background: `radial-gradient(ellipse at 10% 10%,${theme.accent}0c 0%,transparent 55%)` }} transition={{ duration: 1.8 }}
                  style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
                <div style={{ fontSize: 36, marginBottom: 16, filter: `drop-shadow(0 0 14px ${theme.accent}80)` }}>{f.icon}</div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700, color: theme.text, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: `${theme.sub}70`, lineHeight: 1.75, fontWeight: 300 }}>{f.desc}</p>
                <motion.div animate={{ background: `linear-gradient(90deg,${theme.accent},transparent)` }} transition={{ duration: 1.8 }}
                  style={{ position: 'absolute', bottom: 0, left: 0, height: 2, width: '40%', borderRadius: 1 }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ WHATSAPP ══════════════ */}
      <section id="whatsapp" style={{ position: 'relative', zIndex: 2, padding: '80px 40px' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <motion.div className="wa-inner"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: '-60px' }} transition={{ duration: .7 }}
            style={{ background: 'linear-gradient(145deg,rgba(10,6,30,.97),rgba(20,10,55,.95))', border: `1px solid ${theme.accent}25`, borderRadius: 30, padding: '58px 54px', position: 'relative', overflow: 'hidden', backdropFilter: 'blur(30px)' }}>
            <motion.div animate={{ background: `linear-gradient(90deg,transparent,${theme.accent}65,${theme.accent2}50,transparent)` }} transition={{ duration: 1.8 }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1 }} />
            <div className="wa-grid" style={{ display: 'grid', gap: 44, alignItems: 'center' }}>
              <div>
                <motion.div animate={{ color: theme.accent }} transition={{ duration: 1.8 }}
                  style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 20 }}>— WhatsApp Bot</motion.div>
                <BlurText text="Book any flight on WhatsApp" delay={75} animateBy="words" direction="top" stepDuration={0.35}
                  style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 800, color: theme.text, marginBottom: 16, letterSpacing: '-1px', flexWrap: 'wrap' }} />
                <p style={{ fontSize: 14, color: `${theme.sub}70`, lineHeight: 1.85, marginBottom: 26, fontWeight: 300, maxWidth: 420 }}>No app to download. No account needed. Just send a WhatsApp message and book your flight in minutes.</p>
                {['Message: "flights bangalore to mumbai tomorrow"', 'Choose your flight and enter your name', 'Reply CONFIRM — booking ID arrives instantly!'].map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                    <motion.div animate={{ background: `${theme.accent}22`, borderColor: `${theme.accent}45` }} transition={{ duration: 1.8 }}
                      style={{ width: 22, height: 22, borderRadius: '50%', border: '1px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: theme.accent, flexShrink: 0, marginTop: 1, fontFamily: "'Space Mono',monospace" }}>{i + 1}</motion.div>
                    <span style={{ fontSize: 13, color: `${theme.sub}65`, lineHeight: 1.6 }}>{s}</span>
                  </div>
                ))}
                <div style={{ marginTop: 28, background: 'rgba(37,211,102,.08)', border: '1px solid rgba(37,211,102,.2)', borderRadius: 12, padding: '14px 18px', display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 22 }}>📱</span>
                  <div>
                    <div style={{ fontSize: 10, color: 'rgba(110,231,183,.45)', fontFamily: "'Space Mono',monospace", letterSpacing: '1.5px', marginBottom: 2 }}>WHATSAPP NUMBER</div>
                    <div style={{ fontSize: 15, color: '#34d399', fontWeight: 700 }}>+1-415-523-8886</div>
                  </div>
                </div>
              </div>
              {/* chat */}
              <div style={{ background: '#070d07', borderRadius: 22, overflow: 'hidden', border: '1px solid rgba(37,211,102,.12)' }}>
                <div style={{ background: '#128C7E', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>☄</div>
                  <div><div style={{ fontSize: 13, color: 'white', fontWeight: 600 }}>CometAI Travel Bot</div><div style={{ fontSize: 11, color: 'rgba(255,255,255,.6)' }}>Online</div></div>
                </div>
                <div style={{ padding: 16 }}>
                  {[
                    { r: false, m: '✈️ Hi! I can help you book flights.\n\nTry: "flights bangalore to mumbai tomorrow"' },
                    { r: true, m: 'flights bangalore to mumbai tomorrow' },
                    { r: false, m: '✈️ Flights BLR → BOM\n\n1. IndiGo  06:00→08:05  ₹3,499\n2. Air India  09:30→11:45  ₹4,200\n3. SpiceJet  14:00→16:10  ₹2,899\n\nReply with a number to book' },
                    { r: true, m: '1' },
                    { r: false, m: '✅ IndiGo selected!\n⏰ 06:00 AM · ₹3,499\n\nWhat is your full name?' },
                  ].map((msg, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: msg.r ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
                      <div style={{ background: msg.r ? '#005c4b' : 'rgba(255,255,255,.07)', borderRadius: msg.r ? '14px 14px 2px 14px' : '14px 14px 14px 2px', padding: '9px 13px', maxWidth: '82%' }}>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.85)', whiteSpace: 'pre-wrap', lineHeight: 1.55 }}>{msg.m}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════ TESTIMONIALS ══════════════ */}
      <section id="reviews" className="sec" style={{ position: 'relative', zIndex: 2, padding: '80px 40px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <FadeSection>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <motion.div animate={{ color: theme.accent }} transition={{ duration: 1.8 }}
                style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14 }}>— Early Users</motion.div>
              <BlurText text="Travellers love CometAI" delay={80} animateBy="words" direction="top" stepDuration={0.35}
                style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(26px,4vw,48px)', fontWeight: 800, color: theme.text, letterSpacing: '-1px', justifyContent: 'center' }} />
            </div>
          </FadeSection>
          <div className="rev-grid" style={{ display: 'grid', gap: 18 }}>
            {testimonials.map((t, i) => (
              <motion.div key={i} className="review-card"
                style={{ padding: 28, background: 'linear-gradient(145deg,rgba(10,6,30,.9),rgba(15,9,40,.85))', border: `1px solid ${theme.accent}12` }}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: '-60px' }}
                transition={{ delay: i * .1, duration: .6 }}
                whileHover={{ borderColor: `${theme.accent}30`, boxShadow: `0 20px 50px rgba(0,0,0,.6)` }}>
                <motion.div animate={{ background: `linear-gradient(90deg,transparent,${theme.accent}20,transparent)` }} transition={{ duration: 1.8 }}
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1 }} />
                <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                  {'★★★★★'.split('').map((s, j) => <span key={j} style={{ color: theme.accent2, fontSize: 14 }}>{s}</span>)}
                </div>
                <p style={{ fontSize: 14, color: `${theme.sub}75`, lineHeight: 1.75, marginBottom: 20, fontStyle: 'italic', fontWeight: 300 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <motion.div animate={{ background: `linear-gradient(135deg,${theme.accent}35,${theme.accent}18)`, borderColor: `${theme.accent}30` }} transition={{ duration: 1.8 }}
                    style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{t.avatar}</motion.div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: `${theme.sub}50` }}>{t.city}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section style={{ position: 'relative', zIndex: 2, padding: '100px 40px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <motion.div className="cta-inner"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: '-60px' }} transition={{ duration: .7 }}
            style={{ background: 'linear-gradient(145deg,rgba(10,6,30,.98),rgba(25,14,60,.95))', border: `1px solid ${theme.accent}28`, borderRadius: 30, padding: '64px 56px', textAlign: 'center', position: 'relative', overflow: 'hidden', backdropFilter: 'blur(30px)', boxShadow: `0 0 100px ${theme.accent}14` }}>
            <motion.div animate={{ background: `linear-gradient(90deg,transparent,${theme.accent}65,${theme.accent2}50,transparent)` }} transition={{ duration: 1.8 }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1 }} />
            <motion.div animate={{ background: `linear-gradient(90deg,transparent,${theme.accent}30,transparent)` }} transition={{ duration: 1.8 }}
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1 }} />
            <motion.div animate={{ background: `radial-gradient(ellipse at 50% 0%,${theme.accent}12 0%,transparent 60%)` }} transition={{ duration: 1.8 }}
              style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
            <BlurText text="Ready for takeoff?" delay={100} animateBy="words" direction="top" stepDuration={0.45}
              style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(32px,5vw,60px)', fontWeight: 800, lineHeight: 1.08, marginBottom: 16, letterSpacing: '-1.5px', color: theme.text, justifyContent: 'center' }} />
            <motion.p initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ delay: .3, duration: .6 }}
              style={{ fontSize: 16, color: `${theme.sub}55`, marginBottom: 36, fontWeight: 300, lineHeight: 1.7 }}>
              Join India's smartest travel platform. No fees, no fuss — just great flights.
            </motion.p>
            <motion.div initial={{ opacity: 0, scale: .9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: false }} transition={{ delay: .5, duration: .5 }}
              style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-main" onClick={() => navigate('/register')} style={{ padding: '17px 48px', fontSize: 17, background: `linear-gradient(135deg,${theme.accent},${theme.accent}cc)`, boxShadow: `0 12px 40px ${theme.accent}50` }}>
                Create Free Account →
              </button>
              <button className="btn-out" onClick={() => navigate('/login')} style={{ padding: '17px 38px', fontSize: 17, border: `1px solid ${theme.accent}44`, color: theme.sub }}>
                Sign In
              </button>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false }} transition={{ delay: .7, duration: .5 }}
              style={{ fontSize: 11, color: `${theme.sub}30`, marginTop: 24, fontFamily: "'Space Mono',monospace", letterSpacing: '1px' }}>
              ✓ Free forever &nbsp;&nbsp; ✓ No credit card &nbsp;&nbsp; ✓ Zero booking fees
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ position: 'relative', zIndex: 2, borderTop: `1px solid ${theme.accent}10`, padding: '36px 40px' }}>
        <div className="footer-wrap" style={{ maxWidth: 1160, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <motion.div animate={{ background: `linear-gradient(135deg,${theme.accent},${theme.accent}99)` }} transition={{ duration: 1.8 }}
              style={{ width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>☄</motion.div>
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, color: `${theme.sub}55`, letterSpacing: '.5px' }}>COMETAI TRAVEL</span>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.18)' }}>© 2026 CometAI Travel · India's AI-powered travel platform</div>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy', 'Terms', 'Contact'].map(l => <span key={l} style={{ fontSize: 12, color: 'rgba(255,255,255,.25)', cursor: 'pointer' }}>{l}</span>)}
          </div>
        </div>
      </footer>
    </div>
  );
}