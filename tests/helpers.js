let seq = 0;

/** Unique email for isolated tests (avoids ObjectId() constructor pitfalls in ESM). */
export function uniqueEmail(prefix = 'user') {
  seq += 1;
  return `${prefix}-${Date.now()}-${seq}@test.com`;
}
