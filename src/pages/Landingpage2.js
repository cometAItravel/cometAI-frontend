/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const G = "#c9a84c";
const GD = "#8B6914";
const GL = "#f0d080";

// 12 emotional chapters — the complete color journey
const CHAPTERS = [
  {top:"#1a0e04",bot:"#8B3A0F",glow:0.52},  // 0 Warm amber dreamscape
  {top:"#120804",bot:"#6B2A0A",glow:0.44},  // 1 Camera forward
  {top:"#0e0604",bot:"#5a2208",glow:0.38},  // 2 Figure appears
  {top:"#09040a",bot:"#3d1208",glow:0.32},  // 3 Shoulder level
  {top:"#050812",bot:"#0a1830",glow:0.30},  // 4 Thunder — storm blue
  {top:"#080810",bot:"#14141e",glow:0.20},  // 5 Silver calm aftermath
  {top:"#0d0a04",bot:"#3d2804",glow:0.62},  // 6 Golden dawn breaks
  {top:"#020408",bot:"#060e1e",glow:0.35},  // 7 Cosmic deep blue
  {top:"#020508",bot:"#052010",glow:0.30},  // 8 Earth from space
  {top:"#030202",bot:"#0c0604",glow:0.56},  // 9 World becomes Alvryn
  {top:"#010101",bot:"#030302",glow:0.42},  // 10 The message
  {top:"#020202",bot:"#060404",glow:0.50},  // 11 The invitation
];

