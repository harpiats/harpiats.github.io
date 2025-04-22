---
title: Changing the Homepage
description: How to change the response for the root path `/` of your application.
---

In Harpia, each module manages its own routes using a dedicated `.routes.ts` file. If you want to customize the response for the root path (`GET /`), you can do so by modifying the `root` module.

---

## Where to Define It

By default, the route for `/` should be defined inside `modules/root/root.routes.ts`. This file is responsible for handling root-level requests like:

```ts
// modules/root/root.routes.ts

import { type Request, type Response, Router } from "harpiats";

const rootRoutes = new Router();

rootRoutes.get("/", async (req: Request, res: Response) => {
  return res.json({
    message: "Welcome to Harpia",
  });
});

export { rootRoutes };
```
