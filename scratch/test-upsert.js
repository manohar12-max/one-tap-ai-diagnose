const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const user = await prisma.user.upsert({
      where: { email: "test_upsert@example.com" },
      update: {},
      create: {
        email: "test_upsert@example.com",
        mobile: "0000000000",
        password: "password123",
        name: "Test Upsert",
        role: "PATIENT",
      },
    });
    console.log("Upsert Success:", user.id);
  } catch (e) {
    console.error("Upsert Failed:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
