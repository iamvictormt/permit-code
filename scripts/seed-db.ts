import { Client } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;

async function seed() {
  if (!connectionString) {
    console.error('Error: DATABASE_URL is not defined in .env file');
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();
    console.log('Connected to database');

    const users = [
      {
        documentNumber: '123456789',
        fullName: 'VANILDO CARLOS JUSTINO FERNANDES',
        email: 'vanildo@example.com',
        dateOfBirth: '1985-01-01',
        rightToWorkUntil: '2030-03-28',
        conditions: 'You can work in any job.',
        legalBasis: 'EU Settlement Scheme - Pre-settled status',
        photoUrl: '/vanildo.jpg',
        documents: [
          { type: 'passport', number: '123456789' }
        ]
      },
      {
        documentNumber: '987654321',
        fullName: 'John Smith',
        email: 'john.smith@example.com',
        dateOfBirth: '1990-05-15',
        rightToWorkUntil: '2025-12-31',
        conditions: 'You can work in any job.',
        legalBasis: 'British Citizen',
        photoUrl: '/placeholder.svg?height=120&width=100',
        documents: [
          { type: 'passport', number: '987654321' }
        ]
      }
    ];

    for (const user of users) {
      const userRes = await client.query(
        'INSERT INTO users (document_number, full_name, email, date_of_birth, right_to_work_until, conditions, legal_basis, photo_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
        [user.documentNumber, user.fullName, user.email, user.dateOfBirth, user.rightToWorkUntil, user.conditions, user.legalBasis, user.photoUrl]
      );

      const userId = userRes.rows[0].id;

      for (const doc of user.documents) {
        await client.query(
          'INSERT INTO documents (type, number, user_id) VALUES ($1, $2, $3)',
          [doc.type, doc.number, userId]
        );
      }

      console.log(`Seeded user: ${user.fullName}`);
    }

    console.log('Seed completed successfully');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await client.end();
  }
}

seed();
