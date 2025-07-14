const express = require('express');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');
const response = require('../utils/response');

const router = express.Router();

// Criar diretório de uploads se não existir
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// POST /api/v1/upload - Upload de imagem
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { imageData, filename } = req.body;
    
    if (!imageData) {
      return response.badRequest(res, 'imageData is required');
    }

    // Extrair dados da imagem base64
    const matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return response.badRequest(res, 'Invalid image format');
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    
    // Validar tipo de imagem
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(mimeType)) {
      return response.badRequest(res, 'Invalid image type. Only JPEG, PNG, and WebP are allowed');
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const extension = mimeType.split('/')[1];
    const uniqueFilename = filename 
      ? `${timestamp}_${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}.${extension}`
      : `${timestamp}_${Math.random().toString(36).substring(2)}.${extension}`;

    // Caminho completo do arquivo
    const filePath = path.join(uploadsDir, uniqueFilename);

    // Salvar arquivo
    const imageBuffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filePath, imageBuffer);

    // URL pública da imagem
    const imageUrl = `/uploads/${uniqueFilename}`;

    console.log('✅ Image uploaded successfully:', {
      filename: uniqueFilename,
      size: imageBuffer.length,
      type: mimeType,
      url: imageUrl
    });

    return response.success(res, {
      imageUrl,
      filename: uniqueFilename,
      size: imageBuffer.length,
      type: mimeType
    }, 'Image uploaded successfully');

  } catch (error) {
    console.error('Upload error:', error);
    return response.error(res, 'Failed to upload image');
  }
});

// DELETE /api/v1/upload/:filename - Deletar imagem
router.delete('/:filename', authenticateToken, async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Validar nome do arquivo
    if (!filename || filename.includes('..') || filename.includes('/')) {
      return response.badRequest(res, 'Invalid filename');
    }

    const filePath = path.join(uploadsDir, filename);
    
    // Verificar se arquivo existe
    if (!fs.existsSync(filePath)) {
      return response.notFound(res, 'Image not found');
    }

    // Deletar arquivo
    fs.unlinkSync(filePath);

    console.log('✅ Image deleted successfully:', filename);
    return response.success(res, { filename }, 'Image deleted successfully');

  } catch (error) {
    console.error('Delete error:', error);
    return response.error(res, 'Failed to delete image');
  }
});

module.exports = router; 