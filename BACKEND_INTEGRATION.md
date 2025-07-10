# Integração com Backend - Instruções

## Resumo da Adaptação

A aplicação React foi adaptada para consumir o backend reutilizável localizado na pasta `backend/`. Todas as funcionalidades existentes foram preservadas e agora funcionam tanto com dados locais (modo legacy) quanto com o backend real.

## Estrutura Adicionada

### Novos Arquivos

```
src/
├── services/
│   ├── api.ts              # Cliente API com axios e interceptors
│   ├── auth.service.ts     # Serviço de autenticação
│   └── user.service.ts     # Serviço de usuários
├── hooks/
│   ├── useAuth.ts          # Hook de autenticação
│   └── useApi.ts           # Hooks genéricos para API
└── types/
    └── api.ts              # Types para API
```

### Arquivos Modificados

- `src/contexts/UserContext.tsx` - Adaptado para usar o backend
- `vite.config.ts` - Proxy configurado para o backend
- `.env` - Variáveis de ambiente para API

## Funcionalidades Implementadas

### ✅ Sistema de Autenticação
- Login/Logout com JWT
- Refresh token automático
- Interceptors para requisições
- Gerenciamento de sessão

### ✅ Compatibilidade Total
- UserContext mantém todas as funções originais
- Usuários provisórios continuam funcionando
- Dados locais preservados

### ✅ Configuração de API
- Axios configurado com interceptors
- Tratamento de erros padronizado
- Cache e retry automático
- Logging em desenvolvimento

## Como Usar

### 1. Iniciar o Backend

```bash
cd backend
npm install
npm run dev:ts
```

O backend ficará disponível em `http://localhost:3000`

### 2. Iniciar o Frontend

```bash
npm install
npm run dev
```

O frontend ficará disponível em `http://localhost:8080`

### 3. Variáveis de Ambiente

O arquivo `.env` já está configurado:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_API_PREFIX=/api/v1
NODE_ENV=development
```

## Endpoints Disponíveis

### Autenticação
- `POST /api/v1/auth/register` - Criar conta
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/refresh` - Renovar token
- `GET /api/v1/auth/me` - Perfil do usuário

### Documentação
- `GET /api-docs` - Swagger UI
- `GET /health` - Health check

## Fluxo de Autenticação

1. **Login**: Usuário faz login → Recebe JWT + Refresh Token
2. **Requisições**: Token enviado automaticamente no header
3. **Expiração**: Token expira → Refresh automático
4. **Logout**: Tokens removidos → Redirecionamento

## Modo de Compatibilidade

A aplicação funciona em dois modos:

### Modo Backend (Preferido)
- Quando o backend está rodando
- Autenticação real com JWT
- Dados persistidos no servidor

### Modo Local (Fallback)
- Quando o backend não está disponível
- Funcionalidade completa com localStorage
- Usuários provisórios funcionam normalmente

## Estados de Loading

Todos os hooks e serviços incluem estados de loading:

```typescript
const { data, loading, error, execute } = useApi(apiFunction);
```

## Tratamento de Erros

- Erros de rede: Toast automático
- 401 Unauthorized: Refresh token automático
- 403 Forbidden: Logout automático
- Outros erros: Toast com mensagem específica

## Interceptors Configurados

### Request Interceptor
- Adiciona token JWT automaticamente
- Logs de performance em desenvolvimento

### Response Interceptor  
- Refresh token automático em 401
- Tratamento de erros centralizado
- Logs de resposta

## Hooks Disponíveis

### useAuth
```typescript
const {
  user,
  isAuthenticated,
  login,
  logout,
  register,
  updateProfile
} = useAuth();
```

### useApi
```typescript
const api = useApi(apiFunction);
const { data, loading, error } = api;
await api.execute(params);
```

## Segurança

- JWT tokens armazenados seguramente
- Refresh token automático
- Logout em caso de token inválido
- Headers de segurança configurados

## Próximos Passos

Para expandir a integração:

1. **Produtos**: Implementar CRUD de produtos
2. **Categorias**: Gerenciamento de categorias
3. **Pedidos**: Sistema de pedidos
4. **Upload**: Sistema de upload de imagens
5. **Notificações**: WebSocket para notificações

## Troubleshooting

### Backend não conecta
1. Verificar se o backend está rodando na porta 3000
2. Verificar variáveis de ambiente
3. Verificar proxy do Vite

### Tokens não funcionam
1. Verificar localStorage no DevTools
2. Verificar Network tab para requisições
3. Verificar console para erros

### Funcionalidades quebradas
1. A aplicação mantém compatibilidade total
2. Em caso de erro, usar modo local (localStorage)
3. Verificar console para logs detalhados