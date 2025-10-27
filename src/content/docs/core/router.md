---
title: Router
description: Learn how to define and register routes using Harpia Core.
---

Harpia Core provides two ways to define and manage routes:  
using the main `harpia()` instance or creating a separate `Router` instance.

### 1. Using the `harpia()` instance

You can define routes directly on the app instance:

```ts
import harpia, { type Request, type Response } from "harpiats";

const app = harpia();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(
  {
    port: 3000,
    development: true,
  },
  () => console.log("Server is running at http://localhost:3000/")
);
```

### 2. Using the `Router` class

You can also organize your routes into separate files or modules using the `Router` class:

```ts
// routes.ts
import { Router, type Request, type Response } from "harpiats";

const routes = new Router();

routes.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

export default routes;
```

Then in your main server file:

```ts
// server.ts
import harpia from "harpiats";
import routes from "./routes";

const app = harpia();

app.routes(routes);

app.listen(
  {
    port: 3000,
    development: true,
  },
  () => console.log("Server is running at http://localhost:3000/")
);
```

---

### Route Prefixing

You can add a prefix to a group of routes by passing it to the `Router` constructor:

```ts
const routes = new Router("v1");
```

This will automatically prefix all routes defined inside this router with `/v1`.

---

### Route Definition

Both the `app` instance and the `Router` instance support standard HTTP methods like `get`, `post`, `put`, `delete`, etc.

Each route is defined with the following structure:

```ts
router.get("/path", middlewares, (req: Request, res: Response) => {
  // handler logic
});
```

> Middlewares are optional. More information about them is available in the [Middleware section](/core/middleware).

---

### Web Socket Routes
Creating a websocket route

```typescript
import { Router } from "harpia";

const routes = Router();

// Define a custom type for WebSocket connection data
type CustomWebSocketData = {
  userId: string;
  username: string;
  sessionId: string;
};

// Create a WebSocket route for the chat
routes.ws<CustomWebSocketData>("/chat", {
  // Called when a new WebSocket connection is opened
  open(ws) {
    const data = ws.data;

    console.log("New WebSocket connection opened on /chat");

    // Set custom data for this connection
    data.userId = "123";
    data.username = "Alice";
    data.sessionId = "abc";

    ws.send(`Welcome to the chat, ${data.username}!`);
  },

  // Called when a message is received from the client
  message(ws, message) {
    const data = ws.data;
    console.log(`Message received from ${data.username}: ${message}`);
  },

  // Called when the WebSocket connection is closed
  close(ws, code, reason) {
    const data = ws.data;
    console.log(`Connection closed (${code}) by ${data.username}: ${reason}`);
  },

  // Called when the socket is ready to send more data
  drain(ws) {
    const data = ws.data;
    console.log(`Socket for ${data.username} is ready to send data`);
  },

  // Called when an error occurs on the WebSocket connection
  error(ws, error) {
    const data = ws.data;
    console.error(`Error on ${data.username}'s connection:`, error);
  },
});

export default routes;
```

---

### Registering Routes Manually

The `Router` class also provides a `register` method that allows you to programmatically add multiple routes with an optional prefix. This is especially useful when dynamically loading modules in larger applications.

Instead of declaring the route objects manually, you can define your routes normally using the `Router` class and then call `.list()` to retrieve the internal route structure:

```ts
// users.routes.ts
import { Router, type Request, type Response } from "harpiats";

const usersRoutes = new Router("users");

usersRoutes.get("/", (req: Request, res: Response) => {
  res.send("Users v1");
});

usersRoutes.post("/", (req: Request, res: Response) => {
  res.send("Create v1 user");
});

export default usersRoutes;
```

Then, register them like this:

```ts
// server.ts
import harpia, { Router } from "harpiats";
import usersRoutes from "./users.routes";

const app = harpia();

// Create a router instance and register the route group
const routes = new Router();

routes.register({
  prefix: "/v1",
  routes: usersRoutes.list(),
});

// Attach the routes to the app
app.routes(routes);

app.listen(
  {
    port: 3000,
    development: true,
  },
  () => console.log("Server is running at http://localhost:3000/")
);
```

With this structure, your final routes will be:

- GET /v1/users
- POST /v1/users

This approach keeps your routing modular and scalable, ideal for larger projects with route groups or dynamic loading.