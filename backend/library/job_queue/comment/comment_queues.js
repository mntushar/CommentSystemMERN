import { Queue, QueueEvents } from "bullmq";
import { bullMqConnection } from "../../../repository/db/bullmq_connection.js";

export const COMMENT_QUEUE_NAME = "comment-cache";
export const COMMENT_DLQ_NAME = "comment-cache-dlq";

export const commentQueue = new Queue(COMMENT_QUEUE_NAME, {
  // @ts-ignore
  connection: bullMqConnection,
  defaultJobOptions: {
    // @ts-ignore
    attempts: process.env.JOB_FAIL_ATTEMPTS,
    // @ts-ignore
    backoff: { type: "exponential", delay: process.env.JOB_FAIL_ATTEMPTS_Delay },
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 0 },
  },
});

export const commentDLQ = new Queue(COMMENT_DLQ_NAME, {
  // @ts-ignore
  connection: bullMqConnection,
});

export const commentQueueEvents = new QueueEvents(COMMENT_QUEUE_NAME, {
  // @ts-ignore
  connection: bullMqConnection,
});

export const commentDLQEvents = new QueueEvents(COMMENT_DLQ_NAME, {
  // @ts-ignore
  connection: bullMqConnection,
});
