---
title: Monitor
description: A guide about the request monitor.
---

The **Request Monitor** is a powerful tool for tracking and analyzing request metrics, including visitor data, traffic sources, response times, and errors. It helps monitor application performance and user behavior.

## Setup

### Basic Configuration
```typescript
import { MemoryStore } from "harpiats/memory-store";
import { RequestMonitor } from "harpiats/monitor";

const Monitor = new RequestMonitor({
  store: new MemoryStore(), // Default in-memory storage
  ignore: ["favicon.ico"]   // Routes to exclude from tracking
});
```

### Middleware Integration
```typescript
import type { NextFunction, Request, Response } from "harpiats";

export const monitor = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.ENV === "test") return next();
  
  const trafficSource = {
    utm: {
      id: req.query?.utm_id,
      source: req.query?.utm_source,
      // ... other UTM parameters
    },
    referer: req.headers.get("referer"),
    userAgent: req.headers.get("User-Agent")
  };

  Monitor.initialize(req, app.requestIP() as string, trafficSource);
  Monitor.handleRequest();
  next();
};
```

## Storage Options

### Memory Store (Default)
```typescript
new RequestMonitor({
  store: new MemoryStore() // Volatile in-memory storage
});
```

### Redis Store
```typescript
import { RedisStore } from "./redis";

new RequestMonitor({
  store: new RedisStore(), // Persistent Redis storage
  ignore: ["favicon.ico", "healthcheck"]
});
```

## Metrics Access

### Retrieving Metrics
```typescript
app.get("/metrics", async (req, res) => {
  const metrics = await Monitor.getMetrics();
  res.json(metrics);
});
```

### Sample Metrics Response
```json
{
  "access": {
    "visitorsByDate": {
      "2023-10-01": {
        "192.168.1.1": {
          "totalRequests": 5,
          "pagesVisited": [...],
          "responseTimes": [...],
          "errors": 0
        }
      }
    },
    "totalRequests": 42
  },
  "behavior": {
    "pageViews": {
      "/home": 10,
      "/products": 7
    }
  }
}
```

## API Reference

### RequestMonitor
`new RequestMonitor(options?: Options)`

**Options:**
- `store`: Storage implementation (default: MemoryStore)
- `ignore`: Array of routes to exclude from tracking

**Methods:**
- `.initialize(req: Request, clientIp: string, trafficSource?: TrafficSource)`
- `.handleRequest(): Promise<Response | void>`
- `.getMetrics(): Promise<any>`

### Storage Interface
All stores must implement:
```typescript
interface Store {
  get(key: string): Promise<Record<string, any> | undefined>
  set(key: string, data: any): Promise<void>
  delete(key: string): Promise<void>
}
```

## Error Handling
The monitor automatically tracks:
- Failed requests (status 500+)
- Invalid client IPs
- Storage connection errors

Errors are counted in visitor metrics and don't interrupt application flow.

## Best Practices

1. **Production Setup**:
   ```typescript
   // redis.ts
   export class RedisStore implements Store {
     private client: Redis;
     
     constructor() {
       this.client = new Redis({
         host: process.env.REDIS_HOST,
         // ... other connection options
       });
     }
     // ... implement interface methods
   }
   ```

2. **Critical Paths**:
   ```typescript
   new RequestMonitor({
     ignore: ["healthcheck", "metrics"] // Exclude monitoring endpoints
   });
   ```

3. **Performance**:
   - Use Redis in production for better scalability
   - Keep the middleware lightweight
   - Process metrics asynchronously when possible
