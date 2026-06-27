import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import type { ColorPreset } from '../types'

const presets: { label: string; value: ColorPreset; color: string }[] = [
  { label: 'Emerald', value: 'emerald', color: '#10b981' },
  { label: 'Violet', value: 'violet', color: '#8b5cf6' },
  { label: 'Rose', value: 'rose', color: '#f43f5e' },
  { label: 'Amber', value: 'amber', color: '#f59e0b' },
  { label: 'Sky', value: 'sky', color: '#0ea5e9' },
  { label: 'Slate', value: 'slate', color: '#64748b' },
]

export default function Settings() {
  const { mode, color, setColor, toggleMode } = useTheme()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="rounded-xl p-4 space-y-4" style={{ backgroundColor: 'var(--color-bg-card)' }}>
        <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Appearance</h2>

        <div>
          <p className="mb-2 text-sm font-medium">Theme Mode</p>
          <button
            onClick={toggleMode}
            className="flex w-full items-center justify-between rounded-lg border px-4 py-3 transition"
            style={{
              backgroundColor: 'var(--color-bg)',
              borderColor: 'var(--color-border)',
            }}
          >
            <span className="flex items-center gap-2">
              {mode === 'light' ? <Sun size={18} /> : <Moon size={18} />}
              {mode === 'light' ? 'Light Mode' : 'Dark Mode'}
            </span>
            <div
              className="h-6 w-10 rounded-full p-1 transition"
              style={{
                backgroundColor: mode === 'dark' ? 'var(--color-primary)' : 'var(--color-border)',
              }}
            >
              <div
                className="h-4 w-4 rounded-full bg-white transition-transform"
                style={{ transform: mode === 'dark' ? 'translateX(16px)' : 'translateX(0)' }}
              />
            </div>
          </button>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Color Theme</p>
          <div className="grid grid-cols-3 gap-2">
            {presets.map(p => (
              <button
                key={p.value}
                onClick={() => setColor(p.value)}
                className="flex flex-col items-center gap-1 rounded-lg border py-3 transition"
                style={{
                  backgroundColor: color === p.value ? p.color + '20' : 'var(--color-bg)',
                  borderColor: color === p.value ? p.color : 'var(--color-border)',
                }}
              >
                <div className="h-6 w-6 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-xs font-medium">{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl p-4 space-y-2" style={{ backgroundColor: 'var(--color-bg-card)' }}>
        <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-secondary)' }}>About</h2>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Habit Tracker v1.0 — Build better habits, plan your future.
        </p>
      </div>
    </div>
  )
}
