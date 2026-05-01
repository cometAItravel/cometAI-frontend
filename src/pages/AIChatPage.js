/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://cometai-backend.onrender.com";

const THINKING_ICONS = ["✈️", "🚌", "🏨", "🚂", "🚗", "✈️"];

const SUGGESTED_PROMPTS = [
  { icon: "✈️", text: "Cheapest flight Bangalore to Delhi tomorrow" },
  { icon: "🚌", text: "Bus Chennai to Hyderabad tonight" },
  { icon: "🏨", text: "Hotels in Goa under ₹2000 per night" },
  { icon: "🚂", text: "Train Delhi to Mumbai this weekend" },
  { icon: "🗺️", text: "Plan a 2-day trip under ₹5000 from Bangalore" },
  { icon: "⚡", text: "Fastest way from Bangalore to Mumbai" },
  { icon: "🌍", text: "Flights to Dubai next month under ₹15000" },
  { icon: "🏖️", text: "Best time to visit Goa — flights + hotels" },
];

const COUNTRY_OPTIONS = [
  { code: "IN", flag: "🇮🇳", label: "India" },
  { code: "US", flag: "🇺🇸", label: "US USA" },
  { code: "AE", flag: "🇦🇪", label: "UAE" },
  { code: "GB", flag: "🇬🇧", label: "UK" },
  { code: "SG", flag: "🇸🇬", label: "Singapore" },
  { code: "AU", flag: "🇦🇺", label: "Australia" },
  { code: "CA", flag: "🇨🇦", label: "Canada" },
];

// ─── Typewriter Hook ─────────────────────────────────────────────────────────
function useTypewriter(text, speed = 18, enabled = true) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!enabled || !text) { setDisplayed(text || ""); setDone(true); return; }
    setDisplayed("");
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(timer); setDone(true); }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed, enabled]);
  return { displayed, done };
}

