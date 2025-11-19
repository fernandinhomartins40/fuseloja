/**
 * Upload Service
 * File upload management business logic
 */

import path from 'path';
import { ensureDir, deleteFile, generateUniqueFilename } from '../utils/file';
import { ValidationError } from '../utils/errors';
import config from '../config';

export class UploadService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'uploads');
  }

  /**
   * Initialize upload directory
   */
  async initialize(): Promise<void> {
    await ensureDir(this.uploadDir);
  }

  /**
   * Process uploaded file
   */
  async processUpload(file: Express.Multer.File): Promise<{
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    url: string;
  }> {
    // Validate file
    if (!file) {
      throw new ValidationError('Nenhum arquivo foi enviado');
    }

    // Check file size
    if (file.size > config.upload.maxFileSize) {
      await deleteFile(file.path);
      throw new ValidationError(
        `Arquivo muito grande. Tamanho máximo: ${config.upload.maxFileSize / 1024 / 1024}MB`
      );
    }

    // Check mime type
    if (!config.upload.allowedMimeTypes.includes(file.mimetype)) {
      await deleteFile(file.path);
      throw new ValidationError('Tipo de arquivo não permitido', {
        allowedTypes: config.upload.allowedMimeTypes,
        receivedType: file.mimetype,
      });
    }

    // Generate URL
    const url = `/uploads/${file.filename}`;

    return {
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url,
    };
  }

  /**
   * Process multiple uploaded files
   */
  async processMultipleUploads(files: Express.Multer.File[]): Promise<
    Array<{
      filename: string;
      originalName: string;
      mimetype: string;
      size: number;
      url: string;
    }>
  > {
    if (!files || files.length === 0) {
      throw new ValidationError('Nenhum arquivo foi enviado');
    }

    const results = [];

    for (const file of files) {
      try {
        const result = await this.processUpload(file);
        results.push(result);
      } catch (error) {
        // Delete already processed files on error
        for (const result of results) {
          await this.deleteUpload(result.filename);
        }
        throw error;
      }
    }

    return results;
  }

  /**
   * Delete uploaded file
   */
  async deleteUpload(filename: string): Promise<void> {
    const filePath = path.join(this.uploadDir, filename);
    await deleteFile(filePath);
  }

  /**
   * Delete multiple uploaded files
   */
  async deleteMultipleUploads(filenames: string[]): Promise<void> {
    for (const filename of filenames) {
      await this.deleteUpload(filename);
    }
  }

  /**
   * Get upload URL
   */
  getUploadUrl(filename: string): string {
    return `/uploads/${filename}`;
  }

  /**
   * Extract filename from URL
   */
  extractFilenameFromUrl(url: string): string | null {
    const match = url.match(/\/uploads\/(.+)$/);
    return match ? match[1] : null;
  }
}
