import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";

const API = "https://cometai-backend.onrender.com";

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  const themeIndex = scrollY < 400 ? 0 : 1;
  const themes = [
    { bg:'linear-gradient(135deg,#f8f6ff 0%,#f0ebff 30%,#e8f4ff 60%,#f5f8ff 100%)', accent:'#6d28d9', accent2:'#8b5cf6', text:'#1e1033', sub:'#4c1d95', card:'rgba(255,255,255,0.85)', cardBorder:'rgba(109,40,217,0.12)' },
    { bg:'linear-gradient(135deg,#fffbeb 0%,#fef3c7 30%,#fde68a 60%,#fffbeb 100%)', accent:'#d97706', accent2:'#f59e0b', text:'#78350f', sub:'#92400e', card:'rgba(255,255,255,0.85)', cardBorder:'rgba(217,119,6,0.15)' },
  ];
  const theme = themes[themeIndex];

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    axios.get(`${API}/my-bookings`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setBookings(r.data))
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [navigate]);

  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext("2d");
    cv.width = window.innerWidth; cv.height = window.innerHeight;
    const particles = Array.from({length:120},()=>({
      x:Math.random()*cv.width, y:Math.random()*cv.height,
      r:Math.random()*2.5+0.4, op:Math.random()*.4+.1,
      vx:(Math.random()-.5)*.25, vy:(Math.random()-.5)*.25,
      tw:Math.random()*Math.PI*2, ts:Math.random()*.013+.003,
      hue:Math.floor(Math.random()*60)+200,
    }));
    const meteors=[]; let mt=0;
    const spawn=()=>meteors.push({x:Math.random()*cv.width*.7,y:Math.random()*cv.height*.4,len:70+Math.random()*120,spd:5+Math.random()*5,ang:Math.PI/6+Math.random()*.3,life:0,max:28+Math.random()*16});
    const draw=()=>{
      ctx.clearRect(0,0,cv.width,cv.height);
      particles.forEach(p=>{
        p.tw+=p.ts; p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=cv.width; if(p.x>cv.width)p.x=0;
        if(p.y<0)p.y=cv.height; if(p.y>cv.height)p.y=0;
        const op=p.op*(0.5+0.5*Math.sin(p.tw));
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`hsla(${p.hue},75%,60%,${op})`; ctx.fill();
      });
      mt++; if(mt>100+Math.random()*60){spawn();mt=0;}
      meteors.forEach((m,i)=>{
        m.life++;
        const op=Math.sin((m.life/m.max)*Math.PI)*.5;
        const tx=Math.cos(m.ang)*m.len; const ty=Math.sin(m.ang)*m.len;
        const g=ctx.createLinearGradient(m.x,m.y,m.x-tx,m.y-ty);
        g.addColorStop(0,`rgba(100,100,255,${op})`);
        g.addColorStop(.4,`rgba(150,120,255,${op*.6})`);
        g.addColorStop(1,"transparent");
        ctx.beginPath();ctx.moveTo(m.x,m.y);ctx.lineTo(m.x-tx,m.y-ty);
        ctx.strokeStyle=g;ctx.lineWidth=1.3;ctx.stroke();
        m.x+=Math.cos(m.ang)*m.spd; m.y+=Math.sin(m.ang)*m.spd;
        if(m.life>=m.max)meteors.splice(i,1);
      });
      animRef.current=requestAnimationFrame(draw);
    };
    draw();
    const r=()=>{cv.width=window.innerWidth;cv.height=window.innerHeight;};
    window.addEventListener("resize",r);
    return()=>{cancelAnimationFrame(animRef.current);window.removeEventListener("resize",r);};
  },[]);

  const fmt = dt => dt ? new Date(dt).toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short",year:"numeric"}) : "—";
  const fmtT = dt => dt ? new Date(dt).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:false}) : "";

  function BookingCard({ b, i }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once:false, margin:"-60px" });
    return (
      <motion.div ref={ref} initial={{opacity:0,y:28}} animate={inView?{opacity:1,y:0}:{opacity:0,y:28}} transition={{delay:i*.08,duration:.6}}
        whileHover={{boxShadow:`0 20px 50px ${theme.accent}14`,y:-4}}
        style={{background:theme.card,border:`1px solid ${theme.cardBorder}`,borderRadius:20,padding:28,position:'relative',overflow:'hidden',boxShadow:`0 4px 24px ${theme.accent}08`,transition:'box-shadow .3s,transform .3s'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${theme.accent}30,transparent)`}}/>
        <div style={{position:'absolute',top:18,right:20,display:'flex',alignItems:'center',gap:6,background:'rgba(5,150,105,.08)',border:'1px solid rgba(5,150,105,.2)',borderRadius:20,padding:'4px 10px'}}>
          <div style={{width:5,height:5,borderRadius:'50%',background:'#059669'}}/>
          <span style={{fontSize:10,color:'#059669',fontFamily:"'Space Mono',monospace",letterSpacing:'1px'}}>CONFIRMED</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:20,marginBottom:20}}>
          <div style={{textAlign:'center'}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:theme.text,lineHeight:1}}>{fmtT(b.departure_time)||"--:--"}</div>
            <div style={{fontSize:12,color:`${theme.sub}66`,marginTop:4,letterSpacing:'1px'}}>{b.from_city?.slice(0,3).toUpperCase()}</div>
          </div>
          <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
            <div style={{fontSize:10,color:`${theme.sub}55`,letterSpacing:'1px'}}>DIRECT</div>
            <div style={{width:'100%',height:1.5,background:`linear-gradient(90deg,${theme.accent}40,${theme.accent2}80,${theme.accent}40)`,position:'relative',borderRadius:1}}>
              <span style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontSize:14,filter:`drop-shadow(0 0 6px ${theme.accent}80)`,color:theme.accent}}>✈</span>
            </div>
            <div style={{fontSize:10,color:`${theme.sub}44`}}>{fmt(b.departure_time)}</div>
          </div>
          <div style={{textAlign:'center'}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:theme.text,lineHeight:1}}>——</div>
            <div style={{fontSize:12,color:`${theme.sub}66`,marginTop:4,letterSpacing:'1px'}}>{b.to_city?.slice(0,3).toUpperCase()}</div>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:16,borderTop:`1px solid ${theme.accent}10`}}>
          <div>
            <div style={{fontSize:10,color:`${theme.sub}55`,letterSpacing:'1px',marginBottom:4,fontFamily:"'Space Mono',monospace"}}>PASSENGER</div>
            <div style={{fontSize:15,fontWeight:600,color:theme.text}}>{b.passenger_name}</div>
          </div>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:10,color:`${theme.sub}55`,letterSpacing:'1px',marginBottom:4,fontFamily:"'Space Mono',monospace"}}>ROUTE</div>
            <div style={{fontSize:13,color:theme.sub}}>{b.from_city} → {b.to_city}</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:10,color:`${theme.sub}55`,letterSpacing:'1px',marginBottom:4,fontFamily:"'Space Mono',monospace"}}>AMOUNT</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:theme.accent}}>₹{Number(b.price)?.toLocaleString()}</div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", overflowX:"hidden", fontFamily:"'DM Sans',sans-serif", position:"relative", transition:"background 1.6s ease", background:theme.bg }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes floatAnim{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
        @keyframes floatBlob{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(2%,-3%) scale(1.05);}66%{transform:translate(-2%,2%) scale(0.97);}}
      `}</style>

      <canvas ref={canvasRef} style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',opacity:.55}}/>
      <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',background:`radial-gradient(ellipse at 20% 40%,${theme.accent}15 0%,transparent 55%)`,animation:'floatBlob 12s ease-in-out infinite'}}/>
      <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',background:`radial-gradient(ellipse at 80% 20%,${theme.accent2}12 0%,transparent 50%)`,animation:'floatBlob 16s ease-in-out infinite reverse'}}/>

      {/* NAV */}
      <nav style={{position:'sticky',top:0,zIndex:50,background:'rgba(255,255,255,0.85)',backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)',borderBottom:`1px solid ${theme.accent}12`,boxShadow:`0 1px 20px ${theme.accent}08`}}>
        <div style={{maxWidth:900,margin:'0 auto',padding:'14px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer'}} onClick={()=>navigate('/')}>
            <div style={{width:32,height:32,borderRadius:'50%',background:`linear-gradient(135deg,${theme.accent},${theme.accent2})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,color:'white',boxShadow:`0 4px 14px ${theme.accent}40`}}>☄</div>
            <span style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,color:theme.text,letterSpacing:'.5px'}}>COMETAI</span>
          </div>
          <div style={{display:'flex',gap:10}}>
            <button onClick={()=>navigate('/search')} style={{background:'transparent',border:`1px solid ${theme.accent}30`,color:theme.sub,padding:'7px 16px',borderRadius:10,fontFamily:"'DM Sans',sans-serif",fontSize:13,cursor:'pointer'}}>← Search</button>
            <button onClick={()=>{localStorage.removeItem("token");navigate("/login");}} style={{background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.2)',color:'#dc2626',padding:'7px 16px',borderRadius:10,fontFamily:"'DM Sans',sans-serif",fontSize:13,cursor:'pointer'}}>Logout</button>
          </div>
        </div>
      </nav>

      <div style={{position:'relative',zIndex:2,maxWidth:860,margin:'0 auto',padding:'48px 24px'}}>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6}} style={{marginBottom:40}}>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:theme.accent,letterSpacing:'3px',textTransform:'uppercase',marginBottom:12}}>— Your trips</div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:'clamp(28px,5vw,46px)',fontWeight:800,letterSpacing:'-1px',color:theme.text}}>My Bookings</h1>
          {!loading && <p style={{fontSize:13,color:`${theme.sub}66`,marginTop:8}}>{bookings.length} booking{bookings.length!==1?"s":""} found</p>}
        </motion.div>

        {loading ? (
          <div style={{textAlign:'center',padding:'80px 0'}}>
            <div style={{width:44,height:44,border:`2px solid ${theme.accent}20`,borderTop:`2px solid ${theme.accent}`,borderRadius:'50%',animation:'spin 1s linear infinite',margin:'0 auto 16px'}}/>
            <p style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:`${theme.sub}55`,letterSpacing:'2px'}}>Loading...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div style={{textAlign:'center',padding:'80px 24px'}}>
            <div style={{fontSize:60,marginBottom:20,animation:'floatAnim 3s ease-in-out infinite'}}>✈️</div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,color:`${theme.sub}66`,marginBottom:10}}>No bookings yet</h2>
            <p style={{fontSize:14,color:`${theme.sub}44`,marginBottom:28}}>Your flight adventures will appear here</p>
            <button onClick={()=>navigate('/search')} style={{background:`linear-gradient(135deg,${theme.accent},${theme.accent2})`,border:'none',color:'white',padding:'13px 28px',borderRadius:12,fontFamily:"'DM Sans',sans-serif",fontSize:15,fontWeight:600,cursor:'pointer',boxShadow:`0 8px 24px ${theme.accent}40`}}>Search Flights →</button>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {bookings.map((b,i) => <BookingCard key={b.id} b={b} i={i}/>)}
          </div>
        )}
      </div>
    </div>
  );
}