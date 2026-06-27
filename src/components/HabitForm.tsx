import { useState } from 'react'
import { X } from 'lucide-react'
import type { Habit, Frequency } from '../types'

const COLORS = ['#10b981', '#8b5cf6', '#f43f5e', '#f59e0b', '#0ea5e9', '#64748b']
const ICONS = ['check', 'book', 'dumbbell', 'coffee', 'code', 'music', 'heart', 'sun', 'moon', 'star']

interface Props {
  initial?: Habit
  onSave: (habit: Omit<Habit, 'id' | 'createdAt'>) => void
  onClose: () => void
}

export default function HabitForm({ initial, onSave, onClose }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [color, setColor] = useState(initial?.color ?? COLORS[0])
  const [icon, setIcon] = useState(initial?.icon ?? ICONS[0])
  const [frequency, setFrequency] = useState<Frequency>(initial?.frequency ?? 'daily')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({ name: name.trim(), description: description.trim(), color, icon, frequency })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl p-4" style={{ backgroundColor: 'var(--color-bg-card)' }}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{initial ? 'Edit Habit' : 'New Habit'}</h2>
        <button type="button" onClick={onClose} style={{ color: 'var(--color-text-secondary)' }}>
          <X size={20} />
        </button>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Morning run"
          className="w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2"
          style={{
            backgroundColor: 'var(--color-bg)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
          autoFocus
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Description</label>
        <input
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Optional description"
          className="w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2"
          style={{
            backgroundColor: 'var(--color-bg)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Color</label>
        <div className="flex gap-2">
          {COLORS.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className="h-8 w-8 rounded-full transition-transform"
              style={{ backgroundColor: c, transform: color === c ? 'scale(1.2)' : 'scale(1)' }}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Icon</label>
        <div className="flex flex-wrap gap-2">
          {ICONS.map(i => (
            <button
              key={i}
              type="button"
              onClick={() => setIcon(i)}
              className="rounded-lg px-3 py-1 text-sm capitalize transition"
              style={{
                backgroundColor: icon === i ? color : 'var(--color-bg)',
                color: icon === i ? '#fff' : 'var(--color-text)',
              }}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Frequency</label>
        <select
          value={frequency}
          onChange={e => setFrequency(e.target.value as Frequency)}
          className="w-full rounded-lg border px-3 py-2 outline-none"
          style={{
            backgroundColor: 'var(--color-bg)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
        >
          <option value="daily">Daily</option>
          <option value="weekdays">Weekdays</option>
          <option value="weekends">Weekends</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg py-2 font-medium text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        {initial ? 'Save Changes' : 'Create Habit'}
      </button>
    </form>
  )
}
