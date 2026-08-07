import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

// Ensure .env values are loaded when this module is used directly (seed scripts etc.).
dotenv.config();

export async function connectDb() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.log('[DB] No MONGODB_URI provided — running in in-memory demo mode.');
    return null;
  }

  // Some environments have DNS resolvers that block SRV lookups required by
  // the mongodb+srv connection strings. Override to well-known public DNS
  // servers as a fallback to allow SRV resolution.
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
    console.log('[DB] Overrode DNS servers to 8.8.8.8 and 1.1.1.1 for SRV resolution');
  } catch (e) {
    console.warn('[DB] Could not override DNS servers:', e.message);
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DBNAME || undefined,
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    });
    console.log('[DB] Connected to MongoDB Atlas');
    return mongoose;
  } catch (err) {
    console.error('[DB] MongoDB connection error:', err.message);
    return null;
  }
}

export default mongoose;
