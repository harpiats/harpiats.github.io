---
title: Introduction
description: Introduction about the Harpia Framework Core Module.
lastUpdated: 2025-04-21
---

Harpia Core is the lightweight, non-opinionated foundation powering the Harpia Framework. Designed as a standalone package, it provides essential building blocks for crafting web applications and APIs with Bun's native speed, while remaining completely decoupled from the framework's higher-level conventions.

## Key Features

This minimal yet powerful core delivers:
- **Bun-First Architecture**: Leverages Bun's native APIs for HTTP handling, WebSockets, and file operations
- **Essential HTTP Toolkit**: 
  - Routing with middleware pipeline
  - Session/cookie management
  - CORS and security headers (Shield)
  - File upload streaming
  - Custom template engine
- **Performance Monitoring**: Built-in metrics collection for requests, errors, and response times
- **Test Utilities**: Integrated testing client for endpoint validation
- **Zero Lock-In**: Use individual features or the complete stack

While the full Harpia Framework adds productivity layers (scaffolding, ORM integration, modules system), Harpia Core focuses exclusively on providing robust low-level primitives. This makes it ideal for:
- Custom architectures needing a performance foundation
- Gradual adoption of framework features
- Specialized services where flexibility trumps conventions

```ts
// Example: Basic Core usage
import harpia from "harpiats";

const app = harpia();

app.listen({
  port: 3000,
  development: true,
}, () => console.log("Server is running at http://localhost:3000/"));
```