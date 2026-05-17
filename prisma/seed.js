const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin', 10);
  
  await prisma.admin.upsert({
    where: { email: 'admin' },
    update: {
      name: 'Admin',
      password: hash
    },
    create: {
      email: 'admin',
      name: 'Admin',
      password: hash
    }
  });

  console.log("DATABASE SEEDED SUCCESSFULLY!");
  console.log("Admin Username: admin");
  console.log("Admin Password: admin");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
