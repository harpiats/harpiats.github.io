---
title: Test
description: A guide in my new Starlight docs site.
---

Harpia provides a convenient way to scaffold ready-to-use test files for specific features or routes using the `bun g` command.

To generate a test, run the command:

```bash
bun g
```

Then, select the `Test` option from the prompt:

```bash
? What do you want to forge? (Use arrow keys)
  Module
  Controller
❯ Test
  Factory
  Seed
  Task
  Validation
  Observer
```

You’ll be prompted to provide the **module** and **test name**. For example:

```bash
✔ What do you want to forge? Test
✔ Module name: user
✔ Test name: store
```

This will create a new file at:  
`modules/user/tests/store.spec.ts`

By default, the generated test file comes with the following structure:

```ts
import { describe, expect, test } from "bun:test";
import { TestClient } from "harpiats";
import { app } from "start/server";

const client = new TestClient(app);

describe("[METHOD] /users - User endpoint", () => {
  test("describe the test", async () => {
    // const request = await client.get("/").execute();
    // const response = await request.json();

    // expect(request.status).toBe(200);
    // expect(response).toBeObject();
    // expect(response).toEqual(
    //   expect.objectContaining({
    //     status: "OK",
    //     result: expect.objectContaining({
    //       // expect properties
    //     }),
    //     error: null,
    //   }),
    // );
  });
});
```

The file includes a basic test structure using **bun:test** and provides a template for making requests with the `TestClient`.

#### TestClient

The `TestClient` is a core utility provided by Harpia, allowing you to easily make HTTP requests to your application during testing. It enables you to execute tests on endpoints, check responses, and perform assertions.

> 💡 **Learn more about `TestClient`:** [Test Client Documentation](/core/test-client)

