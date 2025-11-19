
import { SmartUploadProfile } from '@/types/smartImageUpload';

export const UPLOAD_PROFILES: Record<string, SmartUploadProfile> = {
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
    name: 'Avatar do Usuário',
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
  
  gallery: {
    id: 'gallery',
    name: 'Galeria',
    aspectRatio: 1,
    maxWidth: 800,
    maxHeight: 800,
    quality: 85,
    maxSize: 5,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
    autoOpenCrop: true,
    requiredCrop: true
  }
};

export const getUploadProfile = (profileId: string): SmartUploadProfile => {
  return UPLOAD_PROFILES[profileId] || UPLOAD_PROFILES.product;
};
