# PRD: SITC Official Website — v1.0

**Status:** In Review  
**Author:** Zara (Product Manager)  
**Last Updated:** 2026-04-04  
**Stakeholders:** Waqas (SITC), CEO Zainulabedin Shah, SITC Digital Strategy Team  
**Benchmarked Against:** GovTech Singapore (tech.gov.sg), GOV.UK, UAE TDRA, Dubai Future Foundation

---

## Confirmed Decisions (2026-04-04)

| # | Decision | Detail |
|---|---|---|
| 1 | Hosting | Government-controlled internal infra, deployed within Pakistan. Docker-based. Single `setup.sh` clone-and-run deployment. |
| 2 | Domain | Configurable in a project config file — not hardcoded. |
| 3 | Tech stack | Greenfield. New stack, no legacy dependencies. |
| 4 | Design variants | All three built simultaneously. Served at `/v1`, `/v2`, `/v3`. One active variant promoted to root at go-live. |
| 5 | Data sovereignty | All data (forms, analytics, CMS) stored locally on government infra within Pakistan. |
| 6 | P0 outstanding items (board, team, contact) | Mocked with placeholder content at launch. All fields editable via CMS so admin can update without dev. |
| 7 | Product names | Confirmed as-is. Product 2 = Fuel Monitoring System (not Sindh Pay — that was a mislabel). All products editable via CMS. |
| 8 | Products pipeline | Display the 6 confirmed products. Admin can add future products in CMS with status: Upcoming or Live. |
| 9 | Impact stats | CMS-managed only. No real-time API integration in v1. |
| 10 | Board of Directors | Placeholder at launch. CMS fields include: name, title, bio, photo upload. |
| 11 | Management team | CEO confirmed. Placeholders for CTO, CPO, CFO, CISO. All CMS-editable with photo upload. |
| 12 | Privacy Policy / Terms of Use | Internal — drafted by SITC. Placeholder pages at launch. |
| 13 | Responsible Disclosure | Not in scope for v1. "Report Vulnerability" footer link deferred. |
| 14 | Photography assets | Waqas will provide link to official Sindh photography assets (required for Variant C). |
| 15 | Urdu + Sindhi | **Hard requirement for launch.** No in-house translator — translations generated via LLM and reviewed before publish. All CMS content fields must support Urdu and Sindhi input. |

---

## Problem Statement

The current SITC website (sitc.gos.pk) is a placeholder — a few paragraphs with no product listings, no procurement path, no team section, and no newsroom. It does not reflect the scale, ambition, or credibility of SITC's work.

**Job-to-be-Done:**  
- Citizen: "When I want to use a government digital service, I want to know what SITC offers and how to access it, so I don't have to go to a government office."  
- Partner/Vendor: "When I want to work with the Government of Sindh on technology, I want to understand SITC's mandate, open tenders, and who to contact."  
- Press/Government: "When I need to understand SITC's impact, I want data, announcements, and leadership information in one credible source."

**Current State:**  
- Site has no navigation, no products, no news, no team — purely informational filler text.
- Competitors such as tech.gov.sg have clear product portfolios, live stats, newsrooms, and recruitment sections.

**Evidence:**  
- SITC has processed 730,000+ challans and collected Rs12.8 billion — none of this appears on the current website.
- The content brief (v1.0) has been prepared by the SITC Digital Strategy Team, indicating readiness to launch a real site.

---

## Target Users

| Persona | Description | Primary Need | Current Pain |
|---|---|---|---|
| Sindh Citizen | Any resident using or wanting to use a government digital service | Find and access the right service fast | Can't find services, has to visit offices |
| Business Owner | Registering business, paying taxes, obtaining permits | Self-serve government transactions | Paper-heavy, opaque processes |
| Government Agency | A Sindh department looking to integrate SITC platforms | Understand available shared infrastructure | No visibility into what SITC has built |
| Tech Partner / Vendor | ICT company wanting to tender or co-develop | See open tenders, understand partnership process | No procurement page exists |
| Media / Press | Journalist covering digital governance in Pakistan | Find official announcements and impact data | No newsroom, no contact info |
| Prospective Employee | Engineer or designer wanting to join SITC | Understand culture, open roles, mission | No careers page |

