import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/employees', label: 'Employees' },
  { to: '/attendance', label: 'Attendance' },
] as const;

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 border-b border-(--color-border) bg-(--color-surface-elevated) shadow-sm">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        <Link
          to="/"
          className="text-xl font-semibold text-(--color-text) no-underline hover:text-(--color-primary)"
        >
          HRMS Lite
        </Link>
        <button
          type="button"
          className="rounded-lg p-2 text-(--color-muted) hover:bg-(--color-surface) md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>
      {menuOpen ? (
        <div className="border-t border-(--color-border) bg-(--color-surface-elevated) px-4 py-2 md:hidden">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-(--color-primary)/10 text-(--color-primary)'
                    : 'text-(--color-muted) hover:bg-(--color-surface) hover:text-(--color-text)'
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </div>
      ) : null}
    </header>
  );
}
