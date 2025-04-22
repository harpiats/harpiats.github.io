---
title: Request
description: Learn how Harpia Core extends Bun’s native Request to offer enhanced capabilities.
---

Harpia Core provides an enhanced `Request` class that extends Bun's native [`Request`](https://bun.sh/docs/api/request), giving you everything you're used to—plus a few extra tools that make backend development smoother.

To use it in your routes:

```ts
import { type Request } from "harpiats";
```

---

### `req.params`

Auto-parsed route parameters based on your route definition:

```ts
router.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  res.send(`User ID is ${userId}`);
});
```

---

### `req.query`

Auto-parsed query strings as a key-value object:

```ts
// For a URL like /search?q=harpia&page=2
router.get("/search", (req, res) => {
  const { q, page } = req.query;
  res.send(`Searching for "${q}", page ${page}`);
});
```

---

### `req.method`

Always returns the HTTP method in uppercase (e.g., `"GET"`, `"POST"`):

```ts
router.get("/inspect", (req, res) => {
  res.send(`Request method is ${req.method}`);
});
```

---

### `req.cookies`

Simplified cookie management:

```ts
// Single cookie
const token = req.cookies.get("auth_token");

// All cookies
const allCookies = req.cookies.getAll();
```

> More information about Cookies is available in the [Cookies section](/core/cookies).

---

## Native Request Methods

Since Harpia's `Request` class extends Bun's native one, you still have access to all original methods:

### `await req.json()`

Parses the request body as JSON.

```ts
const body = await req.json();
```

---

### `await req.formData()`

Parses the body as form data.

```ts
const form = await req.formData();
const file = form.get("avatar");
```

---

### `req.url`

Access the full request URL:

```ts
const fullUrl = req.url;
```

---

### `req.text()`

Reads the body as plain text.

```ts
const text = await req.text();
```

---

### `req.redirect(url, status?)`

Redirects to another URL.

```ts
return req.redirect("/login", 302);
```

> Note: In most cases, you’ll want to use `res.redirect()` instead, which is part of Harpia’s response utilities.

---

## TypeScript Tip

To get full IntelliSense and type support, always annotate the request:

```ts
import { type Request, type Response } from "harpiats";

router.get("/profile", (req: Request, res: Response) => {
  const cookies = req.cookies.getAll();
  res.json({ cookies });
});
```
