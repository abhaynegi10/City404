'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/store/gameStore'
import { pageVariants } from '@/lib/animations'

export default function FailurePage() {
  const { failureReason, resetGame } = useGameStore()

  const isTimer = failureReason === 'timer'
  const headline = isTimer ? 'TIME EXPIRED' : 'ATTEMPTS EXHAUSTED'
  const sub = isTimer
    ? 'The clock reached zero. The city swallowed the signal.'
    : 'You ran out of chances. The room consumed you.'

  return (
    <motion.main
      className="relative min-h-screen bg-background flex flex-col items-center justify-center px-6 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #131313 0%, #1a0000 100%)' }}
      variants={pageVariants} initial="initial" animate="animate" exit="exit"
    >
      <div className="vignette fixed inset-0 pointer-events-none z-10" />

      {/* Glitch overlay */}
      <motion.div
        className="fixed inset-0 z-5 pointer-events-none"
        style={{ background: 'rgba(146,7,3,0.06)' }}
        animate={{ opacity: [0.06, 0.12, 0.06, 0.08, 0.06] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-20 w-full max-w-lg text-center">
        <motion.p
          className="font-mono mb-4"
          style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#920703', opacity: 0.8 }}
          initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.1 }}
        >
          CONNECTION TERMINATED
        </motion.p>

        <motion.h1
          className="font-newsreader mb-6"
          style={{
            fontSize: '52px',
            fontWeight: 600,
            color: '#920703',
            textShadow: '0 0 40px rgba(146,7,3,0.5)',
            lineHeight: 1.1,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {headline}
        </motion.h1>

        {/* Redacted message block */}
        <motion.div
          className="border border-crimson p-4 mb-6"
          style={{ background: '#0e0e0e' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        >
          <p className="font-mono mb-2" style={{ fontSize: '11px', color: '#920703', letterSpacing: '0.12em', opacity: 0.7 }}>
            HIDDEN MESSAGE [CLASSIFIED]
          </p>
          <div className="redacted font-geist" style={{ fontSize: '16px', lineHeight: '1.8', userSelect: 'none' }}>
            ████████████████ ████████ ████ ████████████
          </div>
        </motion.div>

        <motion.p
          className="font-geist text-on-surface-variant mb-10"
          style={{ fontSize: '16px', lineHeight: 1.6, opacity: 0.7 }}
          initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.7 }}
        >
          {sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
        >
          <Link
            href="/home"
            onClick={resetGame}
            className="horror-btn horror-btn-primary"
            aria-label="Return to city"
          >
            RETURN TO CITY
          </Link>
        </motion.div>
      </div>
    </motion.main>
  )
}
