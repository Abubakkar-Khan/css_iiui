# CS Society (CSS) Web Portal — Complete System Report & Guide for Beginners

Welcome! This is the official system report and dummy-friendly documentation for the **Computer Science Society (CSS)** web platform at the **International Islamic University, Islamabad (IIUI)**. 

Whether you are a developer, an administrator, a sponsor, or a student just getting started, this guide will explain everything about this codebase in the simplest possible terms.

---

## 1. What is this project?

The CSS Web Portal is a professional, high-performance web platform designed to represent the Computer Science Society of IIUI. It serves three main audiences:

1. **Sponsors & Partners:** A gorgeous, clean corporate showcase of our hackathons, workshops, and society strength to attract partnerships and sponsorships.
2. **Students & Alumni:** A public directory where students can read society news, check out the active executive cabinet members, see our alumni success directory in the tech industry, and explore galleries of past events.
3. **Society Administrators (CMS):** A secure, locked control dashboard where administrators can add, update, or remove events, news, cabinet members, and image portfolios in real-time.

---

## 2. The Simple Technology Stack

To keep the application fast, lightweight, and easy to maintain, we chose a focused set of modern technologies:

* **Framework:** **Next.js 15** (built with React) — A powerful web framework that handles both the visual frontend pages and the backend server code in a single project.
* **Database:** **PostgreSQL** — A robust database system hosted in the cloud on **Neon Database**.
* **Direct Database Driver:** **Node-Postgres (`pg` package)** — We communicate with PostgreSQL directly using raw SQL queries rather than slow or heavy frameworks. This keeps our queries fast and easily explainable.
* **Image CDN Storage:** **Cloudinary** — Rather than slowing down our database by saving large image files, all pictures are sent directly to Cloudinary. We only store the fast-loading, optimized image URLs in our database.

---

## 3. Database Architecture (How the Data is Structured)

Our database consists of **6 clean tables** structured to link together logically:

```mermaid
erDiagram
    EVENT ||--o{ IMAGE : "has slideshow images (1:N)"
    
    ADMIN {
        int id PK "Auto-incrementing ID"
        string email "Login Username"
        string name "Display Name"
        string password "Secured Hash"
    }

    EVENT {
        int id PK "Auto-incrementing ID"
        string title "Event Name"
        text description "Markdown or plain details"
        datetime date "Date scheduled"
        string locationType "OFFLINE / ONLINE"
        string venue "Auditiorium B, Zoom, etc."
        string eventType "Workshop, Hackathon, Seminar"
    }

    IMAGE {
        int id PK "Auto-incrementing ID"
        string url "Cloudinary link"
        string caption "Hover text"
        int eventId FK "Belongs to Event (NULL = general image)"
    }

    NEWS {
        int id PK "Auto-incrementing ID"
        string title "Announcement heading"
        text details "Full update details"
        datetime date "Publish date"
        string imageUrl "Cover image"
    }

    TEAM_MEMBER {
        int id PK "Auto-incrementing ID"
        string name "Cabinet member name"
        string designation "President, Tech Lead, etc."
        text details "Short bio"
        string imageUrl "Headshot photo"
        string instagram "Profile handle (optional)"
        string linkedin "Profile URL (optional)"
        string facebook "Profile URL (optional)"
    }

    ALUMNI {
        int id PK "Auto-incrementing ID"
        string name "Graduate name"
        string gradYear "Year of graduation (e.g. 2024)"
        string company "Current employer (Google, etc.)"
        string role "Current title (Senior Engineer, etc.)"
        string imageUrl "Professional headshot"
        string linkedin "LinkedIn profile"
        int priority "Sort weight (lower = pinned first)"
    }
```

---

## 4. How the Code Actually Works (Easily Explained!)

### A. Raw SQL Database Queries (No Prisma!)
Instead of heavy software mapping packages, we run direct **raw SQL queries** using the Node.js `pg` client pool located at `src/lib/db.js`.
Because PostgreSQL converts tables and columns to lowercase automatically by default, we **double-quote** all table and column names (`"Event"`, `"TeamMember"`, `"gradYear"`, etc.) in our SQL queries to match the schema perfectly!

**Example (Fetching active team members):**
```javascript
// Located inside src/app/api/team/route.js
const res = await db.query('SELECT * FROM "TeamMember" ORDER BY "id" ASC');
return new Response(JSON.stringify(res.rows));
```