---

## Goals & Success Metrics

### Business Goals
- Establish SITC as Pakistan's leading government technology body — credible, data-backed, accessible
- Increase inbound partner and vendor enquiries via a clear procurement pathway
- Reduce citizen support load by surfacing self-serve product access points

### User Goals
- Citizens can find and access any SITC service in under 2 clicks from the homepage
- Partners can discover open tenders and submit interest without emailing anyone
- Press can get official stats, announcements, and media contact without calling

### Key Metrics
| Metric | Current | Target (6 months post-launch) | How Measured |
|---|---|---|---|
| Time to find a service | N/A (no services listed) | < 30 seconds | UX testing |
| Inbound partner enquiries | Baseline unknown | +50% vs pre-launch | CRM / contact form submissions |
| Newsroom page views | 0 | 5,000 unique/month | Analytics |
| Careers page applications | 0 | Track submissions | HR system |
| Accessibility score | Unknown | WCAG 2.1 AA | Lighthouse |
| Mobile usability | Unknown | 90+ Lighthouse score | Lighthouse |

### Anti-Goals
- This is a marketing and information site — not a service delivery portal. Citizens do not complete government transactions here; they are directed to the relevant platform.
- No user account system in v1 (except admin CMS login).
- No e-commerce or payment processing on the main site.

---

## Site Architecture

```
Homepage
├── About
│   ├── Who We Are
│   ├── Mission & Vision
│   ├── Core Values
│   └── Our Mandate
├── Products & Services
│   ├── [Individual Product Pages — expandable]
├── Digital Government
│   ├── Transformation Efforts
│   └── Strategic Roadmap
├── Partnerships
│   ├── Public-Private Partnerships
│   └── Tenders & Procurement ← NEW
├── Governance
│   ├── Board of Directors
│   └── Management Team
├── Transparency ← NEW
│   ├── Impact Dashboard
│   └── Annual Reports
├── Newsroom
│   ├── Press Releases
│   ├── Success Stories
│   ├── Insights
│   └── Events
├── Careers ← NEW (expanded from Work With Us)
├── Contact
└── [Footer]
    ├── Privacy Policy
    ├── Terms of Use
    ├── Accessibility Statement ← NEW
    └── Report a Vulnerability
```

---

## Requirements

### Must Have (P0) — Launch Blockers

**Homepage**
- [ ] Hero section with headline, subheading, and two CTAs (primary: Explore Our Services, secondary: context-specific)
  - AC: Hero renders above the fold on mobile and desktop; CTA buttons are keyboard navigable
- [ ] Four audience cards below hero (Citizens, Businesses, Government Bodies, Tech Partners)
  - AC: Each card routes to the correct section; cards are touch-friendly on mobile
- [ ] Live impact stats bar (challans processed, revenue collected, services live, provinces covered)
  - AC: Stats are editable via CMS without a code deployment

**Products & Services**
- [ ] Product card grid with consistent schema: name, status badge (LIVE / UPCOMING / BETA), one-line description, impact stat (where available), audience tag(s), CTA
  - AC: All 6 existing products are listed; status badge is colour-coded
- [ ] Each product has one or more audience tags: Citizens, Businesses, Government Bodies, Tech Partners
  - AC: The Products & Services page includes an audience filter (tab or dropdown); selecting an audience shows only relevant products; default view shows all. This connects the audience cards on the homepage directly to filtered product views.
- [ ] Each product card links to an expanded product detail page
  - AC: Product detail page includes: full description, what it does (bullets), who it's for (audience tags), impact data, and link to the actual service (external URL)
- [ ] Admin can add, edit, remove product cards, toggle status, and assign audience tags via CMS
  - AC: Changes go live across the site within 60 seconds of saving in CMS

