import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold text-(--color-text)">Page not found</h1>
      <p className="text-(--color-muted)">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="rounded-lg bg-(--color-primary) px-4 py-2 text-sm font-medium text-white no-underline hover:bg-(--color-primary-hover)"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
