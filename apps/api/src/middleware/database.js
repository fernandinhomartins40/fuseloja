const { query } = require('../database/connection');
const response = require('../utils/response');

// Middleware para verificar se o banco de dados está configurado
const checkDatabaseConnection = async (req, res, next) => {
  try {
    // Teste simples de conectividade
    await query('SELECT 1');
    next();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return response.error(res, 'Database connection failed', 503);
  }
};

// Middleware para verificar se uma tabela específica existe
const checkTableExists = (tableName) => {
  return async (req, res, next) => {
    try {
      const tableCheck = await query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        );
      `, [tableName]);
      
      if (!tableCheck.rows[0].exists) {
        console.log(`⚠️ Table '${tableName}' does not exist`);
        return response.error(res, 'Database not properly configured', 503);
      }
      
      next();
    } catch (error) {
      console.error(`❌ Failed to check table '${tableName}':`, error.message);
      return response.error(res, 'Database configuration check failed', 503);
    }
  };
};

// Middleware de fallback para rotas que precisam de dados mas o banco não está pronto
const databaseFallback = (fallbackData) => {
  return (error, req, res, next) => {
    if (error.code && (error.code.includes('42P01') || error.code.includes('ENOTFOUND'))) {
      console.log('🔄 Database not ready, returning fallback data');
      return response.success(res, fallbackData, 'Using fallback data - database not ready');
    }
    next(error);
  };
};

module.exports = {
  checkDatabaseConnection,
  checkTableExists,
  databaseFallback
};