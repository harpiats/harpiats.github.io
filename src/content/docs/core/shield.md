---
title: Shield - Security Headers
description: A guide in my new Starlight docs site.
---

The `Shield` module in Harpia provides middleware that automatically sets a wide range of HTTP security headers, helping to safeguard your application against common vulnerabilities such as XSS, clickjacking, and content sniffing.

## Features

1. Security Headers:
    - Content Security Policy (CSP): Restricts sources for scripts, styles, and other resources.
    - Cross-Origin Policies: Controls how resources are shared across origins.
    - Strict Transport Security (HSTS): Enforces HTTPS connections.
    - Referrer Policy: Controls the information sent in the Referer header.
    - X-Content-Type-Options: Prevents MIME type sniffing.
    - X-Frame-Options: Protects against clickjacking.
    - X-XSS-Protection: Disables browser XSS filters (if not needed).
    - Nonce Support: Generates cryptographic nonces for CSP inline scripts/styles.
2. Customizable:
    - Override default headers by passing options to the constructor.
    - Merge custom directives with sensible defaults.
3. Middleware:
    - Easily integrate into your application as middleware.
4. Template Engine Integration:
    - Automatic nonce generation for secure inline scripts/styles.
    - Seamless integration with the template engine.

## Basic Usage

You can create and apply Shield middleware to your app in a few lines:

```typescript
// shield.ts
import { Shield } from "harpiats/shield";
import type { Harpia } from "harpiats";

const instance = new Shield({
  useNonce: true, // Enable nonce generation, false as default.
});

export const shield = {
  middleware: (server: Harpia) => instance.middleware(server),
  instance: instance,
}
```

Apply the shield middleware in your server setup:

```typescript
// server.ts
import { harpia } from "harpia";
import { shield } from "./shield";

const app = harpia();

// Apply security headers middleware
app.use(shield.middleware());

// Your routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen({ port: 3000 }, () => console.log("Server running on http://localhost:3000"));
```

If you want to use the harpia template engine:

```typescript
import { harpia } from "harpia";
import { shield } from "./shield";
import { engine } from "./template-engine";

const app = harpia();

// Apply security headers middleware
app.use(shield.middleware(app));

// Setup template engine
engine.configure(app, shield.instance);
```

> To understand more about the harpia template engine, see the [Template Engine](/core/template-engine) section.

## Custom Configuration

The `Shield` constructor accepts a configuration object to override default header values:

```typescript
const instance = new Shield({
  contentSecurityPolicy: {
    directives: {
      "default-src": ["'self'", "https://trusted.com"],
      "script-src": ["'self'"]
    }
  },
  strictTransportSecurity: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  }
});

export const shield = {
  middleware: (server: Harpia) => instance.middleware(server),
  instance: instance,
};
```

### Default CSP Directives

If not customized, the following CSP directives are applied by default:

```json
{
  "default-src": ["'self'"],
  "base-uri": ["'self'"],
  "font-src": ["'self'", "https:", "data:"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'self'"],
  "img-src": ["'self'", "data:"],
  "object-src": ["'none'"],
  "script-src": ["'self'"],
  "script-src-attr": ["'none'"],
  "style-src": ["'self'"],
  "upgrade-insecure-requests": []
}
```

> **Need a deeper dive on CSP?**  
> Check out the [Content Security Policy (CSP) guide on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) for examples, explanations, and best practices.

### Other Defaults

| Header                           | Default Value        |
|----------------------------------|----------------------|
| `Cross-Origin-Opener-Policy`     | `same-origin`        |
| `Cross-Origin-Resource-Policy`   | `same-origin`        |
| `Origin-Agent-Cluster`           | `?1`                 |
| `Referrer-Policy`                | `no-referrer`        |
| `Strict-Transport-Security`      | `max-age=15552000; includeSubDomains` |
| `X-Content-Type-Options`         | `nosniff`            |
| `X-DNS-Prefetch-Control`         | `off`                |
| `X-Download-Options`             | `noopen`             |
| `X-Frame-Options`                | `SAMEORIGIN`         |
| `X-Permitted-Cross-Domain-Policies` | `none`            |
| `X-Powered-By`                   | removed              |
| `X-XSS-Protection`               | `0` (disabled)       |
| `useNonce`                       | `false` (disabled)   |

## Best Practices

- Always review CSP settings to fit your asset sources.
- Avoid `"unsafe-inline"` unless absolutely necessary.
- Use `preload` with HSTS only after confirming HTTPS readiness across your subdomains.

### Use nonce in templates:
```html
<!-- Use @set to define a variable to hold the nonce value -->
@set nonce = generateNonce() @endset

<!DOCTYPE html>
<html>
  <head>
    <title>Secure Page</title>
  </head>
  <body>
    <h1>Hello, {{ name }}!</h1>
    
    <!-- Secure inline script with nonce -->
    <script nonce="{{ nonce }}">
      console.log("This script is CSP-compliant");
    </script>
    
    <!-- Secure inline styles with nonce -->
    <style nonce="{{ nonce }}">
      body { color: blue; }
    </style>
  </body>
</html>
```

> `generateNonce()` is a Template Engine Plugin. You can see more about the plugins in [Template Engine](/core/template-engine) section.

### Important Notes

- **Nonce Security**: Each nonce is unique per request and automatically invalidated after use. Since the `generateNonce()` plugin generates a new value on each call, you should cache it using `@set` if you need to use it in multiple places.
- **CSP Compliance**: Use @set nonce = generateNonce() @endset to cache the nonce value in templates.
- **Development**: Consider adding 'unsafe-inline' for easier development with hot reload.
- **Production**: Remove unsafe directives and rely exclusively on nonces for inline content.

The Shield module provides enterprise-grade security headers with zero configuration while remaining fully customizable for your specific needs.