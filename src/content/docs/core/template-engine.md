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
| Variables      | `{{ title }}` |
| Block (define) | `{{= define block("body") }}` |
| Block (use)    | `{{= block('body') }} ... {{= endblock }}` |
| Include file   | `{{= include('welcome', { message: 'Hello' }) }}` |
| Partial        | `{{= partial('card', { name: 'A' }) }}` |
| Comment        | `## This is a comment` |
| Variable define| `{{~ var title = "Homepage" }}` |

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

---

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
