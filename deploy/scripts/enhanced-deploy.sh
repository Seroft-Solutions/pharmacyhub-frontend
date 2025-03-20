#!/bin/bash
# Enhanced Frontend deployment script with network validation and health checks
# Zero-intervention deployment for all environments

# Check if environment parameter is provided
if [ -z "$1" ]; then
  echo "Error: Environment not specified"
  echo "Usage: ./deploy.sh <environment>"
  echo "Example: ./deploy.sh dev"
  exit 1
fi

# Set environment variables
ENV="$1"
CRM_BASE="/home/ubuntu/PharmacyHub"
ENV_DIR="$CRM_BASE/$ENV"
FE_DIR="$ENV_DIR/frontend"
ENV_FILE="$FE_DIR/.env"
DOCKER_COMPOSE_FILE="$FE_DIR/docker-compose.yml"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Validate environment
if [ "$ENV" != "dev" ] && [ "$ENV" != "qa" ] && [ "$ENV" != "prod" ]; then
  echo "Error: Invalid environment. Must be one of: dev, qa, prod"
  exit 1
fi

echo "Starting frontend deployment for $ENV environment..."

# Ensure Docker networks exist
echo "Ensuring Docker networks exist..."
docker network inspect pharmacyhub-${ENV}-network >/dev/null 2>&1 || docker network create pharmacyhub-${ENV}-network
docker network inspect proxy-network >/dev/null 2>&1 || docker network create proxy-network

# Set up directory structure
echo "Setting up directory structure..."
mkdir -p "$FE_DIR"
mkdir -p "$FE_DIR/logs"
mkdir -p "$ENV_DIR/data/frontend"

# Ensure proper permissions
chown -R ubuntu:ubuntu "$FE_DIR" 2>/dev/null || true
chown -R ubuntu:ubuntu "$FE_DIR/logs" 2>/dev/null || true
chown -R ubuntu:ubuntu "$ENV_DIR/data/frontend" 2>/dev/null || true

# Verify env file exists
if [ ! -f "$ENV_FILE" ]; then
  echo "Warning: Environment file not found: $ENV_FILE"
  echo "Checking if env file was provided in deployment..."
  ls -la "$FE_DIR" | grep ".env"
  if [ $? -ne 0 ]; then
    echo "Error: No environment file found. Deployment cannot proceed."
    exit 1
  fi
fi

# Verify Docker Compose file exists
if [ ! -f "$DOCKER_COMPOSE_FILE" ]; then
  echo "Error: Docker Compose file not found: $DOCKER_COMPOSE_FILE"
  exit 1
fi

# Docker login if credentials are provided
if [ ! -z "$DOCKER_USERNAME" ] && [ ! -z "$DOCKER_PASSWORD" ]; then
  echo "Logging in to Docker registry..."
  echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
fi

