# 🔐 Configurar GitHub Secrets e Variables - Fuseloja

## 📋 Instruções Completas

### 1. Acessar Configurações do GitHub

1. Vá para o seu repositório: `https://github.com/fernandinhomartins40/fuseloja`
2. Clique em **Settings** (Configurações)
3. No menu lateral, clique em **Secrets and variables** → **Actions**

### 2. Configurar GitHub Secrets

Clique em **New repository secret** e adicione cada um dos seguintes secrets:

#### 🔑 SSH e VPS
```
Nome: SSH_HOST
Valor: 82.25.69.57
```

```
Nome: SSH_USERNAME
Valor: root
```

```
Nome: SSH_PASSWORD
Valor: Nando157940/
```

#### 🔐 JWT (Autenticação)
```
Nome: JWT_SECRET
Valor: fuseloja-super-secret-jwt-key-2024-production-secure-$(date +%s)
```

```
Nome: JWT_REFRESH_SECRET
Valor: fuseloja-super-secret-refresh-key-2024-production-secure-$(date +%s)
```

#### 📧 Email (Configuração)
```
Nome: EMAIL_HOST
Valor: smtp.gmail.com
```

```
Nome: EMAIL_PORT
Valor: 587
```

```
Nome: EMAIL_USER
Valor: noreply@fuseloja.com.br
```

```
Nome: EMAIL_PASSWORD
Valor: [SUA_SENHA_DE_APP_GMAIL]
```

*Nota: Para EMAIL_PASSWORD, você precisa gerar uma senha de app no Gmail:*
1. Acesse https://myaccount.google.com/security
2. Ative a verificação em duas etapas
3. Gere uma senha de app para "Fuseloja"
4. Use essa senha gerada

### 3. Configurar GitHub Variables

Clique na aba **Variables** e adicione:

#### 🌐 Domínio
```
Nome: DOMAIN_NAME
Valor: www.fuseloja.com.br
```

#### 🔗 CORS
```
Nome: CORS_ORIGINS
Valor: https://www.fuseloja.com.br,https://fuseloja.com.br
```

### 4. Verificar Configuração

Após adicionar todos os secrets e variables, sua lista deve ter:

**Secrets:**
- ✅ SSH_HOST
- ✅ SSH_USERNAME  
- ✅ SSH_PASSWORD
- ✅ JWT_SECRET
- ✅ JWT_REFRESH_SECRET
- ✅ EMAIL_HOST
- ✅ EMAIL_PORT
- ✅ EMAIL_USER
- ✅ EMAIL_PASSWORD

**Variables:**
- ✅ DOMAIN_NAME
- ✅ CORS_ORIGINS

### 5. Executar Script de Setup na VPS

Agora execute o script de configuração na VPS:

```bash
# Conectar na VPS
ssh root@82.25.69.57

# Fazer download e executar o script
curl -fsSL https://raw.githubusercontent.com/fernandinhomartins40/fuseloja/main/scripts/setup-vps-fuseloja.sh | bash

# Ou manualmente:
wget https://raw.githubusercontent.com/fernandinhomartins40/fuseloja/main/scripts/setup-vps-fuseloja.sh
chmod +x setup-vps-fuseloja.sh
./setup-vps-fuseloja.sh
```

### 6. Configurar DNS do Domínio

Você precisa configurar o DNS do seu domínio para apontar para a VPS:

#### No seu provedor de domínio:
```
Tipo: A
Nome: @
Valor: 82.25.69.57
TTL: 300

Tipo: A
Nome: www
Valor: 82.25.69.57
TTL: 300
```

### 7. Testar Deploy

Depois de configurar tudo, faça um push para testar:

```bash
# Fazer uma alteração pequena
git add .
git commit -m "Configurar deploy automático para VPS Fuseloja"
git push origin main
```

### 8. Verificar Funcionamento

Após alguns minutos, acesse:
- **Aplicação**: https://www.fuseloja.com.br
- **API**: https://www.fuseloja.com.br/api
- **Health Check**: https://www.fuseloja.com.br/health

### 9. Comandos Úteis na VPS

```bash
# Ver logs do deploy
tail -f /var/log/fuseloja-monitor.log

# Status da aplicação
docker ps

# Reiniciar aplicação
cd /opt/fuseloja-fullstack
docker-compose restart

# Deploy manual
/usr/local/bin/deploy-fuseloja.sh

# Backup manual
/usr/local/bin/backup-fuseloja.sh
```

### 10. Troubleshooting

#### SSL não funciona:
```bash
# Na VPS, renovar certificado após configurar DNS
sudo certbot --nginx -d www.fuseloja.com.br -d fuseloja.com.br
```

#### Aplicação não inicia:
```bash
# Verificar logs
docker logs fuseloja-fullstack

# Verificar configuração
cd /opt/fuseloja-fullstack
docker-compose logs -f
```

#### GitHub Actions falha:
1. Verifique se todos os secrets estão configurados
2. Veja os logs do GitHub Actions
3. Confirme se a VPS está acessível

## 🎯 Checklist Final

- [ ] Todos os GitHub Secrets configurados
- [ ] Todas as GitHub Variables configuradas
- [ ] Script executado na VPS
- [ ] DNS configurado
- [ ] Deploy executado com sucesso
- [ ] Aplicação funcionando em https://www.fuseloja.com.br
- [ ] SSL funcionando
- [ ] API respondendo

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs do GitHub Actions
2. Conecte na VPS e verifique os logs
3. Confirme se o DNS está propagado
4. Teste o SSL manualmente

---

**🎉 Após completar todos os passos, sua aplicação estará funcionando em https://www.fuseloja.com.br com deploy automático!** 