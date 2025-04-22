---
title: Upload
description: A guide in my new Starlight docs site.
---

The **Upload** module provides secure file upload handling with configurable validation for both single and multiple file uploads.

## Configuration

### Basic Setup
```typescript
import { Upload } from "harpiats/upload";

const upload = new Upload({
  fieldName: "file",       // Form field name for uploads
  path: "uploads",         // Storage directory
  prefix: "user",          // Optional filename prefix
  fileName: "custom-name", // Optional custom filename
  options: {
    maxSize: 5 * 1024 * 1024,     // 5MB default
    allowedExtensions: [".jpg", ".png"],
    allowedTypes: ["image/jpeg", "image/png"]
  }
});
```

### Configuration Options
| Option         | Type       | Default       | Description                          |
|----------------|------------|---------------|--------------------------------------|
| `fieldName`    | `string`   | `"file"`      | Form field name for file upload      |
| `path`         | `string`   | `"uploads"`   | Directory to save uploaded files     |
| `prefix`       | `string`   | `undefined`   | Prefix for uploaded filenames        |
| `fileName`     | `string`   | `undefined`   | Custom filename (without extension)  |
| `options`      | `object`   | See below     | Validation options                   |

**Validation Options:**
- `maxSize`: Maximum file size in bytes (default: 5MB)
- `allowedExtensions`: Array of permitted file extensions
- `allowedTypes`: Array of permitted MIME types

## Usage

### Single File Upload
```typescript
app.post("/avatar", upload.single, async (req, res) => {
  // File is automatically saved to configured path
  res.json({ message: "File uploaded successfully" });
});
```

### Multiple File Upload
```typescript
app.post("/gallery", upload.multiple, async (req, res) => {
  // All valid files are saved automatically
  res.json({ message: "Files processed" });
});
```

## File Naming

The module generates filenames following these rules:
1. If `fileName` is provided: `[prefix]-[fileName].[ext]`
2. Otherwise: `[prefix]-[originalName].[ext]`

Example with `prefix: "user"` and original file `photo.jpg`:
- `user-photo.jpg` (no custom fileName)
- `user-profile.jpg` (with `fileName: "profile"`)

## Validation

### Error Handling
The middleware automatically validates files against:
- Size limits
- File extensions
- MIME types

Invalid files trigger 400 responses with detailed error messages:
```json
{
  "message": "Some files failed to process",
  "errors": [
    {
      "fileName": "document.pdf",
      "message": "The file has a disallowed extension. Allowed extensions: .jpg, .png"
    }
  ]
}
```

### Custom Validation
For additional validation, access the file in your route handler:
```typescript
app.post("/upload", upload.single, async (req, res) => {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  
  // Custom validation logic
  if (file.name.includes("admin")) {
    fs.unlinkSync(path.join(upload.path, file.name));
    return res.status(403).json({ error: "Invalid filename" });
  }
  
  res.json({ success: true });
});
```

## API Reference

### Upload Class
`new Upload(options?: UploadConstructor)`

**Methods:**
- `.single`: Middleware for single file upload
- `.multiple`: Middleware for multiple file upload

**Internal Methods:**
- `fileChecker`: Validates files against configuration
- `checkMaxSize`: Size validation
- `checkExtensions`: Extension validation
- `checkTypes`: MIME type validation

## Best Practices

1. **Security Recommendations**:
   ```typescript
   new Upload({
     options: {
       allowedTypes: ["image/jpeg", "image/png"], // Whitelist only safe types
       maxSize: 2 * 1024 * 1024 // Limit to 2MB for images
     }
   });
   ```

2. **Production Setup**:
   - Store files outside application directory
   - Use random filenames for security
   ```typescript
   fileName: crypto.randomUUID() // Generate random filenames
   ```

3. **Error Recovery**:
   ```typescript
   app.use((err, req, res, next) => {
     if (err.code === "LIMIT_FILE_SIZE") {
       res.status(413).json({ error: "File too large" });
     }
     // Handle other errors
   });
   ```