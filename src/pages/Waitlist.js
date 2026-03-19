import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://cometai-backend.onrender.com";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;800&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #01020a; color: #e8eaf6; font-family: 'DM Sans', sans-serif; min-height: 100vh; overflow-x: hidden; }
  .stars-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; background: radial-gradient(ellipse at 20% 50%, rgba(99,43,200,0.35) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(25,90,220,0.28) 0%, transparent 50%), #01020a; }
  .nebula { position: fixed; inset: 0; z-index: 0; pointer-events: none; background: radial-gradient(ellipse 900px 500px at 5% 70%, rgba(99,43,200,0.12) 0%, transparent 70%); }
  .star { position: absolute; border-radius: 50%; background: white; animation: twinkle var(--d,3s) ease-in-out infinite var(--delay,0s); }
  @keyframes twinkle { 0%,100%{opacity:var(--min-op,.2);transform:scale(1);}50%{opacity:1;transform:scale(1.6);} }
  .shooting-star { position: fixed; top:0; left:0; width:2px; height:2px; background:white; border-radius:50%; pointer-events:none; z-index:2; }
  .shooting-star::after { content:''; position:absolute; top:50%; right:0; transform:translateY(-50%); width:160px; height:1px; background:linear-gradient(90deg,rgba(255,255,255,0),rgba(165,180,252,0.8),white); border-radius:2px; }
  @keyframes shoot { 0%{transform:translate(0,0) rotate(var(--angle));opacity:1;}70%{opacity:1;}100%{transform:translate(var(--tx),var(--ty)) rotate(var(--angle));opacity:0;} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);} }
  @keyframes blink { 0%,100%{opacity:1;}50%{opacity:0.3;} }

  .page { position: relative; z-index: 1; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px; text-align: center; }
  .logo { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; animation: fadeUp 0.6s ease both; }
  .logo-icon { font-size: 26px; filter: drop-shadow(0 0 12px rgba(129,140,248,0.8)); }
  .logo-text { font-family: 'Orbitron', sans-serif; font-size: 20px; font-weight: 800; letter-spacing: 2px; background: linear-gradient(90deg, #818cf8, #c084fc, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .launch-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(99,102,241,0.1); border: 1px solid rgba(129,140,248,0.25); color: #a5b4fc; padding: 8px 18px; border-radius: 20px; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 18px; animation: fadeUp 0.6s ease 0.1s both; }
  .badge-dot { width: 6px; height: 6px; background: #6ee7b7; border-radius: 50%; animation: blink 2s ease infinite; }
  .hero-title { font-family: 'Orbitron', sans-serif; font-size: clamp(26px, 6vw, 52px); font-weight: 800; line-height: 1.1; background: linear-gradient(135deg, #e0e7ff 0%, #a5b4fc 40%, #c084fc 70%, #38bdf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 14px; animation: fadeUp 0.6s ease 0.2s both; }
  .hero-sub { font-size: 15px; color: rgba(180,190,255,0.55); font-weight: 300; max-width: 460px; line-height: 1.7; margin-bottom: 24px; animation: fadeUp 0.6s ease 0.3s both; }

  .ref-preview { width: 100%; max-width: 500px; background: rgba(99,102,241,0.08); border: 1px solid rgba(129,140,248,0.2); border-radius: 16px; padding: 20px 24px; margin-bottom: 20px; animation: fadeUp 0.6s ease 0.35s both; text-align: left; }
  .ref-preview-title { font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: 600; color: #a5b4fc; letter-spacing: 1px; margin-bottom: 14px; text-align: center; }
  .ref-step { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
  .ref-step:last-child { margin-bottom: 0; }
  .ref-step-icon { font-size: 18px; flex-shrink: 0; }
  .ref-step-text { font-size: 13px; color: rgba(165,180,252,0.65); line-height: 1.5; }
  .ref-step-text strong { color: #e0e7ff; }
  .ref-preview-note { font-size: 11px; color: rgba(165,180,252,0.3); margin-top: 14px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.06); text-align: center; }

  .counter { display: flex; align-items: center; gap: 8px; justify-content: center; margin-bottom: 20px; animation: fadeUp 0.6s ease 0.4s both; }
  .avatars { display: flex; }
  .avatar { width: 28px; height: 28px; border-radius: 50%; border: 2px solid #01020a; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 11px; margin-left: -7px; }
  .avatar:first-child { margin-left: 0; }
  .counter-text { font-size: 13px; color: rgba(165,180,252,0.6); }
  .counter-num { color: #a5b4fc; font-weight: 600; }

  .form-wrap { width: 100%; max-width: 500px; animation: fadeUp 0.6s ease 0.45s both; }
  .input-row { display: flex; gap: 8px; background: rgba(255,255,255,0.04); border: 1px solid rgba(129,140,248,0.25); border-radius: 14px; padding: 6px 6px 6px 20px; transition: all 0.2s; margin-bottom: 8px; }
  .input-row:focus-within { border-color: rgba(129,140,248,0.6); box-shadow: 0 0 0 3px rgba(129,140,248,0.1); }
  .email-input { flex: 1; background: transparent; border: none; outline: none; color: #e0e7ff; font-family: 'DM Sans', sans-serif; font-size: 15px; padding: 8px 0; }
  .email-input::placeholder { color: rgba(165,180,252,0.3); }
  .btn-join { background: linear-gradient(135deg, #6366f1, #8b5cf6); border: none; color: white; padding: 12px 22px; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
  .btn-join:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.4); }
  .btn-join:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
  .hint { font-size: 11px; color: rgba(165,180,252,0.3); }
  .error { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: #f87171; padding: 10px 16px; border-radius: 10px; font-size: 13px; margin-bottom: 10px; }

  .success-wrap { width: 100%; max-width: 540px; animation: fadeUp 0.5s ease both; }
  .success-box { background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.2); border-radius: 16px; padding: 20px; margin-bottom: 16px; }
  .success-icon { font-size: 36px; margin-bottom: 8px; }
  .success-title { font-family: 'Orbitron', sans-serif; font-size: 16px; font-weight: 700; color: #6ee7b7; margin-bottom: 6px; }
  .success-sub { font-size: 13px; color: rgba(110,231,183,0.6); }

  .ref-card { background: rgba(99,102,241,0.08); border: 1px solid rgba(129,140,248,0.2); border-radius: 16px; padding: 20px 22px; margin-bottom: 16px; }
  .ref-card-title { font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: 600; color: #a5b4fc; letter-spacing: 1px; margin-bottom: 6px; }
  .ref-card-desc { font-size: 13px; color: rgba(165,180,252,0.5); margin-bottom: 14px; line-height: 1.5; }
  .rewards { display: flex; gap: 10px; margin-bottom: 14px; }
  .reward { flex: 1; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 12px; text-align: center; }
  .reward-amt { font-family: 'Orbitron', sans-serif; font-size: 20px; font-weight: 800; color: #6ee7b7; }
  .reward-lbl { font-size: 11px; color: rgba(165,180,252,0.4); margin-top: 4px; line-height: 1.4; }
  .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
  .stat { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 12px; text-align: center; }
  .stat-val { font-family: 'Orbitron', sans-serif; font-size: 22px; font-weight: 800; color: #e0e7ff; }
  .stat-lbl { font-size: 11px; color: rgba(165,180,252,0.4); margin-top: 3px; }
  .link-row { display: flex; gap: 8px; background: rgba(255,255,255,0.04); border: 1px solid rgba(129,140,248,0.2); border-radius: 10px; padding: 10px 14px; margin-bottom: 14px; }
  .link-text { flex: 1; font-size: 11px; color: #a5b4fc; font-family: monospace; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .btn-copy { background: rgba(99,102,241,0.2); border: 1px solid rgba(129,140,248,0.3); color: #a5b4fc; padding: 6px 12px; border-radius: 8px; font-size: 12px; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
  .btn-copy.done { background: rgba(52,211,153,0.2); border-color: rgba(52,211,153,0.3); color: #6ee7b7; }
  .share-label { font-size: 11px; color: rgba(165,180,252,0.35); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px; }
  .share-btns { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
  .sbtn { display: flex; align-items: center; gap: 6px; padding: 10px 16px; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; border: none; }
  .sbtn:hover { transform: translateY(-1px); }
  .sbtn-wa { background: #25D366; color: white; }
  .sbtn-ig { background: linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888); color: white; }
  .sbtn-tw { background: #1DA1F2; color: white; }
  .sbtn-cp { background: rgba(255,255,255,0.07); color: rgba(165,180,252,0.7); border: 1px solid rgba(255,255,255,0.1) !important; }
  .btn-logout-wl { background: transparent; border: 1px solid rgba(255,255,255,0.08); color: rgba(165,180,252,0.3); padding: 6px 14px; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 11px; cursor: pointer; margin-top: 12px; transition: all 0.2s; }
  .btn-logout-wl:hover { color: #f87171; border-color: rgba(239,68,68,0.3); }

  .lb-wrap { width: 100%; max-width: 480px; margin-top: 24px; animation: fadeUp 0.6s ease 0.5s both; }
  .lb-heading { font-family: 'Orbitron', sans-serif; font-size: 11px; color: rgba(165,180,252,0.35); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; }
  .lb-note { font-size: 11px; color: rgba(165,180,252,0.25); margin-bottom: 8px; }
  .lb-list { background: rgba(15,17,26,0.6); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; overflow: hidden; }
  .lb-item { display: flex; align-items: center; gap: 12px; padding: 11px 16px; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .lb-item:last-child { border-bottom: none; }
  .lb-pos { font-size: 14px; width: 22px; }
  .lb-mail { flex: 1; font-size: 13px; color: #94a3b8; text-align: left; }
  .lb-refs { font-family: 'Orbitron', sans-serif; font-size: 12px; font-weight: 700; color: #6366f1; }

  .feats { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-top: 24px; animation: fadeUp 0.6s ease 0.6s both; }
  .feat { display: flex; align-items: center; gap: 6px; font-size: 12px; color: rgba(165,180,252,0.35); }
  .foot { margin-top: 36px; font-size: 12px; color: rgba(165,180,252,0.2); animation: fadeUp 0.6s ease 0.7s both; }
  .foot a { color: rgba(165,180,252,0.3); text-decoration: none; }

  @media(max-width:480px){
    .input-row { flex-direction: column; padding: 12px 16px; }
    .btn-join { width: 100%; padding: 13px; }
    .rewards { flex-direction: column; }
    .sbtn { padding: 9px 13px; font-size: 12px; }
  }
`;

function Stars() {
  const stars = Array.from({length:100},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,size:Math.random()*2.5+0.3,duration:Math.random()*5+2,delay:Math.random()*6,minOp:Math.random()*0.15+0.05}));
  return <div className="stars-bg">{stars.map(s=><div key={s.id} className="star" style={{left:`${s.x}%`,top:`${s.y}%`,width:s.size,height:s.size,'--d':`${s.duration}s`,'--delay':`${s.delay}s`,'--min-op':s.minOp}}/>)}</div>;
}

function ShootingStars() {
  const [stars, setStars] = useState([]);
  useEffect(() => {
    let id = 0;
    const launch = () => {
      const x=Math.random()*70, y=Math.random()*35, dist=500+Math.random()*300, angle=25+Math.random()*20, rad=(angle*Math.PI)/180;
      const star = {id:id++, x, y, tx:Math.cos(rad)*dist, ty:Math.sin(rad)*dist, angle, dur:700+Math.random()*700};
      setStars(p => [...p, star]);
      setTimeout(() => setStars(p => p.filter(s => s.id !== star.id)), star.dur + 100);
      setTimeout(launch, 1500 + Math.random()*3000);
    };
    const t = setTimeout(launch, 800);
    return () => clearTimeout(t);
  }, []);
  return <>{stars.map(s => <div key={s.id} className="shooting-star" style={{left:`${s.x}%`,top:`${s.y}%`,'--angle':`${s.angle}deg`,'--tx':`${s.tx}px`,'--ty':`${s.ty}px`,animation:`shoot ${s.dur}ms ease-out forwards`}}/>)}</>;
}

function maskEmail(email) {
  if (!email) return "***@***.com";
  const parts = email.split("@");
  if (parts.length < 2) return "***";
  return parts[0].slice(0,2) + "***@" + parts[1];
}

function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success
  const [errorMsg, setErrorMsg] = useState("");
  const [count, setCount] = useState(0);
  const [myData, setMyData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // read URL params ONCE on mount — only used for referral tracking, NOT for restoring session
  const [incomingRef] = useState(() => {
    try {
      const p = new URLSearchParams(window.location.search || "");
      return p.get("ref") || "";
    } catch { return ""; }
  });

  useEffect(() => {
    // fetch count and leaderboard always
    axios.get(`${API}/waitlist/count`).then(r => setCount(r.data.count || 0)).catch(() => setCount(47));
    axios.get(`${API}/waitlist/leaderboard`).then(r => setLeaderboard(r.data || [])).catch(() => {});

    // ONLY restore session from localStorage — never from URL params
    // This means a friend opening your link ALWAYS sees the join form
    const savedEmail = localStorage.getItem("waitlist_email") || "";
    const savedCode = localStorage.getItem("waitlist_code") || "";
    if (savedEmail && savedCode) {
      setMyData({ email: savedEmail, refCode: savedCode, refs: 0 });
      setStatus("success");
      axios.get(`${API}/waitlist/my-refs/${savedCode}`)
        .then(r => setMyData(d => d ? {...d, refs: r.data.count || 0} : d))
        .catch(() => {});
    }
    // If URL has ref but no localStorage → friend is visiting → show join form (do nothing)
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleJoin = async () => {
    if (!email.trim()) { setErrorMsg("Please enter your email address."); return; }
    if (!email.includes("@")) { setErrorMsg("Please enter a valid email address."); return; }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await axios.post(`${API}/waitlist`, {
        email: email.trim().toLowerCase(),
        ref: incomingRef || null
      });
      const data = res.data;
      localStorage.setItem("waitlist_email", email.trim().toLowerCase());
      localStorage.setItem("waitlist_code", data.refCode);
      setMyData({ email: email.trim().toLowerCase(), refCode: data.refCode, refs: 0 });
      setCount(c => c + 1);
      setStatus("success");
      axios.get(`${API}/waitlist/leaderboard`).then(r => setLeaderboard(r.data || [])).catch(() => {});
    } catch (err) {
      if (err.response?.status === 409) {
        const code = err.response.data.refCode;
        if (code) {
          localStorage.setItem("waitlist_email", email.trim().toLowerCase());
          localStorage.setItem("waitlist_code", code);
          setMyData({ email: email.trim().toLowerCase(), refCode: code, refs: 0 });
          setStatus("success");
        } else {
          setErrorMsg("You're already on the waitlist! Check your email for your referral link. 🚀");
          setStatus("idle");
        }
      } else {
        setErrorMsg("Something went wrong. Please try again.");
        setStatus("idle");
      }
    }
  };

  // referral link — only uses ref code, NOT email (so friends see join form)
  const refLink = myData ? `${window.location.origin}/waitlist?ref=${myData.refCode}` : "";

  const copyRefLink = () => { navigator.clipboard.writeText(refLink); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const copyLink2 = () => { navigator.clipboard.writeText(refLink); setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000); };

  const shareWA = () => {
    const msg = encodeURIComponent(`✈️ I joined CometAI — India's AI-powered flight booking!\n\n🎁 Join using my link and get ₹100 off your first flight booking above ₹5,000!\n\n👉 ${refLink}`);
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const shareIG = () => {
    navigator.clipboard.writeText(`✈️ Join CometAI waitlist and get ₹100 off your first flight booking!\n\n👉 ${refLink}`);
    alert("Caption copied!\n\nNow open Instagram → create a Story or Post → paste the caption.");
  };

  const shareTW = () => {
    const msg = encodeURIComponent(`🚀 Just joined CometAI — book flights via AI or WhatsApp, zero fees!\n\nJoin with my link & get ₹100 off your first booking 👇\n${refLink}`);
    window.open(`https://twitter.com/intent/tweet?text=${msg}`, "_blank");
  };

  const handleLogout = () => {
    localStorage.removeItem("waitlist_email");
    localStorage.removeItem("waitlist_code");
    setMyData(null);
    setStatus("idle");
    setEmail("");
  };

  const emoji = (i) => ["🥇","🥈","🥉"][i] || `#${i+1}`;

  return (
    <>
      <style>{styles}</style>
      <Stars/>
      <div className="nebula"/>
      <ShootingStars/>

      <div className="page">
        <div className="logo">
          <span className="logo-icon">☄️</span>
          <span className="logo-text">COMETAI</span>
        </div>

        <div className="launch-badge">
          <div className="badge-dot"/>
          Launching Soon
        </div>

        <h1 className="hero-title">The Future of<br/>Travel Booking</h1>
        <p className="hero-sub">Book flights using AI or WhatsApp. Zero booking fees. India's smartest travel platform is almost here!</p>

        {status !== "success" ? (
          <>
            <div className="ref-preview">
              <div className="ref-preview-title">🎁 Join & Earn Launch Rewards</div>
              <div className="ref-step">
                <span className="ref-step-icon">1️⃣</span>
                <div className="ref-step-text">Join the waitlist — get your <strong>unique referral link</strong> sent to your email instantly</div>
              </div>
              <div className="ref-step">
                <span className="ref-step-icon">2️⃣</span>
                <div className="ref-step-text">Share your link on <strong>WhatsApp, Instagram or Twitter</strong> with friends and family</div>
              </div>
              <div className="ref-step">
                <span className="ref-step-icon">3️⃣</span>
                <div className="ref-step-text">When your friend books any flight above <strong>₹5,000</strong> — <strong>you get ₹150 off</strong> your next booking + <strong>your friend gets ₹100 off</strong> their first booking! Every referral counts — no limit!</div>
              </div>
              <div className="ref-preview-note">📧 Your personal referral link will be emailed right after you join</div>
            </div>

            <div className="counter">
              <div className="avatars">
                {["🧑","👩","👨","🧑","👩"].map((e,i) => <div key={i} className="avatar">{e}</div>)}
              </div>
              <div className="counter-text"><span className="counter-num">{count}+</span> people already joined</div>
            </div>

            <div className="form-wrap">
              {errorMsg && <div className="error">⚠ {errorMsg}</div>}
              <div className="input-row">
                <input
                  className="email-input"
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyPress={e => { if (e.key === "Enter") handleJoin(); }}
                />
                <button className="btn-join" onClick={handleJoin} disabled={status === "loading"}>
                  {status === "loading" ? "Joining..." : "Join & Get Link →"}
                </button>
              </div>
              <div className="hint">🔒 No spam ever. We only email you when CometAI launches.</div>
            </div>
          </>
        ) : (
          <div className="success-wrap">
            <div className="success-box">
              <div className="success-icon">🎉</div>
              <div className="success-title">You're on the list!</div>
              <div className="success-sub">Your referral link was sent to your email. Share it with everyone to earn ₹150 per booking!</div>
            </div>

            <div className="ref-card">
              <div className="ref-card-title">✦ Your Referral Rewards</div>
              <div className="ref-card-desc">
                Share your link — <strong>every person</strong> who joins using your link and books a flight above ₹5,000 earns you ₹150. No limit on how many friends you can refer!
              </div>

              <div className="rewards">
                <div className="reward">
                  <div className="reward-amt">₹150</div>
                  <div className="reward-lbl">You get per referral (no limit!)</div>
                </div>
                <div className="reward">
                  <div className="reward-amt">₹100</div>
                  <div className="reward-lbl">Your friend gets on first booking</div>
                </div>
              </div>

              <div className="stats">
                <div className="stat">
                  <div className="stat-val">{myData?.refs || 0}</div>
                  <div className="stat-lbl">Friends referred</div>
                </div>
                <div className="stat">
                  <div className="stat-val">₹{((myData?.refs || 0) * 150).toLocaleString()}</div>
                  <div className="stat-lbl">Bonus earned</div>
                </div>
              </div>

              <div className="link-row">
                <div className="link-text">{refLink}</div>
                <button className={`btn-copy ${copied?"done":""}`} onClick={copyRefLink}>{copied?"✓ Copied!":"Copy"}</button>
              </div>

              <div className="share-label">Share now & start earning</div>
              <div className="share-btns">
                <button className="sbtn sbtn-wa" onClick={shareWA}>📱 WhatsApp</button>
                <button className="sbtn sbtn-ig" onClick={shareIG}>📸 Instagram</button>
                <button className="sbtn sbtn-tw" onClick={shareTW}>🐦 Twitter</button>
                <button className="sbtn sbtn-cp" onClick={copyLink2}>{linkCopied?"✓ Copied!":"🔗 Copy link"}</button>
              </div>
            </div>

            <button className="btn-logout-wl" onClick={handleLogout}>Not you? Switch account</button>
          </div>
        )}

        {leaderboard.length > 0 && (
          <div className="lb-wrap">
            <div className="lb-heading">🏆 Top Referrers</div>
            <div className="lb-note">Everyone earns ₹150 per referral — this is just for fun!</div>
            <div className="lb-list">
              {leaderboard.slice(0,5).map((item,i) => (
                <div className="lb-item" key={i}>
                  <div className="lb-pos">{emoji(i)}</div>
                  <div className="lb-mail">{maskEmail(item.email)}</div>
                  <div className="lb-refs">{item.ref_count} refs</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="feats">
          <div className="feat">✈️ Real flights</div>
          <div className="feat">🤖 AI search</div>
          <div className="feat">📱 WhatsApp booking</div>
          <div className="feat">💰 Zero fees</div>
        </div>

        <div className="foot">
          <p>© 2026 CometAI Travel · <a href="/">Back to home</a></p>
        </div>
      </div>
    </>
  );
}

export default Waitlist;