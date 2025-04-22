---
title: WebSocket
description: A guide in my new Starlight docs site.
---

The **WebSocket** implementation provides real-time bidirectional communication with support for typed connection data and event handlers.

## Basic Setup

### Creating a WebSocket Route
```typescript
type ConnectionData = {
  userId: string;
  username: string;
  sessionId: string;
};

const app = harpia();
app.ws<ConnectionData>("/chat", {
  open(ws) {
    // Connection established
    ws.data.userId = "123"; // Set custom data
    ws.send("Welcome to the chat!");
  },
  
  message(ws, message) {
    // Handle incoming messages
    console.log(`Message from ${ws.data.username}:`, message);
  },
  
  close(ws) {
    // Connection closed
    console.log(`${ws.data.username} disconnected`);
  },
  
  error(ws, error) {
    // Handle errors
    console.error("WebSocket error:", error);
  }
});
```

## Connection Management

### Custom Connection Data
Define typed data for each connection:
```typescript
type GameData = {
  playerId: string;
  gameId: string;
  score: number;
};

app.ws<GameData>("/game", {
  open(ws) {
    ws.data.playerId = generateId(); // Type-safe data assignment
  }
});
```

### Broadcast Messages
```typescript
app.ws("/notifications", {
  message(ws, message) {
    // Broadcast to all connected clients
    app.websocket.connections.forEach(client => {
      if (client.readyState === 1) { // 1 = OPEN
        client.send(message);
      }
    });
  }
});
```

## Event Handlers

| Handler    | Description                              | Parameters                          |
|------------|------------------------------------------|-------------------------------------|
| `open`     | New connection established               | `ws: ServerWebSocket<YourDataType>` |
| `message`  | Message received from client             | `ws`, `message: string \| Buffer`   |
| `close`    | Connection closed                       | `ws`, `code: number`, `reason: string` |
| `error`    | Connection error occurred               | `ws`, `error: Error`               |
| `drain`    | Send buffer is empty (backpressure)     | `ws`                               |

## Advanced Features

### Dynamic Routes
```typescript
app.ws("/room/:roomId", {
  open(ws) {
    const roomId = new URL(ws.data.url).pathname.split("/")[2];
    ws.data.roomId = roomId; // Store dynamic parameter
  }
});
```

### Secure Connections
```typescript
app.listen({
  port: 3000,
  tls: {
    key: Bun.file("/path/to/key.pem"),
    cert: Bun.file("/path/to/cert.pem")
  }
});
```

## API Reference

### `app.ws<T>()`
`ws<T>(path: string, handlers: WebSocketHandlers<T>): void`

**Type Parameters:**
- `T`: Type for connection-specific data

**Parameters:**
- `path`: WebSocket endpoint path
- `handlers`: Object containing event handlers

### Connection Properties
Each `ws` parameter in handlers provides:
- `data`: Your custom typed connection data
- `readyState`: Connection status (0-3)
- `send()`: Method to send messages
- `close()`: Method to close connection
- `publish()`: Method to publish to topics (if using pub/sub)

## Best Practices

1. **Connection Validation**
```typescript
app.ws("/secure", {
  open(ws) {
    if (!isValidToken(ws.data.token)) {
      ws.close(1008, "Invalid token");
    }
  }
});
```

2. **Error Handling**
```typescript
app.ws("/reliable", {
  message(ws, message) {
    try {
      // Process message
    } catch (error) {
      ws.send("Error processing message");
      ws.close(1011, "Processing error");
    }
  }
});
```

3. **Performance Considerations**
```typescript
app.ws("/high-volume", {
  drain(ws) {
    // Handle backpressure when send buffer is full
    console.log("Client receive buffer full");
  }
});
```