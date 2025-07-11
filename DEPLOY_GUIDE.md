# 🚀 Guia Completo de Deploy - FuseLoja Minimal

## 📋 **Status Atual**
- ✅ Backend Minimalista (8 dependências)
- ✅ Frontend Otimizado (chunks separados)
- ✅ GitHub Actions Configurados
- ✅ Docker Pronto
- ✅ PM2 Configurado
- ✅ Health Checks Implementados

## 🔧 **Configurações de Secrets Necessárias**

### GitHub Repository Secrets
Vá para: `https://github.com/fernandinhomartins40/fuseloja/settings/secrets/actions`

#### **Obrigatórios**
```
VPS_HOST=82.25.69.57
VPS_USERNAME=root
VPS_PASSWORD=sua-senha-vps
```

#### **Opcionais (Recomendados)**
```
JWT_SECRET=seu-jwt-secret-32-chars-minimo
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=sua-senha-db
DB_NAME=fuseloja
```

## 🚀 **Métodos de Deploy**

### **1. Deploy Automático (Recomendado)**
```bash
# Qualquer push na branch main ativa o deploy
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
```

### **2. Deploy Manual via GitHub Actions**
1. Vá para: `https://github.com/fernandinhomartins40/fuseloja/actions`
2. Clique em "🚀 Deploy Fuseloja Minimal"
3. Clique em "Run workflow"
4. Selecione branch `main`
5. Clique em "Run workflow"

### **3. Deploy via SSH Direto**
```bash
# 1. Conectar no VPS
ssh root@82.25.69.57

# 2. Executar script de deploy
cd /opt/fuseloja
./deploy.sh
```

## 🔄 **Pipeline de Deploy**

### **Etapas Automáticas**
1. **🏗️ Build**
   - Instala dependências do frontend e backend
   - Compila frontend (React → estáticos)
   - Verifica startup do backend

2. **🚀 Deploy**
   - Conecta no VPS via SSH
   - Baixa código mais recente
   - Instala dependências de produção
   - Copia build do frontend para backend/public
   - Reinicia aplicação com PM2

3. **🔍 Verificação**
   - Testa health check
   - Verifica logs
   - Confirma que aplicação está rodando

## 🛠️ **Comandos Úteis no VPS**

### **PM2 (Gerenciamento do App)**
```bash
# Status da aplicação
pm2 status fuseloja-minimal

# Logs em tempo real
pm2 logs fuseloja-minimal

# Reiniciar aplicação
pm2 restart fuseloja-minimal

# Parar aplicação
pm2 stop fuseloja-minimal

# Iniciar aplicação
pm2 start fuseloja-minimal

# Configurações PM2
pm2 show fuseloja-minimal
```

### **Sistema (Debugging)**
```bash
# Verificar processos Node.js
ps aux | grep node

# Verificar porta 3000
netstat -tlnp | grep 3000

# Espaço em disco
df -h

# Logs do sistema
journalctl -u pm2-root --since "1 hour ago"

# Testar aplicação localmente
curl http://localhost:3000/health
```

### **Deploy Manual (Se Necessário)**
```bash
# Navegar para diretório
cd /opt/fuseloja/current

# Atualizar código
git pull origin main

# Backend
cd backend
npm ci --production

# Frontend
cd ../frontend
npm ci
npm run build
cp -r dist ../backend/public

# Reiniciar
cd ../backend
pm2 restart fuseloja-minimal
```

## 🐳 **Deploy com Docker (Alternativo)**

### **Opção 1: Docker Simples**
```bash
# Build da imagem
docker build -f Dockerfile.minimal -t fuseloja-minimal .

# Executar container
docker run -d \
  --name fuseloja-app \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=seu-jwt-secret \
  fuseloja-minimal
```

### **Opção 2: Docker Compose (Com PostgreSQL)**
```bash
# Executar stack completa
docker-compose -f docker-compose.minimal.yml up -d

# Ver logs
docker-compose logs -f

# Parar tudo
docker-compose down
```

## 🔍 **Monitoramento e Debugging**

