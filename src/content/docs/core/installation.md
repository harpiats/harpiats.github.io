---
title: Installation
description: How to set up a new project using Harpia Core.
---

To start a new project with **Harpia Core**, make sure you have [Bun](https://bun.sh) installed:

```bash
bun --version
```

Then initialize your project and install the core package:

```bash
bun init -y
bun add harpiats
```

Create a file named `server.ts` and add the following code:

```ts
import harpia from "harpiats";

const app = harpia();

app.listen(
  {
    port: 3000,
    development: true,
  },
  () => console.log("Server is running at http://localhost:3000/")
);
```

That's all you need to get started with Harpia Core!
