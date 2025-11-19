/**
 * Upload Routes
 * File upload endpoints
 */

import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';
import { uploadSingle, uploadMultiple } from '../middleware/upload.middleware';
import { uploadLimiter } from '../middleware/rateLimit.middleware';

const router = Router();
const uploadController = new UploadController();

// All upload routes require admin authentication
router.use(authenticateToken, requireAdmin, uploadLimiter);

router.post(
  '/single',
  uploadSingle('file'),
  uploadController.uploadSingle
);

router.post(
  '/multiple',
  uploadMultiple('files', 10),
  uploadController.uploadMultiple
);

router.delete(
  '/:filename',
  uploadController.deleteFile
);

export default router;
