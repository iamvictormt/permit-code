import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ionos.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: (process.env.SMTP_SECURE || 'true') === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    // If SMTP_TLS_REJECT_UNAUTHORIZED is explicitly 'false', we set rejectUnauthorized to false
    rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== 'false',
  },
})

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

    // Send email via SMTP (skip if user/pass are missing)
    if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      console.log('Attempting to send email via SMTP...');
      console.log('SMTP Config:', {
        host: process.env.SMTP_HOST || 'smtp.ionos.com',
        port: process.env.SMTP_PORT || '465',
        secure: process.env.SMTP_SECURE || 'true',
        user: process.env.SMTP_USER,
        rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== 'false'
      });
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || 'homeoffice.gov@notifications-service.uk',
          to: user.email,
          subject: 'Your UKVI security code',
          html: `<p>Your 6-digit security code is: <strong>${code}</strong></p><p>This code will expire in 10 minutes.</p>`
        })
      } catch (error) {
        console.error('SMTP error:', error)
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
      }
    } else {
      console.log('Skipping SMTP: Credentials missing');
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Send code error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
