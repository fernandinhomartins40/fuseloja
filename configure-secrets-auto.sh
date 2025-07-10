#!/bin/bash

# 🤖 Script Automatizado - Configurar GitHub Secrets
# Requisito: GitHub CLI instalado (gh)

set -e

echo "🚀 Configurando GitHub Secrets automaticamente..."
echo "=================================================="

# Verificar se GitHub CLI está instalado
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI não encontrado!"
    echo "Instale com: sudo apt install gh"
    echo "Ou use a configuração manual."
    exit 1
fi

# Verificar se está logado
if ! gh auth status &> /dev/null; then
    echo "🔐 Fazendo login no GitHub..."
    gh auth login
fi

echo "✅ GitHub CLI configurado!"
echo ""

# Configurar Secrets
echo "🔑 Configurando Secrets..."

gh secret set SSH_HOST --body "82.25.69.57"
echo "✅ SSH_HOST configurado"

gh secret set SSH_USERNAME --body "root"
echo "✅ SSH_USERNAME configurado"

gh secret set SSH_PASSWORD --body "Nando157940/"
echo "✅ SSH_PASSWORD configurado"

gh secret set JWT_SECRET --body "fuseloja-super-secret-jwt-key-2024-production-secure"
echo "✅ JWT_SECRET configurado"

gh secret set JWT_REFRESH_SECRET --body "fuseloja-super-secret-refresh-key-2024-production-secure"
echo "✅ JWT_REFRESH_SECRET configurado"

gh secret set EMAIL_HOST --body "smtp.gmail.com"
echo "✅ EMAIL_HOST configurado"

gh secret set EMAIL_PORT --body "587"
echo "✅ EMAIL_PORT configurado"

gh secret set EMAIL_USER --body "noreply@fuseloja.com.br"
echo "✅ EMAIL_USER configurado"

# EMAIL_PASSWORD precisa ser configurado manualmente
echo "⚠️  EMAIL_PASSWORD precisa ser configurado manualmente:"
echo "   1. Gere senha de app no Gmail"
echo "   2. Execute: gh secret set EMAIL_PASSWORD --body 'SUA_SENHA_GERADA'"

echo ""
echo "🔧 Configurando Variables..."

gh variable set DOMAIN_NAME --body "www.fuseloja.com.br"
echo "✅ DOMAIN_NAME configurado"

gh variable set CORS_ORIGINS --body "https://www.fuseloja.com.br,https://fuseloja.com.br"
echo "✅ CORS_ORIGINS configurado"

echo ""
echo "🎉 Configuração concluída!"
echo "=================================================="
echo "📋 Secrets configurados: 8/9 (falta EMAIL_PASSWORD)"
echo "📋 Variables configurados: 2/2"
echo ""
echo "🔗 Verificar: https://github.com/fernandinhomartins40/fuseloja/settings/secrets/actions"
echo ""
echo "⚡ Próximos passos:"
echo "1. Configure EMAIL_PASSWORD manualmente"
echo "2. Configure DNS do domínio"
echo "3. O deploy será ativado automaticamente!" 