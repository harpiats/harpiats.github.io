---
title: WebSocket
description: A guide in my new Starlight docs site.
---

You can define a route and a custom data for each WebSocket connection and implement handlers for events like connection opening, message reception, connection closing, and errors.

You can define **WebSocket routes** that handle events for real-time connections.
Each connection creates its own `ServerWebSocket` instance, which can hold **custom connection data** using the `ws.data` property.

You can create WebSocket routes using either the **application instance (`app`)** or a **router instance (`Router`)**:

```typescript
import { Router } from "harpia";

const routes = Router();

routes.ws("/chat", { /** handlers */ });
```

or

```typescript
import harpia from "harpia";

const app = harpia();

app.ws("/chat", { /** handlers */ });
```

---

#### Supported Handlers

| Handler                       | Description                                                                                                             |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **`open(ws)`**                | Called when a new WebSocket connection is successfully opened.                                                          |
| **`message(ws, message)`**    | Called whenever a message is received from the client. The `message` can be a `string`, `ArrayBuffer`, or `Uint8Array`. |
| **`close(ws, code, reason)`** | Called when the connection is closed. Receives the close code and an optional reason message.                           |
| **`drain(ws)`**               | Called when the socket is ready to receive more data (after backpressure is relieved).                                  |
| **`error(ws, error)`**        | Called when an error occurs on the WebSocket connection (e.g., failure to send data).                                   |

---

#### Example with Custom Connection Data

You can define a custom data type for each WebSocket connection using `ws.data`.
This is useful for storing user info, session data, or connection-specific context.

```typescript
// Define a custom type for WebSocket connection data
type CustomWebSocketData = {
  userId: string;
  username: string;
  sessionId: string;
};

// Create a WebSocket route for the chat
app.ws<CustomWebSocketData>("/chat", {
  // Called when a new WebSocket connection is opened
  open(ws) {
    const data = ws.data;

    console.log("New WebSocket connection opened on /chat");

    // Set custom data for this connection
    data.userId = "123";
    data.username = "Alice";
    data.sessionId = "abc";

    ws.send(`Welcome to the chat, ${data.username}!`);
  },

  // Called when a message is received from the client
  message(ws, message) {
    const data = ws.data;
    console.log(`Message received from ${data.username}: ${message}`);
  },

  // Called when the WebSocket connection is closed
  close(ws, code, reason) {
    const data = ws.data;
    console.log(`Connection closed (${code}) by ${data.username}: ${reason}`);
  },

  // Called when the socket is ready to send more data
  drain(ws) {
    const data = ws.data;
    console.log(`Socket for ${data.username} is ready to send data`);
  },

  // Called when an error occurs on the WebSocket connection
  error(ws, error) {
    const data = ws.data;
    console.error(`Error on ${data.username}'s connection:`, error);
  },
});
```

#### Key Notes

* `ws.data` is **persistent** for the entire lifetime of a connection — each connected client has its own data object.
* You can **send messages** with `ws.send("text")` or send binary data (`Uint8Array`).
* To **broadcast messages to all connected clients**, keep a global list of open connections and iterate through them.
* The `error` handler is optional but highly recommended in production environments.
* Harpia provides native WebSocket integration — no additional libraries like `ws` or `socket.io` are required for basic functionality.