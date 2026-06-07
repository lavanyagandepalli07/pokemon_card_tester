import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware';
import { CreateScanSchema, UpdateOCRSchema } from '@pokemon-card-auth/shared-types';
import Queue from 'bull';
import { Scan } from '../models';

const router = Router();
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const scanQueue = new Queue('scan-queue', redisUrl);

/**
 * POST /scans
 * Create a scan with a Base64 image payload
 */
router.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const parsed = CreateScanSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: parsed.error.flatten() },
      timestamp: new Date(),
    });
  }

  const { image_base64 } = parsed.data;
  const userId = req.user!.id;

  try {
    const scan = await Scan.create({
      userId,
      image_base64,
      status: 'pending',
    });

    await scanQueue.add('process-scan', { scanId: scan._id.toString() });

    return res.status(201).json({
      success: true,
      data: scan,
      timestamp: new Date(),
    });
  } catch (err: any) {
    console.error('Failed to create scan:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SCAN_CREATION_FAILED', message: err.message || 'Failed to initiate scan' },
      timestamp: new Date(),
    });
  }
});

/**
 * GET /scans/:scanId
 * Get scan details & status
 */
router.get('/:scanId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { scanId } = req.params;
  const userId = req.user!.id;

  try {
    const scan = await Scan.findById(scanId).lean();

    if (!scan || scan.userId !== userId) {
      return res.status(404).json({
        success: false,
        error: { code: 'SCAN_NOT_FOUND', message: 'Scan not found or access denied' },
        timestamp: new Date(),
      });
    }

    return res.json({ success: true, data: scan, timestamp: new Date() });
  } catch (err: any) {
    console.error('Failed to get scan:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'GET_SCAN_FAILED', message: err.message || 'Failed to retrieve scan' },
      timestamp: new Date(),
    });
  }
});

/**
 * GET /scans
 * Get user's scan history
 */
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const limit = Number(req.query.limit) || 20;
  const offset = Number(req.query.offset) || 0;
  const status = req.query.status as string | undefined;

  try {
    const filter: any = { userId };
    if (status) filter.status = status;

    const [scans, total] = await Promise.all([
      Scan.find(filter).sort({ createdAt: -1 }).skip(offset).limit(limit).lean(),
      Scan.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      data: {
        scans,
        pagination: {
          total,
          limit,
          offset,
        },
      },
      timestamp: new Date(),
    });
  } catch (err: any) {
    console.error('Failed to list scans:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'LIST_SCANS_FAILED', message: err.message || 'Failed to retrieve scan history' },
      timestamp: new Date(),
    });
  }
});

/**
 * PATCH /scans/:scanId/ocr
 * Update OCR results and rerun match
 */
router.patch('/:scanId/ocr', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { scanId } = req.params;
  const userId = req.user!.id;

  const parsed = UpdateOCRSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: parsed.error.flatten() },
      timestamp: new Date(),
    });
  }

  try {
    const scan = await Scan.findById(scanId);
    if (!scan || scan.userId !== userId) {
      return res.status(404).json({
        success: false,
        error: { code: 'SCAN_NOT_FOUND', message: 'Scan not found or access denied' },
        timestamp: new Date(),
      });
    }

    const currentOcr = scan.ocrResult ?? ({} as {
      cardName?: string;
      set?: string;
      cardNumber?: string;
      hp?: number;
      type?: string;
      rawText?: string;
    });
    const updatedOcr = {
      ...currentOcr,
      cardName: parsed.data.cardName ?? currentOcr.cardName ?? '',
      set: parsed.data.set ?? currentOcr.set ?? '',
      cardNumber: parsed.data.cardNumber ?? currentOcr.cardNumber ?? '',
      hp: parsed.data.hp ?? currentOcr.hp,
      type: parsed.data.type ?? currentOcr.type,
      confidence: 1.0,
      rawText: currentOcr.rawText ?? '',
    };

    scan.ocrResult = updatedOcr;
    scan.status = 'ocr_complete';
    await scan.save();

    await scanQueue.add('process-match', { scanId: scan._id.toString(), ocrResult: updatedOcr });

    return res.json({ success: true, data: scan, timestamp: new Date() });
  } catch (err: any) {
    console.error('Failed to update OCR and rerun match:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'OCR_UPDATE_FAILED', message: err.message || 'Failed to update OCR results' },
      timestamp: new Date(),
    });
  }
});

export default router;
