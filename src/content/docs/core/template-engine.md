---
title: Template Engine
description: Harpia supports both third-party and its own built-in template engine with layouts, blocks, partials, and plugin support.
---

Harpia supports two different template engines: the community-driven **EJS**, and its own native **HTML-based engine** built specifically for modular apps.

---

## Third-party Template Engine

You can use any third-party engine like EJS. Here's how:

### 1. Create an engine configuration

```ts
// src/ejs.ts
import ejs from "ejs";
import path from "node:path";
import type { Harpia } from "harpiats";

export const ejsEngine = {
  configure: (app: Harpia) => {
    app.engine.set(ejsEngine);
  },
  render: async (view: string, data: Record<string, any>) => {
    const filePath = path.resolve(process.cwd(), "src/views", `${view}.ejs`);
    return await ejs.renderFile(filePath, data);
  }
};
```

### 2. Set up your application

```ts
import harpia from "harpiats";
import { ejsEngine } from "./ejs";

const app = harpia();

ejsEngine.configure(app);

app.get("/books", async (req, res) => {
  await res.render("home", { title: "Books" });
});
```

### 3. Sample EJS template

`src/views/home.ejs`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title><%= title %></title>
  </head>
  <body>
    <h1>Hello World!</h1>
  </body>
</html>
```

---

## Harpia Native Template Engine

The built-in engine is designed for HTML templates, and supports layouts, blocks, partials, comments, conditions, loops, and plugins. It works well for monolithic and modular applications.

---

### Configuration (non-module structure)

Create `template-engine.ts`:

```ts
import path from "node:path";
import { TemplateEngine } from "harpiats/template-engine";

const baseDir = process.cwd();

export const engine = new TemplateEngine({
  viewName: "page",
  useModules: false,
  fileExtension: ".html", // The default is `.html`, but you can use `.txt`, `.hml`, or any other.
  path: {
    views: path.join(baseDir, "src", "resources", "pages"),
    layouts: path.join(baseDir, "src", "resources", "layouts"),
    partials: path.join(baseDir, "src", "resources", "partials"),
  },
});
```

Use it in your application:

```ts
import harpia from "harpiats";
import { engine } from "src/template-engine";

const app = harpia();
engine.configure(app);

app.get("/books", async (req, res) => {
  await res.render("home", { title: "Books" });
});
```

---

### Configuration (module structure)

If using modular routing, set `useModules: true`:

```ts
import path from "node:path";
import { TemplateEngine } from "harpiats/template-engine";

const baseDir = process.cwd();

export const engine = new TemplateEngine({
  viewName: "page",
  useModules: true,
  fileExtension: ".html", // The default is `.html`, but you can use `.txt`, `.hml`, or any other.
  path: {
    views: path.join(baseDir, "modules", "**", "pages"),
    layouts: path.join(baseDir, "resources", "layouts"),
    partials: path.join(baseDir, "resources", "partials"),
  },
});
```

Then:

```ts
app.get("/books", async (req, res) => {
  await res.module("books").render("home", { title: "Books" });
});
```

> ℹ️ Learn more about how modules work in Harpia in the [Modules Guide](/guides/modules).

---

### Rendering templates by path

You can also render templates manually:

```ts
const content = await html.renderTemplate(
  "app/services/mailer/templates/account-created",
  { data }
);
```

---

## Template Syntax

Use the file with the choosen file extension, like `.html`, with the following syntax:

| Feature        | Example |
|----------------|---------|
| Layout         | `{{= layout('default') }}` |
| Block (define) | `{{= define block("body") }}` |
| Block (use)    | `{{= block('body') }} ... {{= endblock }}` |
| Include file   | `{{= include('welcome', { message: 'Hello' }) }}` |
| Partial        | `{{= partial('card', { name: 'A' }) }}` |
| Comment        | `## This is a comment` |
| Variables (use)      | `{{ title }}` |
| Variable (define) | `{{~ var title = "Homepage" }}` |
| Plugins in Variable | `{{~ var title = uppercase("Homepage") }}` |
| Conditionals (use)    | `{{~ if(...) }} ... {{~ else }} ... {{~ endif }}` |
| Array For (use)    | `{{~ for num in numbers }} ... {{~ endfor }}` |
| Object For (use)    | `{{~ for [key, value] in products }} ... {{~ endfor }}` |

---

### Conditionals

```html
{{~ if(isActive) }} <p>User is active.</p> {{~ endif }}

{{~ if(isActive) }}
  <p>User is active.</p>
{{~ else }}
  <p>User is not active.</p>
{{~ endif }}

<p>{{ isActive ? 'Active' : 'Inactive' }}</p>
```

---

### Loops

