import { z } from 'zod';

export const ScanStatusSchema = z.enum([
  'pending',
  'processing',
  'ocr_complete',
  'matching',
  'completed',
  'failed',
]);

export type ScanStatus = z.infer<typeof ScanStatusSchema>;

export const OCRResultSchema = z.object({
  cardName: z.string(),
  set: z.string(),
  cardNumber: z.string(),
  hp: z.number().optional(),
  type: z.string().optional(),
  confidence: z.number().min(0).max(1),
  rawText: z.string(),
});

export type OCRResult = z.infer<typeof OCRResultSchema>;

export const MatchResultSchema = z.object({
  cardName: z.string(),
  setId: z.string(),
  confidence: z.number().min(0).max(1),
  alternatives: z.array(
    z.object({
      cardName: z.string(),
      setId: z.string(),
      confidence: z.number().min(0).max(1),
    })
  ),
});

export type MatchResult = z.infer<typeof MatchResultSchema>;

export const ScanSchema = z.object({
  _id: z.string().optional(), // MongoDB ObjectId
  userId: z.string(),
  image_base64: z.string(), // Full image as Base64
  status: ScanStatusSchema,
  ocrResult: OCRResultSchema.optional(),
  matchResult: MatchResultSchema.optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type Scan = z.infer<typeof ScanSchema>;

export const CreateScanSchema = z.object({
  image_base64: z.string(),
});

export type CreateScan = z.infer<typeof CreateScanSchema>;

export const UpdateOCRSchema = z.object({
  cardName: z.string().optional(),
  set: z.string().optional(),
  cardNumber: z.string().optional(),
  hp: z.number().optional(),
  type: z.string().optional(),
});

export type UpdateOCR = z.infer<typeof UpdateOCRSchema>;
