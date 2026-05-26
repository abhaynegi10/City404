import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function POST(req: NextRequest) {
  try {
    const { roomId, sessionId } = await req.json()

    if (!roomId || !sessionId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const ref = adminDb.collection('rooms').doc(roomId.toUpperCase())
    const doc = await ref.get()

    if (!doc.exists) return NextResponse.json({ error: 'Room not found' }, { status: 404 })

    const data = doc.data()!

    // Verify session had a correct attempt
    const hadCorrect = (data.attempts ?? []).some(
      (a: any) => a.sessionId === sessionId && a.correct
    )
    if (!hadCorrect) {
      return NextResponse.json({ error: 'No successful attempt on record' }, { status: 403 })
    }

    await ref.update({ isCompleted: true, completedAt: Date.now() })

    return NextResponse.json({ hiddenMessage: data.hiddenMessage })
  } catch (e: any) {
    console.error('complete error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
