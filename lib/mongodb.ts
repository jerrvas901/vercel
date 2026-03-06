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
    const client = new MongoClient(mongoUri, {
      // Fail fast when Atlas/DNS/TLS is unhealthy instead of waiting ~30s per request.
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
      socketTimeoutMS: 20000,
      // Prefer IPv4 resolution on networks with broken IPv6 routes.
      family: 4,
    });

    globalForMongo.clientPromise = client.connect().catch((error) => {
      // Do not keep a permanently rejected promise; allow the next request to retry.
      globalForMongo.clientPromise = undefined;
      throw error;
    });
  }

  return globalForMongo.clientPromise;
}

export async function getDb() {
  const client = await getClientPromise();
  return client.db(dbName);
}
