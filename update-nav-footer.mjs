import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const BASE = 'C:/Claude/FinXtra NEW WEBSITE';

// ── CSS to inject (before /* HERO */ in style block) ──────────────────────────
const NEW_CSS = `
/* CONTACT STRIP */
.contact-strip{background:var(--navy);padding:8px 5rem;display:flex;align-items:center;justify-content:center;gap:1.5rem;font-size:12px;color:rgba(255,255,255,.7);position:sticky;top:0;z-index:101}
.contact-strip a{color:#FFDA03;text-decoration:none;display:flex;align-items:center;gap:5px;transition:color .2s}
.contact-strip a:hover{color:#fff}
.contact-strip .divider{width:1px;height:12px;background:rgba(255,255,255,.3)}

/* NAV */
nav{background:rgba(13,27,46,.97);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,.08);height:104px;display:flex;align-items:center;padding:0 5rem;position:sticky;top:33px;z-index:100;font-family:inherit}
.nav-inner{width:100%;display:flex;align-items:center;gap:2rem;justify-content:flex-start}
.logo{display:flex;align-items:center;text-decoration:none;flex-shrink:0}
.logo img{height:96px;width:auto;display:block}
.nav-links{display:flex;align-items:center;gap:0;list-style:none;flex:1;justify-content:center}
.nav-links a{text-decoration:none;color:#FFDA03;font-size:13px;font-weight:500;padding:8px 14px;border-radius:6px;transition:color .2s,background .2s;white-space:nowrap}
.nav-links a:hover{color:#fff;background:rgba(255,255,255,.08)}
.nav-right{display:flex;align-items:center;gap:.75rem}
.lang-select-ix{border:1px solid rgba(255,255,255,.2);border-radius:6px;padding:6px 10px;font-size:12px;font-weight:600;color:#fff;background:rgba(255,255,255,.08);cursor:pointer;outline:none;transition:border-color .2s;font-family:inherit}
.lang-select-ix:hover{border-color:var(--brand)}
.lang-select-ix option{background:var(--navy);color:#fff}
.btn-apply{background:var(--brand);border:none;border-radius:100px;padding:8px 20px;font-size:13px;font-weight:600;color:#fff;text-decoration:none;cursor:pointer;transition:background .2s,transform .15s cubic-bezier(.34,1.56,.64,1);font-family:inherit}
.btn-apply:hover{background:var(--brand-dark);transform:translateY(-1px)}
.nav-dropdown-wrap{position:relative;list-style:none}
.nav-dropdown-trigger{display:flex;align-items:center;gap:5px;background:none;border:none;color:#FFDA03;font-size:13px;font-weight:500;padding:8px 14px;border-radius:6px;cursor:pointer;white-space:nowrap;transition:color .2s,background .2s;font-family:inherit}
.nav-dropdown-trigger:hover{color:#fff;background:rgba(255,255,255,.08)}
.nav-dropdown-trigger svg{transition:transform .25s cubic-bezier(.4,0,.2,1);flex-shrink:0}
.nav-dropdown-wrap.open .nav-dropdown-trigger{color:#fff;background:rgba(255,255,255,.08)}
.nav-dropdown-wrap.open .nav-dropdown-trigger svg{transform:rotate(180deg)}
.nav-dropdown-panel{position:absolute;top:calc(100% + 6px);left:0;background:rgba(13,27,46,.98);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:.5rem 0;min-width:176px;opacity:0;pointer-events:none;transform:translateY(-6px);transition:opacity .2s cubic-bezier(.4,0,.2,1),transform .2s cubic-bezier(.4,0,.2,1);box-shadow:0 12px 40px rgba(0,0,0,.45);z-index:200}
.nav-dropdown-wrap.open .nav-dropdown-panel{opacity:1;pointer-events:auto;transform:translateY(0)}
.nav-dropdown-panel a{display:block;padding:9px 18px;color:rgba(255,255,255,.7);font-size:13px;font-weight:500;text-decoration:none;transition:color .15s,background .15s;white-space:nowrap}
.nav-dropdown-panel a:hover{color:#fff;background:rgba(255,255,255,.07)}
.nav-dropdown-panel a span.dd-icon{display:inline-block;width:20px;opacity:.5;font-size:11px}

/* FOOTER */
footer{background:var(--navy);padding:5rem 5rem 2rem}
.footer-top{display:grid;grid-template-columns:260px 1fr 280px;gap:4rem;margin-bottom:3rem}
.footer-brand img{height:144px;width:auto;margin-bottom:1rem}
.footer-brand-desc{font-size:.8125rem;color:#fff;line-height:1.65;margin-bottom:1.25rem}
.footer-address{display:flex;align-items:flex-start;gap:7px;font-size:.75rem;color:rgba(255,255,255,.3);line-height:1.6;margin-bottom:1.25rem}
.footer-address svg{flex-shrink:0;margin-top:2px;opacity:.6}
.footer-socials{display:flex;gap:.75rem}
.footer-social{width:32px;height:32px;border-radius:8px;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.7);text-decoration:none;transition:background .2s,color .2s}
.footer-social:hover{background:var(--brand);color:#fff}
.footer-social svg{width:15px;height:15px}
.footer-nav-cols{display:grid;grid-template-columns:repeat(4,1fr);gap:2rem}
.footer-col-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#FFDA03;margin-bottom:1rem}
.footer-col ul{list-style:none;display:flex;flex-direction:column;gap:.5rem}
.footer-col ul a{font-size:.8125rem;color:rgba(255,255,255,.7);text-decoration:none;transition:color .2s}
.footer-col ul a:hover{color:#fff}
.footer-newsletter-title{font-size:.9375rem;font-weight:600;color:#FFDA03;margin-bottom:.5rem}
.footer-newsletter-sub{font-size:.75rem;color:#fff;margin-bottom:1rem;line-height:1.5}
.footer-form{display:flex;flex-direction:column;gap:.625rem}
.footer-form input{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.12);border-radius:100px;padding:10px 16px;font-size:13px;color:#fff;outline:none;transition:border-color .2s;font-family:inherit}
.footer-form input::placeholder{color:rgba(255,255,255,.3)}
.footer-consent{font-size:.68rem;color:rgba(255,255,255,.3);margin-top:.625rem;line-height:1.5}
.footer-form input:focus{border-color:var(--brand)}
.footer-form button{background:var(--brand);color:#fff;border:none;border-radius:100px;padding:10px;font-size:13px;font-weight:600;cursor:pointer;transition:background .2s,transform .15s cubic-bezier(.34,1.56,.64,1);font-family:inherit}
.footer-form button:hover{background:var(--brand-dark);transform:translateY(-1px)}
.reg-disclosure-wrap{margin-bottom:1.5rem}
.reg-disclosure-btn{display:inline-flex;align-items:center;gap:.5rem;background:transparent;border:1px solid rgba(0,168,204,.45);border-radius:6px;padding:.45rem 1rem;color:var(--brand);font-size:.8125rem;font-weight:500;cursor:pointer;transition:background .2s,border-color .2s;font-family:inherit}
.reg-disclosure-btn:hover{background:rgba(0,168,204,.08);border-color:var(--brand)}
.reg-chevron{transition:transform .3s}
.reg-disclosure-btn[aria-expanded="true"] .reg-chevron{transform:rotate(180deg)}
.reg-disclosure-panel{max-height:0;overflow:hidden;transition:max-height .4s cubic-bezier(.4,0,.2,1)}
.reg-disclosure-panel.open{max-height:900px}
.reg-disclosure-panel p{margin-top:.75rem;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:1rem 1.25rem;font-size:.75rem;color:rgba(255,255,255,.7);line-height:1.7}
.reg-disclosure-panel p strong{color:var(--brand)}
.footer-bottom{border-top:1px solid rgba(255,255,255,.1);padding-top:2rem;display:flex;align-items:center;justify-content:space-between}
.footer-copy{font-size:11px;color:rgba(255,255,255,.3)}
.footer-legal{display:flex;gap:1.5rem}
.footer-legal a{font-size:11px;color:rgba(255,255,255,.3);text-decoration:none;transition:color .2s}
.footer-legal a:hover{color:rgba(255,255,255,.7)}
`;

