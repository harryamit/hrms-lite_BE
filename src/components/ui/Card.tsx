import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function Card({ children, title, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-lg bg-(--color-surface-elevated) p-6 shadow-md ${className}`}
    >
      {title ? (
        <h3 className="mb-4 text-lg font-semibold text-(--color-text)">{title}</h3>
      ) : null}
      {children}
    </div>
  );
}
