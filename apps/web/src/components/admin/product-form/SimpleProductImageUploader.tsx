
import React from 'react';
import { SimpleImageUploader } from '@/components/ui/SimpleImageUploader';

interface SimpleProductImageUploaderProps {
  images: string[];
  mainImage: string;
  onImagesChange: (images: string[]) => void;
  onMainImageChange: (image: string) => void;
}

const SimpleProductImageUploader: React.FC<SimpleProductImageUploaderProps> = ({
  images,
  mainImage,
  onImagesChange,
  onMainImageChange
}) => {
  const handleMainImageChange = (imageUrl: string) => {
    onMainImageChange(imageUrl);
    
    // Se não há imagem principal nas imagens da galeria, adiciona
    if (imageUrl && !images.includes(imageUrl)) {
      onImagesChange([imageUrl, ...images]);
    }
  };

  const handleGalleryImageAdd = (imageUrl: string) => {
    if (imageUrl && !images.includes(imageUrl)) {
      const newImages = [...images, imageUrl];
      onImagesChange(newImages);
      
      // Se não há imagem principal, define esta como principal
      if (!mainImage) {
        onMainImageChange(imageUrl);
      }
    }
  };

  const removeGalleryImage = (imageUrl: string) => {
    const newImages = images.filter(img => img !== imageUrl);
    onImagesChange(newImages);
    
    // Se a imagem removida era a principal, define a primeira como nova principal
    if (mainImage === imageUrl && newImages.length > 0) {
      onMainImageChange(newImages[0]);
    } else if (mainImage === imageUrl) {
      onMainImageChange('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Imagem Principal */}
      <div>
        <h3 className="text-lg font-medium mb-4">Imagem Principal do Produto</h3>
        <SimpleImageUploader
          onImageChange={handleMainImageChange}
          currentImage={mainImage}
          aspectRatio={1}
          maxSize={5}
          placeholder="Clique ou arraste a imagem principal aqui"
        />
        <p className="text-sm text-gray-500 mt-2">
          Esta será a imagem de destaque do produto. Formato quadrado recomendado.
        </p>
      </div>

      {/* Galeria de Imagens */}
      <div>
        <h3 className="text-lg font-medium mb-4">Galeria de Imagens</h3>
        
        {/* Imagens existentes */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square border rounded-lg overflow-hidden bg-gray-50">
                  <img
                    src={image}
                    alt={`Produto ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => removeGalleryImage(image)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
                {image === mainImage && (
                  <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    Principal
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Adicionar nova imagem */}
        <SimpleImageUploader
          onImageChange={handleGalleryImageAdd}
          aspectRatio={1}
          maxSize={5}
          placeholder="Adicionar imagem à galeria"
          className="border-2 border-dashed border-gray-200"
        />
        
        <p className="text-sm text-gray-500 mt-2">
          Adicione múltiplas imagens do produto. Os clientes poderão navegar entre elas.
        </p>
      </div>
    </div>
  );
};

export default SimpleProductImageUploader;
