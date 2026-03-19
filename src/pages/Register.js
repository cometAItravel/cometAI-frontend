import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://cometai-backend.onrender.com";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [trail, setTrail] = useState([]);
  const trailId = useRef(0);

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

  const handleRegister = async () => {
    if (!name || !email || !password) { setError("Please fill all fields"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true); setError("");
    try {
      await axios.post(`${API}/register`, { name, email, password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };

  const tiltStyle = {
    transform: `perspective(1200px) rotateX(${(mouse.y - 0.5) * -8}deg) rotateY(${(mouse.x - 0.5) * 8}deg)`,
    transition: "transform 0.2s ease"
  };

  return (
    <div style={{ minHeight: "100vh", background: "#00000a", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden", cursor: "none", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes trailFade { 0%{opacity:0.7;} 100%{opacity:0;transform:scale(0.2);} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
        @keyframes successPop { 0%{transform:scale(0.8);opacity:0;} 100%{transform:scale(1);opacity:1;} }
        @keyframes float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-12px);} }
        .input-field { width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(99,102,241,0.2); border-radius:12px; padding:14px 18px; color:#e0e7ff; font-family:'DM Sans',sans-serif; font-size:15px; outline:none; transition:all 0.3s; }
        .input-field:focus { border-color:rgba(99,102,241,0.6); background:rgba(99,102,241,0.06); box-shadow:0 0 0 3px rgba(99,102,241,0.1); }
        .input-field::placeholder { color:rgba(165,180,252,0.25); }
        .grain { position:fixed; inset:0; z-index:0; pointer-events:none; opacity:0.04; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); background-size:200px; }
      `}</style>

      <div className="grain"/>

      {/* cursor */}
      {trail.map((t) => (<div key={t.id} style={{position:"fixed",left:t.x,top:t.y,width:6,height:6,borderRadius:"50%",pointerEvents:"none",zIndex:9999,background:"rgba(99,102,241,0.7)",transform:"translate(-50%,-50%)",animation:"trailFade 0.5s ease forwards"}}/>))}
      <div style={{position:"fixed",left:mouse.x*window.innerWidth,top:mouse.y*window.innerHeight,width:18,height:18,borderRadius:"50%",pointerEvents:"none",zIndex:9999,border:"2px solid rgba(99,102,241,0.8)",transform:"translate(-50%,-50%)",boxShadow:"0 0 16px rgba(99,102,241,0.5)"}}/>

      {/* bg */}
      <div style={{position:"fixed",inset:0,background:"radial-gradient(ellipse at 70% 40%,rgba(60,20,140,0.3) 0%,transparent 50%),radial-gradient(ellipse at 20% 70%,rgba(20,60,160,0.2) 0%,transparent 50%),#00000a",zIndex:0}}/>
      <div style={{position:"fixed",inset:0,backgroundImage:"linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px)",backgroundSize:"60px 60px",zIndex:0,maskImage:"radial-gradient(ellipse 80% 80% at 50% 50%,black,transparent)"}}/>
      <div style={{position:"fixed",inset:0,background:`radial-gradient(ellipse 600px 500px at ${mouse.x*100}% ${mouse.y*100}%,rgba(99,102,241,0.07) 0%,transparent 70%)`,zIndex:0,pointerEvents:"none"}}/>

      {/* floating decoration */}
      <div style={{position:"fixed",left:"5%",top:"50%",transform:"translateY(-50%)",zIndex:1,opacity:0.3}}>
        {[0,1,2,3].map(i=>(
          <div key={i} style={{width:200,height:200,borderRadius:"50%",border:`1px solid rgba(99,102,241,${0.12-i*0.02})`,position:"absolute",top:"50%",left:"50%",transform:`translate(-50%,-50%) scale(${1+i*0.4})`,animation:`float ${4+i}s ease-in-out infinite`,animationDelay:`${i*0.5}s`}}/>
        ))}
        <div style={{fontSize:32,textAlign:"center",animation:"float 3s ease-in-out infinite"}}>🚀</div>
      </div>

      {/* MAIN CARD */}
      <div style={{...tiltStyle,position:"relative",zIndex:10,width:"100%",maxWidth:460,animation:"fadeUp 0.7s ease both"}}>
        {success ? (
          <div style={{background:"rgba(8,8,24,0.95)",border:"1px solid rgba(52,211,153,0.3)",borderRadius:24,padding:"60px 40px",backdropFilter:"blur(30px)",textAlign:"center",animation:"successPop 0.5s ease both"}}>
            <div style={{fontSize:56,marginBottom:16}}>🎉</div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:800,color:"#6ee7b7",marginBottom:8}}>Account Created!</h2>
            <p style={{fontSize:14,color:"rgba(165,180,252,0.5)"}}>Redirecting to login...</p>
          </div>
        ) : (
          <div style={{background:"rgba(8,8,24,0.95)",border:"1px solid rgba(99,102,241,0.2)",borderRadius:24,padding:"48px 40px",backdropFilter:"blur(30px)",boxShadow:"0 32px 80px rgba(0,0,0,0.7)"}}>
            <div style={{position:"absolute",top:0,left:"20%",right:"20%",height:1,background:"linear-gradient(90deg,transparent,rgba(99,102,241,0.6),rgba(192,132,252,0.6),transparent)"}}/>

            <div style={{textAlign:"center",marginBottom:36}}>
              <div style={{width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,margin:"0 auto 16px",boxShadow:"0 8px 24px rgba(99,102,241,0.4)"}}>☄</div>
              <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:"#f8fafc",marginBottom:6,letterSpacing:"-0.5px"}}>Join CometAI</h1>
              <p style={{fontSize:13,color:"rgba(165,180,252,0.45)"}}>Create your account and start exploring</p>
            </div>

            {error && (<div style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:10,padding:"10px 14px",marginBottom:20,fontSize:13,color:"#f87171"}}>⚠ {error}</div>)}

            {[{label:"Full Name",val:name,set:setName,type:"text",ph:"Vishaal Kumar"},{label:"Email",val:email,set:setEmail,type:"email",ph:"your@email.com"},{label:"Password",val:password,set:setPassword,type:"password",ph:"Min 6 characters"}].map((f,i)=>(
              <div key={i} style={{marginBottom:16}}>
                <label style={{fontSize:11,color:"rgba(165,180,252,0.45)",letterSpacing:"1.5px",textTransform:"uppercase",display:"block",marginBottom:8,fontFamily:"'Space Mono',monospace"}}>{f.label}</label>
                <input className="input-field" type={f.type} placeholder={f.ph} value={f.val} onChange={e=>f.set(e.target.value)} onKeyPress={e=>{if(e.key==="Enter")handleRegister();}}/>
              </div>
            ))}

            <div style={{marginBottom:28}}/>

            <button onClick={handleRegister} disabled={loading} style={{
              width:"100%",padding:"15px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
              border:"none",borderRadius:12,color:"white",fontFamily:"'DM Sans',sans-serif",
              fontSize:16,fontWeight:600,cursor:"pointer",transition:"all 0.3s",
              boxShadow:"0 8px 24px rgba(99,102,241,0.4)"
            }}>
              {loading ? "Creating account..." : "Create Account →"}
            </button>

            <div style={{textAlign:"center",marginTop:24,fontSize:13,color:"rgba(165,180,252,0.4)"}}>
              Already have an account?{" "}
              <span style={{color:"#818cf8",cursor:"pointer"}} onClick={()=>navigate("/login")}>Sign in</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}