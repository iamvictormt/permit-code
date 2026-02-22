import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()

    const res = await query('SELECT email FROM users WHERE id = $1', [userId])

    if (res.rowCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = res.rows[0]

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await query(
      'UPDATE users SET auth_code = $1, auth_code_expires_at = $2 WHERE id = $3',
      [code, expiresAt, userId]
    )

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: user.email,
      subject: 'Your UKVI security code',
      html: `<p>Your 6-digit security code is: <strong>${code}</strong></p><p>This code will expire in 10 minutes.</p>`
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Send code error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
