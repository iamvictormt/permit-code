import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { userId, code } = await req.json()

    const res = await query(
      'SELECT id, email, full_name, auth_code, auth_code_expires_at FROM users WHERE id = $1',
      [userId]
    )

    if (res.rowCount === 0) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const user = res.rows[0]

    if (!user.auth_code || !user.auth_code_expires_at) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    if (user.auth_code !== code) {
      return NextResponse.json({ error: 'Invalid security code' }, { status: 400 })
    }

    if (new Date() > new Date(user.auth_code_expires_at)) {
      return NextResponse.json({ error: 'Security code expired' }, { status: 400 })
    }

    // Clear the code after successful verification
    await query(
      'UPDATE users SET auth_code = NULL, auth_code_expires_at = NULL WHERE id = $1',
      [userId]
    )

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name
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
    console.error('Verify code error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
