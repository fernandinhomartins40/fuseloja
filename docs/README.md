# 🏪 FuseLoja - E-commerce Completo

## 🚀 **Arquitetura Minimalista e Otimizada**

Sistema de e-commerce com frontend React e backend Node.js simplificado para **deploy rápido e fácil manutenção**.

### ✨ **Deploy Simplificado**
- **1 secret**: Apenas `VPS_PASSWORD` necessária
- **3 workflows**: Deploy principal + testes de conectividade
- **Zero configuração**: Host e username pré-configurados
- **Domínio**: fuseloja.com.br (82.25.69.57)

### 📁 **Estrutura do Projeto**

```
fuseloja/
├── backend/                 # Backend minimalista
│   ├── src/
│   │   ├── index.js        # Servidor principal
│   │   ├── routes/         # Rotas da API
│   │   ├── middleware/     # Middlewares de auth/cors
│   │   ├── database/       # Conexão PostgreSQL
│   │   └── utils/          # Utilitários e validações
│   ├── package.json        # 8 dependências apenas
│   └── README.md           # Documentação do backend
├── frontend/               # React + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/     # Componentes UI
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # API e auth services
│   │   ├── hooks/          # Custom hooks
│   │   └── types/          # Tipos TypeScript
│   └── package.json        # Dependências do frontend
└── README.md              # Este arquivo
```

### 🎯 **Stack Tecnológica**

| Componente | Tecnologia | Justificativa |
|------------|------------|---------------|
| **Backend** | Node.js + Express | Simplicidade e performance |
| **Linguagem** | JavaScript ES6+ | Zero build time |
| **Banco** | PostgreSQL | Robustez e SQL familiar |
| **Frontend** | React + TypeScript | Moderna e type-safe |
| **UI** | Tailwind + Radix UI | Design system consistente |
| **Auth** | JWT simples | Stateless e escalável |

### 🔧 **Setup Rápido**

#### 1. **Backend**
```bash
cd backend
npm install
cp .env.example .env
# Editar .env com suas configurações
npm start
```

#### 2. **Frontend**
```bash
cd frontend
npm install
npm run dev
```

#### 3. **PostgreSQL**
```bash
# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib

# Criar banco
sudo -u postgres createdb fuseloja
```

### 🌐 **URLs de Desenvolvimento**

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3001
- **API Docs:** http://localhost:3001 (JSON endpoints)
- **Health Check:** http://localhost:3001/health

### 📊 **Endpoints Principais**

#### Autenticação (`/api/v1/auth`)
- `POST /register` - Cadastro de usuário
- `POST /login` - Login
- `POST /validate` - Validar token
- `GET /me` - Perfil do usuário

#### Usuários (`/api/v1/users`)
- `GET /me` - Perfil atual
- `PUT /me` - Atualizar perfil
- `GET /` - Listar usuários (admin)

### 🚀 **Deploy Automático**

#### **Configuração GitHub Secrets**
1. Vá para: `Settings` → `Secrets and variables` → `Actions`
2. Adicione os secrets **obrigatórios**:
   ```
   VPS_HOST=seu-ip-vps
   VPS_USERNAME=root
   VPS_PASSWORD=sua-senha-vps
   ```

3. Secrets **opcionais** (recomendados):
   ```
   JWT_SECRET=seu-jwt-secret-seguro
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=sua-senha-db
   DB_NAME=fuseloja
   ```

#### **Como Fazer Deploy**

**✅ Automático:** Qualquer push na branch `main`
```bash
git push origin main
```

**✅ Manual:** Via GitHub Actions
1. Vá para `Actions` → `🚀 Deploy Fuseloja Minimal`
2. Clique em `Run workflow`
3. Aguarde 2-3 minutos

#### **Monitoramento**
- **App:** https://www.fuseloja.com.br
- **Health:** http://seu-ip:3001/health
- **API:** http://seu-ip:3001/api/v1/
- **Logs:** `pm2 logs fuseloja-minimal`

### 🔒 **Segurança**

- ✅ **Helmet** para headers de segurança
- ✅ **CORS** configurado
- ✅ **Rate Limiting** por IP
- ✅ **JWT** para autenticação
- ✅ **bcrypt** para hash de senhas
- ✅ **Validação** de inputs

### 📈 **Performance**

- ⚡ **Backend:** JavaScript puro, sem build
- ⚡ **Frontend:** Vite para dev, build otimizado
- ⚡ **Database:** PostgreSQL com pooling
- ⚡ **Deploy:** < 2 minutos

### 🛠️ **Desenvolvimento**

#### **Comandos Úteis**
```bash
# Backend
npm run dev          # Nodemon para auto-restart
npm start           # Produção

# Frontend  
npm run dev         # Servidor de desenvolvimento
npm run build       # Build para produção
npm run preview     # Preview do build
```

#### **Debugging**
```bash
# Logs do backend
tail -f backend/logs/app.log

# Verificar processos
pm2 list
pm2 logs fuseloja-backend

# Health checks
curl http://localhost:3001/health
```

### 🔄 **Roadmap**

#### **Fase Atual: MVP ✅**
- Autenticação JWT
- CRUD de usuários
- Frontend React
- Deploy básico

#### **Próximas Fases**
- **Fase 2:** Produtos e categorias
- **Fase 3:** Carrinho e checkout
- **Fase 4:** Pagamentos
- **Fase 5:** Admin dashboard

### 📝 **Contribuição**

1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'Add nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Abra um Pull Request

### 📋 **Documentação de Deploy**

- 🚀 **Guia de Deploy**: [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md)
- 🔐 **Configuração de Secrets**: [SETUP_SECRETS.md](SETUP_SECRETS.md)
- 🔄 **Workflows Disponíveis**: [.github/WORKFLOWS.md](.github/WORKFLOWS.md)
- 📊 **GitHub Actions**: [Actions](../../actions)

### 📞 **Suporte**

- 📧 **Email:** suporte@fuseloja.com
- 📚 **Docs Backend:** [/backend/README.md](backend/README.md)
- 🐛 **Issues:** GitHub Issues

### 📄 **Licença**

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

## 🎉 **Deploy Pronto em 30 Minutos!**

Este projeto foi otimizado para **simplicidade e velocidade de deploy**, mantendo todas as funcionalidades essenciais de um e-commerce moderno.

**Stack minimalista** = **Menos bugs** + **Deploy mais rápido** + **Manutenção mais fácil**
