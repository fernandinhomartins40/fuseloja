# FuseLoja API Dockerfile
# Multi-stage build for production optimization

# ============================================================================
# Stage 1: Base
# ============================================================================
FROM node:18-alpine AS base

WORKDIR /app

# Install dependencies for node-gyp and PostgreSQL client
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    postgresql-client \
    wget

# ============================================================================
# Stage 2: Dependencies
# ============================================================================
FROM base AS dependencies

# Copy package files from root, apps/api, and packages
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/types/package.json ./packages/types/
COPY packages/shared/package.json ./packages/shared/

# Install production dependencies
WORKDIR /app
RUN npm ci --only=production --workspace=apps/api && \
    npm cache clean --force

# ============================================================================
# Stage 3: Build
# ============================================================================
FROM base AS build

# Copy package files
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/types/package.json ./packages/types/
COPY packages/shared/package.json ./packages/shared/

# Install all dependencies (including dev)
RUN npm ci --workspace=apps/api

# Copy source code
COPY apps/api ./apps/api
COPY packages ./packages

# Generate Prisma Client
WORKDIR /app/apps/api
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# ============================================================================
# Stage 4: Production
# ============================================================================
FROM node:18-alpine AS production

WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache \
    postgresql-client \
    wget

# Copy package files
COPY --from=dependencies /app/package*.json ./
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/api/package*.json ./apps/api/

# Copy built application
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/prisma ./apps/api/prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

# Copy packages
COPY --from=build /app/packages ./packages

# Create necessary directories
RUN mkdir -p apps/api/uploads/products apps/api/uploads/avatars apps/api/uploads/temp apps/api/logs

# Add non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app

# Switch to nodejs user
USER nodejs

# Expose port
EXPOSE 3001

WORKDIR /app/apps/api

# Health check script
COPY docker/api/healthcheck.js /app/healthcheck.js

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node /app/healthcheck.js || exit 1

# Start application
CMD ["node", "dist/index.js"]

# ============================================================================
# Stage 5: Development
# ============================================================================
FROM base AS development

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/types/package.json ./packages/types/
COPY packages/shared/package.json ./packages/shared/

# Install all dependencies
RUN npm ci --workspace=apps/api

# Copy source
COPY apps/api ./apps/api
COPY packages ./packages

WORKDIR /app/apps/api

# Generate Prisma Client
RUN npx prisma generate

# Expose port
EXPOSE 3001

# Start with nodemon for development
CMD ["npm", "run", "dev"]
