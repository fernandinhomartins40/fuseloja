
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ImageCropper } from './ImageCropper';
import { useImageUpload } from '@/hooks/useImageUpload';
import { ImageUploadOptions, ProcessedImage, CropSettings } from '@/types/imageUpload';
import { 
  Upload, 
  Trash2, 
  Crop, 
  Star,
  Eye,
  ImageIcon,
  AlertCircle
} from 'lucide-react';

interface UniversalImageUploaderProps {
  options?: ImageUploadOptions;
  onImagesChange?: (images: ProcessedImage[]) => void;
  onMainImageChange?: (image: ProcessedImage | null) => void;
  initialImages?: ProcessedImage[];
  initialMainImage?: ProcessedImage | null;
  className?: string;
}

export const UniversalImageUploader: React.FC<UniversalImageUploaderProps> = ({
  options,
  onImagesChange,
  onMainImageChange,
  initialImages = [],
  initialMainImage,
  className = ""
}) => {
  const { 
    images, 
    isUploading, 
    progress, 
    error, 
    addImages, 
    removeImage, 
    updateImage,
    clearImages 
  } = useImageUpload(options);
  
  const [mainImage, setMainImage] = useState<ProcessedImage | null>(initialMainImage || null);
  const [cropImage, setCropImage] = useState<ProcessedImage | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update parent components when images change
  React.useEffect(() => {
    onImagesChange?.(images);
  }, [images, onImagesChange]);

  React.useEffect(() => {
    onMainImageChange?.(mainImage);
  }, [mainImage, onMainImageChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addImages(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      addImages(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSetAsMain = (image: ProcessedImage) => {
    setMainImage(image);
  };

  const handleCropClick = (image: ProcessedImage) => {
    setCropImage(image);
    setShowCropper(true);
  };

  const handleCropComplete = async (settings: CropSettings) => {
    if (cropImage) {
      await updateImage(cropImage.id, settings);
      setShowCropper(false);
      setCropImage(null);
    }
  };

  const handleRemoveImage = (imageId: string) => {
    const imageToRemove = images.find(img => img.id === imageId);
    if (imageToRemove === mainImage) {
      const remainingImages = images.filter(img => img.id !== imageId);
      setMainImage(remainingImages.length > 0 ? remainingImages[0] : null);
    }
    removeImage(imageId);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">
          {options?.multiple ? 'Adicionar Imagens' : 'Adicionar Imagem'}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Clique aqui ou arraste e solte suas imagens
        </p>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Formatos suportados: {options?.allowedFormats?.join(', ') || 'JPG, PNG, WEBP'}</p>
          <p>Tamanho máximo: {options?.maxSize || 5}MB</p>
          {options?.maxWidth && options?.maxHeight && (
            <p>Dimensões máximas: {options.maxWidth}x{options.maxHeight}px</p>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept={options?.allowedFormats?.join(',') || 'image/*'}
          multiple={options?.multiple}
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Processando imagens...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Main Image Preview */}
      {mainImage && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Imagem Principal</h4>
          <div className="relative border rounded-lg overflow-hidden">
            <AspectRatio ratio={16 / 9}>
              <img
                src={mainImage.dataUrl}
                alt="Imagem principal"
                className="w-full h-full object-cover"
              />
            </AspectRatio>
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
              Principal
            </div>
          </div>
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              Imagens ({images.length})
            </h4>
            {images.length > 1 && (
              <Button variant="outline" size="sm" onClick={clearImages}>
                Limpar Todas
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((image) => (
              <div
                key={image.id}
                className={`relative group border rounded-lg overflow-hidden ${
                  image === mainImage ? 'ring-2 ring-primary' : ''
                }`}
              >
                <AspectRatio ratio={1}>
                  <img
                    src={image.dataUrl}
                    alt="Upload"
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
                
                {/* Image Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs">
                  <div>{image.width}x{image.height}</div>
                  <div>{formatFileSize(image.size)}</div>
                </div>
                
                {/* Action Buttons */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  {image !== mainImage && (
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleSetAsMain(image)}
                      title="Definir como principal"
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                  )}
                  
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleCropClick(image)}
                    title="Recortar"
                  >
                    <Crop className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRemoveImage(image.id)}
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

      {/* Image Cropper Dialog */}
      {cropImage && (
        <ImageCropper
          isOpen={showCropper}
          onClose={() => {
            setShowCropper(false);
            setCropImage(null);
          }}
          imageUrl={cropImage.dataUrl}
          aspectRatio={options?.aspectRatio}
          onCrop={handleCropComplete}
        />
      )}
    </div>
  );
};
