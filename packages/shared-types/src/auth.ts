import { z } from 'zod';

// Accept MongoDB ObjectId-like values and coerce to string
export const ObjectIdSchema = z.preprocess((val) => {
  if (val == null) return val;
  if (typeof val === 'string') return val;
  try {
    // Some ObjectId implementations have a toString method
    return (val as any).toString();
  } catch (e) {
    return val;
  }
}, z.string());

// Accept Date or ISO string and coerce to Date
export const DateLikeSchema = z.preprocess((val) => {
  if (val instanceof Date) return val;
  if (typeof val === 'string' || typeof val === 'number') return new Date(val);
  return val;
}, z.date());

export const PlanTierSchema = z.enum(['free', 'pro', 'pro_plus']);
export type PlanTier = z.infer<typeof PlanTierSchema>;

export const UserSchema = z.object({
  _id: ObjectIdSchema.optional(), // MongoDB ObjectId
  supabaseId: z.string().optional(),
  email: z.string().email(),
  name: z.string().optional(),
  planTier: PlanTierSchema.default('free'),
  createdAt: DateLikeSchema.default(() => new Date()),
  updatedAt: DateLikeSchema.default(() => new Date()),
});

export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(1).max(100).optional(),
});

export type CreateUser = z.infer<typeof CreateUserSchema>;

export const LoginCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;

export const TokenSchema = z.object({
  token: z.string(),
  expiresIn: z.string(),
});

export type Token = z.infer<typeof TokenSchema>;

export const UpdateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
});

export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;

export const AuthResponseSchema = z.object({
  user: UserSchema,
  accessToken: z.string(),
  expiresAt: z.number(),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;
