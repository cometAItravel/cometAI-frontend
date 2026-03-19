import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://cometai-backend.onrender.com";
const ADMIN_PASSWORD = "user2026admin";

function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "true");
      onLogin();
    } else {
      setError("Invalid password.");
      setPassword("");
    }
  };

  return (
    <div style={{minHeight:"100vh",background:"#080a0f",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{background:"rgba(15,17,26,0.98)",border:"1px solid rgba(99,102,241,0.35)",borderRadius:"16px",padding:"48px 40px",width:"100%",maxWidth:"400px",boxShadow:"0 32px 80px rgba(0,0,0,0.6)"}}>
        <div style={{color:"#6366f1",fontSize:"11px",letterSpacing:"3px",textTransform:"uppercase",marginBottom:"24px",fontFamily:"monospace"}}>— Admin Access</div>
        <div style={{color:"#f8fafc",fontSize:"22px",fontWeight:"700",marginBottom:"8px",fontFamily:"monospace"}}>CometAI Control</div>
        <div style={{color:"#64748b",fontSize:"13px",marginBottom:"32px"}}>Restricted area. Authorized personnel only.</div>
        {error && <div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",color:"#f87171",padding:"10px 14px",borderRadius:"8px",fontSize:"12px",marginBottom:"16px"}}>⚠ {error}</div>}
        <input
          style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"10px",padding:"13px 16px",color:"#f8fafc",fontSize:"14px",outline:"none",marginBottom:"16px",boxSizing:"border-box",fontFamily:"monospace",letterSpacing:"2px"}}
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyPress={e => { if (e.key === "Enter") handleLogin(); }}
          autoFocus
        />
        <button
          style={{width:"100%",padding:"13px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",borderRadius:"10px",color:"white",fontSize:"14px",fontWeight:"600",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}
          onClick={handleLogin}
        >Access Dashboard →</button>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [tab, setTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "true") {
      setAuthed(true);
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bRes, uRes, wRes] = await Promise.all([
        axios.get(`${API}/admin/bookings`).catch(() => ({ data: [] })),
        axios.get(`${API}/admin/users`).catch(() => ({ data: [] })),
        axios.get(`${API}/admin/waitlist`).catch(() => ({ data: [] })),
      ]);
      setBookings(bRes.data);
      setUsers(uRes.data);
      setWaitlist(wRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleLogout = () => { sessionStorage.removeItem("admin_auth"); setAuthed(false); };

  if (!authed) return <AdminLogin onLogin={() => { setAuthed(true); fetchData(); }} />;

  const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.price) || 0), 0);
  const routeCounts = {};
  bookings.forEach(b => {
    const r = `${b.from_city} → ${b.to_city}`;
    routeCounts[r] = (routeCounts[r] || 0) + 1;
  });
  const topRoutes = Object.entries(routeCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxRoute = topRoutes[0]?.[1] || 1;

  const fmt = (dt) => dt ? new Date(dt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : "—";
  const fmtTime = (dt) => dt ? new Date(dt).toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12:false }) : "";

  const s = {
    page: { minHeight:"100vh", background:"#080a0f", fontFamily:"'DM Sans',sans-serif", color:"#e2e8f0" },
    topbar: { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 28px", borderBottom:"1px solid rgba(255,255,255,0.07)", background:"rgba(8,10,15,0.95)", position:"sticky", top:0, zIndex:50 },
    logo: { fontFamily:"monospace", fontSize:"15px", fontWeight:"700", color:"#6366f1", letterSpacing:"1px" },
    liveBadge: { display:"flex", alignItems:"center", gap:"6px", fontSize:"11px", color:"#10b981", background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.2)", padding:"4px 10px", borderRadius:"20px" },
    liveDot: { width:"6px", height:"6px", background:"#10b981", borderRadius:"50%" },
    btnTop: { background:"transparent", border:"1px solid rgba(255,255,255,0.1)", color:"#64748b", padding:"6px 14px", borderRadius:"8px", fontSize:"12px", cursor:"pointer", marginLeft:"8px" },
    content: { padding:"28px" },
    grid4: { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"16px", marginBottom:"28px" },
    card: { background:"rgba(15,17,26,0.9)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"14px", padding:"22px" },
    cardIcon: { fontSize:"22px", marginBottom:"10px" },
    cardLabel: { fontSize:"10px", letterSpacing:"1.5px", textTransform:"uppercase", color:"#475569", marginBottom:"6px" },
    cardValue: { fontFamily:"monospace", fontSize:"28px", fontWeight:"700", color:"#f8fafc" },
    cardSub: { fontSize:"11px", color:"#10b981", marginTop:"4px" },
    tabsWrap: { display:"flex", gap:"4px", marginBottom:"20px", background:"rgba(15,17,26,0.8)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"12px", padding:"4px", width:"fit-content" },
    tabBtn: (active) => ({ padding:"8px 20px", border:"none", background: active ? "rgba(99,102,241,0.2)" : "transparent", color: active ? "#a5b4fc" : "#64748b", fontFamily:"'DM Sans',sans-serif", fontSize:"13px", fontWeight:"500", cursor:"pointer", borderRadius:"8px", transition:"all 0.2s" }),
    tableWrap: { background:"rgba(15,17,26,0.9)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"14px", overflow:"auto" },
    tableHead: { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 22px", borderBottom:"1px solid rgba(255,255,255,0.07)" },
    tableTitle: { fontFamily:"monospace", fontSize:"13px", fontWeight:"700", color:"#e2e8f0" },
    tableBadge: { fontSize:"11px", color:"#475569", background:"rgba(255,255,255,0.04)", padding:"3px 10px", borderRadius:"20px" },
    table: { width:"100%", borderCollapse:"collapse" },
    th: { padding:"11px 20px", textAlign:"left", fontSize:"10px", letterSpacing:"1.5px", textTransform:"uppercase", color:"#475569", borderBottom:"1px solid rgba(255,255,255,0.06)", fontFamily:"monospace", fontWeight:"500" },
    td: { padding:"13px 20px", fontSize:"13px", color:"#94a3b8", borderBottom:"1px solid rgba(255,255,255,0.04)" },
    tdBold: { padding:"13px 20px", fontSize:"13px", color:"#e2e8f0", fontWeight:"500", borderBottom:"1px solid rgba(255,255,255,0.04)" },
    tdMono: { padding:"13px 20px", fontSize:"11px", color:"#475569", fontFamily:"monospace", borderBottom:"1px solid rgba(255,255,255,0.04)" },
    tdPrice: { padding:"13px 20px", fontSize:"12px", color:"#6ee7b7", fontFamily:"monospace", borderBottom:"1px solid rgba(255,255,255,0.04)" },
    badgeGreen: { display:"inline-block", padding:"3px 8px", borderRadius:"6px", fontSize:"10px", background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.2)", color:"#10b981" },
    badgeBlue: { display:"inline-block", padding:"3px 8px", borderRadius:"6px", fontSize:"10px", background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.2)", color:"#818cf8" },
    badgePurple: { display:"inline-block", padding:"3px 8px", borderRadius:"6px", fontSize:"10px", background:"rgba(139,92,246,0.1)", border:"1px solid rgba(139,92,246,0.2)", color:"#c084fc" },
    empty: { textAlign:"center", padding:"48px", color:"#475569", fontSize:"13px" },
    loading: { textAlign:"center", padding:"48px", color:"#475569", fontFamily:"monospace", fontSize:"11px", letterSpacing:"2px" },
  };

  return (
    <div style={s.page}>
      {/* TOPBAR */}
      <div style={s.topbar}>
        <div style={{display:"flex",alignItems:"center",gap:"14px"}}>
          <div style={s.logo}>☄ COMETAI</div>
          <div style={{width:"1px",height:"18px",background:"rgba(255,255,255,0.1)"}}/>
          <div style={{fontSize:"12px",color:"#475569",letterSpacing:"1px",textTransform:"uppercase"}}>Admin Dashboard</div>
        </div>
        <div style={{display:"flex",alignItems:"center"}}>
          <div style={s.liveBadge}><div style={s.liveDot}/>LIVE</div>
          <button style={s.btnTop} onClick={() => navigate("/search")}>← Back to App</button>
          <button style={{...s.btnTop,color:"#f87171"}} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={s.content}>
        {/* STATS */}
        <div style={s.grid4}>
          <div style={s.card}>
            <div style={s.cardIcon}>✈️</div>
            <div style={s.cardLabel}>Total Bookings</div>
            <div style={s.cardValue}>{bookings.length}</div>
            <div style={s.cardSub}>↑ All time</div>
          </div>
          <div style={s.card}>
            <div style={s.cardIcon}>👥</div>
            <div style={s.cardLabel}>Total Users</div>
            <div style={s.cardValue}>{users.length}</div>
            <div style={s.cardSub}>↑ Registered</div>
          </div>
          <div style={s.card}>
            <div style={s.cardIcon}>💰</div>
            <div style={s.cardLabel}>Total Revenue</div>
            <div style={s.cardValue}>₹{totalRevenue.toLocaleString()}</div>
            <div style={s.cardSub}>↑ Mock payments</div>
          </div>
          <div style={s.card}>
            <div style={s.cardIcon}>📧</div>
            <div style={s.cardLabel}>Waitlist</div>
            <div style={s.cardValue}>{waitlist.length}</div>
            <div style={s.cardSub}>↑ Signed up</div>
          </div>
        </div>

        {/* TABS */}
        <div style={s.tabsWrap}>
          {[["bookings","✈️ Bookings"],["users","👥 Users"],["waitlist","📧 Waitlist"],["routes","🗺️ Routes"]].map(([id,label]) => (
            <button key={id} style={s.tabBtn(tab===id)} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>

        {loading && <div style={s.loading}>Loading data...</div>}

        {/* BOOKINGS */}
        {!loading && tab === "bookings" && (
          <div style={s.tableWrap}>
            <div style={s.tableHead}>
              <div style={s.tableTitle}>All Bookings</div>
              <div style={s.tableBadge}>{bookings.length} total</div>
            </div>
            {bookings.length === 0 ? <div style={s.empty}>No bookings yet</div> : (
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>#</th>
                    <th style={s.th}>Passenger</th>
                    <th style={s.th}>Route</th>
                    <th style={s.th}>Date</th>
                    <th style={s.th}>Amount</th>
                    <th style={s.th}>Email</th>
                    <th style={s.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id} style={{cursor:"default"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(99,102,241,0.04)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={s.tdMono}>#{b.id}</td>
                      <td style={s.tdBold}>{b.passenger_name}</td>
                      <td style={s.td}><span style={{color:"#e2e8f0"}}>{b.from_city}</span> <span style={{color:"#475569"}}>→</span> <span style={{color:"#e2e8f0"}}>{b.to_city}</span></td>
                      <td style={s.td}>{fmt(b.departure_time)} {fmtTime(b.departure_time)}</td>
                      <td style={s.tdPrice}>₹{Number(b.price)?.toLocaleString()}</td>
                      <td style={s.td}>{b.user_email || "—"}</td>
                      <td style={s.td}><span style={s.badgeGreen}>✓ Confirmed</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* USERS */}
        {!loading && tab === "users" && (
          <div style={s.tableWrap}>
            <div style={s.tableHead}>
              <div style={s.tableTitle}>All Users</div>
              <div style={s.tableBadge}>{users.length} registered</div>
            </div>
            {users.length === 0 ? <div style={s.empty}>No users yet</div> : (
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>#</th>
                    <th style={s.th}>Name</th>
                    <th style={s.th}>Email</th>
                    <th style={s.th}>User ID</th>
                    <th style={s.th}>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.id} onMouseEnter={e=>e.currentTarget.style.background="rgba(99,102,241,0.04)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={s.tdMono}>#{i+1}</td>
                      <td style={s.tdBold}>{u.name}</td>
                      <td style={s.td}>{u.email}</td>
                      <td style={s.tdMono}>{u.id}</td>
                      <td style={s.td}><span style={s.badgeBlue}>User</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* WAITLIST */}
        {!loading && tab === "waitlist" && (
          <div style={s.tableWrap}>
            <div style={s.tableHead}>
              <div style={s.tableTitle}>Waitlist Signups</div>
              <div style={s.tableBadge}>{waitlist.length} signups</div>
            </div>
            {waitlist.length === 0 ? <div style={s.empty}>No waitlist signups yet</div> : (
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>#</th>
                    <th style={s.th}>Email</th>
                    <th style={s.th}>Ref Code</th>
                    <th style={s.th}>Referred By</th>
                    <th style={s.th}>Refs Made</th>
                    <th style={s.th}>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {waitlist.map((w, i) => (
                    <tr key={w.id} onMouseEnter={e=>e.currentTarget.style.background="rgba(99,102,241,0.04)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={s.tdMono}>#{i+1}</td>
                      <td style={s.tdBold}>{w.email}</td>
                      <td style={s.tdMono}>{w.ref_code}</td>
                      <td style={s.td}>{w.referred_by ? <span style={s.badgePurple}>Referred</span> : <span style={{color:"#475569",fontSize:"12px"}}>Direct</span>}</td>
                      <td style={s.td}>
                        <span style={{fontFamily:"monospace",fontSize:"14px",fontWeight:"700",color: Number(w.ref_count) > 0 ? "#6ee7b7" : "#475569"}}>
                          {w.ref_count || 0}
                        </span>
                      </td>
                      <td style={s.td}>{fmt(w.joined_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ROUTES */}
        {!loading && tab === "routes" && (
          <div style={s.tableWrap}>
            <div style={s.tableHead}>
              <div style={s.tableTitle}>Popular Routes</div>
              <div style={s.tableBadge}>{topRoutes.length} routes</div>
            </div>
            {topRoutes.length === 0 ? <div style={s.empty}>No booking data yet</div> : (
              <div style={{padding:"20px"}}>
                {topRoutes.map(([route, count]) => (
                  <div key={route} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"10px",padding:"16px 20px",marginBottom:"10px",display:"flex",alignItems:"center",gap:"16px"}}>
                    <div style={{flex:1,fontSize:"14px",fontWeight:"500",color:"#e2e8f0"}}>{route}</div>
                    <div style={{fontFamily:"monospace",fontSize:"20px",fontWeight:"700",color:"#6366f1",minWidth:"40px",textAlign:"right"}}>{count}</div>
                    <div style={{width:"160px",height:"6px",background:"rgba(255,255,255,0.06)",borderRadius:"3px",overflow:"hidden"}}>
                      <div style={{width:`${(count/maxRoute)*100}%`,height:"100%",background:"linear-gradient(90deg,#6366f1,#8b5cf6)",borderRadius:"3px"}}/>
                    </div>
                    <div style={{fontSize:"11px",color:"#475569",minWidth:"60px"}}>bookings</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;