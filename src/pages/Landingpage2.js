/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const GOLD = "#c9a84c";
const GOLD_D = "#8B6914";
const GOLD_L = "#f0d080";

// ── GLOBAL STYLES ─────────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@200;300;400;600;700&family=DM+Sans:wght@200;300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:auto;}
body{font-family:'DM Sans',sans-serif;background:#050505;color:#fff;overflow-x:hidden;}
::-webkit-scrollbar{width:2px;}
::-webkit-scrollbar-thumb{background:${GOLD};border-radius:1px;}

/* Loading bar */
@keyframes lp2_load{0%{width:0%;}100%{width:100%;}}
@keyframes lp2_blink{0%,100%{opacity:1;}50%{opacity:0;}}
@keyframes lp2_float{0%,100%{transform:translateY(0);}50%{transform:translateY(-12px);}}
@keyframes lp2_floatCard{0%,100%{transform:translateY(0) rotate(0deg);}33%{transform:translateY(-8px) rotate(0.5deg);}66%{transform:translateY(-14px) rotate(-0.5deg);}}
@keyframes lp2_pulse{0%,100%{opacity:0.4;transform:scale(1);}50%{opacity:0.7;transform:scale(1.05);}}
@keyframes lp2_spin{to{transform:rotate(360deg);}}
@keyframes lp2_fadeUp{from{opacity:0;transform:translateY(60px);}to{opacity:1;transform:translateY(0);}}
@keyframes lp2_fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes lp2_slideLeft{from{opacity:0;transform:translateX(-80px);}to{opacity:1;transform:translateX(0);}}
@keyframes lp2_slideRight{from{opacity:0;transform:translateX(80px);}to{opacity:1;transform:translateX(0);}}
@keyframes lp2_scaleIn{from{opacity:0;transform:scale(0.85);}to{opacity:1;transform:scale(1);}}
@keyframes lp2_typewriter{from{width:0;}to{width:100%;}}
@keyframes lp2_shimmer{0%{background-position:200% center;}100%{background-position:-200% center;}}
@keyframes lp2_glowPulse{0%,100%{box-shadow:0 0 20px rgba(201,168,76,0.15);}50%{box-shadow:0 0 60px rgba(201,168,76,0.4),0 0 100px rgba(201,168,76,0.2);}}
@keyframes lp2_routeLine{0%{stroke-dashoffset:1000;}100%{stroke-dashoffset:0;}}
@keyframes lp2_cityPing{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.8);opacity:0.5;}}
@keyframes lp2_particleDrift{0%{transform:translateY(0) translateX(0);opacity:0;}10%{opacity:1;}90%{opacity:1;}100%{transform:translateY(-100vh) translateX(30px);opacity:0;}}
@keyframes lp2_clothReveal{0%{clip-path:polygon(0 100%,100% 100%,100% 100%,0 100%);}100%{clip-path:polygon(0 0%,100% 0%,100% 100%,0 100%);}}
@keyframes lp2_mapGlow{0%,100%{opacity:0.3;}50%{opacity:0.8;}}
@keyframes lp2_counterUp{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}
@keyframes lp2_progressFill{from{width:0%;}to{width:var(--target-width,70%);}}
@keyframes lp2_splitLeft{from{opacity:0;transform:translateX(-120px);}to{opacity:1;transform:translateX(0);}}
@keyframes lp2_splitRight{from{opacity:0;transform:translateX(120px);}to{opacity:1;transform:translateX(0);}}
@keyframes lp2_revealUp{from{opacity:0;transform:translateY(100px) skewY(3deg);}to{opacity:1;transform:translateY(0) skewY(0deg);}}
@keyframes lp2_wordReveal{from{clip-path:polygon(0 100%,100% 100%,100% 100%,0 100%);transform:translateY(20px);}to{clip-path:polygon(0 0,100% 0,100% 100%,0 100%);transform:translateY(0);}}
@keyframes lp2_hoverLift{0%{transform:translateY(0);}100%{transform:translateY(-8px);}}
@keyframes lp2_scanline{0%{transform:translateY(-100%);}100%{transform:translateY(100vh);}}

.lp2-btn-primary{
  display:inline-flex;align-items:center;gap:10px;
  padding:16px 36px;border-radius:100px;
  background:${GOLD};color:#050505;
  font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;
  border:none;cursor:pointer;
  transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);
  position:relative;overflow:hidden;
}
.lp2-btn-primary::after{
  content:'';position:absolute;inset:0;
  background:linear-gradient(120deg,transparent 30%,rgba(255,255,255,0.25) 50%,transparent 70%);
  transform:translateX(-100%);transition:transform 0.5s;
}
.lp2-btn-primary:hover{transform:translateY(-3px);box-shadow:0 20px 50px rgba(201,168,76,0.5);}
.lp2-btn-primary:hover::after{transform:translateX(100%);}

.lp2-btn-ghost{
  display:inline-flex;align-items:center;gap:10px;
  padding:15px 36px;border-radius:100px;
  background:transparent;color:rgba(255,255,255,0.8);
  font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;
  border:1px solid rgba(255,255,255,0.15);cursor:pointer;
  transition:all 0.3s ease;
  backdrop-filter:blur(10px);
}
.lp2-btn-ghost:hover{background:rgba(255,255,255,0.08);color:#fff;border-color:rgba(255,255,255,0.3);transform:translateY(-2px);}

.lp2-card{
  background:rgba(255,255,255,0.03);
  border:1px solid rgba(255,255,255,0.08);
  border-radius:24px;
  backdrop-filter:blur(20px);
  transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);
}
.lp2-card:hover{
  background:rgba(255,255,255,0.06);
  border-color:rgba(201,168,76,0.25);
  transform:translateY(-6px);
  box-shadow:0 30px 80px rgba(0,0,0,0.4),0 0 0 1px rgba(201,168,76,0.1);
}

.lp2-glass{
  background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.1);
  backdrop-filter:blur(30px);
  border-radius:20px;
}

.lp2-gold-text{
  background:linear-gradient(135deg,${GOLD},${GOLD_L},${GOLD});
  background-size:200% auto;
  -webkit-background-clip:text;
  background-clip:text;
  -webkit-text-fill-color:transparent;
  animation:lp2_shimmer 4s linear infinite;
}

