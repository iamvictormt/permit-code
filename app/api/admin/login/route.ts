import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { cookies } from 'next/headers'
import crypto from 'crypto'

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    const hashedPassword = hashPassword(password)

    const res = await query(
      'SELECT id, email, full_name, role FROM users WHERE email = $1 AND password = $2 AND role = $3',
      [email, hashedPassword, 'admin']
    )

    if (res.rowCount === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const user = res.rows[0]

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role
      }
    })

    const cookieStore = await cookies()
    cookieStore.set('session_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    })

    return response
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
