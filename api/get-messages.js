import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = "absensi";
const collectionName = "attendance";

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const results = await collection.find({}).sort({ timestamp: -1 }).toArray();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
