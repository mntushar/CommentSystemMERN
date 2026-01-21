import { commentSocketHandlers } from "./comment_socket_gateway.js";

export function registerSocketHandlers(io) {
  commentSocketHandlers(io);
}
