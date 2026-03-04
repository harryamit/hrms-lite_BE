import { Request, Response, NextFunction } from 'express';
import { ApiErrorBody, ErrorCodes } from '../types/api';
import { getRequestId } from './requestId';

export function sendError(
  res: Response,
  status: number,
  message: string,
  code?: string,
  errors?: Record<string, string>
): void {
  const body: ApiErrorBody = { message };
  if (code) body.code = code;
  if (errors && Object.keys(errors).length > 0) body.errors = errors;
  res.status(status).json(body);
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  const requestId = getRequestId(req);
  if (requestId && !res.headersSent) res.setHeader('x-request-id', requestId);
  const message = err instanceof Error ? err.message : 'Internal server error.';
  const body: ApiErrorBody = { message, code: ErrorCodes.INTERNAL };
  if (!res.headersSent) res.status(500).json(body);
}
