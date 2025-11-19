/**
 * Upload Controller
 * File upload endpoints
 */

import { Request, Response, NextFunction } from 'express';
import { UploadService } from '../services/upload.service';
import { success } from '../utils/response';
import { ValidationError } from '../utils/errors';

export class UploadController {
  private uploadService: UploadService;

  constructor() {
    this.uploadService = new UploadService();
  }

  /**
   * Upload single file
   * POST /api/v1/upload/single
   */
  uploadSingle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        throw new ValidationError('Nenhum arquivo foi enviado');
      }

      const result = await this.uploadService.processUpload(req.file);
      success(res, result, 'Arquivo enviado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Upload multiple files
   * POST /api/v1/upload/multiple
   */
  uploadMultiple = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        throw new ValidationError('Nenhum arquivo foi enviado');
      }

      const results = await this.uploadService.processMultipleUploads(req.files);
      success(res, results, 'Arquivos enviados com sucesso', 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete file
   * DELETE /api/v1/upload/:filename
   */
  deleteFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { filename } = req.params;
      await this.uploadService.deleteUpload(filename);
      success(res, null, 'Arquivo deletado com sucesso');
    } catch (error) {
      next(error);
    }
  };
}