// ── Contact Strip HTML ─────────────────────────────────────────────────────────
const CONTACT_STRIP_HTML = `<!-- CONTACT STRIP -->
<div class="contact-strip">
  <a href="tel:+15148921111">
    <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
    (514) 892-1111
  </a>
  <div class="divider"></div>
  <a href="tel:+14166277111">
    <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
    (416) 627-7111
  </a>
  <div class="divider"></div>
  <a href="tel:+18446277111">
    <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
    Toll free: 1-844-627-7111
  </a>
  <div class="divider"></div>
  <a href="mailto:info@finxtra.com" style="color:#FFDA03">
    <svg width="12" height="12" fill="var(--brand)" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
    info@finxtra.com
  </a>
  <div class="divider"></div>
  <a href="https://www.linkedin.com/company/finxtra/" target="_blank" rel="noopener">
    <svg width="13" height="13" fill="var(--brand)" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
    LinkedIn
  </a>
  <div class="divider"></div>
  <a href="https://instagram.com/finxtra" target="_blank" rel="noopener">
    <svg width="13" height="13" fill="var(--brand)" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="var(--brand)" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="var(--brand)" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
    Instagram
  </a>
</div>`;

// ── Main Nav HTML ──────────────────────────────────────────────────────────────
const NAV_HTML = `<!-- MAIN NAV -->
<nav>
  <div class="nav-inner">
    <a href="index.html" class="logo">
      <img src="Brand_Assets/transparent logo.png" alt="FinXtra"/>
    </a>
    <ul class="nav-links">
      <li class="nav-dropdown-wrap" id="aboutDropWrap">
        <button class="nav-dropdown-trigger" type="button" onclick="toggleNavDropdown('aboutDropWrap')" data-i18n="nav_about">About Us
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 1 5 5 9 1"/></svg>
        </button>
        <div class="nav-dropdown-panel">
          <a href="index.html#about" onclick="closeNavDropdowns()"><span class="dd-icon">&#8594;</span><span data-i18n="nav_dd_about">About Us</span></a>
          <a href="index.html#team" onclick="closeNavDropdowns()"><span class="dd-icon">&#8594;</span><span data-i18n="nav_dd_team">Meet the Team</span></a>
          <a href="index.html#careers" onclick="closeNavDropdowns()"><span class="dd-icon">&#8594;</span><span data-i18n="nav_dd_join">Join Us</span></a>
        </div>
      </li>
      <li class="nav-dropdown-wrap" id="bizDropWrap">
        <button class="nav-dropdown-trigger" type="button" onclick="toggleNavDropdown('bizDropWrap')" data-i18n="nav_biz">Solutions for Businesses
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 1 5 5 9 1"/></svg>
        </button>
        <div class="nav-dropdown-panel" style="min-width:280px">
          <a href="index.html#solutions-business" onclick="closeNavDropdowns()"><span class="dd-icon">&#8594;</span><span data-i18n="col_pay">Payments (International &amp; Domestic)</span></a>
          <a href="index.html#solutions-business" onclick="closeNavDropdowns()"><span class="dd-icon">&#8594;</span><span data-i18n="col_fx">FX Risk Management</span></a>
          <a href="index.html#solutions-business" onclick="closeNavDropdowns()"><span class="dd-icon">&#8594;</span><span data-i18n="col_mc">Multi Currency Collection Accounts</span></a>
          <a href="index.html#solutions-business" onclick="closeNavDropdowns()"><span class="dd-icon">&#8594;</span><span data-i18n="col_lend">Business Lending</span></a>
        </div>
      </li>
      <li class="nav-dropdown-wrap" id="indDropWrap">
        <button class="nav-dropdown-trigger" type="button" onclick="toggleNavDropdown('indDropWrap')" data-i18n="nav_ind">Solutions for Individuals
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 1 5 5 9 1"/></svg>
        </button>
        <div class="nav-dropdown-panel" style="min-width:280px">
          <a href="index.html#solutions-individuals" onclick="closeNavDropdowns()"><span class="dd-icon">&#8594;</span><span data-i18n="col_wealth">Personal Wealth &amp; Asset Management</span></a>
          <a href="index.html#solutions-individuals" onclick="closeNavDropdowns()"><span class="dd-icon">&#8594;</span><span data-i18n="col_fund_coll">Fund Collections</span></a>
        </div>
      </li>
      <li class="nav-dropdown-wrap" id="ngoDropWrap">
        <button class="nav-dropdown-trigger" type="button" onclick="toggleNavDropdown('ngoDropWrap')" data-i18n="nav_ngo">Industries
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 1 5 5 9 1"/></svg>
        </button>
        <div class="nav-dropdown-panel" style="min-width:260px">
          <a href="index.html#industries" onclick="closeNavDropdowns()"><span class="dd-icon">&#8594;</span><span data-i18n="nav_dd_ind1">Importers &amp; Exporters</span></a>
          <a href="index.html#industries" onclick="closeNavDropdowns()"><span class="dd-icon">&#8594;</span><span data-i18n="nav_dd_ind2">Software &amp; Technology</span></a>
          <a href="index.html#industries" onclick="closeNavDropdowns()"><span class="dd-icon">&#8594;</span><span data-i18n="nav_dd_ind3">Transport &amp; Logistics</span></a>
          <a href="index.html#industries" onclick="closeNavDropdowns()"><span class="dd-icon">&#8594;</span><span data-i18n="nav_dd_ind4">E-commerce &amp; Retail</span></a>
          <a href="index.html#industries" onclick="closeNavDropdowns()"><span class="dd-icon">&#8594;</span><span data-i18n="nav_dd_ind5">Entertainment &amp; Media</span></a>
          <a href="index.html#industries" onclick="closeNavDropdowns()"><span class="dd-icon">&#8594;</span><span data-i18n="nav_dd_ind6">Talent Agents (Athletes &amp; Entertainment)</span></a>
          <a href="index.html#industries" onclick="closeNavDropdowns()"><span class="dd-icon">&#8594;</span><span data-i18n="nav_dd_ind7">NGOs &middot; NPOs &middot; Charitable Organizations</span></a>
        </div>
      </li>
      <li class="nav-dropdown-wrap" id="whyDropWrap">
        <button class="nav-dropdown-trigger" type="button" onclick="toggleNavDropdown('whyDropWrap')" data-i18n="nav_why">Why FinXtra
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 1 5 5 9 1"/></svg>
        </button>
        <div class="nav-dropdown-panel">
          <a href="index.html#testimonials-anchor" onclick="closeNavDropdowns()"><span class="dd-icon">&#8594;</span><span data-i18n="nav_dd_testimonials">Testimonials</span></a>
          <a href="index.html#value-anchor" onclick="closeNavDropdowns()"><span class="dd-icon">&#8594;</span><span data-i18n="nav_dd_value">Value</span></a>
        </div>
      </li>
      <li class="nav-dropdown-wrap" id="partnerDropWrap">
        <button class="nav-dropdown-trigger" type="button" onclick="toggleNavDropdown('partnerDropWrap')" data-i18n="nav_partner">Partner with Us
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 1 5 5 9 1"/></svg>
        </button>
        <div class="nav-dropdown-panel" style="min-width:280px">
          <a href="index.html#partner" onclick="closeNavDropdowns()"><span class="dd-icon">&#8594;</span><span data-i18n="nav_dd_p1">Real Estate &amp; Property Developers</span></a>
          <a href="index.html#partner" onclick="closeNavDropdowns()"><span class="dd-icon">&#8594;</span><span data-i18n="nav_dd_p2">Accountants &amp; CPAs</span></a>
          <a href="index.html#partner" onclick="closeNavDropdowns()"><span class="dd-icon">&#8594;</span><span data-i18n="nav_dd_p3">Lawyers Corporate &amp; Immigration / Relocation</span></a>
          <a href="index.html#partner" onclick="closeNavDropdowns()"><span class="dd-icon">&#8594;</span><span data-i18n="nav_dd_p4">Financial Advisers, Family Offices &amp; Managers</span></a>
        </div>
      </li>
      <li><a href="index.html#faq" data-i18n="nav_faq">FAQ</a></li>
    </ul>
    <div class="nav-right">
      <div class="lang-wrapper">
        <select class="lang-select lang-select-ix" id="langSelect" onchange="setLang(this.value)" title="Language" aria-label="Select language">
          <option value="en">EN</option>
          <option value="fr">FR</option>
          <option value="es">ES</option>
        </select>
      </div>
      <a href="https://apply.ebury.com/sfdc/servlet/SmartForm.html?formCode=currency-services&brand=FXT&locale=en_CA" target="_blank" rel="noopener" class="btn-apply" data-i18n="btn_apply">Application</a>
    </div>
  </div>
</nav>`;

