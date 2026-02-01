import { eventBus } from "./eventBus.js";

export function commentSocketHandlers(io) {
  io.on("connection", (socket) => {
    socket.on("page:join", (pageId) => {
      const room = `page:${pageId}`;
      socket.join(room);
    });

    socket.on("page:leave", (pageId) => {
      const room = `page:${pageId}`;
      socket.leave(room);
    });
  });

  eventBus.on("comment.created", (comment) => {
    io.to(`page:${comment.pageId}`).emit("comment:created", comment);
  });

  eventBus.on("comment.updated", (comment) => {
    io.to(`page:${comment.pageId}`).emit("comment:updated", comment);
  });

  eventBus.on("comment.deleted", ({ id, pageId }) => {
    io.to(`page:${pageId}`).emit("comment:deleted", { _id: id });
  });

  eventBus.on("comment.reaction", ({ comment }) => {
    io.to(`page:${comment.pageId}`).emit("comment:reaction", comment);
  });
}
