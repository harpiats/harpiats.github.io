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

### 3. Platform-as-a-Service

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