// ── Footer HTML ────────────────────────────────────────────────────────────────
const FOOTER_HTML = `<footer>
  <div class="footer-top">
    <div class="footer-brand">
      <img src="Brand_Assets/transparent logo.png" alt="FinXtra"/>
      <p class="footer-brand-desc" data-i18n="footer_desc">Transparent, efficient, and personalized FX solutions for businesses and individuals worldwide.</p>
      <div class="footer-address">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <span>9310 Boul. Saint-Laurent, 10th Floor,<br>Montreal, QC, H2N 1N4</span>
      </div>
      <div class="footer-socials">
        <a href="https://www.linkedin.com/company/finxtra/" target="_blank" rel="noopener" class="footer-social">
          <svg fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
        </a>
        <a href="https://instagram.com/finxtra" target="_blank" rel="noopener" class="footer-social">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
        </a>
        <a href="mailto:info@finxtra.com" class="footer-social">
          <svg fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
        </a>
      </div>
    </div>
    <div class="footer-nav-cols">
      <div class="footer-col">
        <div class="footer-col-title" data-i18n="footer_company">Company</div>
        <ul>
          <li><a href="index.html#about" data-i18n="nav_about">About Us</a></li>
          <li><a href="index.html#careers" data-i18n="footer_careers">Careers</a></li>
          <li><a href="index.html#why-finxtra" data-i18n="footer_press">Why FinXtra</a></li>
          <li><a href="mailto:info@finxtra.com" data-i18n="footer_contact">Contact</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <div class="footer-col-title" data-i18n="footer_biz">For Businesses</div>
        <ul>
          <li><a href="index.html#solutions-business" data-i18n="col_pay">Payments (International &amp; Domestic)</a></li>
          <li><a href="index.html#solutions-business" data-i18n="col_fx">FX Risk Management</a></li>
          <li><a href="index.html#solutions-business" data-i18n="col_mc">Multi Currency Collection Accounts</a></li>
          <li><a href="index.html#solutions-business" data-i18n="col_lend">Business Lending</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <div class="footer-col-title" data-i18n="footer_ind">For Individuals</div>
        <ul>
          <li><a href="index.html#solutions-individuals" data-i18n="col_wealth">Personal Wealth &amp; Asset Management</a></li>
          <li><a href="index.html#solutions-individuals" data-i18n="col_fund_coll">Fund Collections</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <div class="footer-col-title" data-i18n="footer_legal_col">Legal</div>
        <ul>
          <li><a href="#" onclick="event.preventDefault();openPrivacyModal()" data-i18n="footer_privacy">Privacy Policy</a></li>
          <li><a href="#" onclick="event.preventDefault();openTermsModal()" data-i18n="footer_terms">Terms of Service</a></li>
          <li><a href="#" onclick="event.preventDefault();openSecurityModal()" data-i18n="footer_security">Security</a></li>
        </ul>
      </div>
    </div>
    <div>
      <div class="footer-newsletter-title" data-i18n="footer_nl_title">Stay in the loop</div>
      <div class="footer-newsletter-sub" data-i18n="footer_nl_sub">Get the latest FX insights and FinXtra updates delivered to your inbox.</div>
      <form class="footer-form" onsubmit="submitNewsletter(event)">
        <input type="email" id="nl-email" placeholder="your@email.com" required/>
        <button type="submit" id="nl-btn" data-i18n="footer_nl_btn">Subscribe</button>
      </form>
      <p id="nl-success" style="display:none;font-size:.75rem;color:#FFDA03;margin-top:.5rem;" data-i18n="footer_nl_success">&#10003; You&#39;re subscribed!</p>
      <p class="footer-consent" data-i18n="footer_nl_consent">By subscribing, you consent to our Privacy Policy and agree to receive updates.</p>
    </div>
  </div>
  <!-- Regulatory Disclosure -->
  <div class="reg-disclosure-wrap">
    <button class="reg-disclosure-btn" onclick="toggleRegDisclosure()" id="regDiscBtn" aria-expanded="false">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      Regulatory Disclosure
      <svg class="reg-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
    </button>
    <div class="reg-disclosure-panel" id="regDiscPanel">
      <p><strong>For clients based in Canada:</strong> 9511-3965 Qu&#233;bec Inc is trading as FinXtra payment and foreign currency exchange services are provided by Ebury Partners Canada Limited. Ebury Partners Canada Ltd. is registered as Money Services Business (&ldquo;MSB&rdquo;) with the Financial Transactions and Reports Analysis Centre (&ldquo;FINTRAC&rdquo;) (Reg. No. M17949017) and licensed as an MSB with Revenue Quebec (Licence No. 12062). 9511-3965 Qu&#233;bec Inc is trading as FinXtra is a company registered in Canada.</p>
      <p><strong>For clients based in the UK:</strong> 9511-3965 Qu&#233;bec Inc is trading as FinXtra payment and foreign currency exchange services are provided by Ebury Partners UK Limited. 9511-3965 Qu&#233;bec Inc is partnered with Ebury Partners UK Limited as a Programme Manager. Ebury Partners UK Limited is authorised and regulated by the Financial Conduct Authority as an Electronic Money Institution (Financial Services Register No. 900797). Ebury Partners UK Ltd is registered with the Information Commissioner&rsquo;s Office, with registration number: ZA345828.</p>
      <p><strong>For clients based in the US:</strong> 9511-3965 Qu&#233;bec Inc is trading as FinXtra payment and foreign currency exchange services are provided by Monex USA Online, a web-based foreign exchange and payments platform owned by Monex Inc (dba Monex USA). Monex USA is part of the wider financial services group controlled by Monex S.A.P.I. de C.V. (formerly Monex S.A.B. de C.V.) (&ldquo;Monex&rdquo;), a global investment-grade financial services institution. Monex USA is headquartered in Washington, DC, with offices in New York City, Beverly Hills, Chicago, and Miami. Licensed and regulated as a money transmitter. Monex USA is registered with FinCEN (U.S. Department of the Treasury) and is subject to the Bank Secrecy Act, requiring a risk-based anti-money laundering (AML) program.</p>
      <p><strong>For clients based in Mexico:</strong> 9511-3965 Qu&#233;bec Inc is trading as FinXtra Details to follow.</p>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="footer-copy" data-i18n="footer_copy">&#169; 2026 FinXtra. All rights reserved.</div>
    <div class="footer-legal">
      <a href="#" onclick="event.preventDefault();openPrivacyModal()" data-i18n="footer_privacy">Privacy</a>
      <a href="#" onclick="event.preventDefault();openTermsModal()" data-i18n="footer_terms">Terms</a>
      <a href="#" onclick="event.preventDefault();openSecurityModal()" data-i18n="footer_security">Security</a>
      <a href="index.html#" data-i18n="footer_sitemap">Sitemap</a>
      <a href="#" onclick="event.preventDefault();openCookiePref()" data-i18n="footer_cookies">Cookie Preferences</a>
    </div>
  </div>
</footer>`;

