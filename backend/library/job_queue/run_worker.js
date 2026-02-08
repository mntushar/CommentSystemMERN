import { runCommentWorker } from "./comment/comment_worker.js";

console.log("Worker process starting...");

await runCommentWorker();

console.log("All workers loaded");