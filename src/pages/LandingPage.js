import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND = "https://cometai-backend.onrender.com";

// ─── ICON ─────────────────────────────────────────────────────────────────────
const AlvrynIcon = ({ size = 40 }) => {
  const uid = `lp_${size}_${Math.random().toString(36).slice(2,5)}`;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{flexShrink:0}}>
      <defs>
        <linearGradient id={`${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c9a84c"/>
          <stop offset="50%" stopColor="#f0d080"/>
          <stop offset="100%" stopColor="#8B6914"/>
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" stroke={`url(#${uid})`} strokeWidth="1.2" fill="none"/>
      <circle cx="32" cy="32" r="26" stroke={`url(#${uid})`} strokeWidth="0.5" fill="none" opacity="0.4"/>
      <path d="M20 46 L28 18 L36 46" stroke={`url(#${uid})`} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M22.5 36 L33.5 36" stroke={`url(#${uid})`} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M26 46 L34 18 L42 46" stroke={`url(#${uid})`} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.45"/>
      <path d="M28 36 L40 36" stroke={`url(#${uid})`} strokeWidth="1" strokeLinecap="round" opacity="0.45"/>
      <circle cx="32" cy="9" r="1.5" fill={`url(#${uid})`}/>
      <path d="M29 9 L32 6 L35 9" stroke={`url(#${uid})`} strokeWidth="0.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

// ─── GRAVITY CANVAS ───────────────────────────────────────────────────────────
const GravityCanvas = ({ active }) => {
  const ref = useRef(null);
  const mouse = useRef({ x: -999, y: -999 });
  const particles = useRef([]);
  const raf = useRef(null);
  useEffect(() => {
    if (!active) return;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;
    const C = ["#c9a84c","#f0d080","#8B6914","#d4b868","#e8c84a"];
    particles.current = Array.from({length:52},()=>({
      x:Math.random()*W,y:Math.random()*H,
      vx:(Math.random()-0.5)*0.4,vy:(Math.random()-0.5)*0.4,
      r:Math.random()*1.8+0.4,
      color:C[Math.floor(Math.random()*C.length)],
      alpha:Math.random()*0.28+0.07,
    }));
    const resize=()=>{W=window.innerWidth;H=window.innerHeight;canvas.width=W;canvas.height=H;};
    window.addEventListener("resize",resize);
    const onMove=e=>{const t=e.touches?e.touches[0]:e;mouse.current={x:t.clientX,y:t.clientY};};
    window.addEventListener("mousemove",onMove);
    window.addEventListener("touchmove",onMove,{passive:true});
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      const{x:mx,y:my}=mouse.current;
      particles.current.forEach(p=>{
        const dx=mx-p.x,dy=my-p.y,dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<180&&dist>0){const f=(180-dist)/180;p.vx+=(dx/dist)*f*0.06;p.vy+=(dy/dist)*f*0.06;}
        p.vx*=0.96;p.vy*=0.96;
        p.vx+=(Math.random()-0.5)*0.03;p.vy+=(Math.random()-0.5)*0.03;
        p.x+=p.vx;p.y+=p.vy;
        if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;
        ctx.save();ctx.globalAlpha=p.alpha;ctx.shadowBlur=8;ctx.shadowColor=p.color;
        ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();ctx.restore();
      });
      particles.current.forEach((a,i)=>particles.current.slice(i+1).forEach(b=>{
        const d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<80){ctx.save();ctx.globalAlpha=(1-d/80)*0.07;ctx.strokeStyle=a.color;ctx.lineWidth=0.4;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.restore();}
      }));
      raf.current=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf.current);window.removeEventListener("resize",resize);window.removeEventListener("mousemove",onMove);window.removeEventListener("touchmove",onMove);};
  },[active]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",opacity:active?1:0,transition:"opacity 1s ease"}}/>;
};

// ─── SPLASH — fixed overlap ────────────────────────────────────────────────────
const Splash = ({ onDone }) => {
  const [phase, setPhase] = useState("wait"); // wait → drop → subtitle → fade
  const word = "ALVRYN";
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("drop"), 300);
    const t2 = setTimeout(() => setPhase("subtitle"), 300 + word.length * 90 + 600);
    const t3 = setTimeout(() => setPhase("fade"), 300 + word.length * 90 + 1600);
    const t4 = setTimeout(() => onDone(), 300 + word.length * 90 + 2300);
    return () => [t1,t2,t3,t4].forEach(clearTimeout);
  }, [onDone]);
  const active = phase === "drop" || phase === "subtitle" || phase === "fade";

  return (
    <div style={{
      position:"fixed",inset:0,zIndex:9999,background:"#faf8f4",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      opacity:phase==="fade"?0:1,
      transition:phase==="fade"?"opacity 0.7s cubic-bezier(0.4,0,0.2,1)":"none",
      pointerEvents:phase==="fade"?"none":"all",
      // padding so nothing clips
      padding:"20px",
    }}>
      {/* Icon — fades in with letters */}
      <div style={{
        marginBottom:24,
        opacity:active?1:0,
        transition:"opacity 0.5s ease 0.15s",
      }}>
        <AlvrynIcon size={52}/>
      </div>

      {/* ALVRYN letters drop in — overflow visible, enough height */}
      <div style={{
        display:"flex",
        alignItems:"flex-end",
        // Give enough height: font size ~100px × 1.25 line-height = 125px
        height:"clamp(70px, 13vw, 130px)",
        overflow:"visible",
        marginBottom:20,   // ← gap between name and tagline
      }}>
        {word.split("").map((ch, i) => (
          <span key={i} style={{
            display:"inline-block",
            fontFamily:"'Cormorant Garamond', serif",
            fontWeight:700,
            fontSize:"clamp(52px, 11vw, 106px)",
            color:"#1a1410",
            letterSpacing:"0.05em",
            lineHeight:1,
            transform:active?"translateY(0) rotate(0deg)":"translateY(-120px) rotate(-6deg)",
            opacity:active?1:0,
            transition:`transform 0.75s ${i*85}ms cubic-bezier(0.34,1.45,0.64,1), opacity 0.4s ${i*85}ms ease`,
          }}>{ch}</span>
        ))}
      </div>

      {/* Tagline — sits BELOW with margin, never overlaps */}
      <div style={{
        fontFamily:"'Space Mono', monospace",
        fontSize:"clamp(8px, 1.1vw, 11px)",
        color:"#c9a84c",
        letterSpacing:"0.32em",
        // Only visible after letters settle
        opacity:(phase==="subtitle"||phase==="fade")?1:0,
        transform:(phase==="subtitle"||phase==="fade")?"translateY(0)":"translateY(12px)",
        transition:"all 0.65s ease",
        textAlign:"center",
      }}>TRAVEL BEYOND BOUNDARIES</div>

      {/* Gold line */}
      <div style={{
        position:"absolute",
        bottom:"22%",left:"50%",transform:"translateX(-50%)",
        height:1,
        background:"linear-gradient(90deg,transparent,#c9a84c60,transparent)",
        width:(phase==="subtitle"||phase==="fade")?"38vw":"0vw",
        transition:"width 1s ease",
      }}/>
    </div>
  );
};

