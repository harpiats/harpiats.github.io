---
title: Server
description: Learn how the server is configured in Harpia.
---

A Harpia application starts with the `app.listen()` method, which accepts a configuration object of type `ServerOptions`.
This object defines how the HTTP and WebSocket servers behave, including port, host, TLS settings, and connection performance options.

#### Example

```typescript
import harpia from "harpia";

const app = harpia();

app.listen({
  port: 3000,
  development: true,
  reusePort: true,
  hostname: "localhost",
}, () => console.log("Server is running at http://localhost:3000/"));
```

---

### `ServerOptions` Reference

| Property                         | Type                      | Description                                                                                                                                     |
| -------------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **`port`**                       | `number` *(optional but required if `unix` is not set)* | The TCP port the server will listen on.                                                                           |
| **`development`**                | `boolean` *(optional)*    | Enables development mode, which may include detailed error messages, automatic restarts, and verbose logging.                                   |
| **`hostname`**                   | `string` *(optional)*     | The hostname or IP address where the server should bind. Defaults to `"0.0.0.0"` (all interfaces).                                              |
| **`tls`**                        | `TLSOptions` *(optional)* | Enables HTTPS by providing TLS/SSL configuration (e.g., `cert`, `key`). When present, the server will start over HTTPS instead of HTTP.         |
| **`unix`**                       | `string` *(optional but required if `port` is not set)* | Path to a Unix domain socket file. If specified, the server will listen on this socket instead of a TCP port.     |
| **`reusePort`**                  | `boolean` *(optional)*    | When `true`, allows multiple processes to listen on the same port. Useful for load balancing across workers.                                    |
| **`maxRequestBodySize`**         | `number` *(optional)*     | Maximum size (in bytes) of an incoming HTTP request body. Requests exceeding this limit will be rejected.                                       |
| **`ws`**                         | `object` *(optional)*     | Defines advanced options for WebSocket behavior and resource limits |

---

#### WebSocket Configuration (`ServerOptions.ws`)

The `ws` property defines advanced options for WebSocket behavior and resource limits.

| Property                           | Type                   | Description                                                                                                                |
| ---------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **`maxPayloadLength`**             | `number` *(optional)*  | Maximum size (in bytes) allowed for an incoming WebSocket message. Messages exceeding this limit will be dropped.          |
| **`idleTimeout`**                  | `number` *(optional)*  | Time in seconds a WebSocket connection can stay idle before being automatically closed.                                    |
| **`backpressureLimit`**            | `number` *(optional)*  | The maximum amount of unsent data (in bytes) a WebSocket can buffer before triggering backpressure handling.               |
| **`closeOnBackpressureLimit`**     | `boolean` *(optional)* | When `true`, the server will automatically close connections that exceed the backpressure limit.                           |
| **`sendPings`**                    | `boolean` *(optional)* | When `true`, the server will automatically send periodic ping frames to connected clients to detect broken connections.    |
| **`publishToSelf`**                | `boolean` *(optional)* | Determines whether messages published to a channel are also delivered to the sender. Useful for broadcast implementations. |
| **`perMessageDeflate`**            | `object` *(optional)*  | Controls compression for WebSocket messages using the `permessage-deflate` extension.                                      |
| **`perMessageDeflate.compress`**   | `boolean` *(optional)* | Enables compression for outgoing WebSocket messages.                                                                       |
| **`perMessageDeflate.decompress`** | `boolean` *(optional)* | Enables decompression for incoming WebSocket messages.                                                                     |

---

#### Notes

* If both `port` and `unix` are provided, the server will prefer the **Unix socket**.
* WebSocket options (`ws`) apply globally to all routes using `app.ws()` or `router.ws()`.
* TLS options must include valid certificate and private key paths for secure HTTPS/WebSocket connections.
* `reusePort` is typically used in production setups with multiple workers or clustered processes.