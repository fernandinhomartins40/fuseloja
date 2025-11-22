# ==============================================================================
# Stage 1: Base
# ==============================================================================
FROM node:18-alpine AS base

WORKDIR /app

# Install dependencies required for node-gyp and Vite
RUN apk add --no-cache libc6-compat

# ==============================================================================
# Stage 2: Dependencies
# ==============================================================================
FROM base AS dependencies

# Copy workspace configuration
COPY package.json package-lock.json* pnpm-workspace.yaml* ./
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/
COPY packages/shared/package.json ./packages/shared/
COPY packages/config/package.json* ./packages/config/ 2>/dev/null || true

# Install production dependencies only
RUN npm ci --only=production --legacy-peer-deps

# ==============================================================================
# Stage 3: Build Dependencies
# ==============================================================================
FROM base AS build-deps

# Copy workspace configuration
COPY package.json package-lock.json* pnpm-workspace.yaml* ./
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/
COPY packages/shared/package.json ./packages/shared/
COPY packages/config/package.json* ./packages/config/ 2>/dev/null || true

# Install all dependencies (including devDependencies)
RUN npm ci --legacy-peer-deps

# ==============================================================================
# Stage 4: Build
# ==============================================================================
FROM base AS build

# Copy node_modules from build-deps
COPY --from=build-deps /app/node_modules ./node_modules

# Copy workspace configuration
COPY package.json package-lock.json* pnpm-workspace.yaml* tsconfig.json ./

# Copy all packages
COPY packages ./packages

# Copy web app
COPY apps/web ./apps/web

# Build the web app
WORKDIR /app/apps/web
RUN npm run build

# ==============================================================================
# Stage 5: Production
# ==============================================================================
FROM nginx:alpine AS production

# Copy nginx configuration
COPY docker/web/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from build stage
COPY --from=build /app/apps/web/dist /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/health || exit 1

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# ==============================================================================
# Stage 6: Development
# ==============================================================================
FROM base AS development

# Copy node_modules from build-deps
COPY --from=build-deps /app/node_modules ./node_modules

# Copy workspace configuration
COPY package.json package-lock.json* pnpm-workspace.yaml* tsconfig.json ./

# Copy all packages
COPY packages ./packages

# Copy web app
COPY apps/web ./apps/web

WORKDIR /app/apps/web

# Expose Vite dev server port
EXPOSE 3000

# Start Vite dev server
CMD ["npm", "run", "dev", "--", "--port", "3000", "--host", "0.0.0.0"]
