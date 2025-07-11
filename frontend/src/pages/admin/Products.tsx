
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProductForm from '@/components/admin/ProductForm';
import ProductsTable from '@/components/admin/ProductsTable';
import { AdminPageLayout } from '@/components/admin/layout/AdminPageLayout';
import { SearchFilter, FilterOption } from '@/components/admin/ui/SearchFilter';
import { useProductsManagement } from '@/hooks/useProductsManagement';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import { Product } from '@/types/product';
import { Package2, Plus } from 'lucide-react';

const Products: React.FC = () => {
  const {
    products,
    editingProduct,
    isFormOpen,
    setIsFormOpen,
    handleDeleteProduct,
    handleEditProduct,
    handleAddProduct,
    handleUpdateProduct,
    handleNewProductClick
  } = useProductsManagement();

  // Filter configuration for products
  const filterConfig: FilterOption[] = [
    {
      key: 'category',
      label: 'Categoria',
      type: 'select',
      options: [
        { value: 'electronics', label: 'Eletrônicos' },
        { value: 'fashion', label: 'Moda' },
        { value: 'home', label: 'Casa & Decoração' },
        { value: 'sports', label: 'Esportes' },
        { value: 'books', label: 'Livros' },
        { value: 'health', label: 'Saúde & Beleza' }
      ],
      placeholder: 'Todas as categorias'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Ativo' },
        { value: 'inactive', label: 'Inativo' },
        { value: 'draft', label: 'Rascunho' }
      ],
      placeholder: 'Todos os status'
    },
    {
      key: 'stock',
      label: 'Estoque',
      type: 'select',
      options: [
        { value: 'in_stock', label: 'Em estoque' },
        { value: 'low_stock', label: 'Estoque baixo' },
        { value: 'out_of_stock', label: 'Sem estoque' }
      ],
      placeholder: 'Todos os estoques'
    },
    {
      key: 'price_min',
      label: 'Preço mínimo',
      type: 'number',
      placeholder: 'R$ 0,00'
    },
    {
      key: 'price_max',
      label: 'Preço máximo',
      type: 'number',
      placeholder: 'R$ 999.999,99'
    },
    {
      key: 'featured',
      label: 'Produto em destaque',
      type: 'checkbox',
      placeholder: 'Apenas produtos em destaque'
    }
  ];

  const {
    searchValue,
    setSearchValue,
    activeFilters,
    setActiveFilters,
    clearFilters,
    filteredData
  } = useSearchFilter(products, {
    filterConfig,
    initialSearch: ''
  });

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
        text: `${filteredData.length} de ${products.length} itens`,
        variant: 'secondary'
      }}
      action={{
        label: 'Novo Produto',
        icon: <Plus className="h-4 w-4" />,
        onClick: handleNewProductClick
      }}
    >
      <div className="space-y-4 sm:space-y-6">
        <SearchFilter
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Buscar produtos por nome, categoria, SKU..."
          filters={filterConfig}
          activeFilters={activeFilters}
          onFiltersChange={setActiveFilters}
          onClearFilters={clearFilters}
          showFilterCount={true}
        />
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">
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
          products={filteredData}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      </div>
    </AdminPageLayout>
  );
};

export default Products;
