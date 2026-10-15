import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise

if (!uri) {
  // During build time or when MONGODB_URI is not set, do not crash module import.
  // We provide a promise that will reject if actually awaited at runtime.
  clientPromise = Promise.reject(new Error("Please define the MONGODB_URI environment variable in .env.local or Vercel dashboard."))
  clientPromise.catch(() => {})
} else {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options)
      global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
  } else {
    // Cache client in production serverless environments to avoid connection pool exhaustion
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options)
      global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
  }
}

export async function getDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined.")
  }
  const client = await clientPromise
  return client.db("streamflow")
}

export default clientPromise

