---
title: Test Cleaner
description: A guide in my new Starlight docs site.
---

### TestCleaner

The `TestCleaner` is a utility class designed to help manage and clean up database records created during tests. It ensures that records registered during test execution are deleted after each test, keeping the database in a clean state.

---

#### Initialization

You initialize `TestCleaner` by providing a mapping of your models:

```ts
import { TestCleaner } from "app/helpers/TestCleaner";
import { User, Role } from "app/models";

const cleaner = new TestCleaner({
  User,
  Role,
});
```

* **Constructor argument:** an object mapping model names to Prisma model instances.
* Automatically tracks records to delete for each model.

---

#### Registering Records

You can register single or multiple records for deletion:

```ts
// Register a single record
cleaner.register("User", 1);

// Register multiple records
cleaner.registerMany("Role", [10, 12, 15]);
```

* `register(modelName, id)` – registers a single record ID.
* `registerMany(modelName, ids)` – registers multiple record IDs.

---

#### Cleaning Records

After tests, you can clean all registered records:

```ts
await cleaner.clean();
```

* Deletes all registered records for all models.
* Resets the internal list of records after deletion.
* If deletion fails for a record, a warning is logged but the cleanup continues.

You can also manually reset the list without deleting:

```ts
cleaner.reset();
```

---

#### Accessing Registered Data

You can inspect pending deletions:

```ts
const models = cleaner.getModels(); 
// → ["User", "Role"]

const pending = cleaner.getPendingRecords();
/* 
{
  User: [1],
  Role: [10, 12, 15]
}
*/
```

---

#### Example Test Usage

```ts
import { TestClient } from "app/test/TestClient";
import { TestCleaner } from "app/helpers/TestCleaner";
import { UserFactory, RoleFactory } from "app/database/factories";
import { User, Role } from "app/models";

const client = new TestClient(app);
const cleaner = new TestCleaner({ User, Role });

describe("[POST] /users - User endpoint", () => {
  test("successfully create a user", async () => {
    const data = await UserFactory.makeStubbed();
    const request = await client.post("/users").json(data).execute();
    const response = await request.json();

    cleaner.register("User", response.result.id);

    expect(request.status).toBe(201);
    expect(response.result).toMatchObject({
      id: expect.any(Number),
      name: data.name,
      email: data.email,
    });
  });

  test("creating a user with an existing email fails", async () => {
    const existing = await UserFactory.create();
    const data = await UserFactory.makeStubbed({ email: existing.email });

    const request = await client.post("/users").json(data).execute();
    const response = await request.json();

    cleaner.register("User", existing.id);

    expect(request.status).toBe(400);
    expect(response.error.message).toBe("Email already exists.");
  });
});

describe("[POST] /roles - Role endpoint", () => {
  test("successfully create a role", async () => {
    const data = await RoleFactory.makeStubbed();
    const request = await client.post("/roles").json(data).execute();
    const response = await request.json();

    cleaner.register("Role", response.result.id);

    expect(request.status).toBe(201);
    expect(response.result).toMatchObject({
      id: expect.any(Number),
      name: data.name,
    });
  });
});

afterEach(async () => {
  await cleaner.clean();
});
```
