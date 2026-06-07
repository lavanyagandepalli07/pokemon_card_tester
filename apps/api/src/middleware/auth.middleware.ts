import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../lib/supabase';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

/**
 * Middleware: validates Supabase JWT from Authorization header.
 * Attaches req.user if valid; responds 401 otherwise.
 */
export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Missing or invalid Authorization header' },
      timestamp: new Date(),
    });
  }

  const token = authHeader.substring(7);

  try {
    const supabaseUser = await verifyAccessToken(token);

    if (!supabaseUser) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' },
        timestamp: new Date(),
      });
    }

    req.user = {
      id: supabaseUser.id,
      email: supabaseUser.email ?? '',
    };

    return next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Token verification failed' },
      timestamp: new Date(),
    });
  }
}
