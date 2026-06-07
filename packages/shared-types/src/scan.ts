import { z } from 'zod';

// Accept MongoDB ObjectId-like values and coerce to string
export const ObjectIdSchema = z.preprocess((val) => {
  if (val == null) return val;
  if (typeof val === 'string') return val;
  try {
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
  _id: ObjectIdSchema.optional(), // MongoDB ObjectId
  userId: ObjectIdSchema,
  image_base64: z.string(), // Full image as Base64
  status: ScanStatusSchema,
  ocrResult: OCRResultSchema.optional(),
  matchResult: MatchResultSchema.optional(),
  createdAt: DateLikeSchema.default(() => new Date()),
  updatedAt: DateLikeSchema.default(() => new Date()),
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