// ── JS functions to add ────────────────────────────────────────────────────────
const JS_FUNCTIONS = `
// ── NAV DROPDOWNS ──
function toggleNavDropdown(id) {
  const wrap = document.getElementById(id);
  const isOpen = wrap.classList.contains('open');
  closeNavDropdowns();
  if (!isOpen) wrap.classList.add('open');
}
function closeNavDropdowns() {
  document.querySelectorAll('.nav-dropdown-wrap.open').forEach(w => w.classList.remove('open'));
}
document.addEventListener('click', function(e) {
  if (!e.target.closest('.nav-dropdown-wrap')) closeNavDropdowns();
});

// ── FOOTER MODALS (redirect to index.html where they live) ──
function openPrivacyModal() { window.location.href='index.html'; }
function openTermsModal() { window.location.href='index.html'; }
function openSecurityModal() { window.location.href='index.html'; }
function openCookiePref() { window.location.href='index.html'; }
function openContactModal() { window.location.href='index.html'; }

// ── REGULATORY DISCLOSURE ──
function toggleRegDisclosure() {
  const btn = document.getElementById('regDiscBtn');
  const panel = document.getElementById('regDiscPanel');
  const isOpen = panel.classList.contains('open');
  panel.classList.toggle('open', !isOpen);
  btn.setAttribute('aria-expanded', String(!isOpen));
}

// ── NEWSLETTER ──
let _visitorInfo = null;
async function getVisitorInfo() {
  if (_visitorInfo) return _visitorInfo;
  try {
    const r = await fetch('https://ipapi.co/json/');
    const d = await r.json();
    _visitorInfo = \`IP: \${d.ip} | \${d.city}, \${d.region}, \${d.country_name}\`;
  } catch { _visitorInfo = 'Unavailable'; }
  return _visitorInfo;
}
async function submitNewsletter(e) {
  e.preventDefault();
  const email = document.getElementById('nl-email').value.trim();
  if (!email) return;
  const btn = document.getElementById('nl-btn');
  btn.textContent = '…';
  btn.disabled = true;
  try {
    const visitorInfo = await getVisitorInfo();
    await fetch('https://formsubmit.co/ajax/info@finxtra.ca', {
      method: 'POST',
      headers: {'Content-Type':'application/json','Accept':'application/json'},
      body: JSON.stringify({_subject:'New Subscriber!', Email: email, 'Visitor Info': visitorInfo, _template:'table'})
    });
  } catch(err) {}
  btn.style.display = 'none';
  document.getElementById('nl-email').style.display = 'none';
  document.getElementById('nl-success').style.display = 'block';
}
`;

