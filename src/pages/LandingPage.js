import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://cometai-backend.onrender.com";

export default function LandingPage() {
  const navigate = useNavigate();
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [, setScrollY] = useState(0);
  const [cursorTrail, setCursorTrail] = useState([]);
  const [typed, setTyped] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const trailId = useRef(0);
  const full = "Book flights with AI";

  // keep-alive
  useEffect(() => {
    fetch(`${API}/test`).catch(() => {});
    const t = setInterval(() => fetch(`${API}/test`).catch(() => {}), 14 * 60 * 1000);
    return () => clearInterval(t);
  }, []);

  // typewriter
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      if (i <= full.length) { setTyped(full.slice(0, i)); i++; }
      else clearInterval(iv);
    }, 80);
    const blink = setInterval(() => setShowCursor(c => !c), 530);
    return () => { clearInterval(iv); clearInterval(blink); };
  }, []);

  // mouse tracking
  useEffect(() => {
    const onMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMouse({ x, y });
      // comet cursor trail
      const id = ++trailId.current;
      setCursorTrail(p => [...p.slice(-18), { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setCursorTrail(p => p.filter(t => t.id !== id)), 600);
    };
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("scroll", onScroll); };
  }, []);

  const tilt = (factor = 1) => ({
    transform: `perspective(1000px) rotateX(${(mouse.y - 0.5) * -12 * factor}deg) rotateY(${(mouse.x - 0.5) * 12 * factor}deg)`,
    transition: "transform 0.15s ease"
  });

  const features = [
    { icon: "🤖", title: "AI Search", desc: "Type naturally — \"cheap flights BLR to BOM tomorrow\" and we find them instantly", color: "#818cf8" },
    { icon: "📱", title: "WhatsApp Booking", desc: "Book flights directly on WhatsApp without opening any app or website", color: "#6ee7b7" },
    { icon: "⚡", title: "Real Flight Data", desc: "Live flight schedules powered by AviationStack API — always accurate", color: "#f9a8d4" },
    { icon: "💰", title: "Zero Booking Fees", desc: "No hidden charges. What you see is what you pay — always", color: "#fcd34d" },
    { icon: "🔒", title: "Secure Payments", desc: "Bank-grade encryption on every transaction. Your money is safe with us", color: "#a5f3fc" },
    { icon: "🎯", title: "Smart Filters", desc: "Filter by time, price, duration — find the perfect flight in seconds", color: "#c084fc" },
  ];

  const howItWorks = [
    { step: "01", title: "Search", desc: "Type your route using normal search or just describe it to our AI" },
    { step: "02", title: "Compare", desc: "See real flight options with smart filters for time, price and duration" },
    { step: "03", title: "Book", desc: "Book instantly with card, UPI or netbanking — confirmation email sent immediately" },
  ];

  return (
    <div style={{ background: "#00000a", minHeight: "100vh", overflowX: "hidden", cursor: "none", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #00000a; }
        ::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 2px; }
        html { scroll-behavior: smooth; }

        @keyframes floatA { 0%,100%{transform:translateY(0px) rotate(0deg);} 50%{transform:translateY(-24px) rotate(3deg);} }
        @keyframes floatB { 0%,100%{transform:translateY(0px) rotate(0deg);} 50%{transform:translateY(-16px) rotate(-2deg);} }
        @keyframes orbitRing { from{transform:rotateX(75deg) rotateZ(0deg);} to{transform:rotateX(75deg) rotateZ(360deg);} }
        @keyframes orbitRing2 { from{transform:rotateX(65deg) rotateZ(120deg);} to{transform:rotateX(65deg) rotateZ(480deg);} }
        @keyframes orbitDot { from{transform:rotateZ(0deg) translateX(120px);} to{transform:rotateZ(360deg) translateX(120px);} }
        @keyframes pulseGlow { 0%,100%{box-shadow:0 0 20px rgba(99,102,241,0.3);} 50%{box-shadow:0 0 60px rgba(99,102,241,0.7), 0 0 100px rgba(139,92,246,0.4);} }
        @keyframes shimmer { 0%{background-position:200% center;} 100%{background-position:-200% center;} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(40px);} to{opacity:1;transform:translateY(0);} }
        @keyframes scanLine { 0%{top:-100%;} 100%{top:200%;} }
        @keyframes particleDrift { 0%{transform:translateY(0) translateX(0) scale(1);opacity:0.6;} 50%{transform:translateY(-80px) translateX(30px) scale(1.5);opacity:1;} 100%{transform:translateY(-160px) translateX(-20px) scale(0);opacity:0;} }
        @keyframes trailFade { 0%{opacity:0.8;transform:scale(1);} 100%{opacity:0;transform:scale(0.1);} }
        @keyframes glitchX { 0%,100%{clip-path:inset(0 0 95% 0);transform:translateX(0);} 20%{clip-path:inset(30% 0 50% 0);transform:translateX(-4px);} 40%{clip-path:inset(60% 0 20% 0);transform:translateX(4px);} }
        @keyframes spin3d { from{transform:rotateY(0deg);} to{transform:rotateY(360deg);} }
        @keyframes borderFlow { 0%{border-color:rgba(99,102,241,0.3);box-shadow:0 0 0 rgba(99,102,241,0);} 50%{border-color:rgba(139,92,246,0.8);box-shadow:0 0 30px rgba(99,102,241,0.4);} 100%{border-color:rgba(99,102,241,0.3);box-shadow:0 0 0 rgba(99,102,241,0);} }
        @keyframes countUp { from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:translateY(0);} }

        .magnetic-btn { transition: transform 0.2s cubic-bezier(0.23,1,0.32,1); }
        .magnetic-btn:hover { transform: scale(1.05) translateY(-2px); }
        .feature-card-3d { transition: transform 0.3s cubic-bezier(0.23,1,0.32,1), box-shadow 0.3s ease; }
        .feature-card-3d:hover { transform: perspective(800px) rotateX(-5deg) rotateY(5deg) translateZ(20px) scale(1.02) !important; box-shadow: 20px 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(99,102,241,0.3) !important; }
        .nav-link { position:relative; color:rgba(165,180,252,0.7); text-decoration:none; font-size:14px; transition:color 0.2s; }
        .nav-link::after { content:''; position:absolute; bottom:-4px; left:0; width:0; height:1px; background:linear-gradient(90deg,#6366f1,#c084fc); transition:width 0.3s; }
        .nav-link:hover { color:#e0e7ff; }
        .nav-link:hover::after { width:100%; }
        .grain { position:fixed; inset:0; z-index:1; pointer-events:none; opacity:0.04; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); background-size: 200px; }
        .scan-line { position:fixed; left:0; width:100%; height:2px; background:linear-gradient(90deg,transparent,rgba(99,102,241,0.15),transparent); z-index:2; pointer-events:none; animation:scanLine 8s linear infinite; }
        .hologram-text { background:linear-gradient(135deg,#e0e7ff,#a5b4fc,#c084fc,#818cf8,#38bdf8,#e0e7ff); background-size:400% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }
        .section-reveal { animation:fadeSlideUp 0.8s ease both; }
        .grid-bg { position:absolute; inset:0; background-image:linear-gradient(rgba(99,102,241,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.06) 1px,transparent 1px); background-size:60px 60px; mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black,transparent); }
        .hex-grid { position:absolute; inset:0; overflow:hidden; pointer-events:none; }
      `}</style>

      {/* GRAIN OVERLAY */}
      <div className="grain"/>
      <div className="scan-line"/>

      {/* CUSTOM CURSOR */}
      {cursorTrail.map((t, i) => (
        <div key={t.id} style={{
          position:"fixed", left:t.x, top:t.y, width:8-i*0.3, height:8-i*0.3,
          borderRadius:"50%", pointerEvents:"none", zIndex:9999,
          background:`rgba(${99+i*8},${102+i*5},241,${0.8-i*0.04})`,
          transform:"translate(-50%,-50%)",
          boxShadow:`0 0 ${10-i}px rgba(99,102,241,${0.6-i*0.03})`,
          animation:"trailFade 0.6s ease forwards"
        }}/>
      ))}
      <div style={{
        position:"fixed", left:mouse.x*window.innerWidth, top:mouse.y*window.innerHeight,
        width:20, height:20, borderRadius:"50%", pointerEvents:"none", zIndex:9999,
        border:"2px solid rgba(99,102,241,0.8)", transform:"translate(-50%,-50%)",
        boxShadow:"0 0 20px rgba(99,102,241,0.5)", mixBlendMode:"screen",
        transition:"left 0.05s, top 0.05s"
      }}/>

      {/* AMBIENT LIGHT */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,
        background:`radial-gradient(ellipse 800px 600px at ${mouse.x*100}% ${mouse.y*100}%, rgba(99,102,241,0.08) 0%, transparent 70%)`
      }}/>

      {/* SPACE BACKGROUND */}
      <div style={{position:"fixed",inset:0,zIndex:0,
        background:"radial-gradient(ellipse at 20% 40%,rgba(79,33,170,0.25) 0%,transparent 50%), radial-gradient(ellipse at 80% 20%,rgba(15,60,180,0.2) 0%,transparent 45%), radial-gradient(ellipse at 60% 90%,rgba(120,20,160,0.15) 0%,transparent 50%), #00000a"
      }}/>

      {/* PARTICLES */}
      {Array.from({length:80}).map((_,i) => (
        <div key={i} style={{
          position:"fixed", left:`${Math.random()*100}%`, top:`${Math.random()*100}%`,
          width:Math.random()*2.5+0.5, height:Math.random()*2.5+0.5,
          borderRadius:"50%", background:"white", zIndex:1, pointerEvents:"none",
          animation:`particleDrift ${6+Math.random()*10}s ${Math.random()*8}s ease-in-out infinite`,
          opacity:Math.random()*0.7+0.1
        }}/>
      ))}

      {/* ══════════════ NAV ══════════════ */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:100,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"20px 48px",
        background:"rgba(0,0,10,0.6)", backdropFilter:"blur(20px)",
        borderBottom:"1px solid rgba(99,102,241,0.1)",
      }}>
        <div style={{display:"flex",alignItems:"center",gap:"10px",cursor:"pointer"}} onClick={()=>navigate("/")}>
          <div style={{
            width:36, height:36, borderRadius:"50%",
            background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:18, animation:"pulseGlow 3s ease infinite"
          }}>☄</div>
          <span style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,letterSpacing:"1px",
            background:"linear-gradient(90deg,#e0e7ff,#a5b4fc)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text"
          }}>COMETAI</span>
        </div>
        <div style={{display:"flex",gap:"32px",alignItems:"center"}}>
          {[["How it works","#how"],["Features","#features"],["WhatsApp","#whatsapp"]].map(([label,href])=>(
            <a key={label} href={href} className="nav-link">{label}</a>
          ))}
        </div>
        <div style={{display:"flex",gap:"10px"}}>
          <button className="magnetic-btn" onClick={()=>navigate("/waitlist")} style={{
            background:"transparent", border:"1px solid rgba(99,102,241,0.4)",
            color:"#a5b4fc", padding:"9px 20px", borderRadius:"8px",
            fontFamily:"'DM Sans',sans-serif", fontSize:13, cursor:"pointer"
          }}>Join Waitlist</button>
          <button className="magnetic-btn" onClick={()=>navigate("/register")} style={{
            background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
            border:"none", color:"white", padding:"9px 20px", borderRadius:"8px",
            fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, cursor:"pointer",
            boxShadow:"0 4px 20px rgba(99,102,241,0.4)"
          }}>Get Started →</button>
        </div>
      </nav>

      {/* ══════════════ HERO ══════════════ */}
      <section style={{
        position:"relative", minHeight:"100vh", display:"flex", alignItems:"center",
        justifyContent:"center", padding:"0 48px", paddingTop:100, zIndex:2, overflow:"hidden"
      }}>
        <div className="grid-bg"/>

        {/* 3D PLANET */}
        <div style={{
          position:"absolute", right:"8%", top:"50%", transform:"translateY(-50%)",
          width:420, height:420, zIndex:1
        }}>
          {/* planet sphere */}
          <div style={{
            position:"absolute", inset:0, borderRadius:"50%",
            background:"radial-gradient(ellipse at 35% 35%, #1a1060 0%, #0a0520 40%, #050210 70%, #000008 100%)",
            boxShadow:"inset -40px -30px 60px rgba(0,0,0,0.9), inset 20px 15px 40px rgba(99,102,241,0.15), 0 0 80px rgba(99,102,241,0.2), 0 0 160px rgba(79,33,170,0.15)",
            ...tilt(0.5)
          }}>
            {/* grid lines on planet */}
            {[30,60,90,120,150].map(d=>(
              <div key={d} style={{position:"absolute",inset:0,borderRadius:"50%",border:"1px solid rgba(99,102,241,0.08)",transform:`rotateY(${d}deg)`}}/>
            ))}
            {[30,60,120,150].map(d=>(
              <div key={d} style={{position:"absolute",inset:0,borderRadius:"50%",border:"1px solid rgba(99,102,241,0.06)",transform:`rotateX(${d}deg)`}}/>
            ))}
            {/* atmosphere glow */}
            <div style={{position:"absolute",inset:-8,borderRadius:"50%",background:"radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(99,102,241,0.15) 80%, rgba(99,102,241,0.05) 100%)"}}/>
          </div>
          {/* orbit rings */}
          <div style={{position:"absolute",inset:-60,borderRadius:"50%",border:"1px solid rgba(99,102,241,0.2)",transform:"rotateX(75deg)",animation:"orbitRing 8s linear infinite",boxShadow:"0 0 20px rgba(99,102,241,0.1)"}}>
            <div style={{position:"absolute",top:-4,left:"50%",width:8,height:8,borderRadius:"50%",background:"#818cf8",boxShadow:"0 0 12px #818cf8",transform:"translateX(-50%)"}}/>
          </div>
          <div style={{position:"absolute",inset:-40,borderRadius:"50%",border:"1px solid rgba(192,132,252,0.15)",animation:"orbitRing2 12s linear infinite"}}>
            <div style={{position:"absolute",top:-3,left:"30%",width:6,height:6,borderRadius:"50%",background:"#c084fc",boxShadow:"0 0 8px #c084fc",transform:"translateX(-50%)"}}/>
          </div>
          {/* floating planes */}
          {[{x:"15%",y:"20%",r:"30deg",d:"3s"},{x:"75%",y:"70%",r:"-20deg",d:"4.5s"},{x:"80%",y:"15%",r:"45deg",d:"2.8s"}].map((p,i)=>(
            <div key={i} style={{position:"absolute",left:p.x,top:p.y,fontSize:18,animation:`floatA ${p.d} ease-in-out infinite`,animationDelay:`${i*0.8}s`,filter:"drop-shadow(0 0 6px rgba(99,102,241,0.8))",transform:`rotate(${p.r})`}}>✈</div>
          ))}
        </div>

        {/* HERO CONTENT */}
        <div style={{maxWidth:640, position:"relative", zIndex:2}}>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:8, marginBottom:24,
            background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.25)",
            borderRadius:20, padding:"6px 16px", animation:"borderFlow 3s ease infinite"
          }}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"#6ee7b7",boxShadow:"0 0 8px #6ee7b7"}}/>
            <span style={{fontSize:11,color:"#a5b4fc",letterSpacing:"2px",textTransform:"uppercase",fontFamily:"'Space Mono',monospace"}}>Now Live — AI Travel</span>
          </div>

          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(40px,6vw,76px)",fontWeight:800,lineHeight:1.05,marginBottom:12,letterSpacing:"-1px"}}>
            <span className="hologram-text">Travel Beyond</span>
            <br/>
            <span style={{color:"#e0e7ff"}}>The Ordinary</span>
          </h1>

          {/* typewriter */}
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:16,color:"#6366f1",marginBottom:16,height:24}}>
            {typed}{showCursor ? "|" : " "}
          </div>

          <p style={{fontSize:17,color:"rgba(165,180,252,0.6)",lineHeight:1.7,marginBottom:36,maxWidth:520,fontWeight:300}}>
            India's first AI-powered travel platform. Search flights naturally, book via WhatsApp, zero booking fees — your journey starts here.
          </p>

          <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
            <button className="magnetic-btn" onClick={()=>navigate("/search")} style={{
              background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
              border:"none", color:"white", padding:"16px 36px", borderRadius:12,
              fontFamily:"'DM Sans',sans-serif", fontSize:16, fontWeight:600, cursor:"pointer",
              boxShadow:"0 8px 32px rgba(99,102,241,0.5), 0 0 60px rgba(99,102,241,0.2)",
              position:"relative", overflow:"hidden"
            }}>
              <span style={{position:"relative",zIndex:1}}>Search Flights ✈</span>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,255,255,0.1),transparent)",pointerEvents:"none"}}/>
            </button>
            <button className="magnetic-btn" onClick={()=>navigate("/waitlist")} style={{
              background:"transparent", border:"1px solid rgba(99,102,241,0.4)",
              color:"#a5b4fc", padding:"16px 32px", borderRadius:12,
              fontFamily:"'DM Sans',sans-serif", fontSize:16, cursor:"pointer",
              backdropFilter:"blur(10px)"
            }}>Join Waitlist 🚀</button>
          </div>

          {/* stats row */}
          <div style={{display:"flex",gap:32,marginTop:48}}>
            {[["500+","Flights daily"],["₹0","Booking fees"],["AI","Powered search"]].map(([num,label],i)=>(
              <div key={i} style={{animation:`countUp 0.6s ease ${i*0.15}s both`}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:28,fontWeight:800,
                  background:"linear-gradient(135deg,#e0e7ff,#a5b4fc)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"
                }}>{num}</div>
                <div style={{fontSize:12,color:"rgba(165,180,252,0.45)",letterSpacing:"0.5px"}}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* scroll indicator */}
        <div style={{position:"absolute",bottom:32,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:6,opacity:0.4}}>
          <span style={{fontSize:10,color:"#a5b4fc",letterSpacing:"2px",textTransform:"uppercase",fontFamily:"'Space Mono',monospace"}}>Scroll</span>
          <div style={{width:1,height:40,background:"linear-gradient(180deg,#6366f1,transparent)"}}/>
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section id="how" style={{position:"relative",padding:"120px 48px",zIndex:2}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:72}}>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:"#6366f1",letterSpacing:"3px",textTransform:"uppercase",marginBottom:16}}>— How it works</div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(32px,4vw,52px)",fontWeight:800,color:"#e0e7ff",letterSpacing:"-0.5px"}}>Three steps to anywhere</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:24}}>
            {howItWorks.map((item,i)=>(
              <div key={i} className="feature-card-3d" style={{
                position:"relative", background:"rgba(10,10,30,0.8)",
                border:"1px solid rgba(99,102,241,0.15)", borderRadius:20, padding:36,
                backdropFilter:"blur(20px)", overflow:"hidden"
              }}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(99,102,241,0.4),transparent)"}}/>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:72,fontWeight:800,color:"rgba(99,102,241,0.07)",position:"absolute",top:16,right:20,lineHeight:1}}>{item.step}</div>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:"#6366f1",letterSpacing:"2px",marginBottom:16}}>{item.step}</div>
                <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:700,color:"#e0e7ff",marginBottom:12}}>{item.title}</h3>
                <p style={{fontSize:14,color:"rgba(165,180,252,0.55)",lineHeight:1.7,fontWeight:300}}>{item.desc}</p>
                <div style={{position:"absolute",bottom:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(99,102,241,0.15),transparent)"}}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section id="features" style={{position:"relative",padding:"80px 48px 120px",zIndex:2}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:72}}>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:"#6366f1",letterSpacing:"3px",textTransform:"uppercase",marginBottom:16}}>— Features</div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(32px,4vw,52px)",fontWeight:800,color:"#e0e7ff",letterSpacing:"-0.5px"}}>Everything you need</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20}}>
            {features.map((f,i)=>(
              <div key={i} className="feature-card-3d" style={{
                background:"rgba(8,8,24,0.9)", border:"1px solid rgba(255,255,255,0.06)",
                borderRadius:18, padding:32, backdropFilter:"blur(20px)",
                position:"relative", overflow:"hidden"
              }}>
                <div style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",
                  background:`radial-gradient(ellipse at 0% 0%, ${f.color}08 0%, transparent 60%)`,pointerEvents:"none"
                }}/>
                <div style={{fontSize:36,marginBottom:16,filter:`drop-shadow(0 0 12px ${f.color})`}}>{f.icon}</div>
                <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:700,color:"#e0e7ff",marginBottom:10}}>{f.title}</h3>
                <p style={{fontSize:14,color:"rgba(165,180,252,0.5)",lineHeight:1.7,fontWeight:300}}>{f.desc}</p>
                <div style={{position:"absolute",bottom:0,left:0,height:2,width:"40%",background:`linear-gradient(90deg,${f.color},transparent)`,borderRadius:1}}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ WHATSAPP ══════════════ */}
      <section id="whatsapp" style={{position:"relative",padding:"80px 48px",zIndex:2}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div style={{
            background:"rgba(8,8,24,0.95)", border:"1px solid rgba(99,102,241,0.2)",
            borderRadius:28, padding:"60px 56px", position:"relative", overflow:"hidden",
            backdropFilter:"blur(30px)", ...tilt(0.3)
          }}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(99,102,241,0.5),rgba(192,132,252,0.5),transparent)"}}/>
            <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.06) 0%, transparent 60%)",pointerEvents:"none"}}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,alignItems:"center"}}>
              <div>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:"#6ee7b7",letterSpacing:"3px",textTransform:"uppercase",marginBottom:20}}>— WhatsApp Bot</div>
                <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(28px,3.5vw,44px)",fontWeight:800,color:"#e0e7ff",marginBottom:18,letterSpacing:"-0.5px"}}>
                  Book flights<br/>on WhatsApp
                </h2>
                <p style={{fontSize:15,color:"rgba(165,180,252,0.55)",lineHeight:1.8,marginBottom:28,fontWeight:300}}>
                  No app download needed. Just message our WhatsApp bot your route and book instantly. It's that simple.
                </p>
                <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:32}}>
                  {["Send your route: \"flights blr to mumbai tomorrow\"","Choose your flight, enter your name","Reply CONFIRM — done! Booking ID sent"].map((s,i)=>(
                    <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                      <div style={{width:20,height:20,borderRadius:"50%",background:"rgba(99,102,241,0.2)",border:"1px solid rgba(99,102,241,0.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#818cf8",flexShrink:0,marginTop:2}}>{i+1}</div>
                      <span style={{fontSize:13,color:"rgba(165,180,252,0.6)",lineHeight:1.5}}>{s}</span>
                    </div>
                  ))}
                </div>
                <button className="magnetic-btn" style={{
                  background:"#25D366", border:"none", color:"white",
                  padding:"14px 28px", borderRadius:10,
                  fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:600, cursor:"pointer",
                  boxShadow:"0 8px 24px rgba(37,211,102,0.4)"
                }}>📱 Message +1-415-523-8886</button>
              </div>
              {/* mock chat */}
              <div style={{background:"rgba(0,0,0,0.5)",borderRadius:20,padding:20,border:"1px solid rgba(255,255,255,0.06)"}}>
                <div style={{fontSize:12,color:"rgba(165,180,252,0.4)",textAlign:"center",marginBottom:16,fontFamily:"'Space Mono',monospace"}}>CometAI WhatsApp Bot</div>
                {[
                  {side:"left",msg:"✈️ CometAI Travel Bot\n\nHi! Try: \"flights bangalore to mumbai tomorrow\"",time:"10:00"},
                  {side:"right",msg:"flights bangalore to mumbai tomorrow",time:"10:01"},
                  {side:"left",msg:"✈️ Flights BLR → BOM\n\n1. IndiGo ⏰ 06:00→08:05 ₹3,499\n2. Air India ⏰ 09:30→11:45 ₹4,200\n3. SpiceJet ⏰ 14:00→16:10 ₹2,899\n\nReply with a number to book",time:"10:01"},
                  {side:"right",msg:"1",time:"10:02"},
                  {side:"left",msg:"✅ IndiGo selected\n⏰ 06:00 ₹3,499\n\nWhat is your full name?",time:"10:02"},
                ].map((m,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:m.side==="right"?"flex-end":"flex-start",marginBottom:8}}>
                    <div style={{
                      background:m.side==="right"?"#1b4a2c":"rgba(255,255,255,0.06)",
                      borderRadius:m.side==="right"?"12px 12px 2px 12px":"12px 12px 12px 2px",
                      padding:"8px 12px", maxWidth:"80%"
                    }}>
                      <div style={{fontSize:12,color:"rgba(255,255,255,0.85)",whiteSpace:"pre-wrap",lineHeight:1.5}}>{m.msg}</div>
                      <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",textAlign:"right",marginTop:4}}>{m.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section style={{position:"relative",padding:"100px 48px",zIndex:2,textAlign:"center"}}>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(36px,5vw,64px)",fontWeight:800,lineHeight:1.1,marginBottom:20,letterSpacing:"-1px"}}>
            <span className="hologram-text">Ready to take off?</span>
          </h2>
          <p style={{fontSize:17,color:"rgba(165,180,252,0.5)",marginBottom:40,fontWeight:300}}>Join thousands already on the waitlist. Launch incoming. 🚀</p>
          <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
            <button className="magnetic-btn" onClick={()=>navigate("/register")} style={{
              background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",color:"white",
              padding:"18px 44px",borderRadius:12,fontFamily:"'DM Sans',sans-serif",
              fontSize:17,fontWeight:600,cursor:"pointer",
              boxShadow:"0 8px 40px rgba(99,102,241,0.5), 0 0 80px rgba(99,102,241,0.2)"
            }}>Start Booking ✈</button>
            <button className="magnetic-btn" onClick={()=>navigate("/waitlist")} style={{
              background:"transparent",border:"1px solid rgba(99,102,241,0.4)",
              color:"#a5b4fc",padding:"18px 40px",borderRadius:12,
              fontFamily:"'DM Sans',sans-serif",fontSize:17,cursor:"pointer",
              backdropFilter:"blur(10px)"
            }}>Join Waitlist →</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{position:"relative",zIndex:2,padding:"40px 48px",borderTop:"1px solid rgba(99,102,241,0.1)",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:18}}>☄</span>
          <span style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,color:"rgba(165,180,252,0.6)"}}>COMETAI</span>
        </div>
        <div style={{fontSize:12,color:"rgba(165,180,252,0.25)"}}>© 2026 CometAI Travel · India's AI-powered travel platform</div>
        <div style={{display:"flex",gap:20}}>
          {["Privacy","Terms","Contact"].map(l=>(
            <span key={l} style={{fontSize:12,color:"rgba(165,180,252,0.3)",cursor:"pointer"}}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}