import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// IMPORTANT: import from your custom generated location (NOT @prisma/client)
import { PrismaClient } from '../lib/generated/prisma/client'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg(pool)

// Prisma 7: you must pass adapter (or accelerateUrl)
const prisma = new PrismaClient({ adapter })

async function main() {
  const firebaseUid = '81Y9G6aAVibFKkhIbJ6u9zBCBqn1'
  const email = 'joelborofskydev@gmail.com'

  const user = await prisma.user.upsert({
    where: { firebaseUid },
    update: { email, role: 'SUPERUSER' },
    create: { firebaseUid, email, role: 'SUPERUSER' },
  })

  console.log('✅ Test user created:', user)
}

main()
  .catch((e) => {
    console.error('❌ Error creating test user:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
