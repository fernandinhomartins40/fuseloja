/**
 * Express Type Extensions
 * Extends Express Request interface with custom properties
 */

import { JwtPayload } from './jwt.types';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      file?: Multer.File;
      files?: Multer.File[];
    }
  }
}

export {};
