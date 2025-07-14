# 🚀 Guia Simplificado de Deploy - FuseLoja

## 📋 **Informações do Deploy**
- **Domínio**: fuseloja.com.br
- **VPS**: 82.25.69.57 (SSH root)
- **Workflow**: Simplificado com apenas Build e Deploy
- **Método**: Deploy via SCP + SSH

## 🔧 **Configuração de Secrets**

### GitHub Repository Secrets
Acesse: `Settings` → `Secrets and variables` → `Actions`

**Secret Necessária:**
```
VPS_PASSWORD=sua-senha-da-vps
```

> ℹ️ O host (82.25.69.57) e username (root) já estão configurados no workflow

## 🚀 **Como Fazer Deploy**

### **1. Deploy Automático (Recomendado)**
```bash
# Qualquer push na branch main ativa o deploy automaticamente
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
```

### **2. Deploy Manual**
1. Acesse: [GitHub Actions](https://github.com/fernandinhomartins40/fuseloja/actions)
2. Clique em "🚀 Deploy FuseLoja"
3. Clique em "Run workflow"
4. Selecione branch `main`
5. Clique em "Run workflow"

## 📦 **O que o Deploy Faz**

### **Job 1: 🏗️ Build**
- Instala dependências do frontend e backend
- Compila o frontend React para arquivos estáticos
- Copia build do frontend para backend/public
- Cria pacote de deployment compactado

### **Job 2: 🚀 Deploy**
- Envia pacote para VPS via SCP
- Instala Node.js 18 e PM2 (se necessário)
- Configura PostgreSQL (se necessário)
- Extrai pacote e instala dependências de produção
- Configura variáveis de ambiente
- Inicializa banco de dados
- Reinicia aplicação com PM2
- Executa health check

## 🔍 **Verificação do Deploy**

### **URLs de Acesso**
- **Website**: https://fuseloja.com.br
- **Health Check**: http://82.25.69.57:3000/health
- **API**: http://82.25.69.57:3000/

### **Comandos de Verificação no VPS**
```bash
# Conectar no VPS
ssh root@82.25.69.57

# Verificar status da aplicação
pm2 status fuseloja

# Ver logs da aplicação
pm2 logs fuseloja

# Verificar health check
curl http://localhost:3000/health

# Reiniciar aplicação (se necessário)
pm2 restart fuseloja
```

## 🛠️ **Comandos Úteis**

### **Gerenciamento PM2**
```bash
pm2 status fuseloja          # Status da aplicação
pm2 logs fuseloja            # Logs em tempo real
pm2 restart fuseloja         # Reiniciar aplicação
pm2 stop fuseloja            # Parar aplicação
pm2 start fuseloja           # Iniciar aplicação
```

### **Comandos de Sistema**
```bash
# Verificar uso de recursos
htop

# Verificar porta 3000
netstat -tulpn | grep :3000

# Verificar PostgreSQL
systemctl status postgresql
```

## 🚨 **Troubleshooting**

### **Deploy Falhou?**
1. Verifique os logs no GitHub Actions
2. Confira se a secret VPS_PASSWORD está configurada
3. Teste conexão SSH manualmente: `ssh root@82.25.69.57`

### **Aplicação não responde?**
```bash
ssh root@82.25.69.57
pm2 logs fuseloja --lines 50
pm2 restart fuseloja
```

### **Erro de porta em uso?**
```bash
# Verificar o que está usando a porta 3000
lsof -i :3000

# Matar processo se necessário
pkill -f node
pm2 delete all
pm2 start /opt/fuseloja/current/backend/src/index.js --name fuseloja
```

## ✅ **Checklist de Deploy**

- [ ] Secret `VPS_PASSWORD` configurada no GitHub
- [ ] Código commitado na branch `main`
- [ ] Push feito para o repositório
- [ ] Deploy executado com sucesso no GitHub Actions
- [ ] Health check retorna status 200
- [ ] Site acessível em https://fuseloja.com.br

## 📞 **Suporte**

Em caso de problemas:
1. Verificar [GitHub Actions](https://github.com/fernandinhomartins40/fuseloja/actions) para logs do deploy
2. Acessar VPS via SSH para verificar logs da aplicação
3. Executar health check: `curl http://82.25.69.57:3000/health`

---

## 🎉 **Deploy Simplificado Pronto!**

O workflow agora possui apenas **2 jobs essenciais**:
- ✅ **Build**: Compila e empacota a aplicação
- ✅ **Deploy**: Envia e configura na VPS

**Próximos passos:**
1. Configure a secret `VPS_PASSWORD`
2. Faça push na branch main
3. Acompanhe o deploy
4. Acesse https://fuseloja.com.br

🚀 **Deploy em produção simplificado e otimizado!**