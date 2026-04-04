# Technical Design: SITC Official Website v1.0

**PRD:** `.ai/projects/sitc-website/prds/sitc-website-v1.md` (PR #1)
**Author:** Rayan (Architect)
**Status:** Draft
**Created:** 2026-04-04

---

## 1. Overview

A government marketing and information website for SITC (Sindh Information Technology Company). Three design variants, one CMS, multilingual (English + Urdu + Sindhi), deployed as a single Docker stack on government infrastructure within Pakistan.

**Core constraint:** `git clone` → `./setup.sh` → site is live. No external cloud dependencies. All data local.

**Note on setup.sh:** First run generates `.env` with random secrets and exits — operator edits `SITE_DOMAIN` and `ADMIN_EMAIL`, then re-runs. This is a deliberate two-step: secrets should never be hardcoded defaults.

---

## 2. Architecture

```
┌───────────────────────────────────────────────────┐
│                  Host Machine                     │
│                                                   │
│  ┌────────┐     ┌──────────────────────────────┐  │
│  │ Caddy  │────▶│     Next.js + Payload CMS    │  │
│  │ :80    │     │         (single process)      │  │
│  │ :443   │     │                                │  │
│  └────────┘     │  /          → public site      │  │
│                 │  /v1, /v2, /v3 → variants       │  │
│                 │  /admin     → CMS admin panel   │  │
│                 │  /api       → Payload REST API  │  │
│                 │         :3000                    │  │
│                 └──────────┬─────────────────────┘  │
│                            │                       │
│                 ┌──────────▼─────────────────────┐  │
│                 │       PostgreSQL :5432          │  │
│                 └────────────────────────────────┘  │
│                                                   │
│                 ┌────────────────────────────────┐  │
│                 │    Local disk: /uploads         │  │
│                 └────────────────────────────────┘  │
└───────────────────────────────────────────────────┘
```

Three containers total: Caddy (reverse proxy + auto-HTTPS), the app (Next.js + Payload), and PostgreSQL.

### Why this architecture?

**Payload CMS embedded in Next.js** — not a separate CMS server. The admin panel, API, and public site all run in one Node.js process. One thing to deploy, one thing to monitor, one thing that can break. For a government team that will self-host on internal infra, this is the simplest possible operational model.

**Why Payload over Directus/Strapi?**
- Embeds directly into Next.js — no separate process, no CORS config, no "CMS is down but site is up" scenarios
- Native TypeScript — collections are type-safe code, not JSON configs
- Built-in localization with per-field translations (critical for Urdu/Sindhi)
- Built-in auth with role-based access
- Built-in file upload handling
- Admin UI supports RTL input natively
- One `docker compose up` deploys everything

**Why Caddy over Nginx?**
- Automatic HTTPS (Let's Encrypt) with zero config — just set the domain
- Simpler config file for a straightforward reverse proxy setup
- If SITC provides their own cert instead, Caddy handles that too

**Health check endpoint:** `GET /api/health` — returns `{ status: 'ok', db: 'connected' }`. Implemented as a custom Next.js API route at `src/app/api/health/route.ts`. Checks PostgreSQL connectivity. Used by `setup.sh` to wait for the app, and by Docker healthcheck.

---

## 3. Data Model

All content managed through Payload CMS collections and globals.

### Collections

```typescript
// Products — the core of the site
products: {
  name            // text, localized
  slug            // text, unique
  productStatus   // select: live | upcoming | beta
  shortDescription // textarea, localized
  longDescription  // richText, localized
  features         // array of text, localized
  whoItsFor        // textarea, localized
  impactStatLabel  // text, localized (e.g. "Challans Processed")
  impactStatValue  // text (e.g. "730,000+")
  serviceUrl       // text (external link)
  thumbnail        // upload → media
  category         // text
  audienceTags     // select multi: citizens | businesses | government | partners
  sortOrder        // number
}

// Articles (Newsroom)
articles: {
  title           // text, localized
  slug            // text, unique
  category        // select: press_release | success_story | insight | event
  body            // richText, localized
  featuredImage   // upload → media
  publishDate     // date
  seo: { title, description, ogImage }  // localized
}
// Versions enabled — supports draft/published workflow

// Team Members (Board + Management)
team-members: {
  name            // text
  title           // text, localized
  bio             // textarea, localized
  photo           // upload → media
  group           // select: board | management
  sortOrder       // number
}

// Jobs (existing from Phase 1 concept)
jobs: {
  title, slug, department, roleType, experienceLevel,
  location, description, responsibilities, requirements,
  qualifications, benefits, status, publishedAt, closesAt
}

// Applications
applications: {
  jobId, firstName, lastName, email, phone,
  education (json), experience (json),
  resume (upload), coverLetter (upload), status
}

// Contact Submissions
contact-submissions: {
  name, email, subject, message, read (boolean)
}

// Tenders (P0)
tenders: {
  title (localized), referenceNumber, description (localized),
  deadline, document (upload → PDF), tenderStatus: open | closed | awarded
}

// Impact Stats
impact-stats: {
  label (localized), value, sortOrder
}

// Audience Cards
audience-cards: {
  headline (localized), subtext (localized), linkUrl, sortOrder
}

// Media (Payload built-in)
media: {
  filename, mimeType, fileSize, url, altText
}

// Users (Payload built-in + roles)
users: {
  email, password (hashed), role: super_admin | content_editor | hr_admin | viewer
}
```

### Globals (singleton content)

```typescript
global-settings: {
  siteName, tagline (localized), logo, favicon,
  contactEmail, contactPhone, contactAddress (localized),
  socialLinks: { twitter, facebook, linkedin, youtube },
  analyticsId, seoTitleFormat, seoDefaultOgImage,
  activeLanguages: ["en", "ur", "sd"]
}

homepage: {
  hero: {
    headline, subheading, primaryCTA, secondaryCTA, // all localized
    background (upload → media),
    heroVideo (upload → media, optional, video MIME types only),  // V3 hero bg video
    heroPoster (upload → media, optional),  // fallback image for video
  }
  audienceCards → relation
  impactStats → relation
  featuredProducts → relation
}

about: {
  mission, vision, mandate, coreValues  // all richText, localized
  whatWeDo: array of { title, description, icon }
}

contact: {
  address, mapEmbedUrl, departments: [{ name, email }], socialLinks
}

digital-government: {
  transformationContent (richText, localized)
  roadmapContent (richText, localized)
}

partnerships: {
  pppContent (richText, localized)
}

transparency: {
  dashboardContent (richText, localized)
  annualReports: array of { title, year, document (upload) }
}

static-pages: {  // or separate globals per page
  privacyPolicy (richText, localized)
  termsOfUse (richText, localized)
  accessibilityStatement (richText, localized)
}
```

### User Roles

| Role | CMS Access |
|---|---|
| super_admin | Everything — content, settings, users, theme config |
| content_editor | Collections: products, articles, team-members, impact-stats. Globals: homepage, about, contact, newsroom content. Cannot manage users or settings. |
| hr_admin | Collections: jobs, applications, team-members. Can view/export applications and manage team bios/photos. |

**Note:** Role permissions are configurable in Payload's access control — super_admin can adjust what each role can access without code changes.
| viewer | Read-only access to all content. Can preview drafts. |

---

## 4. Multilingual Architecture

### Payload Localization Config

```typescript
// payload.config.ts
localization: {
  locales: [
    { label: 'English', code: 'en' },
    { label: 'اردو', code: 'ur' },
    { label: 'سنڌي', code: 'sd' },
  ],
  defaultLocale: 'en',
  fallback: true,
}
```

Every field marked `localized: true` gets per-locale storage. Admin UI shows a language switcher — content editors enter Urdu/Sindhi directly.

### URL Structure

```
/{lang}/path
  /en/products        (or just /products — English is default)
  /ur/products
  /sd/products
```

### Middleware

```typescript
// src/middleware.ts
// Language detection: URL prefix → cookie → Accept-Language → 'en'
// Sets lang cookie for persistence
// Redirects bare paths to default language
```

### RTL Handling

```tsx
// Layout sets dir="rtl" and lang attribute for ur/sd
<html dir={isRTL ? 'rtl' : 'ltr'} lang={lang}>
```

Tailwind `rtl:` variant for directional styles. Self-hosted fonts loaded conditionally:

| Language | Font | Notes |
|---|---|---|
| English | Inter (V1, V3), Noto Sans (V2) | All variants |
| Urdu | Noto Nastaliq Urdu (V2), Noto Naskh Arabic (V1, V3) | ~1.2MB Nastaliq — lazy load for RTL pages only |
| Sindhi | Same as Urdu | Arabic script variant |

### Static UI Strings

```
src/locales/en.json
src/locales/ur.json
src/locales/sd.json
```

Loaded via `getTranslation(lang, key)` on server, `useTranslation()` hook on client.

Initial translations generated by LLM, reviewed by SITC team before publish. Fallback: if CMS field has no Urdu/Sindhi translation, English shown with "Translation coming soon" notice.

---

## 5. Design Variant Architecture

### Why not just CSS variables?

Phase 1 approach (CSS custom properties for colors/fonts) works for basic theming. But the PRD's three variants have fundamentally different behavior:

- **V2 (Accessible Pakistan):** Zero animation. Single-column mobile-first. Font size controls. High-contrast mode.
- **V3 (Bold Digital Sindh):** Word-by-word hero reveal. Asymmetric CSS Grid. Hover glow effects. Dark mode default.

This isn't a CSS toggle — it's different component behavior. So:

### Approach: Shared Data Layer + Variant Component Sets

```
src/
  components/
    shared/              ← Used by all variants (data fetching, forms, SEO)
      SEOHead.tsx
      LanguageToggle.tsx
      ContactForm.tsx
      Breadcrumbs.tsx
      ProductStatusBadge.tsx

    variants/
      v1/                ← Civic Tech: navy/green, subtle fade-in, 12-col grid
        Hero.tsx
        StatsBar.tsx
        ProductGrid.tsx
        Nav.tsx

      v2/                ← Accessible: green/gold, zero animation, mobile-first
        Hero.tsx          ← Typographic only, no background image
        StatsBar.tsx      ← Static numbers
        ProductGrid.tsx   ← Single column, large text
        AccessibilityToolbar.tsx  ← Font size A/A+/A++, high contrast toggle
        Nav.tsx

      v3/                ← Bold Sindh: dark mode, emerald accent, motion
        Hero.tsx          ← Full-bleed dark, word-by-word headline reveal
        StatsBar.tsx      ← Massive typography, count-up
        ProductGrid.tsx   ← Asymmetric grid, glow on hover
        Timeline.tsx      ← "Our Story" section (V3 only)
        Nav.tsx
```

Each variant route imports its specific components:

```tsx
// src/app/v1/[lang]/page.tsx
import { Hero } from '@/components/variants/v1/Hero'
import { StatsBar } from '@/components/variants/v1/StatsBar'
import { LanguageToggle } from '@/components/shared/LanguageToggle'
```

**Data fetching is identical** across all variants — same Payload API queries. Only presentation differs.

### Theme Files

```typescript
// src/themes/civic.ts (V1)
{
  primary: '#0A1628',     // Deep Navy
  accent: '#006B3F',      // Sindh Green
  secondary: '#0057FF',   // Electric Blue
  background: '#FFFFFF',
  surface: '#F4F6FA',
  text: '#111827',
  fonts: { heading: 'Inter', body: 'Inter', urdu: 'Noto Naskh Arabic' },
  maxWidth: '1280px',
}

// src/themes/accessible.ts (V2)
{
  primary: '#01411C',     // Pakistan Green
  accent: '#D4A017',      // Warm Gold
  background: '#FFFFFF',
  text: '#0B0C0C',
  link: '#00703C',
  focusRing: '#FFDD00',
  fonts: { heading: 'Noto Sans', body: 'Noto Sans', urdu: 'Noto Nastaliq Urdu' },
  baseFontSize: '18px',
  minTouchTarget: '44px',
}

// src/themes/bold.ts (V3)
{
  primary: '#0D3B2E',     // Deep Forest Green
  accent: '#00C06B',      // Vibrant Emerald
  highlight: '#BEFF6C',   // Electric Lime
  background: '#0A0A0A',  // Off-Black
  surface: '#141414',
  text: '#FFFFFF',
  fonts: { heading: 'Syne', body: 'Inter', urdu: 'Noto Naskh Arabic' },
  // Note: PRD specified Clash Display but it requires a paid license.
  // Syne is open-source (OFL), geometric, bold — same visual impact.
  // Alternatives considered: DM Sans, Space Grotesk.
  heroFontSize: '72px',
}
```

---

## 6. Page Routes

```
src/app/
  (site)/[lang]/                     ← Public site
    page.tsx                          Homepage
    about/page.tsx                    About (mission, vision, mandate, values)
    products/
      page.tsx                        Product grid with audience filters
      [slug]/page.tsx                 Product detail
    digital-government/page.tsx       Transformation + Roadmap
    partnerships/
      page.tsx                        PPP content
      tenders/page.tsx                Tender listings (P0)
    governance/page.tsx               Board + Management team
    transparency/page.tsx             Impact dashboard + annual reports (P1)
    newsroom/
      page.tsx                        Article listing with category filters
      [slug]/page.tsx                 Individual article
    careers/
      page.tsx                        Job listings with filters
      [slug]/page.tsx                 Job detail + apply
    contact/page.tsx                  Contact info + enquiry form
    privacy/page.tsx                  Privacy Policy
    terms/page.tsx                    Terms of Use
    accessibility/page.tsx            Accessibility Statement

  page.tsx                            Root / — variant selector or redirect
  v1/[lang]/[...slug]/page.tsx       Variant A routes (same pages, civic theme)
  v2/[lang]/[...slug]/page.tsx       Variant B routes (accessible theme)
  v3/[lang]/[...slug]/page.tsx       Variant C routes (bold theme)

  (payload)/admin/                    CMS admin panel (Payload)
  api/                                Payload API + custom routes
```

---

### Root URL Behavior

Controlled by `ACTIVE_VARIANT` in `.env`:

```
ACTIVE_VARIANT=none    # Shows variant selector page (3 buttons: Civic Tech / Accessible / Bold Digital)
ACTIVE_VARIANT=v1      # Redirects / → /v1 (Civic Tech is the live site)
ACTIVE_VARIANT=v2      # Redirects / → /v2
ACTIVE_VARIANT=v3      # Redirects / → /v3
```

Default: `none` (variant selector). When SITC picks a variant, ops changes one env var and restarts. The selector page is a simple static page — no CMS dependency.

---

## 7. Content Freshness

Since Payload runs inside Next.js, we don't need an external rebuild service. Payload's `afterChange` hooks call `revalidatePath()` directly:

```typescript
// In each collection config
hooks: {
  afterChange: [async ({ doc }) => {
    revalidatePath('/en/products')
    revalidatePath('/ur/products')
    revalidatePath('/sd/products')
    revalidatePath(`/en/products/${doc.slug}`)
    // ...per language
  }]
}
```

Pages use ISR (Incremental Static Regeneration) with a fallback revalidation of 60 seconds. The `afterChange` hook provides on-demand revalidation for immediate updates after CMS saves.

**Why this works:**
- Same process = direct function call, not HTTP webhook
- Per-path revalidation, not full site rebuild
- If revalidation fails, the last cached version is served — zero downtime
- "Live within 60 seconds" AC is met via ISR fallback even without the hook

---

## 8. Project Structure

```
sitc-website-2/
├── .ai/
│   ├── projects/sitc-website/
│   │   ├── prds/
│   │   └── tech-docs/
│   └── tasks/
├── src/
│   ├── app/
│   │   ├── (site)/[lang]/          ← Public pages
│   │   ├── v1/[lang]/              ← Variant A
│   │   ├── v2/[lang]/              ← Variant B
│   │   ├── v3/[lang]/              ← Variant C
│   │   ├── (payload)/admin/        ← CMS admin
│   │   └── api/                    ← API routes
│   ├── collections/                ← Payload collection configs
│   ├── globals/                    ← Payload global configs
│   ├── components/
│   │   ├── shared/                 ← Cross-variant components
│   │   └── variants/               ← v1/, v2/, v3/ component sets
│   ├── themes/                     ← Theme definitions
│   ├── locales/                    ← en.json, ur.json, sd.json
│   ├── services/                   ← Application, Email, Job services
│   ├── emails/                     ← React Email templates
│   └── lib/                        ← Utilities, types, validation
├── public/
│   └── fonts/                      ← Self-hosted fonts
├── uploads/                        ← Local file storage (gitignored)
├── scripts/
│   ├── seed.ts                     ← Idempotent seed script
│   └── migrate.ts                  ← Migration runner
├── payload.config.ts
├── next.config.ts
├── tailwind.config.ts
├── docker-compose.yml              ← Dev: Postgres + MailHog
├── docker-compose.prod.yml         ← Prod: Caddy + App + Postgres
├── Dockerfile
├── Caddyfile
├── setup.sh                        ← One-command deployment
├── .env.example
└── package.json
```

---

## 9. setup.sh

```bash
#!/bin/bash
set -e
echo "SITC Website — Setup"

# 1. Prerequisites
command -v docker >/dev/null || { echo "Docker required"; exit 1; }
command -v docker compose >/dev/null || { echo "Docker Compose required"; exit 1; }

# 2. Generate .env if not exists
if [ ! -f .env ]; then
    cp .env.example .env
    sed -i "s|^DB_PASSWORD=.*|DB_PASSWORD=$(openssl rand -hex 16)|" .env
    sed -i "s|^PAYLOAD_SECRET=.*|PAYLOAD_SECRET=$(openssl rand -hex 32)|" .env
    GENERATED_PASS=$(openssl rand -base64 12)
    sed -i "s|^ADMIN_PASSWORD=.*|ADMIN_PASSWORD=${GENERATED_PASS}|" .env
    echo ""
    echo "Generated .env with random secrets."
    echo "  Admin password: ${GENERATED_PASS}"
    echo ""
    echo "Edit SITE_DOMAIN and ADMIN_EMAIL before proceeding."
    echo "Then re-run: ./setup.sh"
    exit 0
fi

# 3. Build and start
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d

# 4. Wait for app to be ready
echo "Waiting for app..."
until curl -sf http://localhost:3000/api/health > /dev/null 2>&1; do sleep 2; done

# 5. Run migrations
docker compose -f docker-compose.prod.yml exec app pnpm payload migrate

# 6. Seed placeholder content
docker compose -f docker-compose.prod.yml exec app pnpm seed

echo ""
echo "Setup complete!"
echo "  Site:     https://$(grep SITE_DOMAIN .env | cut -d= -f2)/v1  /v2  /v3"
echo "  Admin:    https://$(grep SITE_DOMAIN .env | cut -d= -f2)/admin"
echo "  Credentials in .env"
```

---

## 10. Docker Compose (Production)

```yaml
services:
  app:
    build: .
    environment:
      DATABASE_URL: postgresql://sitc:${DB_PASSWORD}@postgres:5432/sitc
      PAYLOAD_SECRET: ${PAYLOAD_SECRET}
      PAYLOAD_PUBLIC_SERVER_URL: https://${SITE_DOMAIN}
      ACTIVE_VARIANT: ${ACTIVE_VARIANT:-none}
      ADMIN_EMAIL: ${ADMIN_EMAIL}
      ADMIN_PASSWORD: ${ADMIN_PASSWORD}
      SMTP_HOST: ${SMTP_HOST:-}
      SMTP_PORT: ${SMTP_PORT:-587}
      SMTP_USER: ${SMTP_USER:-}
      SMTP_PASS: ${SMTP_PASS:-}
      SMTP_FROM: noreply@${SITE_DOMAIN}
      NODE_ENV: production
    volumes:
      - ./uploads:/app/uploads         # bind mount — ops can access files directly
      - nextcache:/app/.next/cache     # persist ISR cache across restarts
    healthcheck:
      test: ["CMD", "curl", "-sf", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 5s
      retries: 3
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: sitc
      POSTGRES_USER: sitc
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U sitc"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  caddy:
    image: caddy:2-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
    depends_on:
      - app
    restart: unless-stopped

volumes:
  pgdata:
  nextcache:
  caddy_data:
```

Domain in `.env`, Caddyfile references `{$SITE_DOMAIN}`.

---

## 11. Security

| Concern | Mitigation |
|---|---|
| Authentication | Payload built-in session auth (bcrypt, HTTP-only cookies) |
| Authorization | Role-based at API level — not just UI |
| Input validation | Zod schemas on all public form endpoints |
| File uploads | MIME whitelist (images + PDF), max 5MB (resumes), 20MB (tender docs), filename sanitization |
| XSS | React auto-escapes; Payload rich text uses safe serializer |
| SQL injection | Drizzle ORM with parameterized queries |
| Rate limiting | Public forms: 5 req/IP/hour (applications), 10 req/IP/hour (contact — higher to allow resubmission after typos) |
| HTTPS | Enforced via Caddy (auto-HTTPS or provided cert) |
| CSRF | Payload includes CSRF protection for admin |
| Secrets | All in `.env`, gitignored. `setup.sh` generates random secrets. |
| CMS admin access | Can IP-restrict `/admin` in Caddyfile if needed |
| Multilingual XSS | Payload's RTL-safe rich text serializer handles Urdu/Sindhi content |
| No PII in logs | Application logs use IDs only — no names, emails, resumes |

---

## 12. Performance

| Page | Rendering | Cache |
|---|---|---|
| All public pages | ISR | 60s revalidation + on-demand via afterChange hooks |
| Variant B specifically | Zero JS animation, critical CSS inline, target FCP < 2s on 3G |
| Variant C hero video | Lazy-loaded, no autoplay on mobile, poster image fallback |

| Metric | Target |
|---|---|
| Lighthouse Performance | ≥ 85 |
| Lighthouse Accessibility | ≥ 90 |
| Lighthouse SEO | ≥ 90 |
| JS bundle per page | < 100KB gzipped |
| RTL font loading | Lazy — only on Urdu/Sindhi pages |

---

## 13. Self-Hosted Analytics (Optional)

Umami — open source, self-hosted, PostgreSQL backend, ~2KB script, no cookies.

Add to `docker-compose.prod.yml` with `profiles: ["analytics"]`. Only starts when explicitly enabled. Script tag injected by SEOHead only when `analyticsId` is set in GlobalSettings.

---

## 14. Email

Nodemailer with configurable SMTP. Works with any provider: government mail server, AWS SES, self-hosted Postfix.

If SMTP isn't configured, contact form submissions are stored in Payload only — no email. Admin can review in the CMS. Email delivery configured later when SITC provides SMTP credentials.

**SMTP failure at runtime** (configured but unreachable): retry 3 times with exponential backoff (1s, 5s, 15s). If all retries fail, log the error and rely on the Payload-stored submission as fallback. Submission still returns success to the user — email delivery is best-effort, not blocking.

Email templates: React Email components rendered to HTML.

---

## 15. Seed Data

`scripts/seed.ts` — idempotent, can be re-run safely:

- 6 products with placeholder content (all three languages)
- 4 audience cards
- 4 impact stats
- CEO bio (confirmed) + 4 C-suite placeholders (CTO, CPO, CFO, CISO)
- Board of Directors placeholders
- 3 sample newsroom articles
- Homepage, About, Contact, Digital Government, Partnerships, Transparency content
- Privacy Policy, Terms of Use, Accessibility Statement placeholders
- 3 sample job listings
- Initial admin account (super_admin)
- Static UI string translations (en, ur, sd)

---

## 16. Testing

| Layer | Tool | What |
|---|---|---|
| Component | Vitest + React Testing Library | Shared components, form validation, RTL rendering |
| Accessibility | axe-core + Lighthouse CI | WCAG 2.1 AA on all pages, all variants |
| E2E | Playwright | PRD user flows (citizen finds service, admin publishes article, vendor finds tender) |
| Visual | Playwright screenshots | Each variant × desktop/tablet/mobile × English/Urdu |
| CMS | Payload API tests | Schema validation, role-based access |

---

## 17. Backup Strategy

Minimum viable: a `scripts/backup.sh` that runs `pg_dump` and copies uploads.

```bash
#!/bin/bash
BACKUP_DIR=${BACKUP_DIR:-/backups/sitc}
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
mkdir -p $BACKUP_DIR

# Database
docker compose -f docker-compose.prod.yml exec -T postgres \
  pg_dump -U sitc sitc | gzip > "$BACKUP_DIR/db-$TIMESTAMP.sql.gz"

# Uploads
tar -czf "$BACKUP_DIR/uploads-$TIMESTAMP.tar.gz" ./uploads/

# Retain last 30 days
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete

echo "Backup complete: $BACKUP_DIR/*-$TIMESTAMP.*"
```

Ops adds a cron: `0 2 * * * /path/to/sitc-website-2/scripts/backup.sh`

This is documented in the deployment guide, not automated in `setup.sh` — backup location and schedule are ops decisions.

---

## 18. Task Breakdown (Preview)

Will create detailed GitHub issues after CTO approval.

| # | Task | Size | Deps | Notes |
|---|---|---|---|---|
| 1 | Project scaffolding — Next.js + Payload + Docker + setup.sh | Medium | — | Foundation |
| 2 | Payload collections — Products, Articles, ImpactStats, AudienceCards, Tenders | Medium | 1 | Core data model |
| 3 | Payload globals — GlobalSettings, Homepage, About, Contact, DigitalGov, Partnerships, Transparency, StaticPages | Medium | 1 | All CMS-editable content |
| 4 | Payload localization — en/ur/sd config + RTL admin support | Medium | 1 | Foundation for multilingual |
| 5 | i18n middleware + [lang] routing + static UI strings | Medium | 4 | URL-based language switching |
| 6 | Shared components — SEOHead, LanguageToggle, ContactForm, Breadcrumbs, ProductStatusBadge | Medium | 5 | Used by all variants |
| 7 | Theme files — civic, accessible, bold (PRD color palettes + fonts) | Small | 1 | CSS variables |
| 8 | Variant A components — Hero, Nav, StatsBar, ProductGrid, all pages | Large | 6, 7 | Civic Tech |
| 9 | Variant B components — Hero, Nav, StatsBar, ProductGrid, AccessibilityToolbar, all pages | Large | 6, 7 | Accessible Pakistan |
| 10 | Variant C components — Hero, Nav, StatsBar, ProductGrid, Timeline, all pages | Large | 6, 7 | Bold Digital Sindh |
| 11 | Careers portal — jobs, applications, email confirmations | Medium | 2, 6 | Reuse Phase 1 design |
| 12 | Newsroom pages — article listing + detail + category filters | Medium | 2, 6 | Draft/publish workflow |
| 13 | Governance + About + Digital Gov + Partnerships pages | Small | 3, 6 | Mostly CMS rich text |
| 14 | Static pages — Privacy, Terms, Accessibility | Small | 3, 6 | CMS-editable |
| 15 | Contact form — submission, Payload storage, email (if SMTP configured) | Small | 2, 6 | Rate limited |
| 16 | ISR + Payload afterChange hooks | Small | 2, 3 | Per-path revalidation |
| 17 | Seed script — all collections, globals, translations | Medium | 2, 3, 4 | Idempotent |
| 18 | Tenders page (P0) | Medium | 2, 6 | PDF upload, status badges, deadline auto-close |
| 19 | Transparency page (P1) | Small | 3 | Impact dashboard, annual reports |
| 20 | Accessibility audit — WCAG 2.1 AA all variants | Medium | 8, 9, 10 | axe-core + Lighthouse |
| 21 | Docker prod setup + setup.sh + deployment docs | Medium | All | The "clone and run" experience |

---

## 18. Open Questions

| # | Question | Blocker for |
|---|---|---|
| 1 | Server specs? (CPU, RAM, disk) | Confirming single-host is comfortable |
| 2 | SMTP server available? | Contact form + application email delivery |
| 3 | SSL — SITC provides cert or use Caddy auto-HTTPS? (needs port 80 open for ACME) | Deployment |
| 4 | Any monitoring/alerting tools on gov infra? | Operations |

---

*Tech doc v1.0 — ready for CTO review.*
