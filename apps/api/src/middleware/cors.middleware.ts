/**
 * CORS Middleware
 * Cross-Origin Resource Sharing configuration
 */

import cors from 'cors';
import config from '../config';

/**
 * CORS configuration
 */
export const corsMiddleware = cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400, // 24 hours
});