@media(max-width:768px){
  .lp2-hide-mobile{display:none!important;}
  .lp2-split-title{font-size:clamp(48px,12vw,80px)!important;}
}
`;

// ── LOADING SCREEN ─────────────────────────────────────────────────────────────
function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0); // 0=loading,1=fadeout
  const [litIdx, setLitIdx] = useState(-1);
  const name = "ALVRYN";

  useEffect(() => {
    // Animate progress bar
    let start = null;
    const duration = 2200;
    const animate = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setProgress(Math.round(p * 100));
      if (p < 1) requestAnimationFrame(animate);
      else {
        // Letters light up
        let idx = 0;
        const iv = setInterval(() => {
          setLitIdx(idx++);
          if (idx > name.length) {
            clearInterval(iv);
            setTimeout(() => setPhase(1), 400);
            setTimeout(() => onDone(), 900);
          }
        }, 100);
      }
    };
    requestAnimationFrame(animate);
  }, [onDone, name.length]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#050505",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: phase === 1 ? 0 : 1,
      transition: "opacity 0.6s ease",
      pointerEvents: phase === 1 ? "none" : "all",
    }}>
      {/* Subtle grid */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
        backgroundSize: "60px 60px",
      }}/>

      {/* ALVRYN letters */}
      <div style={{
        fontFamily: "'Cormorant Garamond',serif", fontWeight: 200,
        fontSize: "clamp(36px,6vw,72px)",
        letterSpacing: "0.5em",
        display: "flex", gap: 4,
        marginBottom: 48,
      }}>
        {name.split("").map((ch, i) => (
          <span key={i} style={{
            display: "inline-block",
            color: i <= litIdx ? GOLD : "rgba(255,255,255,0.15)",
            textShadow: i === litIdx ? `0 0 40px ${GOLD}, 0 0 80px ${GOLD}55` : i < litIdx ? `0 0 12px ${GOLD}44` : "none",
            transform: i === litIdx ? "translateY(-6px) scale(1.1)" : "translateY(0) scale(1)",
            transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
          }}>{ch}</span>
        ))}
      </div>

      {/* Progress bar container */}
      <div style={{ width: "min(300px,60vw)", marginBottom: 20 }}>
        <div style={{
          height: 2, background: "rgba(255,255,255,0.06)",
          borderRadius: 1, overflow: "hidden",
        }}>
          <div style={{
            height: "100%", width: `${progress}%`,
            background: `linear-gradient(90deg,${GOLD_D},${GOLD},${GOLD_L})`,
            borderRadius: 1, transition: "width 0.08s linear",
            boxShadow: `0 0 10px ${GOLD}88`,
          }}/>
        </div>
      </div>

      <div style={{
        fontFamily: "'Space Mono',monospace", fontSize: 9,
        color: "rgba(255,255,255,0.2)", letterSpacing: "0.3em",
      }}>
        TRAVEL BEYOND BOUNDARIES
      </div>
    </div>
  );
}

// ── PARTICLE CANVAS ─────────────────────────────────────────────────────────────
function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: -0.2 - Math.random() * 0.4,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.3 + 0.05,
      color: Math.random() > 0.5 ? GOLD : "rgba(255,255,255,0.6)",
    }));
    let raf;
    const mouse = { x: -1000, y: -1000 };
    const onMouse = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener("mousemove", onMouse);
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 150) { p.vx += dx/dist * 0.03; p.vy += dy/dist * 0.03; }
        p.vx *= 0.98; p.vy *= 0.98;
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 6; ctx.shadowColor = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
        ctx.restore();
      });
      // Draw connections
      particles.forEach((a, i) => {
        particles.slice(i+1).forEach(b => {
          const d = Math.hypot(a.x-b.x, a.y-b.y);
          if (d < 100) {
            ctx.save();
            ctx.globalAlpha = (1-d/100) * 0.05;
            ctx.strokeStyle = GOLD;
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            ctx.restore();
          }
        });
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMouse); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={ref} style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none",opacity:0.6 }}/>;
}

// ── GLOBE CANVAS ────────────────────────────────────────────────────────────────
function GlobeCanvas({ scrollY, containerHeight }) {
  const ref = useRef(null);
  const rotRef = useRef(0);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const SIZE = Math.min(window.innerWidth * 0.7, 700);
    canvas.width = SIZE; canvas.height = SIZE;
    const cx = SIZE/2, cy = SIZE/2, R = SIZE * 0.42;

    // Flight routes: [lat1,lon1,lat2,lon2]
    const ROUTES = [
      [12.9, 77.6, 15.5, 73.8],   // BLR → Goa
      [28.6, 77.2, 19.1, 72.9],   // DEL → BOM
      [12.9, 77.6, 25.2, 55.3],   // BLR → Dubai
      [12.9, 77.6, 1.3, 103.8],   // BLR → Singapore
      [12.9, 77.6, 13.7, 100.5],  // BLR → Bangkok
      [28.6, 77.2, 51.5, -0.1],   // DEL → London
      [19.1, 72.9, 1.3, 103.8],   // BOM → Singapore
      [13.1, 80.2, 25.2, 55.3],   // MAA → Dubai
    ];
    const CITIES = [
      [12.9, 77.6, "BLR"], [15.5, 73.8, "GOA"],
      [28.6, 77.2, "DEL"], [19.1, 72.9, "BOM"],
      [25.2, 55.3, "DXB"], [1.3, 103.8, "SIN"],
      [13.7, 100.5, "BKK"], [51.5, -0.1, "LHR"],
      [13.1, 80.2, "MAA"],
    ];

    function latLonToXY(lat, lon, rot) {
      const phi = (90 - lat) * Math.PI/180;
      const theta = (lon + rot) * Math.PI/180;
      const x3 = R * Math.sin(phi) * Math.cos(theta);
      const y3 = R * Math.cos(phi);
      const z3 = R * Math.sin(phi) * Math.sin(theta);
      return { x: cx + x3, y: cy - y3, z: z3, visible: z3 > -R*0.1 };
    }

    let animFrame;
    let routeProgress = 0;

    const drawGlobe = (rot) => {
      ctx.clearRect(0, 0, SIZE, SIZE);

      // Glow background
      const grd = ctx.createRadialGradient(cx,cy,0,cx,cy,R);
      grd.addColorStop(0, "rgba(201,168,76,0.04)");
      grd.addColorStop(0.7, "rgba(10,10,10,0.3)");
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(cx,cy,R+20,0,Math.PI*2); ctx.fill();

      // Outer glow ring
      ctx.save();
      ctx.shadowBlur = 40; ctx.shadowColor = `${GOLD}33`;
      ctx.strokeStyle = `${GOLD}22`; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.stroke();
      ctx.restore();

      // Globe grid lines
      for (let lat = -80; lat <= 80; lat += 20) {
        ctx.beginPath();
        let first = true;
        for (let lon = 0; lon <= 360; lon += 3) {
          const p = latLonToXY(lat, lon, rot);
          if (p.visible) {
            const alpha = Math.max(0, p.z/R) * 0.12;
            if (first) { ctx.moveTo(p.x, p.y); first = false; }
            else ctx.lineTo(p.x, p.y);
          } else first = true;
        }
        ctx.strokeStyle = `rgba(201,168,76,0.08)`; ctx.lineWidth = 0.5; ctx.stroke();
      }
      for (let lon = 0; lon < 360; lon += 20) {
        ctx.beginPath();
        let first = true;
        for (let lat = -90; lat <= 90; lat += 3) {
          const p = latLonToXY(lat, lon, rot);
          if (p.visible) {
            if (first) { ctx.moveTo(p.x, p.y); first = false; }
            else ctx.lineTo(p.x, p.y);
          } else first = true;
        }
        ctx.strokeStyle = `rgba(201,168,76,0.06)`; ctx.lineWidth = 0.5; ctx.stroke();
      }

      // Flight routes with animated progress
      routeProgress = Math.min(routeProgress + 0.003, 1);
      ROUTES.forEach((r, ri) => {
        const delay = ri * 0.12;
        const prog = Math.max(0, Math.min(1, (routeProgress - delay) / (1 - delay)));
        if (prog <= 0) return;
        const [la1,lo1,la2,lo2] = r;
        const steps = 60;
        const arcHeight = 0.3;
        ctx.beginPath();
        let first = true;
        for (let i = 0; i <= steps * prog; i++) {
          const t = i/steps;
          const lat = la1 + (la2-la1)*t;
          const lon = lo1 + (lo2-lo1)*t;
          const arc = Math.sin(t*Math.PI) * arcHeight;
          const p = latLonToXY(lat, lon, rot);
          if (!p.visible) { first = true; continue; }
          const px = p.x, py = p.y - arc * R * 0.3;
          if (first) { ctx.moveTo(px, py); first = false; }
          else ctx.lineTo(px, py);
        }
        const alpha = Math.max(0, Math.min(1, prog * 3)) * 0.7;
        ctx.strokeStyle = `rgba(201,168,76,${alpha})`;
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 8; ctx.shadowColor = GOLD;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Cities
      CITIES.forEach(([lat, lon, name]) => {
        const p = latLonToXY(lat, lon, rot);
        if (!p.visible || p.z < 0) return;
        const alpha = Math.max(0, p.z/R);

        // Ping rings
        const pingAlpha = (Math.sin(Date.now()*0.002 + lat) + 1) / 2 * 0.5;
        ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI*2);
        ctx.strokeStyle = `rgba(201,168,76,${pingAlpha * alpha})`;
        ctx.lineWidth = 1; ctx.stroke();

        ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI*2);
        ctx.fillStyle = `rgba(201,168,76,${alpha * 0.9})`;
        ctx.shadowBlur = 10; ctx.shadowColor = GOLD;
        ctx.fill(); ctx.shadowBlur = 0;

        if (p.z > R*0.2 && SIZE > 400) {
          ctx.fillStyle = `rgba(255,255,255,${alpha*0.7})`;
          ctx.font = `${Math.round(SIZE*0.018)}px 'Space Mono',monospace`;
          ctx.fillText(name, p.x + 8, p.y - 4);
        }
      });
    };

    let rot = 0;
    const loop = () => {
      rot += 0.08;
      rotRef.current = rot;
      drawGlobe(rot);
      animFrame = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(animFrame);
  }, []);

  return (
    <canvas ref={ref} style={{
      width: "100%", height: "100%",
      maxWidth: "min(70vw, 700px)", maxHeight: "min(70vw, 700px)",
    }}/>
  );
}

// ── SCROLL REVEAL ────────────────────────────────────────────────────────────────
function Reveal({ children, delay=0, direction="up", style }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting) setVis(true); }, { threshold: 0.1 });
    if(ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const transforms = { up:"translateY(60px)", down:"translateY(-60px)", left:"translateX(-60px)", right:"translateX(60px)" };
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "none" : (transforms[direction] || "translateY(60px)"),
      transition: `opacity 0.9s ${delay}ms cubic-bezier(0.22,1,0.36,1), transform 1s ${delay}ms cubic-bezier(0.22,1,0.36,1)`,
      ...style,
    }}>{children}</div>
  );
}

// ── COUNTER ──────────────────────────────────────────────────────────────────────
function Counter({ end, suffix="", prefix="" }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if(e.isIntersecting && !done.current) {
        done.current = true;
        const s = Date.now();
        const tick = () => {
          const p = Math.min((Date.now()-s)/2000, 1);
          setN(Math.round((1-Math.pow(1-p,3))*end));
          if(p<1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    if(ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{prefix}{n.toLocaleString()}{suffix}</span>;
}

// ── TYPEWRITER ──────────────────────────────────────────────────────────────────
function TypeWriter({ phrases, speed=70, pauseMs=2500 }) {
  const [pi, setPi] = useState(0);
  const [txt, setTxt] = useState("");
  const [del, setDel] = useState(false);
  const [ci, setCi] = useState(0);
  useEffect(() => {
    const w = phrases[pi % phrases.length];
    if(!del) {
      if(ci < w.length) { const t=setTimeout(()=>{setTxt(w.slice(0,ci+1));setCi(c=>c+1);},speed);return()=>clearTimeout(t); }
      else { const t=setTimeout(()=>setDel(true),pauseMs);return()=>clearTimeout(t); }
    } else {
      if(ci>0) { const t=setTimeout(()=>{setTxt(w.slice(0,ci-1));setCi(c=>c-1);},speed/2);return()=>clearTimeout(t); }
      else { setDel(false);setPi(p=>p+1); }
    }
  },[ci,del,pi,phrases,speed,pauseMs]);
  return <span style={{color:GOLD,fontWeight:600}}>{txt}<span style={{animation:"lp2_blink 0.8s step-end infinite",color:GOLD}}>|</span></span>;
}

// ── MAIN LANDING PAGE 2 ──────────────────────────────────────────────────────────
export default function LandingPage2() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [navVis, setNavVis] = useState(false);
  const heroRef = useRef(null);
  const globeRef = useRef(null);
  const demoRef = useRef(null);
  const cabRef = useRef(null);

  const [globeVis, setGlobeVis] = useState(false);
  const [demoVis, setDemoVis] = useState(false);
  const [cabVis, setCabVis] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [cabReveal, setCabReveal] = useState(0); // 0-100

  const onLoad = useCallback(() => setLoaded(true), []);

  useEffect(() => {
    const fn = () => {
      const sy = window.scrollY;
      setScrollY(sy);
      setNavVis(sy > 80);

      // Globe section
      if(globeRef.current) {
        const r = globeRef.current.getBoundingClientRect();
        if(r.top < window.innerHeight * 0.8) setGlobeVis(true);
      }
      // Demo section
      if(demoRef.current) {
        const r = demoRef.current.getBoundingClientRect();
        if(r.top < window.innerHeight * 0.6) {
          setDemoVis(true);
          // Progress demo messages based on scroll
          const progress = Math.max(0, Math.min(1, (window.innerHeight*0.6 - r.top) / (window.innerHeight*0.8)));
          setDemoStep(Math.floor(progress * 6));
        }
      }
      // Cab section
      if(cabRef.current) {
        const r = cabRef.current.getBoundingClientRect();
        if(r.top < window.innerHeight) {
          const progress = Math.max(0, Math.min(100, (window.innerHeight - r.top) / (window.innerHeight * 0.8) * 100));
          setCabReveal(progress);
          if(r.top < window.innerHeight * 0.7) setCabVis(true);
        }
      }
    };
    window.addEventListener("scroll", fn, { passive:true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const goApp = () => navigate(localStorage.getItem("token") ? "/ai" : "/register");
  const goSearch = () => navigate(localStorage.getItem("token") ? "/search" : "/login");

  // Parallax for hero
  const heroParallax = scrollY * 0.4;
  const heroOpacity = Math.max(0, 1 - scrollY / 600);

  // Demo messages
  const DEMO_MSGS = [
    { role:"user", text:"6 friends from Bangalore to Goa in August. Budget ₹15,000 per person. Two vegetarians. One arrives a day late. Prefer beaches." },
    { role:"ai", text:"Got it! Let me break this down for all 6 of you 🌴" },
    { role:"ai", text:`✈️ Flights BLR→GOI: ₹3,500–4,500/person return
