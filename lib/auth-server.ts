import { cookies } from 'next/headers'
import { query } from '@/lib/db'

export async function isAdmin() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session_id')?.value

  if (!sessionId) return false

  try {
    const res = await query('SELECT role FROM users WHERE id = $1', [sessionId])
    return res.rowCount && res.rowCount > 0 && res.rows[0].role === 'admin'
  } catch (error) {
    console.error('isAdmin check error:', error)
    return false
  }
}
