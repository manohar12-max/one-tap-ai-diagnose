const dbName = "one-tap-ai";
const conn = new Mongo();
const db = conn.getDB(dbName);

console.log("Seeding database: " + dbName);

db.User.deleteMany({});
db.Appointment.deleteMany({});

const patient1Id = ObjectId();
db.User.insertOne({
  _id: patient1Id,
  email: "john.doe@example.com",
  name: "John Doe",
  role: "PATIENT",
  createdAt: new Date()
});

const patient2Id = ObjectId();
db.User.insertOne({
  _id: patient2Id,
  email: "jane.smith@example.com",
  name: "Jane Smith",
  role: "PATIENT",
  createdAt: new Date()
});

db.User.insertOne({
  email: "dr.house@hospital.com",
  name: "Dr. Gregory House",
  role: "DOCTOR",
  specialty: "Diagnostic Medicine",
  createdAt: new Date()
});

db.Appointment.insertOne({
  patientId: patient1Id,
  symptoms: "Sharp chest pain for 2 hours, radiating to arm.",
  aiDiagnosis: JSON.stringify({
    severity: "CRITICAL",
    specialty: "Cardiology",
    summary: "Potential Heart Attack.",
    explanation: "Clinical signs suggest immediate cardiac evaluation.",
    nextSteps: ["Call Emergency Services", "Chew Aspirin", "Stay seated"]
  }),
  severity: "CRITICAL",
  status: "PENDING",
  createdAt: new Date()
});

db.Appointment.insertOne({
  patientId: patient2Id,
  symptoms: "Mild cough and sore throat for 3 days.",
  aiDiagnosis: JSON.stringify({
    severity: "LOW",
    specialty: "General Medicine",
    summary: "Common Cold.",
    explanation: "Symptoms are consistent with a viral upper respiratory infection.",
    nextSteps: ["Rest", "Hydration", "Monitor temperature"]
  }),
  severity: "LOW",
  status: "PENDING",
  createdAt: new Date()
});

console.log("✅ Database seeded successfully via mongosh!");
