const { MongoClient } = require('mongodb');
require('dotenv').config();

async function main() {
  const uri = process.env.DATABASE_URL;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const staff = await db.collection('User').findOne({ role: 'STAFF' });
    console.log("Staff:", staff);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main();
