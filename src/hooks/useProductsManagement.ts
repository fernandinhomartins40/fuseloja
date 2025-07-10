
import { useState } from 'react';
import { Product, initialProducts, ProductTag } from '@/types/product';
import { toast } from '@/hooks/use-toast';

export const useProductsManagement = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

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
      // Convert "no-tag" to undefined
      tag: product.tag === 'no-tag' ? undefined : product.tag,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProducts([newProduct, ...products]);
    setIsFormOpen(false);
    toast({
      title: "Produto adicionado",
      description: "O novo produto foi cadastrado com sucesso."
    });
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    // Convert "no-tag" to undefined
    const processedProduct = {
      ...updatedProduct,
      tag: updatedProduct.tag === 'no-tag' ? undefined : updatedProduct.tag,
      updatedAt: new Date(),
    };
    
    setProducts(products.map(p => 
      p.id === processedProduct.id ? processedProduct : p
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

  return {
    products,
    editingProduct,
    isFormOpen,
    setIsFormOpen,
    handleDeleteProduct,
    handleEditProduct,
    handleAddProduct,
    handleUpdateProduct,
    handleNewProductClick
  };
};
