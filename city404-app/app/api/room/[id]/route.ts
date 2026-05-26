import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const doc = await adminDb.collection('rooms').doc(id.toUpperCase()).get()

    if (!doc.exists) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    const data = doc.data()!
    const now = Date.now()
    const isExpired = data.expiresAt < now

    return NextResponse.json({
      clue: data.clue,
      timerSeconds: data.timerSeconds,
      maxAttempts: data.maxAttempts,
      attemptsUsed: (data.attempts ?? []).length,
      isExpired,
      isCompleted: data.isCompleted,
    })
  } catch (e: any) {
    console.error('room GET error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
