import { z } from 'zod';

export const PlanTierSchema = z.enum(['free', 'pro', 'pro_plus']);
export type PlanTier = z.infer<typeof PlanTierSchema>;

export const UserSchema = z.object({
  _id: z.string().optional(), // MongoDB ObjectId
  supabaseId: z.string().optional(),
  email: z.string().email(),
  name: z.string().optional(),
  planTier: PlanTierSchema.default('free'),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
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
