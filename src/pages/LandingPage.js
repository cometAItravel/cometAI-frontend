import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

const API = "https://cometai-backend.onrender.com";

/* ── BlurText ── */
const buildKF = (from, steps) => {
  const keys = new Set([...Object.keys(from), ...steps.flatMap(s => Object.keys(s))]);
  const kf = {}; keys.forEach(k => { kf[k] = [from[k], ...steps.map(s => s[k])]; }); return kf;
};
function BlurText({ text='', delay=120, animateBy='words', direction='top', stepDuration=0.4, style={}, onDone }) {
  const els = animateBy==='words' ? text.split(' ') : text.split('');
  const [inView,setInView]=useState(false); const ref=useRef(null);
  useEffect(()=>{
    if(!ref.current)return;
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setInView(true);obs.disconnect();}},{threshold:0.1});
    obs.observe(ref.current); return()=>obs.disconnect();
  },[]);
  const from=useMemo(()=>direction==='top'?{filter:'blur(14px)',opacity:0,y:-55}:{filter:'blur(14px)',opacity:0,y:55},[direction]);
  const to=useMemo(()=>[{filter:'blur(6px)',opacity:0.4,y:direction==='top'?10:-10},{filter:'blur(0px)',opacity:1,y:0}],[direction]);
  const steps=to.length+1; const dur=stepDuration*(steps-1);
  const times=Array.from({length:steps},(_,i)=>steps===1?0:i/(steps-1));
  return(
    <div ref={ref} style={{display:'flex',flexWrap:'wrap',...style}}>
      {els.map((seg,i)=>(
        <motion.span key={i} initial={from} animate={inView?buildKF(from,to):from}
          transition={{duration:dur,times,delay:(i*delay)/1000,ease:'easeOut'}}
          onAnimationComplete={i===els.length-1?onDone:undefined}
          style={{display:'inline-block',willChange:'transform,filter,opacity'}}>
          {seg===''?'\u00A0':seg}{animateBy==='words'&&i<els.length-1&&'\u00A0'}
        </motion.span>
      ))}
    </div>
  );
}

