# 🚀 Guia de Auto-Deploy para GitHub

Este projeto foi configurado com múltiplas soluções para automatizar o deploy no GitHub sempre que você salvar as implementações.

## 📋 Soluções Implementadas

### 1. 🔧 Script Manual de Deploy

**Arquivos:** `auto-deploy.sh` (Linux/Mac) e `auto-deploy.bat` (Windows)

#### Como usar:

**Linux/Mac:**
```bash
# Deploy com mensagem personalizada
./auto-deploy.sh "Adiciona nova funcionalidade X"

# Deploy com mensagem automática (data/hora)
./auto-deploy.sh
```

**Windows:**
```cmd
# Deploy com mensagem personalizada
auto-deploy.bat "Adiciona nova funcionalidade X"

# Deploy com mensagem automática
auto-deploy.bat
```

#### O que o script faz:
- ✅ Verifica se há mudanças para commitar
- ✅ Adiciona todas as mudanças (`git add .`)
- ✅ Realiza o commit com mensagem personalizada ou automática
- ✅ Faz push para o GitHub
- ✅ Fornece feedback visual do processo

### 2. 🤖 GitHub Actions (CI/CD Automático)

**Arquivo:** `.github/workflows/auto-deploy.yml`

#### Como funciona:
- ✅ Executa automaticamente a cada push na branch `main`
- ✅ Instala dependências (`npm ci`)
- ✅ Executa linter (`npm run lint`)
- ✅ Faz verificação de tipos (`npx tsc --noEmit`)
- ✅ Builds do projeto (`npm run build`)
- ✅ Deploy automático para GitHub Pages

#### Configuração:
1. Vá para as configurações do seu repositório no GitHub
2. Navegue até `Settings > Pages`
3. Selecione `GitHub Actions` como fonte
4. O workflow será executado automaticamente

### 3. 🎣 Git Hooks (Auto-Push após Commit)

**Arquivos:** `.git/hooks/post-commit` e `.git/hooks/hook-config`

#### Como funciona:
- ✅ Executa automaticamente após cada `git commit`
- ✅ Faz push automático para o GitHub
- ✅ Só executa em branches configuradas (main, master por padrão)
- ✅ Configurável através do arquivo `hook-config`

#### Configuração:
Edite o arquivo `.git/hooks/hook-config`:
```bash
# Habilitar/desabilitar auto-push
AUTO_PUSH=true

# Branches onde executar (separadas por espaço)
BRANCHES="main master"

# Remote para onde fazer push
REMOTE="origin"
```

#### Para desabilitar temporariamente:
```bash
# Edite o arquivo .git/hooks/hook-config
AUTO_PUSH=false
```

## 🔄 Fluxo de Trabalho Recomendado

### Opção 1: Workflow Tradicional + Git Hook
```bash
# Faça suas alterações
git add .
git commit -m "Sua mensagem de commit"
# O hook automaticamente fará o push!
```

### Opção 2: Script de Deploy Completo
```bash
# Faça suas alterações e use o script
./auto-deploy.sh "Implementa funcionalidade X"
```

### Opção 3: GitHub Actions (Totalmente Automático)
```bash
# Apenas faça push normalmente
git push origin main
# O GitHub Actions cuida do resto!
```

## 🛠️ Comandos Úteis

### Testar o Auto-Deploy:
```bash
# Fazer uma alteração de teste
echo "# Teste" >> test.txt
./auto-deploy.sh "Teste de auto-deploy"
```

### Verificar Status do Git:
```bash
git status
git log --oneline -5
```

### Verificar Execução do GitHub Actions:
- Acesse: `https://github.com/fernandinhomartins40/fuseloja/actions`
- Veja o status dos workflows

## 🔗 Links Úteis

- **Repositório:** https://github.com/fernandinhomartins40/fuseloja
- **GitHub Actions:** https://github.com/fernandinhomartins40/fuseloja/actions
- **GitHub Pages:** https://fernandinhomartins40.github.io/fuseloja/

## 🚨 Troubleshooting

### Problema: Hook não executa
**Solução:** Verifique se o arquivo tem permissão de execução:
```bash
chmod +x .git/hooks/post-commit
```

### Problema: GitHub Actions falha
**Solução:** 
1. Verifique os logs em `Actions` no GitHub
2. Verifique se todos os scripts no `package.json` existem
3. Verifique se o projeto compila localmente: `npm run build`

### Problema: Push rejeitado
**Solução:**
1. Verifique suas credenciais do GitHub
2. Certifique-se de que tem permissões de push no repositório
3. Faça pull das mudanças remotas: `git pull origin main`

## 🎯 Próximos Passos

1. **Teste** cada solução para ver qual funciona melhor para você
2. **Configure** o GitHub Pages se quiser hospedar o site
3. **Personalize** os scripts conforme suas necessidades
4. **Monitore** os workflows do GitHub Actions

---

💡 **Dica:** Você pode usar várias soluções simultaneamente. O script manual é ótimo para deploys urgentes, enquanto o GitHub Actions garante que tudo seja testado antes do deploy! 