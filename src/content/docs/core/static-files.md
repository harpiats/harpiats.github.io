---
title: Static Files
description: How to serve static files in Harpia.
---

Harpia provides a built-in method to serve static files like images, stylesheets, JavaScript, and other assets.

---

## Serving Static Files

To serve static assets, simply use the `app.static()` method and point it to the directory containing your files.

```ts
const app = harpia();

app.static("public");
```

This tells Harpia to serve all files in the `public` folder as static assets.

For example:

```
project/
├─ public/
│  ├─ logo.png
│  └─ styles.css
├─ index.ts
```

With this setup, the following files become accessible from the browser:

- `/logo.png`
- `/styles.css`

---

## Advanced Usage

You can register multiple static directories by calling `app.static()` multiple times:

```ts
app.static("public");
app.static("assets");
```

In this case, files will be served from both `public` and `assets`.

---

## Notes

- Files are served relative to the root path (`/`) unless configured otherwise.
- The static middleware resolves files based on the file system path, so be mindful of naming conflicts across folders.
- This feature is ideal for front-end resources that don’t require server-side processing.

---