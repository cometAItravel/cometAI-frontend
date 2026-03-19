import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://cometai-backend.onrender.com";

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [trail, setTrail] = useState([]);
  const trailId = useRef(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    axios.get(`${API}/my-bookings`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setBookings(r.data))
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [navigate]);

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

  const fmt = (dt) => dt ? new Date(dt).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "—";
  const fmtTime = (dt) => dt ? new Date(dt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false }) : "";

  return (
    <div style={{ minHeight: "100vh", background: "#00000a", color: "#e0e7ff", fontFamily: "'DM Sans', sans-serif", cursor: "none" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes trailFade { 0%{opacity:0.7;} 100%{opacity:0;transform:scale(0.2);} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(30px);} to{opacity:1;transform:translateY(0);} }
        @keyframes shimmer { 0%{background-position:200% center;} 100%{background-position:-200% center;} }
        @keyframes float { 0%,100%{transform:translateY(0) rotate(0deg);} 50%{transform:translateY(-8px) rotate(2deg);} }
        .booking-card { transition:transform 0.3s cubic-bezier(0.23,1,0.32,1),box-shadow 0.3s ease; animation:fadeSlideUp 0.6s ease both; }
        .booking-card:hover { transform:perspective(800px) translateZ(16px) scale(1.01) !important; box-shadow:0 24px 60px rgba(0,0,0,0.8),0 0 40px rgba(99,102,241,0.2) !important; }
        .grain { position:fixed; inset:0; z-index:0; pointer-events:none; opacity:0.04; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); background-size:200px; }
      `}</style>

      <div className="grain"/>
      {trail.map(t => (<div key={t.id} style={{position:"fixed",left:t.x,top:t.y,width:6,height:6,borderRadius:"50%",pointerEvents:"none",zIndex:9999,background:"rgba(99,102,241,0.7)",transform:"translate(-50%,-50%)",animation:"trailFade 0.5s ease forwards"}}/>))}
      <div style={{position:"fixed",left:mouse.x*window.innerWidth,top:mouse.y*window.innerHeight,width:18,height:18,borderRadius:"50%",pointerEvents:"none",zIndex:9999,border:"2px solid rgba(99,102,241,0.8)",transform:"translate(-50%,-50%)",boxShadow:"0 0 16px rgba(99,102,241,0.5)"}}/>
      <div style={{position:"fixed",inset:0,background:"radial-gradient(ellipse at 30% 20%,rgba(60,20,140,0.25) 0%,transparent 50%),#00000a",zIndex:0}}/>
      <div style={{position:"fixed",inset:0,backgroundImage:"linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px)",backgroundSize:"60px 60px",zIndex:0,maskImage:"radial-gradient(ellipse 80% 80% at 50% 50%,black,transparent)"}}/>
      <div style={{position:"fixed",inset:0,background:`radial-gradient(ellipse 500px 400px at ${mouse.x*100}% ${mouse.y*100}%,rgba(99,102,241,0.06) 0%,transparent 70%)`,zIndex:0,pointerEvents:"none"}}/>

      {/* NAV */}
      <nav style={{position:"sticky",top:0,zIndex:50,background:"rgba(0,0,10,0.8)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(99,102,241,0.1)",padding:"18px 40px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>navigate("/")}>
          <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>☄</div>
          <span style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,background:"linear-gradient(90deg,#e0e7ff,#a5b4fc)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>COMETAI</span>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>navigate("/search")} style={{background:"transparent",border:"1px solid rgba(99,102,241,0.3)",color:"#a5b4fc",padding:"8px 18px",borderRadius:8,fontFamily:"'DM Sans',sans-serif",fontSize:13,cursor:"pointer"}}>← Search</button>
          <button onClick={()=>{localStorage.removeItem("token");navigate("/login");}} style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",color:"#f87171",padding:"8px 18px",borderRadius:8,fontFamily:"'DM Sans',sans-serif",fontSize:13,cursor:"pointer"}}>Logout</button>
        </div>
      </nav>

      <div style={{position:"relative",zIndex:2,maxWidth:900,margin:"0 auto",padding:"48px 24px"}}>
        <div style={{marginBottom:48}}>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:"#6366f1",letterSpacing:"3px",textTransform:"uppercase",marginBottom:12}}>— Your trips</div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(32px,5vw,52px)",fontWeight:800,letterSpacing:"-1px"}}>
            <span style={{background:"linear-gradient(135deg,#e0e7ff,#a5b4fc,#c084fc)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>My Bookings</span>
          </h1>
          {!loading && <p style={{fontSize:14,color:"rgba(165,180,252,0.4)",marginTop:8}}>{bookings.length} booking{bookings.length!==1?"s":""} found</p>}
        </div>

        {loading ? (
          <div style={{textAlign:"center",padding:"80px 0"}}>
            <div style={{width:48,height:48,border:"2px solid rgba(99,102,241,0.2)",borderTop:"2px solid #6366f1",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 16px"}}/>
            <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
            <p style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:"rgba(165,180,252,0.4)",letterSpacing:"2px"}}>Loading...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div style={{textAlign:"center",padding:"100px 24px"}}>
            <div style={{fontSize:64,marginBottom:20,animation:"float 3s ease-in-out infinite"}}>✈️</div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:700,color:"rgba(165,180,252,0.4)",marginBottom:12}}>No bookings yet</h2>
            <p style={{fontSize:14,color:"rgba(165,180,252,0.25)",marginBottom:28}}>Your flight adventures will appear here</p>
            <button onClick={()=>navigate("/search")} style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",color:"white",padding:"14px 32px",borderRadius:12,fontFamily:"'DM Sans',sans-serif",fontSize:15,fontWeight:600,cursor:"pointer"}}>Search Flights →</button>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {bookings.map((b, i) => (
              <div key={b.id} className="booking-card" style={{
                background:"rgba(8,8,24,0.95)", border:"1px solid rgba(99,102,241,0.15)",
                borderRadius:20, padding:28, position:"relative", overflow:"hidden",
                animationDelay:`${i*0.08}s`, backdropFilter:"blur(20px)"
              }}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(99,102,241,0.4),transparent)"}}/>
                <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 0% 0%,rgba(99,102,241,0.04) 0%,transparent 60%)",pointerEvents:"none"}}/>

                {/* confirmed badge */}
                <div style={{position:"absolute",top:20,right:24,display:"flex",alignItems:"center",gap:6,background:"rgba(52,211,153,0.1)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:20,padding:"4px 12px"}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:"#6ee7b7"}}/>
                  <span style={{fontSize:10,color:"#6ee7b7",fontFamily:"'Space Mono',monospace",letterSpacing:"1px"}}>CONFIRMED</span>
                </div>

                {/* route display */}
                <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:20}}>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:28,fontWeight:800,color:"#e0e7ff",lineHeight:1}}>{fmtTime(b.departure_time)}</div>
                    <div style={{fontSize:12,color:"rgba(165,180,252,0.4)",marginTop:4,letterSpacing:"1px"}}>{b.from_city?.slice(0,3).toUpperCase()}</div>
                  </div>
                  <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                    <div style={{fontSize:10,color:"rgba(165,180,252,0.3)",letterSpacing:"1px"}}>DIRECT</div>
                    <div style={{width:"100%",height:1,background:"linear-gradient(90deg,rgba(99,102,241,0.3),rgba(192,132,252,0.5),rgba(99,102,241,0.3))",position:"relative"}}>
                      <span style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:14,filter:"drop-shadow(0 0 6px rgba(99,102,241,0.8))"}}>✈</span>
                    </div>
                    <div style={{fontSize:10,color:"rgba(165,180,252,0.3)"}}>{fmt(b.departure_time)}</div>
                  </div>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:28,fontWeight:800,color:"#e0e7ff",lineHeight:1}}>——</div>
                    <div style={{fontSize:12,color:"rgba(165,180,252,0.4)",marginTop:4,letterSpacing:"1px"}}>{b.to_city?.slice(0,3).toUpperCase()}</div>
                  </div>
                </div>

                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:16,borderTop:"1px solid rgba(255,255,255,0.05)"}}>
                  <div>
                    <div style={{fontSize:10,color:"rgba(165,180,252,0.35)",letterSpacing:"1px",marginBottom:4,fontFamily:"'Space Mono',monospace"}}>PASSENGER</div>
                    <div style={{fontSize:15,fontWeight:600,color:"#e0e7ff"}}>{b.passenger_name}</div>
                  </div>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:10,color:"rgba(165,180,252,0.35)",letterSpacing:"1px",marginBottom:4,fontFamily:"'Space Mono',monospace"}}>ROUTE</div>
                    <div style={{fontSize:14,color:"#a5b4fc"}}>{b.from_city} → {b.to_city}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:10,color:"rgba(165,180,252,0.35)",letterSpacing:"1px",marginBottom:4,fontFamily:"'Space Mono',monospace"}}>AMOUNT</div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,background:"linear-gradient(135deg,#a5f3fc,#818cf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>₹{Number(b.price)?.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}