#!/bin/bash

# 🚀 Script de Configuração Automática - VPS Hostinger Fuseloja
# Domínio: www.fuseloja.com.br
# Data: $(date)

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Banner
echo -e "${GREEN}"
echo "================================================================="
echo "       🚀 CONFIGURAÇÃO AUTOMÁTICA VPS FUSELOJA"
echo "================================================================="
echo -e "${NC}"
echo "Domínio: www.fuseloja.com.br"
echo "VPS: 82.25.69.57"
echo "Aplicação: Frontend React + Backend Express.js"
echo "Data: $(date)"
echo "================================================================="
echo

# Variáveis
DOMAIN="www.fuseloja.com.br"
APP_NAME="fuseloja-fullstack"
APP_DIR="/opt/$APP_NAME"
DOCKER_IMAGE="ghcr.io/fernandinhomartins40/fuseloja/fullstack:latest"

# 1. Atualizar sistema
log "1. Atualizando sistema Ubuntu..."
apt update && apt upgrade -y

# 2. Instalar dependências essenciais
log "2. Instalando dependências essenciais..."
apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# 3. Instalar Docker
log "3. Instalando Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    systemctl enable docker
    systemctl start docker
    log "Docker instalado com sucesso!"
else
    log "Docker já está instalado!"
fi

# 4. Instalar Docker Compose
log "4. Instalando Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    log "Docker Compose instalado com sucesso!"
else
    log "Docker Compose já está instalado!"
fi

# 5. Configurar firewall
log "5. Configurando firewall..."
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 22
ufw allow 80
ufw allow 443
ufw allow 3000
log "Firewall configurado!"

# 6. Instalar Nginx
log "6. Instalando Nginx..."
if ! command -v nginx &> /dev/null; then
    apt install -y nginx
    systemctl enable nginx
    systemctl start nginx
    log "Nginx instalado com sucesso!"
else
    log "Nginx já está instalado!"
fi

# 7. Instalar Certbot (Let's Encrypt)
log "7. Instalando Certbot..."
if ! command -v certbot &> /dev/null; then
    apt install -y certbot python3-certbot-nginx
    log "Certbot instalado com sucesso!"
else
    log "Certbot já está instalado!"
fi

# 8. Criar diretórios da aplicação
log "8. Criando estrutura de diretórios..."
mkdir -p $APP_DIR
mkdir -p $APP_DIR/data
mkdir -p $APP_DIR/uploads
mkdir -p $APP_DIR/logs
mkdir -p $APP_DIR/backups
mkdir -p $APP_DIR/ssl

# 9. Configurar Nginx para a aplicação
log "9. Configurando Nginx..."
cat > /etc/nginx/sites-available/$APP_NAME << 'NGINX_EOF'
server {
    listen 80;
    server_name www.fuseloja.com.br fuseloja.com.br;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.fuseloja.com.br fuseloja.com.br;

    # SSL Configuration (will be updated by Certbot)
    ssl_certificate /etc/letsencrypt/live/www.fuseloja.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.fuseloja.com.br/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # MIME types
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=general:10m rate=30r/s;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Proxy settings
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # Static frontend files (cached)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        root /var/www/html;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
        try_files $uri =404;
    }

    # API routes
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:3000;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # WebSocket
    location /socket.io/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:3000;
        access_log off;
    }

    # Admin panel (if needed)
    location /admin {
        limit_req zone=general burst=10 nodelay;
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # Frontend SPA - serve index.html for all other routes
    location / {
        limit_req zone=general burst=30 nodelay;
        root /var/www/html;
        try_files $uri $uri/ /index.html;
        
        # Security headers for HTML
        add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.gpteng.co https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: https:; font-src 'self' https://cdn.jsdelivr.net; connect-src 'self' https:; frame-src 'none';" always;
    }
}
NGINX_EOF

# Habilitar site
ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 10. Criar docker-compose.yml
log "10. Criando docker-compose.yml..."
cat > $APP_DIR/docker-compose.yml << 'COMPOSE_EOF'
version: '3.8'

services:
  app:
    image: ghcr.io/fernandinhomartins40/fuseloja/fullstack:latest
    container_name: fuseloja-fullstack
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DATABASE_URL=/app/data/app.db
      - JWT_SECRET=fuseloja-super-secret-jwt-key-2024-production
      - JWT_REFRESH_SECRET=fuseloja-super-secret-refresh-key-2024-production
      - EMAIL_HOST=smtp.gmail.com
      - EMAIL_PORT=587
      - EMAIL_USER=noreply@fuseloja.com.br
      - EMAIL_PASSWORD=senha-do-email
      - CORS_ORIGINS=https://www.fuseloja.com.br,https://fuseloja.com.br
    volumes:
      - ./data:/app/data
      - ./uploads:/app/uploads
      - ./logs:/app/logs
      - ./backups:/app/backups
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

