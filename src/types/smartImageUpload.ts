
import { ImageUploadOptions, ProcessedImage, CropSettings } from './imageUpload';

export interface SmartUploadProfile {
  id: string;
  name: string;
  aspectRatio: number;
  maxWidth: number;
  maxHeight: number;
  quality: number;
  maxSize: number; // MB
  allowedFormats: string[];
  autoOpenCrop: boolean;
  requiredCrop: boolean;
}

export interface CompressionStats {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

export interface PendingImage {
  id: string;
  originalFile: File;
  previewUrl: string;
  croppedBlob?: Blob;
  croppedUrl?: string;
  cropSettings?: CropSettings;
  isProcessed: boolean;
  compressionStats?: CompressionStats;
}

export interface SmartImageUploadState {
  pendingImages: PendingImage[];
  isProcessing: boolean;
  error: string | null;
  currentCropImage: PendingImage | null;
}

export interface SmartImageUploadOptions extends ImageUploadOptions {
  profile?: SmartUploadProfile;
  autoOpenCrop?: boolean;
  requiredCrop?: boolean;
  onImageProcessed?: (image: PendingImage) => void;
  onImagesReady?: (images: PendingImage[]) => void;
}
