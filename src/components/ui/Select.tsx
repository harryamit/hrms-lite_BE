import type { SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
}

export function Select({
  label,
  options,
  error,
  id,
  className = '',
  ...props
}: SelectProps) {
  const selectId =
    id ?? label.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="w-full">
      <label
        htmlFor={selectId}
        className="mb-1 block text-sm font-medium text-(--color-text)"
      >
        {label}
      </label>
      <select
        id={selectId}
        className={`w-full rounded-lg border border-(--color-border) px-3 py-2 text-(--color-text) shadow-sm transition-colors focus:border-(--color-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20 ${
          error ? 'border-(--color-danger) focus:border-(--color-danger) focus:ring-(--color-danger)/20' : ''
        } ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : undefined}
        {...props}
      >
        {options.map((opt, index) => (
          <option key={opt.value ? opt.value : `option-${index}`} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={`${selectId}-error`} className="mt-1 text-sm text-(--color-danger)">
          {error}
        </p>
      ) : null}
    </div>
  );
}
