'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { pageVariants, staggerContainer, staggerItem } from '@/lib/animations'

export default function HomePage() {
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const router = useRouter()

  const handleEnterCode = () => {
    const trimmed = code.trim().toUpperCase()
    if (!trimmed || trimmed.length < 4) {
      setCodeError('INVALID CODE — ENTER 6 CHARACTERS')
      return
    }
    setCodeError('')
    router.push(`/play/${trimmed}`)
  }

  return (
    <motion.main
      className="relative min-h-screen flex bg-background overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Vignette */}
      <div className="vignette fixed inset-0 pointer-events-none z-10" />

      {/* Ghost cityscape bottom */}
      <div
        className="fixed bottom-0 left-0 right-0 h-48 pointer-events-none z-0"
        style={{
          background: 'linear-gradient(to top, rgba(146,7,3,0.03) 0%, transparent 100%)',
          borderTop: '1px solid rgba(76,69,70,0.2)',
        }}
      />

      {/* Logo */}
      <div className="fixed top-[40px] left-[40px] z-20 flex items-center gap-2">
        <span className="font-newsreader text-on-surface-variant text-lg" style={{ opacity: 0.55 }}>
          CITY 404
        </span>
        <span className="hud-text" style={{ opacity: 0.3 }}>◈</span>
      </div>

      {/* Left Panel */}
      <motion.nav
        className="relative z-20 flex flex-col justify-center w-full max-w-sm"
        style={{
          background: '#201f1f',
          borderRight: '1px solid #2a2a2a',
          borderLeft: '2px solid #920703',
          padding: '80px 48px',
          minHeight: '100vh',
        }}
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* System Access header */}
        <motion.p
          className="font-mono text-amber mb-10"
          style={{ fontSize: '11px', letterSpacing: '0.2em', opacity: 0.7 }}
          variants={staggerItem}
        >
          SYSTEM ACCESS
        </motion.p>

        <div className="flex flex-col gap-1">
          {/* CREATE ROOM */}
          <motion.div variants={staggerItem}>
            <Link
              href="/create"
              className="group flex items-center justify-between py-5 border-b border-outline-variant hover:border-crimson transition-all"
            >
              <span
                className="font-mono text-on-surface group-hover:text-shadow-red transition-all"
                style={{ fontSize: '14px', letterSpacing: '0.08em' }}
              >
                [ CREATE ROOM ]
              </span>
              <span className="font-mono text-outline-variant group-hover:text-crimson group-hover:translate-x-1 transition-all text-sm">
                →
              </span>
            </Link>
          </motion.div>

          {/* ENTER CODE */}
          <motion.div variants={staggerItem} className="py-5 border-b border-outline-variant">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-on-surface" style={{ fontSize: '14px', letterSpacing: '0.08em' }}>
                [ ENTER CODE ]
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={e => { setCode(e.target.value.toUpperCase()); setCodeError('') }}
                onKeyDown={e => e.key === 'Enter' && handleEnterCode()}
                placeholder="> ABX91K_"
                maxLength={6}
                className="terminal-input font-mono flex-1"
                style={{ fontSize: '14px', letterSpacing: '0.12em' }}
                aria-label="Room code input"
              />
              <button
                onClick={handleEnterCode}
                className="horror-btn"
                style={{ padding: '8px 16px', fontSize: '12px' }}
                aria-label="Enter room"
              >
                →
              </button>
            </div>
            {codeError && (
              <p className="font-mono mt-2" style={{ fontSize: '10px', color: '#920703', letterSpacing: '0.05em' }}>
                ⚠ {codeError}
              </p>
            )}
          </motion.div>

          {/* ABOUT */}
          <motion.div variants={staggerItem}>
            <button
              className="group flex items-center justify-between py-5 w-full border-b border-outline-variant hover:border-crimson transition-all"
              aria-label="About the Void"
            >
              <span
                className="font-mono text-outline group-hover:text-on-surface-variant transition-all"
                style={{ fontSize: '14px', letterSpacing: '0.08em' }}
              >
                [ ABOUT THE VOID ]
              </span>
              <span className="font-mono text-outline-variant group-hover:text-crimson text-sm transition-all">
                →
              </span>
            </button>
          </motion.div>
        </div>

        {/* HUD Stats bottom */}
        <div className="mt-auto pt-12 flex flex-col gap-2 border-t border-outline-variant">
          {[
            'ENCRYPTION: ACTIVE',
            'VERSION 0.4.04',
            'STATUS: UNSTABLE',
          ].map((stat) => (
            <p key={stat} className="hud-text" style={{ opacity: 0.35 }}>{stat}</p>
          ))}
        </div>
      </motion.nav>

      {/* Right void */}
      <div className="flex-1 relative z-10 flex items-end justify-end p-[40px]">
        <p className="hud-text" style={{ opacity: 0.2 }}>THE CITY IS WATCHING</p>
      </div>
    </motion.main>
  )
}
