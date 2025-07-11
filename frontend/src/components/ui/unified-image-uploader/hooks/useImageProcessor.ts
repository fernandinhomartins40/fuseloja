import { useState, useCallback } from 'react';
import { ProcessedImageData, ImageUploadProfile } from '../types';
import { toast } from '@/hooks/use-toast';

interface UseImageProcessorProps {
  profile: ImageUploadProfile;
  onImagesChange: (images: ProcessedImageData[]) => void;
  multiple?: boolean;
}

export const useImageProcessor = ({ 
  profile, 
  onImagesChange, 
  multiple = false 
}: UseImageProcessorProps) => {
  const [images, setImages] = useState<ProcessedImageData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentCropImage, setCurrentCropImage] = useState<ProcessedImageData | null>(null);

  const compressImage = useCallback(async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        let { width, height } = img;
        
        // Respect max dimensions
        if (width > profile.maxWidth || height > profile.maxHeight) {
          const ratio = Math.min(profile.maxWidth / width, profile.maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(URL.createObjectURL(blob));
            }
          },
          'image/jpeg',
          profile.quality / 100
        );
      };
      
      img.src = URL.createObjectURL(file);
    });
  }, [profile]);

  const validateFile = useCallback((file: File): boolean => {
    // Check file size
    if (file.size > profile.maxSize * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: `O arquivo deve ter no máximo ${profile.maxSize}MB`,
        variant: "destructive"
      });
      return false;
    }

    // Check file type
    if (!profile.allowedFormats.some(format => file.type === format)) {
      toast({
        title: "Formato inválido",
        description: `Formatos aceitos: ${profile.allowedFormats.join(', ')}`,
        variant: "destructive"
      });
      return false;
    }

    return true;
  }, [profile]);

  const addFiles = useCallback(async (fileList: FileList) => {
    const validFiles = Array.from(fileList).filter(validateFile);
    
    if (validFiles.length === 0) return;

    // If not multiple, replace existing images
    if (!multiple) {
      // Cleanup existing URLs
      images.forEach(img => {
        URL.revokeObjectURL(img.previewUrl);
        if (img.croppedUrl) URL.revokeObjectURL(img.croppedUrl);
      });
      setImages([]);
    }

    setIsProcessing(true);

    try {
      const newImages: ProcessedImageData[] = [];

      for (const file of validFiles) {
        const previewUrl = URL.createObjectURL(file);
        const compressedUrl = await compressImage(file);
        
        const processedImage: ProcessedImageData = {
          id: `img_${Date.now()}_${Math.random()}`,
          file,
          previewUrl,
          finalUrl: compressedUrl,
          isProcessed: !profile.requiredCrop
        };

        newImages.push(processedImage);
      }

      const updatedImages = multiple ? [...images, ...newImages] : newImages;
      setImages(updatedImages);
      onImagesChange(updatedImages);

      // Auto-open cropper for first image if required
      if (profile.autoOpenCrop && newImages.length > 0) {
        setCurrentCropImage(newImages[0]);
      }

    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao processar as imagens",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [images, multiple, profile, compressImage, validateFile, onImagesChange]);

  const removeImage = useCallback((imageId: string) => {
    setImages(prev => {
      const updated = prev.filter(img => {
        if (img.id === imageId) {
          URL.revokeObjectURL(img.previewUrl);
          if (img.croppedUrl) URL.revokeObjectURL(img.croppedUrl);
          return false;
        }
        return true;
      });
      onImagesChange(updated);
      return updated;
    });
  }, [onImagesChange]);

  const openCropper = useCallback((imageId: string) => {
    const image = images.find(img => img.id === imageId);
    if (image) {
      setCurrentCropImage(image);
    }
  }, [images]);

  const applyCrop = useCallback((croppedImageUrl: string, cropSettings?: any) => {
    if (!currentCropImage) return;

    setImages(prev => {
      const updated = prev.map(img => {
        if (img.id === currentCropImage.id) {
          return {
            ...img,
            croppedUrl: croppedImageUrl,
            finalUrl: croppedImageUrl,
            isProcessed: true,
            cropSettings
          };
        }
        return img;
      });
      onImagesChange(updated);
      return updated;
    });

    setCurrentCropImage(null);
    
    toast({
      title: "Sucesso",
      description: "Imagem recortada com sucesso"
    });
  }, [currentCropImage, onImagesChange]);

  const clearAll = useCallback(() => {
    images.forEach(img => {
      URL.revokeObjectURL(img.previewUrl);
      if (img.croppedUrl) URL.revokeObjectURL(img.croppedUrl);
    });
    setImages([]);
    onImagesChange([]);
  }, [images, onImagesChange]);

  return {
    images,
    isProcessing,
    currentCropImage,
    addFiles,
    removeImage,
    openCropper,
    applyCrop,
    clearAll,
    closeCropper: () => setCurrentCropImage(null)
  };
};