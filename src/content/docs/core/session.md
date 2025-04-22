---
title: Session
description: Manage user sessions with cookies and a persistent store.
---

Harpia includes a `Session` class that allows you to manage user sessions in a simple and modular way. Sessions are stored using a customizable store (defaults to in-memory) and are tracked on the client-side using cookies.

---

## Getting Started

To begin managing sessions, create an instance of the `Session` class:

```ts
import { Session } from "harpiats/session";

const session = new Session();
```

By default, it uses an in-memory store and stores the session ID in a cookie named `session_id`.

---

## Creating a Session

To create a new session:

```ts
app.get("/login", async (req: Request, res: Response) => {
  const sessionId = await session.create({ userId: "123" });
  session.setCookie(res, sessionId, { httpOnly: true, secure: true });
  res.json({ message: "Session created!" });
});
```

- `session.create(data)` stores the data and returns a generated session ID.
- `session.setCookie(res, sessionId, options)` sets a cookie with the session ID.

---

## Retrieving a Session

You can retrieve session data from a request:

```ts
app.get("/profile", async (req: Request, res: Response) => {
  const user = await session.fromRequest(req);

  if (user) {
    res.json({ status: "authenticated", user });
  } else {
    res.json({ status: "unauthenticated" });
  }
});
```

- `session.fromRequest(req)` reads the session ID from the cookie and loads the data from the store.

---

## Updating a Session

You can update session data by merging new data into the existing session:

```ts
app.get("/update-role", async (req: Request, res: Response) => {
  const sessionId = req.cookies.get("session_id");
  const updated = await session.update(sessionId, { role: "admin" });

  if (updated) {
    res.json({ message: "Session updated." });
  } else {
    res.json({ message: "Session not found." });
  }
});
```

- `session.update(sessionId, data)` merges `data` into the existing session.

---

## Deleting a Session

To delete a session and clear the cookie:

```ts
app.get("/logout", async (req: Request, res: Response) => {
  const sessionId = req.cookies.get("session_id");

  if (sessionId) {
    await session.delete(sessionId, res);
    res.json({ message: "Session deleted." });
  } else {
    res.json({ message: "No session to delete." });
  }
});
```

- `session.delete(sessionId, res)` deletes the session and removes the cookie from the response.

---

## Setting the Session Cookie

You can set cookie options like `httpOnly`, `secure`, `maxAge`, etc:

```ts
session.setCookie(res, sessionId, {
  httpOnly: true,
  secure: true,
  maxAge: 3600 // 1 hour
});
```

- This method uses the internal `Cookies` class to format and append a `Set-Cookie` header.

---

## Custom Cookie Name

By default, the cookie name is `session_id`. You can override this in the constructor:

```ts
const session = new Session({ cookieName: "my_custom_cookie" });
```

---

## Using a Custom Store

You can provide a custom store to persist sessions in Redis or a database:

```ts
import { createClient } from "redis";

const redis = createClient();
await redis.connect();

const redisStore: Store = {
  async get(id) {
    const value = await redis.get(id);
    return value ? JSON.parse(value) : undefined;
  },
  async set(id, data) {
    await redis.set(id, JSON.stringify(data));
  },
  async delete(id) {
    await redis.del(id);
  },
};

const session = new Session({ store: redisStore });
```

Any store must implement the `Store` interface:

```ts
interface Store {
  get(id: string): Promise<Record<string, any> | undefined>;
  set(id: string, data: Record<string, any>): Promise<void>;
  delete(id: string): Promise<void>;
}
```

---

## Summary

| Method | Description |
|--------|-------------|
| `create(data)` | Creates a new session and returns a session ID. |
| `get(id)` | Retrieves session data by ID. |
| `update(id, data)` | Merges new data into an existing session. |
| `delete(id, res)` | Deletes the session and clears the cookie. |
| `setCookie(res, id, options?)` | Sets a session cookie in the response. |
| `fromRequest(req)` | Retrieves session data from the request's cookies. |