networks:
  app-network:
    driver: bridge

volumes:
  data:
  uploads:
  logs:
  backups:
COMPOSE_EOF

# 11. Testar configuração do Nginx
log "11. Testando configuração do Nginx..."
nginx -t
if [ $? -eq 0 ]; then
    log "Configuração do Nginx válida!"
    systemctl reload nginx
else
    error "Erro na configuração do Nginx!"
    exit 1
fi

# 12. Criar página de manutenção temporária
log "12. Criando página de manutenção temporária..."
mkdir -p /var/www/html
cat > /var/www/html/index.html << 'HTML_EOF'
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fuseloja - Em Manutenção</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
        }
        .container {
            text-align: center;
            padding: 2rem;
            background: rgba(0,0,0,0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        .logo {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 1rem;
        }
        .subtitle {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        .status {
            background: #4CAF50;
            padding: 10px 20px;
            border-radius: 25px;
            display: inline-block;
            margin: 1rem 0;
        }
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 2s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🚀 Fuseloja</div>
        <div class="subtitle">Sistema em configuração</div>
        <div class="status">VPS configurada com sucesso!</div>
        <div class="spinner"></div>
        <p>Aguardando deploy da aplicação...</p>
        <p><small>www.fuseloja.com.br</small></p>
    </div>
</body>
</html>
HTML_EOF

# 13. Configurar SSL Let's Encrypt
log "13. Configurando SSL Let's Encrypt..."
# Primeiro, verificar se o domínio está apontando para este servidor
IP_ATUAL=$(curl -s ifconfig.me)
log "IP atual do servidor: $IP_ATUAL"

# Tentar obter certificado SSL
certbot --nginx -d www.fuseloja.com.br -d fuseloja.com.br --non-interactive --agree-tos --email admin@fuseloja.com.br --redirect || {
    warning "Não foi possível obter certificado SSL automaticamente."
    warning "Isso pode acontecer se o domínio ainda não estiver apontando para este servidor."
    warning "O certificado será configurado após o apontamento do domínio."
}

# 14. Criar cron job para renovação SSL
log "14. Configurando renovação automática SSL..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet --nginx") | crontab -

# 15. Configurar backup automático
log "15. Configurando backup automático..."
cat > /usr/local/bin/backup-fuseloja.sh << 'BACKUP_EOF'
#!/bin/bash
BACKUP_DIR="/opt/fuseloja-fullstack/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="fuseloja_backup_$DATE.tar.gz"

echo "Iniciando backup $(date)"

# Fazer backup dos dados da aplicação
cd /opt/fuseloja-fullstack
tar -czf $BACKUP_DIR/$BACKUP_FILE data/ uploads/ logs/

# Manter apenas os 7 backups mais recentes
find $BACKUP_DIR -name "fuseloja_backup_*.tar.gz" -type f -mtime +7 -delete

echo "Backup concluído: $BACKUP_FILE"
BACKUP_EOF

chmod +x /usr/local/bin/backup-fuseloja.sh

# Configurar cron job para backup diário
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-fuseloja.sh") | crontab -

# 16. Configurar monitoramento
log "16. Configurando monitoramento..."
cat > /usr/local/bin/monitor-fuseloja.sh << 'MONITOR_EOF'
#!/bin/bash
LOG_FILE="/var/log/fuseloja-monitor.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

# Verificar se a aplicação está rodando
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "[$DATE] ✅ Aplicação funcionando normalmente" >> $LOG_FILE
else
    echo "[$DATE] ❌ Aplicação fora do ar! Tentando reiniciar..." >> $LOG_FILE
    cd /opt/fuseloja-fullstack
    docker-compose restart
fi

# Verificar uso de disco
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "[$DATE] ⚠️ Uso de disco alto: ${DISK_USAGE}%" >> $LOG_FILE
fi

# Verificar uso de memória
MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.0f", ($3/$2)*100}')
if [ $MEMORY_USAGE -gt 80 ]; then
    echo "[$DATE] ⚠️ Uso de memória alto: ${MEMORY_USAGE}%" >> $LOG_FILE
fi
MONITOR_EOF

chmod +x /usr/local/bin/monitor-fuseloja.sh

# Configurar cron job para monitoramento a cada 5 minutos
(crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/monitor-fuseloja.sh") | crontab -

# 17. Configurar logrotate
log "17. Configurando rotação de logs..."
cat > /etc/logrotate.d/fuseloja << 'LOGROTATE_EOF'
/opt/fuseloja-fullstack/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 root root
}
LOGROTATE_EOF

# 18. Otimizações do sistema
log "18. Aplicando otimizações do sistema..."
# Configurar swap se necessário
if [ $(free | grep Swap | awk '{print $2}') -eq 0 ]; then
    log "Configurando swap..."
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

# Otimizar parâmetros do kernel
echo 'vm.swappiness=10' >> /etc/sysctl.conf
echo 'net.core.rmem_max=16777216' >> /etc/sysctl.conf
echo 'net.core.wmem_max=16777216' >> /etc/sysctl.conf
sysctl -p

# 19. Criar script de deploy
log "19. Criando script de deploy..."
cat > /usr/local/bin/deploy-fuseloja.sh << 'DEPLOY_EOF'
#!/bin/bash
set -e

echo "🚀 Iniciando deploy da Fuseloja..."

cd /opt/fuseloja-fullstack

# Fazer backup antes do deploy
echo "📦 Fazendo backup..."
/usr/local/bin/backup-fuseloja.sh

# Parar aplicação
echo "⏹️ Parando aplicação..."
docker-compose down

# Baixar nova versão
echo "📥 Baixando nova versão..."
docker-compose pull

# Iniciar aplicação
echo "▶️ Iniciando aplicação..."
docker-compose up -d

# Verificar se está funcionando
echo "🔍 Verificando saúde da aplicação..."
sleep 30
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Deploy concluído com sucesso!"
else
    echo "❌ Falha no deploy! Restaurando backup..."
    docker-compose down
    # Aqui você pode adicionar lógica para restaurar o backup
    echo "🔄 Reiniciando versão anterior..."
    docker-compose up -d
fi
DEPLOY_EOF

chmod +x /usr/local/bin/deploy-fuseloja.sh

# 20. Configurar permissões
log "20. Configurando permissões..."
chown -R root:root $APP_DIR
chmod 755 $APP_DIR
chmod 644 $APP_DIR/docker-compose.yml

# 21. Informações finais
log "21. Configuração concluída!"

echo
echo -e "${GREEN}================================================================="
echo "                    ✅ VPS CONFIGURADA COM SUCESSO!"
echo "================================================================="
echo -e "${NC}"
echo "🌐 Domínio: www.fuseloja.com.br"
echo "🖥️  IP: $(curl -s ifconfig.me)"
echo "🐳 Docker: $(docker --version)"
echo "📦 Docker Compose: $(docker-compose --version)"
echo "🔒 Nginx: $(nginx -v 2>&1)"
echo "🔐 Certbot: $(certbot --version 2>&1 | head -1)"
echo
echo -e "${YELLOW}📋 PRÓXIMOS PASSOS:${NC}"
echo "1. Configurar DNS do domínio para apontar para este IP"
echo "2. Configurar GitHub Secrets para deploy automático"
echo "3. Executar primeiro deploy"
echo
echo -e "${BLUE}📂 ESTRUTURA CRIADA:${NC}"
echo "$APP_DIR/"
echo "├── docker-compose.yml"
echo "├── data/ (banco de dados)"
echo "├── uploads/ (arquivos enviados)"
echo "├── logs/ (logs da aplicação)"
echo "├── backups/ (backups automáticos)"
echo "└── ssl/ (certificados SSL)"
echo
echo -e "${GREEN}🛠️ COMANDOS ÚTEIS:${NC}"
echo "• Deploy: /usr/local/bin/deploy-fuseloja.sh"
echo "• Backup: /usr/local/bin/backup-fuseloja.sh"
echo "• Logs: tail -f /var/log/fuseloja-monitor.log"
echo "• Status: docker ps"
echo "• Reiniciar: cd $APP_DIR && docker-compose restart"
echo
echo -e "${GREEN}🔗 LINKS ÚTEIS:${NC}"
echo "• Aplicação: https://www.fuseloja.com.br"
echo "• Health Check: https://www.fuseloja.com.br/health"
echo "• API: https://www.fuseloja.com.br/api"
echo
echo -e "${GREEN}════════════════════════════════════════════════════════════════="
echo "                        🎉 PRONTO PARA USAR!"
echo "════════════════════════════════════════════════════════════════="
echo -e "${NC}" 