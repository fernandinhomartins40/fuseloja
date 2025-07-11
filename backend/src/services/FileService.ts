import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import config from '../utils/config';
import { TokenHelper, HashHelper } from '../utils/crypto';
import { FileUpload } from '../types/index.js';
import { ValidationError, NotFoundError } from '../middleware/errorHandler';
import logger from '../utils/logger';

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const mkdir = promisify(fs.mkdir);
const stat = promisify(fs.stat);

export class FileService {
  private uploadPath: string;
  private allowedTypes: string[];
  private maxFileSize: number;

  constructor() {
    this.uploadPath = config.uploadPath;
    this.allowedTypes = config.allowedFileTypes;
    this.maxFileSize = config.maxFileSize;
    
    this.ensureUploadDirectories();
  }

  private async ensureUploadDirectories(): Promise<void> {
    try {
      const directories = [
        this.uploadPath,
        path.join(this.uploadPath, 'avatars'),
        path.join(this.uploadPath, 'documents'),
        path.join(this.uploadPath, 'images'),
        path.join(this.uploadPath, 'temp'),
        path.join(this.uploadPath, 'thumbnails')
      ];

      for (const dir of directories) {
        if (!fs.existsSync(dir)) {
          await mkdir(dir, { recursive: true });
        }
      }

      logger.info('Upload directories initialized');
    } catch (error) {
      logger.error('Failed to create upload directories', error);
      throw error;
    }
  }

