---
title: Seeding
description: A guide about the seeding database.
---

Harpia provides a powerful seeding system to populate your database with initial data for development and testing.

### File Structure
- **Seed directory**: `app/database/seeds/`
- **Main seed runner**: `app/database/seeds/index.ts`
- **Individual seed files**: `app/database/seeds/[name].seed.ts`

### Creating Seeds

#### 1. Generating Seed
You can quickly generate a seed for any model using the generator:

```bash
bun g
```

Then select the `seed` option and provide the model name when prompted:

```bash
? What do you want to forge? (Use arrow keys)
  Module
  Controller
  Test
  Factory
❯ Seed
  Task
  Validation
  Observer

✔ What do you want to forge? Seed
✔ Seed name (use model name): user
```

This will create a pre-configured seed file at `app/database/seeds/user.seed.ts`.

#### 2. Manual Creation
Alternatively, create `.seed.ts` files manually. Each should export a `run` function:

```typescript
import { User } from "..";
import UserFactory from "../factories/User"; // Optional factory usage

export async function run() {
  await User.createMany({
    data: [
      { name: "Admin", email: "admin@example.com" },
      { name: "User", email: "user@example.com" },
    ],
  });

  // Or using factories (recommended)
  await UserFactory.createMany(5);
}
```

### Using Factories in Seeds
For more dynamic data generation, you can leverage [Factories](/guides/factory). Factories provide fake data generation and convenient methods for creating test data:

```typescript
import PostFactory from "../factories/Post";
import UserFactory from "../factories/User";

export async function run() {
  const author = await UserFactory.merge({
    role: "AUTHOR",
  }).create();

  await PostFactory.merge({
    authorId: author.id,
  }).createMany(3);
}
```

### Running Seeds
Execute seeds in two ways:

1. **All seeds**:
```bash
bun seed
```

2. **Specific seed**:
```bash
bun seed user
```

### Best Practices
1. **Idempotency**: Design seeds to run multiple times safely
2. **Factories**: Use them for realistic fake data ([learn more](/guides/factory))
3. **Relationships**: Create related records together
4. **Performance**: Prefer `createMany` over individual creates
5. **Environment**: Never run seeds in production automatically

### Example With Relationships
```typescript
import ProductFactory from "app/database/factories/Product";
import CategoryFactory from "app/database/factories/Category";

export async function run() {
  const category = await CategoryFactory.create();
  
  await ProductFactory.merge({
    categoryId: category.id,
  }).createMany(5);
}
```

> Tip: Combine manual data with factories for optimal seeding - use factories for bulk random data and manual inserts for specific test cases.