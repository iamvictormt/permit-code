import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { userId, code } = await req.json()

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user || !user.authCode || !user.authCodeExpiresAt) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    if (user.authCode !== code) {
      return NextResponse.json({ error: 'Invalid security code' }, { status: 400 })
    }

    if (new Date() > user.authCodeExpiresAt) {
      return NextResponse.json({ error: 'Security code expired' }, { status: 400 })
    }

    // Clear the code after successful verification
    await prisma.user.update({
      where: { id: userId },
      data: {
        authCode: null,
        authCodeExpiresAt: null
      }
    })

    // In a real app, we would set a session cookie here.
    // For this task, we return success and the frontend redirects.
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName
      }
    })
  } catch (error) {
    console.error('Verify code error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
