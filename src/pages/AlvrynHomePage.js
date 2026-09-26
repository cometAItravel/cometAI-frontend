/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";

/* ─── CSS ─────────────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700&family=Poiret+One&display=swap');

:root{
  --ink:#0a0a0a;
  --paper:#ffffff;
  --blue:#5B6EE8;
  --blue-dim: rgba(91,110,232,0.10);
  --blue-line: rgba(91,110,232,0.32);
  --amber:#D9743C;
  --amber-dim: rgba(217,116,60,0.10);
  --amber-line: rgba(217,116,60,0.32);
  --sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --display: 'Bricolage Grotesque', sans-serif;
}
*,*::before,*::after{ box-sizing:border-box; margin:0; padding:0; }
html{ scroll-behavior:smooth; }
body{
  background:var(--paper);
  color:var(--ink);
  font-family:var(--sans);
  /* No overflow-x here on purpose — setting it on html/body is a known
     iOS Safari bug that breaks position:fixed elements, causing them to
     scroll away instead of staying pinned. Prevent stray horizontal
     overflow at the source (elements themselves) instead. */
  max-width:100vw;
}

/* ══ INTRO PANEL — rendered as a direct SVG path, not CSS clip-path.
   clip-path:path() has patchy support in mobile/in-app browsers, where
   it silently fails and shows an unclipped black box. Drawing the shape
   directly and tweening its coordinates in JS works everywhere. ══ */
#panel-wrap{
  position:fixed; top:0; left:0; right:0; bottom:0; z-index:100;
  pointer-events:none;
}
#panel-svg{ width:100%; height:100%; display:block; }
#wordmark-wrap{
  position:fixed; top:0; left:0; right:0; bottom:0; z-index:101;
  display:flex; align-items:center; justify-content:center;
  pointer-events:none;
  transition: transform 1.5s cubic-bezier(0.65,0,0.35,1);
  will-change: transform;
  /* Forces a stable GPU compositing layer — without this, fixed-position
     elements can intermittently vanish during momentum scrolling on iOS. */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
#wordmark{
  font-weight:500;
  font-family:'Poiret One', sans-serif;
  letter-spacing:0.14em;
  font-size: clamp(18px, 3vw, 25px);
  color:#ffffff;
  white-space:nowrap;
  text-transform:uppercase;
  clip-path: inset(0 100% 0 0);
  transition: clip-path 4s linear;
}

/* ══ Persistent corner icon ══ */
#corner-icon{
  position:fixed; top:24px; left:28px; z-index:103;
  width:30px; height:30px;
  opacity:0; pointer-events:none;
  transition: opacity 0.5s ease;
}
#corner-icon.visible{ opacity:1; pointer-events:auto; cursor:pointer; }
#corner-icon svg{ width:100%; height:100%; }

.extract-clone{
  position:fixed; z-index:104;
  font-family:'Poiret One', sans-serif;
  font-weight:500;
  color:#ffffff;
  pointer-events:none;
  text-transform:uppercase;
  will-change: transform, opacity;
}

#corner-nav-trigger{
  position:fixed; top:0; left:0; width:220px; height:80px; z-index:99;
  opacity:0; pointer-events:none;
}
#corner-nav-trigger.active{ pointer-events:auto; }
#corner-nav-links{
  position:fixed; top:22px; left:70px; z-index:103;
  display:flex; align-items:center; gap:22px;
  opacity:0; pointer-events:none;
  transition: opacity 0.4s ease;
}
#corner-nav-links.active{ opacity:1; pointer-events:auto; }
#corner-nav-links a, #corner-nav-links button{
  font-family:var(--sans); font-size:12px; font-weight:500;
  color: rgba(10,10,10,0.62); text-decoration:none; background:none; border:none;
  cursor:pointer; transition:color 0.25s ease; white-space:nowrap;
}
#corner-nav-links a:hover, #corner-nav-links button:hover{ color:var(--ink); }

#nav-trigger{
  position:fixed; top:0; left:0; right:0; height:130px; z-index:99;
  opacity:0; pointer-events:none;
}
#nav-links{
  position:fixed; top:0; left:0; right:0; z-index:102;
  display:flex; align-items:center; justify-content:center;
  pointer-events:none; opacity:0;
  transition: opacity 0.5s cubic-bezier(0.16,1,0.3,1);
}
#nav-links.active{ pointer-events:auto; }
.nav-group{ display:flex; align-items:center; gap:26px; }
.nav-group a, .nav-group button{
  font-family:var(--sans); font-size:12px; font-weight:400;
  letter-spacing:0.04em; color:rgba(255,255,255,0.72);
  text-decoration:none; background:none; border:none; cursor:pointer;
  transition:color 0.25s ease; white-space:nowrap;
}
.nav-group a:hover, .nav-group button:hover{ color:#ffffff; }
.nav-spacer{ width:150px; flex-shrink:0; }

/* ══ GREETING ══ */
#greeting{
  position:fixed; top:0; left:0; right:0; bottom:0; z-index:98;
  display:flex; align-items:center; justify-content:center;
  pointer-events:none; opacity:0;
  transition: opacity 1.4s cubic-bezier(0.16,1,0.3,1);
  background:#ffffff;
}
#greeting span{
  font-family:var(--sans); font-weight:400; font-size: clamp(15px, 1.6vw, 18px);
  color: rgba(10,10,10,0.55); letter-spacing:0.01em;
}

/* ══ CONTENT ══ */
#content{
  opacity:0;
  transition: opacity 1.3s cubic-bezier(0.16,1,0.3,1);
}
#content.in{ opacity:1; }

