import React, { useEffect, useRef, useState } from 'react';
import { ACCESS_STYLES, EarlyAccessForm } from './EarlyAccessExperience';
import { SAMPLES, checkSample } from './trialSample.js';
import { COMPANY_GMAIL_URL } from './companyContact.js';

export const PRODUCT_STYLES = `
:root{--brand-cream:#f5f3ee;--brand-black:#111110;--brand-charcoal:#292826;--brand-grey:#77736c;--brand-sand:#e7e1d6;--brand-line:#d9d3c8}
body{background:var(--brand-cream);color:var(--brand-charcoal);-webkit-font-smoothing:antialiased}
.product-site{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:var(--brand-cream);color:var(--brand-charcoal);line-height:1.6}
.product-site *{box-sizing:border-box}
.product-site h1,.product-site h2,.product-site h3,.product-site p{margin:0}
.product-site a{color:inherit;text-underline-offset:5px}
.product-site a:focus-visible,.product-site button:focus-visible,.product-site select:focus-visible,.product-nav a:focus-visible,.product-nav button:focus-visible{outline:2px solid var(--brand-charcoal);outline-offset:5px}
.product-wrap{max-width:1200px;margin:0 auto;padding:0 48px}
.product-kicker{font-size:11px;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:var(--brand-grey)}
.product-nav{position:sticky;top:0;z-index:40;background:var(--brand-cream);border-bottom:1px solid var(--brand-line);font:13px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:var(--brand-charcoal)}
.product-nav-inner{max-width:1440px;padding:0 48px;min-height:76px;margin:auto;display:flex;align-items:center;justify-content:space-between;gap:28px}
.product-nav a{text-decoration:none;color:inherit}
.product-nav a:hover{color:var(--brand-black)}
.product-nav .product-logo{font:22px 'Poiret One',sans-serif;letter-spacing:.17em;text-transform:uppercase}
.product-links{display:flex;gap:32px;align-items:center}
.product-links a[aria-current=page]{text-decoration:underline;text-underline-offset:6px}
.product-nav .product-nav-trial{background:var(--brand-black);color:var(--brand-cream);padding:11px 18px;border-radius:4px;font-weight:500}
.product-menu-button{display:none;background:none;border:0;color:inherit;font:inherit;padding:12px 0;cursor:pointer}
.product-nav-intro{position:fixed;top:6px;left:0;right:0;z-index:96;border-bottom:0;background:var(--brand-cream)}
.product-nav-intro .product-nav-inner{min-height:66px;padding-left:80px}
.product-nav-intro .product-logo{font:13px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;letter-spacing:0;text-transform:none}
.product-nav-intro .product-links{width:100%;justify-content:flex-end}
#nav-links,#nav-trigger,#corner-nav-links,#corner-nav-trigger{display:none!important}
.product-hero{min-height:760px;min-height:min(860px,100svh);padding:142px 0 72px;display:flex;align-items:center;text-align:center}
.product-hero .product-wrap{width:100%}
.product-hero h1{font-size:clamp(56px,7.6vw,104px);font-weight:600;letter-spacing:-.065em;line-height:1.02;margin:28px auto 0;max-width:1000px}
.product-hero h1 span{color:var(--brand-grey);font-weight:500}
.product-hero-description{max-width:580px;margin:30px auto 0!important;font-size:19px;line-height:1.65;color:#65615b;letter-spacing:-.015em}
.product-hero-description strong{color:var(--brand-charcoal);font-weight:500}
.product-actions{display:flex;align-items:center;gap:27px;margin-top:30px;flex-wrap:wrap}
.product-hero .product-actions{justify-content:center}
.product-button{display:inline-flex;align-items:center;justify-content:center;gap:22px;padding:14px 23px;border:1px solid var(--brand-black);border-radius:4px;background:var(--brand-black);color:var(--brand-cream)!important;text-decoration:none;min-height:48px;font:500 14px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;cursor:pointer}
.product-button:hover{background:#35332f}
.product-link{font-size:14px;text-decoration:none;border-bottom:1px solid #aaa397;padding-bottom:2px}
.product-scroll{margin:74px auto 0;color:#8d877d;font-size:11px;display:flex;flex-direction:column;align-items:center;gap:14px;letter-spacing:.03em}
.product-scroll span:last-child{font-size:20px}
.product-section{padding:112px 0;border-top:1px solid var(--brand-line)}
.product-section h2{font-size:clamp(34px,4.4vw,58px);line-height:1.12;font-weight:500;letter-spacing:-.05em}
.product-section h2 span{color:var(--brand-grey)}
.product-story{display:grid;grid-template-columns:1.1fr 1fr;gap:110px;align-items:start}
.product-story h2{margin-top:25px}
.product-story-copy{padding-top:45px;font-size:18px;color:#716b62;line-height:1.8}
.product-story-copy p+p{margin-top:24px}
.product-story-copy strong{color:var(--brand-charcoal);font-weight:500}
.product-sand{background:var(--brand-sand)}
.product-work-heading{display:flex;justify-content:space-between;align-items:end;gap:48px;margin-bottom:48px}
.product-work-heading h2{margin-top:23px;max-width:620px}
.product-work-heading>p{max-width:280px;color:#746d63;font-size:14px}
.product-rows{border-top:1px solid #c9c0b2}
.product-row{display:grid;grid-template-columns:45px 1fr 1.15fr;gap:28px;padding:28px 0;border-bottom:1px solid #c9c0b2;align-items:baseline}
.product-row>span{font-size:11px;color:var(--brand-grey);font-variant-numeric:tabular-nums}
.product-row h3{font-size:22px;font-weight:500;letter-spacing:-.03em}
.product-row p{font-size:15px;color:#71695e;max-width:440px}
.product-work-link{margin-top:30px}
.product-invitation{padding:94px 0 102px}
.product-invitation .product-wrap{display:flex;align-items:center;justify-content:space-between;gap:65px}
.product-invitation h2{font-size:clamp(32px,4vw,51px);line-height:1.12;font-weight:500;letter-spacing:-.045em;margin-top:20px}
.product-invitation p{max-width:500px;color:var(--brand-grey);font-size:15px;margin-top:19px}
.product-invitation small{display:block;font-size:11px;color:var(--brand-grey);margin-top:14px;max-width:250px;line-height:1.65}
.product-footer{border-top:1px solid var(--brand-line);max-width:1200px;margin:auto;padding:36px 48px;color:var(--brand-grey);font:12px/1.7 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;display:flex;justify-content:space-between;gap:32px;flex-wrap:wrap}
.product-footer div{display:flex;gap:24px;flex-wrap:wrap}
.product-footer a{color:inherit;text-decoration:none}
.product-page-head{padding:88px 0 66px}
.product-page-head h1{font-size:clamp(44px,5.5vw,76px);line-height:1.06;letter-spacing:-.06em;font-weight:500;max-width:900px;margin-top:25px}
.product-page-head h1 span{color:var(--brand-grey)}
.product-page-head>div>p:last-child{font-size:18px;line-height:1.75;max-width:640px;color:#716b62;margin-top:25px}
.product-content{padding:0 0 96px}
.product-detail-row{display:grid;grid-template-columns:70px 1fr 1.3fr;gap:32px;border-top:1px solid var(--brand-line);padding:38px 0}
.product-detail-row>span{font-size:12px;color:var(--brand-grey)}
.product-detail-row h2{font-size:29px;line-height:1.2;font-weight:500;letter-spacing:-.035em}
.product-detail-row p{color:#716b62;font-size:16px;line-height:1.85}
.product-note{max-width:750px;margin-top:30px!important;font-size:13px;color:var(--brand-grey);line-height:1.8}
.product-models{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 60px}
.product-model{border-top:1px solid var(--brand-line);padding:35px 0 50px}
.product-model h2{font-size:31px;font-weight:500;letter-spacing:-.035em;margin-top:20px}
.product-model p{font-size:16px;color:#716b62;margin-top:17px;max-width:440px;line-height:1.8}
.product-model a{display:inline-block;margin-top:23px}
.trial-toolbar{display:flex;justify-content:space-between;align-items:end;gap:24px;padding-bottom:26px;border-bottom:1px solid var(--brand-line)}
.trial-toolbar label{font-size:12px;color:var(--brand-grey);display:block}
.trial-toolbar select{display:block;margin-top:9px;background:transparent;border:1px solid #c9c0b2;border-radius:4px;padding:12px 36px 12px 13px;font:15px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:var(--brand-charcoal);max-width:100%}
.trial-controls{display:flex;gap:12px}
.trial-controls button{background:transparent;border:1px solid #c9c0b2;border-radius:4px;padding:12px 17px;cursor:pointer;font:13px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:var(--brand-charcoal)}
.trial-layout{display:grid;grid-template-columns:1fr 1fr;gap:48px;margin-top:38px;align-items:start}
.trial-results,.trial-finding{scroll-margin-top:24px}
.trial-results:focus,.trial-finding:focus{outline:none}
.trial-overview{padding:88px 0 96px;border-top:1px solid var(--brand-line)}
.trial-overview h2{font-size:clamp(34px,4.2vw,55px);line-height:1.12;font-weight:500;letter-spacing:-.05em;margin-top:23px;max-width:720px}
.trial-overview h2 span{color:var(--brand-grey)}
.trial-overview-intro{font-size:17px;line-height:1.8;color:#716b62;max-width:720px;margin-top:24px!important}
.trial-capabilities{margin-top:42px;border-top:1px solid var(--brand-line)}
.trial-capability{display:grid;grid-template-columns:34px 1fr 1.1fr;gap:28px;padding:28px 0;border-bottom:1px solid var(--brand-line);align-items:start}
.trial-capability>span{font-size:11px;color:var(--brand-grey);padding-top:5px}
.trial-capability h3{font-size:23px;font-weight:500;letter-spacing:-.03em;line-height:1.3}
.trial-capability p{font-size:14px;line-height:1.85;color:#716b62}
.trial-capability .trial-value{font-size:13px;margin-top:12px;color:var(--brand-charcoal)}
.trial-value-label{font-weight:600}
.trial-company-value{background:var(--brand-sand);padding:34px 38px;margin-top:42px;display:grid;grid-template-columns:1fr 1.15fr;gap:44px}
.trial-company-value h3{font-size:27px;font-weight:500;letter-spacing:-.035em;line-height:1.25;margin-top:15px}
.trial-company-value p{font-size:15px;color:#71695e;line-height:1.85}
.trial-company-value strong{font-weight:500;color:var(--brand-charcoal)}
.trial-next{margin-top:32px;border-top:1px solid var(--brand-line);padding-top:28px}
.trial-next p{font-size:14px;line-height:1.85;color:#716b62;max-width:790px}
.trial-next .product-kicker{font-size:11px;margin-bottom:12px}
.trial-paper{background:#fcfbf8;border:1px solid var(--brand-line);padding:35px}
.trial-paper h2{font-size:22px;font-weight:500;letter-spacing:-.025em;margin:18px 0 6px}
.trial-paper .trial-reference{font-size:13px;color:var(--brand-grey)}
.trial-document-values{display:grid;grid-template-columns:1fr auto;gap:0;margin:30px 0 0;font-size:14px}
.trial-document-values dt,.trial-document-values dd{margin:0;padding:13px 0;border-top:1px solid #e3ded4}
.trial-document-values dd{text-align:right;font-weight:500;font-variant-numeric:tabular-nums}
.trial-document-values .trial-highlight{background:var(--brand-sand);padding:3px 5px;margin:-3px -5px;box-decoration-break:clone}
.trial-records{margin-top:22px;color:var(--brand-grey);font-size:12px;line-height:1.8}
.trial-records summary{cursor:pointer;color:var(--brand-charcoal)}
.trial-records p{margin-top:12px}
.trial-progress{margin-bottom:24px;font-size:12px;color:var(--brand-grey);display:flex;justify-content:space-between;gap:18px}
.trial-step{border-top:1px solid var(--brand-line);padding:20px 0;color:#a49d91}
.trial-step summary{display:flex;gap:15px;align-items:baseline;cursor:pointer;list-style:none;font-size:16px}
.trial-step summary::-webkit-details-marker{display:none}
.trial-step summary span:first-child{font-size:11px;width:20px;flex-shrink:0}
.trial-step summary span:last-child{margin-left:auto;font-size:11px}
.trial-step.is-done{color:var(--brand-charcoal)}
.trial-step p{font-size:13px;color:var(--brand-grey);margin:13px 0 0 35px;line-height:1.8}
.trial-comparison{overflow-x:auto;margin:17px 0 0 35px}
.trial-comparison table{border-collapse:collapse;font-size:12px;width:100%;min-width:290px;text-align:left}
.trial-comparison th{font-weight:500;color:var(--brand-grey);padding:10px 8px 10px 0}
.trial-comparison td{padding:11px 8px 11px 0;border-top:1px solid var(--brand-line);font-variant-numeric:tabular-nums}
.trial-finding{background:var(--brand-sand);padding:24px;margin-top:22px}
.trial-finding h3{font-size:20px;font-weight:500;letter-spacing:-.025em;margin-top:13px}
.trial-finding p{font-size:13px;color:#71695e;margin-top:12px;line-height:1.85}
.trial-finding small{display:block;color:var(--brand-grey);font-size:11px;margin-top:13px}
.trial-waiting{font-size:13px;color:var(--brand-grey);padding:20px 0;border-top:1px solid var(--brand-line)}
.product-access{padding:80px 0 96px}
.product-access .access-apply-intro{top:110px}
.product-access .access-apply-intro h1{font-size:clamp(38px,4.5vw,60px);line-height:1.08;font-weight:500;letter-spacing:-.05em;margin:25px 0}
.product-access .access-apply-intro>p{max-width:400px;font-size:15px}
@media(min-width:1120px){.product-nav-intro .product-logo{display:none}.product-nav-intro .product-nav-workforce{margin-right:auto}}
@media(max-width:1050px){.product-links{gap:20px}.product-nav-inner{padding:0 28px;gap:20px}.product-story{gap:60px}.product-wrap{padding:0 36px}}
@media(max-width:1119px){.product-nav-intro .product-logo{visibility:hidden}.product-menu-button{display:block}.product-nav-inner{min-height:70px;padding:0 24px}.product-links{display:none;position:absolute;top:70px;left:0;right:0;background:var(--brand-cream);padding:25px 24px 30px;border-bottom:1px solid var(--brand-line);align-items:stretch;gap:0;flex-direction:column;box-shadow:0 22px 30px -30px #29282655}.product-links.is-open{display:flex}.product-links a{padding:14px 0}.product-links a:last-child{margin-top:13px;text-align:center}.product-nav-intro .product-nav-inner{padding-left:24px}.product-nav-intro{background:transparent}.product-nav-intro .product-links{top:72px}.product-story{gap:40px}.product-work-heading{display:block}.product-work-heading>p{max-width:520px;margin-top:24px}.trial-layout{gap:28px}.trial-paper{padding:26px}}
@media(max-width:700px){.trial-overview{padding:65px 0}.trial-overview-intro{font-size:16px}.trial-capability{grid-template-columns:25px 1fr;gap:12px 15px}.trial-capability>div{grid-column:2}.trial-capability h3{font-size:22px}.trial-company-value{grid-template-columns:1fr;gap:20px;padding:27px}.trial-next p{font-size:13px}}
@media(max-width:700px){.product-wrap{padding:0 24px}.product-hero{padding:145px 0 50px;min-height:740px;min-height:100svh}.product-hero h1{font-size:clamp(49px,11.5vw,74px);letter-spacing:-.065em;margin-top:24px}.product-hero-description{font-size:16px;margin-top:25px!important;max-width:390px}.product-actions{gap:24px;margin-top:27px}.product-scroll{margin-top:55px}.product-section{padding:72px 0}.product-story{grid-template-columns:1fr;gap:24px}.product-story-copy{padding-top:0;font-size:16px}.product-story h2{font-size:39px}.product-work-heading h2{font-size:38px}.product-row{grid-template-columns:25px 1fr;gap:10px 15px;padding:26px 0}.product-row h3{font-size:21px}.product-row p{grid-column:2;font-size:14px}.product-invitation{padding:72px 0}.product-invitation .product-wrap{display:block}.product-invitation .product-actions{margin-top:30px}.product-invitation small{max-width:360px}.product-footer{padding:30px 24px}.product-page-head{padding:65px 0 48px}.product-page-head h1{font-size:46px}.product-page-head>div>p:last-child{font-size:16px}.product-detail-row{grid-template-columns:30px 1fr;gap:15px}.product-detail-row p{grid-column:2;font-size:15px}.product-models{grid-template-columns:1fr}.product-model{padding:30px 0 40px}.trial-layout{grid-template-columns:1fr;gap:30px}.trial-toolbar{align-items:start;flex-direction:column}.trial-toolbar select{font-size:16px}.trial-paper{padding:27px}.trial-progress{margin-bottom:17px}.product-content{padding-bottom:65px}.product-access{padding:55px 0 70px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
`;

