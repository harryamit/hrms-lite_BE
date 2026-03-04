import rateLimit from 'express-rate-limit';

const GENERAL_WINDOW_MS = 60 * 1000; // 1 minute
const GENERAL_MAX = 100; // 100 requests per minute per IP

const MUTATE_WINDOW_MS = 60 * 1000;
const MUTATE_MAX = 30; // stricter for create/update/delete

export const generalLimiter = rateLimit({
  windowMs: GENERAL_WINDOW_MS,
  max: GENERAL_MAX,
  message: { message: 'Too many requests. Please try again later.', code: 'RATE_LIMIT_EXCEEDED' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const mutateLimiter = rateLimit({
  windowMs: MUTATE_WINDOW_MS,
  max: MUTATE_MAX,
  message: { message: 'Too many create/update/delete requests. Please try again later.', code: 'RATE_LIMIT_EXCEEDED' },
  standardHeaders: true,
  legacyHeaders: false,
});
