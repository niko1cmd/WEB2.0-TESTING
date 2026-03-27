import { readFileSync, writeFileSync } from 'fs';

const path = 'C:/Claude/FinXtra NEW WEBSITE/ngos-charities.html';
let html = readFileSync(path, 'utf8');

const CONTACT_STRIP = `<!-- CONTACT STRIP -->
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

const NAV = `<!-- MAIN NAV -->
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

// Find the nav block — look for preceding comment by searching backwards from <nav class="re-nav">
const navTagIdx = html.indexOf('<nav class="re-nav">');
const before300 = html.slice(navTagIdx - 200, navTagIdx);
const commentMatch = before300.match(/<!--[^>]*?-->\s*$/s);
let startIdx = navTagIdx;
if (commentMatch) {
  startIdx = navTagIdx - commentMatch[0].length;
}
const endIdx = html.indexOf('</nav>', navTagIdx) + 6;

const beforeHtml = html.slice(0, startIdx);
const afterHtml = html.slice(endIdx);
html = beforeHtml + CONTACT_STRIP + '\n\n' + NAV + afterHtml;

writeFileSync(path, html, 'utf8');
console.log('ngos-charities.html nav replaced successfully');
console.log('Chars replaced:', endIdx - startIdx);
