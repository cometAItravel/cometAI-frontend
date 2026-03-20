import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const API = "https://cometai-backend.onrender.com";

/* ─── BlurText Component ─── */
const buildKeyframes = (from, steps) => {
  const keys = new Set([...Object.keys(from), ...steps.flatMap(s => Object.keys(s))]);
  const keyframes = {};
  keys.forEach(k => { keyframes[k] = [from[k], ...steps.map(s => s[k])]; });
  return keyframes;
};

function BlurText({ text = '', delay = 150, animateBy = 'words', direction = 'top', onAnimationComplete, stepDuration = 0.4, style = {} }) {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
    }, { threshold: 0.1 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const fromSnapshot = useMemo(() =>
    direction === 'top'
      ? { filter: 'blur(12px)', opacity: 0, y: -60 }
      : { filter: 'blur(12px)', opacity: 0, y: 60 },
    [direction]
  );

  const toSnapshots = useMemo(() => [
    { filter: 'blur(6px)', opacity: 0.4, y: direction === 'top' ? 8 : -8 },
    { filter: 'blur(0px)', opacity: 1, y: 0 },
  ], [direction]);

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) => stepCount === 1 ? 0 : i / (stepCount - 1));

  return (
    <div ref={ref} style={{ display: 'flex', flexWrap: 'wrap', ...style }}>
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);
        return (
          <motion.span
            key={index}
            initial={fromSnapshot}
            animate={inView ? animateKeyframes : fromSnapshot}
            transition={{ duration: totalDuration, times, delay: (index * delay) / 1000, ease: "easeOut" }}
            onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
            style={{ display: 'inline-block', willChange: 'transform, filter, opacity' }}
          >
            {segment === ' ' ? '\u00A0' : segment}
            {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
          </motion.span>
        );
      })}
    </div>
  );
}