**About**
- [ ] Mission, Vision, Mandate, Core Values sections as per content brief
- [ ] Management Team section with CEO bio (confirmed); placeholder structure for remaining C-suite
  - AC: Each team member has: photo, name, title, bio — all editable via CMS

**Newsroom**
- [ ] News listing page with filters (Press Releases, Success Stories, Insights, Events)
- [ ] Individual article page with: headline, date, category tag, body text, featured image
  - AC: Admin can publish/unpublish articles; unpublished articles are not publicly accessible
- [ ] Three launch stories pre-populated (from content brief)

**Contact & Footer**
- [ ] Contact page with email, phone (placeholder until confirmed), address, and an enquiry form (name, email, subject, message)
  - AC: Form submission sends email to contact@sitc.gov.pk; user receives a confirmation message
- [ ] Footer with all quick links, copyright, tagline
- [ ] Privacy Policy and Terms of Use pages (placeholder content acceptable at launch, legal to confirm)

**Multilingual**
- [ ] Urdu language toggle — full site translation
  - AC: Toggle persists across pages via localStorage; all static content is translated; dynamic CMS content supports Urdu input fields
- [ ] Sindhi language toggle — full site translation
  - AC: Same behaviour as Urdu toggle; Sindhi content fields available in CMS; initial translations LLM-generated and reviewed before publish

**Variant Selection (pre-promotion)**
- [ ] Root URL `/` before a variant is promoted to root must display a variant selection page
  - AC: Page shows three clearly labelled buttons — "Version 1", "Version 2", "Version 3" — each linking to `/v1`, `/v2`, `/v3` respectively. No redirect happens automatically. Once a variant is promoted (config change), the root serves that variant directly and the selection page is no longer shown.

**Global Content Freshness**
- [ ] CMS saves must be reflected site-wide within 60 seconds — applies to all content types (products, team, newsroom, homepage, stats, contact), not just products
  - AC: After any CMS save, all affected pages update within 60 seconds with no manual deployment required

**Contact Form**
- [ ] SMTP configuration must be externalised and admin-configurable (host, port, username, password, from-address)
  - AC: SMTP settings are stored in the server config (not hardcoded); if SMTP is unavailable, form submission is queued locally and retried; user sees a success message regardless; admin is notified of delivery failure via a fallback log or alert

**Accessibility**
- [ ] WCAG 2.1 AA compliance across all pages
  - AC: Lighthouse accessibility score ≥ 90 on all key pages
- [ ] Accessibility Statement page live at launch — owned by SITC Admin team, reviewed annually
  - AC: Page is live at `/accessibility`; includes: commitment statement, known limitations (if any), contact method for accessibility issues, and last review date

**CMS (see full CMS section below)**

---

### Should Have (P1) — Shortly After Launch
- [ ] Tenders & Procurement page: list of active tenders with PDF downloads, submission deadline, and status (open/closed/awarded)
  - AC: Admin can post and close tender listings; closed tenders show "Awarded" or "Closed" badge
- [ ] Transparency / Impact Dashboard: visual counters for key metrics, updated via CMS
- [ ] Annual Reports section with PDF upload and download
- [ ] Careers page: open roles with description, department, location, and application link
  - AC: Admin can post/remove roles; application links can be internal form or external URL (e.g., Careers@Gov)
- [ ] Cookie consent banner compliant with Pakistani digital regulations
- [ ] Site search (search across products, news, pages)

### Could Have (P2) — Future Consideration

- [ ] Dedicated product microsites for major platforms (e-Stamp, e-Registration)
- [ ] Live chat or AI assistant integration on the main website
- [ ] Event registration for hackathons and conferences
- [ ] Newsletter subscription
- [ ] Feedback widget (citizen satisfaction rating per page)
- [ ] Open data section with downloadable datasets
- [ ] Social media feed integration (official SITC channels)

### Won't Have (v1)
- User accounts for citizens (handled by individual product platforms)
- E-commerce or payment processing
- Job application processing (link out to external system)
- Real-time data APIs from product systems (stats are manually updated via CMS in v1)

