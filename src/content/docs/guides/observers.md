---
title: Observers
description: A guide about the model observer.
---

Model observers in Harpia let you hook into Prisma operations—such as creating, updating, or deleting records—and run custom logic when those actions occur.
Observers are stored in the `app/observers` directory and are automatically loaded when the application starts. You can create one using the scaffold command:

```bash
bun g
```

## When to Use

Observers are helpful for:

- Logging database changes
- Triggering side effects (like sending notifications)
- Integrating with third-party services

## Supported Operations

You can observe any of the following Prisma operations:

- findUnique
- findUniqueOrThrow
- findFirst
- findFirstOrThrow
- findMany
- create
- createMany
- createManyAndReturn
- delete
- update
- deleteMany
- updateMany
- updateManyAndReturn
- upsert
- aggregate
- groupBy
- count

## Example Setup
Each observer is just a file that registers a callback for a model and operation.

```typescript
// app/observers/UserCreate.observer.ts
import { Observer } from ".";

Observer.model("User", "create", ({ data }) => {
  console.log("New user created:", data);
});
```

