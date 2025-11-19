
export interface ImageUploadOptions {
  maxSize?: number; // in MB
  allowedFormats?: string[];
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-100
  aspectRatio?: number;
  multiple?: boolean;
  autoUpload?: boolean; // ✅ Upload automático para backend
}

export interface CropSettings {
  x: number;
  y: number;
  width: number;
  height: number;
  scale?: number;
  rotate?: number;
}

export interface ProcessedImage {
  id: string;
  originalFile: File;
  processedBlob: Blob;
  dataUrl: string;
  finalUrl?: string; // ✅ URL final após upload para backend
  width: number;
  height: number;
  size: number;
  format: string;
}

export interface ImageUploadState {
  images: ProcessedImage[];
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export interface ImageValidationResult {
  isValid: boolean;
  errors: string[];
}