function hexRgb(h){return{r:parseInt(h.slice(1,3),16),g:parseInt(h.slice(3,5),16),b:parseInt(h.slice(5,7),16)};}
function lerpHex(a,b,t){const ca=hexRgb(a),cb=hexRgb(b);return"rgb("+Math.round(ca.r+(cb.r-ca.r)*t)+","+Math.round(ca.g+(cb.g-ca.g)*t)+","+Math.round(ca.b+(cb.b-ca.b)*t)+")";}
function clamp(v,lo,hi){return Math.max(lo,Math.min(hi,v));}
function prog(sp,s,e){return clamp((sp-s)/(e-s),0,1);}
function easeOut(t){return 1-(1-t)*(1-t);}
function easeIn(t){return t*t;}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@200;300;400;600;700&family=DM+Sans:wght@200;300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{overflow-x:hidden;}
::-webkit-scrollbar{width:2px;}
::-webkit-scrollbar-thumb{background:#c9a84c;border-radius:1px;}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
@keyframes floatY{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
@keyframes goldShimmer{0%{background-position:200% center;}100%{background-position:-200% center;}}
@keyframes thunder{0%{opacity:0;}8%{opacity:0.88;}22%{opacity:0.32;}40%{opacity:0.72;}56%{opacity:0.10;}100%{opacity:0;}}
@keyframes cd1{0%{transform:translateX(0);}100%{transform:translateX(-280px);}}
@keyframes cd2{0%{transform:translateX(0);}100%{transform:translateX(240px);}}
@keyframes cd3{0%{transform:translateX(0);}100%{transform:translateX(-150px);}}
@keyframes hPulse{0%,100%{opacity:1;}50%{opacity:0.62;}}
@keyframes routeDraw{from{stroke-dashoffset:600;}to{stroke-dashoffset:0;}}
@keyframes cityPulse{0%,100%{transform:scale(1);opacity:0.9;}50%{transform:scale(1.4);opacity:0.5;}}
@keyframes textUp{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}
@keyframes assemble{from{opacity:0;transform:scale(0.82);}to{opacity:1;transform:scale(1);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
.g-text{background:linear-gradient(135deg,#8B6914,#c9a84c,#f0d080,#c9a84c);background-size:300% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:goldShimmer 5s linear infinite;}
.btn-gold{display:inline-flex;align-items:center;gap:10px;padding:16px 40px;border-radius:100px;background:linear-gradient(135deg,#8B6914,#c9a84c,#f0d080);color:#030303;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;border:none;cursor:pointer;transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);}
.btn-gold:hover{transform:translateY(-3px) scale(1.03);box-shadow:0 20px 50px rgba(201,168,76,0.45);}
.btn-ghost{display:inline-flex;align-items:center;gap:10px;padding:15px 36px;border-radius:100px;background:rgba(255,255,255,0.04);color:rgba(255,255,255,0.7);font-family:'DM Sans',sans-serif;font-size:15px;font-weight:400;border:1px solid rgba(255,255,255,0.15);cursor:pointer;backdrop-filter:blur(12px);transition:all 0.3s ease;}
.btn-ghost:hover{background:rgba(255,255,255,0.1);color:#fff;transform:translateY(-2px);}
.glass{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);backdrop-filter:blur(24px);border-radius:20px;}
.card-lift{transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);}
.card-lift:hover{transform:translateY(-8px);border-color:rgba(201,168,76,0.3)!important;}
@media(max-width:768px){.hide-m{display:none!important;}.grid-2{grid-template-columns:1fr!important;}.grid-3{grid-template-columns:1fr!important;}}
`;

/* THE ALVRYN MARK — ultra-clean geometric A */
function AlvrynMark({size=44,phase=3,glow=false}){
  const s=size, h=s, cx=s*0.5;
  const apx=[cx,h*0.06], bL=[s*0.07,h*0.94], bR=[s*0.93,h*0.94];
  const frac=0.60;
  const cLx=apx[0]+(bL[0]-apx[0])*frac, cLy=apx[1]+(bL[1]-apx[1])*frac;
  const cRx=apx[0]+(bR[0]-apx[0])*frac, cRy=cLy;
  const ext=s*0.12;
  const lLen=Math.hypot(bL[0]-apx[0],bL[1]-apx[1]);
  const cLen=(cRx+ext)-(cLx-ext);
  const id="m"+size;
  const sw=s*0.045;
  const grad="url(#"+id+")";
  return(
    <svg width={s} height={h} viewBox={"0 0 "+s+" "+h} fill="none"
      style={{filter:glow?"drop-shadow(0 0 "+(s*0.13)+"px rgba(201,168,76,0.8))":"none",flexShrink:0}}>
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={GD}/><stop offset="50%" stopColor={G}/><stop offset="100%" stopColor={GL}/>
        </linearGradient>
      </defs>
      <line x1={apx[0]} y1={apx[1]} x2={bL[0]} y2={bL[1]} stroke={grad} strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={lLen} strokeDashoffset={phase>=1?0:lLen}
        style={{transition:"stroke-dashoffset 0.9s cubic-bezier(0.22,1,0.36,1)"}}/>
      <line x1={apx[0]} y1={apx[1]} x2={bR[0]} y2={bR[1]} stroke={grad} strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={lLen} strokeDashoffset={phase>=1?0:lLen}
        style={{transition:"stroke-dashoffset 0.9s 0.1s cubic-bezier(0.22,1,0.36,1)"}}/>
      <g style={{transformOrigin:cx+"px "+cLy+"px",transform:phase>=2?"scaleX(1)":"scaleX(0)",opacity:phase>=2?1:0,
        transition:"transform 0.7s 0.3s cubic-bezier(0.22,1,0.36,1),opacity 0.4s 0.3s ease"}}>
        <line x1={cLx-ext} y1={cLy} x2={cRx+ext} y2={cRy} stroke={grad} strokeWidth={sw*0.5} strokeLinecap="round"/>
      </g>
    </svg>
  );
}

/* PARTICLES */
function ParticleCanvas({active}){
  const ref=useRef(null);
  useEffect(()=>{
    if(!active)return;
    const c=ref.current;if(!c)return;
    const ctx=c.getContext("2d");
    let W=c.width=window.innerWidth,H=c.height=window.innerHeight;
    const pts=Array.from({length:42},()=>({x:Math.random()*W,y:Math.random()*H+H*0.1,vx:(Math.random()-0.5)*0.12,vy:-(0.1+Math.random()*0.28),r:Math.random()*1.2+0.25,a:Math.random()*0.16+0.04}));
    const mouse={x:-2000,y:-2000};
    const mfn=e=>{mouse.x=e.clientX;mouse.y=e.clientY;};
    const rfn=()=>{W=c.width=window.innerWidth;H=c.height=window.innerHeight;};
    window.addEventListener("mousemove",mfn,{passive:true});window.addEventListener("resize",rfn);
    let raf;
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      pts.forEach(p=>{
        const dx=mouse.x-p.x,dy=mouse.y-p.y,d=Math.hypot(dx,dy);
        if(d<100){p.vx+=dx/d*0.01;p.vy+=dy/d*0.01;}
        p.vx*=0.99;p.vy*=0.99;p.x+=p.vx;p.y+=p.vy;
        if(p.y<-5){p.y=H+5;p.x=Math.random()*W;}
        if(p.x<0)p.x=W;if(p.x>W)p.x=0;
        ctx.save();ctx.globalAlpha=p.a;ctx.fillStyle=G;ctx.shadowBlur=4;ctx.shadowColor=G;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();ctx.restore();
      });
      raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("mousemove",mfn);window.removeEventListener("resize",rfn);};
  },[active]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,zIndex:1,pointerEvents:"none"}}/>;
}

/* SILHOUETTE */
function Silhouette({state=0}){
  const hR=state>=1?"rotate(17deg)":"rotate(0deg)";
  const lLTx=state>=2?"translateX(-5px) translateY(5px) rotate(-7deg)":"none";
  const rLTx=state>=2?"translateX(4px) translateY(-4px) rotate(5deg)":"none";
  const bL=state>=2?"rotate(-2.5deg)":"rotate(0deg)";
  return(
    <svg viewBox="0 0 80 200" style={{width:"100%",height:"100%",overflow:"visible"}}>
      <g style={{transformOrigin:"40px 18px",transform:hR,transition:"transform 1.8s cubic-bezier(0.76,0,0.24,1)"}}>
        <ellipse cx="40" cy="18" rx="12" ry="13" fill="#040204"/>
      </g>
      <g style={{transformOrigin:"40px 100px",transform:bL,transition:"transform 1.2s cubic-bezier(0.34,1.56,0.64,1)"}}>
        <rect x="36" y="30" width="8" height="10" fill="#040204"/>
        <path d="M24,40 C21,44 19,70 19,100 L61,100 C61,70 59,44 56,40 C51,38 46,37 40,37 C34,37 29,38 24,40 Z" fill="#040204"/>
        <path d="M24,43 L13,85 L19,87 L28,47 Z" fill="#040204"/>
        <path d="M56,43 L67,85 L61,87 L52,47 Z" fill="#040204"/>
      </g>
      <g style={{transformOrigin:"30px 100px",transform:lLTx,transition:"transform 1.2s 0.15s cubic-bezier(0.34,1.56,0.64,1)"}}>
        <path d="M22,100 L18,190 L34,190 L38,100 Z" fill="#040204"/>
      </g>
      <g style={{transformOrigin:"50px 100px",transform:rLTx,transition:"transform 1.2s cubic-bezier(0.34,1.56,0.64,1)"}}>
        <path d="M58,100 L62,190 L46,190 L42,100 Z" fill="#040204"/>
      </g>
      <ellipse cx="40" cy="193" rx="22" ry="3" fill="#040204" opacity="0.28"/>
    </svg>
  );
}

/* EYE */
function EyeSVG(){
  return(
    <svg viewBox="0 0 300 130" style={{width:"100%",height:"100%"}}>
      <defs>
        <radialGradient id="iris" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.95"/>
          <stop offset="28%" stopColor="#8B3A0F" stopOpacity="0.9"/>
          <stop offset="65%" stopColor="#1a0808" stopOpacity="1"/>
          <stop offset="100%" stopColor="#050205" stopOpacity="1"/>
        </radialGradient>
        <radialGradient id="ew2" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#ede8e0" stopOpacity="0.95"/>
          <stop offset="100%" stopColor="#d0c8bc" stopOpacity="0.85"/>
        </radialGradient>
        <radialGradient id="eref2" cx="32%" cy="32%" r="50%">
          <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.65"/>
          <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <path d="M5,65 C40,20 260,18 295,65 C260,110 40,112 5,65 Z" fill="url(#ew2)"/>
      <circle cx="150" cy="65" r="36" fill="url(#iris)"/>
      <circle cx="150" cy="65" r="18" fill="#010101"/>
      <circle cx="138" cy="54" r="8" fill="url(#eref2)"/>
      <circle cx="157" cy="70" r="2.5" fill="#c9a84c" opacity="0.5"/>
      <path d="M5,65 C40,20 260,18 295,65" fill="none" stroke="#0a0506" strokeWidth="3.5"/>
      <path d="M5,65 C40,110 260,112 295,65" fill="none" stroke="#0a0506" strokeWidth="2.5"/>
    </svg>
  );
}

/* THUNDER */
function ThunderFlash({trigger}){
  const [on,setOn]=useState(false);const prev=useRef(0);
  useEffect(()=>{
    if(trigger===prev.current)return;prev.current=trigger;if(trigger===0)return;
    setOn(true);const t=setTimeout(()=>setOn(false),720);return()=>clearTimeout(t);
  },[trigger]);
  if(!on)return null;
  return <div style={{position:"absolute",inset:0,zIndex:50,pointerEvents:"none",background:"rgba(200,220,255,0.85)",animation:"thunder 0.72s ease forwards"}}/>;
}

/* DREAM LETTERS */
function DreamLetters({opacity}){
  return(
    <div style={{position:"absolute",bottom:"5%",left:"4%",right:"4%",display:"flex",justifyContent:"space-between",alignItems:"flex-end",zIndex:10,pointerEvents:"none",opacity,transition:"opacity 0.8s ease"}}>
      {"DREAM".split("").map((l,i)=>(
        <span key={l} style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(44px,7vw,110px)",color:"rgba(255,255,255,0.07)",lineHeight:1}}>{l}</span>
      ))}
    </div>
  );
}

/* ROUTE ARCS — structures become flight paths */
function RouteArcs({opacity}){
  if(opacity<=0)return null;
  const routes=["M 500 380 Q 620 200 680 350","M 680 350 Q 760 180 770 320","M 500 380 Q 720 250 770 320","M 270 355 Q 450 200 500 380","M 770 320 Q 840 250 840 290","M 590 360 Q 680 350 770 320"];
  return(
    <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:11,pointerEvents:"none",opacity}} viewBox="0 0 1200 700">
      {routes.map((d,i)=>(
        <g key={i}>
          <path d={d} stroke={G} strokeWidth="1.2" fill="none" strokeDasharray="600" strokeDashoffset="600"
            style={{animation:opacity>0.2?"routeDraw 2s ease "+(i*0.25)+"s forwards":"none"}} opacity="0.5"/>
          <circle r="2.5" fill={G} opacity="0.8">
            <animateMotion dur={(3+i*0.4)+"s"} repeatCount="indefinite" begin={(i*0.5)+"s"}>
              <mpath href={"#r"+i}/>
            </animateMotion>
          </circle>
          <path id={"r"+i} d={d} fill="none"/>
        </g>
      ))}
    </svg>
  );
}

/* CITY LIGHTS — stars become destinations */
const CITIES=[
  {x:"62%",y:"50%",name:"Goa",d:0},{x:"68%",y:"43%",name:"Dubai",d:0.15},
  {x:"76%",y:"50%",name:"Singapore",d:0.25},{x:"78%",y:"55%",name:"Bali",d:0.35},
  {x:"84%",y:"37%",name:"Tokyo",d:0.44},{x:"49%",y:"30%",name:"Paris",d:0.52},
  {x:"45%",y:"28%",name:"London",d:0.60},{x:"27%",y:"36%",name:"New York",d:0.68},
  {x:"59%",y:"37%",name:"Istanbul",d:0.75},{x:"56%",y:"52%",name:"Maldives",d:0.82},
  {x:"61%",y:"44%",name:"Delhi",d:0.18},{x:"64%",y:"47%",name:"Mumbai",d:0.22},
];
function CityLights({opacity}){
  if(opacity<=0)return null;
  return(
    <div style={{position:"absolute",inset:0,zIndex:12,pointerEvents:"none",opacity}}>
      {CITIES.map((city,i)=>(
        <div key={city.name} style={{position:"absolute",left:city.x,top:city.y,opacity:opacity>0.3?(opacity-0.3)/0.7:0,transition:"opacity 0.5s ease",transitionDelay:(city.d*0.8)+"s",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:G,boxShadow:"0 0 8px "+G+",0 0 16px "+G+"44",animation:"cityPulse "+(2+i*0.3)+"s ease-in-out infinite"}}/>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:8,color:"rgba(201,168,76,0.7)",letterSpacing:"0.08em",whiteSpace:"nowrap"}}>{city.name}</div>
        </div>
      ))}
    </div>
  );
}

/* SCROLL REVEAL */
function Reveal({children,delay=0,direction="up",style}){
  const ref=useRef(null);const [vis,setVis]=useState(false);
  useEffect(()=>{const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true);},{threshold:0.08});if(ref.current)obs.observe(ref.current);return()=>obs.disconnect();},[]);
  const T={up:"translateY(50px)",left:"translateX(-60px)",right:"translateX(60px)"};
  return(<div ref={ref} style={{opacity:vis?1:0,transform:vis?"none":(T[direction]||"translateY(50px)"),transition:"opacity 0.9s "+delay+"ms cubic-bezier(0.22,1,0.36,1),transform 1s "+delay+"ms cubic-bezier(0.22,1,0.36,1)",...style}}>{children}</div>);
}

/* COUNTER */
function Counter({end,suffix=""}){
  const [n,setN]=useState(0);const ref=useRef(null);const done=useRef(false);
  useEffect(()=>{const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting&&!done.current){done.current=true;const s=Date.now();const t=()=>{const p=Math.min((Date.now()-s)/2000,1);setN(Math.round((1-Math.pow(1-p,3))*end));if(p<1)requestAnimationFrame(t);};requestAnimationFrame(t);}},{threshold:0.4});if(ref.current)obs.observe(ref.current);return()=>obs.disconnect();},[end]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

/* TYPEWRITER */
function TypeWriter({phrases}){
  const [pi,setPi]=useState(0);const [txt,setTxt]=useState("");const [del,setDel]=useState(false);const [ci,setCi]=useState(0);
  useEffect(()=>{const w=phrases[pi%phrases.length];if(!del){if(ci<w.length){const t=setTimeout(()=>{setTxt(w.slice(0,ci+1));setCi(c=>c+1);},65);return()=>clearTimeout(t);}else{const t=setTimeout(()=>setDel(true),2400);return()=>clearTimeout(t);}}else{if(ci>0){const t=setTimeout(()=>{setTxt(w.slice(0,ci-1));setCi(c=>c-1);},35);return()=>clearTimeout(t);}else{setDel(false);setPi(p=>p+1);}}
  },[ci,del,pi,phrases]);
  return <span style={{color:G}}>{txt}<span style={{animation:"blink 0.9s step-end infinite",color:G}}>|</span></span>;
}

/* MAIN */
export default function LandingPage2(){
  const navigate=useNavigate();
  // Intro
  const [markPhase,setMarkPhase]=useState(0);
  const [wordVis,setWordVis]=useState(false);
  const [ascending,setAscending]=useState(false);
  const [worldVis,setWorldVis]=useState(false);
  const [dreamVis,setDreamVis]=useState(false);
  const [beliefVis,setBeliefVis]=useState(false);
  const [scrollOk,setScrollOk]=useState(false);
  const [introDone,setIntroDone]=useState(false);
  const [navVis,setNavVis]=useState(false);
  // Scroll
  const [sp,setSp]=useState(0);
  const [navScrolled,setNavScrolled]=useState(false);
  const [thunderTrigger,setThunderTrigger]=useState(0);
  const tfRef=useRef(false);
  const TOTAL_VH=1500;

  // Chapter colors
  const chIdx=Math.min(Math.floor(sp*12),11);
  const chProg=(sp*12)%1;
  const pal=CHAPTERS[chIdx];
  const palN=CHAPTERS[Math.min(chIdx+1,11)];
  const skyTop=lerpHex(pal.top,palN.top,chProg);
  const skyBot=lerpHex(pal.bot,palN.bot,chProg);
  const glowI=pal.glow+(palN.glow-pal.glow)*chProg;

  // Scroll-derived visuals
  const groundOff=Math.min(sp,0.55)/0.55*1000;
  const fogOp=Math.max(0,0.72-sp*1.25);
  const figScale=sp<0.52?0.055+easeIn(sp/0.52)*2.9:0;
  const figOp=sp<0.08?0:sp<0.52?1:Math.max(0,1-(sp-0.52)/0.04);
  const silState=sp<0.40?0:sp<0.46?1:2;
  const eyeOp=clamp(prog(sp,0.42,0.46),0,1)*clamp(1-prog(sp,0.48,0.52),0,1);
  const dreamOp=clamp(1-prog(sp,0.08,0.14),0,1);
  // Transformation
  const worldMapOp=clamp(prog(sp,0.60,0.75),0,1);
  const routeOp=clamp(prog(sp,0.65,0.78),0,1);
  const cityOp=clamp(prog(sp,0.70,0.82),0,1);
  // Product reveal
  const msg1Op=clamp(prog(sp,0.80,0.86),0,1)*clamp(1-prog(sp,0.93,0.96),0,1);
  const msg2Op=clamp(prog(sp,0.84,0.90),0,1)*clamp(1-prog(sp,0.94,0.97),0,1);
  const alvrynOp=clamp(prog(sp,0.87,0.93),0,1);
  const aiLineOp=clamp(prog(sp,0.89,0.93),0,1);
  const ctaOp=clamp(prog(sp,0.93,0.98),0,1);

  // Chapter text data
  const CH_TEXTS=[
    {s:0.02,e:0.10,t:"The dream begins here."},
    {s:0.10,e:0.20,t:"Most people never go beyond what they know."},
    {s:0.20,e:0.30,t:"There is always someone who goes first."},
    {s:0.30,e:0.38,t:"The moment before everything changes."},
    {s:0.38,e:0.48,t:"The world is trying to tell you something."},
    {s:0.48,e:0.56,t:"The journey begins. One step at a time."},
    {s:0.56,e:0.64,t:"What if the impossible world... was always Earth?"},
    {s:0.64,e:0.72,t:"The world you dream of is real."},
    {s:0.72,e:0.80,t:"Every destination. Waiting."},
  ];
  const activeTxt=CH_TEXTS.find(t=>sp>=t.s&&sp<t.e);

  // Intro sequence
  useEffect(()=>{
    const T=(fn,ms)=>{const t=setTimeout(fn,ms);return t;};
    const ts=[
      T(()=>setMarkPhase(1),1100),
      T(()=>setMarkPhase(2),1900),
      T(()=>setMarkPhase(3),2500),
      T(()=>setWordVis(true),3000),
      T(()=>{setAscending(true);setNavVis(true);},4600),
      T(()=>setWorldVis(true),5800),
      T(()=>setDreamVis(true),7600),
      T(()=>setBeliefVis(true),9200),
      T(()=>{setScrollOk(true);setIntroDone(true);},12500),
    ];
    return()=>ts.forEach(clearTimeout);
  },[]);

  // Scroll handler
  useEffect(()=>{
    if(!scrollOk)return;
    const VH=window.innerHeight;
    const maxS=VH*(TOTAL_VH/100-1);
    const fn=()=>{
      const sy=window.scrollY;
      const p=Math.min(sy/maxS,1);
      setSp(p);setNavScrolled(sy>80);
      if(p>0.32&&p<0.38&&!tfRef.current){tfRef.current=true;setThunderTrigger(t=>t+1);}
      if(p<0.30)tfRef.current=false;
    };
    window.addEventListener("scroll",fn,{passive:true});
    return()=>window.removeEventListener("scroll",fn);
  },[scrollOk,TOTAL_VH]);

  const goApp=useCallback(()=>navigate(localStorage.getItem("token")?"/ai":"/register"),[navigate]);
  const goSearch=useCallback(()=>navigate(localStorage.getItem("token")?"/search":"/login"),[navigate]);

  const aScale=ascending?0.16:1;
  const aY=ascending?(typeof window!=="undefined"?-(window.innerHeight*0.42):"-42vh"):"0px";

  /* ATMOSPHERE — shared visual used in both intro overlay and scroll world */
  const Atmo=({extraGround=false})=>(
    <>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,"+skyTop+" 0%,"+skyBot+" 100%)",transition:"background 0.3s linear"}}/>
      <div style={{position:"absolute",left:0,right:0,top:"52%",height:"48%",background:"radial-gradient(ellipse at 50% 0%,rgba(201,168,76,"+(glowI*0.52)+"),rgba(139,58,15,"+(glowI*0.3)+") 32%,transparent 68%)",animation:"hPulse 8s ease-in-out infinite",transition:"background 0.5s ease"}}/>
      {[{w:620,h:200,t:"14%",l:"-8%",bl:55,op:0.055,a:"cd1",dur:"88s"},
        {w:420,h:155,t:"25%",l:"58%",bl:42,op:0.07,a:"cd2",dur:"72s"},
        {w:720,h:185,t:"33%",l:"8%",bl:58,op:0.045,a:"cd3",dur:"115s"},
        {w:310,h:105,t:"43%",l:"38%",bl:36,op:0.06,a:"cd2",dur:"62s"}].map((cl,i)=>(
        <div key={i} style={{position:"absolute",top:cl.t,left:cl.l,width:cl.w,height:cl.h,borderRadius:"50%",background:"rgba(255,255,255,0.88)",filter:"blur("+cl.bl+"px)",opacity:cl.op*(extraGround?1:Math.max(0.2,1-sp*0.5)),animation:cl.a+" "+cl.dur+" linear infinite"}}/>
      ))}
      <div style={{position:"absolute",inset:0,background:"rgba(8,5,6,"+fogOp+")",pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:0,left:"-20%",right:"-20%",height:"36%",backgroundImage:"repeating-linear-gradient(0deg,rgba(201,168,76,0.055) 0px,rgba(201,168,76,0.055) 1px,transparent 1px,transparent 42px),repeating-linear-gradient(90deg,rgba(201,168,76,0.02) 0px,rgba(201,168,76,0.02) 1px,transparent 1px,transparent 105px)",backgroundPositionY:(extraGround?0:groundOff)+"px",transform:"perspective(640px) rotateX(66deg)",transformOrigin:"50% 100%",opacity:1-worldMapOp*0.8}}/>
    </>
  );

  return(
    <>
      <style>{CSS}</style>
      {worldVis&&<ParticleCanvas active={worldVis}/>}

      {/* INTRO OVERLAY */}
      <div style={{position:"fixed",inset:0,zIndex:introDone?-1:90,background:ascending?"#050305":"#ffffff",opacity:introDone?0:1,transition:introDone?"opacity 1.2s ease":ascending?"background 1s ease":"none",pointerEvents:introDone?"none":"all",overflow:"hidden"}}>
        {worldVis&&(
          <div style={{position:"absolute",inset:0}}>
            <Atmo extraGround/>
            {/* World map hint in ground */}
            {worldMapOp>0&&<div style={{position:"absolute",bottom:"2%",left:"50%",transform:"translateX(-50%) scale(0.9)",opacity:worldMapOp*0.3}}/>}
            <DreamLetters opacity={dreamVis?1:0}/>
            {beliefVis&&(
              <div style={{position:"absolute",left:"6%",top:"34%",maxWidth:340,zIndex:20}}>
                {["You were not meant","to explore a single destination.","","You deserve the entire Earth.","","Every dream has a journey","waiting behind it."].map((line,i)=>(
                  <div key={i} style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:300,fontSize:"clamp(13px,1.6vw,18px)",color:"rgba(255,255,255,0.52)",lineHeight:1.55,opacity:beliefVis?1:0,transform:beliefVis?"translateY(0)":"translateY(14px)",transition:"opacity 0.9s "+(i*0.2)+"s ease,transform 1s "+(i*0.2)+"s ease"}}>{line||"\u00A0"}</div>
                ))}
              </div>
            )}
            {scrollOk&&<div style={{position:"absolute",bottom:"5%",right:"5%",display:"flex",flexDirection:"column",alignItems:"center",gap:6,animation:"floatY 2.5s ease-in-out infinite",opacity:0.35,zIndex:20}}>
              <span style={{fontFamily:"'Space Mono',monospace",fontSize:8,letterSpacing:"0.3em",color:"rgba(255,255,255,0.35)"}}>SCROLL</span>
              <div style={{width:1,height:32,background:"linear-gradient("+G+",transparent)"}}/>
            </div>}
          </div>
        )}
        {/* Center logo that ascends */}
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%) scale("+aScale+") translateY("+aY+"px)",transformOrigin:"center center",transition:ascending?"transform 2.4s cubic-bezier(0.76,0,0.24,1)":"none",display:"flex",flexDirection:"column",alignItems:"center",gap:16,zIndex:30,textAlign:"center"}}>
          <AlvrynMark size={56} phase={markPhase} glow={markPhase>=2}/>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(52px,9vw,120px)",letterSpacing:"0.32em",color:ascending?"#f0ece6":"#0a0a0a",opacity:wordVis?1:0,transform:wordVis?"translateY(0)":"translateY(18px)",transition:"color 1s ease,opacity 0.8s ease,transform 0.8s ease",lineHeight:1}}>ALVRYN</div>
          {!ascending&&markPhase>=3&&wordVis&&<div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:200,fontSize:"clamp(9px,1.1vw,12px)",color:"rgba(0,0,0,0.28)",letterSpacing:"0.24em"}}>TRAVEL BEYOND BOUNDARIES</div>}
        </div>
      </div>

      {/* NAVBAR */}
      {navVis&&<nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,height:64,padding:"0 5%",display:"flex",alignItems:"center",justifyContent:"space-between",background:navScrolled?"rgba(5,3,5,0.92)":"transparent",backdropFilter:navScrolled?"blur(24px)":"none",borderBottom:navScrolled?"1px solid rgba(255,255,255,0.04)":"none",transition:"all 0.5s ease",opacity:ascending?1:0,pointerEvents:ascending?"all":"none"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",opacity:introDone||scrollOk?1:0,transition:"opacity 0.6s ease"}} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>
          <AlvrynMark size={28} phase={3}/><div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:300,fontSize:16,color:"#fff",letterSpacing:"0.2em"}}>ALVRYN</div>
        </div>
        <div className="hide-m" style={{display:"flex",gap:32,opacity:scrollOk?1:0,transition:"opacity 0.6s ease"}}>
          {[["Story","#s-story"],["Destinations","#s-dest"],["Begin","#s-begin"]].map(([l,h])=>(
            <a key={l} href={h} style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"rgba(255,255,255,0.4)",textDecoration:"none",transition:"color 0.2s"}} onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.4)"}>{l}</a>
          ))}
        </div>
        <div style={{display:"flex",gap:10,opacity:scrollOk?1:0,transition:"opacity 0.6s ease"}}>
          <button onClick={()=>navigate("/login")} className="btn-ghost" style={{padding:"8px 18px",fontSize:13}}>Sign In</button>
          <button onClick={goApp} className="btn-gold" style={{padding:"9px 20px",fontSize:13}}>Start Planning</button>
        </div>
      </nav>}

      {/* THE CINEMATIC SCROLL WORLD — 1500vh, everything inside */}
      <div style={{height:TOTAL_VH+"vh",position:"relative"}} id="s-story">
        <div style={{position:"sticky",top:0,height:"100vh",overflow:"hidden"}}>
          <Atmo/>
          {/* World map reveals as transformation begins */}
          {worldMapOp>0&&<div style={{position:"absolute",bottom:0,left:"-20%",right:"-20%",height:"36%",transform:"perspective(640px) rotateX(66deg)",transformOrigin:"50% 100%",opacity:worldMapOp*0.35,overflow:"hidden"}}>
            <svg style={{width:"100%",height:"100%"}} viewBox="0 0 1200 400">
              <path d="M730,175 L770,195 L758,238 L736,258 L714,238 L710,208 Z" fill={G} opacity="0.28" stroke={G} strokeWidth="0.5"/>
              <path d="M572,115 L635,105 L658,128 L647,158 L618,163 L585,148 Z" fill={G} opacity="0.22" stroke={G} strokeWidth="0.5"/>
              <path d="M595,168 L638,162 L658,198 L646,258 L618,288 L588,268 L578,228 Z" fill={G} opacity="0.18" stroke={G} strokeWidth="0.5"/>
              <path d="M255,108 L335,98 L358,138 L337,178 L298,198 L258,178 L238,148 Z" fill={G} opacity="0.22" stroke={G} strokeWidth="0.5"/>
              <path d="M735,98 L858,88 L898,128 L878,168 L818,178 L768,163 Z" fill={G} opacity="0.18" stroke={G} strokeWidth="0.5"/>
              <path d="M838,188 L878,183 L888,208 L868,223 L843,213 Z" fill={G} opacity="0.18" stroke={G} strokeWidth="0.5"/>
              <path d="M858,258 L918,252 L932,288 L908,308 L868,302 L848,278 Z" fill={G} opacity="0.18" stroke={G} strokeWidth="0.5"/>
            </svg>
          </div>}
          <RouteArcs opacity={routeOp}/>
          <CityLights opacity={cityOp}/>
          {/* Distant structures fade as world transforms */}
          {[{l:"9%",h:"52%",w:"2px",op:0.11},{l:"83%",h:"58%",w:"3px",op:0.09},{l:"51%",h:"42%",w:"2px",op:0.08}].map((s,i)=>(
            <div key={i} style={{position:"absolute",bottom:"34%",left:s.l,width:s.w,height:s.h,background:"linear-gradient(to top,rgba(201,168,76,"+s.op+"),transparent)",opacity:Math.max(0,1-worldMapOp*1.5),filter:"blur(0.5px)"}}/>
          ))}
          <ThunderFlash trigger={thunderTrigger}/>
          <DreamLetters opacity={dreamOp}/>
          {/* SILHOUETTE FIGURE */}
          {figOp>0&&<div style={{position:"absolute",left:"50%",bottom:"30%",width:58,height:145,transform:"translateX(-50%) scale("+figScale+") translateY("+(figScale*-14)+"px)",transformOrigin:"50% 100%",opacity:figOp,transition:"opacity 0.6s ease"}}>
            <Silhouette state={silState}/>
          </div>}
          {/* EYE CLOSE-UP */}
          {eyeOp>0&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",opacity:eyeOp,zIndex:20,background:"rgba(4,2,4,"+eyeOp*0.85+")"}}>
            <div style={{width:"min(88vw,760px)",height:"min(44vw,380px)"}}><EyeSVG/></div>
          </div>}
          {/* CHAPTER TEXT — evolves with the story */}
          {activeTxt&&<div key={activeTxt.t} style={{position:"absolute",left:"7%",top:"40%",maxWidth:420,zIndex:15,pointerEvents:"none",animation:"textUp 0.8s ease both"}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:300,fontSize:"clamp(18px,2.5vw,28px)",color:"rgba(255,255,255,0.62)",lineHeight:1.45,letterSpacing:"0.02em"}}>{activeTxt.t}</div>
          </div>}
          {/* THE TRANSFORMATION MESSAGE — world becomes Alvryn */}
          {msg1Op>0&&<div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:25,pointerEvents:"none",padding:"0 8%",textAlign:"center"}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(20px,4vw,56px)",color:"rgba(255,255,255,"+msg1Op*0.68+")",letterSpacing:"-0.01em",lineHeight:1.25,marginBottom:20,opacity:msg1Op}}>
              YOU WERE NEVER MEANT<br/>TO EXPLORE JUST ONE PLACE.
            </div>
            {msg2Op>0&&<div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(20px,4vw,56px)",color:"rgba(255,255,255,"+msg2Op*0.78+")",letterSpacing:"-0.01em",lineHeight:1.25,opacity:msg2Op}}>
              YOU DESERVE THE ENTIRE WORLD.
            </div>}
          </div>}
          {/* ALVRYN REVEAL — world becomes the brand */}
          {alvrynOp>0&&<div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:30,pointerEvents:"none",opacity:alvrynOp}}>
            <div style={{animation:"assemble 1s ease both",display:"flex",flexDirection:"column",alignItems:"center",gap:20}}>
              <AlvrynMark size={72} phase={3} glow/>
              <div className="g-text" style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(48px,8vw,100px)",letterSpacing:"0.28em",lineHeight:1}}>ALVRYN</div>
              {aiLineOp>0&&<div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:"clamp(14px,1.8vw,20px)",color:"rgba(255,255,255,"+aiLineOp*0.62+")",letterSpacing:"0.08em",opacity:aiLineOp}}>Your entire journey. One message.</div>}
            </div>
          </div>}
          {/* FINAL CTA — emerges from the world */}
          {ctaOp>0&&<div style={{position:"absolute",bottom:"14%",left:"50%",transform:"translateX(-50%)",zIndex:35,display:"flex",gap:16,flexWrap:"wrap",justifyContent:"center",opacity:ctaOp,pointerEvents:"all"}}>
            <button onClick={goApp} className="btn-gold" style={{fontSize:16,padding:"17px 48px"}}>Start Planning</button>
            <button onClick={goSearch} className="btn-ghost" style={{fontSize:16,padding:"16px 36px"}}>Explore Destinations</button>
          </div>}
          {/* Scroll cue */}
          {sp<0.88&&scrollOk&&<div style={{position:"absolute",bottom:"3%",left:"50%",transform:"translateX(-50%)",opacity:sp<0.83?0.28:0,transition:"opacity 0.5s ease",zIndex:15,pointerEvents:"none"}}>
            <div style={{width:1,height:28,background:"linear-gradient("+G+",transparent)",margin:"0 auto"}}/>
          </div>}
        </div>
      </div>

      {/* POST-STORY — dark cinematic sections, NO white */}
      <div id="s-dest" style={{background:"#030303",color:"#fff"}}>

        {/* Bridge section */}
        <section style={{minHeight:"70vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(180deg,#050305 0%,#030303 100%)",padding:"80px 5%",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 30%,rgba(201,168,76,0.08) 0%,transparent 60%)"}}/>
          <div style={{position:"relative",zIndex:2,maxWidth:800,textAlign:"center"}}>
            <Reveal>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:G,letterSpacing:"0.22em",marginBottom:20}}>THE BRIDGE TO THE REAL WORLD</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(28px,5vw,64px)",color:"#fff",lineHeight:1.1,marginBottom:24}}>The dream was always<br/><span className="g-text">about Earth.</span></div>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:17,color:"rgba(255,255,255,0.35)",lineHeight:1.7,maxWidth:480,margin:"0 auto"}}>Every destination you imagined exists. Alvryn is the intelligence that gets you there.</p>
            </Reveal>
          </div>
        </section>

        {/* AI Demo */}
        <section style={{minHeight:"100vh",padding:"100px 5%",background:"#02010a",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 25% 50%,rgba(139,58,15,0.1) 0%,transparent 55%)"}}/>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"clamp(80px,16vw,240px)",color:"rgba(255,255,255,0.015)",letterSpacing:"-0.04em",whiteSpace:"nowrap",pointerEvents:"none"}}>PLAN</div>
          <div style={{maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2}}>
            <Reveal style={{marginBottom:64}}>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:G,letterSpacing:"0.22em",marginBottom:16}}>THE INTELLIGENCE</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(32px,5vw,68px)",color:"#fff",lineHeight:1.1}}>One message.<br/><span style={{color:"#fb923c"}}>Every detail planned.</span></div>
            </Reveal>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"flex-start"}} className="grid-2">
              <Reveal direction="left">
                <div style={{borderRadius:24,overflow:"hidden",border:"1px solid rgba(255,255,255,0.05)",background:"rgba(0,0,0,0.5)",backdropFilter:"blur(20px)"}}>
                  <div style={{background:"linear-gradient(135deg,rgba(139,105,20,0.22),rgba(201,168,76,0.08))",borderBottom:"1px solid rgba(255,255,255,0.04)",padding:"16px 20px",display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,"+GD+","+G+")",display:"flex",alignItems:"center",justifyContent:"center"}}><AlvrynMark size={22} phase={3}/></div>
                    <div><div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:14,color:"#fff"}}>Alvryn AI</div><div style={{fontSize:11,color:"#22c55e",display:"flex",alignItems:"center",gap:4}}><span style={{width:5,height:5,borderRadius:"50%",background:"#22c55e",display:"inline-block"}}/>Online</div></div>
                  </div>
                  <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:12}}>
                    {[{role:"user",text:"6 friends Bangalore to Goa in August. Budget 15k per person. Two vegetarians. One arrives a day late. Prefer beaches."},{role:"ai",text:"Got it! Planning this for all 6 of you right now."},{role:"ai",text:"Flights BLR to GOI: 3500-4500 per person return. For 6 people: 21000-27000 total."},{role:"ai",text:"South Goa near Palolem and Agonda. 800-1800 per room. Veg options included.",card:true}].map((m,i)=>(
                      <Reveal key={i} delay={i*200}>
                        <div style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                          <div style={{maxWidth:"86%",padding:"11px 15px",borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",background:m.role==="user"?"linear-gradient(135deg,"+GD+","+G+")":"rgba(255,255,255,0.05)",border:m.role==="ai"?"1px solid rgba(255,255,255,0.07)":"none",fontFamily:"'DM Sans',sans-serif",fontSize:13,lineHeight:1.65,color:m.role==="user"?"#030303":"rgba(255,255,255,0.8)",fontWeight:m.role==="user"?600:400}}>
                            {m.text}
                            {m.card&&<div style={{marginTop:10,padding:"10px",background:"rgba(201,168,76,0.08)",borderRadius:8,border:"1px solid rgba(201,168,76,0.2)"}}>
                              <div style={{fontSize:12,color:G,fontWeight:700,marginBottom:6}}>Total: 11500-14500 per person. Within budget.</div>
                              <button onClick={goSearch} style={{background:G,color:"#030303",border:"none",borderRadius:7,padding:"7px 14px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Book Now</button>
                            </div>}
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
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(22px,3vw,38px)",color:"#fff",lineHeight:1.2,marginBottom:28}}>Every constraint.<br/><span style={{color:"#fb923c"}}>Addressed.</span></div>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {[{icon:"👥",t:"Group of 6",d:"Per person and total budget"},{icon:"🥗",t:"2 Vegetarians",d:"Specific restaurant picks"},{icon:"🕐",t:"Late arrival",d:"Separate plan created"},{icon:"🏖️",t:"Beaches only",d:"South Goa specifically"},{icon:"💰",t:"15k budget",d:"Fits at 11500-14500"},{icon:"🛡️",t:"Safety insights",d:"Goa tips auto-included"}].map((f,i)=>(
                    <div key={i} className="card-lift" style={{display:"flex",gap:12,padding:"13px 15px",borderRadius:13,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)"}}>
                      <span style={{fontSize:18}}>{f.icon}</span>
                      <div><div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13,color:"#fff"}}>{f.t}</div><div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"rgba(255,255,255,0.3)",marginTop:2}}>{f.d}</div></div>
                      <div style={{marginLeft:"auto",display:"flex",alignItems:"center"}}><div style={{width:5,height:5,borderRadius:"50%",background:"#fb923c"}}/></div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Destinations — dark cinematic */}
        <section style={{padding:"120px 5%",background:"#040208",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"clamp(80px,16vw,240px)",color:"rgba(255,255,255,0.015)",letterSpacing:"-0.04em",whiteSpace:"nowrap",pointerEvents:"none"}}>WORLD</div>
          <div style={{maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2}}>
            <Reveal style={{textAlign:"center",marginBottom:60}}>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:G,letterSpacing:"0.22em",marginBottom:16}}>THE DESTINATIONS</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(32px,5vw,64px)",color:"#fff",lineHeight:1.1}}>Every dream.<br/><span className="g-text">Every destination.</span></div>
            </Reveal>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:14}}>
              {[{n:"Goa",t:"Beaches",b:"5k-15k",i:"photo-1512343879784-a960bf40e7f2"},{n:"Dubai",t:"Global",b:"35k-70k",i:"photo-1512453979798-5ea266f8880c"},{n:"Manali",t:"Hills",b:"8k-18k",i:"photo-1626621341517-bbf3d9990a23"},{n:"Singapore",t:"City",b:"40k-80k",i:"photo-1525625293386-3f8f99389edd"},{n:"Bali",t:"Tropical",b:"25k-55k",i:"photo-1537996194471-e657df975ab4"},{n:"Switzerland",t:"Alps",b:"80k-1.5L",i:"photo-1530122037265-a5f1f91d3b99"},{n:"Maldives",t:"Luxury",b:"40k-1L",i:"photo-1514282401047-d79a71a590e8"},{n:"Japan",t:"Culture",b:"60k-1.2L",i:"photo-1528360983277-13d401cdc186"},{n:"Kerala",t:"Nature",b:"10k-25k",i:"photo-1602216056096-3b40cc0c9944"},{n:"Ladakh",t:"Adventure",b:"18k-35k",i:"photo-1592555187028-51a64e5bba29"},{n:"Paris",t:"Romance",b:"80k-1.5L",i:"photo-1502602898657-3e91760cbb34"},{n:"Bangkok",t:"Culture",b:"20k-45k",i:"photo-1563492065599-3520f775eeed"}].map((d,i)=>(
                <Reveal key={d.n} delay={i*38}>
                  <div onClick={()=>navigate(localStorage.getItem("token")?"/ai?dest="+d.n:"/register")}
                    style={{borderRadius:18,overflow:"hidden",cursor:"pointer",position:"relative",aspectRatio:"2/3",transition:"transform 0.4s cubic-bezier(0.34,1.56,0.64,1)"}}
                    onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.06) translateY(-8px)";}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="scale(1) translateY(0)";}}>
                    <img src={"https://images.unsplash.com/"+d.i+"?auto=format&fit=crop&w=400&h=600&q=70"} alt={d.n} loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} onError={e=>e.target.style.display="none"}/>
                    <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.9) 0%,rgba(0,0,0,0.3) 50%,rgba(0,0,0,0.1) 100%)"}}/>
                    <div style={{position:"absolute",top:10,right:10,background:"rgba(0,0,0,0.65)",backdropFilter:"blur(6px)",borderRadius:100,padding:"3px 10px",fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"rgba(255,255,255,0.75)"}}>{d.t}</div>
                    <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"14px"}}>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:20,color:"#fff"}}>{d.n}</div>
                      <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:G,marginTop:3}}>{d.b}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section style={{padding:"120px 5%",background:"#02010a",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",bottom:"-4%",left:"50%",transform:"translateX(-50%)",fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"clamp(70px,14vw,210px)",color:"rgba(255,255,255,0.015)",letterSpacing:"-0.04em",whiteSpace:"nowrap",pointerEvents:"none"}}>INTELLIGENT</div>
          <div style={{maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2}}>
            <Reveal style={{textAlign:"center",marginBottom:80}}>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:G,letterSpacing:"0.22em",marginBottom:16}}>CAPABILITIES</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(32px,5vw,64px)",color:"#fff",lineHeight:1.1}}>Everything you need.<br/><span className="g-text">Nothing you do not.</span></div>
            </Reveal>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}} className="grid-3">
              {[{icon:"🧠",t:"AI Trip Planner",d:"Complete plans. Any language. Every constraint addressed.",a:G},{icon:"✈️",t:"Flights Worldwide",d:"60+ destinations. Best fares via Aviasales.",a:"#38bdf8"},{icon:"🚌",t:"Buses Across India",d:"300+ routes. AC Sleeper via RedBus.",a:"#4ade80"},{icon:"🏨",t:"Hotels Worldwide",d:"Budget to luxury via Booking.com.",a:"#fb923c"},{icon:"🛡️",t:"Safety Insights",d:"Auto-appended for every destination.",a:"#a78bfa"},{icon:"📱",t:"WhatsApp AI",d:"Full trip planning inside WhatsApp.",a:"#22c55e"}].map((f,i)=>(
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

        {/* Plans */}
        <section style={{padding:"120px 5%",background:"#030305",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 50%,rgba(201,168,76,0.06) 0%,transparent 60%)"}}/>
          <div style={{maxWidth:1000,margin:"0 auto",position:"relative",zIndex:2}}>
            <Reveal style={{textAlign:"center",marginBottom:64}}>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:G,letterSpacing:"0.22em",marginBottom:16}}>PLANS</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(32px,5vw,64px)",color:"#fff",lineHeight:1.1}}>Start free.<br/><span className="g-text">Upgrade when ready.</span></div>
            </Reveal>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}} className="grid-3">
              {[{name:"Explorer",badge:"FREE",active:true,desc:"Everything to start",features:["20 AI responses per day","2 trip plans per month","Flights buses and hotels","Safety insights","WhatsApp AI"],cta:"Start Free"},{name:"Navigator",badge:"PRO",active:false,desc:"For serious travellers",features:["Unlimited trip plans","Advanced AI planning","Budget optimizer","Multi-city planning","Priority processing","Save plans"],cta:"Coming Soon"},{name:"Voyager",badge:"PREMIUM",active:false,desc:"The ultimate companion",features:["Everything in Navigator","Group travel planner","Scam awareness","Women traveller mode","Emergency companion","Weather planning"],cta:"Coming Soon"}].map((p,i)=>(
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
                    {p.active?<button onClick={goApp} className="btn-gold" style={{width:"100%",justifyContent:"center"}}>{p.cta}</button>:<div style={{padding:"11px",borderRadius:11,border:"1px solid rgba(201,168,76,0.15)",background:"rgba(201,168,76,0.04)",textAlign:"center"}}><div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"rgba(201,168,76,0.5)",letterSpacing:"0.1em"}}>Crafted with precision</div></div>}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section id="s-begin" style={{minHeight:"80vh",background:"#020202",display:"flex",alignItems:"center",justifyContent:"center",padding:"120px 5%",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 50%,rgba(201,168,76,0.08) 0%,transparent 65%)"}}/>
          <div style={{position:"relative",zIndex:2,textAlign:"center",maxWidth:720}}>
            <Reveal>
              <div style={{animation:"floatY 5s ease-in-out infinite",marginBottom:28,display:"inline-block"}}><AlvrynMark size={56} phase={3} glow/></div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(40px,8vw,96px)",color:"#fff",lineHeight:0.95,letterSpacing:"-0.02em",marginBottom:24}}>Start your<br/><span className="g-text">journey.</span></div>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:17,color:"rgba(255,255,255,0.3)",lineHeight:1.7,maxWidth:440,margin:"0 auto 44px"}}>{"India's most intelligent travel companion. Free forever."}</p>
              <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
                <button onClick={goApp} className="btn-gold" style={{fontSize:16,padding:"18px 50px"}}>Try Alvryn AI Free</button>
                <button onClick={goSearch} className="btn-ghost" style={{fontSize:16,padding:"17px 38px"}}>Search Travel</button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Footer */}
        <footer style={{background:"#010101",borderTop:"1px solid rgba(255,255,255,0.03)",padding:"44px 5%"}}>
          <div style={{maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:20}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}><AlvrynMark size={26} phase={3}/><div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:300,fontSize:14,color:"rgba(255,255,255,0.35)",letterSpacing:"0.18em"}}>ALVRYN</div></div>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"rgba(255,255,255,0.15)"}}>2026 Alvryn. Built in Bangalore. Travel Beyond Boundaries.</div>
            <div style={{display:"flex",gap:20}}>{["About","Privacy","Terms","Contact"].map(l=>(<span key={l} style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"rgba(255,255,255,0.2)",cursor:"pointer",transition:"color 0.2s"}} onMouseEnter={e=>e.target.style.color="rgba(255,255,255,0.6)"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.2)"}>{l}</span>))}</div>
          </div>
        </footer>
      </div>
    </>
  );
}