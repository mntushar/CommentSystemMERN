import "dotenv/config";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { createApp } from "./app.js";
import { registerSocketHandlers } from "./library/realtime/register_socket_handlers.js";
import { connectDB } from "./repository/db/db_connection.js";
import { connectRedis } from "./repository/db/redis_om_connection.js";

const PORT = process.env.SERVER_PORT || 3001;

// Connect to the database
await connectDB();
await connectRedis();

const app = createApp();

const httpServer = http.createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: { origin: process.env.CLIENT_ORIGIN, credentials: true },
});

registerSocketHandlers(io);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