---

## CMS — Admin Panel Requirements

### Overview
A single CMS powers all three design variants. The design theme is a configuration-level switch (not a content switch) — content is entered once and rendered in whichever active theme is deployed.

### User Roles
| Role | Access |
|---|---|
| Super Admin | Full access — content, settings, theme config, user management |
| Editor | Content only — can create/edit/publish articles, products, team members, tenders. Cannot change settings or manage users |
| Viewer | Read-only — can preview unpublished content. Useful for stakeholder review |

### CMS Modules (what Super Admin can control)

**1. Global Settings**
- Site name, tagline, logo (upload), favicon
- Active language(s): English / Urdu / Sindhi toggles
- Contact details: email, phone, address
- Social media links
- Analytics ID (Google Analytics / Plausible)
- SEO defaults: global title format, default OG image

**2. Homepage**
- Hero: headline, subheading, primary CTA label + URL, secondary CTA label + URL, background image/video upload
- Audience cards: headline, subtext, link (per card, all 4 editable)
- Impact stats bar: each stat has a label and a number (manually updated)
- Featured products carousel: choose which products appear

**3. Products & Services**
- Add / edit / archive product cards
- Per product: name, status (LIVE / UPCOMING / BETA), short description, long description, what-it-does bullets, impact stat, service URL (external), thumbnail image, category tag, audience tags (multi-select: Citizens / Businesses / Government Bodies / Tech Partners)
- Reorder products via drag-and-drop

**4. Team & Governance**
- Board of Directors: add/edit/remove members — photo upload, name, title, bio
- Management Team: same schema
- Reorder via drag-and-drop

**5. Newsroom**
- Create/edit/delete articles
- Per article: title, category (Press Release / Success Story / Insight / Event), publish date, body (rich text editor), featured image, status (draft / published)
- Bulk publish / unpublish

**6. Tenders & Procurement (P1)**
- Post tender: title, reference number, description, deadline, document upload (PDF), status (open / closed / awarded)
- Close / award a tender with one click

**7. Careers (P1)**
- Post role: title, department, location (city / remote), type (full-time / contract), description (rich text), application URL or form toggle
- Archive closed roles

**8. Media Library**
- Centralised image and document uploads
- Used across all modules
- Basic organisation: folders by section

**9. Page-Level SEO**
- Per-page: meta title, meta description, OG image — overrides global defaults

**10. User Management**
- Invite users by email
- Assign roles (Super Admin / Editor / Viewer)
- Revoke access

### CMS Tech Recommendation
- **Recommended CMS:** Directus (open-source, self-hostable, strong role-based access, native multilingual content model, REST + GraphQL API)
- **Avoid:** WordPress (security surface for a .gov site), any hosted SaaS CMS (violates data sovereignty requirement)
- **Frontend:** Next.js — three separate deployments (one per variant) consuming the same Directus API. Served at `/v1`, `/v2`, `/v3`; one variant promoted to root at go-live.
- **Deployment:** Docker-based. Single `setup.sh` script — clone repo → run script → site is live. Domain configurable via `.env` / config file, not hardcoded.
- **Hosting:** Government-controlled internal infrastructure, physically within Pakistan. All data (CMS content, form submissions, analytics) stored locally.
- **Multilingual:** Directus supports per-field translations natively. Urdu and Sindhi are hard requirements. Initial translations generated via LLM and reviewed before publishing. CMS content fields must accept right-to-left input (Urdu Nastaliq, Sindhi).

---

## Design Variants

All three variants share identical information architecture, content schema, and CMS. The difference is visual language, typography, and motion/imagery approach. The active theme is set at deployment time (not toggled by admin in v1).

---

### Design Variant A — "Civic Tech, Modern Government"

**Inspiration:** GovTech Singapore (tech.gov.sg), UAE TDRA, Estonia e-Gov  
**Audience fit:** Partners, press, international audiences, government officials  
**Tone:** Authoritative, data-forward, clean, professional

