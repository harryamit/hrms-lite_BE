import { ErrorCodes } from './types/api';

const YYYY_MM_DD = /^\d{4}-\d{2}-\d{2}$/;
const EMPLOYEE_ID_PATTERN = /^EMP\d+$/; // optional: "EMP" + digits
const SEARCH_MIN_LENGTH = 2;
const SEARCH_MAX_LENGTH = 100;

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export interface ValidationFailure {
  ok: false;
  message: string;
  code: string;
  errors?: Record<string, string>;
}

export interface ValidationSuccess<T> {
  ok: true;
  data: T;
}

function isValidDateYYYYMMDD(dateStr: string): boolean {
  if (!YYYY_MM_DD.test(dateStr)) return false;
  const d = new Date(dateStr);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === dateStr;
}

export function validateEmployeeBody(body: unknown): ValidationSuccess<{ employeeId: string; fullName: string; email: string; department: string }> | ValidationFailure {
  const errors: Record<string, string> = {};
  if (body == null || typeof body !== 'object') {
    return { ok: false, message: 'Request body must be a JSON object.', code: ErrorCodes.VALIDATION };
  }
  const b = body as Record<string, unknown>;

  if (!isNonEmptyString(b.employeeId)) errors.employeeId = 'employeeId is required and must be a non-empty string.';
  else if (!EMPLOYEE_ID_PATTERN.test((b.employeeId as string).trim())) errors.employeeId = 'employeeId must match format: EMP followed by digits (e.g. EMP001).';
  if (!isNonEmptyString(b.fullName)) errors.fullName = 'fullName is required and must be a non-empty string.';
  if (!isNonEmptyString(b.email)) errors.email = 'email is required and must be a non-empty string.';
  if (!isNonEmptyString(b.department)) errors.department = 'department is required and must be a non-empty string.';

  if (Object.keys(errors).length > 0) {
    const first = Object.values(errors)[0];
    return { ok: false, message: first ?? 'Validation failed.', code: ErrorCodes.VALIDATION, errors };
  }

  return {
    ok: true,
    data: {
      employeeId: (b.employeeId as string).trim(),
      fullName: (b.fullName as string).trim(),
      email: (b.email as string).trim(),
      department: (b.department as string).trim(),
    },
  };
}

export function validateAttendanceBody(body: unknown): ValidationSuccess<{ employeeId: string; date: string; status: 'Present' | 'Absent' }> | ValidationFailure {
  const errors: Record<string, string> = {};
  if (body == null || typeof body !== 'object') {
    return { ok: false, message: 'Request body must be a JSON object.', code: ErrorCodes.VALIDATION };
  }
  const b = body as Record<string, unknown>;

  if (!isNonEmptyString(b.employeeId)) errors.employeeId = 'employeeId is required and must be a non-empty string.';
  if (!isNonEmptyString(b.date)) errors.date = 'date is required.';
  else {
    const date = (b.date as string).trim();
    if (!YYYY_MM_DD.test(date)) errors.date = 'date must be in YYYY-MM-DD format.';
    else if (!isValidDateYYYYMMDD(date)) errors.date = 'date must be a valid calendar date.';
  }
  if (b.status !== 'Present' && b.status !== 'Absent') errors.status = 'status must be exactly "Present" or "Absent".';

  if (Object.keys(errors).length > 0) {
    const first = Object.values(errors)[0];
    return { ok: false, message: first ?? 'Validation failed.', code: ErrorCodes.VALIDATION, errors };
  }

  return {
    ok: true,
    data: {
      employeeId: (b.employeeId as string).trim(),
      date: (b.date as string).trim(),
      status: b.status as 'Present' | 'Absent',
    },
  };
}

export function validateSearch(search: string): { valid: boolean; message?: string } {
  const s = search.trim();
  if (s.length === 0) return { valid: true };
  if (s.length < SEARCH_MIN_LENGTH) return { valid: false, message: `search must be at least ${SEARCH_MIN_LENGTH} characters.` };
  if (s.length > SEARCH_MAX_LENGTH) return { valid: false, message: `search must be at most ${SEARCH_MAX_LENGTH} characters.` };
  return { valid: true };
}

export function validateDateQuery(dateStr: string): { valid: boolean; message?: string } {
  const s = dateStr.trim();
  if (!YYYY_MM_DD.test(s)) return { valid: false, message: 'date must be in YYYY-MM-DD format.' };
  if (!isValidDateYYYYMMDD(s)) return { valid: false, message: 'date must be a valid calendar date.' };
  return { valid: true };
}

export function validateEmployeePatchBody(body: unknown): ValidationSuccess<Partial<{ fullName: string; email: string; department: string }>> | ValidationFailure {
  if (body == null || typeof body !== 'object') {
    return { ok: false, message: 'Request body must be a JSON object.', code: ErrorCodes.VALIDATION };
  }
  const b = body as Record<string, unknown>;
  const data: Partial<{ fullName: string; email: string; department: string }> = {};
  const errors: Record<string, string> = {};

  if (b.fullName !== undefined) {
    if (!isNonEmptyString(b.fullName)) errors.fullName = 'fullName must be a non-empty string.';
    else data.fullName = (b.fullName as string).trim();
  }
  if (b.email !== undefined) {
    if (!isNonEmptyString(b.email)) errors.email = 'email must be a non-empty string.';
    else data.email = (b.email as string).trim();
  }
  if (b.department !== undefined) {
    if (!isNonEmptyString(b.department)) errors.department = 'department must be a non-empty string.';
    else data.department = (b.department as string).trim();
  }

  if (Object.keys(errors).length > 0) {
    const first = Object.values(errors)[0];
    return { ok: false, message: first ?? 'Validation failed.', code: ErrorCodes.VALIDATION, errors };
  }
  if (Object.keys(data).length === 0) {
    return { ok: false, message: 'At least one of fullName, email, or department must be provided.', code: ErrorCodes.VALIDATION };
  }

  return { ok: true, data };
}
