# 🔐 Configuração Manual - GitHub Secrets

## 📍 Link Direto
**Acesse agora**: https://github.com/fernandinhomartins40/fuseloja/settings/secrets/actions

## 🔑 Secrets para Adicionar

### 1. SSH_HOST
```
Nome: SSH_HOST
Valor: 82.25.69.57
```

### 2. SSH_USERNAME  
```
Nome: SSH_USERNAME
Valor: root
```

### 3. SSH_PASSWORD
```
Nome: SSH_PASSWORD
Valor: Nando157940/
```

### 4. JWT_SECRET
```
Nome: JWT_SECRET
Valor: fuseloja-super-secret-jwt-key-2024-production-secure
```

### 5. JWT_REFRESH_SECRET
```
Nome: JWT_REFRESH_SECRET
Valor: fuseloja-super-secret-refresh-key-2024-production-secure
```

### 6. EMAIL_HOST
```
Nome: EMAIL_HOST
Valor: smtp.gmail.com
```

### 7. EMAIL_PORT
```
Nome: EMAIL_PORT
Valor: 587
```

### 8. EMAIL_USER
```
Nome: EMAIL_USER
Valor: noreply@fuseloja.com.br
```

### 9. EMAIL_PASSWORD
```
Nome: EMAIL_PASSWORD
Valor: [VOCÊ PRECISA GERAR SENHA DE APP NO GMAIL]
```

**Para gerar a senha do Gmail:**
1. Acesse: https://myaccount.google.com/security
2. Ative "Verificação em duas etapas"
3. Vá em "Senhas de app"
4. Gere uma senha para "Fuseloja"
5. Use essa senha gerada

## 🔧 Variables para Adicionar

Clique na aba **"Variables"** e adicione:

### 1. DOMAIN_NAME
```
Nome: DOMAIN_NAME
Valor: www.fuseloja.com.br
```

### 2. CORS_ORIGINS
```
Nome: CORS_ORIGINS
Valor: https://www.fuseloja.com.br,https://fuseloja.com.br
```

## ✅ Verificação Final

Após adicionar todos, você deve ter:

**Secrets (9 itens):**
- SSH_HOST
- SSH_USERNAME  
- SSH_PASSWORD
- JWT_SECRET
- JWT_REFRESH_SECRET
- EMAIL_HOST
- EMAIL_PORT
- EMAIL_USER
- EMAIL_PASSWORD

**Variables (2 itens):**
- DOMAIN_NAME
- CORS_ORIGINS

## 🚀 Próximo Passo

Após configurar, o deploy será ativado automaticamente no próximo push! 