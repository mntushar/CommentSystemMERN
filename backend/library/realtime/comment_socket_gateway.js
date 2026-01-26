import { eventBus } from "./eventBus.js";

export function commentSocketHandlers(io) {
  eventBus.on("comment.created", (comment) => {
    io.to(`page:${comment.pageId}`).emit("comment:created", comment);
  });

  eventBus.on("comment.updated", (comment) => {
    io.to(`page:${comment.pageId}`).emit("comment:updated", comment);
  });

  eventBus.on("comment.deleted", ({ id, pageId }) => {
    io.to(`page:${pageId}`).emit("comment:deleted", { id });
  });

  eventBus.on("comment.reaction", ({ comment }) => {
    io.to(`page:${comment.pageId}`).emit("comment:reaction", comment);
  });
}
