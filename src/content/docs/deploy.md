---
title: Deployment
description: Deployment guide for applications using this framework
---

This framework is designed exclusively for the **Bun runtime**. All deployment environments must have Bun installed.

### Verifying Bun Installation
```bash
bun --version
# Should return v1.2 or higher
```

## Deployment Targets

### 1. Traditional Servers (VPS/Bare Metal)
```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Clone your project
git clone your-project.git
cd your-project

# Install dependencies
bun install

# Start production server
bun run start
```

### 2. Containerized Deployment (Docker)
```dockerfile
FROM oven/bun:latest

WORKDIR /app
COPY . .

RUN bun install

CMD ["bun", "run", "start"]
```

### 3. Docker Swarm and Nginx
Dockerfile
```dockerfile
FROM oven/bun:latest

# Install Dependencies
RUN apt-get update && apt-get install -y \
    openssl \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy dependencies and install
COPY package.json bun.lock /app/
RUN bun install --frozen-lockfile

# Copy the full source
COPY . .

# Project and risma setup for production
RUN bun run deploy

# Expose the app port (e.g., 3000)
EXPOSE 3000

# Start
CMD ["bun", "run", "start"]
```

docker-swarm.yml
```yml
version: "3.8"

services:
  redis:
    image: redis:latest
    deploy:
      replicas: 1
    networks:
      - app_net

  postgres:
    image: postgres:latest
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: harpia_db
    volumes:
      - pgdata:/var/lib/postgresql/data
    deploy:
      replicas: 1
    networks:
      - app_net

  app:
    image: harpia:prod
    environment:
      - ENV=production
      - PORT=3000
      - MODE=api
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    networks:
      - app_net
    depends_on:
      - redis
      - postgres
    deploy:
      replicas: 3
      restart_policy:
        condition: on-failure
      update_config:
        parallelism: 1
        delay: 10s
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/healthcheck"]
      interval: 15s
      timeout: 5s
      retries: 6
      start_period: 20s

  nginx:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - app
    networks:
      - app_net
    deploy:
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
        window: 120s

volumes:
  pgdata:

networks:
  app_net:
    driver: overlay
```

nginx.conf
```conf
server {
    listen 80;
    server_name localhost;

    # Resolve domains to IPs using Docker's internal DNS
    resolver 127.0.0.11 valid=10s;

    location / {
        proxy_pass http://tasks.harpia_app:3000;
        
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection "";
        
        proxy_connect_timeout 10s;
        proxy_send_timeout 15s;
        proxy_read_timeout 15s;
    }

    location /healthcheck {
        deny all;                 # Deny all other traffic
        return 403;

        # Proxy pass for internal network only
        proxy_pass http://tasks.app:3000/healthcheck;
        access_log off;
        log_not_found off;
    }
}
```

### 4. Platform-as-a-Service

**Recommended Providers:**
- Railway.app
- Render.com
- Fly.io

All require:
1. Bun buildpack selection
2. `start` script in package.json
3. Environment variables configuration

## Configuration

### Essential Environment Variables
```env
APP_ID=
MONITOR_SECRET=
ENV=development
PORT=3000
MODE=fullstack
```

### Startup Scripts
```json
{
  "scripts": {
    "start": "bun cmd.ts start",
    "tests": "bun cmd.ts tests",
    "migrate": "bun cmd.ts migrate"
  }
}
```

## Performance Tuning

### Bun Runtime Flags
```bash
# Enable optimized production mode
bun run --smol start

# Memory limits (adjust based on your needs)
BUN_MEMORY_LIMIT=512MB bun start
```

## Monitoring

### Health Check Endpoint
```typescript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    version: Bun.version
  });
});
```