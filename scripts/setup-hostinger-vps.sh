#!/bin/bash

# 🚀 Fuseloja Backend - Hostinger VPS Setup Script
# Este script configura automaticamente a VPS Hostinger para o deploy

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variáveis
DEPLOY_USER="deploy"
APP_NAME="fuseloja-backend"
APP_DIR="/opt/$APP_NAME"

# Funções auxiliares
print_header() {
    echo -e "${BLUE}=================================================${NC}"
    echo -e "${BLUE}🚀 $1${NC}"
    echo -e "${BLUE}=================================================${NC}"
}

print_step() {
    echo -e "${YELLOW}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "Este script deve ser executado como root"
        exit 1
    fi
}

# Verificar se é root
check_root

print_header "CONFIGURAÇÃO INICIAL DA VPS HOSTINGER"

# 1. Atualizar sistema
print_step "Atualizando sistema..."
apt update && apt upgrade -y
print_success "Sistema atualizado"

# 2. Instalar dependências essenciais
print_step "Instalando dependências essenciais..."
apt install -y \
    curl \
    wget \
    git \
    nano \
    htop \
    iotop \
    unzip \
    zip \
    net-tools \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    ufw \
    fail2ban \
    logrotate \
    cron \
    certbot
print_success "Dependências instaladas"

# 3. Instalar Docker
print_step "Instalando Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    print_success "Docker instalado"
else
    print_success "Docker já está instalado"
fi

# 4. Instalar Docker Compose
print_step "Instalando Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    apt install -y docker-compose
    print_success "Docker Compose instalado"
else
    print_success "Docker Compose já está instalado"
fi

# 5. Criar usuário deploy
print_step "Criando usuário deploy..."
if ! id "$DEPLOY_USER" &>/dev/null; then
    adduser --disabled-password --gecos "" $DEPLOY_USER
    usermod -aG docker $DEPLOY_USER
    usermod -aG sudo $DEPLOY_USER
    print_success "Usuário deploy criado"
else
    print_success "Usuário deploy já existe"
fi

# 6. Configurar SSH para usuário deploy
print_step "Configurando SSH..."
sudo -u $DEPLOY_USER mkdir -p /home/$DEPLOY_USER/.ssh
sudo -u $DEPLOY_USER chmod 700 /home/$DEPLOY_USER/.ssh
sudo -u $DEPLOY_USER touch /home/$DEPLOY_USER/.ssh/authorized_keys
sudo -u $DEPLOY_USER chmod 600 /home/$DEPLOY_USER/.ssh/authorized_keys

# Copiar chaves SSH do root para deploy (se existir)
if [ -f /root/.ssh/authorized_keys ]; then
    cp /root/.ssh/authorized_keys /home/$DEPLOY_USER/.ssh/
    chown $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.ssh/authorized_keys
    print_success "Chaves SSH copiadas para usuário deploy"
fi

# 7. Configurar firewall
print_step "Configurando firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp
ufw --force enable
print_success "Firewall configurado"

# 8. Configurar fail2ban
print_step "Configurando fail2ban..."
systemctl enable fail2ban
systemctl start fail2ban
print_success "Fail2ban configurado"

# 9. Configurar swap (2GB)
print_step "Configurando swap..."
if [ ! -f /swapfile ]; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    echo 'vm.swappiness=10' >> /etc/sysctl.conf
    print_success "Swap configurado"
else
    print_success "Swap já configurado"
fi

# 10. Criar diretório da aplicação
print_step "Criando diretório da aplicação..."
mkdir -p $APP_DIR
chown $DEPLOY_USER:$DEPLOY_USER $APP_DIR
print_success "Diretório da aplicação criado"

# 11. Configurar logrotate
print_step "Configurando logrotate..."
cat > /etc/logrotate.d/$APP_NAME << 'EOF'
/opt/fuseloja-backend/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 deploy deploy
    postrotate
        docker-compose -f /opt/fuseloja-backend/docker-compose.yml restart backend || true
    endscript
}
EOF
print_success "Logrotate configurado"

# 12. Configurar timezone
print_step "Configurando timezone..."
timedatectl set-timezone America/Sao_Paulo
print_success "Timezone configurado"

# 13. Otimizar sistema
print_step "Otimizando sistema..."
cat >> /etc/sysctl.conf << 'EOF'

# Otimizações para servidor web
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 87380 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216
net.core.netdev_max_backlog = 5000
net.ipv4.tcp_congestion_control = bbr
EOF
sysctl -p
print_success "Sistema otimizado"

# 14. Instalar Node.js (caso seja necessário para debug)
print_step "Instalando Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
print_success "Node.js instalado"

# 15. Criar scripts de monitoramento
print_step "Criando scripts de monitoramento..."
sudo -u $DEPLOY_USER bash << 'EOF'
# Criar script de monitoramento
cat > /home/deploy/monitor.sh << 'MONITOR_EOF'
#!/bin/bash

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🔍 Fuseloja Backend - Status Report${NC}"
echo "================================================="
echo "📅 $(date)"
echo "================================================="

