#!/bin/bash

# Script para automatizar o deploy no GitHub
# Uso: ./auto-deploy.sh "mensagem do commit"

set -e  # Para na primeira falha

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para exibir mensagens coloridas
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verifica se uma mensagem de commit foi fornecida
if [ -z "$1" ]; then
    log_warn "Nenhuma mensagem de commit fornecida. Usando mensagem padrão."
    COMMIT_MSG="Auto-deploy: $(date '+%Y-%m-%d %H:%M:%S')"
else
    COMMIT_MSG="$1"
fi

log_info "Iniciando deploy automático..."

# Verifica se há mudanças para commitar
if git diff --quiet && git diff --staged --quiet; then
    log_warn "Nenhuma mudança detectada. Nada para commitar."
    exit 0
fi

# Adiciona todas as mudanças
log_info "Adicionando mudanças ao stage..."
git add .

# Verifica se há algo para commitar após o add
if git diff --staged --quiet; then
    log_warn "Nenhuma mudança para commitar após git add."
    exit 0
fi

# Commit das mudanças
log_info "Realizando commit com mensagem: '$COMMIT_MSG'"
git commit -m "$COMMIT_MSG"

# Push para o GitHub
log_info "Enviando mudanças para o GitHub..."
git push origin main

log_info "Deploy realizado com sucesso! ✅"
log_info "As mudanças foram enviadas para: https://github.com/fernandinhomartins40/fuseloja.git" 