
import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Crop, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SimpleCropper } from './SimpleCropper';
import { toast } from '@/hooks/use-toast';

interface SimpleImageUploaderProps {
  onImageChange: (imageUrl: string) => void;
  currentImage?: string;
  aspectRatio?: number;
  maxSize?: number; // MB
  quality?: number;
  placeholder?: string;
  className?: string;
}

interface ProcessedImage {
  file: File;
  previewUrl: string;
  compressedUrl?: string;
  finalUrl: string;
}

export const SimpleImageUploader: React.FC<SimpleImageUploaderProps> = ({
  onImageChange,
  currentImage,
  aspectRatio = 1,
  maxSize = 5,
  quality = 85,
  placeholder = "Clique ou arraste uma imagem aqui",
  className = ""
}) => {
  const [image, setImage] = useState<ProcessedImage | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = useCallback(async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Calculate optimal dimensions
        let { width, height } = img;
        const maxDimension = 1200;
        
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedUrl = URL.createObjectURL(blob);
              resolve(compressedUrl);
            }
          },
          'image/jpeg',
          quality / 100
        );
      };
      
      img.src = URL.createObjectURL(file);
    });
  }, [quality]);

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: `O arquivo deve ter no máximo ${maxSize}MB`,
        variant: "destructive"
      });
      return false;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione uma imagem válida",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const processFile = async (file: File) => {
    if (!validateFile(file)) return;

    setIsProcessing(true);
    
    try {
      const previewUrl = URL.createObjectURL(file);
      const compressedUrl = await compressImage(file);
      
      const processedImage: ProcessedImage = {
        file,
        previewUrl,
        compressedUrl,
        finalUrl: compressedUrl
      };
      
      setImage(processedImage);
      
      // Auto-open cropper if aspect ratio is specified
      if (aspectRatio !== 1) {
        setShowCropper(true);
      } else {
        // Use compressed image directly
        onImageChange(compressedUrl);
      }
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao processar a imagem",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    if (image) {
      setImage(prev => prev ? { ...prev, finalUrl: croppedImageUrl } : null);
      onImageChange(croppedImageUrl);
    }
    setShowCropper(false);
    
    toast({
      title: "Sucesso",
      description: "Imagem processada com sucesso"
    });
  };

  const removeImage = () => {
    if (image) {
      URL.revokeObjectURL(image.previewUrl);
      if (image.compressedUrl) {
        URL.revokeObjectURL(image.compressedUrl);
      }
    }
    setImage(null);
    onImageChange('');
    setShowCropper(false);
  };

  const openCropper = () => {
    setShowCropper(true);
  };

  // Show current image from props if no local image
  const displayImage = image?.finalUrl || currentImage;

  return (
    <div className={`space-y-4 ${className}`}>
      {!displayImage ? (
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}
            ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            {isProcessing ? 'Processando...' : placeholder}
          </p>
          <p className="text-sm text-gray-500">
            Máximo {maxSize}MB • JPG, PNG, WebP
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Image Preview */}
          <div className="relative">
            <div 
              className="border rounded-lg overflow-hidden bg-gray-50"
              style={{ aspectRatio: aspectRatio }}
            >
              <img
                src={displayImage}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={openCropper}
                className="bg-white/90 hover:bg-white"
              >
                <Crop className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={removeImage}
                className="bg-white/90 hover:bg-red-50 text-red-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              Trocar Imagem
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={openCropper}
            >
              <Crop className="h-4 w-4 mr-2" />
              Recortar
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* Cropper Modal */}
      {showCropper && image && (
        <SimpleCropper
          imageUrl={image.compressedUrl || image.previewUrl}
          aspectRatio={aspectRatio}
          onCropComplete={handleCropComplete}
          onCancel={() => setShowCropper(false)}
        />
      )}
    </div>
  );
};
