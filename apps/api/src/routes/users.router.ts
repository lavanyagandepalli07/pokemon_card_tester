import { Router, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware';
import { UpdateProfileSchema } from '@pokemon-card-auth/shared-types';

const router = Router();

/**
 * GET /users/profile
 * Return authenticated user's profile
 */
router.get('/profile', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(req.user!.id);

  if (error || !data.user) {
    return res.status(404).json({
      success: false,
      error: { code: 'USER_NOT_FOUND', message: 'User profile not found' },
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

/**
 * PATCH /users/profile
 * Update name or email for the authenticated user
 */
router.patch('/profile', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const parsed = UpdateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: parsed.error.flatten(),
      },
      timestamp: new Date(),
    });
  }

  const { name, email } = parsed.data;

  // Build update payload
  const updatePayload: Record<string, unknown> = {};
  if (email) updatePayload.email = email;
  if (name !== undefined) {
    updatePayload.user_metadata = { name };
  }

  if (Object.keys(updatePayload).length === 0) {
    return res.status(400).json({
      success: false,
      error: { code: 'NO_CHANGES', message: 'No fields to update provided' },
      timestamp: new Date(),
    });
  }

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    req.user!.id,
    updatePayload
  );

  if (error || !data.user) {
    const msg = error?.message?.includes('already registered')
      ? 'Email already in use'
      : error?.message ?? 'Update failed';
    return res.status(400).json({
      success: false,
      error: { code: 'UPDATE_FAILED', message: msg },
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
