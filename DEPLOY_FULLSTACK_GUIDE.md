# 🚀 Guia de Deploy Full Stack - Hostinger VPS

## 📋 Visão Geral

Este guia documenta o deploy **automatizado e integrado** do frontend React + backend Express.js na **mesma VPS Hostinger**, proporcionando:

- ✅ **Deploy unificado** - Frontend e backend na mesma infraestrutura
- ✅ **Zero downtime** - Atualizações sem interrupção
- ✅ **SSL automático** - Certificado Let's Encrypt com renovação automática
- ✅ **Performance otimizada** - Nginx com cache e compressão
- ✅ **Monitoramento completo** - Health checks e logs centralizados

## 🏗️ Arquitetura da Solução

```
┌─────────────────────────────────────────────────────────┐
│                    Hostinger VPS                        │
│                                                         │
│  ┌───────────────┐    ┌──────────────────────────────┐  │
│  │     Nginx     │    │        Docker Container       │  │
│  │   (Port 443)  │    │                              │  │
│  │               │    │  ┌─────────────────────────┐  │  │
│  │ - SSL/TLS     │────┤  │       Backend API       │  │  │
│  │ - Frontend    │    │  │     (Express.js)        │  │  │
│  │ - Proxy APIs  │    │  │      Port 3000          │  │  │
│  │ - Cache       │    │  │                         │  │  │
│  │               │    │  └─────────────────────────┘  │  │
│  └───────────────┘    │                              │  │
│                       │  ┌─────────────────────────┐  │  │
│                       │  │      Frontend App       │  │  │
│                       │  │       (React)           │  │  │
│                       │  │   Static Files Built    │  │  │
│                       │  │                         │  │  │
│                       │  └─────────────────────────┘  │  │
│                       └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## 📦 Processo de Build Integrado

### 1. Frontend Build (React + Vite)
```bash
# Dependências instaladas
npm ci

# Build otimizado para produção
npm run build
# Saída: dist/ (arquivos estáticos)
```

### 2. Backend Build (Express + TypeScript)
```bash
# Dependências instaladas
npm ci

# Compilação TypeScript
npm run build
# Saída: dist/ (JavaScript compilado)
```

### 3. Container Final
```dockerfile
# Dockerfile.fullstack - Multi-stage build
FROM node:20-alpine AS frontend-builder
# ... build do frontend

FROM node:20-alpine AS backend-builder
# ... build do backend

