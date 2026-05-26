'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ROOMS } from '@/lib/rooms'
import { RoomType } from '@/types'
import { pageVariants } from '@/lib/animations'

type Step = 1 | 2 | 3

export default function CreatePage() {
  const [step, setStep] = useState<Step>(1)
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null)
  const [message, setMessage] = useState('')
  const [clue, setClue] = useState('')
  const [loading, setLoading] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [roomId, setRoomId] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleStep1Next = () => {
    if (!selectedRoom) return
    setStep(2)
  }

  const handleStep2Next = async () => {
    if (!message.trim() || !clue.trim()) {
      setError('Both fields are required.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/create-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomType: selectedRoom, hiddenMessage: message, clue }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create room')
      setShareUrl(data.shareUrl)
      setRoomId(data.roomId)
      setStep(3)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const selectedRoomData = ROOMS.find(r => r.id === selectedRoom)

  const STEP_LABELS = ['01 — SELECT ROOM', '02 — CRAFT MESSAGE', '03 — DEPLOY LINK']

  return (
    <motion.main
      className="relative min-h-screen bg-background flex flex-col"
      variants={pageVariants} initial="initial" animate="animate" exit="exit"
    >
      <div className="vignette fixed inset-0 pointer-events-none z-10" />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-[40px] pt-[40px] pb-6 border-b border-outline-variant">
        <div className="flex items-center gap-6">
          {STEP_LABELS.map((label, i) => (
            <span
              key={label}
              className="font-mono"
              style={{
                fontSize: '11px',
                letterSpacing: '0.12em',
                color: step === i + 1 ? '#e6c429' : step > i + 1 ? '#4c4546' : '#4c4546',
                textDecoration: step > i + 1 ? 'line-through' : 'none',
                opacity: step === i + 1 ? 1 : 0.5,
              }}
            >
              {label}{step > i + 1 ? ' ✓' : step === i + 1 ? ' _' : ''}
            </span>
          ))}
        </div>
        <button onClick={() => router.push('/home')} className="hud-text hover:text-on-surface transition-colors">
          ← BACK
        </button>
      </header>

      <AnimatePresence mode="wait">

        {/* ── STEP 1: Room Selection ── */}
        {step === 1 && (
          <motion.div
            key="step1"
            className="relative z-20 flex-1 flex flex-col px-[40px] py-8"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35 }}
          >
            <p className="font-mono text-amber mb-6" style={{ fontSize: '11px', letterSpacing: '0.2em', opacity: 0.75 }}>
              CHOOSE YOUR HUNTING GROUND
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
              {ROOMS.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room.id)}
                  className={`room-card group text-left focus:outline-none ${selectedRoom === room.id ? 'selected' : ''}`}
                  aria-label={`Select ${room.name}`}
                  aria-pressed={selectedRoom === room.id}
                >
                  <Image
                    src={room.imagePath}
                    alt={room.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  {/* Scan sweep */}
                  <div className="scan-sweep" />
                  {/* Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  {/* Selected check */}
                  {selectedRoom === room.id && (
                    <div className="absolute top-2 right-2 font-mono text-amber text-sm">✓</div>
                  )}
                  {/* Bracket corners on selected */}
                  {selectedRoom === room.id && (
                    <>
                      <span className="absolute top-1 left-1 text-crimson font-mono text-xs">┌</span>
                      <span className="absolute top-1 right-1 text-crimson font-mono text-xs">┐</span>
                      <span className="absolute bottom-1 left-1 text-crimson font-mono text-xs">└</span>
                      <span className="absolute bottom-1 right-1 text-crimson font-mono text-xs">┘</span>
                    </>
                  )}
                  {/* Room label */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="font-mono text-amber" style={{ fontSize: '12px', letterSpacing: '0.08em' }}>
                      {room.name.toUpperCase()}
                    </p>
                    <p className="font-geist text-on-surface-variant text-xs mt-0.5 opacity-60 line-clamp-1">
                      {room.ambiance}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Hint */}
            <p className="font-mono mt-4 text-on-surface-variant" style={{ fontSize: '12px', opacity: 0.45 }}>
              Your victim will search every corner of this room to find your message.
            </p>

            {/* Next */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleStep1Next}
                disabled={!selectedRoom}
                className="horror-btn horror-btn-primary"
                aria-label="Next step"
              >
                NEXT →
              </button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 2: Craft Message ── */}
        {step === 2 && (
          <motion.div
            key="step2"
            className="relative z-20 flex-1 flex flex-col items-center justify-center px-[40px] py-8"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35 }}
          >
            <div className="w-full max-w-xl horror-panel">
              <p className="font-mono text-amber mb-8" style={{ fontSize: '11px', letterSpacing: '0.2em', opacity: 0.75 }}>
                TRANSMISSION PARAMETERS
              </p>

              {/* Hidden message */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="message" className="font-mono text-amber" style={{ fontSize: '11px', letterSpacing: '0.12em' }}>
                    HIDDEN MESSAGE
                  </label>
                  <span className="font-mono text-outline-variant" style={{ fontSize: '11px' }}>
                    {message.length}/500
                  </span>
                </div>
                <textarea
                  id="message"
                  value={message}
                  onChange={e => setMessage(e.target.value.slice(0, 500))}
                  placeholder="> Type the message you want to bury here..."
                  rows={4}
                  className="terminal-input resize-none font-geist"
                  style={{ borderBottom: '1px solid #4c4546', paddingBottom: '8px' }}
                  aria-label="Hidden message"
                />
              </div>

              <div className="w-full h-px bg-outline-variant mb-8" />

              {/* Clue */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="clue" className="font-mono text-amber" style={{ fontSize: '11px', letterSpacing: '0.12em' }}>
                    CLUE / HINT FOR VICTIM
                  </label>
                  <span className="font-mono text-outline-variant" style={{ fontSize: '11px' }}>
                    {clue.length}/200
                  </span>
                </div>
                <input
                  id="clue"
                  type="text"
                  value={clue}
                  onChange={e => setClue(e.target.value.slice(0, 200))}
                  placeholder="> Give them a fighting chance... or don't."
                  className="terminal-input font-geist"
                  aria-label="Clue for the player"
                />
              </div>

              {/* Locked settings */}
              <div className="flex gap-6 pt-4 border-t border-outline-variant">
                <p className="font-mono text-amber opacity-50" style={{ fontSize: '12px' }}>⏱ TIMER: 3:00 MINUTES [FIXED]</p>
                <p className="font-mono text-amber opacity-50" style={{ fontSize: '12px' }}>⚠ ATTEMPTS: 2 [FIXED]</p>
              </div>

              {error && (
                <p className="font-mono mt-4" style={{ fontSize: '11px', color: '#920703' }}>⚠ {error}</p>
              )}
            </div>

            {/* Navigation */}
            <div className="w-full max-w-xl flex justify-between mt-6">
              <button onClick={() => setStep(1)} className="horror-btn" aria-label="Go back">← BACK</button>
              <button
                onClick={handleStep2Next}
                disabled={loading || !message.trim() || !clue.trim()}
                className="horror-btn horror-btn-primary"
                aria-label="Deploy room"
              >
                {loading ? 'ENCODING...' : 'DEPLOY →'}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 3: Share Link ── */}
        {step === 3 && (
          <motion.div
            key="step3"
            className="relative z-20 flex-1 flex flex-col items-center justify-center px-[40px] py-8"
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-full max-w-xl horror-panel" style={{ borderTop: '1px solid #920703', borderLeft: '2px solid #920703' }}>
              <h2 className="font-newsreader text-on-surface mb-2" style={{ fontSize: '36px', fontWeight: 600 }}>
                ROOM ACTIVATED
              </h2>
              <p className="font-geist text-on-surface-variant mb-8">
                Your hunting ground is live. Send the link. Wait for them to enter.
              </p>

              {/* Link box */}
              <div className="flex items-center gap-3 border border-outline-variant p-4 mb-4" style={{ background: '#0e0e0e' }}>
                <code className="font-mono text-amber flex-1 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                  {shareUrl}
                </code>
                <button
                  onClick={handleCopy}
                  className="horror-btn"
                  style={{ padding: '6px 14px', fontSize: '11px', flexShrink: 0 }}
                  aria-label="Copy share link"
                >
                  {copied ? 'COPIED ✓' : 'COPY'}
                </button>
              </div>

              <p className="font-mono text-outline mb-8" style={{ fontSize: '11px', opacity: 0.5 }}>
                This room expires in 7 days. Code: {roomId}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { label: 'ROOM', value: selectedRoomData?.name.toUpperCase() ?? '' },
                  { label: 'TIMER', value: '3 MIN' },
                  { label: 'ATTEMPTS', value: '2' },
                ].map(stat => (
                  <div key={stat.label} className="border border-outline-variant p-3">
                    <p className="font-mono text-outline-variant" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>{stat.label}</p>
                    <p className="font-mono text-amber mt-1" style={{ fontSize: '13px' }}>{stat.value}</p>
                  </div>
                ))}
              </div>

              <p className="font-mono text-outline" style={{ fontSize: '10px', opacity: 0.35 }}>
                Someone is about to receive this link. The city is watching.
              </p>
            </div>

            <div className="w-full max-w-xl flex justify-between mt-6">
              <button onClick={() => { setStep(1); setSelectedRoom(null); setMessage(''); setClue(''); setShareUrl('') }} className="horror-btn" aria-label="Create another room">
                CREATE ANOTHER ROOM
              </button>
              <button onClick={() => router.push('/home')} className="horror-btn horror-btn-primary" aria-label="Return to city">
                RETURN TO CITY →
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.main>
  )
}
