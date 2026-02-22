import { NextRequest, NextResponse } from 'next/server'
import pool, { query } from '@/lib/db'
import { isAdmin } from '@/lib/auth-server'

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const res = await query(`
      SELECT u.*, d.type as document_type, d.number as document_number
      FROM users u
      LEFT JOIN documents d ON u.id = d.user_id
      WHERE u.role = 'user'
      ORDER BY u.created_at DESC
    `)

    return NextResponse.json(res.rows)
  } catch (error) {
    console.error('Fetch users error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = await pool.connect()
  try {
    const { fullName, email, dateOfBirth, documentType, documentNumber } = await req.json()

    await client.query('BEGIN')

    const userRes = await client.query(
      `INSERT INTO users (full_name, email, date_of_birth, role, account_status)
       VALUES ($1, $2, $3, 'user', 'ACTIVE') RETURNING id`,
      [fullName, email, dateOfBirth]
    )

    const userId = userRes.rows[0].id

    await client.query(
      `INSERT INTO documents (type, number, user_id, verified, verified_at)
       VALUES ($1, $2, $3, true, CURRENT_TIMESTAMP)`,
      [documentType, documentNumber, userId]
    )

    await client.query('COMMIT')

    return NextResponse.json({ success: true, userId })
  } catch (error: any) {
    await client.query('ROLLBACK')
    console.error('Create user error:', error)
    if (error.code === '23505') {
      return NextResponse.json({ error: 'User or document already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    client.release()
  }
}
