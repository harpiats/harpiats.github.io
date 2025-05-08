---
title: Factory
description: Create a new Factory
---

The `Factory` helps you generate fake data and seed your database for testing or development purposes. It uses [`@faker-js/faker`](https://github.com/faker-js/faker) and provides a fluent API for creating real or stubbed model data.

---

### Generating a Factory
You can quickly generate a factory for any model using the generator:

```bash
bun g
```

Then select the `Factory` option and provide the model name when prompted:

```bash
? What do you want to forge? (Use arrow keys)
  Module
  Controller
  Test
❯ Factory
  Seed
  Task
  Validation
  Observer

✔ What do you want to forge? Factory
✔ Factory name (Use a model name): user
```

This will create a pre-configured seed file at `app/database/factories/user.factory.ts`.

### Defining a Factory

You define a factory by passing a model and a function that returns fake attributes.

```ts
// app/database/factories/user.factory.ts
import { Factory } from "app/helpers/Factory";
import { User } from "..";

const UserFactory = new Factory().define(User, (faker) => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: "USER",
  }
});

export { UserFactory };
```

---

### Using a Factory

You can merge static or dynamic attributes, create single or multiple records, or return stubbed data without saving to the database.

```ts
import { UserFactory } from "app/database/factories/user.factory";

const user = await UserFactory
  .merge({ role: "ADMIN" })
  .create();
```

---

### Creating Multiple Records

```ts
await UserFactory.createMany(10);
```

---

### Returning Stubbed Data (no DB interaction)

```ts
const fakeUser = await UserFactory.makeStubbed();
const fakeUsers = await UserFactory.makeStubbedMany(5);
```

---

### Example with Relationships

```ts
import { PostFactory } from "app/database/factories/post.factory";
import { UserFactory } from "app/database/factories/user;factory";

export async function run() {
  const author = await UserFactory.merge({ role: "AUTHOR" }).create();

  await PostFactory.merge({ authorId: author.id }).createMany(3);
}
```

---

### API

| Method              | Description |
|---------------------|-------------|
| `.define(model, fakerFn)`     | Define a factory for a model. |
| `.merge(attributes)`          | Merge static values into the generated data. |
| `.create()`                  | Create and return one record. |
| `.createMany(count)`         | Create and return multiple records. |
| `.makeStubbed()`             | Return one fake object (not persisted). |
| `.makeStubbedMany(count)`    | Return multiple fake objects. |

> Each call to `create()` or `makeStubbed()` resets the merge state, ensuring isolation between uses.
