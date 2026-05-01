import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.user.deleteMany({})
  await prisma.appointment.deleteMany({})
  console.log("Database cleared")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
