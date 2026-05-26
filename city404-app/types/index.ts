export type RoomType = 'church' | 'bus' | 'morgue' | 'tunnel' | 'hospital' | 'classroom'

export interface Hotspot {
  id: string
  x: number        // percentage position from left
  y: number        // percentage position from top
  label: string
  isMessageLocation: boolean
}

export interface Room {
  id: RoomType
  name: string
  description: string
  ambiance: string
  imagePath: string
  hotspots: Hotspot[]
}

export interface AttemptRecord {
  attemptNumber: number
  roomGuessed: RoomType
  correct: boolean
  timestamp: number
  sessionId: string
}

export interface RoomDocument {
  id: string
  roomType: RoomType
  hiddenMessage: string
  clue: string
  createdAt: number
  expiresAt: number
  maxAttempts: number
  timerSeconds: number
  attempts: AttemptRecord[]
  isCompleted: boolean
  completedAt?: number
}

export type GamePhase = 'clue' | 'room-select' | 'room-explore' | 'success' | 'failure'

export interface GameState {
  roomId: string | null
  roomData: Omit<RoomDocument, 'roomType' | 'hiddenMessage'> | null
  currentAttempt: number
  selectedRoom: RoomType | null
  phase: GamePhase
  timeRemaining: number
  sessionId: string
  failureReason: 'timer' | 'attempts' | null
}

// API response types
export interface CreateRoomResponse {
  roomId: string
  shareUrl: string
}

export interface RoomMetaResponse {
  clue: string
  timerSeconds: number
  maxAttempts: number
  isExpired: boolean
  isCompleted: boolean
  attemptsUsed: number
}

export interface AttemptResponse {
  correct: boolean
  attemptsRemaining: number
  failed: boolean
}

export interface CompleteResponse {
  hiddenMessage: string
}
