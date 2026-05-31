const { MongoClient } = require("mongodb");

let client;
let db;

async function connectDb() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "dental-db";

  if (!uri) {
    throw new Error("MONGODB_URI is not set in environment");
  }

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);

  await db.command({ ping: 1 });
  console.log(`Connected to MongoDB database "${dbName}"`);

  return db;
}

function getDb() {
  if (!db) {
    throw new Error("Database not connected. Call connectDb() first.");
  }
  return db;
}

async function closeDb() {
  if (client) {
    await client.close();
    client = undefined;
    db = undefined;
    console.log("MongoDB connection closed");
  }
}

module.exports = { connectDb, getDb, closeDb };
