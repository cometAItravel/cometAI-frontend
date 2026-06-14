/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const G = "#c9a84c";
const GD = "#8B6914";
const GL = "#f0d080";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@200;300;400;600;700&family=DM+Sans:wght@200;300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{overflow-x:hidden;}
::-webkit-scrollbar{width:2px;}
::-webkit-scrollbar-thumb{background:#c9a84c;border-radius:1px;}

@keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
@keyframes floatY{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
@keyframes pulse{0%,100%{opacity:0.4;transform:scale(1);}50%{opacity:1;transform:scale(1.1);}}
@keyframes goldShimmer{0%{background-position:200% center;}100%{background-position:-200% center;}}
@keyframes thunder{0%{opacity:0;}8%{opacity:0.92;}22%{opacity:0.35;}40%{opacity:0.78;}58%{opacity:0.12;}100%{opacity:0;}}
@keyframes cloudDrift1{0%{transform:translateX(0);}100%{transform:translateX(-220px);}}
@keyframes cloudDrift2{0%{transform:translateX(0);}100%{transform:translateX(200px);}}
@keyframes cloudDrift3{0%{transform:translateX(0);}100%{transform:translateX(-120px);}}
@keyframes horizonPulse{0%,100%{opacity:1;}50%{opacity:0.65;}}
@keyframes fadeUp{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}
@keyframes routeDraw{from{stroke-dashoffset:500;}to{stroke-dashoffset:0;}}

.g-text{
  background:linear-gradient(135deg,#8B6914,#c9a84c,#f0d080,#c9a84c);
  background-size:300% auto;
  -webkit-background-clip:text;background-clip:text;
  -webkit-text-fill-color:transparent;
  animation:goldShimmer 5s linear infinite;
}
.btn-gold{
  display:inline-flex;align-items:center;gap:10px;
  padding:16px 40px;border-radius:100px;
  background:linear-gradient(135deg,#8B6914,#c9a84c,#f0d080);
  color:#030303;font-family:'DM Sans',sans-serif;
  font-size:15px;font-weight:700;border:none;cursor:pointer;
  transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);
}
.btn-gold:hover{transform:translateY(-3px) scale(1.03);box-shadow:0 20px 50px rgba(201,168,76,0.45);}
.btn-ghost{
  display:inline-flex;align-items:center;gap:10px;
  padding:15px 36px;border-radius:100px;
  background:rgba(255,255,255,0.04);
  color:rgba(255,255,255,0.7);font-family:'DM Sans',sans-serif;
  font-size:15px;font-weight:400;
  border:1px solid rgba(255,255,255,0.12);cursor:pointer;
  backdrop-filter:blur(12px);transition:all 0.3s ease;
}
.btn-ghost:hover{background:rgba(255,255,255,0.1);color:#fff;transform:translateY(-2px);}
.glass{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);backdrop-filter:blur(24px);border-radius:20px;}
.card-lift{transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);}
.card-lift:hover{transform:translateY(-8px);border-color:rgba(201,168,76,0.3)!important;}
@media(max-width:768px){
  .hide-m{display:none!important;}
  .grid-2{grid-template-columns:1fr!important;}
  .grid-3{grid-template-columns:1fr!important;}
}
`;

/* ─── ALVRYN MARK — The Meridian ─────────────────────────────────────────── */
function AlvrynMark({ size=44, phase=3, glow=false }) {
  const s = size;
  const half = s * 0.5;
  const apex = { x: half, y: s * 0.1 };
  const meetL = { x: half - s * 0.24, y: s * 0.58 };
  const meetR = { x: half + s * 0.24, y: s * 0.58 };
  const horzL = { x: half - s * 0.46, y: s * 0.58 };
  const horzR = { x: half + s * 0.46, y: s * 0.58 };
  const id = "mg" + size;
  return (
    <svg width={s} height={s} viewBox={"0 0 " + s + " " + s} fill="none"
      style={{ filter: glow ? "drop-shadow(0 0 " + (s*0.14) + "px rgba(201,168,76,0.7))" : "none", flexShrink:0 }}>
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={GD}/>
          <stop offset="50%" stopColor={G}/>
          <stop offset="100%" stopColor={GL}/>
        </linearGradient>
      </defs>
      <circle cx={half} cy={half} r={s*0.46} stroke={"url(#"+id+")"} strokeWidth={s*0.01} fill="none"
        opacity={phase>=3?0.2:0} style={{transition:"opacity 0.5s ease"}}/>
      <g style={{transform:phase>=1?"translateY(0)":"translateY("+(s*-0.35)+"px)",opacity:phase>=1?1:0,
        transition:"transform 0.9s cubic-bezier(0.22,1,0.36,1),opacity 0.4s ease"}}>
        <line x1={apex.x} y1={apex.y} x2={meetL.x} y2={meetL.y}
          stroke={"url(#"+id+")"} strokeWidth={s*0.055} strokeLinecap="round"/>
      </g>
      <g style={{transform:phase>=1?"translateY(0)":"translateY("+(s*-0.35)+"px)",opacity:phase>=1?1:0,
        transition:"transform 0.9s 0.08s cubic-bezier(0.22,1,0.36,1),opacity 0.4s 0.08s ease"}}>
        <line x1={apex.x} y1={apex.y} x2={meetR.x} y2={meetR.y}
          stroke={"url(#"+id+")"} strokeWidth={s*0.055} strokeLinecap="round"/>
      </g>
      <g style={{transformOrigin:half+"px "+s*0.58+"px",transform:phase>=2?"scaleX(1)":"scaleX(0)",
        opacity:phase>=2?1:0,transition:"transform 0.7s 0.28s cubic-bezier(0.22,1,0.36,1),opacity 0.4s 0.28s ease"}}>
        <line x1={horzL.x} y1={horzL.y} x2={horzR.x} y2={horzR.y}
          stroke={"url(#"+id+")"} strokeWidth={s*0.025} strokeLinecap="round"/>
      </g>
      <circle cx={apex.x} cy={apex.y} r={s*0.05} fill={"url(#"+id+")"}
        opacity={phase>=3?1:0} style={{transition:"opacity 0.4s 0.55s ease"}}/>
      {phase>=3 && <>
        <circle cx={meetL.x} cy={meetL.y} r={s*0.025} fill={G} opacity="0.55"/>
        <circle cx={meetR.x} cy={meetR.y} r={s*0.025} fill={G} opacity="0.55"/>
      </>}
    </svg>
  );
}

/* ─── PARTICLES ─────────────────────────────────────────────────────────────── */
function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if(!c) return;
    const ctx = c.getContext("2d");
    let W = c.width = window.innerWidth, H = c.height = window.innerHeight;
    const pts = Array.from({length:38}, () => ({
      x:Math.random()*W, y:Math.random()*H+H*0.2,
      vx:(Math.random()-0.5)*0.15, vy:-(0.12+Math.random()*0.3),
      r:Math.random()*1.2+0.3, a:Math.random()*0.18+0.04,
    }));
    const mouse = {x:-2000,y:-2000};
    const mfn = e => {mouse.x=e.clientX;mouse.y=e.clientY;};
    const rfn = () => {W=c.width=window.innerWidth;H=c.height=window.innerHeight;};
    window.addEventListener("mousemove",mfn,{passive:true});
    window.addEventListener("resize",rfn);
    let raf;
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      pts.forEach(p => {
        const dx=mouse.x-p.x,dy=mouse.y-p.y,d=Math.hypot(dx,dy);
        if(d<100){p.vx+=dx/d*0.01;p.vy+=dy/d*0.01;}
        p.vx*=0.99;p.vy*=0.99;p.x+=p.vx;p.y+=p.vy;
        if(p.y<-5){p.y=H+5;p.x=Math.random()*W;}
        if(p.x<0)p.x=W;if(p.x>W)p.x=0;
        ctx.save();ctx.globalAlpha=p.a;ctx.fillStyle=G;
        ctx.shadowBlur=3;ctx.shadowColor=G;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();ctx.restore();
      });
      raf=requestAnimationFrame(draw);
    };
    draw();
    return () => {cancelAnimationFrame(raf);window.removeEventListener("mousemove",mfn);window.removeEventListener("resize",rfn);};
  },[]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,zIndex:1,pointerEvents:"none"}}/>;
}

/* ─── SILHOUETTE ────────────────────────────────────────────────────────────── */
function Silhouette({ state=0 }) {
  const headR = state>=1 ? "rotate(16deg)" : "rotate(0deg)";
  const llTx = state>=2 ? "translateX(-5px) translateY(6px) rotate(-7deg)" : "none";
  const rlTx = state>=2 ? "translateX(4px) translateY(-4px) rotate(5deg)" : "none";
  const bodyL = state>=2 ? "rotate(-2deg)" : "rotate(0deg)";
  return (
    <svg viewBox="0 0 80 200" style={{width:"100%",height:"100%",overflow:"visible"}}>
      <g style={{transformOrigin:"40px 18px",transform:headR,transition:"transform 1.8s cubic-bezier(0.76,0,0.24,1)"}}>
        <ellipse cx="40" cy="18" rx="12" ry="13" fill="#040204"/>
      </g>
      <g style={{transformOrigin:"40px 100px",transform:bodyL,transition:"transform 1.2s cubic-bezier(0.34,1.56,0.64,1)"}}>
        <rect x="36" y="30" width="8" height="10" fill="#040204"/>
        <path d="M24,40 C21,44 19,70 19,100 L61,100 C61,70 59,44 56,40 C51,38 46,37 40,37 C34,37 29,38 24,40 Z" fill="#040204"/>
        <path d="M24,43 L13,85 L19,87 L28,47 Z" fill="#040204"/>
        <path d="M56,43 L67,85 L61,87 L52,47 Z" fill="#040204"/>
      </g>
      <g style={{transformOrigin:"30px 100px",transform:llTx,transition:"transform 1.2s 0.15s cubic-bezier(0.34,1.56,0.64,1)"}}>
        <path d="M22,100 L18,190 L34,190 L38,100 Z" fill="#040204"/>
      </g>
      <g style={{transformOrigin:"50px 100px",transform:rlTx,transition:"transform 1.2s cubic-bezier(0.34,1.56,0.64,1)"}}>
        <path d="M58,100 L62,190 L46,190 L42,100 Z" fill="#040204"/>
      </g>
      <ellipse cx="40" cy="192" rx="22" ry="3" fill="#040204" opacity="0.35"/>
    </svg>
  );
}

/* ─── EYE ───────────────────────────────────────────────────────────────────── */
function EyeSVG() {
  return (
    <svg viewBox="0 0 300 130" style={{width:"100%",height:"100%"}}>
      <defs>
        <radialGradient id="iris" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.95"/>
          <stop offset="25%" stopColor="#8B3A0F" stopOpacity="0.9"/>
          <stop offset="65%" stopColor="#1a0808" stopOpacity="1"/>
          <stop offset="100%" stopColor="#050205" stopOpacity="1"/>
        </radialGradient>
        <radialGradient id="ew" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#ede8e0" stopOpacity="0.95"/>
          <stop offset="100%" stopColor="#d0c8bc" stopOpacity="0.85"/>
        </radialGradient>
        <radialGradient id="eref" cx="32%" cy="32%" r="50%">
          <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.65"/>
          <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <path d="M5,65 C40,20 260,18 295,65 C260,112 40,110 5,65 Z" fill="url(#ew)"/>
      <circle cx="150" cy="65" r="36" fill="url(#iris)"/>
      <circle cx="150" cy="65" r="18" fill="#010101"/>
      <circle cx="138" cy="54" r="8" fill="url(#eref)"/>
      <circle cx="157" cy="70" r="2.5" fill="#c9a84c" opacity="0.5"/>
      <path d="M5,65 C40,20 260,18 295,65" fill="none" stroke="#0a0506" strokeWidth="3.5"/>
      <path d="M5,65 C40,110 260,112 295,65" fill="none" stroke="#0a0506" strokeWidth="2.5"/>
      {[18,36,55,75,95,115,135,155,175,195,215,235,255,275].map((x,i)=>(
        <line key={i} x1={x} y1={65-(i<4?28:i<10?32:26)} x2={x+(i<4?-2:i<10?0:2)} y2={65-(i<4?38:i<10?44:35)}
          stroke="#0a0506" strokeWidth="1.5" strokeLinecap="round" opacity="0.75"/>
      ))}
    </svg>
  );
}

/* ─── THUNDER FLASH ─────────────────────────────────────────────────────────── */
function ThunderFlash({ trigger }) {
  const [on, setOn] = useState(false);
  const prev = useRef(0);
  useEffect(() => {
    if(trigger === prev.current) return;
    prev.current = trigger;
    if(trigger === 0) return;
    setOn(true);
    const t = setTimeout(() => setOn(false), 720);
    return () => clearTimeout(t);
  },[trigger]);
  if(!on) return null;
  return (
    <div style={{position:"absolute",inset:0,zIndex:50,pointerEvents:"none",
      background:"rgba(255,248,240,0.88)",animation:"thunder 0.72s ease forwards"}}/>
  );
}

/* ─── DREAM LETTERS ─────────────────────────────────────────────────────────── */
function DreamLetters({ visible }) {
  return (
    <div style={{position:"absolute",bottom:"5%",left:"4%",right:"4%",display:"flex",
      justifyContent:"space-between",alignItems:"flex-end",zIndex:10,pointerEvents:"none"}}>
      {"DREAM".split("").map((l,i)=>(
        <span key={l} style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,
          fontSize:"clamp(44px,7vw,110px)",color:"rgba(255,255,255,0.07)",lineHeight:1,
          opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(50px)",
          transition:"opacity 0.9s "+(i*0.18)+"s ease,transform 1s "+(i*0.18)+"s cubic-bezier(0.22,1,0.36,1)"}}>
          {l}
        </span>
      ))}
    </div>
  );
}

/* ─── CHAPTER TEXT ───────────────────────────────────────────────────────────── */
const CHAPTER_DATA = {
  0: { lines:[], pos:{} },
  1: { lines:["Most people never go","beyond what they know."], pos:{left:"7%",top:"40%"} },
  2: { lines:["There is always someone","who goes first."], pos:{left:"7%",top:"38%"} },
  3: { lines:["The moment before","everything changes."], pos:{left:"7%",top:"35%"} },
  4: { lines:["The world is trying","to tell you something."], pos:{left:"7%",top:"38%"} },
  5: { lines:["As if it","senses something."], pos:{right:"7%",top:"35%",textAlign:"right"} },
  6: { lines:[], pos:{} },
  7: { lines:["The journey begins.","Yours is waiting."], pos:{left:"50%",bottom:"24%",transform:"translateX(-50%)",textAlign:"center"} },
};

function ChapterText({ ch, currentCh }) {
  const d = CHAPTER_DATA[ch]; if(!d||!d.lines.length) return null;
  const vis = currentCh===ch;
  return (
    <div style={{position:"absolute",...d.pos,zIndex:15,pointerEvents:"none",
      opacity:vis?1:0,transition:"opacity 0.7s ease"}}>
      {d.lines.map((line,i)=>(
        <div key={i} style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:300,
          fontSize:"clamp(16px,2.2vw,26px)",color:"rgba(255,255,255,0.58)",
          lineHeight:1.45,letterSpacing:"0.02em",
          opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(14px)",
          transition:"opacity 0.8s "+(i*0.28)+"s ease,transform 0.9s "+(i*0.28)+"s ease"}}>
          {line}
        </div>
      ))}
    </div>
  );
}

/* ─── SCROLL REVEAL ─────────────────────────────────────────────────────────── */
function Reveal({ children, delay=0, direction="up", style }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true);},{threshold:0.08});
    if(ref.current) obs.observe(ref.current);
    return ()=>obs.disconnect();
  },[]);
  const T={up:"translateY(50px)",left:"translateX(-60px)",right:"translateX(60px)"};
  return (
    <div ref={ref} style={{opacity:vis?1:0,transform:vis?"none":(T[direction]||"translateY(50px)"),
      transition:"opacity 0.9s "+delay+"ms cubic-bezier(0.22,1,0.36,1),transform 1s "+delay+"ms cubic-bezier(0.22,1,0.36,1)",...style}}>
      {children}
    </div>
  );
}

/* ─── COUNTER ────────────────────────────────────────────────────────────────── */
function Counter({ end, suffix="" }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting&&!done.current){
        done.current=true;
        const s=Date.now();
        const t=()=>{const p=Math.min((Date.now()-s)/2000,1);setN(Math.round((1-Math.pow(1-p,3))*end));if(p<1)requestAnimationFrame(t);};
        requestAnimationFrame(t);
      }
    },{threshold:0.4});
    if(ref.current)obs.observe(ref.current);
    return ()=>obs.disconnect();
  },[end]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

/* ─── TYPEWRITER ─────────────────────────────────────────────────────────────── */
function TypeWriter({ phrases }) {
  const [pi,setPi]=useState(0);const [txt,setTxt]=useState("");const [del,setDel]=useState(false);const [ci,setCi]=useState(0);
  useEffect(()=>{
    const w=phrases[pi%phrases.length];
    if(!del){if(ci<w.length){const t=setTimeout(()=>{setTxt(w.slice(0,ci+1));setCi(c=>c+1);},65);return()=>clearTimeout(t);}
    else{const t=setTimeout(()=>setDel(true),2400);return()=>clearTimeout(t);}}
    else{if(ci>0){const t=setTimeout(()=>{setTxt(w.slice(0,ci-1));setCi(c=>c-1);},35);return()=>clearTimeout(t);}
    else{setDel(false);setPi(p=>p+1);}}
  },[ci,del,pi,phrases]);
  return <span style={{color:G}}>{txt}<span style={{animation:"blink 0.9s step-end infinite",color:G}}>|</span></span>;
}

/* ─── ATMOSPHERE (shared between intro and scroll world) ─────────────────────── */
function Atmosphere({ groundOffset, glowIntensity, skyColor, fogOpacity }) {
  return (
    <>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,#050305 0%,#0d0608 38%,"+skyColor+" 68%,#2d1408 85%,#8B3A0F 100%)",transition:"background 1.5s ease"}}/>
      <div style={{position:"absolute",left:0,right:0,top:"54%",height:"46%",
        background:"radial-gradient(ellipse at 50% 0%,rgba(201,168,76,"+(glowIntensity*0.5)+"),rgba(139,58,15,"+(glowIntensity*0.28)+") 32%,transparent 68%)",
        animation:"horizonPulse 8s ease-in-out infinite"}}/>
      {[
        {w:620,h:200,top:"15%",left:"-8%",blur:55,op:0.055,a:"cloudDrift1",dur:"88s"},
        {w:420,h:155,top:"26%",left:"58%",blur:42,op:0.07,a:"cloudDrift2",dur:"72s"},
        {w:720,h:185,top:"34%",left:"8%",blur:58,op:0.045,a:"cloudDrift3",dur:"115s"},
        {w:310,h:105,top:"44%",left:"38%",blur:36,op:0.065,a:"cloudDrift2",dur:"62s"},
        {w:520,h:165,top:"48%",left:"-18%",blur:48,op:0.038,a:"cloudDrift1",dur:"98s"},
      ].map((cl,i)=>(
        <div key={i} style={{position:"absolute",top:cl.top,left:cl.left,width:cl.w,height:cl.h,
          borderRadius:"50%",background:"rgba(255,255,255,0.88)",filter:"blur("+cl.blur+"px)",
          opacity:cl.op,animation:cl.a+" "+cl.dur+" linear infinite",pointerEvents:"none"}}/>
      ))}
      <div style={{position:"absolute",left:"-20%",right:"-20%",bottom:0,height:"36%",
        backgroundImage:"repeating-linear-gradient(0deg,rgba(201,168,76,0.05) 0px,rgba(201,168,76,0.05) 1px,transparent 1px,transparent 42px),repeating-linear-gradient(90deg,rgba(201,168,76,0.02) 0px,rgba(201,168,76,0.02) 1px,transparent 1px,transparent 105px)",
        backgroundPositionY:groundOffset+"px",
        transform:"perspective(640px) rotateX(66deg)",transformOrigin:"50% 100%",pointerEvents:"none"}}/>
      <div style={{position:"absolute",inset:0,background:"rgba(8,5,6,"+fogOpacity+")",pointerEvents:"none"}}/>
      {[
        {l:"9%",h:"54%",w:"2px",op:0.11},
        {l:"83%",h:"60%",w:"3px",op:0.09},
        {l:"51%",h:"44%",w:"2px",op:0.08},
      ].map((s,i)=>(
        <div key={i} style={{position:"absolute",bottom:"34%",left:s.l,width:s.w,height:s.h,
          background:"linear-gradient(to top,rgba(201,168,76,"+s.op+"),transparent)",filter:"blur(0.5px)"}}/>
      ))}
    </>
  );
}

/* ─── PRODUCT CONTENT ────────────────────────────────────────────────────────── */
function ProductContent({ navigate }) {
  const goApp=()=>navigate(localStorage.getItem("token")?"/ai":"/register");
  const goSearch=()=>navigate(localStorage.getItem("token")?"/search":"/login");
  return (
    <div style={{background:"#030303",color:"#fff",position:"relative",zIndex:10}}>

      {/* ── THE MESSAGE ── */}
      <section style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#020202",padding:"80px 5%",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 50%,rgba(201,168,76,0.07) 0%,transparent 60%)"}}/>
        <div style={{position:"relative",zIndex:2,textAlign:"center",maxWidth:900}}>
          <Reveal>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(22px,4vw,60px)",color:"rgba(255,255,255,0.45)",letterSpacing:"-0.01em",lineHeight:1.25,marginBottom:48}}>
              YOU WERE NEVER MEANT<br/>TO EXPLORE JUST ONE PLACE.
            </div>
          </Reveal>
          <Reveal delay={300}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(22px,4vw,60px)",color:"rgba(255,255,255,0.7)",letterSpacing:"-0.01em",lineHeight:1.25,marginBottom:64}}>
              YOU DESERVE<br/>THE ENTIRE WORLD.
            </div>
          </Reveal>
          <Reveal delay={600}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14,marginBottom:40}}>
              <AlvrynMark size={56} phase={3} glow/>
              <div className="g-text" style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(28px,5vw,58px)",letterSpacing:"0.28em"}}>
                ALVRYN
              </div>
              <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:15,color:"rgba(255,255,255,0.3)",letterSpacing:"0.1em"}}>
                {"Let's begin."}
              </div>
            </div>
          </Reveal>
          <Reveal delay={900}>
            <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
              <button onClick={goApp} className="btn-gold" style={{fontSize:16,padding:"17px 48px"}}>Start Planning</button>
              <button onClick={goSearch} className="btn-ghost" style={{fontSize:16,padding:"16px 36px"}}>Explore Destinations</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── AI DEMO ── */}
      <section style={{minHeight:"100vh",padding:"120px 5%",background:"#04020a",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 30% 50%,rgba(139,58,15,0.08) 0%,transparent 60%)"}}/>
        <div style={{maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2}}>
          <Reveal style={{marginBottom:64}}>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:G,letterSpacing:"0.22em",marginBottom:16}}>THE INTELLIGENCE</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(32px,5vw,68px)",color:"#fff",lineHeight:1.1}}>
              One message.<br/><span style={{color:"#fb923c"}}>Everything planned.</span>
            </div>
          </Reveal>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"flex-start"}} className="grid-2">
            <Reveal direction="left">
              <div style={{borderRadius:24,overflow:"hidden",border:"1px solid rgba(255,255,255,0.05)",background:"rgba(0,0,0,0.45)",backdropFilter:"blur(20px)"}}>
                <div style={{background:"linear-gradient(135deg,rgba(139,105,20,0.22),rgba(201,168,76,0.08))",borderBottom:"1px solid rgba(255,255,255,0.04)",padding:"16px 20px",display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,"+GD+","+G+")",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <AlvrynMark size={22} phase={3}/>
                  </div>
                  <div>
                    <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:14,color:"#fff"}}>Alvryn AI</div>
                    <div style={{fontSize:11,color:"#22c55e",display:"flex",alignItems:"center",gap:4}}>
                      <span style={{width:5,height:5,borderRadius:"50%",background:"#22c55e",display:"inline-block"}}/>Online
                    </div>
                  </div>
                </div>
                <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:12}}>
                  {[
                    {role:"user",text:"6 friends Bangalore to Goa in August. Budget 15k per person. Two vegetarians. One arrives a day late. Prefer beaches."},
                    {role:"ai",text:"Got it! Planning this for all 6 of you now."},
                    {role:"ai",text:"Flights BLR to GOI: 3500-4500 per person return. For 6: 21000-27000 total. Book 4-6 weeks early."},
                    {role:"ai",text:"South Goa near Palolem and Agonda. 800-1800 per room per night. 2-3 rooms for 6 people.",card:true},
                  ].map((m,i)=>(
                    <Reveal key={i} delay={i*200}>
                      <div style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                        <div style={{maxWidth:"86%",padding:"11px 15px",
                          borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",
                          background:m.role==="user"?"linear-gradient(135deg,"+GD+","+G+")":"rgba(255,255,255,0.05)",
                          border:m.role==="ai"?"1px solid rgba(255,255,255,0.07)":"none",
                          fontFamily:"'DM Sans',sans-serif",fontSize:13,lineHeight:1.65,
                          color:m.role==="user"?"#030303":"rgba(255,255,255,0.8)",
                          fontWeight:m.role==="user"?600:400}}>
                          {m.text}
                          {m.card&&(
                            <div style={{marginTop:10,padding:"10px",background:"rgba(201,168,76,0.08)",borderRadius:8,border:"1px solid rgba(201,168,76,0.2)"}}>
                              <div style={{fontSize:12,color:G,fontWeight:700,marginBottom:6}}>Total: 11500-14500 per person. Within budget.</div>
                              <button onClick={goSearch} style={{background:G,color:"#030303",border:"none",borderRadius:7,padding:"7px 14px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Book Now</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
                <div style={{padding:"12px 16px",borderTop:"1px solid rgba(255,255,255,0.04)",display:"flex",gap:8}}>
                  <div style={{flex:1,background:"rgba(255,255,255,0.04)",borderRadius:100,padding:"10px 16px",fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"rgba(255,255,255,0.2)"}}>Ask me anything...</div>
                  <button onClick={goApp} style={{width:40,height:40,borderRadius:"50%",background:"linear-gradient(135deg,"+GD+","+G+")",border:"none",cursor:"pointer",fontSize:16,color:"#030303"}}>&#x2191;</button>
                </div>
              </div>
            </Reveal>
            <Reveal direction="right" delay={100}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(22px,3vw,38px)",color:"#fff",lineHeight:1.2,marginBottom:28}}>
                Every detail.<br/><span style={{color:"#fb923c"}}>Addressed.</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {[
                  {icon:"👥",t:"Group of 6",d:"Per person and total budget breakdown"},
                  {icon:"🥗",t:"2 Vegetarians",d:"Specific veg restaurant picks"},
                  {icon:"🕐",t:"Late arrival",d:"Separate plan created automatically"},
                  {icon:"🏖️",t:"Beaches only",d:"South Goa recommended specifically"},
                  {icon:"💰",t:"15k budget",d:"Confirmed: fits at 11500-14500"},
                  {icon:"🛡️",t:"Safety insights",d:"Goa tips auto-included"},
                ].map((f,i)=>(
                  <div key={i} className="card-lift" style={{display:"flex",gap:12,padding:"13px 15px",borderRadius:13,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)"}}>
                    <span style={{fontSize:18}}>{f.icon}</span>
                    <div>
                      <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13,color:"#fff"}}>{f.t}</div>
                      <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"rgba(255,255,255,0.3)",marginTop:2}}>{f.d}</div>
                    </div>
                    <div style={{marginLeft:"auto",display:"flex",alignItems:"center"}}><div style={{width:5,height:5,borderRadius:"50%",background:"#fb923c"}}/></div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── DESTINATIONS ── */}
      <section style={{padding:"120px 5%",background:"#f7f7f5",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"clamp(70px,15vw,240px)",color:"rgba(0,0,0,0.03)",letterSpacing:"-0.04em",whiteSpace:"nowrap",pointerEvents:"none"}}>WORLD</div>
        <div style={{maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2}}>
          <Reveal style={{textAlign:"center",marginBottom:60}}>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:GD,letterSpacing:"0.22em",marginBottom:16}}>WHERE TO?</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(32px,5vw,64px)",color:"#0a0a0a",lineHeight:1.1}}>
              Every dream.<br/><span className="g-text">Every destination.</span>
            </div>
          </Reveal>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:14}}>
            {[
              {name:"Goa",tag:"Beaches",budget:"5k-15k",img:"photo-1512343879784-a960bf40e7f2"},
              {name:"Dubai",tag:"Global",budget:"35k-70k",img:"photo-1512453979798-5ea266f8880c"},
              {name:"Manali",tag:"Hills",budget:"8k-18k",img:"photo-1626621341517-bbf3d9990a23"},
              {name:"Singapore",tag:"City",budget:"40k-80k",img:"photo-1525625293386-3f8f99389edd"},
              {name:"Bali",tag:"Tropical",budget:"25k-55k",img:"photo-1537996194471-e657df975ab4"},
              {name:"Switzerland",tag:"Alps",budget:"80k-1.5L",img:"photo-1530122037265-a5f1f91d3b99"},
              {name:"Maldives",tag:"Luxury",budget:"40k-1L",img:"photo-1514282401047-d79a71a590e8"},
              {name:"Japan",tag:"Culture",budget:"60k-1.2L",img:"photo-1528360983277-13d401cdc186"},
              {name:"Kerala",tag:"Nature",budget:"10k-25k",img:"photo-1602216056096-3b40cc0c9944"},
              {name:"Ladakh",tag:"Adventure",budget:"18k-35k",img:"photo-1592555187028-51a64e5bba29"},
              {name:"Paris",tag:"Romance",budget:"80k-1.5L",img:"photo-1502602898657-3e91760cbb34"},
              {name:"Bangkok",tag:"Culture",budget:"20k-45k",img:"photo-1563492065599-3520f775eeed"},
            ].map((d,i)=>(
              <Reveal key={d.name} delay={i*38}>
                <div onClick={()=>navigate(localStorage.getItem("token")?"/ai?dest="+d.name:"/register")}
                  style={{borderRadius:18,overflow:"hidden",cursor:"pointer",position:"relative",aspectRatio:"2/3",transition:"transform 0.4s cubic-bezier(0.34,1.56,0.64,1)"}}
                  onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.06) translateY(-8px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="scale(1) translateY(0)";}}>
                  <img src={"https://images.unsplash.com/"+d.img+"?auto=format&fit=crop&w=400&h=600&q=70"} alt={d.name} loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} onError={e=>e.target.style.display="none"}/>
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.85) 0%,transparent 50%)"}}/>
                  <div style={{position:"absolute",top:10,right:10,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(6px)",borderRadius:100,padding:"3px 10px",fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#fff"}}>{d.tag}</div>
                  <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"14px"}}>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:20,color:"#fff"}}>{d.name}</div>
                    <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:G,marginTop:3}}>{d.budget}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal style={{textAlign:"center",marginTop:44}}>
            <button onClick={goApp} style={{display:"inline-flex",alignItems:"center",gap:10,padding:"14px 32px",borderRadius:100,background:"transparent",border:"1px solid rgba(0,0,0,0.15)",fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#333",cursor:"pointer",transition:"all 0.3s ease"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(0,0,0,0.05)";}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>Plan any destination with AI</button>
          </Reveal>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{padding:"120px 5%",background:"#04020a",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",bottom:"-4%",left:"50%",transform:"translateX(-50%)",fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"clamp(70px,14vw,210px)",color:"rgba(255,255,255,0.02)",letterSpacing:"-0.04em",whiteSpace:"nowrap",pointerEvents:"none"}}>INTELLIGENT</div>
        <div style={{maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2}}>
          <Reveal style={{textAlign:"center",marginBottom:80}}>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:G,letterSpacing:"0.22em",marginBottom:16}}>CAPABILITIES</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(32px,5vw,64px)",color:"#fff",lineHeight:1.1}}>
              Everything you need.<br/><span className="g-text">Nothing you do not.</span>
            </div>
          </Reveal>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}} className="grid-3">
            {[
              {icon:"🧠",t:"AI Trip Planner",d:"Complete plans. Any language. Every constraint addressed.",a:G},
              {icon:"✈️",t:"Flights Worldwide",d:"60+ destinations. Best fares via Aviasales.",a:"#38bdf8"},
              {icon:"🚌",t:"Buses Across India",d:"300+ routes. AC Sleeper via RedBus.",a:"#4ade80"},
              {icon:"🏨",t:"Hotels Worldwide",d:"Budget to luxury via Booking.com.",a:"#fb923c"},
              {icon:"🛡️",t:"Safety Insights",d:"Auto-appended safety info for every destination.",a:"#a78bfa"},
              {icon:"📱",t:"WhatsApp AI",d:"Full trip planning inside WhatsApp.",a:"#22c55e"},
            ].map((f,i)=>(
              <Reveal key={i} delay={i*80}>
                <div className="glass card-lift" style={{padding:"32px 28px",border:"1px solid rgba(255,255,255,0.06)"}}>
                  <div style={{fontSize:30,marginBottom:16}}>{f.icon}</div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:17,color:"#fff",marginBottom:10}}>{f.t}</div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"rgba(255,255,255,0.35)",lineHeight:1.7}}>{f.d}</div>
                  <div style={{marginTop:18,height:2,borderRadius:1,width:"40%",background:"linear-gradient(90deg,"+f.a+",transparent)"}}/>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANS ── */}
      <section style={{padding:"120px 5%",background:"#030305",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 50%,rgba(201,168,76,0.06) 0%,transparent 60%)"}}/>
        <div style={{maxWidth:1000,margin:"0 auto",position:"relative",zIndex:2}}>
          <Reveal style={{textAlign:"center",marginBottom:64}}>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:G,letterSpacing:"0.22em",marginBottom:16}}>PLANS</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(32px,5vw,64px)",color:"#fff",lineHeight:1.1}}>
              Start free.<br/><span className="g-text">Upgrade when ready.</span>
            </div>
          </Reveal>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}} className="grid-3">
            {[
              {name:"Explorer",badge:"FREE",active:true,desc:"Everything to start",features:["20 AI responses per day","2 trip plans per month","Flights buses and hotels","Safety insights","WhatsApp AI"],cta:"Start Free"},
              {name:"Navigator",badge:"PRO",active:false,desc:"For serious travellers",features:["Unlimited trip plans","Advanced AI planning","Budget optimizer","Multi-city planning","Priority processing","Save plans"],cta:"Coming Soon"},
              {name:"Voyager",badge:"PREMIUM",active:false,desc:"The ultimate companion",features:["Everything in Navigator","Group travel planner","Scam awareness","Women traveller mode","Emergency companion","Weather planning"],cta:"Coming Soon"},
            ].map((p,i)=>(
              <Reveal key={p.name} delay={i*120}>
                <div style={{padding:"36px 28px",borderRadius:24,height:"100%",position:"relative",background:p.active?"linear-gradient(135deg,rgba(139,105,20,0.15),rgba(201,168,76,0.08))":"rgba(255,255,255,0.02)",border:p.active?"1px solid rgba(201,168,76,0.44)":"1px solid rgba(255,255,255,0.06)",boxShadow:p.active?"0 0 80px rgba(201,168,76,0.12)":"none"}}>
                  {p.active&&<div style={{position:"absolute",top:-1,left:"50%",transform:"translateX(-50%)",background:G,color:"#030303",padding:"4px 18px",borderRadius:"0 0 14px 14px",fontFamily:"'Space Mono',monospace",fontSize:9,fontWeight:700,letterSpacing:"0.08em",whiteSpace:"nowrap"}}>LIVE NOW</div>}
                  <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:p.active?G:"rgba(255,255,255,0.25)",letterSpacing:"0.2em",marginBottom:8}}>{p.badge}</div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:26,color:"#fff",marginBottom:6}}>Alvryn {p.name}</div>
                  <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"rgba(255,255,255,0.3)",marginBottom:24}}>{p.desc}</p>
                  <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:28}}>
                    {p.features.map(f=>(
                      <div key={f} style={{display:"flex",gap:10,alignItems:"center"}}>
                        <div style={{width:4,height:4,borderRadius:"50%",background:p.active?G:"rgba(255,255,255,0.2)",flexShrink:0}}/>
                        <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:p.active?"rgba(255,255,255,0.7)":"rgba(255,255,255,0.25)"}}>{f}</span>
                      </div>
                    ))}
                  </div>
                  {p.active?(
                    <button onClick={goApp} className="btn-gold" style={{width:"100%",justifyContent:"center"}}>{p.cta}</button>
                  ):(
                    <div style={{padding:"11px",borderRadius:11,border:"1px solid rgba(201,168,76,0.15)",background:"rgba(201,168,76,0.04)",textAlign:"center"}}>
                      <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"rgba(201,168,76,0.5)",letterSpacing:"0.1em"}}>Crafted with precision</div>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{minHeight:"80vh",background:"#020202",display:"flex",alignItems:"center",justifyContent:"center",padding:"120px 5%",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 50%,rgba(201,168,76,0.07) 0%,transparent 65%)"}}/>
        <div style={{position:"relative",zIndex:2,textAlign:"center",maxWidth:720}}>
          <Reveal>
            <div style={{animation:"floatY 5s ease-in-out infinite",marginBottom:28,display:"inline-block"}}><AlvrynMark size={56} phase={3} glow/></div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(40px,8vw,96px)",color:"#fff",lineHeight:0.95,letterSpacing:"-0.02em",marginBottom:24}}>
              Start your<br/><span className="g-text">journey.</span>
            </div>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:17,color:"rgba(255,255,255,0.3)",lineHeight:1.7,maxWidth:440,margin:"0 auto 44px"}}>
              {"India's most intelligent travel companion. Free forever."}
            </p>
            <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
              <button onClick={goApp} className="btn-gold" style={{fontSize:16,padding:"18px 50px"}}>Try Alvryn AI Free</button>
              <button onClick={goSearch} className="btn-ghost" style={{fontSize:16,padding:"17px 38px"}}>Search Travel</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{background:"#010101",borderTop:"1px solid rgba(255,255,255,0.03)",padding:"44px 5%"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:20}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <AlvrynMark size={26} phase={3}/>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:300,fontSize:14,color:"rgba(255,255,255,0.35)",letterSpacing:"0.18em"}}>ALVRYN</div>
          </div>
          <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"rgba(255,255,255,0.15)"}}>2026 Alvryn. Built in Bangalore. Travel Beyond Boundaries.</div>
          <div style={{display:"flex",gap:20}}>
            {["About","Privacy","Terms","Contact"].map(l=>(
              <span key={l} style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"rgba(255,255,255,0.2)",cursor:"pointer",transition:"color 0.2s"}} onMouseEnter={e=>e.target.style.color="rgba(255,255,255,0.6)"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.2)"}>{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── MAIN EXPORT ────────────────────────────────────────────────────────────── */
export default function LandingPage2() {
  const navigate = useNavigate();

  // ── Intro state ──
  const [markPhase, setMarkPhase] = useState(0);
  const [wordmarkVis, setWordmarkVis] = useState(false);
  const [ascending, setAscending] = useState(false);
  const [worldVis, setWorldVis] = useState(false);
  const [dreamVis, setDreamVis] = useState(false);
  const [beliefVis, setBeliefVis] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [navVis, setNavVis] = useState(false);

  // ── Scroll state ──
  const [scrollY, setScrollY] = useState(0);
  const [chapter, setChapter] = useState(0);
  const [chapterProgress, setChapterProgress] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);
  const [thunderTrigger, setThunderTrigger] = useState(0);
  const thunderFiredRef = useRef(false);

  const CH = typeof window !== "undefined" ? window.innerHeight : 700;
  const TOTAL_CHS = 8;

  // Derived scroll visuals
  const scrollProg = Math.min(scrollY / (CH * TOTAL_CHS), 1);
  const figureScale = 0.055 + Math.pow(Math.min(scrollProg * 1.18, 1), 0.5) * 2.85;
  const figureRise = scrollProg * 38;
  const groundOffset = scrollY * 0.6;
  const fogOpacity = Math.max(0, 0.72 - scrollProg * 0.88);
  const SKY_COLS = ["#080506","#0d0608","#10060c","#080c12","#030308","#060408","#020306","#010204"];
  const skyColor = SKY_COLS[Math.min(chapter, SKY_COLS.length - 1)];
  const GLOW_VALS = [0.3, 0.42, 0.55, 0.65, 1.15, 0.72, 0.48, 0.88];
  const glowIntensity = GLOW_VALS[Math.min(chapter, GLOW_VALS.length - 1)];
  const silState = chapter <= 4 ? 0 : chapter === 5 ? 1 : 2;
  const silOpacity = chapter >= 2 ? 1 : chapter === 1 ? Math.min(chapterProgress * 2.8, 1) : 0;
  const eyeVis = chapter === 6;
  const eyeOp = chapter === 6 ? Math.min(chapterProgress * 3.5, 1) * Math.max(1 - (chapterProgress - 0.65) * 2.5, 0) : 0;

  // ── INTRO SEQUENCE ──
  useEffect(() => {
    const timers = [];
    const T = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); };
    T(() => setMarkPhase(1), 1100);
    T(() => setMarkPhase(2), 1900);
    T(() => setMarkPhase(3), 2500);
    T(() => setWordmarkVis(true), 3000);
    T(() => { setAscending(true); setNavVis(true); }, 4600);
    T(() => setWorldVis(true), 5800);
    T(() => setDreamVis(true), 7600);
    T(() => setBeliefVis(true), 9400);
    T(() => { setScrollEnabled(true); setIntroDone(true); }, 13000);
    return () => timers.forEach(clearTimeout);
  }, []);

  // ── SCROLL ──
  useEffect(() => {
    if (!scrollEnabled) return;
    const fn = () => {
      const sy = window.scrollY;
      setScrollY(sy);
      setNavScrolled(sy > 80);
      const ch = Math.min(Math.floor(sy / CH), TOTAL_CHS);
      const cp = (sy % CH) / CH;
      setChapter(ch);
      setChapterProgress(cp);
      if (ch === 4 && cp > 0.08 && cp < 0.25 && !thunderFiredRef.current) {
        thunderFiredRef.current = true;
        setThunderTrigger(t => t + 1);
      }
      if (ch !== 4) thunderFiredRef.current = false;
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [scrollEnabled, CH]);

  const goApp = useCallback(() => navigate(localStorage.getItem("token") ? "/ai" : "/register"), [navigate]);

  const introBg = ascending ? "#050305" : "#ffffff";
  const introOpacity = introDone ? 0 : 1;
  const introZ = introDone ? -1 : 90;

  const scaleVal = ascending ? 0.16 : 1;
  const transYVal = ascending ? (typeof window !== "undefined" ? -(window.innerHeight * 0.41) : -300) : 0;

  return (
    <>
      <style>{CSS}</style>

      {/* Particles — only when world is visible */}
      {worldVis && <ParticleCanvas/>}

      {/* ── INTRO OVERLAY ── */}
      <div style={{
        position:"fixed",inset:0,zIndex:introZ,
        background:introBg,
        opacity:introOpacity,
        transition:introDone?"opacity 1s ease":ascending?"background 1s ease":"none",
        pointerEvents:introDone?"none":"all",
        overflow:"hidden",
      }}>
        {/* Atmosphere behind intro elements */}
        {worldVis && (
          <div style={{position:"absolute",inset:0,opacity:1}}>
            <Atmosphere groundOffset={groundOffset} glowIntensity={glowIntensity} skyColor={skyColor} fogOpacity={0}/>
            <DreamLetters visible={dreamVis}/>
            {beliefVis && (
              <div style={{position:"absolute",left:"6%",top:"34%",maxWidth:340,zIndex:20}}>
                {["You were not meant","to explore a single destination.","","You deserve the entire Earth.","","Every dream has a journey","waiting behind it."].map((line,i)=>(
                  <div key={i} style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:300,fontSize:"clamp(13px,1.6vw,18px)",color:"rgba(255,255,255,0.52)",lineHeight:1.55,opacity:beliefVis?1:0,transform:beliefVis?"translateY(0)":"translateY(14px)",transition:"opacity 0.9s "+(i*0.2)+"s ease,transform 1s "+(i*0.2)+"s ease"}}>{line || "\u00A0"}</div>
                ))}
              </div>
            )}
            {scrollEnabled && (
              <div style={{position:"absolute",bottom:"5%",right:"5%",display:"flex",flexDirection:"column",alignItems:"center",gap:6,animation:"floatY 2.5s ease-in-out infinite",opacity:0.35,zIndex:20}}>
                <span style={{fontFamily:"'Space Mono',monospace",fontSize:8,letterSpacing:"0.3em",color:"rgba(255,255,255,0.35)"}}>SCROLL</span>
                <div style={{width:1,height:32,background:"linear-gradient("+G+",transparent)"}}/>
              </div>
            )}
          </div>
        )}

        {/* Center logo — ascends to nav */}
        <div style={{
          position:"absolute",top:"50%",left:"50%",
          transform:"translate(-50%,-50%) scale("+scaleVal+") translateY("+transYVal+"px)",
          transformOrigin:"center center",
          transition:ascending?"transform 2.4s cubic-bezier(0.76,0,0.24,1)":"none",
          display:"flex",flexDirection:"column",alignItems:"center",gap:14,zIndex:30,
        }}>
          <AlvrynMark size={54} phase={markPhase} glow={markPhase>=3}/>
          <div style={{
            fontFamily:"'Cormorant Garamond',serif",fontWeight:200,
            fontSize:"clamp(48px,8vw,112px)",letterSpacing:"0.32em",
            color:ascending?"#f0ece6":"#0a0a0a",
            transition:"color 0.9s ease",
            opacity:wordmarkVis?1:0,transform:wordmarkVis?"translateY(0)":"translateY(16px)",
          }}>ALVRYN</div>
          {markPhase>=3&&!ascending&&(
            <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:200,fontSize:"clamp(9px,1.1vw,12px)",color:"rgba(0,0,0,0.28)",letterSpacing:"0.24em",opacity:wordmarkVis?1:0,transition:"opacity 0.8s 0.3s ease"}}>
              TRAVEL BEYOND BOUNDARIES
            </div>
          )}
        </div>
      </div>

      {/* ── NAVBAR ── */}
      {navVis && (
        <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,height:64,padding:"0 5%",
          display:"flex",alignItems:"center",justifyContent:"space-between",
          background:navScrolled?"rgba(3,3,3,0.9)":"transparent",
          backdropFilter:navScrolled?"blur(24px)":"none",
          borderBottom:navScrolled?"1px solid rgba(255,255,255,0.04)":"none",
          transition:"all 0.5s ease",
          opacity:ascending?1:0,pointerEvents:ascending?"all":"none",
        }}>
          <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",opacity:introDone||scrollEnabled?1:0,transition:"opacity 0.6s ease"}} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>
            <AlvrynMark size={28} phase={3}/>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:300,fontSize:16,color:"#fff",letterSpacing:"0.2em"}}>ALVRYN</div>
          </div>
          <div className="hide-m" style={{display:"flex",gap:32,opacity:scrollEnabled?1:0,transition:"opacity 0.6s ease"}}>
            {[["Story","#s-story"],["Destinations","#s-dest"],["Plans","#s-plans"]].map(([l,h])=>(
              <a key={l} href={h} style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"rgba(255,255,255,0.4)",textDecoration:"none",transition:"color 0.2s"}} onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.4)"}>{l}</a>
            ))}
          </div>
          <div style={{display:"flex",gap:10,opacity:scrollEnabled?1:0,transition:"opacity 0.6s ease"}}>
            <button onClick={()=>navigate("/login")} className="btn-ghost" style={{padding:"8px 18px",fontSize:13}}>Sign In</button>
            <button onClick={goApp} className="btn-gold" style={{padding:"9px 20px",fontSize:13}}>Start Planning</button>
          </div>
        </nav>
      )}

      {/* ── SCROLL WORLD (sticky) ── */}
      <div style={{height:TOTAL_CHS*100+"vh",position:"relative"}} id="s-story">
        <div style={{position:"sticky",top:0,height:"100vh",overflow:"hidden"}}>
          <Atmosphere groundOffset={groundOffset} glowIntensity={glowIntensity} skyColor={skyColor} fogOpacity={fogOpacity}/>

          {/* Chapter texts */}
          {[0,1,2,3,4,5,6,7].map(ch=>(
            <ChapterText key={ch} ch={ch} currentCh={chapter}/>
          ))}

          {/* Thunder */}
          <ThunderFlash trigger={thunderTrigger}/>

          {/* DREAM letters fade as you scroll past ch2 */}
          <DreamLetters visible={chapter<=1}/>

          {/* Silhouette figure */}
          <div style={{
            position:"absolute",left:"50%",bottom:"30%",
            width:58,height:145,
            transform:"translateX(-50%) scale("+figureScale+") translateY("+(- figureRise)+"px)",
            transformOrigin:"50% 100%",
            opacity:silOpacity,transition:"opacity 0.7s ease",
          }}>
            <Silhouette state={silState}/>
          </div>

          {/* Eye close-up */}
          {eyeVis && (
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",opacity:Math.max(0,eyeOp),transition:"opacity 0.3s ease",zIndex:20,background:"rgba(4,2,4,"+Math.max(0,eyeOp*0.85)+")"}}>
              <div style={{width:"min(88vw,760px)",height:"min(44vw,380px)"}}>
                <EyeSVG/>
              </div>
            </div>
          )}

          {/* Scroll cue */}
          {chapter < 7 && scrollEnabled && (
            <div style={{position:"absolute",bottom:"3%",left:"50%",transform:"translateX(-50%)",animation:"floatY 2.5s ease-in-out infinite",opacity:0.28,zIndex:15}}>
              <div style={{width:1,height:30,background:"linear-gradient("+G+",transparent)",margin:"0 auto"}}/>
            </div>
          )}
        </div>
      </div>

      {/* ── PRODUCT ── */}
      <div id="s-dest">
        <ProductContent navigate={navigate}/>
      </div>
    </>
  );
}
