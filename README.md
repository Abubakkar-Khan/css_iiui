# The Computer Science Society (CSS) Web Portal

The official web platform for the **Computer Science Society (CSS)** at the **International Islamic University Islamabad (IIUI)**.

---

## 1. What is this project about?

The CSS Web Portal is designed as a dynamic showcase and administrative hub. It serves two main purposes:

1. **Portfolio for Sponsors:** A clean, professional showcase of our events and society details to attract and secure corporate partnerships.
2. **Display for Students:** A central space for students to view society news, meet the active executive team, and explore our graduated alumni directory.
3. **Admin CMS (Content Management System):** A secure dashboard where society administrators can easily update the website's content in real-time (creating events, managing team members, adding alumni, and uploading photos).

---

## 2. Core Technology Stack

- **Framework:** Next.js (Modern React Framework)
- **Database:** PostgreSQL (Cloud-hosted on Neon Database)
- **Object Storage (Images):** Cloudinary (For fast, optimized image loading)
- **Database Access:** Prisma ORM (Object-Relational Mapping)

---

## 3. Database Structure

The database is built on **6 simple tables** designed to keep data organized and lightweight:

```mermaid
erDiagram
    EVENT ||--o{ IMAGE : "contains (1:N)"
    
    ADMIN {
        int id PK
        string email "Unique"
        string name
        string password "Hashed"
    }

    EVENT {
        int id PK
        string title
        text description
        datetime date
        string locationType
        string venue
        string eventType
    }

    IMAGE {
        int id PK
        string url
        string caption "Nullable"
        int eventId FK "Nullable (Null = General, Int = Event)"
    }

    NEWS {
        int id PK
        string title
        text details
        datetime date
        string imageUrl "Nullable"
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
    }
```

### Media Strategy:
- **`Image` Table:** Serves as our general photo library. If `eventId` is set, the photo belongs to an event recap gallery. If `eventId` is empty (`NULL`), it represents general society graphics (such as background banners or team headshots).

---

## 4. How to Run the Project Locally

Follow these simple steps to run the website on your local computer:

### 1. Install Dependencies
Open your terminal in the project folder and run:
```bash
npm install
```

### 2. Configure Environment Variables
Create a file named `.env` in the root folder and add your credentials:
```env
# Neon Database Connection
DATABASE_URL="postgresql://neondb_owner:PASSWORD@ep-solitary-night-ao2g0vt7-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# Cloudinary CDN Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dxfob5w5j"
NEXT_PUBLIC_CLOUDINARY_API_KEY="829218522733291"
CLOUDINARY_API_SECRET="your_secret_here"
```

### 3. Sync Database & Launch Dev Server
Run these commands to prepare the database and start the website:
```bash
# Push structure to database
npx prisma db push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) inside your web browser to see the live CSS portal!