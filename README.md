# The Computer Science Society (CSS) Web Portal

A premium, high-fidelity, Swiss-utilitarian web portal designed and built for the **Computer Science Society (CSS)** at the **International Islamic University Islamabad (IIUI)**.

This portal serves as a central hub for student registration, showcasing society events, highlighting executive leadership, documenting academic timelines, and maintaining a robust alumni directory.

---

## 1. Relational Database Schema (ERD)

The system uses **Prisma ORM** integrated with a **PostgreSQL** database. Below is the interactive Entity-Relationship Diagram (ERD) mapping the complete data models of the active database backend.

```mermaid
erDiagram
    EVENT ||--o{ EVENT_IMAGE : "contains (1:N)"
    EVENT ||--o{ EVENT_REGISTRATION : "has (1:N)"
    
    EVENT {
        int id PK
        string title
        text description
        datetime date
        timestamp createdAt
        timestamp updatedAt
    }

    EVENT_IMAGE {
        int id PK
        int eventId FK
        string encryptedName
        int priority "1 = Featured, 2 = Normal"
        timestamp createdAt
        timestamp updatedAt
    }

    NEWS {
        int id PK
        string title
        text details
        datetime date
        string image
        timestamp createdAt
        timestamp updatedAt
    }

    TEAM_MEMBER {
        int id PK
        string name
        string designation
        text details
        string image
        string instagram
        string linkedin
        string facebook
        string discord
        timestamp createdAt
        timestamp updatedAt
    }

    TIMELINE_ITEM {
        int id PK
        datetime date
        string highlights
        text details
        string image
        timestamp createdAt
        timestamp updatedAt
    }

    POST {
        int id PK
        string title
        string slug
        BlogCategory category "Enum"
        text description
        string image
        timestamp createdAt
        timestamp updatedAt
    }

    GALLERY_IMAGE {
        int id PK
        string encryptedFileName
        string title
        timestamp createdAt
    }

    ALUMNI {
        int id PK
        string name
        string gradYear
        string company
        string role
        string image
        string linkedin
        timestamp createdAt
        timestamp updatedAt
    }

    USER {
        int id PK
        string email
        string name
        string password
        Role role "Enum"
        timestamp createdAt
        timestamp updatedAt
    }

    EVENT_REGISTRATION {
        int id PK
        int eventId FK
        string studentName
        string studentEmail
        string rollNumber
        string whatsapp
        RegStatus status "Enum"
        timestamp createdAt
    }

    MEMBERSHIP_APPLICATION {
        int id PK
        string name
        string rollNumber
        string email
        string whatsapp
        string department
        text skills
        text whyJoin
        AppStatus status "Enum"
        timestamp createdAt
    }

    INQUIRY {
        int id PK
        string name
        string email
        string subject
        text message
        boolean isRead
        timestamp createdAt
    }
```

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