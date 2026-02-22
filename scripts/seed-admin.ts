import { Client } from 'pg';
import 'dotenv/config';
import crypto from 'crypto';

const connectionString = process.env.DATABASE_URL;

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

async function seedAdmin() {
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

    const adminEmail = 'admin@gov.uk';
    const adminPassword = hashPassword('adminpassword123');
    const adminFullName = 'Government Admin';

    // Delete existing admin to update password
    await client.query('DELETE FROM users WHERE email = $1', [adminEmail]);

    await client.query(
      "INSERT INTO users (full_name, email, password, role, date_of_birth) VALUES ($1, $2, $3, $4, $5)",
      [adminFullName, adminEmail, adminPassword, 'admin', '1970-01-01']
    );
    console.log('Admin user created successfully (hashed)');

  } catch (err) {
    console.error('Error seeding admin:', err);
  } finally {
    await client.end();
  }
}

seedAdmin();
