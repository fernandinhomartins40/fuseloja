# 🚀 Guia Completo: Deploy na VPS Hostinger

## 📋 Índice
1. [Preparação da VPS](#1-preparação-da-vps)
2. [Configuração do GitHub](#2-configuração-do-github)
3. [Configurações Manuais](#3-configurações-manuais)
4. [Deploy Automático](#4-deploy-automático)
5. [Monitoramento](#5-monitoramento)
6. [Troubleshooting](#6-troubleshooting)

## 1. Preparação da VPS

### 1.1 Contratar VPS Hostinger

**Plano Recomendado**: KVM 2 (2 vCPU, 8GB RAM, 100GB SSD) - $6.99/mês

1. Acesse: https://www.hostinger.com/vps-hosting
2. Escolha o plano **KVM 2**
3. Selecione **Ubuntu 22.04 LTS**
4. Configure seu domínio (se tiver)
5. Conclua o pagamento

### 1.2 Configuração Inicial da VPS

Após receber os dados de acesso, execute:

```bash
# Conectar via SSH
ssh root@YOUR_VPS_IP

# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependências essenciais
sudo apt install -y curl wget git nano htop unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo apt install -y docker-compose

# Criar usuário para deploy (não usar root)
sudo adduser deploy
sudo usermod -aG docker deploy
sudo usermod -aG sudo deploy

# Configurar SSH para usuário deploy
sudo mkdir -p /home/deploy/.ssh
sudo chown deploy:deploy /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh
```

### 1.3 Gerar Chave SSH

```bash
# No seu computador local
ssh-keygen -t ed25519 -C "fuseloja-deploy" -f ~/.ssh/hostinger_deploy

# Copiar chave pública para VPS
ssh-copy-id -i ~/.ssh/hostinger_deploy.pub deploy@YOUR_VPS_IP

# Testar conexão
ssh -i ~/.ssh/hostinger_deploy deploy@YOUR_VPS_IP
```

## 2. Configuração do GitHub

### 2.1 Secrets do GitHub

No GitHub, vá em **Settings → Secrets → Actions** e adicione:

```yaml
# VPS Connection
VPS_HOST: "YOUR_VPS_IP"
VPS_USERNAME: "deploy"
VPS_SSH_KEY: "CONTEUDO_DA_CHAVE_PRIVADA"
VPS_PORT: "22"

# JWT Secrets
JWT_SECRET: "YOUR_JWT_SECRET_HERE"
JWT_REFRESH_SECRET: "YOUR_JWT_REFRESH_SECRET_HERE"

# Email Configuration
EMAIL_HOST: "smtp.gmail.com"
EMAIL_PORT: "587"
EMAIL_USER: "your-email@gmail.com"
EMAIL_PASSWORD: "your-app-password"

# SSL Certificate
SSL_EMAIL: "your-email@gmail.com"
```

### 2.2 Variables do GitHub

Em **Settings → Variables → Actions**:

```yaml
# Domain Configuration
DOMAIN_NAME: "your-domain.com"
APP_URL: "https://your-domain.com"
CORS_ORIGINS: "https://your-frontend-domain.com,https://your-domain.com"
```

### 2.3 Configurar Environments

Crie dois environments:
- **production** (branch main)
- **staging** (outras branches)

## 3. Configurações Manuais

### 3.1 Configurar Firewall

```bash
# Conectar à VPS
ssh -i ~/.ssh/hostinger_deploy deploy@YOUR_VPS_IP

# Configurar UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw --force enable

# Verificar status
sudo ufw status verbose
```

### 3.2 Configurar Swap (Para VPS com pouco RAM)

```bash
# Criar arquivo de swap de 2GB
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Tornar permanente
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Configurar swappiness
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
```

### 3.3 Configurar Domínio

Se você tem um domínio, configure o DNS:

```bash
# Registros DNS necessários
A     @               YOUR_VPS_IP
A     www             YOUR_VPS_IP
A     api             YOUR_VPS_IP
CNAME backend         @
```

### 3.4 Instalar Monitoramento

```bash
# Instalar htop e iotop
sudo apt install -y htop iotop

# Configurar logrotate
sudo tee /etc/logrotate.d/fuseloja << 'EOF'
/opt/fuseloja-backend/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 deploy deploy
    postrotate
        docker-compose -f /opt/fuseloja-backend/docker-compose.yml restart backend
    endscript
}
EOF
```

## 4. Deploy Automático

### 4.1 Estrutura do Workflow

O workflow GitHub Actions criado faz:

1. **Build & Test**: Compila e testa o código
2. **Security Scan**: Verifica vulnerabilidades
3. **Deploy**: Deploys para VPS via SSH
4. **SSL Setup**: Configura certificados Let's Encrypt
5. **Verification**: Testa os endpoints
6. **Notification**: Notifica resultado

### 4.2 Primeiro Deploy

```bash
# Fazer push para main branch
git add .
git commit -m "feat: setup hostinger deployment"
git push origin main

# O deploy será executado automaticamente
```

### 4.3 Verificar Deploy

```bash
# Conectar à VPS
ssh -i ~/.ssh/hostinger_deploy deploy@YOUR_VPS_IP

# Verificar serviços
sudo docker-compose -f /opt/fuseloja-backend/docker-compose.yml ps

# Ver logs
sudo docker-compose -f /opt/fuseloja-backend/docker-compose.yml logs -f backend
```

## 5. Monitoramento

### 5.1 Scripts de Monitoramento

```bash
# Criar script de monitoramento
sudo tee /opt/fuseloja-backend/monitor.sh << 'EOF'
#!/bin/bash

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🔍 Fuseloja Backend - Status Report${NC}"
echo "================================================="

# System Resources
echo -e "${YELLOW}💻 System Resources:${NC}"
echo "CPU Usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
echo "Memory Usage: $(free -m | grep '^Mem' | awk '{printf "%.1f%%", $3/$2 * 100}')"
echo "Disk Usage: $(df -h / | tail -1 | awk '{print $5}')"
echo "Load Average: $(uptime | awk -F'load average:' '{print $2}')"

# Docker Services
echo -e "${YELLOW}🐳 Docker Services:${NC}"
cd /opt/fuseloja-backend
docker-compose ps

# Application Health
echo -e "${YELLOW}🏥 Application Health:${NC}"
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend API - Healthy${NC}"
else
    echo -e "${RED}❌ Backend API - Unhealthy${NC}"
fi

if curl -f http://localhost/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Nginx Proxy - Healthy${NC}"
else
    echo -e "${RED}❌ Nginx Proxy - Unhealthy${NC}"
fi

# SSL Certificate
echo -e "${YELLOW}🔒 SSL Certificate:${NC}"
if [ -f "/opt/fuseloja-backend/ssl/fullchain.pem" ]; then
    expiry=$(openssl x509 -in /opt/fuseloja-backend/ssl/fullchain.pem -noout -enddate | cut -d= -f2)
    echo "Certificate expires: $expiry"
else
    echo -e "${RED}❌ SSL Certificate not found${NC}"
fi

# Log Tail
echo -e "${YELLOW}📋 Recent Logs:${NC}"
docker-compose logs --tail=10 backend
EOF

chmod +x /opt/fuseloja-backend/monitor.sh
```

### 5.2 Configurar Cron Jobs

```bash
# Editar crontab
crontab -e

# Adicionar as seguintes linhas:
# Backup diário às 2:00 AM
0 2 * * * /opt/fuseloja-backend/backup.sh

# Limpeza de logs semanalmente
0 1 * * 0 docker system prune -f

# Verificação de saúde a cada 5 minutos
*/5 * * * * curl -f http://localhost:3000/health > /dev/null 2>&1 || systemctl restart docker
```

### 5.3 Script de Backup

```bash
# Criar script de backup
sudo tee /opt/fuseloja-backend/backup.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="/opt/fuseloja-backend/backups"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/opt/fuseloja-backend"

echo "🔄 Starting backup process..."

# Criar diretório de backup
mkdir -p $BACKUP_DIR

# Backup do banco de dados
echo "📊 Backing up database..."
cp $APP_DIR/data/app.db $BACKUP_DIR/app_db_$DATE.db

# Backup de uploads
echo "📁 Backing up uploads..."
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz -C $APP_DIR uploads/

# Backup de configurações
echo "⚙️ Backing up configurations..."
tar -czf $BACKUP_DIR/config_$DATE.tar.gz -C $APP_DIR docker-compose.yml nginx.conf

# Remover backups antigos (manter apenas 7 dias)
find $BACKUP_DIR -name "*.db" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "✅ Backup completed successfully!"
EOF

chmod +x /opt/fuseloja-backend/backup.sh
```

## 6. Troubleshooting

### 6.1 Problemas Comuns

#### **Erro: "Permission denied"**
```bash
# Verificar permissões
ls -la /opt/fuseloja-backend/
sudo chown -R deploy:deploy /opt/fuseloja-backend/
```

#### **Erro: "Docker daemon not running"**
```bash
# Reiniciar Docker
sudo systemctl start docker
sudo systemctl enable docker
```

#### **Erro: "Port already in use"**
```bash
# Verificar processos na porta
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443

# Parar processo conflitante
sudo docker-compose -f /opt/fuseloja-backend/docker-compose.yml down
```

#### **Erro: "SSL certificate not found"**
```bash
# Recriar certificado SSL
sudo certbot certonly --standalone -d your-domain.com
sudo cp /etc/letsencrypt/live/your-domain.com/*.pem /opt/fuseloja-backend/ssl/
```

### 6.2 Logs Úteis

```bash
# Logs do backend
sudo docker-compose -f /opt/fuseloja-backend/docker-compose.yml logs -f backend

# Logs do nginx
sudo docker-compose -f /opt/fuseloja-backend/docker-compose.yml logs -f nginx

# Logs do sistema
sudo journalctl -u docker.service -f

# Logs de SSL
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

### 6.3 Comandos de Manutenção

```bash
# Reiniciar todos os serviços
sudo docker-compose -f /opt/fuseloja-backend/docker-compose.yml restart

# Atualizar imagem
sudo docker-compose -f /opt/fuseloja-backend/docker-compose.yml pull
sudo docker-compose -f /opt/fuseloja-backend/docker-compose.yml up -d

# Limpeza completa
sudo docker system prune -a -f
sudo docker volume prune -f

# Verificar recursos
htop
iotop
df -h
```

## 7. Configurações Opcionais

### 7.1 Configurar Alertas via Discord/Slack

```bash
# Instalar webhook para alertas
sudo apt install -y jq

# Criar script de alerta
sudo tee /opt/fuseloja-backend/alert.sh << 'EOF'
#!/bin/bash

WEBHOOK_URL="YOUR_DISCORD_WEBHOOK_URL"
MESSAGE="$1"

curl -H "Content-Type: application/json" \
     -X POST \
     -d "{\"content\": \"🚨 **Fuseloja Alert:** $MESSAGE\"}" \
     $WEBHOOK_URL
EOF

chmod +x /opt/fuseloja-backend/alert.sh
```

### 7.2 Configurar Métricas com Prometheus

```bash
# Adicionar ao docker-compose.yml
cat >> /opt/fuseloja-backend/docker-compose.yml << 'EOF'

  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    networks:
      - backend-network

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    networks:
      - backend-network
EOF
```

## 8. Checklist Final

### ✅ Antes do Deploy
- [ ] VPS contratada e configurada
- [ ] Domínio configurado (se aplicável)
- [ ] Secrets do GitHub configurados
- [ ] Variables do GitHub configuradas
- [ ] Chaves SSH configuradas
- [ ] Firewall configurado

### ✅ Após o Deploy
- [ ] Aplicação está rodando
- [ ] SSL configurado e funcionando
- [ ] Endpoints respondendo
- [ ] Logs sendo coletados
- [ ] Backups configurados
- [ ] Monitoramento ativo

### ✅ Manutenção Regular
- [ ] Verificar logs semanalmente
- [ ] Testar backups mensalmente
- [ ] Atualizar sistema mensalmente
- [ ] Verificar certificados SSL
- [ ] Monitorar recursos

## 9. Contatos e Suporte

### 🆘 Suporte Hostinger
- **Live Chat**: 24/7 disponível
- **AI Assistant**: Kodee (integrado ao painel)
- **Knowledge Base**: help.hostinger.com
- **Email**: success@hostinger.com

### 📊 URLs Importantes
- **Painel VPS**: https://hpanel.hostinger.com
- **Aplicação**: https://your-domain.com
- **API Health**: https://your-domain.com/health
- **API Docs**: https://your-domain.com/api-docs

---

## 🎉 Parabéns!

Seu backend Express.js está agora rodando na VPS Hostinger com:
- ✅ Deploy automático via GitHub Actions
- ✅ SSL/HTTPS configurado
- ✅ Nginx como reverse proxy
- ✅ Docker containerization
- ✅ Backups automáticos
- ✅ Monitoramento de saúde
- ✅ Logs centralizados

**Custo Total**: $6.99/mês para uma solução enterprise-grade! 🚀

---

*Guia atualizado em Janeiro 2025 - Versão 1.0* 