.thesis{
  min-height:100vh; position:relative;
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  text-align:center; padding:120px 6%; overflow:hidden;
}
.thesis h1{
  position:relative; z-index:2;
  font-family:var(--display); font-weight:600;
  font-size: clamp(30px, 5vw, 58px); line-height:1.18; letter-spacing:-0.015em;
  color:var(--ink); max-width:780px;
}
.thesis .sub{
  display:block; margin-top:18px; font-family:var(--display); font-weight:400;
  font-size: clamp(30px, 5vw, 58px); letter-spacing:-0.015em; color: rgba(10,10,10,0.32);
}
.scroll-cue{
  position:relative; z-index:2; margin-top:64px;
  width:14px; height:40px; border-radius:8px;
  border:1px solid rgba(10,10,10,0.16);
  opacity:0; transition:opacity 1s ease 0.4s;
}
.scroll-cue.in{ opacity:1; }
.scroll-cue .drip{
  position:absolute; left:50%; top:6px; width:4px; height:4px;
  border-radius:50%; background:rgba(10,10,10,0.5);
  transform:translateX(-50%);
  animation: drip 1.8s cubic-bezier(0.6,0,0.4,1) infinite;
}
@keyframes drip{
  0%{ top:6px; opacity:1; }
  70%{ top:26px; opacity:1; }
  100%{ top:26px; opacity:0; }
}

.motion-strip{
  height:130px; display:flex; align-items:center;
  overflow:hidden; border-top:1px solid rgba(10,10,10,0.06); border-bottom:1px solid rgba(10,10,10,0.06);
}
.motion-track{ display:flex; align-items:center; gap:64px; animation: marquee 48s linear infinite; }
@keyframes marquee{ from{ transform:translateX(0);} to{ transform:translateX(-50%);} }
.glyph{ flex-shrink:0; width:34px; height:34px; opacity:0.4; animation: float 5s ease-in-out infinite; }
.glyph.blue{ opacity:0.65; }
.glyph.amber{ opacity:0.65; }
@keyframes float{ 0%,100%{ transform:translateY(0);} 50%{ transform:translateY(-7px);} }

/* ══ WORKFORCE — worker card grid ══ */
.workers-section{ padding:130px 6%; background:var(--paper); }
.workers-inner{ max-width:1080px; margin:0 auto; }
.workers-head{ margin-bottom:56px; text-align:center; }
.workers-head .label{
  font-size:11px; font-weight:600; letter-spacing:0.16em; color:var(--blue);
  margin-bottom:20px; text-transform:uppercase;
}
.workers-head h2{
  font-family:var(--display); font-weight:600; font-size: clamp(28px, 3.6vw, 46px);
  letter-spacing:-0.015em; color:var(--ink); max-width:640px; margin:0 auto 18px;
}
.workers-head p{
  font-size:15px; line-height:1.7; color:rgba(10,10,10,0.5); max-width:480px; margin:0 auto;
}

.worker-grid{
  display:grid; grid-template-columns: 1.3fr 1fr 1fr 1fr; gap:20px;
}
@media(max-width:960px){ .worker-grid{ grid-template-columns:1fr 1fr; } }
@media(max-width:600px){ .worker-grid{ grid-template-columns:1fr; } }