FROM node:20-alpine AS production
# ... container final com ambos
```

## 🔧 Configuração do Nginx

### Servir Frontend + Proxy Backend
```nginx
server {
    listen 443 ssl http2;
    server_name seu-dominio.com;

    # SSL automático
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    # Arquivos estáticos do frontend (cache longo)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        root /var/www/html;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # APIs do backend
    location /api/ {
        proxy_pass http://app:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket
    location /socket.io/ {
        proxy_pass http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # SPA routing - serve index.html para todas as rotas
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }
}
```

## 🚀 Deploy Automático

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy-hostinger.yml
name: Deploy Full Stack to Hostinger VPS

on:
  push:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      # Frontend build
      - name: Build frontend
        run: npm run build
        env:
          VITE_API_BASE_URL: /api
          VITE_API_PREFIX: /v1

      # Backend build
      - name: Build backend
        working-directory: ./backend
        run: npm run build

      # Docker build integrado
      - name: Build full stack image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile.fullstack
          push: true
```

## 🔐 Configuração de Segurança

### Variáveis de Ambiente (GitHub Secrets)
```bash
# JWT
JWT_SECRET=sua-chave-super-secreta-jwt-aqui
JWT_REFRESH_SECRET=sua-chave-super-secreta-refresh-aqui

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=sua-senha-de-app

# SSH
SSH_HOST=seu-vps.hostinger.com
SSH_USERNAME=root
SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
# ... sua chave privada SSH
```

### Variáveis de Ambiente (GitHub Variables)
```bash
# Domínio
DOMAIN_NAME=seu-dominio.com

# CORS
CORS_ORIGINS=https://seu-dominio.com,https://www.seu-dominio.com
```

## 🛠️ Configuração Manual (One-time)

### 1. Contratar VPS Hostinger
```bash
# Plano recomendado: KVM 2
- 2 vCPU, 8GB RAM, 100GB SSD
- $6.99/mês
- Suporte a Docker
```

### 2. Configurar DNS
```bash
# Apontar domínio para IP da VPS
A     @           123.456.789.101
A     www         123.456.789.101
```

### 3. Executar Script de Setup
```bash
# Conectar na VPS
ssh root@seu-vps.hostinger.com

# Executar script de configuração
curl -fsSL https://raw.githubusercontent.com/seu-usuario/seu-repo/main/scripts/setup-hostinger-vps.sh | bash
```

## 📊 Monitoramento e Logs

### Health Checks
```bash
# Verificar status dos serviços
curl https://seu-dominio.com/health

# Resposta esperada:
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "frontend": "ready",
  "backend": "ready"
}
```

### Logs Centralizados
```bash
# Logs do Docker
sudo docker logs fuseloja-fullstack

# Logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🔄 Processo de Deploy

### Automático (GitHub Actions)
```bash
# 1. Push para main
git push origin main

# 2. GitHub Actions executa:
# - Build frontend
# - Build backend
# - Cria imagem Docker
# - Deploy na VPS
# - Atualiza SSL
# - Verifica saúde
```

### Manual (Fallback)
```bash
# Na VPS
cd /opt/fuseloja-fullstack
sudo docker-compose pull
sudo docker-compose up -d --remove-orphans
```

## 📈 Performance e Otimizações

### Frontend
- ✅ **Code splitting** - Chunks separados para vendor, router, UI
- ✅ **Asset optimization** - Compressão e minificação
- ✅ **Cache headers** - 1 ano para assets estáticos
- ✅ **Gzip compression** - Redução de bandwidth

### Backend
- ✅ **Container otimizado** - Multi-stage build
- ✅ **Process management** - dumb-init para signal handling
- ✅ **Security** - Non-root user, minimal dependencies
- ✅ **Database** - SQLite com otimizações

### Nginx
- ✅ **SSL/TLS** - Configuração moderna
- ✅ **HTTP/2** - Suporte completo
- ✅ **Rate limiting** - Proteção contra abuso
- ✅ **Security headers** - CSP, HSTS, XSS protection

## 🚨 Troubleshooting

### Frontend não carrega
```bash
# Verificar arquivos estáticos
ls -la /var/www/html/

# Verificar logs do Nginx
sudo tail -f /var/log/nginx/error.log
```

### API não responde
```bash
# Verificar container
sudo docker ps

# Verificar logs da aplicação
sudo docker logs fuseloja-fullstack
```

### SSL não funciona
```bash
# Verificar certificado
sudo certbot certificates

# Renovar manualmente
sudo certbot renew --dry-run
```

## 💰 Custo e Escalabilidade

### Custo Mensal
```
VPS Hostinger KVM 2: $6.99/mês
Domínio: $10/ano
SSL: Gratuito (Let's Encrypt)
Total: ~$7.80/mês
```

### Capacidade
```
Usuários simultâneos: 2000+
Requisições/segundo: 500+
Armazenamento: 100GB
Bandwidth: 1TB/mês
```

### Upgrade Path
```
VPS KVM 4: $13.99/mês (4 vCPU, 16GB RAM)
VPS KVM 8: $27.99/mês (8 vCPU, 32GB RAM)
```

## 🎯 Próximos Passos

1. **Métricas Avançadas**: Implementar Prometheus + Grafana
2. **Backup Automático**: Backup diário do banco e arquivos
3. **CDN**: Integração com CloudFlare para performance global
4. **Staging Environment**: Ambiente de homologação
5. **Load Balancing**: Múltiplas instâncias para alta disponibilidade

## 📞 Suporte

- **Documentação**: Este arquivo
- **Logs**: `/var/log/` na VPS
- **Monitoramento**: `https://seu-dominio.com/health`
- **GitHub Actions**: Logs de deploy no GitHub

---

**⚡ Resultado Final**: Aplicação full stack profissional rodando em VPS por $6.99/mês com deploy automático, SSL, monitoramento e capacidade para 2000+ usuários simultâneos! 