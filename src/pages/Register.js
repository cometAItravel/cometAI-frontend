import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const API = "https://cometai-backend.onrender.com";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  const theme = { bg:'linear-gradient(135deg,#f0fdf9 0%,#e0faf4 30%,#ccfbf0 60%,#f0fdf9 100%)', accent:'#059669', accent2:'#10b981', text:'#064e3b', sub:'#065f46', card:'rgba(255,255,255,0.85)', cardBorder:'rgba(5,150,105,0.15)' };

  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext("2d");
    cv.width = window.innerWidth; cv.height = window.innerHeight;
    const particles = Array.from({length:110},()=>({
      x:Math.random()*cv.width, y:Math.random()*cv.height,
      r:Math.random()*2.5+0.4, op:Math.random()*.4+.1,
      vx:(Math.random()-.5)*.25, vy:(Math.random()-.5)*.25,
      tw:Math.random()*Math.PI*2, ts:Math.random()*.013+.003,
      hue:Math.floor(Math.random()*40)+150,
    }));
    const meteors=[]; let mt=0;
    const spawn=()=>meteors.push({x:Math.random()*cv.width*.7,y:Math.random()*cv.height*.4,len:70+Math.random()*110,spd:5+Math.random()*5,ang:Math.PI/6+Math.random()*.3,life:0,max:26+Math.random()*16});
    const draw=()=>{
      ctx.clearRect(0,0,cv.width,cv.height);
      particles.forEach(p=>{
        p.tw+=p.ts; p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=cv.width; if(p.x>cv.width)p.x=0;
        if(p.y<0)p.y=cv.height; if(p.y>cv.height)p.y=0;
        const op=p.op*(0.5+0.5*Math.sin(p.tw));
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`hsla(${p.hue},70%,55%,${op})`; ctx.fill();
      });
      mt++; if(mt>100+Math.random()*60){spawn();mt=0;}
      meteors.forEach((m,i)=>{
        m.life++;
        const op=Math.sin((m.life/m.max)*Math.PI)*.5;
        const tx=Math.cos(m.ang)*m.len; const ty=Math.sin(m.ang)*m.len;
        const g=ctx.createLinearGradient(m.x,m.y,m.x-tx,m.y-ty);
        g.addColorStop(0,`rgba(5,150,105,${op})`);
        g.addColorStop(.4,`rgba(16,185,129,${op*.6})`);
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

  const handleRegister = async () => {
    if (!name || !email || !password) { setError("Please fill all fields"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true); setError("");
    try {
      await axios.post(`${API}/register`, { name, email, password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", overflowX:"hidden", fontFamily:"'DM Sans',sans-serif", position:"relative", background:theme.bg, display:"flex", flexDirection:"column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        @keyframes floatBlob{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(2%,-3%) scale(1.05);}66%{transform:translate(-2%,2%) scale(0.97);}}
        @keyframes successPop{0%{transform:scale(.85);opacity:0;}100%{transform:scale(1);opacity:1;}}
        @keyframes scanLine{0%{top:-1px;opacity:0;}5%{opacity:.3;}95%{opacity:.3;}100%{top:100%;opacity:0;}}
        .input-field{width:100%;border-radius:12px;padding:14px 18px;font-family:'DM Sans',sans-serif;font-size:15px;outline:none;transition:all .3s;border:1.5px solid;}
        .btn-main{border:none;border-radius:14px;font-family:'DM Sans',sans-serif;font-weight:700;cursor:pointer;position:relative;overflow:hidden;transition:all .3s;}
        .btn-main::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.2),transparent);}
        .btn-main:hover{transform:translateY(-2px);}
        .scan{position:fixed;left:0;width:100%;height:1px;pointer-events:none;z-index:2;animation:scanLine 14s linear infinite;}
      `}</style>

      <canvas ref={canvasRef} style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',opacity:.55}}/>
      <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',background:`radial-gradient(ellipse at 20% 40%,${theme.accent}18 0%,transparent 55%)`,animation:'floatBlob 12s ease-in-out infinite'}}/>
      <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',background:`radial-gradient(ellipse at 80% 20%,${theme.accent2}14 0%,transparent 50%)`,animation:'floatBlob 16s ease-in-out infinite reverse'}}/>
      <div className="scan" style={{background:`linear-gradient(90deg,transparent,${theme.accent}18,transparent)`}}/>

      {/* NAV */}
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:100,background:'rgba(255,255,255,0.8)',backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)',borderBottom:`1px solid ${theme.accent}15`,boxShadow:`0 1px 20px ${theme.accent}10`}}>
        <div style={{maxWidth:900,margin:'0 auto',padding:'14px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer'}} onClick={()=>navigate('/')}>
            <div style={{width:34,height:34,borderRadius:'50%',background:`linear-gradient(135deg,${theme.accent},${theme.accent2})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,color:'white',flexShrink:0,boxShadow:`0 4px 14px ${theme.accent}40`}}>☄</div>
            <span style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:800,letterSpacing:'.5px',color:theme.text}}>COMETAI</span>
          </div>
          <span style={{fontSize:13,fontFamily:"'Space Mono',monospace",color:`${theme.sub}88`}}>Create Account</span>
        </div>
      </nav>

      <div style={{position:'relative',zIndex:2,flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'90px 24px 40px'}}>
        <motion.div initial={{opacity:0,y:30,scale:.97}} animate={{opacity:1,y:0,scale:1}} transition={{duration:.7,ease:'easeOut'}}
          style={{width:'100%',maxWidth:460}}>

          {success ? (
            <div style={{background:theme.card,border:`1px solid ${theme.cardBorder}`,borderRadius:24,padding:'60px 40px',textAlign:'center',animation:'successPop .5s ease both',boxShadow:`0 8px 48px ${theme.accent}12`}}>
              <div style={{fontSize:56,marginBottom:16}}>🎉</div>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:800,color:theme.accent,marginBottom:8}}>Account Created!</h2>
              <p style={{fontSize:14,color:`${theme.sub}88`}}>Redirecting to sign in...</p>
            </div>
          ) : (
            <div style={{background:theme.card,border:`1px solid ${theme.cardBorder}`,borderRadius:24,padding:'44px 36px',backdropFilter:'blur(20px)',position:'relative',overflow:'hidden',boxShadow:`0 8px 48px ${theme.accent}10`}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${theme.accent}35,${theme.accent2}25,transparent)`}}/>

              <div style={{textAlign:'center',marginBottom:32}}>
                <div style={{width:52,height:52,borderRadius:'50%',background:`linear-gradient(135deg,${theme.accent},${theme.accent2})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,color:'white',margin:'0 auto 16px',boxShadow:`0 8px 24px ${theme.accent}40`}}>☄</div>
                <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:800,color:theme.text,marginBottom:6,letterSpacing:'-.5px'}}>Join CometAI</h1>
                <p style={{fontSize:13,color:`${theme.sub}88`}}>Create your account and start exploring</p>
              </div>

              {error && <div style={{background:'rgba(239,68,68,.06)',border:'1px solid rgba(239,68,68,.2)',borderRadius:10,padding:'10px 14px',marginBottom:20,fontSize:13,color:'#dc2626'}}>⚠ {error}</div>}

              {[
                {label:'Full Name',val:name,set:setName,type:'text',ph:'John Cena'},
                {label:'Email',val:email,set:setEmail,type:'email',ph:'your@email.com'},
                {label:'Password',val:password,set:setPassword,type:'password',ph:'Min 6 characters'},
              ].map((f,i)=>(
                <div key={i} style={{marginBottom:16}}>
                  <label style={{fontSize:11,color:`${theme.sub}88`,letterSpacing:'1.5px',textTransform:'uppercase',display:'block',marginBottom:8,fontFamily:"'Space Mono',monospace"}}>{f.label}</label>
                  <input className="input-field" type={f.type} placeholder={f.ph} value={f.val}
                    onChange={e=>f.set(e.target.value)} onKeyPress={e=>{if(e.key==="Enter")handleRegister();}}
                    style={{borderColor:`${theme.accent}25`,background:'rgba(255,255,255,.9)',color:theme.text,caretColor:theme.accent}}/>
                </div>
              ))}

              <div style={{marginBottom:24}}/>
              <button className="btn-main" onClick={handleRegister} disabled={loading}
                style={{width:'100%',padding:'14px',fontSize:15,color:'white',background:`linear-gradient(135deg,${theme.accent},${theme.accent2})`,boxShadow:`0 8px 28px ${theme.accent}40`}}>
                {loading ? "Creating account..." : "Create Account →"}
              </button>

              <p style={{textAlign:'center',marginTop:20,fontSize:13,color:`${theme.sub}66`}}>
                Already have an account?{" "}
                <span style={{color:theme.accent,cursor:'pointer',fontWeight:600}} onClick={()=>navigate('/login')}>Sign in</span>
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}