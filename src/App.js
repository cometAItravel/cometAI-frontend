/* eslint-disable no-useless-escape */
import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import MyBookings from "./pages/MyBookings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserProfile from "./pages/UserProfile";

const API = "https://cometai-backend.onrender.com";
const GOLD = "#c9a84c";
const GOLD_DARK = "#8B6914";
const GRAD = "linear-gradient(135deg,#c9a84c,#f0d080,#c9a84c)";

const SHARED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600&family=Space+Mono:wght@400;700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);}}
  @keyframes floatUD{0%,100%{transform:translateY(0);}50%{transform:translateY(-9px);}}
  @keyframes gradShift{0%,100%{background-position:0% 50%;}50%{background-position:100% 50%;}}
  @keyframes spinSlow{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
  ::-webkit-scrollbar{width:2px;}
  ::-webkit-scrollbar-thumb{background:linear-gradient(#c9a84c,#8B6914);border-radius:2px;}
  @media(max-width:768px){
    .search-city-grid{grid-template-columns:1fr!important;}
    .search-date-grid{grid-template-columns:1fr 1fr!important;}
    .results-card-bottom{flex-direction:column!important;gap:12px!important;}
  }
`;

// ─── ICON ─────────────────────────────────────────────────────────────────────
function AlvrynIcon({ size = 40 }) {
  const uid = `app_${size}`;
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
}

// ─── AURORA BG ────────────────────────────────────────────────────────────────
function AuroraBackground() {
  const ref=useRef(null);const raf=useRef(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;const ctx=c.getContext("2d");
    let W=c.offsetWidth,H=c.offsetHeight;c.width=W;c.height=H;
    const cols=["#c9a84c","#f0d080","#8B6914","#d4b868"];
    const blobs=Array.from({length:5},(_,i)=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-0.5)*0.45,vy:(Math.random()-0.5)*0.45,r:200+Math.random()*180,ci:i%cols.length}));
    const resize=()=>{W=c.offsetWidth;H=c.offsetHeight;c.width=W;c.height=H;};
    window.addEventListener("resize",resize);
    const draw=()=>{ctx.clearRect(0,0,W,H);blobs.forEach(b=>{b.x+=b.vx;b.y+=b.vy;if(b.x<-b.r||b.x>W+b.r)b.vx*=-1;if(b.y<-b.r||b.y>H+b.r)b.vy*=-1;const g=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r);g.addColorStop(0,cols[b.ci]+"18");g.addColorStop(1,"transparent");ctx.fillStyle=g;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill();});raf.current=requestAnimationFrame(draw);};
    draw();
    return()=>{cancelAnimationFrame(raf.current);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}}/>;
}

// ─── BUS DATA ─────────────────────────────────────────────────────────────────
const BUS_ROUTES=[
  {from:"Bangalore",to:"Chennai",    dur:"5h 30m",dep:"06:00",arr:"11:30",price:650, seats:40,type:"AC Sleeper",   op:"VRL Travels"},
  {from:"Bangalore",to:"Chennai",    dur:"5h 30m",dep:"21:00",arr:"02:30",price:550, seats:35,type:"Semi-Sleeper", op:"KSRTC"},
  {from:"Bangalore",to:"Hyderabad",  dur:"8h",    dep:"20:00",arr:"04:00",price:800, seats:30,type:"AC Sleeper",   op:"SRS Travels"},
  {from:"Bangalore",to:"Goa",        dur:"9h",    dep:"21:30",arr:"06:30",price:900, seats:28,type:"AC Sleeper",   op:"Neeta Tours"},
  {from:"Bangalore",to:"Mumbai",     dur:"16h",   dep:"17:00",arr:"09:00",price:1400,seats:22,type:"AC Sleeper",   op:"VRL Travels"},
  {from:"Bangalore",to:"Pune",       dur:"14h",   dep:"18:00",arr:"08:00",price:1200,seats:25,type:"AC Sleeper",   op:"Paulo Travels"},
  {from:"Bangalore",to:"Coimbatore", dur:"4h",    dep:"07:00",arr:"11:00",price:400, seats:45,type:"AC Seater",    op:"KSRTC"},
  {from:"Bangalore",to:"Mangalore",  dur:"7h",    dep:"22:00",arr:"05:00",price:700, seats:32,type:"AC Sleeper",   op:"VRL Travels"},
  {from:"Chennai",  to:"Hyderabad",  dur:"7h",    dep:"21:00",arr:"04:00",price:750, seats:35,type:"AC Sleeper",   op:"TSRTC"},
  {from:"Chennai",  to:"Coimbatore", dur:"4h 30m",dep:"08:00",arr:"12:30",price:350, seats:50,type:"AC Seater",    op:"TNSTC"},
  {from:"Chennai",  to:"Madurai",    dur:"5h",    dep:"22:00",arr:"03:00",price:450, seats:40,type:"AC Sleeper",   op:"Parveen Travels"},
  {from:"Hyderabad",to:"Bangalore",  dur:"8h",    dep:"21:00",arr:"05:00",price:800, seats:30,type:"AC Sleeper",   op:"Orange Travels"},
  {from:"Hyderabad",to:"Mumbai",     dur:"12h",   dep:"18:00",arr:"06:00",price:1100,seats:25,type:"AC Sleeper",   op:"VRL Travels"},
  {from:"Hyderabad",to:"Chennai",    dur:"7h",    dep:"20:30",arr:"03:30",price:700, seats:35,type:"AC Sleeper",   op:"APSRTC"},
  {from:"Mumbai",   to:"Pune",       dur:"3h",    dep:"07:00",arr:"10:00",price:300, seats:55,type:"AC Seater",    op:"MSRTC"},
  {from:"Mumbai",   to:"Goa",        dur:"10h",   dep:"22:00",arr:"08:00",price:950, seats:28,type:"AC Sleeper",   op:"Paulo Travels"},
  {from:"Mumbai",   to:"Ahmedabad",  dur:"8h",    dep:"21:00",arr:"05:00",price:800, seats:32,type:"AC Sleeper",   op:"Patel Travels"},
  {from:"Mumbai",   to:"Surat",      dur:"4h",    dep:"07:30",arr:"11:30",price:400, seats:48,type:"AC Seater",    op:"GSRTC"},
  {from:"Pune",     to:"Goa",        dur:"8h",    dep:"22:30",arr:"06:30",price:850, seats:30,type:"AC Sleeper",   op:"Neeta Tours"},
  {from:"Pune",     to:"Hyderabad",  dur:"10h",   dep:"20:00",arr:"06:00",price:950, seats:28,type:"AC Sleeper",   op:"SRS Travels"},
  {from:"Delhi",    to:"Jaipur",     dur:"5h",    dep:"06:00",arr:"11:00",price:500, seats:45,type:"AC Seater",    op:"RSRTC"},
  {from:"Delhi",    to:"Agra",       dur:"4h",    dep:"07:00",arr:"11:00",price:400, seats:50,type:"AC Seater",    op:"UP Roadways"},
  {from:"Delhi",    to:"Chandigarh", dur:"4h",    dep:"08:00",arr:"12:00",price:450, seats:48,type:"AC Seater",    op:"HRTC"},
  {from:"Delhi",    to:"Lucknow",    dur:"7h",    dep:"22:00",arr:"05:00",price:700, seats:35,type:"AC Sleeper",   op:"UP SRTC"},
  {from:"Delhi",    to:"Amritsar",   dur:"7h",    dep:"21:30",arr:"04:30",price:750, seats:32,type:"AC Sleeper",   op:"PRTC"},
  {from:"Delhi",    to:"Haridwar",   dur:"5h",    dep:"06:30",arr:"11:30",price:500, seats:42,type:"AC Seater",    op:"Uttarakhand Roadways"},
  {from:"Jaipur",   to:"Udaipur",    dur:"6h",    dep:"07:00",arr:"13:00",price:550, seats:40,type:"AC Seater",    op:"RSRTC"},
  {from:"Jaipur",   to:"Jodhpur",    dur:"5h",    dep:"08:00",arr:"13:00",price:480, seats:44,type:"AC Seater",    op:"RSRTC"},
  {from:"Kolkata",  to:"Bhubaneswar",dur:"6h",    dep:"21:00",arr:"03:00",price:600, seats:38,type:"AC Sleeper",   op:"OSRTC"},
  {from:"Kolkata",  to:"Patna",      dur:"9h",    dep:"20:00",arr:"05:00",price:750, seats:30,type:"AC Sleeper",   op:"BSRTC"},
  {from:"Kolkata",  to:"Guwahati",   dur:"12h",   dep:"17:00",arr:"05:00",price:900, seats:28,type:"AC Sleeper",   op:"Assam SRTC"},
];

// ─── IMPROVED AI PARSER ───────────────────────────────────────────────────────
// Handles broken English, typos, Hindi/Tamil/Telugu/Kannada mix
const CITY_ALIASES={
  // Bangalore variations
  "bangalore":"bangalore","bengaluru":"bangalore","bengalore":"bangalore","bangaluru":"bangalore",
  "blr":"bangalore","bang":"bangalore","banglore":"bangalore","bangalor":"bangalore",
  "bangaluru":"bangalore","bengalure":"bangalore","bangalure":"bangalore","banglaore":"bangalore",
  "b'lore":"bangalore","blore":"bangalore","namma ooru":"bangalore","garden city":"bangalore",
  // Mumbai variations
  "mumbai":"mumbai","bombay":"mumbai","bom":"mumbai","mum":"mumbai","mumbi":"mumbai",
  "mombai":"mumbai","bombay city":"mumbai","mumbay":"mumbai","bombai":"mumbai",
  // Delhi variations
  "delhi":"delhi","new delhi":"delhi","del":"delhi","dilli":"delhi","nai dilli":"delhi",
  "dilhi":"delhi","dili":"delhi","delhii":"delhi","ncr":"delhi","new dilli":"delhi",
  // Chennai variations
  "chennai":"chennai","madras":"chennai","maa":"chennai","chenai":"chennai","chinnai":"chennai",
  "chenni":"chennai","madras city":"chennai","chennaii":"chennai","chenna":"chennai",
  // Hyderabad variations
  "hyderabad":"hyderabad","hyd":"hyderabad","hydrabad":"hyderabad","hederabad":"hyderabad",
  "secunderabad":"hyderabad","hyderabad city":"hyderabad","hyderbad":"hyderabad","hidrabad":"hyderabad",
  "cyberabad":"hyderabad","haidrabad":"hyderabad",
  // Kolkata variations
  "kolkata":"kolkata","calcutta":"kolkata","ccu":"kolkata","kolkatta":"kolkata","calcuta":"kolkata",
  "kolkota":"kolkata","kolkata city":"kolkata","calkata":"kolkata",
  // Goa variations
  "goa":"goa","goi":"goa","north goa":"goa","south goa":"goa","panaji":"goa","panjim":"goa",
  // Pune variations
  "pune":"pune","pnq":"pune","poona":"pune","puna":"pune","punee":"pune",
  // Kochi variations
  "kochi":"kochi","cochin":"kochi","cok":"kochi","kottayam":"kochi","ernakulam":"kochi",
  // Ahmedabad variations
  "ahmedabad":"ahmedabad","amd":"ahmedabad","ahemdabad":"ahmedabad","ahmdabad":"ahmedabad",
  "ahamadabad":"ahmedabad","ahmadabad":"ahmedabad",
  // Jaipur variations
  "jaipur":"jaipur","jai":"jaipur","jaipuur":"jaipur","pink city":"jaipur","jaipor":"jaipur",
  // Lucknow
  "lucknow":"lucknow","lko":"lucknow","luckhnow":"lucknow","lakhnau":"lucknow","lakhnou":"lucknow",
  // Varanasi
  "varanasi":"varanasi","vns":"varanasi","banaras":"varanasi","benares":"varanasi","kashi":"varanasi",
  "benaras":"varanasi","banarasi":"varanasi","baranasi":"varanasi",
  // Other cities
  "patna":"patna","chandigarh":"chandigarh","ixc":"chandigarh","chd":"chandigarh",
  "guwahati":"guwahati","gauhati":"guwahati","gau":"guwahati","guwahatti":"guwahati",
  "bhubaneswar":"bhubaneswar","bbi":"bhubaneswar","bbsr":"bhubaneswar","bhubneshwar":"bhubaneswar",
  "coimbatore":"coimbatore","cbe":"coimbatore","kovai":"coimbatore","koimbatore":"coimbatore",
  "madurai":"madurai","mdu":"madurai","maduri":"madurai",
  "mangalore":"mangalore","mangaluru":"mangalore","ixe":"mangalore","mangalor":"mangalore",
  "surat":"surat","haridwar":"haridwar","jodhpur":"jodhpur","udaipur":"udaipur",
  "amritsar":"amritsar","atq":"amritsar","agra":"agra","indore":"indore","raipur":"raipur",
  // International
  "dubai":"dubai","dxb":"dubai","dubi":"dubai","dubay":"dubai",
  "singapore":"singapore","sin":"singapore","singapur":"singapore","singapoor":"singapore",
  "bangkok":"bangkok","bkk":"bangkok","bangkock":"bangkok",
  "london":"london","lhr":"london","landan":"london",
  "new york":"new york","jfk":"new york","nyc":"new york","newyork":"new york",
};

function parseQuery(text) {
  // Normalize — remove common filler words in multiple languages
  let t = text.toLowerCase()
    .replace(/[^\w\s\u0900-\u097f\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF→➡]/g," ")
    .replace(/\b(flights?|flight|buses?|bus|book|booking|mujhe|muje|chahiye|chaiye|show|me|please|kya|hai|hain|aur|ka|ke|ki|se|ko|tak|liye|ek|ticket|tickets|direct|nonstop|non stop|cheap|cheapest|sasta|sabse|best|find|get|search|lookin|looking|want|need|i want|i need|can you|bata|dikha|check)\b/gi," ")
    .replace(/\s+/g," ").trim();

  // Find cities — check multi-word first
  let found=[];
  const multiWord=Object.keys(CITY_ALIASES).filter(k=>k.includes(" ")).sort((a,b)=>b.length-a.length);
  let remaining=t;
  for(const key of multiWord){
    if(remaining.includes(key)&&found.length<2){
      found.push(CITY_ALIASES[key]);
      remaining=remaining.replace(key," ");
    }
  }
  // Then single words
  const words=remaining.split(/[\s,\-\/→➡to]+/);
  for(const word of words){
    const clean=word.replace(/[^a-z]/g,"");
    if(clean.length>=2&&CITY_ALIASES[clean]&&found.length<2&&!found.includes(CITY_ALIASES[clean])){
      found.push(CITY_ALIASES[clean]);
    }
  }

  // If still missing cities, try fuzzy match for common typos
  if(found.length<2){
    const allKeys=Object.keys(CITY_ALIASES);
    const remainWords=remaining.split(/\s+/);
    for(const w of remainWords){
      if(w.length<3)continue;
      for(const key of allKeys){
        if(key.length<3)continue;
        // Check if word starts with same 3 chars as a city alias
        if(w.length>=3&&key.length>=3&&w.slice(0,3)===key.slice(0,3)&&!found.includes(CITY_ALIASES[key])){
          found.push(CITY_ALIASES[key]);
          if(found.length===2)break;
        }
      }
      if(found.length===2)break;
    }
  }

  const now=new Date();
  let date=null;

  // Month names
  const months={jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11,
    january:0,february:1,march:2,april:3,june:5,july:6,august:7,september:8,october:9,november:10,december:11};
  for(const[mon,idx]of Object.entries(months)){
    const m=t.match(new RegExp(`(\\d{1,2})\\s*${mon}|${mon}\\s*(\\d{1,2})`));
    if(m){const day=parseInt(m[1]||m[2]);const d=new Date(now.getFullYear(),idx,day);if(d<now)d.setFullYear(d.getFullYear()+1);date=d;break;}
  }

  // Relative date words — English + Hindi + Tamil + Telugu + Kannada
  const todayWords=["today","aaj","aaj ka","indru","ee roju","indu","ippodu"];
  const tomorrowWords=["tomorrow","kal","tmrw","tommorow","tomorow","nale","repu","naale","naaley","narodu"];
  const dayAfterWords=["day after tomorrow","parso","naDiDe","aTu","marDi","maDuve"];
  const weekendWords=["this weekend","weekend","shanivar","saturday","shanivaram"];

  if(todayWords.some(w=>t.includes(w)))date=new Date(now);
  else if(dayAfterWords.some(w=>t.includes(w))){date=new Date(now);date.setDate(date.getDate()+2);}
  else if(tomorrowWords.some(w=>t.includes(w))){date=new Date(now);date.setDate(date.getDate()+1);}
  else if(weekendWords.some(w=>t.includes(w))){date=new Date(now);const diff=(6-now.getDay()+7)%7||7;date.setDate(now.getDate()+diff);}

  // Day names
  const dayMap={sun:0,sunday:0,mon:1,monday:1,tue:2,tuesday:2,wed:3,wednesday:3,thu:4,thursday:4,fri:5,friday:5,sat:6,saturday:6,
    ravivar:0,somvar:1,mangalvar:2,budhvar:3,guruvar:4,shukravar:5,shanivar:6,
    nyayiru:0,tingal:1,sevvai:2,budhan:3,viyazhan:4,velli:5,sani:6};
  for(const[day,idx]of Object.entries(dayMap)){
    if(t.includes(day)){
      const d=new Date(now);let diff=idx-now.getDay();
      if(/next|agla|agle|munde/.test(t)){if(diff<=0)diff+=7;if(diff<7)diff+=7;}
      else{if(diff<=0)diff+=7;}
      d.setDate(now.getDate()+diff);date=d;break;
    }
  }

  // "in X days"
  const inDays=t.match(/in\s*(\d+)\s*(din|days?)/);
  if(inDays){date=new Date(now);date.setDate(now.getDate()+parseInt(inDays[1]));}

  // Past date check
  if(date&&date<new Date(new Date(now).setHours(0,0,0,0))){
    return{from:found[0]||null,to:found[1]||null,date:null,pastDate:true,budget:null};
  }

  // Budget detection
  let budget=null;
  const budgetPatterns=[
    /under\s*[₹rs\.]*\s*(\d+)k?/,/below\s*[₹rs\.]*\s*(\d+)k?/,/less\s*than\s*[₹rs\.]*\s*(\d+)k?/,
    /within\s*[₹rs\.]*\s*(\d+)k?/,/max\s*[₹rs\.]*\s*(\d+)k?/,/[₹rs\.]*\s*(\d+)k?\s*(se\s*)?kam/,
    /(\d+)k?\s*tak/,/budget\s*[₹rs\.]*\s*(\d+)k?/,
  ];
  for(const p of budgetPatterns){
    const m=t.match(p);
    if(m){let v=parseInt(m[1]||m[2]);if(t.match(/\d+k/))v*=1000;budget=v;break;}
  }

  return{from:found[0]||null,to:found[1]||null,date,pastDate:false,budget};
}

// ─── CITIES ───────────────────────────────────────────────────────────────────
const CITIES=[
  {code:"BLR",name:"Bangalore",  full:"Kempegowda International",       country:"India",popular:true},
  {code:"BOM",name:"Mumbai",     full:"Chhatrapati Shivaji Intl",        country:"India",popular:true},
  {code:"DEL",name:"Delhi",      full:"Indira Gandhi International",     country:"India",popular:true},
  {code:"MAA",name:"Chennai",    full:"Chennai International",           country:"India",popular:true},
  {code:"HYD",name:"Hyderabad",  full:"Rajiv Gandhi International",      country:"India",popular:true},
  {code:"CCU",name:"Kolkata",    full:"Netaji Subhas Chandra Bose Intl", country:"India",popular:true},
  {code:"GOI",name:"Goa",        full:"Dabolim / Mopa Airport",          country:"India",popular:true},
  {code:"PNQ",name:"Pune",       full:"Pune Airport",                    country:"India",popular:true},
  {code:"COK",name:"Kochi",      full:"Cochin International",            country:"India",popular:true},
  {code:"AMD",name:"Ahmedabad",  full:"Sardar Vallabhbhai Patel Intl",   country:"India",popular:true},
  {code:"JAI",name:"Jaipur",     full:"Jaipur International",            country:"India",popular:true},
  {code:"LKO",name:"Lucknow",    full:"Chaudhary Charan Singh Intl",     country:"India",popular:false},
  {code:"VNS",name:"Varanasi",   full:"Lal Bahadur Shastri Airport",     country:"India",popular:false},
  {code:"PAT",name:"Patna",      full:"Jay Prakash Narayan Airport",     country:"India",popular:false},
  {code:"IXC",name:"Chandigarh", full:"Chandigarh Airport",              country:"India",popular:false},
  {code:"GAU",name:"Guwahati",   full:"Lokpriya Gopinath Bordoloi Intl", country:"India",popular:false},
  {code:"BBI",name:"Bhubaneswar",full:"Biju Patnaik International",      country:"India",popular:false},
  {code:"UDR",name:"Udaipur",    full:"Maharana Pratap Airport",         country:"India",popular:false},
  {code:"ATQ",name:"Amritsar",   full:"Sri Guru Ram Dass Jee Intl",      country:"India",popular:false},
  {code:"DXB",name:"Dubai",      full:"Dubai International",             country:"UAE",      popular:true},
  {code:"SIN",name:"Singapore",  full:"Changi Airport",                  country:"Singapore",popular:true},
  {code:"BKK",name:"Bangkok",    full:"Suvarnabhumi Airport",            country:"Thailand", popular:true},
  {code:"LHR",name:"London",     full:"Heathrow Airport",                country:"UK",       popular:true},
  {code:"JFK",name:"New York",   full:"JFK International",               country:"USA",      popular:true},
];
const BUS_CITIES=[...new Set([...BUS_ROUTES.map(r=>r.from),...BUS_ROUTES.map(r=>r.to)])].sort();
const CLASSES=["Economy","Premium Economy","Business","First Class"];
const BUS_TYPES=["Any","AC Sleeper","Semi-Sleeper","AC Seater"];

function fmtTime(dt){if(!dt)return"--:--";return new Date(dt).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:false});}
function fmtDate(dt){if(!dt)return"";return new Date(dt).toLocaleDateString("en-IN",{day:"numeric",month:"short"});}
function calcDur(dep,arr){if(!dep||!arr)return"";const d=(new Date(arr)-new Date(dep))/60000;return`${Math.floor(d/60)}h${d%60>0?" "+d%60+"m":""}`.trim();}

// ─── CITY MODAL ───────────────────────────────────────────────────────────────
function CityModal({title,onSelect,onClose,exclude}){
  const[s,setS]=useState("");
  const shown=CITIES.filter(c=>c.code!==exclude&&(c.name.toLowerCase().includes(s.toLowerCase())||c.code.toLowerCase().includes(s.toLowerCase())||c.country.toLowerCase().includes(s.toLowerCase())));
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)",padding:20}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:480,background:"rgba(250,248,244,0.98)",borderRadius:22,padding:28,boxShadow:"0 24px 80px rgba(0,0,0,0.15)",border:"1px solid rgba(201,168,76,0.2)",maxHeight:"80vh",display:"flex",flexDirection:"column"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:20,color:"#1a1410",marginBottom:14}}>{title}</div>
        <input autoFocus value={s} onChange={e=>setS(e.target.value)} placeholder="Search city or code…"
          style={{width:"100%",padding:"11px 16px",borderRadius:12,fontSize:14,fontFamily:"'DM Sans',sans-serif",border:`1.5px solid rgba(201,168,76,0.3)`,outline:"none",marginBottom:12,color:"#1a1410",background:"#fafaf8"}}
          onFocus={e=>{e.target.style.borderColor=GOLD;e.target.style.boxShadow=`0 0 0 3px rgba(201,168,76,0.1)`;}}
          onBlur={e=>{e.target.style.borderColor="rgba(201,168,76,0.3)";e.target.style.boxShadow="none";}}/>
        {!s&&<div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:"#bbb",letterSpacing:"0.15em",marginBottom:8}}>POPULAR</div>}
        <div style={{display:"flex",flexDirection:"column",gap:5,overflowY:"auto",flex:1}}>
          {shown.map(city=>(
            <div key={city.code} onClick={()=>onSelect(city)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",borderRadius:11,cursor:"pointer",background:"rgba(255,255,255,0.6)",border:"1px solid rgba(201,168,76,0.08)",transition:"all 0.15s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(201,168,76,0.08)";e.currentTarget.style.borderColor="rgba(201,168,76,0.25)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.6)";e.currentTarget.style.borderColor="rgba(201,168,76,0.08)";}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:14,color:"#1a1410"}}>{city.name}</span>
                  {city.popular&&<span style={{fontSize:8,background:"rgba(201,168,76,0.12)",color:GOLD_DARK,padding:"2px 6px",borderRadius:6,fontFamily:"'Space Mono',monospace"}}>TOP</span>}
                </div>
                <div style={{fontSize:11,color:"#aaa",marginTop:1}}>{city.full} · {city.country}</div>
              </div>
              <div style={{fontFamily:"'Space Mono',monospace",fontWeight:700,fontSize:14,color:GOLD_DARK}}>{city.code}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BusCityModal({title,onSelect,onClose,exclude}){
  const[s,setS]=useState("");
  const shown=BUS_CITIES.filter(c=>c.toLowerCase().includes(s.toLowerCase())&&c!==exclude);
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)",padding:20}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:440,background:"rgba(250,248,244,0.98)",borderRadius:22,padding:28,boxShadow:"0 24px 80px rgba(0,0,0,0.15)",border:"1px solid rgba(201,168,76,0.2)",maxHeight:"75vh",display:"flex",flexDirection:"column"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:20,color:"#1a1410",marginBottom:14}}>{title}</div>
        <input autoFocus value={s} onChange={e=>setS(e.target.value)} placeholder="Search city…"
          style={{width:"100%",padding:"11px 16px",borderRadius:12,fontSize:14,fontFamily:"'DM Sans',sans-serif",border:`1.5px solid rgba(201,168,76,0.3)`,outline:"none",marginBottom:12,color:"#1a1410",background:"#fafaf8"}}
          onFocus={e=>e.target.style.borderColor=GOLD} onBlur={e=>e.target.style.borderColor="rgba(201,168,76,0.3)"}/>
        <div style={{display:"flex",flexDirection:"column",gap:5,overflowY:"auto",flex:1}}>
          {shown.map(city=>(
            <div key={city} onClick={()=>onSelect(city)} style={{padding:"13px 16px",borderRadius:11,cursor:"pointer",background:"rgba(255,255,255,0.6)",border:"1px solid rgba(201,168,76,0.08)",fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:600,color:"#1a1410",transition:"all 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(201,168,76,0.08)"}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.6)"}>
              🚌 {city}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SEAT MODAL ───────────────────────────────────────────────────────────────
function SeatModal({type,passengers,onConfirm,onCancel}){
  const isBus=type==="bus";
  const COLS=isBus?["A","B","C","D"]:["A","B","C","D","E","F"];
  const ROWS=Array.from({length:isBus?11:20},(_,i)=>i+1);
  const[taken]=useState(()=>{const t=new Set();for(let i=0;i<(isBus?8:18);i++)t.add(`${Math.ceil(Math.random()*(isBus?11:20))}${COLS[Math.floor(Math.random()*COLS.length)]}`);return t;});
  const[sel,setSel]=useState([]);
  const toggle=s=>{if(taken.has(s))return;setSel(p=>p.includes(s)?p.filter(x=>x!==s):p.length<passengers?[...p,s]:p);};
  const clr=s=>{if(taken.has(s))return"#e5e7eb";if(sel.includes(s))return GOLD;return"rgba(201,168,76,0.08)";};
  return(
    <div onClick={onCancel} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:700,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(10px)",padding:20}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:480,background:"#faf8f4",borderRadius:24,boxShadow:"0 32px 100px rgba(0,0,0,0.18)",border:"1px solid rgba(201,168,76,0.2)",maxHeight:"90vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{background:GRAD,backgroundSize:"200% 200%",animation:"gradShift 4s ease infinite",padding:"18px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,color:"#1a1410",fontSize:17}}>{isBus?"Select Bus Seats":"Select Seats"}</div>
            <div style={{fontSize:12,color:"rgba(26,20,16,0.7)",marginTop:3}}>Pick {passengers} seat{passengers>1?"s":""}</div>
          </div>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:13,color:"#1a1410"}}>{sel.length}/{passengers}</div>
        </div>
        <div style={{overflowY:"auto",padding:"16px 20px 12px"}}>
          <div style={{textAlign:"center",marginBottom:8,fontSize:isBus?28:20}}>{isBus?"🚌":"✈️"}</div>
          <div style={{display:"grid",gridTemplateColumns:`26px repeat(${COLS.length},1fr)`,gap:4,marginBottom:8}}>
            <div/>{COLS.map(c=><div key={c} style={{textAlign:"center",fontFamily:"'Space Mono',monospace",fontSize:10,color:"#bbb"}}>{c}</div>)}
          </div>
          {ROWS.map(row=>(
            <div key={row} style={{display:"grid",gridTemplateColumns:`26px repeat(${COLS.length},1fr)`,gap:4,marginBottom:4,alignItems:"center"}}>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:"#ccc",textAlign:"right",paddingRight:3}}>{row}</div>
              {COLS.map(col=>{const s=`${row}${col}`;return(
                <div key={s} onClick={()=>toggle(s)} style={{height:28,borderRadius:6,background:clr(s),border:`1px solid ${taken.has(s)?"#d1d5db":sel.includes(s)?"rgba(201,168,76,0.6)":"rgba(201,168,76,0.15)"}`,cursor:taken.has(s)?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontFamily:"'Space Mono',monospace",color:sel.includes(s)?"#1a1410":"#aaa",fontWeight:700,transition:"all 0.1s"}}>
                  {taken.has(s)?"×":sel.includes(s)?s:""}
                </div>
              );})}
            </div>
          ))}
        </div>
        <div style={{padding:"14px 22px",borderTop:"1px solid rgba(201,168,76,0.1)",display:"flex",gap:10,alignItems:"center"}}>
          <div style={{flex:1,fontFamily:"'DM Sans',sans-serif",fontSize:13,color:sel.length>0?"#1a1410":"#bbb"}}>{sel.length>0?`Selected: ${sel.join(", ")}`:"No seats selected"}</div>
          <button onClick={onCancel} style={{padding:"9px 16px",borderRadius:10,fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif",background:"transparent",color:"#aaa",border:"1.5px solid rgba(0,0,0,0.1)",cursor:"pointer"}}>Back</button>
          <button onClick={()=>sel.length===passengers&&onConfirm(sel)} disabled={sel.length!==passengers}
            style={{padding:"9px 20px",borderRadius:10,fontSize:13,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.06em",color:"#1a1410",border:"none",cursor:"pointer",background:sel.length===passengers?GRAD:"#e5e0d8",backgroundSize:"200% 200%",animation:sel.length===passengers?"gradShift 3s ease infinite":"none",boxShadow:sel.length===passengers?`0 4px 14px rgba(201,168,76,0.44)`:"none"}}>
            Confirm →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PASSENGER MODAL — fixed: allows single name, example John Cena ───────────
function PassengerModal({item,passengers,type,onConfirm,onCancel}){
  const[name,setName]=useState("");const[err,setErr]=useState("");
  const go=()=>{
    if(!name.trim()||name.trim().length<2){setErr("Please enter your name");return;}
    // Allow single names — just require at least 2 characters
    onConfirm(name.trim());
  };
  const isBus=type==="bus";
  return(
    <div onClick={onCancel} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)",padding:20}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:420,background:"rgba(250,248,244,0.98)",borderRadius:24,padding:"40px 36px",boxShadow:"0 24px 80px rgba(0,0,0,0.15)",border:"1px solid rgba(201,168,76,0.2)"}}>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:24,color:"#1a1410",marginBottom:8}}>Passenger Details</h2>
        <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#888",marginBottom:24}}>
          {isBus?`${item.op} · ${item.from} → ${item.to} · ${item.type}`:`${item.airline} · ${item.from_city} → ${item.to_city}`} · {passengers} pax
        </p>
        <label style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:"#aaa",display:"block",marginBottom:7,letterSpacing:"0.1em"}}>FULL NAME (as on ID)</label>
        <input autoFocus value={name} onChange={e=>{setName(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&go()}
          placeholder="e.g. John Cena"
          style={{width:"100%",padding:"13px 16px",borderRadius:13,fontSize:15,fontFamily:"'DM Sans',sans-serif",border:`1.5px solid ${err?"#ef4444":"rgba(201,168,76,0.3)"}`,outline:"none",color:"#1a1410",background:"#fafaf8",marginBottom:err?8:24}}
          onFocus={e=>e.target.style.borderColor=GOLD} onBlur={e=>e.target.style.borderColor=err?"#ef4444":"rgba(201,168,76,0.3)"}/>
        {err&&<div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#ef4444",marginBottom:16}}>{err}</div>}
        <div style={{display:"flex",gap:12}}>
          <button onClick={onCancel} style={{padding:"13px 22px",borderRadius:13,fontSize:14,fontWeight:600,fontFamily:"'DM Sans',sans-serif",background:"transparent",color:"#aaa",border:"1.5px solid rgba(0,0,0,0.1)",cursor:"pointer"}}>Cancel</button>
          <button onClick={go} style={{flex:1,padding:"13px",borderRadius:13,fontSize:14,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.06em",color:"#1a1410",border:"none",cursor:"pointer",background:GRAD,backgroundSize:"200% 200%",animation:"gradShift 3s ease infinite",boxShadow:`0 6px 22px rgba(201,168,76,0.44)`}}>Select Seats →</button>
        </div>
      </div>
    </div>
  );
}

// ─── PAYMENT MODAL ────────────────────────────────────────────────────────────
function PaymentModal({item,passengerName,passengers,cabinClass,seats,type,onSuccess,onCancel,token}){
  const[step,setStep]=useState("payment");const[payMethod,setPayMethod]=useState("card");
  const[cardNo,setCardNo]=useState("");const[expiry,setExpiry]=useState("");const[cvv,setCvv]=useState("");
  const[promoCode,setPromoCode]=useState("");const[promoMsg,setPromoMsg]=useState({type:"",text:""});
  const[discount,setDiscount]=useState(0);const[promoChecking,setPromoChecking]=useState(false);
  const[bookingId]=useState("ALV"+Date.now().toString(36).toUpperCase().slice(-6));
  const base=item.price*passengers;const total=Math.max(0,base-discount);
  const fmtCard=v=>v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const fmtExp=v=>{const d=v.replace(/\D/g,"").slice(0,4);return d.length>=3?d.slice(0,2)+"/"+d.slice(2):d;};
  const isBus=type==="bus";

  const applyPromo=async()=>{
    if(!promoCode.trim())return;setPromoChecking(true);setPromoMsg({type:"",text:""});
    try{const res=await fetch(`${API}/promo/validate`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify({code:promoCode,bookingAmount:base,travelType:type})});const data=await res.json();if(!res.ok){setPromoMsg({type:"error",text:data.message});setDiscount(0);}else{setDiscount(data.discount);setPromoMsg({type:"success",text:`Applied! ₹${data.discount} off`});}}
    catch{setPromoMsg({type:"error",text:"Could not validate"});}
    setPromoChecking(false);
  };

  const handlePay=async()=>{
    if(payMethod==="card"&&(!cardNo||!expiry||!cvv)){alert("Fill all card details");return;}
    setStep("processing");
    try{
      if(!isBus){
        const res=await fetch(`${API}/book`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify({flight_id:item.id,passenger_name:passengerName,cabin_class:cabinClass,seats,promo_code:promoCode||null,discount_applied:discount,final_price:total})});
        if(!res.ok){const d=await res.json();console.error("Booking error:",d.message);}
      }
    }catch(e){console.error(e);}
    setTimeout(()=>setStep("success"),1800);
  };

  const ov={position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:600,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(10px)",padding:20};
  const crd={width:"100%",maxWidth:460,background:"rgba(250,248,244,0.98)",borderRadius:24,overflow:"hidden",boxShadow:"0 32px 100px rgba(0,0,0,0.15)",border:"1px solid rgba(201,168,76,0.2)",maxHeight:"92vh",overflowY:"auto"};
  const hdr={background:GRAD,backgroundSize:"200% 200%",animation:"gradShift 4s ease infinite",padding:"18px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"};

  if(step==="processing")return(<div style={ov}><div style={crd}><div style={hdr}><div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,color:"#1a1410",fontSize:17}}>Alvryn Pay</div><div style={{fontSize:12,color:"rgba(26,20,16,0.7)"}}>Secure</div></div><div style={{padding:"60px 24px",textAlign:"center"}}><div style={{width:52,height:52,border:`3px solid rgba(201,168,76,0.2)`,borderTopColor:GOLD,borderRadius:"50%",animation:"spinSlow 1s linear infinite",margin:"0 auto 20px"}}/><div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,color:GOLD_DARK,fontSize:16,letterSpacing:"0.1em"}}>Processing…</div></div></div></div>);

  if(step==="success")return(<div style={ov}><div style={crd}><div style={hdr}><div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,color:"#1a1410",fontSize:17}}>Alvryn Pay</div></div><div style={{padding:"40px 28px",textAlign:"center"}}><div style={{fontSize:56,marginBottom:16}}>🎉</div><h3 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:26,color:"#1a1410",marginBottom:10}}>Booking Confirmed!</h3><div style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#777",lineHeight:1.7,marginBottom:20}}>{isBus?`${item.op} · ${item.from} → ${item.to}`:`${item.airline} · ${item.from_city} → ${item.to_city}`}<br/>Passenger: {passengerName}{seats&&seats.length>0&&<><br/><span style={{color:GOLD}}>Seats: {seats.join(", ")}</span></>}</div><div style={{background:"rgba(201,168,76,0.08)",borderRadius:14,padding:"14px",marginBottom:16,border:`1px solid rgba(201,168,76,0.25)`}}><div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:"#aaa",marginBottom:4,letterSpacing:"0.12em"}}>BOOKING ID</div><div style={{fontFamily:"'Space Mono',monospace",fontWeight:700,fontSize:20,color:GOLD_DARK,letterSpacing:"0.15em"}}>{bookingId}</div></div><div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#aaa",marginBottom:20}}>Ticket sent to your email 📧</div><button onClick={()=>onSuccess(bookingId)} style={{width:"100%",padding:"14px",borderRadius:13,fontSize:15,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.08em",color:"#1a1410",background:GRAD,backgroundSize:"200% 200%",animation:"gradShift 3s ease infinite",border:"none",cursor:"pointer",boxShadow:`0 6px 24px rgba(201,168,76,0.44)`}}>View My Bookings</button></div></div></div>);

  return(
    <div style={ov} onClick={onCancel}><div style={crd} onClick={e=>e.stopPropagation()}>
      <div style={hdr}><div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,color:"#1a1410",fontSize:17}}>Alvryn Pay</div><div style={{fontSize:12,color:"rgba(26,20,16,0.7)"}}>256-bit SSL</div></div>
      <div style={{padding:"24px"}}>
        <div style={{textAlign:"center",padding:"14px",borderRadius:14,background:"rgba(201,168,76,0.06)",border:"1px solid rgba(201,168,76,0.15)",marginBottom:20}}>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:"#aaa",marginBottom:4,letterSpacing:"0.12em"}}>TOTAL</div>
          {discount>0&&<div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#aaa",textDecoration:"line-through"}}>₹{base.toLocaleString()}</div>}
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:32,color:GOLD_DARK}}>₹{total.toLocaleString()}</div>
          <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#aaa",marginTop:3}}>{passengers} pax{seats&&seats.length>0?` · Seats: ${seats.join(", ")}`:""}</div>
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:"#aaa",marginBottom:7,letterSpacing:"0.08em"}}>PROMO CODE</div>
          <div style={{display:"flex",gap:8}}>
            <input value={promoCode} onChange={e=>{setPromoCode(e.target.value.toUpperCase());setPromoMsg({type:"",text:""});setDiscount(0);}} placeholder="e.g. ALVRYN100"
              style={{flex:1,padding:"11px 14px",borderRadius:11,fontSize:14,fontFamily:"'DM Sans',sans-serif",border:"1.5px solid rgba(201,168,76,0.25)",outline:"none",color:"#1a1410",background:"#fafaf8"}}
              onFocus={e=>e.target.style.borderColor=GOLD} onBlur={e=>e.target.style.borderColor="rgba(201,168,76,0.25)"}/>
            <button onClick={applyPromo} disabled={promoChecking} style={{padding:"11px 18px",borderRadius:11,fontSize:13,fontWeight:700,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",color:GOLD_DARK,border:`1.5px solid rgba(201,168,76,0.3)`,background:`rgba(201,168,76,0.08)`}}>{promoChecking?"…":"Apply"}</button>
          </div>
          {promoMsg.text&&<div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:promoMsg.type==="success"?"#16a34a":"#ef4444",marginTop:6}}>{promoMsg.text}</div>}
        </div>
        <div style={{display:"flex",gap:7,marginBottom:16}}>
          {[["card","Card"],["upi","UPI"],["netbanking","Net Banking"]].map(([id,label])=>(
            <button key={id} onClick={()=>setPayMethod(id)} style={{flex:1,padding:"9px 4px",borderRadius:10,fontSize:12,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",border:payMethod===id?`1.5px solid ${GOLD}`:"1.5px solid rgba(0,0,0,0.1)",background:payMethod===id?`rgba(201,168,76,0.1)`:"#fafaf8",color:payMethod===id?GOLD_DARK:"#999"}}>{label}</button>
          ))}
        </div>
        {payMethod==="card"&&<><div style={{marginBottom:12}}><label style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:600,color:"#aaa",display:"block",marginBottom:6,letterSpacing:"0.1em"}}>CARD NUMBER</label><input value={cardNo} onChange={e=>setCardNo(fmtCard(e.target.value))} placeholder="4111 1111 1111 1111" maxLength={19} style={{width:"100%",padding:"12px 14px",borderRadius:11,fontSize:15,fontFamily:"'DM Sans',sans-serif",border:"1.5px solid rgba(201,168,76,0.2)",outline:"none",color:"#1a1410",background:"#fafaf8"}}/></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}><div><label style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:600,color:"#aaa",display:"block",marginBottom:6}}>EXPIRY</label><input value={expiry} onChange={e=>setExpiry(fmtExp(e.target.value))} placeholder="MM/YY" maxLength={5} style={{width:"100%",padding:"12px 14px",borderRadius:11,fontSize:15,fontFamily:"'DM Sans',sans-serif",border:"1.5px solid rgba(201,168,76,0.2)",outline:"none",color:"#1a1410",background:"#fafaf8"}}/></div><div><label style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:600,color:"#aaa",display:"block",marginBottom:6}}>CVV</label><input type="password" value={cvv} onChange={e=>setCvv(e.target.value.slice(0,3))} placeholder="···" maxLength={3} style={{width:"100%",padding:"12px 14px",borderRadius:11,fontSize:15,fontFamily:"'DM Sans',sans-serif",border:"1.5px solid rgba(201,168,76,0.2)",outline:"none",color:"#1a1410",background:"#fafaf8"}}/></div></div></>}
        {payMethod==="upi"&&<div style={{marginBottom:12}}><label style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:600,color:"#aaa",display:"block",marginBottom:6}}>UPI ID</label><input placeholder="yourname@upi" style={{width:"100%",padding:"12px 14px",borderRadius:11,fontSize:15,fontFamily:"'DM Sans',sans-serif",border:"1.5px solid rgba(201,168,76,0.2)",outline:"none",color:"#1a1410",background:"#fafaf8"}}/></div>}
        {payMethod==="netbanking"&&<div style={{marginBottom:12}}><label style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:600,color:"#aaa",display:"block",marginBottom:6}}>SELECT BANK</label><select style={{width:"100%",padding:"12px 14px",borderRadius:11,fontSize:15,fontFamily:"'DM Sans',sans-serif",border:"1.5px solid rgba(201,168,76,0.2)",outline:"none",color:"#1a1410",background:"#fafaf8",cursor:"pointer"}}>{["SBI","HDFC Bank","ICICI Bank","Axis Bank","Kotak Bank"].map(b=><option key={b}>{b}</option>)}</select></div>}
        <button onClick={handlePay} style={{width:"100%",padding:"14px",borderRadius:13,fontSize:16,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.08em",color:"#1a1410",border:"none",cursor:"pointer",background:GRAD,backgroundSize:"200% 200%",animation:"gradShift 3s ease infinite",boxShadow:`0 8px 28px rgba(201,168,76,0.44)`,marginTop:4}}>Pay ₹{total.toLocaleString()} →</button>
        <div style={{textAlign:"center",fontSize:11,color:"#ccc",marginTop:10,fontFamily:"'DM Sans',sans-serif"}}>Demo payment — no real money charged</div>
      </div>
    </div></div>
  );
}

// ═══════════════════════════════════════════════════════
//  SEARCH PAGE
// ═══════════════════════════════════════════════════════
function SearchPage(){
  const navigate=useNavigate();
  const[travelType,setTravelType]=useState("flight");
  const[tripType,setTripType]=useState("oneway");
  const[fromCity,setFromCity]=useState(CITIES[0]);
  const[toCity,setToCity]=useState(CITIES[1]);
  const[busFrom,setBusFrom]=useState("Bangalore");
  const[busTo,setBusTo]=useState("Chennai");
  const[date,setDate]=useState("");
  const[returnDate,setReturnDate]=useState("");
  const[passengers,setPassengers]=useState(1);
  const[cabinClass,setCabinClass]=useState("Economy");
  const[busType,setBusType]=useState("Any");
  const[showFromModal,setShowFromModal]=useState(false);
  const[showToModal,setShowToModal]=useState(false);
  const[showBusFromModal,setShowBusFromModal]=useState(false);
  const[showBusToModal,setShowBusToModal]=useState(false);
  const[mode,setMode]=useState("structured");
  const[aiQuery,setAiQuery]=useState("");
  const[flights,setFlights]=useState([]);
  const[buses,setBuses]=useState([]);
  const[filtered,setFiltered]=useState([]);
  const[loading,setLoading]=useState(false);
  const[searched,setSearched]=useState(false);
  const[aiError,setAiError]=useState("");
  const[validErr,setValidErr]=useState("");
  const[bookingItem,setBookingItem]=useState(null);
  const[passengerName,setPassengerName]=useState("");
  const[showSeats,setShowSeats]=useState(false);
  const[selectedSeats,setSelectedSeats]=useState([]);
  const[showPayment,setShowPayment]=useState(false);
  const[filterTime,setFilterTime]=useState("any");
  const[filterMaxPrice,setFilterMaxPrice]=useState(20000);
  const[sortBy,setSortBy]=useState("price");
  const[navScrolled,setNavScrolled]=useState(false);
  const[specialFare,setSpecialFare]=useState("regular");

  const today=new Date().toISOString().split("T")[0];
  let user={};try{user=JSON.parse(localStorage.getItem("user")||"{}");}catch{}
  const token=localStorage.getItem("token");

  useEffect(()=>{if(!token)navigate("/login");},[token,navigate]);
  useEffect(()=>{fetch(`${API}/test`).catch(()=>{});const t=setInterval(()=>fetch(`${API}/test`).catch(()=>{}),14*60*1000);return()=>clearInterval(t);},[]);
  useEffect(()=>{const fn=()=>setNavScrolled(window.scrollY>30);window.addEventListener("scroll",fn,{passive:true});return()=>window.removeEventListener("scroll",fn);},[]);

  useEffect(()=>{
    const items=travelType==="bus"?buses:flights;let r=[...items];
    if(travelType==="flight"){
      if(filterTime==="morning")r=r.filter(f=>{const h=new Date(f.departure_time).getHours();return h>=5&&h<12;});
      if(filterTime==="afternoon")r=r.filter(f=>{const h=new Date(f.departure_time).getHours();return h>=12&&h<17;});
      if(filterTime==="evening")r=r.filter(f=>{const h=new Date(f.departure_time).getHours();return h>=17;});
    }
    r=r.filter(f=>f.price<=filterMaxPrice);
    if(sortBy==="price")r.sort((a,b)=>a.price-b.price);
    if(sortBy==="price-desc")r.sort((a,b)=>b.price-a.price);
    if(sortBy==="departure"&&travelType==="flight")r.sort((a,b)=>new Date(a.departure_time)-new Date(b.departure_time));
    setFiltered(r);
  },[flights,buses,filterTime,filterMaxPrice,sortBy,travelType]);

  const swapFlight=useCallback(()=>{setFromCity(toCity);setToCity(fromCity);},[fromCity,toCity]);
  const swapBus=useCallback(()=>{setBusFrom(busTo);setBusTo(busFrom);},[busFrom,busTo]);

  const searchFlights=async()=>{
    setValidErr("");if(!date){setValidErr("Please select a departure date");return;}
    setLoading(true);setSearched(true);setFlights([]);
    try{
      const params=new URLSearchParams({from:fromCity.name,to:toCity.name});
      params.append("date",date);
      const res=await axios.get(`${API}/flights?${params}`);
      setFlights(res.data||[]);
      setFilterMaxPrice(res.data&&res.data.length>0?Math.max(...res.data.map(f=>f.price))+1000:20000);
    }catch(e){console.error(e);setFlights([]);}
    setLoading(false);
  };

  const searchBuses=()=>{
    setValidErr("");if(!date){setValidErr("Please select a travel date");return;}
    setLoading(true);setSearched(true);setBuses([]);
    setTimeout(()=>{
      let results=BUS_ROUTES.filter(b=>b.from.toLowerCase()===busFrom.toLowerCase()&&b.to.toLowerCase()===busTo.toLowerCase());
      if(busType!=="Any")results=results.filter(b=>b.type===busType);
      setBuses(results);
      setFilterMaxPrice(results.length>0?Math.max(...results.map(b=>b.price))+500:5000);
      setLoading(false);
    },700);
  };

  const searchAI=async()=>{
    if(!aiQuery.trim())return;
    setAiError("");setLoading(true);setSearched(true);setFlights([]);setBuses([]);
    const parsed=parseQuery(aiQuery);

    if(parsed.pastDate){
      setAiError("That date is in the past! Please search for today or a future date.");
      setLoading(false);return;
    }
    if(!parsed.from||!parsed.to){
      setAiError("Couldn't find the cities. Try: 'flights bangalore to mumbai tomorrow' or 'blr to del kal'");
      setLoading(false);return;
    }

    const isBusQ=/bus|buses|coach|volvo|sleeper|seater/i.test(aiQuery);
    if(isBusQ||travelType==="bus"){
      setTravelType("bus");
      let results=BUS_ROUTES.filter(b=>b.from.toLowerCase()===parsed.from&&b.to.toLowerCase()===parsed.to);
      if(parsed.budget)results=results.filter(b=>b.price<=parsed.budget);
      if(/cheap|sasta|budget|lowest/i.test(aiQuery))results.sort((a,b)=>a.price-b.price);
      setBuses(results);
      setFilterMaxPrice(results.length>0?Math.max(...results.map(b=>b.price))+500:5000);
      if(results.length===0)setAiError(`No buses found from ${parsed.from} to ${parsed.to}. Try different cities.`);
      setLoading(false);
    }else{
      setTravelType("flight");
      try{
        const res=await axios.post(`${API}/ai-search`,{query:aiQuery});
        if(res.data&&res.data.message){
          setAiError(res.data.message);setFlights([]);
        }else{
          const data=res.data||[];
          // Apply budget filter if detected
          const filtered2=parsed.budget?data.filter(f=>f.price<=parsed.budget):data;
          setFlights(filtered2);
          setFilterMaxPrice(filtered2.length>0?Math.max(...filtered2.map(f=>f.price))+1000:20000);
          if(filtered2.length===0&&data.length>0){
            setAiError(`No flights under ₹${parsed.budget?.toLocaleString()} found. Showing all available flights.`);
            setFlights(data);
          }
        }
      }catch(e){
        setAiError(e.response?.data?.message||"Search failed. Please try again.");
        setFlights([]);
      }
      setLoading(false);
    }
  };

  const handleBookClick=item=>{if(!token){navigate("/login");return;}setBookingItem(item);setShowSeats(false);setShowPayment(false);setSelectedSeats([]);};
  const handlePassengerConfirm=name=>{setPassengerName(name);setShowSeats(true);};
  const isDomestic=fromCity.country==="India"&&toCity.country==="India";

  const TRAVEL_TABS=[
    {id:"flight",icon:"✈️",label:"Flights"},
    {id:"bus",   icon:"🚌",label:"Buses"},
    {id:"train", icon:"🚂",label:"Trains",  cs:true},
    {id:"hotel", icon:"🏨",label:"Hotels",  cs:true},
    {id:"cab",   icon:"🚗",label:"Cabs",    cs:true},
  ];
  const CS_DATA={
    train:{icon:"🚂",title:"Train Booking",desc:"IRCTC integration coming soon."},
    hotel:{icon:"🏨",title:"Hotel Booking",desc:"Hotels across India and abroad — coming soon."},
    cab:  {icon:"🚗",title:"Cab Booking",  desc:"Airport transfers and intercity cabs — coming soon."},
  };
  const SPECIAL_FARES=[{id:"regular",label:"Regular"},{id:"student",label:"Student"},{id:"senior",label:"Senior Citizen"},{id:"armed",label:"Armed Forces"},{id:"doctor",label:"Doctor / Nurse"}];

  const lbl={fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:600,color:"#aaa",display:"block",marginBottom:6,letterSpacing:"0.1em"};
  const inp={background:"#fafaf8",borderRadius:12,padding:"12px 14px",border:"1.5px solid rgba(201,168,76,0.15)",transition:"border-color 0.2s"};

  return(
    <div style={{minHeight:"100vh",background:"#faf8f4",position:"relative",overflowX:"hidden",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{SHARED_CSS}</style>
      <AuroraBackground/>

      {/* Modals */}
      {showFromModal&&<CityModal title="Select departure city" onSelect={c=>{setFromCity(c);setShowFromModal(false);}} onClose={()=>setShowFromModal(false)} exclude={toCity.code}/>}
      {showToModal&&<CityModal title="Select destination city" onSelect={c=>{setToCity(c);setShowToModal(false);}} onClose={()=>setShowToModal(false)} exclude={fromCity.code}/>}
      {showBusFromModal&&<BusCityModal title="Bus departure city" onSelect={c=>{setBusFrom(c);setShowBusFromModal(false);}} onClose={()=>setShowBusFromModal(false)} exclude={busTo}/>}
      {showBusToModal&&<BusCityModal title="Bus destination city" onSelect={c=>{setBusTo(c);setShowBusToModal(false);}} onClose={()=>setShowBusToModal(false)} exclude={busFrom}/>}
      {bookingItem&&!showSeats&&!showPayment&&<PassengerModal item={bookingItem} passengers={passengers} type={travelType} onConfirm={handlePassengerConfirm} onCancel={()=>setBookingItem(null)}/>}
      {bookingItem&&showSeats&&!showPayment&&<SeatModal type={travelType} passengers={passengers} onConfirm={s=>{setSelectedSeats(s);setShowSeats(false);setShowPayment(true);}} onCancel={()=>{setShowSeats(false);setBookingItem(null);}}/>}
      {bookingItem&&showPayment&&<PaymentModal item={bookingItem} passengerName={passengerName} passengers={passengers} cabinClass={cabinClass} seats={selectedSeats} type={travelType} token={token} onSuccess={()=>{setShowPayment(false);setBookingItem(null);navigate("/bookings");}} onCancel={()=>{setShowPayment(false);setBookingItem(null);}}/>}

      {/* NAV */}
      <nav style={{position:"sticky",top:0,zIndex:200,height:66,padding:"0 5%",display:"flex",alignItems:"center",justifyContent:"space-between",background:navScrolled?"rgba(250,248,244,0.93)":"rgba(250,248,244,0.75)",backdropFilter:"blur(22px)",borderBottom:"1px solid rgba(201,168,76,0.1)",transition:"all 0.3s"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>navigate("/")}>
          <div style={{animation:"floatUD 4s ease-in-out infinite"}}><AlvrynIcon size={38}/></div>
          <div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:16,color:"#1a1410",letterSpacing:"0.12em",lineHeight:1.1}}>ALVRYN</div>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:7,color:GOLD,letterSpacing:"0.18em"}}>TRAVEL BEYOND</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {/* ── FIXED: "My Bookings" ── */}
          <button onClick={()=>navigate("/bookings")} style={{padding:"8px 16px",borderRadius:10,fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",background:"transparent",color:"#555",border:"1.5px solid rgba(0,0,0,0.12)"}}>My Bookings</button>
          <button onClick={()=>navigate("/profile")} style={{padding:"8px 16px",borderRadius:10,fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",background:`rgba(201,168,76,0.1)`,color:GOLD_DARK,border:`1.5px solid rgba(201,168,76,0.25)`}}>Profile</button>
          <button onClick={()=>{localStorage.removeItem("token");localStorage.removeItem("user");navigate("/login");}} style={{padding:"8px 16px",borderRadius:10,fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",background:"#fff0f0",color:"#e53935",border:"1.5px solid rgba(229,57,53,0.2)"}}>Sign Out</button>
        </div>
      </nav>

      <div style={{position:"relative",zIndex:1,maxWidth:960,margin:"0 auto",padding:"32px 5% 80px"}}>
        <div style={{marginBottom:24,animation:"fadeUp 0.6s both"}}>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:GOLD,letterSpacing:"0.2em",marginBottom:8}}>SEARCH TRAVEL</div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"clamp(22px,4vw,42px)",color:"#1a1410",marginBottom:4}}>Hey {user.name?.split(" ")[0]||"Traveller"} 👋</h1>
          <p style={{fontSize:15,color:"#888"}}>Where do you want to fly or ride today?</p>
        </div>

        {/* Travel type tabs */}
        <div style={{display:"flex",gap:0,background:"rgba(255,255,255,0.85)",backdropFilter:"blur(10px)",borderRadius:"16px 16px 0 0",border:"1px solid rgba(201,168,76,0.15)",borderBottom:"none",overflowX:"auto"}}>
          {TRAVEL_TABS.map((tab,i)=>(
            <button key={tab.id} onClick={()=>{setTravelType(tab.id);setFlights([]);setBuses([]);setSearched(false);setValidErr("");setAiError("");}}
              style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"14px 18px",cursor:"pointer",border:"none",borderBottom:travelType===tab.id?`2.5px solid ${GOLD}`:"2.5px solid transparent",background:"transparent",color:travelType===tab.id?GOLD_DARK:"#aaa",fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,transition:"all 0.2s",whiteSpace:"nowrap",borderRadius:i===0?"16px 0 0 0":i===TRAVEL_TABS.length-1?"0 16px 0 0":"0"}}>
              <span style={{fontSize:20}}>{tab.icon}</span>{tab.label}
              {tab.cs&&<span style={{fontSize:7,background:"rgba(201,168,76,0.12)",border:"1px solid rgba(201,168,76,0.3)",color:GOLD_DARK,padding:"1px 4px",borderRadius:5,letterSpacing:"0.3px"}}>SOON</span>}
            </button>
          ))}
        </div>

        {/* Coming soon */}
        {CS_DATA[travelType]&&(
          <div style={{background:"rgba(255,255,255,0.85)",backdropFilter:"blur(10px)",borderRadius:"0 0 20px 20px",padding:"52px 32px",textAlign:"center",boxShadow:"0 4px 20px rgba(0,0,0,0.04)",border:"1px solid rgba(201,168,76,0.12)",borderTop:"none",animation:"fadeUp 0.4s both"}}>
            <div style={{fontSize:56,marginBottom:18}}>{CS_DATA[travelType].icon}</div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:24,color:"#1a1410",marginBottom:10}}>{CS_DATA[travelType].title} — Coming Soon</h2>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#888",lineHeight:1.7,maxWidth:400,margin:"0 auto 18px"}}>{CS_DATA[travelType].desc}</p>
          </div>
        )}

        {/* Search panel */}
        {!CS_DATA[travelType]&&(
          <div style={{background:"rgba(255,255,255,0.85)",backdropFilter:"blur(10px)",borderRadius:"0 0 20px 20px",padding:"22px 26px",boxShadow:"0 4px 20px rgba(0,0,0,0.05)",border:"1px solid rgba(201,168,76,0.12)",borderTop:"none",marginBottom:22}}>

            {/* Mode toggle */}
            <div style={{display:"flex",gap:0,background:"rgba(201,168,76,0.07)",borderRadius:10,padding:3,marginBottom:18,width:"fit-content"}}>
              {[["structured","Manual Search"],["ai","🤖 AI Search"]].map(([id,label])=>(
                <button key={id} onClick={()=>{setMode(id);setFlights([]);setBuses([]);setSearched(false);setAiError("");setValidErr("");}}
                  style={{padding:"8px 20px",border:"none",borderRadius:8,fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,cursor:"pointer",transition:"all 0.2s",background:mode===id?"rgba(255,255,255,0.9)":"transparent",color:mode===id?GOLD_DARK:"#aaa",boxShadow:mode===id?`0 2px 6px rgba(201,168,76,0.2)`:"none"}}>
                  {label}
                </button>
              ))}
            </div>

            {/* FLIGHT STRUCTURED */}
            {travelType==="flight"&&mode==="structured"&&(
              <>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:8}}>
                  <div style={{display:"flex",gap:0,background:"rgba(201,168,76,0.07)",borderRadius:10,padding:3}}>
                    {["oneway","roundtrip"].map(t=>(
                      <button key={t} onClick={()=>setTripType(t)} style={{padding:"7px 16px",border:"none",borderRadius:8,fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,cursor:"pointer",transition:"all 0.2s",background:tripType===t?"rgba(255,255,255,0.9)":"transparent",color:tripType===t?"#1a1410":"#aaa",boxShadow:tripType===t?"0 2px 6px rgba(0,0,0,0.07)":"none"}}>
                        {t==="oneway"?"One Way":"Round Trip"}
                      </button>
                    ))}
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:8,background:`rgba(201,168,76,${isDomestic?0.08:0.05})`,border:`1px solid rgba(201,168,76,${isDomestic?0.25:0.15})`}}>
                    <span>{isDomestic?"🇮🇳":"🌍"}</span>
                    <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,color:GOLD_DARK}}>{isDomestic?"Domestic · Seat selection available":"International"}</span>
                  </div>
                </div>

                <div className="search-city-grid" style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:10,alignItems:"center",marginBottom:12}}>
                  {[{label:"FROM",city:fromCity,onClick:()=>setShowFromModal(true)},null,{label:"TO",city:toCity,onClick:()=>setShowToModal(true)}].map((item,i)=>item===null?(
                    <button key="swap" onClick={swapFlight} style={{width:40,height:40,borderRadius:"50%",background:"rgba(201,168,76,0.1)",border:`1.5px solid rgba(201,168,76,0.25)`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:18,color:GOLD_DARK,transition:"transform 0.3s",justifySelf:"center"}}
                      onMouseEnter={e=>e.currentTarget.style.transform="rotate(180deg)"}
                      onMouseLeave={e=>e.currentTarget.style.transform="rotate(0)"}>⇄</button>
                  ):(
                    <div key={item.label} onClick={item.onClick} style={{...inp,cursor:"pointer"}}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=GOLD;e.currentTarget.style.background="rgba(201,168,76,0.05)";}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(201,168,76,0.15)";e.currentTarget.style.background="#fafaf8";}}>
                      <div style={{...lbl,marginBottom:4}}>{item.label}</div>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:28,color:"#1a1410"}}>{item.city.code}</div>
                      <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#888",marginTop:2}}>{item.city.name}</div>
                    </div>
                  ))}
                </div>

                <div style={{display:"flex",alignItems:"center",gap:10,background:"rgba(201,168,76,0.06)",borderRadius:12,padding:"10px 16px",border:`1px solid rgba(201,168,76,0.2)`,marginBottom:12,cursor:"pointer"}} onClick={()=>{setMode("ai");setFlights([]);setSearched(false);}}>
                  <span>🤖</span>
                  <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:GOLD_DARK,fontWeight:600}}>Or type naturally: "blr to goa kal cheapest"</span>
                  <span style={{marginLeft:"auto",fontFamily:"'Space Mono',monospace",fontSize:11,color:GOLD}}>AI →</span>
                </div>

                <div className="search-date-grid" style={{display:"grid",gridTemplateColumns:tripType==="roundtrip"?"1fr 1fr 1fr 1fr":"1fr 1fr 1fr",gap:10,marginBottom:14}}>
                  <div style={{...inp,borderColor:!date&&validErr?"#ef4444":"rgba(201,168,76,0.15)"}}>
                    <label style={lbl}>DEPARTURE{!date&&<span style={{color:"#ef4444"}}> *</span>}</label>
                    <input type="date" value={date} min={today} onChange={e=>{setDate(e.target.value);setValidErr("");}} style={{background:"transparent",border:"none",outline:"none",fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:600,color:"#1a1410",width:"100%",cursor:"pointer"}}/>
                    {date&&<div style={{fontSize:11,color:"#aaa",marginTop:2}}>{new Date(date).toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"})}</div>}
                  </div>
                  {tripType==="roundtrip"&&(
                    <div style={inp}>
                      <label style={lbl}>RETURN</label>
                      <input type="date" value={returnDate} min={date||today} onChange={e=>setReturnDate(e.target.value)} style={{background:"transparent",border:"none",outline:"none",fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:600,color:"#1a1410",width:"100%",cursor:"pointer"}}/>
                    </div>
                  )}
                  <div style={inp}>
                    <label style={lbl}>TRAVELLERS</label>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <button onClick={()=>setPassengers(p=>Math.max(1,p-1))} style={{width:28,height:28,borderRadius:"50%",background:"rgba(201,168,76,0.1)",border:`1px solid rgba(201,168,76,0.25)`,color:GOLD_DARK,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>-</button>
                      <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:20,color:"#1a1410",minWidth:18,textAlign:"center"}}>{passengers}</span>
                      <button onClick={()=>setPassengers(p=>Math.min(9,p+1))} style={{width:28,height:28,borderRadius:"50%",background:"rgba(201,168,76,0.1)",border:`1px solid rgba(201,168,76,0.25)`,color:GOLD_DARK,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                    </div>
                  </div>
                  <div style={inp}>
                    <label style={lbl}>CLASS</label>
                    <select value={cabinClass} onChange={e=>setCabinClass(e.target.value)} style={{background:"transparent",border:"none",outline:"none",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,color:"#1a1410",width:"100%",cursor:"pointer"}}>{CLASSES.map(c=><option key={c}>{c}</option>)}</select>
                  </div>
                </div>

                <div style={{marginBottom:14}}>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:600,color:"#aaa",letterSpacing:"0.08em",marginBottom:7}}>SPECIAL FARES</div>
                  <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                    {SPECIAL_FARES.map(sf=>(
                      <button key={sf.id} onClick={()=>setSpecialFare(sf.id)} style={{padding:"6px 12px",borderRadius:9,fontSize:12,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",border:specialFare===sf.id?`1.5px solid ${GOLD}`:"1.5px solid rgba(0,0,0,0.09)",background:specialFare===sf.id?`rgba(201,168,76,0.1)`:"#fafaf8",color:specialFare===sf.id?GOLD_DARK:"#888",transition:"all 0.2s"}}>{sf.label}</button>
                    ))}
                  </div>
                </div>

                {validErr&&<div style={{padding:"10px 14px",borderRadius:10,background:"#FFF0F0",border:"1px solid #FFCDD2",fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#ef4444",marginBottom:12}}>{validErr}</div>}
                <button onClick={searchFlights} style={{width:"100%",padding:"14px",borderRadius:14,fontSize:15,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.08em",color:"#1a1410",border:"none",cursor:"pointer",background:GRAD,backgroundSize:"200% 200%",animation:"gradShift 4s ease infinite",boxShadow:`0 8px 28px rgba(201,168,76,0.44)`,transition:"transform 0.2s"}}
                  onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>Search Flights ✈</button>
              </>
            )}

            {/* BUS STRUCTURED */}
            {travelType==="bus"&&mode==="structured"&&(
              <>
                <div className="search-city-grid" style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:10,alignItems:"center",marginBottom:12}}>
                  {[{label:"FROM",city:busFrom,onClick:()=>setShowBusFromModal(true)},null,{label:"TO",city:busTo,onClick:()=>setShowBusToModal(true)}].map((item,i)=>item===null?(
                    <button key="swap" onClick={swapBus} style={{width:40,height:40,borderRadius:"50%",background:"rgba(201,168,76,0.1)",border:`1.5px solid rgba(201,168,76,0.25)`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:18,color:GOLD_DARK,transition:"transform 0.3s",justifySelf:"center"}}
                      onMouseEnter={e=>e.currentTarget.style.transform="rotate(180deg)"}
                      onMouseLeave={e=>e.currentTarget.style.transform="rotate(0)"}>⇄</button>
                  ):(
                    <div key={item.label} onClick={item.onClick} style={{...inp,cursor:"pointer"}}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=GOLD;e.currentTarget.style.background="rgba(201,168,76,0.05)";}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(201,168,76,0.15)";e.currentTarget.style.background="#fafaf8";}}>
                      <div style={{...lbl,marginBottom:4}}>{item.label}</div>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:22,color:"#1a1410"}}>🚌 {item.city}</div>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10,background:"rgba(201,168,76,0.06)",borderRadius:12,padding:"10px 16px",border:`1px solid rgba(201,168,76,0.2)`,marginBottom:12,cursor:"pointer"}} onClick={()=>{setMode("ai");setBuses([]);setSearched(false);}}>
                  <span>🤖</span>
                  <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:GOLD_DARK,fontWeight:600}}>Or type: "bus bangalore to chennai kal"</span>
                  <span style={{marginLeft:"auto",fontFamily:"'Space Mono',monospace",fontSize:11,color:GOLD}}>AI →</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
                  <div style={{...inp,borderColor:!date&&validErr?"#ef4444":"rgba(201,168,76,0.15)"}}>
                    <label style={lbl}>TRAVEL DATE{!date&&<span style={{color:"#ef4444"}}> *</span>}</label>
                    <input type="date" value={date} min={today} onChange={e=>{setDate(e.target.value);setValidErr("");}} style={{background:"transparent",border:"none",outline:"none",fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:600,color:"#1a1410",width:"100%",cursor:"pointer"}}/>
                    {date&&<div style={{fontSize:11,color:"#aaa",marginTop:2}}>{new Date(date).toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"})}</div>}
                  </div>
                  <div style={inp}>
                    <label style={lbl}>PASSENGERS</label>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <button onClick={()=>setPassengers(p=>Math.max(1,p-1))} style={{width:28,height:28,borderRadius:"50%",background:"rgba(201,168,76,0.1)",border:`1px solid rgba(201,168,76,0.25)`,color:GOLD_DARK,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>-</button>
                      <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:20,color:"#1a1410",minWidth:18,textAlign:"center"}}>{passengers}</span>
                      <button onClick={()=>setPassengers(p=>Math.min(6,p+1))} style={{width:28,height:28,borderRadius:"50%",background:"rgba(201,168,76,0.1)",border:`1px solid rgba(201,168,76,0.25)`,color:GOLD_DARK,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                    </div>
                  </div>
                  <div style={inp}>
                    <label style={lbl}>BUS TYPE</label>
                    <select value={busType} onChange={e=>setBusType(e.target.value)} style={{background:"transparent",border:"none",outline:"none",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,color:"#1a1410",width:"100%",cursor:"pointer"}}>{BUS_TYPES.map(t=><option key={t}>{t}</option>)}</select>
                  </div>
                </div>
                {validErr&&<div style={{padding:"10px 14px",borderRadius:10,background:"#FFF0F0",border:"1px solid #FFCDD2",fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#ef4444",marginBottom:12}}>{validErr}</div>}
                <button onClick={searchBuses} style={{width:"100%",padding:"14px",borderRadius:14,fontSize:15,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.08em",color:"#1a1410",border:"none",cursor:"pointer",background:GRAD,backgroundSize:"200% 200%",animation:"gradShift 4s ease infinite",boxShadow:`0 8px 28px rgba(201,168,76,0.44)`,transition:"transform 0.2s"}}
                  onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>Search Buses 🚌</button>
              </>
            )}

            {/* AI MODE */}
            {mode==="ai"&&(
              <div>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#888",marginBottom:10,lineHeight:1.55}}>
                  Type in any language — English, Hindi, Tamil, Telugu, Kannada mix. Typos are fine too:
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:12}}>
                  {[
                    "flights frm bangaluru to mumbai",
                    "blr to del kal sasta",
                    "bus bangalore to chennai kal",
                    "mumbai to delhi tomorrow morning",
                    "goa flights this weekend under 4000",
                    "bengalure se goa ka flight",
                  ].map(ex=>(
                    <button key={ex} onClick={()=>setAiQuery(ex)} style={{padding:"5px 12px",borderRadius:100,fontSize:12,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",background:`rgba(201,168,76,0.08)`,border:`1px solid rgba(201,168,76,0.2)`,color:GOLD_DARK}}>{ex}</button>
                  ))}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:12,background:"#fafaf8",borderRadius:14,padding:"4px 4px 4px 18px",border:`1.5px solid rgba(201,168,76,0.3)`,marginBottom:8}}>
                  <span style={{fontSize:18,opacity:0.6}}>🤖</span>
                  <input value={aiQuery} onChange={e=>{setAiQuery(e.target.value);setAiError("");}} onKeyDown={e=>e.key==="Enter"&&searchAI()}
                    placeholder='Type any way — "flights frm bangaluru to mumbai" works!'
                    style={{flex:1,background:"transparent",border:"none",outline:"none",fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#1a1410",padding:"12px 0"}}/>
                </div>
                {aiError&&<div style={{padding:"10px 14px",borderRadius:10,background:"#FFF0F0",border:"1px solid #FFCDD2",fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#ef4444",marginBottom:8}}>{aiError}</div>}
                <button onClick={searchAI} style={{width:"100%",padding:"14px",borderRadius:14,fontSize:15,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.08em",color:"#1a1410",border:"none",cursor:"pointer",background:GRAD,backgroundSize:"200% 200%",animation:"gradShift 4s ease infinite",boxShadow:`0 8px 28px rgba(201,168,76,0.44)`,transition:"transform 0.2s"}}
                  onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>Search with AI 🤖</button>
              </div>
            )}
          </div>
        )}

        {/* Loading */}
        {loading&&(
          <div style={{textAlign:"center",padding:"60px 0",animation:"fadeUp 0.4s both"}}>
            <div style={{width:44,height:44,border:`3px solid rgba(201,168,76,0.2)`,borderTopColor:GOLD,borderRadius:"50%",animation:"spinSlow 1s linear infinite",margin:"0 auto 16px"}}/>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:16,color:GOLD_DARK}}>{travelType==="bus"?"Scanning bus routes…":"Scanning flight paths…"}</div>
          </div>
        )}

        {/* Filters */}
        {!loading&&filtered.length>0&&(
          <div style={{background:"rgba(255,255,255,0.85)",backdropFilter:"blur(10px)",borderRadius:16,padding:"18px 20px",boxShadow:"0 4px 16px rgba(0,0,0,0.04)",border:"1px solid rgba(201,168,76,0.12)",marginBottom:18,animation:"fadeUp 0.4s both"}}>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:"#bbb",letterSpacing:"0.15em",marginBottom:12}}>FILTER &amp; SORT</div>
            <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:10}}>
              {travelType==="flight"&&[["any","All times"],["morning","Morning"],["afternoon","Afternoon"],["evening","Evening"]].map(([v,l])=>(
                <button key={v} onClick={()=>setFilterTime(v)} style={{padding:"5px 12px",borderRadius:100,fontSize:11,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",border:filterTime===v?`1.5px solid ${GOLD}`:"1.5px solid rgba(0,0,0,0.08)",background:filterTime===v?`rgba(201,168,76,0.1)`:"#fafaf8",color:filterTime===v?GOLD_DARK:"#aaa"}}>{l}</button>
              ))}
              {[["price","Cheapest"],["price-desc","Priciest"],["departure","Earliest"]].map(([v,l])=>(
                <button key={v} onClick={()=>setSortBy(v)} style={{padding:"5px 12px",borderRadius:100,fontSize:11,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",border:sortBy===v?`1.5px solid ${GOLD}`:"1.5px solid rgba(0,0,0,0.08)",background:sortBy===v?`rgba(201,168,76,0.1)`:"#fafaf8",color:sortBy===v?GOLD_DARK:"#aaa"}}>{l}</button>
              ))}
            </div>
            <input type="range" min="100" max={filterMaxPrice+500} step="100" value={filterMaxPrice} onChange={e=>setFilterMaxPrice(Number(e.target.value))} style={{width:"100%",accentColor:GOLD}}/>
            <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Space Mono',monospace",fontSize:10,color:"#bbb",marginTop:5}}>
              <span>Min</span><span style={{color:GOLD_DARK}}>Max ₹{filterMaxPrice.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading&&searched&&(
          <>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:"#bbb",letterSpacing:"0.15em",marginBottom:14}}>
              {filtered.length>0?`${filtered.length} ${travelType==="bus"?"BUSES":"FLIGHTS"} FOUND`:"NO RESULTS — TRY A DIFFERENT DATE OR ROUTE"}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {/* Flight cards */}
              {travelType==="flight"&&filtered.map((flight,i)=>(
                <div key={flight.id} style={{background:"rgba(255,255,255,0.85)",backdropFilter:"blur(10px)",borderRadius:18,padding:"20px 22px",boxShadow:"0 4px 16px rgba(0,0,0,0.04)",border:"1px solid rgba(201,168,76,0.1)",animation:`fadeUp 0.4s ${i*60}ms both`,transition:"all 0.2s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(201,168,76,0.35)";e.currentTarget.style.transform="translateY(-2px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(201,168,76,0.1)";e.currentTarget.style.transform="translateY(0)";}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:GOLD}}/>
                      <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:15,color:"#1a1410"}}>{flight.airline}</span>
                      <span style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:"#ccc"}}>{flight.flight_no}</span>
                    </div>
                    <div style={{display:"flex",gap:7}}>
                      {isDomestic&&<span style={{padding:"3px 9px",borderRadius:20,fontSize:10,background:`rgba(201,168,76,0.1)`,border:`1px solid rgba(201,168,76,0.25)`,color:GOLD_DARK,fontFamily:"'Space Mono',monospace"}}>Seats ✓</span>}
                      <span style={{padding:"3px 9px",borderRadius:20,fontSize:10,background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.2)",color:"#059669",fontFamily:"'Space Mono',monospace"}}>Non-stop</span>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:24,color:"#1a1410"}}>{fmtTime(flight.departure_time)}</div>
                      <div style={{fontFamily:"'Space Mono',monospace",fontSize:12,color:"#bbb",marginTop:2}}>{flight.from_city?.slice(0,3).toUpperCase()}</div>
                      <div style={{fontSize:11,color:"#ccc"}}>{fmtDate(flight.departure_time)}</div>
                    </div>
                    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"0 16px"}}>
                      <span style={{fontSize:12,color:"#bbb",fontFamily:"'DM Sans',sans-serif"}}>{calcDur(flight.departure_time,flight.arrival_time)}</span>
                      <div style={{width:"100%",display:"flex",alignItems:"center",gap:4}}>
                        <div style={{flex:1,height:1,background:`linear-gradient(90deg,rgba(201,168,76,0.3),rgba(201,168,76,0.7),rgba(201,168,76,0.3))`}}/>
                        <span style={{fontSize:12,color:GOLD}}>✈</span>
                        <div style={{flex:1,height:1,background:`linear-gradient(90deg,rgba(201,168,76,0.7),rgba(201,168,76,0.3))`}}/>
                      </div>
                      <span style={{fontSize:11,color:"#059669",fontFamily:"'DM Sans',sans-serif"}}>Direct</span>
                    </div>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:24,color:"#1a1410"}}>{fmtTime(flight.arrival_time)}</div>
                      <div style={{fontFamily:"'Space Mono',monospace",fontSize:12,color:"#bbb",marginTop:2}}>{flight.to_city?.slice(0,3).toUpperCase()}</div>
                      <div style={{fontSize:11,color:"#ccc"}}>{fmtDate(flight.arrival_time)}</div>
                    </div>
                  </div>
                  <div className="results-card-bottom" style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:14,borderTop:"1px solid rgba(201,168,76,0.1)"}}>
                    <div>
                      <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:"#ccc",letterSpacing:"0.1em"}}>FROM</div>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:26,color:GOLD_DARK}}>₹{(flight.price*passengers).toLocaleString()}</div>
                      <div style={{fontSize:12,color:"#bbb",fontFamily:"'DM Sans',sans-serif"}}>{passengers} pax · {cabinClass}</div>
                    </div>
                    <button onClick={()=>handleBookClick(flight)} style={{padding:"11px 24px",borderRadius:12,fontSize:14,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.06em",color:"#1a1410",border:"none",cursor:"pointer",background:GRAD,backgroundSize:"200% 200%",animation:"gradShift 3s ease infinite",boxShadow:`0 4px 14px rgba(201,168,76,0.44)`,transition:"transform 0.2s"}}
                      onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                      onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>Book →</button>
                  </div>
                </div>
              ))}

              {/* Bus cards */}
              {travelType==="bus"&&filtered.map((bus,i)=>(
                <div key={i} style={{background:"rgba(255,255,255,0.85)",backdropFilter:"blur(10px)",borderRadius:18,padding:"20px 22px",boxShadow:"0 4px 16px rgba(0,0,0,0.04)",border:"1px solid rgba(201,168,76,0.1)",animation:`fadeUp 0.4s ${i*60}ms both`,transition:"all 0.2s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(201,168,76,0.35)";e.currentTarget.style.transform="translateY(-2px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(201,168,76,0.1)";e.currentTarget.style.transform="translateY(0)";}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:GOLD}}/>
                      <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:15,color:"#1a1410"}}>{bus.op}</span>
                    </div>
                    <div style={{display:"flex",gap:7}}>
                      <span style={{padding:"3px 9px",borderRadius:20,fontSize:10,background:`rgba(201,168,76,0.1)`,border:`1px solid rgba(201,168,76,0.25)`,color:GOLD_DARK,fontFamily:"'Space Mono',monospace"}}>Seats ✓</span>
                      <span style={{padding:"3px 9px",borderRadius:20,fontSize:10,background:"#f8f8fa",border:"1px solid rgba(0,0,0,0.08)",color:"#888",fontFamily:"'Space Mono',monospace"}}>{bus.type}</span>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:24,color:"#1a1410"}}>{bus.dep}</div>
                      <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#888",marginTop:2}}>{bus.from}</div>
                    </div>
                    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"0 16px"}}>
                      <span style={{fontSize:12,color:"#bbb",fontFamily:"'DM Sans',sans-serif"}}>{bus.dur}</span>
                      <div style={{width:"100%",display:"flex",alignItems:"center",gap:4}}>
                        <div style={{flex:1,height:1,background:`linear-gradient(90deg,rgba(201,168,76,0.3),rgba(201,168,76,0.7),rgba(201,168,76,0.3))`}}/>
                        <span style={{fontSize:14}}>🚌</span>
                        <div style={{flex:1,height:1,background:`linear-gradient(90deg,rgba(201,168,76,0.7),rgba(201,168,76,0.3))`}}/>
                      </div>
                      <span style={{fontSize:11,color:"#059669",fontFamily:"'DM Sans',sans-serif"}}>Direct</span>
                    </div>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:24,color:"#1a1410"}}>{bus.arr}</div>
                      <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#888",marginTop:2}}>{bus.to}</div>
                    </div>
                  </div>
                  <div className="results-card-bottom" style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:14,borderTop:"1px solid rgba(201,168,76,0.1)"}}>
                    <div>
                      <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:"#ccc",letterSpacing:"0.1em"}}>FROM</div>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:26,color:GOLD_DARK}}>₹{(bus.price*passengers).toLocaleString()}</div>
                      <div style={{fontSize:12,color:"#bbb",fontFamily:"'DM Sans',sans-serif"}}>{passengers} pax · {bus.seats} seats avail.</div>
                    </div>
                    <button onClick={()=>handleBookClick(bus)} style={{padding:"11px 24px",borderRadius:12,fontSize:14,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.06em",color:"#1a1410",border:"none",cursor:"pointer",background:GRAD,backgroundSize:"200% 200%",animation:"gradShift 3s ease infinite",boxShadow:`0 4px 14px rgba(201,168,76,0.44)`,transition:"transform 0.2s"}}
                      onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                      onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>Book →</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading&&!searched&&(
          <div style={{textAlign:"center",padding:"80px 20px",animation:"fadeUp 0.5s both"}}>
            <div style={{fontSize:64,marginBottom:20,animation:"floatUD 3s ease-in-out infinite"}}>{travelType==="bus"?"🚌":"✈️"}</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:22,color:"#ccc"}}>Your journey starts here</div>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#ddd",marginTop:8}}>Search above or try AI search in any language</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  APP ROUTER
// ═══════════════════════════════════════════════════════
function App(){
  useEffect(()=>{fetch(`${API}/test`).catch(()=>{});const t=setInterval(()=>fetch(`${API}/test`).catch(()=>{}),14*60*1000);return()=>clearInterval(t);},[]);
  return(
    <Router>
      <Routes>
        <Route path="/"         element={<LandingPage/>}/>
        <Route path="/login"    element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/search"   element={<SearchPage/>}/>
        <Route path="/bookings" element={<MyBookings/>}/>
        <Route path="/profile"  element={<UserProfile/>}/>
        <Route path="/admin"    element={<AdminDashboard/>}/>
      </Routes>
    </Router>
  );
}

export default App;