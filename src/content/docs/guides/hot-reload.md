---
title: Hot Reload
description: Documentation of the configuration and behavior of the hot reload system.
---

## Overview

The hot reload system monitors specific directories and file types during development. When changes are detected, connected clients are instructed to reload the page through a WebSocket channel.

## Configuration

Hot reload settings are defined in `app/config/hot-reload.ts`. The default configuration is:

```ts
import type { HotReloadInterface } from "app/lib/hot-reload";

export const HotReloadOptions: HotReloadInterface = {
  verbose: false,
  watch: ["./modules", "./public", "./resources"],
  extensions: [".css", ".html", ".js", ".ts"],
};
````

You may adjust the `watch` paths or file `extensions` to fit the structure of your application.

## Activation Conditions

The hot reload function is initialized in `start/server.ts`. It runs only when both conditions below are met:

* `ENV` is set to `development`
* `MODE` is set to `fullstack`

If either variable does not match these values, hot reload is not activated.

## Client-Side Script

A client-side script establishes a WebSocket connection to the route `/harpia/hr`. Its purpose is to trigger a page reload when changes are detected on the server.

This script is located at:

```
resources/components/hot-reload.html
```

It is included automatically in the layout, but only when the environment is `development`.

## Summary

* Hot reload monitors selected paths and file types.
* It activates only in development and fullstack mode.
* A WebSocket script, added during development, handles browser reloads.
* Configuration is fully customizable via `app/config/hot-reload.ts`.
