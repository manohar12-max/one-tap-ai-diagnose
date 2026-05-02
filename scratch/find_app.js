const { MongoClient } = require('mongodb');
require('dotenv').config();

async function main() {
  const uri = process.env.DATABASE_URL;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const app = await db.collection('Appointment').findOne({});
    console.log("Appointment:", app);
    
    const user = await db.collection('User').findOne({ _id: app.patientId });
    console.log("Patient:", user);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main();
