/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const G = "#c9a84c";
const GD = "#8B6914";
const GL = "#f0d080";

/* ── CSS ─────────────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,200;0,300;0,400;0,600;1,200;1,300&family=DM+Sans:wght@200;300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{overflow-x:hidden;scroll-behavior:smooth;}
body{overflow-x:hidden;font-family:'DM Sans',sans-serif;background:#0c0804;}
::-webkit-scrollbar{width:2px;}
::-webkit-scrollbar-thumb{background:#c9a84c;border-radius:1px;}

@keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
@keyframes floatY{0%,100%{transform:translateY(0);}50%{transform:translateY(-12px);}}
@keyframes gs{0%{background-position:200% center;}100%{background-position:-200% center;}}
@keyframes hPulse{0%,100%{opacity:0.9;}50%{opacity:0.55;}}
@keyframes cd1{0%{transform:translateX(0);}100%{transform:translateX(-260px);}}
@keyframes cd2{0%{transform:translateX(0);}100%{transform:translateX(220px);}}
@keyframes cd3{0%{transform:translateX(0);}100%{transform:translateX(-140px);}}
@keyframes particleUp{0%{transform:translateY(0);opacity:0;}15%{opacity:1;}85%{opacity:0.6;}100%{transform:translateY(-80vh);opacity:0;}}
@keyframes revealUp{from{opacity:0;transform:translateY(40px);}to{opacity:1;transform:translateY(0);}}
@keyframes drawIn{from{stroke-dashoffset:400;}to{stroke-dashoffset:0;}}
@keyframes pingOut{0%{transform:scale(1);opacity:0.8;}100%{transform:scale(2.8);opacity:0;}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}

.g-text{background:linear-gradient(135deg,#8B6914,#c9a84c,#f0d080,#c9a84c);background-size:300% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:gs 5s linear infinite;}

.btn-primary{display:inline-flex;align-items:center;gap:10px;padding:16px 42px;border-radius:100px;background:linear-gradient(135deg,#8B6914,#c9a84c,#f0d080);color:#030303;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;border:none;cursor:pointer;transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);}
.btn-primary:hover{transform:translateY(-3px) scale(1.03);box-shadow:0 20px 50px rgba(201,168,76,0.45);}
.btn-outline{display:inline-flex;align-items:center;gap:8px;padding:15px 36px;border-radius:100px;background:transparent;color:rgba(255,255,255,0.75);font-family:'DM Sans',sans-serif;font-size:15px;font-weight:400;border:1px solid rgba(255,255,255,0.25);cursor:pointer;transition:all 0.3s ease;}
.btn-outline:hover{background:rgba(255,255,255,0.08);color:#fff;transform:translateY(-2px);}
.btn-dark{display:inline-flex;align-items:center;gap:8px;padding:15px 36px;border-radius:100px;background:transparent;color:rgba(0,0,0,0.7);font-family:'DM Sans',sans-serif;font-size:15px;font-weight:400;border:1px solid rgba(0,0,0,0.2);cursor:pointer;transition:all 0.3s ease;}
.btn-dark:hover{background:rgba(0,0,0,0.06);color:#000;transform:translateY(-2px);}

.glass-dark{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);backdrop-filter:blur(24px);border-radius:20px;}
.glass-light{background:rgba(255,255,255,0.85);border:1px solid rgba(0,0,0,0.06);backdrop-filter:blur(20px);border-radius:20px;}
.lift{transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);}
.lift:hover{transform:translateY(-6px);box-shadow:0 24px 60px rgba(0,0,0,0.15);}
@media(max-width:768px){.hide-m{display:none!important;}.g2{grid-template-columns:1fr!important;}.g3{grid-template-columns:1fr!important;}}
`;

/* ── ALVRYN MARK — two strokes, nothing else ─────────────────────────────── */
function AlvrynMark({size=40,glow=false,dark=false}){
  const s=size, sw=Math.max(1,s*0.045);
  const stroke=dark?"#c9a84c":"url(#ig"+s+")";
  return(
    <svg width={s} height={s*0.88} viewBox="0 0 100 88" fill="none"
      style={{filter:glow?"drop-shadow(0 0 "+(s*0.14)+"px rgba(201,168,76,0.85))":"none",flexShrink:0}}>
      <defs>
        <linearGradient id={"ig"+s} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor={GD}/><stop offset="50%" stopColor={G}/><stop offset="100%" stopColor={GL}/>
        </linearGradient>
      </defs>
      <line x1="50" y1="3" x2="3" y2="85" stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
      <line x1="50" y1="3" x2="97" y2="85" stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
    </svg>
  );
}

