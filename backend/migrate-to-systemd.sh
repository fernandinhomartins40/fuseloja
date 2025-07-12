#!/bin/bash

echo "🔄 Migrando de PM2 para systemd..."

# Stop and remove PM2 process
echo "⏹️ Parando PM2..."
npm run deploy:stop 2>/dev/null || echo "PM2 já estava parado"

# Copy service file to systemd
echo "📋 Instalando serviço systemd..."
sudo cp fuseloja.service /etc/systemd/system/

# Reload systemd and enable service
echo "🔄 Recarregando systemd..."
sudo systemctl daemon-reload
sudo systemctl enable fuseloja.service

# Start the service
echo "🚀 Iniciando serviço..."
sudo systemctl start fuseloja.service

# Check status
echo "📊 Status do serviço:"
sudo systemctl status fuseloja.service --no-pager

echo ""
echo "✅ Migração completa!"
echo "📝 Comandos úteis:"
echo "   sudo systemctl status fuseloja    # Ver status"
echo "   sudo systemctl restart fuseloja   # Reiniciar"
echo "   sudo journalctl -u fuseloja -f    # Ver logs em tempo real"