**Colour Palette**
| Role | Colour | Hex |
|---|---|---|
| Primary | Deep Navy | #0A1628 |
| Accent | Sindh Green | #006B3F |
| Secondary accent | Electric Blue | #0057FF |
| Background | White | #FFFFFF |
| Surface | Light Grey | #F4F6FA |
| Text primary | Near Black | #111827 |
| Text secondary | Mid Grey | #6B7280 |
| Status: Live | Emerald | #10B981 |
| Status: Upcoming | Amber | #F59E0B |
| Status: Beta | Blue | #3B82F6 |

**Typography**
- Headings: Inter Bold or IBM Plex Sans Bold (clean, neutral, globally trusted in gov tech)
- Body: Inter Regular
- Arabic/Urdu: Noto Naskh Arabic (renders cleanly at all sizes)
- Base size: 16px body, 14px captions

**Layout Principles**
- High white space — generous padding, no visual clutter
- Impact stats displayed as large, animated counters (count-up on scroll)
- Product cards: flat, border-subtle, status badge top-right
- Grid: 12-column, max-width 1280px
- Navigation: sticky top nav, dark background, logo left, links right, language toggle far right
- No gradients — flat colour blocks only
- Iconography: line icons (Phosphor or Heroicons), consistent stroke weight

**Motion**
- Minimal — subtle fade-in on scroll, count-up animation for stats
- No parallax, no heavy transitions
- Purpose: performance and accessibility first

**Hero Treatment**
- Full-width dark navy background
- Large white headline (48–64px)
- Green accent underline on key word
- Two buttons: white filled (primary), outlined white (secondary)
- Right side: abstract geometric illustration (government building + circuit lines) or high-quality civic photography

**Mobile**
- Single-column below 768px
- Navigation collapses to hamburger menu
- Audience cards stack vertically
- Stats bar becomes a 2x2 grid

---

### Design Variant B — "Accessible Pakistan"

**Inspiration:** GOV.UK Design System, Australia's Digital Transformation Agency  
**Audience fit:** General citizens, non-digital-native users, rural access, low-end devices  
**Tone:** Warm, clear, trustworthy, frictionless

**Colour Palette**
| Role | Colour | Hex |
|---|---|---|
| Primary | Pakistan Green | #01411C |
| Accent | Warm Gold | #D4A017 |
| Background | Pure White | #FFFFFF |
| Surface | Warm Off-White | #FAF9F6 |
| Text primary | Near Black | #0B0C0C |
| Text secondary | Dark Grey | #505A5F |
| Link | Deep Green | #00703C |
| Focus ring | Yellow | #FFDD00 |
| Status: Live | Green | #00703C |
| Status: Upcoming | Grey | #505A5F |

**Typography**
- Headings: Noto Sans Bold — broad Unicode support, excellent Urdu rendering
- Body: Noto Sans Regular
- Urdu/Sindhi: Noto Nastaliq Urdu
- Base size: 18px body (larger than standard — intentional for accessibility)
- Line height: 1.6 — generous for readability

**Layout Principles**
- GOV.UK-style: extremely clean, no decorative elements that add noise
- Black text on white — maximum contrast ratio (7:1+)
- Large click targets (minimum 44px height for all interactive elements)
- No carousels or auto-playing content
- Breadcrumbs on every interior page
- Skip-to-content link at the top (screen reader and keyboard users)
- Forms: one question per page pattern (GOV.UK standard)

**Motion**
- None — zero animation. Static only. Performance on 2G/3G connections is the priority.
- Exception: focus outline is always visible (high-contrast yellow ring)

**Hero Treatment**
- White background, dark green headline
- Very clear CTA button (green background, white text, large)
- No background images in the hero — purely typographic
- "What do you want to do today?" approach — audience selector is prominent

**Mobile**
- Designed mobile-first; desktop is the secondary canvas
- 100% single-column on mobile
- Bottom navigation bar option for key citizen flows (Services, News, Contact)
- Tested for 320px width (low-end Android devices common in Pakistan)

