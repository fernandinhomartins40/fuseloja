# SearchFilter - Exemplos de Uso

Este documento apresenta exemplos de como usar o componente `SearchFilter` em diferentes contextos no painel administrativo.

## Exemplo Básico - Produtos

```tsx
import { SearchFilter, FilterOption } from '@/components/admin/ui/SearchFilter';
import { useSearchFilter } from '@/hooks/useSearchFilter';

const ProductsPage = () => {
  const filterConfig: FilterOption[] = [
    {
      key: 'category',
      label: 'Categoria',
      type: 'select',
      options: [
        { value: 'electronics', label: 'Eletrônicos' },
        { value: 'fashion', label: 'Moda' },
        { value: 'home', label: 'Casa & Decoração' }
      ],
      placeholder: 'Todas as categorias'
    },
    {
      key: 'price_min',
      label: 'Preço mínimo',
      type: 'number',
      placeholder: 'R$ 0,00'
    }
  ];

  const {
    searchValue,
    setSearchValue,
    activeFilters,
    setActiveFilters,
    clearFilters,
    filteredData
  } = useSearchFilter(products, { filterConfig });

  return (
    <div>
      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Buscar produtos..."
        filters={filterConfig}
        activeFilters={activeFilters}
        onFiltersChange={setActiveFilters}
        onClearFilters={clearFilters}
      />
      {/* Render filtered data */}
    </div>
  );
};
```

## Exemplo Avançado - Pedidos

```tsx
const OrdersPage = () => {
  const filterConfig: FilterOption[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'multiselect',
      options: [
        { value: 'pending', label: 'Aguardando Pagamento' },
        { value: 'processing', label: 'Em Processamento' },
        { value: 'shipped', label: 'Enviado' },
        { value: 'delivered', label: 'Entregue' }
      ]
    },
    {
      key: 'date_range',
      label: 'Período',
      type: 'daterange',
      placeholder: 'Selecionar período'
    },
    {
      key: 'urgent_only',
      label: 'Apenas urgentes',
      type: 'checkbox'
    }
  ];

  // ... resto da implementação
};
```

## Tipos de Filtros Disponíveis

### 1. Select (Seleção única)
```tsx
{
  key: 'category',
  label: 'Categoria',
  type: 'select',
  options: [
    { value: 'value1', label: 'Label 1' },
    { value: 'value2', label: 'Label 2' }
  ],
  placeholder: 'Selecionar categoria'
}
```

### 2. MultiSelect (Seleção múltipla)
```tsx
{
  key: 'tags',
  label: 'Tags',
  type: 'multiselect',
  options: [
    { value: 'new', label: 'Novo' },
    { value: 'sale', label: 'Promoção' },
    { value: 'featured', label: 'Destaque' }
  ]
}
```

### 3. Checkbox (Verdadeiro/Falso)
```tsx
{
  key: 'is_featured',
  label: 'Produto em destaque',
  type: 'checkbox',
  placeholder: 'Apenas produtos em destaque'
}
```

### 4. Date (Data única)
```tsx
{
  key: 'created_date',
  label: 'Data de criação',
  type: 'date',
  placeholder: 'Selecionar data'
}
```

### 5. DateRange (Intervalo de datas)
```tsx
{
  key: 'period',
  label: 'Período',
  type: 'daterange',
  placeholder: 'Selecionar período'
}
```

### 6. Number (Números)
```tsx
{
  key: 'min_price',
  label: 'Preço mínimo',
  type: 'number',
  placeholder: 'R$ 0,00'
}
```

### 7. Text (Texto livre)
```tsx
{
  key: 'description',
  label: 'Descrição',
  type: 'text',
  placeholder: 'Buscar na descrição'
}
```

## Funcionalidades

### Busca Automática
O componente automaticamente busca em todos os campos string do objeto:
- Nome, título, descrição
- IDs, SKUs, códigos
- Emails, telefones

### Filtros Ativos
- Mostra badges com os filtros aplicados
- Permite remover filtros individualmente
- Botão "Limpar todos" para reset completo

### Responsividade
- Layout adaptativo para mobile/desktop
- Botões de filtro se ajustam ao tamanho da tela
- Popover de filtros com scroll interno

### Contadores
- Badge com número de filtros ativos
- Contagem de itens filtrados vs total

## Customização

### Desabilitando Contador de Filtros
```tsx
<SearchFilter
  showFilterCount={false}
  // ... outras props
/>
```

### Classe CSS Customizada
```tsx
<SearchFilter
  className="my-custom-class"
  // ... outras props
/>
```

### Placeholder Personalizado
```tsx
<SearchFilter
  searchPlaceholder="Buscar por nome, email ou telefone..."
  // ... outras props
/>
```

## Integração com useSearchFilter

O hook `useSearchFilter` facilita o gerenciamento de estado:

```tsx
const {
  searchValue,        // Valor atual da busca
  setSearchValue,     // Função para atualizar a busca
  activeFilters,      // Array de filtros ativos
  setActiveFilters,   // Função para atualizar filtros
  clearFilters,       // Função para limpar todos os filtros
  filteredData,       // Dados filtrados automaticamente
  filterData,         // Função para filtrar dados manualmente
  setData            // Função para atualizar os dados base
} = useSearchFilter(originalData, {
  filterConfig,
  initialSearch: '',
  onSearch: (term, filtered) => console.log('Busca:', term),
  onFilter: (filters, filtered) => console.log('Filtros:', filters)
});
```

## Casos de Uso Comuns

### 1. Lista de Produtos
- Filtrar por categoria, preço, estoque
- Buscar por nome, SKU, descrição

### 2. Gerenciamento de Pedidos
- Filtrar por status, período, valor
- Buscar por cliente, número do pedido

### 3. Lista de Usuários
- Filtrar por tipo, status, data de cadastro
- Buscar por nome, email, telefone

### 4. Relatórios
- Filtrar por período, categoria, tipo
- Buscar por identificadores específicos

### 5. Inventário
- Filtrar por estoque, fornecedor, localização
- Buscar por código, descrição, categoria