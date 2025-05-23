---
title: Database
description: A guide in my new Starlight docs site.
---

Harpia uses Prisma as its default ORM.

## File Structure
- **Schema File**: `prisma/schema.prisma`
- **Migrations**: `prisma/migrations`
- **Prisma client abstraction**: `app/database/database.ts`
- **Model imports**: `app/database/index.ts`

## Creating Models
Whenever you add a new model to your `schema.prisma`, just run:

```bash
bun migrate
```

This runs `prisma migrate dev` and `prisma generate dev` under the hood to keep your database and types in sync.
After creating a model in your `schema.prisma`, the system automatically detects all models and updates `app/database/index.ts` for you, making them available with clean and direct access:

```typescript
export const {
  user: User,
  post: Post,
  comment: Comment,
} = prisma;
```

This allows you to call models directly, such as `Post.findMany()` or `Comment.create()`, without manually using `prisma.post` or `prisma.comment`.
