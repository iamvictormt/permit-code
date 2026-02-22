import { Client } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;

async function seed() {
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
        fullName: 'John Smith',
        email: 'luuccifer1@gmail.com',
        dateOfBirth: '1990-05-15',
        documents: [
          { type: 'passport', number: '123456789' },
          { type: 'customer_number', number: 'KX12345678' }
        ]
      },
      {
        fullName: 'Maria Santos',
        email: 'maria.santos@example.com',
        dateOfBirth: '1985-11-20',
        documents: [
          { type: 'national_id', number: '987654321' }
        ]
      },
      {
        fullName: 'Charles Ferreira',
        email: 'charles.f@example.com',
        dateOfBirth: '2000-04-03',
        documents: [
          { type: 'biometric_card', number: '523523' }
        ]
      }
    ];

    for (const user of users) {
      const userRes = await client.query(
        'INSERT INTO users (full_name, email, date_of_birth) VALUES ($1, $2, $3) RETURNING id',
        [user.fullName, user.email, user.dateOfBirth]
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
