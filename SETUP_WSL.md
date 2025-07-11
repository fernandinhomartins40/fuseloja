# 🚀 Guia Completo - Como Rodar FuseLoja no WSL Ubuntu

## ✅ **STATUS - SISTEMA DE LOGIN IMPLEMENTADO**

O sistema de autenticação completo foi implementado com sucesso:

- ✅ **Backend**: Autenticação JWT, RBAC, PostgreSQL
- ✅ **Frontend**: Login/Registro, Proteção de rotas, Dashboards
- ✅ **Usuário Admin**: admin@fuseloja.com.br / admin123
- ✅ **Compatibilidade**: 100% compatível com produção

---

## 📋 **Pré-requisitos**

### 1. WSL Ubuntu Configurado
```bash
# Verificar se WSL está funcionando
uname -a
```

### 2. Node.js 18+ (Já instalado ✅)
```bash
node --version  # v22.17.0 ✅
npm --version   # 10.9.2 ✅
```

---

## 🛠️ **SETUP COMPLETO (Passo a Passo)**

### **1. Configurar PostgreSQL**
```bash
# Instalar PostgreSQL
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# Iniciar serviço
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Configurar senha do usuário postgres
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'password';"

# Criar banco de dados
sudo -u postgres createdb fuseloja

# Configurar autenticação por senha
sudo sed -i "s/local   all             all                                     peer/local   all             all                                     md5/" /etc/postgresql/16/main/pg_hba.conf

# Reiniciar PostgreSQL
sudo systemctl restart postgresql
```

### **2. Configurar Backend**
```bash
# Navegar para o backend
cd backend

# Instalar dependências
npm install

# Verificar arquivo .env (já configurado)
cat .env
# PORT=3000
# NODE_ENV=development
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=fuseloja
# DB_USER=postgres
# DB_PASSWORD=password
# JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars

# Iniciar backend
node src/index.js
```

**Saída esperada:**
```
🚀 FuseLoja Backend running on port 3000
📱 Health check: http://localhost:3000/health
🔐 API Authentication: http://localhost:3000/api/v1/auth
👥 User Management: http://localhost:3000/api/v1/users
👑 Admin Panel: http://localhost:3000/api/v1/admin
✅ Database connected successfully
✅ Database tables initialized
✅ Admin user created successfully
📧 Email: admin@fuseloja.com.br
🔐 Password: admin123
👑 Role: admin
```

### **3. Configurar Frontend**
```bash
# Abrir novo terminal
cd frontend

# Instalar dependências
npm install

# Verificar arquivo .env (já configurado)
cat .env
# VITE_API_BASE_URL=http://localhost:3000
# VITE_API_PREFIX=/api/v1
# NODE_ENV=development

# Iniciar frontend
npm run dev
```

**Saída esperada:**
```
  VITE v5.4.1  ready in 2000 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🔐 **TESTANDO O SISTEMA DE LOGIN**

### **1. Teste via Browser**
1. Abra: http://localhost:5173
2. Clique em "Fazer Login"
3. Use as credenciais de admin:
   - **E-mail**: admin@fuseloja.com.br
   - **Senha**: admin123
4. Deve ser redirecionado para o painel administrativo

### **2. Teste via API (curl)**
```bash
# Health Check
curl -s http://localhost:3000/health | jq '.status'

# Login Admin
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@fuseloja.com.br",
    "password": "admin123"
  }' | jq '.data.user.role'

# Registrar usuário comum
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "123456",
    "firstName": "Usuario",
    "lastName": "Teste"
  }' | jq '.data.user.role'
```

---

## 🏛️ **ARQUITETURA DO SISTEMA**

### **Controle de Acesso (RBAC)**
- **Admin**: Acesso total ao painel administrativo
- **User**: Acesso restrito apenas ao próprio perfil

### **Rotas Protegidas**
- `/login` - Página de login (pública)
- `/register` - Página de registro (pública)
- `/admin` - Painel administrativo (apenas admin)
- `/user` - Painel do usuário (user + admin)
- `/dashboard` - Redirecionamento automático baseado na função

### **Backend API**
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Registro
- `GET /api/v1/auth/me` - Perfil atual
- `GET /api/v1/admin/users` - Listar usuários (admin only)
- `GET /api/v1/admin/dashboard` - Dashboard admin (admin only)

---

## 🚨 **Troubleshooting**

### **Erro: Database connection failed**
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Reiniciar se necessário
sudo systemctl restart postgresql
```

### **Erro: Port already in use**
```bash
# Backend (porta 3000)
lsof -ti:3000 | xargs kill -9

# Frontend (porta 5173)
lsof -ti:5173 | xargs kill -9
```

### **Erro: npm install falha**
```bash
# Limpar cache npm
npm cache clean --force

# Deletar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
```

---

## 🔄 **Comandos Úteis**

### **Desenvolvimento Diário**
```bash
# Terminal 1 - Backend
cd backend && node src/index.js

# Terminal 2 - Frontend  
cd frontend && npm run dev

# Terminal 3 - Testes
curl -s http://localhost:3000/health
curl -s http://localhost:5173
```

### **Reset Completo do Banco**
```bash
sudo -u postgres psql -c "DROP DATABASE IF EXISTS fuseloja;"
sudo -u postgres createdb fuseloja
cd backend && node src/index.js  # Recria tabelas e admin
```

---

## 🌐 **Compatibilidade com Produção**

✅ **PostgreSQL**: Mesma versão (16+)  
✅ **Node.js**: Compatível (18+)  
✅ **JWT**: Tokens válidos  
✅ **Docker**: Dockerfile.minimal pronto  
✅ **GitHub Actions**: Deploy automático funcionando  
✅ **PM2**: Configuração de produção  

---

## 🎯 **Próximos Passos**

1. **Testar todas as funcionalidades** no WSL
2. **Desenvolver novas features** com base sólida
3. **Deploy automático** via GitHub Actions (já configurado)
4. **Monitoramento** em produção (já funcionando)

---

## 📞 **Suporte**

- **Health Check Local**: http://localhost:3000/health
- **Health Check Produção**: http://82.25.69.57:3000/health
- **Aplicação Produção**: https://www.fuseloja.com.br

**Status Produção**: ✅ ONLINE e FUNCIONANDO 