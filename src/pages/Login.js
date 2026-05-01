/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND = "https://cometai-backend.onrender.com";

export default function Login({ setUser, darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  const gold   = "#c9a84c";
  const bg     = darkMode ? "#0e0c09"  : "#faf8f4";
  const card   = darkMode ? "#1c1810"  : "#ffffff";
  const cardBd = darkMode ? "rgba(201,168,76,0.25)" : "rgba(201,168,76,0.2)";
  const txt    = darkMode ? "#f5f0e8"  : "#1a1410";
  const txtSub = darkMode ? "#b8a882"  : "#6b5e45";
  const txtMut = darkMode ? "#7a6e5a"  : "#9e8f78";
  const inputBg= darkMode ? "rgba(255,255,255,0.06)" : "#ffffff";
  const inputBd= darkMode ? "rgba(201,168,76,0.3)"  : "rgba(201,168,76,0.25)";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const r = await fetch(`${BACKEND}/login`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ email, password }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.message || "Login failed"); setLoading(false); return; }
      localStorage.setItem("token", d.token);
      localStorage.setItem("user",  JSON.stringify(d.user));
      setUser(d.user);
      navigate("/search");
    } catch { setError("Connection error. Please try again."); setLoading(false); }
  };

  return (
    <div style={{
      minHeight:"100vh", background:bg, display:"flex",
      alignItems:"center", justifyContent:"center",
      padding:"24px", fontFamily:"'Georgia','Times New Roman',serif",
      transition:"background 0.4s",
      position:"relative", overflow:"hidden",
    }}>
      {/* Background orbs */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
        <div style={{
          position:"absolute",width:500,height:500,borderRadius:"50%",
          background:darkMode?"radial-gradient(circle,rgba(201,168,76,0.06) 0%,transparent 70%)":"radial-gradient(circle,rgba(201,168,76,0.09) 0%,transparent 70%)",
          top:"-150px",left:"-150px",
          animation:"lgOrb1 14s ease-in-out infinite",
        }}/>
        <div style={{
          position:"absolute",width:350,height:350,borderRadius:"50%",
          background:darkMode?"radial-gradient(circle,rgba(201,168,76,0.04) 0%,transparent 70%)":"radial-gradient(circle,rgba(201,168,76,0.06) 0%,transparent 70%)",
          bottom:"-80px",right:"-80px",
          animation:"lgOrb2 18s ease-in-out infinite",
        }}/>
      </div>
      <style>{`
        @keyframes lgOrb1{0%,100%{transform:translate(0,0)}50%{transform:translate(30px,-30px)}}
        @keyframes lgOrb2{0%,100%{transform:translate(0,0)}50%{transform:translate(-20px,20px)}}
        .lgInput:focus{border-color:#c9a84c!important;box-shadow:0 0 0 3px rgba(201,168,76,0.15)!important;outline:none!important}
        .lgBtn:hover{transform:translateY(-2px)!important;box-shadow:0 8px 28px rgba(201,168,76,0.4)!important}
        .lgLink:hover{color:#c9a84c!important}
      `}</style>

      <div style={{
        width:"100%", maxWidth:440, zIndex:1, position:"relative",
      }}>
        {/* Top nav-ish */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:32}}>
          <button onClick={()=>navigate("/")} style={{
            background:"transparent",border:"none",color:txtSub,cursor:"pointer",
            fontSize:14,display:"flex",alignItems:"center",gap:6,padding:0,
          }}>← Back</button>
          <button onClick={toggleDarkMode} style={{
            background:"transparent",border:`1px solid ${cardBd}`,color:txt,
            cursor:"pointer",fontSize:13,padding:"6px 14px",borderRadius:8,
          }}>
            {darkMode?"☀️ Light":"🌙 Dark"}
          </button>
        </div>

        {/* Card */}
        <div style={{
          background:card,
          border:`1px solid ${cardBd}`,
          borderRadius:24, padding:"40px 36px 36px",
          boxShadow: darkMode
            ? "0 20px 60px rgba(0,0,0,0.5)"
            : "0 20px 60px rgba(201,168,76,0.1)",
          backdropFilter:"blur(12px)",
        }}>
          {/* Logo */}
          <div style={{textAlign:"center",marginBottom:32}}>
            <div style={{
              width:52,height:52,borderRadius:"50%",
              border:`2px solid ${gold}`,
              display:"flex",alignItems:"center",justifyContent:"center",
              color:gold,fontSize:18,fontWeight:700,margin:"0 auto 14px",
              background: darkMode?"rgba(201,168,76,0.08)":"rgba(201,168,76,0.06)",
            }}>A</div>
            <h1 style={{fontSize:22,fontWeight:700,color:txt,letterSpacing:"0.12em",marginBottom:4}}>ALVRYN</h1>
            <p style={{fontSize:12,color:txtMut,letterSpacing:"0.22em",fontFamily:"sans-serif"}}>TRAVEL BEYOND</p>
          </div>

          <h2 style={{fontSize:20,fontWeight:400,color:txt,marginBottom:6,textAlign:"center"}}>Welcome back</h2>
          <p style={{fontSize:13,color:txtSub,textAlign:"center",marginBottom:28,fontFamily:"sans-serif"}}>Sign in to your account</p>

          {error && (
            <div style={{
              background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.3)",
              borderRadius:10,padding:"12px 16px",marginBottom:20,
              fontSize:13,color:"#ef4444",textAlign:"center",fontFamily:"sans-serif",
            }}>{error}</div>
          )}

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div style={{marginBottom:18}}>
              <label style={{fontSize:11,fontWeight:700,letterSpacing:"0.14em",color:txtSub,fontFamily:"sans-serif",display:"block",marginBottom:8}}>
                EMAIL ADDRESS
              </label>
              <input
                className="lgInput"
                type="email" placeholder="you@example.com"
                value={email} onChange={e=>setEmail(e.target.value)} required
                style={{
                  width:"100%",padding:"13px 16px",borderRadius:10,fontSize:15,
                  border:`1.5px solid ${inputBd}`,background:inputBg,color:txt,
                  transition:"all 0.2s",boxSizing:"border-box",fontFamily:"sans-serif",
                }}
              />
            </div>

            {/* Password */}
            <div style={{marginBottom:24}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <label style={{fontSize:11,fontWeight:700,letterSpacing:"0.14em",color:txtSub,fontFamily:"sans-serif"}}>
                  PASSWORD
                </label>
                <button type="button" onClick={()=>setShowPass(s=>!s)}
                  style={{background:"transparent",border:"none",color:gold,fontSize:12,cursor:"pointer",padding:0,fontFamily:"sans-serif"}}>
                  {showPass?"Hide":"Show"}
                </button>
              </div>
              <input
                className="lgInput"
                type={showPass?"text":"password"} placeholder="Your password"
                value={password} onChange={e=>setPassword(e.target.value)} required
                style={{
                  width:"100%",padding:"13px 16px",borderRadius:10,fontSize:15,
                  border:`1.5px solid ${inputBd}`,background:inputBg,color:txt,
                  transition:"all 0.2s",boxSizing:"border-box",fontFamily:"sans-serif",
                }}
              />
            </div>

            <button type="submit" className="lgBtn" disabled={loading} style={{
              width:"100%",padding:"14px",borderRadius:12,
              background:`linear-gradient(135deg,${gold},#f0d080,${gold})`,
              border:"none",color:"#1a1410",fontWeight:700,fontSize:15,
              cursor:loading?"not-allowed":"pointer",
              transition:"all 0.3s",letterSpacing:"0.03em",
              opacity:loading?0.7:1,
            }}>
              {loading?"Signing in…":"Sign In →"}
            </button>
          </form>

          <div style={{textAlign:"center",marginTop:24}}>
            <p style={{fontSize:13,color:txtSub,fontFamily:"sans-serif"}}>
              Don't have an account?{" "}
              <button className="lgLink" onClick={()=>navigate("/register")}
                style={{background:"transparent",border:"none",color:gold,fontWeight:700,cursor:"pointer",fontSize:13,padding:0,transition:"color 0.2s"}}>
                Create one →
              </button>
            </p>
          </div>

          <div style={{
            marginTop:28,padding:"16px",borderRadius:12,
            background: darkMode?"rgba(201,168,76,0.07)":"rgba(201,168,76,0.06)",
            border:`1px solid ${darkMode?"rgba(201,168,76,0.2)":"rgba(201,168,76,0.15)"}`,
            textAlign:"center",
          }}>
            <p style={{fontSize:12,color:txtSub,fontFamily:"sans-serif",lineHeight:1.6,margin:0}}>
              ✈️ Search flights, buses & hotels with AI<br/>
              🔒 Secure · 0 extra charges · Book on partner sites
            </p>
          </div>
        </div>

        <p style={{textAlign:"center",marginTop:20,fontSize:11,color:txtMut,fontFamily:"sans-serif"}}>
          © 2026 Alvryn · alvryn.in
        </p>
      </div>
    </div>
  );
}