# System Resources
echo -e "${YELLOW}💻 System Resources:${NC}"
echo "CPU Usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
echo "Memory Usage: $(free -m | grep '^Mem' | awk '{printf "%.1f%%", $3/$2 * 100}')"
echo "Disk Usage: $(df -h / | tail -1 | awk '{print $5}')"
echo "Load Average: $(uptime | awk -F'load average:' '{print $2}')"
echo "Swap Usage: $(free -m | grep '^Swap' | awk '{printf "%.1f%%", $3/$2 * 100}')"

# Network
echo -e "${YELLOW}🌐 Network:${NC}"
echo "Active Connections: $(netstat -an | grep :80 | wc -l)"
echo "Listening Ports: $(netstat -tlnp | grep LISTEN | wc -l)"

# Docker Status
echo -e "${YELLOW}🐳 Docker Status:${NC}"
if command -v docker &> /dev/null; then
    echo "Docker Status: Running"
    echo "Images: $(docker images -q | wc -l)"
    echo "Containers: $(docker ps -a -q | wc -l)"
    echo "Running Containers: $(docker ps -q | wc -l)"
else
    echo "Docker Status: Not installed"
fi

# Application Status
echo -e "${YELLOW}🏥 Application Status:${NC}"
if [ -f "/opt/fuseloja-backend/docker-compose.yml" ]; then
    cd /opt/fuseloja-backend
    if docker-compose ps | grep -q "Up"; then
        echo "Application Status: Running"
    else
        echo "Application Status: Stopped"
    fi
else
    echo "Application Status: Not deployed"
fi

# System Health Checks
echo -e "${YELLOW}🔍 Health Checks:${NC}"
# Check HTTP
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ HTTP Health Check: PASSED${NC}"
else
    echo -e "${RED}❌ HTTP Health Check: FAILED${NC}"
fi

# Check disk space
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//g')
if [ $DISK_USAGE -lt 80 ]; then
    echo -e "${GREEN}✅ Disk Space: OK ($DISK_USAGE%)${NC}"
else
    echo -e "${RED}❌ Disk Space: WARNING ($DISK_USAGE%)${NC}"
fi

# Check memory
MEM_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100}')
if [ $MEM_USAGE -lt 85 ]; then
    echo -e "${GREEN}✅ Memory Usage: OK ($MEM_USAGE%)${NC}"
else
    echo -e "${RED}❌ Memory Usage: WARNING ($MEM_USAGE%)${NC}"
fi

echo "================================================="
MONITOR_EOF

chmod +x /home/deploy/monitor.sh
EOF

print_success "Scripts de monitoramento criados"

# 16. Criar script de backup
print_step "Criando script de backup..."
sudo -u $DEPLOY_USER bash << 'EOF'
cat > /home/deploy/backup.sh << 'BACKUP_EOF'
#!/bin/bash

BACKUP_DIR="/opt/fuseloja-backend/backups"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/opt/fuseloja-backend"

echo "🔄 Starting backup process..."

# Verificar se aplicação existe
if [ ! -d "$APP_DIR" ]; then
    echo "❌ Application directory not found: $APP_DIR"
    exit 1
fi

# Criar diretório de backup
mkdir -p $BACKUP_DIR

# Backup do banco de dados
if [ -f "$APP_DIR/data/app.db" ]; then
    echo "📊 Backing up database..."
    cp $APP_DIR/data/app.db $BACKUP_DIR/app_db_$DATE.db
fi

# Backup de uploads
if [ -d "$APP_DIR/uploads" ]; then
    echo "📁 Backing up uploads..."
    tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz -C $APP_DIR uploads/
fi

# Backup de configurações
if [ -f "$APP_DIR/docker-compose.yml" ]; then
    echo "⚙️ Backing up configurations..."
    tar -czf $BACKUP_DIR/config_$DATE.tar.gz -C $APP_DIR docker-compose.yml nginx.conf
fi

# Remover backups antigos (manter apenas 7 dias)
find $BACKUP_DIR -name "*.db" -mtime +7 -delete 2>/dev/null || true
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete 2>/dev/null || true

echo "✅ Backup completed successfully!"
echo "📁 Backup location: $BACKUP_DIR"
echo "📊 Backup size: $(du -sh $BACKUP_DIR | cut -f1)"
BACKUP_EOF

chmod +x /home/deploy/backup.sh
EOF

print_success "Script de backup criado"

# 17. Configurar cron jobs básicos
print_step "Configurando cron jobs..."
sudo -u $DEPLOY_USER bash << 'EOF'
# Adicionar cron jobs básicos
(crontab -l 2>/dev/null; echo "# Fuseloja Backend Maintenance") | crontab -
(crontab -l 2>/dev/null; echo "0 2 * * * /home/deploy/backup.sh >> /var/log/backup.log 2>&1") | crontab -
(crontab -l 2>/dev/null; echo "0 1 * * 0 docker system prune -f >> /var/log/docker-cleanup.log 2>&1") | crontab -
EOF

print_success "Cron jobs configurados"

