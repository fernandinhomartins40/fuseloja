
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, Tags } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { defaultCategories } from '@/utils/categoryIcons';
import { Category, getContrastTextColor } from '@/types/category';
import CategoryCard from '@/components/admin/CategoryCard';
import CategoryForm from '@/components/admin/CategoryForm';
import { AdminPageLayout } from '@/components/admin/layout/AdminPageLayout';

const Categories: React.FC = () => {
  // Initialize with default categories and add custom ones
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        text: `${categories.length} categorias`,
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
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar categorias..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Categoria
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>
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
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
            <div className="col-span-full flex items-center justify-center h-40 bg-muted/20 rounded-lg">
              <p className="text-muted-foreground">Nenhuma categoria encontrada</p>
            </div>
          )}
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default Categories;
