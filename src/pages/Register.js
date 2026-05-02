/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const API = "https://cometai-backend.onrender.com";

export default function Register({ setUser, darkMode, toggleDarkMode }) {
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

  const [form, setForm]       = useState({ name:"", email:"", password:"", confirm:"" });
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [showRef,  setShowRef]  = useState(false);
  const [refCode,  setRefCode]  = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const [passStrength, setPassStr] = useState(0);

  // ── Colour palette ────────────────────────────────────────────────────────
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

  const handle = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (name === "password") {
      let s = 0;
      if (value.length >= 6)  s++;
      if (value.length >= 10) s++;
      if (/[A-Z]/.test(value)) s++;
      if (/[0-9]/.test(value)) s++;
      if (/[^A-Za-z0-9]/.test(value)) s++;
      setPassStr(s);
    }
  };

  const strengthLabel = ["","Weak","Fair","Good","Strong","Very Strong"][passStrength]||"";
  const strengthColor = ["","#ef4444","#f59e0b","#eab308","#22c55e","#16a34a"][passStrength]||"#ccc";

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError("Please fill all fields."); return; }
    if (form.password !== form.confirm) { setError("Passwords don't match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      const res  = await fetch(`${API}/register`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(), email: form.email.trim(),
          password: form.password,
          ...(refCode.trim() ? { ref: refCode.trim().toUpperCase() } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Registration failed."); setLoading(false); return; }
      if (data.token) {
        localStorage.setItem("token", data.token);
        const userObj = data.user || { name: form.name, email: form.email };
        localStorage.setItem("user", JSON.stringify(userObj));
        if (setUser) setUser(userObj);
        navigate("/search");
      } else {
        setSuccess("🎉 Account created! Ref code: " + (data.refCode||""));
        setTimeout(() => navigate("/login"), 2200);
      }
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

  const perks = [
    { e:"✈️", t:"Search flights with AI" },
    { e:"🚌", t:"Instant bus booking links" },
    { e:"🏨", t:"Hotel search across India" },
    { e:"💰", t:"Earn ₹150 per referral" },
  ];

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "flex-start",
      justifyContent: "center",
      background: bg, fontFamily: "sans-serif",
      padding: "24px 20px 40px",
      boxSizing: "border-box", transition: "background 0.4s",
      position: "relative", overflow: "hidden",
    }}>
      {/* Aurora orbs */}
      <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden" }}>
        <div style={{
          position:"absolute",width:520,height:520,borderRadius:"50%",
          background: darkMode
            ? "radial-gradient(circle,rgba(201,168,76,0.06) 0%,transparent 70%)"
            : "radial-gradient(circle,rgba(201,168,76,0.09) 0%,transparent 70%)",
          top:"-180px",right:"-100px",
          animation:"rgOrb1 13s ease-in-out infinite",
        }}/>
        <div style={{
          position:"absolute",width:300,height:300,borderRadius:"50%",
          background: darkMode
            ? "radial-gradient(circle,rgba(201,168,76,0.04) 0%,transparent 70%)"
            : "radial-gradient(circle,rgba(201,168,76,0.06) 0%,transparent 70%)",
          bottom:"-60px",left:"-60px",
          animation:"rgOrb2 16s ease-in-out infinite",
        }}/>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;600;700&display=swap');
        @keyframes rgOrb1{0%,100%{transform:translate(0,0)}50%{transform:translate(-25px,25px)}}
        @keyframes rgOrb2{0%,100%{transform:translate(0,0)}50%{transform:translate(20px,-20px)}}
        @keyframes rgFadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes rgGrad{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
        @keyframes rgFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes rgSpin{to{transform:rotate(360deg)}}
        *{box-sizing:border-box;}
        input:-webkit-autofill{
          -webkit-box-shadow:0 0 0 100px ${inputBg} inset !important;
          -webkit-text-fill-color:${txt} !important;
        }
        .rgInp:focus{
          border-color:${gold} !important;
          box-shadow:0 0 0 3px rgba(201,168,76,0.12) !important;
        }
        .rgSubBtn:hover{opacity:0.9;transform:translateY(-1px);}
        .rgLink:hover{opacity:0.8;}
      `}</style>

      <div style={{ width:"100%",maxWidth:460,zIndex:1,position:"relative",
        paddingTop:16,animation:"rgFadeUp 0.45s both" }}>

        {/* Top row */}
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24 }}>
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
          borderRadius: 22, padding: "clamp(22px,5vw,36px) clamp(18px,5vw,32px)",
          boxShadow: darkMode
            ? "0 20px 60px rgba(0,0,0,0.55)"
            : "0 20px 60px rgba(201,168,76,0.1)",
          backdropFilter: "blur(12px)",
        }}>

          {/* Logo */}
          <div style={{ textAlign:"center",marginBottom:24 }}>
            <div style={{ animation:"rgFloat 4s ease-in-out infinite",display:"inline-block",marginBottom:12 }}>
              <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
                <defs><linearGradient id="rgLg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c9a84c"/><stop offset="55%" stopColor="#f0d080"/>
                  <stop offset="100%" stopColor="#4ade80"/>
                </linearGradient></defs>
                <circle cx="32" cy="32" r="30" stroke="url(#rgLg)" strokeWidth="1.5" fill="none"/>
                <path d="M20 46L28 18L36 46" stroke="url(#rgLg)" strokeWidth="2.4" strokeLinecap="round" fill="none"/>
                <path d="M23 37L34 37" stroke="url(#rgLg)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:22,
              color:txt,letterSpacing:"0.12em" }}>ALVRYN</div>
            <div style={{ fontSize:11,color:txtMut,letterSpacing:"0.22em",marginTop:3 }}>TRAVEL BEYOND</div>
          </div>

          <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:20,
            color:txt,marginBottom:4,textAlign:"center" }}>Create your account</h2>
          <p style={{ fontSize:13,color:txt2,textAlign:"center",marginBottom:20 }}>
            Free forever · No credit card needed
          </p>

          {/* Perks grid */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20 }}>
            {perks.map(p=>(
              <div key={p.t} style={{
                background: darkMode ? "rgba(201,168,76,0.08)" : "rgba(201,168,76,0.06)",
                border:`1px solid ${darkMode?"rgba(201,168,76,0.2)":"rgba(201,168,76,0.14)"}`,
                borderRadius:10,padding:"10px 12px",
                display:"flex",alignItems:"center",gap:8,
              }}>
                <span style={{ fontSize:16 }}>{p.e}</span>
                <span style={{ fontSize:12,color:txt2,lineHeight:1.4 }}>{p.t}</span>
              </div>
            ))}
          </div>

          {/* Error / Success */}
          {error && (
            <div style={{ background:darkMode?"rgba(239,68,68,0.13)":"#fff0f0",
              border:"1px solid rgba(239,68,68,0.28)",borderRadius:10,
              padding:"11px 14px",marginBottom:16,
              fontSize:13,color:"#ef4444",fontWeight:500 }}>
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div style={{ background:darkMode?"rgba(74,222,128,0.1)":"rgba(74,222,128,0.1)",
              border:"1px solid rgba(74,222,128,0.3)",borderRadius:10,
              padding:"11px 14px",marginBottom:16,
              fontSize:13,color:"#16a34a",fontWeight:500 }}>
              {success}
            </div>
          )}

          <form onSubmit={submit}>
            {/* Name */}
            <div style={{ marginBottom:14 }}>
              <label style={{ display:"block",fontSize:11,fontWeight:700,
                color:labelC,marginBottom:6,letterSpacing:"0.08em" }}>FULL NAME</label>
              <input className="rgInp" name="name" type="text"
                value={form.name} onChange={handle}
                placeholder="Your name" required style={inputStyle}/>
            </div>

            {/* Email */}
            <div style={{ marginBottom:14 }}>
              <label style={{ display:"block",fontSize:11,fontWeight:700,
                color:labelC,marginBottom:6,letterSpacing:"0.08em" }}>EMAIL ADDRESS</label>
              <input className="rgInp" name="email" type="email"
                value={form.email} onChange={handle}
                placeholder="you@example.com" required style={inputStyle}/>
            </div>

            {/* Password */}
            <div style={{ marginBottom:8 }}>
              <label style={{ display:"block",fontSize:11,fontWeight:700,
                color:labelC,marginBottom:6,letterSpacing:"0.08em" }}>PASSWORD</label>
              <div style={{ position:"relative" }}>
                <input className="rgInp" name="password"
                  type={showPass?"text":"password"}
                  value={form.password} onChange={handle}
                  placeholder="Min. 6 characters" required
                  style={{ ...inputStyle, paddingRight:52 }}/>
                <button type="button" onClick={()=>setShowPass(s=>!s)}
                  style={{ position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",
                    background:"none",border:"none",cursor:"pointer",color:txt2,
                    fontSize:12,fontWeight:600,padding:2 }}>
                  {showPass?"Hide":"Show"}
                </button>
              </div>
              {/* Strength bar */}
              {form.password.length > 0 && (
                <div style={{ marginTop:7 }}>
                  <div style={{ display:"flex",gap:3,marginBottom:3 }}>
                    {[1,2,3,4,5].map(n=>(
                      <div key={n} style={{ flex:1,height:3,borderRadius:3,
                        background: passStrength>=n ? strengthColor : (darkMode?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.08)"),
                        transition:"background 0.2s" }}/>
                    ))}
                  </div>
                  <div style={{ fontSize:11,color:strengthColor,fontWeight:600 }}>{strengthLabel}</div>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div style={{ marginBottom:16 }}>
              <label style={{ display:"block",fontSize:11,fontWeight:700,
                color:labelC,marginBottom:6,letterSpacing:"0.08em" }}>CONFIRM PASSWORD</label>
              <div style={{ position:"relative" }}>
                <input className="rgInp" name="confirm"
                  type={showConf?"text":"password"}
                  value={form.confirm} onChange={handle}
                  placeholder="Re-enter password" required
                  style={{ ...inputStyle, paddingRight:52,
                    borderColor: form.confirm && form.confirm!==form.password
                      ? "rgba(239,68,68,0.5)" : inputBd }}/>
                <button type="button" onClick={()=>setShowConf(s=>!s)}
                  style={{ position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",
                    background:"none",border:"none",cursor:"pointer",color:txt2,
                    fontSize:12,fontWeight:600,padding:2 }}>
                  {showConf?"Hide":"Show"}
                </button>
              </div>
              {form.confirm && form.confirm !== form.password && (
                <div style={{ fontSize:11,color:"#ef4444",marginTop:5,fontWeight:500 }}>
                  ✗ Passwords don't match
                </div>
              )}
              {form.confirm && form.confirm === form.password && form.confirm.length > 0 && (
                <div style={{ fontSize:11,color:"#16a34a",marginTop:5,fontWeight:500 }}>
                  ✓ Passwords match
                </div>
              )}
            </div>

            {/* Referral code — hidden by default */}
            <div style={{ marginBottom:22 }}>
              {!showRef ? (
                <div style={{ fontSize:12,color:txtMut }}>
                  Have a referral code?{" "}
                  <button type="button" onClick={()=>setShowRef(true)}
                    style={{ background:"transparent",border:"none",color:gold,
                      cursor:"pointer",fontSize:12,padding:0,fontWeight:600 }}>
                    Enter it →
                  </button>
                </div>
              ) : (
                <>
                  <label style={{ display:"block",fontSize:11,fontWeight:700,
                    color:labelC,marginBottom:6,letterSpacing:"0.08em" }}>
                    REFERRAL CODE <span style={{ color:txtMut,fontWeight:400 }}>(optional)</span>
                  </label>
                  <input className="rgInp" type="text"
                    value={refCode} onChange={e=>setRefCode(e.target.value)}
                    placeholder="Friend's referral code"
                    style={{ ...inputStyle, textTransform:"uppercase",letterSpacing:"0.12em" }}/>
                </>
              )}
            </div>

            <button type="submit" className="rgSubBtn"
              disabled={loading || (!!form.confirm && form.confirm !== form.password)}
              style={{ width:"100%",padding:"14px",borderRadius:12,fontSize:15,
                fontWeight:700,fontFamily:"'Cormorant Garamond',serif",
                letterSpacing:"0.06em",color:"#1a1410",border:"none",
                cursor:(loading||(!!form.confirm&&form.confirm!==form.password))?"not-allowed":"pointer",
                background:"linear-gradient(135deg,#c9a84c,#f0d080,#c9a84c)",
                backgroundSize:"200% 200%",animation:"rgGrad 3s ease infinite",
                boxShadow:"0 6px 20px rgba(201,168,76,0.32)",
                transition:"all 0.18s",
                opacity:(loading||(!!form.confirm&&form.confirm!==form.password))?0.7:1 }}>
              {loading
                ? <span style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
                    <span style={{ width:14,height:14,border:"2px solid rgba(26,20,16,0.25)",
                      borderTopColor:"#1a1410",borderRadius:"50%",
                      animation:"rgSpin 0.8s linear infinite",display:"inline-block" }}/>
                    Creating account…
                  </span>
                : "Create Free Account →"
              }
            </button>
          </form>

          <div style={{ textAlign:"center",marginTop:20,fontSize:14,color:txt2 }}>
            Already have an account?{" "}
            <Link to="/login" className="rgLink"
              style={{ color:gold,fontWeight:700,textDecoration:"none",transition:"opacity 0.15s" }}>
              Sign in →
            </Link>
          </div>

          {/* Referral reward callout */}
          <div style={{ marginTop:22,padding:"14px 16px",borderRadius:12,
            background: darkMode ? "rgba(201,168,76,0.07)" : "rgba(201,168,76,0.06)",
            border:`1px solid ${darkMode?"rgba(201,168,76,0.2)":"rgba(201,168,76,0.15)"}`,
            textAlign:"center" }}>
            <p style={{ fontSize:12,color:txt2,lineHeight:1.7,margin:0 }}>
              💎 Refer a friend · Earn{" "}
              <strong style={{ color:gold }}>₹150</strong> when they book above ₹5,000<br/>
              🔒 Your data is secure and never sold
            </p>
          </div>
        </div>

        <p style={{ textAlign:"center",marginTop:18,fontSize:11,color:txtMut,lineHeight:1.6 }}>
          By creating an account you agree to Alvryn's Terms of Service.<br/>
          © 2026 Alvryn · alvryn.in
        </p>
      </div>
    </div>
  );
}