# 18. Configurar logs
print_step "Configurando sistema de logs..."
mkdir -p /var/log/fuseloja
chown $DEPLOY_USER:$DEPLOY_USER /var/log/fuseloja
touch /var/log/backup.log
touch /var/log/docker-cleanup.log
chown $DEPLOY_USER:$DEPLOY_USER /var/log/backup.log /var/log/docker-cleanup.log
print_success "Sistema de logs configurado"

# 19. Configurar SSH mais seguro
print_step "Configurando SSH seguro..."
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
cat > /etc/ssh/sshd_config << 'EOF'
Port 22
Protocol 2
HostKey /etc/ssh/ssh_host_rsa_key
HostKey /etc/ssh/ssh_host_ed25519_key
UsePrivilegeSeparation yes
KeyRegenerationInterval 3600
ServerKeyBits 1024
SyslogFacility AUTH
LogLevel INFO
LoginGraceTime 120
PermitRootLogin yes
StrictModes yes
RSAAuthentication yes
PubkeyAuthentication yes
IgnoreRhosts yes
RhostsRSAAuthentication no
HostbasedAuthentication no
PermitEmptyPasswords no
ChallengeResponseAuthentication no
PasswordAuthentication yes
X11Forwarding yes
X11DisplayOffset 10
PrintMotd no
PrintLastLog yes
TCPKeepAlive yes
AcceptEnv LANG LC_*
Subsystem sftp /usr/lib/openssh/sftp-server
UsePAM yes
MaxAuthTries 6
ClientAliveInterval 300
ClientAliveCountMax 2
EOF

systemctl restart sshd
print_success "SSH configurado"

# 20. Criar arquivo de informações do sistema
print_step "Criando arquivo de informações..."
sudo -u $DEPLOY_USER bash << 'EOF'
cat > /home/deploy/system-info.txt << 'INFO_EOF'
# Fuseloja Backend - System Information
# Generated on: $(date)

## Server Details
- OS: $(lsb_release -d | cut -f2)
- Kernel: $(uname -r)
- Architecture: $(uname -m)
- Hostname: $(hostname)
- IP Address: $(curl -s ifconfig.me)

## Software Versions
- Docker: $(docker --version)
- Docker Compose: $(docker-compose --version)
- Node.js: $(node --version)
- npm: $(npm --version)

## System Resources
- CPU: $(nproc) cores
- Memory: $(free -h | grep '^Mem' | awk '{print $2}')
- Disk: $(df -h / | tail -1 | awk '{print $2}')
- Swap: $(free -h | grep '^Swap' | awk '{print $2}')

## Network Configuration
- Firewall: $(ufw status | head -1)
- Open Ports: 22, 80, 443, 3000

## Application Setup
- App Directory: /opt/fuseloja-backend
- Deploy User: deploy
- Backup Directory: /opt/fuseloja-backend/backups
- Log Directory: /var/log/fuseloja

## Useful Commands
- Monitor: /home/deploy/monitor.sh
- Backup: /home/deploy/backup.sh
- Logs: docker-compose -f /opt/fuseloja-backend/docker-compose.yml logs
- Status: docker-compose -f /opt/fuseloja-backend/docker-compose.yml ps
- Restart: docker-compose -f /opt/fuseloja-backend/docker-compose.yml restart

## SSH Connection
ssh deploy@$(curl -s ifconfig.me)

## Next Steps
1. Configure GitHub Secrets with VPS details
2. Push code to trigger deployment
3. Configure domain DNS
4. Test application endpoints
INFO_EOF
EOF

print_success "Arquivo de informações criado"

# Mensagem final
print_header "CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!"

echo -e "${GREEN}🎉 Sua VPS Hostinger está configurada e pronta para receber o deploy!${NC}"
echo ""
echo -e "${YELLOW}📋 Informações importantes:${NC}"
echo -e "   IP do Servidor: $(curl -s ifconfig.me)"
echo -e "   Usuário SSH: $DEPLOY_USER"
echo -e "   Diretório da App: $APP_DIR"
echo -e "   Portas abertas: 22, 80, 443, 3000"
echo ""
echo -e "${YELLOW}📝 Próximos passos:${NC}"
echo -e "   1. Configure os GitHub Secrets com os dados da VPS"
echo -e "   2. Faça push do código para disparar o deploy"
echo -e "   3. Configure o DNS do seu domínio"
echo -e "   4. Teste os endpoints da aplicação"
echo ""
echo -e "${YELLOW}🔧 Comandos úteis:${NC}"
echo -e "   Monitorar sistema: /home/deploy/monitor.sh"
echo -e "   Backup manual: /home/deploy/backup.sh"
echo -e "   Informações: cat /home/deploy/system-info.txt"
echo ""
echo -e "${YELLOW}📞 Suporte:${NC}"
echo -e "   Hostinger: https://hpanel.hostinger.com"
echo -e "   AI Assistant: Kodee (via painel)"
echo -e "   Documentação: Veja o arquivo HOSTINGER_DEPLOY_GUIDE.md"
echo ""
echo -e "${GREEN}✅ Setup concluído! Boa sorte com o deploy! 🚀${NC}" 