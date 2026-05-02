/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://cometai-backend.onrender.com";

// ── IATA map ──────────────────────────────────────────────────────────────────
const IATA = {
  "bangalore":"BLR","bengaluru":"BLR","mumbai":"BOM","bombay":"BOM",
  "delhi":"DEL","new delhi":"DEL","chennai":"MAA","madras":"MAA",
  "hyderabad":"HYD","kolkata":"CCU","goa":"GOI","pune":"PNQ",
  "kochi":"COK","cochin":"COK","ahmedabad":"AMD","jaipur":"JAI",
  "lucknow":"LKO","varanasi":"VNS","banaras":"VNS","trivandrum":"TRV",
  "thiruvananthapuram":"TRV","coimbatore":"CBE","madurai":"IXM",
  "mangalore":"IXE","mysore":"MYQ","visakhapatnam":"VTZ","vizag":"VTZ",
  "ranchi":"IXR","bhopal":"BHO","nagpur":"NAG","chandigarh":"IXC",
  "guwahati":"GAU","bhubaneswar":"BBI","tirupati":"TIR","leh":"IXL",
  "amritsar":"ATQ","udaipur":"UDR","jodhpur":"JDH","agra":"AGR",
  "patna":"PAT","dehradun":"DED","shimla":"SLV","indore":"IDR",
  "dubai":"DXB","singapore":"SIN","bangkok":"BKK","london":"LHR",
  "new york":"JFK","kuala lumpur":"KUL","colombo":"CMB",
  "paris":"CDG","tokyo":"NRT","sydney":"SYD","doha":"DOH",
  "abu dhabi":"AUH","istanbul":"IST","bali":"DPS","maldives":"MLE",
};
const INDIA_CODES = new Set(["BLR","BOM","DEL","MAA","HYD","CCU","GOI","PNQ","COK","AMD","JAI",
  "LKO","VNS","PAT","IXC","GAU","BBI","CBE","IXM","IXE","MYQ","TRV","VTZ","VGA","IXR",
  "BHO","SXR","IXJ","HBX","IXG","TIR","IXL","IXZ","NAG","IDR","RPR","DED","SLV","ATQ","UDR"]);

function buildFlightLink(from, to, ddmm="", pax=1) {
  const fc = IATA[from?.toLowerCase()] || from?.slice(0,3).toUpperCase() || "BLR";
  const tc = IATA[to?.toLowerCase()]   || to?.slice(0,3).toUpperCase()   || "BOM";
  const base = (INDIA_CODES.has(fc) && INDIA_CODES.has(tc))
    ? "https://www.aviasales.in" : "https://www.aviasales.com";
  return `${base}/search/${fc}${ddmm}${tc}${pax}?marker=714667&sub_id=alvryn_ai`;
}

// ── Country list ──────────────────────────────────────────────────────────────
const COUNTRIES = [
  {key:"india",     flag:"🇮🇳",name:"India",      symbol:"₹"},
  {key:"usa",       flag:"🇺🇸",name:"USA",          symbol:"$"},
  {key:"uk",        flag:"🇬🇧",name:"UK",           symbol:"£"},
  {key:"australia", flag:"🇦🇺",name:"Australia",    symbol:"A$"},
  {key:"japan",     flag:"🇯🇵",name:"Japan",        symbol:"¥"},
  {key:"germany",   flag:"🇩🇪",name:"Germany",      symbol:"€"},
  {key:"france",    flag:"🇫🇷",name:"France",       symbol:"€"},
  {key:"canada",    flag:"🇨🇦",name:"Canada",       symbol:"C$"},
  {key:"south korea",flag:"🇰🇷",name:"South Korea",symbol:"₩"},
  {key:"brazil",    flag:"🇧🇷",name:"Brazil",       symbol:"R$"},
  {key:"singapore", flag:"🇸🇬",name:"Singapore",    symbol:"S$"},
  {key:"uae",       flag:"🇦🇪",name:"UAE",           symbol:"AED"},
  {key:"indonesia", flag:"🇮🇩",name:"Indonesia",    symbol:"Rp"},
  {key:"china",     flag:"🇨🇳",name:"China",        symbol:"¥"},
];

// ── Country themes ────────────────────────────────────────────────────────────
const COUNTRY_THEMES = {
  india:      {bg:"#fdf6e8",accent:"#c9a84c",msgBg:"#f0e8d4",nav:"rgba(248,244,236,0.97)",userGrad:"linear-gradient(135deg,#c9a84c,#f0d080,#c9a84c)"},
  usa:        {bg:"#f0f4ff",accent:"#1d4ed8",msgBg:"#e8eeff",nav:"rgba(240,244,255,0.97)",userGrad:"linear-gradient(135deg,#1d4ed8,#3b82f6,#1d4ed8)"},
  uk:         {bg:"#f0f0ff",accent:"#1e40af",msgBg:"#e8e8ff",nav:"rgba(240,240,255,0.97)",userGrad:"linear-gradient(135deg,#1e40af,#3b82f6,#1e40af)"},
  japan:      {bg:"#fff5f5",accent:"#dc2626",msgBg:"#ffeeee",nav:"rgba(255,245,245,0.97)",userGrad:"linear-gradient(135deg,#dc2626,#f87171,#dc2626)"},
  australia:  {bg:"#fff8f0",accent:"#ea580c",msgBg:"#fff0e5",nav:"rgba(255,248,240,0.97)",userGrad:"linear-gradient(135deg,#ea580c,#fb923c,#ea580c)"},
  germany:    {bg:"#fffbf0",accent:"#ca8a04",msgBg:"#fef9e7",nav:"rgba(255,251,240,0.97)",userGrad:"linear-gradient(135deg,#ca8a04,#fbbf24,#ca8a04)"},
  france:     {bg:"#f0f8ff",accent:"#1d4ed8",msgBg:"#e8f4ff",nav:"rgba(240,248,255,0.97)",userGrad:"linear-gradient(135deg,#1d4ed8,#60a5fa,#dc2626)"},
  canada:     {bg:"#fff5f5",accent:"#dc2626",msgBg:"#ffeeee",nav:"rgba(255,245,245,0.97)",userGrad:"linear-gradient(135deg,#dc2626,#f87171,#dc2626)"},
  "south korea":{bg:"#f5f5ff",accent:"#1d4ed8",msgBg:"#eeeeff",nav:"rgba(245,245,255,0.97)",userGrad:"linear-gradient(135deg,#1d4ed8,#dc2626,#1d4ed8)"},
  brazil:     {bg:"#f0fff4",accent:"#16a34a",msgBg:"#e5ffee",nav:"rgba(240,255,244,0.97)",userGrad:"linear-gradient(135deg,#16a34a,#4ade80,#16a34a)"},
  singapore:  {bg:"#fff0f5",accent:"#dc2626",msgBg:"#ffe5ee",nav:"rgba(255,240,245,0.97)",userGrad:"linear-gradient(135deg,#dc2626,#f87171,#dc2626)"},
  uae:        {bg:"#f0fff8",accent:"#059669",msgBg:"#e5fff4",nav:"rgba(240,255,248,0.97)",userGrad:"linear-gradient(135deg,#059669,#34d399,#059669)"},
  indonesia:  {bg:"#fff5f5",accent:"#dc2626",msgBg:"#ffeeee",nav:"rgba(255,245,245,0.97)",userGrad:"linear-gradient(135deg,#dc2626,#f87171,#dc2626)"},
  china:      {bg:"#fff8f0",accent:"#dc2626",msgBg:"#ffeeee",nav:"rgba(255,248,240,0.97)",userGrad:"linear-gradient(135deg,#dc2626,#fbbf24,#dc2626)"},
};

