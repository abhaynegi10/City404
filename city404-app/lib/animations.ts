import type { Variants } from 'framer-motion'

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.3, ease: 'easeIn' } },
}

export const glitchReveal: Variants = {
  initial: { opacity: 0, x: -4 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export const staggerContainer: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export const modalReveal: Variants = {
  initial: { opacity: 0, scale: 0.96, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit:    { opacity: 0, scale: 0.96, y: 12, transition: { duration: 0.2 } },
}

export const errorFlash: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: [0, 1, 0.5, 1, 0, 1],
    transition: { duration: 0.4 },
  },
}

export const suspenseFade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 1.2, ease: 'easeIn' } },
  exit:    { opacity: 0, transition: { duration: 0.8 } },
}

export const slideFromLeft: Variants = {
  initial: { x: '-100%', opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  exit:    { x: '-100%', opacity: 0, transition: { duration: 0.3 } },
}

export const crimsonFillBtn: Variants = {
  rest:  { scaleX: 0, originX: 0 },
  hover: { scaleX: 1, originX: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}
