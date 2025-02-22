# Build & Deployment Guide

## Overview

This guide covers the build and deployment processes for the PharmacyHub frontend application. The application uses Next.js 15 and follows a containerized deployment approach.

## Build Process

### Local Build

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start production server
npm run start
```

### Build Configuration

#### Next.js Configuration
```typescript
// next.config.ts
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['your-image-domain.com'],
  },
  async redirects() {
    return [
      // Redirect configurations
    ];
  },
};

export default nextConfig;
```

### Environment Configuration

```env
# .env.production
NEXT_PUBLIC_API_URL=https://api.pharmacyhub.com
NEXT_PUBLIC_KEYCLOAK_URL=https://auth.pharmacyhub.com
NEXT_PUBLIC_KEYCLOAK_REALM=pharmacyhub
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=pharmacyhub-client
```

## Docker Setup

### Dockerfile
```dockerfile
# Dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://api.pharmacyhub.com
```

## Deployment Environments

### 1. Development Environment

```bash
# Development server
npm run dev

# Environment variables (.env.development)
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8081
```

### 2. Staging Environment

```bash
# Build for staging
npm run build

# Environment variables (.env.staging)
NEXT_PUBLIC_API_URL=https://staging-api.pharmacyhub.com
NEXT_PUBLIC_KEYCLOAK_URL=https://staging-auth.pharmacyhub.com
```

### 3. Production Environment

```bash
# Build for production
NODE_ENV=production npm run build

# Environment variables (.env.production)
NEXT_PUBLIC_API_URL=https://api.pharmacyhub.com
NEXT_PUBLIC_KEYCLOAK_URL=https://auth.pharmacyhub.com
```

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy PharmacyHub Frontend

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build application
        run: npm run build
        
      - name: Build and push Docker image
        run: |
          docker build -t pharmacyhub-frontend .
          docker push your-registry/pharmacyhub-frontend:latest
```

## Kubernetes Deployment

### Deployment Configuration
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pharmacyhub-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: pharmacyhub-frontend
  template:
    metadata:
      labels:
        app: pharmacyhub-frontend
    spec:
      containers:
        - name: pharmacyhub-frontend
          image: your-registry/pharmacyhub-frontend:latest
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: "production"
            - name: NEXT_PUBLIC_API_URL
              valueFrom:
                configMapKeyRef:
                  name: frontend-config
                  key: api_url
```

### Service Configuration
```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: pharmacyhub-frontend
spec:
  type: ClusterIP
  ports:
    - port: 80
      targetPort: 3000
  selector:
    app: pharmacyhub-frontend
```

## Monitoring & Logging

### Application Logging
```typescript
// src/lib/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Health Checks
```typescript
// src/app/api/health/route.ts
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return new Response(
    JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString()
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
```

## Performance Optimization

### Build Optimization
- Enable minification
- Implement code splitting
- Optimize images and assets
- Configure caching headers

### Runtime Optimization
- Enable compression
- Implement CDN integration
- Configure service worker
- Optimize API calls

## Rollback Procedures

### Manual Rollback
```bash
# Revert to previous version
kubectl rollout undo deployment/pharmacyhub-frontend

# Verify rollback
kubectl rollout status deployment/pharmacyhub-frontend
```

### Automated Rollback
```yaml
# In GitHub Actions workflow
steps:
  - name: Deploy
    run: |
      kubectl apply -f k8s/
      kubectl rollout status deployment/pharmacyhub-frontend || kubectl rollout undo deployment/pharmacyhub-frontend
```

## Security Considerations

### 1. Environment Security
- Secure environment variables
- Implement secrets management
- Configure CORS properly

### 2. Runtime Security
- Enable security headers
- Implement CSP
- Configure rate limiting

### 3. Build Security
- Scan dependencies
- Audit npm packages
- Implement security tests

## Troubleshooting

### Common Issues

1. Build Failures
```bash
# Clear Next.js cache
rm -rf .next
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

2. Deployment Issues
```bash
# Check pod status
kubectl get pods
# Check pod logs
kubectl logs -f deployment/pharmacyhub-frontend
```

3. Runtime Issues
```bash
# Check application logs
kubectl logs -f deployment/pharmacyhub-frontend
# Check service status
kubectl describe service pharmacyhub-frontend
```