// ── Thinking animation icons ──────────────────────────────────────────────────
const THINK_STEPS = [
  {icon:"✈️",label:"Checking flights…"},
  {icon:"🚌",label:"Comparing buses…"},
  {icon:"🏨",label:"Searching hotels…"},
  {icon:"🚂",label:"Looking at trains…"},
  {icon:"🌍",label:"Planning your trip…"},
];

function ThinkingIndicator({accent}) {
  const [step, setStep] = useState(0);
  const [dots, setDots] = useState(".");
  useEffect(() => {
    const t1 = setInterval(() => setStep(s => (s+1) % THINK_STEPS.length), 700);
    const t2 = setInterval(() => setDots(d => d.length >= 3 ? "." : d+"."), 500);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 18px",
      background:"rgba(255,255,255,0.92)",backdropFilter:"blur(12px)",
      borderRadius:"18px 18px 18px 4px",border:`1px solid ${accent||"#c9a84c"}33`,
      boxShadow:"0 4px 20px rgba(0,0,0,0.08)",animation:"alvFadeUp 0.3s both",
      maxWidth:260}}>
      <span style={{fontSize:22,animation:"alvIconBounce 0.7s ease-in-out infinite"}}>
        {THINK_STEPS[step].icon}
      </span>
      <div>
        <div style={{fontSize:13,color:accent||"#8B6914",fontWeight:600,
          fontFamily:"'DM Sans',sans-serif"}}>
          {THINK_STEPS[step].label}
        </div>
        <div style={{display:"flex",gap:3,marginTop:4}}>
          {[0,1,2,3].map(i=>(
            <div key={i} style={{width:5,height:5,borderRadius:"50%",
              background:i%2===0?(accent||"#c9a84c"):"#4ade80",
              animation:`alvPulse 1.1s ${i*0.18}s ease-in-out infinite`}}/>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Alvryn Logo SVG ───────────────────────────────────────────────────────────
function AlvrynLogo({size=32}) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="alvLg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c9a84c"/>
          <stop offset="55%" stopColor="#f0d080"/>
          <stop offset="100%" stopColor="#4ade80"/>
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" stroke="url(#alvLg)" strokeWidth="1.5" fill="none"/>
      <path d="M20 46L28 18L36 46" stroke="url(#alvLg)" strokeWidth="2.4" strokeLinecap="round" fill="none"/>
      <path d="M23 37L34 37" stroke="url(#alvLg)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M27 46L35 18L43 46" stroke="url(#alvLg)" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.45"/>
    </svg>
  );
}

// ── Country Selector ──────────────────────────────────────────────────────────
function CountrySelector({countryKey, onSelect, token, sidebarDark}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const curr = COUNTRIES.find(c=>c.key===countryKey) || COUNTRIES[0];

  useEffect(() => {
    if (!open) return;
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    document.addEventListener("touchstart", h);
    return () => { document.removeEventListener("mousedown",h); document.removeEventListener("touchstart",h); };
  }, [open]);

  const select = async (c) => {
    setOpen(false);
    onSelect(c.key);
    localStorage.setItem("alvryn_country", c.key);
    if (token) {
      try {
        await fetch(`${API}/set-country`,{
          method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},
          body:JSON.stringify({country:c.key})
        });
      } catch {}
    }
  };

  return (
    <div ref={ref} style={{position:"relative",zIndex:50}}>
      <button onClick={()=>setOpen(o=>!o)} style={{
        display:"flex",alignItems:"center",gap:6,padding:"6px 12px",
        borderRadius:100,background:"rgba(201,168,76,0.15)",
        border:"1px solid rgba(201,168,76,0.35)",cursor:"pointer",
        fontSize:12,fontWeight:600,color:"#c9a84c",
        fontFamily:"'DM Sans',sans-serif",
        WebkitTapHighlightColor:"transparent",
      }}>
        <span style={{fontSize:15}}>{curr.flag}</span>
        <span>{curr.name}</span>
        <span style={{opacity:0.6,fontSize:10}}>{open?"▲":"▼"}</span>
      </button>
      {open && (
        <div style={{
          position:"absolute",top:"calc(100% + 6px)",right:0,
          background:"#fff",borderRadius:14,
          boxShadow:"0 8px 32px rgba(0,0,0,0.18)",
          border:"1px solid rgba(201,168,76,0.2)",
          padding:"6px 0",minWidth:180,maxHeight:260,
          overflowY:"auto",zIndex:200,animation:"alvFadeUp 0.2s both",
        }}>
          {COUNTRIES.map(c=>(
            <button key={c.key} onClick={()=>select(c)} style={{
              display:"flex",width:"100%",alignItems:"center",gap:10,
              padding:"9px 14px",background:countryKey===c.key?"rgba(201,168,76,0.1)":"transparent",
              border:"none",cursor:"pointer",fontSize:13,color:"#1a1410",
              fontFamily:"'DM Sans',sans-serif",textAlign:"left",
            }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(201,168,76,0.08)"}
              onMouseLeave={e=>e.currentTarget.style.background=countryKey===c.key?"rgba(201,168,76,0.1)":"transparent"}
            >
              <span style={{fontSize:18}}>{c.flag}</span>
              <span style={{flex:1}}>{c.name}</span>
              <span style={{fontSize:11,color:"#8B6914",opacity:0.7}}>{c.symbol}</span>
              {countryKey===c.key && <span style={{color:"#c9a84c",fontSize:12}}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Chat History Sidebar Item ─────────────────────────────────────────────────
function ChatItem({chat, isActive, onLoad, onRename, onDelete}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameVal, setRenameVal] = useState(chat.title||"New chat");
  const ref = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown",h);
    document.addEventListener("touchstart",h);
    return () => { document.removeEventListener("mousedown",h); document.removeEventListener("touchstart",h); };
  }, [menuOpen]);

  return (
    <div ref={ref} style={{position:"relative",marginBottom:2}}>
      <div onClick={()=>{ if(!menuOpen&&!renaming) onLoad(); }}
        style={{
          padding:"9px 10px",borderRadius:9,cursor:"pointer",
          background:isActive?"rgba(201,168,76,0.12)":"transparent",
          border:isActive?"1px solid rgba(201,168,76,0.3)":"1px solid transparent",
          display:"flex",alignItems:"center",gap:6,transition:"all 0.14s",
        }}
        onMouseEnter={e=>{if(!isActive)e.currentTarget.style.background="rgba(201,168,76,0.06)";}}
        onMouseLeave={e=>{if(!isActive)e.currentTarget.style.background="transparent";}}
      >
        <span style={{fontSize:11,flexShrink:0,color:"rgba(240,220,180,0.5)"}}>💬</span>
        <div style={{flex:1,minWidth:0}}>
          {renaming ? (
            <input value={renameVal} autoFocus
              onChange={e=>setRenameVal(e.target.value)}
              onBlur={()=>{onRename(chat.id,renameVal.trim()||chat.title);setRenaming(false);}}
              onKeyDown={e=>{
                if(e.key==="Enter"){onRename(chat.id,renameVal.trim()||chat.title);setRenaming(false);}
                if(e.key==="Escape")setRenaming(false);
              }}
              onClick={e=>e.stopPropagation()}
              style={{width:"100%",background:"rgba(255,255,255,0.9)",
                border:"1px solid rgba(201,168,76,0.4)",borderRadius:5,
                padding:"2px 6px",fontSize:12,color:"#1a1410",outline:"none",
                fontFamily:"'DM Sans',sans-serif"}}
            />
          ) : (
            <div style={{fontSize:12,color:isActive?"#f0d080":"#c9a870",
              overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
              fontFamily:"'DM Sans',sans-serif",fontWeight:isActive?600:400}}>
              {chat.title||"New chat"}
            </div>
          )}
          <div style={{fontSize:9,color:"rgba(201,168,76,0.4)",marginTop:1}}>
            {chat.time ? new Date(chat.time).toLocaleDateString("en-IN",{day:"numeric",month:"short"}) : ""}
          </div>
        </div>
        {/* 3-dot menu */}
        <button onClick={e=>{e.stopPropagation();setMenuOpen(s=>!s);}}
          style={{flexShrink:0,width:26,height:26,borderRadius:5,
            background:"transparent",border:"none",cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center",
            color:"rgba(201,168,76,0.5)",fontSize:15,
            opacity:isActive?1:0,transition:"opacity 0.15s",
            WebkitTapHighlightColor:"transparent"}}
          onMouseEnter={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.background="rgba(201,168,76,0.15)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.opacity=isActive?"1":"0";}}>
          ⋯
        </button>
      </div>
      {menuOpen && (
        <div onClick={e=>e.stopPropagation()} style={{
          position:"absolute",right:0,top:34,zIndex:100,
          background:"#fff",borderRadius:10,padding:"4px 0",
          boxShadow:"0 8px 28px rgba(0,0,0,0.15)",
          border:"1px solid rgba(201,168,76,0.2)",minWidth:130,
        }}>
          <button onClick={()=>{setRenaming(true);setMenuOpen(false);}}
            style={{display:"block",width:"100%",padding:"9px 14px",
              textAlign:"left",background:"none",border:"none",cursor:"pointer",
              fontSize:13,fontFamily:"'DM Sans',sans-serif",color:"#1a1410"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(201,168,76,0.08)"}
            onMouseLeave={e=>e.currentTarget.style.background="none"}>
            ✏️ Rename
          </button>
          <button onClick={()=>{onDelete(chat.id);setMenuOpen(false);}}
            style={{display:"block",width:"100%",padding:"9px 14px",
              textAlign:"left",background:"none",border:"none",cursor:"pointer",
              fontSize:13,fontFamily:"'DM Sans',sans-serif",color:"#ef4444"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(239,68,68,0.06)"}
            onMouseLeave={e=>e.currentTarget.style.background="none"}>
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ── Sidebar Content (shared between desktop & mobile) ─────────────────────────
function SidebarContent({
  chats, activeChatId, countryKey, token, user,
  onNewChat, onLoadChat, onRenameChat, onDeleteChat,
  onSelectCountry, onNavigate, onSignOut, onClose,
  accentColor
}) {
  const gold = "#c9a84c";
  const goldD = "#8B6914";
  const accent = accentColor || gold;

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",padding:"14px 10px 16px"}}>

      {/* Logo */}
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"6px 8px 16px",
        borderBottom:"1px solid rgba(201,168,76,0.25)",marginBottom:14,cursor:"pointer"}}
        onClick={()=>{ onNavigate("/"); onClose&&onClose(); }}>
        <div style={{animation:"alvFloat 4s ease-in-out infinite"}}>
          <AlvrynLogo size={28}/>
        </div>
        <div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:16,
            color:gold,letterSpacing:"0.15em"}}>ALVRYN</div>
          <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:7,color:gold,
            letterSpacing:"0.2em",opacity:0.7}}>AI TRAVEL</div>
        </div>
      </div>

      {/* Country selector */}
      <div style={{marginBottom:14}}>
        <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:9,color:gold,
          letterSpacing:"0.18em",fontWeight:700,marginBottom:6,paddingLeft:2}}>
          🌍 CHOOSE COUNTRY
        </div>
        <CountrySelector countryKey={countryKey} onSelect={onSelectCountry} token={token} sidebarDark/>
        <div style={{fontSize:10,color:"rgba(201,168,76,0.6)",marginTop:5,paddingLeft:2,
          fontFamily:"'DM Sans',sans-serif",lineHeight:1.4}}>
          Better local prices & transport
        </div>
      </div>

      {/* New Chat */}
      <button onClick={()=>{ onNewChat(); onClose&&onClose(); }}
        style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,
          padding:"10px 14px",borderRadius:11,
          background:"linear-gradient(135deg,#c9a84c,#f0d080,#c9a84c)",
          backgroundSize:"200% 200%",border:"none",cursor:"pointer",
          color:"#1a1410",fontFamily:"'DM Sans',sans-serif",fontWeight:700,
          fontSize:13,marginBottom:16,width:"100%",
          boxShadow:"0 4px 16px rgba(201,168,76,0.3)",
          animation:"alvGradShift 4s ease infinite"}}>
        + New Chat
      </button>

      {/* History */}
      <div style={{flex:1,overflowY:"auto",marginBottom:8,
        scrollbarWidth:"thin",scrollbarColor:"rgba(201,168,76,0.3) transparent"}}>
        {chats.length > 0 && (
          <>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:9,
              color:"rgba(201,168,76,0.5)",letterSpacing:"0.15em",
              marginBottom:8,paddingLeft:8}}>RECENT</div>
            {chats.slice(0,30).map(chat=>(
              <ChatItem key={chat.id} chat={chat}
                isActive={activeChatId===chat.id}
                onLoad={()=>{ onLoadChat(chat); onClose&&onClose(); }}
                onRename={onRenameChat}
                onDelete={onDeleteChat}
              />
            ))}
          </>
        )}
        {chats.length === 0 && (
          <div style={{textAlign:"center",padding:"24px 12px",
            color:"rgba(201,168,76,0.4)",fontSize:12,fontFamily:"'DM Sans',sans-serif"}}>
            No chats yet.<br/>Start a new conversation!
          </div>
        )}
      </div>

      {/* User info & actions */}
      <div style={{borderTop:"1px solid rgba(201,168,76,0.2)",paddingTop:12}}>
        {user && (
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,padding:"0 4px"}}>
            <div style={{width:32,height:32,borderRadius:"50%",flexShrink:0,
              background:"linear-gradient(135deg,#c9a84c,#f0d080)",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:14,color:"#1a1410",fontWeight:700}}>
              {user.name?.charAt(0)?.toUpperCase()||"U"}
            </div>
            <div style={{overflow:"hidden",flex:1}}>
              <div style={{fontSize:12,color:"#f0e0c0",overflow:"hidden",
                textOverflow:"ellipsis",whiteSpace:"nowrap",
                fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>
                {user.name||"Traveller"}
              </div>
              <div style={{fontSize:10,color:"rgba(201,168,76,0.45)",overflow:"hidden",
                textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                {user.email||""}
              </div>
            </div>
          </div>
        )}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5,marginBottom:8}}>
          {[["🔍","Search","/search"],["👤","Profile","/profile"],["🏠","Home","/"]].map(([icon,label,path])=>(
            <button key={path} onClick={()=>{ onNavigate(path); onClose&&onClose(); }}
              style={{padding:"7px 4px",borderRadius:8,fontSize:11,fontWeight:600,
                cursor:"pointer",background:"rgba(255,255,255,0.05)",
                color:"rgba(201,168,76,0.6)",
                border:"1px solid rgba(255,255,255,0.07)",
                fontFamily:"'DM Sans',sans-serif",transition:"all 0.15s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(201,168,76,0.15)";e.currentTarget.style.color="#c9a84c";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.05)";e.currentTarget.style.color="rgba(201,168,76,0.6)";}}>
              {icon}<br/><span style={{fontSize:9}}>{label}</span>
            </button>
          ))}
        </div>
        <button onClick={onSignOut}
          style={{width:"100%",padding:"8px",borderRadius:8,fontSize:12,fontWeight:600,
            cursor:"pointer",background:"rgba(239,68,68,0.08)",
            color:"rgba(239,68,68,0.75)",
            border:"1px solid rgba(239,68,68,0.2)",
            fontFamily:"'DM Sans',sans-serif",transition:"all 0.15s"}}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(239,68,68,0.15)"}
          onMouseLeave={e=>e.currentTarget.style.background="rgba(239,68,68,0.08)"}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
const CHIPS = [
  "✈️ Cheapest flight Bangalore to Delhi tomorrow",
  "🚌 Bus Chennai to Hyderabad tonight",
  "🏨 Hotels in Goa under ₹2000 per night",
  "🚂 Train Delhi to Mumbai this weekend",
  "🗺️ Plan a 2-day trip under ₹5000 from Bangalore",
  "⚡ Fastest way from Bangalore to Mumbai",
  "🌍 Flights to Dubai next month under ₹15000",
  "🏖️ Best time to visit Goa — flights + hotels",
];

function EmptyState({onChip, accent}) {
  return (
    <div style={{textAlign:"center",
      paddingTop:"clamp(20px,5vh,60px)",
      paddingBottom:"clamp(16px,3vh,32px)",
      animation:"alvFadeUp 0.5s both"}}>
      <div style={{animation:"alvFloat 4s ease-in-out infinite",display:"inline-block",marginBottom:18}}>
        <AlvrynLogo size={52}/>
      </div>
      <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:300,
        fontSize:"clamp(22px,5vw,48px)",marginBottom:8,lineHeight:1.15,
        background:`linear-gradient(135deg,${accent||"#c9a84c"},#f0d080,#4ade80)`,
        WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
        backgroundClip:"text",backgroundSize:"200% 200%",
        animation:"alvGradShift 4s ease infinite",padding:"0 8px"}}>
        Where do you want to go?
      </h1>
      <p style={{fontFamily:"'DM Sans',sans-serif",
        fontSize:"clamp(13px,3vw,15px)",
        color:"var(--alvText2)",marginBottom:24,lineHeight:1.7,
        maxWidth:460,margin:"0 auto 24px",padding:"0 16px"}}>
        Flights · Buses · Hotels · Trains · Trip planning<br/>
        <span style={{fontSize:"clamp(11px,2.5vw,13px)",color:"var(--alvTextMut)"}}>
          Any language. Any route. Typos? No problem. 😄
        </span>
      </p>
      <div style={{display:"grid",
        gridTemplateColumns:"repeat(auto-fit,minmax(clamp(140px,40vw,260px),1fr))",
        gap:"clamp(7px,2vw,10px)",maxWidth:660,margin:"0 auto",padding:"0 12px"}}>
        {CHIPS.map((s,i)=>(
          <button key={i} onClick={()=>onChip(s)}
            style={{padding:"clamp(9px,2vw,12px) clamp(12px,3vw,18px)",
              borderRadius:100,fontSize:"clamp(11px,2.8vw,13px)",cursor:"pointer",
              background:"var(--alvCard)",border:`1px solid ${accent||"#c9a84c"}33`,
              color:"var(--alvText2)",transition:"all 0.2s",
              fontFamily:"'DM Sans',sans-serif",fontWeight:500,
              textAlign:"center",lineHeight:1.45,
              animation:`alvFadeUp 0.35s ${i*40}ms both`,whiteSpace:"normal"}}
            onMouseEnter={e=>{e.currentTarget.style.background=`${accent||"#c9a84c"}1a`;e.currentTarget.style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="var(--alvCard)";e.currentTarget.style.transform="translateY(0)";}}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Message Bubble ────────────────────────────────────────────────────────────
function AIMsgBubble({msg, isLatest, accent}) {
  const [displayed, setDisplayed] = useState(isLatest ? "" : (msg.text||""));
  const [done, setDone] = useState(!isLatest);
  const full = msg.text||"";

  useEffect(() => {
    if (!isLatest || !full) { setDisplayed(full); setDone(true); return; }
    setDisplayed("");
    setDone(false);
    let i = 0;
    const speed = 14;
    const iv = setInterval(() => {
      i++;
      setDisplayed(full.slice(0,i));
      if (i >= full.length) { clearInterval(iv); setDone(true); }
    }, speed);
    return () => clearInterval(iv);
  }, [full, isLatest]);

  return (
    <div style={{display:"flex",gap:10,marginBottom:24,animation:"alvFadeUp 0.25s both"}}>
      <div style={{flexShrink:0,width:32,height:32,borderRadius:"50%",
        background:"linear-gradient(135deg,#c9a84c,#f0d080)",
        display:"flex",alignItems:"center",justifyContent:"center",marginTop:2}}>
        <AlvrynLogo size={20}/>
      </div>
      <div style={{flex:1,minWidth:0}}>
        {/* Text with typewriter */}
        {displayed && (
          <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,
            color:"var(--alvText1)",lineHeight:1.8,
            marginBottom:(msg.cards?.length||msg.quickReplies?.length)?16:0,
            whiteSpace:"pre-wrap"}}>
            {displayed}
            {!done && (
              <span style={{display:"inline-block",width:2,height:14,
                background:accent||"#c9a84c",marginLeft:2,
                animation:"alvBlink 1s infinite",verticalAlign:"middle"}}/>
            )}
          </div>
        )}
        {/* Cards */}
        {msg.cards?.filter(c=>c.type==="flight").map((c,i)=><FlightCard key={i} f={c} i={i} accent={accent}/>)}
        {msg.cards?.filter(c=>c.type==="bus").map((c,i)=><BusCard key={i} b={c} i={i}/>)}
        {msg.cards?.filter(c=>c.type==="hotel").map((c,i)=><HotelCard key={i} h={c} i={i}/>)}
        {msg.cards?.filter(c=>c.type==="train").map((c,i)=><TrainCard key={i} t={c} i={i}/>)}
        {/* CTA */}
        {msg.cta && (
          <div style={{marginTop:12,padding:"10px 14px",borderRadius:10,
            background:`${accent||"#c9a84c"}10`,
            border:`1px solid ${accent||"#c9a84c"}28`,
            fontFamily:"'DM Sans',sans-serif",fontSize:13,
            color:`${accent||"#c9a84c"}cc`,fontStyle:"italic"}}>
            {msg.cta}
          </div>
        )}
        {/* Quick replies */}
        {msg.quickReplies?.length>0 && msg._onSend && (
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:12}}>
            {msg.quickReplies.map((r,i)=>(
              <button key={i} onClick={()=>msg._onSend(r)}
                style={{padding:"8px 14px",borderRadius:100,fontSize:13,cursor:"pointer",
                  background:`${accent||"#c9a84c"}15`,
                  border:`1.5px solid ${accent||"#c9a84c"}35`,
                  color:accent||"#8B6914",fontFamily:"'DM Sans',sans-serif",
                  fontWeight:600,transition:"all 0.18s"}}
                onMouseEnter={e=>e.currentTarget.style.background=`${accent||"#c9a84c"}28`}
                onMouseLeave={e=>e.currentTarget.style.background=`${accent||"#c9a84c"}15`}>
                {r}
              </button>
            ))}
          </div>
        )}
        {msg.cards?.length>0 && (
          <div style={{fontSize:11,color:"var(--alvTextMut)",marginTop:6,
            fontFamily:"'DM Sans',sans-serif"}}>
            Prices shown are approximate. Tap any card for live availability.
          </div>
        )}
      </div>
    </div>
  );
}

function UserMsgBubble({msg, userGrad}) {
  return (
    <div style={{display:"flex",justifyContent:"flex-end",marginBottom:20,
      animation:"alvFadeIn 0.2s both"}}>
      <div style={{maxWidth:"72%",padding:"12px 18px",
        borderRadius:"20px 20px 4px 20px",
        background:userGrad||"linear-gradient(135deg,#c9a84c,#f0d080,#c9a84c)",
        backgroundSize:"200% 200%",animation:"alvGradShift 4s ease infinite",
        fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#1a1410",
        fontWeight:500,lineHeight:1.65,wordBreak:"break-word",
        boxShadow:"0 4px 16px rgba(201,168,76,0.18)"}}>
        {msg.content}
      </div>
    </div>
  );
}

// ── Travel Cards ──────────────────────────────────────────────────────────────
function FlightCard({f,i,accent}) {
  const g = accent||"#c9a84c";
  return (
    <div onClick={()=>window.open(f.link,"_blank","noopener")}
      style={{background:"var(--alvCard)",borderRadius:16,padding:"16px 18px",
        border:`1px solid ${g}28`,cursor:"pointer",marginBottom:10,
        boxShadow:"0 4px 20px rgba(0,0,0,0.08)",
        animation:`alvFadeUp 0.3s ${i*75}ms both`,transition:"all 0.2s"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor=`${g}55`;}}
      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor=`${g}28`;}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:10,
            background:`${g}18`,border:`1px solid ${g}28`,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>✈️</div>
          <div>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:14,
              color:"var(--alvText1)"}}>{f.airline||"Multiple Airlines"}</div>
            {f.insight&&<div style={{fontSize:11,color:"var(--alvTextMut)",marginTop:1}}>💡 {f.insight}</div>}
          </div>
        </div>
        {f.label&&<span style={{padding:"3px 10px",borderRadius:100,fontSize:10,
          fontWeight:700,color:g,background:`${g}1a`,
          border:`1px solid ${g}33`,fontFamily:"'DM Sans',sans-serif"}}>{f.label}</span>}
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <div style={{textAlign:"center",minWidth:55}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:24,color:"var(--alvText1)"}}>{f.departure||"—"}</div>
          <div style={{fontSize:10,color:"var(--alvTextMut)",marginTop:2}}>{f.fromCode||""}</div>
        </div>
        <div style={{flex:1,textAlign:"center",padding:"0 12px"}}>
          <div style={{fontSize:11,color:"var(--alvTextMut)",marginBottom:4}}>{f.duration||"Direct"}</div>
          <div style={{height:1,background:`linear-gradient(90deg,transparent,${g},transparent)`,position:"relative"}}>
            <span style={{position:"absolute",top:-9,left:"50%",transform:"translateX(-50%)",fontSize:13,color:g}}>✈</span>
          </div>
        </div>
        <div style={{textAlign:"center",minWidth:55}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:24,color:"var(--alvText1)"}}>{f.arrival||"—"}</div>
          <div style={{fontSize:10,color:"var(--alvTextMut)",marginTop:2}}>{f.toCode||""}</div>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
        paddingTop:12,borderTop:`1px solid ${g}15`}}>
        <div>
          <div style={{fontSize:9,color:"var(--alvTextMut)",letterSpacing:"0.1em",marginBottom:2}}>APPROX FROM</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:22,color:g}}>
            {f.price?`₹${f.price.toLocaleString()}`:"Live rates"}
          </div>
        </div>
        <div style={{padding:"9px 18px",borderRadius:11,
          background:`linear-gradient(135deg,${g},#f0d080,${g})`,backgroundSize:"200% 200%",
          animation:"alvGradShift 3s ease infinite",
          fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:13,color:"#1a1410",
          cursor:"pointer",boxShadow:`0 4px 14px ${g}30`}}>
          Book →
        </div>
      </div>
    </div>
  );
}

