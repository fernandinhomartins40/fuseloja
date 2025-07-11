
export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: string;
}

export interface CompressionResult {
  blob: Blob;
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

export const compressImage = async (
  file: File | Blob,
  options: CompressionOptions = {}
): Promise<CompressionResult> => {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.85,
    format = 'image/jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      const aspectRatio = width / height;
      
      if (width > maxWidth) {
        width = maxWidth;
        height = width / aspectRatio;
      }
      
      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }
          
          const dataUrl = canvas.toDataURL(format, quality);
          const originalSize = file.size;
          const compressedSize = blob.size;
          const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;
          
          resolve({
            blob,
            dataUrl,
            originalSize,
            compressedSize,
            compressionRatio
          });
        },
        format,
        quality
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const getOptimalQuality = (fileSize: number): number => {
  // Auto-adjust quality based on file size
  if (fileSize > 5 * 1024 * 1024) return 0.7; // 5MB+
  if (fileSize > 2 * 1024 * 1024) return 0.8; // 2MB+
  if (fileSize > 1 * 1024 * 1024) return 0.85; // 1MB+
  return 0.9; // Less than 1MB
};
