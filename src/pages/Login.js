import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const API = "https://cometai-backend.onrender.com";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [waking, setWaking] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    fetch(`${API}/test`).then(() => setWaking(false)).catch(() => setWaking(false));
    setTimeout(() => setWaking(false), 6000);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const themeIndex = scrollY < 300 ? 0 : 1;
  const themes = [
    { bg:'linear-gradient(135deg,#f8f6ff 0%,#f0ebff 30%,#e8f4ff 60%,#f5f8ff 100%)', accent:'#6d28d9', accent2:'#8b5cf6', text:'#1e1033', sub:'#4c1d95', card:'rgba(255,255,255,0.85)', cardBorder:'rgba(109,40,217,0.15)' },
    { bg:'linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 30%,#bae6fd 60%,#f0f9ff 100%)', accent:'#0284c7', accent2:'#0ea5e9', text:'#0c4a6e', sub:'#075985', card:'rgba(255,255,255,0.85)', cardBorder:'rgba(2,132,199,0.15)' },
  ];
  const theme = themes[themeIndex];

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

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill all fields"); return; }
    setLoading(true); setError("");
    try {
      const res = await axios.post(`${API}/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/search");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", overflowX:"hidden", fontFamily:"'DM Sans',sans-serif", position:"relative", transition:"background 1.6s ease", background:theme.bg, display:"flex", flexDirection:"column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        @keyframes floatBlob{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(2%,-3%) scale(1.05);}66%{transform:translate(-2%,2%) scale(0.97);}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
        @keyframes scanLine{0%{top:-1px;opacity:0;}5%{opacity:.3;}95%{opacity:.3;}100%{top:100%;opacity:0;}}
        .input-field{width:100%;border-radius:12px;padding:14px 18px;font-family:'DM Sans',sans-serif;font-size:15px;outline:none;transition:all .3s;border:1.5px solid;}
        .btn-main{border:none;border-radius:14px;font-family:'DM Sans',sans-serif;font-weight:700;cursor:pointer;position:relative;overflow:hidden;transition:all .3s;}
        .btn-main::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.2),transparent);}
        .btn-main:hover{transform:translateY(-2px);}
        .scan{position:fixed;left:0;width:100%;height:1px;pointer-events:none;z-index:2;animation:scanLine 14s linear infinite;}
      `}</style>

      <canvas ref={canvasRef} style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',opacity:.55}}/>
      <motion.div animate={{background:`radial-gradient(ellipse at 20% 40%,${theme.accent}18 0%,transparent 55%)`}} transition={{duration:1.8}}
        style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',animation:'floatBlob 12s ease-in-out infinite'}}/>
      <motion.div animate={{background:`radial-gradient(ellipse at 80% 20%,${theme.accent2}14 0%,transparent 50%)`}} transition={{duration:1.8}}
        style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',animation:'floatBlob 16s ease-in-out infinite reverse'}}/>
      <motion.div animate={{backgroundImage:`linear-gradient(${theme.accent}07 1px,transparent 1px),linear-gradient(90deg,${theme.accent}07 1px,transparent 1px)`}} transition={{duration:1.8}}
        style={{position:'fixed',inset:0,backgroundSize:'72px 72px',maskImage:'radial-gradient(ellipse 80% 70% at 50% 40%,black 20%,transparent 80%)',zIndex:0,pointerEvents:'none'}}/>
      <div className="scan" style={{background:`linear-gradient(90deg,transparent,${theme.accent}18,transparent)`}}/>

      {waking && (
        <div style={{position:'fixed',top:0,left:0,right:0,zIndex:200,background:'rgba(251,191,36,.12)',borderBottom:'1px solid rgba(251,191,36,.3)',padding:'10px 24px',textAlign:'center',backdropFilter:'blur(10px)'}}>
          <span style={{fontSize:12,color:'#92400e',fontFamily:"'Space Mono',monospace",letterSpacing:'1px'}}>⚡ Waking up servers... first load may take 30s</span>
        </div>
      )}

      {/* NAV */}
      <motion.nav animate={{background:'rgba(255,255,255,0.8)',borderBottomColor:`${theme.accent}15`}} transition={{duration:1.6}}
        style={{position:'fixed',top:0,left:0,right:0,zIndex:100,backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)',borderBottom:'1px solid',boxShadow:`0 1px 20px ${theme.accent}10`}}>
        <div style={{maxWidth:900,margin:'0 auto',padding:'14px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer'}} onClick={()=>navigate('/')}>
            <motion.div animate={{background:`linear-gradient(135deg,${theme.accent},${theme.accent2})`,boxShadow:`0 4px 14px ${theme.accent}40`}} transition={{duration:1.6}}
              style={{width:34,height:34,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,color:'white',flexShrink:0}}>☄</motion.div>
            <motion.span animate={{color:theme.text}} transition={{duration:1.6}} style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:800,letterSpacing:'.5px'}}>COMETAI</motion.span>
          </div>
          <motion.span animate={{color:`${theme.sub}88`}} transition={{duration:1.6}} style={{fontSize:13,fontFamily:"'Space Mono',monospace"}}>Sign In</motion.span>
        </div>
      </motion.nav>

      {/* CARD */}
      <div style={{position:'relative',zIndex:2,flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'90px 24px 40px'}}>
        <motion.div initial={{opacity:0,y:30,scale:.97}} animate={{opacity:1,y:0,scale:1}} transition={{duration:.7,ease:'easeOut'}}
          style={{width:'100%',maxWidth:440}}>
          <motion.div animate={{background:theme.card,borderColor:theme.cardBorder,boxShadow:`0 8px 48px ${theme.accent}10`}} transition={{duration:1.6}}
            style={{border:'1px solid',borderRadius:24,padding:'44px 36px',backdropFilter:'blur(20px)',position:'relative',overflow:'hidden'}}>
            <motion.div animate={{background:`linear-gradient(90deg,transparent,${theme.accent}35,${theme.accent2}25,transparent)`}} transition={{duration:1.6}}
              style={{position:'absolute',top:0,left:0,right:0,height:1}}/>

            <div style={{textAlign:'center',marginBottom:32}}>
              <motion.div animate={{background:`linear-gradient(135deg,${theme.accent},${theme.accent2})`,boxShadow:`0 8px 24px ${theme.accent}40`}} transition={{duration:1.6}}
                style={{width:52,height:52,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,color:'white',margin:'0 auto 16px'}}>☄</motion.div>
              <motion.h1 animate={{color:theme.text}} transition={{duration:1.6}} style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:800,marginBottom:6,letterSpacing:'-.5px'}}>Welcome back</motion.h1>
              <motion.p animate={{color:`${theme.sub}88`}} transition={{duration:1.6}} style={{fontSize:13}}>Sign in to continue your journey</motion.p>
            </div>

            {error && (
              <div style={{background:'rgba(239,68,68,.06)',border:'1px solid rgba(239,68,68,.2)',borderRadius:10,padding:'10px 14px',marginBottom:20,fontSize:13,color:'#dc2626'}}>⚠ {error}</div>
            )}

            {[{label:'Email',val:email,set:setEmail,type:'email',ph:'your@email.com'},{label:'Password',val:password,set:setPassword,type:'password',ph:'••••••••'}].map((f,i)=>(
              <div key={i} style={{marginBottom:16}}>
                <motion.label animate={{color:`${theme.sub}88`}} transition={{duration:1.6}} style={{fontSize:11,letterSpacing:'1.5px',textTransform:'uppercase',display:'block',marginBottom:8,fontFamily:"'Space Mono',monospace"}}>{f.label}</motion.label>
                <motion.input className="input-field" type={f.type} placeholder={f.ph} value={f.val} onChange={e=>f.set(e.target.value)} onKeyPress={e=>{if(e.key==="Enter")handleLogin();}}
                  animate={{borderColor:`${theme.accent}25`,background:'rgba(255,255,255,.9)',color:theme.text}} transition={{duration:1.6}}
                  style={{caretColor:theme.accent}}/>
              </div>
            ))}

            <div style={{marginBottom:24}}/>
            <motion.button className="btn-main" onClick={handleLogin} disabled={loading}
              animate={{background:`linear-gradient(135deg,${theme.accent},${theme.accent2})`,boxShadow:`0 8px 28px ${theme.accent}40`}} transition={{duration:1.6}}
              style={{width:'100%',padding:'14px',fontSize:15,color:'white'}}>
              {loading ? "Signing in..." : "Sign In →"}
            </motion.button>

            <motion.p animate={{color:`${theme.sub}66`}} transition={{duration:1.6}} style={{textAlign:'center',marginTop:20,fontSize:13}}>
              Don't have an account?{" "}
              <motion.span animate={{color:theme.accent}} transition={{duration:1.6}} style={{cursor:'pointer',fontWeight:600}} onClick={()=>navigate('/register')}>Create one</motion.span>
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}