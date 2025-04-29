---
title: Authentication
description: A guide to enabling session-based authentication in Harpia.
---

## Generating Session Authentication

To set up session-based authentication in your Harpia application, use the following command:

```bash
bun g --config
```

This will prompt you to choose from a list of configuration generators, including session authentication. You can also skip the prompt and generate the session config directly:

```bash
bun g --config session
```

You'll be asked two questions during generation:

- **Which model contains the login information?** (e.g., `User`)  
- **Which field will be used for login?** (e.g., `email`, `username`, `document`)

After completing the prompts, Harpia will generate the following files:

- `modules/session/`
- `app/config/session.ts`
- `app/middlewares/auth.ts`

---

### How It Works

The generated middleware (`isAuthenticated`) is used to check if a user is logged in.

By default:
- **In development**, sessions are stored **in memory**.
- **In production**, sessions are stored in **Redis**.

If you accepted the default options (`User` as the model and `email` as the identifier), make sure your `schema.prisma` includes a `User` model with the following fields:

```prisma
model User {
  id       String   @id @default(uuid())
  email    String   @unique
  password String
  // other fields...
}
```

---

### Password Handling

In the file `modules/session/validations/CheckPassword.ts`, Harpia validates the password provided at login using the stored hash from the database.

Password verification is done using:

```ts
await Bun.password.verify(password, hash);
```

Make sure to hash your passwords using `Bun.password.hash(...)` when saving them to the database.

---

### Session Endpoints

Harpia provides the following authentication endpoints:

- `POST /sessions` — Log in with `email` and `password` (JSON body)
- `GET /sessions` — Retrieve the logged-in user's info
- `DELETE /sessions` — Log out and destroy the session

After login, a `session_id` is returned. If you're using Harpia as a backend for a frontend application, you need to include the cookie in the request headers like so:

```http
Cookie: session_id=cf9d5f1c-629e-4c10-8671-141fd182da3e
```

---

### Protecting Routes

To protect a route, apply the `isAuthenticated` middleware:

```ts
postRoutes.post("/", isAuthenticated, PostController.Store)
```

Only authenticated users will be allowed access to this route.

---

### Session Cookies

The session cookie is set in the session controller, specifically in `modules/session/controllers/Store.ts`. You can customize the cookie behavior there when setting the session ID:

```ts
session.setCookie(response, sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: "Strict",
  maxAge: 3600 * 8, // 8 hours
})
```

You may adjust the `maxAge`, `sameSite`, or other options depending on your application's requirements.