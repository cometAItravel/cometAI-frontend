import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://cometai-backend.onrender.com";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [waking, setWaking] = useState(true);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [, setFocused] = useState("");
  const [trail, setTrail] = useState([]);
  const trailId = useRef(0);

  useEffect(() => {
    fetch(`${API}/test`).then(() => setWaking(false)).catch(() => setWaking(false));
    setTimeout(() => setWaking(false), 6000);
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
      const id = ++trailId.current;
      setTrail(p => [...p.slice(-12), { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setTrail(p => p.filter(t => t.id !== id)), 500);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill all fields"); return; }
    setLoading(true); setError("");
    try {
      const res = await axios.post(`${API}/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/search");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  const tiltStyle = {
    transform: `perspective(1200px) rotateX(${(mouse.y - 0.5) * -10}deg) rotateY(${(mouse.x - 0.5) * 10}deg)`,
    transition: "transform 0.2s ease"
  };

  return (
    <div style={{ minHeight: "100vh", background: "#00000a", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden", cursor: "none", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes orbitLogin { from{transform:rotate(0deg) translateX(180px) rotate(0deg);} to{transform:rotate(360deg) translateX(180px) rotate(-360deg);} }
        @keyframes orbitLogin2 { from{transform:rotate(120deg) translateX(220px) rotate(-120deg);} to{transform:rotate(480deg) translateX(220px) rotate(-480deg);} }
        @keyframes orbitLogin3 { from{transform:rotate(240deg) translateX(160px) rotate(-240deg);} to{transform:rotate(600deg) translateX(160px) rotate(-600deg);} }
        @keyframes pulseCore { 0%,100%{box-shadow:0 0 40px rgba(99,102,241,0.4),0 0 80px rgba(99,102,241,0.15);} 50%{box-shadow:0 0 80px rgba(99,102,241,0.7),0 0 160px rgba(99,102,241,0.3);} }
        @keyframes shimmer { 0%{background-position:200% center;} 100%{background-position:-200% center;} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
        @keyframes trailFade { 0%{opacity:0.7;} 100%{opacity:0;transform:scale(0.2);} }
        @keyframes borderGlow { 0%,100%{border-color:rgba(99,102,241,0.3);} 50%{border-color:rgba(99,102,241,0.7);box-shadow:0 0 20px rgba(99,102,241,0.3);} }
        .input-field { width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(99,102,241,0.2); border-radius:12px; padding:14px 18px; color:#e0e7ff; font-family:'DM Sans',sans-serif; font-size:15px; outline:none; transition:all 0.3s; }
        .input-field:focus { border-color:rgba(99,102,241,0.6); background:rgba(99,102,241,0.06); box-shadow:0 0 0 3px rgba(99,102,241,0.1); }
        .input-field::placeholder { color:rgba(165,180,252,0.25); }
        .btn-primary { width:100%; padding:15px; background:linear-gradient(135deg,#6366f1,#8b5cf6); border:none; border-radius:12px; color:white; font-family:'DM Sans',sans-serif; font-size:16px; font-weight:600; cursor:pointer; transition:all 0.3s; position:relative; overflow:hidden; }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 12px 40px rgba(99,102,241,0.5); }
        .btn-primary::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,0.1),transparent); }
        .grain { position:fixed; inset:0; z-index:0; pointer-events:none; opacity:0.04; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); background-size:200px; }
      `}</style>

      <div className="grain"/>

      {/* CURSOR */}
      {trail.map((t,i) => (
        <div key={t.id} style={{position:"fixed",left:t.x,top:t.y,width:6,height:6,borderRadius:"50%",pointerEvents:"none",zIndex:9999,background:`rgba(99,102,241,${0.7-i*0.05})`,transform:"translate(-50%,-50%)",animation:"trailFade 0.5s ease forwards"}}/>
      ))}
      <div style={{position:"fixed",left:mouse.x*window.innerWidth,top:mouse.y*window.innerHeight,width:18,height:18,borderRadius:"50%",pointerEvents:"none",zIndex:9999,border:"2px solid rgba(99,102,241,0.8)",transform:"translate(-50%,-50%)",boxShadow:"0 0 16px rgba(99,102,241,0.5)"}}/>

      {/* BG */}
      <div style={{position:"fixed",inset:0,background:"radial-gradient(ellipse at 20% 50%,rgba(60,20,140,0.3) 0%,transparent 50%),radial-gradient(ellipse at 80% 30%,rgba(20,40,160,0.2) 0%,transparent 50%),#00000a",zIndex:0}}/>
      <div style={{position:"fixed",inset:0,backgroundImage:"linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px)",backgroundSize:"60px 60px",zIndex:0,maskImage:"radial-gradient(ellipse 80% 80% at 50% 50%,black,transparent)"}}/>
      <div style={{position:"fixed",inset:0,background:`radial-gradient(ellipse 600px 500px at ${mouse.x*100}% ${mouse.y*100}%,rgba(99,102,241,0.07) 0%,transparent 70%)`,zIndex:0,pointerEvents:"none"}}/>

      {/* WAKE UP BANNER */}
      {waking && (
        <div style={{position:"fixed",top:0,left:0,right:0,zIndex:200,background:"linear-gradient(135deg,rgba(251,191,36,0.15),rgba(245,158,11,0.1))",borderBottom:"1px solid rgba(251,191,36,0.3)",padding:"10px 24px",textAlign:"center",backdropFilter:"blur(10px)"}}>
          <span style={{fontSize:12,color:"#fcd34d",fontFamily:"'Space Mono',monospace",letterSpacing:"1px"}}>⚡ Waking up servers... first load may take 30s</span>
        </div>
      )}

      {/* 3D ORBIT LOGO */}
      <div style={{position:"fixed",right:"5%",top:"50%",transform:"translateY(-50%)",width:300,height:300,zIndex:1,display:"flex",alignItems:"center",justifyContent:"center",opacity:0.5}}>
        <div style={{position:"absolute",width:80,height:80,borderRadius:"50%",background:"radial-gradient(circle at 35% 35%,#4f33aa,#1a0a60)",boxShadow:"0 0 60px rgba(99,102,241,0.5)",animation:"pulseCore 3s ease infinite",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>☄</div>
        {[{a:"orbitLogin",d:"6s",s:18,c:"#818cf8"},{a:"orbitLogin2",d:"9s",s:14,c:"#c084fc"},{a:"orbitLogin3",d:"7s",s:10,c:"#38bdf8"}].map((o,i)=>(
          <div key={i} style={{position:"absolute",width:o.s,height:o.s,borderRadius:"50%",background:o.c,boxShadow:`0 0 16px ${o.c}`,animation:`${o.a} ${o.d} linear infinite`}}/>
        ))}
        {[180,220,160].map((r,i)=>(
          <div key={i} style={{position:"absolute",width:r*2,height:r*2,borderRadius:"50%",border:`1px solid rgba(99,102,241,${0.1-i*0.02})`}}/>
        ))}
      </div>

      {/* MAIN CARD */}
      <div style={{...tiltStyle,position:"relative",zIndex:10,width:"100%",maxWidth:440,animation:"fadeUp 0.7s ease both"}}>
        <div style={{
          background:"rgba(8,8,24,0.95)",border:"1px solid rgba(99,102,241,0.2)",
          borderRadius:24,padding:"48px 40px",backdropFilter:"blur(30px)",
          boxShadow:"0 32px 80px rgba(0,0,0,0.7),0 0 0 1px rgba(99,102,241,0.05)"
        }}>
          {/* top accent */}
          <div style={{position:"absolute",top:0,left:"20%",right:"20%",height:1,background:"linear-gradient(90deg,transparent,rgba(99,102,241,0.6),rgba(192,132,252,0.6),transparent)"}}/>

          <div style={{textAlign:"center",marginBottom:36}}>
            <div style={{width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,margin:"0 auto 16px",boxShadow:"0 8px 24px rgba(99,102,241,0.4)"}}>☄</div>
            <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:"#f8fafc",marginBottom:6,letterSpacing:"-0.5px"}}>Welcome back</h1>
            <p style={{fontSize:13,color:"rgba(165,180,252,0.45)"}}>Sign in to continue your journey</p>
          </div>

          {error && (
            <div style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:10,padding:"10px 14px",marginBottom:20,fontSize:13,color:"#f87171"}}>⚠ {error}</div>
          )}

          <div style={{marginBottom:16}}>
            <label style={{fontSize:11,color:"rgba(165,180,252,0.45)",letterSpacing:"1.5px",textTransform:"uppercase",display:"block",marginBottom:8,fontFamily:"'Space Mono',monospace"}}>Email</label>
            <input className="input-field" type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} onFocus={()=>setFocused("email")} onBlur={()=>setFocused("")} onKeyPress={e=>{if(e.key==="Enter")handleLogin();}}/>
          </div>
          <div style={{marginBottom:28}}>
            <label style={{fontSize:11,color:"rgba(165,180,252,0.45)",letterSpacing:"1.5px",textTransform:"uppercase",display:"block",marginBottom:8,fontFamily:"'Space Mono',monospace"}}>Password</label>
            <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} onFocus={()=>setFocused("pass")} onBlur={()=>setFocused("")} onKeyPress={e=>{if(e.key==="Enter")handleLogin();}}/>
          </div>

          <button className="btn-primary" onClick={handleLogin} disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>

          <div style={{textAlign:"center",marginTop:24,fontSize:13,color:"rgba(165,180,252,0.4)"}}>
            Don't have an account?{" "}
            <span style={{color:"#818cf8",cursor:"pointer"}} onClick={()=>navigate("/register")}>Create one</span>
          </div>

          <div style={{position:"absolute",bottom:0,left:"20%",right:"20%",height:1,background:"linear-gradient(90deg,transparent,rgba(99,102,241,0.2),transparent)"}}/>
        </div>
      </div>
    </div>
  );
}