.worker-card{
  border:1px solid rgba(10,10,10,0.1); border-radius:8px;
  padding:34px 28px; min-height:250px;
  display:flex; flex-direction:column; justify-content:flex-start;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.worker-card.active{
  border-color:var(--blue-line);
  background: linear-gradient(165deg, var(--blue-dim), transparent 65%);
  box-shadow: 0 20px 50px -30px rgba(91,110,232,0.35);
}
.worker-card.building{ opacity:0.6; }

.worker-tag{
  align-self:flex-start; font-size:9px; font-weight:700; letter-spacing:0.14em;
  padding:5px 11px; border-radius:100px; margin-bottom:24px; text-transform:uppercase;
}
.worker-card.active .worker-tag{ background:var(--blue); color:#ffffff; }
.worker-card.building .worker-tag{ background:rgba(10,10,10,0.07); color:rgba(10,10,10,0.45); }

.worker-card h3{
  font-family:var(--display); font-weight:600; font-size:19px;
  color:var(--ink); margin-bottom:10px; letter-spacing:-0.005em;
}
.worker-card p{
  font-size:13.5px; line-height:1.65; color:rgba(10,10,10,0.5); margin-bottom:22px; flex-grow:1;
}
.worker-card a{
  font-family:var(--sans); font-size:13px; font-weight:600; color:var(--blue);
  text-decoration:none; display:inline-flex; align-items:center; gap:7px; cursor:pointer;
}
.worker-card.building .worker-card-cta{ display:none; }

.how-it-works{
  margin-top:70px; padding-top:56px; border-top:1px solid rgba(10,10,10,0.08);
  display:flex; flex-wrap:wrap; align-items:center; justify-content:center;
  gap:10px; text-align:center;
}
.how-it-works .step{
  font-family:var(--sans); font-size:13px; font-weight:500; color:rgba(10,10,10,0.55);
  background:rgba(10,10,10,0.035); border:1px solid rgba(10,10,10,0.07);
  padding:9px 16px; border-radius:100px; white-space:nowrap;
}
.how-it-works .arrow{ color:rgba(10,10,10,0.25); font-size:13px; }

.philosophy{
  background:var(--ink); color:#ffffff; padding:180px 6%; position:relative; overflow:hidden;
  display:flex; align-items:center; justify-content:center; text-align:center;
}
.philosophy-net{ position:absolute; inset:0; opacity:0.5; pointer-events:none; }
.philosophy p{
  position:relative; z-index:2; font-family:var(--display); font-weight:500;
  font-size: clamp(26px, 4vw, 46px); line-height:1.3; letter-spacing:-0.01em; max-width:820px;
}
.philosophy .tint{ color:#A9B4F5; }

.vision{
  padding:180px 6% 120px; text-align:center; position:relative; overflow:hidden;
}
.vision-horizon{ position:absolute; bottom:0; left:0; right:0; height:260px; pointer-events:none; }
.vision h2{
  position:relative; z-index:2;
  font-family:var(--display); font-weight:700; font-size: clamp(34px, 5.6vw, 68px);
  line-height:1.12; letter-spacing:-0.02em; max-width:900px; margin:0 auto;
}

.closing{
  max-width:640px; margin: 60px auto 120px; border:1px solid rgba(10,10,10,0.14);
  border-top:2px solid; border-image: linear-gradient(90deg, var(--blue), var(--amber)) 1;
  padding: 56px 48px; text-align:center;
}
.closing p{
  font-family:var(--display); font-weight:500; font-size: clamp(18px, 2vw, 23px);
  line-height:1.5; letter-spacing:-0.005em; color:var(--ink);
}

/* ══ GET IN TOUCH — final CTA before footer ══ */
.get-in-touch{
  padding: 40px 6% 200px; text-align:center;
}
.get-in-touch-inner{
  max-width:560px; margin:0 auto; border:1px solid rgba(10,10,10,0.12);
  border-radius:10px; padding:64px 44px; background: linear-gradient(180deg, rgba(91,110,232,0.04), transparent 70%);
}
.get-in-touch .eyebrow{
  font-size:11px; font-weight:600; letter-spacing:0.16em; color:var(--blue);
  text-transform:uppercase; margin-bottom:22px;
}
.get-in-touch h2{
  font-family:var(--display); font-weight:600; font-size: clamp(24px, 3vw, 34px);
  letter-spacing:-0.01em; color:var(--ink); margin-bottom:18px; line-height:1.3;
}
.get-in-touch p{
  font-size:14.5px; line-height:1.7; color:rgba(10,10,10,0.55); max-width:420px; margin:0 auto 34px;
}
.get-in-touch-btn{
  font-family:var(--sans); font-size:14px; font-weight:600; color:#ffffff;
  background:var(--ink); border:none; border-radius:100px; padding:15px 34px;
  cursor:pointer; display:inline-flex; align-items:center; gap:9px;
  transition: transform 0.3s ease, background 0.3s ease;
  text-decoration:none;
}
.get-in-touch-btn:hover{ background:var(--blue); transform:translateY(-2px); }

footer{ background:var(--ink); color:#ffffff; padding:90px 6% 46px; }
.footer-inner{ max-width:1200px; margin:0 auto; }
.footer-word{
  font-family:var(--display); font-weight:700; text-transform:uppercase;
  font-size: clamp(48px, 10vw, 128px); letter-spacing:-0.02em; line-height:0.9; margin-bottom:60px;
}
.footer-cols{ display:flex; justify-content:space-between; flex-wrap:wrap; gap:40px; margin-bottom:60px; }
.footer-col{ display:flex; flex-direction:column; gap:12px; }
.footer-col .head{ font-size:10px; letter-spacing:0.18em; color:rgba(255,255,255,0.32); margin-bottom:8px; }
.footer-col a, .footer-col span, .footer-col button{
  font-family:var(--sans); font-size:13px; color:rgba(255,255,255,0.55); text-decoration:none; cursor:pointer;
  transition:color 0.25s ease; background:none; border:none; text-align:left; padding:0;
}
.footer-col a:hover, .footer-col button:hover{ color:#ffffff; }
.footer-col .static-item{ cursor:default; }
.footer-col .static-item:hover{ color:rgba(255,255,255,0.55); }
.footer-bottom{
  border-top:1px solid rgba(255,255,255,0.08); padding-top:28px;
  display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;
}
.footer-bottom .copy{ font-size:11px; color:rgba(255,255,255,0.28); }
#replay-btn{
  display:flex; align-items:center; gap:8px; background:rgba(255,255,255,0.06);
  border:1px solid rgba(255,255,255,0.14); color:rgba(255,255,255,0.7);
  font-family:var(--sans); font-size:12px; padding:9px 18px; border-radius:100px;
  cursor:pointer; transition:all 0.3s ease;
}
#replay-btn:hover{ background:rgba(255,255,255,0.12); color:#ffffff; }

/* ══ MODAL ══ */
.modal-overlay{
  position:fixed; inset:0; z-index:200;
  background:rgba(10,10,10,0.75);
  backdrop-filter:blur(6px);
  display:flex; align-items:center; justify-content:center;
  padding:24px;
  animation: modalFadeIn 0.3s ease both;
}
@keyframes modalFadeIn{ from{ opacity:0; } to{ opacity:1; } }
.modal-card{
  background:#ffffff; border-radius:4px;
  max-width:600px; width:100%; max-height:80vh; overflow-y:auto;
  padding:56px 48px; position:relative;
  animation: modalSlideUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes modalSlideUp{ from{ opacity:0; transform:translateY(16px); } to{ opacity:1; transform:translateY(0); } }
.modal-close{
  position:absolute; top:24px; right:24px;
  width:32px; height:32px; border-radius:50%;
  background:rgba(10,10,10,0.05); border:none; cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  color:rgba(10,10,10,0.5); font-size:16px;
  transition:all 0.2s ease;
}
.modal-close:hover{ background:rgba(10,10,10,0.1); color:var(--ink); }
.modal-label{
  font-family:var(--sans); font-size:10px; font-weight:600; letter-spacing:0.18em;
  color:var(--blue); margin-bottom:14px;
}
.modal-card h2{
  font-family:var(--display); font-weight:600; font-size:28px;
  letter-spacing:-0.01em; color:var(--ink); margin-bottom:24px;
}
.modal-body{
  font-family:var(--sans); font-size:14px; line-height:1.85;
  color:rgba(10,10,10,0.6); white-space:pre-line;
}

/* ══ RESPONSIVE — tablet ══ */
@media(max-width:860px){
  .workers-section{ padding:90px 6%; }
  .philosophy{ padding:120px 6%; }
  .vision{ padding:120px 6% 90px; }
  .closing{ margin:40px auto 100px; padding:44px 32px; }
  .get-in-touch{ padding:20px 6% 140px; }
  .get-in-touch-inner{ padding:48px 32px; }
}

/* ══ RESPONSIVE — phone ══ */
@media(max-width:600px){
  .thesis{ padding:100px 6% 80px; min-height:90vh; }
  .workers-section{ padding:70px 6%; }
  .workers-head{ margin-bottom:40px; }
  .how-it-works{ margin-top:44px; padding-top:36px; }
  .philosophy{ padding:90px 6%; }
  .vision{ padding:90px 6% 70px; }
  .closing{ margin:30px auto 70px; padding:36px 24px; }
  .get-in-touch{ padding:10px 6% 100px; }
  .get-in-touch-inner{ padding:40px 24px; }
  .footer-cols{ gap:32px; }
  .footer-word{ margin-bottom:40px; }

  /* Nav: tighter gaps so links fit inside the narrower header dip */
  .nav-group{ gap:14px; }
  .nav-group a, .nav-group button{ font-size:11px; }
  .nav-spacer{ width:100px !important; }

  #corner-nav-links{ gap:12px; left:56px; }
  #corner-nav-links a, #corner-nav-links button{ font-size:11px; }

  /* Modal: full-width feeling, less padding, taller scroll area */
  .modal-card{ padding:36px 24px; max-height:85vh; }
  .modal-card h2{ font-size:22px; }
  .modal-close{ top:16px; right:16px; }
}

@media(max-width:380px){
  .nav-group{ gap:10px; }
  #corner-nav-links{ gap:8px; left:48px; }
}
`;

/* ─── MAIN ────────────────────────────────────────────────────────────────── */
export default function AlvrynHomePage() {
  const [modal, setModal] = useState(null);

  // ══ MAINTENANCE MODE — replaces the countdown gate ══
  const MAINTENANCE_ENABLED = true;
  const BYPASS_SECRET = "alvryn2026access";
  const [maintBypass, setMaintBypass] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("access") === BYPASS_SECRET) {
      localStorage.setItem("alvryn_maint_bypass", "true");
    }
    setMaintBypass(localStorage.getItem("alvryn_maint_bypass") === "true");
  }, []);

  const maintenanceActive = MAINTENANCE_ENABLED && !maintBypass;
  // ══ END MAINTENANCE STATE ══

  const ABOUT = `Alvryn is a technology company building digital workers for business operations.

We don't build tools people have to operate all day. We build software that takes over the process itself — reading documents, checking them against the rules that matter, and only bringing in a person when a real decision needs to be made.

Our first worker handles invoice and accounts payable operations: reading incoming invoices, matching them against purchase orders, flagging anything that doesn't line up, and routing exceptions to the right person — instead of a team doing that by hand every day.

Alvryn was founded on the belief that repetitive back-office work is exactly the kind of work software should be doing, with people making the decisions that actually require judgment. We move deliberately — starting with one process done extremely well, rather than a long list of half-built features.

We are a small team with a long-term vision: one company, one platform, and over time, many digital workers.`;

  const PRIVACY = `Alvryn is committed to handling your information and your business data with the same care we put into every product we build. We collect only what is necessary to provide and improve our services. We do not sell your data, we do not share it with advertisers, and we do not use it to build profiles for third parties.

Documents and data submitted for processing — such as invoices, purchase orders, or related business records — are used solely to perform the workflow you've asked Alvryn to handle. They are stored securely and are never used to train models without your explicit consent.

You may request access to your data or request its permanent deletion at any time by contacting us at hellothealvryn@gmail.com. We will respond within 30 days. All data in transit and at rest is protected using industry-standard encryption.

We use functional cookies only — for session management and basic analytics that help us understand how to improve our products. We do not use third-party advertising cookies.

This policy applies to all products under the Alvryn umbrella. We will notify you of any material changes via email or in-product notice before they take effect.`;

  const TERMS = `By accessing or using any Alvryn product, you agree to these terms. If you do not agree, please do not use our services.

Alvryn products are designed for legitimate business use. You may not use our products to engage in illegal activity, harm others, or attempt to reverse-engineer or disrupt our systems.

Alvryn Workforce provides software that assists with business operations, including document processing and workflow automation. It is designed to reduce manual work, not to replace human judgment. Any output — including matches, mismatches, or recommended actions — should be reviewed by an authorized person before being acted on, particularly where payments, approvals, or legal obligations are involved.

Content generated or extracted by Alvryn's automated systems may occasionally be inaccurate or incomplete. Always verify important information independently before relying on it. We continuously work to improve accuracy and reliability.

These terms are governed by Indian law. Any disputes shall be resolved under the jurisdiction of Indian courts. We reserve the right to update these terms with reasonable notice.`;

  const CONTACT = `We read every message. Response times are typically within 48 hours.

General enquiries and privacy questions: hellothealvryn@gmail.com

If you're a business dealing with meaningful invoice or document volume and want to explore Alvryn Workforce early, tell us a little about your current process when you write in — it helps us understand if and how we can help.

We don't have a support phone line. Email is the fastest way to reach us, and it gives us a record of your issue so we can solve it properly.

If you're a journalist, researcher or potential partner, include a brief description of who you are and what you're looking for. We'll get back to you.`;

  const MODAL_CONTENT = {
    about: { title: "About Alvryn", body: ABOUT },
    privacy: { title: "Privacy Policy", body: PRIVACY },
    terms: { title: "Terms of Use", body: TERMS },
    contact: { title: "Contact", body: CONTACT },
  };

  function Modal({ id, onClose }) {
    const { title, body } = MODAL_CONTENT[id];
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
          <div className="modal-label">ALVRYN</div>
          <h2>{title}</h2>
          <div className="modal-body">{body}</div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    document.title = "Alvryn Workforce — Digital Workers for Business Operations";
  }, []);

  useEffect(() => {
    // Guard: while the maintenance screen is showing, none of the elements
    // this effect looks for (#motion-track, #panel-path, #wordmark, etc.)
    // exist in the DOM yet — this effect only has real work to do once the
    // actual page is mounted. Depending on maintenanceActive (instead of []
    // ) means this effect correctly re-runs the moment maintenance clears,
    // rather than running once too early and silently finding nothing.
    if (maintenanceActive) return;

    // ── Motion strip glyphs ──
    const glyphSVGs = [
      '<svg viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" stroke-width="1.4"><path d="M4 16 C4 8, 12 4, 20 8"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" stroke-width="1.4"><circle cx="12" cy="12" r="7"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="#D9743C" stroke-width="1.6" class="amber-glyph"><circle cx="6" cy="18" r="1.6" fill="#D9743C"/><circle cx="18" cy="6" r="1.6" fill="#D9743C"/><path d="M6 18 L18 6" stroke-dasharray="1 4"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" stroke-width="1.4"><line x1="4" y1="12" x2="20" y2="12"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="#5B6EE8" stroke-width="1.6" class="blue-glyph"><path d="M4 15 C4 9, 9 5, 15 6 C 19 7, 20 11, 18 15"/><path d="M8 14 C8 11, 11 9, 14 10" opacity="0.6"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" stroke-width="1.4"><rect x="6" y="6" width="12" height="12" transform="rotate(45 12 12)"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" stroke-width="1.4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" stroke-width="1.4"><path d="M5 12 C 9 6, 15 6, 19 12"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" stroke-width="1.4"><polygon points="12,5 19,18 5,18"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" stroke-width="1.4"><circle cx="12" cy="12" r="3"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" stroke-width="1.4"><path d="M6 8 L18 8 M6 12 L18 12 M6 16 L13 16"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="#D9743C" stroke-width="1.5" class="amber-glyph"><rect x="5" y="6" width="14" height="12" rx="1.5"/><path d="M5 10 L19 10"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="#5B6EE8" stroke-width="1.4" class="blue-glyph"><path d="M4 12 L9 17 L20 6"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" stroke-width="1.4"><path d="M12 4 L13 10 L19 11 L13 12 L12 18 L11 12 L5 11 L11 10 Z"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" stroke-width="1.4"><polygon points="12,3 20,8 20,16 12,21 4,16 4,8"/></svg>'
    ];
    const track = document.getElementById('motion-track');
    if (track) {
      track.innerHTML = '';
      const seq = glyphSVGs.concat(glyphSVGs);
      seq.forEach((svg, i) => {
        const d = document.createElement('div');
        d.className = 'glyph';
        d.innerHTML = svg;
        d.style.animationDelay = (i % 7) * 0.6 + 's';
        track.appendChild(d);
      });
    }

    let panelPathEl, panelWrap, wordWrap, word, W, H, edgeH, dipH, dipHalfW, cx, initialPath, finalPath;
    let navArmed = false;
    let extracted = false;

    function panelPath(edgeHeight, dipDepth, halfW, width) {
      const c = cx;
      return "M 0 0 " +
        "L " + width + " 0 " +
        "L " + width + " " + edgeHeight + " " +
        "L " + (c + halfW) + " " + edgeHeight + " " +
        "C " + (c + halfW * 0.7) + " " + edgeHeight + ", " + (c + halfW * 0.45) + " " + dipDepth + ", " + (c + halfW * 0.32) + " " + dipDepth + " " +
        "L " + (c - halfW * 0.32) + " " + dipDepth + " " +
        "C " + (c - halfW * 0.45) + " " + dipDepth + ", " + (c - halfW * 0.7) + " " + edgeHeight + ", " + (c - halfW) + " " + edgeHeight + " " +
        "L 0 " + edgeHeight + " Z";
    }

    function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

    // Draws the shape directly and animates it by tweening the underlying
    // numbers frame by frame — no CSS clip-path involved anywhere, so this
    // works the same on every browser instead of depending on clip-path
    // support (which many in-app/mobile browsers lack).
    let activeTween = null;
    function tweenPanel(fromParams, toParams, duration, onDone) {
      if (activeTween) cancelAnimationFrame(activeTween);
      const start = performance.now();
      function frame(now) {
        const t = Math.min(1, (now - start) / duration);
        const e = easeInOutCubic(t);
        const eh = fromParams.edgeH + (toParams.edgeH - fromParams.edgeH) * e;
        const dh = fromParams.dipH + (toParams.dipH - fromParams.dipH) * e;
        const dw = fromParams.dipHalfW + (toParams.dipHalfW - fromParams.dipHalfW) * e;
        panelPathEl.setAttribute('d', panelPath(eh, dh, dw, toParams.width));
        if (t < 1) {
          activeTween = requestAnimationFrame(frame);
        } else {
          activeTween = null;
          if (onDone) onDone();
        }
      }
      activeTween = requestAnimationFrame(frame);
    }

    function resetExtraction() {
      extracted = false;
      const cornerIcon = document.getElementById('corner-icon');
      const cornerNavTrigger = document.getElementById('corner-nav-trigger');
      const cornerNavLinks = document.getElementById('corner-nav-links');
      cornerIcon.classList.remove('visible');
      cornerNavTrigger.classList.remove('active');
      cornerNavLinks.classList.remove('active');
      document.querySelectorAll('.extract-clone').forEach((el) => el.remove());
      panelWrap.style.opacity = '1';
      wordWrap.style.opacity = '1';
      panelWrap.style.pointerEvents = '';
      document.getElementById('nav-trigger').style.pointerEvents = 'auto';
    }

    function runIntro() {
      settled = false;
      panelPathEl = document.getElementById('panel-path');
      panelWrap = document.getElementById('panel-wrap');
      wordWrap = document.getElementById('wordmark-wrap');
      word = document.getElementById('wordmark');
      const content = document.getElementById('content');
      const greeting = document.getElementById('greeting');

      W = document.documentElement.clientWidth;
      H = (window.visualViewport && window.visualViewport.height) || window.innerHeight;
      edgeH = 6;
      dipH = Math.max(46, Math.min(0.062 * W, 62));
      dipHalfW = Math.max(90, Math.min(0.14 * W, 200, W * 0.42));
      cx = W / 2;
      initialPath = panelPath(H, H, dipHalfW, W);
      finalPath = panelPath(edgeH, dipH, dipHalfW, W);

      resetExtraction();

      if (activeTween) cancelAnimationFrame(activeTween);
      panelPathEl.setAttribute('d', initialPath);
      wordWrap.style.transition = 'none';
      wordWrap.style.transform = 'translateY(0)';
      word.style.transition = 'none';
      word.style.clipPath = 'inset(0 100% 0 0)';
      content.classList.remove('in');
      greeting.style.transition = 'none';
      greeting.style.opacity = '0';
      greeting.style.pointerEvents = 'none';
      document.getElementById('scroll-cue').classList.remove('in');
      window.scrollTo(0, 0);

      void wordWrap.offsetWidth;

      wordWrap.style.transition = 'transform 1.5s cubic-bezier(0.65,0,0.35,1)';

      const initialCenterY = H / 2;
      const finalCenterY = dipH * 0.42;
      const deltaY = finalCenterY - initialCenterY;

      requestAnimationFrame(() => {
        word.style.transition = 'clip-path 1.5s cubic-bezier(0.3,0,0.6,1)';
        word.style.clipPath = 'inset(0 62% 0 0)';
      });
      setTimeout(() => {
        word.style.transition = 'clip-path 2.3s cubic-bezier(0.4,0,0.2,1)';
        word.style.clipPath = 'inset(0 0% 0 0)';
      }, 1550);

      const wipeFinishesAt = 1550 + 2300;
      const pause = 450;
      const liftAt = wipeFinishesAt + pause;

      const liftDuration = 1500;

      setTimeout(() => {
        tweenPanel(
          { edgeH: H, dipH: H, dipHalfW },
          { edgeH, dipH, dipHalfW, width: W },
          liftDuration
        );
        wordWrap.style.transform = 'translateY(' + deltaY + 'px)';
      }, liftAt);

      const settledAt = liftAt + liftDuration;

      setTimeout(() => {
        greeting.style.transition = 'opacity 1.4s cubic-bezier(0.16,1,0.3,1)';
        armHoverNav();
        showGreeting();
        armExtractionOnScroll();
        settled = true;
      }, settledAt + 250);
    }

    function armExtractionOnScroll() {
      function onScroll() {
        if (extracted) return;
        if (window.scrollY > window.innerHeight * 0.55) {
          extracted = true;
          window.removeEventListener('scroll', onScroll);
          runExtraction();
        }
      }
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    function runExtraction() {
      const letterA = word.querySelector('[data-letter="A"]');
      const letterY = word.querySelector('[data-letter="Y"]');
      const aRect = letterA.getBoundingClientRect();
      const yRect = letterY.getBoundingClientRect();
      const fontSize = parseFloat(getComputedStyle(word).fontSize);

      const iconTargetX = 28 + 15;
      const iconTargetY = 24 + 15;
      const targetScale = 0.5;

      function makeClone(rect, text) {
        const el = document.createElement('div');
        el.className = 'extract-clone';
        el.textContent = text;
        el.style.left = rect.left + 'px';
        el.style.top = rect.top + 'px';
        el.style.fontSize = fontSize + 'px';
        el.style.transform = 'translate(0,0) scale(1)';
        el.style.transformOrigin = 'top left';
        el.style.opacity = '1';
        document.body.appendChild(el);
        return el;
      }

      const cloneA = makeClone(aRect, 'A');
      const cloneY = makeClone(yRect, 'Y');

      requestAnimationFrame(() => {
        const dxA = iconTargetX - (aRect.left + aRect.width / 2);
        const dyA = iconTargetY - (aRect.top + aRect.height / 2);
        const dxY = iconTargetX - (yRect.left + yRect.width / 2);
        const dyY = iconTargetY - (yRect.top + yRect.height / 2);

        cloneA.style.transition = 'transform 1.1s cubic-bezier(0.5,0,0.15,1), opacity 0.3s ease 0.85s';
        cloneY.style.transition = 'transform 1.1s cubic-bezier(0.5,0,0.15,1), opacity 0.3s ease 0.85s';
        cloneA.style.transform = 'translate(' + dxA + 'px,' + dyA + 'px) scale(' + targetScale + ')';
        cloneY.style.transform = 'translate(' + dxY + 'px,' + dyY + 'px) scale(' + targetScale + ')';
        cloneA.style.opacity = '0';
        cloneY.style.opacity = '0';
      });

      setTimeout(() => {
        document.getElementById('corner-icon').classList.add('visible');
      }, 950);

      setTimeout(() => {
        cloneA.remove();
        cloneY.remove();
        armCornerNav();
      }, 1250);
    }

    function armCornerNav() {
      const trigger = document.getElementById('corner-nav-trigger');
      const links = document.getElementById('corner-nav-links');
      trigger.classList.add('active');
      function open() { links.classList.add('active'); }
      function close(e) { if (e && links.contains(e.relatedTarget)) return; links.classList.remove('active'); }
      trigger.addEventListener('mouseenter', open);
      trigger.addEventListener('mouseleave', close);
      links.addEventListener('mouseleave', (e) => { if (trigger.contains(e.relatedTarget)) return; links.classList.remove('active'); });

      // Touch devices have no hover — tap the icon area to toggle instead.
      let tapOpen = false;
      trigger.addEventListener('click', () => {
        tapOpen = !tapOpen;
        if (tapOpen) open(); else close();
      });
    }

    function armHoverNav() {
      if (navArmed) return;
      navArmed = true;
      const trigger = document.getElementById('nav-trigger');
      const navLinks = document.getElementById('nav-links');
      trigger.style.pointerEvents = 'auto';
      const hoverHalfW = Math.min(0.30 * W, 420, W * 0.44);
      const hoverDipH = dipH + 4;
      navLinks.style.height = hoverDipH + 'px';

      const actualWordWidth = word.getBoundingClientRect().width;
      document.querySelector('.nav-spacer').style.width = (actualWordWidth + 56) + 'px';

      function openNav() {
        tweenPanel(
          { edgeH, dipH, dipHalfW },
          { edgeH, dipH: hoverDipH, dipHalfW: hoverHalfW, width: W },
          400
        );
        navLinks.classList.add('active');
        navLinks.style.opacity = '1';
      }
      function closeNav() {
        tweenPanel(
          { edgeH, dipH: hoverDipH, dipHalfW: hoverHalfW },
          { edgeH, dipH, dipHalfW, width: W },
          350
        );
        navLinks.classList.remove('active');
        navLinks.style.opacity = '0';
      }
      trigger.addEventListener('mouseenter', openNav);
      trigger.addEventListener('mouseleave', (e) => { if (navLinks.contains(e.relatedTarget)) return; closeNav(); });
      navLinks.addEventListener('mouseleave', (e) => { if (trigger.contains(e.relatedTarget)) return; closeNav(); });
      let open = false;
      trigger.addEventListener('click', () => { open = !open; if (open) openNav(); else closeNav(); });
    }

    function showGreeting() {
      const hour = new Date().getHours();
      let text;
      if (hour >= 0 && hour < 5) text = "It's very late where you are.";
      else if (hour < 8) text = "Early start today.";
      else if (hour < 12) text = "Good morning.";
      else if (hour < 17) text = "Good afternoon.";
      else if (hour < 21) text = "Good evening.";
      else text = "It's late where you are.";

      const greeting = document.getElementById('greeting');
      document.getElementById('greeting-text').textContent = text;
      greeting.style.opacity = '1';

      const holdDuration = 2600;
      const fadeOutDuration = 1000;

      setTimeout(() => {
        greeting.style.opacity = '0';
        greeting.style.pointerEvents = 'none';
      }, holdDuration);

      setTimeout(() => {
        document.getElementById('content').classList.add('in');
        setTimeout(() => { document.getElementById('scroll-cue').classList.add('in'); }, 600);
      }, holdDuration + fadeOutDuration - 300);
    }

    const replayBtn = document.getElementById('replay-btn');
    replayBtn?.addEventListener('click', runIntro);

    // Mobile browsers (especially iOS Safari) resize the viewport as the
    // address bar collapses right around page load — measuring before that
    // settles throws off every shape/position calculation. A short delay
    // lets the real viewport size stabilize first.
    const startTimer = setTimeout(runIntro, 200);

    // If the viewport still changes after things have settled (address bar
    // collapsing mid-scroll is the common case), quietly correct the header
    // shape and wordmark position instead of leaving them stranded.
    let settled = false;
    let resizeTimer;
    function handleResize() {
      if (!settled || !panelPathEl || !wordWrap || !word) return;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (activeTween) cancelAnimationFrame(activeTween);
        W = document.documentElement.clientWidth;
        H = (window.visualViewport && window.visualViewport.height) || window.innerHeight;
        edgeH = 6;
        dipH = Math.max(46, Math.min(0.062 * W, 62));
        dipHalfW = Math.max(90, Math.min(0.14 * W, 200, W * 0.42));
        cx = W / 2;
        finalPath = panelPath(edgeH, dipH, dipHalfW, W);
        panelPathEl.setAttribute('d', finalPath);

        const finalCenterY = dipH * 0.42;
        const deltaY = finalCenterY - (H / 2);
        wordWrap.style.transition = 'none';
        wordWrap.style.transform = 'translateY(' + deltaY + 'px)';
      }, 150);
    }
    window.addEventListener('resize', handleResize);
    if (window.visualViewport) window.visualViewport.addEventListener('resize', handleResize);

    return () => {
      replayBtn?.removeEventListener('click', runIntro);
      clearTimeout(startTimer);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) window.visualViewport.removeEventListener('resize', handleResize);
    };
  }, [maintenanceActive]);

  const scrollToId = (id) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const CONTACT_MAILTO = "mailto:hellothealvryn@gmail.com?subject=Alvryn%20Workforce%20%E2%80%94%20Invoice%20Operations&body=Hi%20Alvryn%20team%2C%0A%0AWe'd%20like%20to%20learn%20more%20about%20Invoice%20Operations.%0A%0ACompany%3A%0AApprox.%20invoices%2Fmonth%3A%0ACurrent%20process%3A%0A";

  // ══ MAINTENANCE RENDER — returns early, existing page return below is untouched ══
  if (maintenanceActive) {
    return (
      <div style={{
        position:"fixed", inset:0, background:"#ffffff", color:"#0a0a0a",
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        textAlign:"center", padding:24, fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}>
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.22em", textTransform:"uppercase", opacity:0.4, marginBottom:24 }}>Alvryn</div>
        <div style={{ fontWeight:300, fontSize:"clamp(26px,5vw,44px)", lineHeight:1.3, marginBottom:16, maxWidth:520 }}>
          We're currently down for maintenance.
        </div>
        <p style={{ fontSize:14, opacity:0.5, maxWidth:380, lineHeight:1.6 }}>
          Alvryn is temporarily unavailable while we work on something behind the scenes. Please check back soon.
        </p>
      </div>
    );
  }
  // ══ END MAINTENANCE RENDER ══

  return (
    <>
      <style>{CSS}</style>
      {modal && <Modal id={modal} onClose={() => setModal(null)} />}

      <div id="panel-wrap">
        <svg id="panel-svg">
          <path id="panel-path" fill="#0a0a0a"></path>
        </svg>
      </div>
      <div id="wordmark-wrap">
        <div id="wordmark">
          <span data-letter="A">A</span><span data-letter="L">L</span><span data-letter="V">V</span><span data-letter="R">R</span><span data-letter="Y">Y</span><span data-letter="N">N</span>
        </div>
      </div>

      <div id="corner-icon" onClick={() => scrollToId('top')}>
        <svg viewBox="0 0 100 100">
          <path fill="#0a0a0a" d="
            M 26,82
            C 30,64 36,38 45,20
            C 47,15 51,15 54,19
            C 60,28 66,42 70,54
            C 74,60 78,58 82,58
            C 84,58 85,60 85,64
            C 85,70 83,73 78,73
            C 74,73 70,72 66,70
            C 62,68 58,62 55,54
            C 52,46 50,40 48,30
            C 47,26 45,24 43,25
            C 38,30 33,42 30,56
            C 28,64 27,72 26,82
            Z"/>
        </svg>
      </div>
      <div id="corner-nav-trigger"></div>
      <div id="corner-nav-links">
        <button onClick={() => scrollToId('top')}>Home</button>
        <button onClick={() => scrollToId('products')}>Workforce</button>
        <button onClick={() => scrollToId('about')}>About</button>
        <button onClick={() => scrollToId('vision')}>Vision</button>
        <button aria-label="Search">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>
      </div>

      <div id="nav-trigger"></div>
      <div id="nav-links">
        <div className="nav-group">
          <button onClick={() => scrollToId('top')}>Home</button>
          <button onClick={() => scrollToId('products')}>Workforce</button>
        </div>
        <div className="nav-spacer"></div>
        <div className="nav-group">
          <button onClick={() => scrollToId('about')}>About</button>
          <button onClick={() => scrollToId('vision')}>Vision</button>
          <button aria-label="Search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
        </div>
      </div>

      <div id="greeting"><span id="greeting-text"></span></div>

      <div id="content">

        <section className="thesis">
          <h1>Software that does the work.<span className="sub">Not just tracks it.</span></h1>
          <div className="scroll-cue" id="scroll-cue"><div className="drip"></div></div>
        </section>

        <div className="motion-strip">
          <div className="motion-track" id="motion-track"></div>
        </div>

        <section className="workers-section" id="products">
          <div className="workers-inner">
            <div className="workers-head">
              <div className="label">Alvryn Workforce</div>
              <h2>Digital workers for business operations.</h2>
              <p>Each worker takes over one repetitive process end-to-end — reading, checking, and flagging what actually needs a person.</p>
            </div>

            <div className="worker-grid">
              <div className="worker-card active">
                <div className="worker-tag">Active</div>
                <h3>Invoice Operations</h3>
                <p>Reads incoming invoices, matches them against purchase orders, checks suppliers and totals, and flags exceptions for approval — before anything is recorded.</p>
                <a className="worker-card-cta" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>See how it works →</a>
              </div>
              <div className="worker-card building">
                <div className="worker-tag">Building</div>
                <h3>Procurement Operations</h3>
                <p>Purchase order creation, supplier communication and approval routing.</p>
              </div>
              <div className="worker-card building">
                <div className="worker-tag">Building</div>
                <h3>HR Onboarding</h3>
                <p>Document collection, verification and onboarding workflows for new hires.</p>
              </div>
              <div className="worker-card building">
                <div className="worker-tag">Building</div>
                <h3>Logistics Operations</h3>
                <p>Shipping documents, delivery confirmations and reconciliation.</p>
              </div>
            </div>

            <div className="how-it-works" id="how-it-works">
              <span className="step">Invoice received</span><span className="arrow">→</span>
              <span className="step">Data extracted</span><span className="arrow">→</span>
              <span className="step">Matched to PO</span><span className="arrow">→</span>
              <span className="step">Exceptions flagged</span><span className="arrow">→</span>
              <span className="step">Human approves</span><span className="arrow">→</span>
              <span className="step">Recorded</span>
            </div>
          </div>
        </section>

        <section className="philosophy" id="about">
          <svg className="philosophy-net" viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice">
            <circle cx="180" cy="120" r="2" fill="#5B6EE8"/><circle cx="380" cy="80" r="2" fill="#ffffff" opacity="0.4"/>
            <circle cx="600" cy="180" r="2" fill="#D9743C"/><circle cx="850" cy="100" r="2" fill="#ffffff" opacity="0.3"/>
            <circle cx="1020" cy="220" r="2" fill="#5B6EE8"/><circle cx="250" cy="380" r="2" fill="#ffffff" opacity="0.3"/>
            <circle cx="700" cy="400" r="2" fill="#D9743C"/><circle cx="950" cy="360" r="2" fill="#ffffff" opacity="0.4"/>
            <line x1="180" y1="120" x2="380" y2="80" stroke="#ffffff" strokeWidth="0.5" opacity="0.12"/>
            <line x1="380" y1="80" x2="600" y2="180" stroke="#ffffff" strokeWidth="0.5" opacity="0.12"/>
            <line x1="600" y1="180" x2="850" y2="100" stroke="#ffffff" strokeWidth="0.5" opacity="0.12"/>
            <line x1="850" y1="100" x2="1020" y2="220" stroke="#ffffff" strokeWidth="0.5" opacity="0.12"/>
            <line x1="250" y1="380" x2="700" y2="400" stroke="#ffffff" strokeWidth="0.5" opacity="0.1"/>
            <line x1="700" y1="400" x2="950" y2="360" stroke="#ffffff" strokeWidth="0.5" opacity="0.1"/>
          </svg>
          <p>The work still gets done.<br/>You just <span className="tint">stop having to do it yourself</span>.</p>
        </section>

        <section className="vision" id="vision">
          <svg className="vision-horizon" viewBox="0 0 1200 260" preserveAspectRatio="xMidYMax slice">
            <defs>
              <radialGradient id="sunGlow" cx="50%" cy="100%" r="70%">
                <stop offset="0%" stopColor="#5B6EE8" stopOpacity="0.16"/>
                <stop offset="100%" stopColor="#D9743C" stopOpacity="0"/>
              </radialGradient>
            </defs>
            <rect x="0" y="0" width="1200" height="260" fill="url(#sunGlow)"/>
            <line x1="0" y1="220" x2="1200" y2="220" stroke="#0a0a0a" strokeWidth="1" opacity="0.1"/>
          </svg>
          <h2>Every business we work with starts the same way:<br/>one process too repetitive for a person, too important to get wrong.</h2>
        </section>

        <div className="closing">
          <p>One rule guides everything we build:<br/>never automate a decision without a human able to see it.</p>
        </div>

        <section className="get-in-touch" id="contact">
          <div className="get-in-touch-inner">
            <div className="eyebrow">Currently onboarding</div>
            <h2>We're working with a small number of companies right now.</h2>
            <p>If invoice processing is quietly costing your team hours every week, we'd like to hear about it — and show you what we're building.</p>
            <a className="get-in-touch-btn" href={CONTACT_MAILTO}>
              Get in touch
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
        </section>

        <footer>
          <div className="footer-inner">
            <div className="footer-word">ALVRYN</div>
            <div className="footer-cols">
              <div className="footer-col">
                <div className="head">WORKFORCE</div>
                <button onClick={() => scrollToId('products')}>Invoice Operations — Active</button>
                <span className="static-item">Procurement — Building</span>
                <span className="static-item">HR Onboarding — Building</span>
                <span className="static-item">Logistics — Building</span>
              </div>
              <div className="footer-col">
                <div className="head">COMPANY</div>
                <button onClick={() => setModal('about')}>About</button>
                <button onClick={() => setModal('privacy')}>Privacy Policy</button>
                <button onClick={() => setModal('terms')}>Terms of Use</button>
                <button onClick={() => setModal('contact')}>Contact</button>
              </div>
              <div className="footer-col">
                <div className="head">GET IN TOUCH</div>
                <a href="mailto:hellothealvryn@gmail.com">hellothealvryn@gmail.com</a>
              </div>
            </div>
            <div className="footer-bottom">
              <div className="copy">© Alvryn Technologies. All rights reserved.</div>
              <button id="replay-btn">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                Replay intro
              </button>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}