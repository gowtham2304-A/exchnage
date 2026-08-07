import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('[db_test] No MONGODB_URI in environment');
  process.exit(1);
}

async function test() {
  // Force system DNS to use public resolver in case local resolver blocks SRV lookups
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
    console.log('[db_test] Overrode DNS servers to 8.8.8.8,1.1.1.1');
  } catch (e) {
    console.warn('[db_test] Could not set DNS servers:', e.message);
  }
  try {
    console.log('[db_test] Connecting to:', uri.replace(/(mongodb\+srv:\/\/).*(@.*)/, '$1****$2'));
    await mongoose.connect(uri, {
      // force IPv4 family to avoid IPv6 DNS/resolution issues
      family: 4,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 10000
    });
    console.log('[db_test] Connected to MongoDB successfully');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[db_test] Connection error:');
    console.error(err);
    process.exit(1);
  }
}

test();
