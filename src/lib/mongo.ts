import { MongoClient, Db } from "mongodb"

const uri = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/one-tap-ai"
const client = new MongoClient(uri)

let cachedDb: Db | null = null

export async function getDb() {
  if (cachedDb) return cachedDb
  
  await client.connect()
  cachedDb = client.db()
  return cachedDb
}

export async function closeConnection() {
  await client.close()
  cachedDb = null
}
