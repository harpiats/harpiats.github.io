---
title: CORS
description: A guide in my new Starlight docs site.
---

Harpia provides a flexible way to configure Cross-Origin Resource Sharing (CORS), allowing you to control which origins, methods, and headers are permitted in cross-origin HTTP requests.

You can apply CORS settings globally or per route.

---

## Basic CORS Setup

To apply a basic CORS configuration to your entire application:

```ts
import harpia from "harpiats";

const app = harpia();

app.cors({
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow these methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
});

app.listen(...);
```

---

## Custom CORS per Route

You can also configure CORS for specific routes or route groups:

```ts
import harpia, { Router } from "harpiats";

const books = Router();

books.get("/books", () => {
  console.log("Books route with custom CORS");
});

const app = harpia();
app.routes(books);

app.cors(
  {
    origin: "https://example.com", // Only allow this origin
    methods: "GET", // Only allow GET requests
  },
  "/books" // Apply only to this route
);

app.listen(...);
```

---

## CORS Options

The following options can be configured when using `app.cors()`:

| Option | Description |
|--------|-------------|
| **`origin`** | Define allowed origins. Can be: `true` (all origins), a string, a RegExp, an array of strings/RegExps, or a function `(origin, callback)` |
| **`methods`** | Allowed HTTP methods (`"GET"`, `"POST"`, `["GET", "POST"]`, or `"*"`) |
| **`allowedHeaders`** | Headers allowed in incoming requests |
| **`exposedHeaders`** | Headers exposed to the client |
| **`credentials`** | Set to `true` to allow cookies and credentials |
| **`maxAge`** | Time in seconds the preflight response should be cached |
| **`preflightContinue`** | If `true`, you must handle preflight responses manually |
| **`optionsSuccessStatus`** | Custom status code for successful preflight (default is `204`) |

---

## Full Configuration Example

```ts
import type { CorsOptions } from "harpiats";

const corsOptions: CorsOptions = {
  origin: "https://example.com",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["X-Custom-Header"],
  credentials: true,
  maxAge: 3600,
  optionsSuccessStatus: 200,
};

app.cors(corsOptions);
```

---

## Notes on Implementation

The internal `Cors` class in Harpia:

- Evaluates the request origin and matches it against the configured options (supports strings, regex, arrays, or functions).
- Validates the HTTP method of the request.
- Automatically responds to preflight `OPTIONS` requests (unless `preflightContinue` is enabled).
- Adds appropriate CORS headers to the response:
  - `Access-Control-Allow-Origin`
  - `Access-Control-Allow-Methods`
  - `Access-Control-Allow-Headers`
  - `Access-Control-Expose-Headers`
  - `Access-Control-Allow-Credentials`
  - `Access-Control-Max-Age`

---
