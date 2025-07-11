
import React, { useRef, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { EnhancedImageCropper } from './EnhancedImageCropper';
import { PendingImage, SmartUploadProfile } from '@/types/smartImageUpload';
import { validateImage } from '@/utils/imageValidation';
import { compressImage, getOptimalQuality } from '@/utils/imageCompression';
import { createManagedObjectUrl, memoryManager } from '@/utils/memoryManager';
import { toast } from '@/hooks/use-toast';
import { 
  Upload, 
  Trash2, 
  Crop, 
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Zap,
  Star
} from 'lucide-react';

interface UnifiedImageUploaderProps {
  profile?: SmartUploadProfile;
  multiple?: boolean;
  onImagesChange?: (images: PendingImage[]) => void;
  onImageProcessed?: (image: PendingImage) => void;
  className?: string;
  autoCompress?: boolean;
  showCompressionStats?: boolean;
  maxImages?: number;
}

export const UnifiedImageUploader: React.FC<UnifiedImageUploaderProps> = ({
  profile,
  multiple = false,
  onImagesChange,
  onImageProcessed,
  className = "",
  autoCompress = true,
  showCompressionStats = false,
  maxImages = 10
}) => {
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [currentCropImage, setCurrentCropImage] = useState<PendingImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File): Promise<PendingImage> => {
    // Validate the file
    const validation = await validateImage(file, {
      maxSize: profile ? profile.maxSize * 1024 * 1024 : 5 * 1024 * 1024,
      allowedFormats: profile?.allowedFormats,
      maxWidth: profile?.maxWidth,
      maxHeight: profile?.maxHeight,
      aspectRatio: profile?.aspectRatio
    });

    if (!validation.isValid) {
      throw new Error(validation.errors[0]);
    }

    // Create initial pending image
    const id = `pending_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const previewUrl = createManagedObjectUrl(file);
    
    let processedBlob: Blob = file;
    let croppedUrl: string | undefined;
    let compressionStats;

    // Auto-compress if enabled
    if (autoCompress && profile) {
      try {
        const quality = profile.quality ? profile.quality / 100 : getOptimalQuality(file.size);
        const compressionResult = await compressImage(file, {
          maxWidth: profile.maxWidth,
          maxHeight: profile.maxHeight,
          quality,
          format: file.type
        });
        
        processedBlob = compressionResult.blob;
        croppedUrl = createManagedObjectUrl(processedBlob);
        compressionStats = {
          originalSize: compressionResult.originalSize,
          compressedSize: compressionResult.compressedSize,
          compressionRatio: compressionResult.compressionRatio
        };
      } catch (error) {
        console.warn('Compression failed, using original file:', error);
      }
    }

    const pendingImage: PendingImage = {
      id,
      originalFile: file,
      previewUrl,
      croppedBlob: processedBlob !== file ? processedBlob : undefined,
      croppedUrl,
      isProcessed: !profile?.requiredCrop,
      compressionStats
    };

    // Register cleanup
    memoryManager.registerCleanup(id, () => {
      memoryManager.revokeObjectUrl(previewUrl);
      if (croppedUrl) {
        memoryManager.revokeObjectUrl(croppedUrl);
      }
    });

    return pendingImage;
  }, [profile, autoCompress]);

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    // Check limits
    if (!multiple && fileArray.length > 1) {
      toast({
        title: "Erro",
        description: "Apenas uma imagem é permitida",
        variant: "destructive"
      });
      return;
    }

    if (pendingImages.length + fileArray.length > maxImages) {
      toast({
        title: "Erro",
        description: `Máximo de ${maxImages} imagens permitidas`,
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProcessingProgress(0);

    try {
      const newImages: PendingImage[] = [];
      
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        setProcessingProgress((i / fileArray.length) * 100);
        
        const pendingImage = await processFile(file);
        newImages.push(pendingImage);
        
        // Notify about individual image processing
        onImageProcessed?.(pendingImage);
      }

      setPendingImages(prev => {
        const updated = multiple ? [...prev, ...newImages] : newImages;
        onImagesChange?.(updated);
        return updated;
      });

      // Auto-open crop for first image if required
      if (profile?.autoOpenCrop && newImages.length > 0 && profile.requiredCrop) {
        setCurrentCropImage(newImages[0]);
      }

      toast({
        title: "Sucesso",
        description: `${newImages.length} imagem(ns) processada(s) com sucesso`
      });

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao processar imagens';
      setError(message);
      toast({
        title: "Erro",
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  }, [multiple, maxImages, pendingImages.length, profile, processFile, onImageProcessed, onImagesChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removePendingImage = useCallback((imageId: string) => {
    setPendingImages(prev => {
      const updated = prev.filter(img => img.id !== imageId);
      memoryManager.cleanup(imageId);
      onImagesChange?.(updated);
      return updated;
    });
  }, [onImagesChange]);

  const openCropDialog = useCallback((imageId: string) => {
    const image = pendingImages.find(img => img.id === imageId);
    if (image) {
      setCurrentCropImage(image);
    }
  }, [pendingImages]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getImageDisplayUrl = (image: PendingImage): string => {
    return image.croppedUrl || image.previewUrl;
  };

  const canUploadMore = multiple ? pendingImages.length < maxImages : pendingImages.length === 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      {canUploadMore && (
        <div
          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">
            {multiple ? 'Adicionar Imagens' : 'Adicionar Imagem'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Clique aqui ou arraste e solte suas imagens
          </p>
          
          {profile && (
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Perfil:</strong> {profile.name}</p>
              <p><strong>Formatos:</strong> {profile.allowedFormats.join(', ')}</p>
              <p><strong>Tamanho máximo:</strong> {profile.maxSize}MB</p>
              <p><strong>Dimensões máximas:</strong> {profile.maxWidth}x{profile.maxHeight}px</p>
              {profile.aspectRatio && (
                <p><strong>Proporção:</strong> {profile.aspectRatio.toFixed(2)}:1</p>
              )}
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept={profile?.allowedFormats?.join(',') || 'image/*'}
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
            <span>Processando imagens...</span>
            <span>{Math.round(processingProgress)}%</span>
          </div>
          <Progress value={processingProgress} />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Images Grid */}
      {pendingImages.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              Imagens ({pendingImages.length}{multiple ? `/${maxImages}` : ''})
            </h4>
            {pendingImages.length > 1 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  pendingImages.forEach(img => memoryManager.cleanup(img.id));
                  setPendingImages([]);
                  onImagesChange?.([]);
                }}
              >
                Limpar Todas
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {pendingImages.map((image, index) => (
              <div
                key={image.id}
                className="relative group border rounded-lg overflow-hidden"
              >
                <AspectRatio ratio={profile?.aspectRatio || 1}>
                  <img
                    src={getImageDisplayUrl(image)}
                    alt="Upload preview"
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
                
                {/* Status and badges */}
                <div className="absolute top-2 left-2 flex gap-1">
                  {index === 0 && multiple && (
                    <Badge variant="default" className="text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      Principal
                    </Badge>
                  )}
                  
                  {image.isProcessed ? (
                    <Badge variant="secondary" className="text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      OK
                    </Badge>
                  ) : profile?.requiredCrop ? (
                    <Badge variant="destructive" className="text-xs">
                      <Crop className="w-3 h-3 mr-1" />
                      Recorte
                    </Badge>
                  ) : null}
                  
                  {autoCompress && image.compressionStats && (
                    <Badge variant="outline" className="text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      -{Math.round(image.compressionStats.compressionRatio)}%
                    </Badge>
                  )}
                </div>
                
                {/* Image info */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs">
                  <div>{formatFileSize(image.originalFile.size)}</div>
                  {showCompressionStats && image.compressionStats && (
                    <div>→ {formatFileSize(image.compressionStats.compressedSize)}</div>
                  )}
                </div>
                
                {/* Action buttons */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openCropDialog(image.id)}
                    title="Recortar"
                  >
                    <Crop className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removePendingImage(image.id)}
                    title="Remover"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Crop Dialog */}
      {currentCropImage && (
        <EnhancedImageCropper
          isOpen={!!currentCropImage}
          onClose={() => setCurrentCropImage(null)}
          imageUrl={currentCropImage.previewUrl}
          aspectRatio={profile?.aspectRatio}
          onCrop={async (settings) => {
            // Implementation for applying crop would go here
            setCurrentCropImage(null);
          }}
          showAdvancedControls={true}
          allowFreeform={!profile?.requiredCrop}
        />
      )}
    </div>
  );
};