// ── Helper: inject CSS before /* HERO */ marker ──────────────────────────────
function injectCSS(html, css) {
  // Try to inject before /* HERO */ comment
  if (html.includes('/* HERO */')) {
    return html.replace('/* HERO */', css + '\n/* HERO */');
  }
  // Fallback: inject before </style>
  return html.replace('</style>', css + '\n</style>');
}

// ── Helper: ensure --brand-dark in :root ─────────────────────────────────────
function ensureBrandDark(html) {
  if (!html.includes('--brand-dark')) {
    html = html.replace('--navy:#0d1b2e;', '--navy:#0d1b2e; --brand-dark:#007a99;');
    // Also try with spaces
    if (!html.includes('--brand-dark')) {
      html = html.replace('--navy:#0d1b2e;', '--navy:#0d1b2e;\n  --brand-dark:#007a99;');
    }
    if (!html.includes('--brand-dark')) {
      html = html.replace('--navy: #0d1b2e;', '--navy: #0d1b2e;\n  --brand-dark: #007a99;');
    }
  }
  return html;
}

// ── Helper: inject JS before </script> of last script block ──────────────────
function injectJS(html, js) {
  // Find the last </script> before </body>
  const bodyIdx = html.lastIndexOf('</body>');
  const lastScript = html.lastIndexOf('</script>', bodyIdx);
  if (lastScript !== -1) {
    return html.slice(0, lastScript) + js + '\n' + html.slice(lastScript);
  }
  // No script block — add a new one before </body>
  return html.replace('</body>', `<script>\n${js}\n</script>\n</body>`);
}

