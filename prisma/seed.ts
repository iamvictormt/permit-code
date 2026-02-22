import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL!
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Starting seed...')
  // Clear existing data
  await prisma.document.deleteMany()
  await prisma.user.deleteMany()

  const users = [
    {
      fullName: 'John Smith',
      email: 'luuccifer1@gmail.com',
      dateOfBirth: new Date('1990-05-15'),
      documents: {
        create: [
          { type: 'passport', number: '123456789' },
          { type: 'customer_number', number: 'KX12345678' }
        ]
      }
    },
    {
      fullName: 'Maria Santos',
      email: 'maria.santos@example.com',
      dateOfBirth: new Date('1985-11-20'),
      documents: {
        create: [
          { type: 'national_id', number: '987654321' }
        ]
      }
    },
    {
      fullName: 'Charles Ferreira',
      email: 'charles.f@example.com',
      dateOfBirth: new Date('2000-04-03'),
      documents: {
        create: [
          { type: 'biometric_card', number: '523523' }
        ]
      }
    }
  ]

  for (const user of users) {
    await prisma.user.create({
      data: user
    })
    console.log(`Created user: ${user.fullName}`)
  }

  console.log('Seed completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
