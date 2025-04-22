---
title: Cache  
description: Caching with memory or custom stores in Harpia.  
---

Harpia provides a flexible caching interface with support for in-memory storage and custom pluggable stores like Redis. It is ideal for managing temporary data such as sessions, tokens, or preprocessed content.

---

## Overview

The `Cache` class allows you to store, retrieve, and delete key-value pairs asynchronously. By default, it uses an in-memory store (`MemoryStore`), but it can be replaced with any custom implementation that follows the `Store` interface.

```ts
import { Cache } from "harpiats";

const cache = new Cache();

await cache.set("user:123", { name: "Alice" });

const user = await cache.get("user:123");
console.log(user); // { name: "Alice" }

await cache.delete("user:123");
```

---

## API

### `cache.get(key: string): Promise<any>`

Retrieves a value from the cache.

```ts
const value = await cache.get("token:abc");
```

- **Parameters**:  
  `key` – The identifier for the cached value.

- **Returns**:  
  The stored value or `undefined` if not found.

---

### `cache.set(key: string, value: any): Promise<void>`

Stores a value under the given key.

```ts
await cache.set("token:abc", { valid: true });
```

- **Parameters**:  
  - `key` – A string identifier for the cache entry.  
  - `value` – Any data to store.

---

### `cache.delete(key: string): Promise<void>`

Removes a value from the cache.

```ts
await cache.delete("token:abc");
```

---

## Using a Custom Store

The `Cache` constructor accepts a `store` option that allows you to provide your own storage backend. A store must implement the following interface:

```ts
interface Store {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
  delete(key: string): Promise<void>;
}
```

### Example: Redis Store

You can integrate Redis with Harpia's cache by creating a compatible store:

```ts
import { createClient } from "redis";
import type { Store } from "harpiats";

const redis = createClient();
await redis.connect();

class RedisStore implements Store {
  async get(key: string) {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : undefined;
  }

  async set(key: string, value: any) {
    await redis.set(key, JSON.stringify(value));
  }

  async delete(key: string) {
    await redis.del(key);
  }
}

const cache = new Cache({ store: new RedisStore() });

await cache.set("session:abc", { userId: 1 });
const session = await cache.get("session:abc");
```

---

> Harpia's cache interface is fully asynchronous and designed to integrate seamlessly with other features like session management, rate limiting, and user authentication.