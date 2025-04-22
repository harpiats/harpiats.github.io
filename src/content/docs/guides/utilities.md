---
title: Utilities
description: Built-in utility classes and helpers to manipulate arrays, objects, strings, dates, pagination and more.
---

Harpia includes a set of built-in utility classes to simplify common operations with arrays, objects, strings, and dates. These utilities follow the singleton pattern and can be accessed globally through the `Utils` object.

## Available Utilities

- `Utils.array` – Array manipulation (sort, filter, difference, etc.)
- `Utils.object` – Object manipulation (merge, pick, omit, etc.)
- `Utils.string` – String manipulation (casing, slug, formatting, etc.)
- `Utils.date` – Date parsing, formatting, and calculations
- `paginate()` – Simple pagination metadata helper
- `colorize()` – Terminal color formatter for logs

---

### `Utils.array`

Provides convenient methods to work with arrays using Lodash under the hood.

```ts
Utils.array.sortBy(users, "name");
Utils.array.filter(items, (i) => i.active);
Utils.array.compact([1, null, undefined, 0]); // → [1]
Utils.array.uniq(["a", "a", "b"]); // → ["a", "b"]
Utils.array.difference([1, 2], [2, 3]); // → [1]
```

---

### `Utils.object`

Helper for manipulating objects.

```ts
Utils.object.merge({ a: 1 }, { b: 2 });
Utils.object.pick(user, ["id", "name"]);
Utils.object.omit(user, ["password"]);
Utils.object.omitFromList(users, ["email"]);
Utils.object.isEmpty({}); // → true
```

---

### `Utils.string`

Includes helpers for transforming and analyzing strings.

```ts
Utils.string.pluralize("post"); // → "posts"
Utils.string.camelCase("user name"); // → "userName"
Utils.string.pascalCase("user name"); // → "UserName"
Utils.string.toSlug("Harpia Framework!"); // → "harpia-framework"
Utils.string.truncate("This is a long text", 10); // → "This is a..."
Utils.string.stripTags("<h1>Hello</h1>"); // → "Hello"
```

---

### `Utils.date`

A full-featured date utility class with parsing, formatting, localization, math, and comparison support.

```ts
const date = new DateUtility("2024-12-25");

date.getDayName(); // → "Wednesday"
date.format("YYYY-MM-DD HH:mm"); // → "2024-12-25 00:00"
date.add(1, "day").format("YYYY-MM-DD"); // → "2024-12-26"
date.isBefore(new DateUtility("2025-01-01")); // → true
```

It supports Moment.js-like tokens and localization (e.g., `"en"`, `"pt-BR"`). You can also chain methods like `.startOf("day")`, `.endOf("hour")`, `.difference(other, "days")`, and more.

---

### `paginate({ data, page, perPage, totalData })`

Returns a consistent pagination response with `meta` info.

```ts
paginate({
  data: users,
  page: 2,
  perPage: 10,
  totalData: 35,
});

/*
{
  data: [...],
  meta: {
    currentPage: 2,
    lastPage: 4,
    perPage: 10,
    totalPages: 4,
    totalItems: 35,
  }
}
*/
```

---

### `colorize(color: string, text: string)`

Terminal formatter using Bun's color support.

```ts
colorize("blue", "Hello world");
```

Returns the formatted string with ANSI color codes for terminal output.

---

## Accessing Utilities

All utilities are automatically available through:

```ts
import { Utils } from "app/utils";

Utils.string.camelCase("hello world");
Utils.array.uniq(["a", "b", "a"]);
```

You can also import them individually if needed:

```ts
import { StringUtility } from "app/utils/string";
import { DateUtility } from "app/utils/date";
```

---

> 💡 Tip: These utilities are lightweight and ready to use in any context — including controllers, jobs, templates, or services.
