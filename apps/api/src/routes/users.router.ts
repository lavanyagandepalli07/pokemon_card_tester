import { Router, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware';
import { UpdateProfileSchema } from '@pokemon-card-auth/shared-types';
import { User } from '../models';

const router = Router();

/**
 * GET /users/profile
 * Return authenticated user's profile from MongoDB + Supabase
 */
router.get('/profile', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const supabaseId = req.user!.id;
  const [profileDoc, supabaseResponse] = await Promise.all([
    User.findOne({ supabaseId }).lean(),
    supabaseAdmin.auth.admin.getUserById(supabaseId),
  ]);

  if (supabaseResponse.error || !supabaseResponse.data.user) {
    return res.status(404).json({
      success: false,
      error: { code: 'USER_NOT_FOUND', message: 'User profile not found' },
      timestamp: new Date(),
    });
  }

  const supabaseUser = supabaseResponse.data.user;
  const mergedProfile = {
    id: supabaseUser.id,
    email: supabaseUser.email,
    name: profileDoc?.name ?? supabaseUser.user_metadata?.name ?? null,
    planTier: profileDoc?.planTier ?? 'free',
    createdAt: supabaseUser.created_at,
    updatedAt: supabaseUser.updated_at ?? supabaseUser.created_at,
  };

  if (!profileDoc) {
    await User.create({
      supabaseId,
      email: supabaseUser.email ?? '',
      name: mergedProfile.name ?? '',
      planTier: mergedProfile.planTier,
    });
  }

  return res.json({ success: true, data: mergedProfile, timestamp: new Date() });
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
  const supabaseId = req.user!.id;
  const updatePayload: Record<string, unknown> = {};

  if (email) updatePayload.email = email;
  if (name !== undefined) updatePayload.user_metadata = { name };

  if (Object.keys(updatePayload).length === 0) {
    return res.status(400).json({
      success: false,
      error: { code: 'NO_CHANGES', message: 'No fields to update provided' },
      timestamp: new Date(),
    });
  }

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(supabaseId, updatePayload);

  if (error || !data.user) {
    const msg = error?.message?.includes('already registered') ? 'Email already in use' : error?.message ?? 'Update failed';
    return res.status(400).json({
      success: false,
      error: { code: 'UPDATE_FAILED', message: msg },
      timestamp: new Date(),
    });
  }

  await User.findOneAndUpdate(
    { supabaseId },
    {
      email: data.user.email ?? email ?? '',
      name: name ?? data.user.user_metadata?.name ?? '',
    },
    { upsert: true, new: true }
  );

  return res.json({
    success: true,
    data: {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name ?? null,
      planTier: 'free',
      createdAt: data.user.created_at,
      updatedAt: data.user.updated_at ?? data.user.created_at,
    },
    timestamp: new Date(),
  });
});

export default router;
