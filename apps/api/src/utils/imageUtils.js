/**
 * Função utilitária para construir URLs absolutas das imagens
 * @param {string} imageUrl - URL da imagem (pode ser relativa ou absoluta)
 * @param {object} req - Objeto request do Express para obter protocol e host
 * @returns {string} - URL absoluta da imagem
 */
const getAbsoluteImageUrl = (imageUrl, req) => {
  // Fallback para imagem padrão se não houver URL
  if (!imageUrl) {
    return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400';
  }
  
  // Retorna data URLs como estão
  if (imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  
  // Retorna URLs completas como estão
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Converte URLs relativas para absolutas
  if (imageUrl.startsWith('/uploads/')) {
    const protocol = req.protocol;
    const host = req.get('host');
    return `${protocol}://${host}${imageUrl}`;
  }
  
  // Retorna a URL original se não se encaixar nos casos acima
  return imageUrl;
};

module.exports = {
  getAbsoluteImageUrl
}; 