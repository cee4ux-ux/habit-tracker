export type Frequency = 'daily' | 'weekdays' | 'weekends' | 'weekly'
export type EntryStatus = 'done' | 'skipped' | 'pending'
export type ThemeMode = 'light' | 'dark'
export type ColorPreset = 'emerald' | 'violet' | 'rose' | 'amber' | 'sky' | 'slate'

export interface Habit {
  id: string
  name: string
  description: string
  color: string
  icon: string
  frequency: Frequency
  createdAt: string
}

export interface HabitEntry {
  id: string
  habitId: string
  date: string
  status: EntryStatus
  note?: string
}

export interface FuturePlan {
  id: string
  habitId: string
  date: string
  note: string
  createdAt: string
}
