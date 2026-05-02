/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const API = "https://cometai-backend.onrender.com";

export default function Login({ setUser, darkMode, toggleDarkMode }) {
  const navigate = useNavigate();

  // Skip if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp && payload.exp * 1000 > Date.now()) { navigate("/search"); return; }
      } catch {}
    }
  }, [navigate]);

  const [form, setForm]       = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  // ── Colour palette — reacts to darkMode prop ─────────────────────────────
  const gold    = "#c9a84c";
  const bg      = darkMode ? "#0e0c09"  : "#faf8f4";
  const card    = darkMode ? "#1c1810"  : "#ffffff";
  const bd      = darkMode ? "rgba(201,168,76,0.28)" : "rgba(201,168,76,0.22)";
  const txt     = darkMode ? "#f5f0e8"  : "#1a1410";
  const txt2    = darkMode ? "#b8a882"  : "#6b5e45";
  const txtMut  = darkMode ? "#7a6e5a"  : "#9e8f78";
  const inputBg = darkMode ? "rgba(255,255,255,0.06)" : "#ffffff";
  const inputBd = darkMode ? "rgba(201,168,76,0.32)"  : "rgba(201,168,76,0.26)";
  const labelC  = darkMode ? "#9e8a6a"  : "#5a4a3a";

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Please fill all fields."); return; }
    setLoading(true); setError("");
    try {
      const res  = await fetch(`${API}/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Login failed."); setLoading(false); return; }
      localStorage.setItem("token", data.token);
      const userObj = data.user || { name: form.email.split("@")[0], email: form.email };
      localStorage.setItem("user", JSON.stringify(userObj));
      if (setUser) setUser(userObj);
      navigate("/search");
    } catch { setError("Connection error. Please try again."); }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", padding: "13px 16px", borderRadius: 12,
    fontFamily: "sans-serif", fontSize: 15, color: txt,
    border: `1.5px solid ${inputBd}`, outline: "none",
    background: inputBg, transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: bg, fontFamily: "sans-serif", padding: "20px",
      boxSizing: "border-box", transition: "background 0.4s",
      position: "relative", overflow: "hidden",
    }}>
      {/* Aurora orbs */}
      <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden" }}>
        <div style={{
          position:"absolute",width:480,height:480,borderRadius:"50%",
          background: darkMode
            ? "radial-gradient(circle,rgba(201,168,76,0.07) 0%,transparent 70%)"
            : "radial-gradient(circle,rgba(201,168,76,0.10) 0%,transparent 70%)",
          top:"-160px",left:"-160px",
          animation:"lgOrb1 14s ease-in-out infinite",
        }}/>
        <div style={{
          position:"absolute",width:320,height:320,borderRadius:"50%",
          background: darkMode
            ? "radial-gradient(circle,rgba(201,168,76,0.04) 0%,transparent 70%)"
            : "radial-gradient(circle,rgba(201,168,76,0.06) 0%,transparent 70%)",
          bottom:"-60px",right:"-60px",
          animation:"lgOrb2 18s ease-in-out infinite",
        }}/>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;600;700&display=swap');
        @keyframes lgOrb1{0%,100%{transform:translate(0,0)}50%{transform:translate(30px,-30px)}}
        @keyframes lgOrb2{0%,100%{transform:translate(0,0)}50%{transform:translate(-20px,20px)}}
        @keyframes lgFadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes lgGrad{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
        @keyframes lgFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes lgSpin{to{transform:rotate(360deg)}}
        *{box-sizing:border-box;}
        input:-webkit-autofill{
          -webkit-box-shadow:0 0 0 100px ${inputBg} inset !important;
          -webkit-text-fill-color:${txt} !important;
        }
        .lgInp:focus{
          border-color:${gold} !important;
          box-shadow:0 0 0 3px rgba(201,168,76,0.12) !important;
        }
        .lgSubBtn:hover{opacity:0.9;transform:translateY(-1px);}
        .lgLink:hover{opacity:0.8;}
      `}</style>

      <div style={{ width:"100%",maxWidth:430,zIndex:1,position:"relative",
        animation:"lgFadeUp 0.45s both" }}>

        {/* Top row — back + dark toggle */}
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28 }}>
          <button onClick={()=>navigate("/")}
            style={{ background:"transparent",border:"none",color:txt2,cursor:"pointer",
              fontSize:14,display:"flex",alignItems:"center",gap:6,padding:0 }}>← Back</button>
          {toggleDarkMode && (
            <button onClick={toggleDarkMode}
              style={{ background:"transparent",border:`1px solid ${bd}`,color:txt,
                cursor:"pointer",fontSize:13,padding:"6px 14px",borderRadius:8 }}>
              {darkMode?"☀️ Light":"🌙 Dark"}
            </button>
          )}
        </div>

        {/* Card */}
        <div style={{
          background: card,
          border: `1px solid ${bd}`,
          borderRadius: 22, padding: "clamp(24px,5vw,38px) clamp(20px,5vw,34px)",
          boxShadow: darkMode
            ? "0 20px 60px rgba(0,0,0,0.55)"
            : "0 20px 60px rgba(201,168,76,0.1)",
          backdropFilter: "blur(12px)",
        }}>

          {/* Logo */}
          <div style={{ textAlign:"center",marginBottom:28 }}>
            <div style={{ animation:"lgFloat 4s ease-in-out infinite",display:"inline-block",marginBottom:14 }}>
              <svg width="52" height="52" viewBox="0 0 64 64" fill="none">
                <defs><linearGradient id="lgLg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c9a84c"/><stop offset="55%" stopColor="#f0d080"/>
                  <stop offset="100%" stopColor="#4ade80"/>
                </linearGradient></defs>
                <circle cx="32" cy="32" r="30" stroke="url(#lgLg)" strokeWidth="1.5" fill="none"/>
                <path d="M20 46L28 18L36 46" stroke="url(#lgLg)" strokeWidth="2.4" strokeLinecap="round" fill="none"/>
                <path d="M23 37L34 37" stroke="url(#lgLg)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:24,
              color:txt,letterSpacing:"0.12em" }}>ALVRYN</div>
            <div style={{ fontSize:11,color:txtMut,letterSpacing:"0.22em",marginTop:3 }}>TRAVEL BEYOND</div>
          </div>

          <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:22,
            color:txt,marginBottom:5,textAlign:"center" }}>Welcome back</h2>
          <p style={{ fontSize:13,color:txt2,textAlign:"center",marginBottom:24 }}>
            Sign in to continue your journey
          </p>

          {/* Error */}
          {error && (
            <div style={{ background: darkMode?"rgba(239,68,68,0.14)":"#fff0f0",
              border:"1px solid rgba(239,68,68,0.28)",
              borderRadius:10,padding:"11px 14px",marginBottom:18,
              fontSize:13,color:"#ef4444",fontWeight:500 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={submit}>
            {/* Email */}
            <div style={{ marginBottom:16 }}>
              <label style={{ display:"block",fontSize:11,fontWeight:700,
                color:labelC,marginBottom:7,letterSpacing:"0.08em" }}>EMAIL</label>
              <input className="lgInp" name="email" type="email"
                value={form.email} onChange={handle}
                placeholder="you@example.com" required style={inputStyle}/>
            </div>

            {/* Password */}
            <div style={{ marginBottom:24 }}>
              <label style={{ display:"block",fontSize:11,fontWeight:700,
                color:labelC,marginBottom:7,letterSpacing:"0.08em" }}>PASSWORD</label>
              <div style={{ position:"relative" }}>
                <input className="lgInp" name="password"
                  type={showPass?"text":"password"}
                  value={form.password} onChange={handle}
                  placeholder="Your password" required
                  style={{ ...inputStyle, paddingRight:48 }}/>
                <button type="button" onClick={()=>setShowPass(s=>!s)}
                  style={{ position:"absolute",right:12,top:"50%",
                    transform:"translateY(-50%)",
                    background:"none",border:"none",cursor:"pointer",
                    color:txt2,fontSize:12,padding:2,
                    fontFamily:"sans-serif",fontWeight:600 }}>
                  {showPass?"Hide":"Show"}
                </button>
              </div>
            </div>

            <button type="submit" className="lgSubBtn" disabled={loading}
              style={{ width:"100%",padding:"14px",borderRadius:12,fontSize:15,
                fontWeight:700,fontFamily:"'Cormorant Garamond',serif",
                letterSpacing:"0.06em",color:"#1a1410",border:"none",
                cursor:loading?"not-allowed":"pointer",
                background:"linear-gradient(135deg,#c9a84c,#f0d080,#c9a84c)",
                backgroundSize:"200% 200%",animation:"lgGrad 3s ease infinite",
                boxShadow:"0 6px 20px rgba(201,168,76,0.32)",
                transition:"all 0.18s",opacity:loading?0.7:1 }}>
              {loading
                ? <span style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
                    <span style={{ width:14,height:14,border:"2px solid rgba(26,20,16,0.25)",
                      borderTopColor:"#1a1410",borderRadius:"50%",
                      animation:"lgSpin 0.8s linear infinite",display:"inline-block" }}/>
                    Signing in…
                  </span>
                : "Sign In →"
              }
            </button>
          </form>

          <div style={{ textAlign:"center",marginTop:22,fontSize:14,color:txt2 }}>
            Don't have an account?{" "}
            <Link to="/register" className="lgLink"
              style={{ color:gold,fontWeight:700,textDecoration:"none",transition:"opacity 0.15s" }}>
              Create one free →
            </Link>
          </div>

          {/* Trust badge */}
          <div style={{ marginTop:24,padding:"14px 16px",borderRadius:12,
            background: darkMode ? "rgba(201,168,76,0.07)" : "rgba(201,168,76,0.06)",
            border:`1px solid ${darkMode?"rgba(201,168,76,0.2)":"rgba(201,168,76,0.15)"}`,
            textAlign:"center" }}>
            <p style={{ fontSize:12,color:txt2,lineHeight:1.65,margin:0 }}>
              ✈️ Search flights, buses & hotels with AI<br/>
              🔒 Secure · 0 extra charges · Book on partner sites
            </p>
          </div>
        </div>

        <p style={{ textAlign:"center",marginTop:18,fontSize:11,color:txtMut }}>
          By continuing you agree to Alvryn's Terms of Service
        </p>
      </div>
    </div>
  );
}