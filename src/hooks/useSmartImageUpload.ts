
import { useState, useCallback, useRef } from 'react';
import { SmartImageUploadState, PendingImage, SmartImageUploadOptions, SmartUploadProfile } from '@/types/smartImageUpload';
import { CropSettings } from '@/types/imageUpload';
import { toast } from '@/hooks/use-toast';

export const useSmartImageUpload = (options: SmartImageUploadOptions = {}) => {
  const [state, setState] = useState<SmartImageUploadState>({
    pendingImages: [],
    isProcessing: false,
    error: null,
    currentCropImage: null
  });

  const profile = options.profile;
  const onImagesReadyRef = useRef(options.onImagesReady);
  onImagesReadyRef.current = options.onImagesReady;

  const validateFile = useCallback((file: File): { isValid: boolean; error?: string } => {
    if (!profile) return { isValid: true };

    // Check file size
    if (file.size > (profile.maxSize * 1024 * 1024)) {
      return { isValid: false, error: `Arquivo muito grande. Máximo: ${profile.maxSize}MB` };
    }

    // Check format
    if (!profile.allowedFormats.includes(file.type)) {
      return { isValid: false, error: `Formato não suportado. Use: ${profile.allowedFormats.join(', ')}` };
    }

    return { isValid: true };
  }, [profile]);

  const createPendingImage = useCallback(async (file: File): Promise<PendingImage> => {
    const previewUrl = URL.createObjectURL(file);
    
    return {
      id: `pending_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      originalFile: file,
      previewUrl,
      isProcessed: false
    };
  }, []);

  const processImageWithCrop = useCallback(async (
    pendingImage: PendingImage, 
    cropSettings: CropSettings
  ): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Calculate the actual crop dimensions relative to the original image
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d')!;
        
        // Create a temporary container to calculate display dimensions
        const containerWidth = 800; // Approximate container width
        const containerHeight = 384; // Approximate container height (h-96)
        
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const containerAspect = containerWidth / containerHeight;
        
        let displayWidth, displayHeight, offsetX, offsetY;
        
        if (imgAspect > containerAspect) {
          displayWidth = containerWidth;
          displayHeight = containerWidth / imgAspect;
          offsetX = 0;
          offsetY = (containerHeight - displayHeight) / 2;
        } else {
          displayHeight = containerHeight;
          displayWidth = containerHeight * imgAspect;
          offsetX = (containerWidth - displayWidth) / 2;
          offsetY = 0;
        }
        
        // Calculate scale factors from display to natural image size
        const scaleX = img.naturalWidth / displayWidth;
        const scaleY = img.naturalHeight / displayHeight;
        
        // Map crop coordinates from display space to natural image space
        const naturalCropX = (cropSettings.x - offsetX) * scaleX;
        const naturalCropY = (cropSettings.y - offsetY) * scaleY;
        const naturalCropWidth = cropSettings.width * scaleX;
        const naturalCropHeight = cropSettings.height * scaleY;
        
        // Ensure crop is within image bounds
        const clampedX = Math.max(0, Math.min(naturalCropX, img.naturalWidth));
        const clampedY = Math.max(0, Math.min(naturalCropY, img.naturalHeight));
        const clampedWidth = Math.min(naturalCropWidth, img.naturalWidth - clampedX);
        const clampedHeight = Math.min(naturalCropHeight, img.naturalHeight - clampedY);
        
        // Set canvas size to desired output dimensions
        const outputWidth = profile?.maxWidth || cropSettings.width;
        const outputHeight = profile?.maxHeight || cropSettings.height;
        
        canvas.width = outputWidth;
        canvas.height = outputHeight;
        
        // Apply transformations
        ctx.save();
        
        // Handle rotation
        if (cropSettings.rotate) {
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((cropSettings.rotate * Math.PI) / 180);
          ctx.translate(-canvas.width / 2, -canvas.height / 2);
        }
        
        // Apply scale
        const scale = cropSettings.scale || 1;
        if (scale !== 1) {
          ctx.scale(scale, scale);
        }
        
        // Draw the cropped portion of the image
        ctx.drawImage(
          img,
          clampedX,
          clampedY,
          clampedWidth,
          clampedHeight,
          0,
          0,
          canvas.width,
          canvas.height
        );
        
        ctx.restore();
        
        canvas.toBlob(
          (blob) => resolve(blob!), 
          pendingImage.originalFile.type, 
          (profile?.quality || 85) / 100
        );
      };
      
      img.src = pendingImage.previewUrl;
    });
  }, [profile]);

  const notifyImagesReady = useCallback((updatedImages: PendingImage[]) => {
    const processedImages = updatedImages.filter(img => img.isProcessed || !profile?.requiredCrop);
    onImagesReadyRef.current?.(processedImages);
  }, [profile]);

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    if (!options.multiple && fileArray.length > 1) {
      toast({
        title: "Erro",
        description: "Apenas uma imagem é permitida",
        variant: "destructive"
      });
      return;
    }

    setState(prev => ({ ...prev, isProcessing: true, error: null }));

    try {
      const newPendingImages: PendingImage[] = [];

      for (const file of fileArray) {
        const validation = validateFile(file);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }

        const pendingImage = await createPendingImage(file);
        newPendingImages.push(pendingImage);
      }

      setState(prev => {
        const updatedImages = options.multiple 
          ? [...prev.pendingImages, ...newPendingImages]
          : newPendingImages;
        
        // Notify parent with a delay to prevent infinite loops
        setTimeout(() => notifyImagesReady(updatedImages), 0);
        
        return {
          ...prev,
          pendingImages: updatedImages,
          isProcessing: false,
          currentCropImage: profile?.autoOpenCrop && newPendingImages.length > 0 ? newPendingImages[0] : prev.currentCropImage
        };
      });

    } catch (error) {
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: error instanceof Error ? error.message : 'Erro ao processar imagem'
      }));

      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : 'Erro ao processar imagem',
        variant: "destructive"
      });
    }
  }, [options.multiple, profile, validateFile, createPendingImage, notifyImagesReady]);

  const openCropDialog = useCallback((imageId: string) => {
    const image = state.pendingImages.find(img => img.id === imageId);
    if (image) {
      setState(prev => ({ ...prev, currentCropImage: image }));
    }
  }, [state.pendingImages]);

  const applyCrop = useCallback(async (cropSettings: CropSettings) => {
    if (!state.currentCropImage) return;

    setState(prev => ({ ...prev, isProcessing: true }));

    try {
      const croppedBlob = await processImageWithCrop(state.currentCropImage, cropSettings);
      const croppedUrl = URL.createObjectURL(croppedBlob);

      setState(prev => {
        const updatedImages = prev.pendingImages.map(img => 
          img.id === state.currentCropImage!.id
            ? { 
                ...img, 
                croppedBlob, 
                croppedUrl, 
                cropSettings, 
                isProcessed: true 
              }
            : img
        );

        // Notify parent with a delay to prevent infinite loops
        setTimeout(() => notifyImagesReady(updatedImages), 0);

        return {
          ...prev,
          pendingImages: updatedImages,
          currentCropImage: null,
          isProcessing: false
        };
      });

      const updatedImage = state.pendingImages.find(img => img.id === state.currentCropImage.id);
      if (updatedImage) {
        options.onImageProcessed?.({ 
          ...updatedImage, 
          croppedBlob, 
          croppedUrl, 
          cropSettings, 
          isProcessed: true 
        });
      }

      toast({
        title: "Sucesso",
        description: "Imagem recortada com sucesso"
      });

    } catch (error) {
      setState(prev => ({ ...prev, isProcessing: false }));
      toast({
        title: "Erro",
        description: "Erro ao aplicar recorte",
        variant: "destructive"
      });
    }
  }, [state.currentCropImage, state.pendingImages, processImageWithCrop, options, notifyImagesReady]);

  const removePendingImage = useCallback((imageId: string) => {
    setState(prev => {
      const imageToRemove = prev.pendingImages.find(img => img.id === imageId);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
        if (imageToRemove.croppedUrl) {
          URL.revokeObjectURL(imageToRemove.croppedUrl);
        }
      }

      const updatedImages = prev.pendingImages.filter(img => img.id !== imageId);
      
      // Notify parent with a delay to prevent infinite loops
      setTimeout(() => notifyImagesReady(updatedImages), 0);

      return {
        ...prev,
        pendingImages: updatedImages
      };
    });
  }, [notifyImagesReady]);

  const clearAllImages = useCallback(() => {
    state.pendingImages.forEach(img => {
      URL.revokeObjectURL(img.previewUrl);
      if (img.croppedUrl) {
        URL.revokeObjectURL(img.croppedUrl);
      }
    });

    setState({
      pendingImages: [],
      isProcessing: false,
      error: null,
      currentCropImage: null
    });

    // Notify parent with empty array
    setTimeout(() => notifyImagesReady([]), 0);
  }, [state.pendingImages, notifyImagesReady]);

  const closeCropDialog = useCallback(() => {
    setState(prev => ({ ...prev, currentCropImage: null }));
  }, []);

  const getProcessedImages = useCallback((): PendingImage[] => {
    return state.pendingImages.filter(img => img.isProcessed || !profile?.requiredCrop);
  }, [state.pendingImages, profile]);

  return {
    ...state,
    addFiles,
    openCropDialog,
    applyCrop,
    closeCropDialog,
    removePendingImage,
    clearAllImages,
    getProcessedImages,
    profile
  };
};
