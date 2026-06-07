import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import { CreateScanSchema, UpdateOCRSchema } from '@pokemon-card-auth/shared-types';
import Queue from 'bull';

const router = Router();

// Connect to Redis for Bull Queue
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const scanQueue = new Queue('scan-queue', redisUrl);

/**
 * POST /scans
 * Initiate a scan for an upload
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

  const { uploadId } = parsed.data;
  const userId = req.user!.id;

  try {
    const upload = await prisma.scanUpload.findUnique({
      where: { id: uploadId },
    });

    if (!upload || upload.userId !== userId) {
      return res.status(404).json({
        success: false,
        error: { code: 'UPLOAD_NOT_FOUND', message: 'Upload not found or access denied' },
        timestamp: new Date(),
      });
    }

    // Create a Scan record
    const scan = await prisma.scan.create({
      data: {
        userId,
        uploadId,
        status: 'pending',
      },
    });

    // Add job to Bull queue
    await scanQueue.add('process-scan', {
      scanId: scan.id,
      uploadKey: upload.s3Key,
    });

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
    const scan = await prisma.scan.findUnique({
      where: { id: scanId },
      include: { upload: true },
    });

    if (!scan || scan.userId !== userId) {
      return res.status(404).json({
        success: false,
        error: { code: 'SCAN_NOT_FOUND', message: 'Scan not found or access denied' },
        timestamp: new Date(),
      });
    }

    return res.json({
      success: true,
      data: scan,
      timestamp: new Date(),
    });
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
    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const [scans, total] = await prisma.$transaction([
      prisma.scan.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: { upload: true },
      }),
      prisma.scan.count({ where }),
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
    const scan = await prisma.scan.findUnique({
      where: { id: scanId },
      include: { upload: true },
    });

    if (!scan || scan.userId !== userId) {
      return res.status(404).json({
        success: false,
        error: { code: 'SCAN_NOT_FOUND', message: 'Scan not found or access denied' },
        timestamp: new Date(),
      });
    }

    // Merge new OCR values into existing ocrResult
    const currentOcr: any = scan.ocrResult || {};
    const updatedOcr = {
      ...currentOcr,
      cardName: parsed.data.cardName ?? currentOcr.cardName ?? '',
      set: parsed.data.set ?? currentOcr.set ?? '',
      cardNumber: parsed.data.cardNumber ?? currentOcr.cardNumber ?? '',
      hp: parsed.data.hp ?? currentOcr.hp,
      type: parsed.data.type ?? currentOcr.type,
      confidence: 1.0, // Manual correction sets confidence to 100%
    };

    // Update scan status and ocrResult in DB
    const updatedScan = await prisma.scan.update({
      where: { id: scanId },
      data: {
        ocrResult: updatedOcr,
        status: 'ocr_complete',
      },
    });

    // Enqueue match-only job (we skip OCR because it was manually corrected)
    await scanQueue.add('process-match', {
      scanId: scan.id,
      ocrResult: updatedOcr,
    });

    return res.json({
      success: true,
      data: updatedScan,
      timestamp: new Date(),
    });
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