/* ─── Main LandingPage ─── */
export default function LandingPage() {
  const navigate = useNavigate();
  const [typed, setTyped] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const full = "Book flights with AI.";

  useEffect(() => {
    fetch(`${API}/test`).catch(() => {});
    const t = setInterval(() => fetch(`${API}/test`).catch(() => {}), 14 * 60 * 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      if (i <= full.length) { setTyped(full.slice(0, i)); i++; }
      else clearInterval(iv);
    }, 90);
    const blink = setInterval(() => setShowCursor(c => !c), 530);
    return () => { clearInterval(iv); clearInterval(blink); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.2,
      opacity: Math.random() * 0.8 + 0.2,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
    }));

    const meteors = [];
    let meteorTimer = 0;

    const spawnMeteor = () => {
      meteors.push({
        x: Math.random() * canvas.width * 0.7,
        y: Math.random() * canvas.height * 0.4,
        length: 120 + Math.random() * 160,
        speed: 8 + Math.random() * 6,
        angle: Math.PI / 6 + Math.random() * 0.3,
        life: 0,
        maxLife: 40 + Math.random() * 20,
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      [
        [canvas.width * 0.2, canvas.height * 0.5, canvas.width * 0.45, "rgba(79,33,170,0.18)", "rgba(50,20,120,0.08)"],
        [canvas.width * 0.8, canvas.height * 0.25, canvas.width * 0.4, "rgba(15,60,180,0.15)", "transparent"],
        [canvas.width * 0.55, canvas.height * 0.85, canvas.width * 0.35, "rgba(120,20,160,0.12)", "transparent"],
      ].forEach(([x, y, r, c0, c1]) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, c0); g.addColorStop(0.5, c1); g.addColorStop(1, "transparent");
        ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      stars.forEach(s => {
        s.twinkle += s.twinkleSpeed;
        const op = s.opacity * (0.6 + 0.4 * Math.sin(s.twinkle));
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${op})`; ctx.fill();
        if (s.r > 1.2) {
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(165,180,252,${op * 0.15})`; ctx.fill();
        }
      });

      meteorTimer++;
      if (meteorTimer > 120 + Math.random() * 80) { spawnMeteor(); meteorTimer = 0; }
      meteors.forEach((m, idx) => {
        m.life++;
        const op = Math.sin((m.life / m.maxLife) * Math.PI);
        const tailX = Math.cos(m.angle) * m.length;
        const tailY = Math.sin(m.angle) * m.length;
        const grad = ctx.createLinearGradient(m.x, m.y, m.x - tailX, m.y - tailY);
        grad.addColorStop(0, `rgba(255,255,255,${op})`);
        grad.addColorStop(0.3, `rgba(165,180,252,${op * 0.7})`);
        grad.addColorStop(1, "transparent");
        ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - tailX, m.y - tailY);
        ctx.strokeStyle = grad; ctx.lineWidth = 1.5; ctx.stroke();
        m.x += Math.cos(m.angle) * m.speed; m.y += Math.sin(m.angle) * m.speed;
        if (m.life >= m.maxLife) meteors.splice(idx, 1);
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", onResize); };
  }, []);

  const features = [
    { icon: "🤖", title: "AI Search", desc: "Type naturally — \"cheap flights BLR to BOM tomorrow\" — we find them instantly", color: "#818cf8" },
    { icon: "📱", title: "WhatsApp Booking", desc: "Book flights directly on WhatsApp without opening any app or website", color: "#6ee7b7" },
    { icon: "⚡", title: "Real Flight Data", desc: "Live flight schedules powered by AviationStack API — always accurate", color: "#f9a8d4" },
    { icon: "💰", title: "Zero Booking Fees", desc: "No hidden charges. What you see is what you pay — always", color: "#fcd34d" },
    { icon: "🔒", title: "Secure Payments", desc: "Bank-grade encryption on every transaction. Your money is safe", color: "#a5f3fc" },
    { icon: "🎯", title: "Smart Filters", desc: "Filter by time, price, duration — find the perfect flight in seconds", color: "#c084fc" },
  ];

  return (
    <div style={{ background: "#00000a", minHeight: "100vh", overflowX: "hidden", fontFamily: "'DM Sans', sans-serif", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #00000a; }
        ::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 2px; }
        html { scroll-behavior: smooth; }

        @keyframes shimmerText { 0%{background-position:0% center;} 100%{background-position:300% center;} }
        @keyframes floatAnim { 0%,100%{transform:translateY(0px) rotate(0deg);} 50%{transform:translateY(-20px) rotate(3deg);} }
        @keyframes ringRotate { from{transform:rotateX(72deg) rotateZ(0deg);} to{transform:rotateX(72deg) rotateZ(360deg);} }
        @keyframes scanLine { 0%{top:-2px;opacity:0;} 10%{opacity:1;} 90%{opacity:1;} 100%{top:100%;opacity:0;} }
        @keyframes borderPulse { 0%,100%{border-color:rgba(99,102,241,0.25);} 50%{border-color:rgba(99,102,241,0.6);box-shadow:0 0 24px rgba(99,102,241,0.2);} }
        @keyframes countFade { from{opacity:0;transform:translateY(12px);} to{opacity:1;transform:translateY(0);} }
        @keyframes subtitleFade { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }

        .grain-overlay { position:fixed;inset:0;z-index:1;pointer-events:none;opacity:0.035;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-size:256px; }
        .scan-overlay { position:fixed;left:0;width:100%;height:1px;z-index:2;pointer-events:none;background:linear-gradient(90deg,transparent,rgba(99,102,241,0.12),transparent);animation:scanLine 10s linear infinite; }
        .hologram { background:linear-gradient(90deg,#e0e7ff,#a5b4fc,#c084fc,#818cf8,#38bdf8,#a5b4fc,#e0e7ff);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmerText 6s linear infinite; }

        .nav-link { color:rgba(165,180,252,0.65);text-decoration:none;font-size:14px;transition:color 0.2s;position:relative;padding-bottom:2px; }
        .nav-link::after { content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:linear-gradient(90deg,#6366f1,#c084fc);transition:width 0.3s ease; }
        .nav-link:hover { color:#e0e7ff; }
        .nav-link:hover::after { width:100%; }

        .btn-primary { background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;color:white;border-radius:12px;font-family:'DM Sans',sans-serif;font-weight:600;cursor:pointer;transition:all 0.3s cubic-bezier(0.23,1,0.32,1);position:relative;overflow:hidden; }
        .btn-primary::before { content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.15),transparent); }
        .btn-primary:hover { transform:translateY(-3px);box-shadow:0 16px 48px rgba(99,102,241,0.55); }
        .btn-ghost { background:transparent;border:1px solid rgba(99,102,241,0.35);color:#a5b4fc;border-radius:12px;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all 0.3s;backdrop-filter:blur(10px); }
        .btn-ghost:hover { border-color:rgba(99,102,241,0.7);background:rgba(99,102,241,0.08);color:#e0e7ff; }

        .feat-card { background:rgba(8,8,24,0.92);border:1px solid rgba(255,255,255,0.06);border-radius:20px;backdrop-filter:blur(20px);transition:all 0.35s cubic-bezier(0.23,1,0.32,1);position:relative;overflow:hidden; }
        .feat-card:hover { transform:perspective(800px) rotateX(-4deg) rotateY(4deg) translateZ(16px);border-color:rgba(99,102,241,0.25);box-shadow:0 24px 60px rgba(0,0,0,0.7),0 0 40px rgba(99,102,241,0.15); }
        .step-card { background:rgba(8,8,24,0.92);border:1px solid rgba(99,102,241,0.12);border-radius:20px;backdrop-filter:blur(20px);transition:all 0.3s;position:relative;overflow:hidden; }
        .step-card:hover { border-color:rgba(99,102,241,0.3);transform:translateY(-4px); }

        @media(max-width:768px) {
          .hero-grid{flex-direction:column!important;text-align:center;align-items:center!important;}
          .planet-wrap{display:none!important;}
          .stats-row{justify-content:center!important;gap:24px!important;}
          .nav-links-wrap{display:none!important;}
          .features-grid{grid-template-columns:1fr!important;}
          .steps-grid{grid-template-columns:1fr!important;}
          .wa-grid{grid-template-columns:1fr!important;}
          .hero-btns{justify-content:center!important;}
          .section-pad{padding:60px 20px!important;}
          .hero-section{padding:100px 20px 60px!important;}
          .cta-section{padding:60px 20px!important;}
          .footer-inner{flex-direction:column!important;gap:16px!important;text-align:center!important;}
          .wa-section{padding:60px 20px!important;}
          .wa-inner{padding:36px 24px!important;}
          .nav-inner{padding:16px 20px!important;}
          .blur-title{font-size:clamp(36px,10vw,52px)!important;}
        }
        @media(min-width:769px) {
          .features-grid{grid-template-columns:repeat(3,1fr)!important;}
          .steps-grid{grid-template-columns:repeat(3,1fr)!important;}
          .wa-grid{grid-template-columns:1fr 1fr!important;}
        }
      `}</style>

      <canvas ref={canvasRef} style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none" }}/>
      <div className="grain-overlay"/>
      <div className="scan-overlay"/>
      <div style={{ position:"fixed",inset:0,background:"#00000a",zIndex:-1 }}/>

      {/* ── NAV ── */}
      <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(0,0,10,0.75)",backdropFilter:"blur(24px)",borderBottom:"1px solid rgba(99,102,241,0.1)" }}>
        <div className="nav-inner" style={{ maxWidth:1140,margin:"0 auto",padding:"16px 40px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10,cursor:"pointer",flexShrink:0 }} onClick={() => navigate("/")}>
            <div style={{ width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0 }}>☄</div>
            <span style={{ fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:800,letterSpacing:"0.5px",background:"linear-gradient(90deg,#e0e7ff,#a5b4fc)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>COMETAI</span>
          </div>
          <div className="nav-links-wrap" style={{ display:"flex",gap:28 }}>
            {[["How it works","#how"],["Features","#features"],["WhatsApp","#whatsapp"]].map(([l,h]) => (
              <a key={l} href={h} className="nav-link">{l}</a>
            ))}
          </div>
          <div style={{ display:"flex",gap:10 }}>
            <button className="btn-ghost" onClick={() => navigate("/login")} style={{ padding:"8px 18px",fontSize:13 }}>Sign In</button>
            <button className="btn-primary" onClick={() => navigate("/register")} style={{ padding:"8px 18px",fontSize:13 }}>Get Started →</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero-section" style={{ position:"relative",zIndex:2,minHeight:"100vh",display:"flex",alignItems:"center",padding:"100px 40px 60px" }}>
        <div style={{ maxWidth:1140,margin:"0 auto",width:"100%" }}>
          <div className="hero-grid" style={{ display:"flex",alignItems:"center",justifyContent:"space-between",gap:40 }}>

            {/* LEFT CONTENT */}
            <div style={{ maxWidth:620 }}>

              {/* badge */}
              <motion.div
                initial={{ opacity:0, y:20 }}
                animate={{ opacity:1, y:0 }}
                transition={{ duration:0.6, delay:0.1 }}
                style={{ display:"inline-flex",alignItems:"center",gap:8,marginBottom:28,background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.25)",borderRadius:20,padding:"6px 16px",animation:"borderPulse 3s ease infinite" }}
              >
                <div style={{ width:6,height:6,borderRadius:"50%",background:"#6ee7b7",boxShadow:"0 0 8px #6ee7b7" }}/>
                <span style={{ fontSize:11,color:"#a5b4fc",letterSpacing:"2px",textTransform:"uppercase",fontFamily:"'Space Mono',monospace" }}>AI-Powered Travel</span>
              </motion.div>

              {/* ── BLUR TEXT HERO TITLE ── */}
              <BlurText
                text="Travel Beyond The Ordinary"
                delay={120}
                animateBy="words"
                direction="top"
                stepDuration={0.45}
                style={{
                  fontFamily:"'Syne',sans-serif",
                  fontSize: isMobile ? "clamp(36px,10vw,52px)" : "clamp(44px,6vw,76px)",
                  fontWeight:800,
                  lineHeight:1.05,
                  letterSpacing:"-2px",
                  marginBottom:16,
                  background:"linear-gradient(135deg,#e0e7ff 0%,#a5b4fc 35%,#c084fc 65%,#38bdf8 100%)",
                  WebkitBackgroundClip:"text",
                  WebkitTextFillColor:"transparent",
                  backgroundClip:"text",
                  flexWrap:"wrap",
                }}
              />

              {/* typewriter */}
              <motion.div
                initial={{ opacity:0 }}
                animate={{ opacity:1 }}
                transition={{ delay:1.4, duration:0.6 }}
                style={{ fontFamily:"'Space Mono',monospace",fontSize:isMobile?13:15,color:"#6366f1",marginBottom:18,minHeight:24 }}
              >
                {typed}{showCursor ? "|" : " "}
              </motion.div>

              {/* subtitle with blur animation */}
              <BlurText
                text="India's first AI-powered travel platform. Search flights naturally, book via WhatsApp, zero booking fees."
                delay={30}
                animateBy="words"
                direction="bottom"
                stepDuration={0.3}
                style={{
                  fontSize:16,
                  color:"rgba(165,180,252,0.58)",
                  lineHeight:1.75,
                  marginBottom:36,
                  maxWidth:500,
                  fontWeight:300,
                  flexWrap:"wrap",
                  animation:"subtitleFade 0s both",
                }}
              />

              {/* CTA buttons */}
              <motion.div
                className="hero-btns"
                initial={{ opacity:0, y:24 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay:1.8, duration:0.6, ease:"easeOut" }}
                style={{ display:"flex",gap:14,flexWrap:"wrap",marginBottom:48 }}
              >
                <button className="btn-primary" onClick={() => navigate("/register")} style={{ padding:"15px 36px",fontSize:16 }}>
                  Create Account ✈
                </button>
                <button className="btn-ghost" onClick={() => navigate("/login")} style={{ padding:"15px 32px",fontSize:16 }}>
                  Sign In →
                </button>
              </motion.div>

              {/* stats */}
              <motion.div
                className="stats-row"
                initial={{ opacity:0 }}
                animate={{ opacity:1 }}
                transition={{ delay:2, duration:0.8 }}
                style={{ display:"flex",gap:36,flexWrap:"wrap" }}
              >
                {[["500+","Daily flights"],["₹0","Booking fees"],["AI","Powered search"],["WhatsApp","Booking"]].map(([n,l],i) => (
                  <div key={i} style={{ animation:`countFade 0.6s ease ${2+i*0.12}s both` }}>
                    <div style={{ fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,background:"linear-gradient(135deg,#e0e7ff,#a5b4fc)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>{n}</div>
                    <div style={{ fontSize:11,color:"rgba(165,180,252,0.38)",marginTop:2 }}>{l}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT — 3D PLANET */}
            <motion.div
              className="planet-wrap"
              initial={{ opacity:0, scale:0.8 }}
              animate={{ opacity:1, scale:1 }}
              transition={{ delay:0.4, duration:1, ease:"easeOut" }}
              style={{ position:"relative",width:380,height:380,flexShrink:0 }}
            >
              <div style={{ position:"absolute",inset:40,borderRadius:"50%",background:"radial-gradient(ellipse at 32% 30%,#1e1080 0%,#0d0640 35%,#060220 65%,#020010 100%)",boxShadow:"inset -30px -25px 50px rgba(0,0,0,0.9),inset 15px 12px 30px rgba(99,102,241,0.12),0 0 60px rgba(99,102,241,0.18),0 0 120px rgba(79,33,170,0.1)",overflow:"hidden" }}>
                {[20,40,60,80,100,120,140,160].map(d => <div key={d} style={{ position:"absolute",inset:0,borderRadius:"50%",border:"1px solid rgba(99,102,241,0.07)",transform:`rotateY(${d}deg)` }}/>)}
                {[30,60,90,120,150].map(d => <div key={d} style={{ position:"absolute",inset:0,borderRadius:"50%",border:"1px solid rgba(99,102,241,0.05)",transform:`rotateX(${d}deg)` }}/>)}
                <div style={{ position:"absolute",inset:-6,borderRadius:"50%",background:"radial-gradient(ellipse at 50% 50%,transparent 55%,rgba(99,102,241,0.12) 75%,rgba(79,33,170,0.06) 100%)" }}/>
              </div>
              <div style={{ position:"absolute",inset:0,animation:"ringRotate 10s linear infinite" }}>
                <div style={{ position:"absolute",inset:10,borderRadius:"50%",border:"1px solid rgba(99,102,241,0.22)" }}>
                  <div style={{ position:"absolute",top:-5,left:"50%",width:10,height:10,borderRadius:"50%",background:"#818cf8",boxShadow:"0 0 14px #818cf8",transform:"translateX(-50%)" }}/>
                </div>
              </div>
              <div style={{ position:"absolute",inset:-20,animation:"ringRotate 16s linear infinite reverse" }}>
                <div style={{ position:"absolute",inset:0,borderRadius:"50%",border:"1px solid rgba(192,132,252,0.12)" }}>
                  <div style={{ position:"absolute",bottom:-4,left:"30%",width:8,height:8,borderRadius:"50%",background:"#c084fc",boxShadow:"0 0 10px #c084fc" }}/>
                </div>
              </div>
              {[{top:"8%",left:"12%",r:"25deg",d:"3.2s"},{top:"72%",left:"76%",r:"-15deg",d:"4.1s"},{top:"80%",left:"8%",r:"40deg",d:"2.7s"}].map((p,i) => (
                <div key={i} style={{ position:"absolute",top:p.top,left:p.left,fontSize:16,animation:`floatAnim ${p.d} ease-in-out infinite`,animationDelay:`${i*0.7}s`,filter:"drop-shadow(0 0 8px rgba(99,102,241,0.9))",transform:`rotate(${p.r})` }}>✈</div>
              ))}
            </motion.div>

          </div>
        </div>

        <div style={{ position:"absolute",bottom:28,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:6,opacity:0.35 }}>
          <span style={{ fontSize:9,color:"#a5b4fc",letterSpacing:"2px",textTransform:"uppercase",fontFamily:"'Space Mono',monospace" }}>Scroll</span>
          <div style={{ width:1,height:36,background:"linear-gradient(180deg,#6366f1,transparent)" }}/>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="section-pad" style={{ position:"relative",zIndex:2,padding:"100px 40px" }}>
        <div style={{ maxWidth:1140,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:60 }}>
            <div style={{ fontFamily:"'Space Mono',monospace",fontSize:10,color:"#6366f1",letterSpacing:"3px",textTransform:"uppercase",marginBottom:14 }}>— How it works</div>
            <BlurText text="Three steps to anywhere" delay={80} animateBy="words" direction="top" stepDuration={0.35}
              style={{ fontFamily:"'Syne',sans-serif",fontSize:"clamp(28px,4vw,48px)",fontWeight:800,color:"#e0e7ff",letterSpacing:"-0.5px",justifyContent:"center" }}/>
          </div>
          <div className="steps-grid" style={{ display:"grid",gap:20 }}>
            {[
              { n:"01",t:"Create Account",d:"Sign up for free in seconds. No credit card required. Just your email and you're in." },
              { n:"02",t:"Search & Compare",d:"Use AI text search or structured search. Filter by time, price, stops, duration." },
              { n:"03",t:"Book Instantly",d:"Pay with card, UPI or netbanking. Booking confirmation and email sent immediately." },
            ].map((s,i) => (
              <div key={i} className="step-card" style={{ padding:32 }}>
                <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(99,102,241,0.3),transparent)" }}/>
                <div style={{ fontFamily:"'Syne',sans-serif",fontSize:64,fontWeight:800,color:"rgba(99,102,241,0.06)",position:"absolute",top:12,right:18,lineHeight:1 }}>{s.n}</div>
                <div style={{ fontFamily:"'Space Mono',monospace",fontSize:10,color:"#6366f1",letterSpacing:"2px",marginBottom:14 }}>{s.n}</div>
                <h3 style={{ fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,color:"#e0e7ff",marginBottom:10 }}>{s.t}</h3>
                <p style={{ fontSize:14,color:"rgba(165,180,252,0.5)",lineHeight:1.7,fontWeight:300 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="section-pad" style={{ position:"relative",zIndex:2,padding:"80px 40px 100px" }}>
        <div style={{ maxWidth:1140,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:60 }}>
            <div style={{ fontFamily:"'Space Mono',monospace",fontSize:10,color:"#6366f1",letterSpacing:"3px",textTransform:"uppercase",marginBottom:14 }}>— Features</div>
            <BlurText text="Everything you need" delay={80} animateBy="words" direction="top" stepDuration={0.35}
              style={{ fontFamily:"'Syne',sans-serif",fontSize:"clamp(28px,4vw,48px)",fontWeight:800,color:"#e0e7ff",letterSpacing:"-0.5px",justifyContent:"center" }}/>
          </div>
          <div className="features-grid" style={{ display:"grid",gap:18 }}>
            {features.map((f,i) => (
              <div key={i} className="feat-card" style={{ padding:28 }}>
                <div style={{ position:"absolute",inset:0,background:`radial-gradient(ellipse at 0% 0%,${f.color}09 0%,transparent 55%)`,pointerEvents:"none" }}/>
                <div style={{ fontSize:32,marginBottom:14,filter:`drop-shadow(0 0 10px ${f.color}aa)` }}>{f.icon}</div>
                <h3 style={{ fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:700,color:"#e0e7ff",marginBottom:8 }}>{f.title}</h3>
                <p style={{ fontSize:13,color:"rgba(165,180,252,0.48)",lineHeight:1.7,fontWeight:300 }}>{f.desc}</p>
                <div style={{ position:"absolute",bottom:0,left:0,height:2,width:"35%",background:`linear-gradient(90deg,${f.color},transparent)`,borderRadius:1 }}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHATSAPP ── */}
      <section id="whatsapp" className="wa-section" style={{ position:"relative",zIndex:2,padding:"80px 40px" }}>
        <div style={{ maxWidth:1000,margin:"0 auto" }}>
          <div className="wa-inner" style={{ background:"rgba(8,8,24,0.96)",border:"1px solid rgba(99,102,241,0.18)",borderRadius:28,padding:"56px 52px",position:"relative",overflow:"hidden",backdropFilter:"blur(30px)" }}>
            <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(99,102,241,0.5),rgba(192,132,252,0.4),transparent)" }}/>
            <div className="wa-grid" style={{ display:"grid",gap:40,alignItems:"center" }}>
              <div>
                <div style={{ fontFamily:"'Space Mono',monospace",fontSize:10,color:"#6ee7b7",letterSpacing:"3px",textTransform:"uppercase",marginBottom:18 }}>— WhatsApp Bot</div>
                <BlurText text="Book flights on WhatsApp" delay={80} animateBy="words" direction="top" stepDuration={0.35}
                  style={{ fontFamily:"'Syne',sans-serif",fontSize:"clamp(24px,3.5vw,38px)",fontWeight:800,color:"#e0e7ff",marginBottom:16,letterSpacing:"-0.5px",flexWrap:"wrap" }}/>
                <p style={{ fontSize:14,color:"rgba(165,180,252,0.5)",lineHeight:1.8,marginBottom:24,fontWeight:300 }}>No app download. Just message our bot your route and book in minutes.</p>
                {["Send route: \"flights blr to mumbai tomorrow\"","Pick your flight, tell us your name","Reply CONFIRM — booking ID sent!"].map((s,i) => (
                  <div key={i} style={{ display:"flex",gap:12,alignItems:"flex-start",marginBottom:10 }}>
                    <div style={{ width:20,height:20,borderRadius:"50%",background:"rgba(99,102,241,0.15)",border:"1px solid rgba(99,102,241,0.35)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#818cf8",flexShrink:0,marginTop:1 }}>{i+1}</div>
                    <span style={{ fontSize:13,color:"rgba(165,180,252,0.55)",lineHeight:1.5 }}>{s}</span>
                  </div>
                ))}
                <div style={{ marginTop:24,background:"rgba(37,211,102,0.08)",border:"1px solid rgba(37,211,102,0.2)",borderRadius:10,padding:"12px 16px",display:"inline-flex",alignItems:"center",gap:10 }}>
                  <span style={{ fontSize:18 }}>📱</span>
                  <div>
                    <div style={{ fontSize:11,color:"rgba(110,231,183,0.5)",fontFamily:"'Space Mono',monospace",letterSpacing:"1px" }}>WHATSAPP NUMBER</div>
                    <div style={{ fontSize:14,color:"#6ee7b7",fontWeight:600 }}>+1-415-523-8886</div>
                  </div>
                </div>
              </div>
              <div style={{ background:"#0a0f0a",borderRadius:20,padding:18,border:"1px solid rgba(37,211,102,0.1)" }}>
                <div style={{ fontSize:11,color:"rgba(110,231,183,0.4)",textAlign:"center",marginBottom:14,fontFamily:"'Space Mono',monospace" }}>CometAI Bot</div>
                {[
                  {r:false,m:"✈️ Hi! Try: \"flights bangalore to mumbai tomorrow\""},
                  {r:true,m:"flights bangalore to mumbai tomorrow"},
                  {r:false,m:"✈️ Flights BLR → BOM\n\n1. IndiGo 06:00→08:05 ₹3,499\n2. Air India 09:30→11:45 ₹4,200\n3. SpiceJet 14:00→16:10 ₹2,899\n\nReply with a number"},
                  {r:true,m:"1"},
                  {r:false,m:"✅ IndiGo selected!\n₹3,499 · 06:00 AM\n\nWhat is your full name?"},
                ].map((msg,i) => (
                  <div key={i} style={{ display:"flex",justifyContent:msg.r?"flex-end":"flex-start",marginBottom:8 }}>
                    <div style={{ background:msg.r?"#1b4a2c":"rgba(255,255,255,0.07)",borderRadius:msg.r?"12px 12px 2px 12px":"12px 12px 12px 2px",padding:"8px 12px",maxWidth:"85%" }}>
                      <div style={{ fontSize:12,color:"rgba(255,255,255,0.82)",whiteSpace:"pre-wrap",lineHeight:1.5 }}>{msg.m}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section" style={{ position:"relative",zIndex:2,padding:"100px 40px",textAlign:"center" }}>
        <div style={{ maxWidth:680,margin:"0 auto" }}>
          <BlurText text="Ready to take off?" delay={100} animateBy="words" direction="top" stepDuration={0.4}
            style={{ fontFamily:"'Syne',sans-serif",fontSize:"clamp(32px,5vw,58px)",fontWeight:800,lineHeight:1.1,marginBottom:18,letterSpacing:"-1px",
              background:"linear-gradient(90deg,#e0e7ff,#a5b4fc,#c084fc,#818cf8,#38bdf8,#a5b4fc,#e0e7ff)",backgroundSize:"300% auto",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",animation:"shimmerText 6s linear infinite",
              justifyContent:"center"
            }}/>
          <p style={{ fontSize:16,color:"rgba(165,180,252,0.45)",marginBottom:36,fontWeight:300,animation:"subtitleFade 0.8s ease 0.3s both" }}>Join India's smartest travel platform. Zero fees. AI-powered. WhatsApp-ready.</p>
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{duration:0.6}} style={{ display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap" }}>
            <button className="btn-primary" onClick={() => navigate("/register")} style={{ padding:"16px 44px",fontSize:17 }}>Create Free Account →</button>
            <button className="btn-ghost" onClick={() => navigate("/login")} style={{ padding:"16px 36px",fontSize:17 }}>Sign In</button>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ position:"relative",zIndex:2,borderTop:"1px solid rgba(99,102,241,0.08)",padding:"32px 40px" }}>
        <div className="footer-inner" style={{ maxWidth:1140,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <span style={{ fontSize:16 }}>☄</span>
            <span style={{ fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:700,color:"rgba(165,180,252,0.45)" }}>COMETAI TRAVEL</span>
          </div>
          <div style={{ fontSize:12,color:"rgba(165,180,252,0.22)" }}>© 2026 CometAI Travel · India's AI-powered travel platform</div>
          <div style={{ display:"flex",gap:20 }}>
            {["Privacy","Terms","Contact"].map(l => (
              <span key={l} style={{ fontSize:12,color:"rgba(165,180,252,0.28)",cursor:"pointer" }}>{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}