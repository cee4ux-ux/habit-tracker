import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, ListChecks, Calendar, Settings } from 'lucide-react'

const nav = [
  { to: '/', label: 'Today', icon: LayoutDashboard },
  { to: '/habits', label: 'Habits', icon: ListChecks },
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Layout() {
  return (
    <div className="flex h-dvh flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      <main className="flex-1 overflow-y-auto p-4 pb-20">
        <div className="mx-auto max-w-lg">
          <p className="mb-2 text-center text-xs" style={{ color: 'var(--color-text-secondary)' }}>built by ashish</p>
          <Outlet />
        </div>
      </main>
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-lg"
        style={{
          backgroundColor: 'color-mix(in oklch, var(--color-bg-card) 85%, transparent)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="mx-auto flex max-w-lg justify-around py-2">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className="flex flex-col items-center gap-0.5 text-xs transition-colors"
              style={({ isActive }) => ({
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              })}
            >
              <Icon size={22} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
