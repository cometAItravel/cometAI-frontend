import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://cometai-backend.onrender.com";
const GOLD = "#c9a84c";
const GOLD_DARK = "#8B6914";
const GRAD = "linear-gradient(135deg,#c9a84c,#f0d080,#c9a84c)";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
  @keyframes floatUD{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
  @keyframes spinSlow{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
  @keyframes gradShift{0%,100%{background-position:0% 50%;}50%{background-position:100% 50%;}}
  ::-webkit-scrollbar{width:2px;}
  ::-webkit-scrollbar-thumb{background:linear-gradient(#c9a84c,#8B6914);}
  @media(max-width:600px){
    .pf-grid{grid-template-columns:1fr!important;}
    .tabs-row{overflow-x:auto!important;}
    .tabs-row button{min-width:80px!important;font-size:11px!important;padding:12px 8px!important;}
    .ref-btns{flex-direction:column!important;}
    .ref-btns button{width:100%!important;}
    .earn-grid{grid-template-columns:1fr!important;}
  }
`;

const AlvrynIcon = ({ size = 40 }) => {
  const uid = `up${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{flexShrink:0}}>
      <defs>
        <linearGradient id={`${uid}g`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c9a84c"/><stop offset="50%" stopColor="#f0d080"/><stop offset="100%" stopColor="#8B6914"/>
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" stroke={`url(#${uid}g)`} strokeWidth="1.2" fill="none"/>
      <circle cx="32" cy="32" r="26" stroke={`url(#${uid}g)`} strokeWidth="0.5" fill="none" opacity="0.4"/>
      <path d="M20 46 L28 18 L36 46" stroke={`url(#${uid}g)`} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M22.5 36 L33.5 36" stroke={`url(#${uid}g)`} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M26 46 L34 18 L42 46" stroke={`url(#${uid}g)`} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.45"/>
      <path d="M28 36 L40 36" stroke={`url(#${uid}g)`} strokeWidth="1" strokeLinecap="round" opacity="0.45"/>
      <circle cx="32" cy="9" r="1.5" fill={`url(#${uid}g)`}/>
      <path d="M29 9 L32 6 L35 9" stroke={`url(#${uid}g)`} strokeWidth="0.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

function AuroraBackground() {
  const ref = useRef(null);
  const raf = useRef(null);
  // Use a ref for blobColors to avoid useEffect dep issues
  const blobColors = ["#c9a84c","#f0d080","#8B6914","#d4b868"];
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let W = c.offsetWidth || window.innerWidth;
    let H = c.offsetHeight || window.innerHeight;
    c.width = W; c.height = H;
    const blobs = Array.from({ length: 4 }, (_, i) => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: 200 + Math.random() * 150, ci: i % blobColors.length,
    }));
    const resize = () => {
      W = c.offsetWidth || window.innerWidth;
      H = c.offsetHeight || window.innerHeight;
      c.width = W; c.height = H;
    };
    window.addEventListener("resize", resize);
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      blobs.forEach(b => {
        b.x += b.vx; b.y += b.vy;
        if (b.x < -b.r || b.x > W + b.r) b.vx *= -1;
        if (b.y < -b.r || b.y > H + b.r) b.vy *= -1;
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, blobColors[b.ci] + "14");
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
      });
      raf.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener("resize", resize); };
  }, []); // eslint-disable-line
  return <canvas ref={ref} style={{ position:"fixed", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0 }} />;
}

