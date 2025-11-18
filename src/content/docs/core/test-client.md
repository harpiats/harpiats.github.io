---
title: Test Client
description: A guide about the test client utility class.
---

The **Test Client** is a comprehensive testing utility designed to simplify HTTP request testing in your application. It supports all standard HTTP methods, various request body formats, headers, query parameters, and file uploads.

## Configuration
```typescript
import { TestClient } from "harpiats";
import { app } from "start/server";
```

## Basic Usage
```typescript
const client = new TestClient(app);
const response = await client.get("/endpoint").execute();
```

## HTTP Methods
| Method       | Description                  | Example                      |
|--------------|------------------------------|------------------------------|
| `.get()`     | Send GET request             | `.get("/users")`             |
| `.post()`    | Send POST request            | `.post("/users")`            |
| `.put()`     | Send PUT request             | `.put("/users/1")`           |
| `.delete()`  | Send DELETE request          | `.delete("/users/1")`        |
| `.patch()`   | Send PATCH request           | `.patch("/users/1")`         |
| `.options()` | Send OPTIONS request         | `.options("/users")`         |
| `.head()`    | Send HEAD request            | `.head("/users")`            |

## Request Configuration

### Query Parameters
```typescript
.query("param", "value")
```

### Headers
```typescript
.set("Header-Name", "value")
```

## Request Body

### JSON Data
```typescript
.json({ key: "value" })
```

### Form Data
```typescript
.formData({ field: "value" })
```

### File Uploads
```typescript
// Single file
.file({ file: "path/to/file.jpg" })

// Multiple files
.files({ files: ["file1.jpg", "file2.jpg"] })
```

### Raw Data
```typescript
.send("raw data")
```

## Response Handling
The `.execute()` method returns a response object with:
- `status`: HTTP status code
- `headers`: Response headers
- Methods to parse body:
  - `.json()`
  - `.text()`
  - `.blob()`

## Error Handling
- Mixing incompatible body types (e.g., `.json()` after `.formData()`) throws an error
- Non-existent file paths throw an error
- Invalid file types throw an error

## Examples

### Basic Requests

**GET Request with Query Parameters**
```typescript
const response = await new TestClient(app)
  .get("/hello")
  .query("number", "123456")
  .execute();
```

**POST Request with JSON**
```typescript
const response = await new TestClient(app)
  .post("/users")
  .json({ name: "John" })
  .execute();
```

### File Uploads Examples

**Single File Upload**
```typescript
const response = await new TestClient(app)
  .post("/upload")
  .file({ avatar: "user.jpg" })
  .execute();
```

**Multiple Files Upload**
```typescript
const response = await new TestClient(app)
  .post("/upload")
  .files({ documents: ["doc1.pdf", "doc2.pdf"] })
  .execute();
```

### Advanced Usage

**Custom Headers**
```typescript
const response = await new TestClient(app)
  .get("/protected")
  .set("Authorization", "Bearer token123")
  .execute();
```

**Form Data with File**
```typescript
const response = await new TestClient(app)
  .post("/profile")
  .formData({ username: "john_doe" })
  .file({ avatar: "profile.jpg" })
  .execute();
```

## API Reference

### Constructor
`new TestClient(app: Application)`

### Methods
- HTTP Methods: `.get()`, `.post()`, `.put()`, `.delete()`, `.patch()`, `.options()`, `.head()`
- Configuration: `.query()`, `.set()`
- Body Methods: `.json()`, `.formData()`, `.file()`, `.files()`, `.send()`
- Execution: `.execute()`
