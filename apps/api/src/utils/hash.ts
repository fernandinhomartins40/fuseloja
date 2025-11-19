/**
 * Hashing Utilities
 * Functions for hashing and comparing passwords
 */

import bcrypt from 'bcryptjs';
import config from '../config';

/**
 * Hash password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, config.bcryptRounds);
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
