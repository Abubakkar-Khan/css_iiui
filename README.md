# CS Society — IIUI Web Portal

Official web platform of the **Computer Science Society (CSS)** at the International Islamic University, Islamabad.

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Tech Stack](#2-tech-stack)
3. [Architecture Overview](#3-architecture-overview)
4. [Database Schema (ERD)](#4-database-schema-erd)
5. [Data Flow](#5-data-flow)
6. [API Reference](#6-api-reference)
7. [Sequence Diagrams](#7-sequence-diagrams)
8. [Frontend Structure](#8-frontend-structure)
9. [Design System](#9-design-system)
10. [Directory Map](#10-directory-map)
11. [Setup & Installation](#11-setup--installation)
12. [Admin Panel](#12-admin-panel)

---

## 1. Purpose

The CS Society portal is a full-stack web application that serves as the digital home for the Computer Science Society at IIUI. It provides:

- **Public pages** — homepage, events calendar, team roster, alumni directory, photo gallery, about, and contact form.
- **Admin CMS** — a protected dashboard where society executives can manage all content (events, news, team members, alumni, gallery images) without writing code.
- **Media pipeline** — image upload, storage, and delivery through Cloudinary CDN.
- **Contact system** — inquiry form backed by Resend email API with a simulation fallback for development.

---

## 2. Tech Stack

### Runtime & Framework

| Technology | Version | Role |
|---|---|---|
| Next.js | 15.4.6 | Full-stack React framework (App Router) |
| React | 19.1.0 | UI component library |
| Node.js | 18+ | Server runtime |

### Database & Storage

| Technology | Role |
|---|---|
| PostgreSQL (Neon) | Cloud relational database |
| pg (node-postgres) | Raw SQL query driver via connection pool |
| Prisma | Schema definition and migrations only (no runtime ORM) |
| Cloudinary | Media storage and CDN delivery |

### Libraries

| Package | Version | Purpose |
|---|---|---|
| `pg` | 8.16.3 | PostgreSQL connection pool for executing raw SQL queries against Neon |
| `bcrypt` | 6.0.0 | One-way password hashing (blowfish) for admin authentication |
| `cloudinary` | 2.10.0 | Server-side SDK for image upload streams and asset deletion |
| `next-cloudinary` | 6.17.5 | React component wrappers for Cloudinary browser-side uploads |
| `react-icons` | 4.12.0 | SVG icon library (FontAwesome, Ionicons) for UI elements |
| `zod` | 4.1.11 | Runtime schema validation for input sanitization |
| `next-auth` | 4.24.11 | Authentication framework (installed, reserved for future use) |

### Styling

| Technology | Role |
|---|---|
| Tailwind CSS 3.4 | Utility-first CSS framework |
| Custom CSS Variables | Obsidian design tokens defined in `globals.css` |
| Inter | Primary sans-serif typeface (Google Fonts) |
| JetBrains Mono | Monospace typeface for labels and code elements |

### Development

| Package | Role |
|---|---|
| ESLint + eslint-config-next | Code linting |
| PostCSS + Autoprefixer | CSS processing pipeline |
| Turbopack | Development server bundler (`next dev --turbopack`) |

---

## 3. Architecture Overview

The application follows a monolithic architecture within the Next.js App Router. Frontend pages, API route handlers, and server components coexist in a single deployment.

```mermaid
graph TD
    Browser["Browser Client"]
    NextServer["Next.js Server"]
    Pool["pg.Pool Connection"]
    NeonDB[("Neon PostgreSQL")]
    CDN["Cloudinary CDN"]
    Resend["Resend Email API"]

    Browser -- "HTTP Requests" --> NextServer
    NextServer -- "Raw SQL Queries" --> Pool
    Pool -- "SSL Connection" --> NeonDB
    Browser -- "Direct Image Upload" --> CDN
    NextServer -- "Stream Upload / Delete" --> CDN
    NextServer -- "Email Dispatch" --> Resend
```

### Key Decisions

1. **Raw SQL over ORM** — Prisma is used only for schema definition and migrations (`prisma db push`, `prisma generate`). All runtime queries use the `pg` driver directly for full control and transparency.

2. **Server-side API boundaries** — API routes execute on the server, keeping environment credentials (database URLs, API secrets) out of client bundles.

3. **Decoupled media storage** — Images are uploaded to Cloudinary. Only the resulting CDN URLs are stored in the database. This keeps the database lightweight and backups small.

4. **Server Component Pre-fetching for Landing Page** — Pre-fetches news, events, and team details on the server to prevent loading skeletons, sequential roundtrips, and cold starts, boosting load speed.

5. **PostgreSQL case sensitivity** — Since Prisma generates PascalCase table names and camelCase columns, all raw SQL queries use double-quoted identifiers (e.g., `"TeamMember"`, `"gradYear"`) to match exactly.

6. **Image Optimization & Cache Strategy** — Integrated Next.js `<Image>` component and a custom URL pre-processor (`src/lib/images.js`) to apply CDN-level resizing and formats (`f_auto,q_auto`). Strip out cache-busting query strings to maximize CDN and browser cache HIT rates.

---

## 4. Database Schema (ERD)

The database contains **6 tables** with one foreign-key relationship between `Image` and `Event`.

```mermaid
erDiagram
    ADMIN {
        int id PK "Auto-increment"
        string email "Unique login identifier"
        string name "Display name"
        string password "bcrypt hash"
        datetime createdAt
        datetime updatedAt
    }

    EVENT {
        int id PK "Auto-increment"
        string title "Event name"
        text description "Rich-text body"
        datetime date "Scheduled date"
        string locationType "OFFLINE | ONLINE"
        string venue "Physical address or URL"
        string eventType "Workshop | Seminar | Hackathon | Speaker Session | Other"
        datetime createdAt
        datetime updatedAt
    }

    IMAGE {
        int id PK "Auto-increment"
        string url "Cloudinary CDN URL"
        string caption "Optional description"
        int eventId FK "Nullable"
        datetime createdAt
    }

    NEWS {
        int id PK "Auto-increment"
        string title "Headline"
        text details "Body content"
        datetime date "Publication date"
        string imageUrl "Cover photo URL"
        datetime createdAt
        datetime updatedAt
    }

    TEAM_MEMBER {
        int id PK "Auto-increment"
        string name "Full name"
        string designation "Role title"
        text details "Short bio"
        string imageUrl "Portrait URL"
        string instagram "Handle"
        string linkedin "Profile URL"
        string facebook "Profile URL"
        datetime createdAt
        datetime updatedAt
    }

    ALUMNI {
        int id PK "Auto-increment"
        string name "Full name"
        string gradYear "Batch e.g. 2024"
        string company "Employer"
        string role "Job title"
        string imageUrl "Portrait URL"
        string linkedin "Profile URL"
        int priority "Sort weight, lower is first"
        datetime createdAt
        datetime updatedAt
    }

    EVENT ||--o{ IMAGE : "has many"
```

### Table Relationships

- **Event → Image** — one-to-many. Each event can have multiple gallery images. `Image.eventId` is a nullable foreign key; when set, the image belongs to that event. When `NULL`, the image is a standalone gallery asset.
- **Cascade delete** — deleting an Event automatically deletes all its associated Images (both from the database and from Cloudinary).
- **All other tables** are independent with no foreign-key constraints.

---

## 5. Data Flow

### 5.1 Public Page Load

```mermaid
sequenceDiagram
    participant B as Browser
    participant N as Next.js Server
    participant API as API Route Handler
    participant DB as PostgreSQL

    B->>N: GET /events (page request)
    N-->>B: HTML shell + JS bundle
    B->>API: GET /api/events (client fetch)
    API->>DB: SELECT * FROM "Event" ORDER BY "date" DESC
    DB-->>API: Rows
    API->>DB: SELECT * FROM "Image" WHERE "eventId" = $1 (per event)
    DB-->>API: Image rows
    API-->>B: JSON array with nested images
    B->>B: Render event cards
```

### 5.2 Image Upload

```mermaid
sequenceDiagram
    participant A as Admin Browser
    participant API as /api/upload-url
    participant C as Cloudinary

    A->>A: Select file from disk
    A->>API: POST FormData { file }
    API->>API: Read file → ArrayBuffer → Buffer
    API->>API: Generate random hex filename
    API->>C: upload_stream(buffer, folder: "css_iiui")
    C-->>API: { secure_url }
    API-->>A: { url: secure_url }
    A->>A: Store URL for subsequent API call
```

### 5.3 Event Creation (with images)

```mermaid
sequenceDiagram
    participant A as Admin Browser
    participant Upload as /api/upload-url
    participant Events as /api/events
    participant C as Cloudinary
    participant DB as PostgreSQL

    A->>Upload: POST FormData { file_1 }
    Upload->>C: Stream upload
    C-->>Upload: { secure_url_1 }
    Upload-->>A: url_1

    A->>Upload: POST FormData { file_2 }
    Upload->>C: Stream upload
    C-->>Upload: { secure_url_2 }
    Upload-->>A: url_2

    A->>Events: POST { title, description, date, images: [url_1, url_2] }
    Events->>DB: INSERT INTO "Event" ... RETURNING *
    DB-->>Events: event row
    Events->>DB: INSERT INTO "Image" (url, eventId) ... (per URL)
    DB-->>Events: image rows
    Events-->>A: { event + images }
    A->>A: Redirect to /admin/events
```

### 5.4 Event Deletion (with cascade cleanup)

```mermaid
sequenceDiagram
    participant A as Admin Browser
    participant API as /api/events/[id]
    participant DB as PostgreSQL
    participant C as Cloudinary

    A->>API: DELETE /api/events/5
    API->>DB: SELECT * FROM "Event" WHERE "id" = 5
    DB-->>API: Event row (or 404)
    API->>DB: SELECT * FROM "Image" WHERE "eventId" = 5
    DB-->>API: Image rows
    loop Each image
        API->>C: destroy(public_id)
        C-->>API: ok
    end
    API->>DB: DELETE FROM "Image" WHERE "eventId" = 5
    API->>DB: DELETE FROM "Event" WHERE "id" = 5
    API-->>A: { ok: true }
```

### 5.5 Contact Form Submission

```mermaid
sequenceDiagram
    participant B as Browser
    participant API as /api/contact
    participant R as Resend API

    B->>API: POST { name, email, subject, message }
    alt RESEND_API_KEY is set
        API->>R: POST /emails { from, to, subject, html }
        R-->>API: { id }
        API-->>B: { ok: true, id }
    else No API key (development)
        API->>API: Console log email content
        API-->>B: { ok: true, simulated: true }
    end
```

### 5.6 Admin Authentication

```mermaid
sequenceDiagram
    participant A as Admin Browser
    participant Login as /api/auth/login
    participant Me as /api/auth/me
    participant DB as PostgreSQL

    A->>Login: POST { username, password }
    Login->>DB: SELECT * FROM "Admin" WHERE "email" = $1
    DB-->>Login: Admin row
    Login->>Login: bcrypt.compare(password, hash)
    Login-->>A: Set-Cookie: admin=1 (HttpOnly, 24h)
    A->>A: Redirect to /admin

    Note over A,Me: On every admin page load
    A->>Me: GET /api/auth/me
    Me->>Me: Parse cookie header for "admin=1"
    Me-->>A: { admin: true/false }
    alt Not authenticated
        A->>A: Redirect to /admin/login
    end
```

---

## 6. API Reference

Base URL: `/api`

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | Authenticate with username + password. Sets `admin=1` cookie. |
| POST | `/auth/logout` | Clears the admin cookie. |
| GET | `/auth/me` | Returns `{ admin: true/false }` based on cookie. |
| POST | `/auth/change-credentials` | Update admin username, name, and password. Requires auth. |

### Events

| Method | Endpoint | Description |
|---|---|---|
| GET | `/events` | List all events with nested images, sorted by date descending. |
| POST | `/events` | Create an event. Body: `{ title, description?, date?, locationType?, venue?, eventType?, images?[] }` |
| DELETE | `/events/[id]` | Delete event and cascade-delete associated images from DB and Cloudinary. |

### News

| Method | Endpoint | Description |
|---|---|---|
| GET | `/news` | List all news articles, sorted by date descending. |
| POST | `/news` | Create article. Body: `{ title, details, imageUrl?, date? }` |
| GET | `/news/[id]` | Fetch a single news article. |
| PUT | `/news/[id]` | Update article. Body: `{ title?, details?, imageUrl?, date? }` |
| DELETE | `/news/[id]` | Delete article and remove cover image from Cloudinary. |

### Team Members

| Method | Endpoint | Description |
|---|---|---|
| GET | `/team` | List all team members, sorted by ID ascending. |
| POST | `/team` | Create member. Body: `{ name, designation, details?, imageUrl?, instagram?, linkedin?, facebook? }` |
| PUT | `/team/[id]` | Update member. |
| DELETE | `/team/[id]` | Delete member and remove portrait from Cloudinary. |

### Alumni

| Method | Endpoint | Description |
|---|---|---|
| GET | `/alumni` | List all alumni, sorted by priority ascending then grad year descending. |
| POST | `/alumni` | Create alumni. Body: `{ name, gradYear, company?, role?, imageUrl?, linkedin?, priority? }` |
| PUT | `/alumni/[id]` | Update alumni. |
| DELETE | `/alumni/[id]` | Delete alumni and remove portrait from Cloudinary. |

### Gallery

| Method | Endpoint | Description |
|---|---|---|
| GET | `/gallery` | List all images with event titles via LEFT JOIN, sorted by ID descending. |
| POST | `/gallery` | Register an image. Body: `{ url, caption?, eventId? }` |
| DELETE | `/gallery/[id]` | Delete image record and remove asset from Cloudinary. |

### Utility

| Method | Endpoint | Description |
|---|---|---|
| POST | `/upload-url` | Upload a file to Cloudinary. Body: `FormData { file }`. Returns `{ url }`. |
| POST | `/contact` | Send a contact inquiry. Body: `{ name, email, subject, message }`. |
| GET | `/hello` | Health check. Returns `{ message: "Hello from test API 🚀" }`. |

---

## 7. Sequence Diagrams

### CRUD Operations Pattern

All resource endpoints (team, alumni, news, gallery) follow the same pattern:

**Create:**
1. Admin uploads image via `POST /api/upload-url` → receives Cloudinary URL
2. Admin submits form via `POST /api/{resource}` with the URL in the payload
3. Server inserts row with `INSERT INTO ... RETURNING *`
4. Client receives created object and refreshes the list

**Update:**
1. Admin modifies fields and optionally uploads a new image
2. `PUT /api/{resource}/[id]` fetches the existing row
3. If `imageUrl` changed, the old Cloudinary asset is deleted via `deleteObject()`
4. Row is updated with `UPDATE ... SET ... WHERE "id" = $1 RETURNING *`

**Delete:**
1. `DELETE /api/{resource}/[id]` fetches the existing row
2. Cloudinary asset is deleted if a URL exists
3. Row is deleted with `DELETE FROM ... WHERE "id" = $1`

### Cloudinary URL Parsing (for deletion)

When deleting a Cloudinary asset, the server extracts the `public_id` from the URL:

```
Input:  https://res.cloudinary.com/cloud/image/upload/v123456/css_iiui/abc123.jpg
                                                         ───────────────────────
Step 1: Split on "/upload/" → "v123456/css_iiui/abc123.jpg"
Step 2: Strip version prefix → "css_iiui/abc123.jpg"
Step 3: Remove extension    → "css_iiui/abc123"
Result: public_id = "css_iiui/abc123"
```

---

## 8. Frontend Structure

### Page Map

| Route | Component | Rendering | Description |
|---|---|---|---|
| `/` | `page.js` | Server | Homepage: Hero, Events, Team, FAQ |
| `/events` | `events/page.jsx` | Client | Events grid with cards |
| `/events/[id]` | `events/[id]/page.jsx` | Server (async) | Event detail with image slideshow |
| `/team` | `team/page.jsx` | Client | Team member grid with social links |
| `/alumni` | `alumni/page.jsx` | Client | Alumni directory sorted by priority |
| `/gallery` | `gallery/page.jsx` | Client | Image grid with CORS-safe download |
| `/about` | `about/page.jsx` | Server | Static about page with timeline |
| `/contact` | `contact/page.jsx` | Client | Contact form (Resend integration) |
| `/admin` | `admin/page.jsx` | Client | Dashboard with 6 management cards |
| `/admin/login` | `admin/login/page.jsx` | Client | Login form |
| `/admin/events` | `admin/events/page.jsx` | Client | Event list with create/delete |
| `/admin/events/new` | `admin/events/new/page.jsx` | Client | Event creator with rich editor |
| `/admin/team` | `admin/team/page.jsx` | Client | Team CRUD with inline form |
| `/admin/alumni` | `admin/alumni/page.jsx` | Client | Alumni CRUD with inline form |
| `/admin/gallery` | `admin/gallery/page.jsx` | Client | Gallery upload and management |
| `/admin/news` | `admin/news/page.jsx` | Client | News CRUD with inline form |
| `/admin/settings` | `admin/settings/page.jsx` | Client | Change credentials |

### Component Map

| Component | Type | Data Source | Description |
|---|---|---|---|
| `Navbar.jsx` | Client | None | Sticky header with scroll-aware glassmorphism, mobile hamburger |
| `Hero.jsx` | Client | `GET /api/news` | Auto-rotating slideshow (8s interval) using latest news |
| `EventsSection.jsx` | Client | `GET /api/events` | Horizontal snap-scroll carousel of event cards |
| `EventCard.jsx` | Shared | Props | Reusable event card with image, metadata, and detail link |
| `CoreTeamSection.jsx` | Client | `GET /api/team` | 2–4 column team grid with social badges |
| `FAQSection.jsx` | Client | Hardcoded | Accordion with 4 Q&A items |
| `NewsSection.jsx` | Client | `GET /api/news` | 3-column news grid (available, not currently used on homepage) |
| `TimelineSection.jsx` | Client | Props | Horizontal scrolling timeline with milestone cards |
| `EventSlideshow.jsx` | Client | Props | Image carousel with dots and crossfade transitions |
| `Footer.jsx` | Server | None | Logo, Instagram, LinkedIn, contact link |
| `InteractiveGrid.jsx` | Client | None | Disabled (returns null), background handled by layout |

---

## 9. Design System

The visual identity uses an obsidian-zinc dark theme defined through CSS custom properties in `globals.css`.

### Color Tokens

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#09090b` | Page background |
| `--fg` | `#f4f4f5` | Primary text |
| `--muted` | `#71717a` | Secondary text, labels |
| `--border` | `#18181b` | Card and section borders |
| `--surface` | `#0f0f11` | Card backgrounds |
| `--surface-hover` | `#151518` | Card hover state |

### Typography

| Font | Weight Range | Usage |
|---|---|---|
| Inter | 300–900 | Body text, headings, UI elements |
| JetBrains Mono | 400, 700 | Labels, tags, monospace accents |

### Utility Classes

| Class | Purpose |
|---|---|
| `.section` | Max-width container (6xl) with responsive padding |
| `.section-title` | Responsive heading (2–3rem), 800 weight, uppercase |
| `.label` | Monospace micro-label with auto `[bracket]` decoration |
| `.card` | Surface-colored card with border and hover transition |
| `.btn` | Primary button: white fill, inverts on hover |
| `.btn-ghost` | Ghost button: transparent fill, border brightens on hover |
| `.slider-nav` | Positioned arrow buttons for carousels |
| `.no-scrollbar` | Hides scrollbar across all browsers |
| `.animate-fade-in-up` | Entry animation: fade + slide up (0.7s) |
| `.tech-grid` | Radial dot-grid background pattern (30px spacing) |

---

## 10. Directory Map

```
css_iiui/
├── prisma/
│   ├── schema.prisma              # Database schema (6 models)
│   └── seed.js                    # Seeds default admin account
│
├── public/
│   └── favicon-16x16.png          # Site favicon
│
├── src/
│   ├── app/
│   │   ├── layout.js              # Root layout (fonts, navbar, footer)
│   │   ├── page.js                # Homepage
│   │   ├── globals.css            # Design system tokens and utilities
│   │   │
│   │   ├── about/page.jsx         # About page with timeline
│   │   ├── alumni/page.jsx        # Alumni directory
│   │   ├── contact/page.jsx       # Contact form
│   │   ├── events/
│   │   │   ├── page.jsx           # Events listing
│   │   │   └── [id]/page.jsx      # Event detail (server-rendered)
│   │   ├── gallery/page.jsx       # Photo gallery with download
│   │   ├── team/page.jsx          # Team roster
│   │   │
│   │   ├── admin/
│   │   │   ├── layout.jsx         # Auth guard wrapper
│   │   │   ├── page.jsx           # Dashboard
│   │   │   ├── login/page.jsx     # Login form
│   │   │   ├── settings/page.jsx  # Credential management
│   │   │   ├── events/
│   │   │   │   ├── page.jsx       # Events manager
│   │   │   │   └── new/page.jsx   # Event creator
│   │   │   ├── team/page.jsx      # Team CRUD
│   │   │   ├── alumni/page.jsx    # Alumni CRUD
│   │   │   ├── gallery/page.jsx   # Gallery CRUD
│   │   │   └── news/page.jsx      # News CRUD
│   │   │
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── login/route.js
│   │       │   ├── logout/route.js
│   │       │   ├── me/route.js
│   │       │   └── change-credentials/route.js
│   │       ├── events/
│   │       │   ├── route.js
│   │       │   └── [id]/route.js
│   │       ├── news/
│   │       │   ├── route.js
│   │       │   └── [id]/route.js
│   │       ├── team/
│   │       │   ├── route.js
│   │       │   └── [id]/route.js
│   │       ├── alumni/
│   │       │   ├── route.js
│   │       │   └── [id]/route.js
│   │       ├── gallery/
│   │       │   ├── route.js
│   │       │   └── [id]/route.js
│   │       ├── upload-url/route.js
│   │       ├── contact/route.js
│   │       └── hello/route.js
│   │
│   ├── assets/
│   │   └── css.png                # Society logo
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── EventsSection.jsx
│   │   ├── EventCard.jsx
│   │   ├── CoreTeamSection.jsx
│   │   ├── FAQSection.jsx
│   │   ├── NewsSection.jsx
│   │   ├── TimelineSection.jsx
│   │   ├── EventSlideshow.jsx
│   │   ├── InteractiveGrid.jsx
│   │   ├── Footer.jsx
│   │   └── admin/
│   │       ├── EventEditor.jsx
│   │       ├── AdminDashboard.jsx
│   │       └── EventsManager.jsx
│   │
│   └── lib/
│       ├── db.js                  # PostgreSQL connection pool
│       ├── cloudinary.js          # Upload, delete, random name helpers
│       └── adminAuth.js           # Cookie-based auth check
│
├── .env                           # Environment variables (git-ignored)
├── .gitignore
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.mjs
└── eslint.config.mjs
```

---

## 11. Setup & Installation

### Prerequisites

- **Node.js** 18 or above — [nodejs.org](https://nodejs.org)
- **PostgreSQL** database — [Neon](https://neon.tech) (cloud) or local instance
- **Cloudinary** account — [cloudinary.com](https://cloudinary.com)

### Step 1 — Clone & Install

```bash
git clone https://github.com/Abubakkar-Khan/css_iiui.git
cd css_iiui
npm install
```

### Step 2 — Environment Variables

Create a `.env` file in the project root:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"

# Cloudinary credentials
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
NEXT_PUBLIC_CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Optional: Resend email API key (omit for simulation mode)
# RESEND_API_KEY="re_your_key_here"
```

### Step 3 — Database Setup

Push the Prisma schema to your database and generate the client:

```bash
npx prisma db push
npx prisma generate
```

Seed the default admin account:

```bash
node prisma/seed.js
```

### Step 4 — Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 5 — Production Build

```bash
npm run build
npm start
```

### Database Management

| Command | Description |
|---|---|
| `npx prisma db push` | Sync schema to database |
| `npx prisma generate` | Regenerate Prisma client types |
| `npx prisma studio` | Launch visual database browser at `localhost:5555` |
| `npx prisma migrate dev --name <name>` | Create a versioned migration |

---

## 12. Admin Panel

Access the admin dashboard at `/admin/login`.

### Default Credentials

| Field | Value |
|---|---|
| Username | `admin` |
| Password | `admin` |

> Change these immediately after first login via **Account Security** in the dashboard.

### Dashboard Modules

| Module | Path | Capabilities |
|---|---|---|
| Events | `/admin/events` | Create events with multi-image slideshows, set type/venue/location, delete |
| News | `/admin/news` | Create/edit/delete announcements with cover photos |
| Team Members | `/admin/team` | Add/edit/remove members with portraits and social links |
| Alumni Network | `/admin/alumni` | Manage graduates with priority sorting |
| Image Gallery | `/admin/gallery` | Upload images, link to events, manage captions |
| Account Security | `/admin/settings` | Change admin username, display name, and password |