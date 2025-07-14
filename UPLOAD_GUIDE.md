# 📸 Sistema de Upload de Imagens - FuseLoja

## 🎯 **Problema Resolvido**

O sistema anteriormente não persistia as imagens dos produtos, apenas processava localmente. Agora implementamos upload completo para o backend.

## 🚀 **Funcionalidades Implementadas**

### **Backend (API)**
- **POST** `/api/v1/upload` - Upload de imagens em base64
- **DELETE** `/api/v1/upload/:filename` - Deletar imagens
- **GET** `/uploads/:filename` - Servir imagens estáticas
- Validação de tipos: JPEG, PNG, WebP
- Geração de nomes únicos para evitar conflitos
- Armazenamento em `/backend/uploads/`

### **Frontend**
- Upload automático quando produto é salvo
- Processamento local (compressão, crop, redimensionamento)
- Conversão de data URLs para URLs persistentes
- Feedback visual durante upload

## 🔧 **Como Funciona**

### **1. Processo de Upload**
```
1. Usuário seleciona imagem no formulário
2. Frontend processa (compressão, crop)
3. Gera data URL (base64) temporária
4. Ao salvar produto, converte para upload
5. Backend salva arquivo e retorna URL pública
6. Produto é salvo com URL real da imagem
```

### **2. Fluxo de Dados**
```
Frontend: data:image/jpeg;base64,/9j/4AAQ...
    ↓ (upload)
Backend: /uploads/1731234567890_produto_smartphone.jpg
    ↓ (save)
Database: image_url = '/uploads/1731234567890_produto_smartphone.jpg'
```

## 🎨 **Para Desenvolvedores**

### **Criar Produto com Imagem**
```javascript
// No ProductForm, a imagem é automaticamente convertida
const product = {
  title: 'Smartphone Pro',
  price: 1299.99,
  imageUrl: 'data:image/jpeg;base64,/9j/4AAQ...', // Data URL
  // ... outros campos
};

// Ao salvar, mapProductToBackend() faz:
// 1. Detecta data URL
// 2. Faz upload para backend
// 3. Substitui por URL real
// 4. Salva produto com URL persistente
```

### **API de Upload**
```javascript
// Upload manual
const uploadImage = async (imageData, filename) => {
  const response = await apiClient.post('/upload', {
    imageData, // data:image/jpeg;base64,/9j/4AAQ...
    filename   // opcional
  });
  return response.data.imageUrl; // /uploads/filename.jpg
};
```

## 🛠️ **Configuração**

### **Estrutura de Diretórios**
```
backend/
├── src/
│   └── routes/
│       └── upload.js      # Rotas de upload
├── uploads/               # Imagens armazenadas
│   ├── 1731234567890_produto_smartphone.jpg
│   └── 1731234567891_produto_notebook.png
└── public/               # Frontend build
```

### **Middleware de Arquivos Estáticos**
```javascript
// backend/src/index.js
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
```

## 🔒 **Segurança**

### **Validações Implementadas**
- ✅ Autenticação obrigatória (JWT)
- ✅ Validação de tipos de arquivo
- ✅ Sanitização de nomes de arquivo
- ✅ Proteção contra directory traversal
- ✅ Validação de formato base64

### **Tipos Permitidos**
- `image/jpeg` (.jpg, .jpeg)
- `image/png` (.png)
- `image/webp` (.webp)

## 📊 **Monitoramento**

### **Logs do Sistema**
```bash
# Logs de upload
✅ Image uploaded successfully: {
  filename: '1731234567890_produto_smartphone.jpg',
  size: 245760,
  type: 'image/jpeg',
  url: '/uploads/1731234567890_produto_smartphone.jpg'
}

# Logs de produto
🔄 Fazendo upload da imagem principal...
✅ Upload da imagem principal concluído: /uploads/...
```

### **Verificar Uploads**
```bash
# Listar arquivos de upload
ls -la /opt/fuseloja/current/backend/uploads/

# Verificar tamanho total
du -sh /opt/fuseloja/current/backend/uploads/

# Testar acesso a imagem
curl -I https://fuseloja.com.br/uploads/filename.jpg
```

## 🐛 **Solução de Problemas**

### **Imagem não aparece na lista**
1. Verificar se upload foi bem-sucedido
2. Conferir URL no banco de dados
3. Testar acesso direto: `https://fuseloja.com.br/uploads/filename.jpg`
4. Verificar logs do systemd: `journalctl -u fuseloja -f`

### **Erro 404 na imagem**
```bash
# Verificar se arquivo existe
ls -la /opt/fuseloja/current/backend/uploads/

# Verificar permissões
chmod 755 /opt/fuseloja/current/backend/uploads/
chown -R root:root /opt/fuseloja/current/backend/uploads/
```

### **Erro de upload**
```bash
# Verificar espaço em disco
df -h /opt/fuseloja/

# Verificar logs
journalctl -u fuseloja | grep -i upload
```

## 🎉 **Resultado**

### **Antes**
- ❌ Imagens não persistiam
- ❌ URLs temporárias (blob://)
- ❌ Produtos sem imagem na listagem

### **Depois**  
- ✅ Upload automático para backend
- ✅ URLs persistentes (/uploads/)
- ✅ Imagens visíveis na listagem
- ✅ Sistema completo de gerenciamento

## 🔄 **Próximos Passos**

### **Melhorias Futuras**
- [ ] Suporte a múltiplas imagens por produto
- [ ] Redimensionamento automático de thumbnails
- [ ] Compressão otimizada no backend
- [ ] CDN para melhor performance
- [ ] Backup automático de imagens

### **Otimizações**
- [ ] Implementar cache de imagens
- [ ] Compressão WebP automática
- [ ] Lazy loading na listagem
- [ ] Galeria de imagens do produto 