function BusCard({b,i}) {
  const g = "#16a34a";
  return (
    <div onClick={()=>window.open(b.link,"_blank","noopener")}
      style={{background:"var(--alvCard)",borderRadius:16,padding:"16px 18px",
        border:"1px solid rgba(34,197,94,0.18)",cursor:"pointer",marginBottom:10,
        boxShadow:"0 4px 20px rgba(0,0,0,0.08)",
        animation:`alvFadeUp 0.3s ${i*75}ms both`,transition:"all 0.2s"}}
      onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
      onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:10,background:"rgba(34,197,94,0.12)",
            border:"1px solid rgba(34,197,94,0.22)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🚌</div>
          <div>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:14,color:"var(--alvText1)"}}>{b.operator||b.op}</div>
            {b.type2&&<div style={{fontSize:11,color:"var(--alvTextMut)"}}>{b.type2}</div>}
          </div>
        </div>
        {b.label&&<span style={{padding:"3px 10px",borderRadius:100,fontSize:10,fontWeight:700,
          color:"#16a34a",background:"rgba(22,163,74,0.12)",border:"1px solid rgba(22,163,74,0.25)",
          fontFamily:"'DM Sans',sans-serif"}}>{b.label}</span>}
      </div>
      {b.insight&&<div style={{fontSize:12,color:"rgba(201,168,76,0.75)",marginBottom:10,
        padding:"7px 11px",borderRadius:9,background:"rgba(201,168,76,0.06)"}}>💡 {b.insight}</div>}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
        paddingTop:10,borderTop:"1px solid rgba(34,197,94,0.1)"}}>
        <div>
          <div style={{fontSize:9,color:"var(--alvTextMut)",letterSpacing:"0.1em",marginBottom:2}}>APPROX FROM</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:22,color:"#16a34a"}}>
            ₹{b.price?.toLocaleString()||"—"}
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          {b.departure&&<div style={{textAlign:"center"}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:18,color:"var(--alvText1)"}}>{b.departure}</div>
            <div style={{fontSize:10,color:"var(--alvTextMut)"}}>{b.from||""}</div>
          </div>}
          <div style={{padding:"8px 16px",borderRadius:10,
            background:"rgba(22,163,74,0.12)",border:"1px solid rgba(22,163,74,0.28)",
            fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13,color:"#16a34a",cursor:"pointer"}}>
            RedBus →
          </div>
        </div>
      </div>
    </div>
  );
}

