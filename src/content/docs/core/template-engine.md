---
title: Template Engine
description: Harpia supports both third-party and its own built-in template engine with layouts, blocks, components, and plugin support.
---

# Template Engine

Harpia offers flexible template rendering with support for both **third-party engines** (like EJS) and its own **high-performance native engine** designed for modern web applications.

---

## Third-Party Template Engine

### Using EJS

#### 1. Create Engine Configuration

```typescript
import ejs from "ejs";
import path from "node:path";
import type { Harpia } from "harpia";

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

#### 2. Configure Application

```typescript
import harpia from "harpia";
import { ejsEngine } from "./config/ejs";

const app = harpia();

ejsEngine.configure(app);

app.get("/books", async (req, res) => {
  await res.render("home", { title: "Books", books: [] });
});

app.listen...
```

#### 3. EJS Template Example

`src/views/home.ejs`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %></title>
</head>
<body>
    <h1>Welcome to <%= title %></h1>
    <ul>
      <% books.forEach(book => { %>
          <li><%= book.title %></li>
      <% }); %>
    </ul>
</body>
</html>
```

---

## Harpia Native Template Engine

The built-in engine provides a clean, HTML-based syntax with support for layouts, blocks, components, and plugins.

### Configuration

#### Standard Structure (Non-Modular)

```typescript
// src/config/template-engine.ts
import path from "node:path";
import { TemplateEngine } from "harpia/template-engine";

const baseDir = process.cwd();

export const engine = new TemplateEngine({
  viewName: "page",
  useModules: false,
  fileExtension: ".html", // The default is `.html`, but you can use `.txt`, `.hml`, or any other.
  path: {
    views: path.join(baseDir, "src", "views"),
    layouts: path.join(baseDir, "src", "layouts"), // optional
    components: path.join(baseDir, "src", "components"), // optional
  },
});

// Register custom plugins
engine.registerPlugin("uppercase", (str: string) => str.toUpperCase());
engine.registerPlugin("formatDate", (date: Date) => date.toLocaleDateString());
engine.registerPlugin("currency", (value: number) => `$${value.toFixed(2)}`);
```

```typescript
import harpia from "harpia";
import { engine } from "./config/template-engine";

const app = harpia();
engine.configure(app);

app.get("/products", async (req, res) => {
  await res.render("products", {
    title: "Our Products",
    products: [
      { name: "Product A", price: 29.99 },
      { name: "Product B", price: 39.99 }
    ]
  });
});
```

#### Modular Structure

If using modular routing, set `useModules: true`:

```typescript
// src/config/template-engine.ts
import path from "node:path";
import { TemplateEngine } from "harpia/template-engine";

export const engine = new TemplateEngine({
  viewName: "page",
  useModules: true,
  fileExtension: ".html",
  path: {
    views: path.join(process.cwd(), "modules", "**", "pages"),
    layouts: path.join(process.cwd(), "resources", "layouts"),
    components: path.join(process.cwd(), "resources", "components"),
  },
});
```

```typescript
app.get("/users", async (req, res) => {
  await res.module("users").render("profile", { 
    user: { name: "John", email: "john@example.com" }
  });
});
```

### Manual Template Rendering

Render templates anywhere in your application:

```typescript
app.get("/", async (req, res) => {
  const content = await html.generate(
    "app/services/mailer/templates/account-created",
    { data }
  );

  return res.html(content);
});
```

---

## Template Syntax Reference

### Variables & Output
```html
<h1>{{ title }}</h1>
<p>Welcome, {{ user.name }}!</p>
<p>Price: {{ currency(product.price) }}</p>
```

### Local Variables
```html
@set welcomeMessage = "Hello, World!" @endset
<p>{{ welcomeMessage }}</p>
```

### Conditionals
```html
@if user.isAdmin
  <div class="admin-panel">
    <button>Edit</button>
    <button>Delete</button>
  </div>
@elseif user.isEditor
  <button>Edit</button>
@else
  <p>Regular user</p>
@endif
```

### Loops
```html
<!-- Array iteration -->
@for product in products
  <div class="product">
    <h3>{{ product.name }}</h3>
    <p>Price: {{ currency(product.price) }}</p>
  </div>
@endfor

<!-- Object iteration -->
@for [key, value] in settings
  <div class="setting">
    <span class="key">{{ key }}:</span>
    <span class="value">{{ value }}</span>
  </div>
@endfor
```

### Layout System

**Layout (layouts/default.html):**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ title }} - My App</title>
</head>
<body>
    <header>
        <nav>...</nav>
    </header>
    
    <main>
        @yield("content")
    </main>
    
    <footer>
        @yield("footer")
    </footer>
</body>
</html>
```

**Page (views/products.html):**
```html
@layout("default", { title: "Products" })

@block("content")
  <h1>Our Products</h1>
  
  @for product in products
    @component("product-card", product)
  @endfor
@endblock

@block("footer")
  <p>Contact us for more information!</p>
@endblock
```

### Components

**Component (components/product-card.html):**
```html
<div class="card">
  <h3>{{ name }}</h3>
  <p class="price">{{ currency(price) }}</p>
  <button>Add to Cart</button>
</div>
```

**Usage:**
```html
@component("product-card", { 
  name: "Premium Widget", 
  price: 99.99 
})
```

### Imports
```html
@import("shared/header", { title: "Page Title" })

<div class="content">
  <!-- page content -->
</div>

@import("shared/footer")
```

### Comments
```html
## This is a single-line comment

##
  This is a multi-line comment
  that won't appear in the output
##
```

---

## Advanced Plugin Usage

### Complex Conditionals with Plugins

```typescript
// Register plugins
engine.registerPlugin("equals", (a: any, b: any) => a === b);
engine.registerPlugin("greaterThan", (a: number, b: number) => a > b);
engine.registerPlugin("and", (...args: boolean[]) => args.every(Boolean));
```

```html
@if and(equals(user.role, "admin"), greaterThan(user.experience, 2))
  <div class="advanced-controls">
    <button>Advanced Settings</button>
    <button>Export Data</button>
  </div>
@endif
```

### Plugin Chains
```html
<p>{{ uppercase(trim(user.name)) }}</p>
<p>{{ currency(calculateDiscount(product.price, user.discount)) }}</p>
```

### Unescaped Output
```html
<div>
  {{ raw(htmlContent) }}
</div>
```

---

## File Structure Examples

### Standard Structure
```
src/
  views/
    home/
      page.html
    products/
      page.html
  layouts/
    default.html
    admin.html
  components/
    header.html
    product-card.html
```

### Modular Structure
```
modules/
  users/
    pages/
      profile/
        page.html
      settings/
        page.html
  products/
    pages/
      listing/
        page.html
      detail/
        page.html
resources/
  layouts/
    default.html
  components/
    navigation.html
    footer.html
```

---

## Best Practices

1. **Use layouts** for consistent page structure
2. **Create reusable components** for common UI elements
3. **Register plugins** for data transformation logic
4. **Use the modular structure** for large applications
5. **Keep templates focused** on presentation logic

The native Harpia template engine provides a clean, intuitive syntax while maintaining powerful features for building dynamic web applications.