// ─── Thinking Animation ───────────────────────────────────────────────────────
function ThinkingDots() {
  const [iconIdx, setIconIdx] = useState(0);
  const [dots, setDots] = useState(".");
  useEffect(() => {
    const iconTimer = setInterval(() => setIconIdx(i => (i + 1) % THINKING_ICONS.length), 400);
    const dotsTimer = setInterval(() => setDots(d => d.length >= 3 ? "." : d + "."), 500);
    return () => { clearInterval(iconTimer); clearInterval(dotsTimer); };
  }, []);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 22, transition: "all 0.3s" }}>{THINKING_ICONS[iconIdx]}</span>
      <span style={{ color: "var(--text-muted)", fontSize: 14 }}>Thinking{dots}</span>
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg, isLatestAI }) {
  const isUser = msg.role === "user";
  const { displayed } = useTypewriter(
    isUser ? msg.content : msg.content,
    isUser ? 0 : 14,
    !isUser && isLatestAI
  );
  const text = (!isUser && isLatestAI) ? displayed : msg.content;

  return (
    <div style={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: 16,
    }}>
      {!isUser && (
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "linear-gradient(135deg,#c9a84c,#f0d080)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, marginRight: 8, flexShrink: 0, marginTop: 2,
        }}>A</div>
      )}
      <div style={{
        maxWidth: "75%",
        background: isUser
          ? "linear-gradient(135deg,#c9a84c,#f0d080)"
          : "var(--card-bg)",
        color: isUser ? "#1a1410" : "var(--text-primary)",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        padding: "12px 16px",
        fontSize: 14,
        lineHeight: 1.6,
        border: isUser ? "none" : "1px solid var(--border-color)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}>
        {text}
        {!isUser && isLatestAI && displayed.length < msg.content.length && (
          <span style={{
            display: "inline-block", width: 2, height: 14,
            background: "#c9a84c", marginLeft: 2,
            animation: "blink 1s infinite",
            verticalAlign: "middle",
          }} />
        )}
      </div>
      {isUser && (
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "var(--gold-gradient)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, marginLeft: 8, flexShrink: 0, marginTop: 2,
          color: "#1a1410", fontWeight: 700,
        }}>
          {msg.userName?.[0]?.toUpperCase() || "U"}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AIChatPage({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const [chats, setChats] = useState([]); // [{id, title, messages:[]}]
  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState("IN");
  const [showCountryMenu, setShowCountryMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile bottom sheet
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const activeChat = chats.find(c => c.id === activeChatId);
  const messages = activeChat?.messages || [];

  // Load chats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("alvryn_chats");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setChats(parsed);
        if (parsed.length > 0) setActiveChatId(parsed[0].id);
      } catch {}
    }
  }, []);

  // Save chats
  useEffect(() => {
    if (chats.length > 0) localStorage.setItem("alvryn_chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const createNewChat = useCallback(() => {
    const id = Date.now().toString();
    const newChat = { id, title: "New Chat", messages: [] };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(id);
    setSidebarOpen(false);
    inputRef.current?.focus();
  }, []);

  const deleteChat = useCallback((id, e) => {
    e.stopPropagation();
    setChats(prev => {
      const next = prev.filter(c => c.id !== id);
      if (activeChatId === id) setActiveChatId(next[0]?.id || null);
      return next;
    });
  }, [activeChatId]);

  const buildSystemPrompt = () => {
    const c = COUNTRY_OPTIONS.find(x => x.code === country) || COUNTRY_OPTIONS[0];
    const now = new Date();
    return `You are Alvryn AI — an elite, friendly travel assistant for India's smartest travel platform.

TODAY: ${now.toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
USER COUNTRY: ${c.label} (${c.code})
USER: ${user?.name || "Traveller"}

YOUR EXPERTISE:
- Flights (domestic & international) via Aviasales partner
- Buses across India via RedBus partner  
- Hotels worldwide via Booking.com partner
- Trains via IRCTC
- Trip planning, itineraries, budget travel

RESPONSE RULES:
1. Be warm, smart, conversational — like a knowledgeable travel friend
2. Give SPECIFIC advice (prices, timings, tips) not generic answers
3. For flight searches: always provide Aviasales link format: https://www.aviasales.in/search/[FROM][DDMM][TO]1?marker=714667&sub_id=alvryn_web
4. For bus searches: RedBus link: https://www.redbus.in/bus-tickets/[from]-to-[to]
5. For hotels: Booking.com link: https://www.booking.com/searchresults.html?ss=[city]
6. Always mention approximate prices in INR (₹)
7. For international queries, use aviasales.com instead of .in
8. When user asks about routes, give 2-3 options with pros/cons
9. Use relevant emojis sparingly but effectively
10. If user seems to want to book, provide the affiliate link immediately
11. NEVER say you can't help with travel — always give useful info
12. Keep responses concise but complete (max 200 words unless itinerary)
13. Understand Hindi, Tamil, Telugu, Kannada mixed with English

AFFILIATE LINKS (always include when relevant):
- Flights India: https://www.aviasales.in/search/[FROMCODE][DDMM][TOCODE]1?marker=714667&sub_id=alvryn_web
- Flights International: https://www.aviasales.com/search/[FROMCODE][DDMM][TOCODE]1?marker=714667&sub_id=alvryn_web
- Buses: https://www.redbus.in/bus-tickets/[from-city]-to-[to-city]
- Hotels: https://www.booking.com/searchresults.html?ss=[city-name]`;
  };

  const sendMessage = async (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput("");

    // Ensure active chat
    let chatId = activeChatId;
    if (!chatId) {
      chatId = Date.now().toString();
      const newChat = { id: chatId, title: q.slice(0, 40), messages: [] };
      setChats(prev => [newChat, ...prev]);
      setActiveChatId(chatId);
    }

    // Add user message
    const userMsg = { role: "user", content: q, userName: user?.name };
    setChats(prev => prev.map(c => c.id === chatId ? {
      ...c,
      title: c.messages.length === 0 ? q.slice(0, 40) : c.title,
      messages: [...c.messages, userMsg]
    } : c));

    // Show thinking
    setLoading(true);

    // 1.5s thinking delay for premium feel
    await new Promise(r => setTimeout(r, 1400 + Math.random() * 600));

    try {
      const currentChat = chats.find(c => c.id === chatId);
      const history = (currentChat?.messages || []).map(m => ({
        role: m.role, content: m.content
      }));

      const response = await fetch(`${API}/ai-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message: q,
          history: history,
          systemPrompt: buildSystemPrompt(),
          country,
        }),
      });

      let aiText = "";
      if (response.ok) {
        const data = await response.json();
        aiText = data.reply || data.message || data.response || "";
      }

      if (!aiText) {
        // Intelligent fallback
        aiText = generateSmartFallback(q, country);
      }

      const aiMsg = { role: "assistant", content: aiText, isNew: true };
      setChats(prev => prev.map(c => c.id === chatId ? {
        ...c, messages: [...c.messages, aiMsg]
      } : c));
    } catch (err) {
      const aiMsg = {
        role: "assistant",
        content: generateSmartFallback(q, country),
        isNew: true,
      };
      setChats(prev => prev.map(c => c.id === chatId ? {
        ...c, messages: [...c.messages, aiMsg]
      } : c));
    } finally {
      setLoading(false);
    }
  };

  const generateSmartFallback = (q, country) => {
    const lower = q.toLowerCase();
    const isInternational = country !== "IN";

    // Flight detection
    const flightMatch = lower.match(/flight|fly|✈|plane/i);
    const busMatch = lower.match(/bus|coach|volvo|sleeper/i);
    const hotelMatch = lower.match(/hotel|stay|room|accommodation/i);
    const trainMatch = lower.match(/train|rail|irctc/i);

    const cities = {
      bangalore: "BLR", bengaluru: "BLR", blr: "BLR",
      mumbai: "BOM", bombay: "BOM", bom: "BOM",
      delhi: "DEL", "new delhi": "DEL", del: "DEL",
      chennai: "MAA", madras: "MAA", maa: "MAA",
      hyderabad: "HYD", hyd: "HYD",
      kolkata: "CCU", calcutta: "CCU",
      goa: "GOI", goi: "GOI",
      pune: "PNQ", pnq: "PNQ",
      kochi: "COK", cochin: "COK",
      dubai: "DXB", dxb: "DXB",
      singapore: "SIN", sin: "SIN",
      bangkok: "BKK", bkk: "BKK",
    };

    let fromCode = "BLR", toCode = "DEL";
    let fromCity = "Bangalore", toCity = "Delhi";
    const words = lower.split(/\s+/);
    let found = [];
    for (const w of words) {
      if (cities[w] && found.length < 2) {
        found.push({ city: w.charAt(0).toUpperCase() + w.slice(1), code: cities[w] });
      }
    }
    if (found[0]) { fromCity = found[0].city; fromCode = found[0].code; }
    if (found[1]) { toCity = found[1].city; toCode = found[1].code; }

    const today = new Date();
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    const ddmm = String(tomorrow.getDate()).padStart(2,"0") + String(tomorrow.getMonth()+1).padStart(2,"0");

    if (busMatch) {
      const from = fromCity.toLowerCase().replace(/\s+/g,"-");
      const to = toCity.toLowerCase().replace(/\s+/g,"-");
      return `🚌 **Bus: ${fromCity} → ${toCity}**\n\nHere are some great options:\n\n• **VRL Travels** — AC Sleeper, departs 21:00, arrives 02:30, approx ₹550–850\n• **SRS Travels** — AC Sleeper, departs 22:00, arrives 04:00, approx ₹600–900\n• **KSRTC** — Semi-Sleeper, departs 06:00, arrives 11:30, approx ₹400–600\n\n💡 *Tip: Book 2-3 days in advance for best seats*\n\n👉 Check live availability & book:\nhttps://www.redbus.in/bus-tickets/${from}-to-${to}`;
    }

    if (hotelMatch) {
      const city = (found[0]?.city || toCity).toLowerCase();
      const displayCity = found[0]?.city || toCity;
      return `🏨 **Hotels in ${displayCity}**\n\nGreat options across budgets:\n\n• **Budget (₹800–1500/night)** — OYO, Zostel, Treebo properties\n• **Mid-range (₹2000–4000/night)** — Business hotels, good amenities\n• **Premium (₹5000+/night)** — 4-5 star properties, full service\n\n💡 *Tip: Book directly via Booking.com for free cancellation options*\n\n👉 View all hotels:\nhttps://www.booking.com/searchresults.html?ss=${encodeURIComponent(displayCity)}`;
    }

    if (trainMatch) {
      return `🚂 **Train: ${fromCity} → ${toCity}**\n\nPopular trains on this route:\n\n• **Rajdhani Express** — Fastest, AC only, approx ₹1,200–2,500\n• **Shatabdi Express** — Day train, great for short routes, ₹600–1,500\n• **Express/Mail trains** — Budget option, sleeper ₹200–800, AC ₹600–1,500\n\n💡 *Book 60-120 days in advance on IRCTC for confirmed berths*\n\n👉 Check availability:\nhttps://www.irctc.co.in`;
    }

    const domain = isInternational ? "aviasales.com" : "aviasales.in";
    return `✈️ **Flights: ${fromCity} → ${toCity}**\n\nHere's what I found for you:\n\n• **IndiGo** — Most frequent, lowest fares, approx ₹3,500–6,000\n• **Air India** — Full service, good for families, ₹4,000–8,000\n• **SpiceJet** — Budget option, ₹2,800–5,500\n• **Vistara** — Premium economy, ₹5,000–9,000\n\n📅 *Cheapest days: Tuesday & Wednesday*\n💡 *Book 3-6 weeks ahead for best prices*\n\n👉 Compare live fares & book:\nhttps://www.${domain}/search/${fromCode}${ddmm}${toCode}1?marker=714667&sub_id=alvryn_web`;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const selectedCountry = COUNTRY_OPTIONS.find(c => c.code === country) || COUNTRY_OPTIONS[0];

  // ─── SIDEBAR CONTENT (shared between desktop & mobile) ──────────────────────
  const SidebarContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo */}
      <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid var(--border-color)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "linear-gradient(135deg,#c9a84c,#f0d080)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 900, color: "#1a1410",
          }}>A</div>
          <span style={{ fontWeight: 700, fontSize: 13, color: "var(--text-primary)", letterSpacing: "0.05em" }}>ALVRYN AI</span>
        </div>

        {/* Country Selector */}
        <div style={{ position: "relative" }}>
          <button onClick={() => setShowCountryMenu(!showCountryMenu)} style={{
            width: "100%", padding: "6px 10px",
            background: "var(--input-bg)",
            border: "1px solid var(--border-color)",
            borderRadius: 8, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 12, color: "var(--text-primary)",
          }}>
            <span>{selectedCountry.flag}</span>
            <span style={{ flex: 1, textAlign: "left" }}>{selectedCountry.label}</span>
            <span style={{ color: "var(--text-muted)", fontSize: 10 }}>▼</span>
          </button>
          {showCountryMenu && (
            <div style={{
              position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100,
              background: "var(--card-bg)",
              border: "1px solid var(--border-color)",
              borderRadius: 8, overflow: "hidden",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              marginTop: 4,
            }}>
              {COUNTRY_OPTIONS.map(opt => (
                <button key={opt.code} onClick={() => { setCountry(opt.code); setShowCountryMenu(false); }} style={{
                  width: "100%", padding: "8px 12px",
                  background: country === opt.code ? "rgba(201,168,76,0.15)" : "transparent",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 8,
                  fontSize: 12, color: "var(--text-primary)", textAlign: "left",
                }}>
                  <span>{opt.flag}</span> {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Chat Button */}
      <div style={{ padding: "12px 12px 8px" }}>
        <button onClick={createNewChat} style={{
          width: "100%", padding: "10px 14px",
          background: "linear-gradient(135deg,#c9a84c,#f0d080)",
          border: "none", borderRadius: 10, cursor: "pointer",
          fontWeight: 700, fontSize: 13, color: "#1a1410",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          <span style={{ fontSize: 16 }}>+</span> New Chat
        </button>
      </div>

      {/* Chat History */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
        {chats.length === 0 ? (
          <div style={{ padding: "20px 8px", textAlign: "center", color: "var(--text-muted)", fontSize: 12 }}>
            No chats yet.<br />Start a new conversation!
          </div>
        ) : (
          <>
            <div style={{ fontSize: 10, color: "var(--text-muted)", padding: "8px 8px 4px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Recent</div>
            {chats.map(chat => (
              <div key={chat.id} onClick={() => { setActiveChatId(chat.id); setSidebarOpen(false); }} style={{
                padding: "9px 10px",
                borderRadius: 8,
                cursor: "pointer",
                background: activeChatId === chat.id ? "rgba(201,168,76,0.15)" : "transparent",
                border: activeChatId === chat.id ? "1px solid rgba(201,168,76,0.3)" : "1px solid transparent",
                marginBottom: 2,
                display: "flex", alignItems: "center", gap: 6,
                transition: "all 0.15s",
              }}>
                <span style={{ fontSize: 12, color: "var(--text-muted)", flexShrink: 0 }}>💬</span>
                <span style={{
                  flex: 1, fontSize: 12,
                  color: activeChatId === chat.id ? "#c9a84c" : "var(--text-secondary)",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>{chat.title || "New Chat"}</span>
                <button onClick={(e) => deleteChat(chat.id, e)} style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--text-muted)", fontSize: 12, padding: "0 2px",
                  opacity: 0, flexShrink: 0,
                }}
                  onMouseEnter={e => e.target.style.opacity = 1}
                  onMouseLeave={e => e.target.style.opacity = 0}
                >✕</button>
              </div>
            ))}
          </>
        )}
      </div>

      {/* User Info */}
      <div style={{ padding: "12px", borderTop: "1px solid var(--border-color)" }}>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "linear-gradient(135deg,#c9a84c,#f0d080)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, color: "#1a1410", fontWeight: 700, flexShrink: 0,
            }}>{user.name?.[0]?.toUpperCase()}</div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
            </div>
          </div>
        ) : (
          <button onClick={() => navigate("/login")} style={{
            width: "100%", padding: "8px", marginBottom: 8,
            background: "rgba(201,168,76,0.1)",
            border: "1px solid rgba(201,168,76,0.3)",
            borderRadius: 8, cursor: "pointer",
            fontSize: 12, color: "#c9a84c", fontWeight: 600,
          }}>Sign In</button>
        )}
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => { setDarkMode && setDarkMode(!darkMode); }} style={{
            flex: 1, padding: "6px",
            background: "var(--input-bg)", border: "1px solid var(--border-color)",
            borderRadius: 8, cursor: "pointer", fontSize: 14, color: "var(--text-primary)",
          }}>{darkMode ? "☀️" : "🌙"}</button>
          <button onClick={() => navigate("/search")} style={{
            flex: 1, padding: "6px",
            background: "var(--input-bg)", border: "1px solid var(--border-color)",
            borderRadius: 8, cursor: "pointer", fontSize: 11, color: "var(--text-secondary)",
          }}>Search</button>
          {user && (
            <button onClick={() => { localStorage.clear(); navigate("/login"); }} style={{
              flex: 1, padding: "6px",
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 8, cursor: "pointer", fontSize: 11, color: "#ef4444",
            }}>Sign Out</button>
          )}
        </div>
      </div>
    </div>
  );

  const latestAIIndex = messages.reduce((acc, m, i) => m.role === "assistant" ? i : acc, -1);

  return (
    <div style={{
      display: "flex", height: "100vh", overflow: "hidden",
      background: "var(--page-bg)",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes backdropFade { from{opacity:0} to{opacity:1} }
        
        :root {
          --page-bg: #f5f3ee;
          --card-bg: #ffffff;
          --input-bg: #f9f7f4;
          --border-color: rgba(201,168,76,0.2);
          --text-primary: #1a1410;
          --text-secondary: #555;
          --text-muted: #999;
          --gold-gradient: linear-gradient(135deg,#c9a84c,#f0d080);
          --sidebar-bg: #faf8f4;
        }
        [data-dark="true"] {
          --page-bg: #0f0e0b;
          --card-bg: #1c1a14;
          --input-bg: #242018;
          --border-color: rgba(201,168,76,0.2);
          --text-primary: #f0ead6;
          --text-secondary: #b8a878;
          --text-muted: #6b6040;
          --sidebar-bg: #141210;
        }
        .chat-input:focus { outline: none; }
        .chat-input::placeholder { color: var(--text-muted); }
        .prompt-chip:hover { background: rgba(201,168,76,0.15) !important; transform: translateY(-1px); }
        .sidebar-overlay { animation: backdropFade 0.2s ease; }
        .mobile-sidebar { animation: slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        .msg-appear { animation: fadeIn 0.3s ease; }
        
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-sidebar-trigger { display: none !important; }
        }
      `}</style>

      {/* ─── DESKTOP SIDEBAR ───────────────────────────────────────────── */}
      <div className="desktop-sidebar" style={{
        width: desktopSidebarOpen ? 240 : 0,
        minWidth: desktopSidebarOpen ? 240 : 0,
        background: "var(--sidebar-bg)",
        borderRight: "1px solid var(--border-color)",
        overflow: "hidden",
        transition: "all 0.3s ease",
        flexShrink: 0,
      }}>
        {desktopSidebarOpen && <SidebarContent />}
      </div>

      {/* ─── MOBILE BOTTOM SHEET SIDEBAR ──────────────────────────────── */}
      {sidebarOpen && (
        <>
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            zIndex: 998,
          }} />
          <div className="mobile-sidebar" style={{
            position: "fixed", left: 0, right: 0, bottom: 0,
            height: "85vh", zIndex: 999,
            background: "var(--sidebar-bg)",
            borderRadius: "20px 20px 0 0",
            overflow: "hidden",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.25)",
          }}>
            {/* Drag handle */}
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border-color)" }} />
            </div>
            <SidebarContent />
          </div>
        </>
      )}

      {/* ─── MAIN CHAT AREA ────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* Top Bar */}
        <div style={{
          height: 56,
          display: "flex", alignItems: "center",
          padding: "0 16px", gap: 10,
          background: "var(--card-bg)",
          borderBottom: "1px solid var(--border-color)",
          flexShrink: 0,
        }}>
          {/* Mobile: sidebar trigger */}
          <button className="mobile-sidebar-trigger" onClick={() => setSidebarOpen(true)} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 20, color: "var(--text-primary)", padding: 4,
            display: "flex", alignItems: "center",
          }}>☰</button>

          {/* Desktop: sidebar toggle */}
          <button onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 18, color: "var(--text-muted)", padding: 4,
            display: "flex", alignItems: "center",
          }} className="desktop-sidebar">
            {desktopSidebarOpen ? "◀" : "▶"}
          </button>

          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>
              Alvryn AI — Travel Assistant
            </div>
            <div style={{ fontSize: 11, color: "#4ade80", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
              AI LIVE
            </div>
          </div>

          {/* New chat button top right */}
          <button onClick={createNewChat} style={{
            padding: "6px 14px",
            background: "rgba(201,168,76,0.12)",
            border: "1px solid rgba(201,168,76,0.3)",
            borderRadius: 8, cursor: "pointer",
            fontSize: 12, color: "#c9a84c", fontWeight: 600,
            whiteSpace: "nowrap",
          }}>+ New</button>
        </div>

        {/* ─── Messages Area ─── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px 8px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>

            {/* Empty state */}
            {messages.length === 0 && (
              <div style={{ textAlign: "center", paddingTop: 20, paddingBottom: 24 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: "linear-gradient(135deg,#c9a84c,#f0d080)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, margin: "0 auto 16px",
                  boxShadow: "0 8px 24px rgba(201,168,76,0.3)",
                }}>A</div>
                <h2 style={{
                  fontSize: "clamp(20px,4vw,28px)",
                  fontWeight: 700, color: "#c9a84c",
                  fontFamily: "Georgia, serif", fontStyle: "italic",
                  margin: "0 0 8px",
                }}>Where do you want to go?</h2>
                <p style={{ color: "var(--text-secondary)", fontSize: 13, margin: "0 0 4px" }}>
                  Flights · Buses · Hotels · Trains · Trip planning
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: 12, margin: "0 0 24px" }}>
                  Any language. Any route. Typos? No problem. 😊
                </p>

                {/* Prompt chips */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 10, textAlign: "left",
                }}>
                  {SUGGESTED_PROMPTS.map((p, i) => (
                    <button key={i} className="prompt-chip" onClick={() => sendMessage(p.text)} style={{
                      padding: "12px 14px",
                      background: "var(--card-bg)",
                      border: "1px solid var(--border-color)",
                      borderRadius: 12, cursor: "pointer",
                      textAlign: "left", fontSize: 13,
                      color: "var(--text-secondary)",
                      display: "flex", alignItems: "flex-start", gap: 8,
                      transition: "all 0.2s",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}>
                      <span style={{ fontSize: 16, flexShrink: 0 }}>{p.icon}</span>
                      <span style={{ lineHeight: 1.4 }}>{p.text}</span>
                    </button>
                  ))}
                </div>

                <p style={{ color: "var(--text-muted)", fontSize: 11, marginTop: 20 }}>
                  Alvryn AI · Flights · Buses · Hotels · Trains · Bookings on partner sites
                </p>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, i) => (
              <div key={i} className="msg-appear">
                <MessageBubble
                  msg={msg}
                  isLatestAI={msg.role === "assistant" && i === latestAIIndex && msg.isNew}
                />
              </div>
            ))}

            {/* Thinking animation */}
            {loading && (
              <div className="msg-appear" style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 16 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "linear-gradient(135deg,#c9a84c,#f0d080)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, flexShrink: 0,
                }}>A</div>
                <div style={{
                  padding: "12px 16px",
                  background: "var(--card-bg)",
                  borderRadius: "18px 18px 18px 4px",
                  border: "1px solid var(--border-color)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}>
                  <ThinkingDots />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ─── Input Bar ─── */}
        <div style={{
          padding: "12px 16px 16px",
          background: "var(--card-bg)",
          borderTop: "1px solid var(--border-color)",
          flexShrink: 0,
        }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div style={{
              display: "flex", alignItems: "flex-end", gap: 10,
              background: "var(--input-bg)",
              border: "1.5px solid var(--border-color)",
              borderRadius: 16,
              padding: "8px 8px 8px 16px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              transition: "border-color 0.2s",
            }}
              onFocus={() => {}} // handled by CSS
            >
              <textarea
                ref={inputRef}
                className="chat-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                rows={1}
                style={{
                  flex: 1, border: "none", background: "transparent",
                  resize: "none", fontSize: 14, color: "var(--text-primary)",
                  lineHeight: 1.5, maxHeight: 120, overflowY: "auto",
                  fontFamily: "inherit",
                }}
                onInput={e => {
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: loading || !input.trim()
                    ? "var(--border-color)"
                    : "linear-gradient(135deg,#c9a84c,#f0d080)",
                  border: "none", cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, flexShrink: 0, transition: "all 0.2s",
                  color: "#1a1410",
                }}>
                {loading ? "⏳" : "↑"}
              </button>
            </div>
            <div style={{ textAlign: "center", marginTop: 8, fontSize: 11, color: "var(--text-muted)" }}>
              Alvryn AI · Flights · Buses · Hotels · Trains · Bookings on partner sites
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}