import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { documentType, documentNumber, day, month, year } = await req.json()

    // Format DOB to check (Prisma stores it as DateTime)
    // Be careful with timezones, usually better to check year/month/day components
    const dob = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))

    const document = await prisma.document.findFirst({
      where: {
        type: documentType,
        number: documentNumber,
      },
      include: {
        user: true,
      },
    })

    if (!document) {
      return NextResponse.json({ error: 'Details do not match' }, { status: 404 })
    }

    const user = document.user

    // Check if DOB matches (ignoring time)
    const userDob = new Date(user.dateOfBirth)
    const match =
      userDob.getUTCFullYear() === dob.getFullYear() &&
      userDob.getUTCMonth() === dob.getMonth() &&
      userDob.getUTCDate() === dob.getDate()

    if (!match) {
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