# Backup any log files before deployment
echo "Backing up any existing log files..."
if [ -d "$FE_DIR/logs" ] && [ "$(ls -A $FE_DIR/logs)" ]; then
  LOG_BACKUP_DIR="$FE_DIR/logs/backup_${TIMESTAMP}"
  mkdir -p "$LOG_BACKUP_DIR"
  cp -r "$FE_DIR/logs"/*.log "$LOG_BACKUP_DIR"/ 2>/dev/null || echo "No log files found to back up"
fi

# Set port based on environment
if [ "$ENV" == "dev" ]; then
  export FRONTEND_PORT=3000
  BACKEND_URL="https://api.dev.pharmacyhub.pk"
elif [ "$ENV" == "qa" ]; then
  export FRONTEND_PORT=3010
  BACKEND_URL="https://api.qa.pharmacyhub.pk"
elif [ "$ENV" == "prod" ]; then
  export FRONTEND_PORT=3020
  BACKEND_URL="https://api.pharmacyhub.pk"
fi

# Verify backend is available before proceeding
echo "Verifying backend API availability..."
max_attempts=5
counter=0

while [ $counter -lt $max_attempts ]; do
  if curl -s -o /dev/null -w "%{http_code}" $BACKEND_URL/actuator/health | grep -q "200"; then
    echo "Backend API is healthy! Proceeding with frontend deployment."
    break
  fi
  counter=$((counter + 1))
  if [ $counter -eq $max_attempts ]; then
    echo "Warning: Backend API seems unavailable after $max_attempts attempts."
    echo "Proceeding with frontend deployment anyway, but it might not work correctly."
  fi
  echo "Attempt $counter/$max_attempts: Backend API not healthy yet..."
  sleep 5
done

# Deploy
echo "Deploying frontend for $ENV environment..."
cd "$FE_DIR"

# Check if containers are already running
CONTAINERS_RUNNING=$(docker compose -f docker-compose.yml ps -q 2>/dev/null | wc -l)

if [ "$CONTAINERS_RUNNING" -gt 0 ]; then
  echo "Detected running containers. Stopping them gracefully first..."
  # Stop containers gracefully with a timeout
  echo "Gracefully stopping containers (30 second timeout)..."
  docker compose -f docker-compose.yml stop -t 30 || true
  
  # Take down containers
  echo "Taking down containers..."
  docker compose -f docker-compose.yml down --remove-orphans || true
  
  echo "Existing containers gracefully stopped."
else
  echo "No existing containers detected."
fi

# Pull latest images
echo "Pulling latest images..."
docker compose -f docker-compose.yml pull

# Start services with the correct environment variables
echo "Starting frontend service..."
FRONTEND_PORT=$FRONTEND_PORT docker compose -f docker-compose.yml up -d

# Enhanced frontend verification with container and actual website check
echo "Verifying frontend deployment..."
max_attempts=10
counter=0

# First check if the container is running
while [ $counter -lt $max_attempts ]; do
  if docker ps | grep -q "pharmacyhub-frontend-$ENV"; then
    echo "Frontend container is running!"
    break
  fi
  counter=$((counter + 1))
  if [ $counter -eq $max_attempts ]; then
    echo "Frontend container failed to start after $max_attempts attempts"
    docker compose -f docker-compose.yml logs
    exit 1
  fi
  echo "Attempt $counter/$max_attempts: Frontend container not ready yet..."
  sleep 3
done

# Then check if the website is responding
echo "Verifying website is accessible..."
counter=0
max_attempts=10

# Get the appropriate URL based on environment
if [ "$ENV" == "dev" ]; then
  FRONTEND_URL="http://localhost:$FRONTEND_PORT"
elif [ "$ENV" == "qa" ]; then
  FRONTEND_URL="http://localhost:$FRONTEND_PORT"
elif [ "$ENV" == "prod" ]; then
  FRONTEND_URL="http://localhost:$FRONTEND_PORT"
fi

while [ $counter -lt $max_attempts ]; do
  # Use docker exec to check from inside the container
  if docker exec pharmacyhub-frontend-$ENV wget -q --spider $FRONTEND_URL; then
    echo "Frontend website is accessible!"
    break
  fi
  counter=$((counter + 1))
  if [ $counter -eq $max_attempts ]; then
    echo "Warning: Frontend website not accessible after $max_attempts attempts."
    echo "The container is running but the website might not be ready yet."
  fi
  echo "Attempt $counter/$max_attempts: Frontend website not accessible yet..."
  sleep 5
done

echo "Frontend deployment for $ENV environment completed successfully!"

# Display access URL
if [ "$ENV" == "dev" ]; then
  echo "Frontend is now accessible at https://dev.pharmacyhub.pk"
elif [ "$ENV" == "qa" ]; then
  echo "Frontend is now accessible at https://qa.pharmacyhub.pk"
elif [ "$ENV" == "prod" ]; then
  echo "Frontend is now accessible at https://www.pharmacyhub.pk"
fi
