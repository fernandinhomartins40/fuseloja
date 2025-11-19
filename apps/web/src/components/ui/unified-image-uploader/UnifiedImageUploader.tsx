import React, { useRef, useCallback } from 'react';
import { Upload, X, Crop, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Progress } from '@/components/ui/progress';
import { SimpleCropper } from '../SimpleCropper';
import { useImageProcessor } from './hooks/useImageProcessor';
import { UnifiedImageUploaderProps, DEFAULT_PROFILES, ProcessedImageData } from './types';

export const UnifiedImageUploader: React.FC<UnifiedImageUploaderProps> = ({
  profile = DEFAULT_PROFILES.general,
  multiple = false,
  currentImages = [],
  onImagesChange,
  onSingleImageChange,
  placeholder,
  className = "",
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleProcessedImagesChange = useCallback((images: ProcessedImageData[]) => {
    const urls = images.map(img => img.finalUrl);
    onImagesChange(urls);
    
    if (onSingleImageChange && !multiple) {
      onSingleImageChange(urls[0] || '');
    }
  }, [onImagesChange, onSingleImageChange, multiple]);

  const {
    images,
    isProcessing,
    currentCropImage,
    addFiles,
    removeImage,
    openCropper,
    applyCrop,
    clearAll,
    closeCropper
  } = useImageProcessor({
    profile,
    onImagesChange: handleProcessedImagesChange,
    multiple
  });

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && !disabled) {
      addFiles(e.target.files);
    }
  }, [addFiles, disabled]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && !disabled) {
      addFiles(e.dataTransfer.files);
    }
  }, [addFiles, disabled]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const defaultPlaceholder = multiple 
    ? `Adicionar ${profile.name}s` 
    : `Adicionar ${profile.name}`;

  const canUploadMore = multiple || images.length === 0;
  const displayImages = images.length > 0 ? images : 
    currentImages.map((url, index) => ({
      id: `current_${index}`,
      file: new File([], 'current'),
      previewUrl: url,
      finalUrl: url,
      isProcessed: true,
      cropSettings: undefined
    }));

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      {canUploadMore && (
        <div
          className={`
            border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
            ${disabled 
              ? 'border-muted bg-muted/50 cursor-not-allowed opacity-50' 
              : 'border-border hover:border-primary/50 cursor-pointer hover:bg-accent/50'
            }
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2 text-foreground">
            {placeholder || defaultPlaceholder}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Clique aqui ou arraste e solte suas imagens
          </p>
          
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Perfil: {profile.name}</p>
            <p>Formatos: {profile.allowedFormats.map(f => f.split('/')[1]).join(', ')}</p>
            <p>Tamanho máximo: {profile.maxSize}MB</p>
            <p>Dimensões máximas: {profile.maxWidth}x{profile.maxHeight}px</p>
            {profile.aspectRatio !== 1 && (
              <p>Proporção: {profile.aspectRatio.toFixed(2)}:1</p>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept={profile.allowedFormats.join(',')}
            multiple={multiple}
            className="hidden"
            onChange={handleFileSelect}
            disabled={disabled}
          />
        </div>
      )}

      {/* Processing Progress */}
      {isProcessing && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground">Processando imagens...</span>
          </div>
          <Progress value={100} className="animate-pulse" />
        </div>
      )}

      {/* Images Grid */}
      {displayImages.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">
              {multiple ? `Imagens (${displayImages.length})` : 'Imagem'}
              {profile.requiredCrop && (
                <span className="text-xs text-muted-foreground ml-2">
                  (Recorte obrigatório)
                </span>
              )}
            </h4>
            {displayImages.length > 1 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAll}
                disabled={disabled}
              >
                Limpar Todas
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {displayImages.map((image) => (
              <div
                key={image.id}
                className="relative group border border-border rounded-lg overflow-hidden bg-card"
              >
                <AspectRatio ratio={profile.aspectRatio}>
                  <img
                    src={image.finalUrl}
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
                  ) : profile.requiredCrop ? (
                    <div className="bg-orange-500 text-white p-1 rounded-full">
                      <AlertCircle className="w-3 h-3" />
                    </div>
                  ) : null}
                </div>
                
                {/* File Info */}
                {image.file.size > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs">
                    <div>{formatFileSize(image.file.size)}</div>
                    {image.cropSettings && (
                      <div>{image.cropSettings.width}x{image.cropSettings.height}</div>
                    )}
                  </div>
                )}
                
                {/* Action Buttons */}
                {!disabled && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openCropper(image.id)}
                      title="Recortar"
                    >
                      <Crop className="w-4 h-4" />
                    </Button>
                    
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
                )}
              </div>
            ))}
          </div>
          
          {/* Quick Upload More Button */}
          {multiple && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Adicionar Mais Imagens
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Crop Dialog */}
      {currentCropImage && (
        <SimpleCropper
          imageUrl={currentCropImage.previewUrl}
          aspectRatio={profile.aspectRatio}
          onCropComplete={(croppedUrl) => applyCrop(croppedUrl)}
          onCancel={closeCropper}
        />
      )}
    </div>
  );
};