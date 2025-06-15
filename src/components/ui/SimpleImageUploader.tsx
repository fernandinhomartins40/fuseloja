
import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SimpleCropper } from './SimpleCropper';
import { compressImage } from '@/utils/imageCompression';
import { validateImage } from '@/utils/imageValidation';
import { toast } from '@/hooks/use-toast';
import { Upload, X, Crop, Download } from 'lucide-react';

export interface SimpleImage {
  id: string;
  file: File;
  previewUrl: string;
  processedUrl?: string;
  processedBlob?: Blob;
  compressed: boolean;
  originalSize: number;
  finalSize: number;
}

interface SimpleImageUploaderProps {
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  aspectRatio?: number;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  onImagesChange?: (images: SimpleImage[]) => void;
  allowedFormats?: string[];
  className?: string;
}

export const SimpleImageUploader: React.FC<SimpleImageUploaderProps> = ({
  multiple = false,
  maxFiles = 5,
  maxSizeMB = 5,
  aspectRatio,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 85,
  onImagesChange,
  allowedFormats = ['image/jpeg', 'image/png', 'image/webp'],
  className = ""
}) => {
  const [images, setImages] = useState<SimpleImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [cropImage, setCropImage] = useState<SimpleImage | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createSimpleImage = useCallback(async (file: File): Promise<SimpleImage> => {
    const id = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const previewUrl = URL.createObjectURL(file);
    
    return {
      id,
      file,
      previewUrl,
      compressed: false,
      originalSize: file.size,
      finalSize: file.size
    };
  }, []);

  const compressImageIfNeeded = useCallback(async (image: SimpleImage): Promise<SimpleImage> => {
    try {
      const result = await compressImage(image.file, {
        maxWidth,
        maxHeight,
        quality: quality / 100,
        format: image.file.type
      });

      const processedUrl = URL.createObjectURL(result.blob);
      
      return {
        ...image,
        processedUrl,
        processedBlob: result.blob,
        compressed: true,
        finalSize: result.blob.size
      };
    } catch (error) {
      console.warn('Compression failed, using original:', error);
      return image;
    }
  }, [maxWidth, maxHeight, quality]);

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    if (!multiple && fileArray.length > 1) {
      toast({
        title: "Erro",
        description: "Apenas uma imagem é permitida",
        variant: "destructive"
      });
      return;
    }

    if (images.length + fileArray.length > maxFiles) {
      toast({
        title: "Erro", 
        description: `Máximo de ${maxFiles} imagens permitidas`,
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      const newImages: SimpleImage[] = [];
      
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        setProcessingProgress((i / fileArray.length) * 50);

        // Validate file
        const validation = await validateImage(file, {
          maxSize: maxSizeMB * 1024 * 1024,
          allowedFormats
        });

        if (!validation.isValid) {
          throw new Error(validation.errors[0]);
        }

        // Create simple image
        const simpleImage = await createSimpleImage(file);
        
        // Compress if needed
        setProcessingProgress(50 + (i / fileArray.length) * 50);
        const processedImage = await compressImageIfNeeded(simpleImage);
        
        newImages.push(processedImage);
      }

      setImages(prev => {
        const updated = multiple ? [...prev, ...newImages] : newImages;
        onImagesChange?.(updated);
        return updated;
      });

      toast({
        title: "Sucesso",
        description: `${newImages.length} imagem(ns) processada(s)`
      });

    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : 'Erro ao processar imagens',
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  }, [images.length, maxFiles, multiple, maxSizeMB, allowedFormats, createSimpleImage, compressImageIfNeeded, onImagesChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeImage = useCallback((imageId: string) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === imageId);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
        if (imageToRemove.processedUrl) {
          URL.revokeObjectURL(imageToRemove.processedUrl);
        }
      }
      
      const updated = prev.filter(img => img.id !== imageId);
      onImagesChange?.(updated);
      return updated;
    });
  }, [onImagesChange]);

  const openCropper = useCallback((imageId: string) => {
    const image = images.find(img => img.id === imageId);
    if (image) {
      setCropImage(image);
    }
  }, [images]);

  const handleCropComplete = useCallback(async (croppedBlob: Blob) => {
    if (!cropImage) return;

    const processedUrl = URL.createObjectURL(croppedBlob);
    
    setImages(prev => {
      const updated = prev.map(img => 
        img.id === cropImage.id 
          ? { 
              ...img, 
              processedUrl, 
              processedBlob: croppedBlob,
              finalSize: croppedBlob.size,
              compressed: true 
            }
          : img
      );
      onImagesChange?.(updated);
      return updated;
    });

    setCropImage(null);
    
    toast({
      title: "Sucesso",
      description: "Imagem recortada com sucesso"
    });
  }, [cropImage, onImagesChange]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getDisplayUrl = (image: SimpleImage): string => {
    return image.processedUrl || image.previewUrl;
  };

  const canUploadMore = multiple ? images.length < maxFiles : images.length === 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      {canUploadMore && (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragOver 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">
            Adicionar {multiple ? 'Imagens' : 'Imagem'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Arraste e solte ou clique para selecionar
          </p>
          <div className="text-xs text-muted-foreground">
            <p>Formatos: {allowedFormats.join(', ')}</p>
            <p>Tamanho máximo: {maxSizeMB}MB</p>
            {multiple && <p>Até {maxFiles} imagens</p>}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept={allowedFormats.join(',')}
            multiple={multiple}
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      )}

      {/* Processing Progress */}
      {isProcessing && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Processando...</span>
            <span>{Math.round(processingProgress)}%</span>
          </div>
          <Progress value={processingProgress} />
        </div>
      )}

      {/* Images Preview */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              {images.length} imagem{images.length > 1 ? 's' : ''}
            </h4>
            {images.length > 1 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  images.forEach(img => {
                    URL.revokeObjectURL(img.previewUrl);
                    if (img.processedUrl) URL.revokeObjectURL(img.processedUrl);
                  });
                  setImages([]);
                  onImagesChange?.([]);
                }}
              >
                Limpar Todas
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((image) => (
              <div key={image.id} className="relative group border rounded-lg overflow-hidden">
                <div className="aspect-square">
                  <img
                    src={getDisplayUrl(image)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Size info */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs">
                  <div>{formatFileSize(image.originalSize)}</div>
                  {image.compressed && (
                    <div className="text-green-400">→ {formatFileSize(image.finalSize)}</div>
                  )}
                </div>
                
                {/* Action buttons */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {aspectRatio && (
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openCropper(image.id)}
                      title="Recortar"
                    >
                      <Crop className="w-4 h-4" />
                    </Button>
                  )}
                  
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeImage(image.id)}
                    title="Remover"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Simple Cropper */}
      {cropImage && (
        <SimpleCropper
          isOpen={!!cropImage}
          onClose={() => setCropImage(null)}
          imageUrl={cropImage.previewUrl}
          aspectRatio={aspectRatio}
          onCrop={handleCropComplete}
        />
      )}
    </div>
  );
};
