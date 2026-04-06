import { logger } from "../logger.js";
import { commentWorkerNotifications } from "./comment/comment_worker.js";

logger.info("RabbitMq worker process starting...");

await commentWorkerNotifications();

logger.info("RabbitMq all workers loaded");