/* ── PARTICLES ───────────────────────────────────────────────────────────── */
function Particles({color=G,count=36}){
  const ref=useRef(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;
    const ctx=c.getContext("2d");
    let W=c.width=window.innerWidth,H=c.height=window.innerHeight;
    const pts=Array.from({length:count},()=>({x:Math.random()*W,y:Math.random()*H+H*0.2,vx:(Math.random()-0.5)*0.1,vy:-(0.08+Math.random()*0.22),r:Math.random()*1.1+0.2,a:Math.random()*0.15+0.04}));
    const mouse={x:-2000,y:-2000};
    const mfn=e=>{mouse.x=e.clientX;mouse.y=e.clientY;};
    const rfn=()=>{W=c.width=window.innerWidth;H=c.height=window.innerHeight;};
    window.addEventListener("mousemove",mfn,{passive:true});window.addEventListener("resize",rfn);
    let raf;
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      pts.forEach(p=>{
        const dx=mouse.x-p.x,dy=mouse.y-p.y,d=Math.hypot(dx,dy);
        if(d<90){p.vx+=dx/d*0.009;p.vy+=dy/d*0.009;}
        p.vx*=0.99;p.vy*=0.99;p.x+=p.vx;p.y+=p.vy;
        if(p.y<-5){p.y=H+5;p.x=Math.random()*W;}
        if(p.x<0)p.x=W;if(p.x>W)p.x=0;
        ctx.save();ctx.globalAlpha=p.a;ctx.fillStyle=color;ctx.shadowBlur=3;ctx.shadowColor=color;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();ctx.restore();
      });
      raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("mousemove",mfn);window.removeEventListener("resize",rfn);};
  },[color,count]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,zIndex:1,pointerEvents:"none"}}/>;
}

/* ── REVEAL ANIMATION ────────────────────────────────────────────────────── */
function Reveal({children,delay=0,direction="up",style}){
  const ref=useRef(null);const [vis,setVis]=useState(false);
  useEffect(()=>{const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true);},{threshold:0.06});if(ref.current)obs.observe(ref.current);return()=>obs.disconnect();},[]);
  const T={up:"translateY(55px)",left:"translateX(-65px)",right:"translateX(65px)",scale:"scale(0.92)"};
  return(<div ref={ref} style={{opacity:vis?1:0,transform:vis?"none":(T[direction]||"translateY(55px)"),transition:"opacity 1s "+delay+"ms cubic-bezier(0.22,1,0.36,1),transform 1.1s "+delay+"ms cubic-bezier(0.22,1,0.36,1)",...style}}>{children}</div>);
}

/* ── COUNTER ─────────────────────────────────────────────────────────────── */
function Counter({end,suffix="",prefix=""}){
  const [n,setN]=useState(0);const ref=useRef(null);const done=useRef(false);
  useEffect(()=>{const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting&&!done.current){done.current=true;const s=Date.now();const t=()=>{const p=Math.min((Date.now()-s)/2200,1);setN(Math.round((1-Math.pow(1-p,3))*end));if(p<1)requestAnimationFrame(t);};requestAnimationFrame(t);}},{threshold:0.5});if(ref.current)obs.observe(ref.current);return()=>obs.disconnect();},[end]);
  return <span ref={ref}>{prefix}{n.toLocaleString()}{suffix}</span>;
}

/* ── TYPEWRITER ──────────────────────────────────────────────────────────── */
function TypeWriter({phrases,speed=70}){
  const [pi,setPi]=useState(0);const [txt,setTxt]=useState("");const [del,setDel]=useState(false);const [ci,setCi]=useState(0);
  useEffect(()=>{const w=phrases[pi%phrases.length];if(!del){if(ci<w.length){const t=setTimeout(()=>{setTxt(w.slice(0,ci+1));setCi(c=>c+1);},speed);return()=>clearTimeout(t);}else{const t=setTimeout(()=>setDel(true),2600);return()=>clearTimeout(t);}}else{if(ci>0){const t=setTimeout(()=>{setTxt(w.slice(0,ci-1));setCi(c=>c-1);},speed/2);return()=>clearTimeout(t);}else{setDel(false);setPi(p=>p+1);}}
  },[ci,del,pi,phrases,speed]);
  return <span style={{color:G}}>{txt}<span style={{animation:"blink 0.9s step-end infinite",color:G}}>|</span></span>;
}

/* ── SECTION DIVIDER ─────────────────────────────────────────────────────── */
function Divider({from,to}){
  return <div style={{height:80,background:"linear-gradient(180deg,"+from+","+to+")",margin:0,padding:0}}/>;
}

