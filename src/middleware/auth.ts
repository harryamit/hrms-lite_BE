import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from './errorHandler';
import { ErrorCodes } from '../types/api';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';
const REQUIRE_AUTH = process.env.REQUIRE_AUTH === 'true';

export interface JwtPayload {
  sub: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (!REQUIRE_AUTH) {
    return next();
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return sendError(res, 401, 'Authentication required. Provide a valid Bearer token.', ErrorCodes.UNAUTHORIZED);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as Request & { user?: JwtPayload }).user = decoded;
    next();
  } catch {
    return sendError(res, 401, 'Invalid or expired token.', ErrorCodes.UNAUTHORIZED);
  }
}

/** Optional: restrict to roles that can delete employees or perform sensitive actions */
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!REQUIRE_AUTH) return next();
    const user = (req as Request & { user?: JwtPayload }).user;
    if (!user?.role || !allowedRoles.includes(user.role)) {
      return sendError(res, 403, 'Insufficient permissions.', 'FORBIDDEN');
    }
    next();
  };
}
