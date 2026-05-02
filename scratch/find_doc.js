const { MongoClient } = require('mongodb');
require('dotenv').config();

async function main() {
  const uri = process.env.DATABASE_URL;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const doc = await db.collection('User').findOne({ role: 'DOCTOR' });
    console.log("Doctor:", doc);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main();
