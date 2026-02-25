
# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Build args for Vite env variables (injected at build time by CI)
ARG VITE_API_URL=http://localhost:4000
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ================================
# Stage 2: Production (nginx)
# ================================
FROM nginx:1.27-alpine AS runner


# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom nginx config (nginx.conf lives inside Frontend/)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Non-root nginx setup
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

USER nginx

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]