const { MongoClient } = require('mongodb');
require('dotenv').config();

async function main() {
  const uri = process.env.DATABASE_URL;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const messages = await db.collection('AppointmentMessage').find().sort({createdAt: -1}).limit(5).toArray();
    console.log("Recent Messages:", messages.map(m => ({
      senderId: m.senderId,
      content: m.content,
      appointmentId: m.appointmentId
    })));
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main();
