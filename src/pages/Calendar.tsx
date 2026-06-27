import { useState } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
  isToday,
} from 'date-fns'
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react'
import { getHabits, getEntry, setEntry, getPlans, savePlan, deletePlan, createPlan } from '../store/habitStore'
import type { EntryStatus } from '../types'

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [habits] = useState(getHabits())
  const [, forceUpdate] = useState(0)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [planNote, setPlanNote] = useState('')
  const [planHabitId, setPlanHabitId] = useState('')

  const refresh = () => forceUpdate(n => n + 1)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startPad = getDay(monthStart)

  const plans = getPlans().filter(p => p.date.startsWith(format(currentMonth, 'yyyy-MM')))

  const handlePrev = () => setCurrentMonth(m => subMonths(m, 1))
  const handleNext = () => setCurrentMonth(m => addMonths(m, 1))

  const handleDayClick = (date: string) => {
    setSelectedDate(date)
    setPlanNote('')
    setPlanHabitId(habits[0]?.id ?? '')
  }

  const handlePlanSubmit = () => {
    if (!planNote.trim() || !planHabitId || !selectedDate) return
    savePlan(createPlan(planHabitId, selectedDate, planNote.trim()))
    setPlanNote('')
    refresh()
  }

  const handleEntryClick = (habitId: string, date: string, current?: EntryStatus) => {
    const next: EntryStatus = current === 'done' ? 'pending' : 'done'
    setEntry(habitId, date, next)
    refresh()
  }

  const dayPlans = selectedDate ? plans.filter(p => p.date === selectedDate) : []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Calendar</h1>

      <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-bg-card)' }}>
        <div className="mb-4 flex items-center justify-between">
          <button onClick={handlePrev} className="rounded-lg p-2" style={{ color: 'var(--color-text-secondary)' }}>
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
          <button onClick={handleNext} className="rounded-lg p-2" style={{ color: 'var(--color-text-secondary)' }}>
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startPad }).map((_, i) => (
            <div key={`pad-${i}`} />
          ))}
          {days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd')
            const todayHabits = habits.filter(h => {
              const dayOfWeek = getDay(day)
              if (h.frequency === 'weekdays' && (dayOfWeek === 0 || dayOfWeek === 6)) return false
              if (h.frequency === 'weekends' && dayOfWeek !== 0 && dayOfWeek !== 6) return false
              return true
            })
            const doneCount = todayHabits.filter(h => getEntry(h.id, dateStr)?.status === 'done').length
            const hasPlans = plans.some(p => p.date === dateStr)

            return (
              <button
                key={dateStr}
                onClick={() => handleDayClick(dateStr)}
                className="flex flex-col items-center rounded-lg py-1 text-sm transition"
                style={{
                  backgroundColor: selectedDate === dateStr ? 'var(--color-primary)' : 'transparent',
                  color: selectedDate === dateStr ? '#fff' : isToday(day) ? 'var(--color-primary)' : 'var(--color-text)',
                }}
              >
                <span className="text-xs">{format(day, 'd')}</span>
                {doneCount > 0 && (
                  <span className="mt-0.5 h-1 w-1 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
                )}
                {hasPlans && doneCount === 0 && (
                  <span className="mt-0.5 h-1 w-1 rounded-full" style={{ backgroundColor: 'var(--color-amber)' }} />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: 'var(--color-bg-card)' }}>
          <h2 className="font-semibold">{format(new Date(selectedDate), 'MMMM d, yyyy')}</h2>

          <div className="space-y-1">
            {habits.filter(h => {
              const dayOfWeek = getDay(new Date(selectedDate))
              if (h.frequency === 'weekdays' && (dayOfWeek === 0 || dayOfWeek === 6)) return false
              if (h.frequency === 'weekends' && dayOfWeek !== 0 && dayOfWeek !== 6) return false
              return true
            }).map(habit => {
              const entry = getEntry(habit.id, selectedDate)
              return (
                <button
                  key={habit.id}
                  onClick={() => handleEntryClick(habit.id, selectedDate, entry?.status)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition"
                  style={{
                    backgroundColor: entry?.status === 'done' ? habit.color + '20' : 'var(--color-bg)',
                    color: entry?.status === 'done' ? habit.color : 'var(--color-text)',
                  }}
                >
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: entry?.status === 'done' ? habit.color : 'var(--color-border)' }}
                  />
                  {habit.name}
                </button>
              )
            })}
          </div>

          <div className="border-t pt-3" style={{ borderColor: 'var(--color-border)' }}>
            <h3 className="mb-2 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Plans</h3>
            {dayPlans.map(plan => {
              const habit = habits.find(h => h.id === plan.habitId)
              return (
                <div key={plan.id} className="mb-1 flex items-center justify-between rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: 'var(--color-bg)' }}>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: habit?.color }} />
                    <span className="font-medium">{habit?.name}</span>
                    <span style={{ color: 'var(--color-text-secondary)' }}>{plan.note}</span>
                  </div>
                  <button
                    onClick={() => { deletePlan(plan.id); refresh() }}
                    style={{ color: 'var(--color-danger)' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )
            })}
            <div className="mt-2 flex gap-2">
              <select
                value={planHabitId}
                onChange={e => setPlanHabitId(e.target.value)}
                className="rounded-lg border px-2 py-1 text-sm outline-none"
                style={{
                  backgroundColor: 'var(--color-bg)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                {habits.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
              <input
                value={planNote}
                onChange={e => setPlanNote(e.target.value)}
                placeholder="What's the plan?"
                className="flex-1 rounded-lg border px-2 py-1 text-sm outline-none"
                style={{
                  backgroundColor: 'var(--color-bg)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
              <button
                onClick={handlePlanSubmit}
                className="rounded-lg px-3 text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
