#!/bin/bash

echo "🚀 Deploy automático com systemd..."

# Pull latest changes
echo "📦 Atualizando código..."
git pull origin main

# Install dependencies
echo "📋 Instalando dependências..."
npm ci --production

# Restart service automatically
echo "🔄 Reiniciando serviço..."
systemctl --user restart fuseloja.service

# Wait a moment for service to start
sleep 3

# Check status
echo "📊 Status do serviço:"
systemctl --user status fuseloja.service --no-pager

echo ""
echo "✅ Deploy concluído!"
echo "🔗 API disponível em: http://www.fuseloja.com.br:3000"