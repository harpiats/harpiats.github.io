---
title: Installation
description: Create a new Harpia project with custom configurations
---

### Prerequisites
- [Bun](https://bun.sh) v1.2.0 or later
```bash
bun --version  # Verify your version
```

### Basic Usage
Create a new project (interactive mode):
```bash
bun create harpia-app my-project
# or
bunx create-harpia-app my-project
```

## Advanced Options

### Project Type Selection
Choose during setup or specify directly:

```bash
# API-only project
bun create harpia-app my-api --api

# Fullstack project
bun create harpia-app my-app --fullstack
```

### Frontend Options (for fullstack projects)
Add flags to skip interactive prompts:

```bash
# With Tailwind + HTMX
bun create harpia-app my-app --fullstack --tailwind --htmx

# With Alpine.js
bun create harpia-app my-app --fullstack --alpine

# All frontend options
bun create harpia-app my-app --fullstack --tailwind --alpine --htmx
```

### Available Flags
| Flag           | Description                          | Valid With       |
|----------------|--------------------------------------|------------------|
| `--api`        | Creates API-only project             |                  |
| `--fullstack`  | Creates fullstack project            |                  |
| `--tailwind`   | Adds Tailwind CSS                    | `--fullstack`    |
| `--alpine`     | Adds Alpine.js                       | `--fullstack`    |
| `--htmx`       | Adds HTMX                            | `--fullstack`    |

## After Creation
```bash
cd my-project
bun dev
```

Your app will run at [http://localhost:3000](http://localhost:3000)