// ── Process standard subpages (with re-nav/re-footer) ────────────────────────
function processStandardPage(filePath) {
  let html = readFileSync(filePath, 'utf8');
  console.log(`\nProcessing: ${filePath}`);

  // 1. Ensure --brand-dark in :root
  html = ensureBrandDark(html);

  // 2. Inject CSS (before /* HERO */)
  html = injectCSS(html, NEW_CSS);

  // 3. Replace <!-- NAV --> + <nav class="re-nav">...</nav> with contact-strip + new nav
  // Pattern: from "<!-- NAV -->" through the closing </nav> that ends the re-nav block
  const navStartPattern = /<!-- NAV -->\s*\n<nav class="re-nav">/s;
  if (navStartPattern.test(html)) {
    // Find the start of "<!-- NAV -->"
    const navCommentIdx = html.indexOf('<!-- NAV -->');
    // Find </nav> that closes the re-nav
    const navEndIdx = html.indexOf('</nav>', navCommentIdx) + '</nav>'.length;
    const before = html.slice(0, navCommentIdx);
    const after = html.slice(navEndIdx);
    html = before + CONTACT_STRIP_HTML + '\n\n' + NAV_HTML + after;
    console.log('  ✓ Replaced nav');
  } else {
    console.log('  ✗ NAV pattern not found, skipping nav replacement');
  }

  // 4. Replace <!-- FOOTER --> + <footer class="re-footer">...</footer> with new footer
  const footerCommentIdx = html.indexOf('<!-- FOOTER -->');
  if (footerCommentIdx !== -1) {
    const footerTagIdx = html.indexOf('<footer', footerCommentIdx);
    const footerEndIdx = html.indexOf('</footer>', footerTagIdx) + '</footer>'.length;
    const before = html.slice(0, footerCommentIdx);
    const after = html.slice(footerEndIdx);
    html = before + FOOTER_HTML + after;
    console.log('  ✓ Replaced footer');
  } else {
    // Try without comment
    const footerTagIdx = html.indexOf('<footer class="re-footer"');
    if (footerTagIdx !== -1) {
      const footerEndIdx = html.indexOf('</footer>', footerTagIdx) + '</footer>'.length;
      const before = html.slice(0, footerTagIdx);
      const after = html.slice(footerEndIdx);
      html = before + FOOTER_HTML + after;
      console.log('  ✓ Replaced footer (no comment)');
    } else {
      console.log('  ✗ FOOTER pattern not found');
    }
  }

  // 5. Inject JS
  html = injectJS(html, JS_FUNCTIONS);
  console.log('  ✓ Injected JS');

  writeFileSync(filePath, html, 'utf8');
  console.log('  ✓ File saved');
}

