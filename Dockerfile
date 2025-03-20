# Build stage
FROM node:20.17.0-alpine AS builder

# Accept build arguments
ARG NODE_ENV=production
ARG ENV_FILE=.env

# Set environment variables
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

# Copy package files for better layer caching
COPY package*.json ./

# Install dependencies including dev dependencies for build with legacy-peer-deps flag
RUN npm ci --legacy-peer-deps --prefer-offline --no-audit --progress=false

# Copy application code
COPY . .

# Copy the specified env file if provided
RUN if [ -f "${ENV_FILE}" ]; then \
    cp ${ENV_FILE} .env; \
    echo "Using environment file: ${ENV_FILE}"; \
    else \
    echo "Warning: Environment file ${ENV_FILE} not found, using default or existing .env"; \
    fi

# Build the Next.js application
RUN npm run build

# Production stage
FROM node:20.17.0-alpine AS runner

# Accept build arguments for the production stage
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set working directory
WORKDIR /app

# Create log directory
RUN mkdir -p /app/logs

# Install curl for healthcheck
RUN apk --no-cache add curl

# Copy build artifacts from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Copy config files
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Set proper permissions
RUN chown -R node:node /app

# Switch to non-root user for security
USER node

# Expose the application port
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Use Next.js directly instead of npm
ENTRYPOINT ["node"]
CMD ["node_modules/.bin/next", "start"]
