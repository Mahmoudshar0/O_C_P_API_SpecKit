import { connectTestDb, clearDatabase, disconnectTestDb } from './mongoSingleton.js';

beforeAll(async () => {
  await connectTestDb();
}, 120000);

afterAll(async () => {
  await disconnectTestDb();
});

beforeEach(async () => {
  await clearDatabase();
});
