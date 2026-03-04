import { useState, useRef, useEffect } from 'react';
import { useGetEmployeesQuery } from '../../store/api';

interface EmployeeSelectProps {
  label: string;
  value: string;
  onChange: (employeeId: string) => void;
  required?: boolean;
}

const DEBOUNCE_MS = 300;
const MIN_SEARCH_LENGTH = 2;

export function EmployeeSelect({
  label,
  value,
  onChange,
  required = false,
}: EmployeeSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const trimmed = debouncedSearch.trim();
  const searchParam =
    open && trimmed.length >= MIN_SEARCH_LENGTH ? trimmed : undefined;
  const { data: employees = [], isLoading } = useGetEmployeesQuery(searchParam, {
    skip: !open,
  });

  const selected = employees.find((e) => e.employeeId === value);
  const effectiveIndex =
    employees.length === 0 ? 0 : Math.min(highlightedIndex, employees.length - 1);

  const closeDropdown = () => {
    setSearch('');
    setOpen(false);
  };

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setSearch('');
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        closeDropdown();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((i) => Math.min(i + 1, Math.max(0, employees.length - 1)));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((i) => Math.max(0, i - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (employees[effectiveIndex]) {
          const emp = employees[effectiveIndex];
          onChange(emp.employeeId);
          setSelectedLabel(`${emp.employeeId} - ${emp.fullName}`);
          closeDropdown();
        }
        break;
      default:
        break;
    }
  };

  const displayLabel =
    selectedLabel || (selected ? `${selected.employeeId} - ${selected.fullName}` : null) || 'Select employee';

  return (
    <div ref={containerRef} className="w-full">
      <label className="mb-1 block text-sm font-medium text-(--color-text)">
        {label}
        {required ? <span className="text-(--color-danger)"> *</span> : null}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between rounded-lg border border-(--color-border) bg-white px-3 py-2 text-left text-(--color-text) shadow-sm transition-colors hover:border-(--color-muted) focus:border-(--color-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-required={required}
          aria-controls="employee-listbox"
          id="employee-select-trigger"
        >
          <span className={value ? '' : 'text-(--color-muted)'}>
            {displayLabel}
          </span>
          <svg
            className={`h-4 w-4 shrink-0 text-(--color-muted) transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open ? (
          <div
            id="employee-listbox"
            role="listbox"
            aria-labelledby="employee-select-trigger"
            aria-activedescendant={
              employees[effectiveIndex]
                ? `employee-option-${employees[effectiveIndex]._id}`
                : undefined
            }
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            className="absolute z-10 mt-1 w-full rounded-lg border border-(--color-border) bg-(--color-surface-elevated) py-1 shadow-lg outline-none"
          >
            <div className="border-b border-(--color-border) px-2 pb-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') closeDropdown();
                  else if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
                    e.preventDefault();
                    handleKeyDown(e);
                  }
                }}
                placeholder="Search by name or ID (min 2 characters)..."
                className="w-full rounded-md border border-(--color-border) px-2 py-1.5 text-sm text-(--color-text) placeholder:text-(--color-muted) focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary)/20"
                autoFocus
                aria-label="Filter employees"
              />
            </div>
            <ul ref={listRef} className="max-h-48 overflow-y-auto py-1">
              {isLoading ? (
                <li className="px-3 py-4 text-center text-sm text-(--color-muted)">
                  Loading...
                </li>
              ) : employees.length === 0 ? (
                <li className="px-3 py-2 text-sm text-(--color-muted)">
                  {trimmed.length > 0 && trimmed.length < MIN_SEARCH_LENGTH
                    ? 'Type at least 2 characters to search'
                    : 'No employees match'}
                </li>
              ) : (
                employees.map((emp, index) => (
                  <li
                    key={emp._id}
                    id={`employee-option-${emp._id}`}
                    role="option"
                    aria-selected={emp.employeeId === value}
                    onClick={() => {
                      onChange(emp.employeeId);
                      setSelectedLabel(`${emp.employeeId} - ${emp.fullName}`);
                      setOpen(false);
                    }}
                    className={`cursor-pointer px-3 py-2 text-sm transition-colors hover:bg-(--color-surface) ${
                      index === effectiveIndex
                        ? 'bg-(--color-primary-muted) text-(--color-primary)'
                        : emp.employeeId === value
                          ? 'bg-(--color-surface) text-(--color-primary)'
                          : 'text-(--color-text)'
                    }`}
                  >
                    {emp.employeeId} - {emp.fullName}
                  </li>
                ))
              )}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
