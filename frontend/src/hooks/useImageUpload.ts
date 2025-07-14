
import { useState, useCallback } from 'react';
import { 
  ImageUploadOptions, 
  ProcessedImage, 
  ImageUploadState,
  CropSettings,
  ImageValidationResult 
} from '@/types/imageUpload';
import { toast } from '@/hooks/use-toast';
import apiClient from '@/services/api';

// Função para fazer upload da imagem para o backend
const uploadImageToBackend = async (imageData: string, filename?: string): Promise<string> => {
  try {
    const response = await apiClient.post('/upload', { imageData, filename });
    return response.data.imageUrl;
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    throw error;
  }
};

const DEFAULT_OPTIONS: ImageUploadOptions = {
  maxSize: 5, // 5MB
  allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  quality: 80,
  multiple: false,
  autoUpload: true // Novo: upload automático
};

export const useImageUpload = (options: ImageUploadOptions = {}) => {
  const config = { ...DEFAULT_OPTIONS, ...options };
  
  const [state, setState] = useState<ImageUploadState>({
    images: [],
    isUploading: false,
    progress: 0,
    error: null
  });

  const validateImage = useCallback((file: File): ImageValidationResult => {
    const errors: string[] = [];
    
    // Check file size
    if (file.size > (config.maxSize! * 1024 * 1024)) {
      errors.push(`Arquivo muito grande. Máximo: ${config.maxSize}MB`);
    }
    
    // Check format
    if (!config.allowedFormats!.includes(file.type)) {
      errors.push(`Formato não suportado. Use: ${config.allowedFormats!.join(', ')}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }, [config]);

  const compressImage = useCallback(async (
    file: File, 
    quality: number = config.quality!,
    maxWidth?: number,
    maxHeight?: number
  ): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        let { width, height } = img;
        
        // Calculate new dimensions if limits are set
        if (maxWidth && width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (maxHeight && height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => resolve(blob!),
          file.type,
          quality / 100
        );
      };
      
      img.src = URL.createObjectURL(file);
    });
  }, [config.quality]);

  const cropImage = useCallback(async (
    image: ProcessedImage,
    cropSettings: CropSettings
  ): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        const { x, y, width, height } = cropSettings;
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(
          img,
          x, y, width, height,
          0, 0, width, height
        );
        
        canvas.toBlob(
          (blob) => resolve(blob!),
          image.format,
          config.quality! / 100
        );
      };
      
      img.src = image.dataUrl;
    });
  }, [config.quality]);

  const processFile = useCallback(async (file: File): Promise<ProcessedImage> => {
    const validation = validateImage(file);
    
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }
    
    const compressedBlob = await compressImage(
      file, 
      config.quality,
      config.maxWidth,
      config.maxHeight
    );
    
    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(compressedBlob);
    });
    
    // Get image dimensions
    const { width, height } = await new Promise<{ width: number; height: number }>((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.src = dataUrl;
    });
    
    let finalUrl = dataUrl;
    
    // Auto-upload se configurado
    if (config.autoUpload) {
      try {
        finalUrl = await uploadImageToBackend(dataUrl, file.name);
        toast({
          title: "Sucesso",
          description: "Imagem enviada com sucesso para o servidor"
        });
      } catch (error) {
        console.error('Erro no upload automático:', error);
        toast({
          title: "Aviso",
          description: "Imagem processada localmente. Upload será feito ao salvar.",
          variant: "destructive"
        });
      }
    }
    
    return {
      id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      originalFile: file,
      processedBlob: compressedBlob,
      dataUrl,
      finalUrl,
      width,
      height,
      size: compressedBlob.size,
      format: file.type
    };
  }, [validateImage, compressImage, config]);

  const addImages = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    if (!config.multiple && fileArray.length > 1) {
      toast({
        title: "Erro",
        description: "Apenas uma imagem é permitida",
        variant: "destructive"
      });
      return;
    }
    
    setState(prev => ({ ...prev, isUploading: true, error: null }));
    
    try {
      const processedImages: ProcessedImage[] = [];
      
      for (let i = 0; i < fileArray.length; i++) {
        setState(prev => ({ 
          ...prev, 
          progress: ((i + 1) / fileArray.length) * 100 
        }));
        
        const processedImage = await processFile(fileArray[i]);
        processedImages.push(processedImage);
      }
      
      setState(prev => ({
        ...prev,
        images: config.multiple ? [...prev.images, ...processedImages] : processedImages,
        isUploading: false,
        progress: 0
      }));
      
      toast({
        title: "Sucesso",
        description: `${processedImages.length} imagem(ns) processada(s) com sucesso`
      });
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        isUploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }));
      
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : 'Erro ao processar imagem',
        variant: "destructive"
      });
    }
  }, [config, processFile]);

  const removeImage = useCallback((imageId: string) => {
    setState(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }));
  }, []);

  const updateImage = useCallback(async (imageId: string, cropSettings: CropSettings) => {
    const image = state.images.find(img => img.id === imageId);
    if (!image) return;
    
    setState(prev => ({ ...prev, isUploading: true }));
    
    try {
      const croppedBlob = await cropImage(image, cropSettings);
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(croppedBlob);
      });
      
      let finalUrl = dataUrl;
      
      // Auto-upload se configurado
      if (config.autoUpload) {
        try {
          finalUrl = await uploadImageToBackend(dataUrl, `cropped_${image.id}`);
        } catch (error) {
          console.error('Erro no upload após crop:', error);
        }
      }
      
      const updatedImage: ProcessedImage = {
        ...image,
        processedBlob: croppedBlob,
        dataUrl,
        finalUrl,
        size: croppedBlob.size
      };
      
      setState(prev => ({
        ...prev,
        images: prev.images.map(img => img.id === imageId ? updatedImage : img),
        isUploading: false
      }));
      
    } catch (error) {
      setState(prev => ({ ...prev, isUploading: false }));
      toast({
        title: "Erro",
        description: "Erro ao aplicar recorte",
        variant: "destructive"
      });
    }
  }, [state.images, cropImage, config.autoUpload]);

  const clearImages = useCallback(() => {
    setState(prev => ({ ...prev, images: [] }));
  }, []);

  return {
    ...state,
    addImages,
    removeImage,
    updateImage,
    clearImages,
    compressImage,
    cropImage,
    uploadImageToBackend
  };
};
