# The Computer Science Society (CSS) Web Portal

A premium, high-fidelity, Swiss-utilitarian web portal designed and built for the **Computer Science Society (CSS)** at the **International Islamic University Islamabad (IIUI)**.

---

## 1. Relational Database Schema (ERD)

The system uses **Prisma ORM** integrated with a **PostgreSQL** database. Below is the simplified and optimized Entity-Relationship Diagram (ERD) mapping the complete data models of the backend.

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
        int eventId FK "Nullable (Null = Non-Event, Int = Event)"
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
        string discord "Nullable"
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
        timestamp createdAt
        timestamp updatedAt
    }
```

### Table Relation Strategy:
- **`Image` Table:** Acts as a unified asset library. 
  - If `eventId` is **defined**, the image belongs to a specific event (e.g., event recap gallery).
  - If `eventId` is **NULL**, it is a non-event general image (e.g., promotional graphic, header background).

---

## 2. Tech Stack

- **Core Framework:** Next.js 15 (App Router)
- **Runtime:** Node.js / React 19
- **Styling:** Tailwind CSS & Vanilla CSS Design Tokens
- **Database ORM:** Prisma ORM
- **Database Engine:** PostgreSQL (Production) / SQLite (Local Dev)
- **Icons:** React Icons (Fa6, Io5)

---

## 3. Database Management & Operations

Prisma ORM manages migrations and database client generation natively. Use the following commands to execute database operations:

### Synchronize Schema & Generate Client
Generates the type-safe Prisma Client based on the active models in `prisma/schema.prisma`:
```bash
npx prisma generate
```

### Create & Apply Migrations
Creates a new PostgreSQL migration and applies it safely to the database instance:
```bash
npx prisma migrate dev --name init_schema
```

### Launch Interactive Database GUI (Prisma Studio)
Launches a visual admin dashboard at `http://localhost:5555` to browse and modify table data:
```bash
npx prisma studio
```

---

## 4. Development Setup

Follow these simple steps to run the application locally:

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and append your database connection string:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/css_db?schema=public"
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your browser to view the live portal!