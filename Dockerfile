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

# Install necessary packages for healthcheck
RUN apk --no-cache add curl

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json

# Only install production dependencies in the final image with legacy-peer-deps flag
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production --legacy-peer-deps --prefer-offline --no-audit --progress=false

# Copy environment file and config files
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Set proper permissions
RUN chown -R node:node /app

# Create a simple script to start the application
RUN echo '#!/bin/sh\necho "Starting Next.js application..."\nexec npm start' > /app/start.sh && \
    chmod +x /app/start.sh

# Switch to non-root user for security
USER node

# Expose the application port
EXPOSE 3000

# Add healthcheck using curl
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Use the script as the entrypoint
CMD ["/app/start.sh"]