/* ── Counter ── */
function Counter({ to, duration=2, suffix='' }) {
  const [val,setVal]=useState(0); const [started,setStarted]=useState(false); const ref=useRef(null);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting&&!started){setStarted(true);obs.disconnect();}});
    if(ref.current)obs.observe(ref.current); return()=>obs.disconnect();
  },[started]);
  useEffect(()=>{
    if(!started)return; let start=null;
    const step=ts=>{if(!start)start=ts; const p=Math.min((ts-start)/(duration*1000),1); setVal(Math.floor(p*to)); if(p<1)requestAnimationFrame(step);};
    requestAnimationFrame(step);
  },[started,to,duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

export default function LandingPage() {
  const navigate=useNavigate();
  const [typed,setTyped]=useState(''); const [cur,setCur]=useState(true);
  const [isMobile,setIsMobile]=useState(window.innerWidth<768);
  const canvasRef=useRef(null); const animRef=useRef(null);
  const heroRef=useRef(null);
  const { scrollYProgress }=useScroll({target:heroRef,offset:['start start','end start']});
  const heroY=useTransform(scrollYProgress,[0,1],['0%','30%']);
  const heroO=useTransform(scrollYProgress,[0,0.6],[1,0]);
  const full='Book smarter. Fly faster.';

  useEffect(()=>{fetch(`${API}/test`).catch(()=>{});const t=setInterval(()=>fetch(`${API}/test`).catch(()=>{}),14*60*1000);return()=>clearInterval(t);},[]);
  useEffect(()=>{const r=()=>setIsMobile(window.innerWidth<768);window.addEventListener('resize',r);return()=>window.removeEventListener('resize',r);},[]);
  useEffect(()=>{let i=0;const iv=setInterval(()=>{if(i<=full.length){setTyped(full.slice(0,i));i++;}else clearInterval(iv);},85);const b=setInterval(()=>setCur(c=>!c),520);return()=>{clearInterval(iv);clearInterval(b);};},[]);

  /* canvas */
  useEffect(()=>{
    const cv=canvasRef.current; if(!cv)return;
    const ctx=cv.getContext('2d'); cv.width=window.innerWidth; cv.height=window.innerHeight;
    const stars=Array.from({length:260},()=>({x:Math.random()*cv.width,y:Math.random()*cv.height,r:Math.random()*1.9+0.2,op:Math.random()*0.7+0.2,tw:Math.random()*Math.PI*2,ts:Math.random()*0.018+0.004}));
    const meteors=[]; let mt=0;
    const spawn=()=>meteors.push({x:Math.random()*cv.width*.65,y:Math.random()*cv.height*.35,len:100+Math.random()*180,spd:7+Math.random()*7,ang:Math.PI/6+Math.random()*.35,life:0,max:38+Math.random()*22});
    const draw=()=>{
      ctx.clearRect(0,0,cv.width,cv.height);
      [[cv.width*.15,cv.height*.45,cv.width*.5,'rgba(56,16,140,0.22)','rgba(35,10,90,0.1)'],[cv.width*.82,cv.height*.22,cv.width*.42,'rgba(10,50,170,0.16)','transparent'],[cv.width*.5,cv.height*.88,cv.width*.38,'rgba(100,15,150,0.14)','transparent'],[cv.width*.3,cv.height*.1,cv.width*.3,'rgba(0,100,180,0.1)','transparent']].forEach(([x,y,r,c0,c1])=>{const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c0);g.addColorStop(.6,c1);g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(0,0,cv.width,cv.height);});
      stars.forEach(s=>{s.tw+=s.ts;const op=s.op*(.55+.45*Math.sin(s.tw));ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${op})`;ctx.fill();if(s.r>1.3){ctx.beginPath();ctx.arc(s.x,s.y,s.r*3.5,0,Math.PI*2);ctx.fillStyle=`rgba(180,190,255,${op*.12})`;ctx.fill();}});
      mt++;if(mt>90+Math.random()*70){spawn();mt=0;}
      meteors.forEach((m,i)=>{m.life++;const op=Math.sin((m.life/m.max)*Math.PI);const tx=Math.cos(m.ang)*m.len;const ty=Math.sin(m.ang)*m.len;const g=ctx.createLinearGradient(m.x,m.y,m.x-tx,m.y-ty);g.addColorStop(0,`rgba(255,255,255,${op})`);g.addColorStop(.25,`rgba(160,175,255,${op*.8})`);g.addColorStop(1,'transparent');ctx.beginPath();ctx.moveTo(m.x,m.y);ctx.lineTo(m.x-tx,m.y-ty);ctx.strokeStyle=g;ctx.lineWidth=1.8;ctx.stroke();m.x+=Math.cos(m.ang)*m.spd;m.y+=Math.sin(m.ang)*m.spd;if(m.life>=m.max)meteors.splice(i,1);});
      animRef.current=requestAnimationFrame(draw);
    };
    draw();
    const r=()=>{cv.width=window.innerWidth;cv.height=window.innerHeight;};
    window.addEventListener('resize',r);return()=>{cancelAnimationFrame(animRef.current);window.removeEventListener('resize',r);};
  },[]);

  const features=[
    {icon:'🤖',title:'AI Search',desc:'Type naturally — "cheap flights BLR to BOM tomorrow" — instant results',color:'#818cf8',glow:'rgba(129,140,248,0.3)'},
    {icon:'📱',title:'WhatsApp Booking',desc:'Book flights directly on WhatsApp. No app download needed — ever',color:'#6ee7b7',glow:'rgba(110,231,183,0.3)'},
    {icon:'⚡',title:'Real-Time Flights',desc:'Live schedules powered by AviationStack — always up to date',color:'#fbbf24',glow:'rgba(251,191,36,0.3)'},
    {icon:'💸',title:'Zero Booking Fees',desc:'What you see is what you pay. No hidden charges. Ever.',color:'#f472b6',glow:'rgba(244,114,182,0.3)'},
    {icon:'🔐',title:'Bank-Grade Security',desc:'256-bit SSL encryption on every transaction. Fully secure.',color:'#34d399',glow:'rgba(52,211,153,0.3)'},
    {icon:'🎯',title:'Smart Filters',desc:'Filter by time of day, price range, airline, duration. Your flight, your rules.',color:'#a78bfa',glow:'rgba(167,139,250,0.3)'},
  ];

  const testimonials=[
    {name:'Arjun K.',city:'Bangalore',text:'Booked my Mumbai flight in 2 minutes on WhatsApp. Insane how easy this is.',avatar:'👨‍💻',rating:5},
    {name:'Priya S.',city:'Chennai',text:'Just typed "cheap flight to Goa this weekend" and got perfect results. The AI actually works!',avatar:'👩‍💼',rating:5},
    {name:'Rahul M.',city:'Hyderabad',text:'Zero booking fees is real. Saved ₹800 compared to MakeMyTrip on same flight.',avatar:'👨‍🎓',rating:5},
  ];

  const navLinks=[['How it Works','#how'],['Features','#features'],['WhatsApp','#whatsapp'],['Reviews','#reviews']];

  return(
    <div style={{background:'#020008',minHeight:'100vh',overflowX:'hidden',fontFamily:"'DM Sans',sans-serif",color:'#e8eaf6'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:#020008;}::-webkit-scrollbar-thumb{background:#7c3aed;border-radius:2px;}
        html{scroll-behavior:smooth;}

        @keyframes auroraPulse{0%,100%{opacity:.6;transform:scale(1) rotate(0deg);}50%{opacity:1;transform:scale(1.08) rotate(2deg);}}
        @keyframes floatPlane{0%,100%{transform:translateY(0) rotate(var(--r,0deg));}50%{transform:translateY(-18px) rotate(var(--r,0deg));}}
        @keyframes ringA{from{transform:rotateX(70deg) rotateZ(0deg);}to{transform:rotateX(70deg) rotateZ(360deg);}}
        @keyframes ringB{from{transform:rotateX(55deg) rotateZ(40deg);}to{transform:rotateX(55deg) rotateZ(400deg);}}
        @keyframes shimText{0%{background-position:0% center;}100%{background-position:400% center;}}
        @keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
        @keyframes badgePulse{0%,100%{box-shadow:0 0 0 0 rgba(124,58,237,.5);}70%{box-shadow:0 0 0 10px rgba(124,58,237,0);}}
        @keyframes scanLine{0%{top:-1px;opacity:0;}5%{opacity:.7;}95%{opacity:.7;}100%{top:100%;opacity:0;}}
        @keyframes grain{0%,100%{transform:translate(0,0);}10%{transform:translate(-2%,-3%);}20%{transform:translate(3%,2%);}30%{transform:translate(-1%,4%);}40%{transform:translate(4%,-1%);}50%{transform:translate(-3%,3%);}60%{transform:translate(2%,-4%);}70%{transform:translate(-4%,1%);}80%{transform:translate(1%,3%);}90%{transform:translate(-2%,-2%);}}}
        @keyframes cardHover{from{transform:translateY(0);} to{transform:translateY(-6px);}}
        @keyframes counterUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
        @keyframes glowPulse{0%,100%{box-shadow:0 0 20px rgba(124,58,237,.2);}50%{box-shadow:0 0 40px rgba(124,58,237,.5),0 0 80px rgba(139,92,246,.2);}}

        .grain-layer{position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.032;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size:200px;animation:grain 8s steps(10) infinite;}
        .scan{position:fixed;left:0;width:100%;height:1px;pointer-events:none;z-index:2;
          background:linear-gradient(90deg,transparent,rgba(124,58,237,.15),rgba(139,92,246,.1),transparent);
          animation:scanLine 12s linear infinite;}

        .aurora{position:fixed;pointer-events:none;border-radius:50%;filter:blur(80px);animation:auroraPulse 8s ease-in-out infinite;}

        .nav-a{color:rgba(196,181,253,.6);text-decoration:none;font-size:13px;transition:color .2s;position:relative;padding-bottom:2px;}
        .nav-a::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:linear-gradient(90deg,#7c3aed,#a78bfa);transition:width .3s;}
        .nav-a:hover{color:#ede9fe;}.nav-a:hover::after{width:100%;}

        .btn-main{background:linear-gradient(135deg,#7c3aed,#6d28d9,#5b21b6);border:none;color:white;border-radius:14px;
          font-family:'DM Sans',sans-serif;font-weight:700;cursor:pointer;position:relative;overflow:hidden;
          transition:all .3s cubic-bezier(.23,1,.32,1);letter-spacing:.3px;}
        .btn-main::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.15),transparent);}
        .btn-main::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(255,255,255,.1),transparent);opacity:0;transition:opacity .3s;}
        .btn-main:hover{transform:translateY(-3px);box-shadow:0 20px 50px rgba(109,40,217,.6),0 0 0 1px rgba(167,139,250,.3);}
        .btn-main:hover::after{opacity:1;}

        .btn-out{background:transparent;border:1px solid rgba(124,58,237,.4);color:#c4b5fd;border-radius:14px;
          font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .3s;backdrop-filter:blur(12px);}
        .btn-out:hover{border-color:rgba(167,139,250,.7);background:rgba(124,58,237,.1);color:#ede9fe;transform:translateY(-2px);}

        .feat-card{background:linear-gradient(145deg,rgba(10,6,30,.95),rgba(20,12,50,.9));
          border:1px solid rgba(124,58,237,.12);border-radius:22px;backdrop-filter:blur(20px);
          transition:all .35s cubic-bezier(.23,1,.32,1);position:relative;overflow:hidden;cursor:default;}
        .feat-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(124,58,237,.06),transparent 60%);opacity:0;transition:opacity .35s;}
        .feat-card:hover{border-color:rgba(124,58,237,.3);transform:translateY(-8px) perspective(800px) rotateX(-2deg);
          box-shadow:0 30px 70px rgba(0,0,0,.7),0 0 50px rgba(124,58,237,.15);}
        .feat-card:hover::before{opacity:1;}

        .step-card{background:linear-gradient(145deg,rgba(10,6,30,.9),rgba(15,9,40,.85));
          border:1px solid rgba(124,58,237,.1);border-radius:22px;backdrop-filter:blur(20px);
          transition:all .3s;position:relative;overflow:hidden;}
        .step-card:hover{border-color:rgba(124,58,237,.28);transform:translateY(-5px);box-shadow:0 20px 50px rgba(0,0,0,.6);}

        .review-card{background:linear-gradient(145deg,rgba(10,6,30,.9),rgba(15,9,40,.85));
          border:1px solid rgba(124,58,237,.1);border-radius:20px;backdrop-filter:blur(20px);
          transition:all .3s;position:relative;overflow:hidden;}
        .review-card:hover{border-color:rgba(124,58,237,.25);transform:translateY(-4px);}

        .stat-item{text-align:center;animation:counterUp .6s ease both;}

        /* MOBILE */
        @media(max-width:768px){
          .hero-flex{flex-direction:column!important;text-align:center;align-items:center!important;}
          .planet-side{display:none!important;}
          .stats-wrap{justify-content:center!important;gap:20px!important;}
          .nav-links{display:none!important;}
          .feat-grid{grid-template-columns:1fr!important;}
          .steps-grid{grid-template-columns:1fr!important;}
          .wa-grid{grid-template-columns:1fr!important;}
          .rev-grid{grid-template-columns:1fr!important;}
          .hero-btns-wrap{justify-content:center!important;}
          .hero-section{padding:90px 20px 60px!important;}
          .sec-pad{padding:60px 20px!important;}
          .wa-box{padding:32px 20px!important;}
          .nav-wrap{padding:14px 20px!important;}
          .cta-box{padding:40px 20px!important;}
          .footer-inner{flex-direction:column!important;gap:14px!important;text-align:center!important;}
          .blur-main{font-size:clamp(34px,9vw,50px)!important;}
        }
        @media(min-width:769px){
          .feat-grid{grid-template-columns:repeat(3,1fr)!important;}
          .steps-grid{grid-template-columns:repeat(3,1fr)!important;}
          .wa-grid{grid-template-columns:1fr 1fr!important;}
          .rev-grid{grid-template-columns:repeat(3,1fr)!important;}
        }
      `}</style>

      {/* BG layers */}
      <canvas ref={canvasRef} style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none'}}/>
      <div style={{position:'fixed',inset:0,background:'#020008',zIndex:-1}}/>
      <div className="grain-layer"/><div className="scan"/>
      {/* Aurora blobs */}
      <div className="aurora" style={{width:600,height:600,left:'-10%',top:'10%',background:'radial-gradient(circle,rgba(76,29,149,.35) 0%,rgba(109,40,217,.15) 40%,transparent 70%)',animationDelay:'0s'}}/>
      <div className="aurora" style={{width:500,height:500,right:'-8%',top:'20%',background:'radial-gradient(circle,rgba(29,78,216,.28) 0%,rgba(37,99,235,.1) 40%,transparent 70%)',animationDelay:'3s'}}/>
      <div className="aurora" style={{width:450,height:450,left:'30%',bottom:'-5%',background:'radial-gradient(circle,rgba(126,34,206,.22) 0%,rgba(109,40,217,.1) 40%,transparent 70%)',animationDelay:'6s'}}/>

      {/* ── NAV ── */}
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:100,background:'rgba(2,0,8,.7)',backdropFilter:'blur(28px)',borderBottom:'1px solid rgba(124,58,237,.1)'}}>
        <div className="nav-wrap" style={{maxWidth:1160,margin:'0 auto',padding:'15px 40px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer',flexShrink:0}} onClick={()=>navigate('/')}>
            <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#7c3aed,#6d28d9)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,boxShadow:'0 0 20px rgba(124,58,237,.5)',animation:'glowPulse 3s ease infinite'}}>☄</div>
            <span style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,letterSpacing:'.5px',background:'linear-gradient(90deg,#ede9fe,#c4b5fd)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>COMETAI</span>
          </div>
          <div className="nav-links" style={{display:'flex',gap:28}}>
            {navLinks.map(([l,h])=><a key={l} href={h} className="nav-a">{l}</a>)}
          </div>
          <div style={{display:'flex',gap:10}}>
            <button className="btn-out" onClick={()=>navigate('/login')} style={{padding:'8px 20px',fontSize:13}}>Sign In</button>
            <button className="btn-main" onClick={()=>navigate('/register')} style={{padding:'8px 20px',fontSize:13}}>Get Started →</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="hero-section" style={{position:'relative',zIndex:2,minHeight:'100vh',display:'flex',alignItems:'center',padding:'90px 40px 60px',overflow:'hidden'}}>
        {/* grid pattern */}
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(124,58,237,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,.05) 1px,transparent 1px)',backgroundSize:'80px 80px',maskImage:'radial-gradient(ellipse 80% 70% at 50% 50%,black,transparent)',pointerEvents:'none'}}/>

        <motion.div style={{maxWidth:1160,margin:'0 auto',width:'100%',y:heroY,opacity:heroO}}>
          <div className="hero-flex" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:40}}>

            {/* LEFT */}
            <div style={{maxWidth:640}}>
              {/* badge */}
              <motion.div initial={{opacity:0,y:20,scale:.9}} animate={{opacity:1,y:0,scale:1}} transition={{duration:.6,delay:.1}}
                style={{display:'inline-flex',alignItems:'center',gap:8,marginBottom:32,background:'rgba(124,58,237,.12)',border:'1px solid rgba(124,58,237,.3)',borderRadius:24,padding:'7px 18px',animation:'badgePulse 2.5s ease infinite'}}>
                <div style={{width:7,height:7,borderRadius:'50%',background:'#34d399',boxShadow:'0 0 10px #34d399'}}/>
                <span style={{fontSize:11,color:'#c4b5fd',letterSpacing:'2px',textTransform:'uppercase',fontFamily:"'Space Mono',monospace"}}>Now Live · AI Travel Platform</span>
              </motion.div>

              {/* MAIN TITLE — BlurText */}
              <BlurText
                text="Fly Smarter. Travel Further."
                delay={110}
                animateBy="words"
                direction="top"
                stepDuration={0.5}
                style={{
                  fontFamily:"'Syne',sans-serif",
                  fontSize:isMobile?'clamp(34px,9vw,50px)':'clamp(48px,6.5vw,82px)',
                  fontWeight:800,lineHeight:1.02,letterSpacing:'-2.5px',marginBottom:12,
                  background:'linear-gradient(135deg,#ede9fe 0%,#c4b5fd 30%,#a78bfa 55%,#7c3aed 75%,#4f46e5 100%)',
                  backgroundSize:'200% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
                  backgroundClip:'text',flexWrap:'wrap',
                  animation:'shimText 5s linear infinite',
                }}
              />

              {/* subtitle BlurText */}
              <BlurText
                text="India's most intelligent travel platform."
                delay={35}
                animateBy="words"
                direction="bottom"
                stepDuration={0.32}
                style={{fontSize:isMobile?15:18,color:'rgba(196,181,253,.55)',lineHeight:1.7,marginBottom:8,fontWeight:300,flexWrap:'wrap'}}
              />
              <BlurText
                text="Book flights with AI, WhatsApp, or classic search — zero fees, real data."
                delay={25}
                animateBy="words"
                direction="bottom"
                stepDuration={0.28}
                style={{fontSize:isMobile?14:16,color:'rgba(196,181,253,.4)',lineHeight:1.7,marginBottom:36,fontWeight:300,flexWrap:'wrap'}}
              />

              {/* typewriter */}
              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.6,duration:.6}}
                style={{fontFamily:"'Space Mono',monospace",fontSize:isMobile?12:14,color:'#7c3aed',marginBottom:32,minHeight:22,letterSpacing:'.5px'}}>
                ✦ {typed}{cur?'|':' '}
              </motion.div>

              {/* CTAs */}
              <motion.div className="hero-btns-wrap" initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{delay:2,duration:.7,ease:'easeOut'}}
                style={{display:'flex',gap:14,flexWrap:'wrap',marginBottom:52}}>
                <button className="btn-main" onClick={()=>navigate('/register')} style={{padding:'16px 38px',fontSize:16,animation:'glowPulse 3s ease infinite'}}>
                  Start for Free ✈
                </button>
                <button className="btn-out" onClick={()=>navigate('/login')} style={{padding:'16px 32px',fontSize:16}}>
                  Sign In →
                </button>
              </motion.div>

              {/* stats */}
              <motion.div className="stats-wrap" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.3,duration:.8}}
                style={{display:'flex',gap:40,flexWrap:'wrap'}}>
                {[{n:500,s:'+',l:'Daily Flights'},{n:0,s:'₹',l:'Booking Fees',pre:'₹'},{n:14,s:'+',l:'Indian Cities'},{n:100,s:'%',l:'Real Data'}].map((st,i)=>(
                  <div key={i} className="stat-item" style={{animationDelay:`${2.3+i*.1}s`}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,background:'linear-gradient(135deg,#ede9fe,#a78bfa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',lineHeight:1}}>
                      {st.pre||''}<Counter to={st.n} duration={1.8}/>{st.s}
                    </div>
                    <div style={{fontSize:11,color:'rgba(196,181,253,.38)',marginTop:3,letterSpacing:'.5px'}}>{st.l}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT — 3D PLANET */}
            <motion.div className="planet-side" initial={{opacity:0,scale:.75,rotate:-10}} animate={{opacity:1,scale:1,rotate:0}} transition={{delay:.3,duration:1.2,ease:'easeOut'}}
              style={{position:'relative',width:420,height:420,flexShrink:0}}>
              {/* glow behind */}
              <div style={{position:'absolute',inset:20,borderRadius:'50%',background:'radial-gradient(circle,rgba(109,40,217,.25) 0%,transparent 70%)',filter:'blur(30px)'}}/>
              {/* planet */}
              <div style={{position:'absolute',inset:50,borderRadius:'50%',background:'radial-gradient(ellipse at 30% 28%,#2d1b69 0%,#130d3b 30%,#080420 60%,#030112 100%)',boxShadow:'inset -35px -28px 55px rgba(0,0,0,.95),inset 18px 14px 35px rgba(109,40,217,.14),0 0 80px rgba(109,40,217,.22),0 0 160px rgba(76,29,149,.12)',overflow:'hidden'}}>
                {[15,35,55,75,95,115,135,155].map(d=><div key={d} style={{position:'absolute',inset:0,borderRadius:'50%',border:'1px solid rgba(109,40,217,.06)',transform:`rotateY(${d}deg)`}}/>)}
                {[25,50,80,110,140].map(d=><div key={d} style={{position:'absolute',inset:0,borderRadius:'50%',border:'1px solid rgba(109,40,217,.05)',transform:`rotateX(${d}deg)`}}/>)}
                <div style={{position:'absolute',inset:-8,borderRadius:'50%',background:'radial-gradient(ellipse at 50% 50%,transparent 52%,rgba(109,40,217,.14) 72%,rgba(76,29,149,.07) 100%)'}}/>
              </div>
              {/* rings */}
              <div style={{position:'absolute',inset:8,animation:'ringA 9s linear infinite'}}>
                <div style={{position:'absolute',inset:0,borderRadius:'50%',border:'1.5px solid rgba(124,58,237,.25)',boxShadow:'0 0 15px rgba(124,58,237,.1)'}}>
                  <div style={{position:'absolute',top:-6,left:'50%',width:12,height:12,borderRadius:'50%',background:'linear-gradient(135deg,#a78bfa,#7c3aed)',boxShadow:'0 0 18px #a78bfa',transform:'translateX(-50%)'}}/>
                </div>
              </div>
              <div style={{position:'absolute',inset:-28,animation:'ringB 14s linear infinite'}}>
                <div style={{position:'absolute',inset:0,borderRadius:'50%',border:'1px solid rgba(167,139,250,.14)'}}>
                  <div style={{position:'absolute',top:-5,right:'20%',width:8,height:8,borderRadius:'50%',background:'#c084fc',boxShadow:'0 0 12px #c084fc'}}/>
                </div>
              </div>
              {/* floating ✈ */}
              {[{t:'6%',l:'8%',r:'20deg',d:'3.4s',dl:'0s'},{t:'74%',l:'78%',r:'-12deg',d:'4.2s',dl:'.8s'},{t:'82%',l:'6%',r:'38deg',d:'2.9s',dl:'1.4s'},{t:'15%',l:'82%',r:'-30deg',d:'3.8s',dl:'.4s'}].map((p,i)=>(
                <div key={i} style={{position:'absolute',top:p.t,left:p.l,fontSize:15,animationName:'floatPlane',animationDuration:p.d,animationDelay:p.dl,animationTimingFunction:'ease-in-out',animationIterationCount:'infinite','--r':p.r,filter:'drop-shadow(0 0 10px rgba(124,58,237,.95))'}}>✈</div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <div style={{position:'absolute',bottom:24,left:'50%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:5,opacity:.3}}>
          <span style={{fontSize:8,color:'#a78bfa',letterSpacing:'2.5px',textTransform:'uppercase',fontFamily:"'Space Mono',monospace"}}>Scroll</span>
          <div style={{width:1,height:32,background:'linear-gradient(180deg,#7c3aed,transparent)'}}/>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="sec-pad" style={{position:'relative',zIndex:2,padding:'110px 40px'}}>
        <div style={{maxWidth:1160,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:64}}>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:'#7c3aed',letterSpacing:'3px',textTransform:'uppercase',marginBottom:14}}>— How it works</div>
            <BlurText text="Three steps to anywhere" delay={90} animateBy="words" direction="top" stepDuration={0.38}
              style={{fontFamily:"'Syne',sans-serif",fontSize:'clamp(28px,4vw,50px)',fontWeight:800,color:'#ede9fe',letterSpacing:'-1px',justifyContent:'center'}}/>
          </div>
          <div className="steps-grid" style={{display:'grid',gap:22}}>
            {[{n:'01',t:'Create Account',d:'Sign up free in 30 seconds. No credit card. Just your email and you\'re in.',icon:'👤'},{n:'02',t:'Search Your Flight',d:'Use AI text search or structured search. Filter by price, time, airline, duration.',icon:'🔍'},{n:'03',t:'Book & Fly',d:'Pay with card, UPI or netbanking. Instant confirmation email. Zero booking fees.',icon:'🚀'}].map((s,i)=>(
              <motion.div key={i} className="step-card" style={{padding:34}} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.12,duration:.6}}>
                <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(124,58,237,.35),transparent)'}}/>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:72,fontWeight:900,color:'rgba(124,58,237,.05)',position:'absolute',top:10,right:16,lineHeight:1}}>{s.n}</div>
                <div style={{fontSize:36,marginBottom:14,filter:'drop-shadow(0 0 12px rgba(124,58,237,.6))'}}>{s.icon}</div>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:'#7c3aed',letterSpacing:'2px',marginBottom:12}}>{s.n}</div>
                <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,color:'#ede9fe',marginBottom:10}}>{s.t}</h3>
                <p style={{fontSize:14,color:'rgba(196,181,253,.48)',lineHeight:1.75,fontWeight:300}}>{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="sec-pad" style={{position:'relative',zIndex:2,padding:'80px 40px 110px'}}>
        <div style={{maxWidth:1160,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:64}}>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:'#7c3aed',letterSpacing:'3px',textTransform:'uppercase',marginBottom:14}}>— Features</div>
            <BlurText text="Everything you need to fly" delay={80} animateBy="words" direction="top" stepDuration={0.35}
              style={{fontFamily:"'Syne',sans-serif",fontSize:'clamp(28px,4vw,50px)',fontWeight:800,color:'#ede9fe',letterSpacing:'-1px',justifyContent:'center'}}/>
          </div>
          <div className="feat-grid" style={{display:'grid',gap:18}}>
            {features.map((f,i)=>(
              <motion.div key={i} className="feat-card" style={{padding:30}} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.08,duration:.55}}>
                <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse at 10% 10%,${f.color}0a 0%,transparent 55%)`,pointerEvents:'none'}}/>
                <div style={{fontSize:36,marginBottom:16,filter:`drop-shadow(0 0 14px ${f.glow})`}}>{f.icon}</div>
                <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:700,color:'#ede9fe',marginBottom:8}}>{f.title}</h3>
                <p style={{fontSize:13,color:'rgba(196,181,253,.46)',lineHeight:1.75,fontWeight:300}}>{f.desc}</p>
                <div style={{position:'absolute',bottom:0,left:0,height:2,width:'40%',background:`linear-gradient(90deg,${f.color},transparent)`,borderRadius:1}}/>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHATSAPP ── */}
      <section id="whatsapp" style={{position:'relative',zIndex:2,padding:'80px 40px'}}>
        <div style={{maxWidth:1060,margin:'0 auto'}}>
          <motion.div className="wa-box" initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.7}}
            style={{background:'linear-gradient(145deg,rgba(10,6,30,.97),rgba(20,10,55,.95))',border:'1px solid rgba(124,58,237,.2)',borderRadius:30,padding:'58px 54px',position:'relative',overflow:'hidden',backdropFilter:'blur(30px)'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(124,58,237,.6),rgba(167,139,250,.4),transparent)'}}/>
            <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 20% 50%,rgba(124,58,237,.06) 0%,transparent 60%)',pointerEvents:'none'}}/>
            <div className="wa-grid" style={{display:'grid',gap:44,alignItems:'center'}}>
              <div>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:'#34d399',letterSpacing:'3px',textTransform:'uppercase',marginBottom:20}}>— WhatsApp Bot</div>
                <BlurText text="Book any flight on WhatsApp" delay={75} animateBy="words" direction="top" stepDuration={0.35}
                  style={{fontFamily:"'Syne',sans-serif",fontSize:'clamp(24px,3.5vw,40px)',fontWeight:800,color:'#ede9fe',marginBottom:16,letterSpacing:'-1px',flexWrap:'wrap'}}/>
                <p style={{fontSize:14,color:'rgba(196,181,253,.48)',lineHeight:1.85,marginBottom:26,fontWeight:300,maxWidth:420}}>No app to download. No account needed. Just send a WhatsApp message and book your flight in minutes.</p>
                {['Message: "flights bangalore to mumbai tomorrow"','Choose your flight and enter your name','Reply CONFIRM — booking ID arrives instantly!'].map((s,i)=>(
                  <div key={i} style={{display:'flex',gap:12,alignItems:'flex-start',marginBottom:12}}>
                    <div style={{width:22,height:22,borderRadius:'50%',background:'rgba(124,58,237,.18)',border:'1px solid rgba(124,58,237,.4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'#a78bfa',flexShrink:0,marginTop:1,fontFamily:"'Space Mono',monospace"}}>{i+1}</div>
                    <span style={{fontSize:13,color:'rgba(196,181,253,.55)',lineHeight:1.6}}>{s}</span>
                  </div>
                ))}
                <div style={{marginTop:28,background:'rgba(37,211,102,.08)',border:'1px solid rgba(37,211,102,.2)',borderRadius:12,padding:'14px 18px',display:'inline-flex',alignItems:'center',gap:12}}>
                  <span style={{fontSize:22}}>📱</span>
                  <div>
                    <div style={{fontSize:10,color:'rgba(110,231,183,.45)',fontFamily:"'Space Mono',monospace",letterSpacing:'1.5px',marginBottom:2}}>WHATSAPP NUMBER</div>
                    <div style={{fontSize:15,color:'#34d399',fontWeight:700,letterSpacing:'.5px'}}>+1-415-523-8886</div>
                  </div>
                </div>
              </div>
              {/* chat */}
              <div style={{background:'#070d07',borderRadius:22,overflow:'hidden',border:'1px solid rgba(37,211,102,.12)'}}>
                <div style={{background:'#128C7E',padding:'12px 18px',display:'flex',alignItems:'center',gap:10}}>
                  <div style={{width:34,height:34,borderRadius:'50%',background:'linear-gradient(135deg,#7c3aed,#6d28d9)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>☄</div>
                  <div><div style={{fontSize:13,color:'white',fontWeight:600}}>CometAI Travel Bot</div><div style={{fontSize:11,color:'rgba(255,255,255,.7)'}}>Online</div></div>
                </div>
                <div style={{padding:16}}>
                  {[{r:false,m:"✈️ Hi! I can help you book flights.\n\nTry: \"flights bangalore to mumbai tomorrow\""},{r:true,m:"flights bangalore to mumbai tomorrow"},{r:false,m:"✈️ Flights BLR → BOM\n\n1. IndiGo  06:00→08:05  ₹3,499\n2. Air India  09:30→11:45  ₹4,200\n3. SpiceJet  14:00→16:10  ₹2,899\n\nReply with a number to book"},{r:true,m:"1"},{r:false,m:"✅ IndiGo selected!\n⏰ 06:00 AM · ₹3,499\n\nWhat is your full name?"}].map((msg,i)=>(
                    <div key={i} style={{display:'flex',justifyContent:msg.r?'flex-end':'flex-start',marginBottom:8}}>
                      <div style={{background:msg.r?'#005c4b':'rgba(255,255,255,.07)',borderRadius:msg.r?'14px 14px 2px 14px':'14px 14px 14px 2px',padding:'9px 13px',maxWidth:'82%'}}>
                        <div style={{fontSize:12,color:'rgba(255,255,255,.85)',whiteSpace:'pre-wrap',lineHeight:1.55}}>{msg.m}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="reviews" className="sec-pad" style={{position:'relative',zIndex:2,padding:'80px 40px'}}>
        <div style={{maxWidth:1160,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:60}}>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:'#7c3aed',letterSpacing:'3px',textTransform:'uppercase',marginBottom:14}}>— Early Users</div>
            <BlurText text="Travellers love CometAI" delay={80} animateBy="words" direction="top" stepDuration={0.35}
              style={{fontFamily:"'Syne',sans-serif",fontSize:'clamp(26px,4vw,48px)',fontWeight:800,color:'#ede9fe',letterSpacing:'-1px',justifyContent:'center'}}/>
          </div>
          <div className="rev-grid" style={{display:'grid',gap:18}}>
            {testimonials.map((t,i)=>(
              <motion.div key={i} className="review-card" style={{padding:28}} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.1,duration:.6}}>
                <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(124,58,237,.25),transparent)'}}/>
                <div style={{display:'flex',gap:4,marginBottom:14}}>{'★★★★★'.split('').map((s,j)=><span key={j} style={{color:'#fbbf24',fontSize:14}}>{s}</span>)}</div>
                <p style={{fontSize:14,color:'rgba(196,181,253,.65)',lineHeight:1.75,marginBottom:20,fontStyle:'italic',fontWeight:300}}>"{t.text}"</p>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{width:38,height:38,borderRadius:'50%',background:'linear-gradient(135deg,rgba(124,58,237,.3),rgba(109,40,217,.2))',border:'1px solid rgba(124,58,237,.25)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>{t.avatar}</div>
                  <div>
                    <div style={{fontSize:14,fontWeight:600,color:'#ede9fe'}}>{t.name}</div>
                    <div style={{fontSize:11,color:'rgba(196,181,253,.38)'}}>{t.city}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{position:'relative',zIndex:2,padding:'100px 40px'}}>
        <div style={{maxWidth:780,margin:'0 auto'}}>
          <motion.div className="cta-box" initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.7}}
            style={{background:'linear-gradient(145deg,rgba(10,6,30,.98),rgba(25,14,60,.95))',border:'1px solid rgba(124,58,237,.25)',borderRadius:30,padding:'64px 56px',textAlign:'center',position:'relative',overflow:'hidden',backdropFilter:'blur(30px)',boxShadow:'0 0 100px rgba(124,58,237,.12)'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(124,58,237,.6),rgba(167,139,250,.5),transparent)'}}/>
            <div style={{position:'absolute',bottom:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(124,58,237,.3),transparent)'}}/>
            <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 0%,rgba(124,58,237,.1) 0%,transparent 60%)',pointerEvents:'none'}}/>
            <BlurText text="Ready for takeoff?" delay={100} animateBy="words" direction="top" stepDuration={0.45}
              style={{fontFamily:"'Syne',sans-serif",fontSize:'clamp(32px,5vw,60px)',fontWeight:800,lineHeight:1.08,marginBottom:16,letterSpacing:'-1.5px',
                background:'linear-gradient(135deg,#ede9fe 0%,#c4b5fd 35%,#a78bfa 60%,#7c3aed 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
                justifyContent:'center'}}/>
            <motion.p initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:.3,duration:.6}}
              style={{fontSize:16,color:'rgba(196,181,253,.45)',marginBottom:36,fontWeight:300,lineHeight:1.7}}>
              Join India's smartest travel platform. No fees, no fuss — just great flights.
            </motion.p>
            <motion.div initial={{opacity:0,scale:.9}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:.5,duration:.5}}
              style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap'}}>
              <button className="btn-main" onClick={()=>navigate('/register')} style={{padding:'17px 48px',fontSize:17}}>Create Free Account →</button>
              <button className="btn-out" onClick={()=>navigate('/login')} style={{padding:'17px 38px',fontSize:17}}>Sign In</button>
            </motion.div>
            <motion.p initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{delay:.7,duration:.5}}
              style={{fontSize:12,color:'rgba(196,181,253,.25)',marginTop:20,fontFamily:"'Space Mono',monospace",letterSpacing:'1px'}}>
              ✓ Free forever &nbsp;&nbsp; ✓ No credit card &nbsp;&nbsp; ✓ Zero booking fees
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{position:'relative',zIndex:2,borderTop:'1px solid rgba(124,58,237,.08)',padding:'36px 40px'}}>
        <div className="footer-inner" style={{maxWidth:1160,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:30,height:30,borderRadius:'50%',background:'linear-gradient(135deg,#7c3aed,#6d28d9)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>☄</div>
            <span style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:700,color:'rgba(196,181,253,.4)',letterSpacing:'.5px'}}>COMETAI TRAVEL</span>
          </div>
          <div style={{fontSize:12,color:'rgba(196,181,253,.2)'}}>© 2026 CometAI Travel · India's AI-powered travel platform</div>
          <div style={{display:'flex',gap:20}}>
            {['Privacy','Terms','Contact'].map(l=><span key={l} style={{fontSize:12,color:'rgba(196,181,253,.28)',cursor:'pointer'}}>{l}</span>)}
          </div>
        </div>
      </footer>
    </div>
  );
}