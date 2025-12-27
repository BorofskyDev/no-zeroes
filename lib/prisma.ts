import 'server-only'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// IMPORTANT: keep your custom generated client import
import { PrismaClient } from './generated/prisma'

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
  pool?: Pool
}

export const prisma =
  globalForPrisma.prisma ??
  (() => {
    const pool =
      globalForPrisma.pool ??
      new Pool({
        connectionString: process.env.DATABASE_URL,
      })

    const adapter = new PrismaPg(pool)

    const client = new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })

    globalForPrisma.pool = pool
    globalForPrisma.prisma = client

    return client
  })()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
