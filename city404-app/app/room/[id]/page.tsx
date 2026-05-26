'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ROOMS } from '@/lib/rooms'
import { RoomType, Hotspot } from '@/types'
import { useGameStore } from '@/store/gameStore'
import { pageVariants } from '@/lib/animations'

export default function RoomPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const {
    phase, selectedRoom, currentAttempt, timeRemaining,
    sessionId, roomId, roomData,
    setPhase, selectRoom, decrementAttempt, startTimer, stopTimer,
  } = useGameStore()

  const [wrongFlash, setWrongFlash] = useState(false)
  const [clickedHotspot, setClickedHotspot] = useState<string | null>(null)
  const [revealMessage, setRevealMessage] = useState('')
  const [showReveal, setShowReveal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Redirect if no game state
  useEffect(() => {
    if (!roomId) router.push('/home')
  }, [roomId])

  // Start timer when entering room-explore phase
  useEffect(() => {
    if (phase === 'room-explore') startTimer()
    return () => {}
  }, [phase])

  // Watch for time/attempt failure
  useEffect(() => {
    if (phase === 'failure') {
      stopTimer()
      router.push('/failure')
    }
    if (phase === 'success') {
      stopTimer()
    }
  }, [phase])

  const handleRoomSelect = async (roomType: RoomType) => {
    if (submitting) return
    setSubmitting(true)
    selectRoom(roomType)

    try {
      const res = await fetch('/api/attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: params.id, guessedRoom: roomType, sessionId }),
      })
      const data = await res.json()

      if (data.correct) {
        setPhase('room-explore')
      } else {
        setWrongFlash(true)
        setTimeout(() => setWrongFlash(false), 600)
        decrementAttempt()
      }
    } catch {
      decrementAttempt()
    } finally {
      setSubmitting(false)
    }
  }

  const handleHotspotClick = async (hotspot: Hotspot) => {
    if (hotspot.isMessageLocation) {
      setClickedHotspot(hotspot.id)
      try {
        const res = await fetch('/api/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomId: params.id, sessionId }),
        })
        const data = await res.json()
        stopTimer()
        setRevealMessage(data.hiddenMessage)
        setShowReveal(true)
        setPhase('success')
      } catch {
        setPhase('success')
        setShowReveal(true)
      }
    } else {
      setClickedHotspot(hotspot.id)
      setTimeout(() => setClickedHotspot(null), 500)
    }
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  const timerClass = timeRemaining > 60 ? 'timer-normal' : timeRemaining > 30 ? 'timer-warning' : 'timer-critical'

  const correctRoom = phase === 'room-explore' ? ROOMS.find(r => r.id === selectedRoom) : null

  return (
    <motion.main
      className="relative min-h-screen bg-background overflow-hidden"
      variants={pageVariants} initial="initial" animate="animate" exit="exit"
    >
      {/* ── TOP HUD ── */}
      <div
        className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-[40px] py-4"
        style={{ borderBottom: '1px solid rgba(76,69,70,0.4)', background: 'rgba(13,13,13,0.85)', backdropFilter: 'blur(8px)' }}
      >
        {/* Attempt dots */}
        <div className="flex items-center gap-3">
          <span className="hud-text" style={{ opacity: 0.5 }}>ATTEMPTS</span>
          <div className="flex gap-1.5">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} className="font-mono" style={{ fontSize: '16px', color: i < currentAttempt ? '#920703' : '#4c4546' }}>
                {i < currentAttempt ? '●' : '○'}
              </span>
            ))}
          </div>
        </div>

        {/* Phase label */}
        <span className="hud-text" style={{ opacity: 0.4 }}>
          {phase === 'room-select' ? 'ROOM IDENTIFICATION PROTOCOL' : correctRoom?.name.toUpperCase()}
        </span>

        {/* Timer */}
        {phase === 'room-explore' && (
          <div className="flex flex-col items-end">
            <span className={`font-mono ${timerClass}`} style={{ fontSize: '22px', letterSpacing: '0.05em', fontWeight: 700 }}>
              {formatTime(timeRemaining)}
            </span>
            <div className="w-24 h-px mt-1" style={{ background: `rgba(146,7,3,${1 - timeRemaining / 180})` }} />
          </div>
        )}
        {phase === 'room-select' && (
          <span className="font-mono text-on-surface-variant" style={{ fontSize: '13px', opacity: 0.5 }}>
            IDENTIFY THE ROOM
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">

        {/* ── PHASE: Room Selection ── */}
        {phase === 'room-select' && (
          <motion.div
            key="select"
            className="relative z-20 pt-24 pb-8 px-[40px] min-h-screen flex flex-col"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            {/* Wrong flash overlay */}
            <AnimatePresence>
              {wrongFlash && (
                <motion.div
                  className="fixed inset-0 z-40 pointer-events-none"
                  style={{ background: 'rgba(146,7,3,0.25)' }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                />
              )}
            </AnimatePresence>

            {/* Warning */}
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-amber animate-blink" style={{ fontSize: '11px', letterSpacing: '0.12em' }}>
                ⚠ WARNING: WRONG SELECTION COSTS 1 ATTEMPT
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
              {ROOMS.map((room) => (
                <button
                  key={room.id}
                  onClick={() => !submitting && handleRoomSelect(room.id)}
                  disabled={submitting}
                  className="room-card group text-left focus:outline-none"
                  aria-label={`Select ${room.name}`}
                >
                  <Image
                    src={room.imagePath} alt={room.name} fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div className="scan-sweep" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="font-mono text-amber" style={{ fontSize: '12px', letterSpacing: '0.08em' }}>
                      {room.name.toUpperCase()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── PHASE: Room Exploration ── */}
        {phase === 'room-explore' && correctRoom && (
          <motion.div
            key="explore"
            className="relative w-full min-h-screen"
            style={{ cursor: 'crosshair' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Room image */}
            <Image
              src={correctRoom.imagePath} alt={correctRoom.name} fill
              className="object-cover" priority
              sizes="100vw"
            />
            {/* Vignette */}
            <div className="vignette absolute inset-0" />

            {/* Hotspots */}
            {correctRoom.hotspots.map((hotspot) => (
              <button
                key={hotspot.id}
                onClick={() => handleHotspotClick(hotspot)}
                className={`hotspot absolute focus:outline-none ${clickedHotspot === hotspot.id && hotspot.isMessageLocation ? 'hotspot-success' : ''}`}
                style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                title={hotspot.label}
                aria-label={`Examine ${hotspot.label}`}
              >
                <div className={`hotspot-dot ${clickedHotspot === hotspot.id && !hotspot.isMessageLocation ? 'bg-crimson' : ''}`} />
              </button>
            ))}

            {/* Clue strip bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 z-20 horror-panel flex items-center justify-between"
              style={{ borderLeft: 'none', borderTop: '1px solid #920703' }}
            >
              <div>
                <p className="font-mono text-amber mb-1" style={{ fontSize: '11px', letterSpacing: '0.15em', opacity: 0.75 }}>
                  RECEIVED TRANSMISSION
                </p>
                <p className="font-geist text-on-surface italic" style={{ fontSize: '15px' }}>
                  "{roomData?.clue}"
                </p>
              </div>
              <div className="font-mono text-outline-variant text-xs ml-6 flex-shrink-0">
                ◈ CLUE
              </div>
            </div>

            {/* Success reveal modal */}
            <AnimatePresence>
              {showReveal && (
                <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center p-6"
                  style={{ background: 'rgba(0,0,0,0.85)' }}
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }}
                  exit={{ opacity: 0, scale: 0.96, y: 12, transition: { duration: 0.2 } }}
                >
                  <div className="horror-panel w-full max-w-lg" style={{ borderColor: '#4ade80' }}>
                    <p className="font-mono text-amber mb-4" style={{ fontSize: '11px', letterSpacing: '0.15em', opacity: 0.75 }}>
                      TRANSMISSION RECOVERED
                    </p>
                    <p className="font-newsreader text-on-surface italic mb-6" style={{ fontSize: '24px', lineHeight: 1.4 }}>
                      "{revealMessage}"
                    </p>
                    <div className="w-full h-px bg-outline-variant mb-4" />
                    <div className="flex justify-between items-center">
                      <p className="font-mono text-on-surface-variant" style={{ fontSize: '11px', opacity: 0.5 }}>
                        SIGNAL RESTORED. GOOD WORK, SURVIVOR.
                      </p>
                      <button
                        onClick={() => router.push('/success')}
                        className="horror-btn"
                        style={{ borderColor: '#4ade80', color: '#4ade80' }}
                        aria-label="Return to city"
                      >
                        RETURN TO CITY
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.main>
  )
}
