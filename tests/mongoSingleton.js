import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer;

export async function connectTestDb() {
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-key-32chars-minimum!!';
  process.env.JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';
  process.env.NODE_ENV = 'test';

  if (!mongoServer) {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();
    globalThis.__MONGO_MEMORY_SERVER__ = mongoServer;
  }
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

export async function clearDatabase() {
  const { collections } = mongoose.connection;
  await Promise.all(Object.values(collections).map((c) => c.deleteMany({})));
}

export async function disconnectTestDb() {
  await mongoose.disconnect();
  if (globalThis.__MONGO_MEMORY_SERVER__) {
    await globalThis.__MONGO_MEMORY_SERVER__.stop();
    globalThis.__MONGO_MEMORY_SERVER__ = null;
    mongoServer = null;
  }
}