function HotelCard({h,i}) {
  return (
    <div onClick={()=>window.open(h.link,"_blank","noopener")}
      style={{background:"var(--alvCard)",borderRadius:16,padding:"16px 18px",
        border:"1px solid rgba(251,146,60,0.18)",cursor:"pointer",marginBottom:10,
        boxShadow:"0 4px 20px rgba(0,0,0,0.08)",
        animation:`alvFadeUp 0.3s ${i*75}ms both`,transition:"all 0.2s"}}
      onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
      onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:10,background:"rgba(251,146,60,0.1)",
            border:"1px solid rgba(251,146,60,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🏨</div>
          <div>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:14,color:"var(--alvText1)"}}>Hotels in {h.city}</div>
            <div style={{display:"flex",gap:1,marginTop:2}}>
              {"★★★★".split("").map((_,j)=><span key={j} style={{color:"#c9a84c",fontSize:11}}>★</span>)}
              <span style={{fontSize:10,color:"var(--alvTextMut)",marginLeft:4}}>& above</span>
            </div>
          </div>
        </div>
        {h.label&&<span style={{padding:"3px 10px",borderRadius:100,fontSize:10,fontWeight:700,
          color:"#fb923c",background:"rgba(251,146,60,0.12)",border:"1px solid rgba(251,146,60,0.25)",
          fontFamily:"'DM Sans',sans-serif"}}>{h.label}</span>}
      </div>
      {h.insight&&<div style={{fontSize:12,color:"rgba(201,168,76,0.75)",marginBottom:10,
        padding:"7px 11px",borderRadius:9,background:"rgba(201,168,76,0.06)"}}>💡 {h.insight}</div>}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
        paddingTop:10,borderTop:"1px solid rgba(251,146,60,0.1)"}}>
        <div>
          <div style={{fontSize:9,color:"var(--alvTextMut)",letterSpacing:"0.1em",marginBottom:2}}>APPROX PER NIGHT</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:22,color:"#fb923c"}}>₹{h.priceRange}</div>
        </div>
        <div style={{padding:"8px 16px",borderRadius:10,
          background:"rgba(251,146,60,0.12)",border:"1px solid rgba(251,146,60,0.28)",
          fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13,color:"#fb923c",cursor:"pointer"}}>
          View Hotels →
        </div>
      </div>
    </div>
  );
}

