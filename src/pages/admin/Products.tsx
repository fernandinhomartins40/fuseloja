
import React, { useState } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProductForm from '@/components/admin/ProductForm';
import { toast } from '@/hooks/use-toast';

// Sample product data
const initialProducts = [
  {
    id: "p001",
    title: "Smartwatch Premium",
    price: 599.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&auto=format&fit=crop",
    category: "Eletrônicos",
    stock: 15,
    tag: 'exclusivo' as const,
  },
  {
    id: "p002",
    title: "Caixa de Som Bluetooth Portátil",
    price: 149.99,
    originalPrice: 199.99,
    image: "https://images.unsplash.com/photo-1558089966-a11f54853d0b?q=80&auto=format&fit=crop",
    category: "Audio",
    stock: 23,
    tag: 'promocao' as const,
  },
  {
    id: "p003",
    title: "Mouse Sem Fio Ergonômico",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&auto=format&fit=crop",
    category: "Acessórios",
    stock: 42,
  },
  {
    id: "p004",
    title: "Carregador Sem Fio Rápido",
    price: 129.99,
    originalPrice: 159.99,
    image: "https://images.unsplash.com/photo-1608569212221-856278461677?q=80&auto=format&fit=crop",
    category: "Acessórios",
    stock: 18,
    tag: 'promocao' as const,
  },
  {
    id: "p005",
    title: "Fone de Ouvido Bluetooth",
    price: 249.99,
    originalPrice: 299.99,
    image: "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?q=80&auto=format&fit=crop",
    category: "Audio",
    stock: 7,
    tag: 'promocao' as const,
  },
];

// Product type
export type Product = {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  stock: number;
  tag?: 'promocao' | 'exclusivo' | 'novo';
};

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteProduct = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      setProducts(products.filter(product => product.id !== id));
      toast({
        title: "Produto excluído",
        description: "O produto foi removido com sucesso."
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleAddProduct = (product: Product) => {
    // Generate a new ID for a new product
    const newProduct = {
      ...product,
      id: `p${String(products.length + 1).padStart(3, '0')}`,
    };
    setProducts([newProduct, ...products]);
    setIsFormOpen(false);
    toast({
      title: "Produto adicionado",
      description: "O novo produto foi cadastrado com sucesso."
    });
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    ));
    setIsFormOpen(false);
    setEditingProduct(null);
    toast({
      title: "Produto atualizado",
      description: "As informações do produto foram atualizadas."
    });
  };

  const handleNewProductClick = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Gerenciamento de Produtos" 
        description="Adicione, edite e exclua produtos da sua loja"
        actionLabel="Novo Produto"
        onAction={handleNewProductClick}
      />
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="ml-4" onClick={handleNewProductClick}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
            </Button>
          </div>
          
          {/* Dialog component moved outside of the button for better state management */}
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
                </DialogTitle>
              </DialogHeader>
              <ProductForm
                initialData={editingProduct}
                onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingProduct(null);
                }}
              />
            </DialogContent>
          </Dialog>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imagem</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead className="text-center">Estoque</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="w-12 h-12 rounded overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.title}
                        {product.tag && (
                          <span className={`ml-2 inline-block px-2 py-1 text-xs rounded-full ${
                            product.tag === 'exclusivo' ? 'bg-purple-100 text-purple-800' :
                            product.tag === 'promocao' ? 'bg-red-100 text-red-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {product.tag}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        R$ {product.price.toFixed(2)}
                        {product.originalPrice && (
                          <div className="text-sm text-muted-foreground line-through">
                            R$ {product.originalPrice.toFixed(2)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          product.stock <= 5 ? 'bg-red-100 text-red-800' :
                          product.stock <= 10 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      Nenhum produto encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;
