import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Worker } from "bullmq";
import {
  COMMENT_QUEUE_NAME,
  commentDLQ,
  commentQueueEvents,
  commentDLQEvents,
  COMMENT_DLQ_NAME,
} from "./comment_queues.js";
import { bullMqConnection } from "../../../repository/db/bullmq_connection.js";
import { CommentService } from "../../../service/comment.js";
import { logger } from "../../logger.js";
import { connectDB } from "../../../repository/db/db_connection.js";
import { connectRedis } from "../../../repository/db/redis_om_connection.js";
import { sendNotification } from "../../pub_sub/comment/publisher.js";
import {
  content_type,
  notification_type,
  x_match,
} from "../../pub_sub/comment/comment_worker.js";

export async function runCommentWorker() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

  // Connect to the database
  await connectDB();
  await connectRedis();

  const commnetService = new CommentService();

  const isFinalFailure = (job) => {
    const totalAttempts = Number(job.opts?.attempts || 1);
    const made = Number(job.attemptsMade || 0);
    return made >= totalAttempts;
  };

  const worker = new Worker(
    COMMENT_QUEUE_NAME,
    async (job) => {
      const { pageId, authorId } = job.data || {};
      if (!pageId || !authorId)
        throw new Error("pageId and authorId are required");

      const result = await commnetService.commentCaching({
        pageId,
        authorId,
      });
      return result;
    },
    {
      // @ts-ignore
      connection: bullMqConnection,
      concurrency: Number(process.env.TOTAL_WORKER),
    },
  );

  // Worker events
  worker.on("ready", () => logger.info("[worker] ready"));

  worker.on("completed", (job) => {
    logger.info(`[worker] completed jobId=${job.id} name=${job.name}`);
  });

  worker.on("failed", async (job, err) => {
    if (!job) {
      logger.error(err);
      return;
    }

    logger.error(
      `[worker] failed jobId=${job.id} attemptsMade=${job.attemptsMade} err=${err.message}`,
    );

    if (isFinalFailure(job)) {
      await commentDLQ.add(COMMENT_DLQ_NAME, {
        originalQueue: COMMENT_QUEUE_NAME,
        originalJobId: job.id,
        originalJobName: job.name,
        originalData: job.data,
        attemptsMade: job.attemptsMade,
        failedReason: job.failedReason,
        stacktrace: job.stacktrace,
        movedToDlqAt: new Date().toISOString(),
      });

      logger.info(`[dlq] moved jobId=${job.id} -> DLQ`);
    }
  });

  worker.on("error", (err) => logger.error(err));

  // QueueEvents (optional but useful)
  commentQueueEvents.on("completed", ({ jobId, returnvalue }) => {
    logger.info(`[events] completed jobId=${jobId} return=${JSON.stringify(returnvalue)}`);

    sendNotification(
      {
        "x-match": x_match,
        "notification-type": notification_type,
        "content-type": content_type,
      },
      returnvalue,
    );
  });

  commentQueueEvents.on("failed", ({ jobId, failedReason }) => {
    logger.info(`[events] failed jobId=${jobId} reason=${failedReason}`);
  });

  commentDLQEvents.on("waiting", ({ jobId }) => {
    logger.info(`[dlq-events] add dlqJobId=${jobId}`);
  });
}
