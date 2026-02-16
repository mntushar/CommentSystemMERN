import { logger } from "../logger.js";
import { runCommentWorker } from "./comment/comment_worker.js";

logger.info("Worker process starting...");

await runCommentWorker();

logger.info("All workers loaded");