**Unique to Variant B**
- Urdu is a first-class language — not a toggle afterthought. Language defaults to browser language preference.
- Font size control: A / A+ / A++ on every page
- High-contrast mode toggle

---

### Design Variant C — "Bold Digital Sindh"

**Inspiration:** Dubai Future Foundation (dubaifuture.ae), NEOM, Saudi Vision 2030  
**Audience fit:** Talent recruitment, national/international launch events, brand-building, leadership audiences  
**Tone:** Ambitious, bold, proud, forward-looking

**Colour Palette**
| Role | Colour | Hex |
|---|---|---|
| Primary | Deep Forest Green | #0D3B2E |
| Accent | Vibrant Emerald | #00C06B |
| Secondary | Warm Sand | #F5ECD7 |
| Highlight | Electric Lime | #BEFF6C |
| Background | Off-Black | #0A0A0A |
| Surface | Dark Card | #141414 |
| Text primary | White | #FFFFFF |
| Text secondary | Light Grey | #A0A0A0 |

**Typography**
- Headings: Clash Display Bold or Space Grotesk Bold — modern, geometric, high visual impact
- Body: Inter Regular
- Urdu: Noto Naskh Arabic
- Headline sizes: 72–96px on desktop hero; deliberately large and impactful

**Layout Principles**
- Dark mode by default
- Full-width sections with edge-to-edge imagery and colour blocks
- Large, bold section numbers (01, 02, 03...) as visual anchors
- Product cards: dark surface, emerald accent, subtle glow on hover
- Stats: massive typographic treatment — the numbers ARE the design
- Grid: asymmetric — content doesn't always sit on a standard 12-col grid
- Use of Sindh photography: people, landscapes, government moments — full bleed, high quality

**Motion**
- Purposeful and premium — but performance-conscious
- Hero: smooth fade-in on load, headline appears word by word
- Stats: fast count-up animation
- Product cards: subtle lift + glow on hover
- Section transitions: gentle slide-up on scroll
- No autoplay video (performance), but hero can have a dark-tinted background loop video (optional, lazy-loaded)

**Hero Treatment**
- Full-screen dark section
- Full-bleed background: either a stunning Sindh aerial photograph or a looping dark abstract video
- Large white headline split across two lines with the accent word in electric lime
- One bold CTA button: emerald green, full-width on mobile
- Subtle animated particle or grid overlay (optional — if performance allows)

**Mobile**
- Dark mode preserves impact on OLED screens (common in modern smartphones)
- Large touch targets maintained
- Animations are reduced or disabled based on `prefers-reduced-motion` media query
- Hero image is cropped and optimised for portrait aspect ratio

**Unique to Variant C**
- "Our Story" timeline section — visual timeline of SITC's milestones from founding to present
- Bold full-bleed "Join the Mission" careers section with photography
- Video section: embed CM's launch announcement or CEO message

---

## User Flows

### Flow 1: Citizen finds and accesses a service
1. Lands on homepage
2. Sees "For Citizens" audience card → clicks
3. Sees products list filtered for citizens
4. Clicks e-Stamp Portal card
5. Reads product detail page: what it is, what it does, impact stats
6. Clicks "Access Service" → redirected to the actual e-Stamp platform (external)

### Flow 2: Vendor discovers and responds to a tender
1. Lands on homepage or comes via search
2. Navigates to Partnerships → Tenders & Procurement
3. Sees list of open tenders with deadlines
4. Downloads tender document (PDF)
5. Submits interest via contact form or external link

### Flow 3: Press finds official stats and announcement
1. Comes via Google search for "SITC Rs12.8 billion"
2. Lands on Newsroom article or homepage
3. Finds official stats in the Impact Dashboard or news story
4. Locates media contact email in footer

### Flow 4: Admin updates a product stat
1. Admin logs into CMS at admin.sitc.gos.pk
2. Navigates to Products → e-Stamp Portal
3. Updates impact stat from "730,000" to "800,000" challans
4. Saves — change is live within 60 seconds
5. No developer involvement required

