import pg from 'pg';
const { Pool } = pg;
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to load env variables from .env
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value;
      }
    });
  }
}

loadEnv();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("ERROR: DATABASE_URL environment variable is missing.");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

const schemaSql = `
-- Create Admin Table
CREATE TABLE IF NOT EXISTS "Admin" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Event Table
CREATE TABLE IF NOT EXISTS "Event" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT NOT NULL,
  "date" TIMESTAMP WITH TIME ZONE NOT NULL,
  "locationType" VARCHAR(50) DEFAULT 'OFFLINE',
  "venue" VARCHAR(255),
  "eventType" VARCHAR(100) DEFAULT 'Workshop',
  "registrationLink" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Image Table
CREATE TABLE IF NOT EXISTS "Image" (
  "id" SERIAL PRIMARY KEY,
  "url" TEXT NOT NULL,
  "caption" VARCHAR(255),
  "eventId" INTEGER REFERENCES "Event"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create News Table
CREATE TABLE IF NOT EXISTS "News" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "details" TEXT NOT NULL,
  "date" TIMESTAMP WITH TIME ZONE NOT NULL,
  "imageUrl" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create TeamMember Table
CREATE TABLE IF NOT EXISTS "TeamMember" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "designation" VARCHAR(255) NOT NULL,
  "details" TEXT,
  "imageUrl" TEXT,
  "instagram" VARCHAR(255),
  "linkedin" VARCHAR(255),
  "facebook" VARCHAR(255),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Alumni Table
CREATE TABLE IF NOT EXISTS "Alumni" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "gradYear" VARCHAR(50) NOT NULL,
  "company" VARCHAR(255),
  "role" VARCHAR(255),
  "imageUrl" TEXT,
  "linkedin" VARCHAR(255),
  "priority" INTEGER DEFAULT 100,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;

async function setup() {
  console.log("Connecting to PostgreSQL database...");
  await pool.query(schemaSql);
  console.log("Database schema initialized successfully.");

  // Check if admin table has entries, if not seed default admin
  const res = await pool.query('SELECT count(*) FROM "Admin";');
  const count = parseInt(res.rows[0].count, 10);
  if (count === 0) {
    console.log("No administrators found. Seeding default admin account...");
    const hashedPassword = await bcrypt.hash('admin', 10);
    await pool.query(
      'INSERT INTO "Admin" ("email", "name", "password") VALUES ($1, $2, $3);',
      ['admin', 'Admin', hashedPassword]
    );
    console.log("Admin account seeded. Default Username: 'admin' | Password: 'admin'");
  } else {
    console.log("Admin account already exists. Skipping seed.");
  }
}

setup()
  .then(async () => {
    console.log("Database setup successfully completed.");
    await pool.end();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error("Database setup failed:", err);
    await pool.end();
    process.exit(1);
  });