/* ── MAIN ────────────────────────────────────────────────────────────────── */
export default function LandingPage2(){
  const navigate=useNavigate();

  /* Intro state machine */
  const [litIdx,setLitIdx]=useState(-1);    // 0-5: which letter just lit
  const [holding,setHolding]=useState(false); // all letters visible, hold
  const [lifting,setLifting]=useState(false); // white curtain slides UP
  const [introDone,setIntroDone]=useState(false);
  const [navVis,setNavVis]=useState(false);
  const [heroVis,setHeroVis]=useState(false);

  /* Scroll */
  const [scrollY,setScrollY]=useState(0);
  const [navScrolled,setNavScrolled]=useState(false);

  const goApp=useCallback(()=>navigate(localStorage.getItem("token")?"/ai":"/register"),[navigate]);
  const goSearch=useCallback(()=>navigate(localStorage.getItem("token")?"/search":"/login"),[navigate]);

  /* ── INTRO SEQUENCE ─────────────────────────────────────────────────────── */
  useEffect(()=>{
    const ts=[];
    const T=(fn,ms)=>{const t=setTimeout(fn,ms);ts.push(t);};
    // Letters reveal A→L→V→R→Y→N staggered 160ms
    [0,1,2,3,4,5].forEach(i=>T(()=>setLitIdx(i), 800+i*160));
    // Hold
    T(()=>setHolding(true), 800+5*160+300);
    // Lift white curtain
    T(()=>{setLifting(true);setNavVis(true);}, 2400);
    // Hero content fades in
    T(()=>setHeroVis(true), 3800);
    T(()=>setIntroDone(true), 4400);
    return()=>ts.forEach(clearTimeout);
  },[]);

  /* ── SCROLL ─────────────────────────────────────────────────────────────── */
  useEffect(()=>{
    const fn=()=>{const sy=window.scrollY;setScrollY(sy);setNavScrolled(sy>80);};
    window.addEventListener("scroll",fn,{passive:true});
    return()=>window.removeEventListener("scroll",fn);
  },[]);

  const heroParallax=-scrollY*0.25;
  const letters="ALVRYN".split("");

  return(
    <>
      <style>{CSS}</style>

      {/* ═══ PARTICLES (on hero/dark sections only) ═══ */}
      {heroVis&&<Particles color={G} count={36}/>}

      {/* ═══════════════════════════════════════════════
          WHITE INTRO CURTAIN
          Slides UP like a curtain revealing world below
      ═══════════════════════════════════════════════ */}
      <div style={{
        position:"fixed",inset:0,zIndex:100,
        background:"#ffffff",
        transform:lifting?"translateY(-100%)":"translateY(0%)",
        transition:lifting?"transform 1.8s cubic-bezier(0.76,0,0.24,1)":"none",
        pointerEvents:introDone?"none":"all",
        display:"flex",alignItems:"center",justifyContent:"center",
        flexDirection:"column",gap:0,
      }}>
        {/* ALVRYN letter reveal — Sorellé style */}
        <div style={{
          fontFamily:"'Cormorant Garamond',serif",
          fontWeight:300,
          fontSize:"clamp(52px,9vw,120px)",
          letterSpacing:"0.4em",
          color:"#0a0a0a",
          display:"flex",
          paddingRight:"0.4em", // compensate for letter-spacing on last char
        }}>
          {letters.map((l,i)=>(
            <span key={i} style={{
              display:"inline-block",
              opacity:litIdx>=i?1:0,
              transform:litIdx>=i?"translateY(0)":"translateY(22px)",
              transition:"opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)",
            }}>{l}</span>
          ))}
        </div>
        {/* Subtle tagline under name */}
        <div style={{
          fontFamily:"'DM Sans',sans-serif",fontWeight:300,
          fontSize:"clamp(10px,1.2vw,13px)",
          color:"rgba(0,0,0,0.3)",letterSpacing:"0.32em",
          marginTop:18,
          opacity:holding?1:0,
          transition:"opacity 0.8s 0.2s ease",
        }}>TRAVEL BEYOND BOUNDARIES</div>
      </div>

      {/* ═══ NAVBAR ═══ */}
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:200,
        height:64,padding:"0 5%",
        display:"flex",alignItems:"center",justifyContent:"space-between",
        background:navScrolled?"rgba(8,5,4,0.92)":"transparent",
        backdropFilter:navScrolled?"blur(24px)":"none",
        borderBottom:navScrolled?"1px solid rgba(255,255,255,0.04)":"none",
        transition:"all 0.5s ease",
        opacity:navVis?1:0,
        transform:navVis?"translateY(0)":"translateY(-10px)",
        pointerEvents:navVis?"all":"none",
      }}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>
          <AlvrynMark size={26} glow/>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:300,fontSize:16,color:"#fff",letterSpacing:"0.22em"}}>ALVRYN</span>
        </div>
        <div className="hide-m" style={{display:"flex",gap:32}}>
          {[["About","#s-dream"],["ALVI","#s-alvi"],["Destinations","#s-dest"],["Plans","#s-plans"]].map(([l,h])=>(
            <a key={l} href={h} style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"rgba(255,255,255,0.45)",textDecoration:"none",letterSpacing:"0.03em",transition:"color 0.2s"}} onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.45)"}>{l}</a>
          ))}
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={goSearch} className="btn-outline" style={{padding:"8px 18px",fontSize:13}}>Sign In</button>
          <button onClick={goApp} className="btn-primary" style={{padding:"9px 20px",fontSize:13}}>Try ALVI Free</button>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════
          HERO — Atmospheric dark world, Dune-inspired
          Mirelle ghost brand name in background
      ═══════════════════════════════════════════════ */}
      <section style={{
        minHeight:"100vh",position:"relative",overflow:"hidden",
        display:"flex",flexDirection:"column",
        background:"linear-gradient(160deg,#0a0604 0%,#160a04 30%,#2d1408 60%,#8B3A0F 80%,#c9a84c44 100%)",
      }}>
        {/* Atmospheric glow */}
        <div style={{position:"absolute",left:"50%",top:"45%",transform:"translate(-50%,-50%)",width:"80%",height:"60%",background:"radial-gradient(ellipse,rgba(201,168,76,0.18) 0%,rgba(139,58,15,0.12) 40%,transparent 70%)",animation:"hPulse 7s ease-in-out infinite",pointerEvents:"none"}}/>
        {/* Clouds */}
        {[{w:640,h:200,t:"12%",l:"-10%",bl:60,op:0.05,a:"cd1",d:"92s"},{w:440,h:160,t:"22%",l:"60%",bl:45,op:0.07,a:"cd2",d:"76s"},{w:720,h:190,t:"32%",l:"5%",bl:62,op:0.04,a:"cd3",d:"118s"}].map((cl,i)=>(
          <div key={i} style={{position:"absolute",top:cl.t,left:cl.l,width:cl.w,height:cl.h,borderRadius:"50%",background:"rgba(255,255,255,0.88)",filter:"blur("+cl.bl+"px)",opacity:cl.op,animation:cl.a+" "+cl.d+" linear infinite"}}/>
        ))}
        {/* Ground perspective grid */}
        <div style={{position:"absolute",bottom:0,left:"-20%",right:"-20%",height:"35%",backgroundImage:"repeating-linear-gradient(0deg,rgba(201,168,76,0.05) 0px,rgba(201,168,76,0.05) 1px,transparent 1px,transparent 44px),repeating-linear-gradient(90deg,rgba(201,168,76,0.02) 0px,rgba(201,168,76,0.02) 1px,transparent 1px,transparent 110px)",transform:"perspective(640px) rotateX(68deg)",transformOrigin:"50% 100%",pointerEvents:"none",backgroundPositionY:(scrollY*0.3)+"px"}}/>
        {/* Mirelle-style ghost brand name */}
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%) translateY("+heroParallax*0.2+"px)",fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"clamp(80px,17vw,260px)",color:"rgba(255,255,255,0.04)",letterSpacing:"0.08em",whiteSpace:"nowrap",pointerEvents:"none",userSelect:"none",lineHeight:1}}>ALVRYN</div>

        {/* Hero content */}
        <div style={{
          position:"relative",zIndex:5,flex:1,
          display:"flex",flexDirection:"column",
          justifyContent:"center",
          padding:"120px 6% 80px",
          transform:"translateY("+heroParallax*0.15+"px)",
        }}>
          {/* Badge */}
          <div style={{opacity:heroVis?1:0,transform:heroVis?"translateY(0)":"translateY(20px)",transition:"opacity 0.8s 0.1s ease,transform 0.8s 0.1s ease"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"7px 18px",borderRadius:100,border:"1px solid rgba(201,168,76,0.3)",background:"rgba(201,168,76,0.07)",marginBottom:32}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:G,animation:"hPulse 2s infinite",display:"inline-block"}}/>
              <span style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:G,letterSpacing:"0.2em"}}>INTRODUCING ALVI — AI TRAVEL</span>
            </div>
          </div>

          {/* Main headline */}
          <div style={{opacity:heroVis?1:0,transform:heroVis?"translateY(0)":"translateY(28px)",transition:"opacity 0.9s 0.25s ease,transform 0.9s 0.25s ease",marginBottom:24,maxWidth:720}}>
            <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(48px,7.5vw,110px)",color:"#fff",lineHeight:0.95,letterSpacing:"-0.02em"}}>
              Turn dreams<br/><span className="g-text">into journeys.</span>
            </h1>
          </div>

          {/* Sub */}
          <div style={{opacity:heroVis?1:0,transform:heroVis?"translateY(0)":"translateY(22px)",transition:"opacity 0.9s 0.45s ease,transform 0.9s 0.45s ease",marginBottom:40}}>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"clamp(15px,1.8vw,19px)",color:"rgba(255,255,255,0.45)",lineHeight:1.7,maxWidth:500}}>
              <TypeWriter phrases={["Flights. Hotels. Itineraries. In one message.","Plan Goa for 6 friends in 30 seconds.","Any language. Any budget. Any dream.","India's most intelligent travel AI."]}/>
            </p>
          </div>

          {/* CTAs */}
          <div style={{opacity:heroVis?1:0,transform:heroVis?"translateY(0)":"translateY(18px)",transition:"opacity 0.9s 0.65s ease,transform 0.9s 0.65s ease",display:"flex",gap:14,flexWrap:"wrap",alignItems:"center",marginBottom:80}}>
            <button onClick={goApp} className="btn-primary" style={{fontSize:16,padding:"17px 44px"}}>Try ALVI Free</button>
            <button onClick={goSearch} className="btn-outline" style={{fontSize:16,padding:"16px 36px"}}>Explore Destinations</button>
          </div>

          {/* Stats */}
          <div style={{opacity:heroVis?1:0,transition:"opacity 0.9s 0.85s ease",display:"flex",gap:40,flexWrap:"wrap"}}>
            {[["500+","Destinations"],["60s","AI Response"],["₹0","To Start"]].map(([n,l])=>(
              <div key={l}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:32,color:G}}>{n}</div>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"rgba(255,255,255,0.35)",letterSpacing:"0.12em",marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* D R E A M spread at bottom — like Dune's DESERT */}
        <div style={{
          position:"relative",zIndex:5,
          display:"flex",justifyContent:"space-between",
          padding:"0 4% 2%",
          opacity:heroVis?1:0,transition:"opacity 1.2s 1s ease",
        }}>
          {"DREAM".split("").map((l,i)=>(
            <span key={l} style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(44px,7vw,110px)",color:"rgba(255,255,255,0.07)",lineHeight:1,letterSpacing:"0.02em"}}>{l}</span>
          ))}
        </div>

        {/* Scroll arrow */}
        <div style={{position:"absolute",bottom:"4%",left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:6,opacity:heroVis?0.35:0,transition:"opacity 1s 1.2s ease",zIndex:6,pointerEvents:"none"}}>
          <span style={{fontFamily:"'Space Mono',monospace",fontSize:8,letterSpacing:"0.3em",color:"rgba(255,255,255,0.35)"}}>SCROLL</span>
          <div style={{width:1,height:36,background:"linear-gradient("+G+",transparent)",animation:"floatY 2s ease-in-out infinite"}}/>
        </div>

        {/* Bottom gradient to next section */}
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:120,background:"linear-gradient(transparent,#0c0804)",pointerEvents:"none"}}/>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 2 — DREAM EDITORIAL
          Background: warm cream/off-white (Apple feel)
          Content: Dreams + Alvryn story
      ═══════════════════════════════════════════════ */}
      <Divider from="#0c0804" to="#f5f0eb"/>
      <section id="s-dream" style={{background:"#f5f0eb",padding:"120px 6%",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"clamp(80px,15vw,220px)",color:"rgba(0,0,0,0.025)",letterSpacing:"-0.04em",whiteSpace:"nowrap",pointerEvents:"none"}}>DREAM</div>
        <div style={{maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center"}} className="g2">
            <div>
              <Reveal>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:GD,letterSpacing:"0.22em",marginBottom:20}}>THE PHILOSOPHY</div>
                <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(36px,5vw,68px)",color:"#0a0a0a",lineHeight:1.05,marginBottom:28}}>
                  Most people never go<br/>beyond what they know.
                </h2>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:17,color:"rgba(0,0,0,0.5)",lineHeight:1.85,maxWidth:440,marginBottom:32}}>
                  Every great journey starts as an impossible idea. The world is full of people who say "one day." ALVI exists for the ones who say "this year."
                </p>
              </Reveal>
              <Reveal delay={150}>
                <div style={{display:"flex",flexDirection:"column",gap:16}}>
                  {[
                    {icon:"✦",t:"You imagine the trip",d:"Goa. Bali. Switzerland. The northern lights. Anywhere."},
                    {icon:"✦",t:"ALVI makes it real",d:"Flights, hotels, transfers, itinerary — in one message."},
                    {icon:"✦",t:"You live the dream",d:"No tab overload. No spreadsheets. Just the journey."},
                  ].map((f,i)=>(
                    <div key={i} style={{display:"flex",gap:16,padding:"18px 0",borderBottom:"1px solid rgba(0,0,0,0.07)"}}>
                      <span style={{color:G,fontSize:12,marginTop:4,flexShrink:0}}>{f.icon}</span>
                      <div>
                        <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:15,color:"#0a0a0a",marginBottom:4}}>{f.t}</div>
                        <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"rgba(0,0,0,0.45)",lineHeight:1.6}}>{f.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
            <Reveal direction="right" delay={100}>
              <div style={{position:"relative"}}>
                {/* Editorial quote block */}
                <div style={{background:"#0a0604",borderRadius:24,padding:"48px 40px",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:"-20px",left:"-20px",fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:120,color:"rgba(201,168,76,0.08)",lineHeight:1}}>"</div>
                  <div style={{position:"relative",zIndex:2}}>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(24px,3vw,36px)",color:"#fff",lineHeight:1.35,marginBottom:24,fontStyle:"italic"}}>
                      "The world is bigger than your comfort zone. You were made to explore it."
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div style={{width:32,height:1,background:G}}/>
                      <span style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"rgba(201,168,76,0.7)",letterSpacing:"0.15em"}}>THE ALVRYN PHILOSOPHY</span>
                    </div>
                  </div>
                </div>
                {/* Floating stat */}
                <div style={{position:"absolute",bottom:-20,right:-20,background:"#ffffff",borderRadius:16,padding:"20px 24px",boxShadow:"0 20px 60px rgba(0,0,0,0.12)",border:"1px solid rgba(0,0,0,0.06)"}}>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:36,color:GD}}><Counter end={50000} suffix="+"/></div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"rgba(0,0,0,0.4)",marginTop:2}}>Trips planned by ALVI</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 3 — ALVI DEMO
          Background: deep purple/Mirelle-dark
          Shows the actual AI conversation
      ═══════════════════════════════════════════════ */}
      <Divider from="#f5f0eb" to="#120820"/>
      <section id="s-alvi" style={{background:"#120820",padding:"120px 6%",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 30% 50%,rgba(100,60,180,0.2) 0%,transparent 60%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"clamp(80px,16vw,230px)",color:"rgba(255,255,255,0.015)",letterSpacing:"-0.04em",whiteSpace:"nowrap",pointerEvents:"none"}}>ALVI</div>
        <div style={{maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2}}>
          <Reveal style={{marginBottom:64,textAlign:"center"}}>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"rgba(180,140,255,0.8)",letterSpacing:"0.22em",marginBottom:16}}>THE INTELLIGENCE</div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(32px,5vw,66px)",color:"#fff",lineHeight:1.1}}>
              One message.<br/><span style={{color:"#b085ff"}}>Your entire journey planned.</span>
            </h2>
          </Reveal>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"flex-start"}} className="g2">
            {/* ALVI chat window */}
            <Reveal direction="left">
              <div style={{borderRadius:24,overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)",background:"rgba(0,0,0,0.45)",backdropFilter:"blur(20px)"}}>
                <div style={{background:"linear-gradient(135deg,rgba(100,60,180,0.3),rgba(201,168,76,0.1))",borderBottom:"1px solid rgba(255,255,255,0.05)",padding:"16px 20px",display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#6040b0,#c9a84c)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <AlvrynMark size={20} glow/>
                  </div>
                  <div>
                    <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:14,color:"#fff"}}>ALVI</div>
                    <div style={{fontSize:11,color:"#22c55e",display:"flex",alignItems:"center",gap:4}}><span style={{width:5,height:5,borderRadius:"50%",background:"#22c55e",display:"inline-block"}}/>Online</div>
                  </div>
                  <div style={{marginLeft:"auto",fontFamily:"'Space Mono',monospace",fontSize:9,color:"rgba(180,140,255,0.6)",letterSpacing:"0.1em"}}>by ALVRYN</div>
                </div>
                <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:12}}>
                  {[
                    {role:"user",text:"6 friends Bangalore to Goa in August. Budget 15k per person. Two vegetarians. One arrives a day late. Prefer beaches."},
                    {role:"ai",text:"Perfect! I will plan this for all 6 of you right now."},
                    {role:"ai",text:"Flights BLR to GOI: 3500-4500 per person return. For 6: 21000-27000 total. Book 4-6 weeks early."},
                    {role:"ai",text:"South Goa near Palolem and Agonda. 800-1800 per room. Veg restaurants specifically included.",card:true},
                  ].map((m,i)=>(
                    <Reveal key={i} delay={i*200}>
                      <div style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                        <div style={{maxWidth:"86%",padding:"12px 16px",borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",background:m.role==="user"?"linear-gradient(135deg,#6040b0,#c9a84c)":"rgba(255,255,255,0.06)",border:m.role==="ai"?"1px solid rgba(255,255,255,0.07)":"none",fontFamily:"'DM Sans',sans-serif",fontSize:13,lineHeight:1.65,color:m.role==="user"?"#ffffff":"rgba(255,255,255,0.82)",fontWeight:m.role==="user"?600:400}}>
                          {m.text}
                          {m.card&&<div style={{marginTop:10,padding:"10px",background:"rgba(201,168,76,0.1)",borderRadius:8,border:"1px solid rgba(201,168,76,0.25)"}}>
                            <div style={{fontSize:12,color:G,fontWeight:700,marginBottom:6}}>Total: 11500-14500 per person. Within budget.</div>
                            <button onClick={goSearch} style={{background:G,color:"#030303",border:"none",borderRadius:8,padding:"7px 14px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Book Flights</button>
                          </div>}
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
                <div style={{padding:"12px 16px",borderTop:"1px solid rgba(255,255,255,0.04)",display:"flex",gap:8}}>
                  <div style={{flex:1,background:"rgba(255,255,255,0.05)",borderRadius:100,padding:"10px 16px",fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"rgba(255,255,255,0.2)"}}>Ask ALVI anything...</div>
                  <button onClick={goApp} style={{width:40,height:40,borderRadius:"50%",background:"linear-gradient(135deg,#6040b0,#c9a84c)",border:"none",cursor:"pointer",fontSize:16,color:"#fff"}}>&#x2191;</button>
                </div>
              </div>
            </Reveal>
            <Reveal direction="right" delay={100}>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(24px,3vw,40px)",color:"#fff",lineHeight:1.2,marginBottom:32}}>
                Every constraint.<br/><span style={{color:"#b085ff"}}>Understood.</span>
              </h3>
              <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:40}}>
                {[
                  {icon:"👥",t:"Group size",d:"6 people — per person + total breakdown"},
                  {icon:"🥗",t:"Dietary needs",d:"2 vegetarians — restaurants specified"},
                  {icon:"🕐",t:"Schedule conflict",d:"Late arrival — separate plan created"},
                  {icon:"🏖️",t:"Preferences",d:"Beaches — South Goa chosen over North"},
                  {icon:"💰",t:"Budget constraint",d:"15k — confirmed fit at 11500-14500"},
                  {icon:"🛡️",t:"Safety",d:"Goa safety tips automatically included"},
                ].map((f,i)=>(
                  <div key={i} style={{display:"flex",gap:12,padding:"12px 14px",borderRadius:12,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.05)",transition:"all 0.3s ease"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(180,140,255,0.08)";e.currentTarget.style.borderColor="rgba(180,140,255,0.2)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.03)";e.currentTarget.style.borderColor="rgba(255,255,255,0.05)";}}>
                    <span style={{fontSize:18}}>{f.icon}</span>
                    <div>
                      <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13,color:"#fff"}}>{f.t}</div>
                      <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"rgba(255,255,255,0.35)",marginTop:2}}>{f.d}</div>
                    </div>
                    <div style={{marginLeft:"auto",alignSelf:"center"}}><div style={{width:5,height:5,borderRadius:"50%",background:"#b085ff"}}/></div>
                  </div>
                ))}
              </div>
              <button onClick={goApp} className="btn-primary" style={{fontSize:15}}>Try ALVI Free →</button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 4 — DESTINATIONS (editorial, dark atmospheric)
          NOT cards — editorial magazine style
      ═══════════════════════════════════════════════ */}
      <Divider from="#120820" to="#0a0604"/>
      <section id="s-dest" style={{background:"#0a0604",padding:"120px 6%",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 0%,rgba(201,168,76,0.08) 0%,transparent 55%)",pointerEvents:"none"}}/>
        <div style={{maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2}}>
          <Reveal style={{textAlign:"center",marginBottom:72}}>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:G,letterSpacing:"0.22em",marginBottom:16}}>THE DESTINATIONS</div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(32px,5vw,68px)",color:"#fff",lineHeight:1.1}}>
              The world is waiting.<br/><span className="g-text">Tell ALVI where.</span>
            </h2>
          </Reveal>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:14}}>
            {[{n:"Goa",t:"Beaches",b:"5k-15k",i:"photo-1512343879784-a960bf40e7f2"},{n:"Dubai",t:"Global",b:"35k-70k",i:"photo-1512453979798-5ea266f8880c"},{n:"Manali",t:"Hills",b:"8k-18k",i:"photo-1626621341517-bbf3d9990a23"},{n:"Singapore",t:"City",b:"40k-80k",i:"photo-1525625293386-3f8f99389edd"},{n:"Bali",t:"Tropical",b:"25k-55k",i:"photo-1537996194471-e657df975ab4"},{n:"Switzerland",t:"Alps",b:"80k-1.5L",i:"photo-1530122037265-a5f1f91d3b99"},{n:"Maldives",t:"Luxury",b:"40k-1L",i:"photo-1514282401047-d79a71a590e8"},{n:"Japan",t:"Culture",b:"60k-1.2L",i:"photo-1528360983277-13d401cdc186"},{n:"Kerala",t:"Nature",b:"10k-25k",i:"photo-1602216056096-3b40cc0c9944"},{n:"Ladakh",t:"Adventure",b:"18k-35k",i:"photo-1592555187028-51a64e5bba29"},{n:"Paris",t:"Romance",b:"80k-1.5L",i:"photo-1502602898657-3e91760cbb34"},{n:"Bangkok",t:"Culture",b:"20k-45k",i:"photo-1563492065599-3520f775eeed"}].map((d,i)=>(
              <Reveal key={d.n} delay={i*38}>
                <div onClick={()=>navigate(localStorage.getItem("token")?"/ai?dest="+d.n:"/register")}
                  className="lift" style={{borderRadius:18,overflow:"hidden",cursor:"pointer",position:"relative",aspectRatio:"2/3"}}>
                  <img src={"https://images.unsplash.com/"+d.i+"?auto=format&fit=crop&w=400&h=600&q=70"} alt={d.n} loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} onError={e=>e.target.style.display="none"}/>
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.9) 0%,rgba(0,0,0,0.2) 50%,rgba(0,0,0,0.05) 100%)"}}/>
                  <div style={{position:"absolute",top:10,right:10,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(8px)",borderRadius:100,padding:"3px 10px",fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"rgba(255,255,255,0.75)"}}>{d.t}</div>
                  <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"14px"}}>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:20,color:"#fff"}}>{d.n}</div>
                    <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:G,marginTop:3}}>{d.b}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal style={{textAlign:"center",marginTop:52}}>
            <button onClick={goApp} className="btn-outline" style={{margin:"0 auto"}}>Plan any destination with ALVI</button>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 5 — PLANS (off-white premium)
      ═══════════════════════════════════════════════ */}
      <Divider from="#0a0604" to="#f2eee8"/>
      <section id="s-plans" style={{background:"#f2eee8",padding:"120px 6%",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"clamp(70px,14vw,200px)",color:"rgba(0,0,0,0.025)",letterSpacing:"-0.04em",whiteSpace:"nowrap",pointerEvents:"none"}}>PLANS</div>
        <div style={{maxWidth:1000,margin:"0 auto",position:"relative",zIndex:2}}>
          <Reveal style={{textAlign:"center",marginBottom:64}}>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:GD,letterSpacing:"0.22em",marginBottom:16}}>CHOOSE YOUR PLAN</div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(32px,5vw,66px)",color:"#0a0a0a",lineHeight:1.1}}>
              Start free.<br/><span className="g-text">Upgrade when ready.</span>
            </h2>
          </Reveal>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}} className="g3">
            {[
              {name:"Explorer",badge:"FREE · LIVE",active:true,desc:"Everything to start your journey",color:"#0a0604",features:["20 AI responses per day","2 complete trip plans per month","Flights, buses, hotels","Safety insights auto-included","WhatsApp ALVI"],cta:"Start Free"},
              {name:"Navigator",badge:"PRO",active:false,desc:"For the serious traveller",color:"#120820",features:["Unlimited trip plans","Advanced AI planning","Budget optimizer","Multi-city planning","Priority responses","Save trip history"],cta:"Coming Soon"},
              {name:"Voyager",badge:"PREMIUM",active:false,desc:"The ultimate companion",color:"#0a0604",features:["Everything in Navigator","Group travel planner","Scam protection alerts","Women traveller mode","Emergency companion","Real-time weather planning"],cta:"Coming Soon"},
            ].map((p,i)=>(
              <Reveal key={p.name} delay={i*120}>
                <div style={{borderRadius:24,overflow:"hidden",height:"100%",position:"relative",background:p.active?"#0a0604":"rgba(0,0,0,0.04)",border:p.active?"none":"1px solid rgba(0,0,0,0.08)",boxShadow:p.active?"0 40px 100px rgba(10,6,4,0.25)":"none"}}>
                  {p.active&&<div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,"+GD+","+G+","+GL+")"}}/>}
                  <div style={{padding:"36px 28px"}}>
                    {p.active&&<div style={{display:"inline-block",background:G,color:"#030303",padding:"3px 14px",borderRadius:100,fontFamily:"'Space Mono',monospace",fontSize:9,fontWeight:700,letterSpacing:"0.08em",marginBottom:16,whiteSpace:"nowrap"}}>LIVE NOW</div>}
                    {!p.active&&<div style={{height:29,marginBottom:16}}/>}
                    <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:p.active?"rgba(201,168,76,0.7)":"rgba(0,0,0,0.35)",letterSpacing:"0.2em",marginBottom:8}}>{p.badge}</div>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:28,color:p.active?"#fff":"#0a0a0a",marginBottom:6}}>Alvryn {p.name}</div>
                    <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:p.active?"rgba(255,255,255,0.4)":"rgba(0,0,0,0.4)",marginBottom:28}}>{p.desc}</p>
                    <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:32}}>
                      {p.features.map(f=>(
                        <div key={f} style={{display:"flex",gap:10,alignItems:"center"}}>
                          <span style={{color:p.active?G:GD,fontSize:10,flexShrink:0}}>✦</span>
                          <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:p.active?"rgba(255,255,255,0.7)":"rgba(0,0,0,0.6)"}}>{f}</span>
                        </div>
                      ))}
                    </div>
                    {p.active?<button onClick={goApp} className="btn-primary" style={{width:"100%",justifyContent:"center"}}>{p.cta}</button>:<div style={{padding:"12px",borderRadius:12,border:"1px solid rgba(0,0,0,0.1)",textAlign:"center"}}><div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"rgba(0,0,0,0.3)",letterSpacing:"0.1em"}}>Coming soon</div></div>}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 6 — FINAL CTA (deep black + gold)
      ═══════════════════════════════════════════════ */}
      <Divider from="#f2eee8" to="#020202"/>
      <section style={{minHeight:"80vh",background:"#020202",display:"flex",alignItems:"center",justifyContent:"center",padding:"120px 6%",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 50%,rgba(201,168,76,0.1) 0%,transparent 60%)",pointerEvents:"none"}}/>
        <div style={{position:"relative",zIndex:2,textAlign:"center",maxWidth:760}}>
          <Reveal>
            <div style={{animation:"floatY 5s ease-in-out infinite",marginBottom:32,display:"inline-block"}}><AlvrynMark size={52} glow/></div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(44px,8vw,100px)",color:"#fff",lineHeight:0.95,letterSpacing:"-0.02em",marginBottom:24}}>
              Your next trip is<br/><span className="g-text">one message away.</span>
            </h2>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:18,color:"rgba(255,255,255,0.32)",lineHeight:1.7,maxWidth:440,margin:"0 auto 48px"}}>{"Try ALVI. India's most intelligent travel companion. Free forever."}</p>
            <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
              <button onClick={goApp} className="btn-primary" style={{fontSize:16,padding:"18px 52px"}}>Try ALVI Free</button>
              <button onClick={goSearch} className="btn-outline" style={{fontSize:16,padding:"17px 36px"}}>Search Destinations</button>
            </div>
            <div style={{marginTop:40,fontFamily:"'Space Mono',monospace",fontSize:9,color:"rgba(255,255,255,0.12)",letterSpacing:"0.22em"}}>NO CREDIT CARD · FREE FOREVER · TRUSTED BOOKING PARTNERS</div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:"#010101",borderTop:"1px solid rgba(255,255,255,0.04)",padding:"44px 6%"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:20}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <AlvrynMark size={24}/><span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:300,fontSize:14,color:"rgba(255,255,255,0.35)",letterSpacing:"0.18em"}}>ALVRYN</span>
          </div>
          <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"rgba(255,255,255,0.15)"}}>2026 Alvryn · Built in Bangalore · Travel Beyond Boundaries</div>
          <div style={{display:"flex",gap:20}}>{["About","Privacy","Terms","Contact"].map(l=><span key={l} style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"rgba(255,255,255,0.2)",cursor:"pointer",transition:"color 0.2s"}} onMouseEnter={e=>e.target.style.color="rgba(255,255,255,0.6)"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.2)"}>{l}</span>)}</div>
        </div>
      </footer>
    </>
  );
}
