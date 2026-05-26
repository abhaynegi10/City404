import { NextRequest, NextResponse } from 'next/server'
import { customAlphabet } from 'nanoid'
import { adminDb } from '@/lib/firebase-admin'
import { RoomType } from '@/types'

const ROOM_TYPES: RoomType[] = ['church', 'bus', 'morgue', 'tunnel', 'hospital', 'classroom']
const nanoid = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 6)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { roomType, hiddenMessage, clue } = body

    // Validate
    if (!roomType || !ROOM_TYPES.includes(roomType)) {
      return NextResponse.json({ error: 'Invalid room type' }, { status: 400 })
    }
    if (!hiddenMessage || typeof hiddenMessage !== 'string' || hiddenMessage.length > 500) {
      return NextResponse.json({ error: 'Invalid hidden message' }, { status: 400 })
    }
    if (!clue || typeof clue !== 'string' || clue.length > 200) {
      return NextResponse.json({ error: 'Invalid clue' }, { status: 400 })
    }

    const id = nanoid()
    const now = Date.now()
    const expiresAt = now + 7 * 24 * 60 * 60 * 1000

    await adminDb.collection('rooms').doc(id).set({
      id,
      roomType,
      hiddenMessage: hiddenMessage.trim(),
      clue: clue.trim(),
      createdAt: now,
      expiresAt,
      maxAttempts: 2,
      timerSeconds: 180,
      attempts: [],
      isCompleted: false,
    })

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    return NextResponse.json({
      roomId: id,
      shareUrl: `${baseUrl}/play/${id}`,
    })
  } catch (e: any) {
    console.error('create-room error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