// ─── TYPEWRITER ───────────────────────────────────────────────────────────────
const TypeWriter = ({ phrases, color }) => {
  const [pi,setPi]=useState(0);const[txt,setTxt]=useState("");const[del,setDel]=useState(false);const[ci,setCi]=useState(0);
  useEffect(()=>{const w=phrases[pi%phrases.length];let t;if(!del){if(ci<w.length){t=setTimeout(()=>{setTxt(w.slice(0,ci+1));setCi(c=>c+1);},65);}else{t=setTimeout(()=>setDel(true),2000);}}else{if(ci>0){t=setTimeout(()=>{setTxt(w.slice(0,ci-1));setCi(c=>c-1);},35);}else{setDel(false);setPi(p=>p+1);}}return()=>clearTimeout(t);},[ci,del,pi,phrases]);
  return <span style={{color,fontWeight:700,fontStyle:"italic"}}>{txt}<span style={{animation:"blink 0.9s step-end infinite"}}>|</span></span>;
};

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
const Reveal = ({ children, delay=0, style, from="bottom" }) => {
  const ref=useRef(null);const[vis,setVis]=useState(false);
  useEffect(()=>{const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true);},{threshold:0.08});if(ref.current)obs.observe(ref.current);return()=>obs.disconnect();},[]);
  const T={bottom:vis?"translateY(0)":"translateY(50px)",left:vis?"translateX(0)":"translateX(-50px)",right:vis?"translateX(0)":"translateX(50px)",scale:vis?"scale(1)":"scale(0.91)"};
  return <div ref={ref} style={{opacity:vis?1:0,transform:T[from]||T.bottom,transition:`opacity 0.85s ${delay}ms cubic-bezier(0.22,1,0.36,1),transform 0.85s ${delay}ms cubic-bezier(0.22,1,0.36,1)`,...style}}>{children}</div>;
};

// ─── PARALLAX ────────────────────────────────────────────────────────────────
const useParallax=(speed=0.2)=>{
  const[offset,setOffset]=useState(0);const ref=useRef(null);
  useEffect(()=>{const fn=()=>{if(!ref.current)return;const rect=ref.current.getBoundingClientRect();setOffset((rect.top+rect.height/2-window.innerHeight/2)*speed);};window.addEventListener("scroll",fn,{passive:true});fn();return()=>window.removeEventListener("scroll",fn);},[speed]);
  return[ref,offset];
};

// ─── TILT CARD ────────────────────────────────────────────────────────────────
const TiltCard = ({ children, style, className }) => {
  const[t,setT]=useState({rx:0,ry:0,s:1});
  return <div className={className} onMouseMove={e=>{const r=e.currentTarget.getBoundingClientRect();setT({rx:((e.clientY-r.top)/r.height-0.5)*-9,ry:((e.clientX-r.left)/r.width-0.5)*9,s:1.025});}} onMouseLeave={()=>setT({rx:0,ry:0,s:1})} style={{transform:`perspective(1000px) rotateX(${t.rx}deg) rotateY(${t.ry}deg) scale(${t.s})`,transition:"transform 0.3s cubic-bezier(0.34,1.2,0.64,1)",...style}}>{children}</div>;
};

// ─── COUNTER ─────────────────────────────────────────────────────────────────
const Counter = ({ end, suffix="", prefix="" }) => {
  const[n,setN]=useState(0);const ref=useRef(null);const started=useRef(false);
  useEffect(()=>{const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting&&!started.current){started.current=true;const s=Date.now();const step=()=>{const p=Math.min((Date.now()-s)/2000,1);setN(Math.round((1-Math.pow(1-p,3))*end));if(p<1)requestAnimationFrame(step);};requestAnimationFrame(step);}},{threshold:0.4});if(ref.current)obs.observe(ref.current);return()=>obs.disconnect();},[end]);
  return <span ref={ref}>{prefix}{n.toLocaleString()}{suffix}</span>;
};

// ─── SCROLL PROGRESS ─────────────────────────────────────────────────────────
const useScrollProgress=()=>{const[p,setP]=useState(0);useEffect(()=>{const fn=()=>{const t=document.documentElement.scrollHeight-window.innerHeight;setP(t>0?window.scrollY/t:0);};window.addEventListener("scroll",fn,{passive:true});return()=>window.removeEventListener("scroll",fn);},[]);return p;};

