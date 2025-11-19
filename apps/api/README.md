# Backend Minimal - Fuseloja

## 🚀 Visão Geral

Backend minimalista criado para resolver problemas de build/deploy complexos. 

**Objetivo:** Deploy em produção em menos de 30 minutos.

## 📦 Stack Simplificada

- **Node.js** com JavaScript puro (sem TypeScript)
- **Express.js** para API REST
- **PostgreSQL** com cliente `pg` (sem ORM)
- **JWT** para autenticação
- **8 dependências** apenas

## 🏗️ Estrutura

```
backend-minimal/
├── src/
│   ├── index.js              # Servidor principal
│   ├── routes/
│   │   ├── auth.js          # Autenticação (register/login)
│   │   └── users.js         # CRUD usuários
│   ├── middleware/
│   │   └── auth.js          # Middleware JWT
│   ├── database/
│   │   └── connection.js    # Conexão PostgreSQL
│   └── utils/
│       └── validation.js    # Validações básicas
├── package.json             # 8 dependências
├── .env.example
└── README.md
```

## 🔧 Setup Local

### 1. Instalar dependências
```bash
cd backend-minimal
npm install
```

### 2. Configurar ambiente
```bash
cp .env.example .env
# Editar .env com suas configurações
```

### 3. Configurar PostgreSQL
```bash
# Criar banco de dados
createdb fuseloja

# Ou via psql
psql -U postgres -c "CREATE DATABASE fuseloja;"
```

### 4. Rodar aplicação
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 🌐 Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/validate` - Validar token

### Usuários (requer autenticação)
- `GET /api/users/me` - Perfil do usuário
- `PUT /api/users/me` - Atualizar perfil

### Admin (requer role admin)
- `GET /api/users` - Listar usuários
- `DELETE /api/users/:id` - Desativar usuário

### Utilitários
- `GET /health` - Health check
- `GET /` - Info da API

## 📱 Teste Rápido

### 1. Registrar usuário
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456"
  }'
```

### 3. Acessar perfil
```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🚀 Deploy VPS Hostinger

### 1. Preparar VPS
```bash
# Conectar via SSH
ssh root@your-vps-ip

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 (gerenciador de processos)
npm install -g pm2

# Instalar PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### 2. Configurar PostgreSQL
```bash
# Acessar PostgreSQL
sudo -u postgres psql

# Criar usuário e banco
CREATE USER fuseloja WITH PASSWORD 'sua_senha_aqui';
CREATE DATABASE fuseloja OWNER fuseloja;
GRANT ALL PRIVILEGES ON DATABASE fuseloja TO fuseloja;
\q
```

### 3. Deploy da aplicação
```bash
# Clonar repositório
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo/backend-minimal

# Instalar dependências
npm install --production

# Configurar variáveis de ambiente
cp .env.example .env
nano .env  # Editar com configurações de produção

# Iniciar com PM2
pm2 start src/index.js --name "backend-minimal"
pm2 startup
pm2 save
```

### 4. Configurar Nginx (opcional)
```bash
# Instalar Nginx
sudo apt install nginx

# Configurar proxy reverso
sudo nano /etc/nginx/sites-available/backend-minimal
```

Conteúdo do arquivo Nginx:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/backend-minimal /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 📊 Monitoramento

### PM2 Commands
```bash
# Ver status
pm2 status

# Ver logs
pm2 logs backend-minimal

# Restart
pm2 restart backend-minimal

# Stop
pm2 stop backend-minimal
```

## 🔍 Troubleshooting

### Problema: Erro de conexão com banco
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Verificar logs
sudo journalctl -u postgresql
```

### Problema: Porta em uso
```bash
# Verificar processos na porta 3000
sudo lsof -i :3000

# Matar processo
sudo kill -9 PID
```

### Problema: PM2 não encontrado
```bash
# Reinstalar PM2
npm install -g pm2

# Verificar PATH
echo $PATH
```

## 📈 Próximos Passos

Ver arquivo `ROADMAP.md` para plano de expansão.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

MIT License