import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, className = '', ...props }: InputProps) {
  const inputId = id ?? label.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="mb-1 block text-sm font-medium text-(--color-text)"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full rounded-lg border border-(--color-border) px-3 py-2 text-(--color-text) shadow-sm transition-colors placeholder:text-(--color-muted) focus:border-(--color-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20 ${
          error ? 'border-(--color-danger) focus:border-(--color-danger) focus:ring-(--color-danger)/20' : ''
        } ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-(--color-danger)">
          {error}
        </p>
      ) : null}
    </div>
  );
}
