---
title: Shield - Security Headers
description: A guide in my new Starlight docs site.
---

The `Shield` module in Harpia provides middleware that automatically sets a wide range of HTTP security headers, helping to safeguard your application against common vulnerabilities such as XSS, clickjacking, and content sniffing.

## Features

- **Content Security Policy (CSP)** – Restricts the sources from which content can be loaded.
- **Cross-Origin Headers** – Enforces policies like `Cross-Origin-Opener-Policy` and `Cross-Origin-Resource-Policy`.
- **Strict Transport Security (HSTS)** – Forces the use of HTTPS connections.
- **Referrer Policy** – Controls how much referrer information is shared.
- **X-Headers** – Including `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, and others.
- **Customizable** – You can override any default value by providing options to the `Shield` constructor.

## Basic Usage

You can create and apply Shield middleware to your app in a few lines:

```ts
// shield.ts
import { Shield } from "harpiats/shield";

const instance = new Shield();

export const shield = instance.middleware;
```

```ts
// server.ts
import { harpia } from "harpiats";
import { shield } from "./shield";

const app = harpia();

app.use(shield());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen({ port: 3000 });
```

## Custom Configuration

The `Shield` constructor accepts a configuration object to override default header values:

```ts
const instance = new Shield({
  contentSecurityPolicy: {
    directives: {
      "default-src": ["'self'", "https://trusted.com"],
      "script-src": ["'self'", "'unsafe-inline'"]
    }
  },
  strictTransportSecurity: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  }
});
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
  "style-src": ["'self'", "https:", "'unsafe-inline'"],
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
| `X-Permitted-Cross-Domain-Policies` | `none`           |
| `X-Powered-By`                   | removed              |
| `X-XSS-Protection`               | `0` (disabled)       |

## Best Practices

- Always review CSP settings to fit your asset sources.
- Avoid `"unsafe-inline"` unless absolutely necessary.
- Use `preload` with HSTS only after confirming HTTPS readiness across your subdomains.
