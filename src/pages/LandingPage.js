/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND = "https://cometai-backend.onrender.com";

const AuroraOrbs = ({ darkMode }) => (
  <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden" }}>
    <div style={{
      position:"absolute",width:600,height:600,borderRadius:"50%",
      background: darkMode
        ? "radial-gradient(circle,rgba(201,168,76,0.06) 0%,transparent 70%)"
        : "radial-gradient(circle,rgba(201,168,76,0.10) 0%,transparent 70%)",
      top:"-200px",left:"-150px",
      animation:"orbFloat1 12s ease-in-out infinite",
    }}/>
    <div style={{
      position:"absolute",width:400,height:400,borderRadius:"50%",
      background: darkMode
        ? "radial-gradient(circle,rgba(201,168,76,0.04) 0%,transparent 70%)"
        : "radial-gradient(circle,rgba(201,168,76,0.07) 0%,transparent 70%)",
      bottom:"100px",right:"-100px",
      animation:"orbFloat2 15s ease-in-out infinite",
    }}/>
    <style>{`
      @keyframes orbFloat1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(40px,-40px) scale(1.05)}}
      @keyframes orbFloat2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-30px,30px) scale(1.08)}}
    `}</style>
  </div>
);

export default function LandingPage({ darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState("");
  const [waitlistCount, setWaitlistCount] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const gold   = "#c9a84c";
  const bg     = darkMode ? "#0e0c09"  : "#faf8f4";
  const card   = darkMode ? "#1c1810"  : "#ffffff";
  const cardBd = darkMode ? "rgba(201,168,76,0.22)" : "rgba(201,168,76,0.18)";
  const txt    = darkMode ? "#f5f0e8"  : "#1a1410";
  const txtSub = darkMode ? "#b8a882"  : "#6b5e45";
  const txtMut = darkMode ? "#7a6e5a"  : "#9e8f78";
  const navBg  = darkMode
    ? (scrolled?"rgba(14,12,9,0.97)":"rgba(14,12,9,0.85)")
    : (scrolled?"rgba(250,248,244,0.97)":"rgba(250,248,244,0.88)");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    fetch(`${BACKEND}/waitlist/count`).then(r=>r.json()).then(d=>setWaitlistCount(d.count)).catch(()=>{});
  }, []);

  const handleWaitlist = async (e) => {
    e.preventDefault();
    try {
      const r = await fetch(`${BACKEND}/waitlist`,{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email:waitlistEmail}),
      });
      const d = await r.json();
      if (r.ok) { setWaitlistStatus("🎉 You're in! Ref: "+d.refCode); setWaitlistEmail(""); setWaitlistCount(c=>(c||0)+1); }
      else setWaitlistStatus(d.message||"Error.");
    } catch { setWaitlistStatus("Connection error."); }
  };

  const css = `
    @media(max-width:680px){.alvLandNav{display:none!important}.alvHamburger{display:flex!important}}
    @media(min-width:681px){.alvMobile{display:none!important}}
    .alvPartnerCard:hover{transform:translateY(-5px)!important;box-shadow:0 12px 40px rgba(201,168,76,0.25)!important}
    .alvHowCard:hover{transform:translateY(-3px)!important;box-shadow:0 8px 28px rgba(201,168,76,0.18)!important}
    .alvHeroPrimary:hover{transform:translateY(-2px)!important;box-shadow:0 8px 28px rgba(201,168,76,0.4)!important}
    .alvNavBtn:hover{opacity:0.82!important}
    .alvFooterLink:hover{color:#c9a84c!important}
    .alvGuideCard:hover{transform:translateY(-3px)!important}
    @media(max-width:500px){.alvHeroBtns{flex-direction:column!important;align-items:center!important}}
  `;

  const partners = [
    {emoji:"✈️",name:"Aviasales",desc:"India's best flight fares — domestic & international",url:"https://aviasales.in"},
    {emoji:"🚌",name:"RedBus",desc:"Largest bus network — 30,000+ routes across India",url:"https://redbus.in"},
    {emoji:"🏨",name:"Booking.com",desc:"Hotels, resorts & stays worldwide",url:"https://booking.com"},
  ];

  const howCards = [
    {
      icon:"🤖",title:"Talk to Alvryn AI",
      desc:"Type naturally — 'flight blr to del kal', 'bus Chennai to Hyd tonight', hotels goa under 2k.",
      bullets:["100+ city aliases","Understands Indian date formats","Works with typos and abbreviations"],
    },
    {
      icon:"🔍",title:"We Search Our Partners",
      desc:"Alvryn queries our trusted travel partners — across flights, buses and hotels instantly.",
      bullets:["Live fares from airline partners","Bus schedules across India","Hotels worldwide"],
    },
    {
      icon:"🔒",title:"Book Directly & Securely",
      desc:"We open the official partner page. Payment processed directly by the partner — never by Alvryn.",
      bullets:["Opens official partner site","256-bit SSL on all partner pages","Ticket directly from operator"],
    },
  ];

  const testimonials = [
    {text:"Found a Bangalore to Goa flight for ₹2,800 in 30 seconds. No other site was even close!",user:"Rahul M., Bangalore",stars:5},
    {text:"The AI understood 'bus chennai to hyd kal night' perfectly. Crazy smart and fast.",user:"Priya K., Chennai",stars:5},
    {text:"Dark mode, clean UI, fast results. This is how travel search should feel.",user:"Arjun S., Hyderabad",stars:5},
  ];

  const faqs = [
    {q:"Is Alvryn free to use?",a:"Yes, Alvryn is completely free. We earn a small commission from partner sites when you book — at no extra cost to you."},
    {q:"Who processes my payment?",a:"Your payment is always processed by the official partner (Aviasales, RedBus, or Booking.com). Alvryn never handles money."},
    {q:"Does the AI work in Hindi or Tamil?",a:"Yes! Alvryn AI understands mixed-language queries in English, Hindi, Tamil, Telugu, Kannada and more."},
    {q:"Why use Alvryn instead of going directly?",a:"Alvryn's AI understands natural queries, compares options across our network, and saves you from opening 5 tabs."},
  ];

  return (
    <div style={{minHeight:"100vh",background:bg,color:txt,fontFamily:"'Georgia','Times New Roman',serif",transition:"background 0.4s,color 0.4s",position:"relative"}}>
      <style>{css}</style>
      <AuroraOrbs darkMode={darkMode}/>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:navBg,backdropFilter:"blur(20px)",borderBottom:scrolled?`1px solid ${cardBd}`:"1px solid transparent",transition:"all 0.3s",padding:"0 24px"}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:68}}>
          <a href="/" onClick={e=>{e.preventDefault();navigate("/")}} style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none"}}>
            <div style={{width:38,height:38,borderRadius:"50%",border:`1.5px solid ${gold}`,display:"flex",alignItems:"center",justifyContent:"center",color:gold,fontSize:14,fontWeight:700,letterSpacing:1}}>A</div>
            <div>
              <div style={{fontSize:15,fontWeight:700,letterSpacing:"0.18em",color:txt}}>ALVRYN</div>
              <div style={{fontSize:8,letterSpacing:"0.25em",color:txtMut,fontFamily:"sans-serif"}}>TRAVEL BEYOND</div>
            </div>
          </a>

          <div className="alvLandNav" style={{display:"flex",alignItems:"center",gap:8}}>
            <button className="alvNavBtn" onClick={toggleDarkMode} style={{padding:"9px 16px",borderRadius:8,border:`1px solid ${cardBd}`,background:"transparent",color:txt,fontWeight:500,fontSize:13,cursor:"pointer"}}>
              {darkMode?"☀️ Light":"🌙 Dark"}
            </button>
            <button className="alvNavBtn" onClick={()=>navigate("/search")} style={{padding:"9px 16px",borderRadius:8,border:`1px solid ${cardBd}`,background:"transparent",color:txt,fontWeight:500,fontSize:13,cursor:"pointer"}}>Search</button>
            <button className="alvNavBtn" onClick={()=>navigate("/ai")} style={{padding:"9px 16px",borderRadius:8,border:`1px solid ${cardBd}`,background:"transparent",color:txt,fontWeight:500,fontSize:13,cursor:"pointer"}}>🤖 AI Chat</button>
            <button className="alvNavBtn" onClick={()=>navigate("/register")} style={{padding:"9px 20px",borderRadius:8,border:"none",background:`linear-gradient(135deg,${gold},#f0d080,${gold})`,color:"#1a1410",fontWeight:700,fontSize:13,cursor:"pointer"}}>Get Started →</button>
          </div>

          <button className="alvHamburger" onClick={()=>setMobileMenuOpen(o=>!o)}
            style={{display:"none",flexDirection:"column",gap:5,cursor:"pointer",padding:8,border:"none",background:"transparent"}}>
            <span style={{width:22,height:2,borderRadius:2,background:txt,display:"block",transition:"all 0.3s",transform:mobileMenuOpen?"rotate(45deg) translate(5px,5px)":""}}/>
            <span style={{width:22,height:2,borderRadius:2,background:txt,display:"block",transition:"all 0.3s",opacity:mobileMenuOpen?0:1}}/>
            <span style={{width:22,height:2,borderRadius:2,background:txt,display:"block",transition:"all 0.3s",transform:mobileMenuOpen?"rotate(-45deg) translate(5px,-5px)":""}}/>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className="alvMobile" style={{
        position:"fixed",top:68,left:0,right:0,zIndex:99,
        background:darkMode?"rgba(14,12,9,0.98)":"rgba(250,248,244,0.98)",
        backdropFilter:"blur(20px)",borderBottom:`1px solid ${cardBd}`,
        padding:"16px 24px 24px",display:"flex",flexDirection:"column",gap:10,
        transform:mobileMenuOpen?"translateY(0)":"translateY(-110%)",transition:"transform 0.3s ease",
      }}>
        {[
          {label:darkMode?"☀️ Light Mode":"🌙 Dark Mode",fn:()=>{toggleDarkMode();setMobileMenuOpen(false)}},
          {label:"✈️ Search Travel",fn:()=>{navigate("/search");setMobileMenuOpen(false)}},
          {label:"🤖 AI Chat",fn:()=>{navigate("/ai");setMobileMenuOpen(false)}},
          {label:"Sign In",fn:()=>{navigate("/login");setMobileMenuOpen(false)}},
        ].map(b=>(
          <button key={b.label} onClick={b.fn} style={{padding:"12px 20px",borderRadius:10,border:`1px solid ${cardBd}`,background:"transparent",color:txt,fontWeight:600,fontSize:15,cursor:"pointer",textAlign:"center"}}>{b.label}</button>
        ))}
        <button onClick={()=>{navigate("/register");setMobileMenuOpen(false)}} style={{padding:"12px 20px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${gold},#f0d080,${gold})`,color:"#1a1410",fontWeight:700,fontSize:15,cursor:"pointer"}}>
          Create Free Account →
        </button>
      </div>

      {/* HERO */}
      <section style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"110px 24px 60px",position:"relative"}}>
        <div style={{maxWidth:700,zIndex:1,position:"relative"}}>
          <span style={{fontSize:11,letterSpacing:"0.28em",color:gold,fontFamily:"sans-serif",fontWeight:600,marginBottom:20,display:"block"}}>INDIA'S AI TRAVEL PLATFORM</span>
          <h1 style={{fontSize:"clamp(38px,6vw,72px)",fontWeight:400,lineHeight:1.15,color:txt,marginBottom:20}}>
            Start planning your<br/>next trip.
          </h1>
          <p style={{fontSize:"clamp(15px,2vw,18px)",color:txtSub,lineHeight:1.75,marginBottom:36,maxWidth:560,margin:"0 auto 36px"}}>
            India's most intelligent travel booking platform.<br/>Best fares on flights and buses, instantly.
          </p>
          <div className="alvHeroBtns" style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <button className="alvHeroPrimary" onClick={()=>navigate("/register")} style={{padding:"14px 32px",borderRadius:12,background:`linear-gradient(135deg,${gold},#f0d080,${gold})`,border:"none",color:"#1a1410",fontWeight:700,fontSize:15,cursor:"pointer",transition:"all 0.3s"}}>
              Create Free Account →
            </button>
            <button onClick={()=>navigate("/login")} style={{padding:"14px 32px",borderRadius:12,background:"transparent",border:`1px solid ${cardBd}`,color:txt,fontWeight:500,fontSize:15,cursor:"pointer"}}>
              Sign In →
            </button>
          </div>
          {waitlistCount && <p style={{marginTop:28,fontSize:13,color:txtMut,fontFamily:"sans-serif"}}>🔥 {waitlistCount.toLocaleString()}+ travellers already on board</p>}
        </div>
      </section>

      {/* STATS */}
      <div style={{maxWidth:1160,margin:"0 auto",padding:"0 24px 60px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:20,textAlign:"center"}}>
          {[{n:"100+",l:"City Aliases"},{n:"3",l:"Partner Networks"},{n:"0",l:"Extra Charges"},{n:"AI",l:"Powered Search"}].map(s=>(
            <div key={s.l}>
              <div style={{fontSize:"clamp(28px,4vw,44px)",fontWeight:700,color:gold,marginBottom:6}}>{s.n}</div>
              <div style={{fontSize:12,color:txtSub,letterSpacing:"0.06em",fontFamily:"sans-serif"}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section style={{maxWidth:1160,margin:"0 auto",padding:"60px 24px 80px"}}>
        <p style={{fontSize:10,letterSpacing:"0.32em",color:gold,fontFamily:"sans-serif",fontWeight:700,textAlign:"center",marginBottom:14}}>HOW IT WORKS</p>
        <h2 style={{fontSize:"clamp(26px,4vw,44px)",fontWeight:400,textAlign:"center",color:txt,marginBottom:14}}>Three steps to the best deal.</h2>
        <div style={{width:40,height:1.5,background:`linear-gradient(90deg,transparent,${gold},transparent)`,margin:"0 auto 48px"}}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:24}}>
          {howCards.map(c=>(
            <div key={c.title} className="alvHowCard" style={{background:darkMode?"rgba(201,168,76,0.08)":"rgba(255,255,255,0.85)",border:`1px solid ${cardBd}`,borderRadius:20,padding:"32px 28px",backdropFilter:"blur(12px)",transition:"transform 0.2s,box-shadow 0.2s"}}>
              <div style={{fontSize:28,marginBottom:16}}>{c.icon}</div>
              <div style={{fontSize:16,fontWeight:700,color:txt,marginBottom:12,letterSpacing:"0.04em"}}>{c.title}</div>
              <p style={{fontSize:14,color:txtSub,lineHeight:1.7,marginBottom:14}}>{c.desc}</p>
              {c.bullets.map(b=>(
                <div key={b} style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:6}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:gold,marginTop:6,flexShrink:0}}/>
                  <span style={{fontSize:13,color:txtSub}}>{b}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* AI DEMO */}
      <div style={{background:darkMode?"linear-gradient(135deg,#060810,#0c1220,#060810)":"linear-gradient(135deg,#0c1445,#1e3a8a,#0284c7)",padding:"80px 24px"}}>
        <div style={{maxWidth:760,margin:"0 auto",textAlign:"center"}}>
          <p style={{fontSize:10,letterSpacing:"0.32em",color:"rgba(255,255,255,0.5)",fontFamily:"sans-serif",marginBottom:12}}>AI IN ACTION</p>
          <h2 style={{fontSize:"clamp(24px,3.5vw,38px)",color:"#ffffff",fontWeight:400,marginBottom:8,lineHeight:1.3}}>Just tell it what you need.</h2>
          <p style={{color:"rgba(255,255,255,0.6)",marginBottom:36,fontSize:15,lineHeight:1.7}}>Any language. Any route. Typos? No problem.</p>
          <div style={{display:"flex",flexDirection:"column",gap:12,textAlign:"left"}}>
            {[
              {u:"bus bangalore to chennai kal night",a:"🚌 Buses: BLR → Chennai\nVRL Travels · AC Sleeper · 21:00 → 02:30 · ₹550\nKSRTC · Semi-Sleeper · 23:00 → 04:30 · ₹480\n👉 View all on RedBus"},
              {u:"cheap flights blr to goa this weekend",a:"✈️ Flights: BLR → GOI · Saturday\nIndiGo 6E-123 · 06:20 → 07:35 · ₹2,840\nSpiceJet · 14:15 → 15:30 · ₹3,100\n👉 Book on Aviasales"},
            ].map((ex,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,0.08)",borderRadius:16,border:"1px solid rgba(255,255,255,0.12)",padding:"24px 22px",backdropFilter:"blur(10px)"}}>
                <p style={{fontSize:13,color:"rgba(255,255,255,0.55)",fontStyle:"italic",marginBottom:8}}>You: "{ex.u}"</p>
                <p style={{fontSize:14,lineHeight:1.7,color:"#ffffff",whiteSpace:"pre-line"}}>{ex.a}</p>
              </div>
            ))}
          </div>
          <button onClick={()=>navigate("/ai")} style={{marginTop:28,padding:"13px 32px",borderRadius:12,background:`linear-gradient(135deg,${gold},#f0d080,${gold})`,border:"none",color:"#1a1410",fontWeight:700,fontSize:15,cursor:"pointer"}}>
            Try Alvryn AI →
          </button>
        </div>
      </div>

      {/* PARTNERS — fully visible in dark & light */}
      <div style={{background:darkMode?"#111009":"#f5f0e8",borderTop:`1px solid ${cardBd}`,borderBottom:`1px solid ${cardBd}`,padding:"70px 24px"}}>
        <div style={{maxWidth:1160,margin:"0 auto"}}>
          <p style={{fontSize:10,letterSpacing:"0.32em",color:gold,fontFamily:"sans-serif",fontWeight:700,textAlign:"center",marginBottom:14}}>OUR PARTNERS</p>
          <h2 style={{fontSize:"clamp(26px,4vw,44px)",fontWeight:400,textAlign:"center",color:txt,marginBottom:14}}>Book with trusted platforms.</h2>
          <p style={{fontSize:15,color:txtSub,textAlign:"center",maxWidth:520,margin:"0 auto 44px",lineHeight:1.7}}>
            Alvryn connects you directly to our trusted travel partners — trusted travel platforms with live fares and millions of bookings.
          </p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:20,maxWidth:900,margin:"0 auto"}}>
            {partners.map(p=>(
              <div key={p.name} className="alvPartnerCard"
                onClick={()=>window.open(p.url,"_blank")}
                style={{
                  background: darkMode ? "#1e1a12" : "#ffffff",
                  border:`1.5px solid ${darkMode?"rgba(201,168,76,0.35)":"rgba(201,168,76,0.25)"}`,
                  borderRadius:18,padding:"32px 24px",textAlign:"center",cursor:"pointer",
                  transition:"all 0.25s",
                  boxShadow: darkMode?"0 2px 20px rgba(0,0,0,0.5)":"0 2px 16px rgba(201,168,76,0.1)",
                }}>
                <span style={{fontSize:40,marginBottom:16,display:"block"}}>{p.emoji}</span>
                <div style={{fontSize:16,fontWeight:700,color:txt,marginBottom:8,letterSpacing:"0.04em"}}>{p.name}</div>
                <div style={{fontSize:13,color:txtSub,lineHeight:1.6}}>{p.desc}</div>
              </div>
            ))}
          </div>
          <p style={{textAlign:"center",marginTop:28,fontSize:12,color:txtMut,fontFamily:"sans-serif"}}>
            Alvryn is a travel discovery platform. We may earn a commission from partner links at no extra cost to you.
          </p>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <section style={{maxWidth:1160,margin:"0 auto",padding:"80px 24px"}}>
        <p style={{fontSize:10,letterSpacing:"0.32em",color:gold,fontFamily:"sans-serif",fontWeight:700,textAlign:"center",marginBottom:14}}>WHAT TRAVELLERS SAY</p>
        <h2 style={{fontSize:"clamp(26px,4vw,44px)",fontWeight:400,textAlign:"center",color:txt,marginBottom:14}}>Real people. Real savings.</h2>
        <div style={{width:40,height:1.5,background:`linear-gradient(90deg,transparent,${gold},transparent)`,margin:"0 auto 44px"}}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:20}}>
          {testimonials.map(t=>(
            <div key={t.user} style={{background:darkMode?"rgba(201,168,76,0.07)":"rgba(255,255,255,0.85)",border:`1px solid ${cardBd}`,borderRadius:16,padding:"24px",backdropFilter:"blur(8px)"}}>
              <div style={{color:"#f0d080",fontSize:14,marginBottom:10}}>{"★".repeat(t.stars)}</div>
              <p style={{fontSize:14,color:txtSub,lineHeight:1.7,marginBottom:14}}>"{t.text}"</p>
              <p style={{fontSize:12,color:txtMut,fontFamily:"sans-serif"}}>— {t.user}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRAVEL GUIDE */}
      <section style={{maxWidth:1160,margin:"0 auto",padding:"0 24px 80px"}}>
        <p style={{fontSize:10,letterSpacing:"0.32em",color:gold,fontFamily:"sans-serif",fontWeight:700,textAlign:"center",marginBottom:14}}>TRAVEL GUIDE</p>
        <h2 style={{fontSize:"clamp(26px,4vw,44px)",fontWeight:400,textAlign:"center",color:txt,marginBottom:14}}>
          Tips, guides and<br/>smarter travel.
        </h2>
        <div style={{width:40,height:1.5,background:`linear-gradient(90deg,transparent,${gold},transparent)`,margin:"0 auto 40px"}}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:18}}>
          {[
            {title:"Best time to book flights in India",tag:"Flights",emoji:"✈️"},
            {title:"Top 10 overnight bus routes from Bangalore",tag:"Buses",emoji:"🚌"},
            {title:"Budget hotels in Goa under ₹2000",tag:"Hotels",emoji:"🏨"},
            {title:"Cheapest weekend getaways from Mumbai",tag:"Tips",emoji:"💡"},
          ].map(g=>(
            <div key={g.title} className="alvGuideCard"
              style={{background:darkMode?"rgba(201,168,76,0.06)":"rgba(255,255,255,0.75)",border:`1px solid ${cardBd}`,borderRadius:14,padding:"22px 20px",cursor:"pointer",transition:"transform 0.2s"}}>
              <div style={{fontSize:22,marginBottom:10}}>{g.emoji}</div>
              <div style={{fontSize:10,letterSpacing:"0.2em",color:gold,fontFamily:"sans-serif",marginBottom:8}}>{g.tag}</div>
              <div style={{fontSize:14,fontWeight:600,color:txt,lineHeight:1.5}}>{g.title}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <div style={{background:darkMode?"#111009":"#f0ece3",borderTop:`1px solid ${cardBd}`,borderBottom:`1px solid ${cardBd}`,padding:"70px 24px"}}>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          <p style={{fontSize:10,letterSpacing:"0.32em",color:gold,fontFamily:"sans-serif",fontWeight:700,textAlign:"center",marginBottom:14}}>FAQ</p>
          <h2 style={{fontSize:"clamp(24px,3.5vw,38px)",fontWeight:400,textAlign:"center",color:txt,marginBottom:8}}>Common questions.</h2>
          <div style={{width:40,height:1.5,background:`linear-gradient(90deg,transparent,${gold},transparent)`,margin:"16px auto 36px"}}/>
          {faqs.map(f=>(
            <div key={f.q} style={{borderBottom:`1px solid ${cardBd}`,paddingBottom:20,marginBottom:20}}>
              <div style={{fontSize:15,fontWeight:600,color:txt,marginBottom:8}}>💡 {f.q}</div>
              <div style={{fontSize:14,color:txtSub,lineHeight:1.7}}>{f.a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* WAITLIST */}
      <div style={{background:bg,borderTop:`1px solid ${cardBd}`,padding:"80px 24px",textAlign:"center"}}>
        <div style={{maxWidth:540,margin:"0 auto"}}>
          <p style={{fontSize:10,letterSpacing:"0.32em",color:gold,fontFamily:"sans-serif",fontWeight:700,marginBottom:14}}>JOIN ALVRYN</p>
          <h2 style={{fontSize:"clamp(26px,4vw,40px)",fontWeight:400,color:txt,marginBottom:10}}>Get early access.</h2>
          <p style={{fontSize:15,color:txtSub,marginBottom:32,lineHeight:1.7}}>
            Join {waitlistCount?waitlistCount.toLocaleString()+"+":"hundreds of"} travellers already on the list.
          </p>
          <form onSubmit={handleWaitlist} style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
            <input
              type="email" placeholder="Your email address"
              value={waitlistEmail} onChange={e=>setWaitlistEmail(e.target.value)} required
              style={{padding:"13px 20px",borderRadius:10,fontSize:15,border:`1.5px solid ${cardBd}`,background:darkMode?"rgba(255,255,255,0.07)":"#ffffff",color:txt,outline:"none",width:"100%",maxWidth:320,fontFamily:"sans-serif"}}
            />
            <button type="submit" style={{padding:"13px 28px",borderRadius:10,background:`linear-gradient(135deg,${gold},#f0d080,${gold})`,border:"none",color:"#1a1410",fontWeight:700,fontSize:15,cursor:"pointer",whiteSpace:"nowrap"}}>
              Join →
            </button>
          </form>
          {waitlistStatus && <p style={{marginTop:16,fontSize:14,color:waitlistStatus.startsWith("🎉")?gold:"#ef4444",fontFamily:"sans-serif"}}>{waitlistStatus}</p>}
          <p style={{marginTop:18,fontSize:12,color:txtMut,fontFamily:"sans-serif"}}>No spam. Refer friends and earn ₹150 per booking.</p>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{background:darkMode?"#0a0806":"#f5f0e8",borderTop:`1px solid ${cardBd}`,padding:"48px 24px 32px"}}>
        <div style={{maxWidth:1160,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:32,marginBottom:40}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
              <div style={{width:34,height:34,borderRadius:"50%",border:`1.5px solid ${gold}`,display:"flex",alignItems:"center",justifyContent:"center",color:gold,fontSize:13,fontWeight:700}}>A</div>
              <div>
                <div style={{fontSize:13,fontWeight:700,letterSpacing:"0.18em",color:txt}}>ALVRYN</div>
                <div style={{fontSize:8,letterSpacing:"0.22em",color:txtMut,fontFamily:"sans-serif"}}>TRAVEL BEYOND</div>
              </div>
            </div>
            <p style={{fontSize:12,color:txtMut,lineHeight:1.7,maxWidth:200,fontFamily:"sans-serif"}}>Built with ❤️ in Bangalore.<br/>India's AI travel discovery platform.</p>
          </div>
          <div>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.18em",color:gold,marginBottom:16,fontFamily:"sans-serif"}}>PRODUCT</div>
            {["Search Flights","Search Buses","AI Chat","My Bookings"].map(l=>(
              <a key={l} className="alvFooterLink" onClick={()=>navigate(l==="AI Chat"?"/ai":"/search")} style={{color:txtSub,fontSize:13,cursor:"pointer",display:"block",marginBottom:8,textDecoration:"none",transition:"color 0.2s"}}>{l}</a>
            ))}
          </div>
          <div>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.18em",color:gold,marginBottom:16,fontFamily:"sans-serif"}}>COMPANY</div>
            {["About Us","Terms & Conditions","Privacy Policy","Contact"].map(l=>(
              <a key={l} className="alvFooterLink" style={{color:txtSub,fontSize:13,cursor:"pointer",display:"block",marginBottom:8,textDecoration:"none",transition:"color 0.2s"}}>{l}</a>
            ))}
          </div>
          <div>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.18em",color:gold,marginBottom:16,fontFamily:"sans-serif"}}>PARTNERS</div>
            <a href="https://aviasales.in" target="_blank" rel="noreferrer" className="alvFooterLink" style={{color:txtSub,fontSize:13,display:"block",marginBottom:8,textDecoration:"none",transition:"color 0.2s"}}>Aviasales</a>
            <a href="https://redbus.in" target="_blank" rel="noreferrer" className="alvFooterLink" style={{color:txtSub,fontSize:13,display:"block",marginBottom:8,textDecoration:"none",transition:"color 0.2s"}}>RedBus</a>
            <a href="https://booking.com" target="_blank" rel="noreferrer" className="alvFooterLink" style={{color:txtSub,fontSize:13,display:"block",marginBottom:8,textDecoration:"none",transition:"color 0.2s"}}>Booking.com</a>
          </div>
        </div>
        <div style={{borderTop:`1px solid ${cardBd}`,paddingTop:24,textAlign:"center",fontSize:12,color:txtMut,fontFamily:"sans-serif"}}>
          <p style={{marginBottom:6}}>© 2026 Alvryn · alvryn.in · Built with love in Bangalore, India</p>
          <p>Alvryn is a travel discovery platform. We may earn a commission from partner links at no extra cost to you.</p>
        </div>
      </footer>
    </div>
  );
}