
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

interface LogoUploaderProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  aspectRatio?: string;
  dimensions?: string;
  small?: boolean;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({ 
  imageUrl, 
  onImageChange,
  aspectRatio = "3/1",
  dimensions,
  small = false
}) => {
  const [isDragging, setIsDragging] = useState(false);

  // Em um ambiente real, aqui você faria upload para um serviço de armazenamento
  // Para este exemplo, usamos URLs de imagens locais/remotas
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

  return (
    <div className="space-y-2">
      {imageUrl ? (
        <div className="relative">
          <div 
            className={`border rounded-md overflow-hidden ${small ? 'h-16 w-16' : 'w-full'}`}
            style={{ aspectRatio: aspectRatio }}
          >
            <img 
              src={imageUrl} 
              alt="Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`
            border-2 border-dashed rounded-md flex flex-col items-center justify-center p-6
            ${isDragging ? 'border-primary bg-primary/5' : 'border-muted'}
            ${small ? 'h-32 w-32' : 'w-full'}
          `}
          style={{ aspectRatio: aspectRatio }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <div className="text-sm text-center">
            <p className="font-medium">Clique para selecionar</p>
            <p className="text-xs text-muted-foreground">ou arraste e solte</p>
            {dimensions && <p className="text-xs mt-1 text-muted-foreground">Tamanho recomendado: {dimensions}</p>}
          </div>
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleImageUpload}
          />
        </div>
      )}
    </div>
  );
};
