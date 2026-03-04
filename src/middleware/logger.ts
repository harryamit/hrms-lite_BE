import { Request, Response, NextFunction } from 'express';
import { getRequestId } from './requestId';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const requestId = getRequestId(req);
  const start = Date.now();

  res.on('finish', () => {
    const status = res.statusCode;
    const duration = Date.now() - start;
    const method = req.method;
    const url = req.originalUrl || req.url;
    if (status >= 400) {
      console.warn(`[${requestId}] ${method} ${url} ${status} ${duration}ms`);
    } else {
      console.info(`[${requestId}] ${method} ${url} ${status} ${duration}ms`);
    }
  });

  next();
}
