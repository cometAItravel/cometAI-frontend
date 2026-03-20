import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const API = "https://cometai-backend.onrender.com";
const ADMIN_PASSWORD = "user2026admin";

const theme = {
  bg:'linear-gradient(135deg,#f8f6ff 0%,#f0ebff 30%,#e8f4ff 60%,#f5f8ff 100%)',
  accent:'#6d28d9', accent2:'#8b5cf6', text:'#1e1033', sub:'#4c1d95',
  card:'rgba(255,255,255,0.88)', cardBorder:'rgba(109,40,217,0.14)'
};

function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) { sessionStorage.setItem("admin_auth","true"); onLogin(); }
    else { setError("Invalid password."); setPassword(""); }
  };

  return (
    <div style={{minHeight:'100vh',background:theme.bg,display:'flex',alignItems:'center',justifyContent:'center',padding:24,fontFamily:"'DM Sans',sans-serif",position:'relative',overflow:'hidden'}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}@keyframes floatBlob{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(2%,-3%) scale(1.05);}66%{transform:translate(-2%,2%) scale(0.97);}}`}</style>
      <div style={{position:'fixed',inset:0,background:`radial-gradient(ellipse at 20% 40%,${theme.accent}18 0%,transparent 55%)`,animation:'floatBlob 12s ease-in-out infinite',pointerEvents:'none'}}/>
      <div style={{position:'fixed',inset:0,background:`radial-gradient(ellipse at 80% 20%,${theme.accent2}14 0%,transparent 50%)`,animation:'floatBlob 16s ease-in-out infinite reverse',pointerEvents:'none'}}/>

      <motion.div initial={{opacity:0,y:28,scale:.97}} animate={{opacity:1,y:0,scale:1}} transition={{duration:.7}}
        style={{background:theme.card,border:`1px solid ${theme.cardBorder}`,borderRadius:24,padding:'44px 36px',width:'100%',maxWidth:420,position:'relative',zIndex:10,boxShadow:`0 8px 48px ${theme.accent}12`}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${theme.accent}35,${theme.accent2}25,transparent)`,borderRadius:'24px 24px 0 0'}}/>
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{width:52,height:52,borderRadius:'50%',background:`linear-gradient(135deg,${theme.accent},${theme.accent2})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,color:'white',margin:'0 auto 16px',boxShadow:`0 8px 24px ${theme.accent}40`}}>☄</div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:theme.text,marginBottom:6}}>CometAI Control</h1>
          <p style={{fontSize:13,color:`${theme.sub}88`}}>Restricted area. Authorized personnel only.</p>
        </div>
        {error && <div style={{background:'rgba(239,68,68,.06)',border:'1px solid rgba(239,68,68,.2)',borderRadius:10,padding:'10px 14px',marginBottom:16,fontSize:13,color:'#dc2626'}}>⚠ {error}</div>}
        <label style={{fontSize:11,color:`${theme.sub}88`,letterSpacing:'1.5px',textTransform:'uppercase',display:'block',marginBottom:8,fontFamily:"'Space Mono',monospace"}}>Admin Password</label>
        <input type="password" placeholder="Enter password..." value={password} onChange={e=>setPassword(e.target.value)} onKeyPress={e=>{if(e.key==="Enter")handleLogin();}} autoFocus
          style={{width:'100%',background:'rgba(255,255,255,.9)',border:`1.5px solid ${theme.accent}25`,borderRadius:12,padding:'13px 16px',color:theme.text,fontFamily:'monospace',fontSize:14,outline:'none',marginBottom:20,letterSpacing:'2px',caretColor:theme.accent}}/>
        <button onClick={handleLogin}
          style={{width:'100%',padding:'13px',background:`linear-gradient(135deg,${theme.accent},${theme.accent2})`,border:'none',borderRadius:12,color:'white',fontFamily:"'DM Sans',sans-serif",fontSize:15,fontWeight:700,cursor:'pointer',boxShadow:`0 8px 24px ${theme.accent}40`}}>
          Access Dashboard →
        </button>
      </motion.div>
    </div>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth")==="true") { setAuthed(true); fetchData(); }
    else setLoading(false);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bRes,uRes,wRes] = await Promise.all([
        axios.get(`${API}/admin/bookings`).catch(()=>({data:[]})),
        axios.get(`${API}/admin/users`).catch(()=>({data:[]})),
        axios.get(`${API}/admin/waitlist`).catch(()=>({data:[]})),
      ]);
      setBookings(bRes.data); setUsers(uRes.data); setWaitlist(wRes.data);
    } catch(e){console.error(e);}
    setLoading(false);
  };

  const handleLogout = () => { sessionStorage.removeItem("admin_auth"); setAuthed(false); };

  if (!authed) return <AdminLogin onLogin={()=>{setAuthed(true);fetchData();}}/>;

  const totalRevenue = bookings.reduce((s,b)=>s+(Number(b.price)||0),0);
  const routeCounts = {};
  bookings.forEach(b=>{const r=`${b.from_city} → ${b.to_city}`;routeCounts[r]=(routeCounts[r]||0)+1;});
  const topRoutes = Object.entries(routeCounts).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const maxRoute = topRoutes[0]?.[1]||1;
  const fmt = dt => dt ? new Date(dt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "—";
  const fmtT = dt => dt ? new Date(dt).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:false}) : "";

  const statCards = [
    {icon:'✈️',label:'Total Bookings',val:bookings.length,sub:'All time'},
    {icon:'👥',label:'Total Users',val:users.length,sub:'Registered'},
    {icon:'💰',label:'Total Revenue',val:`₹${totalRevenue.toLocaleString()}`,sub:'Mock payments'},
    {icon:'📧',label:'Waitlist',val:waitlist.length,sub:'Signed up'},
  ];

  const tabs = [['bookings','✈️ Bookings'],['users','👥 Users'],['waitlist','📧 Waitlist'],['routes','🗺️ Routes']];

  return (
    <div style={{minHeight:'100vh',background:theme.bg,fontFamily:"'DM Sans',sans-serif",color:theme.text,overflowX:'hidden'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        @keyframes floatBlob{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(2%,-3%) scale(1.05);}66%{transform:translate(-2%,2%) scale(0.97);}}
        table{width:100%;border-collapse:collapse;}
        th{padding:11px 18px;text-align:left;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;border-bottom:1.5px solid;font-family:'Space Mono',monospace;font-weight:500;}
        td{padding:13px 18px;font-size:13px;border-bottom:1px solid;}
        tr:last-child td{border-bottom:none!important;}
        tr:hover td{background:rgba(109,40,217,.03);}
      `}</style>

      <div style={{position:'fixed',inset:0,background:`radial-gradient(ellipse at 15% 35%,${theme.accent}14 0%,transparent 55%)`,animation:'floatBlob 12s ease-in-out infinite',pointerEvents:'none',zIndex:0}}/>
      <div style={{position:'fixed',inset:0,background:`radial-gradient(ellipse at 80% 20%,${theme.accent2}10 0%,transparent 50%)`,animation:'floatBlob 16s ease-in-out infinite reverse',pointerEvents:'none',zIndex:0}}/>

      {/* TOPBAR */}
      <nav style={{position:'sticky',top:0,zIndex:50,background:'rgba(255,255,255,.88)',backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)',borderBottom:`1px solid ${theme.accent}12`,boxShadow:`0 1px 20px ${theme.accent}08`}}>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'13px 28px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <div style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer'}} onClick={()=>navigate('/')}>
              <div style={{width:32,height:32,borderRadius:'50%',background:`linear-gradient(135deg,${theme.accent},${theme.accent2})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,color:'white',boxShadow:`0 4px 14px ${theme.accent}40`}}>☄</div>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,color:theme.text}}>COMETAI</span>
            </div>
            <div style={{width:1,height:18,background:`${theme.accent}20`}}/>
            <span style={{fontSize:12,color:`${theme.sub}88`,fontFamily:"'Space Mono',monospace",letterSpacing:'1px'}}>Admin Dashboard</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{display:'flex',alignItems:'center',gap:6,fontSize:11,color:'#059669',background:'rgba(5,150,105,.08)',border:'1px solid rgba(5,150,105,.2)',padding:'4px 10px',borderRadius:20}}>
              <div style={{width:5,height:5,borderRadius:'50%',background:'#059669'}}/>LIVE
            </div>
            <button onClick={()=>navigate('/search')} style={{background:'transparent',border:`1px solid ${theme.accent}25`,color:theme.sub,padding:'6px 14px',borderRadius:8,fontFamily:"'DM Sans',sans-serif",fontSize:12,cursor:'pointer'}}>← Back to App</button>
            <button onClick={handleLogout} style={{background:'rgba(239,68,68,.07)',border:'1px solid rgba(239,68,68,.2)',color:'#dc2626',padding:'6px 14px',borderRadius:8,fontFamily:"'DM Sans',sans-serif",fontSize:12,cursor:'pointer'}}>Logout</button>
          </div>
        </div>
      </nav>

      <div style={{position:'relative',zIndex:2,maxWidth:1200,margin:'0 auto',padding:'32px 28px'}}>
        {/* STATS */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:28}}>
          {statCards.map((s,i)=>(
            <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*.08,duration:.5}}
              whileHover={{y:-3,boxShadow:`0 16px 40px ${theme.accent}14`}}
              style={{background:theme.card,border:`1px solid ${theme.cardBorder}`,borderRadius:16,padding:22,position:'relative',overflow:'hidden',boxShadow:`0 4px 20px ${theme.accent}06`,cursor:'default'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${theme.accent}25,transparent)`}}/>
              <div style={{fontSize:22,marginBottom:10}}>{s.icon}</div>
              <div style={{fontSize:10,letterSpacing:'1.5px',textTransform:'uppercase',color:`${theme.sub}77`,marginBottom:6,fontFamily:"'Space Mono',monospace"}}>{s.label}</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:theme.text}}>{s.val}</div>
              <div style={{fontSize:11,color:'#059669',marginTop:4}}>↑ {s.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* TABS */}
        <div style={{display:'flex',gap:4,marginBottom:20,background:'rgba(255,255,255,.7)',border:`1px solid ${theme.accent}12`,borderRadius:14,padding:4,width:'fit-content',backdropFilter:'blur(10px)'}}>
          {tabs.map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)}
              style={{padding:'8px 18px',border:'none',background:tab===id?`linear-gradient(135deg,${theme.accent}15,${theme.accent2}10)`:'transparent',color:tab===id?theme.accent:`${theme.sub}77`,fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:500,cursor:'pointer',borderRadius:10,transition:'all .2s',boxShadow:tab===id?`0 2px 8px ${theme.accent}12`:'none'}}>
              {label}
            </button>
          ))}
        </div>

        {loading && <div style={{textAlign:'center',padding:'60px',color:`${theme.sub}66`,fontFamily:"'Space Mono',monospace",fontSize:11,letterSpacing:'2px'}}>Loading data...</div>}

        {/* TABLE WRAPPER */}
        {!loading && (
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.5}}
            style={{background:theme.card,border:`1px solid ${theme.cardBorder}`,borderRadius:18,overflow:'hidden',boxShadow:`0 4px 24px ${theme.accent}06`}}>

            {/* header */}
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 22px',borderBottom:`1px solid ${theme.accent}10`}}>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:700,color:theme.text}}>
                {tab==='bookings'?'All Bookings':tab==='users'?'All Users':tab==='waitlist'?'Waitlist Signups':'Popular Routes'}
              </span>
              <span style={{fontSize:11,color:`${theme.sub}66`,background:`${theme.accent}08`,border:`1px solid ${theme.accent}15`,padding:'3px 10px',borderRadius:20,fontFamily:"'Space Mono',monospace"}}>
                {tab==='bookings'?`${bookings.length} total`:tab==='users'?`${users.length} users`:tab==='waitlist'?`${waitlist.length} signups`:`${topRoutes.length} routes`}
              </span>
            </div>

            {/* BOOKINGS */}
            {tab==='bookings' && (
              bookings.length===0 ? <div style={{textAlign:'center',padding:'48px',color:`${theme.sub}55`,fontSize:13}}>No bookings yet</div> : (
                <div style={{overflowX:'auto'}}>
                  <table>
                    <thead><tr>
                      {['#','Passenger','Route','Date','Amount','Email','Status'].map(h=>(
                        <th key={h} style={{color:`${theme.sub}77`,borderBottomColor:`${theme.accent}12`}}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {bookings.map(b=>(
                        <tr key={b.id}>
                          <td style={{fontFamily:'monospace',fontSize:11,color:`${theme.sub}55`,borderBottomColor:`${theme.accent}08`}}>#{b.id}</td>
                          <td style={{fontWeight:600,color:theme.text,borderBottomColor:`${theme.accent}08`}}>{b.passenger_name}</td>
                          <td style={{color:theme.sub,borderBottomColor:`${theme.accent}08`}}>{b.from_city} → {b.to_city}</td>
                          <td style={{color:`${theme.sub}88`,borderBottomColor:`${theme.accent}08`}}>{fmt(b.departure_time)} {fmtT(b.departure_time)}</td>
                          <td style={{fontFamily:'monospace',fontSize:13,fontWeight:700,color:theme.accent,borderBottomColor:`${theme.accent}08`}}>₹{Number(b.price)?.toLocaleString()}</td>
                          <td style={{color:`${theme.sub}77`,fontSize:12,borderBottomColor:`${theme.accent}08`}}>{b.user_email||'—'}</td>
                          <td style={{borderBottomColor:`${theme.accent}08`}}><span style={{background:'rgba(5,150,105,.08)',border:'1px solid rgba(5,150,105,.2)',color:'#059669',padding:'3px 8px',borderRadius:6,fontSize:10,fontFamily:"'Space Mono',monospace"}}>✓ Confirmed</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {/* USERS */}
            {tab==='users' && (
              users.length===0 ? <div style={{textAlign:'center',padding:'48px',color:`${theme.sub}55`,fontSize:13}}>No users yet</div> : (
                <div style={{overflowX:'auto'}}>
                  <table>
                    <thead><tr>
                      {['#','Name','Email','User ID','Role'].map(h=>(
                        <th key={h} style={{color:`${theme.sub}77`,borderBottomColor:`${theme.accent}12`}}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {users.map((u,i)=>(
                        <tr key={u.id}>
                          <td style={{fontFamily:'monospace',fontSize:11,color:`${theme.sub}55`,borderBottomColor:`${theme.accent}08`}}>#{i+1}</td>
                          <td style={{fontWeight:600,color:theme.text,borderBottomColor:`${theme.accent}08`}}>{u.name}</td>
                          <td style={{color:theme.sub,borderBottomColor:`${theme.accent}08`}}>{u.email}</td>
                          <td style={{fontFamily:'monospace',fontSize:11,color:`${theme.sub}55`,borderBottomColor:`${theme.accent}08`}}>{u.id}</td>
                          <td style={{borderBottomColor:`${theme.accent}08`}}><span style={{background:`${theme.accent}10`,border:`1px solid ${theme.accent}20`,color:theme.accent,padding:'3px 8px',borderRadius:6,fontSize:10}}>User</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {/* WAITLIST */}
            {tab==='waitlist' && (
              waitlist.length===0 ? <div style={{textAlign:'center',padding:'48px',color:`${theme.sub}55`,fontSize:13}}>No waitlist signups yet</div> : (
                <div style={{overflowX:'auto'}}>
                  <table>
                    <thead><tr>
                      {['#','Email','Ref Code','Referred By','Refs Made','Joined'].map(h=>(
                        <th key={h} style={{color:`${theme.sub}77`,borderBottomColor:`${theme.accent}12`}}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {waitlist.map((w,i)=>(
                        <tr key={w.id}>
                          <td style={{fontFamily:'monospace',fontSize:11,color:`${theme.sub}55`,borderBottomColor:`${theme.accent}08`}}>#{i+1}</td>
                          <td style={{fontWeight:600,color:theme.text,borderBottomColor:`${theme.accent}08`}}>{w.email}</td>
                          <td style={{fontFamily:'monospace',fontSize:11,color:theme.accent,borderBottomColor:`${theme.accent}08`}}>{w.ref_code}</td>
                          <td style={{borderBottomColor:`${theme.accent}08`}}>{w.referred_by?<span style={{background:`${theme.accent2}15`,border:`1px solid ${theme.accent2}25`,color:theme.accent2,padding:'3px 8px',borderRadius:6,fontSize:10}}>Referred</span>:<span style={{color:`${theme.sub}44`,fontSize:12}}>Direct</span>}</td>
                          <td style={{fontFamily:'monospace',fontSize:14,fontWeight:700,color:Number(w.ref_count)>0?'#059669':`${theme.sub}44`,borderBottomColor:`${theme.accent}08`}}>{w.ref_count||0}</td>
                          <td style={{color:`${theme.sub}77`,fontSize:12,borderBottomColor:`${theme.accent}08`}}>{fmt(w.joined_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {/* ROUTES */}
            {tab==='routes' && (
              topRoutes.length===0 ? <div style={{textAlign:'center',padding:'48px',color:`${theme.sub}55`,fontSize:13}}>No booking data yet</div> : (
                <div style={{padding:20}}>
                  {topRoutes.map(([route,count])=>(
                    <div key={route} style={{background:'rgba(255,255,255,.6)',border:`1px solid ${theme.accent}10`,borderRadius:12,padding:'14px 18px',marginBottom:10,display:'flex',alignItems:'center',gap:14}}>
                      <div style={{flex:1,fontSize:14,fontWeight:500,color:theme.text}}>{route}</div>
                      <div style={{fontFamily:'monospace',fontSize:18,fontWeight:800,color:theme.accent,minWidth:36,textAlign:'right'}}>{count}</div>
                      <div style={{width:140,height:6,background:`${theme.accent}12`,borderRadius:3,overflow:'hidden'}}>
                        <div style={{width:`${(count/maxRoute)*100}%`,height:'100%',background:`linear-gradient(90deg,${theme.accent},${theme.accent2})`,borderRadius:3,transition:'width 1s ease'}}/>
                      </div>
                      <div style={{fontSize:11,color:`${theme.sub}55`,minWidth:55,fontFamily:"'Space Mono',monospace"}}>bookings</div>
                    </div>
                  ))}
                </div>
              )
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}