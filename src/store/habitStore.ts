import type { Habit, HabitEntry, FuturePlan, EntryStatus } from '../types'

const HABITS_KEY = 'habit-tracker-habits'
const ENTRIES_KEY = 'habit-tracker-entries'
const PLANS_KEY = 'habit-tracker-plans'

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function save<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data))
}

function uid(): string {
  return crypto.randomUUID?.() ?? Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export function getHabits(): Habit[] {
  return load<Habit[]>(HABITS_KEY, [])
}

export function saveHabit(habit: Habit): void {
  const habits = getHabits().filter(h => h.id !== habit.id)
  habits.push(habit)
  save(HABITS_KEY, habits)
}

export function deleteHabit(id: string): void {
  save(HABITS_KEY, getHabits().filter(h => h.id !== id))
  save(ENTRIES_KEY, getEntries().filter(e => e.habitId !== id))
  save(PLANS_KEY, getPlans().filter(p => p.habitId !== id))
}

export function getEntries(): HabitEntry[] {
  return load<HabitEntry[]>(ENTRIES_KEY, [])
}

export function getEntry(habitId: string, date: string): HabitEntry | undefined {
  return getEntries().find(e => e.habitId === habitId && e.date === date)
}

export function setEntry(habitId: string, date: string, status: EntryStatus, note?: string): void {
  const entries = getEntries()
  const idx = entries.findIndex(e => e.habitId === habitId && e.date === date)
  const entry: HabitEntry = {
    id: entries[idx]?.id ?? uid(),
    habitId,
    date,
    status,
    note,
  }
  if (idx >= 0) entries[idx] = entry
  else entries.push(entry)
  save(ENTRIES_KEY, entries)
}

export function getPlans(): FuturePlan[] {
  return load<FuturePlan[]>(PLANS_KEY, [])
}

export function savePlan(plan: FuturePlan): void {
  const plans = getPlans().filter(p => p.id !== plan.id)
  plans.push(plan)
  save(PLANS_KEY, plans)
}

export function deletePlan(id: string): void {
  save(PLANS_KEY, getPlans().filter(p => p.id !== id))
}

export function createHabit(name: string, description: string, color: string, icon: string, frequency: Habit['frequency']): Habit {
  return { id: uid(), name, description, color, icon, frequency, createdAt: new Date().toISOString() }
}

export function createPlan(habitId: string, date: string, note: string): FuturePlan {
  return { id: uid(), habitId, date, note, createdAt: new Date().toISOString() }
}

export function calculateStreak(habitId: string, untilDate: string): number {
  const entries = getEntries()
    .filter(e => e.habitId === habitId && e.status === 'done')
    .map(e => e.date)
    .sort((a, b) => b.localeCompare(a))

  let streak = 0
  const current = new Date(untilDate)

  for (let i = 0; i < 365; i++) {
    const dateStr = current.toISOString().slice(0, 10)
    if (entries.includes(dateStr)) {
      streak++
      current.setDate(current.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}