// ─── FOOTER MODAL ─────────────────────────────────────────────────────────────
const Modal = ({ title, children, onClose }) => (
  <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:9000,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
    <div onClick={e=>e.stopPropagation()} style={{background:"#faf8f4",borderRadius:20,maxWidth:560,width:"100%",maxHeight:"80vh",overflowY:"auto",padding:"40px 36px",border:"1px solid rgba(201,168,76,0.2)",boxShadow:"0 40px 100px rgba(0,0,0,0.15)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:24,color:"#1a1410"}}>{title}</h3>
        <button onClick={onClose} style={{background:"none",border:"none",fontSize:24,color:"#999",cursor:"pointer",lineHeight:1}}>×</button>
      </div>
      <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#555",lineHeight:1.85}}>{children}</div>
    </div>
  </div>
);

const FOOTER_CONTENT = {
  "About Us":(
    <div>
      <p style={{marginBottom:14}}>Alvryn is India's next-generation travel booking platform, combining AI-powered search with seamless booking for flights and buses — all in one place, including WhatsApp.</p>
      <p style={{marginBottom:14}}>We believe travel planning should feel effortless. Whether you type "cheapest BLR to GOA on Friday" or send a WhatsApp message, Alvryn understands you and finds the best options instantly.</p>
      <p>Zero booking fees, always transparent.</p>
    </div>
  ),
  "Terms & Conditions":(
    <div>
      <p style={{marginBottom:14}}><strong>1. Acceptance</strong><br/>By using Alvryn, you agree to these terms.</p>
      <p style={{marginBottom:14}}><strong>2. Booking &amp; Payments</strong><br/>All bookings are subject to availability. Prices include applicable taxes. Zero booking fees.</p>
      <p style={{marginBottom:14}}><strong>3. Cancellations &amp; Refunds</strong><br/>Governed by the respective airline or bus operator. Alvryn facilitates the refund process.</p>
      <p style={{marginBottom:14}}><strong>4. User Responsibilities</strong><br/>You are responsible for accurate passenger information.</p>
      <p style={{marginBottom:14}}><strong>5. AI Search</strong><br/>AI results are for convenience. Verify pricing before confirming.</p>
      <p><strong>6. Changes</strong><br/>Alvryn may update these terms at any time.</p>
    </div>
  ),
  "Privacy Policy":(
    <div>
      <p style={{marginBottom:14}}><strong>What we collect</strong><br/>Name, email, and booking details to process your travel bookings.</p>
      <p style={{marginBottom:14}}><strong>How we use it</strong><br/>Solely to process bookings and send confirmation emails. We never sell your data.</p>
      <p style={{marginBottom:14}}><strong>Data security</strong><br/>All data is encrypted in transit and at rest. Passwords are hashed.</p>
      <p style={{marginBottom:14}}><strong>Cookies</strong><br/>Minimal session cookies for authentication only. No third-party tracking.</p>
      <p><strong>Contact</strong><br/>dynamics.studyai@gmail.com</p>
    </div>
  ),
  "Contact":(
    <div>
      <p style={{marginBottom:20}}>We'd love to hear from you — feedback, partnerships, or just a hello.</p>
      <div style={{padding:"16px 20px",background:"rgba(201,168,76,0.08)",borderRadius:12,border:"1px solid rgba(201,168,76,0.2)",marginBottom:16}}>
        <div style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:"#c9a84c",letterSpacing:"0.1em",marginBottom:6}}>EMAIL</div>
        <a href="mailto:dynamics.studyai@gmail.com" style={{color:"#1a1410",fontWeight:600,textDecoration:"none",fontSize:15}}>dynamics.studyai@gmail.com</a>
      </div>
      <p style={{color:"#999",fontSize:13}}>We typically respond within 24–48 hours.</p>
    </div>
  ),
};

// NAV section IDs
const NAV_LINKS = [
  {label:"How it Works", id:"how-it-works"},
  {label:"Features",     id:"features"},
  {label:"Flights",      id:"flights-section"},
  {label:"Buses",        id:"buses-section"},
];

