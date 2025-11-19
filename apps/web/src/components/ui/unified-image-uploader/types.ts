export interface ImageUploadProfile {
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

export interface ProcessedImageData {
  id: string;
  file: File;
  previewUrl: string;
  croppedUrl?: string;
  finalUrl: string;
  isProcessed: boolean;
  cropSettings?: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
}

export interface UnifiedImageUploaderProps {
  profile?: ImageUploadProfile;
  multiple?: boolean;
  currentImages?: string[];
  onImagesChange: (images: string[]) => void;
  onSingleImageChange?: (imageUrl: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const DEFAULT_PROFILES: Record<string, ImageUploadProfile> = {
  product: {
    id: 'product',
    name: 'Produto',
    aspectRatio: 1,
    maxWidth: 800,
    maxHeight: 800,
    quality: 85,
    maxSize: 5,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
    autoOpenCrop: true,
    requiredCrop: true
  },
  avatar: {
    id: 'avatar',
    name: 'Avatar',
    aspectRatio: 1,
    maxWidth: 400,
    maxHeight: 400,
    quality: 90,
    maxSize: 3,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
    autoOpenCrop: true,
    requiredCrop: true
  },
  banner: {
    id: 'banner',
    name: 'Banner',
    aspectRatio: 16/9,
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 80,
    maxSize: 8,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
    autoOpenCrop: true,
    requiredCrop: false
  },
  logo: {
    id: 'logo',
    name: 'Logo',
    aspectRatio: 3/1,
    maxWidth: 800,
    maxHeight: 400,
    quality: 95,
    maxSize: 2,
    allowedFormats: ['image/png', 'image/svg+xml', 'image/jpeg'],
    autoOpenCrop: false,
    requiredCrop: false
  },
  general: {
    id: 'general',
    name: 'Geral',
    aspectRatio: 1,
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 85,
    maxSize: 5,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
    autoOpenCrop: false,
    requiredCrop: false
  }
};