import { Client } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;

async function setup() {
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Drop existing tables if they exist (for a fresh start)
    await client.query('DROP TABLE IF EXISTS documents CASCADE');
    await client.query('DROP TABLE IF EXISTS users CASCADE');

    console.log('Creating tables...');

    // Create Users table
    await client.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        date_of_birth DATE NOT NULL,
        verification_level TEXT DEFAULT 'LOW',
        account_status TEXT DEFAULT 'ACTIVE',
        auth_code TEXT,
        auth_code_expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Documents table
    await client.query(`
      CREATE TABLE documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        type TEXT NOT NULL,
        number TEXT NOT NULL,
        verified BOOLEAN DEFAULT FALSE,
        verified_at TIMESTAMP,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE (type, number)
      )
    `);

    console.log('Tables created successfully');
  } catch (err) {
    console.error('Error setting up database:', err);
  } finally {
    await client.end();
  }
}

setup();
