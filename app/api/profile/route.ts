import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session_id')?.value

    if (!sessionId || sessionId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const res = await query(
      'SELECT full_name, date_of_birth, right_to_work_until, conditions, legal_basis, photo_url, created_at FROM users WHERE id = $1',
      [userId]
    )

    if (res.rowCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(res.rows[0])
  } catch (error) {
    console.error('Fetch profile error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
