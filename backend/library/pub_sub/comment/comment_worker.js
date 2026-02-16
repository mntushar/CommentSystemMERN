import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { rabbitmqConnection } from "../../../repository/db/rabbitmq_connection.js";
import { logger } from "../../logger.js";
import { exchange, exchangeType } from "./publisher.js";

export const notification_type = "comment-notification";
export const content_type = "commnet";
export const x_match = "all";

function configEnv() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  dotenv.config({ path: path.resolve(__dirname, "../../.env") });
}

export const commentWorkerNotifications = async () => {
  try {
    configEnv();

    const connection = await rabbitmqConnection();

    const channel = await connection.createChannel();

    await channel.assertExchange(exchange, exchangeType, { durable: true });

    const q = await channel.assertQueue("", { exclusive: true });
    logger.info("Waiting for live stream notifications");

    await channel.bindQueue(q.queue, exchange, "", {
      "x-match": x_match,
      "notification-type": notification_type,
      "content-type": content_type,
    });

    channel.consume(q.queue, async (msg) => {
      try {
        if (!msg) throw new Error("Message is empty");

        const message = JSON.parse(msg.content.toString());
        const response = await fetch(
          `${process.env.SERVER_ORIGIN}/api/comments/refresh`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(message),
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        channel.ack(msg);
      } catch (error) {
        logger.error(error);
        channel.nack(msg, false, false);
      }
    });
  } catch (error) {
    logger.error(error);
  }
};
