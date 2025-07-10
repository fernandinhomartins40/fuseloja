import React from 'react';
import { UnifiedImageUploader, DEFAULT_PROFILES } from '@/components/ui/unified-image-uploader';

interface UnifiedProductImageUploaderProps {
  images: string[];
  mainImage: string;
  onImagesChange: (images: string[]) => void;
  onMainImageChange: (image: string) => void;
}

export const UnifiedProductImageUploader: React.FC<UnifiedProductImageUploaderProps> = ({
  images,
  mainImage,
  onImagesChange,
  onMainImageChange
}) => {
  return (
    <div className="space-y-6">
      {/* Main Product Image */}
      <div>
        <h3 className="text-lg font-medium mb-4 text-foreground">Imagem Principal do Produto</h3>
        <UnifiedImageUploader
          profile={DEFAULT_PROFILES.product}
          multiple={false}
          currentImages={mainImage ? [mainImage] : []}
          onImagesChange={(urls) => onMainImageChange(urls[0] || '')}
          onSingleImageChange={onMainImageChange}
          placeholder="Adicione a imagem principal do produto"
        />
      </div>

      {/* Additional Product Images */}
      <div>
        <h3 className="text-lg font-medium mb-4 text-foreground">Galeria de Imagens</h3>
        <UnifiedImageUploader
          profile={DEFAULT_PROFILES.product}
          multiple={true}
          currentImages={images}
          onImagesChange={onImagesChange}
          placeholder="Adicione imagens adicionais do produto"
        />
      </div>
    </div>
  );
};