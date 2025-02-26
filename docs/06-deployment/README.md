# PharmacyHub Deployment Guide

This section provides comprehensive documentation on deploying the PharmacyHub application in various environments.

## Table of Contents

1. [Deployment Architecture](#deployment-architecture)
2. [Environment Setup](#environment-setup)
3. [Containerization](#containerization)
4. [CI/CD Pipeline](#cicd-pipeline)
5. [Kubernetes Deployment](#kubernetes-deployment)
6. [Monitoring & Logging](#monitoring--logging)
7. [Scaling Strategies](#scaling-strategies)
8. [Backup & Disaster Recovery](#backup--disaster-recovery)

## Deployment Architecture

The PharmacyHub application is deployed using a containerized approach with Kubernetes orchestration:

```
┌─────────────────────────┐      ┌─────────────────────────┐
│                         │      │                         │
│    CI/CD Pipeline       │      │   Container Registry    │
│    (GitHub Actions)     │      │   (Docker Hub)          │
│                         │      │                         │
└──────────┬──────────────┘      └───────────┬─────────────┘
           │                                 │
           │                                 │
           ▼                                 ▼
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                  Kubernetes Cluster                     │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │ Frontend    │  │ Backend     │  │ Keycloak    │      │
│  │ Pods        │  │ Pods        │  │ Pods        │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │ Database    │  │ Redis       │  │ Monitoring  │      │
│  │ Stateful Set│  │ Cluster     │  │ Stack       │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
│                                                         │
└─────────────────────────────────────────────────────────┘
           │                                 │
           │                                 │
           ▼                                 ▼
┌─────────────────────────┐      ┌─────────────────────────┐
│                         │      │                         │
│    Load Balancer        │      │   CDN                   │
│    (Nginx/Traefik)      │      │   (Cloudflare)          │
│                         │      │                         │
└─────────────────────────┘      └─────────────────────────┘
```

## Environment Setup

### Prerequisites

- Docker and Docker Compose
- Kubernetes cluster (EKS, GKE, AKS, or self-hosted)
- Container registry access
- CI/CD platform (GitHub Actions)
- DNS configuration
- SSL certificates

### Environment Variables

The application requires the following environment variables:

```
# API Configuration
NEXT_PUBLIC_API_URL=https://api.pharmacyhub.example.com

# Authentication
NEXT_PUBLIC_KEYCLOAK_URL=https://auth.pharmacyhub.example.com
NEXT_PUBLIC_KEYCLOAK_REALM=pharmacyhub
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=frontend-client

# Feature Flags
NEXT_PUBLIC_ENABLE_BETA_FEATURES=false

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=https://sentrydsn.example.com
```

## Containerization

### Docker Configuration

The application is containerized using Docker with the following Dockerfile:

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy necessary files
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

# Start the application
CMD ["npm", "start"]
```

### Docker Compose (Development)

For local development, use Docker Compose:

```yaml
version: '3.8'
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_API_URL=http://localhost:8080
      - NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
      
  keycloak:
    image: quay.io/keycloak/keycloak:25.0.2
    ports:
      - "8080:8080"
    environment:
      - KEYCLOAK_ADMIN=admin
      - KEYCLOAK_ADMIN_PASSWORD=admin
      - KC_DB=postgres
      - KC_DB_URL=jdbc:postgresql://postgres:5432/keycloak
      - KC_DB_USERNAME=keycloak
      - KC_DB_PASSWORD=password
    depends_on:
      - postgres
      
  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=keycloak
      - POSTGRES_USER=keycloak
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## CI/CD Pipeline

### GitHub Actions Workflow

The application uses GitHub Actions for CI/CD:

```yaml
name: PharmacyHub Frontend CI/CD

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main, staging]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
        
  build-and-push:
    needs: test
    if: github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
        
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
          
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          push: true
          tags: pharmacyhub/frontend:${{ github.ref == 'refs/heads/main' && 'latest' || 'staging' }}
          
  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install kubectl
        uses: azure/setup-kubectl@v3
        
      - name: Set K8s context
        uses: azure/k8s-set-context@v3
        with:
          kubeconfig: ${{ secrets.KUBE_CONFIG }}
          
      - name: Deploy to environment
        run: |
          if [ "${{ github.ref }}" = "refs/heads/main" ]; then
            kubectl apply -f k8s/production/
          else
            kubectl apply -f k8s/staging/
          fi
          
      - name: Verify deployment
        run: |
          kubectl rollout status deployment/pharmacyhub-frontend -n ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}
```

## Kubernetes Deployment

### Kubernetes Configuration

The application is deployed to Kubernetes using the following manifests:

#### Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pharmacyhub-frontend
  namespace: production
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
      - name: frontend
        image: pharmacyhub/frontend:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 3000
        resources:
          limits:
            cpu: 500m
            memory: 512Mi
          requests:
            cpu: 200m
            memory: 256Mi
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 20
          periodSeconds: 15
        env:
        - name: NODE_ENV
          value: production
        - name: NEXT_PUBLIC_API_URL
          valueFrom:
            configMapKeyRef:
              name: pharmacyhub-config
              key: api-url
        - name: NEXT_PUBLIC_KEYCLOAK_URL
          valueFrom:
            configMapKeyRef:
              name: pharmacyhub-config
              key: keycloak-url
```

#### Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: pharmacyhub-frontend
  namespace: production
spec:
  selector:
    app: pharmacyhub-frontend
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP
```

#### Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: pharmacyhub-frontend
  namespace: production
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - app.pharmacyhub.example.com
    secretName: pharmacyhub-frontend-tls
  rules:
  - host: app.pharmacyhub.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: pharmacyhub-frontend
            port:
              number: 80
```

#### HorizontalPodAutoscaler

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: pharmacyhub-frontend
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: pharmacyhub-frontend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

## Monitoring & Logging

### Monitoring Stack

The application is monitored using:

1. **Prometheus** - Metrics collection
2. **Grafana** - Visualization and dashboards
3. **Sentry** - Error tracking
4. **ELK Stack** - Centralized logging
5. **Uptime Robot** - External uptime monitoring

### Key Metrics

The following metrics are tracked:

- Page load time
- API response time
- Error rate
- Memory usage
- CPU utilization
- Request volume
- User session count
- Authentication failures

### Alerting

Alerts are configured for the following conditions:

- Error rate exceeds 1%
- API response time > 500ms
- Pod restarts
- Memory usage > 80%
- CPU usage > 70%
- Failed deployments

## Scaling Strategies

### Horizontal Scaling

The application can scale horizontally based on:
- CPU usage
- Memory consumption
- Request volume

### Vertical Scaling

Guidelines for vertical scaling:
- Increase container resources for memory-intensive operations
- Adjust JVM settings for Keycloak instances
- Optimize Next.js build output

### Global Scaling

For global deployment:
- Use multi-region Kubernetes clusters
- Implement geo-routing via CloudFront/Cloudflare
- Deploy read replicas for databases in each region

## Backup & Disaster Recovery

### Backup Strategy

1. **Database Backups**
   - Daily full backups
   - Hourly incremental backups
   - 30-day retention period

2. **Configuration Backups**
   - GitOps approach with all configuration in git
   - Encrypted secrets in HashiCorp Vault
   - Regular export of Kubernetes resources

### Disaster Recovery

1. **Recovery Time Objective (RTO)**: 1 hour
2. **Recovery Point Objective (RPO)**: 15 minutes
3. **Failover Process**:
   - Automated database failover
   - Multi-region deployment capability 
   - Runbooks for manual intervention

### Business Continuity Plan

1. **High Availability Setup**
   - Multi-AZ deployment
   - Database replication
   - Load balancer redundancy

2. **Incident Response**
   - On-call rotation
   - Escalation procedures
   - Communication templates

## Security Considerations

### Network Security

- All traffic encrypted with TLS 1.3
- Network policies restricting pod-to-pod communication
- Web Application Firewall (WAF) for edge protection
- Regular network penetration testing

### Secret Management

- Kubernetes secrets for sensitive configuration
- HashiCorp Vault integration for dynamic secrets
- Rotation policies for all credentials
- Least privilege principle for service accounts

## Reference Environments

| Environment | Purpose | URL | Access |
|-------------|---------|-----|--------|
| Development | Daily development | dev.pharmacyhub-internal.com | VPN access only |
| Staging | Pre-production testing | staging.pharmacyhub.example.com | Authentication required |
| Production | Live environment | app.pharmacyhub.example.com | Public access |
| DR | Disaster recovery | dr.pharmacyhub.example.com | Failover only |