const NAV = [['Home', '/'], ['Workforce', '/workforce'], ['How it works', '/how-it-works'], ['Upcoming models', '/models'], ['Company', '/company']];

export function ProductNavigation({ intro = false }) {
  const [open, setOpen] = useState(false);
  const menuButton = useRef(null);
  useEffect(() => {
    if (!open) return;
    const close = event => { if (event.key === 'Escape') { setOpen(false); menuButton.current?.focus(); } };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  return <header className={'product-nav' + (intro ? ' product-nav-intro' : '')}>
    <div className="product-nav-inner">
      <a className="product-logo" href="/" aria-label="Alvryn home">{intro ? 'Workforce' : 'Alvryn'}</a>
      <button className="product-menu-button" ref={menuButton} aria-expanded={open} aria-controls="product-menu" onClick={() => setOpen(value => !value)}>{open ? 'Close −' : 'Menu +'}</button>
      <nav id="product-menu" className={'product-links' + (open ? ' is-open' : '')} aria-label="Primary">
        {NAV.map(([label, href]) => <a key={href} href={href} className={href === '/workforce' ? 'product-nav-workforce' : undefined} aria-current={window.location.pathname === href ? 'page' : undefined}>{label}</a>)}
        <a className="product-nav-trial" href="/trial">Trial run <span aria-hidden="true">↗</span></a>
      </nav>
    </div>
  </header>;
}

export function ProductFooter() {
  return <footer className="product-footer"><span>© Alvryn Technologies</span><div><a href="/company">Company</a><a href="/privacy">Privacy</a><a href="/early-access#programme-conditions">Access conditions</a><a href={COMPANY_GMAIL_URL} target="_blank" rel="noopener noreferrer" title="Compose an email to Alvryn in Gmail">Contact ↗</a></div></footer>;
}

function Invitation() {
  return <section className="product-invitation" id="initial-access"><div className="product-wrap">
    <div><p className="product-kicker">Private access</p><h2>A closer look,<br />with your company in mind.</h2><p>Initial access is considered for companies whose purchasing records and review workflows fit the supported scope.</p></div>
    <div><div className="product-actions"><a className="product-button" href="/early-access">Request initial access <span aria-hidden="true">↗</span></a></div><small>Applications are reviewed for fit. Selection and access are subject to availability.</small></div>
  </div></section>;
}

export function ProductLanding({ intro = false }) {
  return <main className="product-site"><style>{ACCESS_STYLES + PRODUCT_STYLES}</style>
    <ProductNavigation intro={intro} />
    <section className="product-hero"><div className="product-wrap">
      <p className="product-kicker">Invoice processing. Financial discrepancy review.</p>
      <h1>Invoice checks.<br /><span>Without the chase.</span></h1>
      <p className="product-hero-description">Alvryn checks supplier invoices against your purchasing records. <strong>Potential discrepancies, with the evidence to review them.</strong></p>
      <div className="product-actions"><a className="product-button" href="/trial">See a trial run <span aria-hidden="true">↗</span></a><a className="product-link" href="/how-it-works">How it works</a></div>
      <a className="product-scroll" href="#the-problem" style={{ textDecoration: 'none' }}><span>Less searching. A clearer review.</span><span aria-hidden="true">↓</span></a>
      {intro && <div id="scroll-cue" className="scroll-cue" style={{ display: 'none' }} aria-hidden="true"><div className="drip" /></div>}
    </div></section>
    <section className="product-section" id="the-problem"><div className="product-wrap product-story">
      <div><p className="product-kicker">The work behind the invoice</p><h2>One invoice.<br /><span>Too many places<br />to check.</span></h2></div>
      <div className="product-story-copy"><p>The price is in a purchase order. The quantity is in a delivery record. An earlier bill is somewhere in the history.</p><p><strong>Your team has to bring those records together</strong> before it can decide whether an invoice is right. Differences mean more searching, comparing and following up.</p></div>
    </div></section>
    <section className="product-section product-sand" id="products"><div className="product-wrap">
      <div className="product-work-heading"><div><p className="product-kicker">Where Alvryn helps</p><h2>The checks come together.<br /><span>Your team makes the call.</span></h2></div><p>Built to reduce the work of comparing records, so reviewers can focus on the findings that need their attention.</p></div>
      <div className="product-rows">
        <article className="product-row"><span>01</span><h3>Read the invoice.</h3><p>Bring supplier details, quantities and amounts into a structured record for checking.</p></article>
        <article className="product-row"><span>02</span><h3>Compare the records.</h3><p>Check totals, purchase orders, receipt quantities and available invoice history for potential differences.</p></article>
        <article className="product-row"><span>03</span><h3>Review what matters.</h3><p>See what differs and the supporting records together, with the financial decision kept in your team's hands.</p></article>
      </div>
      <div className="product-work-link"><a className="product-link" href="/workforce">Explore Alvryn Workforce <span aria-hidden="true">↗</span></a></div>
    </div></section>
    <Invitation />
  </main>;
}

function PageHead({ label, title, children }) {
  return <section className="product-page-head"><div className="product-wrap"><p className="product-kicker">{label}</p><h1>{title}</h1><p>{children}</p></div></section>;
}

function Workforce() {
  return <><PageHead label="Alvryn Workforce" title={<>Invoice processing.<br /><span>Evidence for every review.</span></>}>A focused starting point for finance teams: supplier invoice checks against the records of what you ordered, received and were billed before.</PageHead>
    <section className="product-content"><div className="product-wrap">
      {[
        ['01', 'Invoice arithmetic', 'Compare printed line amounts and invoice totals with calculated values. Differences and missing information are brought into the review.'],
        ['02', 'Purchase order matching', 'Compare invoiced prices and quantities with confirmed supplier and purchase order records.'],
        ['03', 'Receipt discrepancies', 'Check invoiced quantities against confirmed goods receipts and relevant earlier billing records.'],
        ['04', 'Possible duplicates', 'Compare supplier invoices with available history and surface candidates for a person to verify.'],
      ].map(([number, title, copy]) => <article className="product-detail-row" key={number}><span>{number}</span><h2>{title}</h2><p>{copy}</p></article>)}
      <p className="product-note">The proposed initial scope is PO-backed supplier invoices for physical goods. Checks depend on readable documents, confirmed reference records and configured rules. A finding needs verification; a passed check does not approve an invoice.</p>
      <div className="product-actions"><a className="product-button" href="/trial">See the checks in a trial <span aria-hidden="true">↗</span></a><a className="product-link" href="/how-it-works">Explore the workflow</a></div>
    </div></section><Invitation /></>;
}

function HowItWorks() {
  return <><PageHead label="How it works" title={<>From source records<br /><span>to a supported finding.</span></>}>The invoice tells part of the story. Alvryn compares it with confirmed purchasing records and keeps the evidence alongside the result.</PageHead>
    <section className="product-content"><div className="product-wrap">
      {[
        ['01', 'Read and structure', 'Readable invoice documents or text are used to extract supported fields. Incomplete or uncertain fields can require correction before the checks can be relied on.'],
        ['02', 'Use confirmed references', 'Supplier details, purchase orders, goods receipts and relevant history provide the records to compare against. Missing records may prevent a complete check.'],
        ['03', 'Check and explain', 'Configured rules compare arithmetic, prices and quantities, and look for possible duplicates. The result identifies what differs and points to its source records.'],
        ['04', 'Let your team decide', 'A reviewer checks the evidence and decides how to handle a finding. A discrepancy can reflect a missing receipt, a partial delivery or a billing arrangement that needs clarification. Alvryn does not make payments or post records to an ERP.'],
      ].map(([number, title, copy]) => <article className="product-detail-row" key={number}><span>{number}</span><h2>{title}</h2><p>{copy}</p></article>)}
      <div className="product-actions"><a className="product-button" href="/trial">Watch a sample run <span aria-hidden="true">↗</span></a></div>
    </div></section><Invitation /></>;
}

function Models() {
  return <><PageHead label="Upcoming models" title={<>One focused beginning.<br /><span>A broader direction.</span></>}>Invoice operations is the initial focus. These are the other areas in Alvryn's longer-term workforce vision.</PageHead>
    <section className="product-content"><div className="product-wrap"><div className="product-models">
      <article className="product-model"><span className="product-kicker">Initial focus · Private access</span><h2>Invoice Operations</h2><p>Invoice processing and financial discrepancy review, supported by purchasing records and evidence.</p><a className="product-link" href="/workforce">Explore the initial scope ↗</a></article>
      {[
        ['Procurement Operations', 'Purchase order workflows, supplier communication and the records behind purchasing decisions.'],
        ['HR Onboarding', 'Document collection and review workflows for bringing new employees into a company.'],
        ['Logistics Operations', 'Shipping records, delivery confirmations and the work of reconciling them.'],
      ].map(([name, copy]) => <article className="product-model" key={name}><span className="product-kicker">Planned direction</span><h2>{name}</h2><p>{copy}</p></article>)}
    </div><p className="product-note">Planned directions are not available products or launch commitments. Scope, priority and availability may change. Participation terms identify the capabilities actually offered.</p></div></section></>;
}

function Company() {
  return <><PageHead label="Company" title={<>Make the repetitive work<br /><span>easier to get through.</span></>}>Alvryn's focus is the work behind a business decision: reading documents, comparing records and bringing the relevant evidence together.</PageHead>
    <section className="product-content"><div className="product-wrap">
      <article className="product-detail-row"><span>01</span><h2>Start with a defined process.</h2><p>Alvryn Workforce begins with supplier invoice processing and financial discrepancy review. A narrow scope makes it clear what the software checks and what your team still needs to verify.</p></article>
      <article className="product-detail-row"><span>02</span><h2>Keep judgment with people.</h2><p>Checks support financial decisions. They do not replace them. Your team reviews the records and remains responsible for approvals and how discrepancies are handled.</p></article>
      <article className="product-detail-row"><span>03</span><h2>Be clear about participation.</h2><p>Initial access is considered against supported workflows and capacity. Any invitation sets out scope and participation conditions before your company decides whether to proceed.</p></article>
      <div className="product-actions"><a className="product-link" href={COMPANY_GMAIL_URL} target="_blank" rel="noopener noreferrer" title="Compose an email to Alvryn in Gmail">Contact Alvryn in Gmail ↗</a><a className="product-link" href="/models">Explore the longer-term vision</a></div>
    </div></section></>;
}

const USD = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
const STEPS = ['Read the invoice', 'Check the line arithmetic', 'Compare the PO and receipt', 'Look through invoice history'];

function TrialWorkforceOverview() {
  const capabilities = [
    ['Receive and organise your documents.', 'Receive supported invoice, purchase order and goods receipt PDFs or text. Structure invoice fields and retain source evidence; review supporting records before confirming them for checks.', 'Less retyping and a clearer starting point for review.'],
    ['Check the calculations.', 'Compare line calculations and printed totals. Reconcile supported discounts, adjustments, taxes and rounding when the source provides the evidence.', 'Find amount differences before your team makes a payment decision.'],
    ['Compare supplier and PO records.', 'Check confirmed supplier details, purchase order references, unit prices and ordered quantities against the invoice.', 'Bring agreed purchasing terms and the billed values into one review.'],
    ['Compare what arrived with what was billed.', 'Use confirmed goods receipts and relevant earlier billing to review quantities, partial deliveries and possible overbilling. Missing records are flagged for follow-up.', 'Show exactly which delivery evidence or quantity difference needs attention.'],
    ['Look for possible duplicate bills.', 'Compare supplier invoices with available invoice history and identify duplicate candidates for a reviewer to verify.', 'Help your team investigate repeat billing before approving payment.'],
    ['Keep the checks current.', 'Later confirmed PO and receipt records can update related invoice checks automatically. Reanalyse a retained invoice when extraction needs correction, then inspect the new results alongside earlier evidence.', 'Follow up on missing records without losing the invoice or its earlier review history.'],
    ['Carry the finding through review.', 'Keep discrepancies and missing evidence in review cases. Assign a reviewer, add notes, record a resolution, recheck updated evidence and inspect saved source records and activity history.', 'Keep ownership, supporting records and decisions together so work does not get lost between people.'],
  ];
  return <section className="trial-overview" id="workforce-scope" aria-labelledby="workforce-scope-heading"><div className="product-wrap">
    <p className="product-kicker">The full invoice workflow</p>
    <h2 id="workforce-scope-heading">Three examples are a starting point.<br /><span>Here is the work around them.</span></h2>
    <p className="trial-overview-intro">Alvryn Workforce brings invoice intake, four check areas and reviewer follow-up into one process. The sample above shows a few outcomes; your company's invoices can need several of these checks together.</p>
    <div className="trial-capabilities">{capabilities.map(([title, copy, value], index) => <article className="trial-capability" key={title}>
      <span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><div><p>{copy}</p><p className="trial-value"><span className="trial-value-label">For your team: </span>{value}</p></div>
    </article>)}</div>
    <div className="trial-company-value"><div><p className="product-kicker">Why this matters</p><h3>Less searching.<br />A clearer path to a decision.</h3></div><p>A finance reviewer can see <strong>what was billed, what was agreed, what was received and why a result needs attention</strong> together. The team can spend its review effort on differences and missing evidence, while retaining a record of who handled each case and why.</p></div>
    <p className="product-note">Initial scope: PO-backed supplier invoices for physical goods, using readable documents and confirmed company records. Your team reviews extraction and findings, confirms reference data and retains approval decisions. Payment execution and ERP posting are outside the current scope.</p>
    <div className="trial-next"><p className="product-kicker">Beyond invoice operations · Planned</p><p>Procurement Operations, HR Onboarding and Logistics Operations are longer-term directions. They are not included in the current invoice workflow.</p><div className="product-actions"><a className="product-link" href="/models">Explore upcoming models ↗</a><a className="product-link" href="/how-it-works">See how the workflow fits together ↗</a></div></div>
  </div></section>;
}

export function TrialRun() {
  const [scenario, setScenario] = useState('quantity');
  const [completed, setCompleted] = useState(0);
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const resultsRef = useRef(null);
  const findingRef = useRef(null);
  const sample = SAMPLES[scenario];
  const result = checkSample(sample);
  const finished = completed === STEPS.length;
  useEffect(() => {
    // Run after the route's initial scroll reset and the sample layout is mounted.
    const frame = window.requestAnimationFrame(() => resultsRef.current?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    }));
    return () => window.cancelAnimationFrame(frame);
  }, [scenario, run]);
  useEffect(() => {
    if (!finished) return;
    const frame = window.requestAnimationFrame(() => findingRef.current?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    }));
    return () => window.cancelAnimationFrame(frame);
  }, [finished]);
  useEffect(() => {
    if (paused || finished) return;
    const timer = setTimeout(() => setCompleted(value => value + 1), 1100);
    return () => clearTimeout(timer);
  }, [completed, paused, finished, scenario, run]);
  const restart = () => { setCompleted(0); setPaused(false); setRun(value => value + 1); };
  const stepDescriptions = [
    `Read ${sample.invoice}: ${sample.invoiceQuantity} units at ${USD(sample.invoiceUnitPrice)} each. The supported fields are highlighted on the sample invoice.`,
    result.arithmeticMatches ? `${sample.invoiceQuantity} × ${USD(sample.invoiceUnitPrice)} = ${USD(result.calculatedSubtotal)}. The line calculation agrees with the printed subtotal.` : 'The calculated line amount differs from the printed subtotal.',
    `${sample.po} records ${sample.orderedQuantity} units. ${sample.receipt} records ${sample.receivedQuantity} received. ${result.priceMatches ? 'The unit prices agree.' : 'The unit prices differ.'}`,
    result.duplicate ? 'The same supplier and invoice number appear in the supplied sample history. This is a candidate to verify.' : 'No earlier invoice in the supplied sample history has the same supplier and invoice number.',
  ];
  return <><PageHead label="Trial run · Fictional records" title={<>Watch the checks.<br /><span>See what needs review.</span></>}>Three sample scenarios give you a first look at invoice review. The checks start automatically, and the page takes you to the result.</PageHead>
    <section className="product-content"><div className="product-wrap">
      <p className="product-note" style={{ marginTop: 0, marginBottom: 26 }}>These examples are part of a broader workflow, from reading invoices to tracking reviewer decisions. <a href="#workforce-scope">See everything Workforce covers ↓</a></p>
      <div className="trial-toolbar"><label htmlFor="trial-scenario">Sample scenario<select id="trial-scenario" value={scenario} onChange={event => { setScenario(event.target.value); restart(); }}>{Object.entries(SAMPLES).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></label><div className="trial-controls">{!finished && <button onClick={() => setPaused(value => !value)}>{paused ? 'Resume' : 'Pause'}</button>}<button onClick={restart}>Run again ↻</button></div></div>
      <div className="trial-layout"><div>
        <article className="trial-paper" aria-label="Sample invoice"><p className="product-kicker">Supplier invoice · Sample</p><h2>{sample.supplier}</h2><p className="trial-reference">{sample.invoice} / {sample.po}</p><dl className="trial-document-values"><dt>Item</dt><dd>{sample.item}</dd><dt>Quantity</dt><dd><span className={completed >= 1 ? 'trial-highlight' : ''}>{sample.invoiceQuantity}</span></dd><dt>Unit price</dt><dd><span className={completed >= 1 ? 'trial-highlight' : ''}>{USD(sample.invoiceUnitPrice)}</span></dd><dt>Line subtotal</dt><dd><span className={completed >= 2 ? 'trial-highlight' : ''}>{USD(sample.declaredSubtotal)}</span></dd></dl></article>
        <details className="trial-records"><summary>Inspect the supporting sample records +</summary><p><strong>{sample.po}</strong><br />{sample.orderedQuantity} units ordered at {USD(sample.orderedUnitPrice)} each.</p><p><strong>{sample.receipt}</strong><br />{sample.receivedQuantity} units recorded as received.</p><p><strong>Earlier invoice records</strong><br />{sample.earlierInvoices.length ? `${sample.invoice} · ${sample.supplier}` : 'No earlier invoices supplied in this scenario.'}</p></details>
      </div><div className="trial-results" ref={resultsRef} role="region" aria-label="Sample check results">
        <div className="trial-progress" role="status" aria-live="polite"><span>{finished ? 'Sample checks complete' : paused ? 'Sample paused' : 'Running sample checks'}</span><span>{completed} / {STEPS.length}</span></div>
        {STEPS.map((title, index) => <details className={'trial-step' + (completed > index ? ' is-done' : '')} key={scenario + run + index} open={completed > index}>
          <summary><span>{completed > index ? '✓' : String(index + 1).padStart(2, '0')}</span>{title}<span>{completed > index ? 'Checked' : 'Pending'}</span></summary>
          {completed > index && <><p>{stepDescriptions[index]}</p>{index === 2 && <div className="trial-comparison"><table><thead><tr><th>Record</th><th>Quantity</th><th>Unit price</th></tr></thead><tbody><tr><td>Invoice</td><td>{sample.invoiceQuantity}</td><td>{USD(sample.invoiceUnitPrice)}</td></tr><tr><td>Purchase order</td><td>{sample.orderedQuantity}</td><td>{USD(sample.orderedUnitPrice)}</td></tr><tr><td>Goods receipt</td><td>{sample.receivedQuantity}</td><td>—</td></tr></tbody></table></div>}</>}
        </details>)}
        {finished ? <div className="trial-finding" ref={findingRef} role="status" aria-live="polite"><span className="product-kicker">{result.findings.length ? 'Finding for your reviewer' : 'Supported checks passed'}</span>{result.findings.length ? result.findings.map(finding => <div key={finding.title}><h3>{finding.title}</h3><p>{finding.detail}</p><small>Source: {finding.source}</small></div>) : <><h3>The sample records agree.</h3><p>The checks found no difference in this sample. This does not approve the invoice or guarantee its overall accuracy.</p></>}<p><strong>What your team gains: </strong>{scenario === 'quantity' ? 'The reviewer can go straight to the 20-unit difference and check for a missing receipt or a corrected bill.' : scenario === 'duplicate' ? 'The candidate bill and the earlier record are identified together, giving the reviewer a clear starting point for investigating repeat billing.' : 'The reviewer can see which sample comparisons agree and focus follow-up on invoices with differences or missing evidence.'}</p><small>Your team verifies the evidence and makes the financial decision.</small></div> : <p className="trial-waiting">The finding appears when these checks finish.</p>}
      </div></div>
      <p className="product-note">This walkthrough runs built-in comparisons on fixed fictional records. It does not upload documents, use a live extraction service or measure production speed or accuracy. Invoice amounts are sample document values. No payment, posting or external action occurs.</p>
    </div></section><TrialWorkforceOverview /><Invitation /></>;
}

