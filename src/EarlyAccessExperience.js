import React, { useEffect, useRef, useState } from 'react';
import { submitEarlyAccess } from './api/earlyAccess.js';
import { COMPANY_EMAIL, COMPANY_GMAIL_URL } from './companyContact.js';

export const ACCESS_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Poiret+One&display=swap');
:root{--access-paper:#f5f3ee;--access-card:#fcfbf8;--access-ink:#292826;--access-muted:#77736c;--access-line:#d9d3c8;--access-sans:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
html{scroll-behavior:smooth;scroll-padding-top:100px}
body{margin:0;background:var(--access-paper);color:var(--access-ink);font-family:var(--access-sans)}
::selection{background:#ded6c8;color:#111110}
.access-site{font-family:var(--access-sans);color:var(--access-ink);background:var(--access-paper);line-height:1.65}
.access-site *{box-sizing:border-box}
.access-site a{color:inherit}
.access-label{font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--access-muted);margin-bottom:18px}
.access-button{display:inline-flex;align-items:center;justify-content:center;gap:18px;background:#111110;color:#f5f3ee!important;text-decoration:none;border:1px solid #111110;border-radius:4px;padding:14px 22px;font:500 14px var(--access-sans);cursor:pointer;min-height:48px}
.access-button:hover{background:#35332f}
.access-button[disabled]{opacity:.6;cursor:wait}
.access-caption{font-size:12px;line-height:1.7;color:var(--access-muted);margin-top:14px}
.access-apply-grid{display:grid;grid-template-columns:.85fr 1.15fr;gap:80px;align-items:start}
.access-apply-intro{position:sticky;top:110px}
.access-apply-intro>p{font-size:15px;line-height:1.8;color:var(--access-muted);margin-top:20px;max-width:400px}
.access-form{background:var(--access-card);border:1px solid var(--access-line);border-radius:4px;padding:32px}
.access-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.access-field{display:block;font:500 12px/1.6 var(--access-sans);min-width:0;color:var(--access-ink)}
.access-field-wide{grid-column:1/-1}
.access-field input,.access-field select,.access-field textarea{box-sizing:border-box;display:block;width:100%;margin-top:7px;min-height:46px;background:#fcfbf8;border:1px solid #c9c0b2;border-radius:3px;padding:10px 12px;font:14px var(--access-sans);color:var(--access-ink)}
.access-field input:focus,.access-field select:focus,.access-field textarea:focus{outline:2px solid #77736c;outline-offset:1px}
.access-field textarea{min-height:85px;resize:vertical}
.access-field small{color:var(--access-muted);font-weight:400}
.access-form-note{font-size:11px;color:var(--access-muted);margin-top:22px;line-height:1.8}
.access-consent{display:flex;align-items:flex-start;gap:10px;margin-top:22px;font:400 12px/1.8 var(--access-sans)}
.access-consent input{margin-top:4px;accent-color:#292826;width:16px;height:16px;flex-shrink:0}
.access-consent a{color:inherit;text-underline-offset:3px}
.access-form .access-button{margin-top:22px;width:100%}
.access-hp{position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden}
.access-error{font-size:13px;color:#8d302b;margin-top:18px}
.access-success{padding:36px;background:var(--access-card);border:1px solid var(--access-line);border-radius:4px}
.access-success h3{font:500 30px/1.2 var(--access-sans);letter-spacing:-.03em;margin-bottom:15px}
.access-success p{font-size:14px;line-height:1.8;color:var(--access-muted)}
.access-terms{margin-top:28px;font:12px/1.9 var(--access-sans);color:var(--access-muted);max-width:650px}
.access-terms summary{cursor:pointer;text-underline-offset:4px;text-decoration:underline;font-weight:500;color:var(--access-ink);padding:5px 0}
.access-terms p{margin-top:13px!important;font-size:12px!important}
.access-terms a{color:inherit}
.access-detail{padding:72px 32px 80px;max-width:800px;margin:auto;font:15px/1.8 var(--access-sans);color:var(--access-muted)}
.access-detail h1{font:500 48px/1.1 var(--access-sans);letter-spacing:-.045em;margin:0 0 25px;color:var(--access-ink)}
.access-detail h2{font:500 25px/1.3 var(--access-sans);letter-spacing:-.025em;margin:35px 0 15px;color:var(--access-ink)}
.access-detail p+p{margin-top:18px}
@media(max-width:950px){.access-apply-grid{gap:40px}}
@media(max-width:700px){.access-apply-grid{grid-template-columns:1fr;gap:35px}.access-apply-intro{position:static}.access-form{padding:24px}.access-form-grid{gap:18px}.access-field input,.access-field select,.access-field textarea{font-size:16px}.access-detail{padding:55px 24px}.access-detail h1{font-size:40px}}
@media(max-width:380px){.access-form-grid{grid-template-columns:1fr}.access-field-wide{grid-column:auto}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
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
    <p>Application records are retained while needed for assessment and related contact, subject to applicable retention requirements and backup expiry. You can request access, correction, withdrawal or deletion at <a href={COMPANY_GMAIL_URL} target="_blank" rel="noopener noreferrer" title="Compose an email to Alvryn in Gmail">{COMPANY_EMAIL}</a>. Do not submit invoices, bank details, passwords or other sensitive financial records in this form.</p>
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
