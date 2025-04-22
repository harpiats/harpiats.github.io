---
title: Memory Storage
description: In-memory storage solution for sessions and transient data.
---

The MemoryStore module provides a simple in-memory key-value store, conforming to the Store interface (also used in Harpia's session system). It is ideal for development or applications where persistence across reboots is not required.

---

## Features

- Fully asynchronous interface
- Fast and efficient for short-lived data
- Safe usage through internal locking mechanism to avoid race conditions

---

## API

### Creating a Memory Store

To create a new store instance:

```ts
import { MemoryStore } from "harpiats/memory-store";

const store = new MemoryStore();
```

---

### Storing and Retrieving Data

You can store any serializable data by using a string key:

```ts
await store.set("session123", { userId: 1, username: "Alice" });

const session = await store.get("session123");
console.log(session); // { userId: 1, username: "Alice" }
```

---

### Deleting Data

To remove a key-value pair:

```ts
await store.delete("session123");
console.log(await store.get("session123")); // undefined
```

---

## Using with Session Management

You can use the `MemoryStore` as the backend for Harpia's session management:

```ts
import { MemoryStore } from "harpiats/memory-store";
import { Session } from "harpiats/session";

const memoryStore = new MemoryStore();
const sessionManager = new Session({ store: memoryStore });

const sessionId = await sessionManager.create({ userId: 1, username: "Alice" });

const session = await sessionManager.get(sessionId);
console.log(session); // { userId: 1, username: "Alice" }

await sessionManager.delete(sessionId, res);
```

---

## Implementation Details

The `MemoryStore` uses an internal `Map` to store data and a promise-based locking mechanism to serialize access. This ensures safe concurrent operations, even in asynchronous environments.

```ts
class MemoryStore implements Store {
  private store: Map<string, any>;
  private lock: Promise<void>;

  constructor() {
    this.store = new Map();
    this.lock = Promise.resolve();
  }

  async get(key: string): Promise<any> {
    await this.lock;
    return this.store.get(key);
  }

  async set(key: string, value: any): Promise<void> {
    this.lock = this.lock.then(() => {
      this.store.set(key, value);
    });
    await this.lock;
  }

  async delete(key: string): Promise<void> {
    await this.lock;
    this.store.delete(key);
  }
}
```

---

## When to Use

| Use Case              | MemoryStore |
|-----------------------|-------------|
| Development           | ✅ Yes      |
| Stateless testing     | ✅ Yes      |
| Production environments | ❌ Not recommended (use Redis or DB) |
| Requires persistence  | ❌ No       |

---

## Summary

The `MemoryStore` is a lightweight, fast, and easy-to-use store for transient session data. It’s best suited for local development and non-critical environments where data loss on restart is acceptable.

If you need persistent or distributed session storage, consider using a Custom Store like Redis.