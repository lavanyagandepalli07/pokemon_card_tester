import { z } from 'zod';

export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z
    .object({
      code: z.string(),
      message: z.string(),
      details: z.unknown().optional(),
    })
    .optional(),
  timestamp: z.date(),
});

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: Date;
};

/**
 * Helper to create success response
 */
export function successResponse<T>(data: T, timestamp = new Date()): ApiResponse<T> {
  return {
    success: true,
    data,
    timestamp,
  };
}

/**
 * Helper to create error response
 */
export function errorResponse(
  code: string,
  message: string,
  details?: unknown,
  timestamp = new Date()
): ApiResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp,
  };
}
