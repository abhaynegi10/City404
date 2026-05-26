'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/store/gameStore'
import { pageVariants } from '@/lib/animations'

export default function SuccessPage() {
  const { resetGame } = useGameStore()

  return (
    <motion.main
      className="relative min-h-screen bg-background flex flex-col items-center justify-center px-6"
      style={{ background: 'linear-gradient(135deg, #131313 0%, #0d1f0d 100%)' }}
      variants={pageVariants} initial="initial" animate="animate" exit="exit"
    >
      <div className="vignette fixed inset-0 pointer-events-none z-10" />

      <div className="relative z-20 w-full max-w-lg text-center">
        <motion.p
          className="font-mono text-amber mb-4"
          style={{ fontSize: '11px', letterSpacing: '0.2em', opacity: 0.7 }}
          initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.2 }}
        >
          TRANSMISSION RECOVERED
        </motion.p>

        <motion.h1
          className="font-newsreader text-on-surface mb-6"
          style={{ fontSize: '56px', fontWeight: 600, textShadow: '0 0 40px rgba(74,222,128,0.2)' }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        >
          SIGNAL<br />RESTORED
        </motion.h1>

        <motion.p
          className="font-geist text-on-surface-variant mb-10"
          style={{ fontSize: '16px', lineHeight: 1.6 }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        >
          You found it. Against all odds, in the dark, you found it.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
        >
          <Link
            href="/home"
            onClick={resetGame}
            className="horror-btn"
            style={{ borderColor: '#4ade80', color: '#4ade80' }}
            aria-label="Return to city"
          >
            RETURN TO CITY
          </Link>
        </motion.div>
      </div>
    </motion.main>
  )
}
