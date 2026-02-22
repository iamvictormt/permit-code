import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { cookies } from 'next/headers'
import { isAdmin } from '@/lib/auth-server'

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session_id')?.value

    const res = await query('SELECT id, email, full_name, role FROM users WHERE id = $1', [sessionId])

    const user = res.rows[0]

    return NextResponse.json({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role
    })
  } catch (error) {
    console.error('Me API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
