
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProductForm from '@/components/admin/ProductForm';
import { VirtualizedTable } from '@/components/admin/ui/VirtualizedTable';
import { AdminPageLayout } from '@/components/admin/layout/AdminPageLayout';
import { FilterOption } from '@/components/admin/ui/SearchFilter';
import { useProductsManagement } from '@/hooks/useProductsManagement';
import { Product } from '@/types/product';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Products: React.FC = () => {
  const {
    products,
    isLoading,
    isError,
    error,
    apiDataAvailable,
    totalProducts,
    editingProduct,
    isFormOpen,
    setIsFormOpen,
    handleDeleteProduct,
    handleEditProduct,
    handleAddProduct,
    handleUpdateProduct,
    handleNewProductClick
  } = useProductsManagement();

  // Debug information
  console.log('Products Page Debug:', {
    productsCount: products.length,
    isLoading,
    isError,
    error,
    apiDataAvailable,
    totalProducts
  });

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

  // Column definitions for virtualized table
  const columns = [
    {
      key: 'imageUrl' as keyof Product,
      label: 'Imagem',
      width: '80px',
      align: 'center' as const,
      render: (value: string) => (
        <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={value}
            alt="Produto"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )
    },
    {
      key: 'title' as keyof Product,
      label: 'Nome',
      sortable: true,
      width: '2fr'
    },
    {
      key: 'category' as keyof Product,
      label: 'Categoria',
      sortable: true,
      width: '150px'
    },
    {
      key: 'price' as keyof Product,
      label: 'Preço',
      sortable: true,
      width: '120px',
      align: 'right' as const,
      render: (value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    },
    {
      key: 'stock' as keyof Product,
      label: 'Estoque',
      sortable: true,
      width: '100px',
      align: 'center' as const,
      render: (value: number) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value > 10 ? 'bg-green-100 text-green-800' :
          value > 0 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'createdAt' as keyof Product,
      label: 'Criado em',
      sortable: true,
      width: '120px',
      render: (value: string | Date) => {
        const date = value instanceof Date ? value : new Date(value);
        return date.toLocaleDateString('pt-BR');
      }
    },
    {
      key: 'actions' as keyof Product,
      label: 'Ações',
      width: '120px',
      align: 'center' as const,
      render: (_value: any, item: Product) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEditProduct(item);
            }}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteProduct(item.id);
            }}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

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
        text: `${products.length} itens ${!apiDataAvailable ? '(dados de exemplo)' : '(do banco)'}`,
        variant: apiDataAvailable ? 'secondary' : 'outline'
      }}
      action={{
        label: 'Novo Produto',
        icon: <Plus className="h-4 w-4" />,
        onClick: handleNewProductClick
      }}
    >
      <div className="space-y-4 sm:space-y-6">
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
        
        <VirtualizedTable
          data={products}
          columns={columns}
          itemHeight={80}
          containerHeight={600}
          searchFields={['title', 'category', 'sku', 'description']}
          filterConfig={filterConfig}
          searchPlaceholder="Buscar produtos por nome, categoria, SKU..."
          onRowClick={(_product) => {
            // Optional: handle row click for quick preview
          }}
          loading={isLoading}
          emptyMessage={isError ? `Erro ao carregar produtos: ${error}` : "Nenhum produto encontrado"}
        />
      </div>
    </AdminPageLayout>
  );
};

export default Products;
