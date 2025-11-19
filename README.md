# 🛍️ FuseLoja - E-commerce Monorepo

> **Plataforma de e-commerce profissional construída com React, TypeScript, Node.js, Prisma e PostgreSQL**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Estrutura do Monorepo](#estrutura-do-monorepo)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Desenvolvimento](#desenvolvimento)
- [Build e Deploy](#build-e-deploy)
- [Documentação](#documentação)

## 🎯 Sobre o Projeto

**FuseLoja** é uma plataforma completa de e-commerce desenvolvida com as melhores práticas de desenvolvimento moderno. O projeto foi reestruturado em uma arquitetura monorepo profissional, garantindo escalabilidade, manutenibilidade e performance.

### Funcionalidades Principais

- ✅ **E-commerce Completo**: Catálogo de produtos, carrinho de compras, checkout
- ✅ **Gestão de Produtos**: CRUD completo com upload de imagens
- ✅ **Categorias Dinâmicas**: Sistema flexível de categorização
- ✅ **Autenticação JWT**: Sistema robusto com refresh tokens
- ✅ **Usuários Provisórios**: Compra sem cadastro via WhatsApp
- ✅ **Admin Dashboard**: Painel administrativo completo
- ✅ **Customização**: Temas, cores, logos, banners personalizáveis
- ✅ **Responsivo**: Design adaptável para todos os dispositivos
- ✅ **Performance**: Code splitting, lazy loading, otimização de imagens

## 🏗️ Arquitetura

```
┌─────────────┐
│   Nginx     │ → Reverse Proxy
└──────┬──────┘
       │
       ├─→ ┌──────────────┐
       │   │  Frontend    │ → React + Vite + TypeScript
       │   │  (Web App)   │
       │   └──────────────┘
       │
       └─→ ┌──────────────┐      ┌──────────────┐
           │   Backend    │ ───→ │  PostgreSQL  │
           │  (API REST)  │      │   Database   │
           └──────────────┘      └──────────────┘
                  ↓
           ┌──────────────┐
           │    Prisma    │ → ORM
           └──────────────┘
```

## 🚀 Tecnologias

### Frontend

- **React 18.3.1** - Biblioteca UI
- **TypeScript 5.5.3** - Tipagem estática
- **Vite 5.4.1** - Build tool e dev server
- **React Router 6.26** - Roteamento
- **TanStack Query 5.56** - State management e cache
- **Axios** - Cliente HTTP
- **Tailwind CSS 3.4** - Estilização
- **Shadcn/ui** - Componentes UI (Radix UI)
- **Recharts** - Gráficos e dashboards
- **React Hook Form + Zod** - Formulários e validação

### Backend

- **Node.js 18+** - Runtime JavaScript
- **Express 4.18** - Framework web
- **TypeScript 5.5.3** - Tipagem estática
- **Prisma 5.22** - ORM
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Bcryptjs** - Hash de senhas
- **Helmet** - Segurança HTTP
- **Winston** - Logging
- **Sharp** - Processamento de imagens

### DevOps & Infraestrutura

- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers
- **Nginx** - Reverse proxy e servidor web
- **PM2** - Gerenciador de processos Node.js

### Ferramentas de Desenvolvimento

- **ESLint** - Linting
- **Prettier** - Formatação de código
- **Jest** - Testes
- **Nodemon** - Hot reload no desenvolvimento
- **ts-node** - Execução TypeScript

## 📁 Estrutura do Monorepo

```
fuseloja/
├── apps/
│   ├── web/                    # Frontend React
│   │   ├── src/
│   │   │   ├── components/     # Componentes React
│   │   │   ├── pages/          # Páginas
│   │   │   ├── hooks/          # Custom hooks
│   │   │   ├── contexts/       # React contexts
│   │   │   ├── services/       # Serviços API
│   │   │   ├── lib/            # Utilitários
│   │   │   └── styles/         # Estilos globais
│   │   ├── public/             # Assets estáticos
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   │
│   └── api/                    # Backend Node.js + Express
│       ├── src/
│       │   ├── controllers/    # Controllers
│       │   ├── services/       # Business logic
│       │   ├── routes/         # Rotas da API
│       │   ├── middleware/     # Middlewares
│       │   ├── utils/          # Utilitários
│       │   └── index.ts        # Entry point
│       ├── prisma/
│       │   ├── schema.prisma   # Schema do banco
│       │   ├── migrations/     # Migrações
│       │   └── seed.ts         # Seed data
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── types/                  # TypeScript types compartilhados
│   │   ├── src/
│   │   │   ├── api.ts
│   │   │   ├── product.ts
│   │   │   ├── user.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── shared/                 # Código compartilhado
│   │   ├── src/
│   │   │   ├── utils/          # Utilitários
│   │   │   ├── validators/     # Validadores
│   │   │   ├── constants/      # Constantes
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── config/                 # Configurações compartilhadas
│       ├── eslint/
│       ├── prettier/
│       ├── typescript/
│       └── package.json
│
├── docker/                     # Configurações Docker
│   ├── nginx/
│   │   ├── nginx.conf
│   │   └── Dockerfile
│   ├── postgres/
│   │   └── init.sql
│   └── api/
│       └── Dockerfile
│
├── scripts/                    # Scripts de build/deploy
│
├── docs/                       # Documentação
│
├── docker-compose.yml          # Orquestração de containers
├── package.json                # Root package.json
├── pnpm-workspace.yaml         # Workspaces config
├── tsconfig.json               # TypeScript config raiz
├── .prettierrc                 # Prettier config
├── .gitignore
└── README.md
```

## 📦 Pré-requisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 ou **pnpm** >= 8.0.0
- **Docker** >= 20.10 (para desenvolvimento com containers)
- **PostgreSQL** >= 14 (ou usar via Docker)

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/fernandinhomartins40/fuseloja.git
cd fuseloja
```

### 2. Instale as dependências

```bash
npm install
# ou
pnpm install
```

### 3. Configure as variáveis de ambiente

```bash
# Backend (apps/api/.env)
cp apps/api/.env.example apps/api/.env

# Frontend (apps/web/.env)
cp apps/web/.env.example apps/web/.env
```

### 4. Configure o banco de dados

```bash
# Gerar o Prisma Client
npm run prisma:generate

# Executar migrações
npm run prisma:migrate

# (Opcional) Popular com dados de exemplo
npm run prisma:seed
```

## 🎮 Scripts Disponíveis

### Desenvolvimento

```bash
# Iniciar tudo (frontend + backend)
npm run dev

# Apenas frontend
npm run dev:web

# Apenas backend
npm run dev:api
```

### Build

```bash
# Build de tudo
npm run build

# Build apenas frontend
npm run build:web

# Build apenas backend
npm run build:api
```

### Prisma

```bash
# Gerar Prisma Client
npm run prisma:generate

# Criar migração
npm run prisma:migrate

# Abrir Prisma Studio
npm run prisma:studio

# Popular banco com dados
npm run prisma:seed

# Reset do banco
npm run prisma:reset
```

### Docker

```bash
# Build das imagens
npm run docker:build

# Subir containers
npm run docker:up

# Parar containers
npm run docker:down

# Ver logs
npm run docker:logs
```

### Qualidade de Código

```bash
# Lint
npm run lint

# Fix de lint
npm run lint:fix

# Type check
npm run type-check

# Formatar código
npm run format

# Checar formatação
npm run format:check
```

### Testes

```bash
# Executar todos os testes
npm run test

# Testes com watch
npm run test:watch

# Coverage
npm run test:coverage
```

## 💻 Desenvolvimento

### Estrutura de Branches

- `main` - Produção
- `develop` - Desenvolvimento
- `feature/*` - Novas funcionalidades
- `fix/*` - Correções de bugs
- `hotfix/*` - Correções urgentes

### Workflow de Desenvolvimento

1. Crie uma branch a partir de `develop`
2. Desenvolva a funcionalidade
3. Faça commits seguindo [Conventional Commits](https://www.conventionalcommits.org/)
4. Abra um Pull Request para `develop`
5. Aguarde revisão e aprovação

### Padrões de Commit

```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
style: formatação de código
refactor: refatoração de código
test: adiciona ou corrige testes
chore: atualiza dependências ou configurações
```

## 🚀 Build e Deploy

### Desenvolvimento Local

```bash
npm run dev
```

### Build de Produção

```bash
npm run build
npm run start
```

### Deploy com Docker

```bash
# Build e subir containers
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

## 📚 Documentação

Para documentação detalhada, consulte a pasta `docs/`:

- [Análise de Imagens dos Produtos](docs/ANALISE_IMAGENS_PRODUTOS.md)
- [Correções de Autenticação](docs/AUTENTICACAO_FIXES.md)
- [Guia de Deploy](docs/DEPLOY_GUIDE.md)
- [Configuração WSL](docs/SETUP_WSL.md)
- [Guia de Upload](docs/UPLOAD_GUIDE.md)

## 👥 Contribuindo

Contribuições são sempre bem-vindas! Por favor, leia o [guia de contribuição](CONTRIBUTING.md) primeiro.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Prisma](https://www.prisma.io/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query)

---

**Desenvolvido com ❤️ pela equipe FuseLoja**
