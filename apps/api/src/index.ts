import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { connectDB } from './lib/db';
import authRouter from './routes/auth.router';
import usersRouter from './routes/users.router';
import uploadsRouter from './routes/uploads.router';
import scansRouter from './routes/scans.router';

const app = express();
const PORT = process.env.API_PORT || 3001;

connectDB();

// ─── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
  credentials: true,
}));

// ─── Global Rate Limiting ──────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
});

const loginLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_LOGIN_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX_LOGIN_ATTEMPTS) || 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many login attempts. Try again in 15 minutes.' } },
});

app.use(globalLimiter);

// ─── Body Parsing ──────────────────────────────────────────────────────────────
app.use(morgan('combined'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date(), version: '0.1.0' });
});

app.get('/api/info', (_req, res) => {
  res.json({
    name: 'Pokemon Card Auth API',
    version: '0.1.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/auth/login', loginLimiter);
app.use('/auth/signup', loginLimiter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/uploads', uploadsRouter);
app.use('/scans', scansRouter);
app.use('/static-uploads', express.static(path.resolve(process.cwd(), 'public/uploads')));

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Endpoint not found' },
    timestamp: new Date(),
  });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_SERVER_ERROR', message: err.message || 'Internal server error' },
    timestamp: new Date(),
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ API Server running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
});

export default app;
