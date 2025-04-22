---
title: Database
description: A guide in my new Starlight docs site.
---

Harpia uses Prisma as its default ORM.

## File Structure
- **Schema File**: `app/database/schema.prisma`
- **Prisma client abstraction**: `app/database/database.ts`
- **Model imports**: `app/database/index.ts`

## Creating Models
Whenever you add a new model to your `schema.prisma`, just run:

```bash
bun migrate
```

This runs `prisma migrate dev` and `prisma generate dev` under the hood to keep your database and types in sync.

## Registering Models
After creating a model, register it in `app/database/index.ts` like this:

```typescript
import { PrismaClient } from "@prisma/client";
import { Observer } from "./observer";

const client = new PrismaClient();
export const observer = new Observer(client);

export const prisma = observer.prisma;
export const {
  user: User
  post: Post,
  comment: Comment, // Model
} = prisma;
```

This lets you access models directly, like `Post.findMany()` or `Comment.create()`, without having to call `prisma.post` or `prisma.comment` every time.
