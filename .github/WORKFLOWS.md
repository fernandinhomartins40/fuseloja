# 🔄 GitHub Actions Workflows - FuseLoja

## 📋 Workflows Disponíveis

Temos apenas **3 workflows essenciais** para o deploy simplificado:

### 1. 🚀 **Deploy FuseLoja** (`deploy.yml`)
**Workflow principal de deploy**

- **Trigger**: Push automático na branch `main` ou execução manual
- **Jobs**: Build → Deploy
- **Credenciais**: Apenas `VPS_PASSWORD` necessária
- **Destino**: fuseloja.com.br (82.25.69.57)

**O que faz:**
1. **Build**: Compila frontend, instala dependências, cria pacote
2. **Deploy**: Envia para VPS, configura ambiente, inicia aplicação

### 2. 🔐 **Test VPS_PASSWORD Secret** (`test-secrets.yml`)  
**Verifica se a secret está configurada**

- **Trigger**: Manual apenas
- **Função**: Valida se `VPS_PASSWORD` está configurada
- **Output**: Guia passo a passo se estiver faltando

### 3. 🧪 **Test VPS Connection** (`test-connection.yml`)
**Testa conectividade com a VPS**

- **Trigger**: Manual apenas  
- **Função**: Conecta na VPS e verifica:
  - Conexão SSH
  - Software instalado (Node.js, PM2, PostgreSQL)
  - Diretórios de deploy
  - Status geral do servidor

## 🎯 **Como Usar**

### **Deploy Automático**
```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin main  # Ativa deploy automaticamente
```

### **Deploy Manual**
1. Acesse [GitHub Actions](../../actions)
2. Clique em "🚀 Deploy FuseLoja"
3. Clique "Run workflow"

### **Testar Configuração**
1. **Testar secret**: Execute "🔐 Test VPS_PASSWORD Secret"
2. **Testar conexão**: Execute "🧪 Test VPS Connection"

## ⚙️ **Configuração Necessária**

### **Secret Obrigatória**
```
VPS_PASSWORD = senha-da-vps-root
```

**Como configurar:**
1. Acesse **Settings** → **Secrets and variables** → **Actions**
2. Clique **New repository secret**
3. Nome: `VPS_PASSWORD`
4. Valor: Senha do SSH `root@82.25.69.57`

### **Credenciais Pré-configuradas**
- **Host**: `82.25.69.57` (hard-coded)
- **Username**: `root` (hard-coded)
- **Domínio**: `fuseloja.com.br`

## 📊 **Status dos Workflows**

| Workflow | Status | Função |
|----------|--------|---------|
| 🚀 Deploy FuseLoja | ✅ Principal | Deploy automático/manual |
| 🔐 Test VPS_PASSWORD | ✅ Utilitário | Verificar secret |
| 🧪 Test VPS Connection | ✅ Utilitário | Testar conectividade |

## 🗑️ **Workflows Removidos**

Para simplificar, foram removidos:
- ❌ `deploy-minimal.yml` (redundante)
- ❌ `deploy-scp.yml` (redundante)  
- ❌ `diagnose-server.yml` (desnecessário)
- ❌ `emergency-fix.yml` (desnecessário)
- ❌ `fix-server.yml` (desnecessário)

## 🚀 **Próximos Passos**

1. ✅ Configure `VPS_PASSWORD` secret
2. ✅ Execute "Test VPS_PASSWORD Secret" para verificar
3. ✅ Execute "Test VPS Connection" para testar conectividade  
4. ✅ Faça push na branch main para deploy automático
5. ✅ Acesse https://fuseloja.com.br

## 🔗 **Links Úteis**

- [🌐 Site](https://fuseloja.com.br)
- [❤️ Health Check](http://82.25.69.57:3000/health)
- [📊 GitHub Actions](../../actions)
- [⚙️ Repository Settings](../../settings)

---

## ✨ **Deploy Simplificado!**

Apenas **1 secret** + **3 workflows** = Deploy completo! 🚀 