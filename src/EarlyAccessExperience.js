import React, { useEffect, useRef, useState } from 'react';
import { submitEarlyAccess } from './api/earlyAccess.js';

export const ACCESS_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700&family=Poiret+One&display=swap');
:root{--access-paper:#f5f3ee;--access-card:#fcfbf8;--access-ink:#252b28;--access-muted:#59625b;--access-green:#315d4c;--access-line:#d9ddd3;--access-serif:Georgia,'Times New Roman',serif;--access-sans:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
html{scroll-behavior:smooth;scroll-padding-top:150px}
body{margin:0;background:var(--access-paper);color:var(--access-ink)}
::selection{background:#d5d9cf;color:#202822}
.access-site{font-family:var(--access-sans);color:var(--access-ink);background:var(--access-paper);line-height:1.65}
.access-site *{box-sizing:border-box}
.access-wrap{max-width:1120px;margin:0 auto;padding:0 32px}
.access-site h1,.access-site h2,.access-site h3,.access-site p{margin:0}
.access-site a{color:inherit}
.access-site a:focus-visible,.access-site button:focus-visible,.access-site summary:focus-visible{outline:2px solid var(--access-green);outline-offset:5px}
.access-label{font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--access-green);margin-bottom:18px!important}
.access-hero{padding:116px 0 70px;border:0}
.access-hero-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:70px;align-items:center}
.access-hero h1{font-family:'Bricolage Grotesque',var(--access-sans);font-size:clamp(40px,5vw,66px);font-weight:500;letter-spacing:-.045em;line-height:1.04;max-width:660px}
.access-hero h1 em{font-family:var(--access-serif);font-weight:400;color:var(--access-green);letter-spacing:-.045em}
.access-problem{font-size:17px;line-height:1.65;margin-top:26px!important;max-width:550px;color:var(--access-muted)}
.access-explanation{font-size:16px;line-height:1.7;margin-top:14px!important;max-width:555px}
.access-actions{display:flex;gap:18px;align-items:center;flex-wrap:wrap;margin-top:28px}
.access-button{display:inline-flex;align-items:center;justify-content:center;gap:18px;background:var(--access-green);color:#fff!important;text-decoration:none;border:1px solid var(--access-green);border-radius:7px;padding:13px 22px;font:600 14px var(--access-sans);cursor:pointer;transition:background .2s ease;min-height:48px}
.access-button:hover{background:#244a3b}
.access-button[disabled]{opacity:.6;cursor:wait}
.access-text-link{font-size:13px;text-underline-offset:4px}
.access-caption{font-size:12px;line-height:1.6;color:var(--access-muted);margin-top:14px!important;max-width:500px}
.access-proof{background:var(--access-card);border:1px solid var(--access-line);border-radius:14px;box-shadow:0 18px 45px -32px #44634c66;padding:30px;position:relative}
.access-proof::before{content:'';position:absolute;top:0;left:30px;right:30px;height:3px;background:var(--access-green);border-radius:0 0 3px 3px}
.access-proof-top{display:flex;justify-content:space-between;gap:12px;align-items:center;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--access-muted);margin-bottom:28px}
.access-proof-badge{background:#e9ede4;border-radius:20px;padding:5px 10px;letter-spacing:.02em;color:var(--access-green)}
.access-proof h2{font:400 27px/1.2 var(--access-serif);margin-bottom:22px}
.access-proof dl{margin:0;display:grid;grid-template-columns:1fr auto;font-size:14px}
.access-proof dt,.access-proof dd{margin:0;padding:11px 0;border-bottom:1px solid var(--access-line)}
.access-proof dd{font-variant-numeric:tabular-nums;font-weight:600}
.access-proof-result{margin-top:22px;padding:18px;border-radius:8px;background:#edf0e8;border:1px solid #d4ddce}
.access-proof-result strong{display:block;font-size:15px;color:var(--access-green)}
.access-proof-result p{font-size:12px;color:var(--access-muted);margin-top:7px}
.access-proof-foot{font-size:11px;color:var(--access-muted);margin-top:16px!important}
.access-summary{display:flex;gap:28px;flex-wrap:wrap;padding-top:38px;margin-top:42px;border-top:1px solid var(--access-line);font-size:12px;color:var(--access-muted)}
.access-summary span::before{content:'·';color:var(--access-green);font-weight:700;margin-right:9px}
.access-section{padding:62px 0;border-top:1px solid var(--access-line);background:transparent}
.access-heading{display:flex;align-items:end;justify-content:space-between;gap:30px;margin-bottom:30px}
.access-heading h2,.access-fit h2,.access-apply h2,.access-detail h1{font:400 clamp(28px,3.2vw,40px)/1.15 var(--access-serif);letter-spacing:-.025em;max-width:610px}
.access-heading p{font-size:14px;color:var(--access-muted);max-width:300px}
.access-check-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.access-check{border:1px solid var(--access-line);border-radius:10px;padding:24px 22px;background:var(--access-card)}
.access-number{font-size:11px;color:var(--access-green);margin-bottom:23px;font-variant-numeric:tabular-nums}
.access-check h3{font-size:16px;font-weight:600;margin-bottom:10px}
.access-check p{font-size:13px;color:var(--access-muted);line-height:1.7}
.access-fit{display:grid;grid-template-columns:1.05fr .95fr;gap:70px;align-items:center}
.access-fit p{margin-top:18px;font-size:15px;color:var(--access-muted);max-width:490px}
.access-fit-list{list-style:none;margin:0;padding:0}
.access-fit-list li{padding:15px 0;border-bottom:1px solid var(--access-line);display:flex;gap:14px;font-size:14px}
.access-fit-list li::before{content:'↗';color:var(--access-green)}
.access-fit-note{font-size:12px!important}
.access-apply{background:#eaece3}
.access-apply-grid{display:grid;grid-template-columns:.8fr 1.2fr;gap:70px;align-items:start}
.access-apply-intro{position:sticky;top:150px}
.access-apply-intro>p{font-size:14px;color:var(--access-muted);margin-top:18px;max-width:340px}
.access-process{margin-top:28px;padding:0;list-style:none}
.access-process li{display:flex;gap:14px;padding:13px 0;border-top:1px solid #d1d6c8;font-size:13px;align-items:baseline}
.access-process span{font-size:11px;color:var(--access-green)}
.access-form{background:var(--access-card);border:1px solid var(--access-line);border-radius:12px;padding:32px}
.access-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.access-field{display:block;font-size:12px;font-weight:600;min-width:0}
.access-field-wide{grid-column:1/-1}
.access-field input,.access-field select,.access-field textarea{display:block;width:100%;margin-top:7px;min-height:44px;background:#fff;border:1px solid #cdd3c8;border-radius:5px;padding:10px 12px;font:14px var(--access-sans);color:var(--access-ink)}
.access-field input:focus,.access-field select:focus,.access-field textarea:focus{outline:2px solid #789680;outline-offset:1px}
.access-field textarea{min-height:72px;resize:vertical}
.access-field small{color:var(--access-muted);font-weight:400}
.access-form-note{font-size:11px!important;color:var(--access-muted);margin-top:20px!important}
.access-consent{display:flex;align-items:flex-start;gap:10px;margin-top:20px;font-size:12px;line-height:1.7;font-weight:400}
.access-consent input{margin-top:4px;accent-color:var(--access-green);width:16px;height:16px;flex-shrink:0}
.access-consent a{text-underline-offset:3px}
.access-form .access-button{margin-top:22px;width:100%}
.access-hp{position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden}
.access-error{font-size:13px;color:#8d302b;margin-top:18px!important}
.access-success{padding:36px;background:var(--access-card);border:1px solid var(--access-line);border-radius:12px}
.access-success h3{font:400 30px var(--access-serif);margin-bottom:15px}
.access-success p{font-size:14px;color:var(--access-muted)}
.access-terms{margin-top:28px;font-size:12px;color:var(--access-muted);max-width:550px}
.access-terms summary{cursor:pointer;text-underline-offset:4px;text-decoration:underline;font-weight:600;color:var(--access-ink);padding:5px 0}
.access-terms p{margin-top:13px!important;font-size:12px!important}
.access-terms ul{padding-left:18px;margin-top:10px}
.access-terms li{margin-bottom:8px}
.access-assurance{display:grid;grid-template-columns:1fr 1fr;gap:40px;font-size:13px;color:var(--access-muted)}
.access-assurance h3{font-size:14px;font-weight:600;color:var(--access-ink);margin-bottom:8px}
.access-float-slot{position:fixed;top:72px;left:0;right:0;z-index:90;pointer-events:none;display:flex;justify-content:flex-end;padding:0 32px}
.access-float{display:flex;gap:24px;align-items:center;border:1px solid var(--access-line);background:#f5f3eef5;backdrop-filter:blur(10px);padding:9px 10px 9px 20px;border-radius:10px;box-shadow:0 12px 35px -25px #315d4c;opacity:0;visibility:hidden;transform:translateY(-18px);transition:transform .25s ease,opacity .25s ease,visibility .25s ease}
.access-float.visible{opacity:1;visibility:visible;transform:translateY(0);pointer-events:auto}
.access-float span{font-size:11px;color:var(--access-muted)}
.access-float .access-button{padding:10px 15px;min-height:40px;font-size:12px}
.access-header{height:64px;display:flex;justify-content:space-between;align-items:center;max-width:1184px;padding:0 32px;margin:auto;font-family:var(--access-sans);border-bottom:1px solid var(--access-line)}
.access-wordmark{font:22px 'Poiret One',sans-serif;letter-spacing:.2em;text-decoration:none;text-transform:uppercase}
.access-header nav{display:flex;gap:26px;align-items:center;font-size:12px}
.access-header nav a{color:var(--access-muted);text-decoration:none}
.access-footer{padding:36px 32px;max-width:1184px;margin:auto;border-top:1px solid var(--access-line);background:var(--access-paper);color:var(--access-muted);font:12px/1.8 var(--access-sans);display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}
.access-footer div{display:flex;gap:20px;flex-wrap:wrap}
.access-detail{padding:65px 32px 80px;max-width:800px;margin:auto;font:15px/1.8 var(--access-sans);color:var(--access-muted)}
.access-detail h1{margin:0 0 25px;color:var(--access-ink)}
.access-detail h2{font:400 25px var(--access-serif);margin:30px 0 12px;color:var(--access-ink)}
.access-detail p+p{margin-top:15px}
@media(max-width:950px){.access-hero-grid{gap:36px;grid-template-columns:1.1fr .9fr}.access-check-grid{grid-template-columns:repeat(2,1fr)}.access-apply-grid,.access-fit{gap:36px}.access-proof{padding:23px}.access-heading{align-items:start}}
@media(max-width:700px){.access-wrap{padding:0 22px}.access-hero{padding:98px 0 44px}.access-hero-grid,.access-fit,.access-apply-grid{grid-template-columns:1fr;gap:32px}.access-hero h1{font-size:46px}.access-problem{font-size:15px;margin-top:20px!important}.access-explanation{font-size:14px}.access-proof{max-width:500px}.access-summary{gap:10px 22px;margin-top:30px;padding-top:24px}.access-section{padding:44px 0}.access-heading{display:block}.access-heading p{margin-top:14px;max-width:480px}.access-apply-intro{position:static}.access-apply-intro>p{max-width:500px}.access-process{display:none}.access-apply-intro>p:last-child{display:none}.access-field input,.access-field select,.access-field textarea{font-size:16px}.access-process{margin-top:20px}.access-form{padding:23px}.access-form-grid{gap:16px}.access-assurance{grid-template-columns:1fr;gap:25px}.access-float-slot{padding:0 14px;top:66px}.access-float{padding:7px}.access-float span{display:none}.access-header{padding:0 22px}.access-header nav{gap:14px}.access-header nav .access-nav-secondary{display:none}.access-footer{padding:28px 22px}.access-check{padding:22px 18px}.access-number{margin-bottom:14px}.access-success{padding:26px}}
@media(max-width:380px){.access-hero h1{font-size:40px}.access-form-grid,.access-check-grid{grid-template-columns:1fr}.access-field-wide{grid-column:auto}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.access-float,.access-button{transition:none}}
`;

const OPTIONS = {
  role: ['Financial Controller', 'Head of Accounts Payable', 'Finance Operations', 'CFO or Finance Director', 'Other'],
  industry: ['Industrial manufacturing', 'Distribution or wholesale', 'Construction', 'Other'],
  invoiceVolume: ['Under 500', '500 to 1,500', '1,500 to 3,000', '3,000 or more'],
  poUsage: ['Most invoices', 'Some invoices', 'Rarely'],
  receiptsRecorded: ['Recorded in our ERP', 'Recorded in spreadsheets', 'Not recorded'],
};
const EMPTY = { company: '', workEmail: '', role: '', industry: '', invoiceVolume: '', poUsage: '', receiptsRecorded: '', erpSystem: '', biggestChallenge: '', consent: false, website: '' };

export function ProgrammeTerms() {
  return <details className="access-terms" id="programme-conditions">
    <summary>Early Access Conditions</summary>
    <p>Applications are expressions of interest. Applying does not create a workspace account, reserve access, guarantee selection, or create a payment obligation.</p>
    <p>Selection depends on operational fit, supported workflows and onboarding capacity. Qualification alone does not guarantee an invitation. Launch timing, supported capabilities, programme scope and availability may change; the website describes the proposed initial scope.</p>
    <p>Any invitation will identify the supported capabilities, requirements and participation terms for your review before you decide whether to proceed. Material changes affecting participation will be identified before acceptance; applicants can withdraw their request.</p>
    <p>Checks depend on readable documents, confirmed reference records and configured rules. Results can be incomplete or inaccurate and may require verification. A discrepancy is a finding to investigate, not proof of loss, fraud or an incorrect payment. A passed check is not approval or a guarantee of overall invoice accuracy.</p>
    <p>The initial focus is PO-backed supplier invoices for physical goods. Alvryn does not make payments, post to an ERP, or replace your team's financial decisions. Universal tax compliance, service and non-PO workflows, advance billing, and automatic discrepancy resolution are outside the proposed initial scope.</p>
  </details>;
}

export function ApplicationPrivacy() {
  return <details className="access-terms" id="application-privacy">
    <summary>Application Privacy Notice</summary>
    <p>Alvryn collects the company, contact and workflow details entered in this form, along with the submission time and consent record. They are used to assess fit and contact you about this application. Applying does not enrol you in unrelated marketing.</p>
    <p>The website is hosted on Vercel; the intake server and application database use Render and Neon. These providers process application details to operate the service. Google Fonts receives a browser request when fonts load. Application details are not sold or shared with advertisers.</p>
    <p>Application records are retained while needed for assessment and related contact, subject to applicable retention requirements and backup expiry. You can request access, correction, withdrawal or deletion at <a href="mailto:hellothealvryn@gmail.com">hellothealvryn@gmail.com</a>. Do not submit invoices, bank details, passwords or other sensitive financial records in this form.</p>
    <p>Product data processing, extraction providers, storage, retention and deletion conditions are separate from this application and must be specified before company documents are submitted.</p>
  </details>;
}

export function EarlyAccessForm({ endpoint = '/api/early-access' }) {
  const [form, setForm] = useState(EMPTY);
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');
  const active = useRef(null);
  const receivedHeading = useRef(null);
  useEffect(() => () => active.current?.abort(), []);
  useEffect(() => { if (state === 'received') receivedHeading.current?.focus(); }, [state]);
  const change = (key) => (event) => setForm(old => ({ ...old, [key]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }));
  async function submit(event) {
    event.preventDefault();
    if (active.current) return;
    const controller = new AbortController();
    active.current = controller;
    setError(''); setState('sending');
    try {
      await submitEarlyAccess({ ...form, company: form.company.trim(), workEmail: form.workEmail.trim(), programme: 'private_early_access', noticeVersion: '2026-11-08' }, { endpoint, signal: controller.signal });
      if (!controller.signal.aborted) setState('received');
    } catch (failure) {
      if (!controller.signal.aborted) { setError(failure.message); setState('idle'); }
    } finally { active.current = null; }
  }
  const select = (key, label, wide = false) => <div className={'access-field' + (wide ? ' access-field-wide' : '')}>
    <label htmlFor={'access-' + key}>{label}</label><select id={'access-' + key} name={key} required value={form[key]} onChange={change(key)} disabled={state === 'sending'}>
      <option value="">Select</option>{OPTIONS[key].map(option => <option key={option}>{option}</option>)}
    </select></div>;
  return <div id="company-application" aria-label="Company application">
    {state === 'received' ? <div className="access-success" role="status">
      <p className="access-label">Private Early Access</p>
      <h3 ref={receivedHeading} tabIndex={-1}>Application received.</h3>
      <p>Your company details have been submitted for consideration. Selection and access remain subject to programme requirements and availability.</p>
      <p style={{ marginTop: 15 }}>This application does not create an account. You can contact Alvryn to update or withdraw your request.</p>
    </div> : <form className="access-form" onSubmit={submit}>
      <div className="access-form-grid">
        <label className="access-field" htmlFor="access-company">Company name<input id="access-company" name="company" autoComplete="organization" required maxLength={200} value={form.company} onChange={change('company')} disabled={state === 'sending'} /></label>
        <label className="access-field" htmlFor="access-workEmail">Work email<input id="access-workEmail" name="workEmail" type="email" autoComplete="email" required maxLength={254} value={form.workEmail} onChange={change('workEmail')} disabled={state === 'sending'} /></label>
        {select('role', 'Your role')}{select('industry', 'Industry')}
        {select('invoiceVolume', 'Supplier invoices per month', true)}
        {select('poUsage', 'Do invoices reference POs?')}{select('receiptsRecorded', 'Are goods receipts recorded?')}
        <label className="access-field access-field-wide" htmlFor="access-erpSystem">ERP or accounting system <small>(optional)</small><input id="access-erpSystem" name="erpSystem" maxLength={120} value={form.erpSystem} onChange={change('erpSystem')} disabled={state === 'sending'} /></label>
        <label className="access-field access-field-wide" htmlFor="access-biggestChallenge">Main invoice challenge <small>(optional)</small><textarea id="access-biggestChallenge" name="biggestChallenge" maxLength={1500} value={form.biggestChallenge} onChange={change('biggestChallenge')} disabled={state === 'sending'} /></label>
      </div>
      <div className="access-hp" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={change('website')} /></label></div>
      <p className="access-form-note">Company and workflow details only. Do not include invoices, bank details or confidential financial records.</p>
      <label className="access-consent"><input type="checkbox" name="consent" required checked={form.consent} onChange={change('consent')} disabled={state === 'sending'} />
        <span>I acknowledge the <a href="#programme-conditions" onClick={() => { const el = document.getElementById('programme-conditions'); if (el) el.open = true; }}>Early Access Conditions</a> and agree that Alvryn may use these details to assess and contact me about my application, as described in the <a href="#application-privacy" onClick={() => { const el = document.getElementById('application-privacy'); if (el) el.open = true; }}>Application Privacy Notice</a>.</span>
      </label>
      {error && <p className="access-error" role="alert">{error}</p>}
      <button className="access-button" disabled={state === 'sending'}>{state === 'sending' ? 'Submitting…' : 'Submit application'} <span aria-hidden="true">↗</span></button>
      <p className="access-caption">Application does not guarantee selection or access.</p>
    </form>}
    <ProgrammeTerms /><ApplicationPrivacy />
  </div>;
}

function FloatingAccess({ waitForIntro }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let heroVisible = true, formVisible = false;
    const content = document.getElementById('content');
    const update = () => setVisible(!heroVisible && !formVisible && (!waitForIntro || content?.classList.contains('in')));
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) { if (entry.target.id === 'access-hero-button') heroVisible = entry.isIntersecting; else formVisible = entry.intersectionRatio >= 0.3; }
      update();
    }, { threshold: [0, 0.3] });
    ['access-hero-button', 'initial-access'].forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
    const mutation = new MutationObserver(update);
    if (content) mutation.observe(content, { attributes: true, attributeFilter: ['class'] });
    return () => { observer.disconnect(); mutation.disconnect(); };
  }, [waitForIntro]);
  return <div className="access-float-slot"><div className={'access-float' + (visible ? ' visible' : '')} aria-hidden={!visible}>
    <span>Private Early Access · Applications reviewed for fit</span>
    <a className="access-button" href="#company-application" tabIndex={visible ? 0 : -1}>Request initial access <span aria-hidden="true">↗</span></a>
  </div></div>;
}

export function InvoiceExample() {
  return <aside className="access-proof" aria-label="Fictional invoice discrepancy example" id="example">
    <div className="access-proof-top"><span>Invoice review</span><span className="access-proof-badge">Illustrative example</span></div>
    <h2>The documents tell<br />different stories.</h2>
    <dl><dt>Purchase order quantity</dt><dd>10 units</dd><dt>Recorded as received</dt><dd>8 units</dd><dt>Invoice quantity</dt><dd>10 units</dd></dl>
    <div className="access-proof-result"><strong>2 units require review.</strong><p>The invoice quantity exceeds the recorded receipt. Your team reviews the difference and its supporting records.</p></div>
    <p className="access-proof-foot">Fictional data. A difference is not automatically a billing error.</p>
  </aside>;
}

export function LandingOverview({ endpoint, showScrollCue = false }) {
  return <main className="access-site">
    <style>{ACCESS_STYLES}</style>
    <FloatingAccess waitForIntro={showScrollCue} />
    <section className="access-hero"><div className="access-wrap">
      <div className="access-hero-grid"><div>
        <p className="access-label">Alvryn Workforce · Private Early Access</p>
        <h1>Find the discrepancy.<br /><em>See the evidence.</em></h1>
        <p className="access-problem">Invoice totals, purchase orders and delivery records can disagree. Finding the difference means tracing it across documents.</p>
        <p className="access-explanation"><strong>Invoice processing. Financial discrepancy review.</strong> Alvryn processes supplier invoices and checks them against purchase orders, goods receipts and invoice history—bringing potential discrepancies and supporting evidence together for your team to review.</p>
        <div className="access-actions"><a className="access-button" id="access-hero-button" href="#company-application">Request initial access <span aria-hidden="true">↗</span></a><a className="access-text-link" href="#checks">Explore the checks</a></div>
        <p className="access-caption">Applications are reviewed for workflow fit.<br />Submission does not guarantee selection or access.</p>
      </div><InvoiceExample /></div>
      <div className="access-summary"><span>Supplier invoices · Purchase orders · Goods receipts</span><span>Evidence for review</span><span>Your team keeps the decisions</span></div>
      {showScrollCue && <div className="scroll-cue" id="scroll-cue" aria-hidden="true"><div className="drip" /></div>}
    </div></section>
    <section className="access-section" id="products"><div className="access-wrap" id="checks">
      <div className="access-heading"><div><p className="access-label">The proposed initial scope</p><h2>From scattered records<br />to a clearer review.</h2></div><p>Supported checks depend on your documents, reference records and configured rules.</p></div>
      <div className="access-check-grid">
        {[
          ['01', 'Invoice arithmetic', 'Compare printed line amounts, adjustments and invoice totals against calculated amounts.'],
          ['02', 'Supplier & PO matching', 'Compare supplier details, invoiced prices and quantities with confirmed supplier and purchase order records.'],
          ['03', 'Receipt discrepancies', 'Compare invoiced quantities with confirmed receipts and relevant earlier billing records.'],
          ['04', 'Possible duplicates', 'Compare invoices against available history and surface duplicate candidates for review.'],
        ].map(([number, title, description]) => <article className="access-check" key={number}><div className="access-number">{number} /</div><h3>{title}</h3><p>{description}</p></article>)}
      </div>
    </div></section>
    <section className="access-section" id="fit"><div className="access-wrap access-fit">
      <div><p className="access-label">Operational fit comes first</p><h2>Initial access is reserved<br />for qualified companies.</h2><p>We assess whether your purchasing workflow and records match Alvryn's supported capabilities. Qualification does not guarantee selection; invitations also depend on readiness and onboarding capacity.</p></div>
      <div><ul className="access-fit-list"><li>Supplier invoices for physical goods</li><li>Purchase orders and receipt records available</li><li>A finance team responsible for discrepancy review</li></ul><p className="access-fit-note">The application is a request for consideration. Final scope and participation terms are provided before acceptance.</p></div>
    </div></section>
    <section className="access-section access-apply" id="initial-access"><div className="access-wrap access-apply-grid">
      <div className="access-apply-intro"><p className="access-label">Private Early Access</p><h2>Put your company<br />forward.</h2><p>Tell us about your invoice workflow. No workspace account or financial documents are needed to apply.</p><ol className="access-process"><li><span>01</span>Submit company and workflow details</li><li><span>02</span>Application assessed for operational fit</li><li><span>03</span>Any invitation defines scope and terms</li></ol><p>Application does not guarantee an invitation or access. Timing and availability may change.</p></div>
      <EarlyAccessForm endpoint={endpoint} />
    </div></section>
    <section className="access-section" id="about"><div className="access-wrap access-assurance"><div><h3>Evidence supports the decision.</h3><p>Alvryn brings checks and source records together. Your finance team verifies findings and retains control of approvals and financial decisions.</p></div><div><h3>A defined scope, before participation.</h3><p>Capabilities, requirements and data handling conditions are specified before access. Alvryn does not make payments or post records to your ERP.</p></div></div></section>
  </main>;
}
