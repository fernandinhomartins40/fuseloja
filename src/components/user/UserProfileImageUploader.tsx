
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Upload, X } from 'lucide-react';

interface UserProfileImageUploaderProps {
  imageUrl?: string;
  onImageChange: (url: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const UserProfileImageUploader: React.FC<UserProfileImageUploaderProps> = ({ 
  imageUrl, 
  onImageChange,
  size = 'md'
}) => {
  const [isDragging, setIsDragging] = useState(false);

  // Size mapping
  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32'
  };

  // Em um ambiente real, aqui você faria upload para um serviço de armazenamento
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulação de upload - na implementação real você faria upload da imagem
      // e receberia uma URL como resposta
      const fakeImageUrl = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 10000)}`;
      onImageChange(fakeImageUrl);
      
      // Simulação de alerta para o usuário saber que é apenas uma demonstração
      alert("Em um ambiente de produção, esta imagem seria enviada para o servidor. Para fins de demonstração, usaremos uma imagem de placeholder.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Similar ao upload via input
      const fakeImageUrl = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 10000)}`;
      onImageChange(fakeImageUrl);
      alert("Em um ambiente de produção, esta imagem seria enviada para o servidor. Para fins de demonstração, usaremos uma imagem de placeholder.");
    }
  };

  const handleRemoveImage = () => {
    onImageChange('');
  };

  const getInitials = () => {
    // Function to extract initials from the filename or default to 'U'
    return 'U';
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {imageUrl ? (
        <div className="relative">
          <Avatar className={`${sizeClasses[size]} border-2 border-primary`}>
            <AvatarImage src={imageUrl} alt="Foto de perfil" />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={handleRemoveImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div
          className={`
            ${sizeClasses[size]}
            border-2 border-dashed rounded-full flex items-center justify-center
            ${isDragging ? 'border-primary bg-primary/5' : 'border-muted'}
            cursor-pointer relative overflow-hidden
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-1/3 w-1/3 text-muted-foreground" />
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleImageUpload}
            aria-label="Enviar imagem de perfil"
          />
        </div>
      )}
      <span className="text-xs text-muted-foreground">
        {imageUrl ? 'Clique para trocar' : 'Adicionar foto'}
      </span>
    </div>
  );
};
