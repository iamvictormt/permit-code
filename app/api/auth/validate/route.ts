import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { documentType, documentNumber, day, month, year } = await req.json()

    // Format DOB string to match PostgreSQL DATE format (YYYY-MM-DD)
    const formattedDob = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`

    // Join users and documents to validate
    const res = await query(`
      SELECT u.id, u.email, u.date_of_birth
      FROM users u
      JOIN documents d ON u.id = d.user_id
      WHERE d.type = $1 AND d.number = $2
    `, [documentType, documentNumber])

    if (res.rowCount === 0) {
      return NextResponse.json({ error: 'Details do not match' }, { status: 404 })
    }

    const user = res.rows[0]

    // Check if DOB matches
    // Note: user.date_of_birth from pg might be a Date object or string depending on driver config
    const dbDob = new Date(user.date_of_birth)
    const inputDob = new Date(formattedDob)

    if (dbDob.toISOString().split('T')[0] !== inputDob.toISOString().split('T')[0]) {
      return NextResponse.json({ error: 'Details do not match' }, { status: 404 })
    }

    // Mask email
    const [name, domain] = user.email.split('@')
    let maskedName = name;
    if (name.length > 2) {
      maskedName = name[0] + '*'.repeat(name.length - 2) + name[name.length - 1]
    } else if (name.length === 2) {
      maskedName = name[0] + '*'
    } else {
      maskedName = '*'
    }
    const maskedEmail = `${maskedName}@${domain}`

    return NextResponse.json({
      success: true,
      maskedEmail,
      userId: user.id
    })
  } catch (error) {
    console.error('Validation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
