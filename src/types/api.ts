/** Consistent error body for all API errors */
export interface ApiErrorBody {
  message: string;
  code?: string;
  errors?: Record<string, string>;
}

/** List response wrapper for future pagination */
export interface ListResponse<T> {
  data: T[];
  total?: number;
  page?: number;
  limit?: number;
}

export const ErrorCodes = {
  VALIDATION: 'VALIDATION',
  EMPLOYEE_ID_EXISTS: 'EMPLOYEE_ID_EXISTS',
  EMPLOYEE_NOT_FOUND: 'EMPLOYEE_NOT_FOUND',
  EMPLOYEE_ID_FORMAT: 'EMPLOYEE_ID_FORMAT',
  EMPLOYEE_ID_REQUIRED: 'EMPLOYEE_ID_REQUIRED',
  ATTENDANCE_EMPLOYEE_NOT_FOUND: 'ATTENDANCE_EMPLOYEE_NOT_FOUND',
  INVALID_DATE: 'INVALID_DATE',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  INTERNAL: 'INTERNAL',
} as const;