// ── Process limit-orders.html (already has strip+nav, just remove 2 buttons + replace footer) ──
function processLimitOrders(filePath) {
  let html = readFileSync(filePath, 'utf8');
  console.log(`\nProcessing (limit-orders): ${filePath}`);

  // 1. Ensure --brand-dark in :root
  html = ensureBrandDark(html);

  // 2. Remove Client Tools button
  html = html.replace(/\s*<button[^>]+class="btn-client-tools"[^>]*>[\s\S]*?<\/button>/g, '');
  console.log('  ✓ Removed Client Tools button');

  // 3. Remove Client Login button
  html = html.replace(/\s*<button[^>]+class="btn-login"[^>]*>[\s\S]*?<\/button>/g, '');
  console.log('  ✓ Removed Client Login button');

  // 4. Replace footer (re-footer)
  const footerCommentIdx = html.indexOf('<!-- FOOTER -->');
  if (footerCommentIdx !== -1) {
    const footerTagIdx = html.indexOf('<footer', footerCommentIdx);
    const footerEndIdx = html.indexOf('</footer>', footerTagIdx) + '</footer>'.length;
    const before = html.slice(0, footerCommentIdx);
    const after = html.slice(footerEndIdx);
    html = before + FOOTER_HTML + after;
    console.log('  ✓ Replaced footer');
  } else {
    const footerTagIdx = html.indexOf('<footer class="re-footer"');
    if (footerTagIdx !== -1) {
      const footerEndIdx = html.indexOf('</footer>', footerTagIdx) + '</footer>'.length;
      const before = html.slice(0, footerTagIdx);
      const after = html.slice(footerEndIdx);
      html = before + FOOTER_HTML + after;
      console.log('  ✓ Replaced footer (no comment)');
    } else {
      console.log('  ✗ FOOTER not found in limit-orders.html');
    }
  }

  // 5. Add footer CSS (inject before /* HERO */)
  // Check if footer CSS already present
  if (!html.includes('.footer-top')) {
    html = injectCSS(html, NEW_CSS);
    console.log('  ✓ Injected CSS');
  } else {
    console.log('  - CSS already present, skipping');
  }

  // 6. Inject JS functions (only if not already present)
  if (!html.includes('function toggleRegDisclosure')) {
    html = injectJS(html, JS_FUNCTIONS);
    console.log('  ✓ Injected JS');
  } else {
    console.log('  - JS already present');
  }

  writeFileSync(filePath, html, 'utf8');
  console.log('  ✓ File saved');
}

// ── Run ───────────────────────────────────────────────────────────────────────
const standardPages = [
  join(BASE, 'real-estate-agents.html'),
  join(BASE, 'ngos-charities.html'),
  join(BASE, 'lawyers-immigration.html'),
  join(BASE, 'accountants-cpa.html'),
  join(BASE, 'wealth-management.html'),
  join(BASE, 'single-payment.html'),
];

for (const p of standardPages) {
  processStandardPage(p);
}

processLimitOrders(join(BASE, 'limit-orders.html'));

console.log('\n✅ All files updated successfully!');
