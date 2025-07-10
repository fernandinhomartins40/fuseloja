
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProductForm from '@/components/admin/ProductForm';
import ProductsTable from '@/components/admin/ProductsTable';
import ProductsSearchBar from '@/components/admin/ProductsSearchBar';
import { AdminPageLayout } from '@/components/admin/layout/AdminPageLayout';
import { useProductsManagement } from '@/hooks/useProductsManagement';
import { Product } from '@/types/product';
import { Package2, Plus } from 'lucide-react';

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
    <AdminPageLayout
      title="Produtos"
      description="Gerencie todo o catálogo de produtos da sua loja de forma eficiente"
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Catálogo', href: '/admin' },
        { label: 'Produtos' }
      ]}
      badge={{
        text: `${products.length} itens`,
        variant: 'secondary'
      }}
      action={{
        label: 'Novo Produto',
        icon: <Plus className="h-4 w-4" />,
        onClick: handleNewProductClick
      }}
    >
      <div className="space-y-6">
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
      </div>
    </AdminPageLayout>
  );
};

export default Products;
