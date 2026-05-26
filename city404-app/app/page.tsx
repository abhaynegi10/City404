'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { pageVariants } from '@/lib/animations'

const CORNER_TEXTS = {
  topLeft: 'SYS::CITY_404 ■',
  topRight: 'SIGNAL: NULL',
  bottomLeft: 'LAT 28.6°N / 77.2°E',
  bottomRight: 'v0.4.04 [UNSTABLE]',
}

export default function IntroPage() {
  const [mounted, setMounted] = useState(false)
  const [showEnter, setShowEnter] = useState(false)

  useEffect(() => {
    setMounted(true)
    const t = setTimeout(() => setShowEnter(true), 1200)
    return () => clearTimeout(t)
  }, [])

  if (!mounted) return null

  return (
    <motion.main
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Vignette */}
      <div className="vignette fixed inset-0 pointer-events-none z-10" />

      {/* Corner HUDs */}
      <div className="fixed top-[40px] left-[40px] hud-text z-20">{CORNER_TEXTS.topLeft}</div>
      <div className="fixed top-[40px] right-[40px] hud-text z-20">{CORNER_TEXTS.topRight}</div>
      <div className="fixed bottom-[40px] left-[40px] hud-text z-20">{CORNER_TEXTS.bottomLeft}</div>
      <div className="fixed bottom-[40px] right-[40px] hud-text z-20">{CORNER_TEXTS.bottomRight}</div>

      {/* Center content */}
      <div className="relative z-20 flex flex-col items-center gap-6 px-6 text-center">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1
            className="glitch font-newsreader text-on-surface select-none"
            data-text="CITY 404"
            style={{
              fontSize: 'clamp(64px, 12vw, 120px)',
              fontWeight: 600,
              lineHeight: 1,
              textShadow: '3px 3px #920703, -3px -3px rgba(146,7,3,0.35)',
              letterSpacing: '-0.02em',
            }}
          >
            CITY 404
          </h1>
        </motion.div>

        {/* Terminal status */}
        <motion.p
          className="font-mono text-amber hud-text-amber cursor-blink"
          style={{ fontSize: '13px', letterSpacing: '0.08em', opacity: 0.75 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          SIGNAL LOST... RECONNECTING... [ERROR 0×4040]
        </motion.p>

        {/* Divider */}
        <motion.div
          className="w-[1px] h-8 bg-outline-variant"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.9, duration: 0.4 }}
        />

        {/* Enter button */}
        <AnimatePresence>
          {showEnter && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/home" className="horror-btn horror-btn-primary group">
                <span className="group-hover:text-shadow-red transition-all">ENTER THE CITY</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">▶</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sub-hint */}
        <motion.p
          className="font-mono text-outline text-[11px] tracking-widest mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          HIDE MESSAGES · CHALLENGE FRIENDS · SURVIVE THE CLOCK
        </motion.p>
      </div>
    </motion.main>
  )
}
