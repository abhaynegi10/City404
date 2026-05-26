import { create } from 'zustand'
import { GameState, GamePhase, RoomType, RoomDocument } from '@/types'
import { nanoid } from 'nanoid'

interface GameStore extends GameState {
  setRoomData: (id: string, data: Omit<RoomDocument, 'roomType' | 'hiddenMessage'>) => void
  selectRoom: (room: RoomType) => void
  setPhase: (phase: GamePhase) => void
  decrementAttempt: () => void
  setFailureReason: (reason: 'timer' | 'attempts') => void
  startTimer: () => void
  stopTimer: () => void
  resetGame: () => void
  _timerInterval: ReturnType<typeof setInterval> | null
}

const initialState: GameState = {
  roomId: null,
  roomData: null,
  currentAttempt: 2,
  selectedRoom: null,
  phase: 'clue',
  timeRemaining: 180,
  sessionId: nanoid(12),
  failureReason: null,
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  _timerInterval: null,

  setRoomData: (id, data) => set({
    roomId: id,
    roomData: data,
    timeRemaining: data.timerSeconds,
    currentAttempt: data.maxAttempts,
  }),

  selectRoom: (room) => set({ selectedRoom: room }),

  setPhase: (phase) => set({ phase }),

  decrementAttempt: () => {
    const current = get().currentAttempt
    const next = current - 1
    if (next <= 0) {
      get().stopTimer()
      set({ currentAttempt: 0, phase: 'failure', failureReason: 'attempts' })
    } else {
      set({ currentAttempt: next, selectedRoom: null })
    }
  },

  setFailureReason: (reason) => set({ failureReason: reason }),

  startTimer: () => {
    const existing = get()._timerInterval
    if (existing) clearInterval(existing)

    const interval = setInterval(() => {
      const remaining = get().timeRemaining
      if (remaining <= 1) {
        clearInterval(interval)
        set({ timeRemaining: 0, phase: 'failure', failureReason: 'timer', _timerInterval: null })
      } else {
        set({ timeRemaining: remaining - 1 })
      }
    }, 1000)

    set({ _timerInterval: interval })
  },

  stopTimer: () => {
    const interval = get()._timerInterval
    if (interval) {
      clearInterval(interval)
      set({ _timerInterval: null })
    }
  },

  resetGame: () => {
    get().stopTimer()
    set({ ...initialState, sessionId: nanoid(12) })
  },
}))
