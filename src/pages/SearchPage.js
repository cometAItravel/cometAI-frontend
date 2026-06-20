/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/* ─── BRAND ─────────────────────────────────────────────────────────────── */
const G  = "#c9a84c";
const GD = "#8B6914";
const GL = "#f0d080";

/* ─── ALVRYN MARK — 3D golden bars + double ring ────────────────────────── */
function AlvrynMark({size=44,glow=false,bg=false}){
  const s=size,cx=s*0.5,cy=s*0.5,R1=s*0.47,R2=s*0.40,sw=s*0.10,id="am"+s;
  const lx1=cx-s*0.03,ly1=cy-s*0.27,lx2=cx-s*0.21,ly2=cy+s*0.30;
  const rx1=cx+s*0.05,ry1=cy-s*0.27,rx2=cx+s*0.21,ry2=cy+s*0.30;
  const dx=cx-s*0.01,dy=cy+s*0.01;
  return(
    <svg width={s} height={s} viewBox={"0 0 "+s+" "+s} fill="none"
      style={{filter:glow?"drop-shadow(0 0 "+(s*0.16)+"px rgba(201,168,76,0.8))":"none",flexShrink:0}}>
      <defs>
        <radialGradient id={id+"g"} cx="50%" cy="42%" r="48%"><stop offset="0%" stopColor="#f0d080" stopOpacity="0.55"/><stop offset="100%" stopColor="#c9a84c" stopOpacity="0"/></radialGradient>
        <linearGradient id={id+"l"} x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#6B5010" stopOpacity="0.85"/><stop offset="38%" stopColor="#f0d080" stopOpacity="1"/><stop offset="100%" stopColor="#a07820" stopOpacity="0.8"/></linearGradient>
        <linearGradient id={id+"r"} x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#c9a84c" stopOpacity="0.85"/><stop offset="100%" stopColor="#5a4010" stopOpacity="0.65"/></linearGradient>
        <linearGradient id={id+"k"} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f0d080" stopOpacity="0.9"/><stop offset="100%" stopColor="#8B6914" stopOpacity="0.7"/></linearGradient>
        <radialGradient id={id+"d"} cx="35%" cy="35%" r="65%"><stop offset="0%" stopColor="#f0d080"/><stop offset="100%" stopColor="#7a5a10" stopOpacity="0.9"/></radialGradient>
        {bg&&<radialGradient id={id+"b"} cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#faf7f2"/><stop offset="100%" stopColor="#f0ebe0"/></radialGradient>}
      </defs>
      {bg&&<circle cx={cx} cy={cy} r={R1+s*0.03} fill={"url(#"+id+"b)"}/>}
      <circle cx={cx} cy={cy*0.88} r={R2*0.68} fill={"url(#"+id+"g)"}/>
      <circle cx={cx} cy={cy} r={R1} stroke={"url(#"+id+"k)"} strokeWidth={s*0.008} fill="none"/>
      <circle cx={cx} cy={cy} r={R2} stroke={"url(#"+id+"k)"} strokeWidth={s*0.005} fill="none" opacity="0.5"/>
      <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke={"url(#"+id+"l)"} strokeWidth={sw} strokeLinecap="round"/>
      <line x1={rx1} y1={ry1} x2={rx2} y2={ry2} stroke={"url(#"+id+"r)"} strokeWidth={sw*0.88} strokeLinecap="round"/>
      <circle cx={dx} cy={dy} r={s*0.048} fill={"url(#"+id+"d)"}/>
      <circle cx={dx-s*0.012} cy={dy-s*0.012} r={s*0.022} fill="#fff" opacity="0.45"/>
    </svg>
  );
}

/* ─── CSS ─────────────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@200;300;400;600&family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{overflow-x:hidden;font-family:'DM Sans',sans-serif;}
::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:#c9a84c;border-radius:2px;}
@keyframes gs{0%{background-position:200% center;}100%{background-position:-200% center;}}
@keyframes pulse{0%,100%{opacity:0.7;transform:scale(1);}50%{opacity:1;transform:scale(1.08);}}
@keyframes slideUp{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes tabIn{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}

.sp-gold-text{background:linear-gradient(135deg,#8B6914,#c9a84c,#f0d080,#c9a84c);background-size:300% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:gs 5s linear infinite;}
.sp-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:14px 32px;border-radius:100px;background:linear-gradient(135deg,#8B6914,#c9a84c,#f0d080);color:#030303;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;border:none;cursor:pointer;transition:all 0.35s cubic-bezier(0.34,1.56,0.64,1);}
.sp-btn:hover{transform:translateY(-2px) scale(1.02);box-shadow:0 16px 40px rgba(201,168,76,0.4);}
.sp-btn-sm{padding:10px 22px;font-size:13px;}
.sp-input{width:100%;padding:14px 18px;border:1.5px solid rgba(0,0,0,0.1);border-radius:14px;font-family:'DM Sans',sans-serif;font-size:14px;color:#1a1a1a;background:#fff;outline:none;transition:border-color 0.2s,box-shadow 0.2s;}
.sp-input:focus{border-color:#c9a84c;box-shadow:0 0 0 3px rgba(201,168,76,0.12);}
.sp-card{background:#fff;border-radius:20px;border:1px solid rgba(0,0,0,0.07);box-shadow:0 4px 24px rgba(0,0,0,0.06);transition:all 0.35s cubic-bezier(0.34,1.56,0.64,1);}
.sp-card:hover{transform:translateY(-4px);box-shadow:0 16px 48px rgba(0,0,0,0.12);}
.sp-tab{padding:10px 22px;border-radius:100px;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;transition:all 0.25s ease;}
.sp-tag{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:100px;font-size:11px;font-family:'Space Mono',monospace;letter-spacing:0.06em;}
.sp-trust-logo{display:flex;align-items:center;gap:10px;padding:12px 20px;border-radius:14px;background:#fff;border:1px solid rgba(0,0,0,0.07);transition:all 0.25s ease;}
.sp-trust-logo:hover{box-shadow:0 8px 24px rgba(0,0,0,0.1);transform:translateY(-2px);}
.sp-reveal{opacity:0;transform:translateY(30px);transition:opacity 0.8s cubic-bezier(0.22,1,0.36,1),transform 0.9s cubic-bezier(0.22,1,0.36,1);}
.sp-reveal.visible{opacity:1;transform:translateY(0);}
@media(max-width:768px){.sp-hide-m{display:none!important;}.sp-grid-2{grid-template-columns:1fr!important;}.sp-grid-3{grid-template-columns:1fr 1fr!important;}.sp-grid-4{grid-template-columns:1fr 1fr!important;}}
`;

/* ─── DATA ───────────────────────────────────────────────────────────────── */
const POPULAR_FLIGHTS = [
  {from:"BLR",fromCity:"Bangalore",to:"GOI",toCity:"Goa",price:"₹3,200",tag:"Beach Season",icon:"🏖️",trend:"up"},
  {from:"DEL",fromCity:"Delhi",to:"BOM",toCity:"Mumbai",price:"₹2,800",tag:"Business Route",icon:"💼",trend:"stable"},
  {from:"BLR",fromCity:"Bangalore",to:"DXB",toCity:"Dubai",price:"₹8,500",tag:"Summer Travel",icon:"✈️",trend:"up"},
  {from:"DEL",fromCity:"Delhi",to:"LHR",toCity:"London",price:"₹28,000",tag:"Europe Season",icon:"🇬🇧",trend:"up"},
  {from:"BLR",fromCity:"Bangalore",to:"SIN",toCity:"Singapore",price:"₹11,500",tag:"Southeast Asia",icon:"🌴",trend:"stable"},
  {from:"BOM",fromCity:"Mumbai",to:"BKK",toCity:"Bangkok",price:"₹9,200",tag:"Budget Pick",icon:"⭐",trend:"down"},
];

const DEST_JUNE = [
  {name:"Ladakh",tag:"🏔️ Peak Season",why:"Best weather window Jun-Jul",budget:"18k-35k",img:"photo-1544735716-392fe2489ffa"},
  {name:"Manali",tag:"🌿 Pre-Monsoon",why:"Rohtang still accessible",budget:"8k-18k",img:"photo-1626621341517-bbf3d9990a23"},
  {name:"Coorg",tag:"☕ Monsoon Glow",why:"Waterfalls start, fewer crowds",budget:"6k-14k",img:"photo-1602216056096-3b40cc0c9944"},
  {name:"Ooty",tag:"🌸 Perfect Weather",why:"22°C all month, no humidity",budget:"5k-12k",img:"photo-1526772662000-3f88f10405ff"},
  {name:"Spiti Valley",tag:"❄️ Open Now",why:"Road just opened for summer",budget:"12k-22k",img:"photo-1592555187028-51a64e5bba29"},
  {name:"Pondicherry",tag:"🌊 Sea Breeze",why:"Calm seas before monsoon",budget:"4k-10k",img:"photo-1602216056096-3b40cc0c9944"},
];

const DEST_JULY = [
  {name:"Goa",tag:"🏖️ Budget Season",why:"40% cheaper hotels, few tourists",budget:"5k-12k",img:"photo-1512343879784-a960bf40e7f2"},
  {name:"Munnar",tag:"🌧️ Monsoon Magic",why:"Emerald hills, waterfalls peak",budget:"6k-15k",img:"photo-1602216056096-3b40cc0c9944"},
  {name:"Bali",tag:"🌺 Dry Season",why:"July is Bali's best weather",budget:"25k-45k",img:"photo-1537996194471-e657df975ab4"},
  {name:"Japan",tag:"🎆 Festival Season",why:"Tanabata & summer matsuri",budget:"60k-1.1L",img:"photo-1528360983277-13d401cdc186"},
  {name:"Cherrapunji",tag:"🌧️ World Record",why:"Monsoon tourism at peak",budget:"5k-10k",img:"photo-1626621341517-bbf3d9990a23"},
  {name:"Scotland",tag:"🏰 Summer Nights",why:"Long days, no crowds yet",budget:"70k-1.3L",img:"photo-1502602898657-3e91760cbb34"},
];

const TRAVEL_TIPS = [
  {icon:"📅",title:"Book 6 weeks early",desc:"Domestic flight prices rise sharply in the last 3 weeks before travel."},
  {icon:"🌧️",title:"Monsoon = deals",desc:"Jun-Sep fares drop 30-40% to Goa, Kovalam, Pondicherry. Same beaches."},
  {icon:"🎒",title:"Cabin bag saves money",desc:"Most Indian carriers charge ₹500-2000 for check-in. Pack light."},
  {icon:"🚌",title:"Bus over train for <6hrs",desc:"AC Volvo sleeper buses are faster, cheaper and have better timing flexibility."},
];

const TRUSTED_PARTNERS = [
  {name:"Aviasales",emoji:"✈️",desc:"Best flight deals worldwide",color:"#0055ff"},
  {name:"RedBus",emoji:"🚌",desc:"300+ bus routes across India",color:"#d84040"},
  {name:"Booking.com",emoji:"🏨",desc:"Budget to luxury hotels",color:"#003580"},
  {name:"IRCTC",emoji:"🚂",desc:"Official Indian Railways",color:"#1a6e3a"},
];

/* ─── LINK BUILDERS ──────────────────────────────────────────────────────── */
function flightLink(from,to,date,adults=1){
  const base="https://www.aviasales.com/search";
  const d=date?date.replace(/-/g,"").slice(2,8):"";
  const mk="?marker=714667&sub_id=alvryn_web";
  return `${base}/${from}${d}${to}${adults}/${mk.slice(1)}`;
}
function busLink(from,to,date){
  const f=(from||"").toLowerCase().replace(/\s+/g,"-");
  const t=(to||"").toLowerCase().replace(/\s+/g,"-");
  let dstr="";
  if(date){const d=new Date(date);if(!isNaN(d)){const dd=String(d.getDate()).padStart(2,"0"),mm=String(d.getMonth()+1).padStart(2,"0"),yy=d.getFullYear();dstr=`${dd}-${mm}-${yy}`;}}
  return `https://www.redbus.in/bus-tickets/${f}-to-${t}${dstr?`?doj=${dstr}`:""}`;
}
function hotelLink(city,check,checkout,guests=1){
  const q=encodeURIComponent(city||"");
  return `https://www.booking.com/searchresults.html?ss=${q}&checkin=${check||""}&checkout=${checkout||""}&group_adults=${guests}`;
}
function trainLink(from,to,date){
  const TC={"bangalore":"SBC","bengaluru":"SBC","mumbai":"CSTM","delhi":"NDLS","new delhi":"NDLS","chennai":"MAS","hyderabad":"SC","kolkata":"HWH","pune":"PUNE","kochi":"ERS","jaipur":"JP","varanasi":"BSB","trivandrum":"TVC","coimbatore":"CBE","madurai":"MDU","mysore":"MYS","nagpur":"NGP","bhopal":"BPL","lucknow":"LKO","agra":"AGC","amritsar":"ASR","ahmedabad":"ADI","surat":"ST","indore":"INDB","goa":"MAO","patna":"PNBE","guwahati":"GHY"};
  const fc=TC[from?.toLowerCase()]||(from||"").slice(0,4).toUpperCase();
  const tc=TC[to?.toLowerCase()]||(to||"").slice(0,4).toUpperCase();
  let dstr="";
  if(date){try{const d=new Date(date);if(!isNaN(d)){const dd=String(d.getDate()).padStart(2,"0"),mm=String(d.getMonth()+1).padStart(2,"0"),yy=d.getFullYear();dstr=`&journeyDate=${dd}-${mm}-${yy}`;}}catch{}}
  return `https://www.irctc.co.in/nget/train-search?fromStation=${fc}&toStation=${tc}&isCallFromDpDown=true${dstr}&quota=GN&class=SL`;
}

/* ─── ALVI PROMO BANNER ──────────────────────────────────────────────────── */
function AlviBanner({onTry}){
  return(
    <div style={{background:"linear-gradient(135deg,#0a0604 0%,#1e0e04 40%,#2d1408 100%)",borderRadius:24,padding:"32px 36px",marginBottom:40,position:"relative",overflow:"hidden",border:"1px solid rgba(201,168,76,0.2)"}}>
      <div style={{position:"absolute",right:-20,top:-20,width:180,height:180,borderRadius:"50%",background:"radial-gradient(circle,rgba(201,168,76,0.15),transparent 70%)",pointerEvents:"none"}}/>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:20,position:"relative",zIndex:2}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:"rgba(201,168,76,0.12)",border:"1px solid rgba(201,168,76,0.3)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <AlvrynMark size={36} glow/>
          </div>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:22,color:"#fff",letterSpacing:"0.05em"}}>ALVI</span>
              <span style={{background:"rgba(201,168,76,0.2)",border:"1px solid rgba(201,168,76,0.4)",borderRadius:100,padding:"2px 10px",fontFamily:"'Space Mono',monospace",fontSize:9,color:G,letterSpacing:"0.12em"}}>AI TRAVEL</span>
            </div>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"rgba(255,255,255,0.5)",lineHeight:1.5}}>
              Describe your trip in plain language. ALVI plans flights, hotels, budget and itinerary — instantly.
            </p>
          </div>
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
          <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"rgba(255,255,255,0.35)",maxWidth:200}}>
            <em>"6 friends Goa August 15k budget beaches only"</em>
          </div>
          <button onClick={onTry} className="sp-btn sp-btn-sm">Try ALVI Free →</button>
        </div>
      </div>
    </div>
  );
}

