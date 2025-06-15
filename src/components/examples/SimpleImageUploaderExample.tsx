
import React, { useState } from 'react';
import { SimpleImageUploader, SimpleImage } from '@/components/ui/SimpleImageUploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const SimpleImageUploaderExample: React.FC = () => {
  const [singleImage, setSingleImage] = useState<SimpleImage[]>([]);
  const [multipleImages, setMultipleImages] = useState<SimpleImage[]>([]);
  const [productImages, setProductImages] = useState<SimpleImage[]>([]);
  const [avatarImages, setAvatarImages] = useState<SimpleImage[]>([]);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Simple Image Uploader</h1>
        <p className="text-muted-foreground">
          Nova ferramenta simples e intuitiva para upload de imagens
        </p>
      </div>

      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="single">Imagem Única</TabsTrigger>
          <TabsTrigger value="multiple">Múltiplas</TabsTrigger>
          <TabsTrigger value="product">Produto</TabsTrigger>
          <TabsTrigger value="avatar">Avatar</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload de Imagem Única</CardTitle>
              <CardDescription>
                Selecione uma única imagem com compressão automática
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleImageUploader
                multiple={false}
                maxSizeMB={5}
                onImagesChange={setSingleImage}
              />
              {singleImage.length > 0 && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Resultado:</strong> {singleImage.length} imagem processada
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="multiple" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Múltiplo</CardTitle>
              <CardDescription>
                Selecione até 8 imagens com compressão inteligente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleImageUploader
                multiple={true}
                maxFiles={8}
                maxSizeMB={10}
                onImagesChange={setMultipleImages}
              />
              {multipleImages.length > 0 && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Resultado:</strong> {multipleImages.length} imagens processadas
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="product" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Imagens de Produto</CardTitle>
              <CardDescription>
                Upload com proporção 1:1 e recorte opcional para produtos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleImageUploader
                multiple={true}
                maxFiles={5}
                maxSizeMB={5}
                aspectRatio={1}
                maxWidth={800}
                maxHeight={800}
                quality={85}
                onImagesChange={setProductImages}
              />
              {productImages.length > 0 && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Resultado:</strong> {productImages.length} imagens de produto
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="avatar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Avatar do Usuário</CardTitle>
              <CardDescription>
                Upload com proporção quadrada obrigatória e recorte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleImageUploader
                multiple={false}
                maxSizeMB={3}
                aspectRatio={1}
                maxWidth={400}
                maxHeight={400}
                quality={90}
                onImagesChange={setAvatarImages}
              />
              {avatarImages.length > 0 && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Resultado:</strong> Avatar processado
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
