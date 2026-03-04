import type { ApiErrorBody } from '../types';

/** RTK Query / fetchBaseQuery error shape. */
interface FetchError {
  status?: number;
  data?: ApiErrorBody | unknown;
}

function getMessageFromData(data: unknown): string | null {
  if (data && typeof data === 'object' && 'message' in data) {
    const msg = (data as ApiErrorBody).message;
    if (typeof msg === 'string') return msg;
  }
  return null;
}

/**
 * Returns a user-facing message from an API/RTK Query error.
 * Prefers backend message; falls back to status-based copy for 404/5xx.
 */
export function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'data' in error) {
    const fetchError = error as FetchError;
    const fromData = getMessageFromData(fetchError.data);
    if (fromData) return fromData;
    const status = fetchError.status;
    if (status === 404) return 'The item was not found. It may have been deleted.';
    if (status && status >= 500) return 'Server error. Please try again later.';
    if (status && status >= 400) return 'Invalid request. Please check your input and try again.';
  }
  return 'Something went wrong. Please try again.';
}
