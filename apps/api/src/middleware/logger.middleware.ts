/**
 * Logger Middleware
 * HTTP request logging using Morgan
 */

import morgan from 'morgan';
import { morganStream } from '../utils/logger';
import config from '../config';

/**
 * Morgan format for development
 */
const devFormat = ':method :url :status :response-time ms - :res[content-length]';

/**
 * Morgan format for production
 */
const prodFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

/**
 * Logger middleware
 */
export const loggerMiddleware = morgan(
  config.nodeEnv === 'production' ? prodFormat : devFormat,
  { stream: morganStream }
);
