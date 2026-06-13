/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState, useCallback, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";


const G = "#c9a84c";
const GD = "#8B6914";
const GL = "#f0d080";

const PALETTES = [
  { bg:"#030303", text:"#ffffff", accent:G },
  { bg:"#020d1a", text:"#e0f0ff", accent:"#38bdf8" },
  { bg:"#020f08", text:"#d0ffe8", accent:"#4ade80" },
  { bg:"#120800", text:"#ffe8cc", accent:"#fb923c" },
  { bg:"#f8f8f8", text:"#080808", accent:G },
  { bg:"#080808", text:"#ffffff", accent:G },
  { bg:"#050505", text:"#ffffff", accent:G },
  { bg:"#020202", text:"#ffffff", accent:G },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@200;300;400;600;700&family=DM+Sans:wght@200;300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:auto;overflow-x:hidden;}
body{font-family:'DM Sans',sans-serif;background:#030303;color:#fff;overflow-x:hidden;}
::-webkit-scrollbar{width:2px;}
::-webkit-scrollbar-thumb{background:#c9a84c;border-radius:1px;}
@keyframes a_blink{0%,100%{opacity:1;}50%{opacity:0;}}
@keyframes a_float{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
@keyframes a_pulse{0%,100%{opacity:0.5;transform:scale(1);}50%{opacity:1;transform:scale(1.08);}}
@keyframes a_shimmer{0%{background-position:200% center;}100%{background-position:-200% center;}}
@keyframes a_fadeUp{from{opacity:0;transform:translateY(40px);}to{opacity:1;transform:translateY(0);}}
@keyframes a_routeDraw{from{stroke-dashoffset:800;}to{stroke-dashoffset:0;}}
@keyframes a_ping{0%{transform:scale(1);opacity:1;}100%{transform:scale(2.5);opacity:0;}}
@keyframes a_cardFloat{0%,100%{transform:translateY(0px);}50%{transform:translateY(-12px);}}
@keyframes a_reveal{from{clip-path:inset(0 100% 0 0);}to{clip-path:inset(0 0% 0 0);}}
.lp3-gold{background:linear-gradient(135deg,#8B6914,#c9a84c,#f0d080,#c9a84c);background-size:300% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:a_shimmer 5s linear infinite;}
.lp3-btn-gold{display:inline-flex;align-items:center;gap:10px;padding:16px 40px;border-radius:100px;background:linear-gradient(135deg,#8B6914,#c9a84c,#f0d080);background-size:200% auto;color:#030303;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;border:none;cursor:pointer;transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);position:relative;overflow:hidden;}
.lp3-btn-gold:hover{transform:translateY(-4px) scale(1.03);box-shadow:0 20px 50px rgba(201,168,76,0.5);}
.lp3-btn-ghost{display:inline-flex;align-items:center;gap:10px;padding:15px 36px;border-radius:100px;background:rgba(255,255,255,0.04);color:rgba(255,255,255,0.75);font-family:'DM Sans',sans-serif;font-size:15px;font-weight:400;border:1px solid rgba(255,255,255,0.12);cursor:pointer;backdrop-filter:blur(12px);transition:all 0.3s ease;}
.lp3-btn-ghost:hover{background:rgba(255,255,255,0.1);color:#fff;border-color:rgba(255,255,255,0.3);transform:translateY(-2px);}
.lp3-glass{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);backdrop-filter:blur(24px);border-radius:20px;}
.lp3-card-hover{transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);}
.lp3-card-hover:hover{transform:translateY(-8px);border-color:rgba(201,168,76,0.3)!important;box-shadow:0 30px 80px rgba(0,0,0,0.5);}
@media(max-width:768px){.lp3-hide-mobile{display:none!important;}.lp3-grid-2{grid-template-columns:1fr!important;}.lp3-grid-3{grid-template-columns:1fr!important;}}
`;

// AlvrynMark — premium compass icon
function AlvrynMark({ size=40, glow=false }) {
  const id = "am" + size;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none"
      style={glow ? { filter:"drop-shadow(0 0 8px #c9a84c88)" } : {}}>
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B6914"/>
          <stop offset="40%" stopColor="#c9a84c"/>
          <stop offset="100%" stopColor="#f0d080"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" stroke={"url(#"+id+")"} strokeWidth="0.8" fill="none" opacity="0.5"/>
      <circle cx="50" cy="50" r="38" stroke={"url(#"+id+")"} strokeWidth="0.4" fill="none" opacity="0.25"/>
      <path d="M50 8 L44 50 L50 46 L56 50 Z" fill={"url(#"+id+")"}/>
      <path d="M50 92 L44 50 L50 54 L56 50 Z" fill={"url(#"+id+")"} opacity="0.45"/>
      <path d="M92 50 L50 44 L54 50 L50 56 Z" fill={"url(#"+id+")"} opacity="0.3"/>
      <path d="M8 50 L50 44 L46 50 L50 56 Z" fill={"url(#"+id+")"} opacity="0.3"/>
      <circle cx="50" cy="50" r="4.5" fill={"url(#"+id+")"}/>
      <circle cx="50" cy="50" r="2" fill="#fff" opacity="0.9"/>
    </svg>
  );
}

// Particles
function Particles() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const pts = Array.from({length:50}, () => ({
      x: Math.random()*W, y: Math.random()*H,
      vx:(Math.random()-0.5)*0.3, vy:-(0.2+Math.random()*0.4),
      r: Math.random()*1.5+0.3, alpha: Math.random()*0.2+0.05,
    }));
    const mouse = {x:-1000,y:-1000};
    const onM = e => { mouse.x=e.clientX; mouse.y=e.clientY; };
    const onR = () => { W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; };
    window.addEventListener("mousemove",onM,{passive:true});
    window.addEventListener("resize",onR);
    let raf;
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      pts.forEach(p => {
        const dx=mouse.x-p.x, dy=mouse.y-p.y, d=Math.hypot(dx,dy);
        if(d<120){p.vx+=dx/d*0.015; p.vy+=dy/d*0.015;}
        p.vx*=0.99; p.vy*=0.99;
        p.x+=p.vx; p.y+=p.vy;
        if(p.y<-10){p.y=H+10;p.x=Math.random()*W;}
        if(p.x<0)p.x=W; if(p.x>W)p.x=0;
        ctx.save(); ctx.globalAlpha=p.alpha; ctx.fillStyle=G;
        ctx.shadowBlur=4; ctx.shadowColor=G;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); ctx.restore();
      });
      raf=requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove",onM); window.removeEventListener("resize",onR); };
  }, []);
  return <canvas ref={ref} style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}}/>;
}

// Earth
function EarthMesh() {
  const meshRef = useRef(null);
  const cloudsRef = useRef(null);
  const [day, clouds] = useLoader(THREE.TextureLoader, [
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg",
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png",
  ]);
  useFrame((_,delta) => {
    if(meshRef.current) meshRef.current.rotation.y += delta*0.04;
    if(cloudsRef.current) { cloudsRef.current.rotation.y+=delta*0.045; cloudsRef.current.rotation.x+=delta*0.005; }
  });
  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.2,64,64]}/>
        <meshPhongMaterial map={day} specular={new THREE.Color(0x333333)} shininess={15}/>
      </mesh>
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.25,64,64]}/>
        <meshPhongMaterial map={clouds} transparent opacity={0.35} depthWrite={false}/>
      </mesh>
      <mesh>
        <sphereGeometry args={[2.4,64,64]}/>
        <meshBasicMaterial color={new THREE.Color(0x1a6b9a)} transparent opacity={0.08} side={THREE.BackSide}/>
      </mesh>
    </group>
  );
}

function EarthScene() {
  return (
    <Canvas style={{position:"absolute",inset:0,zIndex:1}} camera={{position:[0,0,6],fov:45}} gl={{antialias:true,alpha:true}}>
      <ambientLight intensity={0.3}/>
      <directionalLight position={[5,3,5]} intensity={1.2} color="#fff8e7"/>
      <directionalLight position={[-5,-2,-3]} intensity={0.1} color="#1a4a8a"/>
      <Suspense fallback={null}><EarthMesh/></Suspense>
      <Stars radius={100} depth={50} count={3000} factor={3} fade speed={0.3}/>
    </Canvas>
  );
}

// Scroll Reveal
function Reveal({children, delay=0, direction="up", style}) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting) setVis(true); },{threshold:0.1});
    if(ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  },[]);
  const T = {up:"translateY(60px)",down:"translateY(-60px)",left:"translateX(-80px)",right:"translateX(80px)"};
  return (
    <div ref={ref} style={{opacity:vis?1:0,transform:vis?"none":(T[direction]||"translateY(60px)"),transition:`opacity 1s ${delay}ms cubic-bezier(0.22,1,0.36,1),transform 1.1s ${delay}ms cubic-bezier(0.22,1,0.36,1)`,...style}}>
      {children}
    </div>
  );
}

// Counter
function Counter({end, suffix=""}) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if(e.isIntersecting&&!done.current){
        done.current=true;
        const s=Date.now();
        const tick=()=>{const p=Math.min((Date.now()-s)/2200,1);setN(Math.round((1-Math.pow(1-p,3))*end));if(p<1)requestAnimationFrame(tick);};
        requestAnimationFrame(tick);
      }
    },{threshold:0.4});
    if(ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  },[end]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

// TypeWriter
function TypeWriter({phrases, speed=65, pause=2200}) {
  const [pi,setPi]=useState(0); const [txt,setTxt]=useState(""); const [del,setDel]=useState(false); const [ci,setCi]=useState(0);
  useEffect(()=>{
    const w=phrases[pi%phrases.length];
    if(!del){if(ci<w.length){const t=setTimeout(()=>{setTxt(w.slice(0,ci+1));setCi(c=>c+1);},speed);return()=>clearTimeout(t);}else{const t=setTimeout(()=>setDel(true),pause);return()=>clearTimeout(t);}}
    else{if(ci>0){const t=setTimeout(()=>{setTxt(w.slice(0,ci-1));setCi(c=>c-1);},speed/2);return()=>clearTimeout(t);}else{setDel(false);setPi(p=>p+1);}}
  },[ci,del,pi,phrases,speed,pause]);
  return <span style={{color:G}}>{txt}<span style={{animation:"a_blink 0.9s step-end infinite",color:G}}>|</span></span>;
}

// Destination Cards floating
function DestCards({visible}) {
  const cards=[
    {emoji:"🏔️",name:"Switzerland",tag:"Alps",delay:"0s",x:"8%",y:"25%"},
    {emoji:"🌸",name:"Japan",tag:"Culture",delay:"0.3s",x:"78%",y:"20%"},
    {emoji:"🏝️",name:"Maldives",tag:"Luxury",delay:"0.6s",x:"5%",y:"65%"},
    {emoji:"🌺",name:"Bali",tag:"Tropical",delay:"0.9s",x:"80%",y:"62%"},
    {emoji:"🗼",name:"Paris",tag:"Romance",delay:"1.2s",x:"42%",y:"14%"},
  ];
  if(!visible) return null;
  return (
    <>
      {cards.map((c,i)=>(
        <div key={i} style={{position:"absolute",left:c.x,top:c.y,zIndex:3,background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:16,padding:"12px 18px",display:"flex",alignItems:"center",gap:10,animation:`a_cardFloat ${3+i*0.5}s ease-in-out ${c.delay} infinite`,opacity:1,transition:`opacity 0.8s ease ${c.delay}`}}>
          <span style={{fontSize:20}}>{c.emoji}</span>
          <div>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:700,color:"#fff"}}>{c.name}</div>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:G,letterSpacing:"0.1em"}}>{c.tag}</div>
          </div>
        </div>
      ))}
    </>
  );
}

export default function LandingPage2() {
  const navigate = useNavigate();
  const [introPhase, setIntroPhase] = useState(0);
  const [loadProgress, setLoadProgress] = useState(0);
  const [litLetters, setLitLetters] = useState(-1);
  const [earthVisible, setEarthVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);
  const [currentPalette, setCurrentPalette] = useState(0);
  const titleRef = useRef(null);

  const goApp = useCallback(()=>navigate(localStorage.getItem("token")?"/ai":"/register"),[navigate]);
  const goSearch = useCallback(()=>navigate(localStorage.getItem("token")?"/search":"/login"),[navigate]);

  // Intro sequence
  useEffect(()=>{
    let timers=[];
    const T=(fn,ms)=>{const t=setTimeout(fn,ms);timers.push(t);};
    let start=null;
    const animLoad=(ts)=>{
      if(!start)start=ts;
      const p=Math.min((ts-start)/2000,1);
      setLoadProgress(Math.round(p*100));
      if(p<1){requestAnimationFrame(animLoad);}
      else{
        T(()=>setIntroPhase(1),200);
        T(()=>{
          setIntroPhase(2);
          let idx=0;
          const iv=setInterval(()=>{setLitLetters(idx++);if(idx>6)clearInterval(iv);},140);
        },1400);
        T(()=>setIntroPhase(3),3200);
        T(()=>{setIntroPhase(4);setEarthVisible(true);},4200);
        T(()=>setCardsVisible(true),5800);
        T(()=>{
          setIntroPhase(6);
          if(titleRef.current){
            if (titleRef.current) {
  titleRef.current.style.transform = "translateY(-42vh) scale(0.28)";
  titleRef.current.style.opacity = "0";
  titleRef.current.style.transition = "all 1.4s cubic-bezier(0.76,0,0.24,1)";
}
          }
        },7200);
        T(()=>setIntroPhase(7),8600);
      }
    };
    requestAnimationFrame(animLoad);
    return()=>timers.forEach(clearTimeout);
  },[]);

  // Scroll
  useEffect(()=>{
    if(introPhase<7)return;
    const fn=()=>{
      const sy=window.scrollY;
      setScrollY(sy);
      setNavScrolled(sy>60);
      setCurrentPalette(Math.min(Math.floor(sy/window.innerHeight),PALETTES.length-1));
    };
    window.addEventListener("scroll",fn,{passive:true});
    return()=>window.removeEventListener("scroll",fn);
  },[introPhase]);

  const pal = PALETTES[currentPalette];
  const heroOpacity = Math.max(0,1-scrollY/700);
  const name = "ALVRYN";

  return (
    <>
      <style>{CSS}</style>
      <Particles/>

      {/* Loading */}
      {introPhase===0&&(
        <div style={{position:"fixed",inset:0,zIndex:9999,background:"#030303",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <div style={{position:"absolute",inset:0,opacity:0.025,backgroundImage:"linear-gradient(rgba(201,168,76,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.8) 1px,transparent 1px)",backgroundSize:"80px 80px"}}/>
          <AlvrynMark size={52} glow/>
          <div style={{marginTop:32,width:"min(240px,50vw)"}}>
            <div style={{height:1,background:"rgba(255,255,255,0.06)",borderRadius:1,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${loadProgress}%`,background:`linear-gradient(90deg,${GD},${G},${GL})`,transition:"width 0.08s linear",boxShadow:`0 0 8px ${G}88`}}/>
            </div>
          </div>
          <div style={{marginTop:20,fontFamily:"'Space Mono',monospace",fontSize:8,color:"rgba(255,255,255,0.15)",letterSpacing:"0.35em"}}>TRAVEL BEYOND BOUNDARIES</div>
        </div>
      )}

      {/* Intro overlay */}
      <div style={{position:"fixed",inset:0,zIndex:introPhase>=7?-1:50,background:"#030303",opacity:introPhase>=7?0:1,transition:"opacity 1.2s ease",pointerEvents:introPhase>=7?"none":"all",overflow:"hidden"}}>
        {earthVisible&&<EarthScene/>}
        <DestCards visible={cardsVisible}/>

        {/* Eyebrow */}
        <div style={{position:"absolute",top:"34%",left:0,right:0,textAlign:"center",zIndex:20,opacity:introPhase>=1&&introPhase<2?1:0,transition:"opacity 0.8s ease"}}>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:"rgba(255,255,255,0.4)",letterSpacing:"0.25em"}}>AI-POWERED TRAVEL PLANNING</div>
        </div>

        {/* ALVRYN letters */}
        <div ref={titleRef} style={{position:"absolute",top:"36%",left:0,right:0,textAlign:"center",zIndex:20,opacity:introPhase>=2?1:0,transition:"opacity 0.8s ease",transformOrigin:"top center"}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(52px,10vw,130px)",letterSpacing:"0.22em",display:"flex",justifyContent:"center",gap:"0.05em"}}>
            {name.split("").map((ch,i)=>(
              <span key={i} style={{display:"inline-block",backgroundImage:i<=litLetters?`linear-gradient(135deg,${GD},${G},${GL})`:"none",WebkitBackgroundClip:i<=litLetters?"text":"unset",backgroundClip:i<=litLetters?"text":"unset",WebkitTextFillColor:i<=litLetters?"transparent":"rgba(255,255,255,0.08)",color:i<=litLetters?"transparent":"rgba(255,255,255,0.08)",transition:"all 0.35s cubic-bezier(0.34,1.56,0.64,1)"}}>
                {ch}
              </span>
            ))}
          </div>
          <div style={{height:1,margin:"8px auto 0",width:introPhase>=3?"min(200px,30vw)":"0px",background:`linear-gradient(90deg,transparent,${G},transparent)`,transition:"width 1s ease"}}/>
          <div style={{marginTop:20,fontFamily:"'DM Sans',sans-serif",fontWeight:200,fontSize:"clamp(13px,1.8vw,18px)",color:"rgba(255,255,255,0.4)",letterSpacing:"0.12em",opacity:introPhase>=3?1:0,transform:introPhase>=3?"translateY(0)":"translateY(16px)",transition:"all 0.9s 0.2s ease"}}>
            Plan Less. Experience More.
          </div>
        </div>

        {/* Dream phrases */}
        {introPhase===4&&(
          <div style={{position:"absolute",top:"58%",left:0,right:0,textAlign:"center",zIndex:21}}>
            {["See The Northern Lights","Walk Through Paris","Discover Hidden Islands","Experience Japan"].map((phrase,i)=>(
              <div key={phrase} style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:300,fontSize:"clamp(16px,2.5vw,24px)",color:"rgba(255,255,255,0.55)",position:"absolute",left:0,right:0,animation:`a_fadeUp 0.8s ease ${i*0.8}s both`}}>{phrase}</div>
            ))}
          </div>
        )}

        <div style={{position:"absolute",bottom:0,left:0,right:0,height:"30%",background:"linear-gradient(transparent,#030303)",pointerEvents:"none",zIndex:5}}/>
      </div>

      {/* Main content */}
      <div style={{opacity:introPhase>=7?1:0,transition:"opacity 1s ease",background:pal.bg,minHeight:"100vh"}}>

        {/* Navbar */}
        <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,height:64,padding:"0 5%",display:"flex",alignItems:"center",justifyContent:"space-between",background:navScrolled?"rgba(3,3,3,0.88)":"transparent",backdropFilter:navScrolled?"blur(24px)":"none",borderBottom:navScrolled?"1px solid rgba(255,255,255,0.04)":"none",transition:"all 0.5s ease"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer",animation:"a_float 5s ease-in-out infinite"}} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>
            <AlvrynMark size={34} glow/>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:300,fontSize:17,color:"#fff",letterSpacing:"0.2em"}}>ALVRYN</div>
          </div>
          <div className="lp3-hide-mobile" style={{display:"flex",gap:36}}>
            {[["Experience","#s2"],["Destinations","#s5"],["Plans","#s6"]].map(([l,h])=>(
              <a key={l} href={h} style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"rgba(255,255,255,0.4)",textDecoration:"none",transition:"color 0.2s"}} onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.4)"}>{l}</a>
            ))}
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={goSearch} className="lp3-btn-ghost" style={{padding:"8px 20px",fontSize:13}}>Sign In</button>
            <button onClick={goApp} className="lp3-btn-gold" style={{padding:"9px 22px",fontSize:13}}>Start Planning</button>
          </div>
        </nav>

        {/* SECTION 1 — Hero */}
        <section style={{minHeight:"100vh",position:"relative",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",background:PALETTES[0].bg}}>
          <EarthScene/>
          <DestCards visible={introPhase>=7}/>
          <div style={{position:"relative",zIndex:5,textAlign:"center",padding:"0 5%",maxWidth:900,opacity:heroOpacity}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"8px 20px",borderRadius:100,border:`1px solid ${G}22`,background:`${G}08`,marginBottom:40,fontFamily:"'Space Mono',monospace",fontSize:10,color:G,letterSpacing:"0.22em",opacity:introPhase>=7?1:0,transition:"opacity 0.8s 0.3s ease"}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:G,animation:"a_pulse 2s infinite"}}/>
              {"INDIA'S MOST INTELLIGENT TRAVEL AI"}
            </div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(44px,7vw,100px)",lineHeight:0.95,letterSpacing:"-0.02em",marginBottom:24,opacity:introPhase>=7?1:0,transition:"opacity 0.8s 0.5s ease"}}>
              <div style={{color:"#fff"}}>Turn Dreams</div>
              <div className="lp3-gold">Into Journeys.</div>
            </div>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:"clamp(15px,2vw,19px)",color:"rgba(255,255,255,0.45)",lineHeight:1.7,maxWidth:560,margin:"0 auto 48px",opacity:introPhase>=7?1:0,transition:"opacity 0.8s 0.8s ease"}}>
              {"Flights, hotels, transfers and itineraries — planned in seconds. "}
              <TypeWriter phrases={["In plain English.","In Hindi or Tamil.","In any language.","Like texting a friend."]}/>
            </div>
            <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",opacity:introPhase>=7?1:0,transition:"opacity 0.8s 1.1s ease"}}>
              <button onClick={goApp} className="lp3-btn-gold" style={{fontSize:16,padding:"17px 44px"}}>Start Planning</button>
              <button onClick={goSearch} className="lp3-btn-ghost" style={{fontSize:16,padding:"16px 36px"}}>Explore Destinations</button>
            </div>
          </div>
          <div style={{position:"absolute",bottom:0,left:0,right:0,height:"30%",background:`linear-gradient(transparent,${PALETTES[0].bg})`,zIndex:4,pointerEvents:"none"}}/>
          <div style={{position:"absolute",bottom:40,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:8,animation:"a_float 2.5s ease-in-out infinite",zIndex:6,opacity:introPhase>=7?0.4:0,transition:"opacity 1s 1.5s ease"}}>
            <span style={{fontFamily:"'Space Mono',monospace",fontSize:8,letterSpacing:"0.3em",color:"rgba(255,255,255,0.35)"}}>SCROLL</span>
            <div style={{width:1,height:40,background:`linear-gradient(${G},transparent)`}}/>
          </div>
        </section>

        {/* SECTION 2 — Globe Stats */}
        <section id="s2" style={{minHeight:"100vh",background:PALETTES[1].bg,padding:"120px 5%",position:"relative",overflow:"hidden",transition:"background 1.5s ease"}}>
          <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 70% 50%,rgba(56,189,248,0.06) 0%,transparent 60%)"}}/>
          <div style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center"}} className="lp3-grid-2">
            <div>
              <Reveal>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:PALETTES[1].accent,letterSpacing:"0.22em",marginBottom:20}}>GLOBAL REACH</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(36px,5vw,68px)",color:"#fff",lineHeight:1.05,marginBottom:24}}>
                  Any destination.<br/><span style={{color:PALETTES[1].accent}}>One conversation.</span>
                </div>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:16,color:"rgba(255,255,255,0.4)",lineHeight:1.8,maxWidth:400,marginBottom:48}}>
                  From Electronic City to the Swiss Alps — flights, hotel, transfers and itinerary. All in one message.
                </p>
              </Reveal>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                {[{n:500,s:"+",label:"Destinations",bar:75},{n:60,s:"s",label:"AI Response",bar:60},{n:300,s:"+",label:"Bus Routes",bar:85},{n:50,s:"+",label:"Countries",bar:65}].map((stat,i)=>(
                  <Reveal key={i} delay={i*100}>
                    <div className="lp3-glass lp3-card-hover" style={{padding:"22px 24px",border:"1px solid rgba(56,189,248,0.1)"}}>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:38,color:PALETTES[1].accent,lineHeight:1}}><Counter end={stat.n} suffix={stat.s}/></div>
                      <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"rgba(255,255,255,0.5)",marginTop:6}}>{stat.label}</div>
                      <div style={{marginTop:12,height:2,background:"rgba(255,255,255,0.05)",borderRadius:1,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${stat.bar}%`,background:`linear-gradient(90deg,rgba(56,189,248,0.3),${PALETTES[1].accent})`,transition:"width 1.5s 0.5s ease"}}/>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
            <Reveal delay={200} direction="right">
              <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"center",animation:"a_float 8s ease-in-out infinite"}}>
                <svg viewBox="0 0 400 400" style={{width:"min(100%,380px)",height:"min(100%,380px)"}}>
                  <defs><radialGradient id="gGrad" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor={PALETTES[1].accent} stopOpacity="0.15"/><stop offset="100%" stopColor={PALETTES[1].accent} stopOpacity="0"/></radialGradient></defs>
                  <circle cx="200" cy="200" r="160" stroke={PALETTES[1].accent} strokeWidth="0.5" fill="url(#gGrad)" opacity="0.4"/>
                  {[-60,-30,0,30,60].map(lat=>{const r=160*Math.cos(lat*Math.PI/180);const y=200+160*Math.sin(lat*Math.PI/180);return <ellipse key={lat} cx="200" cy={y} rx={r} ry={r*0.15} stroke={PALETTES[1].accent} strokeWidth="0.4" fill="none" opacity="0.2"/>;})}
                  {[[200+30,200+20],[200+80,200-15],[200-60,200-30],[200+110,200-25],[200-20,200+10]].map(([cx,cy],i)=>(
                    <g key={i}>
                      <circle cx={cx} cy={cy} r="4" fill={PALETTES[1].accent} opacity="0.9"/>
                      <circle cx={cx} cy={cy} r="8" stroke={PALETTES[1].accent} strokeWidth="1" fill="none" opacity="0.4" style={{animation:`a_ping 2s ease-out ${i*0.4}s infinite`}}/>
                    </g>
                  ))}
                  <path d="M230 220 Q 280 160 280 185" stroke={G} strokeWidth="1.2" fill="none" opacity="0.6" style={{strokeDasharray:200,strokeDashoffset:200,animation:"a_routeDraw 2s ease 0.5s forwards"}}/>
                  <path d="M280 185 Q 230 130 140 170" stroke={G} strokeWidth="1.2" fill="none" opacity="0.5" style={{strokeDasharray:200,strokeDashoffset:200,animation:"a_routeDraw 2s ease 1s forwards"}}/>
                </svg>
              </div>
            </Reveal>
          </div>
        </section>

        {/* SECTION 3 — How it works */}
        <section style={{padding:"120px 5%",background:PALETTES[2].bg,position:"relative",overflow:"hidden",transition:"background 1.5s ease"}}>
          <div style={{maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2}}>
            <Reveal style={{textAlign:"center",marginBottom:80}}>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:PALETTES[2].accent,letterSpacing:"0.22em",marginBottom:20}}>THE EXPERIENCE</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(36px,5vw,68px)",color:"#fff",lineHeight:1.1}}>
                Not just search.<br/><span style={{color:PALETTES[2].accent}}>A travel companion.</span>
              </div>
            </Reveal>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24}} className="lp3-grid-3">
              {[
                {n:"01",icon:"💬",title:"Tell Alvryn anything",desc:"Any language, any complexity. Group trips, dietary needs, late arrivals — every detail understood.",accent:PALETTES[2].accent},
                {n:"02",icon:"🧠",title:"AI builds the complete plan",desc:"Flights, hotel, transfers, itinerary, budget breakdown. Every constraint addressed.",accent:"#38bdf8"},
                {n:"03",icon:"✈️",title:"Book in one click",desc:"Pre-filled links to trusted partners. No extra cost. Official booking from the source.",accent:G},
              ].map((s,i)=>(
                <Reveal key={i} delay={i*120}>
                  <div className="lp3-glass lp3-card-hover" style={{padding:"40px 32px",height:"100%",border:"1px solid rgba(255,255,255,0.06)"}}>
                    <div style={{fontSize:36,marginBottom:20}}>{s.icon}</div>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:48,color:s.accent,lineHeight:1,marginBottom:16,opacity:0.8}}>{s.n}</div>
                    <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:18,color:"#fff",marginBottom:12}}>{s.title}</div>
                    <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"rgba(255,255,255,0.35)",lineHeight:1.75}}>{s.desc}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4 — AI Demo */}
        <section style={{minHeight:"100vh",padding:"120px 5%",background:PALETTES[3].bg,position:"relative",overflow:"hidden",transition:"background 1.5s ease"}}>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"clamp(100px,18vw,280px)",color:"rgba(255,255,255,0.02)",letterSpacing:"-0.04em",whiteSpace:"nowrap",pointerEvents:"none",userSelect:"none"}}>PLAN</div>
          <div style={{maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2}}>
            <Reveal style={{marginBottom:64}}>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:PALETTES[3].accent,letterSpacing:"0.22em",marginBottom:20}}>WATCH IT WORK</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(36px,5vw,68px)",color:"#fff",lineHeight:1.1}}>
                A real trip.<br/><span style={{color:PALETTES[3].accent}}>Planned in seconds.</span>
              </div>
            </Reveal>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"flex-start"}} className="lp3-grid-2">
              <Reveal direction="left">
                <div style={{borderRadius:24,overflow:"hidden",border:"1px solid rgba(255,255,255,0.05)",background:"rgba(0,0,0,0.4)",backdropFilter:"blur(20px)"}}>
                  <div style={{background:`linear-gradient(135deg,${GD}18,${G}0A)`,borderBottom:"1px solid rgba(255,255,255,0.04)",padding:"16px 20px",display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${GD},${G})`,display:"flex",alignItems:"center",justifyContent:"center"}}><AlvrynMark size={22}/></div>
                    <div>
                      <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:14,color:"#fff"}}>Alvryn AI</div>
                      <div style={{fontSize:11,color:"#22c55e",display:"flex",alignItems:"center",gap:5}}><span style={{width:5,height:5,borderRadius:"50%",background:"#22c55e",display:"inline-block"}}/>Online</div>
                    </div>
                  </div>
                  <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:12,minHeight:420}}>
                    {[
                      {role:"user",text:"6 friends from Bangalore to Goa in August. Budget 15k per person. Two vegetarians. One arrives a day late. Prefer beaches."},
                      {role:"ai",text:"Got it! Let me plan this for all 6 of you"},
                      {role:"ai",text:"Flights BLR to GOI: 3,500 to 4,500 per person return. For 6 = 21,000 to 27,000 total. Book 4-6 weeks early for best fares!"},
                      {role:"ai",text:"South Goa hotels near Palolem and Agonda. Budget: 800-1800 per room per night. 2-3 rooms for 6 people."},
                      {role:"ai",text:"Veg options: Cafe Chocolatti and La Pizzeria Agonda. Late arrival: separate ticket + 400-600 cab from airport.",card:true},
                    ].map((m,i)=>(
                      <Reveal key={i} delay={i*200}>
                        <div style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                          <div style={{maxWidth:"86%",padding:"12px 16px",borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",background:m.role==="user"?`linear-gradient(135deg,${GD},${G})`:"rgba(255,255,255,0.05)",border:m.role==="ai"?"1px solid rgba(255,255,255,0.07)":"none",fontFamily:"'DM Sans',sans-serif",fontSize:13,lineHeight:1.65,color:m.role==="user"?"#030303":"rgba(255,255,255,0.8)",fontWeight:m.role==="user"?600:400}}>
                            {m.text}
                            {m.card&&(
                              <div style={{marginTop:12,padding:"12px",background:`${G}11`,borderRadius:10,border:`1px solid ${G}22`}}>
                                <div style={{fontSize:12,color:G,fontWeight:700,marginBottom:8}}>Total: 11,500 to 14,500 per person — within budget!</div>
                                <button onClick={goSearch} style={{background:G,color:"#030303",border:"none",borderRadius:8,padding:"8px 16px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Book Flights</button>
                              </div>
                            )}
                          </div>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                  <div style={{padding:"12px 16px",borderTop:"1px solid rgba(255,255,255,0.04)",display:"flex",gap:10}}>
                    <div style={{flex:1,background:"rgba(255,255,255,0.04)",borderRadius:100,padding:"10px 16px",fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"rgba(255,255,255,0.2)"}}>Ask me anything...</div>
                    <button onClick={goApp} style={{width:40,height:40,borderRadius:"50%",background:`linear-gradient(135deg,${GD},${G})`,border:"none",cursor:"pointer",fontSize:16,color:"#030303"}}>&#x2191;</button>
                  </div>
                </div>
              </Reveal>
              <Reveal direction="right" delay={100}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(24px,3vw,40px)",color:"#fff",lineHeight:1.2,marginBottom:32}}>Every constraint.<br/><span style={{color:PALETTES[3].accent}}>Addressed.</span></div>
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  {[
                    {icon:"👥",label:"Group of 6",desc:"Per person and total budget breakdown"},
                    {icon:"🥗",label:"2 Vegetarians",desc:"Veg restaurant and hotel picks"},
                    {icon:"🕐",label:"One late arrival",desc:"Separate travel plan created"},
                    {icon:"🏖️",label:"Beaches not nightlife",desc:"South Goa recommended specifically"},
                    {icon:"💰",label:"15k budget",desc:"Fits comfortably — fully within budget"},
                    {icon:"🛡️",label:"Safety insights",desc:"Goa safety tips auto-appended"},
                  ].map((f,i)=>(
                    <div key={i} className="lp3-card-hover" style={{display:"flex",gap:14,padding:"14px 16px",borderRadius:14,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)"}}>
                      <span style={{fontSize:20}}>{f.icon}</span>
                      <div>
                        <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:14,color:"#fff"}}>{f.label}</div>
                        <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"rgba(255,255,255,0.35)",marginTop:2}}>{f.desc}</div>
                      </div>
                      <div style={{marginLeft:"auto",display:"flex",alignItems:"center"}}><div style={{width:5,height:5,borderRadius:"50%",background:PALETTES[3].accent}}/></div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* SECTION 5 — Destinations */}
        <section id="s5" style={{padding:"120px 5%",background:PALETTES[4].bg,position:"relative",overflow:"hidden",transition:"background 1.5s ease"}}>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"clamp(100px,20vw,320px)",color:"rgba(0,0,0,0.04)",letterSpacing:"-0.04em",whiteSpace:"nowrap",pointerEvents:"none"}}>WORLD</div>
          <div style={{maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2}}>
            <Reveal style={{textAlign:"center",marginBottom:64}}>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:G,letterSpacing:"0.22em",marginBottom:20}}>WHERE TO?</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(36px,5vw,68px)",color:PALETTES[4].text,lineHeight:1.1}}>
                Every dream.<br/><span className="lp3-gold">Every destination.</span>
              </div>
            </Reveal>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16}}>
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
                <Reveal key={d.name} delay={i*40}>
                  <div onClick={()=>navigate(localStorage.getItem("token")?`/ai?dest=${d.name}`:"/register")} style={{borderRadius:20,overflow:"hidden",cursor:"pointer",position:"relative",aspectRatio:"2/3",transition:"transform 0.4s cubic-bezier(0.34,1.56,0.64,1)"}} onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.05) translateY(-8px)";}} onMouseLeave={e=>{e.currentTarget.style.transform="scale(1) translateY(0)";}}>
                    <img src={`https://images.unsplash.com/${d.img}?auto=format&fit=crop&w=400&h=600&q=70`} alt={d.name} loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} onError={e=>e.target.style.display="none"}/>
                    <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.85) 0%,transparent 50%,rgba(0,0,0,0.1) 100%)"}}/>
                    <div style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(8px)",borderRadius:100,padding:"4px 12px",fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#fff"}}>{d.tag}</div>
                    <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"16px"}}>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:22,color:"#fff"}}>{d.name}</div>
                      <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:G,marginTop:4}}>{d.budget}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal style={{textAlign:"center",marginTop:48}}>
              <button onClick={goApp} className="lp3-btn-ghost" style={{margin:"0 auto"}}>Plan any destination with AI</button>
            </Reveal>
          </div>
        </section>

        {/* SECTION 6 — Features */}
        <section style={{padding:"120px 5%",background:PALETTES[5].bg,position:"relative",overflow:"hidden",transition:"background 1.5s ease"}}>
          <div style={{position:"absolute",bottom:"-8%",left:"50%",transform:"translateX(-50%)",fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"clamp(80px,16vw,240px)",color:"rgba(255,255,255,0.025)",letterSpacing:"-0.04em",whiteSpace:"nowrap",pointerEvents:"none"}}>INTELLIGENT</div>
          <div style={{maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2}}>
            <Reveal style={{textAlign:"center",marginBottom:80}}>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:G,letterSpacing:"0.22em",marginBottom:20}}>CAPABILITIES</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(36px,5vw,68px)",color:"#fff",lineHeight:1.1}}>
                Everything you need.<br/><span className="lp3-gold">Nothing you do not.</span>
              </div>
            </Reveal>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}} className="lp3-grid-3">
              {[
                {icon:"🧠",title:"AI Trip Planner",desc:"Complete door-to-door plans. Any language. Every constraint addressed.",accent:G},
                {icon:"✈️",title:"Flights Worldwide",desc:"60+ destinations. Best fares via Aviasales.",accent:"#38bdf8"},
                {icon:"🚌",title:"Buses Across India",desc:"300+ routes. AC Sleeper via RedBus.",accent:"#4ade80"},
                {icon:"🏨",title:"Hotels Worldwide",desc:"Budget to luxury via Booking.com.",accent:"#fb923c"},
                {icon:"🛡️",title:"Safety Insights",desc:"Auto-appended safety info for every destination.",accent:"#a78bfa"},
                {icon:"📱",title:"WhatsApp AI",desc:"Full trip planning inside WhatsApp.",accent:"#22c55e"},
              ].map((f,i)=>(
                <Reveal key={i} delay={i*80}>
                  <div className="lp3-glass lp3-card-hover" style={{padding:"32px 28px",border:"1px solid rgba(255,255,255,0.06)"}}>
                    <div style={{fontSize:32,marginBottom:18}}>{f.icon}</div>
                    <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:18,color:"#fff",marginBottom:10}}>{f.title}</div>
                    <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"rgba(255,255,255,0.35)",lineHeight:1.7}}>{f.desc}</div>
                    <div style={{marginTop:20,height:2,borderRadius:1,width:"40%",background:`linear-gradient(90deg,${f.accent},transparent)`}}/>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 7 — Tiers */}
        <section id="s6" style={{padding:"120px 5%",background:PALETTES[6].bg,position:"relative",overflow:"hidden",transition:"background 1.5s ease"}}>
          <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 50%,${G}06 0%,transparent 60%)`}}/>
          <div style={{maxWidth:1000,margin:"0 auto",position:"relative",zIndex:2}}>
            <Reveal style={{textAlign:"center",marginBottom:64}}>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:G,letterSpacing:"0.22em",marginBottom:20}}>PLANS</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(36px,5vw,68px)",color:"#fff",lineHeight:1.1}}>
                Start free.<br/><span className="lp3-gold">Upgrade when ready.</span>
              </div>
            </Reveal>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}} className="lp3-grid-3">
              {[
                {name:"Explorer",badge:"FREE",active:true,desc:"Everything to start",features:["20 AI responses/day","2 trip plans/month","Flights, buses and hotels","Safety insights","WhatsApp AI"],cta:"Start Free"},
                {name:"Navigator",badge:"PRO",active:false,desc:"For serious travellers",features:["Unlimited trip plans","Advanced AI planning","Budget optimizer","Multi-city planning","Priority processing","Save plans"],cta:"Coming Soon"},
                {name:"Voyager",badge:"PREMIUM",active:false,desc:"The ultimate companion",features:["Everything in Navigator","Group travel planner","Scam awareness","Women traveller mode","Emergency companion","Weather planning"],cta:"Coming Soon"},
              ].map((plan,i)=>(
                <Reveal key={plan.name} delay={i*120}>
                  <div style={{padding:"36px 28px",borderRadius:24,height:"100%",position:"relative",background:plan.active?`linear-gradient(135deg,${GD}15,${G}08)`:"rgba(255,255,255,0.02)",border:plan.active?`1px solid ${G}44`:"1px solid rgba(255,255,255,0.06)",boxShadow:plan.active?`0 0 80px ${G}12`:"none",transition:"all 0.4s ease"}}>
                    {plan.active&&<div style={{position:"absolute",top:-1,left:"50%",transform:"translateX(-50%)",background:G,color:"#030303",padding:"4px 18px",borderRadius:"0 0 14px 14px",fontFamily:"'Space Mono',monospace",fontSize:9,fontWeight:700,letterSpacing:"0.08em",whiteSpace:"nowrap"}}>LIVE NOW</div>}
                    <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:plan.active?G:"rgba(255,255,255,0.25)",letterSpacing:"0.2em",marginBottom:8}}>{plan.badge}</div>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:28,color:"#fff",marginBottom:6}}>Alvryn {plan.name}</div>
                    <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"rgba(255,255,255,0.3)",marginBottom:28}}>{plan.desc}</p>
                    <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:32}}>
                      {plan.features.map(f=>(
                        <div key={f} style={{display:"flex",gap:10,alignItems:"center"}}>
                          <div style={{width:5,height:5,borderRadius:"50%",background:plan.active?G:"rgba(255,255,255,0.15)",flexShrink:0}}/>
                          <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:plan.active?"rgba(255,255,255,0.7)":"rgba(255,255,255,0.25)"}}>{f}</span>
                        </div>
                      ))}
                    </div>
                    {plan.active?(
                      <button onClick={goApp} className="lp3-btn-gold" style={{width:"100%",justifyContent:"center"}}>{plan.cta}</button>
                    ):(
                      <div style={{padding:"12px",borderRadius:12,border:`1px solid ${G}18`,background:`${G}05`,textAlign:"center"}}>
                        <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:`${G}66`,letterSpacing:"0.1em"}}>Crafted with precision</div>
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 8 — Cabs */}
        <section style={{minHeight:"100vh",background:PALETTES[6].bg,position:"relative",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",transition:"background 1.5s ease"}}>
          <div style={{position:"absolute",inset:0,opacity:0.035,backgroundImage:`linear-gradient(${G}80 1px,transparent 1px),linear-gradient(90deg,${G}80 1px,transparent 1px)`,backgroundSize:"80px 80px"}}/>
          <div style={{position:"relative",zIndex:2,textAlign:"center",padding:"0 5%"}}>
            <Reveal>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"rgba(255,255,255,0.2)",letterSpacing:"0.3em",marginBottom:32}}>SOMETHING IS ARRIVING</div>
              <div style={{position:"relative",marginBottom:24}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:100,fontSize:"clamp(80px,15vw,200px)",letterSpacing:"0.08em",lineHeight:0.9,color:"rgba(255,255,255,0.06)"}}>CABS</div>
                <div className="lp3-gold" style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"clamp(80px,15vw,200px)",letterSpacing:"0.08em",lineHeight:0.9,animation:"a_reveal 3s ease 0.5s both"}}>CABS</div>
              </div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(18px,3vw,32px)",color:"rgba(255,255,255,0.45)",marginBottom:32}}>Alvryn Cabs</div>
              <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:40}}>
                {["Airport Transfers","Local Rides","Outstation Trips","Real-time Tracking","Transparent Pricing"].map(f=>(
                  <div key={f} style={{padding:"8px 20px",borderRadius:100,border:`1px solid ${G}22`,background:`${G}07`,fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"rgba(255,255,255,0.4)"}}>{f}</div>
                ))}
              </div>
              <button onClick={goApp} className="lp3-btn-ghost">Join Waitlist</button>
              <div style={{marginTop:16,fontFamily:"'Space Mono',monospace",fontSize:9,color:"rgba(255,255,255,0.15)",letterSpacing:"0.25em"}}>COMING SOON 2026</div>
            </Reveal>
          </div>
        </section>

        {/* SECTION 9 — CTA */}
        <section style={{minHeight:"80vh",background:PALETTES[7].bg,position:"relative",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",padding:"120px 5%",transition:"background 1.5s ease"}}>
          <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 50%,${G}07 0%,transparent 65%)`}}/>
          <div style={{position:"relative",zIndex:2,textAlign:"center",maxWidth:720}}>
            <Reveal>
              <div style={{animation:"a_float 5s ease-in-out infinite",marginBottom:32,display:"inline-block"}}><AlvrynMark size={64} glow/></div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(48px,8vw,110px)",color:"#fff",lineHeight:0.95,letterSpacing:"-0.02em",marginBottom:28}}>
                Start your<br/><span className="lp3-gold">journey.</span>
              </div>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:18,color:"rgba(255,255,255,0.3)",lineHeight:1.7,maxWidth:480,margin:"0 auto 52px"}}>
                {"India's most intelligent travel companion. Free forever."}
              </p>
              <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
                <button onClick={goApp} className="lp3-btn-gold" style={{fontSize:16,padding:"18px 52px"}}>Try Alvryn AI Free</button>
                <button onClick={goSearch} className="lp3-btn-ghost" style={{fontSize:16,padding:"17px 40px"}}>Search Travel</button>
              </div>
              <div style={{marginTop:40,fontFamily:"'Space Mono',monospace",fontSize:9,color:"rgba(255,255,255,0.12)",letterSpacing:"0.22em"}}>NO CREDIT CARD · FREE FOREVER · TRUSTED PARTNERS</div>
            </Reveal>
          </div>
        </section>

        {/* Footer */}
        <footer style={{background:"#020202",borderTop:"1px solid rgba(255,255,255,0.03)",padding:"48px 5%"}}>
          <div style={{maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:24}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <AlvrynMark size={28}/>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:300,fontSize:15,color:"rgba(255,255,255,0.4)",letterSpacing:"0.18em"}}>ALVRYN</div>
            </div>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"rgba(255,255,255,0.15)"}}>2026 Alvryn · Built in Bangalore · Travel Beyond Boundaries</div>
            <div style={{display:"flex",gap:24}}>
              {["About","Privacy","Terms","Contact"].map(l=>(
                <span key={l} style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"rgba(255,255,255,0.2)",cursor:"pointer",transition:"color 0.2s"}} onMouseEnter={e=>e.target.style.color="rgba(255,255,255,0.6)"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.2)"}>{l}</span>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
