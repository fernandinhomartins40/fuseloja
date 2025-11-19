import React from 'react';
import { UnifiedImageUploader, DEFAULT_PROFILES } from '@/components/ui/unified-image-uploader';

interface UnifiedUserProfileImageUploaderProps {
  currentImageUrl?: string;
  onImageChange: (imageUrl: string) => void;
  userName?: string;
}

export const UnifiedUserProfileImageUploader: React.FC<UnifiedUserProfileImageUploaderProps> = ({
  currentImageUrl,
  onImageChange,
  userName = 'usuário'
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-4 text-foreground">Foto do Perfil</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Adicione uma foto para personalizar seu perfil
        </p>
      </div>

      <div className="w-full max-w-sm">
        <UnifiedImageUploader
          profile={DEFAULT_PROFILES.avatar}
          multiple={false}
          currentImages={currentImageUrl ? [currentImageUrl] : []}
          onImagesChange={(urls) => onImageChange(urls[0] || '')}
          onSingleImageChange={onImageChange}
          placeholder="Adicione sua foto de perfil"
        />
      </div>
    </div>
  );
};