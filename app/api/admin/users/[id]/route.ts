import { NextRequest, NextResponse } from 'next/server'
import pool, { query } from '@/lib/db'
import { isAdmin } from '@/lib/auth-server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = await pool.connect()
  try {
    const { id } = await params
    const body = await req.json()

    // If only updating status
    if (Object.keys(body).length === 1 && body.account_status) {
      await query(
        'UPDATE users SET account_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [body.account_status, id]
      )
      return NextResponse.json({ success: true })
    }

    // Full update
    const { fullName, email, dateOfBirth, documentType, documentNumber } = body

    await client.query('BEGIN')

    await client.query(
      `UPDATE users
       SET full_name = $1, email = $2, date_of_birth = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4`,
      [fullName, email, dateOfBirth, id]
    )

    // Check if document exists for this user
    const docCheck = await client.query('SELECT id FROM documents WHERE user_id = $1', [id])

    if (docCheck.rowCount && docCheck.rowCount > 0) {
      await client.query(
        `UPDATE documents SET type = $1, number = $2 WHERE user_id = $3`,
        [documentType, documentNumber, id]
      )
    } else {
      await client.query(
        `INSERT INTO documents (type, number, user_id, verified, verified_at)
         VALUES ($1, $2, $3, true, CURRENT_TIMESTAMP)`,
        [documentType, documentNumber, id]
      )
    }

    await client.query('COMMIT')
    return NextResponse.json({ success: true })
  } catch (error: any) {
    await client.query('ROLLBACK')
    console.error('Update user error:', error)
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Email or document already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    client.release()
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    await query('DELETE FROM users WHERE id = $1', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
