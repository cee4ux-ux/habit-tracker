import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { ThemeMode, ColorPreset } from '../types'

interface ThemeContextType {
  mode: ThemeMode
  color: ColorPreset
  setMode: (m: ThemeMode) => void
  setColor: (c: ColorPreset) => void
  toggleMode: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

const COLOR_PRESETS: Record<ColorPreset, Record<string, string>> = {
  emerald: { '--color-primary': 'oklch(0.6 0.18 160)', '--color-primary-light': 'oklch(0.8 0.1 160)' },
  violet: { '--color-primary': 'oklch(0.55 0.2 290)', '--color-primary-light': 'oklch(0.78 0.12 290)' },
  rose: { '--color-primary': 'oklch(0.55 0.22 10)', '--color-primary-light': 'oklch(0.78 0.12 10)' },
  amber: { '--color-primary': 'oklch(0.65 0.2 80)', '--color-primary-light': 'oklch(0.82 0.1 80)' },
  sky: { '--color-primary': 'oklch(0.55 0.18 240)', '--color-primary-light': 'oklch(0.78 0.1 240)' },
  slate: { '--color-primary': 'oklch(0.6 0.05 260)', '--color-primary-light': 'oklch(0.8 0.03 260)' },
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem('habit-tracker-theme')
    if (stored === 'dark' || stored === 'light') return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  const [color, setColor] = useState<ColorPreset>(() => {
    const stored = localStorage.getItem('habit-tracker-color')
    if (stored && COLOR_PRESETS[stored as ColorPreset]) return stored as ColorPreset
    return 'emerald'
  })

  useEffect(() => {
    localStorage.setItem('habit-tracker-theme', mode)
    document.documentElement.dataset.theme = mode
  }, [mode])

  useEffect(() => {
    localStorage.setItem('habit-tracker-color', color)
    const vars = COLOR_PRESETS[color]
    Object.entries(vars).forEach(([key, val]) => {
      document.documentElement.style.setProperty(key, val)
    })
  }, [color])

  const toggleMode = () => setMode(m => (m === 'light' ? 'dark' : 'light'))

  return (
    <ThemeContext.Provider value={{ mode, color, setMode, setColor, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
