import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware';
import { CreateUserSchema, LoginCredentialsSchema } from '@pokemon-card-auth/shared-types';

const router = Router();

/**
 * POST /auth/signup
 * Create a new user with email + password via Supabase Auth
 */
router.post('/signup', async (req: Request, res: Response) => {
  const parsed = CreateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: parsed.error.flatten() },
      timestamp: new Date(),
    });
  }

  const { email, password, name } = parsed.data;

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name: name ?? '' },
  });

  if (error) {
    const status = error.message.includes('already registered') ? 409 : 400;
    return res.status(status).json({
      success: false,
      error: { code: 'SIGNUP_FAILED', message: error.message },
      timestamp: new Date(),
    });
  }

  // Sign in immediately after creation to get a session
  const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError || !signInData.session) {
    return res.status(201).json({
      success: true,
      data: { message: 'Account created. Please log in.' },
      timestamp: new Date(),
    });
  }

  return res.status(201).json({
    success: true,
    data: {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name ?? null,
        planTier: 'free',
        createdAt: data.user.created_at,
        updatedAt: data.user.updated_at ?? data.user.created_at,
      },
      accessToken: signInData.session.access_token,
      expiresAt: signInData.session.expires_at,
    },
    timestamp: new Date(),
  });
});

/**
 * POST /auth/login
 * Sign in with email + password
 */
router.post('/login', async (req: Request, res: Response) => {
  const parsed = LoginCredentialsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: parsed.error.flatten() },
      timestamp: new Date(),
    });
  }

  const { email, password } = parsed.data;

  const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });

  if (error || !data.session || !data.user) {
    return res.status(401).json({
      success: false,
      error: { code: 'LOGIN_FAILED', message: 'Invalid email or password' },
      timestamp: new Date(),
    });
  }

  return res.json({
    success: true,
    data: {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name ?? null,
        planTier: 'free',
        createdAt: data.user.created_at,
        updatedAt: data.user.updated_at ?? data.user.created_at,
      },
      accessToken: data.session.access_token,
      expiresAt: data.session.expires_at,
    },
    timestamp: new Date(),
  });
});

/**
 * POST /auth/logout
 * Invalidate the current session (token must be passed)
 */
router.post('/logout', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const token = req.headers.authorization?.substring(7) ?? '';
  // Supabase admin signOut by user ID
  await supabaseAdmin.auth.admin.signOut(token);

  return res.json({
    success: true,
    data: { message: 'Logged out successfully' },
    timestamp: new Date(),
  });
});

/**
 * GET /auth/me
 * Return the currently authenticated user
 */
router.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(req.user!.id);

  if (error || !data.user) {
    return res.status(404).json({
      success: false,
      error: { code: 'USER_NOT_FOUND', message: 'User not found' },
      timestamp: new Date(),
    });
  }

  return res.json({
    success: true,
    data: {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name ?? null,
      planTier: data.user.user_metadata?.plan_tier ?? 'free',
      createdAt: data.user.created_at,
      updatedAt: data.user.updated_at ?? data.user.created_at,
    },
    timestamp: new Date(),
  });
});

export default router;