/* ─── SECTION HEADER ────────────────────────────────────────────────────── */
function SectionHead({label,title,sub,light=false}){
  return(
    <div style={{marginBottom:32}}>
      {label&&<div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:light?"rgba(0,0,0,0.4)":G,letterSpacing:"0.22em",marginBottom:10}}>{label}</div>}
      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(26px,3.5vw,44px)",color:light?"#0a0a0a":"#0a0a0a",lineHeight:1.1,marginBottom:sub?10:0}}>{title}</h2>
      {sub&&<p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"rgba(0,0,0,0.45)",lineHeight:1.65,maxWidth:540,marginTop:8}}>{sub}</p>}
    </div>
  );
}

/* ─── MAIN ───────────────────────────────────────────────────────────────── */
export default function SearchPage(){
  const navigate = useNavigate();
  const [activeTab,setActiveTab] = useState("flights");
  const [month,setMonth] = useState("june");

  // Flight form
  const [fFrom,setFFrom] = useState("");
  const [fTo,setFTo]     = useState("");
  const [fDate,setFDate] = useState("");
  const [fAdults,setFAdults] = useState("1");

  // Bus form
  const [bFrom,setBFrom] = useState("");
  const [bTo,setBTo]     = useState("");
  const [bDate,setBDate] = useState("");

  // Hotel form
  const [hCity,setHCity]     = useState("");
  const [hIn,setHIn]         = useState("");
  const [hOut,setHOut]       = useState("");
  const [hGuests,setHGuests] = useState("1");

  // Train form
  const [tFrom,setTFrom] = useState("");
  const [tTo,setTTo]     = useState("");
  const [tDate,setTDate] = useState("");

  const goApp = useCallback(()=>navigate(localStorage.getItem("token")?"/ai":"/register"),[navigate]);
  const goLogin = useCallback(()=>navigate("/login"),[navigate]);

  // Scroll reveal
  useEffect(()=>{
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible");});
    },{threshold:0.06});
    document.querySelectorAll(".sp-reveal").forEach(el=>obs.observe(el));
    return()=>obs.disconnect();
  },[]);

  const searchFlight = ()=>{
    if(!fFrom||!fTo){alert("Please enter origin and destination");return;}
    window.open(flightLink(fFrom.trim().toUpperCase(),fTo.trim().toUpperCase(),fDate,parseInt(fAdults)||1),"_blank");
  };
  const searchBus = ()=>{
    if(!bFrom||!bTo){alert("Please enter origin and destination");return;}
    window.open(busLink(bFrom.trim(),bTo.trim(),bDate),"_blank");
  };
  const searchHotel = ()=>{
    if(!hCity){alert("Please enter a city");return;}
    window.open(hotelLink(hCity.trim(),hIn,hOut,parseInt(hGuests)||1),"_blank");
  };
  const searchTrain = ()=>{
    if(!tFrom||!tTo){alert("Please enter origin and destination");return;}
    window.open(trainLink(tFrom.trim(),tTo.trim(),tDate),"_blank");
  };

  const today = new Date().toISOString().split("T")[0];
  const TABS = [
    {id:"flights",label:"✈️ Flights",color:"#0055ff"},
    {id:"buses",label:"🚌 Buses",color:"#d84040"},
    {id:"hotels",label:"🏨 Hotels",color:"#003580"},
    {id:"trains",label:"🚂 Trains",color:"#1a6e3a"},
  ];

  return(
    <>
      <style>{CSS}</style>

      {/* ── NAV ── */}
      <nav style={{background:"#fff",borderBottom:"1px solid rgba(0,0,0,0.06)",padding:"0 5%",height:64,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(12px)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>navigate("/")}>
          <AlvrynMark size={34} bg/>
          <div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:300,fontSize:17,color:"#0a0a0a",letterSpacing:"0.18em"}}>ALVRYN</div>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:8,color:"rgba(0,0,0,0.3)",letterSpacing:"0.15em",marginTop:-2}}>TRAVEL</div>
          </div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>navigate("/new")} style={{padding:"8px 18px",borderRadius:100,border:"1px solid rgba(0,0,0,0.12)",background:"transparent",fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"rgba(0,0,0,0.6)",cursor:"pointer",transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(0,0,0,0.04)";}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>Home</button>
          <button onClick={goApp} className="sp-btn sp-btn-sm">Try ALVI Free</button>
        </div>
      </nav>

      <div style={{background:"#f8f5f0",minHeight:"100vh",paddingBottom:80}}>

        {/* ── HERO BANNER ── */}
        <div style={{background:"linear-gradient(135deg,#0a0604 0%,#1e0e04 45%,#8B3A0F 100%)",padding:"60px 5% 80px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",right:"5%",top:"50%",transform:"translateY(-50%)",opacity:0.06,pointerEvents:"none",userSelect:"none",fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"clamp(80px,12vw,200px)",color:"#fff",letterSpacing:"0.05em",whiteSpace:"nowrap"}}>EXPLORE</div>
          <div style={{maxWidth:900,margin:"0 auto",position:"relative",zIndex:2}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:100,border:"1px solid rgba(201,168,76,0.3)",background:"rgba(201,168,76,0.08)",marginBottom:20}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:G,display:"inline-block"}}/>
              <span style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:G,letterSpacing:"0.2em"}}>TRUSTED BOOKING PARTNERS</span>
            </div>
            <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(36px,5vw,72px)",color:"#fff",lineHeight:1,letterSpacing:"-0.01em",marginBottom:16}}>
              Search smarter.<br/><span className="sp-gold-text">Book with confidence.</span>
            </h1>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:16,color:"rgba(255,255,255,0.45)",lineHeight:1.7,maxWidth:480,marginBottom:32}}>
              Flights, buses, hotels and trains — all in one place. Official booking partners. No hidden fees. Or let ALVI plan your entire trip in one message.
            </p>
            <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
              {[["✈️","500+ routes"],["🏨","Worldwide hotels"],["💰","Best price guarantee"],["🛡️","Secure booking"]].map(([ic,tx])=>(
                <div key={tx} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:100,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)"}}>
                  <span style={{fontSize:13}}>{ic}</span>
                  <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"rgba(255,255,255,0.65)"}}>{tx}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 5%"}}>

          {/* ── SEARCH CARD ── */}
          <div style={{background:"#fff",borderRadius:24,padding:"32px",marginTop:-40,marginBottom:40,boxShadow:"0 20px 60px rgba(0,0,0,0.12)",border:"1px solid rgba(0,0,0,0.05)",position:"relative",zIndex:10}}>
            {/* Tabs */}
            <div style={{display:"flex",gap:8,marginBottom:28,flexWrap:"wrap"}}>
              {TABS.map(tab=>(
                <button key={tab.id} className="sp-tab"
                  onClick={()=>setActiveTab(tab.id)}
                  style={{background:activeTab===tab.id?tab.color:"rgba(0,0,0,0.04)",color:activeTab===tab.id?"#fff":"rgba(0,0,0,0.55)",fontWeight:activeTab===tab.id?600:400}}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* FLIGHTS */}
            {activeTab==="flights"&&(
              <div style={{animation:"tabIn 0.3s ease"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:14,alignItems:"end"}} className="sp-grid-2">
                  <div>
                    <label style={{display:"block",fontFamily:"'Space Mono',monospace",fontSize:9,color:"rgba(0,0,0,0.4)",letterSpacing:"0.15em",marginBottom:6}}>FROM (IATA CODE)</label>
                    <input className="sp-input" placeholder="BLR — Bangalore" value={fFrom} onChange={e=>setFFrom(e.target.value.toUpperCase())} maxLength={3}/>
                  </div>
                  <div>
                    <label style={{display:"block",fontFamily:"'Space Mono',monospace",fontSize:9,color:"rgba(0,0,0,0.4)",letterSpacing:"0.15em",marginBottom:6}}>TO (IATA CODE)</label>
                    <input className="sp-input" placeholder="GOI — Goa" value={fTo} onChange={e=>setFTo(e.target.value.toUpperCase())} maxLength={3}/>
                  </div>
                  <div>
                    <label style={{display:"block",fontFamily:"'Space Mono',monospace",fontSize:9,color:"rgba(0,0,0,0.4)",letterSpacing:"0.15em",marginBottom:6}}>DEPARTURE DATE</label>
                    <input className="sp-input" type="date" min={today} value={fDate} onChange={e=>setFDate(e.target.value)}/>
                  </div>
                  <button className="sp-btn" onClick={searchFlight} style={{whiteSpace:"nowrap",padding:"14px 28px"}}>Search Flights</button>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:12,marginTop:14}}>
                  <label style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"rgba(0,0,0,0.5)"}}>Adults:</label>
                  <select value={fAdults} onChange={e=>setFAdults(e.target.value)} style={{padding:"8px 14px",borderRadius:10,border:"1px solid rgba(0,0,0,0.1)",fontFamily:"'DM Sans',sans-serif",fontSize:14,outline:"none",cursor:"pointer"}}>
                    {[1,2,3,4,5,6,7,8].map(n=><option key={n} value={n}>{n} Adult{n>1?"s":""}</option>)}
                  </select>
                  <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"rgba(0,0,0,0.35)"}}>Powered by Aviasales — official fares, no markup</span>
                </div>
                <div style={{marginTop:16,padding:"12px 16px",background:"rgba(201,168,76,0.06)",borderRadius:12,border:"1px solid rgba(201,168,76,0.15)"}}>
                  <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"rgba(0,0,0,0.5)"}}>💡 <strong>Tip:</strong> Don't know IATA codes? Just tell ALVI your city names — </span>
                  <button onClick={goApp} style={{background:"none",border:"none",color:GD,fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,cursor:"pointer",textDecoration:"underline"}}>Try ALVI Free →</button>
                </div>
              </div>
            )}

            {/* BUSES */}
            {activeTab==="buses"&&(
              <div style={{animation:"tabIn 0.3s ease"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:14,alignItems:"end"}} className="sp-grid-2">
                  <div>
                    <label style={{display:"block",fontFamily:"'Space Mono',monospace",fontSize:9,color:"rgba(0,0,0,0.4)",letterSpacing:"0.15em",marginBottom:6}}>FROM CITY</label>
                    <input className="sp-input" placeholder="Bangalore" value={bFrom} onChange={e=>setBFrom(e.target.value)}/>
                  </div>
                  <div>
                    <label style={{display:"block",fontFamily:"'Space Mono',monospace",fontSize:9,color:"rgba(0,0,0,0.4)",letterSpacing:"0.15em",marginBottom:6}}>TO CITY</label>
                    <input className="sp-input" placeholder="Goa" value={bTo} onChange={e=>setBTo(e.target.value)}/>
                  </div>
                  <div>
                    <label style={{display:"block",fontFamily:"'Space Mono',monospace",fontSize:9,color:"rgba(0,0,0,0.4)",letterSpacing:"0.15em",marginBottom:6}}>TRAVEL DATE</label>
                    <input className="sp-input" type="date" min={today} value={bDate} onChange={e=>setBDate(e.target.value)}/>
                  </div>
                  <button className="sp-btn" onClick={searchBus} style={{whiteSpace:"nowrap",padding:"14px 28px"}}>Search Buses</button>
                </div>
                <div style={{marginTop:14,fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"rgba(0,0,0,0.4)"}}>Powered by RedBus — 300+ routes, AC Sleeper, Volvo</div>
              </div>
            )}

            {/* HOTELS */}
            {activeTab==="hotels"&&(
              <div style={{animation:"tabIn 0.3s ease"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr auto",gap:14,alignItems:"end"}} className="sp-grid-2">
                  <div>
                    <label style={{display:"block",fontFamily:"'Space Mono',monospace",fontSize:9,color:"rgba(0,0,0,0.4)",letterSpacing:"0.15em",marginBottom:6}}>CITY / DESTINATION</label>
                    <input className="sp-input" placeholder="Goa, India" value={hCity} onChange={e=>setHCity(e.target.value)}/>
                  </div>
                  <div>
                    <label style={{display:"block",fontFamily:"'Space Mono',monospace",fontSize:9,color:"rgba(0,0,0,0.4)",letterSpacing:"0.15em",marginBottom:6}}>CHECK-IN</label>
                    <input className="sp-input" type="date" min={today} value={hIn} onChange={e=>setHIn(e.target.value)}/>
                  </div>
                  <div>
                    <label style={{display:"block",fontFamily:"'Space Mono',monospace",fontSize:9,color:"rgba(0,0,0,0.4)",letterSpacing:"0.15em",marginBottom:6}}>CHECK-OUT</label>
                    <input className="sp-input" type="date" min={hIn||today} value={hOut} onChange={e=>setHOut(e.target.value)}/>
                  </div>
                  <div>
                    <label style={{display:"block",fontFamily:"'Space Mono',monospace",fontSize:9,color:"rgba(0,0,0,0.4)",letterSpacing:"0.15em",marginBottom:6}}>GUESTS</label>
                    <select value={hGuests} onChange={e=>setHGuests(e.target.value)} className="sp-input" style={{cursor:"pointer"}}>
                      {[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n} Guest{n>1?"s":""}</option>)}
                    </select>
                  </div>
                  <button className="sp-btn" onClick={searchHotel} style={{whiteSpace:"nowrap",padding:"14px 28px"}}>Find Hotels</button>
                </div>
                <div style={{marginTop:14,fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"rgba(0,0,0,0.4)"}}>Powered by Booking.com — worldwide hotels, instant confirmation</div>
              </div>
            )}

            {/* TRAINS */}
            {activeTab==="trains"&&(
              <div style={{animation:"tabIn 0.3s ease"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:14,alignItems:"end"}} className="sp-grid-2">
                  <div>
                    <label style={{display:"block",fontFamily:"'Space Mono',monospace",fontSize:9,color:"rgba(0,0,0,0.4)",letterSpacing:"0.15em",marginBottom:6}}>FROM CITY</label>
                    <input className="sp-input" placeholder="Bangalore" value={tFrom} onChange={e=>setTFrom(e.target.value)}/>
                  </div>
                  <div>
                    <label style={{display:"block",fontFamily:"'Space Mono',monospace",fontSize:9,color:"rgba(0,0,0,0.4)",letterSpacing:"0.15em",marginBottom:6}}>TO CITY</label>
                    <input className="sp-input" placeholder="Delhi" value={tTo} onChange={e=>setTTo(e.target.value)}/>
                  </div>
                  <div>
                    <label style={{display:"block",fontFamily:"'Space Mono',monospace",fontSize:9,color:"rgba(0,0,0,0.4)",letterSpacing:"0.15em",marginBottom:6}}>JOURNEY DATE</label>
                    <input className="sp-input" type="date" min={today} value={tDate} onChange={e=>setTDate(e.target.value)}/>
                  </div>
                  <button className="sp-btn" onClick={searchTrain} style={{whiteSpace:"nowrap",padding:"14px 28px"}}>Search Trains</button>
                </div>
                <div style={{marginTop:14,fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"rgba(0,0,0,0.4)"}}>Opens IRCTC — official Indian Railways. Book directly.</div>
              </div>
            )}
          </div>

          {/* ── ALVI BANNER ── */}
          <AlviBanner onTry={goApp}/>

          {/* ── POPULAR FLIGHTS THIS WEEK ── */}
          <div className="sp-reveal" style={{marginBottom:56}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
              <SectionHead label="JUNE 2026" title="Popular flights this week" />
              <button onClick={()=>setActiveTab("flights")} style={{padding:"8px 18px",borderRadius:100,border:"1px solid rgba(0,0,0,0.12)",background:"transparent",fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"rgba(0,0,0,0.55)",cursor:"pointer"}}>Search flights →</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}} className="sp-grid-3">
              {POPULAR_FLIGHTS.map((f,i)=>(
                <div key={i} className="sp-card" style={{padding:"20px 22px",cursor:"pointer"}} onClick={()=>window.open(flightLink(f.from,f.to,"","1"),"_blank")}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:18}}>{f.icon}</span>
                      <span className="sp-tag" style={{background:"rgba(201,168,76,0.1)",color:GD}}>{f.tag}</span>
                    </div>
                    <span style={{fontSize:10,color:f.trend==="up"?"#e53e3e":f.trend==="down"?"#38a169":"rgba(0,0,0,0.35)",fontFamily:"'Space Mono',monospace"}}>{f.trend==="up"?"↑ Rising":f.trend==="down"?"↓ Falling":"→ Stable"}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <span style={{fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:15,color:"#0a0a0a"}}>{f.fromCity}</span>
                    <span style={{color:"rgba(0,0,0,0.3)",fontSize:16}}>→</span>
                    <span style={{fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:15,color:"#0a0a0a"}}>{f.toCity}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:22,color:GD}}>{f.price}</span>
                    <span style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:"rgba(0,0,0,0.35)"}}>{f.from} → {f.to}</span>
                  </div>
                  <div style={{marginTop:10,fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"rgba(0,0,0,0.35)"}}>Onwards · Book on Aviasales</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── BEST DESTINATIONS ── */}
          <div className="sp-reveal" style={{marginBottom:56}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
              <SectionHead label="CURATED BY ALVI" title="Best destinations right now" sub="Updated every month based on weather, value and availability."/>
              <div style={{display:"flex",gap:8}}>
                {[["june","June 2026"],["july","July 2026"]].map(([m,label])=>(
                  <button key={m} onClick={()=>setMonth(m)} style={{padding:"9px 20px",borderRadius:100,border:month===m?"none":"1px solid rgba(0,0,0,0.12)",background:month===m?"linear-gradient(135deg,#8B6914,#c9a84c)":"transparent",color:month===m?"#030303":"rgba(0,0,0,0.55)",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:month===m?700:400,cursor:"pointer",transition:"all 0.2s"}}>{label}</button>
                ))}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:14}}>
              {(month==="june"?DEST_JUNE:DEST_JULY).map((d,i)=>(
                <div key={d.name} className="sp-card" style={{cursor:"pointer",overflow:"hidden",position:"relative"}}
                  onClick={()=>navigate(localStorage.getItem("token")?"/ai?dest="+d.name:"/register")}>
                  <img src={"https://images.unsplash.com/"+d.img+"?auto=format&fit=crop&w=400&h=300&q=70"} alt={d.name} loading="lazy"
                    style={{width:"100%",height:140,objectFit:"cover",display:"block"}} onError={e=>{e.target.style.display="none";}}/>
                  <div style={{padding:"14px 16px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                      <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:18,color:"#0a0a0a"}}>{d.name}</span>
                      <span style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:GD}}>{d.budget}</span>
                    </div>
                    <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:GD,fontWeight:600}}>{d.tag}</span>
                    <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"rgba(0,0,0,0.45)",marginTop:4,lineHeight:1.4}}>{d.why}</p>
                    <div style={{marginTop:10,display:"flex",justifyContent:"flex-end"}}>
                      <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:GD,fontWeight:600}}>Plan with ALVI →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── TRUSTED PARTNERS ── */}
          <div className="sp-reveal" style={{marginBottom:56}}>
            <SectionHead label="OUR PARTNERS" title="Book directly. No extra cost." sub="We partner with the most trusted booking platforms. You pay the same price — we earn a small commission only when you book."/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}} className="sp-grid-2">
              {TRUSTED_PARTNERS.map((p,i)=>(
                <div key={p.name} className="sp-trust-logo" style={{flexDirection:"column",alignItems:"flex-start",padding:"20px 22px"}}>
                  <div style={{fontSize:28,marginBottom:10}}>{p.emoji}</div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:16,color:"#0a0a0a",marginBottom:4}}>{p.name}</div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"rgba(0,0,0,0.45)",lineHeight:1.5}}>{p.desc}</div>
                  <div style={{marginTop:8,width:28,height:2,background:p.color,borderRadius:1}}/>
                </div>
              ))}
            </div>
          </div>

          {/* ── SMARTER TRAVEL TIPS ── */}
          <div className="sp-reveal" style={{marginBottom:56}}>
            <SectionHead label="TRAVEL SMARTER" title="Tips from ALVI" sub="Our AI has planned thousands of trips. Here's what actually saves money."/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}} className="sp-grid-2">
              {TRAVEL_TIPS.map((tip,i)=>(
                <div key={i} style={{background:"#fff",borderRadius:18,padding:"22px 20px",border:"1px solid rgba(0,0,0,0.07)",transition:"all 0.3s ease"}} onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 12px 36px rgba(0,0,0,0.1)";e.currentTarget.style.transform="translateY(-4px)";}} onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="translateY(0)";}}>
                  <div style={{fontSize:24,marginBottom:12}}>{tip.icon}</div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:14,color:"#0a0a0a",marginBottom:6}}>{tip.title}</div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"rgba(0,0,0,0.45)",lineHeight:1.6}}>{tip.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── ALVI CTA ── */}
          <div className="sp-reveal">
            <div style={{background:"linear-gradient(135deg,#0a0604,#1e0e04,#2d1408)",borderRadius:24,padding:"48px 40px",textAlign:"center",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 50%,rgba(201,168,76,0.12),transparent 65%)",pointerEvents:"none"}}/>
              <div style={{position:"relative",zIndex:2}}>
                <div style={{display:"inline-flex",marginBottom:20}}><AlvrynMark size={52} glow/></div>
                <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:200,fontSize:"clamp(28px,4vw,52px)",color:"#fff",lineHeight:1,marginBottom:14}}>
                  Too many options?<br/><span className="sp-gold-text">Ask ALVI.</span>
                </h2>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:16,color:"rgba(255,255,255,0.4)",lineHeight:1.7,maxWidth:440,margin:"0 auto 32px"}}>
                  Describe your trip in plain words. ALVI finds the best route, hotel and budget — and gives you ready-to-book links.
                </p>
                <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
                  <button onClick={goApp} className="sp-btn" style={{fontSize:16,padding:"17px 44px"}}>Try ALVI Free</button>
                  <button onClick={goLogin} style={{padding:"16px 32px",borderRadius:100,border:"1px solid rgba(255,255,255,0.2)",background:"transparent",color:"rgba(255,255,255,0.65)",fontFamily:"'DM Sans',sans-serif",fontSize:15,cursor:"pointer",transition:"all 0.25s"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.08)";}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>Sign In →</button>
                </div>
                <div style={{marginTop:24,fontFamily:"'Space Mono',monospace",fontSize:9,color:"rgba(255,255,255,0.15)",letterSpacing:"0.22em"}}>FREE FOREVER · NO CREDIT CARD · TRUSTED PARTNERS</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
