import { MongoClient } from "mongodb";

const dbName = process.env.MONGODB_DB || "portfolio";

type GlobalMongo = {
  clientPromise?: Promise<MongoClient>;
};

const globalForMongo = globalThis as typeof globalThis & GlobalMongo;

function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is missing. Add it in Vercel Project Settings > Environment Variables.",
    );
  }
  return uri;
}

function getClientPromise() {
  if (!globalForMongo.clientPromise) {
    const mongoUri = getMongoUri();
    globalForMongo.clientPromise = new MongoClient(mongoUri).connect();
  }

  return globalForMongo.clientPromise;
}

export async function getDb() {
  const client = await getClientPromise();
  return client.db(dbName);
}
