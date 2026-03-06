import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "portfolio";

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable");
}

const mongoUri: string = uri;

type GlobalMongo = {
  clientPromise?: Promise<MongoClient>;
};

const globalForMongo = globalThis as typeof globalThis & GlobalMongo;

function getClientPromise() {
  if (!globalForMongo.clientPromise) {
    globalForMongo.clientPromise = new MongoClient(mongoUri).connect();
  }

  return globalForMongo.clientPromise;
}

export async function getDb() {
  const client = await getClientPromise();
  return client.db(dbName);
}
