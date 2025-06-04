
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ImageCropper } from './ImageCropper';
import { useSmartImageUpload } from '@/hooks/useSmartImageUpload';
import { SmartImageUploadOptions, PendingImage } from '@/types/smartImageUpload';
import { 
  Upload, 
  Trash2, 
  Crop, 
  CheckCircle,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';

interface SmartImageUploaderProps extends SmartImageUploadOptions {
  onImagesChange?: (images: PendingImage[]) => void;
  className?: string;
}

export const SmartImageUploader: React.FC<SmartImageUploaderProps> = ({
  onImagesChange,
  className = "",
  ...options
}) => {
  const { 
    pendingImages,
    isProcessing,
    error,
    currentCropImage,
    profile,
    addFiles,
    openCropDialog,
    applyCrop,
    closeCropDialog,
    removePendingImage,
    clearAllImages,
    getProcessedImages
  } = useSmartImageUpload(options);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Notify parent of changes
  React.useEffect(() => {
    onImagesChange?.(getProcessedImages());
  }, [pendingImages, onImagesChange, getProcessedImages]);

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

  const canUploadMore = !options.multiple || pendingImages.length === 0;

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
            {options.multiple ? 'Adicionar Imagens' : 'Adicionar Imagem'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Clique aqui ou arraste e solte suas imagens
          </p>
          
          {profile && (
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Perfil: {profile.name}</p>
              <p>Formatos: {profile.allowedFormats.join(', ')}</p>
              <p>Tamanho máximo: {profile.maxSize}MB</p>
              <p>Dimensões máximas: {profile.maxWidth}x{profile.maxHeight}px</p>
              {profile.aspectRatio && (
                <p>Proporção: {profile.aspectRatio.toFixed(2)}:1</p>
              )}
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept={profile?.allowedFormats?.join(',') || 'image/*'}
            multiple={options.multiple}
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
          </div>
          <Progress value={100} className="animate-pulse" />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Pending Images Grid */}
      {pendingImages.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              Imagens ({pendingImages.length})
              {profile?.requiredCrop && (
                <span className="text-xs text-muted-foreground ml-2">
                  (Recorte obrigatório)
                </span>
              )}
            </h4>
            {pendingImages.length > 1 && (
              <Button variant="outline" size="sm" onClick={clearAllImages}>
                Limpar Todas
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {pendingImages.map((image) => (
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
                
                {/* Status Indicators */}
                <div className="absolute top-2 left-2 flex gap-1">
                  {image.isProcessed ? (
                    <div className="bg-green-500 text-white p-1 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                    </div>
                  ) : profile?.requiredCrop ? (
                    <div className="bg-orange-500 text-white p-1 rounded-full">
                      <Crop className="w-3 h-3" />
                    </div>
                  ) : null}
                </div>
                
                {/* Image Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs">
                  <div>{formatFileSize(image.originalFile.size)}</div>
                  {image.cropSettings && (
                    <div>{image.cropSettings.width}x{image.cropSettings.height}</div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  {(!image.isProcessed || !profile?.requiredCrop) && (
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openCropDialog(image.id)}
                      title="Recortar"
                    >
                      <Crop className="w-4 h-4" />
                    </Button>
                  )}
                  
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

      {/* Crop Dialog */}
      {currentCropImage && (
        <ImageCropper
          isOpen={!!currentCropImage}
          onClose={closeCropDialog}
          imageUrl={currentCropImage.previewUrl}
          aspectRatio={profile?.aspectRatio}
          onCrop={applyCrop}
        />
      )}
    </div>
  );
};
