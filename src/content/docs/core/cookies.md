---
title: Cookies
description: Handling HTTP cookies in Harpia.
---

Harpia provides a simple API to work with cookies through the `Request` and `Response` wrappers. It supports reading, setting, and deleting cookies in a structured and type-safe way.

---

## Reading Cookies

You can access cookies sent by the client using `req.cookies.get()` or `req.cookies.getAll()`:

```ts
route.get("/", (req: Request, res: Response) => {
  const session = req.cookies.get("session_id");
  console.log(session);

  const all = req.cookies.getAll();
  console.log(all);

  return res.send("Check your cookies in the console");
});
```

- `req.cookies.get(name)` → returns the value of a specific cookie.
- `req.cookies.getAll()` → returns all cookies as an object `{ [key]: value }`.

---

## Setting Cookies

You can set cookies using `res.cookies.set()`:

```ts
route.get("/", (req: Request, res: Response) => {
  res.cookies.set("user_id", "12345");

  return res.send("Cookie set!");
});
```

You can also pass options to control the behavior of the cookie:

```ts
res.cookies.set("user_id", "12345", {
  path: "/",
  httpOnly: true,
  secure: true,
  maxAge: 60 * 60 * 24, // 1 day
  sameSite: "Strict",
});
```

### Available Options

| Option     | Type             | Description                                  |
|------------|------------------|----------------------------------------------|
| `path`     | `string`         | The path for which the cookie is valid       |
| `domain`   | `string`         | The domain that can access the cookie        |
| `maxAge`   | `number`         | Max age in seconds                           |
| `expires`  | `Date`           | Exact expiration date                        |
| `httpOnly` | `boolean`        | Prevents client-side JavaScript access       |
| `secure`   | `boolean`        | Sends cookie only over HTTPS                 |
| `sameSite` | `"Lax" \| "Strict" \| "None"` | Controls cross-site request behavior     |

---

### Deleting Cookies

You can manually delete a cookie by setting its value to an empty string and providing an expiration date in the past:

```ts
const cookie = res.cookies.set("token", "", {
  path: "/",
  expires: new Date(0),
});
```

This will instruct the browser to remove the cookie.

#### Using `res.cookies.delete()`

Alternatively, you can use the delete() method, which is a shortcut for deleting cookies:

```ts
res.cookies.delete("token");
```

This is a more concise way to delete cookies, as it automatically handles setting the expiration to the past.

> The built-in `Cookies` utility generates a cookie with an expired date to instruct the browser to remove it.

---

## Under the Hood

The cookie handling parses the `Cookie` header on the request and formats `Set-Cookie` headers on the response.

### Request Integration

The `Request` class automatically parses cookies from the incoming request header and exposes them via:

```ts
req.cookies.get(name);
req.cookies.getAll();
```

### Response Integration

The `Response` class stores cookies using the internal `Cookies` instance and writes them into the `Set-Cookie` headers when the response is parsed:

```ts
res.cookies.set(name, value, options);
```

These are included automatically when calling `res.send()`, `res.json()`, or `res.html()`.

---

> Cookies are encoded/decoded automatically using `encodeURIComponent` and `decodeURIComponent`.
