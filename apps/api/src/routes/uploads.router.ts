import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware';
import { ScanUpload } from '../models';

const UPLOAD_DIR = path.resolve(process.cwd(), process.env.UPLOAD_DIR || './public/uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: (Number(process.env.MAX_UPLOAD_SIZE_MB) || 50) * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error(`Invalid file type: ${file.mimetype}. Only JPEG, PNG and WebP are allowed.`));
  },
});

const router = Router();

/**
 * POST /uploads
 * Upload a card image directly (multipart/form-data, field: "image")
 */
router.post(
  '/',
  requireAuth,
  (req, res, next) => {
    upload.single('image')(req, res, err => {
      if (err) {
        return res.status(400).json({
          success: false,
          error: { code: 'UPLOAD_ERROR', message: err.message },
          timestamp: new Date(),
        });
      }
      return next();
    });
  },
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_FILE', message: 'No image file attached. Use field name "image".' },
        timestamp: new Date(),
      });
    }

    try {
      const doc = await ScanUpload.create({
        userId: req.user!.id,
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        status: 'completed',
      });

      const apiUrl = process.env.API_URL || 'http://localhost:3001';
      return res.status(201).json({
        success: true,
        data: {
          uploadId: doc._id,
          filename: doc.filename,
          imageUrl: `${apiUrl}/static-uploads/${doc.filename}`,
        },
        timestamp: new Date(),
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'DB_ERROR', message: err.message },
        timestamp: new Date(),
      });
    }
  }
);

export default router;
