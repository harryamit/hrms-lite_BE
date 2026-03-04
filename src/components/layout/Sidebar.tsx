import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/employees', label: 'Employees' },
  { to: '/attendance', label: 'Attendance' },
] as const;

export function Sidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-(--color-border) bg-(--color-surface-elevated) p-4">
      <nav className="flex flex-col gap-1">
        {navItems.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-(--color-primary-muted) text-(--color-primary)'
                  : 'text-(--color-muted) hover:bg-(--color-surface) hover:text-(--color-text)'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