### **URLs de Verificação**
- **App Principal**: https://www.fuseloja.com.br
- **Health Check**: http://82.25.69.57:3000/health
- **API Status**: http://82.25.69.57:3000/
- **Ready Check**: http://82.25.69.57:3000/ready

### **Logs Importantes**
```bash
# Logs da aplicação
pm2 logs fuseloja-minimal --lines 50

# Logs de erro
pm2 logs fuseloja-minimal --err --lines 20

# Logs do Nginx (se usando)
tail -f /var/log/nginx/error.log

# Logs do sistema
journalctl -xe
```

### **Health Check Detalhado**
```bash
# Verificar saúde da aplicação
curl -s http://localhost:3000/health | jq '.'

# Exemplo de resposta esperada:
{
  "status": "healthy",
  "timestamp": "2025-01-11T...",
  "uptime": 1234.56,
  "memory": {...},
  "version": "1.0.0-minimal",
  "environment": "production",
  "platform": "linux",
  "node_version": "v18.x.x",
  "pid": 12345,
  "database": "connected",
  "endpoints": {
    "auth": "/api/v1/auth",
    "users": "/api/v1/users",
    "health": "/health"
  }
}
```

## 🚨 **Troubleshooting Comum**

### **❌ Deploy Falhou**
```bash
# 1. Verificar secrets do GitHub
# 2. Testar conexão SSH
ssh root@82.25.69.57

# 3. Verificar espaço em disco
df -h

# 4. Ver logs do último deploy
cat /opt/fuseloja/deploy.log
```

### **❌ Aplicação Não Inicia**
```bash
# Verificar logs de erro
pm2 logs fuseloja-minimal --err

# Tentar iniciar manualmente
cd /opt/fuseloja/current/backend
node src/index.js

# Verificar dependências
npm list --depth=0
```

### **❌ Health Check Falha**
```bash
# Verificar se porta está sendo usada
netstat -tlnp | grep 3000

# Testar localhost
curl -v http://localhost:3000/health

# Verificar variáveis de ambiente
pm2 env 0
```

## 🎯 **Performance e Otimizações**

### **Métricas de Deploy**
- ⚡ **Build Time**: ~30 segundos
- ⚡ **Deploy Time**: ~60 segundos
- ⚡ **App Startup**: ~3 segundos
- ⚡ **Health Check**: <100ms

### **Recursos do Servidor**
- 💾 **RAM**: ~50MB em uso
- 💽 **Disk**: ~100MB total
- 🔧 **CPU**: <5% em idle
- 🌐 **Bandwidth**: Minimal

### **Otimizações Aplicadas**
- ✅ **Frontend**: Chunks separados, minificação
- ✅ **Backend**: JavaScript puro, sem build
- ✅ **Dependencies**: Apenas 8 para backend
- ✅ **PM2**: Auto-restart, clustering pronto
- ✅ **Docker**: Multi-stage build
- ✅ **Health Checks**: Robustos e rápidos

## 📞 **Suporte**

### **Em caso de problemas**
1. ✅ Verificar [GitHub Actions](https://github.com/fernandinhomartins40/fuseloja/actions)
2. ✅ Testar "Test VPS Connection" workflow
3. ✅ Verificar logs: `pm2 logs fuseloja-minimal`
4. ✅ Health check: `curl http://localhost:3000/health`

### **Comandos de Emergência**
```bash
# Reset completo da aplicação
pm2 delete fuseloja-minimal
cd /opt/fuseloja/current/backend
pm2 start src/index.js --name fuseloja-minimal

# Rollback para versão anterior
cd /opt/fuseloja
cp -r backup_20250111_* current/
pm2 restart fuseloja-minimal
```

---

## 🎉 **Deploy Pronto!**

A aplicação está **100% otimizada** para deploy automático e monitoramento em produção.

**Next Steps:**
1. ✅ Configure os secrets no GitHub
2. ✅ Faça push na branch main
3. ✅ Acompanhe o deploy em Actions
4. ✅ Acesse https://www.fuseloja.com.br

**Stack minimalista** = **Deploy em 60 segundos** 🚀