import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is required')
}

const globalForPg = globalThis as typeof globalThis & {
  pgPool?: Pool
}

const pool =
  globalForPg.pgPool ??
  new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPg.pgPool = pool
}

export const db = drizzle({ client: pool, schema })