export default function UserProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name:"", email:"", phone:"", ref_code:"", wallet_balance:0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword:"", newPassword:"", confirm:"" });
  const [activeTab, setActiveTab] = useState("profile");
  const [msg, setMsg] = useState({ type:"", text:"" });
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => { if (!token) navigate("/login"); }, [token, navigate]);

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/profile`, { headers:{ Authorization:`Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error("failed"); return r.json(); })
      .then(data => {
        setProfile(p => ({ ...p, ...data }));
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...stored, ...data }));
      })
      .catch(e => console.error("Profile fetch error:", e))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (activeTab !== "bookings" || !token) return;
    setBookingsLoading(true);
    fetch(`${API}/my-bookings`, { headers:{ Authorization:`Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (Array.isArray(d)) setBookings(d); })
      .catch(() => {}).finally(() => setBookingsLoading(false));
  }, [activeTab, token]);

  const showMsg = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg({ type:"", text:"" }), 4000); };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/profile`, { method:"PUT", headers:{"Content-Type":"application/json", Authorization:`Bearer ${token}`}, body:JSON.stringify({ name:profile.name, email:profile.email, phone:profile.phone }) });
      const data = await res.json();
      if (!res.ok) return showMsg("error", data.message || "Update failed");
      showMsg("success", "Profile updated ✓");
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...stored, name:profile.name, email:profile.email }));
    } catch { showMsg("error", "Server error"); }
    finally { setSaving(false); }
  };

  const savePassword = async () => {
    if (pwForm.newPassword !== pwForm.confirm) return showMsg("error", "Passwords don't match");
    if (pwForm.newPassword.length < 6) return showMsg("error", "Minimum 6 characters");
    setSaving(true);
    try {
      const res = await fetch(`${API}/profile/password`, { method:"PUT", headers:{"Content-Type":"application/json", Authorization:`Bearer ${token}`}, body:JSON.stringify({ currentPassword:pwForm.currentPassword, newPassword:pwForm.newPassword }) });
      const data = await res.json();
      if (!res.ok) return showMsg("error", data.message || "Failed");
      showMsg("success", "Password updated ✓");
      setPwForm({ currentPassword:"", newPassword:"", confirm:"" });
    } catch { showMsg("error", "Server error"); }
    finally { setSaving(false); }
  };

  const copyRefLink = () => {
    navigator.clipboard.writeText(`https://alvryn.in/register?ref=${profile.ref_code}`).catch(()=>{});
    showMsg("success", "Referral link copied!");
  };

  const inp = { width:"100%", padding:"12px 16px", borderRadius:12, fontSize:15, fontFamily:"'DM Sans',sans-serif", color:"#1a1410", background:"#fafaf8", border:"1.5px solid rgba(0,0,0,0.1)", outline:"none", transition:"border-color 0.2s,box-shadow 0.2s" };
  const lbl = { fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:"#777", display:"block", marginBottom:7 };

  const tabs = [
    {id:"profile",  label:"Profile",      icon:"👤"},
    {id:"security", label:"Password",     icon:"🔒"},
    {id:"wallet",   label:"Wallet",       icon:"💰"},
    {id:"referral", label:"Refer & Earn", icon:"🎁"},
    {id:"bookings", label:"Bookings",     icon:"🎫"},
  ];

  if (loading) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#faf8f4"}}>
      <style>{CSS}</style>
      <AuroraBackground/>
      <div style={{position:"relative",zIndex:2,textAlign:"center"}}>
        <div style={{width:44,height:44,border:`3px solid rgba(201,168,76,0.2)`,borderTopColor:GOLD,borderRadius:"50%",animation:"spinSlow 1s linear infinite",margin:"0 auto 16px"}}/>
        <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#aaa"}}>Loading profile…</div>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"#faf8f4",position:"relative",overflowX:"hidden"}}>
      <style>{CSS}</style>
      <AuroraBackground/>

      {/* Nav */}
      <nav style={{position:"sticky",top:0,zIndex:200,height:66,padding:"0 5%",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(250,248,244,0.92)",backdropFilter:"blur(22px)",borderBottom:"1px solid rgba(201,168,76,0.1)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>navigate("/")}>
          <div style={{animation:"floatUD 4s ease-in-out infinite"}}><AlvrynIcon size={38}/></div>
          <div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:16,color:"#1a1410",letterSpacing:"0.12em"}}>ALVRYN</div>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:7,color:GOLD,letterSpacing:"0.18em"}}>TRAVEL BEYOND</div>
          </div>
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <button onClick={()=>navigate("/search")} style={{padding:"8px 18px",borderRadius:10,fontSize:13,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.06em",cursor:"pointer",color:"#1a1410",border:"none",background:GRAD,backgroundSize:"200% 200%",boxShadow:`0 4px 14px rgba(201,168,76,0.35)`}}>Search ✈</button>
          <button onClick={()=>{localStorage.removeItem("token");localStorage.removeItem("user");navigate("/login");}} style={{padding:"8px 18px",borderRadius:10,fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",background:"#fff0f0",color:"#e53935",border:"1.5px solid rgba(229,57,53,0.2)"}}>Sign Out</button>
        </div>
      </nav>

      <div style={{position:"relative",zIndex:1,maxWidth:760,margin:"0 auto",padding:"40px 5% 80px"}}>
        {/* Header */}
        <div style={{marginBottom:32,animation:"fadeUp 0.6s both"}}>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:GOLD,letterSpacing:"0.2em",marginBottom:10}}>ACCOUNT</div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"clamp(24px,4vw,44px)",color:"#1a1410",marginBottom:4}}>{profile.name?.split(" ")[0]||"Traveller"}'s Profile</h1>
          <p style={{fontSize:15,color:"#888",fontFamily:"'DM Sans',sans-serif"}}>Manage your account, wallet and bookings.</p>
        </div>

        {/* Toast */}
        {msg.text && (
          <div style={{padding:"14px 20px",borderRadius:12,marginBottom:20,background:msg.type==="success"?"rgba(201,168,76,0.1)":"#FFF0F0",border:`1px solid ${msg.type==="success"?"rgba(201,168,76,0.35)":"#FFCDD2"}`,color:msg.type==="success"?GOLD_DARK:"#C62828",fontFamily:"'DM Sans',sans-serif",fontSize:14,animation:"fadeUp 0.3s both"}}>
            {msg.text}
          </div>
        )}

        {/* Tabs */}
        <div className="tabs-row" style={{display:"flex",gap:0,background:"rgba(255,255,255,0.8)",backdropFilter:"blur(10px)",borderRadius:"16px 16px 0 0",border:"1px solid rgba(201,168,76,0.12)",borderBottom:"none",overflowX:"auto"}}>
          {tabs.map((t,i)=>(
            <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{flex:1,minWidth:90,display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"14px 8px",cursor:"pointer",border:"none",borderBottom:activeTab===t.id?`2.5px solid ${GOLD}`:"2.5px solid transparent",background:"transparent",color:activeTab===t.id?GOLD_DARK:"#aaa",fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,whiteSpace:"nowrap",transition:"all 0.2s",borderRadius:i===0?"16px 0 0 0":i===tabs.length-1?"0 16px 0 0":"0"}}>
              <span style={{fontSize:18}}>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        <div style={{background:"rgba(255,255,255,0.88)",backdropFilter:"blur(12px)",borderRadius:"0 0 20px 20px",padding:"clamp(20px,4vw,32px) clamp(16px,4vw,28px)",boxShadow:"0 4px 20px rgba(0,0,0,0.05)",border:"1px solid rgba(201,168,76,0.12)",borderTop:"none"}}>

          {/* Profile Tab */}
          {activeTab==="profile" && (
            <div style={{animation:"fadeUp 0.4s both"}}>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:22,color:"#1a1410",marginBottom:24}}>Personal Information</h2>
              <div className="pf-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                {[{key:"name",label:"Full Name",type:"text",ph:"Your full name"},{key:"email",label:"Email Address",type:"email",ph:"you@example.com"}].map(f=>(
                  <div key={f.key}>
                    <label style={lbl}>{f.label}</label>
                    <input type={f.type} value={profile[f.key]||""} placeholder={f.ph} onChange={e=>setProfile({...profile,[f.key]:e.target.value})} style={inp}
                      onFocus={e=>{e.target.style.borderColor=GOLD;e.target.style.boxShadow=`0 0 0 3px rgba(201,168,76,0.12)`;}}
                      onBlur={e=>{e.target.style.borderColor="rgba(0,0,0,0.1)";e.target.style.boxShadow="none";}}/>
                  </div>
                ))}
              </div>
              <div style={{marginBottom:28}}>
                <label style={lbl}>Phone Number <span style={{color:"#bbb",fontWeight:400}}>(optional)</span></label>
                <input type="tel" value={profile.phone||""} placeholder="+91 98765 43210" onChange={e=>setProfile({...profile,phone:e.target.value})} style={{...inp,maxWidth:320}}
                  onFocus={e=>{e.target.style.borderColor=GOLD;e.target.style.boxShadow=`0 0 0 3px rgba(201,168,76,0.12)`;}}
                  onBlur={e=>{e.target.style.borderColor="rgba(0,0,0,0.1)";e.target.style.boxShadow="none";}}/>
              </div>
              <button onClick={saveProfile} disabled={saving} style={{padding:"13px 32px",borderRadius:13,fontSize:15,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.08em",cursor:saving?"not-allowed":"pointer",color:"#1a1410",border:"none",background:saving?"#e5e0d8":GRAD,backgroundSize:"200% 200%",animation:saving?"none":"gradShift 4s ease infinite",boxShadow:saving?"none":`0 6px 22px rgba(201,168,76,0.38)`,opacity:saving?0.7:1}}>
                {saving?"Saving…":"Save Changes"}
              </button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab==="security" && (
            <div style={{animation:"fadeUp 0.4s both"}}>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:22,color:"#1a1410",marginBottom:24}}>Change Password</h2>
              <div style={{display:"flex",flexDirection:"column",gap:16,maxWidth:400}}>
                {[{key:"currentPassword",label:"Current Password",ph:"Your current password"},{key:"newPassword",label:"New Password",ph:"At least 6 characters"},{key:"confirm",label:"Confirm New Password",ph:"Repeat new password"}].map(f=>(
                  <div key={f.key}>
                    <label style={lbl}>{f.label}</label>
                    <input type="password" value={pwForm[f.key]} placeholder={f.ph} onChange={e=>setPwForm({...pwForm,[f.key]:e.target.value})} style={inp}
                      onFocus={e=>{e.target.style.borderColor=GOLD;e.target.style.boxShadow=`0 0 0 3px rgba(201,168,76,0.12)`;}}
                      onBlur={e=>{e.target.style.borderColor="rgba(0,0,0,0.1)";e.target.style.boxShadow="none";}}/>
                  </div>
                ))}
              </div>
              <button onClick={savePassword} disabled={saving} style={{marginTop:24,padding:"13px 32px",borderRadius:13,fontSize:15,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.08em",cursor:saving?"not-allowed":"pointer",color:"#1a1410",border:"none",background:saving?"#e5e0d8":GRAD,backgroundSize:"200% 200%",animation:saving?"none":"gradShift 4s ease infinite",boxShadow:saving?"none":`0 6px 22px rgba(201,168,76,0.38)`,opacity:saving?0.7:1}}>
                {saving?"Updating…":"Update Password"}
              </button>
            </div>
          )}

          {/* Wallet Tab */}
          {activeTab==="wallet" && (
            <div style={{animation:"fadeUp 0.4s both"}}>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:22,color:"#1a1410",marginBottom:24}}>Alvryn Wallet</h2>
              <div style={{background:GRAD,backgroundSize:"200% 200%",animation:"gradShift 4s ease infinite",borderRadius:20,padding:"32px 28px",marginBottom:28,color:"#1a1410"}}>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,opacity:0.7,marginBottom:8,letterSpacing:"0.12em"}}>AVAILABLE BALANCE</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:52,letterSpacing:"-1px",lineHeight:1}}>₹{(profile.wallet_balance||0).toLocaleString()}</div>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,opacity:0.7,marginTop:10}}>Earned from referrals and promotions</div>
              </div>
              <div style={{background:"rgba(201,168,76,0.05)",borderRadius:14,padding:"20px 22px",border:"1px solid rgba(201,168,76,0.15)"}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:17,color:"#1a1410",marginBottom:14}}>How to earn more?</div>
                {[{icon:"🎁",title:"Refer a friend",desc:"They book above ₹5,000 → You get ₹150 wallet credit"},{icon:"🆕",title:"Friend gets",desc:"₹100 wallet credit on first booking above ₹5,000"},{icon:"🏷️",title:"Promo codes",desc:"Apply codes at checkout to save on every booking"}].map(item=>(
                  <div key={item.title} style={{display:"flex",gap:14,marginBottom:14,alignItems:"flex-start"}}>
                    <span style={{fontSize:20}}>{item.icon}</span>
                    <div>
                      <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:14,color:"#1a1410"}}>{item.title}</div>
                      <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#888",marginTop:2}}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Referral Tab */}
          {activeTab==="referral" && (
            <div style={{animation:"fadeUp 0.4s both"}}>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:22,color:"#1a1410",marginBottom:8}}>Refer &amp; Earn</h2>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#888",marginBottom:28,lineHeight:1.6}}>Share your link. When your friend books above ₹5,000, you both get wallet credits!</p>
              <div style={{background:"rgba(201,168,76,0.08)",borderRadius:16,padding:"24px",marginBottom:20,border:`1px solid rgba(201,168,76,0.25)`}}>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:GOLD,letterSpacing:"0.15em",marginBottom:10}}>YOUR REFERRAL CODE</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:36,color:GOLD_DARK,letterSpacing:"4px",marginBottom:10}}>{profile.ref_code||"—"}</div>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#888",marginBottom:16,wordBreak:"break-all"}}>alvryn.in/register?ref={profile.ref_code}</div>
                <div className="ref-btns" style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  <button onClick={copyRefLink} style={{padding:"10px 22px",borderRadius:11,fontSize:13,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.06em",cursor:"pointer",color:"#1a1410",border:"none",background:GRAD,backgroundSize:"200% 200%",boxShadow:`0 4px 14px rgba(201,168,76,0.38)`}}>Copy Link</button>
                  <button onClick={()=>window.open(`https://wa.me/?text=Book flights and buses with AI on Alvryn! Use my code ${profile.ref_code} to get ₹100 off your first booking above ₹5000. https://alvryn.in/register?ref=${profile.ref_code}`,"_blank")} style={{padding:"10px 22px",borderRadius:11,fontSize:13,fontWeight:700,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",color:"#fff",border:"none",background:"#25D366"}}>Share on WhatsApp</button>
                </div>
              </div>
              <div className="earn-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                {[{icon:"💸",label:"You earn",amount:"₹150",desc:"When friend books above ₹5,000"},{icon:"🎉",label:"Friend earns",amount:"₹100",desc:"On first booking above ₹5,000"}].map(card=>(
                  <div key={card.label} style={{background:"rgba(255,255,255,0.7)",borderRadius:14,padding:"20px",border:"1px solid rgba(201,168,76,0.12)",textAlign:"center"}}>
                    <div style={{fontSize:28,marginBottom:8}}>{card.icon}</div>
                    <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"#bbb",marginBottom:4}}>{card.label}</div>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:32,color:GOLD_DARK}}>{card.amount}</div>
                    <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#888",marginTop:6}}>{card.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab==="bookings" && (
            <div style={{animation:"fadeUp 0.4s both"}}>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:22,color:"#1a1410",marginBottom:24}}>Your Bookings</h2>
              {bookingsLoading ? (
                <div style={{textAlign:"center",padding:"40px 0"}}>
                  <div style={{width:36,height:36,border:`3px solid rgba(201,168,76,0.2)`,borderTopColor:GOLD,borderRadius:"50%",animation:"spinSlow 1s linear infinite",margin:"0 auto 12px"}}/>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#bbb"}}>Loading…</div>
                </div>
              ) : bookings.length===0 ? (
                <div style={{textAlign:"center",padding:"48px 20px"}}>
                  <div style={{fontSize:56,marginBottom:16}}>🎫</div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:22,color:"#ccc",marginBottom:10}}>No bookings yet</div>
                  <button onClick={()=>navigate("/search")} style={{padding:"11px 28px",borderRadius:12,fontSize:14,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.06em",cursor:"pointer",color:"#1a1410",border:"none",background:GRAD,backgroundSize:"200% 200%"}}>Search Flights ✈</button>
                </div>
              ) : (
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {bookings.map((b,i)=>(
                    <div key={i} style={{padding:"20px 22px",background:"rgba(201,168,76,0.05)",borderRadius:16,border:"1px solid rgba(201,168,76,0.12)"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
                        <div>
                          <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:18,color:"#1a1410",marginBottom:4}}>{b.from_city} → {b.to_city}</div>
                          <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#aaa"}}>{b.airline} · {b.departure_time&&new Date(b.departure_time).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div>
                          {b.seats&&<div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:GOLD,marginTop:4}}>Seats: {b.seats}</div>}
                          {b.booking_ref&&<div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:GOLD_DARK,marginTop:2}}>ID: {b.booking_ref}</div>}
                        </div>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:22,color:GOLD_DARK}}>₹{(b.final_price||b.price||0).toLocaleString()}</div>
                          <div style={{display:"inline-flex",alignItems:"center",gap:5,marginTop:6,padding:"3px 10px",borderRadius:100,background:"rgba(201,168,76,0.1)",border:"1px solid rgba(201,168,76,0.25)"}}>
                            <span style={{width:5,height:5,borderRadius:"50%",background:GOLD,display:"inline-block"}}/>
                            <span style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:GOLD_DARK}}>CONFIRMED</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}