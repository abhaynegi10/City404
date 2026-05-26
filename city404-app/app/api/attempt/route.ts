import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

export async function POST(req: NextRequest) {
  try {
    const { roomId, guessedRoom, sessionId } = await req.json()

    if (!roomId || !guessedRoom || !sessionId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const ref = adminDb.collection('rooms').doc(roomId.toUpperCase())
    const doc = await ref.get()

    if (!doc.exists) return NextResponse.json({ error: 'Room not found' }, { status: 404 })

    const data = doc.data()!
    const now = Date.now()

    if (data.expiresAt < now) {
      return NextResponse.json({ error: 'Room expired' }, { status: 410 })
    }
    if (data.isCompleted) {
      return NextResponse.json({ error: 'Room already completed' }, { status: 409 })
    }

    // Count attempts for this session
    const sessionAttempts = (data.attempts ?? []).filter((a: any) => a.sessionId === sessionId)
    if (sessionAttempts.length >= data.maxAttempts) {
      return NextResponse.json({ correct: false, attemptsRemaining: 0, failed: true })
    }

    const correct = guessedRoom === data.roomType
    const attemptRecord = {
      attemptNumber: sessionAttempts.length + 1,
      roomGuessed: guessedRoom,
      correct,
      timestamp: now,
      sessionId,
    }

    await ref.update({ attempts: FieldValue.arrayUnion(attemptRecord) })

    const attemptsRemaining = data.maxAttempts - sessionAttempts.length - 1
    const failed = !correct && attemptsRemaining <= 0

    return NextResponse.json({ correct, attemptsRemaining, failed })
  } catch (e: any) {
    console.error('attempt error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