```html
{{~ for num in numbers }}
  <p>Number: {{ num }}</p>
{{~ endfor }}

{{~ for [key, value] in products }}
  <p>{{ key }}: {{ value.name }} - ${{ value.price }}</p>
{{~ endfor }}
```

### Using plugins in Conditionals
You can create complex conditional logic by combining multiple plugins. This example demonstrates how to check if a user's name is "John" AND they're over 25 years old.

#### Step 1: Register the Plugins
First, register the helper plugins that will be used in the condition:

```ts
// Equality check plugin
engine.registerPlugin("equals", (a: any, b: any) => a === b);

// Numeric comparison plugin
engine.registerPlugin("greaterThan", (a: number, b: number) => a > b);

// Logical AND plugin that accepts multiple boolean arguments
engine.registerPlugin("and", (...args: boolean[]) => args.every(Boolean));
```

#### Step 2: Prepare the Data
Define the data that will be passed to the template:

```ts
const userData = {
  name: "John",
  age: 30
};
```

#### Step 3: Create the Template
In your template, use the plugins within a conditional statement:

```html
{{~ if (and(equals(name, 'John'), greaterThan(age, 25))) }}
  <p>Hello John, over 25</p>
{{~ else }}
  <p>Hello stranger</p>
{{~ endif }}
```

Expected Output

```html
<p>Hello John, over 25</p>
```

#### How It Works
- Innermost plugins execute first:
  - `equals(name, 'John')` checks if the name equals "John" → returns `true`
  - `greaterThan(age, 25)` checks if age is greater than 25 → returns `true`
- The `and` plugin combines results:
  - `and(true, true)` evaluates to `true`
- The conditional renders the appropriate block:
  - Since the condition is `true`, the first block is rendered

This approach allows you to build complex conditional logic by combining simple, reusable plugins. You can nest plugins as deeply as needed to create sophisticated conditions while keeping your templates readable and maintainable.

---

### Using plugins in Loops
This example demonstrates how to iterate through an array and use plugins within the loop to apply conditional formatting. We'll process a list of numbers and classify them as even or odd.

#### Step 1: Register the Plugin
First, register the helper plugin that checks if a number is even:
```ts
engine.registerPlugin("isEven", (number: number) => {
  const num = Number(number);
  return num % 2 === 0;
});
```

#### Step 2: Prepare the Data
Define the array of numbers that will be processed:

```ts
const data = {
  numbers: [1, 2, 3, 4]
};
```

#### Step 3: Create the Template
In your template, use a loop with the plugin to conditionally format each number:

```html
{{~ for num in numbers }}
  {{~ if (isEven(num)) }}
    <div class="even">{{ num }}</div>
  {{~ else }}
    <div class="odd">{{ num }}</div>
  {{~ endif }}
{{~ endfor }}
```

**Expected Output:**
```html
<div class="odd">1</div>
<div class="even">2</div>
<div class="odd">3</div>
<div class="even">4</div>
```

**How It Works**
- Loop Iteration:
  - The `for` loop iterates through each number in the `numbers` array
  - For each iteration, the current number is available as `num`
- Plugin Execution:
  - Inside the loop, `isEven(num)` is called for each number
  - The plugin returns `true` for even numbers (2, 4) and `false` for odd numbers (1, 3)
- Conditional Rendering:
  - When `isEven(num)` returns `true`, the `<div class="even">` block is rendered
  - When `isEven(num)` returns `false`, the `<div class="odd">` block is rendered
- Final Output:
  - The loop generates a separate `<div>` for each number in the array
  - Each `<div>` gets the appropriate CSS class based on the number's parity

This pattern demonstrates how you can combine loops and plugins to create dynamic content with conditional formatting. The same approach can be used for more complex scenarios like filtering, transforming, or categorizing data during iteration.

## Plugins

You can register helpers for use in templates:

```ts
engine.registerPlugin("uppercase", (str: string) => str.toUpperCase());
engine.registerPlugin("exclaim", (str: string) => `${str}!`);
engine.registerPlugin("sum", (a: number, b: number) => a + b);
```

Usage in templates:

```html
<p>{{{ uppercase(user.name) }}}</p>
<p>{{{ sum(10, 20) }}}</p>
<p>{{{ exclaim(uppercase(user.name)) }}}</p>
```

In the example above:

- uppercase(user.name) transforms the name to uppercase.
- exclaim(...) adds an exclamation mark.
- The result would be something like: `<p>LUCAS!</p>`

You can nest plugins as deeply as needed:

```html
<p>{{{ exclaim(uppercase(sum(5, 5))) }}}</p>
<!-- Output: 10 -> "10" -> "10!" -->
```

Just make sure the return value of each plugin matches the input type expected by the next.