For 6 people = ₹21,000–27,000 total

Book 4–6 weeks early for best fares!` },
    { role:"ai", text:`🏨 South Goa hotels (beaches over nightlife):
- Palolem / Agonda area
- Budget: ₹800–1,800/night per room
- For 6 = 2–3 rooms, ~₹5,400–7,200/night` },
    { role:"ai", text:"🥗 Vegetarian options: South Goa has great veg-friendly restaurants. Recommend Café Chocolatti, La Pizzeria Agonda." },
    { role:"ai", text:"👤 Late arrival plan: 5 friends fly together. 1 books separate ticket arriving next day — Goa taxi from airport ₹400–600." },
    { role:"ai", text:`💰 Total budget per person: ₹11,500–14,500
✅ Fits your ₹15,000 budget!

Ready to book flights? 👇`, card:true },
  ];

  return (
    <>
      <style>{STYLES}</style>
      {!loaded && <LoadingScreen onDone={onLoad}/>}
      <ParticleCanvas/>

      <div style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.8s ease", minHeight:"100vh", background:"#050505" }}>

        {/* ── NAVBAR ── */}
        <nav style={{
          position:"fixed", top:0, left:0, right:0, zIndex:100,
          padding:"0 5%", height:64,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          background: navVis ? "rgba(5,5,5,0.85)" : "transparent",
          backdropFilter: navVis ? "blur(20px)" : "none",
          borderBottom: navVis ? "1px solid rgba(255,255,255,0.05)" : "none",
          transition:"all 0.4s ease",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={() => window.scrollTo({top:0,behavior:"smooth"})}>
            <div style={{
              width:32, height:32, borderRadius:"50%",
              background:`linear-gradient(135deg,${GOLD_D},${GOLD},${GOLD_L})`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:14, color:"#050505", fontWeight:900,
              animation:"lp2_float 4s ease-in-out infinite",
            }}>A</div>
            <div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:18, color:"#fff", letterSpacing:"0.18em" }}>ALVRYN</div>
            </div>
          </div>

          <div className="lp2-hide-mobile" style={{ display:"flex", gap:32 }}>
            {[["How it works","#how"],["Destinations","#dest"],["AI Demo","#demo"]].map(([l,h]) => (
              <a key={l} href={h} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"rgba(255,255,255,0.5)", textDecoration:"none", transition:"color 0.2s", letterSpacing:"0.03em" }}
                onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.5)"}>{l}</a>
            ))}
          </div>

          <div style={{ display:"flex", gap:10 }}>
            <button onClick={goSearch} className="lp2-btn-ghost" style={{ padding:"9px 20px", fontSize:13 }}>Sign In</button>
            <button onClick={goApp} className="lp2-btn-primary" style={{ padding:"9px 20px", fontSize:13 }}>Try Free ✦</button>
          </div>
        </nav>

        {/* ══════════════════════════════════════════
            SECTION 1 — CINEMATIC HERO
        ══════════════════════════════════════════ */}
        <section ref={heroRef} style={{
          minHeight:"100vh", position:"relative", overflow:"hidden",
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          {/* Background atmosphere */}
          <div style={{
            position:"absolute", inset:0,
            background:"radial-gradient(ellipse at 50% 60%, rgba(201,168,76,0.06) 0%, transparent 60%), radial-gradient(ellipse at 20% 20%, rgba(201,168,76,0.03) 0%, transparent 50%)",
            transform:`translateY(${heroParallax * 0.3}px)`,
          }}/>

          {/* Scanline effect */}
          <div style={{
            position:"absolute", inset:0, pointerEvents:"none", zIndex:1,
            background:"repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
            opacity:0.5,
          }}/>

          {/* Main content */}
          <div style={{
            position:"relative", zIndex:2,
            width:"100%", maxWidth:1100,
            padding:"0 5%",
            textAlign:"center",
            transform:`translateY(${heroParallax * -0.15}px)`,
            opacity: heroOpacity,
          }}>
            {/* Eyebrow */}
            <div style={{
              display:"inline-flex", alignItems:"center", gap:8,
              padding:"8px 20px", borderRadius:100,
              border:`1px solid ${GOLD}22`,
              background:`${GOLD}08`,
              marginBottom:48,
              fontFamily:"'Space Mono',monospace", fontSize:10,
              color:GOLD, letterSpacing:"0.22em",
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(-20px)",
              transition:"all 0.8s 0.2s ease",
            }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:GOLD, animation:"lp2_pulse 2s ease-in-out infinite" }}/>
              AI-POWERED TRAVEL COMPANION
            </div>

            {/* Split headline — Jesko Jets style */}
            <div style={{ overflow:"hidden", marginBottom:8 }}>
              <div style={{
                fontFamily:"'Cormorant Garamond',serif", fontWeight:200,
                fontSize:"clamp(60px,9vw,140px)",
                color:"#fff", lineHeight:0.95, letterSpacing:"-0.02em",
                opacity: loaded ? 1 : 0,
                transform: loaded ? "translateY(0)" : "translateY(80px)",
                transition:"all 1s 0.4s cubic-bezier(0.22,1,0.36,1)",
                display:"flex", justifyContent:"space-between", alignItems:"baseline",
                padding:"0 2%",
              }}>
                <span style={{ opacity:0.9 }}>TRAVEL</span>
                <span style={{ opacity:0.9 }}>BEYOND</span>
              </div>
            </div>
            <div style={{ overflow:"hidden", marginBottom:48 }}>
              <div style={{
                fontFamily:"'Cormorant Garamond',serif", fontWeight:200,
                fontSize:"clamp(60px,9vw,140px)",
                lineHeight:0.95, letterSpacing:"-0.02em",
                opacity: loaded ? 1 : 0,
                transform: loaded ? "translateY(0)" : "translateY(80px)",
                transition:"all 1s 0.6s cubic-bezier(0.22,1,0.36,1)",
                display:"flex", justifyContent:"center",
              }}>
                <span className="lp2-gold-text">BOUNDARIES</span>
              </div>
            </div>

            {/* Sub headline with typewriter */}
            <div style={{
              fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(16px,2vw,20px)",
              color:"rgba(255,255,255,0.45)", lineHeight:1.6,
              marginBottom:52, maxWidth:560, margin:"0 auto 52px",
              opacity: loaded ? 1 : 0, transition:"opacity 0.8s 1.2s ease",
            }}>
              Plan your entire trip in one message —{" "}
              <TypeWriter phrases={["plain English.", "Hindi or Tamil.", "any language.", "even with typos.", "complete itinerary."]}/>
            </div>

            {/* CTAs */}
            <div style={{
              display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap",
              opacity: loaded ? 1 : 0, transition:"opacity 0.8s 1.5s ease",
            }}>
              <button onClick={goApp} className="lp2-btn-primary">
                ✦ Try Alvryn AI Free
              </button>
              <button onClick={goSearch} className="lp2-btn-ghost">
                Search Flights →
              </button>
            </div>

            {/* Scroll indicator */}
            <div style={{
              position:"absolute", bottom:-80, left:"50%", transform:"translateX(-50%)",
              display:"flex", flexDirection:"column", alignItems:"center", gap:8,
              animation:"lp2_float 2.5s ease-in-out infinite",
              opacity: loaded ? 0.4 : 0, transition:"opacity 0.8s 2s ease",
            }}>
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:8, letterSpacing:"0.3em", color:"rgba(255,255,255,0.4)" }}>SCROLL</span>
              <div style={{ width:1, height:40, background:`linear-gradient(${GOLD},transparent)` }}/>
            </div>
          </div>

          {/* Atmospheric bottom gradient */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"30%", background:"linear-gradient(transparent,#050505)", pointerEvents:"none" }}/>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 2 — GLOBE + DESTINATIONS
        ══════════════════════════════════════════ */}
        <section id="dest" ref={globeRef} style={{
          minHeight:"100vh", position:"relative", overflow:"hidden",
          display:"flex", alignItems:"center",
          padding:"100px 5%",
        }}>
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 60% 50%, rgba(201,168,76,0.05) 0%, transparent 60%)" }}/>

          <div style={{
            position:"relative", zIndex:2, width:"100%",
            display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center",
          }}>
            {/* Left — Text */}
            <div>
              <Reveal>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:GOLD, letterSpacing:"0.22em", marginBottom:20 }}>GLOBAL REACH</div>
              </Reveal>
              <Reveal delay={100}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:200, fontSize:"clamp(36px,5vw,72px)", lineHeight:1.05, marginBottom:24, color:"#fff" }}>
                  Any destination.<br/>
                  <span className="lp2-gold-text">One conversation.</span>
                </div>
              </Reveal>
              <Reveal delay={200}>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:16, color:"rgba(255,255,255,0.45)", lineHeight:1.8, maxWidth:420, marginBottom:40 }}>
                  From Electronic City to Dubai, Goa to Singapore — Alvryn plans your complete door-to-door trip. Flight, hotel, transfers and itinerary. All in one message.
                </p>
              </Reveal>

              {/* Stats grid — MachinaFusion style */}
              <Reveal delay={300}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  {[
                    { n:500, s:"+", label:"Destinations", sub:"Domestic & International" },
                    { n:60, s:"s", label:"Avg Response", sub:"AI to complete plan" },
                    { n:300, s:"+", label:"Bus Routes", sub:"Across India" },
                    { n:10, s:"+", label:"Languages", sub:"Understands any mix" },
                  ].map((stat, i) => (
                    <div key={i} className="lp2-glass" style={{ padding:"20px 24px" }}>
                      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:600, fontSize:36, color:GOLD, lineHeight:1 }}>
                        <Counter end={stat.n} suffix={stat.s}/>
                      </div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:14, color:"#fff", marginTop:6 }}>{stat.label}</div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"rgba(255,255,255,0.3)", marginTop:2 }}>{stat.sub}</div>
                      {/* Progress bar */}
                      <div style={{ marginTop:12, height:2, background:"rgba(255,255,255,0.06)", borderRadius:1, overflow:"hidden" }}>
                        <div style={{
                          height:"100%",
                          width: globeVis ? `${[75,65,85,70][i]}%` : "0%",
                          background:`linear-gradient(90deg,${GOLD_D},${GOLD})`,
                          transition:"width 1.5s 0.5s cubic-bezier(0.22,1,0.36,1)",
                          boxShadow:`0 0 8px ${GOLD}66`,
                        }}/>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Right — Globe */}
            <Reveal delay={200} direction="right">
              <div style={{
                display:"flex", alignItems:"center", justifyContent:"center",
                position:"relative",
                animation:"lp2_float 8s ease-in-out infinite",
              }}>
                {/* Glow behind globe */}
                <div style={{
                  position:"absolute", width:"80%", height:"80%", borderRadius:"50%",
                  background:`radial-gradient(circle,${GOLD}08,transparent 70%)`,
                  filter:"blur(40px)",
                }}/>
                <GlobeCanvas scrollY={scrollY} containerHeight={600}/>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 3 — HOW IT WORKS
        ══════════════════════════════════════════ */}
        <section id="how" style={{ padding:"120px 5%", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,#050505,#080808,#050505)" }}/>

          <div style={{ position:"relative", zIndex:2, maxWidth:1100, margin:"0 auto" }}>
            <Reveal style={{ textAlign:"center", marginBottom:80 }}>
              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:GOLD, letterSpacing:"0.22em", marginBottom:20 }}>THE EXPERIENCE</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:200, fontSize:"clamp(36px,5vw,72px)", color:"#fff", lineHeight:1.1 }}>
                Not a search engine.<br/><span className="lp2-gold-text">A travel companion.</span>
              </div>
            </Reveal>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
              {[
                { n:"01", icon:"💬", title:"Type Naturally", desc:"Any language, any style, any complexity. Alvryn understands group trips, dietary needs, budgets, late arrivals — everything you mention.", color:`${GOLD}33` },
                { n:"02", icon:"🧠", title:"AI Plans Everything", desc:"Extracts every constraint you mentioned. Builds a complete door-to-door plan — flights, hotel, transfers, itinerary and budget breakdown.", color:"rgba(99,102,241,0.2)" },
                { n:"03", icon:"✅", title:"Book in One Click", desc:"Flight links, hotel search, bus booking — all pre-filled with your details. Opens directly on partner site. Zero extra cost from Alvryn.", color:"rgba(16,185,129,0.2)" },
              ].map((s, i) => (
                <Reveal key={i} delay={i*120}>
                  <div className="lp2-card" style={{ padding:"36px 28px", height:"100%" }}>
                    <div style={{ fontSize:32, marginBottom:20 }}>{s.icon}</div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:700, fontSize:44, color:GOLD, lineHeight:1, marginBottom:16 }}>{s.n}</div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:18, color:"#fff", marginBottom:12 }}>{s.title}</div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:"rgba(255,255,255,0.4)", lineHeight:1.7 }}>{s.desc}</div>
                    <div style={{ marginTop:24, height:1, background:`linear-gradient(90deg,${GOLD}44,transparent)` }}/>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 4 — LIVE AI DEMO (scroll-driven)
        ══════════════════════════════════════════ */}
        <section id="demo" ref={demoRef} style={{
          minHeight:"120vh", padding:"120px 5%", position:"relative", overflow:"hidden",
          background:"#030303",
        }}>
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.04) 0%, transparent 55%)" }}/>

          <div style={{ position:"relative", zIndex:2, maxWidth:1100, margin:"0 auto" }}>
            <Reveal style={{ marginBottom:64 }}>
              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:GOLD, letterSpacing:"0.22em", marginBottom:20 }}>LIVE DEMO</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:200, fontSize:"clamp(36px,5vw,72px)", color:"#fff", lineHeight:1.1 }}>
                Watch Alvryn plan<br/><span className="lp2-gold-text">a real trip.</span>
              </div>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:16, color:"rgba(255,255,255,0.35)", marginTop:16, maxWidth:480 }}>
                Scroll to see how Alvryn handles a complex 6-person trip query — addressing every single detail.
              </p>
            </Reveal>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, alignItems:"flex-start" }}>
              {/* Chat window */}
              <div>
                <div style={{
                  background:"rgba(255,255,255,0.02)",
                  border:"1px solid rgba(255,255,255,0.06)",
                  borderRadius:24, overflow:"hidden",
                }}>
                  {/* Chat header */}
                  <div style={{
                    background:`linear-gradient(135deg,${GOLD_D}22,${GOLD}11)`,
                    borderBottom:"1px solid rgba(255,255,255,0.05)",
                    padding:"16px 20px",
                    display:"flex", alignItems:"center", gap:12,
                  }}>
                    <div style={{ width:36, height:36, borderRadius:"50%", background:`linear-gradient(135deg,${GOLD_D},${GOLD})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>✦</div>
                    <div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:14, color:"#fff" }}>Alvryn AI</div>
                      <div style={{ fontSize:11, color:GOLD, display:"flex", alignItems:"center", gap:5 }}><span style={{ width:5, height:5, borderRadius:"50%", background:"#22c55e", display:"inline-block" }}/>Online</div>
                    </div>
                  </div>
                  {/* Messages */}
                  <div style={{ padding:"20px", display:"flex", flexDirection:"column", gap:12, minHeight:420 }}>
                    {DEMO_MSGS.slice(0, Math.max(1, demoStep + 1)).map((m, i) => (
                      <div key={i} style={{
                        display:"flex", justifyContent: m.role==="user" ? "flex-end" : "flex-start",
                        opacity: i <= demoStep ? 1 : 0,
                        transform: i <= demoStep ? "translateY(0)" : "translateY(20px)",
                        transition:`all 0.5s ${i*0.1}s ease`,
                      }}>
                        <div style={{
                          maxWidth:"85%", padding:"12px 16px",
                          borderRadius: m.role==="user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                          background: m.role==="user" ? `linear-gradient(135deg,${GOLD_D},${GOLD})` : "rgba(255,255,255,0.05)",
                          border: m.role==="ai" ? "1px solid rgba(255,255,255,0.08)" : "none",
                          fontFamily:"'DM Sans',sans-serif", fontSize:13, lineHeight:1.6,
                          color: m.role==="user" ? "#050505" : "rgba(255,255,255,0.85)",
                          fontWeight: m.role==="user" ? 600 : 400,
                          whiteSpace:"pre-line",
                        }}>
                          {m.text}
                          {m.card && (
                            <div style={{ marginTop:12, padding:"12px", background:`${GOLD}11`, borderRadius:10, border:`1px solid ${GOLD}22` }}>
                              <div style={{ fontSize:12, color:GOLD, fontWeight:700, marginBottom:6 }}>✈ Book Flights BLR → GOI</div>
                              <button onClick={goSearch} style={{ background:GOLD, color:"#050505", border:"none", borderRadius:8, padding:"7px 14px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                                Check Live Prices →
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Input bar */}
                  <div style={{ padding:"12px 16px", borderTop:"1px solid rgba(255,255,255,0.05)", display:"flex", gap:10 }}>
                    <div style={{ flex:1, background:"rgba(255,255,255,0.04)", borderRadius:100, padding:"10px 16px", fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"rgba(255,255,255,0.25)" }}>
                      Ask me anything about your journey...
                    </div>
                    <button onClick={goApp} style={{ width:40, height:40, borderRadius:"50%", background:`linear-gradient(135deg,${GOLD_D},${GOLD})`, border:"none", cursor:"pointer", color:"#050505", fontSize:18 }}>↑</button>
                  </div>
                </div>
              </div>

              {/* Right — Feature highlights */}
              <div style={{ display:"flex", flexDirection:"column", gap:20, paddingTop:20 }}>
                <Reveal delay={100}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:200, fontSize:"clamp(22px,3vw,36px)", color:"#fff", lineHeight:1.3, marginBottom:8 }}>
                    Every detail.<br/><span className="lp2-gold-text">Addressed.</span>
                  </div>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, color:"rgba(255,255,255,0.35)", lineHeight:1.7, marginBottom:32 }}>
                    Alvryn doesn't just extract the destination — it addresses every constraint: group size, budget, dietary needs, late arrivals, preferences.
                  </p>
                </Reveal>
                {[
                  { icon:"👥", label:"Group of 6", desc:"Per person + total budget breakdown", active: demoStep >= 2 },
                  { icon:"🥗", label:"2 Vegetarians", desc:"Veg-friendly hotel & restaurant picks", active: demoStep >= 4 },
                  { icon:"🕐", label:"Late Arrival", desc:"Separate arrival plan for 1 person", active: demoStep >= 5 },
                  { icon:"🏖️", label:"Beach Preference", desc:"South Goa recommended over nightlife", active: demoStep >= 3 },
                  { icon:"💰", label:"₹15k Budget", desc:"Per person + total = fully within budget", active: demoStep >= 2 },
                  { icon:"🛡️", label:"Safety Insights", desc:"Goa safety tips auto-appended", active: demoStep >= 1 },
                ].map((f, i) => (
                  <div key={i} style={{
                    display:"flex", gap:14, padding:"14px 16px",
                    borderRadius:14,
                    background: f.active ? `${GOLD}08` : "rgba(255,255,255,0.02)",
                    border: `1px solid ${f.active ? GOLD+"25" : "rgba(255,255,255,0.05)"}`,
                    transition:"all 0.4s ease",
                    transform: f.active ? "translateX(0)" : "translateX(-10px)",
                  }}>
                    <span style={{ fontSize:20, opacity: f.active ? 1 : 0.3 }}>{f.icon}</span>
                    <div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:14, color: f.active ? "#fff" : "rgba(255,255,255,0.3)" }}>{f.label}</div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color: f.active ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.15)", marginTop:2 }}>{f.desc}</div>
                    </div>
                    {f.active && <div style={{ marginLeft:"auto", display:"flex", alignItems:"center" }}><div style={{ width:6, height:6, borderRadius:"50%", background:GOLD }}/></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 5 — DESTINATIONS GRID
        ══════════════════════════════════════════ */}
        <section style={{ padding:"120px 5%", background:"#050505", position:"relative", overflow:"hidden" }}>
          <div style={{ maxWidth:1100, margin:"0 auto" }}>
            <Reveal style={{ textAlign:"center", marginBottom:64 }}>
              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:GOLD, letterSpacing:"0.22em", marginBottom:20 }}>WHERE TO?</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:200, fontSize:"clamp(36px,5vw,72px)", color:"#fff", lineHeight:1.1 }}>
                Every destination.<br/><span className="lp2-gold-text">Every budget.</span>
              </div>
            </Reveal>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16 }}>
              {[
                { name:"Goa", tag:"🏖️ Beaches", from:"BLR", budget:"₹5k–15k", img:"https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&h=300&q=70" },
                { name:"Dubai", tag:"✈️ International", from:"Any city", budget:"₹35k–70k", img:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&h=300&q=70" },
                { name:"Manali", tag:"🏔️ Hills", from:"DEL", budget:"₹8k–18k", img:"https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=400&h=300&q=70" },
                { name:"Singapore", tag:"🌆 City", from:"BLR", budget:"₹40k–80k", img:"https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=400&h=300&q=70" },
                { name:"Kerala", tag:"🌴 Nature", from:"BLR", budget:"₹10k–25k", img:"https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=400&h=300&q=70" },
                { name:"Bali", tag:"🌺 Tropical", from:"BLR", budget:"₹25k–55k", img:"https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=300&q=70" },
                { name:"Jaipur", tag:"🏰 Heritage", from:"DEL", budget:"₹6k–14k", img:"https://images.unsplash.com/photo-1477587458883-47145ed6d1f5?auto=format&fit=crop&w=400&h=300&q=70" },
                { name:"Bangkok", tag:"🛕 Culture", from:"BLR", budget:"₹20k–45k", img:"https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=400&h=300&q=70" },
                { name:"Ladakh", tag:"🗻 Adventure", from:"DEL", budget:"₹18k–35k", img:"https://images.unsplash.com/photo-1592555187028-51a64e5bba29?auto=format&fit=crop&w=400&h=300&q=70" },
                { name:"Maldives", tag:"🏝️ Luxury", from:"BLR", budget:"₹40k–1L", img:"https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=400&h=300&q=70" },
                { name:"Paris", tag:"🗼 Romance", from:"BOM", budget:"₹80k–1.5L", img:"https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&h=300&q=70" },
                { name:"Tokyo", tag:"🌸 Culture", from:"BLR", budget:"₹60k–1.2L", img:"https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=400&h=300&q=70" },
              ].map((d, i) => (
                <Reveal key={d.name} delay={i*50}>
                  <div
                    onClick={() => navigate(localStorage.getItem("token") ? `/ai?dest=${d.name}` : "/register")}
                    style={{
                      borderRadius:20, overflow:"hidden", cursor:"pointer",
                      position:"relative", aspectRatio:"3/4",
                      transition:"transform 0.4s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.3s ease",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform="scale(1.04) translateY(-6px)"; e.currentTarget.style.boxShadow=`0 30px 60px rgba(0,0,0,0.5),0 0 0 1px ${GOLD}22`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform="scale(1) translateY(0)"; e.currentTarget.style.boxShadow="none"; }}
                  >
                    <img src={d.img} alt={d.name} loading="lazy" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform 0.5s ease" }}
                      onError={e => { e.target.style.display="none"; }}
                      onMouseEnter={e => e.target.style.transform="scale(1.08)"}
                      onMouseLeave={e => e.target.style.transform="scale(1)"}
                    />
                    {/* Overlay */}
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.8) 0%,transparent 50%,rgba(0,0,0,0.1) 100%)" }}/>
                    {/* Tag */}
                    <div style={{ position:"absolute", top:12, right:12, background:"rgba(0,0,0,0.5)", backdropFilter:"blur(8px)", borderRadius:100, padding:"4px 12px", fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"#fff", border:"1px solid rgba(255,255,255,0.15)" }}>{d.tag}</div>
                    {/* Bottom info */}
                    <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"16px" }}>
                      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:700, fontSize:22, color:"#fff", lineHeight:1 }}>{d.name}</div>
                      <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:GOLD, marginTop:4 }}>{d.budget}</div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:2 }}>from {d.from}</div>
                    </div>
                    {/* Plan hover btn */}
                    <div style={{ position:"absolute", bottom:16, right:16, opacity:0, transition:"opacity 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.opacity=1}
                    >
                      <div style={{ background:GOLD, color:"#050505", borderRadius:100, padding:"6px 14px", fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700 }}>Plan →</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal style={{ textAlign:"center", marginTop:48 }}>
              <button onClick={goApp} className="lp2-btn-ghost" style={{ margin:"0 auto" }}>
                Plan any destination with AI →
              </button>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 6 — FEATURES
        ══════════════════════════════════════════ */}
        <section style={{ padding:"120px 5%", background:"#030303", position:"relative", overflow:"hidden" }}>
          <div style={{ maxWidth:1100, margin:"0 auto" }}>
            <Reveal style={{ textAlign:"center", marginBottom:80 }}>
              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:GOLD, letterSpacing:"0.22em", marginBottom:20 }}>CAPABILITIES</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:200, fontSize:"clamp(36px,5vw,72px)", color:"#fff", lineHeight:1.1 }}>
                Everything you need.<br/><span className="lp2-gold-text">Nothing you don't.</span>
              </div>
            </Reveal>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
              {[
                { icon:"🧠", title:"AI Trip Planner", desc:"Complete door-to-door plans. Any language, any complexity. Addresses every constraint you mention.", accent:GOLD },
                { icon:"✈️", title:"Flights Worldwide", desc:"60+ destinations. Domestic and international. Best fares via Aviasales.", accent:"#38bdf8" },
                { icon:"🚌", title:"Buses Across India", desc:"300+ routes. AC Sleeper, Semi-Sleeper. Real-time availability via RedBus.", accent:"#4ade80" },
                { icon:"🏨", title:"Hotels Worldwide", desc:"Budget to luxury. Best prices via Booking.com. Curated for your preferences.", accent:"#fb923c" },
                { icon:"🛡️", title:"Safety Insights", desc:"Proactive safety info auto-appended for every destination you mention.", accent:"#a78bfa" },
                { icon:"📱", title:"WhatsApp AI", desc:"Full trip planning inside WhatsApp. No app needed. Same intelligence, any device.", accent:"#22c55e" },
              ].map((f, i) => (
                <Reveal key={i} delay={i*80}>
                  <div className="lp2-card" style={{ padding:"32px 28px" }}>
                    <div style={{ fontSize:32, marginBottom:18 }}>{f.icon}</div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:18, color:"#fff", marginBottom:10 }}>{f.title}</div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:"rgba(255,255,255,0.4)", lineHeight:1.7 }}>{f.desc}</div>
                    <div style={{ marginTop:20, height:2, borderRadius:1, width:"40%", background:`linear-gradient(90deg,${f.accent},transparent)` }}/>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 7 — PLANS (TIERS)
        ══════════════════════════════════════════ */}
        <section style={{ padding:"120px 5%", background:"#050505", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 60%)" }}/>
          <div style={{ position:"relative", zIndex:2, maxWidth:1000, margin:"0 auto" }}>
            <Reveal style={{ textAlign:"center", marginBottom:64 }}>
              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:GOLD, letterSpacing:"0.22em", marginBottom:20 }}>PLANS</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:200, fontSize:"clamp(36px,5vw,72px)", color:"#fff", lineHeight:1.1 }}>
                Start free.<br/><span className="lp2-gold-text">Upgrade when ready.</span>
              </div>
            </Reveal>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
              {[
                {
                  name:"Explorer", badge:"FREE", active:true,
                  desc:"Perfect for getting started",
                  features:["20 AI responses/day","2 complete trip plans/month","Flights, buses & hotels","Safety insights","WhatsApp AI"],
                  cta:"Start Free", ctaAction:goApp,
                },
                {
                  name:"Navigator", badge:"PRO", active:false,
                  desc:"For serious travellers",
                  features:["Unlimited trip plans","Advanced AI planning","Smart budget optimizer","Multi-city planning","Priority AI processing","Save & revisit plans"],
                  cta:"Coming Soon", ctaAction:null,
                  soon:true,
                },
                {
                  name:"Voyager", badge:"PREMIUM", active:false,
                  desc:"The ultimate travel companion",
                  features:["Everything in Navigator","Group travel planner","Scam awareness","Women traveller mode","Emergency companion","Weather optimization"],
                  cta:"Coming Soon", ctaAction:null,
                  soon:true,
                },
              ].map((plan, i) => (
                <Reveal key={plan.name} delay={i*120}>
                  <div style={{
                    padding:"36px 28px",
                    borderRadius:24,
                    background: plan.active ? `linear-gradient(135deg,${GOLD_D}18,${GOLD}08)` : "rgba(255,255,255,0.02)",
                    border: plan.active ? `1px solid ${GOLD}44` : "1px solid rgba(255,255,255,0.06)",
                    position:"relative",
                    boxShadow: plan.active ? `0 0 60px ${GOLD}15` : "none",
                    height:"100%",
                  }}>
                    {plan.active && <div style={{ position:"absolute", top:-1, left:"50%", transform:"translateX(-50%)", background:GOLD, color:"#050505", padding:"4px 16px", borderRadius:"0 0 12px 12px", fontFamily:"'Space Mono',monospace", fontSize:9, fontWeight:700, letterSpacing:"0.1em" }}>LIVE NOW</div>}
                    <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color: plan.active ? GOLD : "rgba(255,255,255,0.3)", letterSpacing:"0.2em", marginBottom:8 }}>{plan.badge}</div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:600, fontSize:28, color:"#fff", marginBottom:8 }}>Alvryn {plan.name}</div>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"rgba(255,255,255,0.35)", marginBottom:28 }}>{plan.desc}</p>
                    <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:32 }}>
                      {plan.features.map(f => (
                        <div key={f} style={{ display:"flex", gap:10, alignItems:"center" }}>
                          <div style={{ width:5, height:5, borderRadius:"50%", background: plan.active ? GOLD : "rgba(255,255,255,0.2)", flexShrink:0 }}/>
                          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color: plan.active ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.3)" }}>{f}</span>
                        </div>
                      ))}
                    </div>
                    {plan.soon ? (
                      <div style={{ padding:"12px", borderRadius:12, border:`1px solid ${GOLD}22`, background:`${GOLD}06`, textAlign:"center" }}>
                        <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:GOLD, letterSpacing:"0.1em" }}>✦ Crafted with precision</div>
                      </div>
                    ) : (
                      <button onClick={plan.ctaAction} className="lp2-btn-primary" style={{ width:"100%" }}>{plan.cta}</button>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 8 — CAB COMING SOON (Scroll Reveal)
        ══════════════════════════════════════════ */}
        <section ref={cabRef} style={{
          minHeight:"100vh", background:"#030303", position:"relative", overflow:"hidden",
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          {/* Map grid background */}
          <div style={{
            position:"absolute", inset:0, opacity:0.04,
            backgroundImage:"linear-gradient(rgba(201,168,76,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.8) 1px,transparent 1px)",
            backgroundSize:"80px 80px",
          }}/>

          {/* City lights that reveal */}
          {Array.from({length:30},(_,i) => (
            <div key={i} style={{
              position:"absolute",
              left:`${10 + (i*137)%80}%`, top:`${10 + (i*97)%80}%`,
              width:3, height:3, borderRadius:"50%",
              background:GOLD,
              opacity: cabReveal > i*3 ? 0.4 + Math.random()*0.4 : 0,
              boxShadow:`0 0 8px ${GOLD}`,
              transition:"opacity 0.3s ease",
            }}/>
          ))}

          {/* Road lines reveal */}
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.06 }} viewBox="0 0 1000 600">
            {[100,200,300,400,500].map(y => (
              <line key={y} x1="0" y1={y} x2={cabReveal*10} y2={y} stroke={GOLD} strokeWidth="0.5" strokeDasharray="20 10"/>
            ))}
            {[200,400,600,800].map(x => (
              <line key={x} x1={x} y1="0" x2={x} y2={cabReveal*6} stroke={GOLD} strokeWidth="0.5" strokeDasharray="20 10"/>
            ))}
          </svg>

          {/* Main content */}
          <div style={{ position:"relative", zIndex:2, textAlign:"center", padding:"0 5%" }}>
            <div style={{
              fontFamily:"'Space Mono',monospace", fontSize:10, color:GOLD, letterSpacing:"0.22em",
              marginBottom:24, opacity: cabReveal > 10 ? 1 : 0, transition:"opacity 0.5s ease",
            }}>SOMETHING IS ARRIVING</div>

            {/* Giant CABS text — reveals with scroll */}
            <div style={{ position:"relative", marginBottom:32, overflow:"hidden" }}>
              <div style={{
                fontFamily:"'Cormorant Garamond',serif", fontWeight:100,
                fontSize:"clamp(80px,15vw,200px)", color:"#fff", lineHeight:0.9,
                opacity: Math.min(1, cabReveal/30),
                transform:`translateY(${Math.max(0,(30-cabReveal)*3)}px)`,
                transition:"none",
                letterSpacing:"0.08em",
              }}>
                CABS
              </div>
              {/* Gold overlay that reveals */}
              <div style={{
                position:"absolute", inset:0,
                background:`linear-gradient(135deg,${GOLD_D},${GOLD},${GOLD_L})`,
                WebkitBackgroundClip:"text", backgroundClip:"text",
                fontFamily:"'Cormorant Garamond',serif", fontWeight:700,
                fontSize:"clamp(80px,15vw,200px)", color:"transparent", lineHeight:0.9,
                display:"flex", alignItems:"center", justifyContent:"center",
                letterSpacing:"0.08em",
                clipPath:`inset(0 ${Math.max(0, 100-cabReveal)}% 0 0)`,
                transition:"none",
              }}>
                CABS
              </div>
            </div>

            <div style={{
              fontFamily:"'Cormorant Garamond',serif", fontWeight:200, fontSize:"clamp(20px,3vw,36px)", color:"rgba(255,255,255,0.6)",
              marginBottom:24,
              opacity: Math.min(1, (cabReveal-20)/30),
            }}>
              Alvryn Cabs
            </div>

            {/* Feature pills that appear */}
            <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginBottom:40 }}>
              {["Airport Transfers","Local Rides","Outstation Trips","Real-time Tracking","Transparent Pricing"].map((f,i) => (
                <div key={f} style={{
                  padding:"8px 20px", borderRadius:100,
                  border:`1px solid ${GOLD}22`,
                  background:`${GOLD}08`,
                  fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"rgba(255,255,255,0.5)",
                  opacity: cabReveal > 30 + i*8 ? 1 : 0,
                  transform: cabReveal > 30 + i*8 ? "translateY(0)" : "translateY(20px)",
                  transition:"all 0.4s ease",
                }}>
                  {f}
                </div>
              ))}
            </div>

            <div style={{ opacity: cabReveal > 70 ? 1 : 0, transition:"opacity 0.5s ease" }}>
              <button onClick={goApp} className="lp2-btn-ghost">
                Join Waitlist →
              </button>
            </div>

            <div style={{
              marginTop:20, fontFamily:"'Space Mono',monospace", fontSize:9, color:"rgba(255,255,255,0.2)", letterSpacing:"0.2em",
              opacity: cabReveal > 70 ? 1 : 0, transition:"opacity 0.5s ease",
            }}>
              COMING SOON · 2026
            </div>
          </div>

          {/* Bottom gradient */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"20%", background:"linear-gradient(transparent,#050505)", pointerEvents:"none" }}/>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 9 — FINAL CTA
        ══════════════════════════════════════════ */}
        <section style={{
          minHeight:"80vh", background:"#050505", position:"relative", overflow:"hidden",
          display:"flex", alignItems:"center", justifyContent:"center", padding:"120px 5%",
        }}>
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 60%)" }}/>

          <div style={{ position:"relative", zIndex:2, textAlign:"center", maxWidth:700 }}>
            <Reveal>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:200, fontSize:"clamp(48px,8vw,110px)", color:"#fff", lineHeight:0.95, marginBottom:32, letterSpacing:"-0.02em" }}>
                Start your<br/><span className="lp2-gold-text">journey.</span>
              </div>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:18, color:"rgba(255,255,255,0.35)", lineHeight:1.7, marginBottom:52, maxWidth:480, margin:"0 auto 52px" }}>
                India's most intelligent travel companion. Plan your complete trip in one message. Free forever.
              </p>
              <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
                <button onClick={goApp} className="lp2-btn-primary" style={{ fontSize:16, padding:"18px 48px" }}>
                  ✦ Try Alvryn AI — Free
                </button>
                <button onClick={goSearch} className="lp2-btn-ghost" style={{ fontSize:16, padding:"17px 36px" }}>
                  Search Travel →
                </button>
              </div>
              <div style={{ marginTop:40, fontFamily:"'Space Mono',monospace", fontSize:10, color:"rgba(255,255,255,0.15)", letterSpacing:"0.2em" }}>
                NO CREDIT CARD · FREE FOREVER · TRUSTED PARTNERS
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ background:"#030303", borderTop:"1px solid rgba(255,255,255,0.04)", padding:"48px 5%" }}>
          <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:24 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:`linear-gradient(135deg,${GOLD_D},${GOLD})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:"#050505", fontWeight:900 }}>A</div>
              <div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:16, color:"rgba(255,255,255,0.6)", letterSpacing:"0.15em" }}>ALVRYN</div>
              </div>
            </div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"rgba(255,255,255,0.2)" }}>
              © 2026 Alvryn · Built with ☕ in Bangalore · Travel Beyond Boundaries
            </div>
            <div style={{ display:"flex", gap:24 }}>
              {["About","Privacy","Terms","Contact"].map(l => (
                <span key={l} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"rgba(255,255,255,0.25)", cursor:"pointer", transition:"color 0.2s" }}
                  onMouseEnter={e=>e.target.style.color="rgba(255,255,255,0.6)"}
                  onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.25)"}>{l}</span>
              ))}
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}