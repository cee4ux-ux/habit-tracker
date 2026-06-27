import { useState } from 'react'
import { format, isToday, startOfDay } from 'date-fns'
import { Check, X, Flame, Plus } from 'lucide-react'
import { getHabits, getEntry, setEntry, calculateStreak, getPlans, createHabit, saveHabit } from '../store/habitStore'
import HabitForm from '../components/HabitForm'
import type { Habit } from '../types'

export default function Dashboard() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const [habits, setHabits] = useState(getHabits())
  const [showForm, setShowForm] = useState(false)
  const [, forceUpdate] = useState(0)

  const refresh = () => {
    setHabits(getHabits())
    forceUpdate(n => n + 1)
  }

  const todayHabits = habits.filter(h => {
    const day = new Date().getDay()
    if (h.frequency === 'weekdays' && (day === 0 || day === 6)) return false
    if (h.frequency === 'weekends' && day !== 0 && day !== 6) return false
    return true
  })

  const handleCheck = (habitId: string, status: 'done' | 'skipped') => {
    setEntry(habitId, today, status)
    refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{isToday(new Date()) ? 'Today' : format(new Date(), 'EEEE')}</h1>
          <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm">
            {format(new Date(), 'MMMM d, yyyy')}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Plus size={18} /> New
        </button>
      </div>

      {showForm && (
        <HabitForm
          onClose={() => setShowForm(false)}
          onSave={h => {
            saveHabit(createHabit(h.name, h.description, h.color, h.icon, h.frequency))
            setShowForm(false)
            refresh()
          }}
        />
      )}

      {todayHabits.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16" style={{ color: 'var(--color-text-secondary)' }}>
          <p className="text-lg">No habits for today</p>
          <p className="text-sm">Create a new habit to get started!</p>
        </div>
      )}

      <div className="space-y-3">
        {todayHabits.map(habit => {
          const entry = getEntry(habit.id, today)
          const streak = calculateStreak(habit.id, today)
          return (
            <div
              key={habit.id}
              className="flex items-center gap-3 rounded-xl px-4 py-3 transition-shadow"
              style={{ backgroundColor: 'var(--color-bg-card)' }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold text-white"
                style={{ backgroundColor: habit.color }}
              >
                {habit.icon[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{habit.name}</p>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  <span className="capitalize">{habit.frequency}</span>
                  {streak > 0 && (
                    <span className="flex items-center gap-0.5" style={{ color: habit.color }}>
                      <Flame size={12} /> {streak} day{streak > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleCheck(habit.id, 'done')}
                  className="flex h-9 w-9 items-center justify-center rounded-lg transition"
                  style={{
                    backgroundColor: entry?.status === 'done' ? habit.color : 'var(--color-bg)',
                    color: entry?.status === 'done' ? '#fff' : 'var(--color-text-secondary)',
                  }}
                >
                  <Check size={18} />
                </button>
                <button
                  onClick={() => handleCheck(habit.id, 'skipped')}
                  className="flex h-9 w-9 items-center justify-center rounded-lg transition"
                  style={{
                    backgroundColor: entry?.status === 'skipped' ? 'var(--color-danger)' : 'var(--color-bg)',
                    color: entry?.status === 'skipped' ? '#fff' : 'var(--color-text-secondary)',
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-bg-card)' }}>
        <h2 className="mb-2 text-sm font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Upcoming Plans</h2>
        <UpcomingPlans habits={habits} />
      </div>
    </div>
  )
}

function UpcomingPlans({ habits }: { habits: Habit[] }) {
  const plans = getPlans()
  const upcoming = plans
    .filter(p => new Date(p.date) >= startOfDay(new Date()))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5)

  if (upcoming.length === 0) {
    return <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>No future plans yet.</p>
  }

  return (
    <div className="space-y-2">
      {upcoming.map(plan => {
        const habit = habits.find(h => h.id === plan.habitId)
        return (
          <div key={plan.id} className="flex items-center gap-2 text-sm">
            <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              {format(new Date(plan.date), 'MMM d')}
            </span>
            <span style={{ color: habit?.color }} className="font-medium">{habit?.name ?? 'Unknown'}</span>
            <span style={{ color: 'var(--color-text-secondary)' }} className="truncate">{plan.note}</span>
          </div>
        )
      })}
    </div>
  )
}