// ═══════════════════════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════════════════════
export default function LandingPage() {
  const navigate = useNavigate();
  const [splashDone, setSplashDone] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const scrollProgress = useScrollProgress();

  const onSplashDone = useCallback(() => {
    setSplashDone(true);
    setTimeout(() => setHeroReady(true), 120);
  }, []);

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Keep-alive
  useEffect(() => {
    const ping = () => fetch(`${BACKEND}/test`).catch(() => {});
    ping();
    const t = setInterval(ping, 14 * 60 * 1000);
    return () => clearInterval(t);
  }, []);

  const goSearch = useCallback(() => navigate(localStorage.getItem("token") ? "/search" : "/login"), [navigate]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior:"smooth", block:"start" });
  };

  const [heroRef, heroOffset] = useParallax(0.15);
  const [sec2Ref, sec2Offset] = useParallax(0.12);

  const bgBlend = Math.min(scrollProgress * 1.8, 1);
  const dynamicBg = `rgb(${Math.round(250-bgBlend*18)},${Math.round(248-bgBlend*16)},${Math.round(244-bgBlend*22)})`;

  const features = [
    {icon:"🧠",title:"AI Natural Search",   desc:"Type in English, Hindi, Tamil, Telugu, Kannada — any mix. 'BLR to GOA kal sabse sasta' — done instantly.",color:"#c9a84c"},
    {icon:"✈️",title:"Domestic Flights",    desc:"500+ routes across India. Real-time fares, direct booking, instant e-ticket to your email.",color:"#8B6914"},
    {icon:"🚌",title:"Bus Booking",         desc:"AC, Sleeper, Semi-Sleeper buses across 30+ intercity routes. Choose your exact seat.",color:"#c9a84c"},
    {icon:"💬",title:"WhatsApp Booking",    desc:"Complete your entire booking inside WhatsApp. No app download needed.",color:"#25D366"},
    {icon:"💺",title:"Seat Selection",      desc:"Pick your window or aisle seat on flights and buses before you confirm.",color:"#8B6914"},
    {icon:"🔒",title:"Zero Hidden Fees",    desc:"The price you see is exactly what you pay. Always transparent.",color:"#c9a84c"},
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Space+Mono:wght@400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        @keyframes blink{50%{opacity:0;}}
        @keyframes floatUD{0%,100%{transform:translateY(0);}50%{transform:translateY(-9px);}}
        @keyframes gradShift{0%,100%{background-position:0% 50%;}50%{background-position:100% 50%;}}
        @keyframes borderGlow{0%,100%{border-color:rgba(201,168,76,0.2);}50%{border-color:rgba(201,168,76,0.55);}}
        @keyframes spinSlow{from{transform:translate(-50%,-50%) rotate(0deg);}to{transform:translate(-50%,-50%) rotate(360deg);}}
        @keyframes pulseGold{0%,100%{opacity:1;}50%{opacity:0.45;}}
        ::-webkit-scrollbar{width:2px;}
        ::-webkit-scrollbar-thumb{background:linear-gradient(#c9a84c,#8B6914);border-radius:2px;}
        .btn-p{position:relative;overflow:hidden;cursor:pointer;transition:transform 0.22s cubic-bezier(0.34,1.4,0.64,1),box-shadow 0.22s ease;}
        .btn-p:hover{transform:translateY(-3px);}
        .btn-p::after{content:'';position:absolute;inset:0;background:linear-gradient(120deg,transparent 20%,rgba(255,255,255,0.28) 50%,transparent 80%);transform:translateX(-100%);transition:transform 0.55s ease;}
        .btn-p:hover::after{transform:translateX(100%);}
        .c-hover{transition:transform 0.35s cubic-bezier(0.34,1.2,0.64,1),box-shadow 0.35s ease;}
        .c-hover:hover{transform:translateY(-7px)!important;box-shadow:0 22px 60px rgba(0,0,0,0.1)!important;}
        .gold-hr{height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,0.35),transparent);border:none;margin:0;}
        @media(max-width:900px){
          .hgrid{flex-direction:column!important;}
          .mhide{display:none!important;}
          .fgrid{grid-template-columns:1fr 1fr!important;}
          .hgrid2{grid-template-columns:1fr!important;}
          .wgrid{grid-template-columns:1fr!important;}
          .sgrid{grid-template-columns:1fr 1fr!important;}
          .pgrid{grid-template-columns:1fr 1fr!important;}
        }
        @media(max-width:540px){
          .fgrid{grid-template-columns:1fr!important;}
          .sgrid{grid-template-columns:1fr 1fr!important;}
          .nl{display:none!important;}
          .crow{flex-direction:column!important;align-items:stretch!important;}
          .crow button{width:100%!important;}
          .pgrid{grid-template-columns:1fr!important;}
        }
      `}</style>

      {splashDone && <GravityCanvas active={splashDone}/>}
      {!splashDone && <Splash onDone={onSplashDone}/>}

      {/* Scroll progress bar */}
      <div style={{position:"fixed",top:0,left:0,zIndex:1100,height:2,width:`${scrollProgress*100}%`,background:"linear-gradient(90deg,#c9a84c,#f0d080,#8B6914)",transition:"width 0.1s linear",pointerEvents:"none"}}/>

      <div style={{opacity:splashDone?1:0,transition:"opacity 0.7s ease",background:dynamicBg,minHeight:"100vh"}}>

        {/* ── NAVBAR ── */}
        <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,height:68,padding:"0 5%",display:"flex",alignItems:"center",justifyContent:"space-between",background:navScrolled?"rgba(250,248,244,0.93)":"transparent",backdropFilter:navScrolled?"blur(24px)":"none",borderBottom:navScrolled?"1px solid rgba(201,168,76,0.13)":"none",transition:"all 0.45s ease"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>
            <div style={{animation:"floatUD 5s ease-in-out infinite"}}><AlvrynIcon size={44}/></div>
            <div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:19,color:"#1a1410",letterSpacing:"0.13em",lineHeight:1.1}}>ALVRYN</div>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:7,color:"#c9a84c",letterSpacing:"0.22em"}}>TRAVEL BEYOND</div>
            </div>
          </div>

          {/* Smooth scroll nav links */}
          <div className="nl" style={{display:"flex",gap:32}}>
            {NAV_LINKS.map(({label,id})=>(
              <span key={id} onClick={()=>scrollToSection(id)} style={{fontFamily:"'DM Sans',sans-serif",fontSize:13.5,fontWeight:500,color:"#1a1410",opacity:0.5,cursor:"pointer",transition:"opacity 0.2s,color 0.2s"}}
                onMouseEnter={e=>{e.target.style.opacity=1;e.target.style.color="#8B6914";}}
                onMouseLeave={e=>{e.target.style.opacity=0.5;e.target.style.color="#1a1410";}}>{label}</span>
            ))}
          </div>

          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <button onClick={()=>navigate("/login")} style={{padding:"9px 22px",borderRadius:10,fontSize:13.5,fontWeight:600,fontFamily:"'DM Sans',sans-serif",background:"transparent",color:"#1a1410",border:"1px solid rgba(26,20,16,0.16)",cursor:"pointer",transition:"border-color 0.2s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#c9a84c"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(26,20,16,0.16)"}>Sign In</button>
            <button onClick={()=>navigate("/register")} className="btn-p" style={{padding:"9px 24px",borderRadius:10,fontSize:14,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.08em",color:"#1a1410",border:"none",cursor:"pointer",background:"linear-gradient(135deg,#c9a84c,#f0d080,#c9a84c)",backgroundSize:"200% 200%",animation:"gradShift 4s ease infinite",boxShadow:"0 4px 18px rgba(201,168,76,0.32)"}}>Get Started</button>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section ref={heroRef} style={{minHeight:"100vh",display:"flex",alignItems:"center",position:"relative",overflow:"hidden",padding:"0 5%"}}>
          <div style={{position:"absolute",inset:0,pointerEvents:"none",background:"radial-gradient(ellipse at 65% 38%, rgba(201,168,76,0.07) 0%, transparent 55%), radial-gradient(ellipse at 18% 72%, rgba(139,105,20,0.04) 0%, transparent 50%)"}}/>
          <div style={{position:"absolute",right:"-10%",top:"12%",width:"min(58vw,620px)",height:"min(58vw,620px)",borderRadius:"50%",border:"1px solid rgba(201,168,76,0.1)",transform:`translateY(${heroOffset*0.45}px)`,transition:"transform 0.12s linear",pointerEvents:"none"}}/>
          <div style={{position:"absolute",right:"-5%",top:"18%",width:"min(44vw,470px)",height:"min(44vw,470px)",borderRadius:"50%",border:"1px solid rgba(201,168,76,0.06)",transform:`translateY(${heroOffset*0.28}px)`,transition:"transform 0.12s linear",pointerEvents:"none"}}/>

          <div className="hgrid" style={{position:"relative",zIndex:2,width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",gap:40,paddingTop:80}}>
            <div style={{maxWidth:640,flex:1,minWidth:0}}>
              {/* Badge */}
              <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:100,background:"rgba(201,168,76,0.08)",border:"1px solid rgba(201,168,76,0.22)",marginBottom:44,opacity:heroReady?1:0,transform:heroReady?"translateY(0)":"translateY(-14px)",transition:"all 0.65s 0.1s ease",animation:heroReady?"borderGlow 3s ease-in-out infinite":"none"}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:"#c9a84c",display:"inline-block",animation:"pulseGold 2s ease-in-out infinite"}}/>
                <span style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:"#8B6914",letterSpacing:"0.18em"}}>NOW LIVE · INDIA'S SMARTEST TRAVEL AI</span>
              </div>

              {/* Title */}
              <div style={{transform:`translateY(${heroOffset*-0.22}px)`,transition:"transform 0.12s linear"}}>
                {[["Travel",false,false],["Beyond",false,false],["Boundaries.",true,true]].map(([word,italic,gold],wi)=>(
                  <div key={wi} style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:italic?400:700,fontSize:"clamp(38px,5.8vw,90px)",lineHeight:1.0,letterSpacing:italic?"0.01em":"-0.02em",fontStyle:italic?"italic":"normal",color:gold?"transparent":"#1a1410",background:gold?"linear-gradient(135deg,#c9a84c,#f0d080,#8B6914)":"none",WebkitBackgroundClip:gold?"text":"unset",backgroundClip:gold?"text":"unset",WebkitTextFillColor:gold?"transparent":"unset",opacity:heroReady?1:0,transform:heroReady?"translateY(0)":"translateY(64px)",transition:`opacity 0.75s ${wi*130+200}ms ease, transform 0.85s ${wi*130+200}ms cubic-bezier(0.22,1,0.36,1)`}}>{word}</div>
                ))}
              </div>

              {/* Typewriter */}
              <div style={{marginTop:30,marginBottom:48,fontFamily:"'DM Sans',sans-serif",fontSize:"clamp(14px,1.7vw,19px)",color:"#6b5d4e",lineHeight:1.65,opacity:heroReady?1:0,transition:"opacity 0.6s 1.05s ease"}}>
                Book flights &amp; buses with{" "}
                <TypeWriter color="#8B6914" phrases={["plain English.","a WhatsApp message.","AI superpowers.","zero hidden fees.","Hindi, Tamil, Telugu..."]}/>
              </div>

              {/* CTAs */}
              <div className="crow" style={{display:"flex",gap:12,flexWrap:"wrap",opacity:heroReady?1:0,transition:"opacity 0.6s 1.35s ease"}}>
                <button onClick={goSearch} className="btn-p" style={{padding:"15px 38px",borderRadius:12,fontSize:15,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.1em",color:"#1a1410",border:"none",cursor:"pointer",background:"linear-gradient(135deg,#c9a84c,#f0d080,#c9a84c)",backgroundSize:"200% 200%",animation:"gradShift 3s ease infinite",boxShadow:"0 10px 36px rgba(201,168,76,0.38)"}}>Search Flights ✈</button>
                <button onClick={goSearch} className="btn-p" style={{padding:"15px 36px",borderRadius:12,fontSize:15,fontWeight:600,fontFamily:"'DM Sans',sans-serif",color:"#1a1410",background:"rgba(26,20,16,0.05)",border:"1px solid rgba(26,20,16,0.11)",cursor:"pointer"}}>Book a Bus 🚌</button>
                <button onClick={()=>navigate("/register")} style={{padding:"15px 22px",borderRadius:12,fontSize:14,fontWeight:500,fontFamily:"'DM Sans',sans-serif",color:"#8B6914",background:"transparent",border:"1px solid rgba(201,168,76,0.28)",cursor:"pointer",transition:"background 0.2s"}}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(201,168,76,0.07)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>Create Account →</button>
              </div>

              {/* Trust pills */}
              <div style={{display:"flex",gap:20,marginTop:34,flexWrap:"wrap",opacity:heroReady?1:0,transition:"opacity 0.6s 1.65s ease"}}>
                {["🔒 Secure Payments","📧 Instant Tickets","💬 WhatsApp Booking","500+ Routes"].map(b=>(
                  <span key={b} style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:"#ccc",letterSpacing:"0.05em"}}>{b}</span>
                ))}
              </div>
            </div>

            {/* Hero mockup */}
            <div className="mhide" style={{flexShrink:0,animation:"floatUD 7s ease-in-out infinite",opacity:heroReady?1:0,transition:"opacity 0.8s 1.9s ease"}}>
              <SearchMockCard/>
            </div>
          </div>

          {/* Scroll cue */}
          <div style={{position:"absolute",bottom:34,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:8,animation:"floatUD 2.5s ease-in-out infinite",opacity:heroReady?0.45:0,transition:"opacity 0.5s 2.1s ease"}}>
            <span style={{fontFamily:"'Space Mono',monospace",fontSize:8,color:"#c9a84c",letterSpacing:"0.26em"}}>SCROLL</span>
            <div style={{width:1,height:34,background:"linear-gradient(to bottom,#c9a84c,transparent)"}}/>
          </div>
        </section>

        <hr className="gold-hr"/>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" ref={sec2Ref} style={{minHeight:"100vh",position:"relative",overflow:"hidden",padding:"110px 5%",display:"flex",alignItems:"center",background:"rgba(201,168,76,0.025)"}}>
          <div style={{position:"absolute",bottom:"-8%",right:"-4%",width:480,height:480,borderRadius:"50%",background:"radial-gradient(circle,rgba(201,168,76,0.05),transparent 70%)",transform:`translateY(${sec2Offset}px)`,transition:"transform 0.12s linear",pointerEvents:"none"}}/>
          <div style={{position:"relative",zIndex:2,width:"100%"}}>
            <Reveal>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:"#c9a84c",letterSpacing:"0.25em",marginBottom:16}}>HOW IT WORKS</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"clamp(28px,5vw,64px)",color:"#1a1410",lineHeight:1.0,marginBottom:6}}>Book like you text.</h2>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:400,fontStyle:"italic",fontSize:"clamp(28px,5vw,64px)",lineHeight:1.0,marginBottom:64,background:"linear-gradient(135deg,#c9a84c,#f0d080,#8B6914)",WebkitBackgroundClip:"text",backgroundClip:"text",WebkitTextFillColor:"transparent"}}>No learning curve.</h2>
            </Reveal>
            <div className="hgrid2" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24}}>
              {[
                {n:"01",icon:"💬",title:"Type Naturally",desc:"'BLR to GOA kal cheapest' or 'Mumbai to Pune bus tomorrow' — Alvryn understands every style, every Indian language."},
                {n:"02",icon:"⚡",title:"AI Finds the Best",desc:"Searches across all flights and buses instantly. Results ranked by value and filtered by your budget."},
                {n:"03",icon:"✅",title:"Book in 60 Seconds",desc:"Pick your flight or bus, choose your seat, confirm. Your ticket lands in your email and WhatsApp immediately."},
              ].map((s,i)=>(
                <Reveal key={i} delay={i*120}>
                  <TiltCard className="c-hover" style={{padding:"40px 32px",borderRadius:20,cursor:"default",background:"rgba(255,255,255,0.7)",border:"1px solid rgba(201,168,76,0.12)",boxShadow:"0 4px 24px rgba(0,0,0,0.04)",backdropFilter:"blur(12px)"}}>
                    <div style={{fontSize:30,marginBottom:20}}>{s.icon}</div>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:28,color:"#c9a84c",marginBottom:12}}>{s.n}</div>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:19,color:"#1a1410",marginBottom:14}}>{s.title}</div>
                    <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#7a6d62",lineHeight:1.75}}>{s.desc}</div>
                    <div style={{marginTop:24,height:2,width:"50%",background:"linear-gradient(90deg,#c9a84c,transparent)",borderRadius:2}}/>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
            <Reveal delay={380}>
              <div style={{marginTop:44,padding:"14px 22px",borderRadius:14,display:"inline-flex",alignItems:"center",gap:14,background:"rgba(201,168,76,0.07)",border:"1px solid rgba(201,168,76,0.18)"}}>
                <span style={{fontSize:17}}>🔐</span>
                <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:13.5,color:"#6b5d4e"}}>
                  Free account — 30 seconds to sign up.{" "}
                  <span onClick={()=>navigate("/register")} style={{color:"#8B6914",cursor:"pointer",fontWeight:700,fontStyle:"italic"}}>Join Alvryn →</span>
                </span>
              </div>
            </Reveal>
          </div>
        </section>

        <hr className="gold-hr"/>

        {/* ── FEATURES ── */}
        <section id="features" style={{minHeight:"100vh",position:"relative",padding:"110px 5%",overflow:"hidden"}}>
          <div style={{position:"absolute",top:"28%",left:"-7%",width:460,height:460,borderRadius:"50%",background:"radial-gradient(circle,rgba(139,105,20,0.04),transparent 70%)",pointerEvents:"none"}}/>
          <div style={{position:"relative",zIndex:2}}>
            <Reveal style={{textAlign:"center",marginBottom:64}}>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:"#c9a84c",letterSpacing:"0.25em",marginBottom:16}}>FEATURES</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"clamp(26px,4.5vw,60px)",color:"#1a1410"}}>Everything you need.</h2>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:400,fontStyle:"italic",fontSize:"clamp(26px,4.5vw,60px)",background:"linear-gradient(135deg,#c9a84c,#f0d080,#8B6914)",WebkitBackgroundClip:"text",backgroundClip:"text",WebkitTextFillColor:"transparent"}}>Nothing you don't.</h2>
            </Reveal>
            <div className="fgrid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
              {features.map((f,i)=>(
                <Reveal key={i} delay={i*65} from="scale">
                  <TiltCard className="c-hover" style={{padding:"34px 28px",borderRadius:20,cursor:"default",background:"rgba(255,255,255,0.65)",border:"1px solid rgba(201,168,76,0.1)",boxShadow:"0 4px 20px rgba(0,0,0,0.04)",backdropFilter:"blur(10px)"}}>
                    <div style={{fontSize:30,marginBottom:18}}>{f.icon}</div>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:19,color:"#1a1410",marginBottom:11}}>{f.title}</div>
                    <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13.5,color:"#7a6d62",lineHeight:1.75,marginBottom:20}}>{f.desc}</div>
                    <div style={{height:2,width:"45%",background:`linear-gradient(90deg,${f.color},transparent)`,borderRadius:2}}/>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <hr className="gold-hr"/>

        {/* ── STATS — honest numbers only ── */}
        <section style={{padding:"100px 5%",background:"rgba(201,168,76,0.02)",position:"relative",overflow:"hidden"}}>
          <div style={{position:"relative",zIndex:2,textAlign:"center"}}>
            <Reveal>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"clamp(24px,3.8vw,50px)",color:"#1a1410",marginBottom:60}}>
                Built for India<span style={{fontStyle:"italic",color:"#c9a84c"}}> —</span>
              </h2>
            </Reveal>
            <div className="sgrid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20,maxWidth:900,margin:"0 auto"}}>
              {[
                {end:500,suf:"+",label:"Routes Available"},
                {end:30,suf:"+",label:"Cities Covered"},
                {end:60,suf:"s",label:"Avg Booking Time"},
                {end:0,suf:"",label:"Hidden Fees",prefix:"₹"},
              ].map((s,i)=>(
                <Reveal key={i} delay={i*90}>
                  <TiltCard className="c-hover" style={{padding:"36px 20px",borderRadius:20,cursor:"default",background:"rgba(255,255,255,0.7)",border:"1px solid rgba(201,168,76,0.12)",boxShadow:"0 4px 18px rgba(0,0,0,0.04)"}}>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:46,color:"#8B6914",lineHeight:1}}>
                      <Counter end={s.end} suffix={s.suf} prefix={s.prefix||""}/>
                    </div>
                    <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#bbb",marginTop:10,letterSpacing:"0.03em"}}>{s.label}</div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <hr className="gold-hr"/>

        {/* ── FLIGHTS SECTION ── */}
        <section id="flights-section" style={{padding:"80px 5%",background:"rgba(201,168,76,0.02)"}}>
          <div style={{maxWidth:760,margin:"0 auto",textAlign:"center"}}>
            <Reveal>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:"#c9a84c",letterSpacing:"0.25em",marginBottom:14}}>FLIGHTS</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"clamp(22px,3.5vw,44px)",color:"#1a1410",marginBottom:10}}>Domestic flights across India.</h2>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#7a6d62",lineHeight:1.8,marginBottom:36}}>Search and book flights on 500+ routes. Real-time fares, instant e-ticket, seat selection on domestic routes.</p>
              <button onClick={goSearch} className="btn-p" style={{padding:"14px 40px",borderRadius:12,fontSize:15,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.1em",color:"#1a1410",border:"none",cursor:"pointer",background:"linear-gradient(135deg,#c9a84c,#f0d080,#c9a84c)",backgroundSize:"200% 200%",animation:"gradShift 3s ease infinite",boxShadow:"0 8px 28px rgba(201,168,76,0.36)"}}>Search Flights ✈</button>
            </Reveal>
          </div>
        </section>

        <hr className="gold-hr"/>

        {/* ── BUSES SECTION ── */}
        <section id="buses-section" style={{padding:"80px 5%"}}>
          <div style={{maxWidth:760,margin:"0 auto",textAlign:"center"}}>
            <Reveal>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:"#c9a84c",letterSpacing:"0.25em",marginBottom:14}}>BUSES</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"clamp(22px,3.5vw,44px)",color:"#1a1410",marginBottom:10}}>30+ intercity bus routes.</h2>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#7a6d62",lineHeight:1.8,marginBottom:36}}>AC Sleeper, Semi-Sleeper and Seater buses across India. Pick your exact seat and book in under a minute.</p>
              <button onClick={goSearch} className="btn-p" style={{padding:"14px 40px",borderRadius:12,fontSize:15,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.1em",color:"#1a1410",border:"none",cursor:"pointer",background:"linear-gradient(135deg,#c9a84c,#f0d080,#c9a84c)",backgroundSize:"200% 200%",animation:"gradShift 3s ease infinite",boxShadow:"0 8px 28px rgba(201,168,76,0.36)"}}>Book a Bus 🚌</button>
            </Reveal>
          </div>
        </section>

        <hr className="gold-hr"/>

        {/* ── WHATSAPP ── */}
        <section style={{padding:"110px 5%",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:"50%",right:"-5%",width:430,height:430,borderRadius:"50%",background:"radial-gradient(circle,rgba(201,168,76,0.05),transparent 70%)",transform:"translateY(-50%)",pointerEvents:"none"}}/>
          <div className="wgrid" style={{position:"relative",zIndex:2,display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center"}}>
            <Reveal from="left">
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:"#c9a84c",letterSpacing:"0.25em",marginBottom:20}}>WHATSAPP NATIVE</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"clamp(24px,4.2vw,54px)",color:"#1a1410",lineHeight:1.0,marginBottom:8}}>Your entire trip.</h2>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:400,fontStyle:"italic",fontSize:"clamp(24px,4.2vw,54px)",lineHeight:1.0,marginBottom:28,background:"linear-gradient(135deg,#c9a84c,#f0d080,#8B6914)",WebkitBackgroundClip:"text",backgroundClip:"text",WebkitTextFillColor:"transparent"}}>One chat thread.</h2>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15.5,color:"#7a6d62",lineHeight:1.8,marginBottom:36}}>Search flights and buses, pick your seat, confirm — all inside WhatsApp. No app download required.</p>
              <div style={{marginBottom:36,padding:"14px 20px",borderRadius:13,background:"rgba(201,168,76,0.06)",border:"1px solid rgba(201,168,76,0.2)",display:"inline-block"}}>
                <span style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:"#6b5d4e"}}>📱 +1-415-523-8886 · join code: <strong style={{color:"#1a1410"}}>join meal-biggest</strong></span>
              </div>
              <div>
                <button onClick={goSearch} className="btn-p" style={{padding:"14px 36px",borderRadius:12,fontSize:15,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.1em",color:"#1a1410",border:"none",cursor:"pointer",background:"linear-gradient(135deg,#c9a84c,#f0d080,#c9a84c)",backgroundSize:"200% 200%",animation:"gradShift 3s ease infinite",boxShadow:"0 8px 28px rgba(201,168,76,0.36)"}}>Book Now ✈</button>
              </div>
            </Reveal>
            <Reveal from="right" delay={160}>
              <TiltCard style={{maxWidth:296,margin:"0 auto",cursor:"default"}}>
                <div style={{borderRadius:26,overflow:"hidden",boxShadow:"0 32px 80px rgba(0,0,0,0.12)"}}>
                  <div style={{background:"#075E54",padding:"14px 18px",display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,0.14)",display:"flex",alignItems:"center",justifyContent:"center"}}><AlvrynIcon size={26}/></div>
                    <div>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,color:"#fff",fontSize:15,letterSpacing:"0.08em"}}>Alvryn</div>
                      <div style={{fontSize:11,color:"rgba(255,255,255,0.6)"}}>● online</div>
                    </div>
                  </div>
                  <div style={{background:"#ECE5DD",padding:"14px 12px",display:"flex",flexDirection:"column",gap:9}}>
                    {[
                      {me:false,msg:"Flight BLR to DEL kal under 5000"},
                      {me:true,msg:"Found 3 flights! ✈️\nSkyWings · ₹3,840 · 6:10AM\nBluJet · ₹4,120 · 9:30AM\nReply 1 or 2 to book"},
                      {me:false,msg:"1"},
                      {me:true,msg:"✅ Booked!\nTicket sent to your email 📧\nBooking ID: ALV-4829X"},
                    ].map((m,i)=>(
                      <div key={i} style={{display:"flex",justifyContent:m.me?"flex-end":"flex-start"}}>
                        <div style={{maxWidth:"88%",padding:"9px 13px",borderRadius:m.me?"18px 18px 4px 18px":"18px 18px 18px 4px",background:m.me?"#DCF8C6":"#fff",fontSize:12,lineHeight:1.55,whiteSpace:"pre-line",fontFamily:"'DM Sans',sans-serif",color:"#1a1a1a",boxShadow:"0 1px 3px rgba(0,0,0,0.07)"}}>{m.msg}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </section>

        <hr className="gold-hr"/>

        {/* ── PLATFORM ROADMAP ── */}
        <section style={{padding:"80px 5%",background:"rgba(201,168,76,0.025)"}}>
          <div style={{maxWidth:760,margin:"0 auto",textAlign:"center"}}>
            <Reveal>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:"#c9a84c",letterSpacing:"0.25em",marginBottom:14}}>PLATFORM</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"clamp(20px,3.5vw,44px)",color:"#1a1410",marginBottom:10}}>Powered by real airline &amp; bus APIs.</h2>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#7a6d62",lineHeight:1.8,marginBottom:36}}>
                Alvryn currently connects you to the best deals through trusted affiliate partners — Travelpayouts for flights and RedBus for buses.
                As we grow, direct booking integrations will roll out progressively, giving you even better prices without ever leaving Alvryn.
              </p>
              <div className="pgrid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
                {[
                  {label:"Phase 1 — Now",desc:"100% affiliate · Best deals via partners",active:true},
                  {label:"Phase 2",desc:"70% affiliate · 30% direct API",active:false},
                  {label:"Phase 3",desc:"80% direct · 20% affiliate",active:false},
                ].map((p,i)=>(
                  <div key={i} style={{padding:"16px 22px",borderRadius:14,background:p.active?"rgba(201,168,76,0.1)":"rgba(255,255,255,0.5)",border:`1px solid ${p.active?"rgba(201,168,76,0.35)":"rgba(201,168,76,0.1)"}`,boxShadow:p.active?"0 4px 20px rgba(201,168,76,0.14)":"none"}}>
                    <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:p.active?"#8B6914":"#ccc",letterSpacing:"0.1em",marginBottom:7}}>{p.label}</div>
                    <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12.5,color:p.active?"#1a1410":"#bbb"}}>{p.desc}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <hr className="gold-hr"/>

        {/* ── FINAL CTA ── */}
        <section style={{minHeight:"65vh",position:"relative",overflow:"hidden",padding:"110px 5%",display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center"}}>
          <div style={{position:"absolute",inset:0,pointerEvents:"none",background:"radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 60%)"}}/>
          {[200,340,490].map((r,i)=>(
            <div key={i} style={{position:"absolute",width:r,height:r,borderRadius:"50%",border:`1px solid rgba(201,168,76,${0.11-i*0.03})`,top:"50%",left:"50%",animation:`spinSlow ${42+i*16}s linear infinite`,pointerEvents:"none"}}/>
          ))}
          <div style={{position:"relative",zIndex:2,maxWidth:580}}>
            <Reveal>
              <div style={{animation:"floatUD 5s ease-in-out infinite",marginBottom:32}}><AlvrynIcon size={68}/></div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"clamp(34px,6vw,78px)",color:"#1a1410",lineHeight:1.0,marginBottom:8}}>Ready to fly</h2>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:400,fontStyle:"italic",fontSize:"clamp(34px,6vw,78px)",lineHeight:1.0,marginBottom:22,background:"linear-gradient(135deg,#c9a84c,#f0d080,#8B6914)",WebkitBackgroundClip:"text",backgroundClip:"text",WebkitTextFillColor:"transparent"}}>smarter?</h2>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:16,color:"#7a6d62",lineHeight:1.8,marginBottom:48}}>India's most intelligent travel booking platform. The best fares on flights and buses, instantly.</p>
              <div className="crow" style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
                <button onClick={()=>navigate("/register")} className="btn-p" style={{padding:"16px 48px",borderRadius:13,fontSize:16,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.1em",color:"#1a1410",border:"none",cursor:"pointer",background:"linear-gradient(135deg,#c9a84c,#f0d080,#c9a84c)",backgroundSize:"200% 200%",animation:"gradShift 3s ease infinite",boxShadow:"0 14px 50px rgba(201,168,76,0.4)"}}>Create Free Account ✈</button>
                <button onClick={()=>navigate("/login")} style={{padding:"16px 36px",borderRadius:13,fontSize:15,fontWeight:500,fontFamily:"'DM Sans',sans-serif",color:"#1a1410",background:"rgba(255,255,255,0.7)",border:"1px solid rgba(201,168,76,0.2)",boxShadow:"0 4px 16px rgba(0,0,0,0.04)",cursor:"pointer"}}>Sign In →</button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{background:"#ede9e0",borderTop:"1px solid rgba(201,168,76,0.14)",padding:"44px 5%"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:24,marginBottom:24}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <AlvrynIcon size={36}/>
              <div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:16,color:"#1a1410",letterSpacing:"0.13em"}}>ALVRYN</div>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:7,color:"#c9a84c",letterSpacing:"0.22em"}}>TRAVEL BEYOND BOUNDARIES</div>
              </div>
            </div>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12.5,color:"#bbb"}}>© 2026 Alvryn · Built with ☕ in Bangalore</div>
            <div style={{display:"flex",gap:26,flexWrap:"wrap"}}>
              {Object.keys(FOOTER_CONTENT).map(l=>(
                <span key={l} onClick={()=>setActiveModal(l)} style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#8B6914",cursor:"pointer",textDecoration:"underline",textUnderlineOffset:3,textDecorationColor:"rgba(139,105,20,0.28)",transition:"opacity 0.2s"}}
                  onMouseEnter={e=>e.target.style.opacity=0.6}
                  onMouseLeave={e=>e.target.style.opacity=1}>{l}</span>
              ))}
            </div>
          </div>
          <hr className="gold-hr" style={{opacity:0.4}}/>
          <div style={{marginTop:18,textAlign:"center",fontFamily:"'Space Mono',monospace",fontSize:8,color:"#ccc",letterSpacing:"0.15em"}}>
            ALVRYN · PHASE 1 · AFFILIATE POWERED · BUILDING TOWARDS DIRECT BOOKING
          </div>
        </footer>
      </div>

      {activeModal && <Modal title={activeModal} onClose={()=>setActiveModal(null)}>{FOOTER_CONTENT[activeModal]}</Modal>}
    </>
  );
}

// ── SEARCH MOCK CARD ──────────────────────────────────────────────────────────
function SearchMockCard() {
  const queries=["Flights BLR → GOA Friday under ₹3500","Bus Hyderabad to Chennai 6 AM","Cheapest flight Delhi next week","BLR to MUM kal subah ka flight"];
  const[qi,setQi]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setQi(q=>(q+1)%queries.length),3400);return()=>clearInterval(t);},[queries.length]);
  const results=[{name:"SkyWings",code:"SW-204",time:"06:10→08:55",price:"₹3,240",tag:"BEST VALUE"},{name:"BluJet",code:"BJ-501",time:"09:30→12:15",price:"₹3,840",tag:""},{name:"AirFlow",code:"AF-173",time:"14:20→17:05",price:"₹4,100",tag:""}];
  return(
    <div style={{width:"min(440px,90vw)",background:"rgba(255,255,255,0.88)",borderRadius:24,backdropFilter:"blur(20px)",boxShadow:"0 36px 90px rgba(0,0,0,0.1),0 0 0 1px rgba(201,168,76,0.14)",overflow:"hidden"}}>
      <div style={{background:"#f0ede6",padding:"12px 16px",display:"flex",alignItems:"center",gap:7,borderBottom:"1px solid rgba(201,168,76,0.1)"}}>
        {["#FF5F57","#FFBD2E","#28CA41"].map(c=><div key={c} style={{width:11,height:11,borderRadius:"50%",background:c}}/>)}
        <div style={{flex:1,background:"#fff",borderRadius:7,padding:"5px 12px",marginLeft:8,fontSize:11,color:"#ccc",fontFamily:"'DM Sans',sans-serif"}}>alvryn.in/search</div>
      </div>
      <div style={{padding:"18px 18px 10px"}}>
        <div style={{background:"#f8f6f0",borderRadius:12,padding:"12px 15px",display:"flex",alignItems:"center",gap:10,border:"1.5px solid rgba(201,168,76,0.28)"}}>
          <span style={{fontSize:14}}>🔍</span>
          <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:12.5,color:"#7a6d62",flex:1}}>{queries[qi]}<span style={{animation:"blink 0.9s step-end infinite",color:"#c9a84c"}}>|</span></span>
        </div>
      </div>
      <div style={{padding:"8px 18px 18px",display:"flex",flexDirection:"column",gap:8}}>
        {results.map((f,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",borderRadius:12,background:i===0?"rgba(201,168,76,0.1)":"#fafaf8",border:`1px solid ${i===0?"rgba(201,168,76,0.3)":"rgba(0,0,0,0.04)"}`}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:32,height:32,borderRadius:9,background:"rgba(201,168,76,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>✈️</div>
              <div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:13,color:"#1a1410"}}>{f.name} <span style={{fontWeight:400,color:"#ccc",fontSize:10,fontFamily:"'Space Mono',monospace"}}>{f.code}</span></div>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#bbb"}}>{f.time}</div>
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:15,color:i===0?"#8B6914":"#1a1410"}}>{f.price}</div>
              {f.tag&&<div style={{fontFamily:"'Space Mono',monospace",fontSize:7,background:"linear-gradient(135deg,#c9a84c,#f0d080)",color:"#1a1410",padding:"2px 6px",borderRadius:4,marginTop:2}}>{f.tag}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}