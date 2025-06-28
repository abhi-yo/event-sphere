# Event Sphere - Real-time Chat System Documentation

Event Sphere is an open-source project aimed at helping users find and share events in their immediate vicinity. This application allows for the discovery and creation of highly localized events, fostering community engagement and local activities.

## Chat System Architecture

This document explains how real-time chat functionality is implemented in the Event Sphere application using Redis, WebSockets, and Socket.IO.

### Technology Stack

- **Redis**: In-memory data store used for message persistence and pub/sub capabilities
- **Socket.IO**: Real-time bidirectional communication library
- **Next.js API Routes**: Backend endpoints for WebSocket connections and message retrieval
- **React Context**: Frontend state management for socket connections

### System Overview

```
┌─────────────┐     WebSocket      ┌───────────┐     ┌───────────┐
│ React Client │<------------------>│ Socket.IO │<---->│   Redis   │
│  Components  │      (ws://)      │  Server   │     │ Data Store │
└─────────────┘                    └───────────┘     └───────────┘
```

The chat system allows users to:

- Join event-specific chat rooms
- Send and receive real-time messages
- See messages from other participants instantly
- Access message history when joining a chat

## Implementation Details

### 1. Redis Configuration & Usage

Redis serves as the persistence layer for chat messages with an automatic expiration system:

- **Connection**: Established using `ioredis` client library
- **Message Storage**: Uses Redis Lists (LPUSH) for efficient message queuing
- **Key Structure**: Messages are stored using `event:{eventId}:messages` pattern
- **TTL (Time-To-Live)**: Messages expire after 30 seconds (configurable)
- **Diagnostics**: Includes Redis connection monitoring tools

```typescript
// Message storage in Redis
await redis.lpush(redisKey, JSON.stringify(message));
await redis.expire(redisKey, 30); // Set expiry to 30 seconds
```

### 2. Socket.IO Integration

Socket.IO provides real-time communication between clients and server:

- **Server Setup**: Initialized in a Next.js API route (`pages/api/socketio.ts`)
- **Connection Management**: Handles client connections, joins, and disconnections
- **Room-based Communication**: Uses Socket.IO rooms for event-specific chats
- **Message Broadcasting**: Messages are broadcast to all clients in the same event room

```typescript
// Socket.IO server events
io.on("connection", (socket) => {
  socket.on("join", (eventId: string) => {
    socket.join(eventId);
  });

  socket.on("message", async ({ eventId, message }) => {
    // Store in Redis then broadcast to room
    await redis.lpush(`event:${eventId}:messages`, JSON.stringify(message));
    io.to(eventId).emit("message", message);
  });
});
```

### 3. Frontend Integration

The client-side implementation uses React Context for Socket.IO management:

- **SocketContext**: Provides socket connection state to all components
- **EventChat Component**: UI for chat functionality with real-time updates
- **Message Expiration**: Client-side filtering ensures messages older than 30 seconds are hidden
- **Optimistic UI**: Messages appear immediately for the sender before server confirmation

```typescript
// React hook for socket access
export const useSocket = () => useContext(SocketContext);

// Listening for messages in the EventChat component
useEffect(() => {
  if (socket && isConnected) {
    socket.emit("join", eventId);
    socket.on("message", handleMessage);
    return () => {
      socket.off("message", handleMessage);
      socket.emit("leave", eventId);
    };
  }
}, [socket, isConnected, eventId]);
```

### 4. Message Lifecycle

1. **Creation**: User sends a message through the UI
2. **Transmission**: Message is sent to server via Socket.IO
3. **Storage**: Server stores message in Redis with 30-second TTL
4. **Broadcasting**: Server broadcasts message to all clients in the event room
5. **Reception**: Other clients receive and display the message
6. **Expiration**: Messages automatically expire after 30 seconds
7. **Cleanup**: Both server and client enforce message expiration

## Advanced Features

### Message Expiration System

Messages in Event Sphere are ephemeral by design, automatically expiring after 30 seconds:

- **Server-side TTL**: Redis keys expire after 30 seconds
- **Client-side filtering**: UI filters out messages older than 30 seconds
- **Diagnostics**: Server logs message counts at 10-second intervals

### Connection Diagnostics

The system includes diagnostic tools to monitor Redis performance:

- **Latency Measurement**: Tracks ping, read, and write operations
- **Memory Usage**: Reports Redis memory consumption
- **Client Connections**: Monitors number of connected clients
- **Pipeline Operations**: Tests batch operation performance

## Usage Example

```jsx
// Example of using the chat component in a page
import EventChat from "../components/EventChat";

function EventPage({ eventId }) {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setChatOpen(true)}>Open Chat</button>
      <EventChat
        eventId={eventId}
        isOpen={chatOpen}
        onOpenChange={setChatOpen}
      />
    </div>
  );
}
```

## Future Improvements

- Implement user authentication for chat participants
- Add message read receipts
- Support media attachments
- Increase message persistence time based on event importance
- Add typing indicators
- Implement message reactions

---

## Getting Started

To set up the chat system locally:

1. Configure Redis:

   ```
   REDIS_URL=redis://localhost:6379
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