**Example (Uploading dynamic multi-image event recaps):**
When creating a new event, we insert the event metadata first, then loop through all uploaded Cloudinary URLs and insert them as associated items into the `"Image"` table:
```javascript
// Located inside src/app/api/events/route.js
const eventRes = await db.query(
  'INSERT INTO "Event" ("title", "description", "date", "locationType", "venue", "eventType", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *',
  [title, description, new Date(date), locationType, venue, eventType]
);
const ev = eventRes.rows[0];

for (const url of images) {
  await db.query(
    'INSERT INTO "Image" ("url", "eventId", "createdAt") VALUES ($1, $2, NOW())',
    [url, ev.id]
  );
}
```

### B. High-Performance Front-end Features
1. **Interactive Event Slideshows:** In the event details page (`src/app/events/[id]`), all uploaded event images are passed to a lightweight custom slideshow component (`src/components/EventSlideshow.jsx`). It renders smooth sliding transitions with prev/next buttons and paginated indicator dots—with **zero package overhead**.
2. **Instant Gallery Image Downloads:** In the public gallery (`src/app/gallery/page.jsx`), we created a cross-origin downloader that fetches images as file blobs:
   ```javascript
   const res = await fetch(url);
   const blob = await res.blob();
   const blobUrl = window.URL.createObjectURL(blob);
   // Programmatically trigger a browser download!
   ```
3. **Silent CMS Operations:** Browser success popups (`alert(...)`) were removed across the admin management panel. Saving a team member or posting news now completes instantly and quietly with silent route redirects.
4. **Soft obsidian Theme:** Our theme (`globals.css`) uses a warm, soothing obsidian charcoal palette (`#0d0e12`) that reduces strain on the eyes. All primary headings and dynamic catalog pages are beautifully centered for a high-end, cohesive grid appearance.
5. **Team Social Badges:** If a cabinet team member provides their profile URLs (LinkedIn, Instagram, or Facebook) inside the database, beautiful, subtle hover icons appear inside their cards automatically.

---

## 5. Setting Up the Project Locally (Beginner's Guide)

Follow these simple steps to run this project on your personal computer:

### Step 1: Clone or Extract the Project
Extract the zip/rar file into a dedicated project folder on your computer.

### Step 2: Install Node.js
Ensure you have **Node.js** installed (Version 18 or above recommended). Download it from [nodejs.org](https://nodejs.org).

### Step 3: Install Project Packages
Open your command line/terminal in the project folder and run:
```bash
npm install
```
This downloads all necessary modules (Next.js, pg, cloudinary, etc.) automatically.

### Step 4: Configure Environment Keys (`.env`)
Create a new file named `.env` in the root project folder (next to `package.json`) and populate it with these keys:
```env
# Neon Postgres Connection URL
DATABASE_URL="postgresql://neondb_owner:npg_NX1lCgyjSh4x@ep-solitary-night-ao2g0vt7-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# Cloudinary Integration (Do not edit unless replacing Cloudinary accounts)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dxfob5w5j"
NEXT_PUBLIC_CLOUDINARY_API_KEY="829218522733291"
CLOUDINARY_API_SECRET="_HposDpzAF38lbVrYPbl_zLpc-c"
```

### Step 5: Start the Development Server
Run the local dev command in your terminal:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** inside your browser. The live portal is now running locally on your computer!

---

## 6. Project Directory Reference (Where things are)

To easily locate and edit specific parts of the codebase, refer to this simple guide:

* `src/app/` — Contains all core visual pages of our application.
  * `page.js` — The main homepage.
  * `about/page.jsx` — The "About Us" timeline page.
  * `alumni/page.jsx` — The Graduated Alumni directory catalog.
  * `events/page.jsx` — Public calendar list of workshops and hackathons.
  * `events/[id]/page.jsx` — Dynamic detail page featuring the **image slideshow** for a single event.
  * `gallery/page.jsx` — Visual grid with integrated **image download buttons**.
  * `team/page.jsx` — public cabinet roster listing with **LinkedIn and social media badges**.
* `src/app/admin/` — The protected control panel for society heads.
  * `page.jsx` — The central administrative dashboard.
  * `events/new/page.jsx` — Creator interface allowing **multiple slideshow image uploads**.
  * `team/page.jsx`, `alumni/page.jsx`, `gallery/page.jsx`, `news/page.jsx` — CMS tables to sync rosters, uploads, and posts silently.
* `src/app/api/` — Backend query endpoints executing direct raw SQL calls to fetch, insert, or delete data.
* `src/components/` — Reusable front-end building blocks (e.g. `Navbar.jsx`, `Footer.jsx`, `EventSlideshow.jsx`, `CoreTeamSection.jsx`).
* `src/lib/` — Backend helpers.
  * `db.js` — Direct PostgreSQL raw SQL query pool.
  * `cloudinary.js` — Image upload and purge controllers.