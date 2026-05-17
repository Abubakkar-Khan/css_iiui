# The Computer Science Society (CSS) Web Portal
### Comprehensive Software Requirements Specification (SRS) & System Documentation

Welcome to the official developer repository and technical documentation for the **Computer Science Society (CSS) Web Portal** at the **International Islamic University Islamabad (IIUI)**.

---

## 1. Executive Summary & Project Vision

### 1.1 Purpose
The CSS Web Portal is a premium, high-performance web platform designed to serve as the unified public face of the Computer Science Society. It operates with a dual purpose:
1. **Strategic Corporate Portfolio:** An executive showcase of events, accomplishments, and society scope designed to secure **corporate sponsor partnerships** for future workshops and symposiums.
2. **Student & Alumni Showcase:** An active information hub for students to explore chronicles, recent news, the administrative team roster, and browse a comprehensive directory of graduated cohorts.

### 1.2 Administrative CMS Layer
Beyond the public catalog, the platform features a secure **Content Management System (CMS) Dashboard** that enables authorized administrators to manage site content in real-time. Admins can:
- Author rich-text event recaps using a custom visual editor.
- Upload primary banners and gallery images directly to the cloud.
- Manage and prioritize the active team member list.
- Organize and manage the alumni network profiles.

### 1.3 Swiss-Utilitarian Design Philosophy
The platform strictly adheres to a **Swiss-inspired minimalist design language**:
- **Monochrome Palette:** Clean black, gray, and white shades with transparent overlays (glassmorphism) and sharp card layouts.
- **Strict Typography:** A premium, modern sans-serif visual hierarchy using curated Google Fonts (Inter & Outfit).
- **Subtle Micro-Animations:** Clean hover states, smooth scroll-scaling, and interactive UI feedback.

---

## 2. System Architecture & Tech Stack

The application is built on a highly optimized, modern serverless-ready stack:

```mermaid
graph TD
    Client[Next.js Client UI / CldImage] <--> Server[Next.js API Route Handlers]
    Server <--> ORM[Prisma ORM Client]
    ORM <--> DB[(Neon Cloud PostgreSQL)]
    Server <--> Cloudinary[Cloudinary CDN Media Library]
```

- **Framework:** Next.js 15 (App Router)
- **Runtime:** Node.js / React 19
- **Database Engine:** Cloud-hosted PostgreSQL (deployed on Neon Tech)
- **ORM / Database Access:** Prisma ORM
- **Object Storage & CDN:** Cloudinary (powered by `next-cloudinary`)
- **Icons:** React Icons (Fa6, Io5)

---

## 3. Database Schema Design (ERD)

The database architecture has been radically simplified and optimized down to exactly **6 primary tables**. This ensures maximum performance, clean relationship constraints, and easy long-term maintenance.

```mermaid
erDiagram
    EVENT ||--o{ IMAGE : "contains (1:N)"
    
    ADMIN {
        int id PK
        string email "Unique"
        string name
        string password "Hashed"
        timestamp createdAt
        timestamp updatedAt
    }

    EVENT {
        int id PK
        string title
        text description
        datetime date
        timestamp createdAt
        timestamp updatedAt
    }

    IMAGE {
        int id PK
        string url
        string caption "Nullable"
        int eventId FK "Nullable (Null = General, Int = Event)"
        timestamp createdAt
    }

    NEWS {
        int id PK
        string title
        text details
        datetime date
        string imageUrl "Nullable"
        timestamp createdAt
        timestamp updatedAt
    }

    TEAM_MEMBER {
        int id PK
        string name
        string designation
        text details "Nullable"
        string imageUrl "Nullable"
        string instagram "Nullable"
        string linkedin "Nullable"
        string facebook "Nullable"
        timestamp createdAt
        timestamp updatedAt
    }

    ALUMNI {
        int id PK
        string name
        string gradYear
        string company "Nullable"
        string role "Nullable"
        string imageUrl "Nullable"
        string linkedin "Nullable"
        int priority "Default = 2"
        timestamp createdAt
        timestamp updatedAt
    }
```

### 3.1 Table Definition Specifications

#### 1. `Admin`
Stores authentication credentials for executive dashboard users.
- `id` (Int, PK): Auto-incrementing identifier.
- `email` (String, Unique): Verified admin email address.
- `name` (String): Administrative user's full name.
- `password` (String): Hashed password value (using bcrypt).

#### 2. `Event`
Stores past chronicles and upcoming workshops.
- `id` (Int, PK): Auto-incrementing identifier.
- `title` (String): The event title.
- `description` (Text): Rich-text body recap of the event.
- `date` (DateTime): The calendar date of the event.

