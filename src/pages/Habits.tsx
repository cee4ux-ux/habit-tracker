import { useState } from 'react'
import { Plus, Pencil, Trash2, Flame } from 'lucide-react'
import { getHabits, deleteHabit, saveHabit, createHabit, calculateStreak } from '../store/habitStore'
import HabitForm from '../components/HabitForm'

export default function Habits() {
  const [habits, setHabits] = useState(getHabits())
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [, forceUpdate] = useState(0)

  const refresh = () => {
    setHabits(getHabits())
    forceUpdate(n => n + 1)
  }

  const handleDelete = (id: string) => {
    deleteHabit(id)
    refresh()
  }

  const editingHabit = editingId ? habits.find(h => h.id === editingId) : undefined

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Habits</h1>
        <button
          onClick={() => { setShowForm(true); setEditingId(null) }}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Plus size={18} /> New
        </button>
      </div>

      {(showForm || editingId) && (
        <HabitForm
          initial={editingHabit}
          onClose={() => { setShowForm(false); setEditingId(null) }}
          onSave={h => {
            if (editingHabit) {
              saveHabit({ ...editingHabit, ...h })
            } else {
              saveHabit(createHabit(h.name, h.description, h.color, h.icon, h.frequency))
            }
            setShowForm(false)
            setEditingId(null)
            refresh()
          }}
        />
      )}

      <div className="space-y-3">
        {habits.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16" style={{ color: 'var(--color-text-secondary)' }}>
            <p className="text-lg">No habits yet</p>
            <p className="text-sm">Create your first habit to start tracking!</p>
          </div>
        )}
        {habits.map(habit => {
          const streak = calculateStreak(habit.id, new Date().toISOString().slice(0, 10))
          return (
            <div
              key={habit.id}
              className="flex items-center gap-3 rounded-xl px-4 py-3"
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
                <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  <span className="capitalize">{habit.frequency}</span>
                  {streak > 0 && (
                    <span className="flex items-center gap-0.5" style={{ color: habit.color }}>
                      <Flame size={12} /> {streak}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setEditingId(habit.id)}
                className="rounded-lg p-2 transition-colors"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDelete(habit.id)}
                className="rounded-lg p-2 transition-colors"
                style={{ color: 'var(--color-danger)' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
