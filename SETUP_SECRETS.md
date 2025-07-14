# 🔐 Configuração da Secret VPS_PASSWORD

## 📋 Passo a Passo para Configurar Deploy

### 1. Acessar Configurações do GitHub
1. Acesse seu repositório: `https://github.com/seu-usuario/fuseloja-1`
2. Clique em **Settings** (Configurações)
3. No menu lateral, clique em **Secrets and variables**
4. Clique em **Actions**

### 2. Criar a Secret VPS_PASSWORD
1. Clique no botão **New repository secret**
2. No campo **Name**, digite: `VPS_PASSWORD`
3. No campo **Secret**, digite a senha da sua VPS (a mesma que você usa para `ssh root@82.25.69.57`)
4. Clique em **Add secret**

### 3. Verificar Configuração
Após criar a secret, você deve ver:
- ✅ **VPS_PASSWORD** - Updated X seconds ago

## 🚀 Testando o Deploy

### Opção 1: Deploy Automático
```bash
# Qualquer commit na branch main ativa o deploy
git add .
git commit -m "feat: configurar deploy simplificado"
git push origin main
```

### Opção 2: Deploy Manual
1. Acesse: [GitHub Actions](https://github.com/seu-usuario/fuseloja-1/actions)
2. Clique em **Deploy FuseLoja**
3. Clique em **Run workflow**
4. Clique em **Run workflow** novamente

## 🔍 Verificando o Deploy

Após o deploy, verifique:
- **GitHub Actions**: Deve mostrar ✅ para Build e Deploy
- **Health Check**: `curl http://82.25.69.57:3000/health`
- **Website**: https://fuseloja.com.br

## ✅ Credenciais Configuradas

O workflow está configurado com:
- **Host**: 82.25.69.57 (hard-coded)
- **Username**: root (hard-coded)
- **Password**: Usa a secret `VPS_PASSWORD`

## 🚨 Troubleshooting

### Secret não funciona?
1. Verifique se o nome está correto: `VPS_PASSWORD`
2. Teste SSH manual: `ssh root@82.25.69.57`
3. Confirme que a senha está correta

### Deploy falha?
1. Verifique os logs no GitHub Actions
2. Confirme que a VPS está acessível
3. Teste conexão: `ping 82.25.69.57`

---

## 🎉 Deploy Simplificado!

Apenas **1 secret** necessária:
- ✅ `VPS_PASSWORD`

Host e username já estão pré-configurados no workflow! 🚀 