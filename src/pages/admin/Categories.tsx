
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

const Categories: React.FC = () => {
  // Initialize with default categories and add custom ones
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

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
    // Generate a new ID for the category
    const newCategory: Category = {
      ...categoryData,
      id: `cat-${Date.now().toString(36)}`,
    };
    
    setCategories([newCategory, ...categories]);
    setIsFormOpen(false);
    
    toast({
      title: "Categoria adicionada",
      description: "A nova categoria foi criada com sucesso."
    });
  };

  const handleUpdateCategory = (categoryData: Omit<Category, 'id'>) => {
    if (!editingCategory) return;

    const updatedCategories = categories.map(category =>
      category.id === editingCategory.id 
        ? { ...categoryData, id: category.id, isDefault: category.isDefault } 
        : category
    );
    
    setCategories(updatedCategories);
    setIsFormOpen(false);
    setEditingCategory(null);
    
    toast({
      title: "Categoria atualizada",
      description: "As informações da categoria foram atualizadas."
    });
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    const categoryToDelete = categories.find(cat => cat.id === id);
    
    if (categoryToDelete?.isDefault) {
      toast({
        title: "Operação não permitida",
        description: "Categorias padrão do sistema não podem ser excluídas.",
        variant: "destructive"
      });
      return;
    }
    
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      setCategories(categories.filter(category => category.id !== id));
      toast({
        title: "Categoria excluída",
        description: "A categoria foi removida com sucesso."
      });
    }
  };

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
