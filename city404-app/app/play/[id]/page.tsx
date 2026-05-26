'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'
import { RoomMetaResponse } from '@/types'
import { pageVariants } from '@/lib/animations'

export default function PlayPage({ params }: { params: { id: string } }) {
  const [roomData, setRoomData] = useState<RoomMetaResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const { setRoomData: storeSetRoomData, setPhase } = useGameStore()

  useEffect(() => {
    async function fetchRoom() {
      try {
        const res = await fetch(`/api/room/${params.id}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Room not found')
        if (data.isExpired) throw new Error('ROOM_EXPIRED')
        if (data.isCompleted) throw new Error('ROOM_COMPLETED')
        setRoomData(data)
        storeSetRoomData(params.id, {
          id: params.id,
          clue: data.clue,
          createdAt: Date.now(),
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
          maxAttempts: data.maxAttempts,
          timerSeconds: data.timerSeconds,
          attempts: [],
          isCompleted: false,
        })
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchRoom()
  }, [params.id])

  const handleBeginHunt = () => {
    setPhase('room-select')
    router.push(`/room/${params.id}`)
  }

  if (loading) return <LoadingScreen />
  if (error) return <ErrorScreen error={error} />

  return (
    <motion.main
      className="relative min-h-screen bg-background flex flex-col items-center justify-center px-6"
      variants={pageVariants} initial="initial" animate="animate" exit="exit"
    >
      <div className="vignette fixed inset-0 pointer-events-none z-10" />

      {/* Transmission header */}
      <div className="fixed top-[40px] left-0 right-0 flex justify-center z-20">
        <p className="font-mono text-amber flex items-center gap-2" style={{ fontSize: '11px', letterSpacing: '0.15em', opacity: 0.75 }}>
          <span className="inline-block w-2 h-2 rounded-full bg-amber animate-signal-pulse" />
          INCOMING TRANSMISSION DETECTED...
        </p>
      </div>

      {/* Main panel */}
      <div className="relative z-20 w-full max-w-lg horror-panel">
        <h1 className="font-newsreader text-on-surface mb-3" style={{ fontSize: '36px', fontWeight: 600, lineHeight: 1.1 }}>
          YOU HAVE BEEN<br />SUMMONED
        </h1>
        <p className="font-geist text-on-surface-variant mb-6" style={{ lineHeight: '1.6' }}>
          A message has been hidden somewhere inside this city. Find it... if you can.
        </p>

        <div className="w-full h-px bg-outline-variant mb-6" />

        {/* Clue */}
        <p className="font-mono text-amber mb-3" style={{ fontSize: '11px', letterSpacing: '0.15em', opacity: 0.75 }}>
          CLUE:
        </p>
        <div className="border border-outline-variant p-4 mb-6" style={{ background: '#0e0e0e' }}>
          <p className="font-geist text-on-surface italic" style={{ fontSize: '18px', lineHeight: '1.6' }}>
            "{roomData?.clue}"
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-8 mb-8">
          <div className="flex items-center gap-2">
            <span className="font-mono text-amber" style={{ fontSize: '14px' }}>⏱</span>
            <span className="font-mono text-amber" style={{ fontSize: '13px', letterSpacing: '0.06em' }}>
              TIME LIMIT: {Math.floor((roomData?.timerSeconds ?? 180) / 60)}:{String((roomData?.timerSeconds ?? 180) % 60).padStart(2, '0')} MIN
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-amber" style={{ fontSize: '14px' }}>⚠</span>
            <span className="font-mono text-amber" style={{ fontSize: '13px', letterSpacing: '0.06em' }}>
              ATTEMPTS: {roomData?.maxAttempts}
            </span>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleBeginHunt}
          className="horror-btn horror-btn-primary w-full justify-center"
          style={{ padding: '16px', fontSize: '14px', letterSpacing: '0.12em' }}
          aria-label="Begin the hunt"
        >
          BEGIN THE HUNT →
        </button>
      </div>

      {/* Expiry note */}
      <p className="fixed bottom-[40px] left-0 right-0 text-center hud-text" style={{ opacity: 0.25, zIndex: 20 }}>
        This room expires in 7 days.
      </p>
    </motion.main>
  )
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="font-mono text-amber animate-signal-pulse" style={{ fontSize: '13px', letterSpacing: '0.15em' }}>
        ESTABLISHING CONNECTION...
      </p>
    </div>
  )
}

function ErrorScreen({ error }: { error: string }) {
  const router = useRouter()
  const msg = error === 'ROOM_EXPIRED'
    ? 'THIS ROOM HAS EXPIRED. THE SIGNAL IS DEAD.'
    : error === 'ROOM_COMPLETED'
    ? 'THIS ROOM HAS ALREADY BEEN SOLVED.'
    : `CONNECTION FAILED: ${error}`

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
      <div className="vignette fixed inset-0 pointer-events-none" />
      <p className="font-newsreader text-crimson text-2xl relative z-10">{msg}</p>
      <button onClick={() => router.push('/home')} className="horror-btn relative z-10">
        RETURN TO CITY
      </button>
    </div>
  )
}
