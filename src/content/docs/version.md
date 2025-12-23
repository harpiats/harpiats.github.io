---
title: Version
description: Track the version history of the Harpia Framework modules, including core updates and the fullstack application scaffold.
---

# Harpia Framework Versions

This page lists the current and historical versions of Harpia's core and fullstack modules. Each version includes the release date for reference.

| Module          | Version           | Release Date   | Notes                                                          |
|-----------------|-------------------|----------------|----------------------------------------------------------------|
| Core (harpia)   | `v1.0.0-beta.19`  | 2025-11-19     | Removes the mandatory minification from the render method and allows chaining. |
| App (fullstack) | `v0.1.0-beta.12`  | 2025-12-22     | Upgrade prisma version and fix integration.                    |

> The fullstack App version is used when scaffolding new projects via `bun create harpia-app`.

---

## Versioning Strategy

- **Core** is versioned independently and published to [npm](https://www.npmjs.com/package/harpiats).
- **App** is the fullstack toolkit, versioned with Git tags in its own repository.

---

## Changelog

For details on what changed in each version, check the release notes in the corresponding GitHub repositories:

- [Harpia Core Releases](https://github.com/harpiats/core/releases)
- [Harpia App Releases](https://github.com/harpiats/app/releases)
