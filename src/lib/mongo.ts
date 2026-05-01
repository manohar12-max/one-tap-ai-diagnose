import { MongoClient } from "mongodb"

const uri = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/one-tap-ai"
const client = new MongoClient(uri)

export async function getDb() {
  await client.connect()
  return client.db()
}

export async function closeConnection() {
  await client.close()
}