function TrainCard({t,i}) {
  return (
    <div onClick={()=>window.open(t.link,"_blank","noopener")}
      style={{background:"var(--alvCard)",borderRadius:16,padding:"16px 18px",
        border:"1px solid rgba(139,92,246,0.18)",cursor:"pointer",marginBottom:10,
        boxShadow:"0 4px 20px rgba(0,0,0,0.08)",
        animation:`alvFadeUp 0.3s ${i*75}ms both`,transition:"all 0.2s"}}
      onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
      onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:10,background:"rgba(139,92,246,0.12)",
            border:"1px solid rgba(139,92,246,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🚂</div>
          <div>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:14,color:"var(--alvText1)"}}>{t.from} → {t.to}</div>
            <div style={{fontSize:11,color:"var(--alvTextMut)"}}>Indian Railways · IRCTC</div>
          </div>
        </div>
        {t.label&&<span style={{padding:"3px 10px",borderRadius:100,fontSize:10,fontWeight:700,
          color:"#a78bfa",background:"rgba(139,92,246,0.13)",border:"1px solid rgba(139,92,246,0.25)",
          fontFamily:"'DM Sans',sans-serif"}}>{t.label}</span>}
      </div>
      {t.insight&&<div style={{fontSize:12,color:"rgba(201,168,76,0.75)",marginBottom:8,
        padding:"7px 11px",borderRadius:9,background:"rgba(201,168,76,0.06)"}}>💡 {t.insight}</div>}
      {t.date&&<div style={{fontSize:12,color:"rgba(139,92,246,0.85)",marginBottom:8,
        padding:"7px 11px",borderRadius:9,background:"rgba(139,92,246,0.07)",
        border:"1px solid rgba(139,92,246,0.15)"}}>📅 {t.date}</div>}
      <div style={{display:"flex",justifyContent:"flex-end",paddingTop:10,borderTop:"1px solid rgba(139,92,246,0.1)"}}>
        <div style={{padding:"8px 16px",borderRadius:10,
          background:"rgba(139,92,246,0.12)",border:"1px solid rgba(139,92,246,0.28)",
          fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13,color:"#a78bfa",cursor:"pointer"}}>
          Search on IRCTC →
        </div>
      </div>
    </div>
  );
}

