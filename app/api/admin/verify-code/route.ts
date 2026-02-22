import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { isAdmin } from '@/lib/auth-server'

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { shareCode } = await req.json()

    if (!shareCode) {
      return NextResponse.json({ error: 'Share code is required' }, { status: 400 })
    }

    // Normalized share code (remove spaces)
    const normalizedInput = shareCode.replace(/\s/g, '').toUpperCase()

    const res = await query(`
      SELECT full_name, photo_url, share_code, share_code_expires_at, share_code_created_at, account_status
      FROM users
      WHERE REPLACE(share_code, ' ', '') = $1
    `, [normalizedInput])

    if (res.rowCount === 0) {
      return NextResponse.json({ valid: false, message: 'Code not found' })
    }

    const user = res.rows[0]
    const now = new Date()
    const expiresAt = new Date(user.share_code_expires_at)
    const createdAt = user.share_code_created_at ? new Date(user.share_code_created_at) : null

    // Check expiration
    if (now > expiresAt) {
      return NextResponse.json({ valid: false, message: 'Code expired' })
    }

    // Check 3-month rule explicitly if createdAt exists
    if (createdAt) {
      const threeMonthsAgo = new Date()
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
      if (createdAt < threeMonthsAgo) {
        return NextResponse.json({ valid: false, message: 'Code is older than 3 months' })
      }
    }

    if (user.account_status !== 'ACTIVE') {
      return NextResponse.json({ valid: false, message: 'User account is not active' })
    }

    return NextResponse.json({
      valid: true,
      user: {
        fullName: user.full_name,
        photoUrl: user.photo_url
      }
    })
  } catch (error) {
    console.error('Verify share code error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
