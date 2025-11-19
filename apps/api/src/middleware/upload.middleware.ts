/**
 * Upload Middleware
 * File upload handling using Multer
 */

import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import config from '../config';
import { ValidationError } from '../utils/errors';

/**
 * Storage configuration
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const sanitized = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    cb(null, `${sanitized}_${uuidv4()}${ext}`);
  },
});

/**
 * File filter
 */
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  // Check mime type
  if (config.upload.allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ValidationError('Tipo de arquivo não permitido', {
        allowedTypes: config.upload.allowedMimeTypes,
        receivedType: file.mimetype,
      })
    );
  }
};

/**
 * Multer configuration
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize,
    files: 10, // Max 10 files per request
  },
});

/**
 * Single file upload
 */
export const uploadSingle = (fieldName: string = 'file') => upload.single(fieldName);

/**
 * Multiple files upload
 */
export const uploadMultiple = (fieldName: string = 'files', maxCount: number = 10) =>
  upload.array(fieldName, maxCount);

/**
 * Multiple fields upload
 */
export const uploadFields = (fields: Array<{ name: string; maxCount?: number }>) =>
  upload.fields(fields);
