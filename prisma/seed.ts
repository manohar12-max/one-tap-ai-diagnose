import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database (Standalone Friendly)...")
  
  const patient1 = await prisma.user.upsert({
    where: { email: "john.doe@example.com" },
    update: {},
    create: {
      email: "john.doe@example.com",
      name: "John Doe",
      role: "PATIENT",
    },
  })

  const patient2 = await prisma.user.upsert({
    where: { email: "jane.smith@example.com" },
    update: {},
    create: {
      email: "jane.smith@example.com",
      name: "Jane Smith",
      role: "PATIENT",
    },
  })

  const count = await prisma.appointment.count()
  if (count === 0) {
    await prisma.appointment.create({
      data: {
        patientId: patient1.id,
        symptoms: "I have had a sharp pain in my upper left chest for 2 hours, radiating to my arm.",
        aiDiagnosis: JSON.stringify({
          severity: "CRITICAL",
          specialty: "Cardiology",
          summary: "Potential Myocardial Infarction (Heart Attack).",
        }),
        severity: "CRITICAL",
        status: "PENDING",
      },
    })

    await prisma.appointment.create({
      data: {
        patientId: patient2.id,
        symptoms: "Mild cough and sore throat for 3 days. No fever.",
        aiDiagnosis: JSON.stringify({
          severity: "LOW",
          specialty: "General Medicine",
          summary: "Likely Common Cold.",
        }),
        severity: "LOW",
        status: "PENDING",
      },
    })
  }

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
