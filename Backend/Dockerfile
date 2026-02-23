# ================================
# Stage 1: Builder
# ================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY Backend/package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy backend source code
COPY Backend/ .

# ================================
# Stage 2: Production Runtime
# ================================
FROM node:20-alpine AS runner

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy package files
COPY Backend/package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built app from builder stage
COPY --from=builder --chown=nodejs:nodejs /app .

# Use non-root user
USER nodejs

# Expose backend port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:4000/health || exit 1

CMD ["node", "server.js"]