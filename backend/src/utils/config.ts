import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

interface Config {
  // Server
  port: number;
  nodeEnv: string;
  apiPrefix: string;
  
  // Database
  databaseUrl: string;
  databaseBackupPath: string;
  databaseType: string;
  
  // PostgreSQL
  postgresUrl?: string;
  
  // MongoDB
  mongoUrl?: string;
  mongoDatabaseName?: string;
  
  // JWT
  jwtSecret: string;
  jwtExpiresIn: string;
  jwtRefreshSecret: string;
  jwtRefreshExpiresIn: string;
  
  // File Upload
  uploadPath: string;
  maxFileSize: number;
  allowedFileTypes: string[];
  
  // CORS
  corsOrigins: string[];
  
  // Email
  emailHost: string;
  emailPort: number;
  emailUser: string;
  emailPassword: string;
  emailFrom: string;
  
  // Security
  bcryptRounds: number;
  rateLimitWindow: number;
  rateLimitMax: number;
  
  // Cache
  cacheTtl: number;
  cacheCheckPeriod: number;
  
  // Logs
  logLevel: string;
  logFile: string;
  
  // Health Check
  healthCheckInterval: number;
  
  // WebSocket
  socketCorsOrigins: string[];
}

const requiredEnvVars = [
  'JWT_SECRET',
  'JWT_REFRESH_SECRET'
];

// Validate required environment variables
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Required environment variable ${envVar} is missing`);
  }
}

const config: Config = {
  // Server
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  
  // Database
  databaseUrl: process.env.DATABASE_URL || path.join(process.cwd(), 'database', 'app.db'),
  databaseBackupPath: process.env.DATABASE_BACKUP_PATH || path.join(process.cwd(), 'database', 'backups'),
  databaseType: process.env.DATABASE_TYPE || 'json',
  
  // PostgreSQL
  postgresUrl: process.env.POSTGRES_URL,
  
  // MongoDB
  mongoUrl: process.env.MONGO_URL,
  mongoDatabaseName: process.env.MONGO_DATABASE_NAME,
  
  // JWT
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  
  // File Upload
  uploadPath: process.env.UPLOAD_PATH || path.join(process.cwd(), 'uploads'),
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
  allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'txt'],
  
  // CORS
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
  
  // Email
  emailHost: process.env.EMAIL_HOST || 'smtp.gmail.com',
  emailPort: parseInt(process.env.EMAIL_PORT || '587', 10),
  emailUser: process.env.EMAIL_USER || '',
  emailPassword: process.env.EMAIL_PASSWORD || '',
  emailFrom: process.env.EMAIL_FROM || 'noreply@yourapp.com',
  
  // Security
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '15', 10), // minutes
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  
  // Cache
  cacheTtl: parseInt(process.env.CACHE_TTL || '300', 10), // seconds
  cacheCheckPeriod: parseInt(process.env.CACHE_CHECK_PERIOD || '120', 10), // seconds
  
  // Logs
  logLevel: process.env.LOG_LEVEL || 'info',
  logFile: process.env.LOG_FILE || path.join(process.cwd(), 'logs', 'app.log'),
  
  // Health Check
  healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL || '30000', 10), // milliseconds
  
  // WebSocket
  socketCorsOrigins: process.env.SOCKET_CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
};

// Validate configuration
export function validateConfig(): void {
  const errors: string[] = [];

  if (config.port < 1 || config.port > 65535) {
    errors.push('PORT must be between 1 and 65535');
  }

  if (config.maxFileSize < 1) {
    errors.push('MAX_FILE_SIZE must be greater than 0');
  }

  if (config.bcryptRounds < 1 || config.bcryptRounds > 20) {
    errors.push('BCRYPT_ROUNDS must be between 1 and 20');
  }

  if (config.rateLimitWindow < 1) {
    errors.push('RATE_LIMIT_WINDOW must be greater than 0');
  }

  if (config.rateLimitMax < 1) {
    errors.push('RATE_LIMIT_MAX must be greater than 0');
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }
}

// Validate on import
validateConfig();

export default config; 