#### 3. `Image` (Unified Asset Strategy)
A single global asset library with highly versatile relationship mapping:
- `id` (Int, PK): Auto-incrementing identifier.
- `url` (String): The secure absolute Cloudinary URL.
- `caption` (String, Nullable): Optional description of the photo.
- `eventId` (Int, FK, Nullable): Optional relation mapping. 
  - If **defined**, the image represents an event recap gallery asset.
  - If **NULL**, the image is a non-event general asset (promotional headers, team banners).

#### 4. `News`
Chronicles announcements, publications, and notices.
- `id` (Int, PK): Auto-incrementing identifier.
- `title` (String): News headline.
- `details` (Text): The main body text.
- `date` (DateTime): Notice publication date.
- `imageUrl` (String, Nullable): Link to the header announcement picture.

#### 5. `TeamMember`
Stores active society executives.
- `id` (Int, PK): Auto-incrementing identifier.
- `name` (String): Full name.
- `designation` (String): Roster title (e.g., President, Web Dev Lead).
- `details` (Text, Nullable): Brief bio details.
- `imageUrl` (String, Nullable): Professional corporate portrait URL.
- `instagram` / `linkedin` / `facebook` (String, Nullable): Social handles.

#### 6. `Alumni`
Directory showcasing graduated senior batches.
- `id` (Int, PK): Auto-incrementing identifier.
- `name` (String): Full name.
- `gradYear` (String): Academic batch designation (e.g. `F20`, `S19`).
- `company` / `role` (String, Nullable): Grad career placements (e.g., Google, Senior Engineer).
- `imageUrl` (String, Nullable): Portrait URL.
- `linkedin` (String, Nullable): Direct professional coordinate link.
- `priority` (Int, Default = 2): Custom sorting key allowing administrators to pin/rank specific key alumni.

---

## 4. Object Storage & Media Operations Strategy

### 4.1 Server-Side Cloudinary Streaming
All media uploading is completely decoupled from S3 and handled directly via Node.js stream pipelining.
When an image is added by an admin:
1. The client sends a single `FormData` payload containing the file to the `/api/upload-url` route handler.
2. The server converts the incoming file stream into a Node buffer:
   ```javascript
   const bytes = await file.arrayBuffer();
   const buffer = Buffer.from(bytes);
   ```
3. The server pipes the buffer into Cloudinary's streaming upload API under the custom `css_iiui/` asset directory:
   ```javascript
   cloudinary.uploader.upload_stream({ folder: "css_iiui" })
   ```
4. The server returns the final secure public URL (`secure_url`), which is stored directly inside the database `url` column.

### 4.2 Automated Cloud Cleanup (Cascade Destruction)
To maintain cloud storage efficiency, the system implements a custom cascade cleanup pipeline. When an event is deleted from the CMS:
1. The server queries the database for all related event `Image` URLs.
2. For each URL, it extracts the unique Cloudinary `public_id`:
   ```javascript
   const parts = url.split("/upload/");
   const pathAndFilename = parts[1].replace(/^v\d+\//, ""); // remove version string
   const publicId = pathAndFilename.substring(0, pathAndFilename.lastIndexOf("."));
   ```
3. The server issues a destroy instruction to the Cloudinary API:
   ```javascript
   await cloudinary.uploader.destroy(publicId);
   ```
4. Once the assets are safely destroyed in the cloud, Prisma executes a clean cascade purge in PostgreSQL, preventing any orphan records.

---

## 5. Development Setup & Deployment

Follow these steps to run the application and sync your database locally:

### 5.1 Installation & Dependencies
Clone the repository and install all required standard packages:
```bash
npm install
```

### 5.2 Environment Configuration
Create a `.env` file in the root directory and define the Neon PostgreSQL database URL and Cloudinary API credentials:
```env
# Neon Cloud Database URL
DATABASE_URL="postgresql://neondb_owner:PASSWORD@ep-solitary-night-ao2g0vt7-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# Cloudinary CDN Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dxfob5w5j"
NEXT_PUBLIC_CLOUDINARY_API_KEY="829218522733291"
CLOUDINARY_API_SECRET="your_api_secret_here"
```

### 5.3 Synchronizing Database Schema
Sync your database with your Neon PostgreSQL instance and automatically generate the type-safe client:
```bash
# Push schema to live DB
npx prisma db push

# Recompile client types
npx prisma generate
```

### 5.4 Running Development Server
Start the Next.js local server with hot-reloading:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your browser to view the active CSS portal!

---

## 6. Administrative Management Commands

Keep this playbook handy to execute backend adjustments:
- **Visual DB Browser:** Spin up Prisma Studio locally at `http://localhost:5555` to browse and edit records visually:
  ```bash
  npx prisma studio
  ```
- **Database Migrations:** Create a permanent SQL migration record:
  ```bash
  npx prisma migrate dev --name init_schema
  ```