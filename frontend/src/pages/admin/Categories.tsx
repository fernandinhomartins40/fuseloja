
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { defaultCategories } from '@/utils/categoryIcons';
import { Category } from '@/types/category';
import CategoryCard from '@/components/admin/CategoryCard';
import CategoryForm from '@/components/admin/CategoryForm';
import { AdminPageLayout } from '@/components/admin/layout/AdminPageLayout';
import { SearchFilter, FilterOption } from '@/components/admin/ui/SearchFilter';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eCommerceService } from '@/services/eCommerce.service';

const Categories: React.FC = () => {
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch categories
  const { data: categories = [], isLoading, isError } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: eCommerceService.getCategories,
  });

  // Mutations for CRUD operations
  const createCategoryMutation = useMutation({
    mutationFn: eCommerceService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Categoria adicionada",
        description: "A nova categoria foi criada com sucesso."
      });
      setIsFormOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao adicionar categoria",
        description: error.message || "Ocorreu um erro ao criar a categoria.",
        variant: "destructive"
      });
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) => eCommerceService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Categoria atualizada",
        description: "As informações da categoria foram atualizadas."
      });
      setIsFormOpen(false);
      setEditingCategory(null);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar categoria",
        description: error.message || "Ocorreu um erro ao atualizar a categoria.",
        variant: "destructive"
      });
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: eCommerceService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Categoria excluída",
        description: "A categoria foi removida com sucesso."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir categoria",
        description: error.message || "Ocorreu um erro ao excluir a categoria.",
        variant: "destructive"
      });
    }
  });

  // Filter configuration for categories
  const filterConfig: FilterOption[] = [
    {
      key: 'isDefault',
      label: 'Tipo',
      type: 'select',
      options: [
        { value: 'true', label: 'Categorias Padrão' },
        { value: 'false', label: 'Categorias Personalizadas' }
      ],
      placeholder: 'Todos os tipos'
    },
    {
      key: 'hasIcon',
      label: 'Com ícone',
      type: 'checkbox',
      placeholder: 'Apenas categorias com ícone'
    }
  ];

  const {
    searchValue,
    setSearchValue,
    activeFilters,
    setActiveFilters,
    clearFilters,
    filteredData: filteredCategories
  } = useSearchFilter(categories, {
    filterConfig,
    initialSearch: ''
  });

  const handleAddCategory = (categoryData: Omit<Category, 'id'>) => {
    createCategoryMutation.mutate(categoryData);
  };

  const handleUpdateCategory = (categoryData: Omit<Category, 'id'>) => {
    if (!editingCategory) return;
    updateCategoryMutation.mutate({ id: editingCategory.id, data: categoryData });
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    // No need to check isDefault here, backend should handle permissions
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      deleteCategoryMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <AdminPageLayout
        title="Categorias"
        description="Organize e gerencie todas as categorias de produtos da sua loja"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Catálogo', href: '/admin' },
          { label: 'Categorias' }
        ]}
        badge={{ text: 'Carregando...', variant: 'secondary' }}
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Carregando categorias...</p>
        </div>
      </AdminPageLayout>
    );
  }

  if (isError) {
    return (
      <AdminPageLayout
        title="Categorias"
        description="Organize e gerencie todas as categorias de produtos da sua loja"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Catálogo', href: '/admin' },
          { label: 'Categorias' }
        ]}
        badge={{ text: 'Erro', variant: 'destructive' }}
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">Erro ao carregar categorias. Tente novamente mais tarde.</p>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title="Categorias"
      description="Organize e gerencie todas as categorias de produtos da sua loja"
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Catálogo', href: '/admin' },
        { label: 'Categorias' }
      ]}
      badge={{
        text: `${filteredCategories.length} de ${categories.length} categorias`,
        variant: 'secondary'
      }}
      action={{
        label: 'Nova Categoria',
        icon: <Plus className="h-4 w-4" />,
        onClick: () => {
          setEditingCategory(null);
          setIsFormOpen(true);
        }
      }}
    >
      <div className="space-y-4 sm:space-y-6">
        <SearchFilter
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Buscar categorias por nome, slug ou descrição..."
          filters={filterConfig}
          activeFilters={activeFilters}
          onFiltersChange={setActiveFilters}
          onClearFilters={clearFilters}
          showFilterCount={true}
        />
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="w-[95vw] max-w-[550px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">
                {editingCategory ? 'Editar Categoria' : 'Adicionar Nova Categoria'}
              </DialogTitle>
            </DialogHeader>
            <CategoryForm
              initialData={editingCategory}
              onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingCategory(null);
              }}
            />
          </DialogContent>
        </Dialog>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <CategoryCard 
                key={category.id} 
                category={category}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
              />
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center h-32 sm:h-40 bg-muted/20 rounded-lg">
              <p className="text-muted-foreground text-sm sm:text-base">Nenhuma categoria encontrada</p>
            </div>
          )}
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default Categories;
