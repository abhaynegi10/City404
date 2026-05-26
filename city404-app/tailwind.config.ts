import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#131313',
        surface: '#131313',
        'surface-dim': '#131313',
        'surface-bright': '#393939',
        'surface-container-lowest': '#0e0e0e',
        'surface-container-low': '#1c1b1b',
        'surface-container': '#201f1f',
        'surface-container-high': '#2a2a2a',
        'surface-container-highest': '#353534',
        'on-surface': '#e5e2e1',
        'on-surface-variant': '#cfc4c5',
        'outline': '#988e90',
        'outline-variant': '#4c4546',
        primary: '#c6c6c6',
        'on-primary': '#303030',
        'primary-container': '#000000',
        secondary: '#ffb4a8',
        'on-secondary': '#690000',
        'secondary-container': '#920703',
        'on-secondary-container': '#ff9a8a',
        tertiary: '#e6c429',
        'on-tertiary': '#3a3000',
        'tertiary-container': '#000000',
        error: '#ffb4ab',
        'error-container': '#93000a',
        crimson: '#920703',
        amber: '#e6c429',
        void: '#000000',
      },
      fontFamily: {
        newsreader: ['Newsreader', 'Georgia', 'serif'],
        geist: ['Geist', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'hud-sm': ['11px', { lineHeight: '16px', letterSpacing: '0.1em' }],
        'hud-md': ['14px', { lineHeight: '20px', letterSpacing: '0.05em' }],
        'display': ['96px', { lineHeight: '1.0', letterSpacing: '-0.02em' }],
        'headline-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em' }],
        'headline-md': ['32px', { lineHeight: '40px' }],
        'headline-sm': ['24px', { lineHeight: '32px' }],
        'body-lg': ['18px', { lineHeight: '28px' }],
        'body-md': ['16px', { lineHeight: '24px' }],
      },
      borderRadius: {
        none: '0px',
        DEFAULT: '0px',
      },
      spacing: {
        'hud': '40px',
        '18': '72px',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, -2px)' },
          '60%': { transform: 'translate(-1px, 1px)' },
          '80%': { transform: 'translate(1px, -1px)' },
        },
        jitter: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(1px, 0)' },
          '75%': { transform: 'translate(-1px, 0)' },
        },
        scanPulse: {
          '0%': { top: '0%', opacity: '1' },
          '100%': { top: '100%', opacity: '0' },
        },
        pulseRed: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(146, 7, 3, 0)' },
          '50%': { boxShadow: '0 0 0 4px rgba(146, 7, 3, 0.4)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '33%': { opacity: '0.8' },
          '66%': { opacity: '0.9' },
        },
        signalPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        glitch: 'glitch 0.3s ease infinite',
        jitter: 'jitter 0.1s ease infinite',
        'scan-pulse': 'scanPulse 2s linear infinite',
        'pulse-red': 'pulseRed 2s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.8s ease forwards',
        flicker: 'flicker 3s ease-in-out infinite',
        'signal-pulse': 'signalPulse 1.5s ease-in-out infinite',
      },
      backgroundImage: {
        'vignette': 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.85) 100%)',
        'scanlines': 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
      },
      boxShadow: {
        'crimson': '0 0 20px rgba(146, 7, 3, 0.5)',
        'crimson-inset': 'inset 0 0 20px rgba(146, 7, 3, 0.3)',
        'amber-glow': '0 0 15px rgba(230, 196, 41, 0.4)',
        'red-text': '0 0 12px rgba(146, 7, 3, 0.8)',
      },
    },
  },
  plugins: [],
}
export default config