function AccessPage({ endpoint }) {
  useEffect(() => {
    if (!window.location.hash) return;
    const target = document.getElementById(window.location.hash.slice(1));
    if (target) { if (target.tagName === 'DETAILS') target.open = true; target.scrollIntoView(); }
  }, []);
  return <section className="product-access" id="initial-access"><div className="product-wrap access-apply-grid"><div className="access-apply-intro"><p className="product-kicker">Private initial access</p><h1>Put your company<br />forward.</h1><p>Tell us about your purchasing records and invoice workflow. Applications are considered against the supported scope and onboarding capacity.</p><p>Supplier invoices for physical goods, purchase orders, receipt records and a finance team responsible for review are the initial fit.</p><p>No account or financial documents are needed to apply. Selection, timing and availability may change. Any invitation identifies scope and participation terms.</p></div><EarlyAccessForm endpoint={endpoint} /></div></section>;
}

export default function ProductPage({ page, endpoint }) {
  useEffect(() => { document.title = ({ workforce: 'Invoice processing & discrepancy review', 'how-it-works': 'How it works', models: 'Upcoming models', company: 'Company', trial: 'Trial run', 'early-access': 'Request initial access' }[page] || 'Alvryn') + ' | Alvryn Workforce'; window.scrollTo(0, 0); }, [page]);
  return <><style>{ACCESS_STYLES + PRODUCT_STYLES}</style><ProductNavigation /><main className="product-site">{page === 'workforce' ? <Workforce /> : page === 'how-it-works' ? <HowItWorks /> : page === 'models' ? <Models /> : page === 'company' ? <Company /> : page === 'trial' ? <TrialRun /> : <AccessPage endpoint={endpoint} />}</main><ProductFooter /></>;
}
