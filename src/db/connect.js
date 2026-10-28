import dns from 'node:dns';
import { MongoClient } from 'mongodb';

if (process.env.DNS_SERVERS) {
  dns.setServers(process.env.DNS_SERVERS.split(','));
}

let database;

const connectToDb = async () => {
  const connectionString = process.env.MONGODB_URI;
  if (!connectionString) {
    throw new Error('MONGODB_URI is required.');
  }

  const client = new MongoClient(connectionString);
  await client.connect();
  database = client.db(process.env.MONGODB_DB_NAME || 'practice');
  return database;
};

const getDb = () => {
  if (!database) {
    throw new Error('Database not initialized. Call connectToDb first.');
  }
  return database;
};

export { connectToDb, getDb };