### Flow 5: Admin publishes a press release
1. Admin logs into CMS
2. Newsroom → New Article
3. Sets category: Press Release, adds headline, body (rich text), featured image, publish date
4. Saves as Draft → previews
5. Publishes → article appears live in newsroom

---

## Edge Cases & Error States

| Scenario | Expected Behaviour |
|---|---|
| Enquiry form submission fails | Show inline error; do not clear form; offer email as fallback |
| CMS is down | Website continues to serve last cached content (static generation) |
| Image upload too large (CMS) | Show file size limit message; suggest compression |
| Admin tries to delete a published article | Prompt: "This article is live. Archive instead?" with Archive / Delete options |
| User visits site in unsupported browser | Show graceful degradation; key functionality still works |
| Urdu toggle on a page with no Urdu translation | Falls back to English with a notice: "Translation coming soon" |
| Tender deadline passes | System auto-updates tender status from Open → Closed |

---

## Outstanding Items (Action Required Before Launch)

| # | Item | Owner | Status | Priority |
|---|---|---|---|---|
| 1 | Board of Directors names, titles, bios, photos | Company Secretary | Mocked in CMS at launch — admin updates when ready | P0 (content), not launch blocker |
| 2 | C-suite team: CTO, CPO, CFO, CISO names, bios, photos | SITC HR | Mocked in CMS — placeholders for all 4 roles + CEO | P0 (content), not launch blocker |
| 3 | Official contact phone number | Admin team | Placeholder at launch — CMS-editable | Not launch blocker |
| 4 | ~~Product name: Sindh Pay vs Fuel Monitoring System~~ | ~~Product team~~ | ✅ RESOLVED — Product 2 = Fuel Monitoring System | Done |
| 5 | Domain configuration | IT/Waqas | Configurable in `.env` — not hardcoded. Waqas to confirm final domain before go-live. | P0 for go-live |
| 6 | Mission/vision copy approved at CEO/Board level | CEO office | Content in brief used as default — CMS-editable | Not launch blocker |
| 7 | Urdu translations for all static content | Zara (LLM-assisted) + Waqas review | **Hard requirement.** LLM generates, Waqas/team reviews before publish. | P0 — launch blocker |
| 8 | Sindhi translations for all static content | Zara (LLM-assisted) + Waqas review | **Hard requirement.** Same process as Urdu. | P0 — launch blocker |
| 9 | Privacy Policy and Terms of Use | SITC Legal (internal) | Placeholder pages at launch — final copy to replace via CMS | Not launch blocker |
| 10 | Responsible Disclosure policy | IT Security | Deferred — not in scope for v1 | V2 |
| 11 | Annual reports | Finance | Not in scope for v1 | V2 |
| 12 | Sindh photography assets for Variant C | Waqas | Link to be provided by Waqas | P0 for Variant C |
| 13 | Tender listings to populate at launch | Procurement | P1 — CMS ready, content optional at launch | P1 |

---

## Out of Scope (v1)

- Citizen login / identity management (handled by individual product platforms)
- Integration with live product APIs for real-time data (stats are CMS-managed in v1)
- Job application processing (link to external system)
- Payment or e-commerce functionality
- Social media cross-posting from CMS
- A/B testing infrastructure
- Custom analytics beyond standard page-view tracking

---

## Success Definition

**6 months post-launch, the SITC website will have succeeded if:**
1. Every SITC product is discoverable in under 2 clicks from the homepage
2. Inbound partner and vendor enquiries have increased measurably
3. The newsroom has been updated at least monthly by the admin team without developer support
4. Lighthouse scores: Performance ≥ 85, Accessibility ≥ 90, SEO ≥ 90 on mobile
5. The admin team can add a new product, publish a press release, and update impact stats entirely without engineering involvement

---

*PRD v1.0 — ready for stakeholder review. Design variant selection, tech stack confirmation, and all Action Required items above must be resolved before development begins.*