// ── Main AIChatPage ───────────────────────────────────────────────────────────
export default function AIChatPage({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  let user = null;
  try { user = JSON.parse(localStorage.getItem("user")||"null"); } catch {}
  const token = localStorage.getItem("token");

  const [chats, setChats]         = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [countryKey, setCountryKey] = useState(()=>localStorage.getItem("alvryn_country")||"india");
  const [sidebarOpen, setSidebarOpen]   = useState(false);   // mobile bottom sheet
  const [desktopSbOpen, setDesktopSbOpen] = useState(true); // desktop collapsible
  const bottomRef   = useRef(null);
  const inputRef    = useRef(null);
  const textareaRef = useRef(null);
  const sessionRef  = useRef(sessionStorage.getItem("alvryn_sid")||null);

  const CT = COUNTRY_THEMES[countryKey] || COUNTRY_THEMES.india;
  const accent = CT.accent||"#c9a84c";

  // Auth gate
  useEffect(() => { if (!token) navigate("/login"); }, [token, navigate]);

  // Load chats (localStorage first, then DB sync)
  useEffect(() => {
    if (!token) return;
    try {
      const local = JSON.parse(localStorage.getItem("alvryn_chats")||"[]");
      if (local.length) { setChats(local); }
    } catch {}
    // DB sync
    fetch(`${API}/chats`,{headers:{Authorization:`Bearer ${token}`}})
      .then(r=>r.ok?r.json():null)
      .then(data=>{
        if (!Array.isArray(data)||!data.length) return;
        const mapped = data.map(c=>({
          id:c.chat_id, title:c.title||"New chat",
          messages:(Array.isArray(c.messages)?c.messages:[]),
          time:new Date(c.updated_at||c.created_at).getTime()
        }));
        setChats(mapped);
        localStorage.setItem("alvryn_chats",JSON.stringify(mapped.slice(0,30)));
      }).catch(()=>{});
  }, [token]);

  // Persist chats
  useEffect(() => {
    try { localStorage.setItem("alvryn_chats",JSON.stringify(chats.slice(0,30))); } catch {}
  }, [chats]);

  // Keep backend alive
  useEffect(() => {
    fetch(`${API}/test`).catch(()=>{});
    const t = setInterval(()=>fetch(`${API}/test`).catch(()=>{}), 14*60*1000);
    return ()=>clearInterval(t);
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior:"smooth"});
  }, [messages, loading]);

  // ── Chat management ────────────────────────────────────────────────────────
  const newChat = useCallback(()=>{
    setActiveChatId(null);
    setMessages([]);
    setInput("");
    setSidebarOpen(false);
    setTimeout(()=>inputRef.current?.focus(), 100);
  }, []);

  const loadChat = useCallback((chat)=>{
    setActiveChatId(chat.id);
    setMessages(chat.messages||[]);
    setSidebarOpen(false);
  }, []);

  const deleteChat = useCallback((chatId)=>{
    setChats(prev=>prev.filter(c=>c.id!==chatId));
    if (chatId===activeChatId) { setActiveChatId(null); setMessages([]); }
    if (token) fetch(`${API}/chats/${chatId}`,{method:"DELETE",headers:{Authorization:`Bearer ${token}`}}).catch(()=>{});
  }, [activeChatId, token]);

  const renameChat = useCallback((chatId, newTitle)=>{
    setChats(prev=>prev.map(c=>c.id===chatId?{...c,title:newTitle}:c));
  }, []);

  const saveChat = useCallback((id, msgs, title)=>{
    const chatTitle = title||"New chat";
    setChats(prev=>{
      const ex = prev.find(c=>c.id===id);
      if (ex) return prev.map(c=>c.id===id?{...c,messages:msgs,time:Date.now()}:c);
      return [{id,title:chatTitle,messages:msgs,time:Date.now()},...prev].slice(0,50);
    });
    if (token) {
      fetch(`${API}/chats/${id}`,{
        method:"POST",
        headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},
        body:JSON.stringify({title:chatTitle,messages:msgs.slice(0,100)})
      }).catch(()=>{});
    }
  }, [token]);

  // ── Send message ───────────────────────────────────────────────────────────
  const send = useCallback(async (text)=>{
    const q = (text||input).trim();
    if (!q||loading) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height="auto";

    const id = activeChatId||Date.now().toString();
    if (!activeChatId) setActiveChatId(id);

    const uMsg = {role:"user",content:q,id:Date.now()};
    const next = [...messages, uMsg];
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch(`${API}/ai-chat-v2`,{
        method:"POST",
        headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},
        body:JSON.stringify({
          message:q, history:messages.slice(-6),
          sessionId:sessionRef.current
        }),
      });
      const data = await res.json();
      if (data.sessionId) { sessionRef.current=data.sessionId; sessionStorage.setItem("alvryn_sid",data.sessionId); }

      // Thinking delay 0.8–1.5s
      await new Promise(r=>setTimeout(r, 800+Math.random()*700));

      const aMsg = {
        role:"assistant", id:Date.now()+1,
        text:data.text||"",
        cards:data.cards||[], cta:data.cta||null,
        quickReplies:data.quickReplies||[],
        _onSend:send,
      };
      const final = [...next, aMsg];
      setMessages(final);
      const title = next[0]?.content?.slice(0,44)||(next[0]?.content?.length>44?"…":"");
      saveChat(id, final, title||"New chat");
    } catch {
      const errMsg = {role:"assistant",id:Date.now()+1,
        text:"Sorry, something went wrong. Please try again. 🙏",cards:[],cta:null};
      setMessages([...next, errMsg]);
    }
    setLoading(false);
    setTimeout(()=>inputRef.current?.focus(), 80);
  }, [input, loading, messages, token, activeChatId, saveChat]);

  const handleKey = (e)=>{
    if (e.key==="Enter"&&!e.shiftKey) { e.preventDefault(); send(); }
  };
  const handleInput = (e)=>{
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height="auto";
      textareaRef.current.style.height=Math.min(textareaRef.current.scrollHeight,160)+"px";
    }
  };

  const handleSignOut = ()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const chatTitle = chats.find(c=>c.id===activeChatId)?.title||"";
  const latestAIIdx = messages.reduce((acc,m,i)=>m.role==="assistant"?i:acc,-1);

  // CSS variables depend on dark mode
  const isDark = darkMode;

  return (
    <div data-dark={isDark?"true":"false"}
      style={{display:"flex",height:"100vh",overflow:"hidden",
        fontFamily:"'DM Sans',sans-serif",
        background:isDark?"#0e0c09":CT.bg,
        transition:"background 0.4s"}}>

      {/* ── Global styles ──────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-thumb{background:rgba(201,168,76,0.35);border-radius:3px;}
        @keyframes alvFadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes alvFadeIn{from{opacity:0}to{opacity:1}}
        @keyframes alvGradShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
        @keyframes alvFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes alvPulse{0%,100%{opacity:1}50%{opacity:0.25}}
        @keyframes alvBlink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes alvIconBounce{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-4px) scale(1.1)}}
        @keyframes alvSpin{to{transform:rotate(360deg)}}
        @keyframes alvSlideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        @keyframes alvBackdrop{from{opacity:0}to{opacity:1}}

        /* CSS vars — light */
        :root {
          --alvText1: #1a1410;
          --alvText2: rgba(26,20,10,0.72);
          --alvTextMut: rgba(26,20,10,0.42);
          --alvCard: rgba(255,255,255,0.88);
          --alvInput: rgba(255,255,255,0.95);
          --alvBorder: rgba(201,168,76,0.2);
          --alvSidebar: #1a1508;
        }
        /* CSS vars — dark */
        [data-dark="true"] {
          --alvText1: #f0e8d4;
          --alvText2: rgba(240,232,212,0.72);
          --alvTextMut: rgba(240,232,212,0.4);
          --alvCard: rgba(28,22,12,0.9);
          --alvInput: rgba(28,22,12,0.95);
          --alvBorder: rgba(201,168,76,0.2);
          --alvSidebar: #0e0c07;
        }

        textarea.alvInput { resize:none; outline:none; border:none; background:transparent; }
        textarea.alvInput::placeholder { color:var(--alvTextMut); }

        /* ── Mobile responsive ─────────────────────────────────────────── */
        @media(max-width:768px) {
          .alvDesktopSb { display:none !important; }
        }
        @media(min-width:769px) {
          .alvMobileOnly { display:none !important; }
        }

        /* ── Chip hover handled via JS onMouse ─────────────────────────── */
      `}</style>

      {/* ── MOBILE OVERLAY ─────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div className="alvMobileOnly"
          onClick={()=>setSidebarOpen(false)}
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",
            zIndex:298,animation:"alvBackdrop 0.2s ease"}}/>
      )}

      {/* ── MOBILE BOTTOM SHEET SIDEBAR ───────────────────────────────── */}
      {sidebarOpen && (
        <div className="alvMobileOnly"
          style={{position:"fixed",left:0,right:0,bottom:0,
            height:"85vh",zIndex:299,
            background:"#1a1508",
            borderRadius:"20px 20px 0 0",overflow:"hidden",
            boxShadow:"0 -8px 40px rgba(0,0,0,0.4)",
            animation:"alvSlideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)"}}>
          {/* Drag handle */}
          <div style={{display:"flex",justifyContent:"center",padding:"10px 0 0"}}>
            <div style={{width:36,height:4,borderRadius:2,
              background:"rgba(201,168,76,0.3)"}}/>
          </div>
          <SidebarContent
            chats={chats} activeChatId={activeChatId}
            countryKey={countryKey} token={token} user={user}
            onNewChat={newChat} onLoadChat={loadChat}
            onRenameChat={renameChat} onDeleteChat={deleteChat}
            onSelectCountry={setCountryKey}
            onNavigate={navigate} onSignOut={handleSignOut}
            onClose={()=>setSidebarOpen(false)}
            accentColor={accent}
          />
        </div>
      )}

      {/* ── DESKTOP SIDEBAR ────────────────────────────────────────────── */}
      <div className="alvDesktopSb"
        style={{width:desktopSbOpen?258:0,minWidth:desktopSbOpen?258:0,
          background:"#1a1508",
          borderRight:"1px solid rgba(201,168,76,0.15)",
          overflow:"hidden",transition:"width 0.25s ease, min-width 0.25s ease",
          flexShrink:0,
          boxShadow:desktopSbOpen?"4px 0 24px rgba(0,0,0,0.25)":"none"}}>
        {desktopSbOpen && (
          <SidebarContent
            chats={chats} activeChatId={activeChatId}
            countryKey={countryKey} token={token} user={user}
            onNewChat={newChat} onLoadChat={loadChat}
            onRenameChat={renameChat} onDeleteChat={deleteChat}
            onSelectCountry={setCountryKey}
            onNavigate={navigate} onSignOut={handleSignOut}
            accentColor={accent}
          />
        )}
      </div>

      {/* ── MAIN CHAT AREA ─────────────────────────────────────────────── */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>

        {/* Top bar */}
        <div style={{
          height:56,padding:"0 16px",display:"flex",alignItems:"center",
          justifyContent:"space-between",flexShrink:0,
          background:isDark?"rgba(14,12,9,0.97)":CT.nav,
          backdropFilter:"blur(16px)",
          borderBottom:"1px solid rgba(201,168,76,0.18)",
          transition:"background 0.4s",
        }}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {/* Hamburger — desktop collapses sidebar, mobile opens bottom sheet */}
            <button
              onClick={()=>{ setSidebarOpen(s=>!s); }}
              className="alvMobileOnly"
              style={{width:36,height:36,borderRadius:8,
                background:"transparent",
                border:`1px solid ${accent}28`,cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center",
                color:accent,transition:"all 0.15s",
                WebkitTapHighlightColor:"transparent"}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <button
              onClick={()=>setDesktopSbOpen(s=>!s)}
              className="alvDesktopSb"
              style={{width:36,height:36,borderRadius:8,
                background:"transparent",
                border:`1px solid ${accent}28`,cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center",
                color:accent,transition:"all 0.15s"}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,
              fontSize:16,color:isDark?"#c9a84c":accent,
              overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:200}}>
              {messages.length?"Alvryn AI — "+chatTitle:"Alvryn AI — Travel Assistant"}
            </div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {/* Live indicator */}
            <div style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",
              borderRadius:100,background:`${accent}12`,border:`1px solid #4ade8030`}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:"#4ade80",
                animation:"alvPulse 2s infinite"}}/>
              <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:9,
                color:"#4ade80",letterSpacing:"0.1em",fontWeight:700}}>AI LIVE</span>
            </div>
            {/* Dark mode toggle */}
            <button onClick={()=>setDarkMode&&setDarkMode(!darkMode)}
              style={{padding:"6px 12px",borderRadius:8,
                background:"transparent",border:`1px solid ${accent}28`,
                color:isDark?"#f0d080":accent,fontSize:13,cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif"}}>
              {isDark?"☀️":"🌙"}
            </button>
            {/* New chat */}
            <button onClick={newChat}
              style={{padding:"6px 13px",borderRadius:8,
                background:`${accent}12`,border:`1px solid ${accent}28`,
                color:accent,fontSize:12,fontWeight:600,cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif"}}>
              + New
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",
          padding:"clamp(10px,2vw,20px) clamp(8px,2vw,16px)",
          background:isDark?"rgba(14,12,9,0.6)":CT.msgBg,
          transition:"background 0.4s",minHeight:0}}>
          <div style={{maxWidth:740,margin:"0 auto"}}>
            {messages.length===0 && (
              <EmptyState onChip={send} accent={accent}/>
            )}
            {messages.map((m,i)=>(
              m.role==="user"
                ? <UserMsgBubble key={m.id||i} msg={m} userGrad={CT.userGrad}/>
                : <AIMsgBubble   key={m.id||i} msg={m}
                    isLatest={i===latestAIIdx}
                    accent={accent}/>
            ))}
            {loading && (
              <div style={{display:"flex",gap:12,marginBottom:20,paddingLeft:42,
                animation:"alvFadeIn 0.4s both"}}>
                <ThinkingIndicator accent={accent}/>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>
        </div>

        {/* Input bar */}
        <div style={{padding:"12px 16px 18px",flexShrink:0,
          background:isDark?"rgba(14,12,9,0.97)":CT.nav,
          backdropFilter:"blur(16px)",
          borderTop:"1px solid rgba(201,168,76,0.18)",
          transition:"background 0.4s"}}>
          <div style={{maxWidth:740,margin:"0 auto"}}>
            <div style={{display:"flex",alignItems:"flex-end",gap:10,
              background:"var(--alvInput)",borderRadius:16,padding:"10px 14px",
              border:`1.5px solid rgba(201,168,76,0.22)`,
              transition:"border-color 0.2s,box-shadow 0.2s"}}
              onFocusCapture={e=>{
                e.currentTarget.style.borderColor=`${accent}70`;
                e.currentTarget.style.boxShadow=`0 0 0 3px ${accent}12`;
              }}
              onBlurCapture={e=>{
                e.currentTarget.style.borderColor="rgba(201,168,76,0.22)";
                e.currentTarget.style.boxShadow="none";
              }}>
              <textarea
                ref={el=>{inputRef.current=el;textareaRef.current=el;}}
                className="alvInput"
                value={input}
                onChange={handleInput}
                onKeyDown={handleKey}
                placeholder="Ask anything…"
                rows={1}
                style={{flex:1,fontFamily:"'DM Sans',sans-serif",fontSize:15,
                  color:"var(--alvText1)",lineHeight:1.65,
                  maxHeight:160,overflowY:"auto",paddingTop:2}}
              />
              <button
                onClick={()=>send()}
                disabled={!input.trim()||loading}
                style={{flexShrink:0,width:37,height:37,borderRadius:11,
                  background:input.trim()&&!loading
                    ? `linear-gradient(135deg,${accent},#f0d080,${accent})`
                    : "rgba(255,255,255,0.06)",
                  backgroundSize:"200% 200%",
                  animation:input.trim()&&!loading?"alvGradShift 3s ease infinite":"none",
                  border:"none",cursor:input.trim()&&!loading?"pointer":"default",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:16,transition:"all 0.18s",
                  boxShadow:input.trim()&&!loading?`0 4px 12px ${accent}30`:"none",
                  opacity:loading?0.5:1}}>
                {loading
                  ? <div style={{width:14,height:14,border:"2px solid rgba(255,255,255,0.2)",
                      borderTopColor:"#fff",borderRadius:"50%",
                      animation:"alvSpin 0.8s linear infinite"}}/>
                  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                      stroke={input.trim()?"#1a1410":"#666"} strokeWidth="2.5">
                      <line x1="12" y1="19" x2="12" y2="5"/>
                      <polyline points="5 12 12 5 19 12"/>
                    </svg>
                }
              </button>
            </div>
            <div style={{textAlign:"center",marginTop:7,fontSize:11,
              color:"rgba(201,168,76,0.4)",fontFamily:"'DM Sans',sans-serif"}}>
              Alvryn AI · Flights · Buses · Hotels · Trains · Bookings on partner sites
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}