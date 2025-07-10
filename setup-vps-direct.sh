#!/bin/bash

# Script de configuração rápida para VPS Fuseloja
set -e

echo "🚀 Configurando VPS Fuseloja..."
echo "IP: 82.25.69.57"
echo "Domínio: www.fuseloja.com.br"
echo "=========================="

# Atualizar sistema
apt update && apt upgrade -y

# Instalar dependências
apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Instalar Docker
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    systemctl enable docker
    systemctl start docker
fi

# Instalar Docker Compose
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Instalar Nginx
if ! command -v nginx &> /dev/null; then
    apt install -y nginx
    systemctl enable nginx
    systemctl start nginx
fi

# Instalar Certbot
if ! command -v certbot &> /dev/null; then
    apt install -y certbot python3-certbot-nginx
fi

# Configurar firewall
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 22
ufw allow 80
ufw allow 443
ufw allow 3000

# Criar diretórios
mkdir -p /opt/fuseloja-fullstack
mkdir -p /opt/fuseloja-fullstack/data
mkdir -p /opt/fuseloja-fullstack/uploads
mkdir -p /opt/fuseloja-fullstack/logs
mkdir -p /opt/fuseloja-fullstack/backups
mkdir -p /opt/fuseloja-fullstack/ssl

# Configurar Nginx
cat > /etc/nginx/sites-available/fuseloja-fullstack << 'EOF'
server {
    listen 80;
    server_name www.fuseloja.com.br fuseloja.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Habilitar site
ln -sf /etc/nginx/sites-available/fuseloja-fullstack /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Testar e recarregar Nginx
nginx -t && systemctl reload nginx

# Criar página de status
mkdir -p /var/www/html
cat > /var/www/html/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Fuseloja - VPS Configurada</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .success { color: #4CAF50; }
        .info { color: #2196F3; }
    </style>
</head>
<body>
    <h1 class="success">🚀 Fuseloja VPS Configurada!</h1>
    <p class="info">IP: 82.25.69.57</p>
    <p class="info">Domínio: www.fuseloja.com.br</p>
    <p>Aguardando deploy da aplicação...</p>
</body>
</html>
EOF

# Mostrar status
echo "✅ VPS configurada com sucesso!"
echo "📊 Informações:"
echo "- IP: $(curl -s ifconfig.me)"
echo "- Docker: $(docker --version)"
echo "- Nginx: $(nginx -v 2>&1)"
echo "- Certbot: $(certbot --version 2>&1 | head -1)"
echo ""
echo "🔧 Próximos passos:"
echo "1. Configurar DNS para apontar para este IP"
echo "2. Configurar GitHub Secrets"
echo "3. Fazer deploy da aplicação"
echo ""
echo "🌐 Acesse: http://$(curl -s ifconfig.me)" 