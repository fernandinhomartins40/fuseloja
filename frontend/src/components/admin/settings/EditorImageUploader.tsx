
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Upload, Link, X, Image as ImageIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EditorImageUploaderProps {
  onImageInsert: (imageUrl: string, altText?: string) => void;
}

export const EditorImageUploader: React.FC<EditorImageUploaderProps> = ({ onImageInsert }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // Create a local URL for preview
      const localUrl = URL.createObjectURL(file);
      setImageUrl(localUrl);
    }
  };

  const handleUrlInsert = () => {
    if (imageUrl) {
      onImageInsert(imageUrl, altText);
      setImageUrl('');
      setAltText('');
      setIsOpen(false);
    }
  };

  const handleFileInsert = () => {
    if (uploadedFile && imageUrl) {
      onImageInsert(imageUrl, altText);
      setUploadedFile(null);
      setImageUrl('');
      setAltText('');
      setIsOpen(false);
    }
  };

  const stockImages = [
    { url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=300', alt: 'Natureza' },
    { url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=300', alt: 'Paisagem' },
    { url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300', alt: 'Flores' },
    { url: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=300', alt: 'Montanhas' },
    { url: 'https://images.unsplash.com/photo-1527576539890-dfa815648363?w=300', alt: 'Arquitetura' },
    { url: 'https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=300', alt: 'Edifício' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ImageIcon className="h-4 w-4 mr-2" />
          Inserir Imagem
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Inserir Imagem</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="url">URL</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="stock">Banco de Imagens</TabsTrigger>
          </TabsList>
          
          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-url">URL da Imagem</Label>
              <Input
                id="image-url"
                placeholder="https://example.com/imagem.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alt-text">Texto Alternativo (Alt)</Label>
              <Input
                id="alt-text"
                placeholder="Descrição da imagem"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
              />
            </div>
            {imageUrl && (
              <div className="mt-4">
                <Label>Preview:</Label>
                <img 
                  src={imageUrl} 
                  alt={altText || 'Preview'} 
                  className="mt-2 max-w-full h-32 object-cover rounded-md border" 
                />
              </div>
            )}
            <Button onClick={handleUrlInsert} disabled={!imageUrl}>
              <Link className="h-4 w-4 mr-2" />
              Inserir Imagem
            </Button>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Selecionar Arquivo</Label>
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alt-text-upload">Texto Alternativo (Alt)</Label>
              <Input
                id="alt-text-upload"
                placeholder="Descrição da imagem"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
              />
            </div>
            {uploadedFile && imageUrl && (
              <div className="mt-4">
                <Label>Preview:</Label>
                <img 
                  src={imageUrl} 
                  alt={altText || 'Preview'} 
                  className="mt-2 max-w-full h-32 object-cover rounded-md border" 
                />
              </div>
            )}
            <Button onClick={handleFileInsert} disabled={!uploadedFile}>
              <Upload className="h-4 w-4 mr-2" />
              Fazer Upload e Inserir
            </Button>
          </TabsContent>
          
          <TabsContent value="stock" className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {stockImages.map((image, index) => (
                <Card key={index} className="p-2 cursor-pointer hover:bg-gray-50" onClick={() => {
                  setImageUrl(image.url);
                  setAltText(image.alt);
                }}>
                  <img 
                    src={image.url} 
                    alt={image.alt} 
                    className="w-full h-20 object-cover rounded" 
                  />
                  <p className="text-xs text-center mt-1">{image.alt}</p>
                </Card>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="alt-text-stock">Texto Alternativo (Alt)</Label>
              <Input
                id="alt-text-stock"
                placeholder="Descrição da imagem"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
              />
            </div>
            <Button onClick={handleUrlInsert} disabled={!imageUrl}>
              <ImageIcon className="h-4 w-4 mr-2" />
              Inserir Imagem Selecionada
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
