---
title: Response
description: Learn how Harpia Core extends Bun’s native Response to offer an expressive response API.
---

Harpia Core provides a custom `Response`. It gives you a fluent and expressive API to handle HTTP responses with simplicity and power.

To use it:

```ts
import { type Response } from "harpiats";
```

---

## Features

The custom `Response` offers intuitive methods for setting status codes, sending JSON, HTML, redirecting, setting cookies, and even rendering views through template engines.

---
### Headers
You can access and manipulate response headers directly using the .headers property:

```ts
res.headers.set("X-Custom-Header", "Hello");
```

> More informations about Headers, see the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/API/Headers).

---

### `res.status(code: number)`

Sets the HTTP status code for the response.

```ts
res.status(404).send("Not found");
```

---

### `res.send(data: any)`

Sends raw data (string, buffer, etc.). Automatically sets the `Content-Length` header.

```ts
res.send("Hello, world!");
```

---

### `res.json(data: any)`

Sends a JSON response with the correct `Content-Type` header.

```ts
res.json({ success: true });
```

---

### `res.html(htmlString: string)`

Sends raw HTML with the appropriate `Content-Type`.

```ts
res.html("<h1>Hello!</h1>");
```

---

### `res.redirect(url: string, statusCode = 302)`

Redirects the request to a given URL with optional status code (default is 302).

```ts
res.redirect("/login");
res.redirect("/", 301); // permanent redirect
```

---

## Cookies

Set cookies easily with:

```ts
res.cookies.set("token", "abc123", {
  httpOnly: true,
  maxAge: 60 * 60 * 24, // 1 day
});
```

> See the [Cookies](/core/cookies) section for full details on cookie options.

---

## Template Rendering

If a template engine is configured, you can render views:

```ts
res.render("dashboard", { user });
```

You can also specify a module name for modular view resolution:

```ts
res.module("admin").render("users/list");
```
> Note: res.module() only works if you are using Harpia's built-in template engine.
> Make sure to configure the template engine using app.engine().
> For more information, see the [Template Engine](core/template-engine) section.

---

## Full Example

```ts
router.get("/profile", async (req: Request, res: Response) => {
  const user = await getUser(req);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.status(200).render("profile", { user });
});
```

---
