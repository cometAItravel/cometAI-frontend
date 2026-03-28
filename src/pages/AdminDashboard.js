import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND = "https://cometai-backend.onrender.com";
const GOLD = "#c9a84c";
const GOLD_DARK = "#8B6914";
const GRAD = "linear-gradient(135deg,#c9a84c,#f0d080,#c9a84c)";
const ADMIN_PW = "user2026admin";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);}}
  @keyframes floatUD{0%,100%{transform:translateY(0);}50%{transform:translateY(-9px);}}
  @keyframes spinSlow{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
  @keyframes gradShift{0%,100%{background-position:0% 50%;}50%{background-position:100% 50%;}}
  ::-webkit-scrollbar{width:2px;}
  ::-webkit-scrollbar-thumb{background:linear-gradient(#c9a84c,#8B6914);}
  @media(max-width:600px){.stats-grid{grid-template-columns:1fr 1fr!important;}.tab-row{flex-wrap:wrap!important;}}
`;

const AlvrynIcon = ({ size = 40 }) => {
  const uid = `ad${size}`;
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
  const ref=useRef(null);const raf=useRef(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;const ctx=c.getContext("2d");let W=c.offsetWidth,H=c.offsetHeight;c.width=W;c.height=H;
    const cols=["#c9a84c","#f0d080","#8B6914","#d4b868"];
    const blobs=Array.from({length:4},(_,i)=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-0.5)*0.4,vy:(Math.random()-0.5)*0.4,r:200+Math.random()*150,ci:i%cols.length}));
    const resize=()=>{W=c.offsetWidth;H=c.offsetHeight;c.width=W;c.height=H;};
    window.addEventListener("resize",resize);
    const draw=()=>{ctx.clearRect(0,0,W,H);blobs.forEach(b=>{b.x+=b.vx;b.y+=b.vy;if(b.x<-b.r||b.x>W+b.r)b.vx*=-1;if(b.y<-b.r||b.y>H+b.r)b.vy*=-1;const g=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r);g.addColorStop(0,cols[b.ci]+"14");g.addColorStop(1,"transparent");ctx.fillStyle=g;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill();});raf.current=requestAnimationFrame(draw);};
    draw();
    return()=>{cancelAnimationFrame(raf.current);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}}/>;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [tab, setTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [rb,ru,rw] = await Promise.all([
        fetch(`${BACKEND}/admin/bookings`),
        fetch(`${BACKEND}/admin/users`),
        fetch(`${BACKEND}/admin/waitlist`),
      ]);
      const [db,du,dw] = await Promise.all([rb.json(),ru.json(),rw.json()]);
      if (Array.isArray(db)) setBookings(db);
      if (Array.isArray(du)) setUsers(du);
      if (Array.isArray(dw)) setWaitlist(dw);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const login = () => {
    if (pw === ADMIN_PW) { setAuthed(true); fetchAll(); }
    else setPwErr("Wrong password");
  };

  const totalRevenue = bookings.reduce((s,b) => s + Number(b.final_price||b.price||0), 0);

  const tabs = [
    { id:"bookings", label:"Bookings", icon:"🎫", count:bookings.length },
    { id:"users",    label:"Users",    icon:"👥", count:users.length },
    { id:"waitlist", label:"Waitlist", icon:"📋", count:waitlist.length },
  ];

  // ── LOGIN ──
  if (!authed) return (
    <div style={{minHeight:"100vh",background:"#faf8f4",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <style>{CSS}</style>
      <AuroraBackground/>
      <div style={{position:"relative",zIndex:2,width:"100%",maxWidth:400,animation:"fadeUp 0.6s both"}}>
        <div style={{background:"rgba(255,255,255,0.9)",backdropFilter:"blur(24px)",borderRadius:24,padding:"48px 40px",boxShadow:"0 24px 80px rgba(0,0,0,0.08)",border:"1px solid rgba(201,168,76,0.15)"}}>
          <div style={{textAlign:"center",marginBottom:36}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:16,animation:"floatUD 4s ease-in-out infinite"}}><AlvrynIcon size={52}/></div>
            <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:26,color:"#1a1410"}}>Admin Access</h1>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#999",marginTop:6}}>Alvryn Dashboard</p>
          </div>
          <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()} placeholder="Admin password"
            style={{width:"100%",padding:"13px 16px",borderRadius:12,fontSize:15,fontFamily:"'DM Sans',sans-serif",border:`1.5px solid rgba(201,168,76,0.35)`,outline:"none",background:"#fafaf8",color:"#1a1410",marginBottom:14}}
            onFocus={e=>{e.target.style.borderColor=GOLD;e.target.style.boxShadow=`0 0 0 3px rgba(201,168,76,0.12)`;}}
            onBlur={e=>{e.target.style.borderColor="rgba(201,168,76,0.35)";e.target.style.boxShadow="none";}}/>
          {pwErr&&<div style={{color:"#C62828",fontSize:13,fontFamily:"'DM Sans',sans-serif",marginBottom:14}}>{pwErr}</div>}
          <button onClick={login} style={{width:"100%",padding:"14px",borderRadius:13,fontSize:15,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.08em",color:"#1a1410",border:"none",cursor:"pointer",background:GRAD,backgroundSize:"200% 200%",animation:"gradShift 4s ease infinite",boxShadow:`0 8px 28px rgba(201,168,76,0.38)`}}>Enter Dashboard →</button>
        </div>
      </div>
    </div>
  );

  // ── DASHBOARD ──
  return (
    <div style={{minHeight:"100vh",background:"#faf8f4",position:"relative",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{CSS}</style>
      <AuroraBackground/>

      <nav style={{position:"sticky",top:0,zIndex:200,height:66,padding:"0 5%",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(250,248,244,0.93)",backdropFilter:"blur(22px)",borderBottom:"1px solid rgba(201,168,76,0.1)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{animation:"floatUD 4s ease-in-out infinite"}}><AlvrynIcon size={38}/></div>
          <div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:15,color:"#1a1410",letterSpacing:"0.12em"}}>ALVRYN ADMIN</div>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:7,color:GOLD,letterSpacing:"0.18em"}}>DASHBOARD</div>
          </div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={fetchAll} style={{padding:"8px 18px",borderRadius:10,fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",color:GOLD_DARK,border:`1.5px solid rgba(201,168,76,0.35)`,background:"transparent"}}>↻ Refresh</button>
          <button onClick={()=>navigate("/")} style={{padding:"8px 18px",borderRadius:10,fontSize:13,fontWeight:500,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",color:"#888",border:"1.5px solid rgba(0,0,0,0.1)",background:"transparent"}}>← Home</button>
        </div>
      </nav>

      <div style={{position:"relative",zIndex:1,padding:"40px 5%"}}>
        {/* Stats */}
        <div className="stats-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20,marginBottom:32}}>
          {[
            {icon:"🎫",label:"Total Bookings",val:loading?"…":bookings.length},
            {icon:"👥",label:"Total Users",val:loading?"…":users.length},
            {icon:"💰",label:"Total Revenue",val:loading?"…":`₹${totalRevenue.toLocaleString()}`},
            {icon:"📋",label:"Waitlist",val:loading?"…":waitlist.length},
          ].map((s,i)=>(
            <div key={i} style={{padding:"24px 20px",background:"rgba(255,255,255,0.85)",backdropFilter:"blur(10px)",borderRadius:18,boxShadow:"0 4px 18px rgba(0,0,0,0.04)",border:"1px solid rgba(201,168,76,0.12)",animation:`fadeUp 0.5s ${i*80}ms both`}}>
              <div style={{fontSize:26,marginBottom:10}}>{s.icon}</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:32,color:GOLD_DARK,lineHeight:1}}>{s.val}</div>
              <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#888",marginTop:6}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="tab-row" style={{display:"flex",gap:10,marginBottom:24}}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"10px 22px",borderRadius:12,fontSize:14,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.06em",border:"none",cursor:"pointer",transition:"all 0.2s",background:tab===t.id?GRAD:"rgba(255,255,255,0.8)",color:tab===t.id?"#1a1410":"#888",backgroundSize:"200% 200%",animation:tab===t.id?"gradShift 4s ease infinite":"none",boxShadow:tab===t.id?`0 4px 16px rgba(201,168,76,0.38)`:"0 2px 8px rgba(0,0,0,0.04)"}}>
              {t.icon} {t.label} <span style={{fontFamily:"'Space Mono',monospace",fontSize:10,opacity:0.7}}>({t.count})</span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{background:"rgba(255,255,255,0.88)",backdropFilter:"blur(10px)",borderRadius:20,boxShadow:"0 4px 20px rgba(0,0,0,0.05)",border:"1px solid rgba(201,168,76,0.12)",overflow:"hidden"}}>
          {loading ? (
            <div style={{padding:"60px",textAlign:"center"}}>
              <div style={{width:40,height:40,border:`3px solid rgba(201,168,76,0.2)`,borderTopColor:GOLD,borderRadius:"50%",animation:"spinSlow 1s linear infinite",margin:"0 auto 14px"}}/>
              <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#bbb"}}>Loading…</div>
            </div>
          ) : (
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead>
                  <tr style={{background:"rgba(201,168,76,0.06)",borderBottom:"1px solid rgba(201,168,76,0.1)"}}>
                    {tab==="bookings" && ["#","Airline","Route","Passenger","Amount","Email","Date"].map(h=>(
                      <th key={h} style={{padding:"13px 18px",textAlign:"left",fontFamily:"'Space Mono',monospace",fontSize:9,color:"#aaa",letterSpacing:"0.12em",fontWeight:700,whiteSpace:"nowrap"}}>{h}</th>
                    ))}
                    {tab==="users" && ["#","Name","Email","Ref Code","Joined"].map(h=>(
                      <th key={h} style={{padding:"13px 18px",textAlign:"left",fontFamily:"'Space Mono',monospace",fontSize:9,color:"#aaa",letterSpacing:"0.12em",fontWeight:700,whiteSpace:"nowrap"}}>{h}</th>
                    ))}
                    {tab==="waitlist" && ["#","Email","Ref Code","Referred By","Refs Made","Joined"].map(h=>(
                      <th key={h} style={{padding:"13px 18px",textAlign:"left",fontFamily:"'Space Mono',monospace",fontSize:9,color:"#aaa",letterSpacing:"0.12em",fontWeight:700,whiteSpace:"nowrap"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tab==="bookings" && bookings.map((b,i)=>(
                    <tr key={i} style={{borderBottom:"1px solid rgba(201,168,76,0.05)",transition:"background 0.15s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(201,168,76,0.04)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{padding:"13px 18px",fontFamily:"'Space Mono',monospace",fontSize:10,color:"#ccc"}}>#{b.id}</td>
                      <td style={{padding:"13px 18px",fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:14,color:"#1a1410",whiteSpace:"nowrap"}}>{b.airline} <span style={{fontWeight:400,color:"#bbb",fontSize:11}}>{b.flight_no}</span></td>
                      <td style={{padding:"13px 18px",fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#555",whiteSpace:"nowrap"}}>{b.from_city} → {b.to_city}</td>
                      <td style={{padding:"13px 18px",fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#555"}}>{b.passenger_name}</td>
                      <td style={{padding:"13px 18px",fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:14,color:GOLD_DARK,whiteSpace:"nowrap"}}>₹{Number(b.final_price||b.price||0).toLocaleString()}</td>
                      <td style={{padding:"13px 18px",fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#888"}}>{b.user_email}</td>
                      <td style={{padding:"13px 18px",fontFamily:"'Space Mono',monospace",fontSize:9,color:"#bbb",whiteSpace:"nowrap"}}>{b.booked_at?new Date(b.booked_at).toLocaleDateString("en-IN"):"—"}</td>
                    </tr>
                  ))}
                  {tab==="users" && users.map((u,i)=>(
                    <tr key={i} style={{borderBottom:"1px solid rgba(201,168,76,0.05)",transition:"background 0.15s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(201,168,76,0.04)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{padding:"13px 18px",fontFamily:"'Space Mono',monospace",fontSize:10,color:"#ccc"}}>#{u.id}</td>
                      <td style={{padding:"13px 18px",fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:14,color:"#1a1410"}}>{u.name}</td>
                      <td style={{padding:"13px 18px",fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#555"}}>{u.email}</td>
                      <td style={{padding:"13px 18px",fontFamily:"'Space Mono',monospace",fontSize:11,color:GOLD}}>{u.ref_code||"—"}</td>
                      <td style={{padding:"13px 18px",fontFamily:"'Space Mono',monospace",fontSize:9,color:"#bbb",whiteSpace:"nowrap"}}>{u.created_at?new Date(u.created_at).toLocaleDateString("en-IN"):"—"}</td>
                    </tr>
                  ))}
                  {tab==="waitlist" && waitlist.map((w,i)=>(
                    <tr key={i} style={{borderBottom:"1px solid rgba(201,168,76,0.05)",transition:"background 0.15s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(201,168,76,0.04)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{padding:"13px 18px",fontFamily:"'Space Mono',monospace",fontSize:10,color:"#ccc"}}>#{w.id}</td>
                      <td style={{padding:"13px 18px",fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#555"}}>{w.email}</td>
                      <td style={{padding:"13px 18px",fontFamily:"'Space Mono',monospace",fontSize:11,color:GOLD}}>{w.ref_code}</td>
                      <td style={{padding:"13px 18px",fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#bbb"}}>{w.referred_by||"—"}</td>
                      <td style={{padding:"13px 18px",fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:16,color:GOLD_DARK}}>{w.ref_count||0}</td>
                      <td style={{padding:"13px 18px",fontFamily:"'Space Mono',monospace",fontSize:9,color:"#bbb",whiteSpace:"nowrap"}}>{w.joined_at?new Date(w.joined_at).toLocaleDateString("en-IN"):"—"}</td>
                    </tr>
                  ))}
                  {(tab==="bookings"?bookings:tab==="users"?users:waitlist).length===0&&(
                    <tr><td colSpan={7} style={{padding:"40px",textAlign:"center",fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#ccc"}}>No {tab} yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}