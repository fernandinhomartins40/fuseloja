
import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProductForm from '@/components/admin/ProductForm';
import ProductsTable from '@/components/admin/ProductsTable';
import ProductsSearchBar from '@/components/admin/ProductsSearchBar';
import { useProductsManagement } from '@/hooks/useProductsManagement';
import { Product } from '@/types/product';

const Products: React.FC = () => {
  const {
    products,
    searchTerm,
    editingProduct,
    isFormOpen,
    setSearchTerm,
    setIsFormOpen,
    handleDeleteProduct,
    handleEditProduct,
    handleAddProduct,
    handleUpdateProduct,
    handleNewProductClick
  } = useProductsManagement();

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
          <ProductsSearchBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onNewProduct={handleNewProductClick}
          />
          
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
                }}
              />
            </DialogContent>
          </Dialog>
          
          <ProductsTable 
            products={products}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;
