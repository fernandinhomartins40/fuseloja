import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '@/hooks/useProduct';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Share, Star, ChevronLeft, Plus, Minus } from 'lucide-react';
import { ProductTag } from '@/components/ui/ProductTag';
import { useCart } from '@/contexts/CartContext';
import { RecommendedProducts } from '@/components/sections/RecommendedProducts';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { product, isLoading, error } = useProduct(id);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  // Calculate installment price
  const installments = 6;
  const installmentValue = product ? product.price / installments : 0;

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto py-12 flex justify-center items-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-destructive rounded-full border-t-transparent animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto py-12 flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
          <p className="text-muted-foreground mb-6">{error || "Não foi possível encontrar o produto solicitado."}</p>
          <Link to="/">
            <Button variant="default">Voltar para página inicial</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Convert ProductTag to TagType if needed
  const productTagToTagType = (tag?: string) => {
    if (!tag) return undefined;
    
    // Only return tags that are valid TagType values
    switch (tag) {
      case 'promocao':
      case 'novidade':
      case 'exclusivo':
      case 'ultima-unidade':
      case 'pre-venda':
        return tag as any; // We've verified it's a valid TagType
      default:
        return undefined;
    }
  };

  const tagForDisplay = productTagToTagType(product.tag);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto py-6 px-4 md:py-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/" className="text-sm text-muted-foreground flex items-center hover:text-destructive transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Voltar para loja
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg border">
              {tagForDisplay && (
                <div className="absolute top-4 right-4 z-10">
                  <ProductTag type={tagForDisplay} />
                </div>
              )}
              <AspectRatio ratio={1 / 1}>
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
            </div>
            
            {/* Additional images gallery */}
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, index) => (
                  <div key={index} className="rounded-md overflow-hidden border cursor-pointer hover:opacity-80 transition-opacity">
                    <AspectRatio ratio={1 / 1}>
                      <img src={img} alt={`${product.title} - Imagem ${index + 1}`} className="w-full h-full object-cover" />
                    </AspectRatio>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">{product.title}</h1>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Share className="h-5 w-5" />
                </Button>
              </div>
              
              {product.shortDescription && (
                <p className="text-muted-foreground mt-2">{product.shortDescription}</p>
              )}
              
              <div className="flex items-center mt-2">
                <Star className="h-4 w-4 fill-current text-yellow-400" />
                <Star className="h-4 w-4 fill-current text-yellow-400" />
                <Star className="h-4 w-4 fill-current text-yellow-400" />
                <Star className="h-4 w-4 fill-current text-yellow-400" />
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-muted-foreground ml-2">(4 avaliações)</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    R$ {product.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                )}
                <span className="text-3xl font-bold text-destructive">
                  R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Em até {installments}x de R$ {installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros
              </div>
            </div>
            
            {/* Stock info */}
            <div className="py-2">
              {product.stock > 0 ? (
                <div className="text-green-600 flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-600 mr-2"></span>
                  Em estoque - {product.stock} {product.stock === 1 ? 'unidade' : 'unidades'}
                </div>
              ) : (
                <div className="text-red-500 flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                  Fora de estoque
                </div>
              )}
              {product.sku && <div className="text-xs text-muted-foreground mt-1">SKU: {product.sku}</div>}
            </div>
            
            {/* Quantity selector */}
            <div className="flex items-center space-x-4">
              <div className="font-medium">Quantidade:</div>
              <div className="flex items-center border rounded-md">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={decrementQuantity} 
                  disabled={quantity <= 1}
                  className="h-10 w-10"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={incrementQuantity} 
                  disabled={product.stock <= quantity}
                  className="h-10 w-10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Add to cart */}
            <div className="pt-4">
              <Button 
                className="w-full h-12 text-base flex items-center gap-2" 
                disabled={product.stock <= 0}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5" />
                Adicionar ao Carrinho
              </Button>
            </div>
            
            {/* Quick info */}
            <div className="grid grid-cols-3 gap-4 py-4">
              <Card>
                <CardContent className="p-3 text-center">
                  <div className="text-xs text-muted-foreground">Entrega rápida</div>
                  <div className="text-sm font-medium">2-5 dias úteis</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <div className="text-xs text-muted-foreground">Garantia</div>
                  <div className="text-sm font-medium">12 meses</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <div className="text-xs text-muted-foreground">Devolução</div>
                  <div className="text-sm font-medium">7 dias</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Product details tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-6">
              <TabsTrigger value="description">Descrição</TabsTrigger>
              <TabsTrigger value="specifications">Especificações</TabsTrigger>
              <TabsTrigger value="reviews">Avaliações</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="p-4">
              {product.description ? (
                <div className="prose max-w-none">
                  {product.description}
                </div>
              ) : (
                <div className="text-muted-foreground">
                  Nenhuma descrição detalhada disponível para este produto.
                </div>
              )}
            </TabsContent>
            <TabsContent value="specifications" className="p-4">
              {product.specifications && product.specifications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="py-2">
                      <div className="text-sm font-medium">{spec.name}</div>
                      <div className="text-muted-foreground">{spec.value}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground">
                  Nenhuma especificação disponível para este produto.
                </div>
              )}
              
              {/* Dimensions and weight */}
              {(product.dimensions || product.weight) && (
                <>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    {product.dimensions && (
                      <div className="py-2">
                        <div className="text-sm font-medium">Dimensões</div>
                        <div className="text-muted-foreground">
                          {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm
                        </div>
                      </div>
                    )}
                    {product.weight && (
                      <div className="py-2">
                        <div className="text-sm font-medium">Peso</div>
                        <div className="text-muted-foreground">{product.weight} kg</div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </TabsContent>
            <TabsContent value="reviews" className="p-4">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">Ainda não há avaliações</h3>
                <p className="text-muted-foreground mb-4">Seja o primeiro a avaliar "{product.title}"</p>
                <Button>Escrever uma avaliação</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Products recommendations */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Produtos Relacionados</h2>
          <RecommendedProducts />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
