import "dotenv/config";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { createApp } from "./app.js";
import { connectDB } from "./repository/db/db_connection.js";

const PORT = process.env.SERVER_PORT || 3001;

// Connect to the database
await connectDB();

const httpServer = http.createServer();

const io = new SocketIOServer(httpServer, {
  cors: { origin: process.env.CLIENT_ORIGIN, credentials: true },
});

io.on("connection", (socket) => {
  socket.on("page:join", (pageId) => {
    socket.join(`page:${pageId}`);
  });
  socket.on("page:leave", (pageId) => {
    socket.leave(`page:${pageId}`);
  });
});

const app = createApp(io);
httpServer.on("request", app);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
