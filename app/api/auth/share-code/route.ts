import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session_id')?.value

    if (!sessionId || sessionId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check for existing valid code
    const res = await query(
      'SELECT share_code, share_code_expires_at FROM users WHERE id = $1',
      [userId]
    )

    if (res.rowCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = res.rows[0]
    const now = new Date()

    if (user.share_code && user.share_code_expires_at && new Date(user.share_code_expires_at) > now) {
      return NextResponse.json({
        shareCode: user.share_code,
        expiresAt: user.share_code_expires_at
      })
    }

    // Generate new code XXX XXX XXX
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    let rawCode = ""
    for (let i = 0; i < 9; i++) {
      rawCode += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    const shareCode = `${rawCode.slice(0, 3)} ${rawCode.slice(3, 6)} ${rawCode.slice(6, 9)}`

    // Set expiry to 3 months from now
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + 3)

    await query(
      'UPDATE users SET share_code = $1, share_code_expires_at = $2, share_code_created_at = CURRENT_TIMESTAMP WHERE id = $3',
      [shareCode, expiresAt, userId]
    )

    return NextResponse.json({ shareCode, expiresAt })
  } catch (error) {
    console.error('Share code error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