  // Multer configuration for file uploads
  getMulterConfig(options: {
    destination?: string;
    allowedTypes?: string[];
    maxSize?: number;
    maxFiles?: number;
  } = {}) {
    const {
      destination = 'temp',
      allowedTypes = this.allowedTypes,
      maxSize = this.maxFileSize,
      maxFiles = 1
    } = options;

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadDir = path.join(this.uploadPath, destination);
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
      }
    });

    const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase().substring(1);
      
      if (!allowedTypes.includes(ext)) {
        return cb(new ValidationError(`File type .${ext} is not allowed`));
      }
      
      cb(null, true);
    };

    return multer({
      storage,
      fileFilter,
      limits: {
        fileSize: maxSize,
        files: maxFiles
      }
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    userId: string,
    options: {
      folder?: string;
      isPublic?: boolean;
      processImage?: boolean;
      generateThumbnail?: boolean;
    } = {}
  ): Promise<FileUpload> {
    try {
      const {
        folder = 'documents',
        isPublic = false,
        processImage = false,
        generateThumbnail = false
      } = options;

      // Generate unique ID and filename
      const fileId = TokenHelper.generateUUID();
      const fileHash = HashHelper.sha256(file.buffer?.toString('hex') || file.path || file.originalname);
      const ext = path.extname(file.originalname);
      const filename = `${fileId}${ext}`;
      const finalPath = path.join(this.uploadPath, folder, filename);

      // Ensure destination directory exists
      const destDir = path.dirname(finalPath);
      if (!fs.existsSync(destDir)) {
        await mkdir(destDir, { recursive: true });
      }

      // Move file to final location if it's a temp upload
      if (file.path && file.path.includes('/temp/')) {
        fs.renameSync(file.path, finalPath);
      } else if (file.buffer) {
        await writeFile(finalPath, file.buffer);
      }

      // Process image if needed
      if (processImage && this.isImage(file.mimetype)) {
        await this.processImage(finalPath);
      }

      // Generate thumbnail if needed
      if (generateThumbnail && this.isImage(file.mimetype)) {
        await this.generateThumbnail(finalPath, filename);
      }

      // Create file record
      const fileRecord: FileUpload = {
        id: fileId,
        originalName: file.originalname,
        filename,
        mimetype: file.mimetype,
        size: file.size,
        path: finalPath,
        folder,
        uploadedBy: userId,
        isPublic,
        createdAt: new Date()
      };

      logger.info('File uploaded successfully', {
        fileId,
        filename: file.originalname,
        size: file.size,
        userId
      });

      return fileRecord;
    } catch (error) {
      logger.error('File upload failed', {
        filename: file.originalname,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async uploadAvatar(file: Express.Multer.File, userId: string): Promise<FileUpload> {
    try {
      if (!this.isImage(file.mimetype)) {
        throw new ValidationError('Avatar must be an image file');
      }

      const fileRecord = await this.uploadFile(file, userId, {
        folder: 'avatars',
        isPublic: true,
        processImage: true,
        generateThumbnail: true
      });

      // Resize avatar to standard sizes
      await this.resizeImage(fileRecord.path, { width: 200, height: 200 });

      return fileRecord;
    } catch (error) {
      logger.error('Avatar upload failed', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async deleteFile(fileId: string, userId?: string): Promise<boolean> {
    try {
      // In a real implementation, you would:
      // 1. Get file record from database
      // 2. Check ownership if userId provided
      // 3. Delete file and thumbnails
      
      // For now, we'll simulate the deletion
      logger.info('File deleted', { fileId, userId });
      return true;
    } catch (error) {
      logger.error('File deletion failed', {
        fileId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  async getFileUrl(fileId: string, userId?: string): Promise<string> {
    try {
      // In a real implementation, get file from database and check permissions
      // For now, return a simulated URL
      return `/api/v1/files/${fileId}`;
    } catch (error) {
      throw new NotFoundError('File not found');
    }
  }

  async getFileStream(filePath: string): Promise<fs.ReadStream> {
    try {
      if (!fs.existsSync(filePath)) {
        throw new NotFoundError('File not found');
      }

      return fs.createReadStream(filePath);
    } catch (error) {
      logger.error('Failed to get file stream', { filePath, error });
      throw error;
    }
  }

  async getFileInfo(filePath: string): Promise<{ size: number; mtime: Date }> {
    try {
      const stats = await stat(filePath);
      return {
        size: stats.size,
        mtime: stats.mtime
      };
    } catch (error) {
      throw new NotFoundError('File not found');
    }
  }

  // Image processing methods
  private async processImage(filePath: string): Promise<void> {
    try {
      const image = sharp(filePath);
      const metadata = await image.metadata();

      // Auto-rotate based on EXIF data
      const processedImage = image.rotate();

      // Optimize image
      if (metadata.format === 'jpeg') {
        await processedImage.jpeg({ quality: 85, progressive: true }).toFile(filePath + '.tmp');
      } else if (metadata.format === 'png') {
        await processedImage.png({ compressionLevel: 8 }).toFile(filePath + '.tmp');
      } else if (metadata.format === 'webp') {
        await processedImage.webp({ quality: 85 }).toFile(filePath + '.tmp');
      }

      // Replace original with processed version
      if (fs.existsSync(filePath + '.tmp')) {
        fs.renameSync(filePath + '.tmp', filePath);
      }

      logger.debug('Image processed successfully', { filePath });
    } catch (error) {
      logger.error('Image processing failed', { filePath, error });
      // Don't throw error, just log it
    }
  }

  private async generateThumbnail(filePath: string, filename: string): Promise<void> {
    try {
      const thumbnailDir = path.join(this.uploadPath, 'thumbnails');
      const thumbnailPath = path.join(thumbnailDir, filename);

      await sharp(filePath)
        .resize(150, 150, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath);

      logger.debug('Thumbnail generated', { filePath, thumbnailPath });
    } catch (error) {
      logger.error('Thumbnail generation failed', { filePath, error });
    }
  }

  private async resizeImage(
    filePath: string,
    options: { width?: number; height?: number; quality?: number }
  ): Promise<void> {
    try {
      const { width, height, quality = 85 } = options;

      const image = sharp(filePath);
      const resized = image.resize(width, height, {
        fit: 'cover',
        position: 'center'
      });

      await resized.jpeg({ quality }).toFile(filePath + '.resized');
      fs.renameSync(filePath + '.resized', filePath);

      logger.debug('Image resized', { filePath, width, height });
    } catch (error) {
      logger.error('Image resize failed', { filePath, error });
      throw error;
    }
  }

  // Utility methods
  private isImage(mimetype: string): boolean {
    return mimetype.startsWith('image/');
  }

  private isDocument(mimetype: string): boolean {
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    return documentTypes.includes(mimetype);
  }

  async getStorageStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    availableSpace: number;
    folders: Array<{ name: string; size: number; fileCount: number }>;
  }> {
    try {
      // This is a simplified implementation
      // In production, you'd calculate these from the database and filesystem
      
      const folders = ['avatars', 'documents', 'images', 'temp', 'thumbnails'];
      const folderStats = [];
      let totalSize = 0;
      let totalFiles = 0;

      for (const folder of folders) {
        const folderPath = path.join(this.uploadPath, folder);
        if (fs.existsSync(folderPath)) {
          const files = fs.readdirSync(folderPath);
          let folderSize = 0;
          
          for (const file of files) {
            const filePath = path.join(folderPath, file);
            const stats = fs.statSync(filePath);
            if (stats.isFile()) {
              folderSize += stats.size;
            }
          }

          folderStats.push({
            name: folder,
            size: folderSize,
            fileCount: files.length
          });

          totalSize += folderSize;
          totalFiles += files.length;
        } else {
          folderStats.push({
            name: folder,
            size: 0,
            fileCount: 0
          });
        }
      }

      return {
        totalFiles,
        totalSize,
        availableSpace: 1024 * 1024 * 1024 * 10, // 10GB simulated
        folders: folderStats
      };
    } catch (error) {
      logger.error('Failed to get storage stats', error);
      throw error;
    }
  }

  async cleanupTempFiles(): Promise<void> {
    try {
      const tempDir = path.join(this.uploadPath, 'temp');
      if (!fs.existsSync(tempDir)) return;

      const files = fs.readdirSync(tempDir);
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      for (const file of files) {
        const filePath = path.join(tempDir, file);
        const stats = fs.statSync(filePath);
        
        if (now - stats.mtime.getTime() > maxAge) {
          await unlink(filePath);
          logger.debug('Temporary file cleaned up', { filePath });
        }
      }

      logger.info('Temporary files cleanup completed');
    } catch (error) {
      logger.error('Failed to cleanup temporary files', error);
    }
  }

  // Virus scanning placeholder (would integrate with actual antivirus)
  async scanFile(filePath: string): Promise<{ clean: boolean; threats?: string[] }> {
    try {
      // This is a placeholder for virus scanning
      // In production, you'd integrate with services like:
      // - ClamAV
      // - VirusTotal API
      // - AWS GuardDuty
      
      logger.debug('File scan completed (simulated)', { filePath });
      return { clean: true };
    } catch (error) {
      logger.error('File scan failed', { filePath, error });
      return { clean: false, threats: ['scan_failed'] };
    }
  }
}

export default FileService; 