const { successResponse, errorResponse } = require('../utils/response');

/**
 * Middleware para verificar se o usuário tem permissão de acesso
 * @param {string|string[]} allowedRoles - Roles permitidas
 * @returns {Function} Middleware function
 */
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Verificar se o usuário está autenticado
      if (!req.user) {
        return res.status(401).json(errorResponse('Usuário não autenticado', 401));
      }

      // Converter para array se for string
      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      
      // Verificar se o usuário tem uma das roles permitidas
      if (!roles.includes(req.user.role)) {
        return res.status(403).json(errorResponse(
          'Acesso negado. Você não tem permissão para acessar este recurso.', 
          403
        ));
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json(errorResponse('Erro interno do servidor', 500));
    }
  };
};

/**
 * Middleware específico para verificar se é admin
 */
const requireAdmin = authorize('admin');

/**
 * Middleware para verificar se é admin ou o próprio usuário
 */
const requireAdminOrSelf = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json(errorResponse('Usuário não autenticado', 401));
    }

    const isAdmin = req.user.role === 'admin';
    const isSelf = req.user.id === parseInt(req.params.userId) || req.user.id === parseInt(req.params.id);

    if (!isAdmin && !isSelf) {
      return res.status(403).json(errorResponse(
        'Acesso negado. Você só pode acessar seus próprios dados.', 
        403
      ));
    }

    next();
  } catch (error) {
    console.error('Authorization error:', error);
    return res.status(500).json(errorResponse('Erro interno do servidor', 500));
  }
};

module.exports = {
  authorize,
  requireAdmin,
  requireAdminOrSelf
};