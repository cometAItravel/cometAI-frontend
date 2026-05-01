/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND = "https://cometai-backend.onrender.com";

export default function Register({ setUser, darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name:"", email:"", password:"", ref:"" });
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass]  = useState(false);
  const [showRef, setShowRef]    = useState(false);

  const gold   = "#c9a84c";
  const bg     = darkMode ? "#0e0c09"  : "#faf8f4";
  const card   = darkMode ? "#1c1810"  : "#ffffff";
  const cardBd = darkMode ? "rgba(201,168,76,0.25)" : "rgba(201,168,76,0.2)";
  const txt    = darkMode ? "#f5f0e8"  : "#1a1410";
  const txtSub = darkMode ? "#b8a882"  : "#6b5e45";
  const txtMut = darkMode ? "#7a6e5a"  : "#9e8f78";
  const inputBg= darkMode ? "rgba(255,255,255,0.06)" : "#ffffff";
  const inputBd= darkMode ? "rgba(201,168,76,0.3)"   : "rgba(201,168,76,0.25)";

  const set = (k) => (e) => setForm(f=>({...f,[k]:e.target.value}));

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); setLoading(false); return; }
    try {
      const r = await fetch(`${BACKEND}/register`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ name:form.name, email:form.email, password:form.password, ref:form.ref||undefined }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.message || "Registration failed"); setLoading(false); return; }
      setSuccess("🎉 Account created! Your referral code: " + d.refCode);
      setTimeout(() => navigate("/login"), 2200);
    } catch { setError("Connection error. Please try again."); }
    setLoading(false);
  };

  const inputStyle = {
    width:"100%",padding:"13px 16px",borderRadius:10,fontSize:15,
    border:`1.5px solid ${inputBd}`,background:inputBg,color:txt,
    transition:"all 0.2s",boxSizing:"border-box",fontFamily:"sans-serif",
  };
  const labelStyle = {
    fontSize:11,fontWeight:700,letterSpacing:"0.14em",color:txtSub,
    fontFamily:"sans-serif",display:"block",marginBottom:8,
  };

  const perks = [
    { e:"✈️", t:"Search flights with AI" },
    { e:"🚌", t:"Instant bus booking links" },
    { e:"🏨", t:"Hotel search across India" },
    { e:"💰", t:"Earn ₹150 per referral" },
  ];

  return (
    <div style={{
      minHeight:"100vh",background:bg,display:"flex",
      alignItems:"flex-start",justifyContent:"center",
      padding:"24px",fontFamily:"'Georgia','Times New Roman',serif",
      transition:"background 0.4s",position:"relative",overflow:"hidden",
    }}>
      {/* Background orbs */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
        <div style={{
          position:"absolute",width:550,height:550,borderRadius:"50%",
          background:darkMode?"radial-gradient(circle,rgba(201,168,76,0.05) 0%,transparent 70%)":"radial-gradient(circle,rgba(201,168,76,0.09) 0%,transparent 70%)",
          top:"-200px",right:"-100px",
          animation:"rgOrb1 13s ease-in-out infinite",
        }}/>
        <div style={{
          position:"absolute",width:300,height:300,borderRadius:"50%",
          background:darkMode?"radial-gradient(circle,rgba(201,168,76,0.04) 0%,transparent 70%)":"radial-gradient(circle,rgba(201,168,76,0.06) 0%,transparent 70%)",
          bottom:"-60px",left:"-60px",
          animation:"rgOrb2 16s ease-in-out infinite",
        }}/>
      </div>
      <style>{`
        @keyframes rgOrb1{0%,100%{transform:translate(0,0)}50%{transform:translate(-25px,25px)}}
        @keyframes rgOrb2{0%,100%{transform:translate(0,0)}50%{transform:translate(20px,-20px)}}
        .rgInput:focus{border-color:#c9a84c!important;box-shadow:0 0 0 3px rgba(201,168,76,0.15)!important;outline:none!important}
        .rgBtn:hover{transform:translateY(-2px)!important;box-shadow:0 8px 28px rgba(201,168,76,0.4)!important}
        .rgLink:hover{color:#c9a84c!important}
      `}</style>

      <div style={{width:"100%",maxWidth:480,zIndex:1,position:"relative",paddingTop:16}}>
        {/* Top bar */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
          <button onClick={()=>navigate("/")} style={{background:"transparent",border:"none",color:txtSub,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",gap:6,padding:0}}>← Back</button>
          <button onClick={toggleDarkMode} style={{background:"transparent",border:`1px solid ${cardBd}`,color:txt,cursor:"pointer",fontSize:13,padding:"6px 14px",borderRadius:8}}>
            {darkMode?"☀️ Light":"🌙 Dark"}
          </button>
        </div>

        {/* Card */}
        <div style={{
          background:card,border:`1px solid ${cardBd}`,borderRadius:24,
          padding:"36px 36px 32px",
          boxShadow:darkMode?"0 20px 60px rgba(0,0,0,0.5)":"0 20px 60px rgba(201,168,76,0.1)",
          backdropFilter:"blur(12px)",
        }}>
          {/* Logo */}
          <div style={{textAlign:"center",marginBottom:28}}>
            <div style={{
              width:50,height:50,borderRadius:"50%",border:`2px solid ${gold}`,
              display:"flex",alignItems:"center",justifyContent:"center",
              color:gold,fontSize:17,fontWeight:700,margin:"0 auto 12px",
              background:darkMode?"rgba(201,168,76,0.08)":"rgba(201,168,76,0.06)",
            }}>A</div>
            <h1 style={{fontSize:20,fontWeight:700,color:txt,letterSpacing:"0.12em",marginBottom:3}}>ALVRYN</h1>
            <p style={{fontSize:11,color:txtMut,letterSpacing:"0.22em",fontFamily:"sans-serif"}}>TRAVEL BEYOND</p>
          </div>

          <h2 style={{fontSize:19,fontWeight:400,color:txt,marginBottom:5,textAlign:"center"}}>Create your account</h2>
          <p style={{fontSize:13,color:txtSub,textAlign:"center",marginBottom:24,fontFamily:"sans-serif"}}>Free forever · No credit card needed</p>

          {/* Perks */}
          <div style={{
            display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,
            marginBottom:24,
          }}>
            {perks.map(p=>(
              <div key={p.t} style={{
                background:darkMode?"rgba(201,168,76,0.07)":"rgba(201,168,76,0.06)",
                border:`1px solid ${darkMode?"rgba(201,168,76,0.18)":"rgba(201,168,76,0.15)"}`,
                borderRadius:10,padding:"10px 12px",
                display:"flex",alignItems:"center",gap:8,
              }}>
                <span style={{fontSize:16}}>{p.e}</span>
                <span style={{fontSize:12,color:txtSub,fontFamily:"sans-serif",lineHeight:1.4}}>{p.t}</span>
              </div>
            ))}
          </div>

          {error && (
            <div style={{background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:10,padding:"12px 16px",marginBottom:18,fontSize:13,color:"#ef4444",textAlign:"center",fontFamily:"sans-serif"}}>
              {error}
            </div>
          )}
          {success && (
            <div style={{background:"rgba(74,222,128,0.12)",border:"1px solid rgba(74,222,128,0.3)",borderRadius:10,padding:"12px 16px",marginBottom:18,fontSize:13,color:"#4ade80",textAlign:"center",fontFamily:"sans-serif"}}>
              {success}
            </div>
          )}

          <form onSubmit={handleRegister}>
            {/* Name */}
            <div style={{marginBottom:16}}>
              <label style={labelStyle}>YOUR NAME</label>
              <input className="rgInput" type="text" placeholder="Vishaal" value={form.name} onChange={set("name")} required style={inputStyle}/>
            </div>

            {/* Email */}
            <div style={{marginBottom:16}}>
              <label style={labelStyle}>EMAIL ADDRESS</label>
              <input className="rgInput" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} required style={inputStyle}/>
            </div>

            {/* Password */}
            <div style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <label style={{...labelStyle,marginBottom:0}}>PASSWORD</label>
                <button type="button" onClick={()=>setShowPass(s=>!s)} style={{background:"transparent",border:"none",color:gold,fontSize:12,cursor:"pointer",padding:0,fontFamily:"sans-serif"}}>
                  {showPass?"Hide":"Show"}
                </button>
              </div>
              <input className="rgInput" type={showPass?"text":"password"} placeholder="Min. 6 characters" value={form.password} onChange={set("password")} required minLength={6} style={inputStyle}/>
            </div>

            {/* Referral code */}
            <div style={{marginBottom:24}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <label style={{...labelStyle,marginBottom:0}}>REFERRAL CODE <span style={{color:txtMut,fontWeight:400}}>(optional)</span></label>
                <button type="button" onClick={()=>setShowRef(s=>!s)} style={{background:"transparent",border:"none",color:txtMut,fontSize:11,cursor:"pointer",padding:0,fontFamily:"sans-serif"}}>
                  {showRef?"Hide":"Show"}
                </button>
              </div>
              {showRef && (
                <input className="rgInput" type="text" placeholder="Friend's referral code" value={form.ref} onChange={set("ref")} style={{...inputStyle,textTransform:"uppercase"}}/>
              )}
              {!showRef && (
                <div style={{fontSize:12,color:txtMut,fontFamily:"sans-serif"}}>
                  Have a referral code? <button type="button" onClick={()=>setShowRef(true)} style={{background:"transparent",border:"none",color:gold,cursor:"pointer",fontSize:12,padding:0}}>Enter it →</button>
                </div>
              )}
            </div>

            <button type="submit" className="rgBtn" disabled={loading} style={{
              width:"100%",padding:"14px",borderRadius:12,
              background:`linear-gradient(135deg,${gold},#f0d080,${gold})`,
              border:"none",color:"#1a1410",fontWeight:700,fontSize:15,
              cursor:loading?"not-allowed":"pointer",
              transition:"all 0.3s",letterSpacing:"0.03em",opacity:loading?0.7:1,
            }}>
              {loading?"Creating account…":"Create Free Account →"}
            </button>
          </form>

          <div style={{textAlign:"center",marginTop:20}}>
            <p style={{fontSize:13,color:txtSub,fontFamily:"sans-serif"}}>
              Already have an account?{" "}
              <button className="rgLink" onClick={()=>navigate("/login")} style={{background:"transparent",border:"none",color:gold,fontWeight:700,cursor:"pointer",fontSize:13,padding:0,transition:"color 0.2s"}}>
                Sign in →
              </button>
            </p>
          </div>

          <div style={{
            marginTop:24,padding:"14px 16px",borderRadius:12,
            background:darkMode?"rgba(201,168,76,0.07)":"rgba(201,168,76,0.06)",
            border:`1px solid ${darkMode?"rgba(201,168,76,0.2)":"rgba(201,168,76,0.15)"}`,
            textAlign:"center",
          }}>
            <p style={{fontSize:12,color:txtSub,fontFamily:"sans-serif",lineHeight:1.7,margin:0}}>
              💎 Refer a friend · Earn <strong style={{color:gold}}>₹150</strong> when they book above ₹5,000<br/>
              🔒 Your data is secure and never sold
            </p>
          </div>
        </div>

        <p style={{textAlign:"center",marginTop:20,fontSize:11,color:txtMut,fontFamily:"sans-serif"}}>
          By creating an account you agree to our Terms & Privacy Policy.<br/>
          © 2026 Alvryn · alvryn.in
        </p>
      </div>
    </div>
  );
}