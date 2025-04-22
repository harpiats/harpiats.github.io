---
title: Middlewares
description: A guide to route and global middlewares in Harpia.
---

Harpia supports both **route middlewares** and **global middlewares**.

## Route Middleware

You can define route-specific middleware in two ways:

### Inline within the route

You can define one or more middleware functions directly in the route declaration:

```ts
route.get(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    console.log("first middleware");
    next();
  },
  (req: Request, res: Response, next: NextFunction) => {
    console.log("second middleware");
    next();
  },
  (req: Request, res: Response) => {
    console.log("handler");
    return res.send("hello");
  }
);
```

Each middleware has access to `req`, `res`, and `next`. Call `next()` to pass control to the next middleware or the final handler.

---

### Using `app.use()` with a prefix

You can attach middleware to a route prefix using `app.use()`:

```ts
app.use("/users", (req: Request, res: Response, next: NextFunction) => {
  console.log("check user");
  next();
});
```

This middleware will run for any route that starts with `/users`.

---

## Global Middleware

Global middleware applies to **all routes** and is also defined using `app.use()`, but without specifying a route path:

```ts
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("global check");
  next();
});
```

Use global middleware for things like logging, authentication checks, or response timing.

---

> All middleware functions must call `next()` to pass control unless a response is sent or an error is thrown.